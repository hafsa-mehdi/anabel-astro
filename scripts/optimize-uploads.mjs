// Makes resized WebP copies of every image in public/images/uploads/
// and records their sizes in src/generated/image-manifest.json.
//
// Runs automatically before `npm run dev` and `npm run build`, so images an
// editor uploads through Keystatic are always served at sensible sizes.
// Only new or changed images are processed, so repeat runs are quick.
import { readdir, stat, mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const UPLOADS = path.join(ROOT, 'public', 'images', 'uploads');
const OUT = path.join(ROOT, 'public', 'images', '_r');
const MANIFEST = path.join(ROOT, 'src', 'generated', 'image-manifest.json');
const WIDTHS = [480, 640, 800, 1200, 1800];
const EXT = /\.(jpe?g|png|webp|avif)$/i;

async function walk(dir) {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (EXT.test(e.name)) out.push(full);
  }
  return out;
}

async function exists(p) {
  try {
    return await stat(p);
  } catch {
    return null;
  }
}

let previous = {};
try {
  previous = JSON.parse(await readFile(MANIFEST, 'utf8'));
} catch {}

const manifest = {};
let made = 0;
for (const file of await walk(UPLOADS)) {
  const rel = path.relative(UPLOADS, file).split(path.sep).join('/');
  const publicSrc = `/images/uploads/${rel}`;
  const srcStat = await stat(file);
  const meta = await sharp(file).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const base = rel.replace(EXT, '');
  const isSmall = width <= 480 || /\.png$/i.test(rel) && width < 600; // logos, icons
  const variants = [];
  if (!isSmall) {
    const widths = WIDTHS.filter((w) => w < width);
    if (width <= WIDTHS.at(-1)) widths.push(width);
    for (const w of [...new Set(widths)]) {
      const outRel = `${base}-${w}.webp`;
      const outFile = path.join(OUT, outRel);
      const outStat = await exists(outFile);
      if (!outStat || outStat.mtimeMs < srcStat.mtimeMs) {
        await mkdir(path.dirname(outFile), { recursive: true });
        await sharp(file).rotate().resize({ width: w }).webp({ quality: 66, effort: 5 }).toFile(outFile);
        made++;
      }
      variants.push({ w, src: `/images/_r/${outRel}` });
    }
  }
  manifest[publicSrc] = { width, height, variants };
}

await mkdir(path.dirname(MANIFEST), { recursive: true });
const json = JSON.stringify(manifest, null, 2);
if (json !== JSON.stringify(previous, null, 2)) await writeFile(MANIFEST, json + '\n');
console.log(`[images] ${Object.keys(manifest).length} images, ${made} new resized copies`);
