import releases from '../../../data/releases.json';

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify({ schema: 1, product: 'lighthouse-cms', releases }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
