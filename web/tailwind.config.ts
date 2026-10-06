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
      borderRadius: { btn: "14px", card: "22px" },
      fontFamily: {
        sans: ["var(--font-nunito)", "var(--font-noto)", "system-ui", "sans-serif"],
        display: ["var(--font-lora)", "var(--font-noto)", "Georgia", "serif"],
        tt: ["var(--font-nunito)", "var(--font-noto)", "system-ui", "sans-serif"],
      },
      lineHeight: { body: "1.6" },
      boxShadow: {
        soft: "0 10px 30px -14px rgb(120 60 20 / 0.30)",
        lift: "0 18px 40px -14px rgb(120 60 20 / 0.40)",
      },
    },
  },
  plugins: [animate],
};
export default config;
