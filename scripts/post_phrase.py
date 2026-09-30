"""Утренняя рубрика для взрослых: фраза дня (голосовое) + викторина (опрос).

Фразы берутся по порядку из phrases/phrases.csv, одна в день, начиная с START_DATE.

Запуск:
  python scripts/post_phrase.py              # фраза дня -> в канал
  python scripts/post_phrase.py --dry-run    # только показать и создать аудио
  python scripts/post_phrase.py --n 5        # конкретная фраза (номер строки)
"""
import argparse
import csv
import datetime as dt
import json
import os
import random
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from post_story import KAZAN, read_config, tg  # noqa: E402
from translit import to_latin  # noqa: E402


def load_phrases():
    with open(ROOT / "phrases" / "phrases.csv", encoding="utf-8") as f:
        return [r for r in csv.DictReader(f) if r.get("tt", "").strip()]


def pick(rows, n=None):
    if n is not None:
        return rows[n - 1]
    cfg = read_config()
    start = dt.date.fromisoformat(cfg["START_DATE"])
    day = (dt.datetime.now(KAZAN).date() - start).days
    if day < 0:
        return None
    if day >= len(rows) and cfg.get("REPEAT", "yes") != "yes":
        return None
    return rows[day % len(rows)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--n", type=int)
    args = ap.parse_args()

    row = pick(load_phrases(), args.n)
    if row is None:
        print("Сегодня фразы нет (старт позже или фразы закончились)")
        return
    tt, ru = row["tt"].strip(), row["ru"].strip()
    caption = (f"☀️ Көннең сүзтезмәсе — фраза дня\n\n"
               f"🗣 {tt}\n🔤 {to_latin(tt)}\n🇷🇺 {ru}\n\n"
               f"Тыңлагыз һәм кабатлагыз! Послушайте и повторите вслух.")

    word = row["quiz_word"].strip()
    options = [row["right"].strip(), row["wrong1"].strip(), row["wrong2"].strip()]
    random.Random(tt).shuffle(options)  # порядок один и тот же для одной фразы
    correct = options.index(row["right"].strip())
    question = f"Что значит «{word}» ({to_latin(word)})?"

    from tts import synthesize
    with tempfile.TemporaryDirectory() as d:
        ogg = Path(d) / "phrase.ogg"
        synthesize(f"{tt}\n{tt}", ogg, speed=1.25)  # фраза два раза, медленно
        if args.dry_run:
            out = ROOT / "audio" / "phrase-preview.ogg"
            out.parent.mkdir(exist_ok=True)
            out.write_bytes(ogg.read_bytes())
            print(caption, "\n\nОпрос:", question, options, "верный:", correct, "\nАудио:", out)
            return
        chat = os.environ["TELEGRAM_CHAT_ID"]
        with open(ogg, "rb") as f:
            tg("sendVoice", data={"chat_id": chat, "caption": caption}, files={"voice": f})
    tg("sendPoll", data={
        "chat_id": chat,
        "question": question,
        "options": json.dumps(options, ensure_ascii=False),
        "type": "quiz",
        "correct_option_id": correct,
        "is_anonymous": "true",
        "explanation": f"{word} — {row['right'].strip()}",
    })
    print("Опубликовано:", tt)


if __name__ == "__main__":
    main()
