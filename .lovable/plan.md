## Perubahan

1. **Default light mode** — di `ThemeToggle.tsx`, hapus pengecekan `prefers-color-scheme: dark`. Default selalu light kecuali user pernah pilih dark (tersimpan di localStorage).
2. **Icon zigzag turun** — ganti `ArrowDown` di `Header.tsx` dengan `TrendingDown` dari lucide-react (garis zigzag yang menurun). Diterapkan juga sebagai favicon via `link` di `__root.tsx` head (inline SVG data URL bentuk yang sama).
3. **Hapus tombol Install** — buang elemen `<Button>Install</Button>` di `Header.tsx`, sisakan hanya `ThemeToggle`.
4. **Mobile responsive** — audit & rapikan:
   - Header: di layar sempit, tagline boleh tetap di bawah judul; pastikan tidak overflow.
   - Tabs/inputs/slider: sudah pakai `max-w-2xl` + padding `px-4`, cek tidak ada lebar tetap yang memotong di <380px.
   - Result card: label + value tetap pada baris yang sama, gunakan `gap` yang fleksibel.
   - Chart: kurangi tinggi pada mobile (`h-[260px] sm:h-[340px]`), perkecil `YAxis width` & font tick di mobile.
   - Actions row: tetap 2 kolom, tinggi tombol pas untuk tap target.
   - EquityTab input: dari `w-44` ke `w-36 sm:w-44` agar muat di 360px.
