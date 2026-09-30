"""Скачивает женский голос TatarTTS в папку models/female.

Модель лежит на Google Диске разработчиков (IS2AI/TatarTTS).
Если ссылка перестанет работать — загрузите свою копию файлов куда-либо
и укажите прямые ссылки в MODEL_URL и CONFIG_URL ниже.
"""
import json
from pathlib import Path

import gdown

DIR = Path(__file__).resolve().parent.parent / "models" / "female"
MODEL_URL = "https://drive.google.com/uc?id=1F-XF4iRtgg2KEUXF94IpikLLrd70DgP-"
CONFIG_URL = "https://drive.google.com/uc?id=1RXbUpJ73SRET3u7xIA2w-HwhftK8A9qq"


def main():
    DIR.mkdir(parents=True, exist_ok=True)
    onnx, cfg = DIR / "female.onnx", DIR / "config.json"
    if not onnx.exists():
        gdown.download(MODEL_URL, str(onnx), quiet=False)
    if not cfg.exists():
        gdown.download(CONFIG_URL, str(cfg), quiet=False)
    # в исходном файле старая запись формата — исправляем для новой версии Piper
    data = json.loads(cfg.read_text(encoding="utf-8"))
    if data.get("phoneme_type") == "PhonemeType.ESPEAK":
        data["phoneme_type"] = "espeak"
        cfg.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Модель готова:", DIR)


if __name__ == "__main__":
    main()
