# Anabel's CMS (Payload test)

A Payload 3 admin panel for the Astro site, running next to Keystatic so the two can be compared.
It holds the same pages and fields as `../keystatic.config.ts` (same names, so the site's pages
did not change). The Astro site reads it only when `CMS=payload`; otherwise it keeps using Keystatic.

```
cms/                     Next.js app = Payload admin (/admin) + REST API (/api)
  src/payload.config.ts  database, storage, list of collections/globals
  src/globals/           one-off pages: Homepage, Cleaning page, …, Site settings
  src/collections/       Repair pages, Service areas, Blog posts, Testimonials, Photos, Editors
  src/richTextHtml.ts    rich text → HTML (same heading ids as Markdown)
  src/hooks/rebuild.ts   saving content rebuilds the Astro site on Vercel
  src/migrations/        database changes for the online database
  scripts/import-keystatic.ts   copies ../src/content + photos into Payload
../scripts/payload-sync.mjs     (Astro side) downloads content + photos before dev/build
```

## Run it on this computer

Needs Docker Desktop (for Postgres) and Node 22+.

```bash
cd cms
npm install
copy .env.example .env      # then set PAYLOAD_SECRET to a long random string
npm run db:up               # Postgres in Docker on port 5433
npm run import              # first time: copies the Keystatic content and photos
npm run dev                 # http://localhost:3000/admin  (first visit: create your editor login)
```

Then the website, in a second terminal in the project folder:

```powershell
$env:CMS="payload"; npm run dev      # http://127.0.0.1:4321, reading Payload
```

(or put `CMS=payload` in the project's `.env`). After saving in Payload, run `npm run cms:sync`
in the project folder and reload the page. New blog posts need a restart of `npm run dev`.

## Put it online (Vercel)

Two Vercel projects from the same GitHub repository:

1. **The CMS.** Vercel > Add New > Project > import `anabel-astro`.
   - Root Directory: `cms`. Framework: Next.js. Build Command: `npm run ci`
     (runs the database migrations, then builds).
   - Project > Storage > Create Database > **Neon** (Postgres) > connect it to this project.
     It adds `DATABASE_URL`.
   - Project > Storage > Create > **Blob** > connect it. It adds `BLOB_READ_WRITE_TOKEN`.
   - Settings > Environment Variables: `PAYLOAD_SECRET` = a new long random string.
   - Deploy, open `https://<cms-project>.vercel.app/admin` and create the first editor.
2. **Copy the content in** (once), from this computer. Put the online values in `cms/.env`
   for a moment (`DATABASE_URL` from Neon, `BLOB_READ_WRITE_TOKEN` from the Blob store),
   run `npm run import`, then put the local values back.
3. **The site in Payload mode.** Add New > Project > the same repository again, Root Directory
   left as is (the existing Keystatic project stays untouched). Environment Variables:
   `CMS=payload`, `PAYLOAD_URL=https://<cms-project>.vercel.app`. Deploy.
4. **Rebuild on save.** In the Payload-mode site project: Settings > Git > Deploy Hooks > create
   one (branch `main`). Copy its URL to the CMS project as `ASTRO_DEPLOY_HOOK_URL`, redeploy the CMS.
   Each save in Payload now rebuilds the site (1–2 minutes).

Optional: CMS project > Settings > Git > Ignored Build Step:
`git diff --quiet HEAD^ HEAD -- .` so site-only commits do not rebuild the CMS.

## Editing (what editors get)

- **Drafts:** changes autosave as a private draft while you type; "Publish changes" puts them
  live and rebuilds the site. Every page has a version history (Versions tab) with
  "Revert to published".
- **Live preview** (eye icon next to Publish): the real website beside the form, showing the
  draft. It reloads after each autosave; phone / tablet / desktop sizes at the top.
- **Tabs** on long pages (Homepage, Site settings, Cleaning page; Content / SEO elsewhere).
- **List items named by their content** ("Rug cleaning", not "Card 01").
- **Page address** fills itself in from the title on the first save, then stays locked
  (Unlock to change it on purpose, since that changes a live URL).
- **Text editor** limited to what the site styles: paragraphs, H2/H3, bold, italic, lists,
  quotes, links.
- **Alt text** is required as soon as a photo is chosen (checked on Publish).
- **Structured data** (SEO tab of every page and post): an FAQ that shows on the page and goes
  into its FAQPage schema, plus (repairs, service areas, cleaning, posts) the page type for
  Google and service details, and a switch to turn schema off. Business details for Google
  (description, price range, photo) are in Site settings. `src/lib/schema.ts` builds the JSON-LD.
- **Custom schema (advanced)** at the bottom of the same group: hand-written JSON-LD, checked on
  save (`src/customSchema.ts`: valid JSON, @context/@type, no HTML, no FAQ/breadcrumb copies),
  with links to Google's Rich Results Test and the schema.org validator for the published page.
- **Branding:** Anabel's wordmark and the site's dark colours; "View website" in the top bar
  (`SITE_URL`, defaults to the Payload version of the site).

## How the live preview works

1. The preview panel opens `<SITE_URL>/preview/<page>/?secret=<PREVIEW_SECRET>` on the
   Payload version of the website: an on-demand page (`src/pages/preview/`), not a built one.
2. `src/middleware.ts` there fetches the latest drafts from this CMS at
   `/api/preview-content?secret=…` (`src/livePreview.ts`) and renders the page with them,
   using the same page layouts as the built site (`src/views/`).
3. After each autosave the admin tells the preview to reload.

Settings: `PREVIEW_SECRET` on the CMS only (any long random string; without it the preview
shows "not allowed"). `SITE_URL` on the CMS, `PAYLOAD_URL` on the site (both already set).
Photos uploaded but not yet published load straight from the CMS in the preview.

## Changing fields

Edit `src/globals` or `src/collections` (keep the field names in step with `keystatic.config.ts`
while both run). Locally the Docker database updates by itself. For the online database:

```bash
npm run payload migrate:create <short-name>   # commit the new file in src/migrations
npm run generate:types
```

## Differences from Keystatic worth knowing

- Content lives in a database, not in git: no commit per save, no history in GitHub.
  Back up the Neon database (Neon keeps point-in-time history on its own).
- Editors log in with an email and password made in Payload (Editors), not with GitHub.
- Photos are one shared library (Photos) and can be reused across pages.
- Main texts (repairs, blog) use Payload's rich text editor; the HTML it produces is what the
  site shows. Repair headings now get anchor ids, like blog headings already did.
