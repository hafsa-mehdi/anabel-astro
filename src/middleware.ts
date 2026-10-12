// CMS live preview (Payload mode only). For /preview/… pages, fetches the latest drafts from the
// Payload CMS and renders the page with them instead of the built content. Every other page is
// untouched (they are pre-built static HTML).
//
// The admin's preview panel opens /preview/<page>/?secret=…; the secret is passed on to the CMS,
// which only returns drafts when it matches its PREVIEW_SECRET.
import { defineMiddleware } from 'astro:middleware';
import manifest from './generated/image-manifest.json';
import { runWithPreviewContent, usePayload } from './lib/cms';
import { mediaUrl, shapeContent } from './lib/payload-normalize.mjs';

const resized = manifest as Record<string, unknown>;

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith('/preview/') || context.isPrerendered) return next();
  if (!usePayload) return new Response('Live preview needs the Payload CMS (CMS=payload).', { status: 404 });

  const base = (process.env.PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '');
  const secret = context.url.searchParams.get('secret') ?? '';
  let res: Response;
  try {
    res = await fetch(`${base}/api/preview-content?secret=${encodeURIComponent(secret)}`, {
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    return new Response(`Live preview: cannot reach the CMS at ${base}.`, { status: 502 });
  }
  if (!res.ok) return new Response('Live preview: not allowed. Open it from the CMS.', { status: res.status === 401 ? 401 : 502 });

  const drafts = await res.json();
  // When each page/entry was last saved, so the preview can tell when it is out of date
  const stamps: Record<string, string> = {};
  for (const [slug, doc] of Object.entries<{ updatedAt?: string }>(drafts.globals ?? {})) if (doc?.updatedAt) stamps[slug] = doc.updatedAt;
  for (const [slug, docs] of Object.entries<{ id: string | number; updatedAt?: string }[]>(drafts.collections ?? {})) {
    for (const doc of docs) if (doc.updatedAt) stamps[`${slug}:${doc.id}`] = doc.updatedAt;
  }
  context.locals.previewStamps = stamps;

  // Photos already on the site (published ones) use the resized copies; new ones load from the CMS
  const content = shapeContent(drafts, (m: { filename: string; url: string }, collection?: string) => {
    const local = `/images/uploads/_payload/${m.filename}`;
    return collection !== 'posts' && resized[local] ? local : mediaUrl(m, base);
  });

  // Render the whole page inside the draft context (buffered, so no part renders outside it)
  const page = await runWithPreviewContent(content, async () => {
    const response = await next();
    return { status: response.status, html: await response.text() };
  });
  return new Response(page.html, {
    status: page.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
});
