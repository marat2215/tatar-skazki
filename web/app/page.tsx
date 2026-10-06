import { HomeHero } from "@/components/home/home-hero";
import { PathMap } from "@/components/home/path-map";
import { GamesStrip } from "@/components/home/games-strip";
import { ProgressDashboard } from "@/components/progress-dashboard";
import { SectionsGrid } from "@/components/sections-grid";

// Главная: Баем + кнопка урока → путь → игры → прогресс → справочник
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <div className="ribbon mx-auto max-w-content" />
      <PathMap />
      <GamesStrip />
      <ProgressDashboard />
      <SectionsGrid />
    </>
  );
}
