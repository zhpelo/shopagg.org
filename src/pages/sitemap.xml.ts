import type { APIRoute } from 'astro';
import { developerDocumentation, usageDocumentation } from '../data/documentation';

const pages = [
  '/',
  '/capabilities',
  '/releases',
  '/usage',
  ...usageDocumentation.map((page) => `/usage/${page.slug}`),
  '/developer',
  ...developerDocumentation.map((page) => `/developer/${page.slug}`)
];

export const GET: APIRoute = () => {
  const urls = pages
    .map((path) => `  <url><loc>https://shopagg.org${path}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    }
  );
};
