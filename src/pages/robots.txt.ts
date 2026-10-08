import type { APIRoute } from 'astro';

// robots.txt. Test deployments on Vercel block all crawling so they never compete
// with the live site; set SITE_INDEXING=true in Vercel when this becomes the real site.
export const GET: APIRoute = ({ site }) => {
  const isTestDeploy = !!process.env.VERCEL && process.env.SITE_INDEXING !== 'true';
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = isTestDeploy
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /keystatic/\nDisallow: /api/\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
