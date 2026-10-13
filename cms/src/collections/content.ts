// Repair pages, service areas, blog posts and testimonials (Keystatic "collections").
import type { CollectionConfig, Field } from 'payload'
import { altText, heading, image, slug, structuredData, tabs, text, textList, textarea } from '../fields'
import { rebuildAfterChange, rebuildAfterDelete } from '../hooks/rebuild'
import { richTextToHTML } from '../richTextHtml'

// Drafts (autosaved while typing, for the live preview) + version history. Visitors (and the website build) only ever see published entries;
// logged-in editors also see drafts. The site rebuilds when an entry is published or unpublished.
const shared: Pick<CollectionConfig, 'access' | 'hooks' | 'versions'> = {
  access: { read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }) },
  hooks: { afterChange: [rebuildAfterChange], afterDelete: [rebuildAfterDelete] },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 50 },
}

/** Rich text plus a read-only HTML copy of it, which is what the Astro site renders. */
const richText = (name: string, label: string, description?: string): Field[] => [
  { name, label, type: 'richText', admin: { description } },
  {
    name: `${name}Html`,
    type: 'textarea',
    virtual: true,
    admin: { hidden: true },
    hooks: {
      afterRead: [({ siblingData }) => (siblingData?.[name] ? richTextToHTML(siblingData[name]) : '')],
    },
  },
]

export const Repairs: CollectionConfig = {
  slug: 'repairs',
  labels: { singular: 'Repair page', plural: 'Repair pages' },
  admin: { group: 'Repairs', useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status', 'updatedAt'] },
  ...shared,
  fields: [
    text('title', 'Page name (H1)', 'e.g. Fringe Repair', { required: true }),
    slug('The end of the URL. Keep it identical to the old WordPress page, e.g. fringe-repair'),
    tabs(
      [
        'Content',
        [
          image('heroImage', 'Top photo'),
          altText('heroAlt', 'the top photo'),
          textarea('intro', 'Intro (one or two sentences)'),
          textList('included', "What's included", 'Item', 'Short, factual points. Only list what the shop really does.'),
          ...richText('body', 'Main text', 'Use headings (H2) to break up longer text.'),
        ],
      ],
      [
        'Booking & call to action',
        [
          text('formHeading', 'Booking form heading', undefined, { defaultValue: 'Book now and get 15% off' }),
          textarea('formIntro', 'Line above the booking form'),
          text('ctaHeading', 'Call-to-action heading', 'The closing box that asks visitors to book or call.'),
          textarea('ctaText', 'Call-to-action text'),
        ],
      ],
      [
        'SEO',
        [
          text('seoTitle', 'SEO title', 'Shown in Google results and the browser tab. Aim for 50–60 characters.'),
          textarea('seoDescription', 'SEO description', 'Aim for 140–160 characters.'),
          structuredData({ pageType: true, service: true }),
        ],
      ],
    ),
  ],
}

export const Areas: CollectionConfig = {
  slug: 'areas',
  labels: { singular: 'Service area page', plural: 'Service area pages' },
  admin: { group: 'Service areas', useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status', 'updatedAt'] },
  ...shared,
  fields: [
    text('title', 'Page name', 'e.g. Rug Cleaning Indiana', { required: true }),
    slug('Keep identical to the old page, e.g. indiana-rug-cleaning-services'),
    tabs(
      [
        'Content',
        [
          text('kicker', 'Small line above the headline'),
          heading('heading', 'Main headline (H1)'),
          textarea('intro', 'Intro'),
          image('heroImage', 'Top photo'),
          altText('heroAlt', 'the top photo'),
          heading('citiesHeading', 'Towns heading'),
          textList('cities', 'Towns we serve', 'Town'),
        ],
      ],
      ['Booking form', [text('formHeading', 'Booking form heading'), textarea('formIntro', 'Line above the booking form')]],
      [
        'SEO',
        [text('seoTitle', 'SEO title'), textarea('seoDescription', 'SEO description'), structuredData({ pageType: true, service: true })],
      ],
    ),
  ],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: { group: 'Blog', useAsTitle: 'title', defaultColumns: ['title', 'pubDate', '_status', 'updatedAt'] },
  defaultSort: '-pubDate',
  ...shared,
  fields: [
    text('title', 'Title (H1)', undefined, { required: true }),
    slug('The end of the URL. Do not change it after publishing.'),
    {
      name: 'pubDate',
      label: 'Publish date',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'MMMM d, yyyy' } },
    },
    tabs(
      [
        'Content',
        [
          textarea('description', 'Summary', 'Shown on the blog listing and in Google results. Two sentences at most.'),
          image('heroImage', 'Top photo', 'Shown on the post and the blog listing.'),
          altText('heroAlt', 'the top photo'),
          ...richText('content', 'Post text'),
        ],
      ],
      ['SEO', [structuredData({ pageType: true })]],
    ),
  ],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: { group: 'Site-wide', useAsTitle: 'name', defaultColumns: ['name', 'source', 'rating', '_status'] },
  ...shared,
  fields: [
    text('name', 'Customer name', 'As the customer signed it, e.g. "Sarah M."', { required: true }),
    textarea(
      'quote',
      'Review text',
      'Copy real reviews only, word for word, with the customer’s permission or from a public review site.',
    ),
    {
      type: 'row',
      fields: [
        text('source', 'Where the review came from', 'e.g. Google'),
        { name: 'rating', label: 'Stars (1–5)', type: 'number', defaultValue: 5, min: 1, max: 5 },
        {
          name: 'date',
          label: 'Review date (optional)',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'MMMM d, yyyy' } },
        },
      ],
    },
  ],
}
