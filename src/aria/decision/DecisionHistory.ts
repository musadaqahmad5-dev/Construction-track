/**
 * ARIA v2.5 Decision History Manager
 * Product: LOOK VISION v2.4
 */

import { FashionRecommendation } from './DecisionTypes';
import { decisionStorage } from './DecisionStorage';

export class DecisionHistoryManager {
  private history: FashionRecommendation[] = [];

  public async loadHistory(userId: string): Promise<FashionRecommendation[]> {
    this.history = await decisionStorage.fetchHistory(userId);
    return this.history;
  }

  public async addRecommendation(userId: string, recommendation: FashionRecommendation): Promise<void> {
    this.history.unshift(recommendation);
    await decisionStorage.saveRecommendation(userId, recommendation);
  }

  public async deleteRecommendation(userId: string, recommendationId: string): Promise<boolean> {
    this.history = this.history.filter(r => r.recommendationId !== recommendationId);
    return await decisionStorage.deleteRecommendation(userId, recommendationId);
  }

  public getHistory(): FashionRecommendation[] {
    return this.history;
  }
}

export const decisionHistoryManager = new DecisionHistoryManager();
