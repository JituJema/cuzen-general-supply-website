// Optimises the raw photos in scripts/raw into small WebP files in assets/img.
// Run with: npm run images
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

import { fileURLToPath } from 'node:url';
const raw = fileURLToPath(new URL('./raw/', import.meta.url));
const out = fileURLToPath(new URL('../assets/img/', import.meta.url));
mkdirSync(out, { recursive: true });

const jobs = [
  ['image2.png', 'logo', 640],
  ['image3.jpeg', 'stationery-books', 900],
  ['image4.jpeg', 'stationery-files', 900],
  ['image5.png', 'stationery-toners', 700],
  ['image6.jpeg', 'electrical-panel', 900],
  ['image7.jpeg', 'electrical-board', 700],
  ['c8.png', 'electrical-supplies', 1000, 14],
  ['image9.png', 'construction-site', 1200],
  ['image10.png', 'installation-technician', 1000, 0, true],
];

for (const [file, name, width, trimRight = 0, trimBlack = false] of jobs) {
  // (trimBlack removes the black bars baked into some source photos)
  const meta = await sharp(raw + file).metadata();
  const img = trimRight ? sharp(await sharp(raw + file).extract({ left: 0, top: 0, width: meta.width - trimRight, height: meta.height }).toBuffer()) : sharp(raw + file);
  const prepared = trimBlack ? sharp(await img.trim({ background: '#000000', threshold: 28 }).toBuffer()) : img;
  const pm = await prepared.metadata();
  const w = Math.min(width, pm.width);
  const info = await prepared.resize({ width: w }).webp({ quality: 80 }).toFile(`${out}${name}.webp`);
  console.log(name.padEnd(26), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
}

// social preview image (logo on navy)
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#0B2545' } })
  .composite([{ input: await sharp(raw + 'image2.png').resize({ width: 640 }).png().toBuffer(), gravity: 'center' }])
  .png({ compressionLevel: 9 })
  .toFile(`${out}og-cover.png`);
console.log('og-cover.png done');


