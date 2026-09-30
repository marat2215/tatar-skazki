"""Озвучка татарского текста женским голосом TatarTTS (движок Piper).

Модель: TatarTTS — ИПС АН Татарстана и ISSAI, лицензия MIT.
https://github.com/IS2AI/TatarTTS
Файлы модели лежат в папке models/female (скачивает scripts/get_model.py).
"""
import re
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

MODEL_DIR = Path(__file__).resolve().parent.parent / "models" / "female"
SPEED = 1.15   # >1 — медленнее; для детей чуть медленнее обычного
PAUSE = 0.7    # пауза между абзацами, секунды

_voice = None


def _load():
    global _voice
    if _voice is None:
        _voice = PiperVoice.load(str(MODEL_DIR / "female.onnx"),
                                 config_path=str(MODEL_DIR / "config.json"))
    return _voice


def _paragraphs(text):
    text = re.sub(r"^#.*$", "", text, flags=re.M)
    parts = [p.replace("—", "").strip(" \n-") for p in text.split("\n")]
    return [p for p in parts if re.search(r"\w", p)]


def synthesize(text, out_mp3, title=None, speed=SPEED):
    """out_mp3 может быть .mp3 или .ogg (голосовое сообщение Telegram)."""
    voice = _load()
    cfg = SynthesisConfig(length_scale=speed)
    rate = voice.config.sample_rate
    silence = np.zeros(int(rate * PAUSE), dtype=np.int16)
    chunks = []
    for p in ([title] if title else []) + _paragraphs(text):
        for chunk in voice.synthesize(p, syn_config=cfg):
            chunks.append(chunk.audio_int16_array)
        chunks.append(silence)
    audio = np.concatenate(chunks)
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        with wave.open(tmp.name, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(rate)
            w.writeframes(audio.tobytes())
        codec = (["-c:a", "libopus", "-b:a", "48k"] if str(out_mp3).endswith(".ogg")
                 else ["-c:a", "libmp3lame", "-b:a", "96k"])
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp.name,
                        *codec, str(out_mp3)], check=True)
    return out_mp3
