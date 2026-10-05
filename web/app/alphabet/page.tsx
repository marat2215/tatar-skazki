import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AlphabetGrid } from "@/components/alphabet-grid";
import { S } from "@/lib/strings";

export const metadata: Metadata = { title: "Алфавит", description: "Татарский алфавит: 39 букв, особые звуки и латиница." };

export default function AlphabetPage() {
  return (
    <>
      <PageHeader title={S.alphabet} lead={S.alphabetLead} />
      <AlphabetGrid />
    </>
  );
}
