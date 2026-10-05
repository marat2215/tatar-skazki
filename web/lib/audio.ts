// Озвучка TatarTTS: файлы audio/site/<sha1[:12]>.mp3 собирает scripts/build_site.py.
// Если файла нет — запасной вариант: синтез речи браузера (турецкий/башкирский голос ближе всего).
import { sha1 } from "./sha1";

let current: HTMLAudioElement | null = null;

function fallback(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = synth.getVoices();
  const v = ["tt", "ba", "kk", "tr", "ru"].map((l) => voices.find((x) => x.lang.toLowerCase().startsWith(l))).find(Boolean);
  if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "tr-TR";
  u.rate = 0.85;
  synth.speak(u);
}

export async function speak(text: string): Promise<void> {
  const name = sha1(text.trim()).slice(0, 12);
  current?.pause();
  const a = new Audio(`/audio/site/${name}.mp3`);
  current = a;
  try {
    await a.play();
  } catch {
    fallback(text);
  }
}
