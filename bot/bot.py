"""TatarlargaBot — бот для изучения татарского языка.

Меню: сказки, слово дня, пословицы, викторина, уроки, игры, настройки.
Язык интерфейса: русский, английский, турецкий, финский.
Алфавит татарского текста: кириллица, латиница или оба.
Подписчикам: слово дня утром (08:00) и сказка вечером (19:00) по Казани.

Контент берётся из папок репозитория (stories, phrases, content) —
сервер сам подтягивает изменения с GitHub.

Переменные окружения (файл .env):
  BOT_TOKEN — токен бота от @BotFather
  ADMIN_ID  — ваш Telegram ID (для команды /stats)
  DATA_DIR  — где хранить базу и аудио (по умолчанию ./data)
"""
import asyncio
import csv
import datetime as dt
import hashlib
import logging
import os
import random
import sqlite3
import sys
from pathlib import Path

from aiogram import Bot, Dispatcher, F
from aiogram.exceptions import TelegramBadRequest, TelegramForbiddenError
from aiogram.filters import Command, CommandStart
from aiogram.types import (CallbackQuery, FSInputFile, InlineKeyboardButton,
                           InlineKeyboardMarkup, KeyboardButton, MenuButtonWebApp,
                           Message, ReplyKeyboardMarkup, WebAppInfo)

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "bot"))
from texts import LANGS, t  # noqa: E402
from translit import to_latin  # noqa: E402

KAZAN = dt.timezone(dt.timedelta(hours=3))
DATA = Path(os.environ.get("DATA_DIR", ROOT / "data"))
(DATA / "audio").mkdir(parents=True, exist_ok=True)
ADMIN_ID = int(os.environ.get("ADMIN_ID", "0") or 0)
START_DATE = dt.date(2026, 10, 1)
MORNING, EVENING = dt.time(8, 0), dt.time(19, 0)
GAMES_URL = "https://marat2215.github.io/tatar-skazki/games/"

log = logging.getLogger("tatarbot")

# ---------------------------------------------------------------- база данных
db = sqlite3.connect(DATA / "bot.db", check_same_thread=False)
db.executescript("""
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT,
  alpha TEXT DEFAULT 'both', sub INTEGER DEFAULT 1,
  okc INTEGER DEFAULT 0, total INTEGER DEFAULT 0, joined TEXT);
CREATE TABLE IF NOT EXISTS files(key TEXT PRIMARY KEY, file_id TEXT);
CREATE TABLE IF NOT EXISTS meta(k TEXT PRIMARY KEY, v TEXT);
""")
try:  # добавляем колонку языка в старую базу
    db.execute("ALTER TABLE users ADD COLUMN lang TEXT DEFAULT 'ru'")
    db.commit()
except sqlite3.OperationalError:
    pass

FIELDS = ["id", "alpha", "sub", "right", "total", "lang"]


def user(uid, name=""):
    row = db.execute("SELECT id,alpha,sub,okc,total,lang FROM users WHERE id=?", (uid,)).fetchone()
    if not row:
        db.execute("INSERT INTO users(id,name,joined) VALUES(?,?,?)",
                   (uid, name, dt.datetime.now(KAZAN).isoformat()))
        db.commit()
        row = (uid, "both", 1, 0, 0, "ru")
    u = dict(zip(FIELDS, row))
    u["lang"] = u["lang"] if u["lang"] in LANGS else "ru"
    return u


def set_user(uid, **kw):
    for k, v in kw.items():
        db.execute(f"UPDATE users SET {k}=? WHERE id=?", (v, uid))
    db.commit()


def meta(k, v=None):
    if v is None:
        r = db.execute("SELECT v FROM meta WHERE k=?", (k,)).fetchone()
        return r[0] if r else None
    db.execute("INSERT OR REPLACE INTO meta VALUES(?,?)", (k, v))
    db.commit()


# ---------------------------------------------------------------- контент
_cache = {}


