import fs from 'node:fs';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

const usePayload = (import.meta.env.CMS ?? process.env.CMS) === 'payload';

// Payload test (CMS=payload): posts come from the file scripts/payload-sync.mjs downloads,
// with their HTML already rendered by Payload. Photo paths are relative to that file.
const PAYLOAD_FILE = 'src/generated/payload-content.json';
const payloadPosts: Loader = {
  name: 'payload-posts',
  load: async ({ store, parseData, generateDigest }) => {
    store.clear();
    const { posts } = JSON.parse(fs.readFileSync(PAYLOAD_FILE, 'utf8'));
    for (const { slug, entry } of posts as { slug: string; entry: Record<string, any> }[]) {
      const { contentHtml, slug: _slug, ...rest } = entry;
      // Empty Payload fields are null; the schema expects them left out
      const fields = Object.fromEntries(Object.entries(rest).filter(([, v]) => v != null));
      const data = await parseData({ id: slug, data: fields, filePath: PAYLOAD_FILE });
      store.set({ id: slug, data, filePath: PAYLOAD_FILE, rendered: { html: contentHtml ?? '' }, digest: generateDigest(entry) });
    }
  },
};

// Blog posts: Markdown files in src/content/posts/, edited through Keystatic (Blog → Blog posts).
// This schema is Astro's safety check: a post with a missing title or a bad date fails the build.
const posts = defineCollection({
  loader: usePayload ? payloadPosts : glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().default(''),
      pubDate: z.coerce.date(),
      heroImage: image().optional(),
      heroAlt: z.string().default(''),
      // Editor-controlled schema (see structuredData() in keystatic.config.ts); Payload sends empty fields as null
      structuredData: z
        .object({
          faq: z.array(z.object({ question: z.string().nullish(), answer: z.string().nullish() })).nullish(),
          type: z.string().nullish(),
          off: z.boolean().nullish(),
          custom: z.string().nullish(),
        })
        .nullish(),
    }),
});

export const collections = { posts };
