import { NextFunction, Request, Response } from 'express';
import type { InterestCategory } from '../src/types';

/**
 * Response headers hardening. The production policy is strict; development
 * relaxes script/connect rules because Vite's HMR client needs inline scripts
 * and a websocket back to the dev server.
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  const isProd = process.env.NODE_ENV === 'production';

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

  const csp = [
    "default-src 'self'",
    isProd ? "script-src 'self'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.tile.openstreetmap.org https://server.arcgisonline.com",
    isProd ? "connect-src 'self'" : "connect-src 'self' ws: wss:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  res.setHeader('Content-Security-Policy', csp);
  next();
}

/**
 * Minimal in-memory fixed-window limiter. The AI-backed routes call a metered
 * upstream API with no user auth in front of them, so an unthrottled endpoint
 * is both a cost and an availability risk.
 */
export function rateLimit(options: { windowMs: number; max: number; message?: string }) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + options.windowMs });
    } else {
      entry.count += 1;
      if (entry.count > options.max) {
        res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
        res.status(429).json({
          success: false,
          error: options.message || 'Too many requests. Please wait a moment and try again.'
        });
        return;
      }
    }

    // Opportunistic cleanup so the map cannot grow unbounded.
    if (hits.size > 5000) {
      for (const [k, v] of hits) {
        if (now > v.resetAt) hits.delete(k);
      }
    }

    next();
  };
}

/** Trims and hard-caps a client-supplied string; returns '' for non-strings. */
export function safeString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

/** Returns a finite number within [min, max], or null when the input is unusable. */
export function safeNumber(value: unknown, min: number, max: number): number | null {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

export const INTEREST_CATEGORIES: InterestCategory[] = [
  'Food & Dining',
  'Museums & Culture',
  'Nature & Outdoors',
  'Nightlife & Bars',
  'Shopping & Fashion',
  'Adventure & Thrills',
  'Sports & Activities',
  'Family & Kids',
  'Relaxation & Wellness',
  'History & Heritage',
  'Photography & Views'
];

export function isInterestCategory(value: unknown): value is InterestCategory {
  return typeof value === 'string' && (INTEREST_CATEGORIES as string[]).includes(value);
}

/**
 * Recomputes a trip total from its own line items. The client must never be the
 * source of truth for an amount charged.
 */
export function computeTripTotal(costs: any): number | null {
  if (!costs || typeof costs !== 'object') return null;
  const parts = ['accommodation', 'activities', 'transportation', 'foodAndMisc', 'taxesAndService'];
  let total = 0;
  for (const part of parts) {
    const n = safeNumber(costs[part], 0, 1_000_000);
    if (n === null) return null;
    total += n;
  }
  if (total <= 0) return null;
  return Math.round(total);
}

/** Generic client-facing error; the detail stays in the server log. */
export function failRequest(res: Response, status: number, clientMessage: string, logLabel: string, error: unknown) {
  console.error(`[${logLabel}]`, error instanceof Error ? error.message : error);
  res.status(status).json({ success: false, error: clientMessage });
}
