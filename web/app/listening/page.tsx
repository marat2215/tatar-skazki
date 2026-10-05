import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ListeningQuiz } from "@/components/listening-quiz";
import { S } from "@/lib/strings";

export const metadata: Metadata = { title: "Аудирование", description: "Тренировка на слух: слушайте татарские слова и выбирайте правильный ответ." };

export default function ListeningPage() {
  return (
    <>
      <PageHeader title={S.listeningS} lead={S.listeningLead} />
      <ListeningQuiz />
    </>
  );
}
