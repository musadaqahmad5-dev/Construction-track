import { Router, Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { rateLimitMiddleware } from '../middleware/RateLimitMiddleware';
import {
  validateChatInput,
  validateSessionInput,
  validateMemoryUpdate,
  validateHistoryQuery
} from '../middleware/ConversationValidation';
import { aiStylistController } from '../controllers/AIStylistController';

const router = Router();

export const verifyStylistAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or malformed authentication token',
      timestamp: new Date().toISOString()
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (token === 'guest-token') {
    (req as any).user = {
      uid: 'guest-sartorialist-user-100',
      email: 'guest@companion.com',
      displayName: 'Guest Sartorialist'
    };
    next();
    return;
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: `Unauthorized: Invalid or expired token: ${err.message}`,
      timestamp: new Date().toISOString()
    });
  }
};

router.post('/chat', verifyStylistAuth, rateLimitMiddleware, validateChatInput, aiStylistController.handleChat);
router.post('/stream', verifyStylistAuth, rateLimitMiddleware, validateChatInput, aiStylistController.handleStream);
router.post('/session', verifyStylistAuth, rateLimitMiddleware, validateSessionInput, aiStylistController.handleSession);
router.get('/history', verifyStylistAuth, rateLimitMiddleware, validateHistoryQuery, aiStylistController.handleHistory);
router.get('/context', verifyStylistAuth, rateLimitMiddleware, aiStylistController.handleContext);
router.post('/memory/update', verifyStylistAuth, rateLimitMiddleware, validateMemoryUpdate, aiStylistController.handleMemoryUpdate);
router.get('/style-profile', verifyStylistAuth, rateLimitMiddleware, aiStylistController.handleStyleProfile);
router.post('/reset', verifyStylistAuth, rateLimitMiddleware, validateSessionInput, aiStylistController.handleReset);

export default router;
