/**
 * ARIA v2.5 Style DNA Express Routes
 * Product: LOOK VISION v2.4
 */

import { Router } from 'express';
import { StyleDNAController } from './styleDNA.controller';

const styleDNARouter = Router();

/**
 * GET /api/aria/style-dna/profile
 */
styleDNARouter.get('/profile', StyleDNAController.getProfile);

/**
 * POST /api/aria/style-dna/update
 */
styleDNARouter.post('/update', StyleDNAController.updateProfile);

/**
 * GET /api/aria/style-dna/history
 */
styleDNARouter.get('/history', StyleDNAController.getHistory);

export default styleDNARouter;
