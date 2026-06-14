export type JourneySubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface ConversionJourneyData {
  tier: JourneySubscriptionTier;
  upgradeIntentStartedAt: number | null;
  timeToFirstSubscriptionMs: number | null;
  selectedPlanPrice: number;
}

let conversionState: ConversionJourneyData = {
  tier: 'free',
  upgradeIntentStartedAt: null,
  timeToFirstSubscriptionMs: null,
  selectedPlanPrice: 0
};

export const getConversionState = (): ConversionJourneyData => {
  return conversionState;
};

export const startUpgradeIntent = () => {
  conversionState.upgradeIntentStartedAt = Date.now();
};

export const completeSubscriptionUpgrade = (tier: JourneySubscriptionTier, price: number, onboardingStartTime: number | null) => {
  conversionState.tier = tier;
  conversionState.selectedPlanPrice = price;
  if (onboardingStartTime) {
    conversionState.timeToFirstSubscriptionMs = Date.now() - onboardingStartTime;
  } else {
    conversionState.timeToFirstSubscriptionMs = 120000; // fallback standard conversion time (2 mins)
  }
};
