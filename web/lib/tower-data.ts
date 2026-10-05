// «Башня Сююмбике» — сценарий игры (по документу автора, с правками татарского).
// Каждая реплика: tt — татарский текст, t — перевод на ru/en/tr/fi.
export type L = { ru: string; en: string; tr: string; fi: string };
export type Who = "voice" | "dania" | "cat" | "ildar" | "babi" | "syuy" | "narr";
export type Opt = { tt: string; t: L; reply?: { tt: string; t: L }; ending?: 1 | 2 | 3; ok?: boolean };
export type Step =
  | { k: "say"; who: Who; tt?: string; t: L }
  | { k: "build"; prompt: L; words: string[]; answer: string[] }
  | { k: "choice"; who: Who; tt: string; t: L; opts: Opt[] }
  | { k: "match"; prompt: L; pairs: [string, L][] }
  | { k: "order"; prompt: L; items: [string, L][] }
  | { k: "odd"; prompt: L; items: string[]; answer: string; why: L }
  | { k: "vocab"; words: [string, L][] };
export type Scene = { id: string; floor: number; tt: string; t: L; place: L; hue: number; steps: Step[] };

const l = (ru: string, en: string, tr: string, fi: string): L => ({ ru, en, tr, fi });
const say = (who: Who, tt: string | undefined, t: L): Step => ({ k: "say", who, tt, t });
const w = (tt: string, ru: string, en: string, trk: string, fi: string): [string, L] => [tt, l(ru, en, trk, fi)];

export const WHO: Record<Who, L> = {
  voice: l("Голос башни", "Voice of the tower", "Kulenin sesi", "Tornin ääni"),
  dania: l("Дания", "Dania", "Daniya", "Dania"),
  cat: l("Кот Баем", "Bayem the cat", "Kedi Bayem", "Kissa Bayem"),
  ildar: l("Ильдар", "Ildar", "İldar", "Ildar"),
  babi: l("Бабушка Фирдәвес", "Grandma Firdaves", "Büyükanne Firdevs", "Isoäiti Firdaves"),
  syuy: l("Сююмбике", "Söyembikä", "Süyümbike", "Söyembikä"),
  narr: l("", "", "", ""),
};

export const UI = {
  title: l("Башня Сююмбике", "Söyembikä Tower", "Süyümbike Kulesi", "Söyembikän torni"),
  lead: l(
    "Головоломка-история: поднимитесь на вершину башни, разгадывая загадки на татарском.",
    "A story puzzle: climb the tower by solving riddles in Tatar.",
    "Hikâyeli bulmaca: Tatarca bilmeceleri çözerek kulenin tepesine çıkın.",
    "Tarinallinen pulmapeli: kiipeä torniin ratkaisemalla arvoituksia tatariksi.",
  ),
  start: l("Начать игру", "Start the game", "Oyuna başla", "Aloita peli"),
  cont: l("Продолжить", "Continue", "Devam et", "Jatka"),
  restart: l("Начать заново", "Start over", "Baştan başla", "Aloita alusta"),
  next: l("Дальше", "Next", "İleri", "Seuraava"),
  check: l("Проверить", "Check", "Kontrol et", "Tarkista"),
  reset: l("Сбросить", "Reset", "Sıfırla", "Tyhjennä"),
  diary: l("Дневник", "Diary", "Günlük", "Päiväkirja"),
  words: l("слов в дневнике", "words in the diary", "günlükteki kelime", "sanaa päiväkirjassa"),
  newWords: l("Новые слова в дневник", "New words for the diary", "Günlüğe yeni kelimeler", "Uusia sanoja päiväkirjaan"),
  wrong: l("Кабатла — попробуй ещё раз", "Кабатла — try again", "Кабатла — tekrar dene", "Кабатла — yritä uudelleen"),
  right: l("Афәрин! Верно", "Афәрин! Correct", "Афәрин! Doğru", "Афәрин! Oikein"),
  floor: l("Этаж", "Floor", "Kat", "Kerros"),
  hint: l("Показывать перевод", "Show translation", "Çeviriyi göster", "Näytä käännös"),
  ending: l("Концовка", "Ending", "Son", "Loppu"),
  mistakes: l("Ошибок", "Mistakes", "Hata", "Virheitä"),
  close: l("Закрыть", "Close", "Kapat", "Sulje"),
  tapWords: l("Нажимайте слова по порядку", "Tap the words in order", "Kelimelere sırayla dokunun", "Napauta sanoja järjestyksessä"),
  tapOrder: l("Нажимайте по порядку", "Tap in the right order", "Doğru sırayla dokunun", "Napauta oikeassa järjestyksessä"),
};

