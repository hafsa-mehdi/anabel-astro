import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Editor', plural: 'Editors' },
  admin: { group: 'Site-wide', useAsTitle: 'email' },
  auth: true,
  fields: [],
}
