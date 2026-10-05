// Озвучка TatarTTS: файлы audio/site/<sha1[:12]>.mp3 собирает scripts/build_site.py
const cache = new Map<string, string>();
let current: HTMLAudioElement | null = null;

async function hash(text: string): Promise<string> {
  const hit = cache.get(text);
  if (hit) return hit;
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text.trim()));
  const h = Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
  cache.set(text, h);
  return h;
}

export async function speak(text: string): Promise<void> {
  const name = await hash(text);
  current?.pause();
  current = new Audio(`/audio/site/${name}.mp3`);
  await current.play().catch(() => undefined);
}
