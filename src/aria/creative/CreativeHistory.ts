/**
 * ARIA v2.5 Creative History Manager
 * Product: LOOK VISION v2.4
 */

import { CreativeConcept } from './CreativeTypes';
import { creativeStorage } from './CreativeStorage';

export class CreativeHistoryManager {
  private history: CreativeConcept[] = [];

  public async loadHistory(userId: string): Promise<CreativeConcept[]> {
    this.history = await creativeStorage.fetchHistory(userId);
    return this.history;
  }

  public async addConcept(userId: string, concept: CreativeConcept): Promise<void> {
    this.history.unshift(concept);
    await creativeStorage.saveConcept(userId, concept);
  }

  public async deleteConcept(userId: string, creativeId: string): Promise<boolean> {
    this.history = this.history.filter(c => c.creativeId !== creativeId);
    return await creativeStorage.deleteConcept(userId, creativeId);
  }

  public getHistory(): CreativeConcept[] {
    return this.history;
  }
}

export const creativeHistoryManager = new CreativeHistoryManager();
