# Sky Stack — Cloud9 x JetBrains: Sky's The Limit (Kategori 3: Event Mini Game)

Mini game booth Cloud9: tumpuk blok setinggi langit dengan satu tombol.
Satu run ideal di bawah 2 menit, tanpa tutorial, tanpa login, tanpa server —
skor tersimpan lokal di browser, jadi tetap jalan di booth tanpa Wi-Fi.

**Demo live:** https://naplex666.github.io/cloud9-sky-aim/
**Repo:** https://github.com/naplex666/cloud9-sky-aim
**Hackathon:** Cloud9 x JetBrains: Sky's The Limit (Devpost), deadline submit 13 Jan 2027 02:00 WIB.
**Lisensi:** MIT.

## Cara main
Klik / ketuk / Spasi saat blok yang melayang kiri-kanan tepat di atas menara.
- **Perfect** (|offset| ≤ 8 px): blok snap tanpa mengecil, bonus poin + partikel.
- **Meleset sebagian:** blok terpotong, sisanya jatuh.
- **Meleset total:** blok jatuh, game over.

Skor: 10 poin per blok + 10 bonus Perfect + 2 per level streak (maks +10).
Masukkan inisial 3 huruf kalau skor masuk Top 10.

## Cara menjalankan
- **Online:** buka link demo di atas.
- **Lokal:** `python3 -m http.server` di folder ini, buka `http://127.0.0.1:8000/`.
- **File langsung:** buka `index.html` di browser (semua aset lokal, tanpa CDN).

## Mode booth & monitor
- **Mode booth** — `?booth=1`: sesudah game over, hitung mundur 15 detik lalu otomatis kembali ke menu kalau tidak ada input. Tombol **LEWATI** untuk melewati entri inisial.
- **Leaderboard monitor** — `?board=1`: halaman leaderboard besar (all-time + harian), refresh otomatis tiap 2 detik dari localStorage. Pasang di monitor kedua di booth.
- **Debug** — `?debug=1`: HUD kecepatan, lebar blok, fps.

## Leaderboard
Dua papan skor lokal (localStorage, tanpa server):
- **All-time Top 10** — `skystack_board_all_v2`
- **Harian Top 10** — `skystack_board_daily_YYYY-MM-DD` (reset tiap hari)

Tombol **Reset leaderboard** (di menu + halaman board) menghapus keduanya sesudah konfirmasi.

## Struktur file
| File | Isi |
|---|---|
| `index.html` | Struktur layar: attract, HUD, hasil, board monitor |
| `styles.css` | Semua styling (tema Cloud9 navy `#0B1E3A` / sky `#00A8E8`) |
| `game.js` | Logika game: loop, fisika potongan, partikel, leaderboard, booth/board mode |
| `docs/METHODOLOGY.md` | Masalah, pendekatan, cara skor bekerja, tooling JetBrains |
| `docs/AI-WORKFLOW-STORY.md` | Case study bonus: Best AI-Powered Workflow Story |
| `prototypes/sky-aim/` | Prototype kandidat A (Sky Aim) — arsip |
| `prototypes/sky-stack/` | Prototype kandidat B (Sky Stack v1) — arsip |

## Status
- [x] Terdaftar di Devpost (solo, pojokkanan29) — 25 Nov 2026
- [x] Prototype A (Sky Aim) + B (Sky Stack) selesai, playtest Zec: **Sky Stack menang**
- [x] Build final Sky Stack produksi + demo live GitHub Pages
- [ ] Video demo maks 3 menit (YouTube, akun Pojok Kanan)
- [ ] Submit Devpost (deadline 13 Jan 2027 02:00 WIB)

Detail rencana: [BRIEF.md](BRIEF.md). Nama & aset original, tanpa aset Riot Games.
