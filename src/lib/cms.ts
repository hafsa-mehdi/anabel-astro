// Reads the site content and offers small helpers for the pages.
//
// Two content sources, same shape (Keystatic's types are the reference):
//   - Keystatic (default): the files in src/content/
//   - Payload (CMS=payload): src/generated/payload-content.json, downloaded from the Payload
//     CMS in cms/ by scripts/payload-sync.mjs before every dev/build run.
//   - Live preview (/preview/… pages): the latest drafts, fetched per request by
//     src/middleware.ts and handed in through runWithPreviewContent().
import fs from 'node:fs';
import path from 'node:path';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getCollection, type CollectionEntry } from 'astro:content';
import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import keystaticConfig from '../../keystatic.config';
import manifest from '../generated/image-manifest.json';

export const usePayload = (import.meta.env.CMS ?? process.env.CMS) === 'payload';

const reader = createReader(process.cwd(), keystaticConfig);
type Reader = typeof reader;
type SingletonKey = keyof Reader['singletons'];
type CollectionKey = keyof Reader['collections'];
type SingletonData<K extends SingletonKey> = NonNullable<Awaited<ReturnType<Reader['singletons'][K]['read']>>>;
type CollectionData<K extends CollectionKey> = NonNullable<Awaited<ReturnType<Reader['collections'][K]['read']>>>;

const previewStore = new AsyncLocalStorage<Record<string, any>>();

/** Renders `fn` (a whole page) with draft content instead of the built content. */
export const runWithPreviewContent = <T>(content: Record<string, any>, fn: () => T) => previewStore.run(content, fn);
export const isPreview = () => previewStore.getStore() !== undefined;

let payloadCache: Record<string, any> | undefined;
function payloadContent() {
  const preview = previewStore.getStore();
  if (preview) return preview;
  // In dev, reread on every request so "npm run cms:sync" shows new edits without a restart
  if (!payloadCache || import.meta.env.DEV) {
    const file = path.join(process.cwd(), 'src', 'generated', 'payload-content.json');
    if (!fs.existsSync(file)) throw new Error('CMS=payload but src/generated/payload-content.json is missing. Run "npm run dev" or "npm run build" so scripts/payload-sync.mjs downloads it.');
    payloadCache = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return payloadCache!;
}

/** One-off page content (home, cleaning, …, settings), or null when it was never saved. */
export async function readSingleton<K extends SingletonKey>(key: K): Promise<SingletonData<K> | null> {
  if (usePayload || isPreview()) return (payloadContent()[key] as SingletonData<K>) ?? null;
  return (await reader.singletons[key].read()) as SingletonData<K> | null;
}

/** All entries of a collection as { slug, entry }. Rich text is not included (see getRepair). */
export async function getAll<K extends Exclude<CollectionKey, 'posts'>>(key: K): Promise<{ slug: string; entry: CollectionData<K> }[]> {
  if (usePayload || isPreview()) return payloadContent()[key];
  return (await reader.collections[key].all()) as { slug: string; entry: CollectionData<K> }[];
}

export async function getOne<K extends Exclude<CollectionKey, 'posts'>>(key: K, slug: string): Promise<CollectionData<K> | null> {
  if (usePayload || isPreview()) return payloadContent()[key].find((e: { slug: string }) => e.slug === slug)?.entry ?? null;
  return (await reader.collections[key].read(slug)) as CollectionData<K> | null;
}

/** A repair page with its main text rendered to HTML. */
export async function getRepair(slug: string) {
  if (usePayload || isPreview()) {
    const entry = await getOne('repairs', slug);
    // <article> wrapper: same markup as Markdoc's renderer below
    return entry ? { entry, bodyHtml: `<article>${(entry as unknown as { bodyHtml?: string }).bodyHtml ?? ''}</article>` } : null;
  }
  const entry = await reader.collections.repairs.read(slug, { resolveLinkedFiles: true });
  return entry ? { entry: entry as unknown as CollectionData<'repairs'>, bodyHtml: await markdocToHtml(entry.body as any) } : null;
}

/** A blog post as the pages use it. In the live preview the photo is a URL and the text is HTML. */
export type PreviewPost = {
  id: string;
  data: { title: string; description: string; pubDate: Date; heroImage?: string; heroAlt: string };
  previewHtml: string;
};
export type PostEntry = CollectionEntry<'posts'> | PreviewPost;

/** All blog posts (Astro content collection; drafts in the live preview). */
export async function getPosts(): Promise<PostEntry[]> {
  const preview = previewStore.getStore();
  if (!preview) return getCollection('posts');
  return (preview.posts as { slug: string; entry: Record<string, any> }[]).map(({ slug, entry }) => ({
    id: slug,
    data: {
      title: entry.title ?? '',
      description: entry.description ?? '',
      pubDate: new Date(entry.pubDate ?? Date.now()),
      heroImage: entry.heroImage ?? undefined,
      heroAlt: entry.heroAlt ?? '',
    },
    previewHtml: entry.contentHtml ?? '',
  }));
}

/** URL of a post's photo, for share images and structured data. */
export const postImageSrc = (post: PostEntry) => {
  const img = post.data.heroImage;
  return typeof img === 'string' ? img : img?.src;
};

export async function getSettings() {
  const s = await readSingleton('settings');
  if (!s) throw new Error('Site settings are missing: open the CMS → Site-wide → Site settings and save.');
  return s;
}
export type Settings = Awaited<ReturnType<typeof getSettings>>;

export async function mustRead<K extends Exclude<SingletonKey, 'settings'>>(key: K) {
  const entry = await readSingleton(key);
  if (!entry) throw new Error(`The "${key}" page content is missing. Open it in the CMS and save once.`);
  return entry;
}

export async function getTestimonials() {
  const all = await getAll('testimonials');
  return all.filter((t) => t.entry.quote?.trim());
}

/** "502 895 9595" → "tel:+15028959595" */
export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return `tel:+${digits.length === 10 ? '1' + digits : digits}`;
}

