# Sky Stack — Prototype Brief (kandidat B)

## QUESTION
Apakah timing stacking satu tombol cukup fun dalam 2 menit tanpa penjelasan,
dan apakah pemain mengulang run-nya sendiri (replayability booth)?

## CORE VERB
Klik / ketuk / Spasi tepat saat blok yang melayang kiri-kanan pas di atas menara.
Satu tombol, satu keputusan per lantai: Perfect, terpotong, atau jatuh.

## THROWAWAY
Ya — satu file `index.html`, vanilla JS + Canvas, tanpa dependensi. Kalau KEEP,
ditulis ulang sebagai bagian dari build produksi (bukan copy-paste mentah).

## TIMEBOX
Satu sesi bangun prototype (~1 jam), lalu playtest manusia.

## KEEP IF
- Pemain baru paham verb tanpa penjelasan dalam ~30 detik, dan
- main lagi tanpa diminta setelah game over pertama, dan
- Perfect terasa memuaskan (snap + bunyi + popup), bukan sekadar angka.

## KILL IF
- Verb cuma terasa enak sesudah dijelaskan, atau
- run terasa membosankan / terlalu mudah / terlalu sulit dan tidak bisa
  diperbaiki dengan satu konstanta tuning, atau
- pemain berhenti setelah satu run dan tidak mau mengulang.

## RETUNE
Satu konstanta yang dicurigai: `BLOCK_SPEED_START` (terlalu lambat),
`SPEED_INCREASE` (naik terlalu curam), `PERFECT_WINDOW_PX` (terlalu ketat/longgar),
`BLOCK_W_START` (menara awal terlalu sempit/lebar).

## Perbedaan vs kandidat A (Sky Aim)
- Aim = reaksi + presisi klik target acak, skor dari kecepatan.
- Stack = timing + risiko (satu kesalahan memotong menara selamanya).
- Stack tidak butuh refleks cepat, cocok untuk pengunjung booth segala umur;
  Aim lebih cocok untuk gamer kompetitif. Pairwise dinilai pakai rubrik juri
  Devpost (Technological Implementation, Design, Potential Impact,
  Quality of the Idea, Presentation) + playtest.

## RESULT
2026-11-25 ~13:39 WIB — KEEP. Playtest Zec (HP): verdict "Sky stack" — lebih fun dari Sky Aim. Jadi entry utama Kategori 3, dibangun ulang sebagai produksi.
