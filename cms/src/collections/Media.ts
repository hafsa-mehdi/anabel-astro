import type { CollectionConfig } from 'payload'
import { rebuildAfterChange } from '../hooks/rebuild'

// Photos are stored once at full size: in ./media locally, in Vercel Blob online.
// The Astro site downloads them at build time and makes its own resized WebP copies,
// so no image sizes are generated here.
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo', plural: 'Photos' },
  admin: { group: 'Site-wide' },
  access: { read: () => true },
  hooks: { afterChange: [rebuildAfterChange] },
  fields: [
    {
      name: 'alt',
      label: 'Default description (alt text)',
      type: 'text',
      admin: { description: 'Optional. Each page also has its own alt text field next to the photo.' },
    },
  ],
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
  },
}
