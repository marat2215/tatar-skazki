// Кириллица → латиница (Заманәлиф, упрощённо) — та же логика, что в scripts/translit.py
const BASE: Record<string, string> = {
  а: "a", ә: "ä", б: "b", в: "v", д: "d", ж: "j", җ: "c", з: "z", и: "i", й: "y", л: "l",
  м: "m", н: "n", ң: "ñ", о: "o", ө: "ö", п: "p", р: "r", с: "s", т: "t", у: "u", ү: "ü", ф: "f",
  х: "x", һ: "h", ц: "ts", ч: "ç", ш: "ş", щ: "şç", ъ: "", ь: "", ы: "ı", э: "e", ё: "yo",
};
const BACK = "аоуы";
const VOW = "аәеёиоөуүыэюя";

function latWord(w: string): string {
  const low = w.toLowerCase();
  const back = ![...low].some((c) => "әеиөүэ".includes(c));
  return [...w]
    .map((ch, i) => {
      const c = ch.toLowerCase();
      const nx = low[i + 1] ?? "";
      const pv = low[i - 1] ?? "";
      const start = i === 0 || VOW.includes(pv) || "ъь".includes(pv);
      let l: string;
      const hard = (nx !== "" && BACK.includes(nx)) || (back && !(nx !== "" && VOW.includes(nx)));
      if (c === "к") l = hard ? "q" : "k";
      else if (c === "г") l = hard ? "ğ" : "g";
      else if (c === "е") l = start ? "ye" : "e";
      else if (c === "ю") l = back ? "yu" : "yü";
      else if (c === "я") l = back ? "ya" : "yä";
      else l = BASE[c] ?? ch;
      return ch !== c && l ? l[0].toUpperCase() + l.slice(1) : l;
    })
    .join("");
}

export const toLatin = (s: string) => s.replace(/[А-Яа-яЁёӘәӨөҮүҖҗҢңҺһ]+/g, latWord);
