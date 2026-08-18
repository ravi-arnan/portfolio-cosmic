/**
 * Regenerates the social share card at `public/og.png` (1200x630).
 *
 * The hero poster is the only real image of the scene we have, so the card
 * is that poster cropped so the black hole sits right of centre, with a
 * gradient scrim and the site identity typeset on the left.
 *
 * Usage: node scripts/og.mjs
 *
 * Text is rendered by librsvg through sharp, which resolves fonts via
 * fontconfig, so it needs JetBrains Mono installed system-wide. The output
 * is committed, so this only has to run when the poster or the copy in
 * `src/data/site.ts` changes.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

/* Kept in sync by hand with src/data/site.ts: a 12-line asset script is not
   worth a TypeScript loader just to import three strings. */
const NAME = 'Ravi Arnan Irianto';
const TAGLINE = 'Web Developer and Cybersecurity Enthusiast';
const DOMAIN = 'raviarnan.dev';

const WIDTH = 1200;
const HEIGHT = 630;

const overlay = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#030014" stop-opacity="0.94"/>
      <stop offset="0.45" stop-color="#030014" stop-opacity="0.82"/>
      <stop offset="1" stop-color="#030014" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scrim)"/>
  <text x="64" y="238" font-family="JetBrains Mono" font-size="22" fill="#ff9d3c">$ whoami</text>
  <text x="64" y="316" font-family="JetBrains Mono" font-size="52" font-weight="700" fill="#ececf7">${NAME}</text>
  <text x="64" y="364" font-family="JetBrains Mono" font-size="21" fill="#b8b8d9">${TAGLINE}</text>
  <rect x="64" y="404" width="120" height="2" fill="#ff9d3c" opacity="0.7"/>
  <text x="64" y="452" font-family="JetBrains Mono" font-size="22" fill="#3ce0ff">${DOMAIN}</text>
</svg>`;

const poster = readFileSync(`${root}public/poster-blackhole.webp`);

/* Upscale then window the crop so the hole lands at ~62% across, leaving
   the left third clear for the text block. */
const background = await sharp(poster)
  .resize({ width: 1500 })
  .extract({ left: 0, top: 154, width: WIDTH, height: HEIGHT })
  .toBuffer();

const png = await sharp(background)
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(`${root}public/og.png`, png);
console.log(`public/og.png written (${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(1)} kB)`);
