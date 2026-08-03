import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  tokens: number;
  lastReset: number;
}

export class RateLimiter {
  private store = new Map<string, RateLimitStore>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 30) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    setInterval(() => {
      const now = Date.now();
      this.store.forEach((val, key) => {
        if (now - val.lastReset > this.windowMs * 2) {
          this.store.delete(key);
        }
      });
    }, this.windowMs).unref();
  }

  public check(key: string): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    let entry = this.store.get(key);

    if (!entry || now - entry.lastReset > this.windowMs) {
      entry = { tokens: this.maxRequests, lastReset: now };
      this.store.set(key, entry);
    }

    if (entry.tokens > 0) {
      entry.tokens -= 1;
      return {
        allowed: true,
        remaining: entry.tokens,
        resetMs: this.windowMs - (now - entry.lastReset)
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetMs: this.windowMs - (now - entry.lastReset)
    };
  }
}

const defaultRateLimiter = new RateLimiter(60000, 30);

export function createRateLimitMiddleware(limiter: RateLimiter = defaultRateLimiter) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userId = (req as any).user?.uid || req.ip || 'anonymous';
    const key = `stylist_rl_${userId}`;

    const result = limiter.check(key);

    res.setHeader('X-RateLimit-Limit', 30);
    res.setHeader('X-RateLimit-Remaining', result.remaining);

    if (!result.allowed) {
      const retryAfterSeconds = Math.ceil(result.resetMs / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      res.status(429).json({
        success: false,
        error: 'Too Many Requests: AI Stylist API rate limit exceeded. Please try again shortly.',
        retryAfterSeconds,
        timestamp: new Date().toISOString()
      });
      return;
    }

    next();
  };
}

export const rateLimitMiddleware = createRateLimitMiddleware();
