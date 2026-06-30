// Rate limiting backed by Upstash Redis.
//
// This used to be an in-memory limiter (counters in a Map, scoped to a
// single warm serverless instance). That worked but had two real gaps in
// production: state reset on every redeploy/cold start, and no shared
// counter across multiple concurrent Vercel instances under load — meaning
// the effective limit was "limit * number of warm instances" rather than a
// hard global limit. Redis fixes both: one authoritative counter, shared
// across every instance, persisted independent of deploys.
//
// The public API (`checkRateLimit`, `getClientIp`, `rateLimitResponse`) is
// unchanged from the in-memory version on purpose, so nothing calling into
// this module (auth.ts, /api/lookup, etc.) needed to change.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitResult {
  success: boolean;
  /** requests remaining in the current window */
  remaining: number;
  /** unix ms timestamp when the window resets */
  resetAt: number;
}

// NOTE: Vercel's Upstash integration names these vars KV_REST_API_URL /
// KV_REST_API_TOKEN, not the UPSTASH_REDIS_REST_URL / _TOKEN names that
// Redis.fromEnv() looks for by default — so we construct the client
// explicitly rather than relying on fromEnv() and silently breaking.
if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error(
    "Missing KV_REST_API_URL / KV_REST_API_TOKEN env vars. " +
      "Make sure the Upstash Redis integration is connected to this " +
      "project in Vercel (Storage tab) and that you've pulled the latest " +
      "env vars with `vercel env pull`."
  );
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Upstash's Ratelimit needs a fixed limit/window per instance, but our
// call sites pass different limit/window combos per route (e.g. lookup
// vs. login-by-email vs. login-by-IP). Cache one Ratelimit instance per
// distinct (limit, windowMs) pair instead of constructing a new one on
// every request.
const limiterCache = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  let limiter = limiterCache.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(limit, `${windowMs} ms`),
      // Don't prefix with the app name here — our own `key` argument
      // already namespaces by route (e.g. "lookup:", "login:email:").
      analytics: false,
    });
    limiterCache.set(cacheKey, limiter);
  }
  return limiter;
}

/**
 * Fixed-window rate limiter, Redis-backed.
 *
 * @param key Unique identifier for the thing being limited, e.g.
 *   `lookup:${ip}` or `login:email:${email}`. Namespace your keys per
 *   route so different endpoints don't share a counter.
 * @param limit Max requests allowed per window.
 * @param windowMs Window length in milliseconds.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const limiter = getLimiter(limit, windowMs);
  const { success, remaining, reset } = await limiter.limit(key);
  return { success, remaining, resetAt: reset };
}

/**
 * Best-effort client IP extraction behind Vercel's proxy.
 * Falls back to a constant string if nothing is present (e.g. local dev),
 * which means local requests all share one bucket — fine for dev.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/** Standard 429 JSON response with a Retry-After header. */
export function rateLimitResponse(result: RateLimitResult) {
  const retryAfterSeconds = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again shortly." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}