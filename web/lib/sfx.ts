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

// «Свуш» при перевороте карточки — короткий шум с затуханием
export function swoosh() {
  try {
    ac ??= new AudioContext();
    const len = 0.22, buf = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) * 0.35;
    const src = ac.createBufferSource(), f = ac.createBiquadFilter();
    f.type = "bandpass"; f.frequency.setValueAtTime(600, ac.currentTime); f.frequency.exponentialRampToValueAtTime(2400, ac.currentTime + len);
    src.buffer = buf; src.connect(f).connect(ac.destination); src.start();
  } catch { /* ignore */ }
}
// «Мур» Баема — низкий тон с дрожанием
export function purr() {
  try {
    ac ??= new AudioContext();
    const o = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain(), t = ac.currentTime;
    o.type = "sawtooth"; o.frequency.value = 55; lfo.frequency.value = 22; lg.gain.value = 0.05;
    lfo.connect(lg).connect(g.gain); g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(g).connect(ac.destination); o.start(t); lfo.start(t); o.stop(t + 0.75); lfo.stop(t + 0.75);
  } catch { /* ignore */ }
}
// «Клик» прогресса
export const click = () => tone([1500], "square", 0.04);
