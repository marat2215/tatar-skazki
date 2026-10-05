// Татарский алфавит (кириллица, 39 букв) с латинским соответствием (Заманәлиф)
export type Letter = { cyr: string; lat: string; special?: { ru: string; en: string } };

export const ALPHABET: Letter[] = [
  { cyr: "А", lat: "A" },
  { cyr: "Ә", lat: "Ä", special: { ru: "Мягкое «а», как в слове «пять»", en: "Front “a”, like in “cat”" } },
  { cyr: "Б", lat: "B" }, { cyr: "В", lat: "V/W" }, { cyr: "Г", lat: "G/Ğ" }, { cyr: "Д", lat: "D" },
  { cyr: "Е", lat: "E/Ye" }, { cyr: "Ё", lat: "Yo" }, { cyr: "Ж", lat: "J" },
  { cyr: "Җ", lat: "C", special: { ru: "Звонкое «дж», как в слове «джем»", en: "Voiced “j”, like in “jam”" } },
  { cyr: "З", lat: "Z" }, { cyr: "И", lat: "I" }, { cyr: "Й", lat: "Y" }, { cyr: "К", lat: "K/Q" },
  { cyr: "Л", lat: "L" }, { cyr: "М", lat: "M" }, { cyr: "Н", lat: "N" },
  { cyr: "Ң", lat: "Ñ", special: { ru: "Носовое «нг», как в английском «sing»", en: "Nasal “ng”, like in “sing”" } },
  { cyr: "О", lat: "O" },
  { cyr: "Ө", lat: "Ö", special: { ru: "Губное мягкое «о», как немецкое ö", en: "Rounded front “o”, like German ö" } },
  { cyr: "П", lat: "P" }, { cyr: "Р", lat: "R" }, { cyr: "С", lat: "S" }, { cyr: "Т", lat: "T" },
  { cyr: "У", lat: "U/W" },
  { cyr: "Ү", lat: "Ü", special: { ru: "Губное мягкое «у», как немецкое ü", en: "Rounded front “u”, like German ü" } },
  { cyr: "Ф", lat: "F" }, { cyr: "Х", lat: "X" },
  { cyr: "Һ", lat: "H", special: { ru: "Лёгкий выдох, как английское h", en: "Soft breathy “h”, like English h" } },
  { cyr: "Ц", lat: "Ts" }, { cyr: "Ч", lat: "Ç" }, { cyr: "Ш", lat: "Ş" }, { cyr: "Щ", lat: "Şç" },
  { cyr: "Ъ", lat: "’" }, { cyr: "Ы", lat: "I" }, { cyr: "Ь", lat: "’" }, { cyr: "Э", lat: "E" },
  { cyr: "Ю", lat: "Yu/Yü" }, { cyr: "Я", lat: "Ya/Yä" },
];
