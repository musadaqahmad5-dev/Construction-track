export interface ChurnMetric {
  streakDays: number;
  lastStylingDate: Date;
  engagementIndex: number; // 0-100 indicating interaction speed
  churnRiskAssessment: 'Low Risk' | 'Medium Risk' | 'Churn Imminent';
}

export class RetentionEngine {
  private static userStreak = 4; // active modeling streak

  static getCohortRetentionStats(): ChurnMetric {
    let risk: 'Low Risk' | 'Medium Risk' | 'Churn Imminent' = 'Low Risk';
    if (this.userStreak === 0) risk = 'Churn Imminent';
    else if (this.userStreak < 2) risk = 'Medium Risk';

    return {
      streakDays: this.userStreak,
      lastStylingDate: new Date(),
      engagementIndex: 88,
      churnRiskAssessment: risk
    };
  }

  static incrementStreak(): void {
    this.userStreak += 1;
  }
}
