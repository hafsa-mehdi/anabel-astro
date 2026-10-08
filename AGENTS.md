## Project notes
- Astro 7 static site + Keystatic (local mode). See README.txt.
- Keystatic loads only when argv includes `dev`; trailingSlash is 'ignore' in dev (Keystatic API needs it), 'always' in builds.
- Uploaded images: public/images/uploads/<folder>/ → resized by scripts/optimize-uploads.mjs (predev/prebuild) into public/images/_r + src/generated/image-manifest.json. Use <Img> component.
- Blog posts and repair pages share the root route src/pages/[slug].astro.
- Design: "Dark gallery" (global.css tokens). Headings support *accent* via accent() in lib/cms.ts.
- Motion: Lenis + reveal observer in Base.astro; CleaningSteps.astro (scroll-scrubbed rug); ShowroomMap.astro (MapLibre 5 + OpenFreeMap, lazy).
- Vercel: vercel.json; builds on Vercel are noindex unless SITE_INDEXING=true.
- 3D hero: src/components/RugHero.astro + src/scripts/rug3d.ts (three.js, dynamic import, desktop only). Posters in public/images/hero/ were rendered from the same scene.

## Development
When starting the dev server, use background mode: `astro dev --background`. Manage with `astro dev stop|status|logs`.
Docs: https://docs.astro.build
