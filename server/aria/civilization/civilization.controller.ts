/**
 * ARIA v2.5 Civilization Memory Controller
 * Product: LOOK VISION v2.4
 */

import { Request, Response } from 'express';
import { CivilizationService } from './civilization.service';

export class CivilizationController {
  public static async getGraph(req: Request, res: Response): Promise<void> {
    try {
      const rawUser = req.query.userId || req.body?.userId;
      const userId = typeof rawUser === 'string' ? rawUser : 'guest_user';
      const graph = await CivilizationService.getKnowledgeGraph(userId);
      res.json({ success: true, graph });
    } catch (err: any) {
      console.error('[CivilizationController] getGraph error:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to fetch graph' });
    }
  }

  public static async indexMemory(req: Request, res: Response): Promise<void> {
    try {
      const rawUser = req.body?.userId || req.query.userId;
      const userId = typeof rawUser === 'string' ? rawUser : 'guest_user';
      const result = await CivilizationService.indexCivilizationMemory(userId);
      res.json({ success: true, result });
    } catch (err: any) {
      console.error('[CivilizationController] indexMemory error:', err);
      res.status(500).json({ success: false, error: err.message || 'Indexing failed' });
    }
  }

  public static async searchMemory(req: Request, res: Response): Promise<void> {
    try {
      const rawUser = req.query.userId || req.body?.userId;
      const userId = typeof rawUser === 'string' ? rawUser : 'guest_user';
      const query = (typeof req.query.query === 'string' ? req.query.query : '') || '';
      const domain = typeof req.query.domain === 'string' ? req.query.domain : undefined;

      const results = await CivilizationService.searchMemory(userId, query, domain);
      res.json({ success: true, results });
    } catch (err: any) {
      console.error('[CivilizationController] searchMemory error:', err);
      res.status(500).json({ success: false, error: err.message || 'Search failed' });
    }
  }

  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const rawUser = req.query.userId || req.body?.userId;
      const userId = typeof rawUser === 'string' ? rawUser : 'guest_user';
      const history = await CivilizationService.getHistory(userId);
      res.json({ success: true, history });
    } catch (err: any) {
      console.error('[CivilizationController] getHistory error:', err);
      res.status(500).json({ success: false, error: err.message || 'History retrieval failed' });
    }
  }
}
