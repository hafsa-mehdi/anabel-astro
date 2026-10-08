Anabel's Oriental Rugs: Astro + Keystatic rebuild ("Dark gallery" design)
=========================================================================

A fast, SEO-ready rebuild of five pages of anabelsorientalrugs.com.
Astro 7 (static HTML) + Keystatic (admin panel, local mode).
It is a test build for the Astro + CMS evaluation, not the live site.

Pages (URLs identical to the live WordPress site)
  /                                                        Home
  /louisville-rug-cleaning/                                Rug Cleaning
  /hole-or-tear-repair/  /fringe-repair/  /color-restoration/
  /edge-binding/  /water-damage-restoration/  /rug-reweaving/   Repairs (one template)
  /indiana-rug-cleaning-services/  /kentucky-rug-cleaning-services/  Service areas
  /contact/                                                Visit / Contact
  /team/                                                   Meet the team (About)
  /tour/                                                   Showroom tour (360° view)
  /designer-program/                                       Designer program + application
  /blog/                                                   Blog listing
  /the-art-of-rug-cleaning-why-professional-care-matters/  Blog post
  /404.html                                                Page not found

Every menu item, button and link now stays on this site. The only links that
leave it on purpose: the online shop (shop.anabelsorientalrugs.com, a separate
store), Google Maps directions, Facebook, Instagram, the iORSO credit and one
research source cited in the blog post. The town names on the Indiana and
Kentucky pages are plain text (the live site's individual town pages were not
part of this build).


1. RUN IT ON YOUR COMPUTER
--------------------------
Needs Node 22.12 or newer.

  npm install        first time, and again whenever package.json changes
  npm run dev        website + admin panel while you work
                       Website: http://127.0.0.1:4321
                       Admin:   http://127.0.0.1:4321/keystatic
  npm run build      makes the finished static site in dist/
  npm run preview    serves dist/ at http://localhost:4321 to check it

"npm run dev" and "npm run build" first run scripts/optimize-uploads.mjs,
which makes resized WebP copies of every uploaded photo (public/images/_r/).
Those copies are recreated automatically; never edit them.

The admin panel only exists during "npm run dev". The built site is plain
HTML with no admin attached.


2. PUT IT ON VERCEL (to send your boss a link)
----------------------------------------------
Option A: GitHub (recommended, redeploys on every push)
  1. Create a new GitHub repository and push this folder to it
     (node_modules, dist and _old-build are already ignored).
  2. vercel.com > Add New > Project > import the repository.
  3. Vercel detects Astro. Leave the settings as they are (vercel.json
     already sets the build command and output folder). Click Deploy.
  4. You get a link like https://anabels-astro.vercel.app

Option B: from the terminal, no GitHub
  npx vercel          (log in, accept the defaults)
  npx vercel --prod   (makes the production link)

Search engines: Vercel copies are automatically hidden from Google
(robots.txt blocks crawling and every page has "noindex"), so the test site
never competes with the real one. Only when this build replaces the live
site: Vercel > Project > Settings > Environment Variables > add
SITE_INDEXING = true, then redeploy.

Editing on Vercel: Keystatic runs in local mode, so edits are made on this
computer with "npm run dev", then pushed to GitHub; Vercel redeploys.