def _load(path, parser):
    """Перечитывает файл, только если он изменился."""
    path = Path(path)
    mtime = path.stat().st_mtime if path.exists() else 0
    if path not in _cache or _cache[path][0] != mtime:
        _cache[path] = (mtime, parser(path) if mtime else [])
    return _cache[path][1]


def _csv(path):
    with open(path, encoding="utf-8") as f:
        return [r for r in csv.DictReader(f) if any(r.values())]


def stories():
    out = []
    for p in sorted((ROOT / "stories").glob("*.md")):
        lines = p.read_text(encoding="utf-8").strip().splitlines()
        out.append({"id": p.stem, "title": lines[0].lstrip("# ").strip(),
                    "body": "\n".join(lines[1:]).strip()})
    return out


def phrases():
    return _load(ROOT / "phrases" / "phrases.csv", _csv)


def proverbs():
    return _load(ROOT / "content" / "proverbs.csv", _csv)


def creatures():
    return _load(ROOT / "content" / "creatures.csv", _csv)


def lessons():
    out = {}
    for r in _load(ROOT / "content" / "lessons.csv", _csv):
        out.setdefault(r["lesson"], []).append(r)
    return list(out.items())


def tr(row, lang, base="ru"):
    """Перевод строки контента на язык пользователя (запасной вариант — русский)."""
    if lang == "ru":
        return row.get(base, "")
    key = f"{base}_{lang}" if base != "ru" else lang
    return row.get(key) or row.get(base, "")


def today_index(n):
    return (dt.datetime.now(KAZAN).date() - START_DATE).days % max(n, 1)


def show(text, alpha):
    """Татарский текст по настройке: кириллица, латиница или оба."""
    if alpha == "cyr":
        return text
    if alpha == "lat":
        return to_latin(text)
    return f"{text}\n🔤 {to_latin(text)}"


def short(text, alpha):
    """Короткое слово для кнопок и вопросов."""
    if alpha == "cyr":
        return text
    if alpha == "lat":
        return to_latin(text)
    return f"{text} ({to_latin(text)})"


# ---------------------------------------------------------------- аудио
def _make_audio(text, path, speed):
    from tts import synthesize  # тяжёлый импорт — только когда нужен
    synthesize(text, str(path), speed=speed)


async def send_voice(bot, chat_id, text, caption=None, speed=1.2, markup=None):
    """Отправляет текст голосом. Готовые файлы кэшируются в Telegram и на диске."""
    key = hashlib.sha1(f"{text}|{speed}".encode()).hexdigest()[:16]
    row = db.execute("SELECT file_id FROM files WHERE key=?", (key,)).fetchone()
    if row:
        try:
            return await bot.send_voice(chat_id, row[0], caption=caption, reply_markup=markup)
        except TelegramBadRequest:
            pass
    path = DATA / "audio" / f"{key}.ogg"
    if not path.exists():
        await bot.send_chat_action(chat_id, "record_voice")
        await asyncio.to_thread(_make_audio, text, path, speed)
    msg = await bot.send_voice(chat_id, FSInputFile(path), caption=caption, reply_markup=markup)
    db.execute("INSERT OR REPLACE INTO files VALUES(?,?)", (key, msg.voice.file_id))
    db.commit()
    return msg


