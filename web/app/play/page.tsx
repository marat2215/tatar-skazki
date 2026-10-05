import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { GameHub } from "@/components/games/game-hub";
import { S } from "@/lib/strings";

export const metadata: Metadata = { title: "Игры", description: "Учите татарский играя: найди пару, быстрый ответ, испытание на слух." };

export default function PlayPage() {
  return (
    <>
      <PageHeader title={S.gameTitle} lead={S.gameLead} />
      <GameHub />
    </>
  );
}
