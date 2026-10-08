// JSON-LD structured data builders (schema.org) for Google rich results.
import type { Settings } from './cms';
import { telHref } from './cms';

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

export function localBusiness(s: Settings, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': BUSINESS_ID,
    name: s.businessName,
    url: `${SITE}/`,
    logo: new URL(s.logo ?? '/images/uploads/site/logo.png', SITE).href,
    ...(image ? { image } : {}),
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

export function service(opts: { name: string; description: string; url: string; serviceType: string; s: Settings }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: opts.url,
    provider: { '@id': BUSINESS_ID, '@type': 'HomeAndConstructionBusiness', name: opts.s.businessName },
    areaServed: [
      { '@type': 'City', name: 'Louisville' },
      ...opts.s.serviceAreas.map((a) => ({ '@type': 'State', name: a.label })),
    ],
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
  title: string;
  description: string;
  url: string;
  image?: string;
  date: Date;
  s: Settings;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: opts.url,
    url: opts.url,
    ...(opts.image ? { image: [opts.image] } : {}),
    datePublished: opts.date.toISOString(),
    author: { '@type': 'Organization', name: opts.s.businessName, url: `${SITE}/` },
    publisher: {
      '@type': 'Organization',
      name: opts.s.businessName,
      logo: { '@type': 'ImageObject', url: new URL(opts.s.logo ?? '/images/uploads/site/logo.png', SITE).href },
    },
  };
}
