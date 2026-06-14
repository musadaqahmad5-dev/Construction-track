import { WardrobeItem, StyleProfile } from '../../types';

export interface DecisionLog {
  id: string;
  itemId: string;
  action: 'approve' | 'reject' | 'worn';
  timestamp: string;
  occasion: string;
  feedbackScore?: number;
}

export class AgentMemoryBridge {
  private static STORAGE_KEY = 'fashion_companion_decision_logs';

  /**
   * Retrieves past styling decisions of the user.
   */
  static getDecisionLogs(): DecisionLog[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Appends a new styling interaction log.
   */
  static logDecision(itemId: string, action: 'approve' | 'reject' | 'worn', occasion: string, feedbackScore?: number) {
    const logs = this.getDecisionLogs();
    const newLog: DecisionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      itemId,
      action,
      timestamp: new Date().toISOString(),
      occasion,
      feedbackScore
    };
    logs.push(newLog);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
  }

  /**
   * Determines past success outcomes to refine styling vectors.
   */
  static getSuccessRate(itemId: string): number {
    const logs = this.getDecisionLogs().filter(l => l.itemId === itemId);
    if (logs.length === 0) return 0.5; // neutral starting index

    const approvals = logs.filter(l => l.action === 'approve' || l.action === 'worn').length;
    return approvals / logs.length;
  }

  /**
   * Calculates preferred style profile preferences.
   */
  static inferPreferences(wardrobe: WardrobeItem[], defaultProfile?: StyleProfile): StyleProfile {
    const categoriesList = Array.from(new Set(wardrobe.map(x => x.category)));
    const colorsList = Array.from(new Set(wardrobe.map(x => x.primaryColor).filter(Boolean)));

    return {
      userId: defaultProfile?.userId || 'active_user',
      preferredCategories: categoriesList.slice(0, 3) as any,
      favoriteColors: colorsList.slice(0, 4) as string[],
      styleVibe: defaultProfile?.styleVibe || 'minimalist',
      updatedAt: new Date()
    };
  }
}
