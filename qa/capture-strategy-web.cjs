// Capture all six browser-rendered strategy slides at one fixed size for visual QA.
// The page uses absolute /src/... links, so it must be served over HTTP.
const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';
const PORT = 4187;
const BASE = 'http://' + HOST + ':' + PORT;

async function waitForServer(child) {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (child.exitCode !== null) throw new Error('Static server exited prematurely');
    try {
      const response = await fetch(BASE + '/src/case-study/strategy-brief.html');
      if (response.ok) return;
    } catch { /* not started */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Timed out waiting for HTTP server');
}

async function main() {
  const output = path.resolve(process.argv[2] || 'test-results/visual-qa/web');
  fs.mkdirSync(output, { recursive: true });
  const server = spawn(process.execPath, [path.join(ROOT, 'tests/e2e/server.cjs')], {
    cwd: ROOT, env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore',
  });
  let browser;
  try {
    await waitForServer(server);
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1,
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE + '/src/case-study/strategy-brief.html', { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const picker = page.locator('#strategy-picker');
    if (await picker.locator('option').count() !== 6) throw new Error('Expected six web slides');
    for (let i = 0; i < 6; i++) {
      await picker.selectOption(String(i));
      // Selection moves keyboard focus to the heading; blur only for visual baseline.
      await page.evaluate(() => document.activeElement?.blur());
      const slide = page.locator('.fm-presentation-slide');
      await slide.waitFor({ state: 'visible' });
      const heading = (await slide.locator('.fm-deck-title').textContent()).trim();
      const pickerTitle = (await picker.locator('option').nth(i).textContent()).trim();
      if (!pickerTitle.endsWith(heading)) {
        throw new Error('Slide ' + (i + 1) + ' title mismatch: ' + heading);
      }
      await slide.screenshot({
        path: path.join(output, 'strategy-web-' + String(i + 1).padStart(2, '0') + '.png'),
        animations: 'disabled',
      });
    }
    await page.close();
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  }
}

main().catch(err => { console.error(err); process.exitCode = 1; });
