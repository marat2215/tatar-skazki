"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Маскот — рыжий кот Баем в зелёной тюбетейке */
export function Bayem({ className, size = 150 }: { className?: string; size?: number }) {
  return (
    <svg className={cn("bayem shrink-0", className)} width={size} height={size * 1.06} viewBox="0 0 160 170" role="img" aria-label="Кот Баем">
      <path className="tail" d="M40 132c-22 0-30-20-22-34" fill="none" stroke="#D9772F" strokeWidth="12" strokeLinecap="round" />
      <ellipse cx="80" cy="130" rx="46" ry="34" fill="#E8893A" />
      <ellipse cx="80" cy="138" rx="26" ry="20" fill="#FBE3C4" />
      <g className="paw"><ellipse cx="124" cy="92" rx="11" ry="16" fill="#E8893A" /><ellipse cx="124" cy="80" rx="8" ry="6" fill="#FBE3C4" /></g>
      <path d="M42 50L48 14l24 22zM118 50l-6-36-24 22z" fill="#E8893A" />
      <path d="M50 42l2-18 12 11zM110 42l-2-18-12 11z" fill="#F6B7A0" />
      <circle cx="80" cy="66" r="40" fill="#E8893A" />
      <path d="M52 50q6-6 12 0M96 50q6-6 12 0M70 36q10-6 20 0" stroke="#C86A22" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M56 32q24-22 48 0z" fill="#1E7A5A" />
      <path d="M60 30h40" stroke="#E0A43A" strokeWidth="3" strokeDasharray="4 3" />
      <ellipse className="eye" cx="66" cy="66" rx="6" ry="8" fill="#3A2A20" />
      <ellipse className="eye" cx="94" cy="66" rx="6" ry="8" fill="#3A2A20" />
      <circle cx="68" cy="63" r="2" fill="#fff" /><circle cx="96" cy="63" r="2" fill="#fff" />
      <path d="M76 80l4 4 4-4z" fill="#C8553D" />
      <path d="M80 84q-6 8-12 2M80 84q6 8 12 2" stroke="#3A2A20" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="56" cy="80" r="6" fill="#F6B7A0" opacity=".6" /><circle cx="104" cy="80" r="6" fill="#F6B7A0" opacity=".6" />
    </svg>
  );
}

/** Облачко с репликой Баема: татарская фраза + перевод */
export function BayemSays({ tt, sub, className }: { tt: string; sub?: string | null; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn("max-w-xs rounded-[20px] rounded-bl-[4px] border-2 border-accent bg-card px-4 py-3 shadow-soft", className)}>
      <p lang="tt" className="font-display text-lg font-bold text-primary">{tt}</p>
      {sub && <p className="text-sm text-foreground/80">{sub}</p>}
    </motion.div>
  );
}
