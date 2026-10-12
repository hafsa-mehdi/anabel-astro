// Payload test: downloads all content and photos from the Payload CMS (cms/) before a dev or
// build run, so the Astro pages can read it the same way they read Keystatic's files.
//
// Only runs when CMS=payload (in .env or the environment). Otherwise it does nothing and the
// site uses Keystatic as before.
//   PAYLOAD_URL  where the CMS runs (default http://localhost:3000)
//
// Writes (all git-ignored):
//   src/generated/payload-content.json        every page and entry, in Keystatic's shape
//   public/images/uploads/_payload/<file>     photos, resized by optimize-uploads.mjs like any upload
//   src/generated/payload-assets/<file>       blog post photos (Astro's image pipeline needs them in src/)
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { COLLECTIONS, GLOBALS, mediaUrl, shapeContent } from '../src/lib/payload-normalize.mjs';

if (process.env.CMS !== 'payload') process.exit(0);

const BASE = (process.env.PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '');
const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, 'src', 'generated', 'payload-content.json');
const PUBLIC_DIR = path.join(ROOT, 'public', 'images', 'uploads', '_payload');
const ASSET_DIR = path.join(ROOT, 'src', 'generated', 'payload-assets');

async function get(apiPath) {
  let res;
  try {
    res = await fetch(BASE + apiPath, { signal: AbortSignal.timeout(60_000) });
  } catch (err) {
    throw new Error(`Cannot reach the Payload CMS at ${BASE} (${err.cause?.code ?? err.message}). Start it with "npm run dev" in cms/, or set PAYLOAD_URL.`);
  }
  if (!res.ok) throw new Error(`Payload ${apiPath} → ${res.status} ${await res.text()}`);
  return res.json();
}

const downloads = new Map(); // target file → { url, size }

/** Photo → local path. Blog photos go to src/ for astro:assets, everything else to public/. */
function mediaPath(m, collection) {
  const url = mediaUrl(m, BASE);
  if (collection === 'posts') {
    downloads.set(path.join(ASSET_DIR, m.filename), { url, size: m.filesize });
    return `./payload-assets/${m.filename}`;
  }
  downloads.set(path.join(PUBLIC_DIR, m.filename), { url, size: m.filesize });
  return `/images/uploads/_payload/${m.filename}`;
}

const raw = { globals: {}, collections: {} };
for (const slug of GLOBALS) raw.globals[slug] = await get(`/api/globals/${slug}?depth=1`);
for (const slug of COLLECTIONS) raw.collections[slug] = (await get(`/api/${slug}?depth=1&limit=1000&sort=createdAt`)).docs;
const content = shapeContent(raw, mediaPath);

// Photos: download new or changed files only
let fetched = 0;
for (const [file, { url, size }] of downloads) {
  const existing = await stat(file).catch(() => null);
  if (existing && existing.size === size) continue;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Photo ${url} → ${res.status}`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  fetched++;
}

await mkdir(path.dirname(OUT_JSON), { recursive: true });
await writeFile(OUT_JSON, JSON.stringify(content, null, 2) + '\n');
console.log(`[payload] ${BASE}: ${GLOBALS.length} pages, ${COLLECTIONS.map((c) => `${content[c].length} ${c}`).join(', ')}; ${downloads.size} photos (${fetched} downloaded)`);
