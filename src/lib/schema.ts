// JSON-LD structured data builders (schema.org) for Google rich results.
// Pages call editorSchemas(), which applies what editors set in the "Structured data" fields.
import type { Settings } from './cms';
import { absoluteImage, telHref } from './cms';

const SITE = (import.meta.env.SITE ?? 'https://anabelsorientalrugs.com').replace(/\/$/, '');
export const BUSINESS_ID = `${SITE}/#business`;

const dayMap: Record<string, string> = {
  Monday: 'https://schema.org/Monday',
  Tuesday: 'https://schema.org/Tuesday',
  Wednesday: 'https://schema.org/Wednesday',
  Thursday: 'https://schema.org/Thursday',
  Friday: 'https://schema.org/Friday',
  Saturday: 'https://schema.org/Saturday',
  Sunday: 'https://schema.org/Sunday',
};

/** The business. `image`: used when Site settings has no business photo. */
export function localBusiness(s: Settings, image?: string) {
  const photo = absoluteImage(s.business?.image, new URL(SITE)) ?? image;
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': BUSINESS_ID,
    name: s.businessName,
    url: `${SITE}/`,
    logo: new URL(s.logo ?? '/images/uploads/site/logo.png', SITE).href,
    ...(photo ? { image: photo } : {}),
    ...(s.business?.description ? { description: s.business.description } : {}),
    ...(s.business?.priceRange ? { priceRange: s.business.priceRange } : {}),
    telephone: telHref(s.phone).replace('tel:', ''),
    email: s.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address.street,
      addressLocality: s.address.city,
      addressRegion: s.address.region,
      postalCode: s.address.postalCode,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: Number(s.geo.latitude),
      longitude: Number(s.geo.longitude),
    },
    hasMap: s.directionsUrl ?? undefined,
    openingHoursSpecification: s.hours
      .filter((h) => !h.closed && h.opens && h.closes)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days.map((d) => dayMap[d]),
        opens: h.opens,
        closes: h.closes,
      })),
    areaServed: [
      { '@type': 'City', name: 'Louisville' },
      ...s.serviceAreas.map((a) => ({ '@type': 'State', name: a.label })),
    ],
    sameAs: s.social.map((x) => x.url).filter(Boolean),
  };
}

const defaultAreas = (s: Settings) => [
  { '@type': 'City', name: 'Louisville' },
  ...s.serviceAreas.map((a) => ({ '@type': 'State', name: a.label })),
];

export function service(opts: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  s: Settings;
  areaServed?: readonly (string | null)[] | null;
  startingPrice?: number | null;
}) {
  const areas = (opts.areaServed ?? []).filter((a): a is string => !!a?.trim());
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: opts.url,
    provider: { '@id': BUSINESS_ID, '@type': 'HomeAndConstructionBusiness', name: opts.s.businessName },
    areaServed: areas.length ? areas.map((name) => ({ '@type': 'Place', name })) : defaultAreas(opts.s),
    ...(opts.startingPrice != null
      ? {
          offers: {
            '@type': 'Offer',
            priceSpecification: { '@type': 'PriceSpecification', minPrice: opts.startingPrice, priceCurrency: 'USD' },
          },
        }
      : {}),
  };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: new URL(it.url, SITE).href,
    })),
  };
}

export function blogPosting(opts: {
  type?: 'BlogPosting' | 'Article';
  title: string;
  description: string;
  url: string;
  image?: string;
  date?: Date;
  s: Settings;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': opts.type ?? 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: opts.url,
    url: opts.url,
    ...(opts.image ? { image: [opts.image] } : {}),
    ...(opts.date ? { datePublished: opts.date.toISOString() } : {}),
    author: { '@type': 'Organization', name: opts.s.businessName, url: `${SITE}/` },
    publisher: {
      '@type': 'Organization',
      name: opts.s.businessName,
      logo: { '@type': 'ImageObject', url: new URL(opts.s.logo ?? '/images/uploads/site/logo.png', SITE).href },
    },
  };
}

// --- Editor-controlled schema ("Structured data" fields in the CMS) ---------------------------

export type FaqItem = { question?: string | null; answer?: string | null };

