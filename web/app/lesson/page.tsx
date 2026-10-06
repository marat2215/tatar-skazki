import type { Metadata } from "next";
import { LessonPlayer } from "@/components/lesson/lesson-player";

export const metadata: Metadata = { title: "Урок", description: "Урок татарского на 5 минут: слова, фразы, озвучка." };

export default function LessonPage() {
  return <LessonPlayer />;
}
