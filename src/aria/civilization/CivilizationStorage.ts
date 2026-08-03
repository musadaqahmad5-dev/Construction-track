/**
 * ARIA v2.5 Civilization Storage
 * Product: LOOK VISION v2.4
 */

import { KnowledgeGraphData } from './CivilizationMemoryTypes';

export class CivilizationStorage {
  private static readonly KEY = 'aria_civilization_graph_v25';

  public static saveGraph(userId: string, graph: KnowledgeGraphData): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${this.KEY}_${userId}`, JSON.stringify(graph));
      }
    } catch (e) {
      console.warn('[CivilizationStorage] Save graph error:', e);
    }
  }

  public static loadGraph(userId: string): KnowledgeGraphData | null {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`${this.KEY}_${userId}`);
        if (raw) {
          return JSON.parse(raw) as KnowledgeGraphData;
        }
      }
    } catch (e) {
      console.warn('[CivilizationStorage] Load graph error:', e);
    }
    return null;
  }
}
