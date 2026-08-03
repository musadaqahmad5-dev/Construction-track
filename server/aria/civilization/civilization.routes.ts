/**
 * ARIA v2.5 Civilization Memory Routes
 * Product: LOOK VISION v2.4
 */

import { Router } from 'express';
import { CivilizationController } from './civilization.controller';

const router = Router();

router.get('/graph', CivilizationController.getGraph);
router.post('/index', CivilizationController.indexMemory);
router.get('/search', CivilizationController.searchMemory);
router.get('/history', CivilizationController.getHistory);

export default router;
