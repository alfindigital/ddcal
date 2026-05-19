# DrawdownCal — Plan

A single-page calculator that shows how a percentage drawdown maps to the recovery (gain) required to break even, plus a reference bar chart. Indonesian copy, matching the screenshot.

## Pages & routes
- `/` (src/routes/index.tsx) — entire app on one page. No backend needed.

## Layout (top → bottom)
1. **Header bar**: red rounded icon + "DrawdownCal" title with tagline "Makin besar drawdown, makin berat pulih." Right side: "Install" button (PWA-style, decorative/no-op for now) + dark-mode toggle.
2. **Tabs**: "Persentase" | "Equity" (underline-style, red active indicator).
3. **Persentase tab**:
   - Numeric input (1–99) with `%` suffix, synced to a slider.
   - Slider with tick labels 1% / 25% / 50% / 75% / 99%, red filled track.
   - Result card (light red bg, red left border): "Drawdown" → `-X,X%` (red), "Pemulihan" → `+Y,Y%` (bold). Each label has an info tooltip (ⓘ).
4. **Equity tab**: two Rupiah inputs (Modal awal, Modal sekarang) → derives drawdown%, reuses same result card.
5. **Reference bar chart** (card): logarithmic Y axis with ticks 2%, 5%, 10%, 20%, 50%, 100%, 200%, 500%, 1000%, 2000%, 4000%, 10000%. Bars at 5,10,20,30,40,50,60,70,80,90,99 %. Color gradient green→amber→red→dark-red. Active bucket highlighted with border + dashed vertical line + red x-axis label. Built with Recharts.
6. **Actions row**: "Salin" (copies summary text) + "Unduh" (downloads chart as PNG via html-to-image or canvas).
7. **Footer**: "Made with 🧡 by @alfndigital".

## Logic (from the original repo)
- `recovery = drawdown / (100 - drawdown) * 100`
- `drawdownFromEquity = (initial - current) / initial * 100`
- id-ID number formatting; percentages with 1 decimal and comma separator.

## Design tokens (src/styles.css)
- Light, soft blue-gray background (`#F3F5F8`-ish), white cards, subtle border, large radius.
- Primary = red `oklch(~0.58 0.22 25)` (the brand red used for icon, slider, Unduh button, active bar).
- Result-card surface: very light red tint with red left border accent.
- Dark mode variant via `.dark` class toggled by the theme switch (stored in localStorage).
- Typography: clean sans (Inter or system) — minimal, matches the screenshot's neutral look.

## Components (src/components/…)
- `Header.tsx`, `Tabs.tsx`, `PercentTab.tsx`, `EquityTab.tsx`, `ResultCard.tsx`, `DrawdownChart.tsx`, `ActionsRow.tsx`, `Footer.tsx`, `InfoTooltip.tsx`, `ThemeToggle.tsx`.
- Shared state lifted in `index.tsx` (current drawdown %).

## Dependencies to add
- `recharts` (chart), `html-to-image` (PNG export), `lucide-react` (icons — already typical), shadcn `tabs`, `slider`, `input`, `button`, `tooltip` (add via shadcn if missing).

## SEO
- `head()` in route: title "DrawdownCal — Kalkulator Drawdown & Pemulihan", meta description in Indonesian, og tags.

## Out of scope
- PWA install flow, share buttons, auth, persistence beyond theme.
