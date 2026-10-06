// Озвучка TatarTTS: файлы audio/site/<sha1[:12]>.mp3 собирает scripts/build_site.py
// (тексты игр — из web/tts-extra.txt, шаг в site.yml). Робот браузера не используем —
// он не умеет татарский и звучит плохо.
import { sha1 } from "./sha1";
import { bump } from "./daily";

let current: HTMLAudioElement | null = null;

export async function speak(text: string): Promise<void> {
  const name = sha1(text.trim()).slice(0, 12);
  current?.pause();
  const a = new Audio(`/audio/site/${name}.mp3`);
  current = a;
  try { await a.play(); bump("listen"); } catch { /* записи пока нет — молчим */ }
}
