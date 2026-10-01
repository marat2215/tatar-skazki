"""Собирает учебную базу сайта (site/data.json) из файлов репозитория.

Источники: content/*.csv, phrases/phrases.csv, stories/*.md, слова из игр
и дополнительный словарь ниже. С ключом --audio ещё и озвучивает каждый
татарский текст голосом TatarTTS в audio/site/<хэш>.mp3 (только новые).

    python scripts/build_site.py          # только data.json
    python scripts/build_site.py --audio  # + озвучка
"""
import csv
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site" / "data.json"
AUDIO = ROOT / "audio" / "site"


def h(text):
    """Имя аудиофайла — такой же хэш считает сайт в браузере."""
    return hashlib.sha1(text.strip().encode()).hexdigest()[:12]


def rows(path):
    with open(ROOT / path, encoding="utf-8") as f:
        return [r for r in csv.DictReader(f) if any(r.values())]


def game_words(path, pat):
    m = re.search(pat, (ROOT / path).read_text(encoding="utf-8"), re.S)
    return json.loads("[" + m.group(1) + "]")


# --- дополнительный словарь: [tt, ru, en, tr, fi]
EXTRA = {
    "num": [
        ["бер", "один", "one", "bir", "yksi"], ["ике", "два", "two", "iki", "kaksi"],
        ["өч", "три", "three", "üç", "kolme"], ["дүрт", "четыре", "four", "dört", "neljä"],
        ["биш", "пять", "five", "beş", "viisi"], ["алты", "шесть", "six", "altı", "kuusi"],
        ["җиде", "семь", "seven", "yedi", "seitsemän"], ["сигез", "восемь", "eight", "sekiz", "kahdeksan"],
        ["тугыз", "девять", "nine", "dokuz", "yhdeksän"], ["ун", "десять", "ten", "on", "kymmenen"],
        ["йөз", "сто", "hundred", "yüz", "sata"], ["мең", "тысяча", "thousand", "bin", "tuhat"],
    ],
    "color": [
        ["ак", "белый", "white", "beyaz", "valkoinen"], ["кара", "чёрный", "black", "siyah", "musta"],
        ["кызыл", "красный", "red", "kırmızı", "punainen"], ["яшел", "зелёный", "green", "yeşil", "vihreä"],
        ["зәңгәр", "синий", "blue", "mavi", "sininen"], ["сары", "жёлтый", "yellow", "sarı", "keltainen"],
        ["соры", "серый", "grey", "gri", "harmaa"], ["көрән", "коричневый", "brown", "kahverengi", "ruskea"],
    ],
    "family": [
        ["әни", "мама", "mother", "anne", "äiti"], ["әти", "папа", "father", "baba", "isä"],
        ["әби", "бабушка", "grandmother", "büyükanne", "isoäiti"], ["бабай", "дедушка", "grandfather", "büyükbaba", "isoisä"],
        ["абый", "старший брат", "older brother", "ağabey", "isoveli"], ["апа", "старшая сестра", "older sister", "abla", "isosisko"],
        ["энем", "младший брат", "younger brother", "küçük erkek kardeş", "pikkuveli"],
        ["сеңлем", "младшая сестра", "younger sister", "küçük kız kardeş", "pikkusisko"],
        ["бала", "ребёнок", "child", "çocuk", "lapsi"], ["гаилә", "семья", "family", "aile", "perhe"],
        ["дус", "друг", "friend", "dost", "ystävä"], ["кеше", "человек", "person", "insan", "ihminen"],
    ],
    "verb": [
        ["бар", "иди", "go", "git", "mene"], ["кил", "иди сюда", "come", "gel", "tule"],
        ["аша", "ешь", "eat", "ye", "syö"], ["эч", "пей", "drink", "iç", "juo"],
        ["укы", "читай / учись", "read / study", "oku", "lue / opiskele"], ["яз", "пиши", "write", "yaz", "kirjoita"],
        ["сөйлә", "говори", "speak", "konuş", "puhu"], ["тыңла", "слушай", "listen", "dinle", "kuuntele"],
        ["кара", "смотри", "look", "bak", "katso"], ["йокла", "спи", "sleep", "uyu", "nuku"],
        ["уйна", "играй", "play", "oyna", "leiki"], ["ярата", "любит", "loves", "sever", "rakastaa"],
    ],
    "words": [
        ["әйе", "да", "yes", "evet", "kyllä"], ["юк", "нет", "no", "hayır", "ei"],
        ["рәхмәт", "спасибо", "thank you", "teşekkürler", "kiitos"], ["зинһар", "пожалуйста", "please", "lütfen", "ole hyvä"],
        ["сау бул", "до свидания", "goodbye", "hoşça kal", "näkemiin"], ["ничек", "как", "how", "nasıl", "miten"],
        ["нәрсә", "что", "what", "ne", "mitä"], ["кайда", "где", "where", "nerede", "missä"],
        ["кем", "кто", "who", "kim", "kuka"], ["кайчан", "когда", "when", "ne zaman", "milloin"],
        ["яхшы", "хорошо", "good", "iyi", "hyvä"], ["начар", "плохо", "bad", "kötü", "huono"],
        ["тел", "язык", "language", "dil", "kieli"], ["татарча", "по-татарски", "in Tatar", "Tatarca", "tataariksi"],
        ["китап", "книга", "book", "kitap", "kirja"], ["мәктәп", "школа", "school", "okul", "koulu"],
    ],
}

