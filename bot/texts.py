"""Тексты интерфейса бота на 4 языках: русский, английский, турецкий, финский."""

LANGS = {"ru": "🇷🇺 Русский", "en": "🇬🇧 English", "tr": "🇹🇷 Türkçe", "fi": "🇫🇮 Suomi"}

T = {
    "choose_lang": {l: "🌐 Выберите язык · Choose language · Dil seçin · Valitse kieli" for l in LANGS},
    "choose_alpha": {
        "ru": "Как показывать татарский текст?",
        "en": "How should Tatar text be shown?",
        "tr": "Tatarca metin hangi alfabeyle gösterilsin?",
        "fi": "Millä aakkosilla tatarinkielinen teksti näytetään?"},
    "cyr": {"ru": "Кириллица", "en": "Cyrillic", "tr": "Kiril", "fi": "Kyrilliset"},
    "lat": {"ru": "Латиница", "en": "Latin", "tr": "Latin", "fi": "Latinalaiset"},
    "both": {"ru": "Оба", "en": "Both", "tr": "İkisi de", "fi": "Molemmat"},
    "welcome": {
        "ru": "Исәнмесез! 👋 Добро пожаловать!\n\nЗдесь можно учить татарский язык:\n🌙 сказки с озвучкой\n☀️ слово дня\n📜 пословицы\n❓ викторины\n🎓 уроки\n🐉 мифические существа\n🎮 игры — кнопки внизу\n\nКаждое утро я пришлю слово дня, а вечером — сказку. Язык, алфавит и рассылка — в «⚙️ Настройки».",
        "en": "Isänmesez! 👋 Welcome!\n\nLearn the Tatar language here:\n🌙 fairy tales with audio\n☀️ word of the day\n📜 proverbs\n❓ quizzes\n🎓 lessons\n🐉 mythical creatures\n🎮 games — buttons below\n\nEvery morning I'll send the word of the day and every evening a fairy tale. Language, alphabet and notifications are under the ⚙️ button.",
        "tr": "İsänmesez! 👋 Hoş geldiniz!\n\nBurada Tatarca öğrenebilirsiniz:\n🌙 sesli masallar\n☀️ günün kelimesi\n📜 atasözleri\n❓ bilgi yarışmaları\n🎓 dersler\n🐉 mitolojik varlıklar\n🎮 oyunlar — aşağıdaki düğmeler\n\nHer sabah günün kelimesini, her akşam bir masal göndereceğim. Dil, alfabe ve bildirimler ⚙️ düğmesinde.",
        "fi": "Isänmesez! 👋 Tervetuloa!\n\nTäällä voit opiskella tataarin kieltä:\n🌙 satuja äänitteinä\n☀️ päivän sana\n📜 sananlaskut\n❓ tietovisat\n🎓 oppitunnit\n🐉 taruolennot\n🎮 pelit — painikkeet alla\n\nLähetän joka aamu päivän sanan ja joka ilta sadun. Kieli, aakkoset ja ilmoitukset löytyvät ⚙️-painikkeesta."},
    "choose_story": {"ru": "🌙 Выберите сказку:", "en": "🌙 Choose a fairy tale:", "tr": "🌙 Bir masal seçin:", "fi": "🌙 Valitse satu:"},
    "word_title": {"ru": "фраза дня", "en": "phrase of the day", "tr": "günün sözü", "fi": "päivän fraasi"},
    "repeat": {"ru": "Послушайте и повторите вслух!", "en": "Listen and repeat aloud!", "tr": "Dinleyin ve yüksek sesle tekrarlayın!", "fi": "Kuuntele ja toista ääneen!"},
    "more_phrase": {"ru": "🔁 Ещё фраза", "en": "🔁 Another phrase", "tr": "🔁 Başka bir söz", "fi": "🔁 Uusi fraasi"},
    "proverb": {"ru": "Пословица", "en": "Proverb", "tr": "Atasözü", "fi": "Sananlasku"},
    "more_proverb": {"ru": "🔁 Ещё пословица", "en": "🔁 Another proverb", "tr": "🔁 Başka bir atasözü", "fi": "🔁 Uusi sananlasku"},
    "quiz_q": {"ru": "❓ Что значит «{w}»?", "en": "❓ What does «{w}» mean?", "tr": "❓ «{w}» ne demek?", "fi": "❓ Mitä «{w}» tarkoittaa?"},
    "correct": {"ru": "✅ Дөрес! Верно!", "en": "✅ Döres! Correct!", "tr": "✅ Döres! Doğru!", "fi": "✅ Döres! Oikein!"},
    "wrong": {"ru": "❌ Ялгыш. Правильно: {a}", "en": "❌ Yalğış. Correct answer: {a}", "tr": "❌ Yalğış. Doğrusu: {a}", "fi": "❌ Yalğış. Oikea vastaus: {a}"},
    "score": {"ru": "🏆 Счёт: {r} из {t}", "en": "🏆 Score: {r} of {t}", "tr": "🏆 Puan: {r} / {t}", "fi": "🏆 Pisteet: {r} / {t}"},
    "next_q": {"ru": "➡️ Следующий вопрос", "en": "➡️ Next question", "tr": "➡️ Sonraki soru", "fi": "➡️ Seuraava kysymys"},
    "choose_lesson": {"ru": "🎓 Выберите урок:", "en": "🎓 Choose a lesson:", "tr": "🎓 Bir ders seçin:", "fi": "🎓 Valitse oppitunti:"},
    "lesson": {"ru": "Урок", "en": "Lesson", "tr": "Ders", "fi": "Oppitunti"},
    "listen_each": {"ru": "🔊 Послушайте и повторите каждую фразу", "en": "🔊 Listen and repeat each phrase", "tr": "🔊 Her sözü dinleyin ve tekrarlayın", "fi": "🔊 Kuuntele ja toista jokainen fraasi"},
    "check": {"ru": "📝 Проверить себя", "en": "📝 Test yourself", "tr": "📝 Kendini sına", "fi": "📝 Testaa itsesi"},
    "lesson_q": {"ru": "Вопрос {i}/{n}\nКак сказать по-татарски:\n«{x}»", "en": "Question {i}/{n}\nHow do you say in Tatar:\n«{x}»", "tr": "Soru {i}/{n}\nTatarca nasıl denir:\n«{x}»", "fi": "Kysymys {i}/{n}\nMiten sanotaan tataariksi:\n«{x}»"},
    "lesson_done": {"ru": "🎉 Урок пройден! Правильно {ok} из {n}.\nБулдырдың!", "en": "🎉 Lesson complete! {ok} of {n} correct.\nBuldırdıñ!", "tr": "🎉 Ders tamamlandı! {n} sorudan {ok} doğru.\nBuldırdıñ!", "fi": "🎉 Oppitunti suoritettu! {ok}/{n} oikein.\nBuldırdıñ!"},
    "other_lessons": {"ru": "🎓 Другие уроки", "en": "🎓 Other lessons", "tr": "🎓 Diğer dersler", "fi": "🎓 Muut oppitunnit"},
    "restart": {"ru": "Начните урок заново", "en": "Please restart the lesson", "tr": "Dersi yeniden başlatın", "fi": "Aloita oppitunti alusta"},
    "settings": {"ru": "⚙️ Настройки\n\nЯзык, алфавит и ежедневная рассылка (08:00 слово дня, 19:00 сказка):",
                 "en": "⚙️ Settings\n\nLanguage, alphabet and daily messages (08:00 word of the day, 19:00 fairy tale, Kazan time):",
                 "tr": "⚙️ Ayarlar\n\nDil, alfabe ve günlük mesajlar (08:00 günün sözü, 19:00 masal, Kazan saati):",
                 "fi": "⚙️ Asetukset\n\nKieli, aakkoset ja päivittäiset viestit (08:00 päivän sana, 19:00 satu, Kazanin aikaa):"},
    "sub_on": {"ru": "🔔 Рассылка: вкл", "en": "🔔 Daily messages: on", "tr": "🔔 Günlük mesaj: açık", "fi": "🔔 Päivittäiset viestit: päällä"},
    "sub_off": {"ru": "🔕 Рассылка: выкл", "en": "🔕 Daily messages: off", "tr": "🔕 Günlük mesaj: kapalı", "fi": "🔕 Päivittäiset viestit: pois"},
    "saved": {"ru": "Сохранено", "en": "Saved", "tr": "Kaydedildi", "fi": "Tallennettu"},
    "menu": {"ru": "Выберите раздел в меню 👇", "en": "Choose a section in the menu 👇", "tr": "Menüden bir bölüm seçin 👇", "fi": "Valitse osio valikosta 👇"},
    "games": {"ru": "🎮 Игры на татарском — нажмите кнопку игры внизу или «🎮 Игры» в меню:",
              "en": "🎮 Games in Tatar — tap a game button below or «🎮 Games» in the menu:",
              "tr": "🎮 Tatarca oyunlar — aşağıdaki oyun düğmesine veya menüdeki «🎮 Oyunlar»a dokunun:",
              "fi": "🎮 Pelejä tataariksi — napauta pelipainiketta alla tai valikon «🎮 Pelit»:"},
    "myth_list": {"ru": "🐉 Мифические существа татарского фольклора — выберите:",
                  "en": "🐉 Mythical creatures of Tatar folklore — choose one:",
                  "tr": "🐉 Tatar folklorunun mitolojik varlıkları — birini seçin:",
                  "fi": "🐉 Tataarilaisen kansanperinteen taruolennot — valitse:"},
    "myth_next": {"ru": "➡️ Следующее", "en": "➡️ Next", "tr": "➡️ Sonraki", "fi": "➡️ Seuraava"},
    "myth_all": {"ru": "📖 Все существа", "en": "📖 All creatures", "tr": "📖 Tüm varlıklar", "fi": "📖 Kaikki olennot"},
    "admin_msg": {"ru": "💬 Отзывы, идеи, ошибки в переводах — пишите админу, он читает всё. Рәхмәт!",
                  "en": "💬 Feedback, ideas or translation mistakes — write to the admin, every message is read. Räxmät!",
                  "tr": "💬 Görüş, öneri veya çeviri hataları — yöneticiye yazın, her mesaj okunur. Räxmät!",
                  "fi": "💬 Palautetta, ideoita tai käännösvirheitä — kirjoita ylläpitäjälle, jokainen viesti luetaan. Räxmät!"},
    "play": {"ru": "🎮 Играть", "en": "🎮 Play", "tr": "🎮 Oyna", "fi": "🎮 Pelaa"},
    "listen": {"ru": "Әкият тыңлагыз! Хәерле төн!", "en": "Listen to the tale! Xäyerle tön — good night!", "tr": "Masalı dinleyin! Xäyerle tön — iyi geceler!", "fi": "Kuuntele satu! Xäyerle tön — hyvää yötä!"},
}


def t(key, lang, **kw):
    s = T[key].get(lang) or T[key]["ru"]
    return s.format(**kw) if kw else s
