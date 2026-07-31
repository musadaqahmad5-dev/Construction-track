import { SubscriptionTier, SubscriptionStatus } from './IPaymentProvider';

export interface UserSubscriptionState {
  userId: string;
  planId: SubscriptionTier;
  status: SubscriptionStatus;
  provider: string;
  customerId: string;
  subscriptionId: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  cancelAtPeriodEnd: boolean;
  creditBalance: number;
  lifetimeCreditsEarned: number;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'monthly_grant' | 'usage_deduction' | 'topup_purchase' | 'promotional_bonus' | 'creator_payout';
  reason: string;
  featureKey?: string;
  timestamp: string;
  balanceAfter: number;
}

export interface PlanFeatureDefinition {
  planId: SubscriptionTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  creditsMonthly: number;
  maxVirtualTryOnsPerMonth: number;
  maxAiStudioGenerationsPerMonth: number;
  canAccessMatureStudio: boolean;
  canAccessMarketplaceSeller: boolean;
  canAccessCustomAiTraining: boolean;
  hasPriorityProcessing: boolean;
  hasWhiteLabelExport: boolean;
  featuresList: string[];
}

export type FeatureKey =
  | 'AI_IMAGE_GEN'
  | 'AI_VIDEO_GEN'
  | 'VIRTUAL_TRY_ON'
  | 'MATURE_FASHION_STUDIO'
  | 'MARKETPLACE_SELLER'
  | 'CUSTOM_AI_MODEL'
  | 'PRIORITY_AI_QUEUE'
  | 'ANALYTICS_EXPORTS';

export interface FeatureAccessResult {
  allowed: boolean;
  featureKey: FeatureKey;
  userPlan: SubscriptionTier;
  requiredPlan: SubscriptionTier;
  remainingCredits: number;
  requiredCredits: number;
  reason?: string;
}
