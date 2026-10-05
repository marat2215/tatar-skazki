import raw from "@/data/content.json";

export type Word = { tt: string; ru: string; en: string; tr: string; fi: string; topic: string };
export type Phrase = { tt: string; ru: string; en: string; tr: string; fi: string };
export type Lesson = { tt: string; ru: string; en: string; tr: string; fi: string; items: Phrase[] };
export type Topic = { id: string; emoji: string; ru: string; en: string; tr: string; fi: string };

type Content = { words: Word[]; lessons: Lesson[]; phrases: Phrase[]; topics: Topic[] };
const data = raw as unknown as Content;

export const words = data.words;
export const lessons = data.lessons;
export const phrases = data.phrases;
export const topics = data.topics;

/** Пять слов для демо-урока: приветствие и самые частые слова */
export const demoWords: Word[] = ["рәхмәт", "әйе", "юк", "әни", "китап"]
  .map((t) => words.find((w) => w.tt === t))
  .filter((w): w is Word => Boolean(w));
