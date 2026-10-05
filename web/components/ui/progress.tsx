"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Progress({ value, className, label }: { value: number; className?: string; label: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={false}
        animate={{ width: `${v}%` }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </div>
  );
}
