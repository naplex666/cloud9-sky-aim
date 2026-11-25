# Cloud9 x JetBrains — Sky's The Limit — Kamar kerja

- Lomba: https://cloud9.devpost.com/
- Deadline submit: 12 Jan 2027 14:00 ET = 13 Jan 2027 02:00 WIB
- Hadiah: $25.000 total. Best tiap kategori $6.000 + tiket GDC + trip (Zec tidak bisa travel, incar cash), runner-up $2.000, bonus Best AI-Powered Workflow Story $1.000.
- Kategori dipilih: **Kategori 3 — Event Mini Game**
- Akun: Devpost pojokkanan29@gmail.com, solo, GitHub naplex666
- Aturan: wajib pakai minimal satu tool JetBrains (WebStorm + Junie / JetBrains Air). Repo publik + LICENSE. Demo jalan + video YouTube maks 3 menit + methodology + tooling explanation.
- Zec phone-only, alat gratis saja, kerja gratis langsung gas, duit nyata saja yang butuh izin. Jangan pakai QR.

## Keputusan kategori
Kategori 3 dipilih 25 Nov 2026: paling umum, tidak butuh pengetahuan esports dalam (berbeda dengan Kategori 1 VALORANT / 2 LoL yang dinilai pelatih pro Cloud9 dan butuh data GRID + insight taktis yang dalam). Game booth bisa dinilai dari: fun dalam <3 menit, kontrol instan, reset bersih, leaderboard lokal.

## Game: SKY AIM — Cloud9 Booth Flick & Reaction Trainer
- Satu sesi <3 menit, high replayability, kontrol mouse-only / tap saja, tanpa tutorial.
- Core verb: klik/tap target secepat dan seakurat mungkin (flick + reaction — skill yang benar-benar berguna buat gamer kompetitif).
- Mode:
  1. **Blitz 60 detik** — target muncul acak, skor dari kecepatan + ukuran + presisi (ring dalam = bonus), combo multiplier, miss putus combo.
  2. **Reaction Sprint** — 10 ronde, tunggu hijau lalu klik, rata-rata ms.
  3. **Flick Test** — 20 target, ukur jarak flick + waktu per target.
- Booth-ready: layar attract, tombol START besar, masuk inisial arcade 3 huruf, leaderboard lokal top 10 (localStorage, tanpa Wi-Fi), auto-reset ke attract sesudah 15 detik di layar hasil, mode `?booth=1`.
- Tema: Cloud9 — langit, awan, biru langit #00A8E8, navy #0B1E3A. Nama/art/aset ORIGINAL, tanpa aset Riot.
- Teknologi: web statis vanilla HTML/CSS/JS + Canvas, tanpa build step, tanpa dependensi berbayar, suara WebAudio (tanpa file eksternal). Deploy GitHub Pages. Bisa jalan offline sesudah load pertama.
- JetBrains: WebStorm (IDE) + Junie / JetBrains Air untuk coding agent. Commit folder `.idea` / `.junie` sebagai bukti pemakaian.

## Kriteria juri (Devpost)
1. Technological Implementation — pemakaian JetBrains yang nyata, implementasi non-trivial yang jalan.
2. Design — produk lengkap dan koheren, bukan proof-of-concept.
3. Potential Impact — solusi nyata buat audiens nyata (penggemar di booth, skill aim/reaction).
4. Quality of the Idea — kreatif dan beda.
5. Presentation — video demo jelas end-to-end.

## ATURAN UTAMA — aktif di kamar ini (Zec, 25 Nov 2026)
1. Skill terbaru — cek ROUTER.md dulu tiap tugas baru; teks murni + gratis langsung pasang, script/executable/API key = butuh gas eksplisit Zec.
2. API key — urutan: Nemotron (OpenRouter) dulu, Gemini cadangan, Xingchi cadangan kode (lambat 30–40 dtk), Groq JANGAN buat angka final. Hemat satu-satu, tanpa paralel/retry beruntun.
3. Gas tanpa nunggu perintah — kerjaan gratis langsung gas; yang wajib nunggu gas cuma DUIT NYATA. Submit/edit gratis jangan pernah nunggu konfirmasi.
4. Tugas baru → cek ROUTER.md dulu; install skill baru kalau dibutuhkan dan belum ada; cari di GitHub sesuai skill, pilih bintang tertinggi.
5. Mode win + brutal — baca rubrik scoring dulu, buat 2 kandidat + bandingkan pairwise, submit awal buat tes air lalu perbaiki dan submit ulang sampai dekat deadline (Devpost bisa diedit sampai deadline), tes kayak server; gas terus, satu kali submit bukan selesai.

## Mode win — 2 kandidat (pairwise)
- Kandidat A: **Sky Aim** — flick & reaction trainer (prototype lagi dibangun).
- Kandidat B: **Sky Stack** — timing stacking satu tombol (prototype sesudah A selesai, biar hemat satu-satu).
- Bandingkan pairwise pakai rubrik juri Devpost (Technological Implementation, Design, Potential Impact, Quality of Idea, Presentation) + playtest; yang menang jadi entry utama, yang kalah jadi cadangan / bisa di-submit sebagai entry kedua kalau bedanya cukup besar (Devpost boleh banyak entry yang beda substansial).
- Submit awal begitu satu kandidat playable + repo + video jadi (tes air), lalu perbaiki dan submit ulang mendekati deadline 13 Jan 02:00 WIB.

## Status
- [x] 25 Nov 2026: rules + submission specifics dibaca (verifikasi langsung dari cloud9.devpost.com)
- [x] Registrasi Devpost SELESAI 25 Nov 13:29 WIB — solo, akun pojokkanan29 (Pojok Kanan), tombol jadi "Start project", peserta 1.185. Kode trial JetBrains dikirim email maks 5 hari kerja sesudah daftar, tanpa form klaim tambahan.
- [x] Prototype kandidat A Sky Aim v1 SELESAI 25 Nov 13:29 WIB — prototypes/sky-aim/index.html (27.612 byte, tanpa dependensi eksternal, serve lokal HTTP 200 terverifikasi). Blitz 60 detik + Reaction Sprint 10 ronde + leaderboard lokal Top 5. Playtest manusia BELUM — penentu keep/kill.
- [ ] Polish + leaderboard + booth mode
- [ ] Repo GitHub publik + LICENSE + README (methodology + tooling)
- [ ] Demo live GitHub Pages (verifikasi langsung)
- [ ] Video demo maks 3 menit (YouTube, akun Pojok Kanan)
- [ ] Bonus: AI-Powered Workflow Story (case study singkat di repo)
- [ ] Submit Devpost sebelum 13 Jan 2027 02:00 WIB
