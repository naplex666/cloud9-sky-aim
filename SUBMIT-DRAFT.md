# Devpost submit draft — Sky Stack (Kategori 3)

Status: DRAF — submit awal (tes air) hanya sesudah (a) video demo terverifikasi,
(b) proyek BENAR-BENAR sudah dibuka/dikerjakan di WebStorm (trial 30 hari gratis
atau kode Devpost — lihat Tooling di bawah), (c) link demo + video dicek live.
Jangan submit dengan klaim tooling yang belum terjadi.

## Judul
Sky Stack — Cloud9 Booth Game

## Tagline
One button. Perfect timing. Stack the tower to the sky.

## Kategori
Category 3: Event Mini Game

## Link
- Repo: https://github.com/naplex666/cloud9-sky-aim
- Demo jalan: https://naplex666.github.io/cloud9-sky-aim/
- Booth mode: https://naplex666.github.io/cloud9-sky-aim/?booth=1
- Leaderboard monitor: https://naplex666.github.io/cloud9-sky-aim/?board=1
- Video demo: https://youtu.be/C2oIyiykV-I (YouTube, publik, channel Pojok Kanan, 86 dtk, bersuara — upload 25 Nov 18:02 WIB)
- Bonus AI Workflow Story: https://github.com/naplex666/cloud9-sky-aim/blob/main/docs/AI-WORKFLOW-STORY.md

## Deskripsi (Devpost)
Sky Stack is a fast, one-button stacking game built for the Cloud9 event booth.
Fans tap at the perfect moment to stack blocks higher and higher — a Perfect
drop keeps the block full-width, a sloppy drop slices it thinner, and one total
miss ends the run. A run takes under two minutes, anyone understands it in
seconds with no tutorial, and the booth keeps moving.

Booth-ready by design: arcade-style 3-letter initials, a local Top 10
all-time + daily leaderboard that works with no Wi-Fi, a 15-second auto-reset
in booth mode (?booth=1) so the next fan can step up, and a live leaderboard
page (?board=1) for a second monitor. Best score persists across runs even
without saving initials. Everything runs client-side — no server, no account,
no install — and keeps working offline after the first load.

Two prototypes were built and playtested head-to-head (Sky Aim, a flick/reaction
trainer, vs Sky Stack); Sky Stack won on fun and accessibility for booth
visitors of all ages, so it became the entry.

## Methodology (ringkas — lengkap di docs/METHODOLOGY.md)
See docs/METHODOLOGY.md in the repo. One mechanic, one button: timing stacking.
+10 per block, +10 Perfect bonus (+2/streak level, max +10), speed +12 px/s per
floor (180→520). Leaderboards in localStorage, all-time + daily Top 10.
Booth mode auto-resets after 15 s of no input. No server, no Wi-Fi needed.

## Tooling (JetBrains) — HARUS JUJUR saat submit
- WebStorm 2026.3.0.1 BENAR-BENAR dipakai pada repo ini (25 Nov 2026):
  analisis statis headless `inspect.sh` atas seluruh repo menemukan temuan
  nyata, dan 4 di antaranya diperbaiki di build v5 (game.js: fallback
  webkitAudioContext, String() pada HUD, hapus parameter `w` tak terpakai di
  blockFill; styles.css: hapus selector `.board li.me` yang mati). Laporan
  inspeksi ada di docs/WEBSTORM-INSPECT-REPORT.txt. GUI WebStorm sempat dibuka
  (dialog User Agreement muncul) tapi prosesnya mati 2x sesudah klik Continue
  di VM ini — diduga kehabisan memori; jalur headless yang dipakai.
- Kode trial Devpost (All Products Pack + AI Ultimate, 2 bulan) BELUM sampai —
  dikirim email maks 5 hari kerja sesudah daftar 25 Nov (s.d. ~2 Des). Begitu
  sampai, proyek dibuka di GUI WebStorm untuk polish lanjutan + Junie/Air.
- Junie dan JetBrains Air BELUM dipakai — JANGAN klaim di Devpost/video.
  Tulis di Devpost: "Analyzed and polished with JetBrains WebStorm
  (built-in code inspections, headless inspect.sh)".

## Checklist submit awal — SELESAI 25 Nov 2026 18:09 WIB
- [x] Video demo di YouTube (publik, 86 dtk, bersuara) — https://youtu.be/C2oIyiykV-I, link dicek live
- [x] WebStorm benar-benar dipakai (inspect.sh headless + 4 perbaikan build v5) — laporan di docs/WEBSTORM-INSPECT-REPORT.txt; .idea tidak di-commit (cuma workspace.xml kosong)
- [x] Demo link + repo link dicek live dari browser
- [x] Deskripsi + methodology + tooling diisi jujur (Junie/Air = No)
- [x] Kategori 3 dipilih, bonus story link diisi
- [x] Submit → https://devpost.com/software/sky-stack-cloud9-booth-game — banner "Project submitted!" terverifikasi langsung 18:09 WIB

## Rencana submit ulang (dekat deadline 13 Jan 2027 02:00 WIB)
- Begitu kode trial Devpost sampai (~2 Des): buka proyek di GUI WebStorm, polish + coba Junie/Air, update methodology/tooling jujur.
- Perbaiki/tingkatkan game bila ada temuan baru; submit ulang (edit entry yang sama).
