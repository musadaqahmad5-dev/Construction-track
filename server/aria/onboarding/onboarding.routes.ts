/**
 * ARIA Onboarding Routes
 * Path: server/aria/onboarding/onboarding.routes.ts
 * Subsystem: LookVision v2.4 Post-Purchase Storefront Onboarding
 */

import { Router } from 'express';
import { OnboardingController, authenticateOnboardingToken } from './onboarding.controller';

const onboardingRouter = Router();

/**
 * PUT /api/aria/onboarding/setup & /api/v1/aria/onboarding/setup
 * Saves custom domain and Atelier Pod workspace configurations
 */
onboardingRouter.put(
  '/setup',
  authenticateOnboardingToken,
  OnboardingController.handleSetup
);

export default onboardingRouter;