# ---------------------------------------------------------------- клавиатуры
BTN = {  # кнопки меню на языке пользователя
    "story": {"ru": "🌙 Сказки", "en": "🌙 Fairy tales", "tr": "🌙 Masallar", "fi": "🌙 Sadut"},
    "word": {"ru": "☀️ Слово дня", "en": "☀️ Word of the day", "tr": "☀️ Günün kelimesi", "fi": "☀️ Päivän sana"},
    "prov": {"ru": "📜 Пословицы", "en": "📜 Proverbs", "tr": "📜 Atasözleri", "fi": "📜 Sananlaskut"},
    "quiz": {"ru": "❓ Викторина", "en": "❓ Quiz", "tr": "❓ Bilgi yarışması", "fi": "❓ Tietovisa"},
    "lesson": {"ru": "🎓 Уроки", "en": "🎓 Lessons", "tr": "🎓 Dersler", "fi": "🎓 Oppitunnit"},
    "myth": {"ru": "🐉 Мифы", "en": "🐉 Myths", "tr": "🐉 Mitler", "fi": "🐉 Myytit"},
    "set": {"ru": "⚙️ Настройки", "en": "⚙️ Settings", "tr": "⚙️ Ayarlar", "fi": "⚙️ Asetukset"},
    "games": {"ru": "🎮 Игры", "en": "🎮 Games", "tr": "🎮 Oyunlar", "fi": "🎮 Pelit"},
}
OLD_BTN = {"story": "🌙 Әкиятләр", "word": "☀️ Көн сүзе", "prov": "📜 Мәкальләр", "quiz": "❓ Викторина",
           "lesson": "🎓 Дәресләр", "myth": "🐉 Мифик затлар", "set": "⚙️ Көйләүләр"}


def b(key, lang):
    return BTN[key].get(lang) or BTN[key]["ru"]


def is_btn(key):
    """Фильтр: нажата кнопка меню на любом языке (и старые татарские подписи)."""
    return F.text.in_(set(BTN[key].values()) | {OLD_BTN.get(key, "")})


def tt1(text, alpha):
    """Татарское слово одним алфавитом (для заголовков и кнопок)."""
    return to_latin(text) if alpha == "lat" else text


def games_url(u, page=""):
    return f"{GAMES_URL}{page}?lang={u['lang']}&a={u['alpha']}"


def main_kb(u):
    game = lambda title, page: KeyboardButton(text=title, web_app=WebAppInfo(url=games_url(u, page)))  # noqa: E731
    L, A = u["lang"], u["alpha"]
    return ReplyKeyboardMarkup(resize_keyboard=True, keyboard=[
        [KeyboardButton(text=b("story", L)), KeyboardButton(text=b("word", L))],
        [KeyboardButton(text=b("prov", L)), KeyboardButton(text=b("quiz", L))],
        [KeyboardButton(text=b("lesson", L)), KeyboardButton(text=b("myth", L))],
        [KeyboardButton(text=b("set", L))],
        [game("🌲 " + tt1("Шүрәле", A), "shurale.html"), game("🥟 " + tt1("Эчпочмак", A), "echpochmak.html"),
         game("🟩 " + tt1("Сүз уены", A), "suz.html")],
    ])


def ikb(rows):
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=tx, callback_data=d) for tx, d in row] for row in rows])


async def set_menu_button(bot, u):
    """Кнопка «Уеннар» слева от поля ввода — открывает меню игр."""
    try:
        await bot.set_chat_menu_button(chat_id=u["id"], menu_button=MenuButtonWebApp(
            text=b("games", u["lang"]), web_app=WebAppInfo(url=games_url(u))))
    except Exception as e:  # noqa: BLE001
        log.warning("Кнопка меню: %s", e)


def lang_kb(prefix):
    items = list(LANGS.items())
    return ikb([[(n, f"{prefix}:{c}") for c, n in items[:2]], [(n, f"{prefix}:{c}") for c, n in items[2:]]])


def alpha_kb(lang, prefix, current=None):
    mark = lambda v: "✅ " if current == v else ""  # noqa: E731
    return ikb([[(mark("cyr") + t("cyr", lang) + " (Кк)", f"{prefix}:cyr"),
                 (mark("lat") + t("lat", lang) + " (Kk)", f"{prefix}:lat")],
                [(mark("both") + t("both", lang), f"{prefix}:both")]])


# ---------------------------------------------------------------- обработчики
dp = Dispatcher()


@dp.message(CommandStart())
async def start(m: Message):
    user(m.from_user.id, m.from_user.full_name)
    await m.answer(t("choose_lang", "ru"), reply_markup=lang_kb("sl"))


