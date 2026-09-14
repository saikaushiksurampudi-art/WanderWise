import express, { Express } from 'express';
import { registerApiRoutes } from './routes.js';
import { securityHeaders } from './security.js';

/**
 * Builds the API application. Shared by the local dev/prod server (server.ts)
 * and the Vercel serverless entry point (api/[...path].ts) so middleware
 * configuration can never drift between the two environments.
 */
export function createApiApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(securityHeaders);
  app.use(
    express.json({
      limit: '256kb',
      // Drops prototype-polluting keys before they reach any handler.
      reviver: (key, value) => (key === '__proto__' || key === 'constructor' ? undefined : value)
    })
  );

  registerApiRoutes(app);
  return app;
}