/** Splits editor text into paragraphs on empty lines. */
export function paragraphs(text: string | null | undefined) {
  return (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}

export const isExternal = (url: string) => /^https?:\/\//.test(url) && !url.startsWith('https://anabelsorientalrugs.com/#');

/** "17:30" → "5:30 PM" */
export function time12(t: string) {
  const [h, m = '00'] = t.split(':');
  const hour = Number(h);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return m === '00' ? `${h12} ${suffix}` : `${h12}:${m} ${suffix}`;
}

export function hoursText(line: Settings['hours'][number]) {
  if (line.closed || !line.opens || !line.closes) return 'Closed';
  return `${time12(line.opens)} – ${time12(line.closes)}`;
}

export function addressLines(s: Settings) {
  const a = s.address;
  return [a.street, `${a.city}, ${a.region} ${a.postalCode}`];
}

export function mapEmbedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=15&output=embed&iwloc=near`;
}

/** Renders a Keystatic Markdoc field to HTML. */
export async function markdocToHtml(field: (() => Promise<{ node: any }>) | { node: any } | undefined) {
  if (!field) return '';
  const value = typeof field === 'function' ? await field() : field;
  const tree = Markdoc.transform(value.node);
  return Markdoc.renderers.html(tree);
}

// --- Images ------------------------------------------------------------------
type ManifestEntry = { width: number; height: number; variants: { w: number; src: string }[] };
const images = manifest as Record<string, ManifestEntry>;

export function imageInfo(src: string | null | undefined) {
  if (!src) return null;
  const entry = images[src];
  if (!entry) {
    console.warn(`[images] ${src} is not in the image manifest. Run "npm run images".`);
    return { src, width: undefined, height: undefined, srcset: undefined, fallback: src };
  }
  const srcset = entry.variants.length ? entry.variants.map((v) => `${v.src} ${v.w}w`).join(', ') : undefined;
  // Middle-sized copy as the plain src for old browsers
  const fallback = entry.variants.find((v) => v.w >= 1200)?.src ?? entry.variants.at(-1)?.src ?? src;
  return { src, width: entry.width, height: entry.height, srcset, fallback };
}

export function absoluteImage(src: string | null | undefined, site: URL) {
  const info = imageInfo(src);
  if (!info) return undefined;
  return new URL(info.fallback, site).href;
}

/** Escapes text and turns *words* into <em>words</em> (gold italics in headings). */
export function accent(text: string | null | undefined) {
  const esc = (text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
/** Plain text version of an accented heading (for titles and alt text). */
export const plain = (text: string | null | undefined) => (text ?? '').replace(/\*/g, '');
