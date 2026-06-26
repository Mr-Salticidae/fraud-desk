import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const ffmpeg = path.join(projectRoot, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe');

// Serve the game (../index.html) however you like; default assumes the demo's
// preview server on :5273. Override with GAME_URL.
const GAME_URL = process.env.GAME_URL || 'http://localhost:5273/index.html';
const CASE_Q = process.env.CASE_Q || 'actually real';     // ?case= substring
const RULE = process.env.RULE || 'scam';                  // button to click (scam=诈骗 → 误判 on a real alert)
const outDir = path.join(projectRoot, 'public', 'capture');
const rawDir = path.join(outDir, '_raw');
const outMp4 = path.join(outDir, 'pilot.mp4');

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
  mkdirSync(rawDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  // Playwright video records at CSS viewport size and IGNORES deviceScaleFactor.
  // Record at 540x960 (mobile CSS, exact 9:16) then lanczos-upscale 2x → 1080x1920.
  const context = await browser.newContext({
    viewport: { width: 540, height: 960 },
    deviceScaleFactor: 1,
    locale: 'zh-CN',
    recordVideo: { dir: rawDir, size: { width: 540, height: 960 } },
  });
  await context.addInitScript(() => {
    try { localStorage.setItem('fd_lang', 'zh'); } catch (e) {}
  });
  const page = await context.newPage();

  await page.goto(`${GAME_URL}?case=${encodeURIComponent(CASE_Q)}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => (document as any).fonts?.ready).catch(() => {});
  await sleep(600);

  await page.click('#startBtn');
  await page.waitForSelector('#caseScreen:not(.hidden)', { timeout: 5000 });
  await sleep(400);

  // hold on the case page (hook + setup narration ~14s)
  await sleep(13500);

  // rule it (deliberately wrong: scam on a real alert) → verdict
  await page.click(`#caseActions button[data-choice="${RULE}"]`);
  await page.waitForSelector('#verdictBox .verdict', { timeout: 5000 }).catch(() => {});
  await sleep(700);

  // hold on the verdict (turn + reversal + CTA narration; margin for re-timing)
  await sleep(31000);

  await context.close();
  await browser.close();

  const webm = readdirSync(rawDir).find((f) => f.endsWith('.webm'));
  if (!webm) throw new Error('no webm recorded');
  const webmPath = path.join(rawDir, webm);
  const ff = existsSync(ffmpeg) ? ffmpeg : 'ffmpeg';
  execFileSync(ff, ['-y', '-i', webmPath, '-vf', 'scale=1080:1920:flags=lanczos', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-an', outMp4], { stdio: 'inherit' });
  rmSync(rawDir, { recursive: true, force: true });

  const ffprobe = ff.replace('ffmpeg', 'ffprobe');
  const dur = execFileSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', outMp4], { encoding: 'utf8' }).trim();
  console.log(JSON.stringify({ status: 'done', outMp4: 'public/capture/pilot.mp4', durationSec: Number(dur) }, null, 2));
};

main().catch((e) => { console.error(e instanceof Error ? e.message : String(e)); process.exit(1); });
