"""TatarlargaBot — бот для изучения татарского языка.

Меню: сказки, слово дня, пословицы, викторина, уроки, настройки.
Подписчикам: слово дня утром (08:00) и сказка вечером (19:00) по Казани.

Контент берётся из папок репозитория (stories, phrases, content) —
чтобы добавить сказку или фразу, достаточно изменить файлы на GitHub,
сервер сам подтягивает обновления.

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
from aiogram.exceptions import TelegramForbiddenError, TelegramBadRequest
from aiogram.filters import Command, CommandStart
from aiogram.types import (CallbackQuery, FSInputFile, InlineKeyboardButton,
                           InlineKeyboardMarkup, KeyboardButton, Message,
                           ReplyKeyboardMarkup)

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from translit import to_latin  # noqa: E402

KAZAN = dt.timezone(dt.timedelta(hours=3))
DATA = Path(os.environ.get("DATA_DIR", ROOT / "data"))
(DATA / "audio").mkdir(parents=True, exist_ok=True)
ADMIN_ID = int(os.environ.get("ADMIN_ID", "0") or 0)
START_DATE = dt.date(2026, 10, 1)
MORNING, EVENING = dt.time(8, 0), dt.time(19, 0)

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


def user(uid, name=""):
    row = db.execute("SELECT id,alpha,sub,okc,total FROM users WHERE id=?", (uid,)).fetchone()
    if not row:
        db.execute("INSERT INTO users(id,name,joined) VALUES(?,?,?)",
                   (uid, name, dt.datetime.now(KAZAN).isoformat()))
        db.commit()
        row = (uid, "both", 1, 0, 0)
    return dict(zip(["id", "alpha", "sub", "right", "total"], row))


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


def lessons():
    rows = _load(ROOT / "content" / "lessons.csv", _csv)
    out = {}
    for r in rows:
        out.setdefault(r["lesson"], []).append(r)
    return list(out.items())


def today_index(n):
    return (dt.datetime.now(KAZAN).date() - START_DATE).days % max(n, 1)


def show(text, alpha):
    """Текст по настройке пользователя: кириллица, латиница или оба."""
    if alpha == "cyr":
        return text
    if alpha == "lat":
        return to_latin(text)
    return f"{text}\n🔤 {to_latin(text)}"


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
B_STORY, B_WORD, B_PROV = "🌙 Әкиятләр", "☀️ Көн сүзе", "📜 Мәкальләр"
B_QUIZ, B_LESSON, B_SET = "❓ Викторина", "🎓 Дәресләр", "⚙️ Көйләүләр"

MAIN = ReplyKeyboardMarkup(resize_keyboard=True, keyboard=[
    [KeyboardButton(text=B_STORY), KeyboardButton(text=B_WORD)],
    [KeyboardButton(text=B_PROV), KeyboardButton(text=B_QUIZ)],
    [KeyboardButton(text=B_LESSON), KeyboardButton(text=B_SET)],
])


def ikb(rows):
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=t, callback_data=d) for t, d in row] for row in rows])


# ---------------------------------------------------------------- обработчики
dp = Dispatcher()


@dp.message(CommandStart())
async def start(m: Message):
    user(m.from_user.id, m.from_user.full_name)
    await m.answer(
        "Исәнмесез! 👋 Добро пожаловать!\n\n"
        "Здесь можно учить татарский язык:\n"
        "🌙 сказки на ночь с озвучкой\n☀️ слово дня\n📜 пословицы\n"
        "❓ викторины\n🎓 уроки по темам\n\n"
        "Каждое утро я пришлю слово дня, а вечером — сказку. "
        "Отключить можно в «⚙️ Көйләүләр».", reply_markup=MAIN)


# --- сказки
@dp.message(F.text == B_STORY)
async def story_list(m: Message):
    st = stories()
    rows = [[(s["title"], f"st:{i}")] for i, s in enumerate(st)]
    await m.answer("🌙 Выберите сказку:", reply_markup=ikb(rows))


async def send_story(bot, chat_id, i, alpha):
    st = stories()
    if not st:
        return
    s = st[i % len(st)]
    ready = ROOT / "audio" / f"{s['id']}.mp3"
    if ready.exists():
        await bot.send_audio(chat_id, FSInputFile(ready), title=s["title"],
                             performer="Татар әкиятләре")
    else:
        await send_voice(bot, chat_id, f"{s['title']}\n{s['body']}", speed=1.15)
    text = f"🌙 {s['title']}\n\n{s['body']}"
    if alpha == "lat":
        text = to_latin(text)
    elif alpha == "both":
        text += f"\n\n— — —\n\n{to_latin(s['title'])}\n\n{to_latin(s['body'])}"
    for k in range(0, len(text), 4000):
        await bot.send_message(chat_id, text[k:k + 4000])


@dp.callback_query(F.data.startswith("st:"))
async def story_cb(c: CallbackQuery):
    await c.answer()
    await send_story(c.bot, c.from_user.id, int(c.data[3:]), user(c.from_user.id)["alpha"])


# --- слово дня
async def send_word(bot, chat_id, alpha, i=None):
    ph = phrases()
    if not ph:
        return
    r = ph[today_index(len(ph)) if i is None else i % len(ph)]
    cap = f"☀️ Көн сүзе — фраза дня\n\n🗣 {show(r['tt'], alpha)}\n🇷🇺 {r['ru']}\n\nТыңлагыз һәм кабатлагыз!"
    await send_voice(bot, chat_id, f"{r['tt']}\n{r['tt']}", caption=cap, speed=1.25,
                     markup=ikb([[("🔁 Еще фраза", "word:rnd")]]))


@dp.message(F.text == B_WORD)
async def word(m: Message):
    await send_word(m.bot, m.chat.id, user(m.from_user.id)["alpha"])


@dp.callback_query(F.data == "word:rnd")
async def word_rnd(c: CallbackQuery):
    await c.answer()
    await send_word(c.bot, c.from_user.id, user(c.from_user.id)["alpha"], random.randrange(10 ** 6))


# --- пословицы
@dp.message(F.text == B_PROV)
@dp.callback_query(F.data == "prov")
async def proverb(ev):
    msg = ev.message if isinstance(ev, CallbackQuery) else ev
    if isinstance(ev, CallbackQuery):
        await ev.answer()
    pr = proverbs()
    if not pr:
        return
    r = random.choice(pr)
    alpha = user(ev.from_user.id)["alpha"]
    cap = f"📜 Мәкаль\n\n{show(r['tt'], alpha)}\n\n🇷🇺 {r['ru']}\n💡 {r['meaning']}"
    await send_voice(msg.bot, msg.chat.id, r["tt"], caption=cap, speed=1.2,
                     markup=ikb([[("🔁 Еще пословица", "prov")]]))


# --- викторина
def quiz_question():
    ph = [r for r in phrases() if r.get("quiz_word")]
    i = random.randrange(len(ph))
    r = ph[i]
    opts = [r["right"], r["wrong1"], r["wrong2"]]
    random.shuffle(opts)
    return i, r, opts


@dp.message(F.text == B_QUIZ)
@dp.callback_query(F.data == "quiz:next")
async def quiz(ev):
    msg = ev.message if isinstance(ev, CallbackQuery) else ev
    if isinstance(ev, CallbackQuery):
        await ev.answer()
    alpha = user(ev.from_user.id)["alpha"]
    i, r, opts = quiz_question()
    rows = [[(o, f"q:{i}:{int(o == r['right'])}")] for o in opts]
    word_txt = r["quiz_word"] if alpha == "cyr" else (
        to_latin(r["quiz_word"]) if alpha == "lat" else f"{r['quiz_word']} ({to_latin(r['quiz_word'])})")
    await msg.answer(f"❓ Что значит «{word_txt}»?", reply_markup=ikb(rows))


@dp.callback_query(F.data.startswith("q:"))
async def quiz_answer(c: CallbackQuery):
    _, i, ok = c.data.split(":")
    u = user(c.from_user.id)
    ph = [r for r in phrases() if r.get("quiz_word")]
    r = ph[int(i) % len(ph)]
    right, total = u["right"] + (ok == "1"), u["total"] + 1
    set_user(u["id"], okc=right, total=total)
    mark = "✅ Дөрес! Верно!" if ok == "1" else f"❌ Ялгыш. Правильно: {r['right']}"
    await c.answer()
    try:
        await c.message.edit_reply_markup(reply_markup=None)
    except TelegramBadRequest:
        pass
    await c.message.answer(f"{mark}\n{r['quiz_word']} — {r['right']}\n\n🏆 Счёт: {right} из {total}",
                           reply_markup=ikb([[("➡️ Следующий вопрос", "quiz:next")]]))


# --- уроки
tests = {}  # uid -> {"lesson": n, "q": k, "ok": m}


@dp.message(F.text == B_LESSON)
async def lesson_list(m: Message):
    rows = [[(f"{n + 1}. {name}", f"ls:{n}")] for n, (name, _) in enumerate(lessons())]
    await m.answer("🎓 Выберите урок:", reply_markup=ikb(rows))


@dp.callback_query(F.data.startswith("ls:"))
async def lesson(c: CallbackQuery):
    await c.answer()
    n = int(c.data[3:])
    name, items = lessons()[n]
    alpha = user(c.from_user.id)["alpha"]
    text = f"🎓 Урок {n + 1}. {name}\n\n" + "\n\n".join(
        f"• {show(r['tt'], alpha)}\n   {r['ru']}" for r in items)
    await c.message.answer(text)
    await send_voice(c.bot, c.from_user.id, "\n".join(r["tt"] for r in items),
                     caption="🔊 Послушайте и повторите каждую фразу", speed=1.25,
                     markup=ikb([[("📝 Проверить себя", f"lt:{n}")]]))


async def lesson_q(c, uid):
    t = tests[uid]
    name, items = lessons()[t["lesson"]]
    if t["q"] >= len(items):
        await c.message.answer(f"🎉 Урок пройден! Правильно {t['ok']} из {len(items)}.\n"
                               "Молодец! Булдырдың!", reply_markup=ikb([[("🎓 Другие уроки", "lsl")]]))
        tests.pop(uid, None)
        return
    r = items[t["q"]]
    others = [x["tt"] for x in items if x is not r]
    opts = random.sample(others, min(2, len(others))) + [r["tt"]]
    random.shuffle(opts)
    alpha = user(uid)["alpha"]
    rows = [[(to_latin(o) if alpha == "lat" else o, f"la:{int(o == r['tt'])}")] for o in opts]
    await c.message.answer(f"Вопрос {t['q'] + 1}/{len(items)}\nКак сказать по-татарски:\n«{r['ru']}»",
                           reply_markup=ikb(rows))


@dp.callback_query(F.data.startswith("lt:"))
async def lesson_test(c: CallbackQuery):
    await c.answer()
    tests[c.from_user.id] = {"lesson": int(c.data[3:]), "q": 0, "ok": 0}
    await lesson_q(c, c.from_user.id)


@dp.callback_query(F.data.startswith("la:"))
async def lesson_answer(c: CallbackQuery):
    t = tests.get(c.from_user.id)
    if not t:
        return await c.answer("Начните урок заново")
    ok = c.data == "la:1"
    t["ok"] += ok
    t["q"] += 1
    await c.answer("✅ Дөрес!" if ok else "❌ Ялгыш")
    try:
        await c.message.edit_reply_markup(reply_markup=None)
    except TelegramBadRequest:
        pass
    await lesson_q(c, c.from_user.id)


@dp.callback_query(F.data == "lsl")
async def lesson_list_cb(c: CallbackQuery):
    await c.answer()
    await lesson_list(c.message)


# --- настройки
def settings_kb(u):
    a = u["alpha"]
    mark = lambda v: "✅ " if a == v else ""  # noqa: E731
    return ikb([
        [(mark("cyr") + "Кириллица", "al:cyr"), (mark("lat") + "Latin", "al:lat"),
         (mark("both") + "Обе", "al:both")],
        [("🔔 Рассылка: вкл" if u["sub"] else "🔕 Рассылка: выкл", "sub")],
    ])


@dp.message(F.text == B_SET)
async def settings(m: Message):
    u = user(m.from_user.id)
    await m.answer("⚙️ Настройки\n\nАлфавит и ежедневная рассылка (08:00 слово дня, 19:00 сказка):",
                   reply_markup=settings_kb(u))


@dp.callback_query(F.data.startswith("al:") | (F.data == "sub"))
async def settings_cb(c: CallbackQuery):
    u = user(c.from_user.id)
    if c.data == "sub":
        set_user(u["id"], sub=0 if u["sub"] else 1)
    else:
        set_user(u["id"], alpha=c.data[3:])
    await c.answer("Сохранено")
    try:
        await c.message.edit_reply_markup(reply_markup=settings_kb(user(u["id"])))
    except TelegramBadRequest:
        pass


# --- статистика для владельца
@dp.message(Command("stats"))
async def stats(m: Message):
    if m.from_user.id != ADMIN_ID:
        return
    n, s = db.execute("SELECT COUNT(*), SUM(sub) FROM users").fetchone()
    week = (dt.datetime.now(KAZAN) - dt.timedelta(days=7)).isoformat()
    new = db.execute("SELECT COUNT(*) FROM users WHERE joined>?", (week,)).fetchone()[0]
    await m.answer(f"📊 Пользователей: {n}\n🔔 С рассылкой: {s or 0}\n🆕 За неделю: {new}")


@dp.message()
async def fallback(m: Message):
    await m.answer("Выберите раздел в меню 👇", reply_markup=MAIN)


# ---------------------------------------------------------------- рассылка
async def broadcast(bot, kind):
    ids = [r[0] for r in db.execute("SELECT id FROM users WHERE sub=1")]
    log.info("Рассылка %s: %d подписчиков", kind, len(ids))
    st = stories()
    for uid in ids:
        try:
            alpha = user(uid)["alpha"]
            if kind == "word":
                await send_word(bot, uid, alpha)
            else:
                await send_story(bot, uid, today_index(len(st)), alpha)
        except TelegramForbiddenError:
            set_user(uid, sub=0)  # пользователь заблокировал бота
        except Exception as e:  # noqa: BLE001
            log.warning("Не отправлено %s: %s", uid, e)
        await asyncio.sleep(0.05)


async def scheduler(bot):
    while True:
        now = dt.datetime.now(KAZAN)
        for kind, t in (("word", MORNING), ("story", EVENING)):
            key = f"sent_{kind}"
            if now.time() >= t and meta(key) != now.date().isoformat():
                meta(key, now.date().isoformat())
                asyncio.create_task(broadcast(bot, kind))
        await asyncio.sleep(30)


async def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
    token = os.environ.get("BOT_TOKEN")
    if not token:
        sys.exit("Нет BOT_TOKEN в файле .env")
    bot = Bot(token)
    # чтобы после первого запуска не разослать «пропущенное» за сегодня
    today = dt.datetime.now(KAZAN).date().isoformat()
    for kind, t in (("word", MORNING), ("story", EVENING)):
        if meta(f"sent_{kind}") is None and dt.datetime.now(KAZAN).time() >= t:
            meta(f"sent_{kind}", today)
    asyncio.create_task(scheduler(bot))
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
