import capabilities from '../../data/capabilities.json';

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify(capabilities, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
