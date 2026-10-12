import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Areas, Posts, Repairs, Testimonials } from './collections/content'
import { Settings } from './globals/Settings'
import { pageGlobals } from './globals/pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " · Anabel's CMS" },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Repairs, Areas, Posts, Testimonials, Media, Users],
  globals: [...pageGlobals, Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  // The Astro site (any origin) reads the public content over the REST API at build time.
  cors: '*',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Schema changes are pushed automatically only to the local Docker database.
    // Online (Neon) the tables change through migrations: npm run payload migrate:create
    push: /@(127\.0\.0\.1|localhost)[:/]/.test(process.env.DATABASE_URL || ''),
  }),
  sharp,
  plugins: [
    // Online only: photos go to Vercel Blob (local work keeps them in ./media).
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
