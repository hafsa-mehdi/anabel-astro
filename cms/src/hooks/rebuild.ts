// After a publish, asks Vercel to rebuild the Astro site (which reads this CMS at build time).
// Set ASTRO_DEPLOY_HOOK_URL to the site's Deploy Hook (Vercel > anabel-astro-payload > Settings > Git).
// Without it (local work) nothing happens: run `npm run cms:sync` in the site to pick up changes.
//
// "Save draft" does not rebuild (the site only shows published content anyway);
// Publish, Unpublish, deleting an entry and changing a photo do.
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook, PayloadRequest } from 'payload'

const isDraftSave = (req: PayloadRequest) => String(req.query?.draft) === 'true'

// Scripts and migrations that change many entries pass context: { skipRebuild: true }
async function triggerRebuild(req: PayloadRequest, context: Record<string, unknown>, what: string) {
  const url = process.env.ASTRO_DEPLOY_HOOK_URL
  if (!url || isDraftSave(req) || context?.skipRebuild) return
  try {
    const res = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(5000) })
    req.payload.logger.info(`[rebuild] ${what} published, site rebuild requested (${res.status})`)
  } catch (err) {
    req.payload.logger.error(`[rebuild] could not reach the deploy hook: ${String(err)}`)
  }
}

export const rebuildAfterChange: CollectionAfterChangeHook = async ({ req, context, collection, doc }) => {
  await triggerRebuild(req, context, collection.slug)
  return doc
}

export const rebuildAfterDelete: CollectionAfterDeleteHook = async ({ req, context, collection, doc }) => {
  await triggerRebuild(req, context, collection.slug)
  return doc
}

export const rebuildAfterGlobalChange: GlobalAfterChangeHook = async ({ req, context, global, doc }) => {
  await triggerRebuild(req, context, global.slug)
  return doc
}
