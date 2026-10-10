// Auditoría de accesibilidad (axe-core, WCAG 2 A/AA) de stories en claro y oscuro.
// Uso: node axe_check.cjs <baseUrl> <storyId> [<storyId> ...]
// Requiere axe-core (viene con @storybook/addon-a11y) y un Storybook ya construido y servido.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const root = execSync('npm root -g').toString().trim();
const { chromium } = require(path.join(root, 'playwright'));
const axeSrc = fs.readFileSync(path.join(process.cwd(), 'node_modules/axe-core/axe.min.js'), 'utf8');

(async () => {
  const [base, ...ids] = process.argv.slice(2);
  if (!base || !ids.length) { console.error('Uso: axe_check.cjs <baseUrl> <storyId>...'); process.exit(1); }
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let failed = false;
  for (const id of ids) for (const theme of ['light', 'dark']) {
    const page = await browser.newPage();
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
    await page.waitForTimeout(2000);
    await page.evaluate(axeSrc);
    const res = await page.evaluate(async () => {
      const r = await axe.run('#storybook-root', { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] });
      return r.violations.map((v) => `${v.id} (${v.nodes.length})`);
    });
    if (res.length) failed = true;
    console.log(`${id.padEnd(40)} ${theme.padEnd(5)} ${res.length ? 'VIOLACIONES: ' + res.join(', ') : 'ok'}`);
    await page.close();
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
