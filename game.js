"use strict";
/* ================================================================
   SKY STACK — produksi (Cloud9 x JetBrains, Kategori 3)
   Vanilla JS + Canvas, tanpa dependensi eksternal.
   Ditulis ulang bersih dari prototype v1 (bukan copy-paste).
   ================================================================ */

/* ---------- Tuning: ubah satu nilai di sini untuk retune ---------- */
const BLOCK_H = 26;               // tinggi tiap blok (px)
const BLOCK_W_START = 220;        // lebar blok pertama (px)
const BLOCK_SPEED_START = 180;    // kecepatan blok melayang awal (px/detik)
const SPEED_INCREASE = 12;        // tambah kecepatan per lantai (px/detik)
const SPEED_MAX = 520;            // kecepatan maksimum (px/detik)
const PERFECT_WINDOW_PX = 8;      // |offset| <= ini = Perfect (snap, tanpa potong)
const SCORE_BLOCK = 10;           // poin per blok yang berhasil diletak
const SCORE_PERFECT_BONUS = 10;   // bonus poin per Perfect
const SCORE_STREAK_STEP = 2;      // bonus tambahan per level streak (maks +10)
const GRAVITY = 1400;             // gravitasi potongan jatuh (px/detik^2)
const CAMERA_ANCHOR = 0.30;       // posisi vertikal puncak menara di layar (0..1)
const GROUND_MARGIN = 24;         // jarak garis tanah dari bawah canvas (px)
const BOARD_MAX = 10;             // entri per leaderboard
const BOARD_KEY_ALL = "skystack_board_all_v2";
const BEST_KEY = "skystack_best_v1";
const MUTE_KEY = "skystack_muted";
const BOOTH_TIMEOUT_S = 15;       // auto-reset booth sesudah game over (detik)

/* ---------- Parameter URL ---------- */
const params = new URLSearchParams(window.location.search);
const BOOTH = params.get("booth") === "1";
const BOARD_MODE = params.get("board") === "1";
const DEBUG = params.get("debug") === "1";
if (BOOTH) document.body.classList.add("booth");

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const canvas = $("game");
const ctx = canvas.getContext("2d");
const hudScore = $("hud-score"), hudHeight = $("hud-height"),
      hudPerfect = $("hud-perfect"), hudBest = $("hud-best");
const btnMute = $("btn-mute"), btnMenu = $("btn-menu");
const screenAttract = $("screen-attract"), screenOver = $("screen-over");
const finalScore = $("final-score"), finalDetail = $("final-detail");
const boothCountdownEl = $("booth-countdown");
const initialsRow = $("initials-row"), initialsInput = $("initials"),
      btnSave = $("btn-save"), btnSkip = $("btn-skip");
const btnStart = $("btn-start"), btnAgain = $("btn-again"), btnToMenu = $("btn-to-menu");
const debugEl = $("debug");
const playHint = $("play-hint");
if (DEBUG) debugEl.classList.add("on");
function showPlayHint() { if (playHint) playHint.classList.remove("hidden"); }
function hidePlayHint() { if (playHint) playHint.classList.add("hidden"); }

/* ---------- Audio (WebAudio, tanpa file; mute tersimpan) ---------- */
let audioCtx = null;
let muted = false;
try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch (e) { muted = false; }
function paintMute() { btnMute.innerHTML = muted ? "&#128263;" : "&#128266;"; }
function ensureAudio() {
  if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; } }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
function beep(freq, durMs, type, vol) {
  if (muted || !audioCtx) return;
  try {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.12, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durMs / 1000);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + durMs / 1000);
  } catch (e) { /* suara opsional, jangan matikan game */ }
}
const sfxPlace = () => beep(440, 90, "sine", 0.12);
const sfxPerfect = () => { beep(660, 90, "sine", 0.12); setTimeout(() => beep(880, 140, "sine", 0.12), 70); };
const sfxOver = () => { beep(220, 220, "sawtooth", 0.08); setTimeout(() => beep(147, 320, "sawtooth", 0.08), 160); };
btnMute.addEventListener("click", (e) => {
  e.stopPropagation();
  muted = !muted;
  try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch (err) { /* abaikan */ }
  paintMute();
});

