/**
 * ARIA v2.5 Digital Twin Express Controller
 * Product: LOOK VISION v2.4
 */

import { Request, Response } from 'express';
import { DigitalTwinService } from './digitalTwin.service';

export class DigitalTwinController {
  public static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.query.userId as string) || (req.body?.userId as string) || 'guest_user';
      console.log(`[DigitalTwinController] GET /profile for userId=${userId}`);
      const profile = await DigitalTwinService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[DigitalTwinController] getProfile error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }

  public static async analyze(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.body?.userId as string) || (req.query.userId as string) || 'guest_user';
      console.log(`[DigitalTwinController] POST /analyze for userId=${userId}`);
      const profile = await DigitalTwinService.synthesizeTwin(userId);

      res.status(200).json({
        success: true,
        data: profile,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[DigitalTwinController] analyze error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }

  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.query.userId as string) || (req.body?.userId as string) || 'guest_user';
      console.log(`[DigitalTwinController] GET /history for userId=${userId}`);
      const history = await DigitalTwinService.getHistory(userId);

      res.status(200).json({
        success: true,
        data: history,
        total: history.length,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[DigitalTwinController] getHistory error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