/** The "Structured data" group of a page, as either CMS stores it (Payload leaves empty fields null). */
export type StructuredData =
  | {
      faq?: readonly FaqItem[] | null;
      type?: string | null;
      serviceName?: string | null;
      startingPrice?: number | null;
      areaServed?: readonly (string | null)[] | null;
      off?: boolean | null;
      custom?: string | null;
    }
  | null
  | undefined;

type PageType = 'Service' | 'Article' | 'BlogPosting' | 'WebPage';
const PAGE_TYPES: readonly string[] = ['Service', 'Article', 'BlogPosting', 'WebPage'];

/** What a page knows about itself; enough to describe it as any of the page types. */
export type PageInfo = {
  /** Used when the page type is "Automatic". */
  type: PageType;
  name: string;
  description: string;
  url: string;
  image?: string;
  date?: Date;
  /** Service pages: e.g. "Rug repair". */
  serviceType?: string;
};

/** FAQ entries with both a question and an answer. */
export const faqItems = (sd: StructuredData) =>
  (sd?.faq ?? [])
    .map((f) => ({ question: f.question?.trim() ?? '', answer: f.answer?.trim() ?? '' }))
    .filter((f) => f.question && f.answer);

export function faqPage(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

function pageEntity(type: PageType, page: PageInfo, sd: StructuredData, s: Settings) {
  if (type === 'Service') {
    return service({
      name: sd?.serviceName?.trim() || page.name,
      serviceType: page.serviceType ?? page.name,
      description: page.description,
      url: page.url,
      s,
      areaServed: sd?.areaServed,
      startingPrice: sd?.startingPrice,
    });
  }
  if (type === 'Article' || type === 'BlogPosting') {
    return blogPosting({ type, title: page.name, description: page.description, url: page.url, image: page.image, date: page.date, s });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.name,
    description: page.description,
    url: page.url,
    publisher: { '@id': BUSINESS_ID },
  };
}

/**
 * The automatic JSON-LD for a page: its main entity (`page`, in the type the editor picked), any
 * fixed extras (`extra`, e.g. the business on the homepage) and the FAQ. Nothing when the editor
 * turned schema off (Base.astro then leaves out the breadcrumbs too, and adds the custom schema).
 */
export function editorSchemas(sd: StructuredData, s: Settings, opts: { page?: PageInfo; extra?: object[] } = {}): object[] {
  if (sd?.off) return [];
  const out: object[] = [];
  if (opts.page) {
    const picked = sd?.type && PAGE_TYPES.includes(sd.type) ? (sd.type as PageType) : opts.page.type;
    out.push(pageEntity(picked, opts.page, sd, s));
  }
  out.push(...(opts.extra ?? []));
  const faq = faqItems(sd);
  if (faq.length) out.push(faqPage(faq));
  return out;
}

/**
 * The editor's "Custom schema (advanced)" text → JSON-LD blocks. Same checks as the CMS runs on
 * save (cms/src/customSchema.ts); Keystatic cannot check on save, so a mistake that reaches the
 * build stops it (Base.astro throws with a message naming the page; the live preview only warns).
 */
export function parseCustomSchema(text: string | null | undefined): { blocks: object[]; error?: string } {
  const raw = text?.trim();
  if (!raw) return { blocks: [] };
  if (/<[a-z/!]/i.test(raw)) return { blocks: [], error: 'it contains HTML tags (paste only the JSON, without <script>)' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return { blocks: [], error: `it is not valid JSON (${(err as Error).message})` };
  }
  const blocks = Array.isArray(parsed) ? parsed : [parsed];
  for (const block of blocks) {
    const b = block as Record<string, unknown> | null;
    if (!b || typeof b !== 'object' || Array.isArray(b)) return { blocks: [], error: 'every block must be a { … } object' };
    if (typeof b['@context'] !== 'string' || !b['@context'].includes('schema.org')) return { blocks: [], error: 'a block has no "@context": "https://schema.org"' };
    const types = ([] as unknown[]).concat(b['@type']);
    if (!types.every((t) => typeof t === 'string' && t.trim())) return { blocks: [], error: 'a block has no "@type"' };
    if (types.includes('FAQPage')) return { blocks: [], error: 'it contains FAQ schema (use the FAQ list instead)' };
    if (types.includes('BreadcrumbList')) return { blocks: [], error: 'it contains breadcrumb schema (made automatically)' };
  }
  return { blocks: blocks as object[] };
}
