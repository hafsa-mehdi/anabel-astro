// One-off import: copies the Keystatic content (../src/content) and its photos into Payload,
// so both CMSes start from the same content. Safe to run again: globals are overwritten,
// entries are matched by page address (slug) or name, and photos by file path.
//
//   npm run import
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { getPayload } from 'payload'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import config from '../src/payload.config'

const SITE = path.resolve(import.meta.dirname, '..', '..')
const CONTENT = path.join(SITE, 'src', 'content')

const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: payload.config })

const readYaml = (file: string) => yaml.load(fs.readFileSync(file, 'utf8')) as Record<string, any>

/** Markdown file with YAML front matter → { data, body } */
function readMarkdown(file: string) {
  const raw = fs.readFileSync(file, 'utf8')
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) throw new Error(`No front matter in ${file}`)
  return { data: yaml.load(m[1]) as Record<string, any>, body: m[2].trim() }
}

const markdown = (md: string) => convertMarkdownToLexical({ editorConfig, markdown: md }) as any

// --- Photos ----------------------------------------------------------------------------------
const mediaIds = new Map<string, number | string>()

/** Uploads a photo once (matched by its original path) and returns the media id. */
async function media(src: string, baseDir: string, alt?: string) {
  const file = src.startsWith('/images/') ? path.join(SITE, 'public', src) : path.resolve(baseDir, src)
  const key = path.relative(SITE, file).split(path.sep).join('/')
  if (mediaIds.has(key)) return mediaIds.get(key)!
  if (!fs.existsSync(file)) {
    payload.logger.warn(`[import] missing photo ${key}`)
    return null
  }
  // Many photos share a name (heroImage.webp), so name each after its folder: repairs-fringe-repair-heroImage.webp
  const name = key
    .replace(/^public\/images\/uploads\//, '')
    .replace(/^src\/assets\//, '')
    .replace(/\//g, '-')
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1 })
  if (existing.docs[0]) {
    mediaIds.set(key, existing.docs[0].id)
    return existing.docs[0].id
  }
  const data = fs.readFileSync(file)
  const doc = await payload.create({
    collection: 'media',
    data: { alt: alt ?? '' },
    file: { data, mimetype: mime(file), name, size: data.length },
  })
  mediaIds.set(key, doc.id)
  return doc.id
}

const mime = (f: string) =>
  ({ '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' })[
    path.extname(f).toLowerCase()
  ] ?? 'application/octet-stream'

const isImagePath = (v: unknown): v is string =>
  typeof v === 'string' && (/^\/images\/uploads\//.test(v) || /assets\/blog\//.test(v)) && /\.(jpe?g|png|webp|avif)$/i.test(v)

/**
 * Turns Keystatic data into Payload data:
 *  - photo paths → media ids (alt text from the sibling "…Alt" field)
 *  - lists of plain text → [{ value }]
 */
async function convert(value: any, baseDir: string, siblings?: Record<string, any>, key?: string): Promise<any> {
  if (isImagePath(value)) {
    // heroImage → heroAlt, image → imageAlt, photo → photoAlt, benefitsImage → benefitsImageAlt
    const alt = siblings?.[`${key}Alt`] ?? siblings?.[`${key?.replace(/Image$/, '')}Alt`]
    return media(value, baseDir, alt)
  }
  if (Array.isArray(value)) {
    // Multi-select fields (hours > days) stay plain lists
    if (key !== 'days' && value.every((v) => typeof v === 'string')) return value.map((v) => ({ value: v }))
    return Promise.all(value.map((v) => convert(v, baseDir)))
  }
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(value)) out[k] = await convert(v, baseDir, value, k)
    return out
  }
  // Keystatic leaves empty optional fields as null/""; Payload is fine with both.
  return value
}

// --- Globals (single pages) ------------------------------------------------------------------
for (const slug of ['settings', 'home', 'cleaning', 'visit', 'team', 'tour', 'designers', 'blog'] as const) {
  const data = await convert(readYaml(path.join(CONTENT, `${slug}.yaml`)), CONTENT)
  await payload.updateGlobal({ slug, data })
  payload.logger.info(`[import] ${slug}`)
}

// --- Collections -----------------------------------------------------------------------------
async function upsert(collection: 'repairs' | 'areas' | 'posts' | 'testimonials', match: Record<string, string>, data: any) {
  const [field, value] = Object.entries(match)[0]
  const found = await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1 })
  if (found.docs[0]) await payload.update({ collection, id: found.docs[0].id, data })
  else await payload.create({ collection, data })
  payload.logger.info(`[import] ${collection}/${value}`)
}

const files = (dir: string, ext: string) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(ext)).map((f) => path.join(dir, f)) : []

for (const file of files(path.join(CONTENT, 'repairs'), '.md')) {
  const slug = path.basename(file, '.md')
  const { data, body } = readMarkdown(file)
  await upsert('repairs', { slug }, { ...(await convert(data, path.dirname(file))), slug, body: markdown(body) })
}

for (const file of files(path.join(CONTENT, 'areas'), '.yaml')) {
  const slug = path.basename(file, '.yaml')
  await upsert('areas', { slug }, { ...(await convert(readYaml(file), path.dirname(file))), slug })
}

for (const file of files(path.join(CONTENT, 'posts'), '.md')) {
  const slug = path.basename(file, '.md')
  const { data, body } = readMarkdown(file)
  const converted = await convert(data, path.dirname(file))
  await upsert('posts', { slug }, { ...converted, slug, pubDate: new Date(data.pubDate).toISOString(), content: markdown(body) })
}

for (const file of files(path.join(CONTENT, 'testimonials'), '.yaml')) {
  const data = readYaml(file)
  await upsert('testimonials', { name: data.name }, await convert(data, path.dirname(file)))
}

payload.logger.info(`[import] done: ${mediaIds.size} photos`)
process.exit(0)
