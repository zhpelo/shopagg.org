import compatibility from '../../data/compatibility.json';

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify(compatibility, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