@dp.callback_query(F.data.startswith("sl:"))
async def start_lang(c: CallbackQuery):
    lang = c.data[3:]
    set_user(c.from_user.id, lang=lang)
    await c.answer()
    await c.message.answer(t("choose_alpha", lang), reply_markup=alpha_kb(lang, "sa"))


@dp.callback_query(F.data.startswith("sa:"))
async def start_alpha(c: CallbackQuery):
    set_user(c.from_user.id, alpha=c.data[3:])
    u = user(c.from_user.id)
    await c.answer()
    await set_menu_button(c.bot, u)
    await c.message.answer(t("welcome", u["lang"]), reply_markup=main_kb(u))


# --- сказки
@dp.message(is_btn("story"))
async def story_list(m: Message):
    u = user(m.from_user.id)
    rows = [[(short(s["title"], u["alpha"]), f"st:{i}")] for i, s in enumerate(stories())]
    await m.answer(t("choose_story", u["lang"]), reply_markup=ikb(rows))


async def send_story(bot, chat_id, i, u):
    st = stories()
    if not st:
        return
    s = st[i % len(st)]
    ready = ROOT / "audio" / f"{s['id']}.mp3"
    if ready.exists():
        await bot.send_audio(chat_id, FSInputFile(ready), title=s["title"],
                             performer=tt1("Татар әкиятләре", u["alpha"]), caption=t("listen", u["lang"]))
    else:
        await send_voice(bot, chat_id, f"{s['title']}\n{s['body']}", speed=1.15,
                         caption=t("listen", u["lang"]))
    text = f"🌙 {s['title']}\n\n{s['body']}"
    if u["alpha"] == "lat":
        text = to_latin(text)
    elif u["alpha"] == "both":
        text += f"\n\n— — —\n\n{to_latin(s['title'])}\n\n{to_latin(s['body'])}"
    for k in range(0, len(text), 4000):
        await bot.send_message(chat_id, text[k:k + 4000])


@dp.callback_query(F.data.startswith("st:"))
async def story_cb(c: CallbackQuery):
    await c.answer()
    await send_story(c.bot, c.from_user.id, int(c.data[3:]), user(c.from_user.id))


# --- слово дня
async def send_word(bot, chat_id, u, i=None):
    ph = phrases()
    if not ph:
        return
    r = ph[today_index(len(ph)) if i is None else i % len(ph)]
    lang = u["lang"]
    cap = (f"☀️ {tt1('Көн сүзе', u['alpha'])} — {t('word_title', lang)}\n\n🗣 {show(r['tt'], u['alpha'])}\n"
           f"💬 {tr(r, lang)}\n\n{t('repeat', lang)}")
    await send_voice(bot, chat_id, f"{r['tt']}\n{r['tt']}", caption=cap, speed=1.25,
                     markup=ikb([[(t("more_phrase", lang), "word:rnd")]]))


@dp.message(is_btn("word"))
async def word(m: Message):
    await send_word(m.bot, m.chat.id, user(m.from_user.id))


@dp.callback_query(F.data == "word:rnd")
async def word_rnd(c: CallbackQuery):
    await c.answer()
    await send_word(c.bot, c.from_user.id, user(c.from_user.id), random.randrange(10 ** 6))


# --- пословицы
@dp.message(is_btn("prov"))
@dp.callback_query(F.data == "prov")
async def proverb(ev):
    msg = ev.message if isinstance(ev, CallbackQuery) else ev
    if isinstance(ev, CallbackQuery):
        await ev.answer()
    pr = proverbs()
    if not pr:
        return
    r = random.choice(pr)
    u = user(ev.from_user.id)
    lang = u["lang"]
    cap = (f"📜 {tt1('Мәкаль', u['alpha'])} — {t('proverb', lang)}\n\n{show(r['tt'], u['alpha'])}\n\n"
           f"💬 {tr(r, lang)}\n💡 {tr(r, lang, 'meaning')}")
    await send_voice(msg.bot, msg.chat.id, r["tt"], caption=cap, speed=1.2,
                     markup=ikb([[(t("more_proverb", lang), "prov")]]))


