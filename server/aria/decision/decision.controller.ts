/**
 * ARIA v2.5 Decision Intelligence Controller
 * Product: LOOK VISION v2.4
 */

import { Request, Response } from 'express';
import { decisionService } from './decision.service';

export class DecisionController {
  /**
   * POST /api/aria/decision/recommend
   */
  public static async recommend(req: Request, res: Response): Promise<void> {
    const requestId = (req as any).requestId || `req_dec_${Date.now()}`;

    try {
      if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
          success: false,
          error: 'Validation failed: Request body must be a JSON object'
        });
        return;
      }

      const { userId, occasion, weatherContext, targetCategory, userPrompt, preferredPalette } = req.body;
      const activeUserId = typeof userId === 'string' && userId.trim().length > 0 ? userId : 'guest_user';

      const recommendation = await decisionService.generateRecommendation(activeUserId, {
        occasion,
        weatherContext,
        targetCategory,
        userPrompt,
        preferredPalette
      });

      res.json({
        success: true,
        data: recommendation
      });
    } catch (err: any) {
      console.error(`[DecisionController Error] Request ${requestId} recommend failed:`, err);
      res.status(500).json({
        success: false,
        error: 'ARIA Decision Intelligence generation error',
        message: err.message || 'Internal server error generating fashion recommendation'
      });
    }
  }

  /**
   * GET /api/aria/decision/history
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = typeof req.query.userId === 'string' ? req.query.userId : 'guest_user';
      const history = await decisionService.getHistory(userId);

      res.json({
        success: true,
        data: history
      });
    } catch (err: any) {
      console.error('[DecisionController Error] getHistory failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Decision Intelligence history error',
        message: err.message || 'Internal server error fetching decision history'
      });
    }
  }

  /**
   * DELETE /api/aria/decision/history/:id
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
          error: 'Missing required recommendation ID parameter'
        });
        return;
      }

      const success = await decisionService.deleteHistoryItem(userId, id);

      res.json({
        success,
        message: success ? 'Recommendation deleted successfully' : 'Recommendation not found'
      });
    } catch (err: any) {
      console.error('[DecisionController Error] deleteHistoryItem failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Decision Intelligence deletion error',
        message: err.message || 'Internal server error deleting decision item'
      });
    }
  }
}
