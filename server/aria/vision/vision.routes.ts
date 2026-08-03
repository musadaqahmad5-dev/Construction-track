/**
 * ARIA v2.5 Visual Intelligence Express Routes
 * Product: LOOK VISION v2.4
 */

import { Router } from 'express';
import { VisionController } from './vision.controller';

const visionRouter = Router();

/**
 * POST /api/aria/vision/analyze
 */
visionRouter.post('/analyze', VisionController.analyze);

/**
 * GET /api/aria/vision/history
 */
visionRouter.get('/history', VisionController.getHistory);

/**
 * DELETE /api/aria/vision/history/:id
 */
visionRouter.delete('/history/:id', VisionController.deleteAnalysis);

export default visionRouter;