# --- мифические существа
def myth_kb(u):
    cr = creatures()
    btn = [(f"{r['emoji']} {short(r['tt'], 'lat' if u['alpha'] == 'lat' else 'cyr')}", f"my:{i}")
           for i, r in enumerate(cr)]
    return ikb([btn[i:i + 2] for i in range(0, len(btn), 2)])


@dp.message(is_btn("myth"))
@dp.callback_query(F.data == "myl")
async def myth_list(ev):
    msg = ev.message if isinstance(ev, CallbackQuery) else ev
    if isinstance(ev, CallbackQuery):
        await ev.answer()
    u = user(ev.from_user.id)
    await msg.answer(t("myth_list", u["lang"]), reply_markup=myth_kb(u))


@dp.callback_query(F.data.startswith("my:"))
async def myth(c: CallbackQuery):
    await c.answer()
    cr = creatures()
    i = int(c.data[3:])
    if i >= len(cr):
        return
    r = cr[i]
    u = user(c.from_user.id)
    lang = u["lang"]
    cap = f"{r['emoji']} {short(r['tt'], u['alpha'])}\n\n🗣 {show(r['tt_text'], u['alpha'])}\n\n{tr(r, lang)}"
    nxt = (i + 1) % len(cr)
    await send_voice(c.bot, c.from_user.id, r["tt_text"], caption=cap, speed=1.15,
                     markup=ikb([[(t("myth_next", lang), f"my:{nxt}"), (t("myth_all", lang), "myl")]]))


# --- викторина
def quiz_rows():
    return [r for r in phrases() if r.get("quiz_word")]


@dp.message(is_btn("quiz"))
@dp.callback_query(F.data == "quiz:next")
async def quiz(ev):
    msg = ev.message if isinstance(ev, CallbackQuery) else ev
    if isinstance(ev, CallbackQuery):
        await ev.answer()
    u = user(ev.from_user.id)
    rows = quiz_rows()
    i = random.randrange(len(rows))
    right = tr(rows[i], u["lang"], "right")
    others = list({tr(r, u["lang"], "right") for r in rows} - {right})
    opts = random.sample(others, 2) + [right]
    random.shuffle(opts)
    kb = [[(o, f"q:{i}:{int(o == right)}")] for o in opts]
    await msg.answer(t("quiz_q", u["lang"], w=short(rows[i]["quiz_word"], u["alpha"])), reply_markup=ikb(kb))


@dp.callback_query(F.data.startswith("q:"))
async def quiz_answer(c: CallbackQuery):
    _, i, ok = c.data.split(":")
    u = user(c.from_user.id)
    lang = u["lang"]
    rows = quiz_rows()
    r = rows[int(i) % len(rows)]
    right_txt = tr(r, lang, "right")
    right, total = u["right"] + (ok == "1"), u["total"] + 1
    set_user(u["id"], okc=right, total=total)
    mark = t("correct", lang) if ok == "1" else t("wrong", lang, a=right_txt)
    await c.answer()
    try:
        await c.message.edit_reply_markup(reply_markup=None)
    except TelegramBadRequest:
        pass
    await c.message.answer(f"{mark}\n{short(r['quiz_word'], u['alpha'])} — {right_txt}\n\n"
                           f"{t('score', lang, r=right, t=total)}",
                           reply_markup=ikb([[(t("next_q", lang), "quiz:next")]]))


# --- уроки
tests = {}  # uid -> {"lesson": n, "q": k, "ok": m}


@dp.message(is_btn("lesson"))
async def lesson_list(m: Message, uid=None):
    u = user(uid or m.from_user.id)
    rows = [[(f"{n + 1}. {short(name, u['alpha'])} — {items[0]['title_' + u['lang']]}", f"ls:{n}")]
            for n, (name, items) in enumerate(lessons())]
    await m.answer(t("choose_lesson", u["lang"]), reply_markup=ikb(rows))


