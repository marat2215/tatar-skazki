import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
    extend: {
      maxWidth: { content: "1280px" },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
      },
      borderRadius: { btn: "8px", card: "16px" },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto)", "system-ui", "sans-serif"],
        tt: ["var(--font-noto)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      lineHeight: { body: "1.6" },
      boxShadow: {
        soft: "0 1px 2px rgb(0 0 0 / 0.04), 0 4px 16px rgb(0 0 0 / 0.04)",
        lift: "0 2px 4px rgb(0 0 0 / 0.04), 0 12px 32px rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [animate],
};
export default config;
