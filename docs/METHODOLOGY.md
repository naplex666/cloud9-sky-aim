# Methodology — Sky Stack

## Masalah yang diselesaikan
Di booth event Cloud9, antrean penggemar harus terhibur dalam hitungan menit,
sementara staf booth tidak bisa mengajari tiap orang cara main, menjaga server,
atau mengandalkan Wi-Fi venue yang sering padat. Game booth yang bagus harus:
dimengerti dalam 30 detik tanpa tutorial, selesai dalam < 3 menit, reset bersih
antar pemain, dan tetap jalan saat jaringan mati.

## Pendekatan
Satu mechanic, satu tombol: **timing stacking**. Blok melayang kiri-kanan,
pemain menekan tepat saat blok pas di atas menara. Satu keputusan per lantai —
Perfect, terpotong, atau jatuh — dan satu kesalahan memotong menara selamanya,
jadi tiap run punya ketegangan sendiri tanpa perlu aturan tambahan.

Kenapa stacking, bukan aim trainer atau game kompleks lain:
- **Tanpa refleks cepat.** Cocok untuk pengunjung booth segala umur dan level,
  bukan cuma gamer kompetitif (ini alasan Sky Stack menang atas kandidat
  Sky Aim di playtest: flick/reaction butuh skill yang tidak semua pengunjung punya).
- **Satu tombol = nol tutorial.** Klik, ketuk, atau Spasi — semua perangkat bisa.
- **Sesi pendek, replay tinggi.** Run ideal < 2 menit; game over selalu terasa
  "satu kali lagi", antrean tetap bergerak.

## Cara skor & leaderboard bekerja
- Tiap blok yang berhasil diletak: **+10 poin**.
- Perfect (|offset| ≤ 8 px): blok snap ke lebar penuh + **+10 bonus** + **+2 per
  level streak** (maks +10). Streak putus saat blok terpotong.
- Kecepatan blok naik **+12 px/detik per lantai** (awal 180, maks 520), jadi
  kesulitan naik halus tanpa lonjakan.
- Dua papan skor di `localStorage` (tanpa server, tanpa akun):
  - All-time Top 10 (`skystack_board_all_v2`)
  - Harian Top 10 (`skystack_board_daily_YYYY-MM-DD`, ganti tiap hari)
- Entri inisial arcade 3 huruf hanya muncul kalau skor masuk Top 10 salah
  satu papan; tombol **LEWATI** selalu tersedia.

## Kenapa tanpa server / Wi-Fi
Semua state (skor, leaderboard, pengaturan mute) hidup di browser. Game bisa
dimuat sekali lalu jalan offline. Leaderboard monitor kedua (`?board=1`)
membaca `localStorage` yang sama tiap 2 detik — di booth, satu mesin bisa
menjalankan game di layar utama dan leaderboard di monitor kedua tanpa kabel
jaringan tambahan.

## Booth mode
`?booth=1` mengaktifkan hitung mundur 15 detik di layar hasil: kalau tidak ada
input, game kembali sendiri ke layar attract untuk pemain berikutnya. Sentuhan
atau tombol apa pun mengulang hitung mundur, jadi pemain yang sedang memasukkan
inisial tidak tiba-tiba ditendang.

## Game feel
Perfect memicu partikel emas + bunyi dua nada; blok terpotong memicu getaran
layar ringan; kamera mengikuti puncak menara dengan halus; awan parallax dua
lapis dan gradasi langit memberi rasa "naik ke langit" sesuai nama Cloud9.
Suara dibuat dengan WebAudio (tanpa file audio eksternal), mute tersimpan.

## Tooling (JetBrains) — jujur
Persyaratan lomba: proyek dibangun memakai minimal satu tool JetBrains.
Pemakaian yang benar-benar terjadi (25 Nov 2026):
- **WebStorm 2026.3.0.1 dipakai untuk analisis statis repo ini** lewat
  `inspect.sh` (headless, profil SkyStack: unresolved/unused/duplicate
  symbols dan pemeriksaan bawaan lain). Inspeksi menemukan temuan nyata;
  4 temuan produksi diperbaiki di build v5 — `game.js`: fallback
  `webkitAudioContext` ditulis ulang (bracket notation), nilai HUD dibungkus
  `String()`, parameter `w` yang tak terpakai dihapus dari `blockFill`;
  `styles.css`: selector `.board li.me` yang mati dihapus. Tiga temuan
  "unused selector" lain diverifikasi sebagai false positive (class
  dipakai dinamis dari JS: `.armed`, `.empty`, `#debug.on`) dan dibiarkan.
  Laporan lengkap: `docs/WEBSTORM-INSPECT-REPORT.txt`.
- **GUI WebStorm sempat dibuka** (dialog User Agreement muncul di Xvfb),
  tapi prosesnya mati 2x sesudah klik Continue di VM ini — diduga kehabisan
  memori — jadi inspeksi headless yang dipakai. Folder `.idea` / `.junie`
  **sengaja tidak dibuat palsu**; folder itu di-commit hanya begitu
  WebStorm GUI benar-benar dipakai.
- **Kode trial Devpost** (All Products Pack + AI Ultimate, 2 bulan) belum
  sampai saat dokumen ini ditulis — dikirim email maksimal 5 hari kerja
  sesudah pendaftaran 25 Nov 2026 (s.d. ~2 Des). Begitu sampai, proyek
  dibuka di GUI WebStorm untuk polish lanjutan.
- **Junie dan JetBrains Air belum dipakai** — tidak diklaim di mana pun.
- Build produksi ini ditulis sebagai vanilla HTML/CSS/JS tanpa build step,
  jadi pindah ke WebStorm nanti tidak butuh perubahan arsitektur apa pun.

## Batasan yang diketahui
- Leaderboard lokal per perangkat: skor di satu mesin booth tidak sinkron ke
  mesin lain (sengaja — tanpa server, ini trade-off yang diterima).
- Tidak ada mode multiplayer; game ini single-player bergiliran, sesuai
  kebutuhan booth.
