// Shared field builders, mirroring the helpers at the top of ../keystatic.config.ts so both
// admin panels ask for the same content with the same names (the Astro site reads either).
import type { ArrayField, Field, GroupField, SelectField, TextField, TextareaField, UploadField } from 'payload'

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

export const altText = (name: string, what = 'the image') =>
  text(
    name,
    'Image description (alt text)',
    `Describe ${what} in one plain sentence for visitors who use screen readers and for Google. Example: "Blue and ivory rug in a sunlit living room".`,
  )

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

export const linkList = (name: string, label: string, description?: string): ArrayField => ({
  name,
  label,
  type: 'array',
  admin: { description },
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
  admin: { description },
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

/** Page address field, like Keystatic's fields.slug. */
export const slug = (description: string): TextField => ({
  name: 'slug',
  label: 'Page address',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar', description },
})

export const group = (name: string, label: string, fields: Field[], description?: string): GroupField => ({
  name,
  label,
  type: 'group',
  admin: { description },
  fields,
})
