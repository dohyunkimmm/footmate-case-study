// Capture all six browser-rendered strategy slides at one fixed, reproducible size.
// Used by qa/pixel-compare-presentations.py in CI for raster comparison.
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { chromium } = require('@playwright/test');

async function main() {
  const output = path.resolve(process.argv[2] || 'test-results/visual-qa/web');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1,
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const url = pathToFileURL(path.resolve(__dirname, '../src/case-study/strategy-brief.html')).href;
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const picker = page.locator('#strategy-picker');
    if (await picker.locator('option').count() !== 6) throw new Error('Expected six web slides');
    for (let i = 0; i < 6; i++) {
      await picker.selectOption(String(i));
      const slide = page.locator('.fm-presentation-slide');
      await slide.waitFor({ state: 'visible' });
      const heading = (await slide.locator('.fm-deck-title').textContent()).trim();
      const pickerTitle = (await picker.locator('option').nth(i).textContent()).trim();
      if (!pickerTitle.endsWith(heading)) {
        throw new Error('Slide ' + (i + 1) + ' title mismatch: ' + heading);
      }
      const index = String(i + 1).padStart(2, '0');
      await slide.screenshot({
        path: path.join(output, 'strategy-web-' + index + '.png'),
        animations: 'disabled',
      });
    }
    await page.close();
  } finally {
    await browser.close();
  }
}

main().catch(err => { console.error(err); process.exitCode = 1; });