export const SCENES: Scene[] = [
  {
    id: "prologue", floor: 0, tt: "Нигез", hue: 210,
    t: l("Основание", "Foundation", "Temel", "Perustus"),
    place: l("Подножие башни, 6:30", "Foot of the tower, 6:30", "Kulenin dibi, 6.30", "Tornin juurella klo 6.30"),
    steps: [
      say("ildar", undefined, l("Дания! Ты рано. Это просто старая башня: наклон, трещины, работа. Никакой мистики.", "Dania! You're early. It's just an old tower: a tilt, cracks, work. No magic.", "Daniya! Erkencisin. Bu sadece eski bir kule: eğim, çatlaklar, iş. Mistisizm yok.", "Dania! Olet aikaisin. Se on vain vanha torni: kallistuma, halkeamia, työtä. Ei mitään mystiikkaa.")),
      say("dania", undefined, l("Наклон — почти два метра. Ладно. Работа. (Она касается стены — вспышка света.)", "Almost two metres of tilt. Fine. Work. (She touches the wall — a flash of light.)", "Neredeyse iki metre eğim. Peki. İş. (Duvara dokunur — bir ışık parlar.)", "Lähes kaksi metriä kallistusta. No niin. Töihin. (Hän koskettaa seinää — valo välähtää.)")),
      say("voice", "Исәнме, кызым.", l("Здравствуй, дочка.", "Hello, my daughter.", "Merhaba kızım.", "Hei, tyttäreni.")),
      say("voice", "Мин — манара. Мин — Сөембикә. Син ишетер өчен килдең.", l("Я — башня. Я — Сююмбике. Ты пришла, чтобы услышать.", "I am the tower. I am Söyembikä. You came to hear.", "Ben kuleyim. Ben Süyümbike'yim. Duymak için geldin.", "Minä olen torni. Minä olen Söyembikä. Tulit kuulemaan.")),
      say("voice", "Аңларсың. Өйрән. Мин сиңа ярдәм итәм.", l("Поймёшь. Учись. Я тебе помогу.", "You will understand. Learn. I will help you.", "Anlayacaksın. Öğren. Sana yardım ediyorum.", "Ymmärrät kyllä. Opi. Minä autan sinua.")),
      say("cat", "Исәнме, Дания. Мин һәрвакыт сөйләшәм. Син генә ишетми идең.", l("Здравствуй, Дания. Я всегда говорю. Только ты не слышала.", "Hello, Dania. I always talk. You just didn't hear.", "Merhaba Daniya. Ben hep konuşurum. Sadece sen duymuyordun.", "Hei, Dania. Puhun aina. Sinä vain et kuullut.")),
      { k: "vocab", words: [
        w("исәнме", "здравствуй", "hello", "merhaba", "hei"),
        w("кызым", "дочка (моя)", "my daughter", "kızım", "tyttäreni"),
        w("мин", "я", "I", "ben", "minä"),
        w("син", "ты", "you", "sen", "sinä"),
        w("өйрән", "учись", "learn!", "öğren", "opi"),
        w("ярдәм итәм", "помогаю", "I help", "yardım ediyorum", "autan"),
      ] },
      { k: "build", prompt: l("Ответь башне: «Здравствуй, я Дания»", "Answer the tower: “Hello, I am Dania”", "Kuleye cevap ver: “Merhaba, ben Daniya”", "Vastaa tornille: ”Hei, olen Dania”"),
        words: ["Дания", "Исәнме", "мин", "син", "кызым"], answer: ["Исәнме", "мин", "Дания"] },
      say("voice", "Мен. Һәр баскыч — бер сер. Һәр сер — бер сүз.", l("Поднимайся. Каждая ступень — одна тайна. Каждая тайна — одно слово.", "Climb. Every step is a secret. Every secret is a word.", "Çık. Her basamak bir sır. Her sır bir kelime.", "Nouse. Jokainen porras on salaisuus. Jokainen salaisuus on sana.")),
      { k: "choice", who: "voice", tt: "Син әзерме?", t: l("Ты готова?", "Are you ready?", "Hazır mısın?", "Oletko valmis?"), opts: [
        { tt: "Мин менәм.", t: l("Я поднимаюсь.", "I'm climbing.", "Çıkıyorum.", "Nousen."), reply: { tt: "Афәрин!", t: l("Молодец!", "Well done!", "Aferin!", "Hienoa!") } },
        { tt: "Мин куркам.", t: l("Я боюсь.", "I'm afraid.", "Korkuyorum.", "Pelkään."), reply: { tt: "Курку — көч.", t: l("Страх — это сила.", "Fear is strength.", "Korku güçtür.", "Pelko on voimaa.") } },
        { tt: "Мин әзер түгел.", t: l("Я не готова.", "I'm not ready.", "Hazır değilim.", "En ole valmis."), reply: { tt: "Әзер булгач, мен. Мин көтәм.", t: l("Когда будешь готова — поднимайся. Я жду.", "When you're ready, climb. I'm waiting.", "Hazır olunca çık. Bekliyorum.", "Kun olet valmis, nouse. Odotan.") } },
      ] },
    ],
  },
  {
    id: "f1", floor: 1, tt: "Исәнмесез", hue: 42,
    t: l("Здравствуйте", "Hello", "Merhaba", "Hyvää päivää"),
    place: l("Первый этаж: комната с орнаментами", "First floor: the ornament room", "Birinci kat: süslemeli oda", "Ensimmäinen kerros: ornamenttihuone"),
    steps: [
      say("cat", "Беренче баскыч. Исәнмесез — беренче сүз.", l("Первая ступень. «Исәнмесез» — первое слово.", "The first step. “Isänmesez” is the first word.", "İlk basamak. “İsänmesez” ilk kelime.", "Ensimmäinen porras. ”Isänmesez” on ensimmäinen sana.")),
      { k: "vocab", words: [
        w("исәнмесез", "здравствуйте (вежливо)", "hello (polite)", "merhaba (kibar)", "hyvää päivää (kohtelias)"),
        w("рәхмәт", "спасибо", "thank you", "teşekkürler", "kiitos"),
        w("хәлләр ничек?", "как дела?", "how are you?", "nasılsın?", "mitä kuuluu?"),
        w("яхшы", "хорошо", "good", "iyi", "hyvä"),
        w("начар", "плохо", "bad", "kötü", "huono"),
      ] },
      say("voice", "Беренче баскыч. Син үзеңне таныштырырга тиеш.", l("Первая ступень. Ты должна представиться.", "The first step. You must introduce yourself.", "İlk basamak. Kendini tanıtmalısın.", "Ensimmäinen porras. Sinun täytyy esittäytyä.")),
      { k: "build", prompt: l("Собери: «Здравствуйте, я Дания»", "Build: “Hello, I am Dania”", "Kur: “Merhaba, ben Daniya”", "Rakenna: ”Hyvää päivää, olen Dania”"),
        words: ["Дания", "Исәнмесез", "мин", "син", "рәхмәт"], answer: ["Исәнмесез", "мин", "Дания"] },
      say("voice", "Афәрин. Син үзеңне таныштырдың.", l("Молодец. Ты представилась.", "Well done. You introduced yourself.", "Aferin. Kendini tanıttın.", "Hienoa. Esittäydyit.")),
      { k: "choice", who: "voice", tt: "Хәлләр ничек?", t: l("Как дела?", "How are you?", "Nasılsın?", "Mitä kuuluu?"), opts: [
        { tt: "Яхшы, рәхмәт.", t: l("Хорошо, спасибо.", "Fine, thanks.", "İyiyim, teşekkürler.", "Hyvin, kiitos."), reply: { tt: "Яхшы. Дәвам ит.", t: l("Хорошо. Продолжай.", "Good. Go on.", "Güzel. Devam et.", "Hyvä. Jatka.") } },
        { tt: "Начар.", t: l("Плохо.", "Bad.", "Kötü.", "Huonosti."), reply: { tt: "Ничек ярдәм итәргә?", t: l("Как тебе помочь?", "How can I help?", "Nasıl yardım edebilirim?", "Miten voin auttaa?") } },
        { tt: "Мин белмим.", t: l("Я не знаю.", "I don't know.", "Bilmiyorum.", "En tiedä."), reply: { tt: "Белмәү — оят түгел. Өйрәнү — көч.", t: l("Не знать — не стыдно. Учиться — сила.", "Not knowing is no shame. Learning is strength.", "Bilmemek ayıp değil. Öğrenmek güçtür.", "Tietämättömyys ei ole häpeä. Oppiminen on voimaa.") } },
      ] },
      { k: "choice", who: "voice", tt: "Син кем?", t: l("Кто ты?", "Who are you?", "Sen kimsin?", "Kuka olet?"), opts: [
        { tt: "Мин Дания. Мин реставратор.", t: l("Я Дания. Я реставратор.", "I'm Dania. I'm a restorer.", "Ben Daniya. Restoratörüm.", "Olen Dania. Olen restauroija.") },
        { tt: "Мин татар.", t: l("Я татарка.", "I'm Tatar.", "Ben Tatarım.", "Olen tataari.") },
        { tt: "Мин Чаллыдан.", t: l("Я из Челнов.", "I'm from Chelny.", "Çallı'danım.", "Olen Tšallysta.") },
      ] },
      say("voice", "Матур исем. Телне оныттың, әмма йөрәк хәтерли.", l("Красивое имя. Язык ты забыла, но сердце помнит.", "A beautiful name. You forgot the language, but the heart remembers.", "Güzel bir isim. Dili unuttun ama kalp hatırlıyor.", "Kaunis nimi. Unohdit kielen, mutta sydän muistaa.")),
      { k: "vocab", words: [
        w("кем", "кто", "who", "kim", "kuka"),
        w("матур", "красивый", "beautiful", "güzel", "kaunis"),
        w("исем", "имя", "name", "isim", "nimi"),
        w("йөрәк", "сердце", "heart", "yürek", "sydän"),
        w("хәтерли", "помнит", "remembers", "hatırlıyor", "muistaa"),
      ] },
      say("ildar", undefined, l("Ты где была полчаса? В башне нет лестницы, она полая. Что ты там слышала?", "Where were you for half an hour? There are no stairs in the tower. What did you hear?", "Yarım saattir neredeydin? Kulede merdiven yok. Ne duydun?", "Missä olit puoli tuntia? Tornissa ei ole portaita. Mitä kuulit?")),
      { k: "choice", who: "dania", tt: "Нәрсә ишеттең?", t: l("Что ты слышала?", "What did you hear?", "Ne duydun?", "Mitä kuulit?"), opts: [
        { tt: "Мин тавыш ишеттем.", t: l("Я слышала голос.", "I heard a voice.", "Bir ses duydum.", "Kuulin äänen."), reply: { tt: "", t: l("Ильдар: «Голос? Может, ветер.»", "Ildar: “A voice? Maybe the wind.”", "İldar: “Ses mi? Belki rüzgârdır.”", "Ildar: ”Ääni? Ehkä tuuli.”") } },
        { tt: "Мин баскыч күрдем.", t: l("Я видела лестницу.", "I saw a staircase.", "Bir merdiven gördüm.", "Näin portaat."), reply: { tt: "", t: l("Ильдар: «Баскыч? В башне нет лестницы.»", "Ildar: “Baskych? There are no stairs.”", "İldar: “Baskıç mı? Kulede merdiven yok.”", "Ildar: ”Baskytš? Tornissa ei ole portaita.”") } },
      ] },
    ],
  },
  {
    id: "f2", floor: 2, tt: "Гаилә", hue: 25,
    t: l("Семья", "Family", "Aile", "Perhe"),
    place: l("Второй этаж: семейные портреты", "Second floor: family portraits", "İkinci kat: aile portreleri", "Toinen kerros: sukumuotokuvat"),
    steps: [
      say("dania", "Әби…", l("Бабушка… (на стене — её фотография)", "Grandma… (her photo is on the wall)", "Büyükanne… (duvarda onun fotoğrafı)", "Isoäiti… (hänen kuvansa on seinällä)")),
      say("voice", "Гаилә — тамыр. Тамырсыз агач үсми.", l("Семья — корень. Без корня дерево не растёт.", "Family is the root. A tree without roots does not grow.", "Aile köktür. Köksüz ağaç büyümez.", "Perhe on juuri. Puu ei kasva ilman juuria.")),
      { k: "vocab", words: [
        w("гаилә", "семья", "family", "aile", "perhe"),
        w("әти", "папа", "dad", "baba", "isä"),
        w("әни", "мама", "mum", "anne", "äiti"),
        w("бабай", "дедушка", "grandpa", "dede", "isoisä"),
        w("әби", "бабушка", "grandma", "büyükanne", "isoäiti"),
        w("абый", "старший брат", "elder brother", "ağabey", "isoveli"),
        w("апа", "старшая сестра", "elder sister", "abla", "isosisko"),
        w("энем", "мой младший брат", "my younger brother", "küçük kardeşim (erkek)", "pikkuveljeni"),
        w("сеңлем", "моя младшая сестра", "my younger sister", "küçük kardeşim (kız)", "pikkusiskoni"),
      ] },
      { k: "match", prompt: l("Собери семейное древо: соедини слово и перевод", "Build the family tree: match word and meaning", "Aile ağacını kur: kelimeyle anlamını eşleştir", "Rakenna sukupuu: yhdistä sana ja merkitys"), pairs: [
        w("бабай", "дедушка", "grandpa", "dede", "isoisä"),
        w("әби", "бабушка", "grandma", "büyükanne", "isoäiti"),
        w("әти", "папа", "dad", "baba", "isä"),
        w("әни", "мама", "mum", "anne", "äiti"),
        w("абый", "старший брат", "elder brother", "ağabey", "isoveli"),
        w("апа", "старшая сестра", "elder sister", "abla", "isosisko"),
      ] },
      say("cat", "Син әбиеңне хәтерлисеңме?", l("Ты помнишь свою бабушку?", "Do you remember your grandma?", "Büyükanneni hatırlıyor musun?", "Muistatko isoäitisi?")),
      { k: "choice", who: "voice", tt: "Синең әбиең кем иде?", t: l("Кем была твоя бабушка?", "Who was your grandma?", "Büyükannen kimdi?", "Kuka isoäitisi oli?"), opts: [
        { tt: "Минем әбием — Фирдәвес.", t: l("Мою бабушку звали Фирдәвес.", "My grandma was Firdaves.", "Büyükannemin adı Firdevs'ti.", "Isoäitini oli Firdaves."), reply: { tt: "Матур исем. Ул сине яратты.", t: l("Красивое имя. Она тебя любила.", "A beautiful name. She loved you.", "Güzel isim. Seni severdi.", "Kaunis nimi. Hän rakasti sinua.") } },
        { tt: "Ул бик мәрхәмәтле иде.", t: l("Она была очень доброй.", "She was very kind.", "Çok merhametliydi.", "Hän oli hyvin lempeä."), reply: { tt: "Мәрхәмәт — мәңгелек.", t: l("Доброта вечна.", "Kindness is eternal.", "Merhamet sonsuzdur.", "Hyvyys on ikuista.") } },
        { tt: "Мин аны хәтерлим.", t: l("Я её помню.", "I remember her.", "Onu hatırlıyorum.", "Muistan hänet."), reply: { tt: "Хәтер — мәңгелек.", t: l("Память вечна.", "Memory is eternal.", "Hafıza sonsuzdur.", "Muisti on ikuinen.") } },
      ] },
      say("babi", "Йокла, кызым, йокла…", l("(воспоминание) Спи, дочка, спи…", "(memory) Sleep, my girl, sleep…", "(anı) Uyu kızım, uyu…", "(muisto) Nuku, tyttöni, nuku…")),
      { k: "vocab", words: [
        w("тамыр", "корень", "root", "kök", "juuri"),
        w("агач", "дерево", "tree", "ağaç", "puu"),
        w("хәтерлим", "помню", "I remember", "hatırlıyorum", "muistan"),
        w("мәңгелек", "вечный", "eternal", "ebedî", "ikuinen"),
        w("йокла", "спи", "sleep!", "uyu", "nuku"),
      ] },
    ],
  },
  {
    id: "f3", floor: 3, tt: "Тәм", hue: 15,
    t: l("Вкус", "Taste", "Tat", "Maku"),
    place: l("Третий этаж: старинная кухня", "Third floor: the old kitchen", "Üçüncü kat: eski mutfak", "Kolmas kerros: vanha keittiö"),
    steps: [
      say("voice", "Тәм — телнең иң татлы өлеше.", l("Вкус — самая сладкая часть языка.", "Taste is the sweetest part of language.", "Tat, dilin en tatlı parçasıdır.", "Maku on kielen makein osa.")),
      { k: "vocab", words: [
        w("он", "мука", "flour", "un", "jauho"),
        w("йомырка", "яйцо", "egg", "yumurta", "kananmuna"),
        w("шикәр", "сахар", "sugar", "şeker", "sokeri"),
        w("бал", "мёд", "honey", "bal", "hunaja"),
        w("май", "масло", "butter", "yağ", "voi"),
        w("куш", "добавь", "add!", "ekle", "lisää"),
        w("пешер", "приготовь", "cook!", "pişir", "kypsennä"),
      ] },
      { k: "build", prompt: l("Рецепт чак-чака: «Возьми муку, яйцо и сахар»", "Chak-chak recipe: “Take flour, egg and sugar”", "Çak-çak tarifi: “Un, yumurta ve şeker al”", "Tšak-tšak-resepti: ”Ota jauhoja, muna ja sokeria”"),
        words: ["шикәр", "ал", "бал", "он", "йомырка", "пешер"], answer: ["ал", "он", "йомырка", "шикәр"] },
      { k: "build", prompt: l("«Пожарь. Сверху добавь мёд»", "“Cook it. Add honey on top”", "“Pişir. Üstüne bal ekle”", "”Kypsennä. Lisää päälle hunajaa”"),
        words: ["куш", "бал", "Пешер", "өстенә", "он"], answer: ["Пешер", "өстенә", "бал", "куш"] },
      { k: "odd", prompt: l("Найди лишнее блюдо", "Find the odd dish out", "Fazla olan yemeği bul", "Etsi joukkoon kuulumaton ruoka"),
        items: ["Чәк-чәк", "Өчпочмак", "Бәлеш", "Пицца"], answer: "Пицца",
        why: l("Пицца — не татарское блюдо.", "Pizza is not a Tatar dish.", "Pizza bir Tatar yemeği değil.", "Pizza ei ole tataarilainen ruoka.") },
      { k: "choice", who: "voice", tt: "Син кафега кердең. Нәрсә телисең?", t: l("Ты зашла в кафе. Чего хочешь?", "You walked into a café. What would you like?", "Kafeye girdin. Ne istersin?", "Tulit kahvilaan. Mitä haluat?"), opts: [
        { tt: "Мин чәй эчәм.", t: l("Я пью чай.", "I'll drink tea.", "Çay içiyorum.", "Juon teetä."), reply: { tt: "Чәй — җан азыгы.", t: l("Чай — пища души.", "Tea is food for the soul.", "Çay ruhun gıdasıdır.", "Tee on sielun ruokaa.") } },
        { tt: "Мин өчпочмак ашыйм.", t: l("Я ем эчпочмак.", "I'll eat an echpochmak.", "Üçpoçmak yiyorum.", "Syön etšpotšmakin."), reply: { tt: "Тәмле!", t: l("Вкусно!", "Tasty!", "Lezzetli!", "Herkullista!") } },
        { tt: "Мин чәк-чәк яратам.", t: l("Я люблю чак-чак.", "I love chak-chak.", "Çak-çak severim.", "Rakastan tšak-tšakia."), reply: { tt: "Син чын татар!", t: l("Ты настоящая татарка!", "You're a true Tatar!", "Sen gerçek bir Tatarsın!", "Olet oikea tataari!") } },
      ] },
      say("cat", "Ә мин балык яратам.", l("А я люблю рыбу.", "And I love fish.", "Ben de balık severim.", "Ja minä rakastan kalaa.")),
      { k: "vocab", words: [
        w("чәй", "чай", "tea", "çay", "tee"),
        w("ашыйм", "ем", "I eat", "yiyorum", "syön"),
        w("эчәм", "пью", "I drink", "içiyorum", "juon"),
        w("яратам", "люблю", "I love", "seviyorum", "rakastan"),
        w("тәмле", "вкусно", "tasty", "lezzetli", "herkullinen"),
      ] },
    ],
  },
  {
    id: "f4", floor: 4, tt: "Шәһәр", hue: 190,
    t: l("Город", "City", "Şehir", "Kaupunki"),
    place: l("Четвёртый этаж: карта Казани", "Fourth floor: the map of Kazan", "Dördüncü kat: Kazan haritası", "Neljäs kerros: Kazanin kartta"),
    steps: [
      say("voice", "Шәһәр — синең йортың. Урамнарны беләсеңме?", l("Город — твой дом. Знаешь ли ты улицы?", "The city is your home. Do you know its streets?", "Şehir senin evin. Sokakları biliyor musun?", "Kaupunki on kotisi. Tunnetko sen kadut?")),
      { k: "vocab", words: [
        w("шәһәр", "город", "city", "şehir", "kaupunki"),
        w("урам", "улица", "street", "sokak", "katu"),
        w("күл", "озеро", "lake", "göl", "järvi"),
        w("манара", "башня", "tower", "kule", "torni"),
        w("Идел", "Волга", "the Volga", "İdil (Volga)", "Volga"),
        w("сулга", "налево", "to the left", "sola", "vasemmalle"),
        w("уңга", "направо", "to the right", "sağa", "oikealle"),
        w("туры", "прямо", "straight", "düz", "suoraan"),
      ] },
      { k: "match", prompt: l("Подпиши точки на карте", "Label the map", "Haritayı etiketle", "Merkitse kartta"), pairs: [
        w("урам", "улица", "street", "sokak", "katu"),
        w("күл", "озеро", "lake", "göl", "järvi"),
        w("манара", "башня", "tower", "kule", "torni"),
        w("Идел", "Волга", "the Volga", "Volga", "Volga"),
        w("шәһәр", "город", "city", "şehir", "kaupunki"),
      ] },
      { k: "choice", who: "voice", tt: "Манарага ничек барырга?", t: l("Как пройти к башне?", "How do I get to the tower?", "Kuleye nasıl gidilir?", "Miten pääsen torniin?"), opts: [
        { tt: "Туры барыгыз.", t: l("Идите прямо.", "Go straight.", "Düz gidin.", "Menkää suoraan."), ok: true, reply: { tt: "Туры — иң кыска юл.", t: l("Прямо — самый короткий путь.", "Straight is the shortest way.", "Düz, en kısa yoldur.", "Suoraan on lyhin tie.") } },
        { tt: "Уңга барыгыз.", t: l("Идите направо.", "Go right.", "Sağa gidin.", "Menkää oikealle."), ok: false, reply: { tt: "Уңга — дөрес түгел.", t: l("Направо — неверно.", "Right is wrong.", "Sağa yanlış.", "Oikealle on väärin.") } },
        { tt: "Сулга барыгыз.", t: l("Идите налево.", "Go left.", "Sola gidin.", "Menkää vasemmalle."), ok: false, reply: { tt: "Сулга — дөрес түгел.", t: l("Налево — неверно.", "Left is wrong.", "Sola yanlış.", "Vasemmalle on väärin.") } },
      ] },
      { k: "build", prompt: l("Спроси прохожего: «Кремль далеко?»", "Ask a passer-by: “Is the Kremlin far?”", "Birine sor: “Kremlin uzak mı?”", "Kysy ohikulkijalta: ”Onko Kreml kaukana?”"),
        words: ["еракмы", "Кремль", "якын", "кая"], answer: ["Кремль", "еракмы"] },
      say("voice", "Ерак түгел. Мин күрсәтәм.", l("Недалеко. Я покажу.", "Not far. I'll show you.", "Uzak değil. Göstereyim.", "Ei kaukana. Näytän.")),
      say("cat", "Кая барасың? — Өскә! Түбән — юк.", l("Куда идёшь? — Наверх! Вниз — нет.", "Where are you going? Up! Not down.", "Nereye gidiyorsun? Yukarı! Aşağı değil.", "Minne menet? Ylös! Ei alas.")),
      { k: "vocab", words: [
        w("кая", "куда / где", "where", "nereye", "minne"),
        w("ерак", "далеко", "far", "uzak", "kaukana"),
        w("юл", "путь, дорога", "way, road", "yol", "tie"),
        w("өскә", "наверх", "up", "yukarı", "ylös"),
        w("түбән", "вниз", "down", "aşağı", "alas"),
      ] },
    ],
  },
  {
    id: "f5", floor: 5, tt: "Табигать", hue: 130,
    t: l("Природа", "Nature", "Doğa", "Luonto"),
    place: l("Пятый этаж: лес внутри башни", "Fifth floor: a forest inside the tower", "Beşinci kat: kulenin içinde orman", "Viides kerros: metsä tornin sisällä"),
    steps: [
      say("voice", "Табигать — безнең ана.", l("Природа — наша мать.", "Nature is our mother.", "Doğa bizim anamızdır.", "Luonto on äitimme.")),
      { k: "vocab", words: [
        w("төлке", "лиса", "fox", "tilki", "kettu"),
        w("балык", "рыба", "fish", "balık", "kala"),
        w("кош", "птица", "bird", "kuş", "lintu"),
        w("аю", "медведь", "bear", "ayı", "karhu"),
        w("урман", "лес", "forest", "orman", "metsä"),
        w("су", "вода", "water", "su", "vesi"),
        w("күк", "небо", "sky", "gök", "taivas"),
      ] },
      { k: "match", prompt: l("Кто где живёт? Соедини", "Who lives where? Match them", "Kim nerede yaşar? Eşleştir", "Kuka asuu missä? Yhdistä"), pairs: [
        ["балык", l("су — вода", "су — water", "су — su", "су — vesi")],
        ["кош", l("күк — небо", "күк — sky", "күк — gök", "күк — taivas")],
        ["аю", l("урман — лес", "урман — forest", "урман — orman", "урман — metsä")],
        ["куян", l("кыр — поле", "кыр — field", "кыр — kır", "кыр — pelto")],
      ] },
      { k: "order", prompt: l("Расставь времена года: от зимы", "Put the seasons in order, starting with winter", "Mevsimleri kıştan başlayarak sırala", "Järjestä vuodenajat talvesta alkaen"), items: [
        w("кыш", "зима: кар ява", "winter: it snows", "kış: kar yağıyor", "talvi: sataa lunta"),
        w("яз", "весна: чәчәкләр ачыла", "spring: flowers open", "ilkbahar: çiçekler açıyor", "kevät: kukat aukeavat"),
        w("җәй", "лето: кояш кыздыра", "summer: the sun is hot", "yaz: güneş yakıyor", "kesä: aurinko paahtaa"),
        w("көз", "осень: яфраклар коела", "autumn: leaves fall", "sonbahar: yapraklar dökülüyor", "syksy: lehdet putoavat"),
      ] },
      { k: "choice", who: "voice", tt: "Син Чаллыдан. Анда нәрсә бар?", t: l("Ты из Челнов. Что там есть?", "You're from Chelny. What is there?", "Çallı'dansın. Orada ne var?", "Olet Tšallysta. Mitä siellä on?"), opts: [
        { tt: "Анда Чулман бар.", t: l("Там есть Кама.", "There is the Kama river.", "Orada Kama nehri var.", "Siellä on Kama-joki."), reply: { tt: "Чулман — бөек елга.", t: l("Кама — великая река.", "The Kama is a great river.", "Kama büyük bir nehirdir.", "Kama on suuri joki.") } },
        { tt: "Анда урманнар бар.", t: l("Там есть леса.", "There are forests.", "Orada ormanlar var.", "Siellä on metsiä."), reply: { tt: "Урман — байлык.", t: l("Лес — богатство.", "The forest is wealth.", "Orman zenginliktir.", "Metsä on rikkaus.") } },
        { tt: "Анда мин тудым.", t: l("Там я родилась.", "I was born there.", "Orada doğdum.", "Synnyin siellä."), reply: { tt: "Туган җир — изге.", t: l("Родная земля свята.", "One's homeland is sacred.", "Doğduğun yer kutsaldır.", "Synnyinmaa on pyhä.") } },
      ] },
      { k: "vocab", words: [
        w("кыш", "зима", "winter", "kış", "talvi"),
        w("яз", "весна", "spring", "ilkbahar", "kevät"),
        w("җәй", "лето", "summer", "yaz", "kesä"),
        w("көз", "осень", "autumn", "sonbahar", "syksy"),
        w("елга", "река", "river", "nehir", "joki"),
      ] },
    ],
  },
  {
    id: "f6", floor: 6, tt: "Хисләр", hue: 330,
    t: l("Чувства", "Feelings", "Duygular", "Tunteet"),
    place: l("Шестой этаж: комната зеркал", "Sixth floor: the room of mirrors", "Altıncı kat: aynalar odası", "Kuudes kerros: peilien huone"),
    steps: [
      say("voice", "Хисләр — җан теле. Син нәрсә тоясың?", l("Чувства — язык души. Что ты чувствуешь?", "Feelings are the language of the soul. What do you feel?", "Duygular ruhun dilidir. Ne hissediyorsun?", "Tunteet ovat sielun kieli. Mitä tunnet?")),
      { k: "match", prompt: l("Подбери слово к лицу в зеркале", "Match the word to the face in the mirror", "Aynadaki yüze kelimeyi eşleştir", "Yhdistä sana peilin kasvoihin"), pairs: [
        w("шатлык", "😊 радость", "😊 joy", "😊 sevinç", "😊 ilo"),
        w("кайгы", "😢 грусть", "😢 sorrow", "😢 keder", "😢 suru"),
        w("курку", "😨 страх", "😨 fear", "😨 korku", "😨 pelko"),
        w("ачу", "😠 злость", "😠 anger", "😠 öfke", "😠 viha"),
        w("мәхәббәт", "❤️ любовь", "❤️ love", "❤️ sevgi", "❤️ rakkaus"),
      ] },
      { k: "match", prompt: l("Капма-каршы: найди противоположности", "Kapma-karshy: find the opposites", "Kapma-karşı: zıtları bul", "Kapma-karšy: etsi vastakohdat"), pairs: [
        ["яхшы", l("начар", "начар", "начар", "начар")],
        ["зур", l("кечкенә", "кечкенә", "кечкенә", "кечкенә")],
        ["яңа", l("иске", "иске", "иске", "иске")],
        ["шатлык", l("кайгы", "кайгы", "кайгы", "кайгы")],
      ] },
      { k: "choice", who: "voice", tt: "Син манарага мендең. Нәрсә тоясың?", t: l("Ты поднялась на башню. Что чувствуешь?", "You climbed the tower. What do you feel?", "Kuleye çıktın. Ne hissediyorsun?", "Nousit torniin. Mitä tunnet?"), opts: [
        { tt: "Мин шат.", t: l("Я рада.", "I'm glad.", "Mutluyum.", "Olen iloinen."), reply: { tt: "Шатлык — якты.", t: l("Радость светлая.", "Joy is bright.", "Sevinç aydınlıktır.", "Ilo on valoisaa.") } },
        { tt: "Мин куркам.", t: l("Я боюсь.", "I'm afraid.", "Korkuyorum.", "Pelkään."), reply: { tt: "Курку — көч.", t: l("Страх — сила.", "Fear is strength.", "Korku güçtür.", "Pelko on voimaa.") } },
        { tt: "Мин әбиемне сагынам.", t: l("Я скучаю по бабушке.", "I miss my grandma.", "Büyükannemi özlüyorum.", "Kaipaan isoäitiäni."), reply: { tt: "Сагыну — мәхәббәт.", t: l("Тоска — это любовь.", "Missing someone is love.", "Özlem sevgidir.", "Kaipaus on rakkautta.") } },
      ] },
      { k: "vocab", words: [
        w("шатлык", "радость", "joy", "sevinç", "ilo"),
        w("кайгы", "грусть", "sorrow", "keder", "suru"),
        w("мәхәббәт", "любовь", "love", "sevgi", "rakkaus"),
        w("зур / кечкенә", "большой / маленький", "big / small", "büyük / küçük", "iso / pieni"),
        w("яңа / иске", "новый / старый", "new / old", "yeni / eski", "uusi / vanha"),
        w("сагынам", "скучаю", "I miss", "özlüyorum", "kaipaan"),
      ] },
    ],
  },
  {
    id: "f7", floor: 7, tt: "Вакыт", hue: 260,
    t: l("Время", "Time", "Zaman", "Aika"),
    place: l("Седьмой этаж: комната часов", "Seventh floor: the room of clocks", "Yedinci kat: saatler odası", "Seitsemäs kerros: kellojen huone"),
    steps: [
      say("voice", "Вакыт — иң кыйммәтле нәрсә.", l("Время — самое ценное.", "Time is the most precious thing.", "Zaman en değerli şeydir.", "Aika on arvokkainta.")),
      { k: "match", prompt: l("Сколько на часах?", "What time is it?", "Saat kaç?", "Paljonko kello on?"), pairs: [
        ["сәгать өч", l("3:00", "3:00", "3:00", "3:00")],
        ["сәгать биш", l("5:00", "5:00", "5:00", "5:00")],
        ["сәгать җиде", l("7:00", "7:00", "7:00", "7:00")],
        ["сәгать ун", l("10:00", "10:00", "10:00", "10:00")],
      ] },
      { k: "order", prompt: l("Атна көннәре: расставь дни недели по порядку", "Atna könnäre: put the weekdays in order", "Atna könnäre: haftanın günlerini sırala", "Atna könnäre: järjestä viikonpäivät"), items: [
        w("дүшәмбе", "понедельник", "Monday", "pazartesi", "maanantai"),
        w("сишәмбе", "вторник", "Tuesday", "salı", "tiistai"),
        w("чәршәмбе", "среда", "Wednesday", "çarşamba", "keskiviikko"),
        w("пәнҗешәмбе", "четверг", "Thursday", "perşembe", "torstai"),
        w("җомга", "пятница", "Friday", "cuma", "perjantai"),
        w("шимбә", "суббота", "Saturday", "cumartesi", "lauantai"),
        w("якшәмбе", "воскресенье", "Sunday", "pazar", "sunnuntai"),
      ] },
      { k: "choice", who: "voice", tt: "Кайчан кайтасың?", t: l("Когда вернёшься?", "When will you come back?", "Ne zaman döneceksin?", "Milloin palaat?"), opts: [
        { tt: "Мин бүген кайтам.", t: l("Вернусь сегодня.", "I'll be back today.", "Bugün dönüyorum.", "Palaan tänään."), reply: { tt: "Бүген — якын.", t: l("Сегодня — близко.", "Today is near.", "Bugün yakın.", "Tänään on lähellä.") } },
        { tt: "Мин иртәгә кайтам.", t: l("Вернусь завтра.", "I'll be back tomorrow.", "Yarın dönüyorum.", "Palaan huomenna."), reply: { tt: "Иртәгә — яңа көн.", t: l("Завтра — новый день.", "Tomorrow is a new day.", "Yarın yeni bir gün.", "Huominen on uusi päivä.") } },
        { tt: "Мин кайтмыйм.", t: l("Я не вернусь.", "I won't come back.", "Dönmüyorum.", "En palaa."), reply: { tt: "Кайтасың. Йөрәк кайта.", t: l("Вернёшься. Сердце возвращается.", "You will. The heart returns.", "Döneceksin. Kalp geri döner.", "Palaat. Sydän palaa.") } },
      ] },
      say("ildar", undefined, l("Я думал, ты странная. Но ты правда что-то нашла. Я подожду.", "I thought you were strange. But you really found something. I'll wait.", "Garip olduğunu düşünmüştüm. Ama gerçekten bir şey buldun. Bekleyeceğim.", "Luulin sinua oudoksi. Mutta löysit todella jotain. Odotan.")),
      say("dania", "Рәхмәт. Мин кайтам.", l("Спасибо. Я вернусь.", "Thank you. I'll be back.", "Teşekkürler. Döneceğim.", "Kiitos. Palaan.")),
      { k: "vocab", words: [
        w("вакыт", "время", "time", "zaman", "aika"),
        w("сәгать", "час, часы", "hour, clock", "saat", "tunti, kello"),
        w("атна", "неделя", "week", "hafta", "viikko"),
        w("бүген", "сегодня", "today", "bugün", "tänään"),
        w("кичә", "вчера", "yesterday", "dün", "eilen"),
        w("иртәгә", "завтра", "tomorrow", "yarın", "huomenna"),
      ] },
    ],
  },
  {
    id: "top", floor: 8, tt: "Сер", hue: 45,
    t: l("Тайна", "The secret", "Sır", "Salaisuus"),
    place: l("Вершина башни, рассвет", "Top of the tower, dawn", "Kulenin tepesi, şafak", "Tornin huippu, aamunkoitto"),
    steps: [
      say("syuy", "Дания. Син мендең. Син өйрәндең. Син хәтерләдең.", l("Дания. Ты поднялась. Ты училась. Ты вспомнила.", "Dania. You climbed. You learned. You remembered.", "Daniya. Çıktın. Öğrendin. Hatırladın.", "Dania. Nousit. Opit. Muistit.")),
      say("dania", undefined, l("Почему я? Я же не знаю языка. Я… предала бабушку.", "Why me? I don't know the language. I… betrayed my grandma.", "Neden ben? Dili bilmiyorum. Büyükanneme… ihanet ettim.", "Miksi minä? En osaa kieltä. Petin… isoäitini.")),
      say("syuy", "Юк. Син югалттың. Югалту — башлангыч. Син таптың.", l("Нет. Ты потеряла. Потеря — это начало. Ты нашла.", "No. You lost it. Loss is a beginning. You found it.", "Hayır. Kaybettin. Kayıp bir başlangıçtır. Buldun.", "Ei. Menetit sen. Menetys on alku. Löysit sen.")),
      { k: "build", prompt: l("Последний вопрос: «Зачем ты учила язык?» Собери: «Я учила язык ради своих корней»", "Last question: “Why did you learn the language?” Build: “I learned the language for my roots”", "Son soru: “Dili neden öğrendin?” Kur: “Dili köklerim için öğrendim”", "Viimeinen kysymys: ”Miksi opit kielen?” Rakenna: ”Opin kielen juurieni vuoksi”"),
        words: ["өйрәндем", "Мин", "өчен", "телне", "тамырларым", "белмим"], answer: ["Мин", "телне", "тамырларым", "өчен", "өйрәндем"] },
      { k: "choice", who: "syuy", tt: "Син телне ни өчен өйрәндең?", t: l("Зачем ты учила язык?", "Why did you learn the language?", "Dili neden öğrendin?", "Miksi opit kielen?"), opts: [
        { tt: "Мин телне тамырларым өчен өйрәндем.", t: l("Ради своих корней.", "For my roots.", "Köklerim için.", "Juurieni vuoksi."), ending: 3 },
        { tt: "Мин телне үзем өчен өйрәндем.", t: l("Для себя.", "For myself.", "Kendim için.", "Itseni vuoksi."), ending: 2 },
        { tt: "Мин телне белмим.", t: l("Я не знаю языка.", "I don't know the language.", "Dili bilmiyorum.", "En osaa kieltä."), ending: 1 },
      ] },
    ],
  },
];

