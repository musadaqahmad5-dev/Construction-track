/**
 * ARIA v2.5 Visual Intelligence Express Controller
 * Product: LOOK VISION v2.4
 */

import { Request, Response } from 'express';
import { visionService } from './vision.service';

export class VisionController {
  /**
   * POST /api/aria/vision/analyze
   */
  public static async analyze(req: Request, res: Response): Promise<void> {
    const requestId = (req as any).requestId || `req_vis_${Date.now()}`;

    try {
      if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
          success: false,
          error: 'Validation failed: Request body must be a JSON object'
        });
        return;
      }

      const { userId, imageUrl, imageName, targetContext } = req.body;
      const activeUserId = typeof userId === 'string' && userId.trim().length > 0 ? userId : 'guest_user';

      const analysis = await visionService.analyzeImage(activeUserId, {
        imageUrl,
        imageName,
        targetContext
      });

      res.json({
        success: true,
        data: analysis
      });
    } catch (err: any) {
      console.error(`[VisionController Error] Request ${requestId} analyze failed:`, err);
      res.status(500).json({
        success: false,
        error: 'ARIA Visual Intelligence analysis error',
        message: err.message || 'Internal server error analyzing image'
      });
    }
  }

  /**
   * GET /api/aria/vision/history
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const qUser = req.query.userId;
      const userId = typeof qUser === 'string' ? qUser : Array.isArray(qUser) ? String(qUser[0]) : 'guest_user';

      const history = await visionService.getHistory(userId);

      res.json({
        success: true,
        data: history
      });
    } catch (err: any) {
      console.error('[VisionController Error] getHistory failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Visual Intelligence history error',
        message: err.message || 'Internal server error fetching vision history'
      });
    }
  }

  /**
   * DELETE /api/aria/vision/history/:id
   */
  public static async deleteAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      const qUser = req.query.userId;
      const userId = typeof qUser === 'string' ? qUser : Array.isArray(qUser) ? String(qUser[0]) : 'guest_user';

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Missing required analysis ID parameter'
        });
        return;
      }

      const success = await visionService.deleteAnalysis(userId, id);

      res.json({
        success,
        message: success ? 'Vision analysis deleted successfully' : 'Analysis not found'
      });
    } catch (err: any) {
      console.error('[VisionController Error] deleteAnalysis failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Visual Intelligence deletion error',
        message: err.message || 'Internal server error deleting vision analysis'
      });
    }
  }
}
