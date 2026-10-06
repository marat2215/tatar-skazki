"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

const GAMES = [
  { href: "/tower/", emoji: "🕌", tt: "Сөембикә манарасы", t: { ru: "Сюжетная игра: поднимись на башню, разгадывая загадки", en: "Story game: climb the tower solving riddles" }, big: true },
  { href: "/play/", emoji: "🔀", tt: "Парын тап", t: { ru: "Найди пару на время", en: "Match pairs against the clock" } },
  { href: "/play/", emoji: "⚡", tt: "Тиз җавап", t: { ru: "Быстрый ответ: 3 жизни", en: "Speed round: 3 lives" } },
  { href: "/play/", emoji: "👂", tt: "Колак сынавы", t: { ru: "Испытание на слух", en: "Ear challenge" } },
];

export function GamesStrip() {
  const { pick } = useI18n();
  return (
    <section className="mx-auto w-full max-w-content px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="mb-5 text-3xl">🎮 {pick({ ru: "Играй и учи", en: "Play and learn" })}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GAMES.map((g) => (
          <motion.div key={g.tt} whileHover={{ y: -4, rotate: -0.6 }} className={g.big ? "sm:col-span-2 lg:col-span-1" : ""}>
            <Link href={g.href} className="block h-full">
              <Card className={`flex h-full flex-col gap-2 p-5 ${g.big ? "bg-gradient-to-br from-primary/20 to-accent/25" : ""}`}>
                <span className="text-4xl" aria-hidden>{g.emoji}</span>
                <h3 lang="tt" className="text-xl">{g.tt}</h3>
                <p className="text-sm text-muted-foreground">{pick(g.t)}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
