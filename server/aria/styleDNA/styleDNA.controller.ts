/**
 * ARIA v2.5 Style DNA Controller
 * Product: LOOK VISION v2.4
 */

import { Request, Response } from 'express';
import { styleDNAService } from './styleDNA.service';

export class StyleDNAController {
  /**
   * GET /api/aria/style-dna/profile
   */
  public static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = typeof req.query.userId === 'string' ? req.query.userId : 'guest_user';
      const profile = await styleDNAService.getProfile(userId);

      res.json({
        success: true,
        data: profile
      });
    } catch (err: any) {
      console.error('[StyleDNAController Error] getProfile failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Style DNA fetch error',
        message: err.message || 'Internal server error retrieving Style DNA profile'
      });
    }
  }

  /**
   * POST /api/aria/style-dna/update
   */
  public static async updateProfile(req: Request, res: Response): Promise<void> {
    const requestId = (req as any).requestId || `req_sdna_${Date.now()}`;

    try {
      if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
          success: false,
          error: 'Validation failed: Request body must be a JSON object'
        });
        return;
      }

      const { userId, identityName, colorProfile, silhouetteProfile, materialProfile, brandAffinity, lifestyleAlignment, occasionPreferences, metadata } = req.body;

      const activeUserId = typeof userId === 'string' && userId.trim().length > 0 ? userId : 'guest_user';

      const result = await styleDNAService.updateProfile(activeUserId, {
        identityName,
        colorProfile,
        silhouetteProfile,
        materialProfile,
        brandAffinity,
        lifestyleAlignment,
        occasionPreferences,
        metadata
      });

      res.json({
        success: true,
        data: result.profile,
        snapshot: result.snapshot
      });
    } catch (err: any) {
      console.error(`[StyleDNAController Error] Request ${requestId} update failed:`, err);
      res.status(500).json({
        success: false,
        error: 'ARIA Style DNA update error',
        message: err.message || 'Internal server error updating Style DNA profile'
      });
    }
  }

  /**
   * GET /api/aria/style-dna/history
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = typeof req.query.userId === 'string' ? req.query.userId : 'guest_user';
      const history = await styleDNAService.getHistory(userId);

      res.json({
        success: true,
        data: history
      });
    } catch (err: any) {
      console.error('[StyleDNAController Error] getHistory failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Style DNA history error',
        message: err.message || 'Internal server error retrieving Style DNA history'
      });
    }
  }
}
