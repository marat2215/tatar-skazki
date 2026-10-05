"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bi, TT } from "@/components/bi";
import { WordCounter } from "@/components/word-counter";
import { S } from "@/lib/strings";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto w-full max-w-content px-4 pb-12 pt-16 sm:px-6 md:pb-16 md:pt-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
      >
        <span className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
          Татар теле · Tatar tele
        </span>
        <h1 id="hero-title" className="text-4xl leading-tight sm:text-5xl lg:text-6xl">
          <Bi line={S.heroTitle} subClassName="text-[0.42em] leading-snug" />
        </h1>
        <Bi line={S.heroLead} as="p" className="max-w-xl text-lg text-muted-foreground" subClassName="text-sm" />
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/#learn">
              <TT line={S.ctaStart} />
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="https://t.me/TatarlargaBot" target="_blank" rel="noopener noreferrer">
              <Send aria-hidden />
              <TT line={S.ctaBot} />
            </a>
          </Button>
        </div>
        <WordCounter />
      </motion.div>
    </section>
  );
}