3. WHERE EACH PIECE OF CONTENT LIVES
------------------------------------
Everything below is edited in Keystatic; these are the files it saves to.

  Keystatic section          File(s)
  Pages > Homepage           src/content/home.yaml
  Pages > Cleaning page      src/content/cleaning.yaml
  Pages > Visit page         src/content/visit.yaml
  Pages > Team page          src/content/team.yaml
  Pages > Showroom tour      src/content/tour.yaml
  Pages > Designer program   src/content/designers.yaml
  Service areas              src/content/areas/<page-address>.yaml
  Repairs > Repair pages     src/content/repairs/<page-address>.md
  Blog > Blog page           src/content/blog.yaml
  Blog > Blog posts          src/content/posts/<post-address>.md
  Site-wide > Site settings  src/content/settings.yaml   (name, phone, address,
                             hours, map, menu, social, form destination)
  Site-wide > Testimonials   src/content/testimonials/*.yaml (5 real Google reviews)

  Photos                     public/images/uploads/<page>/...
  Blog photos                src/assets/blog/<post-address>/ (Astro optimizes these)
  Fonts (self-hosted)        public/fonts/  (Cormorant Garamond + Manrope, OFL)
  3D rug posters             public/images/hero/
  Admin fields               keystatic.config.ts
  Page layouts               src/pages/ and src/components/
  Colors, type, motion       src/styles/global.css


4. EDITING IN KEYSTATIC
-----------------------
1. Run "npm run dev" and open http://127.0.0.1:4321/keystatic
2. Pick a section on the left, change text or a photo, click Save.
3. The website at http://127.0.0.1:4321 updates straight away.

Tips
- Gold italic words in headings: wrap them in *asterisks*,
  e.g.  The *perfect* rug at the *perfect* price.
- Reviews: only add real ones (Site-wide > Testimonials). The rating line
  above them ("Rated Excellent · 134 Google reviews") is in Homepage >
  Reviews; keep it in line with Google.
- Booking form: paste the webhook URL (e.g. n8n) into Site settings >
  "Booking form destination". Until then the form tells visitors it is not
  connected yet and shows the phone number. It sends JSON: name, email,
  phone, rugs (1-5+), message, source, offer, page, sentAt.
- Saving rewrites the YAML line breaks. That is normal.


5. MOTION AND 3D (how it behaves)
---------------------------------
- Home hero: the rug unrolls in 3D (three.js) and tilts with the mouse.
  It loads after the page is ready, on screens 768px and wider.
- Home cleaning steps: on computers the section stays on screen while you
  scroll, each step lights up and a second 3D rug unrolls step by step.
- Map (Home and Visit page): MapLibre with free OpenFreeMap tiles (no API
  key). It loads only when you scroll to it, shows nearby towns, then flies
  to the showroom and slowly circles it.
- Smooth scrolling (Lenis) on computers, scroll reveals, moving text strip,
  scrolling reviews, View Transitions between pages.
- Phones get still images for the rugs and a still map view, so the site
  stays fast. Visitors who turn on "reduce motion" get no animation at all.
- Without WebGL the site falls back to the images automatically.


6. ADDING MORE PAGES
--------------------
- A new repair: Keystatic > Repairs > Repair pages > Create, fill it in,
  then add it to Site settings > Main menu > Repairs and to
  Homepage > Repairs > Repair services list.
- A new service area (e.g. a single town): Keystatic > Service areas >
  Create. Keep the page address identical to the old WordPress page.
- Designer applications are sent to the same destination as the booking
  form, as multipart form data with formType=designer-application and the
  uploaded document attached.


7. KNOWN GAPS
-------------
- Form backend is not connected yet (see section 4).
- Keystatic local mode works on this computer only. Editing on the hosted
  site later needs Keystatic's GitHub mode.
- The 5 reviews were copied word for word from the live site's Google
  reviews widget (TrustIndex). New reviews have to be added by hand; ask the
  client before showing reviewers' names.
- The blog post says "every 12 to 18 months", the Cleaning page says "every
  two years" (both from the live site). Worth confirming with Anabel's.
- "What's included" on Hole or Tear Repair uses only facts on the live page.
- The live site's individual town pages (e.g. /jeffersonville-rug-cleaning-
  services/) and the Ask Anabel questionnaire were not rebuilt.
- Repair page texts were rewritten from the single paragraph on each live
  page; "What's included" lists only facts from those paragraphs.
- A few small interface labels ("Get directions", "What's included",
  "Also from Anabel's", "Rug repair") are written in the components.
- Map tiles come from OpenFreeMap (free, community-run). For a busy
  production site consider a paid tile plan.
