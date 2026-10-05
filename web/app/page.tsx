import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { DemoLesson } from "@/components/demo-lesson";
import { ProgressDashboard } from "@/components/progress-dashboard";
import { SectionsGrid } from "@/components/sections-grid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <DemoLesson />
      <ProgressDashboard />
      <SectionsGrid />
    </>
  );
}
