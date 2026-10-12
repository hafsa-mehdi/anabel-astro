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

if (process.env.CMS !== 'payload') process.exit(0);

const BASE = (process.env.PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '');
const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, 'src', 'generated', 'payload-content.json');
const PUBLIC_DIR = path.join(ROOT, 'public', 'images', 'uploads', '_payload');
const ASSET_DIR = path.join(ROOT, 'src', 'generated', 'payload-assets');

const GLOBALS = ['settings', 'home', 'cleaning', 'visit', 'team', 'tour', 'designers', 'blog'];
const COLLECTIONS = ['repairs', 'areas', 'posts', 'testimonials'];
// Payload-only fields the site does not use
const DROP = new Set(['id', 'createdAt', 'updatedAt', 'globalType', '_status', 'generateSlug']);
// Rich text JSON (Lexical); the site uses the HTML copy Payload adds next to it (bodyHtml, contentHtml)
const isRichText = (v) => v && typeof v === 'object' && v.root && typeof v.root === 'object';

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

const isMedia = (v) => v && typeof v === 'object' && typeof v.filename === 'string' && 'mimeType' in v;
const isTextItem = (v) => v && typeof v === 'object' && Object.keys(v).every((k) => k === 'id' || k === 'value') && 'value' in v;

const downloads = new Map(); // target file → source url

/** Photo → local path. Blog photos go to src/ for astro:assets, everything else to public/. */
function mediaPath(m, forAstroAssets) {
  const url = /^https?:\/\//.test(m.url) ? m.url : BASE + m.url;
  if (forAstroAssets) {
    downloads.set(path.join(ASSET_DIR, m.filename), { url, size: m.filesize });
    return `./payload-assets/${m.filename}`;
  }
  downloads.set(path.join(PUBLIC_DIR, m.filename), { url, size: m.filesize });
  return `/images/uploads/_payload/${m.filename}`;
}

/** Payload document → the plain shape Keystatic's reader returns. */
function normalize(value, opts) {
  if (isMedia(value)) return mediaPath(value, opts.astroAssets);
  if (Array.isArray(value)) {
    if (value.length && value.every(isTextItem)) return value.map((v) => v.value ?? '');
    return value.map((v) => normalize(v, opts));
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) if (!DROP.has(k) && !isRichText(v)) out[k] = normalize(v, opts);
    return out;
  }
  return value ?? null;
}

const content = {};
for (const slug of GLOBALS) content[slug] = normalize(await get(`/api/globals/${slug}?depth=1`), {});
for (const slug of COLLECTIONS) {
  const { docs } = await get(`/api/${slug}?depth=1&limit=1000&sort=createdAt`);
  content[slug] = docs.map((doc) => {
    const entry = normalize(doc, { astroAssets: slug === 'posts' });
    // Keystatic dates are "YYYY-MM-DD"
    for (const k of ['pubDate', 'date']) if (entry[k]) entry[k] = String(entry[k]).slice(0, 10);
    return { slug: doc.slug ?? String(doc.id), entry };
  });
}

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
