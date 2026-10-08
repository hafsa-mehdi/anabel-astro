import { config, fields, collection, singleton } from '@keystatic/core';

// ---------------------------------------------------------------------------
// Keystatic admin panel for Anabel's Oriental Rugs.
// Open it at http://127.0.0.1:4321/keystatic while `npm run dev` is running.
// Everything is saved as files inside this project (local mode).
// ---------------------------------------------------------------------------

// Shared helpers -------------------------------------------------------------

// Uploaded images go to public/images/uploads/<folder>/ (one folder per page type),
// and resized copies are made automatically at build time.
const uploadImage = (folder: string, label: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: `public/images/uploads/${folder}`,
    publicPath: `/images/uploads/${folder}/`,
  });

const altText = (what = 'the image') =>
  fields.text({
    label: 'Image description (alt text)',
    description: `Describe ${what} in one plain sentence for visitors who use screen readers and for Google. Example: "Blue and ivory rug in a sunlit living room".`,
  });

const link = (label: string, description?: string) =>
  fields.object(
    {
      label: fields.text({ label: 'Button or link text' }),
      url: fields.text({
        label: 'Link address',
        description: 'A page on this site starts with "/" (for example /contact/#book). Other websites start with https://',
      }),
    },
    { label, description },
  );

const seo = (pageName: string) =>
  fields.object(
    {
      title: fields.text({
        label: 'SEO title',
        description: `The title shown in Google results and the browser tab for the ${pageName}. Aim for 50–60 characters.`,
        validation: { length: { min: 10, max: 70 } },
      }),
      description: fields.text({
        label: 'SEO description',
        description: 'The short summary under the title in Google results. Aim for 140–160 characters.',
        multiline: true,
        validation: { length: { min: 50, max: 170 } },
      }),
    },
    { label: 'Search engine (SEO) settings' },
  );

const accentHelp = 'Wrap a word or two in *asterisks* to show them in gold italics, e.g. The *perfect* rug.';

const paragraphs = (label: string, description = 'Leave an empty line between paragraphs.') =>
  fields.text({ label, description, multiline: true });

const imagePosition = fields.select({
  label: 'Image position (design option)',
  description: 'Which side the photo sits on, on larger screens. On phones the photo always appears above the text.',
  options: [
    { label: 'Photo on the left', value: 'left' },
    { label: 'Photo on the right', value: 'right' },
  ],
  defaultValue: 'left',
});

