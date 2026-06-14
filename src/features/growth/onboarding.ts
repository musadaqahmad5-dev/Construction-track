export interface OnboardingStep {
  stepId: string;
  instruction: string;
  isCompleted: boolean;
}

export class Onboarding {
  private static userSteps: OnboardingStep[] = [
    { stepId: 'setup-dna', instruction: 'Calibrate Style DNA Matrix Weights', isCompleted: true },
    { stepId: 'first-look', instruction: 'Simulate & Render First Digital Look', isCompleted: true },
    { stepId: 'creator-remix', instruction: 'Explore Collective Marketplace Creator Feed', isCompleted: false },
    { stepId: 'unlock-pro', instruction: 'Audit Premium Gorpcore/Tactical Features', isCompleted: false }
  ];

  static getOnboardingProgress(): OnboardingStep[] {
    return this.userSteps;
  }

  static completeStep(id: string): void {
    const s = this.userSteps.find(step => step.stepId === id);
    if (s) {
      s.isCompleted = true;
    }
  }

  static calculateOnboardingRate(): number {
    const done = this.userSteps.filter(s => s.isCompleted).length;
    return Math.round((done / this.userSteps.length) * 100);
  }
}
