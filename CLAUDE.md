## Project notes
- Astro 7 static site + @astrojs/vercel adapter (only Keystatic routes are on-demand). Keystatic: GitHub mode in prod (repo hafsa-mehdi/anabel-astro), local mode in dev unless PUBLIC_KEYSTATIC_STORAGE=github. See README.txt.
- trailingSlash 'ignore' everywhere; scripts/vercel-routes.mjs (postbuild) adds the slash redirect + font caching to .vercel/output/config.json.
- @astrojs/vercel is pinned to 11.0.12: 11.0.13 bundles rolldown into the function without its native binding (FUNCTION_INVOCATION_FAILED on Vercel). Test upgrades by running the function copied outside the project.
- Uploaded images: public/images/uploads/<folder>/ → resized by scripts/optimize-uploads.mjs (predev/prebuild) into public/images/_r + src/generated/image-manifest.json. Use <Img> component.
- Blog posts and repair pages share the root route src/pages/[slug].astro.
- Design: "Dark gallery" (global.css tokens). Headings support *accent* via accent() in lib/cms.ts.
- Motion: Lenis + reveal observer in Base.astro; CleaningSteps.astro (rug unrolls once when in view); ShowroomMap.astro (MapLibre 6 + OpenFreeMap, lazy).
- Vercel: vercel.json; builds on Vercel are noindex unless SITE_INDEXING=true.
- Payload test: cms/ is a separate Next.js + Payload 3 app (Postgres in Docker locally, Neon + Vercel Blob online), same schema/field names as keystatic.config.ts. CMS=payload makes scripts/payload-sync.mjs download content + photos (git-ignored) and src/lib/cms.ts read them; pages must read content only through cms.ts helpers (readSingleton/mustRead/getAll/getOne/getRepair), never the Keystatic reader directly. See cms/README.md.
- Page layouts live in src/views/ (src/pages/* are thin wrappers) so the CMS live preview (src/pages/preview/[...path].astro, on demand, drafts loaded by src/middleware.ts) renders the same markup. Blog posts: use getPosts()/PostEntry from cms.ts, not getCollection, in views.
- 3D hero: src/components/RugHero.astro + src/scripts/rug3d.ts (three.js, dynamic import, desktop only). Posters in public/images/hero/ were rendered from the same scene.

## Development
When starting the dev server, use background mode: `astro dev --background`. Manage with `astro dev stop|status|logs`.
Docs: https://docs.astro.build
