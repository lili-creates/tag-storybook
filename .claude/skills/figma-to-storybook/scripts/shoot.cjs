// Capturas de verificación con Playwright (Chromium preinstalado).
// Uso: node shoot.cjs <baseUrl> <storyId> <out.png> [light|dark] [docs|story] [selector-a-mostrar] [scale]
// Ej:  node shoot.cjs http://localhost:6006 componentes-tag--documentaci%C3%B3n out.png dark docs "h2:has-text('02')"
const path = require('path');
const { execSync } = require('child_process');
const root = execSync('npm root -g').toString().trim();
const { chromium } = require(path.join(root, 'playwright'));

(async () => {
  const [base, id, out, theme = 'light', mode = 'story', selector, scale = '1'] = process.argv.slice(2);
  if (!base || !id || !out) { console.error('Uso: shoot.cjs <baseUrl> <storyId> <out.png> [light|dark] [docs|story] [selector] [scale]'); process.exit(1); }
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1100, height: 760 }, deviceScaleFactor: Number(scale) });
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=${mode}&globals=theme:${theme}`);
  await page.waitForTimeout(3500);
  if (selector) await page.locator(selector).first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: out });
  await browser.close();
})();
