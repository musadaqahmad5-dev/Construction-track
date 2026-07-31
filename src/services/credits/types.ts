export type CreditType = 'image' | 'video' | 'tryOn' | 'premium';

export interface UserCreditBalance {
  imageCredits: number;
  videoCredits: number;
  tryOnCredits: number;
  premiumCredits: number;
  lastUpdated: string;
}

export interface AIUsageRecord {
  id: string;
  userId: string;
  featureType: string; // e.g. 'fash_image_gen', 'video_runway', 'virtual_try_on', 'deep_dna'
  creditType: CreditType;
  creditsUsed: number;
  requestType: string; // e.g. 'standard', '4k_hd', 'video_loop', 'model_finetune'
  timestamp: string;
  successStatus: 'success' | 'failed' | 'cancelled' | 'pending';
  refunded: boolean;
  refundReason?: string;
  errorReason?: string;
  executionTimeMs?: number;
  metadata?: Record<string, any>;
}

export interface CreditValidationResult {
  valid: boolean;
  userCredits: number;
  requiredCredits: number;
  creditType: CreditType;
  planTier: string;
  reason?: string;
  reserveToken?: string;
}

export interface PlanCreditConfig {
  planId: 'FREE' | 'PREMIUM' | 'CREATOR_PRO' | 'ENTERPRISE';
  name: string;
  tagline: string;
  monthlyImageCredits: number;
  monthlyVideoCredits: number;
  monthlyTryOnCredits: number;
  monthlyPremiumCredits: number;
  maxDailyGenerations: number;
  maxConcurrentJobs: number;
  priorityLevel: number; // 1 = standard, 2 = priority, 3 = VIP ultra
  creatorMonetization: boolean;
  features: string[];
}

export interface CreditCostRule {
  featureType: string;
  requestType: string;
  creditType: CreditType;
  baseCost: number;
  description: string;
}
