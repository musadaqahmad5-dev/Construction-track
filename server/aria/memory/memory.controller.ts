/**
 * ARIA v2.5 Memory Controller
 * Product: LOOK VISION v2.4
 */

import { Request, Response } from 'express';
import { ariaMemoryService } from './memory.service';

export class MemoryController {
  /**
   * POST /api/aria/memory/update
   */
  public static async updateMemory(req: Request, res: Response): Promise<void> {
    const requestId = (req as any).requestId || `req_mem_${Date.now()}`;

    try {
      if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
          success: false,
          error: 'Validation failed: Request body must be a JSON object'
        });
        return;
      }

      const { userId, category, subcategory, value, confidence, source, level, metadata } = req.body;

      if (!category || typeof category !== 'string' || category.trim().length === 0) {
        res.status(422).json({
          success: false,
          error: 'Validation failed',
          details: ['The "category" field is required and must be a non-empty string.']
        });
        return;
      }

      if (value === undefined || value === null) {
        res.status(422).json({
          success: false,
          error: 'Validation failed',
          details: ['The "value" field is required.']
        });
        return;
      }

      const activeUserId = typeof userId === 'string' && userId.trim().length > 0 ? userId : 'guest_user';

      const result = await ariaMemoryService.updateMemory(activeUserId, {
        category: category.trim(),
        subcategory: typeof subcategory === 'string' ? subcategory.trim() : undefined,
        value,
        confidence: typeof confidence === 'number' ? confidence : undefined,
        source: typeof source === 'string' ? source : undefined,
        level: typeof level === 'string' ? level : undefined,
        metadata: typeof metadata === 'object' && metadata !== null ? metadata : {}
      });

      res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      console.error(`[MemoryController Error] Request ${requestId} failed:`, err);
      res.status(500).json({
        success: false,
        error: 'ARIA Memory processing error',
        message: err.message || 'Internal server error processing memory update'
      });
    }
  }

  /**
   * GET /api/aria/memory/context
   */
  public static async getContext(req: Request, res: Response): Promise<void> {
    try {
      const userId = typeof req.query.userId === 'string' ? req.query.userId : 'guest_user';
      const summary = await ariaMemoryService.getMemoryContext(userId);

      res.json({
        success: true,
        data: summary
      });
    } catch (err: any) {
      console.error('[MemoryController Error] getContext failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Memory fetch error',
        message: err.message || 'Internal server error retrieving memory context'
      });
    }
  }

  /**
   * DELETE /api/aria/memory/item/:id
   */
  public static async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const rawItemId = req.params.id;
      const itemId = Array.isArray(rawItemId) ? rawItemId[0] : rawItemId;
      const qUser = req.query.userId;
      const userId = typeof qUser === 'string' ? qUser : Array.isArray(qUser) ? String(qUser[0]) : 'guest_user';

      if (!itemId || itemId.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: ['Memory item "id" parameter is required.']
        });
        return;
      }

      const removed = await ariaMemoryService.deleteMemoryItem(userId, itemId);

      res.json({
        success: true,
        deleted: removed,
        id: itemId
      });
    } catch (err: any) {
      console.error('[MemoryController Error] deleteItem failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Memory deletion error',
        message: err.message || 'Internal server error deleting memory item'
      });
    }
  }
}
