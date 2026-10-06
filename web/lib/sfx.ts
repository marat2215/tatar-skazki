// Звуки без файлов: мягкий «динь» за верный ответ, «буп» за ошибку, конфетти из орнаментов.
let ac: AudioContext | null = null;
function tone(freqs: number[], type: OscillatorType = "sine", len = 0.18) {
  try {
    ac ??= new AudioContext();
    freqs.forEach((f, i) => {
      const o = ac!.createOscillator(), g = ac!.createGain(), t = ac!.currentTime + i * 0.09;
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g).connect(ac!.destination); o.start(t); o.stop(t + len + 0.05);
    });
  } catch { /* без звука */ }
}
export const ding = () => tone([784, 1175]);
export const boop = () => tone([220, 180], "triangle", 0.22);
export const fanfare = () => tone([523, 659, 784, 1047], "sine", 0.3);

export function confetti() {
  if (typeof document === "undefined") return;
  ["🌷", "◆", "✿", "🌷", "◆", "✦", "🍯"].forEach((c, i) => {
    for (let k = 0; k < 3; k++) {
      const e = document.createElement("span");
      e.className = "conf"; e.textContent = c;
      e.style.left = `${Math.random() * 100}vw`;
      e.style.color = ["#C8553D", "#E0A43A", "#1E7A5A"][k];
      e.style.animationDelay = `${i * 0.05 + k * 0.12}s`;
      document.body.appendChild(e);
      window.setTimeout(() => e.remove(), 2400);
    }
  });
}
