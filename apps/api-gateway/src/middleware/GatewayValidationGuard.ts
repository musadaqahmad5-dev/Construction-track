/**
 * EAOS Look Vision AI Fashion OS - API Gateway Security Firewall & Ingress Validation
 * Path: apps/api-gateway/src/middleware/GatewayValidationGuard.ts
 * Subsystem: Cognitive Prompt Injection Defense, Payload Sanitization & Schema Assertion Middleware
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// ============================================================================
// STRICT DOMAIN CONTRACTS & TYPE DEFINITIONS
// ============================================================================

export type ValidArchetype =
  | 'AVANT_GARDE'
  | 'MINIMALIST_LUXURY'
  | 'STREETWEAR_TECHNICAL'
  | 'HAUTE_COUTURE'
  | 'CYBER_HERITAGE';

export const ALLOWED_ARCHETYPES: readonly ValidArchetype[] = [
  'AVANT_GARDE',
  'MINIMALIST_LUXURY',
  'STREETWEAR_TECHNICAL',
  'HAUTE_COUTURE',
  'CYBER_HERITAGE'
] as const;

export interface OnboardingAnswers {
  preferredArchetype: ValidArchetype;
  lifestyleVibe: string;
  favoriteKeywords: string[];
}

export interface OnboardingRequestPayload {
  userId: string;
  onboardingAnswers: OnboardingAnswers;
}

export interface ValidationErrorDetail {
  field: string;
  issue: string;
}

export interface SecurityErrorResponse {
  error: string;
  code: string;
  traceId: string;
  timestamp: string;
  details?: ValidationErrorDetail[];
}

// Prompt Injection & Cognitive Attack Signatures (Case-Insensitive Patterns)
const MALICIOUS_PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions/gi,
  /system\s+override/gi,
  /developer\s+mode\s+activated/gi,
  /dan\s+mode/gi,
  /bypass\s+all\s+filters/gi,
  /disregard\s+(the\s+)?above/gi,
  /jailbreak/gi,
  /you\s+are\s+now\s+in\s+unrestricted\s+mode/gi,
  /reveal\s+(the\s+)?system\s+prompt/gi
];

// XSS & Script Tag Injection Patterns
const SCRIPT_INJECTION_PATTERNS: RegExp[] = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
];

// ============================================================================
// HELPER FUNCTIONS & SANITIZATION UTILITIES
// ============================================================================

/**
 * Extracts or generates a uniform trace ID for request lifecycle observability
 */
export function getOrCreateTraceId(req: Request): string {
  const incomingTrace = req.headers['x-trace-id'];
  if (typeof incomingTrace === 'string' && incomingTrace.trim()) {
    return incomingTrace.trim();
  }
  const generated = `trc_${crypto.randomBytes(8).toString('hex')}`;
  req.headers['x-trace-id'] = generated;
  return generated;
}

/**
 * Sanitizes a single string against HTML tags, script execution, and prompt injection signatures
 */
export function sanitizeStringValue(raw: string): string {
  if (typeof raw !== 'string') return '';

  let sanitized = raw;

  // 1. Strip script tags and HTML injection artifacts
  for (const pattern of SCRIPT_INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // 2. Neutralize model directive / prompt injection sequences
  for (const pattern of MALICIOUS_PROMPT_INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED_COGNITIVE_DIRECTIVE]');
  }

  return sanitized.trim();
}

/**
 * Recursively traverses objects and arrays to sanitize all contained string values
 */
export function recursiveSanitizePayload<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    return sanitizeStringValue(input) as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.map(item => recursiveSanitizePayload(item)) as unknown as T;
  }

  if (typeof input === 'object' && input.constructor === Object) {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      const sanitizedKey = sanitizeStringValue(key);
      sanitizedObj[sanitizedKey] = recursiveSanitizePayload(value);
    }
    return sanitizedObj as T;
  }

  return input;
}

// ============================================================================
// MIDDLEWARE IMPLEMENTATIONS
// ============================================================================

/**
 * Express Middleware: Recursively intercepts and purges malicious scripts and prompt injections
 */
