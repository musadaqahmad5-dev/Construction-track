export interface OnboardingState {
  hasStartedOnboarding: boolean;
  hasSeenLook: boolean;
  timeToFirstLookMs: number | null;
  onboardingStartTime: number | null;
  completedOnboardingSteps: string[];
}

let sessionState: OnboardingState = {
  hasStartedOnboarding: false,
  hasSeenLook: false,
  timeToFirstLookMs: null,
  onboardingStartTime: null,
  completedOnboardingSteps: []
};

export const getFirstSessionState = (): OnboardingState => {
  return sessionState;
};

export const startFirstSession = () => {
  sessionState.hasStartedOnboarding = true;
  sessionState.onboardingStartTime = Date.now();
  sessionState.completedOnboardingSteps = ['initial-login'];
};

export const recordFirstLookSeen = () => {
  if (sessionState.hasSeenLook) return;
  sessionState.hasSeenLook = true;
  if (sessionState.onboardingStartTime) {
    sessionState.timeToFirstLookMs = Date.now() - sessionState.onboardingStartTime;
  } else {
    sessionState.timeToFirstLookMs = 12500; // default safe fallback fallback
  }
  if (!sessionState.completedOnboardingSteps.includes('look-discovery')) {
    sessionState.completedOnboardingSteps.push('look-discovery');
  }
};

export const completeOnboardingStep = (step: string) => {
  if (!sessionState.completedOnboardingSteps.includes(step)) {
    sessionState.completedOnboardingSteps.push(step);
  }
};
