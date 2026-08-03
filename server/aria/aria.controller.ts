/**
 * ARIA v2.5 Express Controller
 * Product: LOOK VISION v2.4
 */

import { Request, Response } from 'express';
import { ariaBackendService } from './aria.service';

export class ARIAController {
  public static async handleQuery(req: Request, res: Response): Promise<void> {
    const requestId = (req as any).requestId || `req_aria_${Date.now()}`;

    try {
      if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
          success: false,
          error: 'Validation failed: Request body must be a JSON object'
        });
        return;
      }

      const { query, intent, targetModule, contextOverrides, options } = req.body;

      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        res.status(422).json({
          success: false,
          error: 'Validation failed',
          details: ['The "query" field is required and must be a non-empty string.']
        });
        return;
      }

      if (query.length > 5000) {
        res.status(422).json({
          success: false,
          error: 'Validation failed',
          details: ['The "query" field must not exceed 5000 characters.']
        });
        return;
      }

      const cleanQuery = query.trim();

      const result = await ariaBackendService.processQuery(
        {
          query: cleanQuery,
          intent: typeof intent === 'string' ? intent : 'GeneralQuery',
          targetModule: typeof targetModule === 'string' ? targetModule : undefined,
          contextOverrides: typeof contextOverrides === 'object' && contextOverrides !== null ? contextOverrides : {},
          options: typeof options === 'object' && options !== null ? options : {}
        },
        requestId
      );

      res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      console.error(`[ARIAController Error] Request ${requestId} failed:`, err);
      res.status(500).json({
        success: false,
        error: 'ARIA processing error',
        message: err.message || 'Internal server error processing ARIA request'
      });
    }
  }
}
