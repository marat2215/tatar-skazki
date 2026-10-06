// Нарисованные персонажи и сцены «Башни Сююмбике» (SVG-строки).
// Портреты: viewBox 0 0 200 240, персонаж по пояс. Сцены: viewBox 0 0 800 450.
import type { Who } from "@/lib/tower-data";

const O = 'stroke="#2a1638" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"';
const lg = (id: string, a: string, b: string, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const rg = (id: string, a: string, b: string) =>
  `<radialGradient id="${id}" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const svg = (defs: string, body: string, vb = "0 0 200 240") =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet"><defs>${defs}</defs>${body}</svg>`;
const eye = (x: number, y: number, r = 7, iris = "#3b2414") =>
  `<g class="tw-blink" style="transform-origin:${x}px ${y}px"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="#fff" ${O} stroke-width="2.5"/><circle cx="${x + r * 0.15}" cy="${y + r * 0.15}" r="${r * 0.66}" fill="${iris}"/><circle cx="${x + r * 0.15}" cy="${y + r * 0.15}" r="${r * 0.3}" fill="#140a06"/><circle cx="${x + r * 0.42}" cy="${y - r * 0.25}" r="${r * 0.26}" fill="#fff"/></g>`;
const cheek = (x: number, y: number) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="#ff7b8a" opacity=".5"/>`;
export const tulip = (x: number, y: number, s = 1, c = "#ffc83d") =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 8 C-7 2 -7 -6 -3 -9 C-2 -4 0 -3 0 -3 C0 -3 2 -4 3 -9 C7 -6 7 2 0 8Z" fill="${c}" stroke="#2a1638" stroke-width="1.5"/><path d="M0 8 L0 14" stroke="${c}" stroke-width="2"/></g>`;

// ---------- ПЕРСОНАЖИ ----------
const dania = () => svg(
  rg("dS", "#ffe1c8", "#eeb08d") + lg("dJ", "#3fb4a0", "#1d6f72") + lg("dH", "#4a2a1c", "#24120a") + lg("dY", "#ffd34d", "#f0a020"),
  `<path d="M126 70 Q170 96 160 170 Q150 196 132 200 Q146 150 120 96Z" fill="url(#dH)" ${O}/>
  <path d="M40 240 Q36 176 70 162 L130 162 Q164 176 160 240Z" fill="url(#dJ)" ${O}/>
  <path d="M84 162 L100 190 L116 162" fill="#fff6e6" ${O} stroke-width="2.5"/>
  <path d="M70 166 L64 240 M130 166 L136 240" stroke="#145457" stroke-width="3"/>
  <rect x="70" y="200" width="22" height="16" rx="3" fill="#145457" ${O} stroke-width="2"/>
  ${tulip(126, 210, 1.1, "#ffd34d")}
  <path d="M88 150 L88 166 Q100 172 112 166 L112 150" fill="url(#dS)" ${O} stroke-width="2.5"/>
  <circle cx="100" cy="104" r="46" fill="url(#dS)" ${O}/>
  <path d="M54 104 Q50 50 100 46 Q150 50 146 104 Q138 80 118 72 Q96 90 62 92 Q58 98 54 104Z" fill="url(#dH)" ${O}/>
  <path d="M56 76 Q100 40 146 78 L144 66 Q100 26 58 64Z" fill="url(#dY)" ${O}/>
  ${[70, 86, 102, 118, 134].map((x) => `<circle cx="${x}" cy="${x === 102 ? 56 : 60 + Math.abs(x - 102) * 0.1}" r="3" fill="#c0392b"/>`).join("")}
  <path d="M144 72 Q160 66 162 82 Q152 80 146 84Z" fill="url(#dY)" ${O} stroke-width="2.5"/>
  ${eye(83, 108, 8.5, "#6b3a1a")}${eye(117, 108, 8.5, "#6b3a1a")}
  <path d="M73 92 Q83 86 93 92 M107 92 Q117 86 127 92" fill="none" stroke="#2a1638" stroke-width="3"/>
  ${cheek(72, 124)}${cheek(128, 124)}
  <path d="M90 130 Q100 138 110 130" fill="none" stroke="#2a1638" stroke-width="3"/>
  <circle cx="54" cy="116" r="4" fill="#ffd34d" ${O} stroke-width="1.5"/><circle cx="146" cy="116" r="4" fill="#ffd34d" ${O} stroke-width="1.5"/>`,
);

const cat = () => svg(
  rg("cO", "#ffb05a", "#d9772f") + lg("cG", "#2ba57a", "#16634a"),
  `<path d="M150 230 Q196 210 180 160" fill="none" stroke="#2a1638" stroke-width="18" stroke-linecap="round"/>
  <path d="M150 230 Q196 210 180 160" fill="none" stroke="#e8893a" stroke-width="12" stroke-linecap="round"/>
  <ellipse cx="100" cy="206" rx="62" ry="40" fill="url(#cO)" ${O}/>
  <ellipse cx="100" cy="214" rx="34" ry="24" fill="#fbe3c4" ${O} stroke-width="2.5"/>
  <path d="M50 110 L58 48 L92 84Z M150 110 L142 48 L108 84Z" fill="url(#cO)" ${O}/>
  <path d="M62 96 L64 66 L82 84Z M138 96 L136 66 L118 84Z" fill="#f6b7a0"/>
  <circle cx="100" cy="124" r="56" fill="url(#cO)" ${O}/>
  <path d="M60 88 Q100 52 140 88 Q100 78 60 88Z" fill="url(#cG)" ${O}/>
  <path d="M66 86 Q100 74 134 86" fill="none" stroke="#ffc83d" stroke-width="3" stroke-dasharray="5 4"/>
  <path d="M70 108 q8 -8 16 0 M114 108 q8 -8 16 0" fill="none" stroke="#c86a22" stroke-width="3"/>
  ${eye(80, 126, 9, "#2fa36a")}${eye(120, 126, 9, "#2fa36a")}
  <path d="M95 146 L100 151 L105 146Z" fill="#c8553d" ${O} stroke-width="1.5"/>
  <path d="M100 151 Q92 162 84 155 M100 151 Q108 162 116 155" fill="none" stroke="#2a1638" stroke-width="2.5"/>
  <path d="M50 146 L22 140 M50 154 L24 158 M150 146 L178 140 M150 154 L176 158" stroke="#2a1638" stroke-width="2"/>
  ${cheek(66, 148)}${cheek(134, 148)}`,
);

const ildar = () => svg(
  rg("iS", "#f6cfae", "#d99a72") + lg("iV", "#ff9a3c", "#e0561c") + lg("iH", "#ffe066", "#f2b705"),
  `<path d="M38 240 Q34 178 70 164 L130 164 Q166 178 162 240Z" fill="#3a5a8c" ${O}/>
  <path d="M56 240 L64 172 L88 166 L92 240Z M144 240 L136 172 L112 166 L108 240Z" fill="url(#iV)" ${O} stroke-width="2.5"/>
  <path d="M60 206 L90 204 M140 206 L110 204" stroke="#e8f2ff" stroke-width="6"/>
  <path d="M88 152 L88 168 Q100 174 112 168 L112 152" fill="url(#iS)" ${O} stroke-width="2.5"/>
  <circle cx="100" cy="108" r="44" fill="url(#iS)" ${O}/>
  <path d="M58 100 Q60 70 100 68 Q140 70 142 100 Q130 84 100 86 Q72 84 58 100Z" fill="#2a1a12" ${O} stroke-width="2.5"/>
  <path d="M52 86 Q52 40 100 38 Q148 40 148 86Z" fill="url(#iH)" ${O}/>
  <path d="M46 86 L154 86" stroke="#2a1638" stroke-width="7" stroke-linecap="round"/><path d="M46 86 L154 86" stroke="#ffe066" stroke-width="3"/>
  <path d="M100 40 V84" stroke="#f2b705" stroke-width="8" opacity=".6"/>
  <rect x="68" y="102" width="26" height="20" rx="7" fill="#ffffff55" ${O} stroke-width="3"/>
  <rect x="106" y="102" width="26" height="20" rx="7" fill="#ffffff55" ${O} stroke-width="3"/>
  <path d="M94 110 L106 110" stroke="#2a1638" stroke-width="3"/>
  <circle cx="82" cy="113" r="4" fill="#2a1638"/><circle cx="119" cy="113" r="4" fill="#2a1638"/>
  <path d="M70 96 L94 98 M106 98 L130 96" stroke="#2a1638" stroke-width="4"/>
  <path d="M88 138 Q100 134 112 138" fill="none" stroke="#2a1638" stroke-width="3"/>
  <path d="M74 140 Q100 158 126 140 Q120 152 100 154 Q80 152 74 140Z" fill="#2a1a12" opacity=".35"/>`,
);

const babi = () => svg(
  rg("bS", "#f8d6bc", "#dfa684") + lg("bK", "#d63a5a", "#8a1838") + lg("bD", "#6a4fb0", "#3b2a70"),
  `<path d="M34 240 Q32 176 70 160 L130 160 Q168 176 166 240Z" fill="url(#bD)" ${O}/>
  ${[60, 84, 116, 140].map((x, k) => tulip(x, 196 + (k % 2) * 18, 1.1, k % 2 ? "#ff4f8b" : "#ffc83d")).join("")}
  <path d="M70 160 Q100 182 130 160" fill="none" stroke="#ffc83d" stroke-width="4"/>
  <path d="M42 120 Q38 50 100 46 Q162 50 158 120 Q164 164 132 172 L100 150 L68 172 Q36 164 42 120Z" fill="url(#bK)" ${O}/>
  ${[[64, 80], [136, 80], [52, 130], [148, 130], [100, 56]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#ffc83d" ${O} stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="3" fill="#fff6e6"/>`).join("")}
  <circle cx="100" cy="112" r="40" fill="url(#bS)" ${O}/>
  <path d="M62 100 Q100 66 138 100 Q120 86 100 88 Q80 86 62 100Z" fill="#c9c2d6" ${O} stroke-width="2.5"/>
  <path d="M64 96 Q100 72 136 96" fill="none" stroke="#ffc83d" stroke-width="4"/>
  <circle cx="84" cy="114" r="11" fill="#ffffff44" ${O} stroke-width="2.5"/><circle cx="116" cy="114" r="11" fill="#ffffff44" ${O} stroke-width="2.5"/>
  <path d="M95 114 L105 114" stroke="#2a1638" stroke-width="2.5"/>
  <path d="M78 116 Q84 110 90 116 M110 116 Q116 110 122 116" fill="none" stroke="#2a1638" stroke-width="3"/>
  <path d="M72 128 l-6 2 M128 128 l6 2" stroke="#b07a5a" stroke-width="2"/>
  ${cheek(74, 130)}${cheek(126, 130)}
  <path d="M88 136 Q100 146 112 136" fill="none" stroke="#2a1638" stroke-width="3"/>`,
);

const syuy = () => svg(
  rg("yS", "#fff0e2", "#f0c4a6") + lg("yD", "#24c08a", "#0b5a4a") + lg("yC", "#ffe58a", "#d39a1c") + lg("yV", "#ffffff", "#e6dcff") + rg("yG", "#fff6c0", "#ffc83d00"),
  `<circle cx="100" cy="110" r="110" fill="url(#yG)" class="tw-halo"/>
  <path d="M62 60 Q30 150 52 240 L78 240 Q60 150 76 80Z M138 60 Q170 150 148 240 L122 240 Q140 150 124 80Z" fill="url(#yV)" ${O} opacity=".95"/>
  <path d="M40 240 Q36 176 70 160 L130 160 Q164 176 160 240Z" fill="url(#yD)" ${O}/>
  <path d="M66 162 Q100 200 134 162 L130 176 Q100 210 70 176Z" fill="url(#yC)" ${O} stroke-width="2.5"/>
  ${[78, 90, 100, 110, 122].map((x) => `<circle cx="${x}" cy="${x === 100 ? 196 : 186 - Math.abs(x - 100) * 0.4}" r="3.5" fill="#ff4f8b" ${O} stroke-width="1"/>`).join("")}
  ${tulip(70, 218, 1.2)}${tulip(130, 218, 1.2)}${tulip(100, 228, 1)}
  <path d="M74 96 Q66 160 70 200 M126 96 Q134 160 130 200" fill="none" stroke="#2a1638" stroke-width="13" stroke-linecap="round"/>
  <path d="M74 96 Q66 160 70 200 M126 96 Q134 160 130 200" fill="none" stroke="#3b2240" stroke-width="8" stroke-linecap="round" stroke-dasharray="7 4"/>
  <path d="M88 150 L88 164 Q100 170 112 164 L112 150" fill="url(#yS)" ${O} stroke-width="2.5"/>
  <circle cx="100" cy="112" r="40" fill="url(#yS)" ${O}/>
  <path d="M60 110 Q60 76 100 74 Q140 76 140 110 Q130 94 100 94 Q70 94 60 110Z" fill="#2a1638"/>
  <path d="M64 82 L70 30 Q100 6 130 30 L136 82 Q100 70 64 82Z" fill="url(#yC)" ${O}/>
  <path d="M72 70 Q100 60 128 70 M74 52 Q100 42 126 52" fill="none" stroke="#c0392b" stroke-width="3"/>
  ${[[100, 34], [86, 44], [114, 44], [100, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#2fe39a" ${O} stroke-width="1.5"/>`).join("")}
  <path d="M100 8 L104 -2 L100 -10 L96 -2Z" fill="#ffe58a" ${O} stroke-width="1.5"/>
  ${eye(85, 114, 7.5, "#0f7a5a")}${eye(115, 114, 7.5, "#0f7a5a")}
  <path d="M76 102 Q85 98 93 102 M107 102 Q115 98 124 102" fill="none" stroke="#2a1638" stroke-width="2.5"/>
  ${cheek(74, 128)}${cheek(126, 128)}
  <path d="M92 134 Q100 140 108 134" fill="none" stroke="#c0392b" stroke-width="3"/>`,
);

const voice = () => svg(
  rg("vG", "#ffffff", "#ffc83d00") + rg("vC", "#fff6c0", "#ffb020"),
  `<circle cx="100" cy="130" r="100" fill="url(#vG)" class="tw-halo"/>
  <g class="tw-float"><circle cx="100" cy="130" r="40" fill="url(#vC)" ${O} stroke-width="2.5"/>
  ${tulip(100, 130, 3.2, "#ff8a3c")}
  ${[0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${100 + Math.cos((a * Math.PI) / 180) * 62}" cy="${130 + Math.sin((a * Math.PI) / 180) * 62}" r="5" fill="#fff6c0" class="tw-spark" style="animation-delay:${a * 4}ms"/>`).join("")}</g>`,
);

export const PORTRAIT: Partial<Record<Who, () => string>> = { dania, cat, ildar, babi, syuy, voice };

// ---------- БАШНЯ СЮЮМБИКЕ ----------
/** Башня с 8 ярусами: lit — сколько ярусов «зажжено» (пройдено) */
export function towerSvg(lit = 0, w = 220) {
  const tiers = [
    { y: 300, h: 70, w: 150 }, { y: 250, h: 50, w: 126 }, { y: 210, h: 40, w: 106 }, { y: 176, h: 34, w: 88 },
    { y: 148, h: 28, w: 72 }, { y: 124, h: 24, w: 58 }, { y: 104, h: 20, w: 46 },
  ];
  const cx = 120;
  let body = `<ellipse cx="${cx}" cy="374" rx="110" ry="10" fill="#000" opacity=".25"/>`;
  tiers.forEach((t, k) => {
    const on = k < lit;
    const x = cx - t.w / 2;
    body += `<rect x="${x}" y="${t.y}" width="${t.w}" height="${t.h}" fill="${on ? "url(#twBrickOn)" : "url(#twBrick)"}" ${O} stroke-width="3"/>`;
    body += `<rect x="${x - 4}" y="${t.y - 6}" width="${t.w + 8}" height="8" rx="2" fill="#fff4e0" ${O} stroke-width="2.5"/>`;
    const n = Math.max(1, Math.floor(t.w / 34));
    for (let j = 0; j < n; j++) {
      const wx = x + ((j + 0.5) * t.w) / n;
      const ww = Math.min(14, t.w / n / 2.4);
      body += `<path d="M${wx - ww / 2} ${t.y + t.h - 6} V${t.y + t.h * 0.42} Q${wx} ${t.y + t.h * 0.12} ${wx + ww / 2} ${t.y + t.h * 0.42} V${t.y + t.h - 6}Z" fill="${on ? "#ffe9a8" : "#3b1f3a"}" stroke="#fff4e0" stroke-width="2"/>`;
    }
  });
  // арка-проезд в основании
  body += `<path d="M100 370 V336 Q120 312 140 336 V370Z" fill="#2a1430" stroke="#fff4e0" stroke-width="3"/>`;
  // шатёр + полумесяц
  const topOn = lit >= 8;
  body += `<path d="M98 100 L120 22 L142 100Z" fill="${topOn ? "url(#twSpireOn)" : "url(#twSpire)"}" ${O} stroke-width="3"/>`;
  body += `<path d="M110 66 L120 30 L130 66" fill="none" stroke="#ffffff55" stroke-width="2"/>`;
  body += `<path d="M120 22 V8" stroke="#d39a1c" stroke-width="3"/><path d="M114 6 A7 7 0 1 0 126 2 A5.5 5.5 0 1 1 114 6Z" fill="#ffd34d" ${O} stroke-width="1.5"/>`;
  if (topOn) body += `<circle cx="120" cy="10" r="26" fill="url(#twGlow)" class="tw-halo"/>`;
  return `<svg viewBox="0 0 240 384" width="${w}" xmlns="http://www.w3.org/2000/svg"><defs>
    ${lg("twBrick", "#d4583a", "#8e2a26")}${lg("twBrickOn", "#ff8a4c", "#d4583a")}${lg("twSpire", "#3fbf7f", "#14603e")}${lg("twSpireOn", "#7dffb0", "#2fbf6f")}${rg("twGlow", "#fff6c0", "#ffc83d00")}
  </defs><g transform="rotate(1.2 120 370)">${body}</g></svg>`;
}

// ---------- ФОНЫ СЦЕН ----------
const sky = (a: string, b: string) => `<defs>${lg("bgSky", a, b)}</defs><rect width="800" height="450" fill="url(#bgSky)"/>`;
const wall = (a: string, b: string) => `<defs>${lg("bgWall", a, b)}${rg("bgLamp", "#fff3c4", "#fff3c400")}</defs><rect width="800" height="450" fill="url(#bgWall)"/>`;
const floorBoards = (c: string) => `<path d="M0 360 H800 V450 H0Z" fill="${c}"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<path d="M${k * 100} 360 L${k * 100 - 60} 450" stroke="#00000033" stroke-width="3"/>`).join("")}<path d="M0 360 H800" stroke="#00000044" stroke-width="5"/>`;
const arch = (x: number, w: number, h: number, fill: string) => `<path d="M${x} 360 V${360 - h + w / 2} Q${x + w / 2} ${360 - h - w / 3} ${x + w} ${360 - h + w / 2} V360Z" fill="${fill}" stroke="#ffe3a8" stroke-width="5"/>`;
const ornamentBand = (y: number, c: string) => `<g opacity=".7">${Array.from({ length: 17 }, (_, k) => tulip(25 + k * 50, y, 1.6, c)).join("")}</g>`;
const lampLight = (x: number) => `<circle cx="${x}" cy="120" r="160" fill="url(#bgLamp)" opacity=".7"/>`;

function kremlinSilhouette(fill: string) {
  return `<g fill="${fill}"><rect x="0" y="330" width="800" height="40"/>${[40, 170, 630, 760].map((x) => `<rect x="${x - 16}" y="300" width="32" height="40"/><path d="M${x - 20} 302 L${x} 270 L${x + 20} 302Z"/>`).join("")}
  <path d="M520 340 Q520 270 570 262 Q620 270 620 340Z"/><path d="M560 264 L570 224 L580 264Z"/>${[500, 640].map((x) => `<rect x="${x - 6}" y="230" width="12" height="110"/><path d="M${x - 8} 232 L${x} 186 L${x + 8} 232Z"/>`).join("")}</g>`;
}

const RAW_BG: Record<string, () => string> = {
  prologue: () =>
    `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${sky("#ffb27a", "#ffe7b8")}
    <circle cx="640" cy="300" r="90" fill="#fff3c4" opacity=".8"/>
    ${kremlinSilhouette("#a8505066")}
    <g transform="translate(250 -10) scale(1.05)">${towerSvg(0, 240).replace(/<\/?svg[^>]*>/g, "")}</g>
    <path d="M0 400 Q400 370 800 400 V450 H0Z" fill="#6b8f4e"/><path d="M0 420 Q400 400 800 420 V450 H0Z" fill="#4f7a3c"/></svg>`,
  f1: () =>
    `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${wall("#f2c27a", "#c8803e")}${lampLight(400)}
    ${ornamentBand(60, "#c0392b")}${ornamentBand(300, "#1e7a5a")}
    ${arch(90, 140, 220, "#7a3a24")}${arch(330, 140, 240, "#2a5a8c")}${arch(570, 140, 220, "#7a3a24")}
    ${[160, 400, 640].map((x) => tulip(x, 230, 4, "#ffd34d")).join("")}${floorBoards("#8a4a2a")}</svg>`,
  f2: () =>
    `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${wall("#e9b7a0", "#a8604e")}${lampLight(400)}
    ${ornamentBand(40, "#7a1f3a")}
    ${[[80, 110, 120, 150, "#5a8fc0"], [250, 90, 140, 180, "#c08a5a"], [440, 110, 120, 150, "#8ac07a"], [610, 90, 120, 170, "#c07ab0"]].map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#d39a1c" stroke="#2a1638" stroke-width="4"/><rect x="${+x + 10}" y="${+y + 10}" width="${+w - 20}" height="${+h - 20}" fill="${c}"/><circle cx="${+x + +w / 2}" cy="${+y + +h * 0.42}" r="${+w * 0.18}" fill="#f6cfae"/><path d="M${+x + 18} ${+y + +h - 10} Q${+x + +w / 2} ${+y + +h * 0.55} ${+x + +w - 18} ${+y + +h - 10}Z" fill="#3b2240"/>`).join("")}
    ${floorBoards("#7a3a2a")}</svg>`,
  f3: () =>
    `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${wall("#ffd9a0", "#e08a4a")}${lampLight(560)}
    ${ornamentBand(50, "#c0392b")}
    <rect x="40" y="150" width="200" height="210" rx="20" fill="#fff4e0" stroke="#2a1638" stroke-width="4"/><path d="M80 360 V260 Q140 200 200 260 V360Z" fill="#ff7a3c" stroke="#2a1638" stroke-width="4"/><circle cx="140" cy="300" r="26" fill="#ffd34d" opacity=".8"/>
    <rect x="520" y="250" width="260" height="22" fill="#8a4a2a" stroke="#2a1638" stroke-width="4"/>
    <path d="M600 250 Q596 190 640 180 Q684 190 680 250Z" fill="#d39a1c" stroke="#2a1638" stroke-width="4"/><rect x="630" y="160" width="20" height="22" fill="#d39a1c" stroke="#2a1638" stroke-width="4"/><path d="M680 220 q30 0 26 26" fill="none" stroke="#2a1638" stroke-width="5"/>
    <ellipse cx="740" cy="246" rx="34" ry="12" fill="#e7a43a" stroke="#2a1638" stroke-width="3"/>${[0, 1, 2, 3, 4].map((k) => `<circle cx="${722 + k * 9}" cy="${240 - (k % 2) * 6}" r="5" fill="#ffd27a" stroke="#7a4300" stroke-width="1"/>`).join("")}
    ${floorBoards("#9a5a2a")}</svg>`,
  f4: () =>
    `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${wall("#b8d6e6", "#5a8aa8")}${lampLight(400)}
    <rect x="130" y="50" width="540" height="290" rx="10" fill="#f6e7c4" stroke="#7a4a26" stroke-width="10"/>
    <path d="M130 250 Q300 200 420 260 T670 230" fill="none" stroke="#3fa0d6" stroke-width="22"/><path d="M420 260 Q440 160 520 60" fill="none" stroke="#3fa0d6" stroke-width="14"/>
    ${[[300, 160], [380, 120], [560, 180], [250, 290]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#c0392b" stroke="#2a1638" stroke-width="2"/>`).join("")}
    <g transform="translate(440 120) scale(.28)">${towerSvg(4, 240).replace(/<\/?svg[^>]*>/g, "")}</g>
    ${floorBoards("#5a4a6a")}</svg>`,
  f5: () =>
    `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${sky("#7fd6a8", "#e6ffd8")}
    ${[60, 180, 300, 520, 640, 760].map((x, k) => `<rect x="${x - 8}" y="${200 + (k % 2) * 20}" width="16" height="160" fill="#6b4426"/><circle cx="${x}" cy="${180 + (k % 2) * 20}" r="${60 + (k % 3) * 10}" fill="${k % 2 ? "#2f8a4a" : "#3fa85a"}" stroke="#14532a" stroke-width="4"/>`).join("")}
    ${[...Array(14)].map((_, k) => `<circle cx="${(k * 61) % 800}" cy="${80 + ((k * 37) % 200)}" r="4" fill="#fff6a0" class="tw-spark" style="animation-delay:${k * 150}ms"/>`).join("")}
    <path d="M0 360 Q400 330 800 360 V450 H0Z" fill="#4f8a3c"/>${[...Array(10)].map((_, k) => tulip(40 + k * 80, 400, 2, k % 2 ? "#ff4f8b" : "#ffd34d")).join("")}</svg>`,
  f6: () =>
    `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${wall("#d8b8ff", "#6a4aa8")}${lampLight(400)}
    ${[110, 310, 510, 710].map((x) => `<ellipse cx="${x}" cy="200" rx="70" ry="110" fill="#d39a1c" stroke="#2a1638" stroke-width="4"/><ellipse cx="${x}" cy="200" rx="56" ry="94" fill="#cfe9ff"/><path d="M${x - 30} 140 L${x + 10} 120 M${x - 20} 170 L${x + 30} 140" stroke="#fff" stroke-width="6" opacity=".7"/>`).join("")}
    ${floorBoards("#4a2a6a")}</svg>`,
  f7: () =>
    `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${wall("#3a2a6a", "#1a1040")}${lampLight(400)}
    ${[[150, 150, 70], [400, 120, 95], [650, 160, 60], [280, 280, 40], [540, 290, 45]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff4e0" stroke="#d39a1c" stroke-width="8"/><path d="M${x} ${y} V${+y - +r * 0.7} M${x} ${y} L${+x + +r * 0.5} ${y}" stroke="#2a1638" stroke-width="5" stroke-linecap="round" class="tw-hand" style="transform-origin:${x}px ${y}px"/>`).join("")}
    ${floorBoards("#2a1a4a")}</svg>`,
  top: () =>
    `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${sky("#ff8a5e", "#ffe7a8")}
    <circle cx="400" cy="300" r="120" fill="#fff3c4"/><circle cx="400" cy="300" r="200" fill="#fff3c4" opacity=".35"/>
    ${kremlinSilhouette("#7a3a4a88")}
    <path d="M0 370 H800 V450 H0Z" fill="#8e2a26"/><path d="M0 370 H800" stroke="#fff4e0" stroke-width="10"/>
    ${[60, 200, 340, 480, 620, 760].map((x) => `<rect x="${x - 14}" y="340" width="28" height="30" fill="#d4583a" stroke="#2a1638" stroke-width="3"/>`).join("")}</svg>`,
};

export const SCENE_BG: Record<string, () => string> = Object.fromEntries(
  Object.entries(RAW_BG).map(([k, fn]) => [k, () => fn().replace(/bg(Sky|Wall|Lamp)/g, `bg$1_${k}`).replace(/tw(Brick|BrickOn|Spire|SpireOn|Glow)\b/g, `tw$1_${k}`)]),
);
