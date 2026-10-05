"use client";

import { motion } from "framer-motion";
import { MessagesSquare, Quote, Shapes, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Bi } from "@/components/bi";
import { Section } from "@/components/section";
import { S } from "@/lib/strings";
import type { Line } from "@/lib/strings";

const STEPS: { icon: LucideIcon; title: Line; text: Line }[] = [
  { icon: Shapes, title: S.step1, text: S.step1d },
  { icon: Quote, title: S.step2, text: S.step2d },
  { icon: MessagesSquare, title: S.step3, text: S.step3d },
];

export function HowItWorks() {
  return (
    <Section labelledBy="how-title">
      <h2 id="how-title" className="mb-8 text-center text-3xl">
        <Bi line={S.howTitle} />
      </h2>
      <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
        {STEPS.map((s, i) => (
          <motion.li
            key={s.title.tt}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.2, ease: "easeOut", delay: i * 0.05 }}
          >
            <Card className="h-full p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-btn bg-primary/10 text-primary">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-muted-foreground">0{i + 1}</span>
              </div>
              <Bi line={s.title} as="h3" className="text-lg" />
              <Bi line={s.text} as="p" className="mt-2 text-muted-foreground" subClassName="text-xs" />
            </Card>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
