## Rebrand DrawdownCal

### Brand baru
- **Palet (Midnight Indigo)** — semua via `src/styles.css` (oklch):
  - `--background` putih indigo-tint (light default) / midnight `#0a0a1a` (dark)
  - `--foreground` `#141432`
  - `--primary` indigo `#4f46e5` menggantikan merah saat ini
  - `--primary-soft` indigo-50 untuk result card
  - `--accent` `#1e1e5a` (deep indigo) untuk highlight chart
  - Chart bar: gradient indigo → magenta untuk eskalasi drawdown (bukan hijau→merah)
- **Tipografi** — Sora (heading, display, angka), Manrope (body, label):
  - Import dari Google Fonts di `__root.tsx` (preconnect + stylesheet)
  - `src/styles.css`: `--font-display: "Sora"`, `--font-sans: "Manrope"`; set `body { font-family: var(--font-sans) }`; class util `.font-display`
  - Angka pakai `font-feature-settings: "tnum"` untuk tabular consistency
- **Logo/icon** — ganti `TrendingDown` → SVG kustom zigzag indigo dengan bg gradient indigo. Favicon update warna indigo.

### Density & layout (single-column padat, mobile-first)
- Outer container: `max-w-xl` (dari `max-w-2xl`), padding `px-3 py-4 sm:py-6`, gap antar section `gap-3 sm:gap-4`.
- Hapus dua wrapper Card terpisah — gabung jadi satu Card berisi: tab bar → input area → result strip → chart. Sticky tab bar di atas card.
- Header: kompak 1 baris, hilangkan tagline (atau jadikan attribute kecil di footer).
- Result card: ubah jadi single-line strip (Drawdown left · Recovery right) tanpa border kiri tebal, hemat 1 baris.
- Chart: `h-[220px] sm:h-[280px]`, padding card `p-3 sm:p-4`.
- Actions row: tombol `h-10` (dari h-12), text `text-sm`.
- Tab trigger: `py-2` (dari py-3).
- Footer: 1 baris kecil `text-[11px]`, padding `pt-1 pb-3`.

### Halaman baru (TanStack routes)
- `src/routes/about.tsx` — `/about`: penjelasan drawdown, rumus pemulihan, kenapa makin besar makin berat (1 layar mobile, ringkas).
- `src/routes/tips.tsx` — `/tips`: 5-7 tips singkat (position sizing, stop loss, hindari revenge trade, journaling, dll) sebagai list compact.
- Tambah nav minimal di Header: link teks `Kalkulator · Tentang · Tips` (text-xs di mobile). Setiap route punya `head()` meta unik (title, description, og).

### Detail teknis
- File diubah:
  - `src/styles.css` — token warna baru oklch, font variables, body font
  - `src/routes/__root.tsx` — preconnect + Google Fonts (Sora 600/700, Manrope 400/500/600), favicon indigo
  - `src/components/Header.tsx` — logo gradient indigo, nav inline, hapus tagline
  - `src/components/ResultCard.tsx` — single-line compact strip
  - `src/components/DrawdownChart.tsx` — palet bar indigo→magenta, height lebih kecil
  - `src/components/ActionsRow.tsx` — h-10
  - `src/components/PercentTab.tsx`, `EquityTab.tsx` — input h-9 sudah ok, tighten spacing space-y-3
  - `src/routes/index.tsx` — single merged card, max-w-xl, padding lebih kecil
  - `src/routes/about.tsx` (baru), `src/routes/tips.tsx` (baru)

### QA
- Cek viewport 360px, 390px, 768px: tidak ada overflow, tap target ≥40px, font angka tnum aligned.
- Pastikan dark mode tetap kontras (midnight bg dengan indigo accent).
