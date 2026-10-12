// After a save, asks Vercel to rebuild the Astro site (which reads this CMS at build time).
// Set ASTRO_DEPLOY_HOOK_URL to the site's Deploy Hook (Vercel > anabel-astro > Settings > Git).
// Without it (local work) nothing happens: rerun `npm run dev` in the site to pick up changes.
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

async function triggerRebuild(logger: { info: (m: string) => void; error: (m: string) => void }, what: string) {
  const url = process.env.ASTRO_DEPLOY_HOOK_URL
  if (!url) return
  try {
    const res = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(5000) })
    logger.info(`[rebuild] ${what} saved, site rebuild requested (${res.status})`)
  } catch (err) {
    logger.error(`[rebuild] could not reach the deploy hook: ${String(err)}`)
  }
}

export const rebuildAfterChange: CollectionAfterChangeHook = async ({ req, collection, doc }) => {
  await triggerRebuild(req.payload.logger, collection.slug)
  return doc
}

export const rebuildAfterDelete: CollectionAfterDeleteHook = async ({ req, collection, doc }) => {
  await triggerRebuild(req.payload.logger, collection.slug)
  return doc
}

export const rebuildAfterGlobalChange: GlobalAfterChangeHook = async ({ req, global, doc }) => {
  await triggerRebuild(req.payload.logger, global.slug)
  return doc
}
