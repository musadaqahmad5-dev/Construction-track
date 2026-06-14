export interface StyleMilestone {
  milestoneId: string;
  badgeName: string;
  requirement: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  themeColor: string;
}

export class AchievementSystem {
  private static milestonesList: StyleMilestone[] = [
    {
      milestoneId: 'ach-01',
      badgeName: 'Tailoring Maestro',
      requirement: 'Compile 3 distinct luxury cashmere layers',
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 86400000 * 2),
      themeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      milestoneId: 'ach-02',
      badgeName: 'Stealth Shadow',
      requirement: 'Unlock all Cyberpunk technical shell specifications',
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 86400000),
      themeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      milestoneId: 'ach-03',
      badgeName: 'Creator Spark',
      requirement: 'Acquire 50 followers on published lookbook sets',
      isUnlocked: false,
      themeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
  ];

  static fetchAllMilestones(): StyleMilestone[] {
    return this.milestonesList;
  }

  static unlockMilestone(id: string): void {
    const m = this.milestonesList.find(mile => mile.milestoneId === id);
    if (m && !m.isUnlocked) {
      m.isUnlocked = true;
      m.unlockedAt = new Date();
    }
  }
}