// ---------------------------------------------------------------------------

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: "Anabel's Oriental Rugs" },
    navigation: {
      Pages: ['home', 'cleaning', 'visit', 'team', 'tour', 'designers'],
      Repairs: ['repairs'],
      'Service areas': ['areas'],
      Blog: ['blog', 'posts'],
      'Site-wide': ['settings', 'testimonials'],
    },
  },

  singletons: {
    // ---------------------------------------------------------------- SETTINGS
    settings: singleton({
      label: 'Site settings',
      path: 'src/content/settings',
      format: { data: 'yaml' },
      schema: {
        businessName: fields.text({ label: 'Business name', description: 'Used in the footer, page titles and Google business data.' }),
        wordmark: fields.object(
          {
            name: fields.text({ label: 'Name (large, italic)', description: "e.g. Anabel's" }),
            tagline: fields.text({ label: 'Line underneath (small capitals)', description: 'e.g. Oriental Rugs' }),
          },
          { label: 'Header name', description: 'The name shown in the middle of the header and in the footer.' },
        ),
        logo: uploadImage('site', 'Logo image', 'Used by Google and when pages are shared on social media. The header shows the name below instead.'),
        phone: fields.text({
          label: 'Phone number',
          description: 'Written the way visitors should see it, e.g. 502 895 9595. The click-to-call link is created automatically.',
        }),
        email: fields.text({ label: 'Email address' }),
        address: fields.object(
          {
            street: fields.text({ label: 'Street address', description: 'e.g. 3740 Frankfort Avenue' }),
            city: fields.text({ label: 'City' }),
            region: fields.text({ label: 'State (two letters)', description: 'e.g. KY' }),
            postalCode: fields.text({ label: 'ZIP code' }),
          },
          { label: 'Showroom address' },
        ),
        geo: fields.object(
          {
            latitude: fields.text({ label: 'Latitude', description: 'Only used by Google. Change it only if the showroom moves.' }),
            longitude: fields.text({ label: 'Longitude' }),
          },
          { label: 'Map coordinates (for Google)' },
        ),
        mapTowns: fields.array(
          fields.object({
            name: fields.text({ label: 'Town name' }),
            latitude: fields.text({ label: 'Latitude' }),
            longitude: fields.text({ label: 'Longitude' }),
          }),
          {
            label: 'Nearby towns on the map',
            description: 'Shown briefly on the homepage map before it flies to the showroom. Optional.',
            itemLabel: (p) => p.fields.name.value || 'Town',
          },
        ),
        directionsUrl: fields.url({ label: 'Directions link', description: 'The Google Maps link that opens when someone taps "Get directions".' }),
        mapQuery: fields.text({
          label: 'Map search text',
          description: 'What the embedded map on the Visit page searches for. The business name plus address is the safest choice.',
        }),
        hours: fields.array(
          fields.object({
            label: fields.text({ label: 'Days as shown on the site', description: 'e.g. Monday – Friday' }),
            days: fields.multiselect({
              label: 'Which days this line covers',
              description: 'Used for the opening hours Google shows. Tick every day this line applies to.',
              options: [
                { label: 'Monday', value: 'Monday' },
                { label: 'Tuesday', value: 'Tuesday' },
                { label: 'Wednesday', value: 'Wednesday' },
                { label: 'Thursday', value: 'Thursday' },
                { label: 'Friday', value: 'Friday' },
                { label: 'Saturday', value: 'Saturday' },
                { label: 'Sunday', value: 'Sunday' },
              ],
            }),
            closed: fields.checkbox({ label: 'Closed on these days', defaultValue: false }),
            opens: fields.text({ label: 'Opens at (24-hour clock)', description: 'e.g. 10:00. Leave empty if closed.' }),
            closes: fields.text({ label: 'Closes at (24-hour clock)', description: 'e.g. 17:30 for 5:30 PM. Leave empty if closed.' }),
          }),
          {
            label: 'Showroom hours',
            description: 'One line per group of days with the same hours.',
            itemLabel: (p) => p.fields.label.value || 'Hours line',
          },
        ),
        social: fields.array(
          fields.object({
            platform: fields.select({
              label: 'Platform',
              options: [
                { label: 'Facebook', value: 'Facebook' },
                { label: 'Instagram', value: 'Instagram' },
                { label: 'Pinterest', value: 'Pinterest' },
                { label: 'YouTube', value: 'YouTube' },
              ],
              defaultValue: 'Facebook',
            }),
            url: fields.url({ label: 'Profile link' }),
          }),
          { label: 'Social media profiles', itemLabel: (p) => p.fields.platform.value },
        ),
        serviceAreas: fields.array(link('Service area'), {
          label: 'Service areas',
          description: 'Shown on the Visit page and in the footer.',
          itemLabel: (p) => p.fields.label.value || 'Area',
        }),
        shopUrl: fields.url({ label: 'Online shop link', description: 'Used by "Browse rugs" buttons.' }),
        headerCta: link('Header button', 'The red button that stays in the header on every page (and in the bar at the bottom of phones).'),
        mainMenu: fields.array(
          fields.object({
            label: fields.text({ label: 'Menu label' }),
            url: fields.text({
              label: 'Link address',
              description: 'Where the label itself goes. For an item with a dropdown this can be left empty.',
            }),
            children: fields.array(link('Dropdown link'), {
              label: 'Dropdown links (optional)',
              description: 'Add links here to turn this item into a dropdown.',
              itemLabel: (p) => p.fields.label.value || 'Dropdown link',
            }),
          }),
          {
            label: 'Main menu',
            description: 'Keep it to five or six items so it fits on one line.',
            itemLabel: (p) => p.fields.label.value || 'Menu item',
          },
        ),
        footerNote: fields.text({ label: 'Footer sentence', description: 'One short line about the business under the logo in the footer.', multiline: true }),
        formEndpoint: fields.text({
          label: 'Booking form destination (webhook URL)',
          description:
            'Where booking forms are sent, for example an n8n webhook URL. Leave empty while testing: the form will then tell visitors it is not connected yet and show the phone number.',
        }),
      },
    }),

    // ---------------------------------------------------------------- HOMEPAGE
    home: singleton({
      label: 'Homepage',
      path: 'src/content/home',
      format: { data: 'yaml' },
      schema: {
        seo: seo('homepage'),
        hero: fields.object(
          {
            kicker: fields.text({ label: 'Small line above the headline', description: 'e.g. Frankfort Avenue · Louisville' }),
            heading: fields.text({ label: 'Main headline (H1)', description: accentHelp }),
            subtitle: fields.text({ label: 'Line under the headline', multiline: true }),
            primary: link('Main button (red)'),
            secondary: link('Second button (outlined)'),
          },
          { label: 'Top of page (hero)', description: 'The 3D rug under the buttons is drawn automatically and is not edited here.' },
        ),
        marquee: fields.array(fields.text({ label: 'Phrase' }), {
          label: 'Moving text strip',
          description: 'Short phrases that scroll slowly across the page under the hero. Three to five work best.',
          itemLabel: (p) => p.value || 'Phrase',
        }),
        services: fields.object(
          {
            label: fields.text({ label: 'Small label above the heading' }),
            heading: fields.text({ label: 'Heading', description: accentHelp }),
            intro: fields.text({ label: 'Intro', multiline: true }),
            cards: fields.array(
              fields.object({
                title: fields.text({ label: 'Card title' }),
                tag: fields.text({ label: 'Red badge (optional)', description: 'e.g. 15% off. Leave empty for no badge.' }),
                text: fields.text({ label: 'Card text', multiline: true }),
                image: uploadImage('home', 'Photo'),
                imageAlt: altText('the photo'),
                link: link('Card link'),
              }),
              {
                label: 'Cards',
                description: 'Three cards side by side. The "Try Before You Buy" menu link jumps to this section.',
                itemLabel: (p) => p.fields.title.value || 'Card',
              },
            ),
          },
          { label: 'Three services' },
        ),
        cleaning: fields.object(
          {
            label: fields.text({ label: 'Small label above the heading' }),
            heading: fields.text({ label: 'Heading', description: accentHelp }),
            steps: fields.array(
              fields.object({
                title: fields.text({ label: 'Step name' }),
                text: fields.text({ label: 'One-sentence explanation', multiline: true }),
              }),
              {
                label: 'Cleaning steps (in order)',
                description: 'On computers the 3D rug unrolls a little more for each step as visitors scroll.',
                itemLabel: (p) => p.fields.title.value || 'Step',
              },
            ),
            primary: link('Booking button'),
            secondary: link('Link to the cleaning page'),
          },
          { label: 'Cleaning steps' },
        ),
        repairs: fields.object(
          {
            label: fields.text({ label: 'Small label above the heading' }),
            heading: fields.text({ label: 'Heading', description: accentHelp }),
            intro: fields.text({ label: 'Short line', multiline: true }),
            items: fields.array(link('Repair service'), {
              label: 'Repair services list',
              itemLabel: (p) => p.fields.label.value || 'Repair',
            }),
          },
          { label: 'Repairs' },
        ),
        reviews: fields.object(
          {
            label: fields.text({ label: 'Small label above the heading' }),
            heading: fields.text({ label: 'Heading', description: accentHelp }),
            ratingText: fields.text({ label: 'Rating line', description: 'Shown next to the stars, e.g. "Rated Excellent · 134 Google reviews". Keep it in line with Google.' }),
          },
          { label: 'Reviews', description: 'The reviews themselves are under Site-wide → Testimonials. This section only appears when at least one exists.' },
        ),
        visit: fields.object(
          {
            label: fields.text({ label: 'Small label above the heading' }),
            heading: fields.text({ label: 'Heading', description: accentHelp }),
            intro: fields.text({ label: 'Short line', multiline: true }),
          },
          { label: 'Map and visit', description: 'Address, hours and the map location come from Site settings.' },
        ),
      },
    }),

    // ------------------------------------------------------------ CLEANING PAGE
    cleaning: singleton({
      label: 'Cleaning page',
      path: 'src/content/cleaning',
      format: { data: 'yaml' },
      schema: {
        seo: seo('Rug Cleaning page'),
        heroImage: uploadImage('cleaning', 'Top photo'),
        heroAlt: altText('the top photo'),
        kicker: fields.text({ label: 'Small line above the headline', description: 'e.g. Hand-washed in Louisville' }),
        heading: fields.text({ label: 'Main headline (H1)', description: accentHelp }),
        lead: fields.text({ label: 'Line under the headline', multiline: true }),
        highlights: fields.array(fields.text({ label: 'Highlight' }), {
          label: 'Highlights',
          description: 'Four short selling points work best.',
          itemLabel: (p) => p.value || 'Highlight',
        }),
        form: fields.object(
          {
            heading: fields.text({ label: 'Form heading' }),
            intro: fields.text({ label: 'Line above the form', multiline: true }),
          },
          { label: 'Booking form' },
        ),
        process: fields.object(
          {
            heading: fields.text({ label: 'Heading', description: accentHelp }),
            blocks: fields.array(
              fields.object({
                heading: fields.text({ label: 'Sub-heading' }),
                body: paragraphs('Text'),
              }),
              { label: 'Explanation blocks', itemLabel: (p) => p.fields.heading.value || 'Block' },
            ),
            image: uploadImage('cleaning', 'Photo'),
            imageAlt: altText('the photo'),
            imagePosition,
          },
          { label: 'How we clean' },
        ),
        petNote: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            body: fields.text({ label: 'Text', multiline: true }),
          },
          { label: 'Pet stains note' },
        ),
        interval: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            body: fields.text({ label: 'Text', multiline: true }),
          },
          { label: 'How often to clean' },
        ),
      },
    }),

    // --------------------------------------------------------------- VISIT PAGE
    visit: singleton({
      label: 'Visit page',
      path: 'src/content/visit',
      format: { data: 'yaml' },
      schema: {
        seo: seo('Visit / Contact page'),
        kicker: fields.text({ label: 'Small line above the headline' }),
        heading: fields.text({ label: 'Main headline (H1)', description: accentHelp }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        image: uploadImage('visit', 'Showroom photo'),
        imageAlt: altText('the photo'),
        mapLabel: fields.text({ label: 'Map card: small label' }),
        hoursHeading: fields.text({ label: 'Map card: heading', description: 'Shown on the card over the map, above the hours. ' + accentHelp }),
        areasHeading: fields.text({ label: 'Service areas heading', description: accentHelp }),
        areasIntro: fields.text({ label: 'Service areas line', multiline: true }),
        form: fields.object(
          {
            heading: fields.text({ label: 'Form heading' }),
            intro: fields.text({ label: 'Line above the form', multiline: true }),
          },
          { label: 'Booking form' },
        ),
      },
    }),

    // ------------------------------------------------------------------- TEAM
    team: singleton({
      label: 'Team page (About)',
      path: 'src/content/team',
      format: { data: 'yaml' },
      schema: {
        seo: seo('Team page'),
        kicker: fields.text({ label: 'Small line above the headline' }),
        heading: fields.text({ label: 'Main headline (H1)', description: accentHelp }),
        story: fields.object(
          {
            heading: fields.text({ label: 'Heading', description: accentHelp }),
            body: paragraphs('Story'),
            image: uploadImage('team', 'Photo'),
            imageAlt: altText('the photo'),
          },
          { label: "Anabel's story" },
        ),
        membersHeading: fields.text({ label: 'Team heading', description: accentHelp }),
        members: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            bio: fields.text({ label: 'Short bio', multiline: true }),
            photo: uploadImage('team', 'Photo', 'A portrait (taller than wide) works best.'),
            photoAlt: altText('the photo'),
          }),
          { label: 'Team members', itemLabel: (p) => p.fields.name.value || 'Team member' },
        ),
      },
    }),

    // ------------------------------------------------------------------- TOUR
    tour: singleton({
      label: 'Showroom tour page',
      path: 'src/content/tour',
      format: { data: 'yaml' },
      schema: {
        seo: seo('Tour page'),
        kicker: fields.text({ label: 'Small line above the headline' }),
        heading: fields.text({ label: 'Main headline (H1)', description: accentHelp }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        tourUrl: fields.url({
          label: '360° tour embed link',
          description: 'The Google Street View (or similar) embed link. It only loads when a visitor presses "Start the tour".',
        }),
        image: uploadImage('tour', 'Showroom photo', 'Shown before the 360° tour is started.'),
        imageAlt: altText('the photo'),
      },
    }),

    // -------------------------------------------------------------- DESIGNERS
    designers: singleton({
      label: 'Designer program page',
      path: 'src/content/designers',
      format: { data: 'yaml' },
      schema: {
        seo: seo('Designer program page'),
        kicker: fields.text({ label: 'Small line above the headline' }),
        heading: fields.text({ label: 'Main headline (H1)', description: accentHelp }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        image: uploadImage('designers', 'Top photo'),
        imageAlt: altText('the top photo'),
        benefitsHeading: fields.text({ label: 'Benefits heading', description: accentHelp }),
        benefits: fields.array(fields.text({ label: 'Benefit', multiline: true }), {
          label: 'Benefits',
          itemLabel: (p) => p.value || 'Benefit',
        }),
        benefitsImage: uploadImage('designers', 'Benefits photo'),
        benefitsImageAlt: altText('the photo'),
        form: fields.object(
          {
            heading: fields.text({ label: 'Application heading', description: accentHelp }),
            intro: fields.text({ label: 'Intro', multiline: true }),
            documentsHelp: fields.text({ label: 'Document upload instructions', multiline: true }),
          },
          { label: 'Designer application form', description: 'Sent to the same destination as the booking form (Site settings).' },
        ),
      },
    }),

    // ------------------------------------------------------------- BLOG LISTING
    blog: singleton({
      label: 'Blog page (listing)',
      path: 'src/content/blog',
      format: { data: 'yaml' },
      schema: {
        seo: seo('blog listing page'),
        heading: fields.text({ label: 'Main headline (H1)', description: accentHelp }),
        intro: fields.text({ label: 'Intro', multiline: true }),
      },
    }),
  },

  collections: {
    // ------------------------------------------------------------------ REPAIRS
    repairs: collection({
      label: 'Repair pages',
      slugField: 'title',
      path: 'src/content/repairs/*',
      format: { contentField: 'body' },
      entryLayout: 'form',
      columns: ['title'],
      schema: {
        title: fields.slug({
          name: { label: 'Page name (H1)', description: 'e.g. Fringe Repair' },
          slug: {
            label: 'Page address',
            description: 'The end of the URL. Keep it identical to the old WordPress page, e.g. fringe-repair',
          },
        }),
        seoTitle: fields.text({ label: 'SEO title', description: 'Shown in Google results and the browser tab. Aim for 50–60 characters.' }),
        seoDescription: fields.text({ label: 'SEO description', description: 'Aim for 140–160 characters.', multiline: true }),
        heroImage: uploadImage('repairs', 'Top photo'),
        heroAlt: altText('the top photo'),
        intro: fields.text({ label: 'Intro (one or two sentences)', multiline: true }),
        included: fields.array(fields.text({ label: 'Item' }), {
          label: "What's included",
          description: 'Short, factual points. Only list what the shop really does.',
          itemLabel: (p) => p.value || 'Item',
        }),
        body: fields.markdoc({
          label: 'Main text',
          description: 'Use headings (H2) to break up longer text.',
          extension: 'md',
        }),
        formHeading: fields.text({ label: 'Booking form heading', defaultValue: 'Book now and get 15% off' }),
        formIntro: fields.text({ label: 'Line above the booking form', multiline: true }),
        ctaHeading: fields.text({ label: 'Call-to-action heading', description: 'The closing box that asks visitors to book or call.' }),
        ctaText: fields.text({ label: 'Call-to-action text', multiline: true }),
      },
    }),

    // ----------------------------------------------------------- SERVICE AREAS
    areas: collection({
      label: 'Service area pages',
      slugField: 'title',
      path: 'src/content/areas/*',
      format: { data: 'yaml' },
      columns: ['title'],
      schema: {
        title: fields.slug({
          name: { label: 'Page name', description: 'e.g. Rug Cleaning Indiana' },
          slug: { label: 'Page address', description: 'Keep identical to the old page, e.g. indiana-rug-cleaning-services' },
        }),
        seoTitle: fields.text({ label: 'SEO title' }),
        seoDescription: fields.text({ label: 'SEO description', multiline: true }),
        kicker: fields.text({ label: 'Small line above the headline' }),
        heading: fields.text({ label: 'Main headline (H1)', description: accentHelp }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        heroImage: uploadImage('areas', 'Top photo'),
        heroAlt: altText('the top photo'),
        citiesHeading: fields.text({ label: 'Towns heading', description: accentHelp }),
        cities: fields.array(fields.text({ label: 'Town' }), { label: 'Towns we serve', itemLabel: (p) => p.value || 'Town' }),
        formHeading: fields.text({ label: 'Booking form heading' }),
        formIntro: fields.text({ label: 'Line above the booking form', multiline: true }),
      },
    }),

    // --------------------------------------------------------------------- BLOG
    posts: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'pubDate'],
      schema: {
        title: fields.slug({
          name: { label: 'Title (H1)' },
          slug: { label: 'Post address', description: 'The end of the URL. Do not change it after publishing.' },
        }),
        description: fields.text({
          label: 'Summary',
          description: 'Shown on the blog listing and in Google results. Two sentences at most.',
          multiline: true,
        }),
        pubDate: fields.date({ label: 'Publish date', validation: { isRequired: true } }),
        heroImage: fields.image({
          label: 'Top photo',
          description: 'Shown on the post and the blog listing.',
          directory: 'src/assets/blog',
          publicPath: '../../assets/blog/',
        }),
        heroAlt: altText('the top photo'),
        content: fields.markdoc({ label: 'Post text', extension: 'md' }),
      },
    }),

    // ------------------------------------------------------------- TESTIMONIALS
    testimonials: collection({
      label: 'Testimonials',
      slugField: 'name',
      path: 'src/content/testimonials/*',
      format: { data: 'yaml' },
      columns: ['name'],
      schema: {
        name: fields.slug({ name: { label: 'Customer name', description: 'As the customer signed it, e.g. "Sarah M."' } }),
        quote: fields.text({
          label: 'Review text',
          description: 'Copy real reviews only, word for word, with the customer’s permission or from a public review site.',
          multiline: true,
        }),
        source: fields.text({ label: 'Where the review came from', description: 'e.g. Google' }),
        rating: fields.integer({ label: 'Stars (1–5)', defaultValue: 5, validation: { min: 1, max: 5 } }),
        date: fields.date({ label: 'Review date (optional)' }),
      },
    }),
  },
});
