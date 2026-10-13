// Checks the "Custom schema (advanced)" box before a page is published: it must be JSON-LD the
// website can add to the page as it is. The website repeats the same checks when it builds
// (src/lib/schema.ts, parseCustomSchema), because Keystatic cannot check it on save.

// FAQs and breadcrumbs are already made by the website; a second copy would confuse Google.
const AUTOMATIC = new Set(['FAQPage', 'BreadcrumbList'])

/** "… in JSON at position 57" → "line 4" of the editor's text. */
const where = (text: string, message: string) => {
  const lineCol = message.match(/line (\d+)/)
  if (lineCol) return `Line ${lineCol[1]}: `
  const pos = message.match(/position (\d+)/)
  return pos ? `Line ${text.slice(0, Number(pos[1])).split('\n').length}: ` : ''
}

export function checkCustomSchema(value: unknown): true | string {
  const text = typeof value === 'string' ? value.trim() : ''
  if (!text) return true
  if (/<[a-z/!]/i.test(text)) {
    return 'Paste only the JSON, without <script> or other HTML tags around it.'
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch (err) {
    const message = (err as Error).message
    return `${where(text, message)}this is not valid JSON (${message.replace(/ in JSON.*$/, '')}). Check for a missing comma, quote or bracket.`
  }
  const blocks = Array.isArray(parsed) ? parsed : [parsed]
  if (!blocks.length) return 'The list is empty. Paste at least one schema block, or clear the box.'
  for (const [i, block] of blocks.entries()) {
    const name = blocks.length > 1 ? `Block ${i + 1}` : 'The schema'
    if (!block || typeof block !== 'object' || Array.isArray(block)) return `${name} must be an object in { curly brackets }.`
    const { '@context': context, '@type': type } = block as Record<string, unknown>
    if (typeof context !== 'string' || !context.includes('schema.org')) {
      return `${name} needs "@context": "https://schema.org".`
    }
    const types = Array.isArray(type) ? type : [type]
    if (!types.length || !types.every((t) => typeof t === 'string' && t.trim())) {
      return `${name} needs an "@type", e.g. "Event" or "Product".`
    }
    const automatic = types.find((t) => AUTOMATIC.has(t as string))
    if (automatic === 'FAQPage') return 'FAQ schema is made automatically: use the FAQ list above instead.'
    if (automatic) return 'Breadcrumb schema is made automatically: remove it from here.'
  }
  return true
}