@dp.callback_query(F.data.startswith("ls:"))
async def lesson(c: CallbackQuery):
    await c.answer()
    n = int(c.data[3:])
    name, items = lessons()[n]
    u = user(c.from_user.id)
    lang = u["lang"]
    text = (f"🎓 {t('lesson', lang)} {n + 1}. {short(name, u['alpha'])} — {items[0]['title_' + lang]}\n\n"
            + "\n\n".join(f"• {show(r['tt'], u['alpha'])}\n   {tr(r, lang)}" for r in items))
    await c.message.answer(text)
    await send_voice(c.bot, c.from_user.id, "\n".join(r["tt"] for r in items),
                     caption=t("listen_each", lang), speed=1.25,
                     markup=ikb([[(t("check", lang), f"lt:{n}")]]))


async def lesson_q(c, uid):
    tst = tests[uid]
    u = user(uid)
    lang = u["lang"]
    _, items = lessons()[tst["lesson"]]
    if tst["q"] >= len(items):
        await c.message.answer(t("lesson_done", lang, ok=tst["ok"], n=len(items)),
                               reply_markup=ikb([[(t("other_lessons", lang), "lsl")]]))
        tests.pop(uid, None)
        return
    r = items[tst["q"]]
    others = [x["tt"] for x in items if x is not r]
    opts = random.sample(others, min(2, len(others))) + [r["tt"]]
    random.shuffle(opts)
    rows = [[(short(o, "lat") if u["alpha"] == "lat" else o, f"la:{int(o == r['tt'])}")] for o in opts]
    await c.message.answer(t("lesson_q", lang, i=tst["q"] + 1, n=len(items), x=tr(r, lang)),
                           reply_markup=ikb(rows))


@dp.callback_query(F.data.startswith("lt:"))
async def lesson_test(c: CallbackQuery):
    await c.answer()
    tests[c.from_user.id] = {"lesson": int(c.data[3:]), "q": 0, "ok": 0}
    await lesson_q(c, c.from_user.id)


@dp.callback_query(F.data.startswith("la:"))
async def lesson_answer(c: CallbackQuery):
    tst = tests.get(c.from_user.id)
    lang = user(c.from_user.id)["lang"]
    if not tst:
        return await c.answer(t("restart", lang))
    ok = c.data == "la:1"
    tst["ok"] += ok
    tst["q"] += 1
    await c.answer("✅" if ok else "❌")
    try:
        await c.message.edit_reply_markup(reply_markup=None)
    except TelegramBadRequest:
        pass
    await lesson_q(c, c.from_user.id)


@dp.callback_query(F.data == "lsl")
async def lesson_list_cb(c: CallbackQuery):
    await c.answer()
    await lesson_list(c.message, uid=c.from_user.id)


# --- настройки
def settings_kb(u):
    lang = u["lang"]
    mark = lambda cur, v: "✅ " if cur == v else ""  # noqa: E731
    items = list(LANGS.items())
    return ikb([
        [(mark(lang, c) + n, f"lg:{c}") for c, n in items[:2]],
        [(mark(lang, c) + n, f"lg:{c}") for c, n in items[2:]],
        [(mark(u["alpha"], "cyr") + t("cyr", lang), "al:cyr"), (mark(u["alpha"], "lat") + t("lat", lang), "al:lat"),
         (mark(u["alpha"], "both") + t("both", lang), "al:both")],
        [(t("sub_on", lang) if u["sub"] else t("sub_off", lang), "sub")],
    ])


@dp.message(is_btn("set"))
async def settings(m: Message):
    u = user(m.from_user.id)
    await m.answer(t("settings", u["lang"]), reply_markup=settings_kb(u))


