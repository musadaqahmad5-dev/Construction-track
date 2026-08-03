/**
 * ARIA v2.5 Simulation Express Controller
 * Product: LOOK VISION v2.4
 */

import { Request, Response } from 'express';
import { SimulationService } from './simulation.service';

export class SimulationController {
  public static async runSimulation(req: Request, res: Response): Promise<void> {
    try {
      const rawUser = req.body?.userId || req.query.userId;
      const userId = typeof rawUser === 'string' ? rawUser : 'guest_user';
      const scenarioType = (req.body?.scenarioType as string) || 'capsule_conversion';
      const parameters = req.body?.parameters || {};
      const customTitle = req.body?.customTitle;

      console.log(`[SimulationController] POST /run for userId=${userId}, type=${scenarioType}`);
      const report = await SimulationService.runSimulation(userId, scenarioType, parameters, customTitle);

      res.status(200).json({
        success: true,
        data: report,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[SimulationController] runSimulation error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }

  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const rawUser = req.query.userId || req.body?.userId;
      const userId = typeof rawUser === 'string' ? rawUser : 'guest_user';
      console.log(`[SimulationController] GET /history for userId=${userId}`);
      const history = await SimulationService.getHistory(userId);

      res.status(200).json({
        success: true,
        data: history,
        total: history.length,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[SimulationController] getHistory error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }

  public static async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (typeof req.query.userId === 'string' ? req.query.userId : 'guest_user');
      const rawId = req.params.id;
      const id = typeof rawId === 'string' ? rawId : Array.isArray(rawId) ? rawId[0] : '';
      console.log(`[SimulationController] GET /report/${id} for userId=${userId}`);
      const report = await SimulationService.getReportById(userId, id);

      if (!report) {
        res.status(404).json({
          success: false,
          error: 'Simulation report not found',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: report,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[SimulationController] getReportById error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
