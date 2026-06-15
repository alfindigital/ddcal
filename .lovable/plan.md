
# DrawdownCal Improvement — 2 Sprint Plan

Approved scope: UI/UX items #1, #2, #3, #4, #6 + Features #5, #7, #8, #9.

---

## Sprint 1 — Visual & Mobile Polish (Foundation)

Fokus: bikin tampilan terasa premium freebie + mobile solid. Tanpa fitur baru dulu.

### 1. Favicon & Brand Mark Refresh
- Design ulang mark simpel utk readability di 16px: huruf **D** crimson solid + tick descent kecil di kanan bawah. Drop multi-stroke recovery glyph utk favicon (tetap pakai yg sekarang di Header).
- Generate asset baru via `imagegen` + upload ke Lovable Assets:
  - `favicon.svg` (vector, primary utk modern browser)
  - `favicon-32.png`, `favicon-16.png`
  - `apple-touch-icon.png` (180×180)
  - `icon-192.png`, `icon-512.png` (any + maskable, refresh dari yg ada)
  - `og.jpg` refresh (1200×630, branded)
- Update `src/routes/__root.tsx` `links` array → tambah `favicon.svg`, drop inline data-URI SVG yg sekarang.
- Update `public/manifest.webmanifest` icon entries.
- Tambah dark-mode favicon variant via `media="(prefers-color-scheme: dark)"`.

### 2. UI/UX Polish (item #2)
- **Hero result**: angka "Butuh pulih +X%" naikkan ke `text-3xl` mobile / `text-4xl` sm+, tambah mini comparison bar (drawdown vs recovery, normalized 0-100% lebar).
- **Extreme state warning**: kalau `drawdown >= 90`, tampilkan baris kecil di bawah ResultCard: ⚠ "Recovery sangat sulit di zona ini. Pertimbangkan risk management ulang."
- **Slider haptic**: `navigator.vibrate(8)` saat snap ke bucket reference (5/10/20/30...) di PercentTab.
- **Chart tooltip**: on hover/tap bar tampilkan tooltip kecil "DD -X% → +Y% recovery" (selain highlight bar yg sudah ada).
- **Entry animation**: stagger fade-in (Motion / framer-motion) Header → Tabs → Result → Chart → Actions, 60ms stagger, 400ms duration, sekali di mount.
- **Microcopy**: "Butuh pulih" → "Profit dibutuhkan" (lebih clear utk pemula).

