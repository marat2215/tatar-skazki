# TatarTel — сайт tatartel.ru

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Lucide · Framer Motion · Recharts.

- `app/` — страницы: главная, `/alphabet`, `/grammar`, `/phrasebook`, `/listening`
- `components/` — блоки страницы и `components/ui` (кнопки, карточки, skeleton)
- `lib/` — тексты (`strings.ts`), язык и письменность (`i18n.tsx`), прогресс ученика (`progress.ts`), озвучка (`audio.ts`)
- Слова и фразы берутся из `site/data.json` (его собирает `scripts/build_site.py` из CSV-файлов репозитория).

Сборка и публикация — автоматически, workflow `.github/workflows/pages.yml`.
Локально: `cp ../site/data.json data/content.json && npm install && npm run dev`.
