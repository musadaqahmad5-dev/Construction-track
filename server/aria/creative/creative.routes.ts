/**
 * ARIA v2.5 Creative Intelligence Express Routes
 * Product: LOOK VISION v2.4
 */

import { Router } from 'express';
import { CreativeController } from './creative.controller';

const creativeRouter = Router();

/**
 * POST /api/aria/creative/generate
 */
creativeRouter.post('/generate', CreativeController.generate);

/**
 * GET /api/aria/creative/history
 */
creativeRouter.get('/history', CreativeController.getHistory);

/**
 * DELETE /api/aria/creative/history/:id
 */
creativeRouter.delete('/history/:id', CreativeController.deleteHistoryItem);

export default creativeRouter;
