export interface StyleGoal {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  weightsModifier: {
    comfort: number;     // coefficient delta
    formality: number;   // coefficient delta
    layering: number;    // coefficient delta
    variety: number;     // coefficient delta
  };
}

export class GoalPlanner {
  private static STORAGE_KEY = 'fashion_companion_active_goals_v2';

  /**
   * Loads or bootstraps active companion style goals.
   */
  static getGoals(): StyleGoal[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // Fallback
      }
    }

    const defaultGoals: StyleGoal[] = [
      {
        id: 'goal-variety',
        name: 'Maximize Closet Rotation',
        description: 'Prioritize wearing back-closet assets and reduce garment duplication fatigue.',
        enabled: true,
        weightsModifier: { comfort: 0.1, formality: 0, layering: 0, variety: 0.3 }
      },
      {
        id: 'goal-minimalism',
        name: 'Compact Wardrobe Footprint',
        description: 'Optimize high-quality neutrals styling, suppressing flashy underused accents.',
        enabled: false,
        weightsModifier: { comfort: 0.2, formality: -0.1, layering: 0.1, variety: -0.2 }
      },
      {
        id: 'goal-formal',
        name: 'Elevated Professional Persona',
        description: 'Tails recommendations towards sharp silhouettes, blazers, and tailoring.',
        enabled: false,
        weightsModifier: { comfort: -0.2, formality: 0.4, layering: 0, variety: 0.1 }
      }
    ];

    this.saveGoals(defaultGoals);
    return defaultGoals;
  }

  /**
   * Stores the styling goals state.
   */
  static saveGoals(goals: StyleGoal[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(goals));
  }

  /**
   * Toggles single styling goals and updates persistence.
   */
  static toggleGoal(goalId: string): StyleGoal[] {
    const goals = this.getGoals();
    const updated = goals.map(g => {
      if (g.id === goalId) {
        return { ...g, enabled: !g.enabled };
      }
      return g;
    });
    this.saveGoals(updated);
    return updated;
  }
}
