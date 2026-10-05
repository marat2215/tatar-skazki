// Краткие правила грамматики. Примеры: [татарский, русский, английский]
export type Rule = {
  id: string;
  title: { tt: string; ru: string; en: string };
  text: { ru: string; en: string };
  examples: [string, string, string][];
};

export const RULES: Rule[] = [
  {
    id: "harmony",
    title: { tt: "Сингармонизм", ru: "Гармония гласных", en: "Vowel harmony" },
    text: {
      ru: "Гласные бывают твёрдыми (а, о, у, ы) и мягкими (ә, ө, ү, е, и). Окончания подстраиваются под слово: к твёрдому — твёрдое, к мягкому — мягкое.",
      en: "Vowels are back (а, о, у, ы) or front (ә, ө, ү, е, и). Suffixes follow the word: back words take back suffixes, front words take front ones.",
    },
    examples: [["ат — атлар", "лошадь — лошади", "horse — horses"], ["эт — этләр", "собака — собаки", "dog — dogs"]],
  },
  {
    id: "plural",
    title: { tt: "Күплек сан", ru: "Множественное число", en: "Plural" },
    text: {
      ru: "Окончание -лар/-ләр. После м, н, ң — -нар/-нәр.",
      en: "Suffix -лар/-ләр. After м, н, ң it becomes -нар/-нәр.",
    },
    examples: [["бала — балалар", "ребёнок — дети", "child — children"], ["кеше — кешеләр", "человек — люди", "person — people"], ["урман — урманнар", "лес — леса", "forest — forests"]],
  },
  {
    id: "possessive",
    title: { tt: "Тартым", ru: "Притяжательность", en: "Possession" },
    text: {
      ru: "«Мой», «твой», «его» выражаются окончанием: -ым/-ем (мой), -ың/-ең (твой), -ы/-е (его).",
      en: "“My”, “your”, “his/her” are suffixes: -ым/-ем (my), -ың/-ең (your), -ы/-е (his/her).",
    },
    examples: [["өй — өем, өең, өе", "дом — мой дом, твой дом, его дом", "house — my, your, his house"], ["ат — атым", "лошадь — моя лошадь", "horse — my horse"]],
  },
  {
    id: "cases",
    title: { tt: "Килешләр", ru: "Падежи", en: "Cases" },
    text: {
      ru: "Направление «куда» — -га/-гә (-ка/-кә), место «где» — -да/-дә (-та/-тә), откуда — -дан/-дән (-тан/-тән).",
      en: "“To” — -га/-гә (-ка/-кә), “in/at” — -да/-дә (-та/-тә), “from” — -дан/-дән (-тан/-тән).",
    },
    examples: [["авылга", "в деревню", "to the village"], ["өйдә", "дома", "at home"], ["мәктәптән", "из школы", "from school"]],
  },
  {
    id: "present",
    title: { tt: "Хәзерге заман", ru: "Настоящее время", en: "Present tense" },
    text: {
      ru: "К основе глагола добавляется -а/-ә (-ый/-и) и личное окончание: -м (я), -сың/-сең (ты), без окончания (он/она).",
      en: "Add -а/-ә (-ый/-и) to the verb stem plus a personal ending: -м (I), -сың/-сең (you), none (he/she).",
    },
    examples: [["укыйм", "я читаю", "I read"], ["укыйсың", "ты читаешь", "you read"], ["бара", "он идёт", "he goes"]],
  },
  {
    id: "question",
    title: { tt: "Сорау", ru: "Вопрос", en: "Questions" },
    text: {
      ru: "Вопрос «да/нет» образуется частицей -мы/-ме в конце слова.",
      en: "Yes/no questions take the particle -мы/-ме at the end of the word.",
    },
    examples: [["Син укыйсыңмы?", "Ты читаешь?", "Do you read?"], ["Бу китапмы?", "Это книга?", "Is this a book?"]],
  },
];