TOPICS = {  # тема: (эмодзи, ru, en, tr, fi)
    "words": ("💬", "Главные слова", "Key words", "Temel kelimeler", "Tärkeät sanat"),
    "family": ("👪", "Семья и люди", "Family and people", "Aile ve insanlar", "Perhe ja ihmiset"),
    "num": ("🔢", "Числа", "Numbers", "Sayılar", "Numerot"),
    "color": ("🎨", "Цвета", "Colours", "Renkler", "Värit"),
    "nature": ("🌲", "Природа", "Nature", "Doğa", "Luonto"),
    "animal": ("🐾", "Животные", "Animals", "Hayvanlar", "Eläimet"),
    "body": ("🖐", "Тело", "Body", "Vücut", "Keho"),
    "food": ("🥟", "Еда и кухня", "Food and kitchen", "Yemek ve mutfak", "Ruoka ja keittiö"),
    "home": ("🏠", "Дом и село", "Home and village", "Ev ve köy", "Koti ja kylä"),
    "time": ("🕰", "Время и описание", "Time and describing", "Zaman ve tanımlama", "Aika ja kuvailu"),
    "verb": ("🏃", "Действия", "Actions", "Eylemler", "Tekemiset"),
}
CAT = {
    "nature": "урман агач елга күл тау кояш ай йолдыз яңгыр кар җил су ут таш чәчәк яфрак гөмбә җиләк бакча",
    "animal": "куян төлке аю бүре кош ат сыер эт песи балык",
    "body": "баш кул аяк күз колак",
    "home": "юл авыл өй ишек тәрәзә сабын",
    "time": "төн көн иртә кич тиз әкрен зур кечкенә курку кыю көч",
}


def build():
    words = {}

    def add(tt, ru, en, tr, fi, topic):
        tt = tt.strip()
        if tt and tt not in words:
            words[tt] = {"tt": tt, "ru": ru, "en": en, "tr": tr, "fi": fi, "topic": topic}

    for topic, items in EXTRA.items():
        for w in items:
            add(*w, topic)
    cat = {w: c for c, ws in CAT.items() for w in ws.split()}
    for w in game_words("games/shurale.html", r"const W=\[(.*?)\];"):
        add(*w, cat.get(w[0], "time"))
    m = re.search(r"const ITEMS=\{(.*?)\};", (ROOT / "games/echpochmak.html").read_text(encoding="utf-8"), re.S)
    for k, v in re.findall(r"(\S+?):(\[[^\]]*\])", m.group(1)):
        v = json.loads(v)
        add(k.strip(" ,\n"), *v[1:5], "food")
    for w in game_words("games/suz.html", r"const WORDS=\[(.*?)\];"):
        add(*w, cat.get(w[0], "food" if w[0] in ("бәлеш", "калач") else "home"))

    lessons = []
    for r in rows("content/lessons.csv"):
        if not lessons or lessons[-1]["tt"] != r["lesson"]:
            lessons.append({"tt": r["lesson"], **{l: r[f"title_{l}"] for l in ("ru", "en", "tr", "fi")}, "items": []})
        lessons[-1]["items"].append({k: r[k] for k in ("tt", "ru", "en", "tr", "fi")})

    stories = []
    for p in sorted((ROOT / "stories").glob("*.md")):
        text = p.read_text(encoding="utf-8").strip()
        title = text.splitlines()[0].lstrip("# ").strip()
        paras = [x.strip() for x in text.split("\n\n")[1:] if x.strip()]
        stories.append({"id": p.stem, "title": title, "paras": paras,
                        "audio": f"audio/{p.stem}.mp3" if (ROOT / "audio" / f"{p.stem}.mp3").exists() else ""})

    data = {
        "topics": [{"id": k, "emoji": v[0], "ru": v[1], "en": v[2], "tr": v[3], "fi": v[4]} for k, v in TOPICS.items()],
        "words": list(words.values()),
        "lessons": lessons,
        "phrases": [{k: r[k] for k in ("tt", "ru", "en", "tr", "fi")} for r in rows("phrases/phrases.csv")],
        "proverbs": rows("content/proverbs.csv"),
        "creatures": rows("content/creatures.csv"),
        "stories": stories,
    }
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"data.json: {len(words)} слов, {len(lessons)} уроков, {len(stories)} сказок")
    return data


def speak_all(data):
    sys.path.insert(0, str(ROOT / "scripts"))
    from tts import synthesize
    texts = {w["tt"] for w in data["words"]}
    for les in data["lessons"]:
        texts |= {i["tt"] for i in les["items"]}
    texts |= {p["tt"] for p in data["phrases"]} | {p["tt"] for p in data["proverbs"]}
    texts |= {c["tt_text"] for c in data["creatures"]}
    AUDIO.mkdir(parents=True, exist_ok=True)
    new = 0
    for t in sorted(texts):
        out = AUDIO / f"{h(t)}.mp3"
        if not out.exists():
            synthesize(t, str(out), speed=1.2)
            new += 1
    print(f"Озвучено новых: {new}, всего: {len(texts)}")


if __name__ == "__main__":
    d = build()
    if "--audio" in sys.argv:
        speak_all(d)
