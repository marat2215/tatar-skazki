import type { Metadata, Viewport } from "next";
import { Lora, Noto_Sans, Nunito } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"], variable: "--font-nunito", display: "swap" });
const lora = Lora({ subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"], weight: ["500", "700"], variable: "--font-lora", display: "swap" });
// Noto Sans — запасной шрифт с полным набором татарских букв (ә ө ү җ ң һ)
const noto = Noto_Sans({ subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"], weight: ["400", "600"], variable: "--font-noto", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://tatartel.ru"),
  title: { default: "TatarTel — учим татарский язык", template: "%s · TatarTel" },
  description: "Бесплатные уроки татарского языка: флешкарты с озвучкой, алфавит, грамматика, разговорник и аудирование. Кириллица и латиница.",
  openGraph: { title: "TatarTel — татар телен өйрәнү", description: "Учим татарский язык каждый день", url: "https://tatartel.ru", siteName: "TatarTel", type: "website" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF3E6" },
    { media: "(prefers-color-scheme: dark)", color: "#16233A" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${nunito.variable} ${lora.variable} ${noto.variable}`}>
      <body className="min-h-dvh">
        <div className="warm-bg" aria-hidden />
        <Providers>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-card focus:px-4 focus:py-2 focus:shadow-lift">
            Төп эчтәлеккә күчү · К содержимому
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
