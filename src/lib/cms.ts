// Reads content saved by Keystatic and offers small helpers for the pages.
import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import keystaticConfig from '../../keystatic.config';
import manifest from '../generated/image-manifest.json';

export const reader = createReader(process.cwd(), keystaticConfig);

export async function getSettings() {
  const s = await reader.singletons.settings.read();
  if (!s) throw new Error('Site settings are missing: open Keystatic → Site-wide → Site settings and save.');
  return s;
}
export type Settings = Awaited<ReturnType<typeof getSettings>>;

export async function mustRead<K extends 'home' | 'cleaning' | 'visit' | 'blog' | 'team' | 'tour' | 'designers'>(key: K) {
  const entry = await reader.singletons[key].read();
  if (!entry) throw new Error(`The "${key}" page content is missing. Open it in Keystatic and save once.`);
  return entry as NonNullable<Awaited<ReturnType<(typeof reader.singletons)[K]['read']>>>;
}

export async function getTestimonials() {
  const all = await reader.collections.testimonials.all();
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
