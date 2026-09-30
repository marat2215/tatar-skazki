// Общие функции игр: язык интерфейса, алфавит, транслитерация, Telegram.
const TG = window.Telegram?.WebApp; TG?.ready(); TG?.expand();
const Q = new URLSearchParams(location.search);
const LANGS = ["ru", "en", "tr", "fi"];
function pickLang() {
  let l = Q.get("lang");
  if (!l) try { l = localStorage.getItem("lang"); } catch (e) {}
  if (!l) l = (TG?.initDataUnsafe?.user?.language_code || navigator.language || "ru").slice(0, 2);
  return LANGS.includes(l) ? l : (l === "tt" ? "ru" : "en");
}
const LANG = pickLang();
const ALPHA = ["cyr", "lat", "both"].includes(Q.get("a")) ? Q.get("a") : "cyr";
try { localStorage.setItem("lang", LANG); } catch (e) {}
const QS = `?lang=${LANG}&a=${ALPHA}`;
document.documentElement.lang = LANG;

// Кириллица -> латиница (Заманәлиф, упрощённо), как в scripts/translit.py
const BASE = { "а": "a", "ә": "ä", "б": "b", "в": "v", "д": "d", "ж": "j", "җ": "c", "з": "z", "и": "i", "й": "y", "л": "l",
  "м": "m", "н": "n", "ң": "ñ", "о": "o", "ө": "ö", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ү": "ü", "ф": "f",
  "х": "x", "һ": "h", "ц": "ts", "ч": "ç", "ш": "ş", "щ": "şç", "ъ": "", "ь": "", "ы": "ı", "э": "e", "ё": "yo" };
const BACK = "аоуы", VOW = "аәеёиоөуүыэюя";
function latWord(w) {
  const low = w.toLowerCase(), back = ![...low].some(c => "әеиөүэ".includes(c));
  let out = "";
  [...w].forEach((ch, i) => {
    const c = ch.toLowerCase(), nx = low[i + 1] || "", pv = low[i - 1] || "";
    const start = i === 0 || VOW.includes(pv) || "ъь".includes(pv);
    let l;
    if (c === "к") l = (BACK.includes(nx) && nx) || (back && !(nx && VOW.includes(nx))) ? "q" : "k";
    else if (c === "г") l = (BACK.includes(nx) && nx) || (back && !(nx && VOW.includes(nx))) ? "ğ" : "g";
    else if (c === "е") l = start ? "ye" : "e";
    else if (c === "ю") l = back ? "yu" : "yü";
    else if (c === "я") l = back ? "ya" : "yä";
    else l = BASE[c] ?? ch;
    if (ch !== c && l) l = l[0].toUpperCase() + l.slice(1);
    out += l;
  });
  return out;
}
const lat = s => s.replace(/[А-Яа-яЁёӘәӨөҮүҖҗҢңҺһ]+/g, latWord);
// Татарский текст по выбранному алфавиту
const tt = s => ALPHA === "lat" ? lat(s) : s;
const ttFull = s => ALPHA === "both" ? `${s} <small style="opacity:.6">(${lat(s)})</small>` : tt(s);

// Общие тексты интерфейса
const UI = {
  back: { ru: "← Уеннар", en: "← Games", tr: "← Oyunlar", fi: "← Pelit" },
  best: { ru: "Рекорд", en: "Best", tr: "Rekor", fi: "Ennätys" },
  score: { ru: "Очки", en: "Score", tr: "Puan", fi: "Pisteet" },
};
const ui = (obj) => obj[LANG] || obj.ru;
const haptic = (kind) => { try { kind === "ok" ? TG?.HapticFeedback?.notificationOccurred("success") : kind === "bad" ? TG?.HapticFeedback?.notificationOccurred("error") : TG?.HapticFeedback?.selectionChanged(); } catch (e) {} };
