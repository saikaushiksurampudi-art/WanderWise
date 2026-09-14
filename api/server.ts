import type { IncomingMessage, ServerResponse } from 'http';
import { createApiApp } from '../server/app.js';

// Built once per warm serverless instance rather than per request.
const app = createApiApp();

/**
 * Single Vercel serverless entry point for the whole REST API.
 *
 * vercel.json rewrites every /api/* request here and passes the original path
 * in the `__p` query parameter. Vercel's nested catch-all routing only matched
 * a single path segment for this project type, so the path is reconstructed
 * explicitly before Express sees it — the routes are registered with their full
 * '/api/...' paths and must match exactly.
 */
export default function handler(req: IncomingMessage, res: ServerResponse) {
  const parsed = new URL(req.url ?? '/', 'http://localhost');
  const originalPath = parsed.searchParams.get('__p');

  if (originalPath !== null) {
    parsed.searchParams.delete('__p');
    const query = parsed.searchParams.toString();
    req.url = `/api/${originalPath}${query ? `?${query}` : ''}`;
  } else if (!parsed.pathname.startsWith('/api')) {
    req.url = `/api${parsed.pathname}${parsed.search}`;
  }

  return (app as unknown as (rq: IncomingMessage, rs: ServerResponse) => void)(req, res);
}
