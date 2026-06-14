import { getFirstSessionState } from './firstSession';
import { getActivationState } from './activationFlow';
import { getConversionState } from './conversionJourney';

export interface RetentionMetrics {
  weeklyRetentionMultiplier: number;
  lastActiveDate: string;
  churnPropensityRisk: 'low' | 'medium' | 'high';
  netPromoterScore: number | null;
}

let retentionState: RetentionMetrics = {
  weeklyRetentionMultiplier: 1.4,
  lastActiveDate: new Date().toLocaleDateString(),
  churnPropensityRisk: 'low',
  netPromoterScore: 9
};

export const getRetentionState = (): RetentionMetrics => {
  return retentionState;
};

export const submitNPSSurvey = (score: number) => {
  retentionState.netPromoterScore = score;
  if (score >= 9) {
    retentionState.churnPropensityRisk = 'low';
  } else if (score >= 7) {
    retentionState.churnPropensityRisk = 'medium';
  } else {
    retentionState.churnPropensityRisk = 'high';
  }
};

export const generateJourneyDiagnostics = () => {
  const firstSession = getFirstSessionState();
  const activation = getActivationState();
  const conversion = getConversionState();
  const retention = getRetentionState();

  // Compute standard diagnostics ratios
  const onboardingCompletionRate = firstSession.completedOnboardingSteps.length / 3; // out of login, discovery, styling
  const activationCompletionRate = (
    (activation.hasCustomizedDNA ? 1 : 0) +
    (activation.hasSavedFirstOutfit ? 1 : 0) +
    (activation.hasRunDiagnostic ? 1 : 0)
  ) / 3;

  return {
    onboardingCompletionRate: Math.min(1.0, onboardingCompletionRate),
    activationCompletionRate: Math.min(1.0, activationCompletionRate),
    timeToFirstLookS: firstSession.timeToFirstLookMs ? firstSession.timeToFirstLookMs / 1000 : null,
    timeToFirstSaveS: activation.timeToFirstSaveMs ? activation.timeToFirstSaveMs / 1000 : null,
    timeToFirstConvS: conversion.timeToFirstSubscriptionMs ? conversion.timeToFirstSubscriptionMs / 1000 : null,
    premiumTier: conversion.tier,
    repeatGenerations: activation.repeatGenerationsCount,
    healthIndex: parseFloat(
      (
        ((onboardingCompletionRate + activationCompletionRate + (retention.netPromoterScore ? retention.netPromoterScore / 10 : 0.8)) / 3) *
        100
      ).toFixed(1)
    )
  };
};
