import docs from '../../../data/docs.json';

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify(docs, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
