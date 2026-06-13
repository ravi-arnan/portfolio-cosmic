/**
 * Dev utility: screenshot the blackhole hero with WebGL enabled.
 * Usage: node scripts/screenshot.mjs [scrollY] [outfile]
 */
import { chromium } from 'playwright';

const scrollY = Number(process.argv[2] ?? 0);
const outfile = process.argv[3] ?? '/tmp/hero.png';

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
});

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500); // let the lazy Scene chunk load and render

// HIDE_UI=1: capture the bare scene for the poster, no headline or nav
if (process.env.HIDE_UI) {
  await page.evaluate(() => {
    document.querySelector('[data-hero-copy]')?.remove();
    document.querySelector('header')?.remove();
  });
  await page.waitForTimeout(300);
}
if (scrollY > 0) {
  await page.mouse.wheel(0, scrollY);
  await page.waitForTimeout(2000); // let Lenis ease and the camera damp settle
}
await page.screenshot({ path: outfile });

const hasCanvas = await page.evaluate(() => {
  const canvas = document.querySelector('#hero canvas');
  return canvas ? `${canvas.clientWidth}x${canvas.clientHeight}` : null;
});

console.log(JSON.stringify({ hasCanvas, errors: errors.slice(0, 5) }, null, 2));
await browser.close();
