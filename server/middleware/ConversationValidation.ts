import { Request, Response, NextFunction } from 'express';
import { StylistIntent } from '../../src/ai/stylist';

const VALID_INTENTS: StylistIntent[] = [
  'OUTFIT',
  'WARDROBE',
  'SHOPPING',
  'TREND',
  'STYLE_ADVICE',
  'COLOR',
  'TRY_ON',
  'IMAGE',
  'VIDEO',
  'COMMUNITY',
  'MARKETPLACE',
  'GENERAL',
  'UNKNOWN'
];

export function validateChatInput(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;

  if (!body || typeof body !== 'object') {
    res.status(400).json({
      success: false,
      error: 'Invalid payload: body must be a JSON object.',
      timestamp: new Date().toISOString()
    });
    return;
  }

  const { prompt, overrideIntent, sessionId, budget } = body;

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: 'Validation failed: prompt is required and cannot be empty.',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (prompt.length > 4000) {
    res.status(400).json({
      success: false,
      error: 'Validation failed: prompt exceeds maximum length of 4000 characters.',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (overrideIntent && !VALID_INTENTS.includes(overrideIntent as StylistIntent)) {
    res.status(400).json({
      success: false,
      error: `Validation failed: overrideIntent must be one of ${VALID_INTENTS.join(', ')}.`,
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (sessionId && (typeof sessionId !== 'string' || sessionId.trim().length > 128)) {
    res.status(400).json({
      success: false,
      error: 'Validation failed: sessionId must be a string under 128 characters.',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (budget !== undefined && (typeof budget !== 'number' || isNaN(budget) || budget < 0)) {
    res.status(400).json({
      success: false,
      error: 'Validation failed: budget must be a positive number.',
      timestamp: new Date().toISOString()
    });
    return;
  }

  next();
}

export function validateSessionInput(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;
  if (body && body.sessionId && (typeof body.sessionId !== 'string' || body.sessionId.length > 128)) {
    res.status(400).json({
      success: false,
      error: 'Validation failed: sessionId must be a valid string.',
      timestamp: new Date().toISOString()
    });
    return;
  }
  next();
}

export function validateMemoryUpdate(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;

  if (!body || typeof body !== 'object') {
    res.status(400).json({
      success: false,
      error: 'Invalid payload: body must be a JSON object.',
      timestamp: new Date().toISOString()
    });
    return;
  }

  const { memoryKey, memoryValue } = body;

  if (typeof memoryKey !== 'string' || memoryKey.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: 'Validation failed: memoryKey is required and cannot be empty.',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (memoryValue === undefined) {
    res.status(400).json({
      success: false,
      error: 'Validation failed: memoryValue must be provided.',
      timestamp: new Date().toISOString()
    });
    return;
  }

  next();
}

export function validateHistoryQuery(req: Request, res: Response, next: NextFunction): void {
  const limitParam = req.query.limit;

  if (limitParam !== undefined) {
    const limit = Number(limitParam);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      res.status(400).json({
        success: false,
        error: 'Validation failed: limit parameter must be an integer between 1 and 100.',
        timestamp: new Date().toISOString()
      });
      return;
    }
  }

  next();
}
