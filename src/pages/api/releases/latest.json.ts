import releases from '../../../data/releases.json';

export const prerender = true;

export function GET() {
  const latest = releases[0];
  return new Response(JSON.stringify({
    schema: 2,
    product: 'shopagg-cms',
    source: {
      provider: 'github',
      repository: 'zhpelo/shopagg-b2b-website',
      url: latest.release_url
    },
    ...latest
  }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
