"""Перевод татарского текста с кириллицы на латиницу (Заманәлиф, упрощённо).

Правила приблизительные: к/г перед твёрдыми гласными -> q/ğ.
Готовый текст на латинице желательно проверить носителю.
"""

BACK = set("аоуыАОУЫ")
VOWELS = set("аәеёиоөуүыэюяАӘЕЁИОӨУҮЫЭЮЯ")

BASE = {
    "а": "a", "ә": "ä", "б": "b", "в": "v", "д": "d", "ж": "j", "җ": "c",
    "з": "z", "и": "i", "й": "y", "л": "l", "м": "m", "н": "n", "ң": "ñ",
    "о": "o", "ө": "ö", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ү": "ü", "ф": "f", "х": "x", "һ": "h", "ц": "ts", "ч": "ç", "ш": "ş",
    "щ": "şç", "ъ": "", "ь": "", "ы": "ı", "э": "e", "ё": "yo",
}


def _word_is_back(word):
    """Грубо: слово «твёрдое», если в нём нет мягких гласных."""
    low = word.lower()
    return not any(c in "әеиөүэ" for c in low)


def to_latin(text):
    out = []
    word = ""
    for ch in text + "\n":
        if ch.isalpha():
            word += ch
            continue
        if word:
            out.append(_word(word))
            word = ""
        out.append(ch)
    return "".join(out)[:-1]


def _word(word):
    back = _word_is_back(word)
    res = []
    for i, ch in enumerate(word):
        low = ch.lower()
        nxt = word[i + 1].lower() if i + 1 < len(word) else ""
        prev = word[i - 1].lower() if i > 0 else ""
        start_or_after_vowel = i == 0 or prev in VOWELS or prev in "ъь"
        if low == "к":
            lat = "q" if ((nxt and nxt in BACK) or (back and nxt not in VOWELS)) else "k"
        elif low == "г":
            lat = "ğ" if ((nxt and nxt in BACK) or (back and nxt not in VOWELS)) else "g"
        elif low == "е":
            lat = "ye" if start_or_after_vowel else "e"
        elif low == "ю":
            lat = "yu" if back else "yü"
        elif low == "я":
            lat = "ya" if back else "yä"
        else:
            lat = BASE.get(low, ch)
        if ch.isupper() and lat:
            lat = lat[0].upper() + lat[1:]
        res.append(lat)
    return "".join(res)


if __name__ == "__main__":
    print(to_latin("Кечкенә куян урманда яши иде. Хәерле төн, йолдызлар!"))
