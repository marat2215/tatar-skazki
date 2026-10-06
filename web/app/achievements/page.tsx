import type { Metadata } from "next";
import { AchievementsView } from "@/components/achievements/achievements-view";

export const metadata: Metadata = { title: "Достижения", description: "Уровни, бейджи, серия дней и задания дня." };

export default function AchievementsPage() {
  return <AchievementsView />;
}
