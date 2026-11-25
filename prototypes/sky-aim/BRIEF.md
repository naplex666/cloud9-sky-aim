# Prototype: Sky Aim v1

QUESTION: Apakah klik target yang muncul acak (flick + reaction) terasa fun dalam 60 detik tanpa tutorial — cukup untuk jadi game booth Cloud9?
CORE VERB: Klik/tap target secepat dan seakurat mungkin, jaga combo.
THROWAWAY: yes — satu file `index.html`, greybox (lingkaran + awan CSS), rewrite saat masuk produksi.
TIMEBOX: 1 sesi bangun v1, 25 Nov 2026.
KEEP IF: pemain baru paham core verb dalam ~30 detik tanpa penjelasan, dan mau main lagi (replay) tanpa disuruh.
KILL IF: verb hanya terasa enak sesudah dijelaskan, atau fun-nya butuh sistem di luar prototype (level, musuh, progression).
RESULT: (kosong — isi sesudah playtest manusia oleh Zec)

## Isi v1
- `index.html` — vanilla HTML/CSS/JS + Canvas, tanpa dependensi eksternal.
- Blitz 60 detik: spawn target acak, skor base 100 + bonus presisi (kena tengah) + bonus kecepatan, combo ×1.0–×2.0, miss −25 & combo putus, target mengecil + hilang sendiri.
- Reaction Sprint 10 ronde: tunggu hijau, klik, catat ms, false start mengulang ronde.
- Leaderboard lokal Top 5 Blitz (localStorage, tanpa Wi-Fi) + inisial arcade 3 huruf.
- Suara WebAudio (beep), tombol mute. Tema Cloud9 navy #0B1E3A / sky #00A8E8, awan CSS.
- Debug HUD via `?debug=1` (spawn interval, target aktif, reaksi terakhir, fps).
- Tuning constants di atas `<script>`: BLITZ_DURATION_MS, SPAWN_INTERVAL_MS/MIN, TARGET_LIFETIME_MS, TARGET_MIN/MAX_R, BASE_SCORE, PRECISION/SPEED_BONUS_MAX, MISS_PENALTY, COMBO_STEP/CAP, REACTION_ROUNDS/MIN/MAX_WAIT.

## Belum di v1 (produksi)
- Flick Test (mode ke-3), mode `?booth=1` + auto-reset attract, Top 10 + leaderboard harian, layar leaderboard terpisah buat monitor kedua, polish game-feel (shake, slow-mo combo), `.idea`/`.junie` JetBrains.
