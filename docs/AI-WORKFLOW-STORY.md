# AI-Powered Workflow Story — Sky Stack
*Case study untuk bonus prize Best AI-Powered Workflow Story (Cloud9 x JetBrains).*

## Ringkasnya
Dua kandidat mini game (Sky Aim dan Sky Stack) dirancang, diprototype,
diplaytest, dan dibandingkan dalam **satu hari kerja** — dari baca rules
Devpost sampai dua game playable yang live di GitHub Pages — dengan satu
manusia (Zec, phone-only) sebagai penentu akhir dan agen AI sebagai pelaksana.

## Alur kerja
1. **Riset oleh agen (pagi).** Agen membaca halaman Devpost dan submission
   specifics resmi, merangkum 3 kategori + 5 kriteria juri, dan merekomendasikan
   Kategori 3 (mini game) karena tidak butuh pengetahuan esports dalam.
   Manusia tidak perlu membaca puluhan halaman rules.
2. **Dua kandidat, bukan satu.** Sesuai mode win: agen membangun dua prototype
   sekali jalan, masing-masing satu file HTML vanilla:
   - **Sky Aim** — flick & reaction trainer (Blitz 60 detik + Reaction Sprint).
   - **Sky Stack** — timing stacking satu tombol.
   Keduanya greybox dulu: mechanic dulu, polish belakangan.
3. **Verifikasi mesin, bukan klaim.** Tiap prototype dicek: `node --check`
   untuk sintaks, nol dependensi eksternal, serve lokal + `curl` HTTP 200,
   dan hitung byte yang cocok. Angka proxy (mis. "task selesai") tidak pernah
   dilaporkan sebagai hasil — file yang tersaji yang dihitung.
4. **Keputusan oleh manusia.** Kedua prototype di-deploy ke GitHub Pages dan
   manusia memainkannya langsung dari HP. Verdict satu kata: **"Sky stack"**.
   Agen tidak memilih pemenang sendiri; playtest manusia yang menentukan
   keep/kill — sesuai brief prototype (`KEEP IF` / `KILL IF` ditulis sebelum
   ada yang main).
5. **Rewrite produksi.** Pemenang ditulis ulang bersih dengan struktur
   `index.html` + `styles.css` + `game.js` (bukan copy-paste prototype),
   ditambah fitur booth yang tidak ada di prototype: leaderboard harian +
   all-time Top 10, mode booth auto-reset 15 detik, dan halaman leaderboard
   monitor kedua (`?board=1`).

## Apa yang dikerjakan agen vs manusia
| | Agen AI | Manusia (Zec) |
|---|---|---|
| Riset rules & rubrik | ✅ | — |
| Desain 2 kandidat + brief | ✅ | — |
| Kode prototype + produksi | ✅ | — |
| Verifikasi teknis (serve, sintaks, byte) | ✅ | — |
| Deploy GitHub Pages | ✅ | — |
| **Pilih pemenang** | — | ✅ (playtest HP, verdict "Sky stack") |
| Aturan main (gratis saja, tanpa QR) | — | ✅ (ditetapkan di awal) |

## Yang dipercepat AI — dan yang tidak
- **Dipercepat:** riset, scaffolding, dan iterasi mekanik (dua game playable
  dalam hitungan jam, bukan hari). Tanpa AI, satu orang phone-only tidak bisa
  membangun dan mendeploy dua kandidat secepat ini.
- **Tidak digantikan:** selera dan keputusan. Agen bisa mengukur "loop jalan",
  tapi tidak bisa merasakan "game ini fun". Itu sebabnya playtest manusia
  dijaga sebagai gerbang keep/kill, dan kenapa kandidat yang secara teknis
  lebih "esports" (Sky Aim) kalah dari yang lebih sederhana (Sky Stack):
  manusia yang memainkannya yang tahu.
- **Kejujuran tooling:** kode trial JetBrains dari Devpost belum tiba saat
  build ini ditulis (email maks 5 hari kerja sesudah daftar). Workflow ini
  tidak mengklaim pemakaian JetBrains yang belum terjadi — rencana pemakaian
  WebStorm + Junie / JetBrains Air ada di `docs/METHODOLOGY.md`.
