"""Публикует сказку дня в Telegram-канал.

Какая сказка сегодня: номер дня от START_DATE (файл config.txt).
Если аудио ещё нет — создаёт его ИИ-озвучкой.

Запуск:
  python scripts/post_story.py              # сказка дня -> в канал
  python scripts/post_story.py --dry-run    # только создать аудио, ничего не отправлять
  python scripts/post_story.py --story 2    # конкретная сказка (номер по порядку)

Нужны переменные окружения (на GitHub — это Secrets):
  TELEGRAM_BOT_TOKEN — токен бота от @BotFather
  TELEGRAM_CHAT_ID   — канал, например @tatar_ekiyatlar
"""
import argparse
import datetime as dt
import os
import sys
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from translit import to_latin  # noqa: E402

STORIES = ROOT / "stories"
AUDIO = ROOT / "audio"
KAZAN = dt.timezone(dt.timedelta(hours=3))


def read_config():
    cfg = {}
    for line in (ROOT / "config.txt").read_text(encoding="utf-8").splitlines():
        if "=" in line and not line.strip().startswith("#"):
            k, v = line.split("=", 1)
            cfg[k.strip()] = v.strip()
    return cfg


def load_story(path):
    lines = path.read_text(encoding="utf-8").strip().splitlines()
    title = lines[0].lstrip("# ").strip()
    body = "\n".join(lines[1:]).strip()
    return title, body


def pick_story(n=None):
    files = sorted(STORIES.glob("*.md"))
    if not files:
        sys.exit("В папке stories нет сказок")
    if n is not None:
        return files[n - 1]
    cfg = read_config()
    start = dt.date.fromisoformat(cfg["START_DATE"])
    day = (dt.datetime.now(KAZAN).date() - start).days
    if day < 0:
        print("Старт ещё не наступил:", start)
        return None
    if day >= len(files):
        if cfg.get("REPEAT", "yes") == "yes":
            day %= len(files)
        else:
            print("Сказки закончились — добавьте новые в папку stories")
            return None
    return files[day]


def tg(method, **kwargs):
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    r = requests.post(f"https://api.telegram.org/bot{token}/{method}", timeout=60, **kwargs)
    data = r.json()
    if not data.get("ok"):
        sys.exit(f"Ошибка Telegram: {data}")
    return data


def send_text(chat, text):
    # у Telegram лимит 4096 символов на сообщение
    while text:
        part, text = text[:4000], text[4000:]
        tg("sendMessage", data={"chat_id": chat, "text": part})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--story", type=int)
    args = ap.parse_args()

    path = pick_story(args.story)
    if path is None:
        return
    title, body = load_story(path)
    AUDIO.mkdir(exist_ok=True)
    mp3 = AUDIO / (path.stem + ".mp3")
    if not mp3.exists():
        from tts import synthesize
        print("Озвучиваю:", title)
        synthesize(body, str(mp3), title=title)
    print("Аудио:", mp3)

    caption = f"🌙 {title}\n{to_latin(title)}\n\nӘкият тыңлагыз! Хәерле төн!"
    text = f"{title}\n\n{body}\n\n— — —\n\n{to_latin(title)}\n\n{to_latin(body)}"
    if args.dry_run:
        print("\n--- Подпись к аудио ---\n" + caption)
        print("\n--- Текст ---\n" + text)
        return

    chat = os.environ["TELEGRAM_CHAT_ID"]
    with open(mp3, "rb") as f:
        tg("sendAudio", data={"chat_id": chat, "caption": caption, "title": title,
                              "performer": "Татар әкиятләре"}, files={"audio": f})
    send_text(chat, text)
    print("Опубликовано:", title)


if __name__ == "__main__":
    main()
