import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PhrasebookList } from "@/components/phrasebook-list";
import { S } from "@/lib/strings";

export const metadata: Metadata = { title: "Разговорник", description: "Татарский разговорник с озвучкой: приветствия, знакомство, семья, магазин, дом." };

export default function PhrasebookPage() {
  return (
    <>
      <PageHeader title={S.phrasebook} lead={S.phrasebookLead} />
      <PhrasebookList />
    </>
  );
}