### 3. Mobile Responsiveness (item #3)
- Audit 360px: ResultCard hero number bigger (lihat #2), pastikan no overflow.
- Header wordmark: kecilkan tracking + responsive `text-[15px] sm:text-[17px]` utk "drawdown" wordmark di <360px.
- EquityTab inputs: pastikan `inputMode="numeric"`, tambah quick-action chips di bawah field current: "× 0.5 / × 0.7 / × 0.9 / Reset" → cepat simulasi.
- Bottom safe area iPhone: `pb-[max(0.75rem,env(safe-area-inset-bottom))]` di container utama `src/routes/index.tsx`.
- **Sticky ResultCard** di mobile (`sm:static`) saat scroll panjang — nempel di top saat user main slider/chart.

### 4. Design System Refinement (item #4)
- Tambah token di `src/styles.css` `@theme inline`:
  - `--shadow-elegant`: layered shadow dgn primary tint
  - `--shadow-card`: lebih halus utk card default
  - `--gradient-primary`: linear crimson → primary-soft
- Naikkan main card border-radius `rounded-xl` → `rounded-2xl`.
- Ganti `shadow-sm` di main card → `shadow-[var(--shadow-elegant)]`.
- Tambah subtle noise overlay (SVG inline data-URI, opacity 0.025) di background — depth tanpa norak. Toggle off via reduced-motion.

### 5. Feature #9 — PWA Install Prompt (digabung sprint 1, low effort)
- Komponen `<InstallPrompt />`: capture `beforeinstallprompt` event, tunggu user pakai 2+ kali (track di localStorage `dd-visit-count`), baru tampil sebagai banner dismissible halus di bawah Footer.
- iOS fallback: kalau Safari iOS + bukan standalone, tampilkan instruksi "Tap Share → Add to Home Screen" (icon SF Symbols-style).
- Dismissable persistent (localStorage `dd-install-dismissed`).

---

## Sprint 2 — Feature Expansion

Setelah polish solid, baru tambah fitur yg expand value & distribusi.

### 6. Feature #5 — Compare Mode
- Toggle di header / ActionsRow: "Bandingkan skenario".
- State: array up to 3 scenarios `{ id, label, drawdown, equityInitial?, equityCurrent? }`.
- UI: list horizontal chips dengan add (+), edit, remove. Active scenario = yg dipilih.
- DrawdownChart: render multiple highlight markers + overlay garis recovery utk masing-masing scenario, warna beda (crimson, indigo, amber dari chart tokens).
- ResultCard: kalau compare aktif, jadi 2-3 cell vertical comparison.
- URL sync: serialize scenarios ke query string `?cmp=30,50,77`.

### 7. Feature #7 — Bahasa Toggle ID/EN
- Add lightweight i18n: simple `useTranslation` hook dgn dict `src/lib/i18n.ts` (no library, hindari bundle bloat).
- Locale state: localStorage `dd-locale` + `<html lang>` sync.
- Toggle: kompak di Header (icon globe → dropdown ID/EN).
- Translate semua strings: Header, Tabs, ResultCard, AboutDialog, HistoryDialog, Footer, ActionsRow, microcopy.
- SEO: pisah route `/` (ID) vs `/en` (EN) dengan masing-masing `head()` meta unique (title/desc EN), canonical & og:url self-reference, hreflang alternate links di __root.
- Update `sitemap.xml` route → include `/en`.

### 8. Feature #8 — Embed Widget
- Route baru: `src/routes/embed.tsx` — versi minimal kalkulator (no Header/Footer, compact padding, branded "powered by DrawdownCal" link kecil di bawah).
- Accept search params: `?dd=30&mode=pct&theme=light|dark&accent=#hex` (opsional custom accent).
- Postmessage parent dgn `{ height }` utk auto-resize iframe.
- AboutDialog atau section baru di main app: "Embed widget ini" → modal dgn snippet `<iframe>` ready-copy + preview.
- `__root.tsx`: deteksi route `/embed` → skip QueryClient devtools, transparent background option.

### 9. Polish & QA
- Visual regression check di mobile (360, 390, 414) & desktop (1280).
- Verify Lighthouse PWA score tetap ≥ 90.
- Verify hreflang & sitemap di built HTML (`scripts/check-built-html.mjs` kalau perlu update).

---

## Technical Notes

- **Asset workflow favicon**: pakai `imagegen--generate_image` (premium quality utk legibility) dengan `transparent_background: true` utk favicon variants, lalu `lovable-assets create` → write `.asset.json` di `src/assets/favicons/`. Untuk file yg perlu live di `public/` (favicon.ico legacy, og.jpg yg di-link langsung), tetap di-place di `public/`.
- **Animations**: tambah `motion` (framer-motion v11 successor) — cek `package.json` dulu, kalau belum ada install `bun add motion`.
- **i18n strategy**: dict in-memory, no dynamic loading (small enough). Hindari `react-i18next` (bundle 40kb+).
- **Compare mode chart**: extend existing `DrawdownChart.tsx`, jangan duplicate komponen.
- **Embed route**: register di TanStack route tree otomatis (file-based).
- **No backend changes**: semua client-side, no Lovable Cloud needed utk scope ini.

---

## Estimasi

- **Sprint 1**: ~5 milestone (favicon, polish, mobile, design system, install prompt) — bisa dieksekusi dalam 1 turn besar atau 2-3 sub-turn.
- **Sprint 2**: ~4 milestone (compare, i18n, embed, QA) — lebih heavy, kemungkinan 2-3 sub-turn.

Aku mulai dari Sprint 1 item #1 (favicon) setelah switch ke build mode.
