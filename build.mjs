// Static site generator: wraps each page in src/pages with src/layout.html and writes
// plain HTML files to the repo root, so Vercel can serve the folder as-is (no build step needed).
// Run with: npm run build
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const layout = readFileSync(join(root, 'src/layout.html'), 'utf8');
const pagesDir = join(root, 'src/pages');

const localBusiness = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Cuzen General Supply Company Limited',
  description: 'Supplier of office stationery, electrical supplies, construction materials and protective equipment, with installation and air-conditioning works, in Dar es Salaam, Tanzania.',
  telephone: ['+255773652494', '+255656145515', '+255650857761'],
  email: 'Cuzengeneralsupply@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Tabata Kinyerezi, Dar es Salaam', addressCountry: 'TZ' },
  slogan: 'Quality you can trust, Service you deserve',
})}</script>`;

for (const file of readdirSync(pagesDir).filter(f => f.endsWith('.html'))) {
  const slug = file.replace('.html', '');
  let src = readFileSync(join(pagesDir, file), 'utf8');
  const m = src.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  const meta = m ? JSON.parse(m[1]) : {};
  if (m) src = src.slice(m[0].length);

  let html = layout
    .replaceAll('{{title}}', meta.title || 'Cuzen General Supply Company Limited')
    .replaceAll('{{description}}', meta.description || '')
    .replace('{{schema}}', slug === 'index' ? localBusiness : '')
    .replace('{{content}}', src.trim());
  html = html.replace(new RegExp(`(data-nav="${slug}")`), '$1 aria-current="page"');
  // {{item id|Name|Category}} -> a product row with an add-to-quote button
  html = html.replace(/\{\{item ([^|}]+)\|([^|}]+)\|([^}]+)\}\}/g, (_, id, name, cat) =>
    `<li><span>${name}</span><button class="add" type="button" data-id="${id}" data-name="${name}" data-cat="${cat}" aria-label="Add ${name} to your quote list" aria-pressed="false"><svg class="ic i-plus" viewBox="0 0 24 24"><use href="#i-plus"/></svg><svg class="ic i-check" viewBox="0 0 24 24"><use href="#i-check"/></svg></button></li>`);
  writeFileSync(join(root, `${slug}.html`), html);
  console.log('built', `${slug}.html`);
}
