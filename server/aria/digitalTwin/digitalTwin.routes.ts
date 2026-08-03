/**
 * ARIA v2.5 Digital Twin Express Routes
 * Product: LOOK VISION v2.4
 */

import { Router } from 'express';
import { DigitalTwinController } from './digitalTwin.controller';

const digitalTwinRouter = Router();

/**
 * GET /api/aria/digital-twin/profile
 */
digitalTwinRouter.get('/profile', DigitalTwinController.getProfile);

/**
 * POST /api/aria/digital-twin/analyze
 */
digitalTwinRouter.post('/analyze', DigitalTwinController.analyze);

/**
 * GET /api/aria/digital-twin/history
 */
digitalTwinRouter.get('/history', DigitalTwinController.getHistory);

export default digitalTwinRouter;
