Pindahkan switch "Animasi halus" dari posisi shared (di bawah kedua tab) ke dalam TabsContent value="pct" saja, sehingga switch hanya terlihat di tab Persentase dan tidak muncul di tab Equity.

**Files to edit:** `src/routes/index.tsx`

**Changes:**
1. Pindahkan `<div className="flex items-center justify-end gap-2">...</div>` (switch Animasi halus) ke dalam `TabsContent value="pct"` di bawah `PercentTab`.
2. Pastikan smoothAnim state dan prop forwarding tetap berfungsi.