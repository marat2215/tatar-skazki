"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { I18nProvider } from "@/lib/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <I18nProvider>{children}</I18nProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
