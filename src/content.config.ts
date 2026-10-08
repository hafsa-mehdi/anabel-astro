import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog posts: Markdown files in src/content/posts/, edited through Keystatic (Blog → Blog posts).
// This schema is Astro's safety check: a post with a missing title or a bad date fails the build.
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().default(''),
      pubDate: z.coerce.date(),
      heroImage: image().optional(),
      heroAlt: z.string().default(''),
    }),
});

export const collections = { posts };
