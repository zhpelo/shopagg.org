import releases from '../../../data/releases.json';

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify({
    schema: 2,
    product: 'shopagg-cms',
    source: {
      provider: 'github',
      repository: 'zhpelo/shopagg-b2b-website',
      url: 'https://github.com/zhpelo/shopagg-b2b-website/releases'
    },
    latest: releases[0].version,
    releases
  }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
