// Live preview: the admin shows the real website next to the form, rendered with the latest drafts.
//
//   1. The admin's preview panel loads <SITE_URL>/preview/<page address>/?secret=<PREVIEW_SECRET>
//      (an on-demand page of the Astro site, see src/pages/preview/ and src/middleware.ts there).
//   2. That page asks this CMS for the latest drafts at /api/preview-content (same secret).
//   3. Drafts autosave while typing; after each save the admin tells the preview to reload.
//
// PREVIEW_SECRET: any long random string, set on the CMS only (the site passes it through).
// SITE_URL: the Payload version of the website (local: http://127.0.0.1:4321).
import crypto from 'node:crypto'
import type { Endpoint, LivePreviewConfig } from 'payload'

export const siteUrl = () => (process.env.SITE_URL || 'https://anabel-astro-payload.vercel.app').replace(/\/$/, '')

// Which website page shows each one-off page
export const GLOBAL_PATHS: Record<string, string> = {
  settings: '',
  home: '',
  cleaning: 'louisville-rug-cleaning',
  visit: 'contact',
  team: 'team',
  tour: 'tour',
  designers: 'designer-program',
  blog: 'blog',
}

const previewUrl = (path: string) => {
  const secret = encodeURIComponent(process.env.PREVIEW_SECRET || '')
  return `${siteUrl()}/preview/${path ? `${path}/` : ''}?secret=${secret}`
}

export const livePreview: LivePreviewConfig & { collections: string[]; globals: string[] } = {
  url: ({ data, collectionConfig, globalConfig }) => {
    if (globalConfig) return previewUrl(GLOBAL_PATHS[globalConfig.slug] ?? '')
    // Testimonials appear on the homepage; repairs, areas and posts have their own address
    if (collectionConfig?.slug === 'testimonials') return previewUrl('')
    return previewUrl(typeof data?.slug === 'string' ? data.slug : '')
  },
  collections: ['repairs', 'areas', 'posts', 'testimonials'],
  globals: Object.keys(GLOBAL_PATHS),
  breakpoints: [
    { label: 'Phone', name: 'phone', width: 390, height: 844 },
    { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
    { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
  ],
}

const sameSecret = (given: string | null) => {
  const secret = process.env.PREVIEW_SECRET
  if (!secret || !given) return false
  const a = Buffer.from(given)
  const b = Buffer.from(secret)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/** GET /api/preview-content?secret=… → the latest drafts of every page and entry. */
export const previewContentEndpoint: Endpoint = {
  path: '/preview-content',
  method: 'get',
  handler: async (req) => {
    if (!sameSecret(req.searchParams.get('secret'))) {
      return Response.json({ error: 'Not allowed' }, { status: 401 })
    }
    const { payload } = req
    const globals: Record<string, unknown> = {}
    for (const slug of Object.keys(GLOBAL_PATHS) as (keyof typeof GLOBAL_PATHS)[]) {
      globals[slug] = await payload.findGlobal({ slug: slug as never, draft: true, depth: 1, overrideAccess: true })
    }
    const collections: Record<string, unknown[]> = {}
    for (const slug of ['repairs', 'areas', 'posts', 'testimonials'] as const) {
      const { docs } = await payload.find({
        collection: slug,
        draft: true,
        depth: 1,
        limit: 0,
        pagination: false,
        sort: 'createdAt',
        overrideAccess: true,
      })
      collections[slug] = docs
    }
    return Response.json({ globals, collections }, { headers: { 'Cache-Control': 'no-store' } })
  },
}

