import { Request, Response, NextFunction } from 'express';
import { SubscriptionService, PLAN_DEFINITIONS } from './subscriptionService';
import { SubscriptionTier } from './IPaymentProvider';
import { FeatureKey, FeatureAccessResult } from './types';

export interface FeatureRequirement {
  featureKey: FeatureKey;
  minPlan: SubscriptionTier;
  creditCost: number;
}

export const FEATURE_REQUIREMENTS: Record<FeatureKey, FeatureRequirement> = {
  AI_IMAGE_GEN: {
    featureKey: 'AI_IMAGE_GEN',
    minPlan: 'FREE',
    creditCost: 10
  },
  AI_VIDEO_GEN: {
    featureKey: 'AI_VIDEO_GEN',
    minPlan: 'PREMIUM',
    creditCost: 50
  },
  VIRTUAL_TRY_ON: {
    featureKey: 'VIRTUAL_TRY_ON',
    minPlan: 'FREE',
    creditCost: 15
  },
  MATURE_FASHION_STUDIO: {
    featureKey: 'MATURE_FASHION_STUDIO',
    minPlan: 'FREE',
    creditCost: 10
  },
  MARKETPLACE_SELLER: {
    featureKey: 'MARKETPLACE_SELLER',
    minPlan: 'CREATOR_PRO',
    creditCost: 0
  },
  CUSTOM_AI_MODEL: {
    featureKey: 'CUSTOM_AI_MODEL',
    minPlan: 'CREATOR_PRO',
    creditCost: 100
  },
  PRIORITY_AI_QUEUE: {
    featureKey: 'PRIORITY_AI_QUEUE',
    minPlan: 'PREMIUM',
    creditCost: 0
  },
  ANALYTICS_EXPORTS: {
    featureKey: 'ANALYTICS_EXPORTS',
    minPlan: 'CREATOR_PRO',
    creditCost: 0
  }
};

const PLAN_LEVELS: Record<SubscriptionTier, number> = {
  FREE: 0,
  PREMIUM: 1,
  CREATOR_PRO: 2,
  ENTERPRISE: 3
};

export class FeatureAccessService {
  /**
   * Evaluates feature access rights for a user
   */
  public static async checkFeatureAccess(
    userId: string,
    featureKey: FeatureKey
  ): Promise<FeatureAccessResult> {
    const requirement = FEATURE_REQUIREMENTS[featureKey] || {
      featureKey,
      minPlan: 'FREE',
      creditCost: 0
    };

    const sub = await SubscriptionService.getUserSubscription(userId);
    const userPlanLevel = PLAN_LEVELS[sub.planId] ?? 0;
    const requiredPlanLevel = PLAN_LEVELS[requirement.minPlan] ?? 0;

    // Check plan tier level requirement
    if (userPlanLevel < requiredPlanLevel) {
      const minPlanDef = PLAN_DEFINITIONS[requirement.minPlan];
      return {
        allowed: false,
        featureKey,
        userPlan: sub.planId,
        requiredPlan: requirement.minPlan,
        remainingCredits: sub.creditBalance,
        requiredCredits: requirement.creditCost,
        reason: `Feature '${featureKey}' requires ${minPlanDef.name} tier (${requirement.minPlan}). Your current plan is ${sub.planId}.`
      };
    }

    // Check credit balance requirement
    if (requirement.creditCost > 0 && sub.creditBalance < requirement.creditCost) {
      return {
        allowed: false,
        featureKey,
        userPlan: sub.planId,
        requiredPlan: requirement.minPlan,
        remainingCredits: sub.creditBalance,
        requiredCredits: requirement.creditCost,
        reason: `Insufficient credits. Required: ${requirement.creditCost}, Balance: ${sub.creditBalance}. Top up or upgrade.`
      };
    }

    return {
      allowed: true,
      featureKey,
      userPlan: sub.planId,
      requiredPlan: requirement.minPlan,
      remainingCredits: sub.creditBalance,
      requiredCredits: requirement.creditCost
    };
  }

  /**
   * Express middleware factory to guard API endpoints by feature entitlement
   */
  public static requireFeature(featureKey: FeatureKey) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.uid || (req.headers['x-user-id'] as string) || 'guest-sartorialist-user-100';

      const access = await FeatureAccessService.checkFeatureAccess(userId, featureKey);

      if (!access.allowed) {
        return res.status(403).json({
          error: 'Feature Access Denied',
          featureKey,
          userPlan: access.userPlan,
          requiredPlan: access.requiredPlan,
          remainingCredits: access.remainingCredits,
          requiredCredits: access.requiredCredits,
          message: access.reason
        });
      }

      // Attach feature check result to request context
      (req as any).featureAccess = access;
      next();
    };
  }
}
