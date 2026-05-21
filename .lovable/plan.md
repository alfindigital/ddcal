## Perubahan

### 1. Hapus halaman Tips
- Hapus file `src/routes/tips.tsx`.
- Hapus link "Tips" dari `src/components/Header.tsx`.
- `routeTree.gen.ts` akan auto-regenerate.

### 2. Nav "Tentang" jadi icon-only
- Di `src/components/Header.tsx`, ganti teks "Tentang" dengan icon `Info` (lucide-react), tetap link ke `/about`.
- Tambahkan `aria-label="Tentang"` dan `title` untuk aksesibilitas.

### 3. Ganti logo DrawdownCal
Logo saat ini (zigzag generik) diganti dengan ikon yang jelas merepresentasikan penurunan harga / chart trading. Pilihan: **candlestick bearish dengan panah turun** — custom SVG inline di `Header.tsx` dan favicon di `__root.tsx`.

Desain SVG:
- 2–3 candle (1 bullish kecil, 1 bearish besar) dengan wick
- Panah diagonal turun di belakang/atas
- Warna: putih di atas background gradient indigo (sesuai brand)

Update juga favicon SVG di `src/routes/__root.tsx` agar konsisten.

### 4. Footer dengan social icons
Buat komponen baru `src/components/Footer.tsx`:
- Icon Facebook, TikTok, X (Twitter), Telegram dari `lucide-react` (`Facebook`, `Twitter` untuk X; TikTok & Telegram tidak ada di lucide → pakai custom SVG inline atau simple-icons style path)
- Link:
  - Facebook: `https://facebook.com/alfindigital`
  - TikTok: `https://tiktok.com/@alfindigital`
  - X: `https://x.com/alfindigital`
  - Telegram: `https://t.me/alfidx`
- Layout: row center, gap kecil, ukuran icon ~18px, `text-muted-foreground hover:text-primary`
- Label handle kecil di bawah: `@alfindigital · Telegram @alfidx`
- Semua link `target="_blank" rel="noopener noreferrer"` dengan `aria-label`

Pasang `<Footer />` di:
- `src/routes/index.tsx`
- `src/routes/about.tsx`

(setelah konten utama, di dalam container max-w-xl)

### File yang diubah
- `src/components/Header.tsx` — logo baru, nav "Tentang" jadi icon
- `src/routes/__root.tsx` — favicon SVG candlestick
- `src/components/Footer.tsx` — **baru**
- `src/routes/index.tsx` — pasang Footer
- `src/routes/about.tsx` — pasang Footer
- `src/routes/tips.tsx` — **dihapus**
