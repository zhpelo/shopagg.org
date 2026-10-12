import releases from '../../../data/releases.json';

export const prerender = true;

export function GET() {
  const latest = releases[0];
  return new Response(JSON.stringify({ schema: 1, product: 'lighthouse-cms', ...latest }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
