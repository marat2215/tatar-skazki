"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Bi } from "@/components/bi";
import { RULES } from "@/lib/grammar";
import { useI18n } from "@/lib/i18n";

export function GrammarList() {
  const { tt, locale } = useI18n();
  return (
    <div className="mx-auto grid w-full max-w-content gap-4 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
      {RULES.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut", delay: (i % 2) * 0.05 }}
        >
          <Card className="h-full p-6">
            <span className="text-xs font-semibold text-muted-foreground">0{i + 1}</span>
            <Bi line={r.title} as="h2" className="mt-1 text-xl" subClassName="text-sm" />
            <p className="mt-3 text-muted-foreground">{locale === "en" ? r.text.en : r.text.ru}</p>
            <ul className="mt-4 flex flex-col gap-2 border-t pt-4">
              {r.examples.map(([t, ru, en]) => (
                <li key={t} className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span lang="tt" className="font-tt font-semibold">{tt(t)}</span>
                  <span className="text-sm text-muted-foreground">{locale === "en" ? en : ru}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
