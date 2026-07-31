import { PlanCreditConfig, CreditCostRule, CreditType } from './types';

export const PLAN_CREDIT_CONFIGS: Record<string, PlanCreditConfig> = {
  FREE: {
    planId: 'FREE',
    name: 'Sartorial Essentials',
    tagline: 'Core AI fashion tools for enthusiasts & style explorers',
    monthlyImageCredits: 150,
    monthlyVideoCredits: 10,
    monthlyTryOnCredits: 30,
    monthlyPremiumCredits: 10,
    maxDailyGenerations: 25,
    maxConcurrentJobs: 1,
    priorityLevel: 1,
    creatorMonetization: false,
    features: [
      '150 Monthly AI Fashion Image Credits',
      '30 Virtual Try-On Credits',
      '10 AI Video Runway Credits',
      'Standard Fashion Intelligence Engine',
      'Digital Wardrobe storage up to 25 items'
    ]
  },
  PREMIUM: {
    planId: 'PREMIUM',
    name: 'Style Studio Pro',
    tagline: 'High-definition 4K fashion AI & photorealistic 3D try-on pipeline',
    monthlyImageCredits: 1500,
    monthlyVideoCredits: 150,
    monthlyTryOnCredits: 300,
    monthlyPremiumCredits: 100,
    maxDailyGenerations: 250,
    maxConcurrentJobs: 3,
    priorityLevel: 2,
    creatorMonetization: false,
    features: [
      '1,500 Monthly AI Image Credits',
      '300 Virtual Try-On Credits',
      '150 AI Video Runway Credits',
      '4K Ultra-HD Fashion Rendering',
      'Mature Fashion Studio & Couture Intelligence',
      'Priority Processing Queue'
    ]
  },
  CREATOR_PRO: {
    planId: 'CREATOR_PRO',
    name: 'Creator Operating System',
    tagline: 'Monetize digital fashion collections & run digital atelier',
    monthlyImageCredits: 8000,
    monthlyVideoCredits: 800,
    monthlyTryOnCredits: 1500,
    monthlyPremiumCredits: 500,
    maxDailyGenerations: 1000,
    maxConcurrentJobs: 5,
    priorityLevel: 3,
    creatorMonetization: true,
    features: [
      '8,000 Monthly AI Image Credits',
      '1,500 Virtual Try-On Credits',
      '800 AI Video Runway Credits',
      'Marketplace Seller Studio & 0% Sales Commission',
      'Creator Campaign Publishing Rights',
      'Custom Style DNA Fine-Tuning'
    ]
  },
  ENTERPRISE: {
    planId: 'ENTERPRISE',
    name: 'Fashion House Enterprise',
    tagline: 'Bespoke AI style models, enterprise APIs & white-label tools',
    monthlyImageCredits: 40000,
    monthlyVideoCredits: 4000,
    monthlyTryOnCredits: 8000,
    monthlyPremiumCredits: 2000,
    maxDailyGenerations: 10000,
    maxConcurrentJobs: 10,
    priorityLevel: 3,
    creatorMonetization: true,
    features: [
      '40,000 Monthly AI Image Credits',
      '8,000 Virtual Try-On Credits',
      '4,000 AI Video Runway Credits',
      'Dedicated Brand Weights & API Endpoints',
      'Dedicated SLA & Strategic Support',
      'Unlimited Studio Team Seats'
    ]
  }
};

export const CREDIT_COST_RULES: CreditCostRule[] = [
  // Image Generation
  { featureType: 'fash_image_gen', requestType: 'standard_2k', creditType: 'image', baseCost: 10, description: 'Standard 2K AI Fashion Image Generation' },
  { featureType: 'fash_image_gen', requestType: 'ultra_hd_4k', creditType: 'image', baseCost: 20, description: '4K Ultra-HD Fashion Render' },
  { featureType: 'fash_image_gen', requestType: 'edit_inpainting', creditType: 'image', baseCost: 8, description: 'Garment Inpainting & Modification' },

  // Video Generation
  { featureType: 'video_runway', requestType: 'short_clip', creditType: 'video', baseCost: 30, description: '5-second AI Runway Motion Video' },
  { featureType: 'video_runway', requestType: 'editorial_loop', creditType: 'video', baseCost: 60, description: '10-second High-FPS Runway Loop' },

  // Virtual Try-On
  { featureType: 'virtual_try_on', requestType: 'overlay_2d', creditType: 'tryOn', baseCost: 15, description: '2D Draped Virtual Try-On' },
  { featureType: 'virtual_try_on', requestType: 'photorealistic_3d', creditType: 'tryOn', baseCost: 25, description: '3D Mesh Draped Photorealistic Try-On' },

  // Premium Intelligence Features
  { featureType: 'mature_fashion_studio', requestType: 'couture_synthesis', creditType: 'premium', creditTypeFallback: 'image', baseCost: 15, description: 'Mature Fashion Couture AI Synthesis' } as any,
  { featureType: 'deep_dna', requestType: 'full_persona_scan', creditType: 'premium', baseCost: 10, description: 'Deep Style DNA Persona Profiling' },
  { featureType: 'custom_ai_model', requestType: 'finetune_weights', creditType: 'premium', baseCost: 100, description: 'Custom Style Model Fine-Tuning' }
];

export class PlanService {
  /**
   * Retrieves plan credit rules and entitlements
   */
  public static getPlanConfig(planId: string = 'FREE'): PlanCreditConfig {
    const cleanId = (planId || 'FREE').toUpperCase();
    return PLAN_CREDIT_CONFIGS[cleanId] || PLAN_CREDIT_CONFIGS.FREE;
  }

  /**
   * Determines credit type and cost for a specific AI request
   */
  public static getCostRule(featureType: string, requestType: string = 'standard_2k'): CreditCostRule {
    const rule = CREDIT_COST_RULES.find(
      r => r.featureType === featureType && r.requestType === requestType
    ) || CREDIT_COST_RULES.find(
      r => r.featureType === featureType
    );

    if (rule) return rule;

    // Default fallback rule
    return {
      featureType,
      requestType,
      creditType: featureType.includes('video') ? 'video' : featureType.includes('try') ? 'tryOn' : 'image',
      baseCost: 10,
      description: `AI Generation (${featureType})`
    };
  }

  /**
   * Lists all available plan configurations
   */
  public static getAllPlanConfigs(): PlanCreditConfig[] {
    return Object.values(PLAN_CREDIT_CONFIGS);
  }
}
