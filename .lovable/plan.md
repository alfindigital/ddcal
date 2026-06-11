# Rencana Improvement DrawdownCal — 4 Fase

Saya pecah jadi 4 fase supaya bisa di-review per batch. Setiap fase berdiri sendiri dan bisa dipublish.

---

## Fase 1 — URL State & Equity Insight (logic, no design risk)

**Tujuan:** hasil bisa dishare via link, tab Equity lebih informatif.

1. **URL state shareable** di `src/routes/index.tsx`
   - Pakai `validateSearch` + `zodValidator` + `fallback` (TanStack pattern).
   - Params: `dd` (1–99), `mode` (`pct`|`eq`), `awal`, `sisa`.
   - Saat user ubah slider/equity → `navigate({ search: prev => ... , replace: true })` (debounced ~400ms supaya history bersih).
   - Saat load: state awal di-init dari search params.
   - Tambah middleware `stripSearchParams` untuk default values (URL tetap bersih kalau default).
2. **Equity insight di `EquityTab.tsx` / `ResultCard.tsx`**
   - Hitung `lossNominal = awal - sisa` dan `targetProfitNominal = sisa * recovery/100`.
   - Tampilkan dua baris: "Rugi Rp3.000.000" + "Butuh untung Rp4.285.714 untuk balik".
   - Hanya muncul saat `mode === "equity"`.
3. **Tombol "Salin link"** di `ActionsRow.tsx` (selain Salin text & Unduh) — copy `window.location.href`.

## Fase 2 — Micro-interaction & Dark Mode Polish

**Tujuan:** terasa lebih hidup di mobile, dark mode lebih solid.

1. **Haptic feedback slider** di `PercentTab.tsx`
   - `navigator.vibrate(8)` saat crossing milestone 25/50/75/90 (track prev value).
   - Feature-detect `'vibrate' in navigator`; no-op kalau tidak ada.
2. **Dark mode chart contrast** di `DrawdownChart.tsx`
   - Audit warna grid, axis, active bar — pakai `oklch` token dari `styles.css` (bukan hex hardcoded).
   - Tambah subtle stroke + glow di bar aktif untuk dark mode.
   - Pastikan label angka readable (kontras ≥ 4.5:1).

## Fase 3 — PWA Installable + Offline

**Tujuan:** bisa install ke home screen + buka offline.

Ikuti **PWA skill** ketat (preview guards wajib):

1. Install `vite-plugin-pwa` via `bun add -D`.
2. Konfigurasi di `vite.config.ts`:
   - `registerType: "autoUpdate"`, `injectRegister: null`, `devOptions.enabled: false`.
   - `workbox`: HTML `NetworkFirst`, hashed assets `CacheFirst`, exclude `/~oauth`.
3. Buat wrapper registrasi `src/lib/pwa-register.ts` dengan guards:
   - Refuse register di dev, iframe, hostname `id-preview--*`, `preview--*`, `*.lovableproject.com`, `*.lovableproject-dev.com`, `beta.lovable.dev`, atau `?sw=off`.
   - Di context refused → `unregister()` SW yang ada.
4. Panggil wrapper sekali dari client entry (mis. dalam `RootComponent` di `useEffect`).
5. Manifest sudah ada — verify field `display: "standalone"`, icons, theme color.

**Catatan ke user:** offline hanya jalan di published app, bukan di preview Lovable.

## Fase 4 — Redesign Header/Hero (design-driven)

**Tujuan:** identitas brand lebih kuat, ikon tidak generik.

1. **Capture** screenshot Header current (`browser--screenshot` viewport mobile).
2. **`design--create_directions`** dengan 3 arah berbeda untuk Header+logo (palette/typography existing dikunci, hanya variasi komposisi & ikon).
3. **`ask_questions` type "prototype"** — user pilih satu.
4. **Implement** pilihan user di `Header.tsx` (komponen ikon baru + layout).

---

## Eksekusi

Saya rekomendasikan **eksekusi Fase 1 + 2 sekaligus** (low risk, langsung kerasa), lalu Fase 3 terpisah (PWA perlu di-test di published), lalu Fase 4 (perlu approval design).

Kalau setuju, jawab:
- **"jalan semua"** → fase 1→2→3, lalu masuk flow design untuk fase 4
- **"fase 1+2 dulu"** → saya kerjakan dua itu saja
- atau sebut fase spesifik (mis. "fase 1 dan 3")
