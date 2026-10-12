import project from '../../data/project.json';

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify(project, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
