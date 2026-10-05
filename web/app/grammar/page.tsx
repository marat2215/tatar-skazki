import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { GrammarList } from "@/components/grammar-list";
import { S } from "@/lib/strings";

export const metadata: Metadata = { title: "Грамматика", description: "Основы татарской грамматики: гармония гласных, падежи, время." };

export default function GrammarPage() {
  return (
    <>
      <PageHeader title={S.grammar} lead={S.grammarLead} />
      <GrammarList />
    </>
  );
}
