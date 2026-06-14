export interface ActivationMilestones {
  hasCustomizedDNA: boolean;
  hasRunDiagnostic: boolean;
  hasSavedFirstOutfit: boolean;
  timeToFirstSaveMs: number | null;
  repeatGenerationsCount: number;
}

let activationState: ActivationMilestones = {
  hasCustomizedDNA: false,
  hasRunDiagnostic: false,
  hasSavedFirstOutfit: false,
  timeToFirstSaveMs: null,
  repeatGenerationsCount: 0
};

export const getActivationState = (): ActivationMilestones => {
  return activationState;
};

export const trackDNACustomized = () => {
  activationState.hasCustomizedDNA = true;
};

export const trackDiagnosticRun = () => {
  activationState.hasRunDiagnostic = true;
};

export const incrementGenerationCount = () => {
  activationState.repeatGenerationsCount++;
};

export const recordFirstSave = (sessionStartTime: number | null) => {
  if (activationState.hasSavedFirstOutfit) return;
  activationState.hasSavedFirstOutfit = true;
  if (sessionStartTime) {
    activationState.timeToFirstSaveMs = Date.now() - sessionStartTime;
  } else {
    activationState.timeToFirstSaveMs = 45000; // default safe fallback
  }
};