export const ENDINGS: Record<number, { tt: string; t: L; steps: Step[] }> = {
  1: { tt: "Түбән", t: l("Вниз", "Down", "Aşağı", "Alas"), steps: [
    say("syuy", "Син әле әзер түгел. Әмма кайт. Мин көтәм.", l("Ты ещё не готова. Но возвращайся. Я жду.", "You're not ready yet. But come back. I'm waiting.", "Henüz hazır değilsin. Ama geri dön. Bekliyorum.", "Et ole vielä valmis. Mutta palaa. Odotan.")),
    say("dania", "Мин кайтам. Иртәгә.", l("Я вернусь. Завтра. И буду учиться дальше.", "I'll be back. Tomorrow. And I'll keep learning.", "Döneceğim. Yarın. Ve öğrenmeye devam edeceğim.", "Palaan. Huomenna. Ja jatkan opiskelua.")),
  ] },
  2: { tt: "Өскә", t: l("Вверх", "Up", "Yukarı", "Ylös"), steps: [
    say("syuy", "Син үзең өчен өйрәндең. Бу — яхшы. Белем — көч. Башкаларга өйрәт.", l("Ты училась для себя. Это хорошо. Знание — сила. Учи других.", "You learned for yourself. That's good. Knowledge is power. Teach others.", "Kendin için öğrendin. Bu iyi. Bilgi güçtür. Başkalarına öğret.", "Opit itseäsi varten. Se on hyvä. Tieto on valtaa. Opeta muita.")),
    say("syuy", "Китапны ал. Ул синеке.", l("Возьми книгу. Она твоя.", "Take the book. It's yours.", "Kitabı al. O senin.", "Ota kirja. Se on sinun.")),
    say("dania", "Мин сине өйрәтәм. Тел — көч.", l("(Ильдару) Я тебя научу. Язык — сила.", "(to Ildar) I'll teach you. Language is strength.", "(İldar'a) Sana öğreteceğim. Dil güçtür.", "(Ildarille) Opetan sinua. Kieli on voimaa.")),
  ] },
  3: { tt: "Йөрәк", t: l("Сердце", "Heart", "Yürek", "Sydän"), steps: [
    say("syuy", "Син тамыр өчен өйрәндең. Син — минем дәвамым.", l("Ты училась ради корней. Ты — моё продолжение.", "You learned for your roots. You are my continuation.", "Kökler için öğrendin. Sen benim devamımsın.", "Opit juurien vuoksi. Olet jatkoni.")),
    say("babi", "Кызым. Син кайттың.", l("Дочка. Ты вернулась.", "My girl. You came back.", "Kızım. Geri döndün.", "Tyttöni. Palasit.")),
    say("dania", "Әби… Хәзер мин сине аңлыйм.", l("Бабушка… Теперь я тебя понимаю.", "Grandma… Now I understand you.", "Büyükanne… Artık seni anlıyorum.", "Isoäiti… Nyt ymmärrän sinua.")),
    say("babi", "Мин сине яратам, кызым. Һәрвакыт яраттым.", l("Я люблю тебя, дочка. Всегда любила.", "I love you, my girl. I always did.", "Seni seviyorum kızım. Hep sevdim.", "Rakastan sinua, tyttöni. Aina rakastin.")),
    say("syuy", "Хәтер — мәңгелек. Тел — күпер. Син — күпер.", l("Память вечна. Язык — мост. Ты — мост.", "Memory is eternal. Language is a bridge. You are the bridge.", "Hafıza sonsuzdur. Dil bir köprüdür. Sen köprüsün.", "Muisti on ikuinen. Kieli on silta. Sinä olet silta.")),
  ] },
};