export function sanitizeInboundPayload(req: Request, res: Response, next: NextFunction): void {
  const traceId = getOrCreateTraceId(req);
  res.setHeader('x-trace-id', traceId);

  try {
    if (req.body && typeof req.body === 'object') {
      req.body = recursiveSanitizePayload(req.body);
    }
    next();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[SECURITY GATEWAY ERROR] [Trace: ${traceId}] Failed to sanitize request payload: ${errorMsg}`);

    const errorResponse: SecurityErrorResponse = {
      error: 'Malformed or unparseable input payload.',
      code: 'INGRESS_SANITIZATION_FAILURE',
      traceId,
      timestamp: new Date().toISOString()
    };

    res.status(400).json(errorResponse);
  }
}

/**
 * Express Middleware: Validates inbound onboarding structure, keys, bounds, and archetype enums
 */
export function validateOnboardingSchema(req: Request, res: Response, next: NextFunction): void {
  const traceId = getOrCreateTraceId(req);
  res.setHeader('x-trace-id', traceId);

  try {
    const body = req.body;
    const errors: ValidationErrorDetail[] = [];

    // 1. Validate top-level object presence
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      const response: SecurityErrorResponse = {
        error: 'Invalid request body. Expected a JSON object.',
        code: 'SCHEMA_VALIDATION_ERROR',
        traceId,
        timestamp: new Date().toISOString(),
        details: [{ field: 'body', issue: 'Root payload must be an object' }]
      };
      res.status(422).json(response);
      return;
    }

    // 2. Reject extraneous unmapped top-level keys
    const allowedTopLevelKeys = new Set(['userId', 'onboardingAnswers']);
    const actualKeys = Object.keys(body);
    for (const key of actualKeys) {
      if (!allowedTopLevelKeys.has(key)) {
        errors.push({
          field: key,
          issue: `Unrecognized extraneous attribute '${key}' is prohibited.`
        });
      }
    }

    // 3. Validate 'userId' (Alphanumeric, max 128 characters)
    const { userId, onboardingAnswers } = body;

    if (!userId || typeof userId !== 'string') {
      errors.push({
        field: 'userId',
        issue: 'Attribute userId is required and must be a string.'
      });
    } else {
      const trimmedUserId = userId.trim();
      const userIdRegex = /^[a-zA-Z0-9_-]{1,128}$/;
      if (!userIdRegex.test(trimmedUserId)) {
        errors.push({
          field: 'userId',
          issue: 'Attribute userId must be alphanumeric (allowing hyphens and underscores) and between 1 and 128 characters.'
        });
      }
    }

    // 4. Validate 'onboardingAnswers' object
    if (!onboardingAnswers || typeof onboardingAnswers !== 'object' || Array.isArray(onboardingAnswers)) {
      errors.push({
        field: 'onboardingAnswers',
        issue: 'Attribute onboardingAnswers is required and must be a non-empty object.'
      });
    } else {
      // Reject extraneous unmapped keys inside onboardingAnswers
      const allowedAnswerKeys = new Set(['preferredArchetype', 'lifestyleVibe', 'favoriteKeywords']);
      for (const subKey of Object.keys(onboardingAnswers)) {
        if (!allowedAnswerKeys.has(subKey)) {
          errors.push({
            field: `onboardingAnswers.${subKey}`,
            issue: `Unrecognized attribute '${subKey}' inside onboardingAnswers is prohibited.`
          });
        }
      }

      // Validate 'preferredArchetype'
      const { preferredArchetype, lifestyleVibe, favoriteKeywords } = onboardingAnswers;

      if (!preferredArchetype || typeof preferredArchetype !== 'string') {
        errors.push({
          field: 'onboardingAnswers.preferredArchetype',
          issue: 'Attribute preferredArchetype is required and must be a string.'
        });
      } else if (!ALLOWED_ARCHETYPES.includes(preferredArchetype as ValidArchetype)) {
        errors.push({
          field: 'onboardingAnswers.preferredArchetype',
          issue: `Attribute preferredArchetype must be one of: ${ALLOWED_ARCHETYPES.join(', ')}.`
        });
      }

      // Validate 'lifestyleVibe'
      if (!lifestyleVibe || typeof lifestyleVibe !== 'string') {
        errors.push({
          field: 'onboardingAnswers.lifestyleVibe',
          issue: 'Attribute lifestyleVibe is required and must be a string.'
        });
      } else if (lifestyleVibe.trim().length === 0 || lifestyleVibe.length > 256) {
        errors.push({
          field: 'onboardingAnswers.lifestyleVibe',
          issue: 'Attribute lifestyleVibe must be between 1 and 256 characters.'
        });
      }

      // Validate 'favoriteKeywords'
      if (!Array.isArray(favoriteKeywords)) {
        errors.push({
          field: 'onboardingAnswers.favoriteKeywords',
          issue: 'Attribute favoriteKeywords is required and must be an array of strings.'
        });
      } else if (favoriteKeywords.length === 0) {
        errors.push({
          field: 'onboardingAnswers.favoriteKeywords',
          issue: 'Attribute favoriteKeywords must contain at least 1 keyword.'
        });
      } else if (favoriteKeywords.length > 32) {
        errors.push({
          field: 'onboardingAnswers.favoriteKeywords',
          issue: 'Attribute favoriteKeywords cannot exceed 32 keywords.'
        });
      } else {
        favoriteKeywords.forEach((kw, index) => {
          if (typeof kw !== 'string' || kw.trim().length === 0 || kw.length > 64) {
            errors.push({
              field: `onboardingAnswers.favoriteKeywords[${index}]`,
              issue: 'Each keyword must be a non-empty string with maximum length of 64 characters.'
            });
          }
        });
      }
    }

    // 5. Check if any validation errors accumulated
    if (errors.length > 0) {
      console.warn(
        `[SECURITY GATEWAY 422 REJECTION] [Trace: ${traceId}] Blocked invalid onboarding payload. Total issues: ${errors.length}`
      );

      const errorPayload: SecurityErrorResponse = {
        error: 'Unprocessable Entity: Ingress payload failed schema validation constraints.',
        code: 'VALIDATION_SCHEMA_UNPROCESSABLE',
        traceId,
        timestamp: new Date().toISOString(),
        details: errors
      };

      res.status(422).json(errorPayload);
      return;
    }

    next();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[SECURITY GATEWAY CRITICAL ERROR] [Trace: ${traceId}] Schema assertion crashed: ${errorMsg}`);

    const failureResponse: SecurityErrorResponse = {
      error: 'An internal error occurred while validating the request structure.',
      code: 'GATEWAY_INTERNAL_VALIDATION_ERROR',
      traceId,
      timestamp: new Date().toISOString()
    };

    res.status(500).json(failureResponse);
  }
}