/* ---------- Leaderboard lokal: all-time + harian ---------- */
function todayKey() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return "skystack_board_daily_" + d.getFullYear() + "-" + m + "-" + day;
}
function loadBoard(key) {
  try { const v = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(v) ? v : []; }
  catch (e) { return []; }
}
function saveBoard(key, board) {
  try { localStorage.setItem(key, JSON.stringify(board)); } catch (e) { /* storage penuh: main tetap jalan */ }
}
function qualifies(score, key) {
  if (score <= 0) return false;
  const b = loadBoard(key);
  return b.length < BOARD_MAX || score > b[b.length - 1].score;
}
function addEntry(name, score, height, perfect) {
  const entry = { name, score, height, perfect, date: Date.now() };
  for (const key of [BOARD_KEY_ALL, todayKey()]) {
    const b = loadBoard(key);
    b.push(entry);
    b.sort((a, b2) => b2.score - a.score);
    saveBoard(key, b.slice(0, BOARD_MAX));
  }
}
/* Skor terbaik tersimpan terpisah dari leaderboard: bertahan walau pemain
   tidak menyimpan inisial. Dicatat saat game over, bukan saat simpan. */
function loadBest() {
  try { const v = parseInt(localStorage.getItem(BEST_KEY) || "0", 10); return Number.isFinite(v) ? Math.max(0, v) : 0; }
  catch (e) { return 0; }
}
function recordBest(score) {
  if (score <= 0) return;
  try {
    if (score > loadBest()) localStorage.setItem(BEST_KEY, String(score));
  } catch (e) { /* storage penuh: main tetap jalan */ }
}
function bestScore() {
  const b = loadBoard(BOARD_KEY_ALL);
  return Math.max(loadBest(), b.length ? b[0].score : 0);
}
function clearBoards() {
  saveBoard(BOARD_KEY_ALL, []);
  saveBoard(todayKey(), []);
  try { localStorage.removeItem(BEST_KEY); } catch (e) { /* abaikan */ }
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function renderBoardInto(listEl, key, max) {
  if (!listEl) return;
  const b = loadBoard(key).slice(0, max || BOARD_MAX);
  if (!b.length) { listEl.innerHTML = '<li class="empty">Belum ada skor &mdash; jadilah yang pertama!</li>'; return; }
  listEl.innerHTML = b.map((e, i) =>
    "<li><span>" + (i + 1) + ". " + escapeHtml(e.name) + "</span><span>" +
    e.score + " pts &middot; " + e.height + " lantai</span></li>").join("");
}
function renderAllBoards() {
  renderBoardInto($("board-attract"), BOARD_KEY_ALL, 5);
  renderBoardInto($("board-over-all"), BOARD_KEY_ALL, 10);
  renderBoardInto($("board-over-daily"), todayKey(), 10);
  renderBoardInto($("board-live-all"), BOARD_KEY_ALL, 10);
  renderBoardInto($("board-live-daily"), todayKey(), 10);
  const daily = loadBoard(todayKey());
  const dailyEl = $("daily-best-attract");
  if (dailyEl) dailyEl.textContent = daily.length
    ? "Terbaik hari ini: " + daily[0].name + " — " + daily[0].score + " pts"
    : "Belum ada skor hari ini.";
}

/* ---------- State game ---------- */
const PALETTE = [
  ["#00A8E8", "#0091DA"], ["#FFFFFF", "#BFE6F7"], ["#4DB8E8", "#1E7FB8"],
  ["#7CCBF2", "#0091DA"], ["#E8F6FD", "#4DB8E8"], ["#1E7FB8", "#0B1E3A"],
];
let state = "attract";           // attract | playing | over
let tower = [];                  // {x, y, w} dari bawah ke atas
let moving = null;               // {x, y, w, dir, speed}
let falling = [];                // potongan jatuh {x, y, w, vy}
let particles = [];              // {x, y, vx, vy, life, max, color, size}
let popups = [];                 // {x, y, text, life, color}
let score = 0, height = 0, perfectCount = 0, perfectStreak = 0, maxPerfectStreak = 0;
let camY = 0, camTarget = 0;
let shakeT = 0, shakeMag = 0;
let savedThisRun = false;
let fpsEMA = 60, lastT = 0;
let boothTimer = null, boothLeft = BOOTH_TIMEOUT_S;

/* Awan parallax: dua lapis (jauh lambat, dekat cepat). */
const clouds = [];
for (let i = 0; i < 9; i++) {
  clouds.push({
    x: Math.random() * 520, y: 16 + Math.random() * 260,
    s: 0.5 + Math.random() * 0.9, v: 5 + Math.random() * 12,
    layer: i % 2, // 0 = jauh, 1 = dekat
  });
}

let W = 520, H = 620, DPR = 1;
function ground() { return H - GROUND_MARGIN; }
function topBlock() { return tower[tower.length - 1]; }
function topY() { return tower.length ? topBlock().y : ground(); }
function curSpeed() { return Math.min(SPEED_MAX, BLOCK_SPEED_START + height * SPEED_INCREASE); }

function resize() {
  const rect = canvas.getBoundingClientRect();
  W = Math.max(280, rect.width);
  H = Math.max(420, rect.height);
  DPR = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const gy = ground();
  for (let i = 0; i < tower.length; i++) tower[i].y = gy - BLOCK_H * (i + 1);
  if (moving) moving.y = topY() - BLOCK_H - 4;
}
window.addEventListener("resize", resize);

/* ---------- Alur layar ---------- */
function showAttract() {
  stopBoothTimer();
  state = "attract";
  score = 0; height = 0; perfectStreak = 0;
  hidePlayHint();
  screenOver.classList.add("hidden");
  screenAttract.classList.remove("hidden");
  renderAllBoards();
  updateHud();
}
function newGame() {
  stopBoothTimer();
  tower = []; falling = []; particles = []; popups = [];
  score = 0; height = 0; perfectCount = 0; perfectStreak = 0; maxPerfectStreak = 0;
  camY = 0; camTarget = 0; shakeT = 0;
  savedThisRun = false;
  const w0 = Math.min(BLOCK_W_START, W * 0.55);
  tower.push({ x: (W - w0) / 2, y: ground() - BLOCK_H, w: w0 });
  spawnMoving();
  state = "playing";
  screenAttract.classList.add("hidden");
  screenOver.classList.add("hidden");
  showPlayHint();
  updateHud();
}
function spawnMoving() {
  const prev = topBlock();
  const w = prev.w;
  const dir = Math.random() < 0.5 ? 1 : -1;
  moving = { x: dir > 0 ? 0 : W - w, y: topY() - BLOCK_H - 4, w, dir, speed: curSpeed() };
}
function updateHud() {
  hudScore.textContent = score;
  hudHeight.textContent = height;
  hudPerfect.textContent = perfectStreak + "\u00d7";
  hudBest.textContent = Math.max(bestScore(), score);
}

/* ---------- Booth mode: auto-reset 15 detik ---------- */
function startBoothTimer() {
  if (!BOOTH) return;
  stopBoothTimer();
  boothLeft = BOOTH_TIMEOUT_S;
  paintBoothCountdown();
  boothTimer = setInterval(() => {
    boothLeft -= 1;
    if (boothLeft <= 0) { showAttract(); return; }
    paintBoothCountdown();
  }, 1000);
}
function stopBoothTimer() {
  if (boothTimer) { clearInterval(boothTimer); boothTimer = null; }
}
function paintBoothCountdown() {
  if (boothCountdownEl) boothCountdownEl.textContent =
    "Kembali ke menu dalam " + boothLeft + " dtk — ketuk apa saja untuk tetap di sini.";
}
function pokeBoothTimer() { if (BOOTH && state === "over") startBoothTimer(); }

/* ---------- Core verb: jatuhkan blok ---------- */
function spawnParticles(x, y, n, colors) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 160;
    particles.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 80,
      life: 0.7 + Math.random() * 0.4, max: 1.1,
      color: colors[i % colors.length], size: 2 + Math.random() * 4,
    });
  }
}
function drop() {
  if (state !== "playing" || !moving) return;
  ensureAudio();
  const prev = topBlock();
  const m = moving;
  const offset = m.x - prev.x;
  const left = Math.max(m.x, prev.x);
  const right = Math.min(m.x + m.w, prev.x + prev.w);
  const overlap = right - left;

  if (overlap <= 0) {
    // Meleset total: blok jatuh, game over.
    falling.push({ x: m.x, y: m.y, w: m.w, vy: 0 });
    moving = null;
    perfectStreak = 0;
    shakeT = 0.3; shakeMag = 7;
    sfxOver();
    state = "over";
    recordBest(score);
    hidePlayHint();
    updateHud();
    setTimeout(showGameOver, 650);
    return;
  }

  let placed, gained;
  if (Math.abs(offset) <= PERFECT_WINDOW_PX) {
    // Perfect: snap, lebar utuh, bonus + streak.
    placed = { x: prev.x, y: topY() - BLOCK_H, w: prev.w };
    perfectCount++;
    perfectStreak++;
    maxPerfectStreak = Math.max(maxPerfectStreak, perfectStreak);
    gained = SCORE_BLOCK + SCORE_PERFECT_BONUS + Math.min(10, SCORE_STREAK_STEP * (perfectStreak - 1));
    popups.push({ x: placed.x + placed.w / 2, y: placed.y - 6,
      text: perfectStreak > 1 ? "PERFECT x" + perfectStreak : "PERFECT!", life: 1, color: "#FFC53D" });
    spawnParticles(placed.x + placed.w / 2, placed.y, 16, ["#FFC53D", "#FFFFFF", "#00A8E8"]);
    sfxPerfect();
  } else {
    // Terpotong: hanya bagian yang menumpuk yang bertahan.
    placed = { x: left, y: topY() - BLOCK_H, w: overlap };
    const cutW = m.w - overlap;
    if (cutW > 0) falling.push({ x: offset > 0 ? right : m.x, y: placed.y, w: cutW, vy: 0 });
    perfectStreak = 0;
    gained = SCORE_BLOCK;
    popups.push({ x: placed.x + placed.w / 2, y: placed.y - 6, text: "+" + gained, life: 1, color: "#FFFFFF" });
    spawnParticles(placed.x + placed.w / 2, placed.y, 6, ["#FFFFFF", "#BFE6F7"]);
    shakeT = 0.15; shakeMag = 4;
    sfxPlace();
  }
  score += gained;
  tower.push(placed);
  height++;
  moving = null;
  camTarget = Math.min(0, topY() - H * CAMERA_ANCHOR);
  hidePlayHint();
  updateHud();
  spawnMoving();
}