@dp.callback_query(F.data.startswith("al:") | F.data.startswith("lg:") | (F.data == "sub"))
async def settings_cb(c: CallbackQuery):
    u = user(c.from_user.id)
    if c.data == "sub":
        set_user(u["id"], sub=0 if u["sub"] else 1)
    elif c.data.startswith("al:"):
        set_user(u["id"], alpha=c.data[3:])
    else:
        set_user(u["id"], lang=c.data[3:])
    u = user(u["id"])
    await c.answer(t("saved", u["lang"]))
    try:
        await c.message.edit_text(t("settings", u["lang"]), reply_markup=settings_kb(u))
    except TelegramBadRequest:
        pass
    if c.data != "sub":  # обновляем ссылки игр под новый язык/алфавит
        await set_menu_button(c.bot, u)
        await c.message.answer(t("menu", u["lang"]), reply_markup=main_kb(u))


# --- игры (команда /games)
@dp.message(Command("games"))
async def games(m: Message):
    u = user(m.from_user.id)
    kb = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(
        text=t("play", u["lang"]), web_app=WebAppInfo(url=games_url(u)))]])
    await m.answer(t("games", u["lang"]), reply_markup=kb)


# --- статистика для владельца
@dp.message(Command("stats"))
async def stats(m: Message):
    if m.from_user.id != ADMIN_ID:
        return
    n, s = db.execute("SELECT COUNT(*), SUM(sub) FROM users").fetchone()
    week = (dt.datetime.now(KAZAN) - dt.timedelta(days=7)).isoformat()
    new = db.execute("SELECT COUNT(*) FROM users WHERE joined>?", (week,)).fetchone()[0]
    by_lang = ", ".join(f"{lg}: {k}" for lg, k in
                        db.execute("SELECT lang, COUNT(*) FROM users GROUP BY lang"))
    await m.answer(f"📊 Пользователей: {n}\n🔔 С рассылкой: {s or 0}\n🆕 За неделю: {new}\n🌐 {by_lang}")


@dp.message()
async def fallback(m: Message):
    u = user(m.from_user.id)
    await m.answer(t("menu", u["lang"]), reply_markup=main_kb(u))


# ---------------------------------------------------------------- рассылка
async def broadcast(bot, kind):
    ids = [r[0] for r in db.execute("SELECT id FROM users WHERE sub=1")]
    log.info("Рассылка %s: %d подписчиков", kind, len(ids))
    st = stories()
    for uid in ids:
        try:
            u = user(uid)
            if kind == "word":
                await send_word(bot, uid, u)
            else:
                await send_story(bot, uid, today_index(len(st)), u)
        except TelegramForbiddenError:
            set_user(uid, sub=0)  # пользователь заблокировал бота
        except Exception as e:  # noqa: BLE001
            log.warning("Не отправлено %s: %s", uid, e)
        await asyncio.sleep(0.05)


async def scheduler(bot):
    while True:
        now = dt.datetime.now(KAZAN)
        for kind, tm in (("word", MORNING), ("story", EVENING)):
            key = f"sent_{kind}"
            if now.time() >= tm and meta(key) != now.date().isoformat():
                meta(key, now.date().isoformat())
                asyncio.create_task(broadcast(bot, kind))
        await asyncio.sleep(30)


async def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
    token = os.environ.get("BOT_TOKEN")
    if not token:
        sys.exit("Нет BOT_TOKEN в файле .env")
    bot = Bot(token)
    # кнопка «Уеннар» в меню Telegram для всех по умолчанию
    try:
        await bot.set_chat_menu_button(menu_button=MenuButtonWebApp(
            text="🎮 Games", web_app=WebAppInfo(url=GAMES_URL)))
    except Exception as e:  # noqa: BLE001
        log.warning("Кнопка меню: %s", e)
    today = dt.datetime.now(KAZAN).date().isoformat()
    for kind, tm in (("word", MORNING), ("story", EVENING)):
        if meta(f"sent_{kind}") is None and dt.datetime.now(KAZAN).time() >= tm:
            meta(f"sent_{kind}", today)
    asyncio.create_task(scheduler(bot))
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
