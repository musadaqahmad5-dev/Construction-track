/**
 * ARIA v2.5 Creative Intelligence Express Controller
 * Product: LOOK VISION v2.4
 */

import { Request, Response } from 'express';
import { creativeService } from './creative.service';

export class CreativeController {
  /**
   * POST /api/aria/creative/generate
   */
  public static async generate(req: Request, res: Response): Promise<void> {
    const requestId = (req as any).requestId || `req_crt_${Date.now()}`;

    try {
      if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
          success: false,
          error: 'Validation failed: Request body must be a JSON object'
        });
        return;
      }

      const { userId, category, themePrompt, targetSeason, desiredPieceCount } = req.body;
      const activeUserId = typeof userId === 'string' && userId.trim().length > 0 ? userId : 'guest_user';

      const concept = await creativeService.generateConcept(activeUserId, {
        category,
        themePrompt,
        targetSeason,
        desiredPieceCount
      });

      res.json({
        success: true,
        data: concept
      });
    } catch (err: any) {
      console.error(`[CreativeController Error] Request ${requestId} generate failed:`, err);
      res.status(500).json({
        success: false,
        error: 'ARIA Creative Intelligence generation error',
        message: err.message || 'Internal server error generating creative concept'
      });
    }
  }

  /**
   * GET /api/aria/creative/history
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const qUser = req.query.userId;
      const userId = typeof qUser === 'string' ? qUser : Array.isArray(qUser) ? String(qUser[0]) : 'guest_user';
      const history = await creativeService.getHistory(userId);

      res.json({
        success: true,
        data: history
      });
    } catch (err: any) {
      console.error('[CreativeController Error] getHistory failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Creative Intelligence history error',
        message: err.message || 'Internal server error fetching creative history'
      });
    }
  }

  /**
   * DELETE /api/aria/creative/history/:id
   */
  public static async deleteHistoryItem(req: Request, res: Response): Promise<void> {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      const qUser = req.query.userId;
      const userId = typeof qUser === 'string' ? qUser : Array.isArray(qUser) ? String(qUser[0]) : 'guest_user';

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Missing required creative ID parameter'
        });
        return;
      }

      const success = await creativeService.deleteHistoryItem(userId, id);

      res.json({
        success,
        message: success ? 'Creative concept deleted successfully' : 'Concept not found'
      });
    } catch (err: any) {
      console.error('[CreativeController Error] deleteHistoryItem failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Creative Intelligence deletion error',
        message: err.message || 'Internal server error deleting creative item'
      });
    }
  }
}