function showGameOver() {
  if (state !== "over") return;
  recordBest(score);
  finalScore.textContent = score;
  finalDetail.textContent = "Tinggi " + height + " lantai \u00b7 Perfect " + perfectCount +
    " (streak maks " + maxPerfectStreak + "\u00d7) \u00b7 Best " + Math.max(bestScore(), score);
  const canSave = qualifies(score, BOARD_KEY_ALL) || qualifies(score, todayKey());
  initialsRow.classList.toggle("hidden", !canSave);
  initialsInput.value = "";
  renderAllBoards();
  screenOver.classList.remove("hidden");
  startBoothTimer();
  btnAgain.focus();
}

/* ---------- Input: satu tombol ---------- */
canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  pokeBoothTimer();
  if (state === "playing") drop();
});
// Interaksi apa pun di layar hasil (tombol, input) mengulang hitung mundur booth.
document.addEventListener("pointerdown", () => pokeBoothTimer());
window.addEventListener("keydown", (e) => {
  if (e.code !== "Space" && e.code !== "Enter") return;
  if (document.activeElement === initialsInput) return; // biarkan ketik inisial
  if (document.activeElement && document.activeElement.tagName === "BUTTON") document.activeElement.blur();
  e.preventDefault();
  pokeBoothTimer();
  if (state === "attract") { ensureAudio(); newGame(); }
  else if (state === "playing") drop();
});
function clickBlur(fn) {
  return (e) => { e.currentTarget.blur(); fn(); };
}
btnStart.addEventListener("click", clickBlur(() => { ensureAudio(); newGame(); }));
btnAgain.addEventListener("click", clickBlur(() => { ensureAudio(); newGame(); }));
btnToMenu.addEventListener("click", clickBlur(showAttract));
btnMenu.addEventListener("click", (e) => { e.stopPropagation(); showAttract(); });
btnSave.addEventListener("click", clickBlur(() => {
  if (savedThisRun) return;
  const name = (initialsInput.value || "YOU").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3) || "YOU";
  addEntry(name, score, height, perfectCount);
  savedThisRun = true;
  initialsRow.classList.add("hidden");
  renderAllBoards();
  updateHud();
  btnAgain.focus();
}));
btnSkip.addEventListener("click", clickBlur(() => {
  initialsRow.classList.add("hidden");
  btnAgain.focus();
}));
function bindReset(btn) {
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (window.confirm("Hapus semua skor leaderboard (all-time + hari ini)?")) {
      clearBoards();
      renderAllBoards();
    }
  });
}
bindReset($("btn-reset-attract"));
bindReset($("btn-reset-board"));

