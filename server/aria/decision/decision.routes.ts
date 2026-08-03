/**
 * ARIA v2.5 Decision Intelligence Express Routes
 * Product: LOOK VISION v2.4
 */

import { Router } from 'express';
import { DecisionController } from './decision.controller';

const decisionRouter = Router();

/**
 * POST /api/aria/decision/recommend
 */
decisionRouter.post('/recommend', DecisionController.recommend);

/**
 * GET /api/aria/decision/history
 */
decisionRouter.get('/history', DecisionController.getHistory);

/**
 * DELETE /api/aria/decision/history/:id
 */
decisionRouter.delete('/history/:id', DecisionController.deleteHistoryItem);

export default decisionRouter;
