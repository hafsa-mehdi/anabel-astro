// Shared field builders, mirroring the helpers at the top of ../keystatic.config.ts so both
// admin panels ask for the same content with the same names (the Astro site reads either).
import { slugField } from 'payload'
import type { ArrayField, Field, GroupField, RowField, SelectField, TabsField, TextField, TextareaField, UploadField } from 'payload'

export const accentHelp = 'Wrap a word or two in *asterisks* to show them in gold italics, e.g. The *perfect* rug.'

export const text = (name: string, label: string, description?: string, extra: Partial<TextField> = {}): TextField =>
  ({ name, label, type: 'text', admin: { description }, ...extra }) as TextField

export const textarea = (name: string, label: string, description?: string): TextareaField => ({
  name,
  label,
  type: 'textarea',
  admin: { description },
})

export const heading = (name: string, label: string, description = accentHelp) => text(name, label, description)

/** Photo from the media library. The Astro site downloads and resizes it at build time. */
export const image = (name: string, label: string, description?: string): UploadField => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  admin: { description },
})

/**
 * Alt text for the photo next to it (heroAlt → heroImage, imageAlt → image, photoAlt → photo).
 * Required as soon as a photo is chosen; checked on save only, so the database is unchanged.
 */
export const altText = (name: string, what = 'the image'): TextField => {
  const base = name.replace(/Alt$/, '')
  return text(
    name,
    'Image description (alt text)',
    `Describe ${what} in one plain sentence for visitors who use screen readers and for Google. Example: "Blue and ivory rug in a sunlit living room".`,
    {
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        const photo = siblingData?.[base] ?? siblingData?.[`${base}Image`]
        if (photo && !(typeof value === 'string' && value.trim())) return `Please describe ${what}: it is required when a photo is chosen.`
        return true
      },
    } as Partial<TextField>,
  )
}

/** Shows a list item by one of its fields ("Rug Cleaning") instead of "Card 01". */
export const rowLabel = (field: string, fallback: string) => ({
  components: { RowLabel: { path: '/components/RowLabel#RowLabel', clientProps: { field, fallback } } },
})

/** Splits a long page into tabs. Tabs without a name only change the screen, not the stored data. */
export const tabs = (...list: [label: string, fields: Field[]][]): TabsField => ({
  type: 'tabs',
  tabs: list.map(([label, fields]) => ({ label, fields })),
})

export const link = (name: string, label: string, description?: string): GroupField => ({
  name,
  label,
  type: 'group',
  admin: { description },
  fields: [
    {
      type: 'row',
      fields: [
        text('label', 'Button or link text'),
        text(
          'url',
          'Link address',
          'A page on this site starts with "/" (for example /contact/#book). Other websites start with https://',
        ),
      ],
    },
  ],
})

export const linkList = (name: string, label: string, description?: string, itemLabel = 'Link'): ArrayField => ({
  name,
  label,
  type: 'array',
  labels: { singular: itemLabel, plural: label },
  admin: { description, ...rowLabel('label', itemLabel) },
  fields: [
    {
      type: 'row',
      fields: [
        text('label', 'Button or link text'),
        text('url', 'Link address', 'Starts with "/" for a page on this site, https:// for other websites.'),
      ],
    },
  ],
})

/** A list of short texts. Stored as [{ value }]; the Astro side flattens it to string[]. */
export const textList = (name: string, label: string, itemLabel: string, description?: string, multiline = false): ArrayField => ({
  name,
  label,
  type: 'array',
  labels: { singular: itemLabel, plural: label },
  admin: { description, ...rowLabel('value', itemLabel) },
  fields: [multiline ? textarea('value', itemLabel) : text('value', itemLabel)],
})

export const seo = (pageName: string): GroupField => ({
  name: 'seo',
  label: 'Search engine (SEO) settings',
  type: 'group',
  fields: [
    text(
      'title',
      'SEO title',
      `The title shown in Google results and the browser tab for the ${pageName}. Aim for 50–60 characters.`,
      { minLength: 10, maxLength: 70 },
    ),
    {
      ...textarea('description', 'SEO description', 'The short summary under the title in Google results. Aim for 140–160 characters.'),
      minLength: 50,
      maxLength: 170,
    },
  ],
})

export const imagePosition: SelectField = {
  name: 'imagePosition',
  label: 'Image position (design option)',
  type: 'select',
  defaultValue: 'left',
  admin: {
    description: 'Which side the photo sits on, on larger screens. On phones the photo always appears above the text.',
  },
  options: [
    { label: 'Photo on the left', value: 'left' },
    { label: 'Photo on the right', value: 'right' },
  ],
}

/**
 * Page address, filled in from the title ("Fringe Repair" → fringe-repair) until it is first
 * saved; after that it only changes when an editor unlocks and edits it, so live URLs stay put.
 */
export const slug = (description: string): RowField =>
  slugField({
    useAsSlug: 'title',
    overrides: (row) => ({
      ...row,
      fields: row.fields.map((f) =>
        'name' in f && f.name === 'slug'
          ? ({ ...f, label: 'Page address', admin: { ...f.admin, description } } as Field)
          : f,
      ),
    }),
  }) as RowField

export const group = (name: string, label: string, fields: Field[], description?: string): GroupField => ({
  name,
  label,
  type: 'group',
  admin: { description },
  fields,
})