/* ---------- Gambar ---------- */
function rr(x, y, w, h, r) {
  r = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function drawCloud(cx, cy, s, alpha) {
  ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
  ctx.beginPath();
  ctx.arc(cx, cy, 16 * s, 0, Math.PI * 2);
  ctx.arc(cx + 18 * s, cy - 6 * s, 13 * s, 0, Math.PI * 2);
  ctx.arc(cx + 36 * s, cy, 15 * s, 0, Math.PI * 2);
  ctx.arc(cx + 18 * s, cy + 5 * s, 14 * s, 0, Math.PI * 2);
  ctx.fill();
}
function blockFill(i, x, y, w) {
  const pair = PALETTE[i % PALETTE.length];
  const g = ctx.createLinearGradient(x, y, x, y + BLOCK_H);
  g.addColorStop(0, pair[0]);
  g.addColorStop(1, pair[1]);
  return g;
}
function drawBlock(b, i, isMoving) {
  const sy = b.y - camY;
  if (sy > H + 40 || sy < -60) return;
  ctx.fillStyle = blockFill(i, b.x, sy, b.w);
  rr(b.x, sy, b.w, BLOCK_H, 5);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(b.x + 4, sy + 3, b.w - 8, 4);
  ctx.strokeStyle = isMoving ? "#FFC53D" : "rgba(11,30,58,0.45)";
  ctx.lineWidth = isMoving ? 2 : 1;
  ctx.stroke();
}
function draw(dt) {
  ctx.save();
  if (shakeT > 0) ctx.translate((Math.random() - 0.5) * shakeMag * 2, (Math.random() - 0.5) * shakeMag * 2);

  // Langit.
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#0B1E3A");
  g.addColorStop(0.55, "#155A83");
  g.addColorStop(1, "#1E7FB8");
  ctx.fillStyle = g;
  ctx.fillRect(-10, -10, W + 20, H + 20);

  // Awan parallax dua lapis.
  for (const c of clouds) {
    c.x += c.v * dt;
    if (c.x - 60 * c.s > W) c.x = -60 * c.s;
    const par = c.layer === 0 ? 0.06 : 0.14;
    let cy = (c.y - camY * par) % (H + 120);
    if (cy < -60) cy += H + 120;
    drawCloud(c.x, cy, c.s, c.layer === 0 ? 0.4 : 0.85);
  }

  // Garis tanah.
  const gy = ground() - camY;
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();

  // Menara.
  for (let i = 0; i < tower.length; i++) drawBlock(tower[i], i, false);

  // Blok bergerak + garis panduan.
  if (moving && state === "playing") {
    const my = moving.y - camY;
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.moveTo(moving.x + moving.w / 2, my + BLOCK_H);
    ctx.lineTo(moving.x + moving.w / 2, topY() - camY);
    ctx.stroke();
    ctx.restore();
    drawBlock(moving, height, true);
  }

  // Potongan jatuh.
  for (const f of falling) {
    const fy = f.y - camY;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    rr(f.x, fy, f.w, BLOCK_H, 5);
    ctx.fill();
  }

  // Partikel.
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y - camY, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Popup skor.
  ctx.textAlign = "center";
  ctx.font = "800 18px system-ui, sans-serif";
  for (const p of popups) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y - camY);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- Loop utama ---------- */
function loop(t) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, lastT ? (t - lastT) / 1000 : 0.016);
  lastT = t;
  if (dt > 0) fpsEMA = fpsEMA * 0.95 + (1 / dt) * 0.05;

  if (state === "playing" && moving) {
    moving.x += moving.dir * moving.speed * dt;
    if (moving.x <= 0) { moving.x = 0; moving.dir = 1; }
    if (moving.x + moving.w >= W) { moving.x = W - moving.w; moving.dir = -1; }
  }
  camY += (camTarget - camY) * Math.min(1, dt * 6);
  if (shakeT > 0) shakeT -= dt;
  for (let i = falling.length - 1; i >= 0; i--) {
    const f = falling[i];
    f.vy += GRAVITY * dt;
    f.y += f.vy * dt;
    if (f.y - camY > H + 80) falling.splice(i, 1);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vy += 500 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
  for (let i = popups.length - 1; i >= 0; i--) {
    const p = popups[i];
    p.y -= 34 * dt;
    p.life -= dt * 1.4;
    if (p.life <= 0) popups.splice(i, 1);
  }

  draw(dt);

  if (DEBUG) {
    debugEl.textContent =
      "state=" + state +
      "  speed=" + (moving ? moving.speed.toFixed(0) : "-") + " px/s" +
      "  w=" + (moving ? moving.w.toFixed(0) : (tower.length ? topBlock().w.toFixed(0) : "-")) +
      "  fps=" + fpsEMA.toFixed(0) +
      "\nheight=" + height + "  score=" + score +
      "  perfect=" + perfectCount + "  streak=" + perfectStreak +
      "  camY=" + camY.toFixed(0) + "  particles=" + particles.length;
  }
}

/* ---------- Mode leaderboard monitor (?board=1) ---------- */
function initBoardView() {
  document.getElementById("game-view").classList.add("hidden");
  document.getElementById("board-view").classList.remove("hidden");
  const d = new Date();
  const dateEl = $("board-date");
  if (dateEl) dateEl.textContent = d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  renderAllBoards();
  setInterval(renderAllBoards, 2000);
}

/* ---------- Init ---------- */
paintMute();
resize();
renderAllBoards();
updateHud();
if (BOARD_MODE) {
  initBoardView();
} else {
  requestAnimationFrame(loop);
}
