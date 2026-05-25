/**
 * record-intro.js
 * Records the intro animation as a WebM video using Playwright.
 * Usage: node scripts/record-intro.js
 * Output: public/intro-video.webm
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ANIM_FILE = path.resolve(__dirname, '../src/intro-animation.html');
const OUT_DIR   = path.resolve(__dirname, '../public');
const OUT_FILE  = path.join(OUT_DIR, 'intro-video.webm');

// Duration to record in ms (covers ~3 full product cycles)
const RECORD_MS = 22000;

async function record() {
  // Ensure output dir exists
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('🎬 Launching browser…');
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-web-security', '--font-render-hinting=none'],
  });

  const context = await browser.newContext({
    viewport:    { width: 1280, height: 720 },
    deviceScaleFactor: 2, // retina-quality
    recordVideo: {
      dir:  OUT_DIR,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  console.log('📄 Loading animation…');
  await page.goto('file://' + ANIM_FILE, { waitUntil: 'networkidle' });

  // Let Google Fonts load
  await page.waitForTimeout(1500);

  console.log(`⏳ Recording ${RECORD_MS / 1000}s…`);
  await page.waitForTimeout(RECORD_MS);

  // Closing the context finalises the video file
  console.log('💾 Saving video…');
  const video = await page.video();
  await context.close();
  await browser.close();

  // Playwright auto-names the file; move it to our target path
  const savedPath = await video.path();
  fs.renameSync(savedPath, OUT_FILE);

  console.log(`✅ Video saved → ${OUT_FILE}`);
}

record().catch(err => {
  console.error('❌ Recording failed:', err);
  process.exit(1);
});
