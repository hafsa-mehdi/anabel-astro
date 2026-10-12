// Turns Payload documents into the plain shape Keystatic's reader returns, so the pages can
// read either CMS the same way. Used by scripts/payload-sync.mjs (build) and by the live
// preview (src/middleware.ts).

export const GLOBALS = ['settings', 'home', 'cleaning', 'visit', 'team', 'tour', 'designers', 'blog'];
export const COLLECTIONS = ['repairs', 'areas', 'posts', 'testimonials'];

// Payload-only fields the site does not use
const DROP = new Set(['id', 'createdAt', 'updatedAt', 'globalType', '_status', 'generateSlug']);
// Rich text JSON (Lexical); the site uses the HTML copy Payload adds next to it (bodyHtml, contentHtml)
const isRichText = (v) => v && typeof v === 'object' && v.root && typeof v.root === 'object';
const isMedia = (v) => v && typeof v === 'object' && typeof v.filename === 'string' && 'mimeType' in v;
const isTextItem = (v) => v && typeof v === 'object' && Object.keys(v).every((k) => k === 'id' || k === 'value') && 'value' in v;

/** One document. `mediaPath(media)` decides what a photo becomes (a local path or a URL). */
export function normalize(value, mediaPath) {
  if (isMedia(value)) return mediaPath(value);
  if (Array.isArray(value)) {
    if (value.length && value.every(isTextItem)) return value.map((v) => v.value ?? '');
    return value.map((v) => normalize(v, mediaPath));
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) if (!DROP.has(k) && !isRichText(v)) out[k] = normalize(v, mediaPath);
    return out;
  }
  return value ?? null;
}

/**
 * { globals: { home: doc, … }, collections: { repairs: [doc, …], … } } → the content file:
 * { home: {…}, …, repairs: [{ slug, entry }], … }.
 * `mediaPath(media, collectionSlug)`; collectionSlug is undefined for globals.
 */
export function shapeContent({ globals, collections }, mediaPath) {
  const content = {};
  for (const slug of GLOBALS) content[slug] = normalize(globals[slug] ?? {}, (m) => mediaPath(m));
  for (const slug of COLLECTIONS) {
    content[slug] = (collections[slug] ?? []).map((doc) => {
      const entry = normalize(doc, (m) => mediaPath(m, slug));
      // Keystatic dates are "YYYY-MM-DD"
      for (const k of ['pubDate', 'date']) if (entry[k]) entry[k] = String(entry[k]).slice(0, 10);
      return { slug: doc.slug ?? String(doc.id), entry };
    });
  }
  return content;
}

/** Media URL as an absolute address (local storage gives /api/media/file/…, Blob gives https://…). */
export const mediaUrl = (m, base) => (/^https?:\/\//.test(m.url) ? m.url : base + m.url);
