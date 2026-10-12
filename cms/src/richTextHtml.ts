// Rich text → HTML for the Astro site, kept close to what Markdown produced under Keystatic:
// headings get the same ids (anchor links keep working) and list items carry no empty attributes.
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { convertLexicalToHTML, type HTMLConvertersFunction } from '@payloadcms/richtext-lexical/html'

const ALLOWED_HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

const plainText = (node: any): string =>
  typeof node?.text === 'string' ? node.text : (node?.children ?? []).map(plainText).join('')

/** Same ids as Astro's Markdown headings (github-slugger). */
const slugify = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
    .replace(/\s/g, '-')

export function richTextToHTML(data: SerializedEditorState) {
  const used = new Map<string, number>()
  const uniqueId = (text: string) => {
    const base = slugify(text)
    const n = used.get(base) ?? 0
    used.set(base, n + 1)
    return n ? `${base}-${n}` : base
  }

  const converters: HTMLConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToHTML }) => {
      const tag = ALLOWED_HEADINGS.has(node.tag) ? node.tag : 'h2'
      return `<${tag} id="${uniqueId(plainText(node))}">${nodesToHTML({ nodes: node.children }).join('')}</${tag}>`
    },
    list: ({ node, nodesToHTML }) => {
      const tag = node.tag === 'ol' ? 'ol' : 'ul'
      return `<${tag}>${nodesToHTML({ nodes: node.children }).join('')}</${tag}>`
    },
    listitem: ({ node, nodesToHTML }) => `<li>${nodesToHTML({ nodes: node.children }).join('')}</li>`,
  })

  return convertLexicalToHTML({ data, converters, disableContainer: true })
}
