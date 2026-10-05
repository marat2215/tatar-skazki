"use client";

import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speak } from "@/lib/audio";
import { S } from "@/lib/strings";

export function PlayButton({ text, label }: { text: string; label?: string }) {
  return (
    <Button variant="ghost" size="icon" aria-label={`${S.listen.ru}: ${label ?? text}`} onClick={() => void speak(text)} className="shrink-0 text-primary">
      <Volume2 aria-hidden />
    </Button>
  );
}
