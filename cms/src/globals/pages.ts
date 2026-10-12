// The one-off pages (Keystatic "singletons"). Field names match keystatic.config.ts.
import type { GlobalConfig } from 'payload'
import {
  altText,
  group,
  heading,
  image,
  imagePosition,
  link,
  linkList,
  seo,
  text,
  textList,
  textarea,
} from '../fields'
import { rebuildAfterGlobalChange } from '../hooks/rebuild'

const page = (slug: string, label: string, fields: GlobalConfig['fields']): GlobalConfig => ({
  slug,
  label,
  admin: { group: slug === 'blog' ? 'Blog' : 'Pages' },
  access: { read: () => true },
  hooks: { afterChange: [rebuildAfterGlobalChange] },
  fields,
})

const kicker = (example?: string) => text('kicker', 'Small line above the headline', example && `e.g. ${example}`)
const h1 = heading('heading', 'Main headline (H1)')
const sectionLabel = text('label', 'Small label above the heading')
const formGroup = (headingLabel = 'Form heading', withAccent = false) =>
  group('form', 'Booking form', [
    withAccent ? heading('heading', headingLabel) : text('heading', headingLabel),
    textarea('intro', 'Line above the form'),
  ])

export const Home = page('home', 'Homepage', [
  seo('homepage'),
  group(
    'hero',
    'Top of page (hero)',
    [
      kicker('Frankfort Avenue · Louisville'),
      h1,
      textarea('subtitle', 'Line under the headline'),
      link('primary', 'Main button (red)'),
      link('secondary', 'Second button (outlined)'),
    ],
    'The 3D rug under the buttons is drawn automatically and is not edited here.',
  ),
  textList(
    'marquee',
    'Moving text strip',
    'Phrase',
    'Short phrases that scroll slowly across the page under the hero. Three to five work best.',
  ),
  group('services', 'Three services', [
    sectionLabel,
    heading('heading', 'Heading'),
    textarea('intro', 'Intro'),
    {
      name: 'cards',
      label: 'Cards',
      type: 'array',
      labels: { singular: 'Card', plural: 'Cards' },
      admin: { description: 'Three cards side by side. The "Try Before You Buy" menu link jumps to this section.' },
      fields: [
        {
          type: 'row',
          fields: [text('title', 'Card title'), text('tag', 'Red badge (optional)', 'e.g. 15% off. Leave empty for no badge.')],
        },
        textarea('text', 'Card text'),
        image('image', 'Photo'),
        altText('imageAlt', 'the photo'),
        link('link', 'Card link'),
      ],
    },
  ]),
  group('cleaning', 'Cleaning steps', [
    sectionLabel,
    heading('heading', 'Heading'),
    {
      name: 'steps',
      label: 'Cleaning steps (in order)',
      type: 'array',
      labels: { singular: 'Step', plural: 'Steps' },
      fields: [text('title', 'Step name'), textarea('text', 'One-sentence explanation')],
    },
    link('primary', 'Booking button'),
    link('secondary', 'Link to the cleaning page'),
  ]),
  group('repairs', 'Repairs', [
    sectionLabel,
    heading('heading', 'Heading'),
    textarea('intro', 'Short line'),
    linkList('items', 'Repair services list'),
  ]),
  group(
    'reviews',
    'Reviews',
    [
      sectionLabel,
      heading('heading', 'Heading'),
      text('ratingText', 'Rating line', 'Shown next to the stars, e.g. "Rated Excellent · 134 Google reviews". Keep it in line with Google.'),
    ],
    'The reviews themselves are under Site-wide → Testimonials. This section only appears when at least one exists.',
  ),
  group(
    'visit',
    'Map and visit',
    [sectionLabel, heading('heading', 'Heading'), textarea('intro', 'Short line')],
    'Address, hours and the map location come from Site settings.',
  ),
])

export const Cleaning = page('cleaning', 'Cleaning page', [
  seo('Rug Cleaning page'),
  image('heroImage', 'Top photo'),
  altText('heroAlt', 'the top photo'),
  kicker('Hand-washed in Louisville'),
  h1,
  textarea('lead', 'Line under the headline'),
  textList('highlights', 'Highlights', 'Highlight', 'Four short selling points work best.'),
  formGroup(),
  group('process', 'How we clean', [
    heading('heading', 'Heading'),
    {
      name: 'blocks',
      label: 'Explanation blocks',
      type: 'array',
      labels: { singular: 'Block', plural: 'Blocks' },
      fields: [text('heading', 'Sub-heading'), textarea('body', 'Text', 'Leave an empty line between paragraphs.')],
    },
    image('image', 'Photo'),
    altText('imageAlt', 'the photo'),
    imagePosition,
  ]),
  group('petNote', 'Pet stains note', [text('heading', 'Heading'), textarea('body', 'Text')]),
  group('interval', 'How often to clean', [text('heading', 'Heading'), textarea('body', 'Text')]),
])

export const Visit = page('visit', 'Visit page', [
  seo('Visit / Contact page'),
  kicker(),
  h1,
  textarea('intro', 'Intro'),
  image('image', 'Showroom photo'),
  altText('imageAlt', 'the photo'),
  text('mapLabel', 'Map card: small label'),
  heading('hoursHeading', 'Map card: heading'),
  heading('areasHeading', 'Service areas heading'),
  textarea('areasIntro', 'Service areas line'),
  formGroup(),
])

export const Team = page('team', 'Team page (About)', [
  seo('Team page'),
  kicker(),
  h1,
  group('story', "Anabel's story", [
    heading('heading', 'Heading'),
    textarea('body', 'Story', 'Leave an empty line between paragraphs.'),
    image('image', 'Photo'),
    altText('imageAlt', 'the photo'),
  ]),
  heading('membersHeading', 'Team heading'),
  {
    name: 'members',
    label: 'Team members',
    type: 'array',
    labels: { singular: 'Team member', plural: 'Team members' },
    fields: [
      text('name', 'Name'),
      textarea('bio', 'Short bio'),
      image('photo', 'Photo', 'A portrait (taller than wide) works best.'),
      altText('photoAlt', 'the photo'),
    ],
  },
])

export const Tour = page('tour', 'Showroom tour page', [
  seo('Tour page'),
  kicker(),
  h1,
  textarea('intro', 'Intro'),
  text(
    'tourUrl',
    '360° tour embed link',
    'The Google Street View (or similar) embed link. It only loads when a visitor presses "Start the tour".',
  ),
  image('image', 'Showroom photo', 'Shown before the 360° tour is started.'),
  altText('imageAlt', 'the photo'),
])

export const Designers = page('designers', 'Designer program page', [
  seo('Designer program page'),
  kicker(),
  h1,
  textarea('intro', 'Intro'),
  image('image', 'Top photo'),
  altText('imageAlt', 'the top photo'),
  heading('benefitsHeading', 'Benefits heading'),
  textList('benefits', 'Benefits', 'Benefit', undefined, true),
  image('benefitsImage', 'Benefits photo'),
  altText('benefitsImageAlt', 'the photo'),
  group(
    'form',
    'Designer application form',
    [heading('heading', 'Application heading'), textarea('intro', 'Intro'), textarea('documentsHelp', 'Document upload instructions')],
    'Sent to the same destination as the booking form (Site settings).',
  ),
])

export const Blog = page('blog', 'Blog page (listing)', [seo('blog listing page'), h1, textarea('intro', 'Intro')])

export const pageGlobals = [Home, Cleaning, Visit, Team, Tour, Designers, Blog]
