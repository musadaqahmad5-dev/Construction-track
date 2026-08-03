/**
 * ARIA v2.5 Agent Memory Bridge
 * Product: LOOK VISION v2.4
 */

import { memoryEngine } from '../memory/MemoryEngine';
import { FashionMemoryItem } from '../memory/MemoryTypes';

export class AgentMemoryBridge {
  private static instance: AgentMemoryBridge;

  private constructor() {}

  public static getInstance(): AgentMemoryBridge {
    if (!AgentMemoryBridge.instance) {
      AgentMemoryBridge.instance = new AgentMemoryBridge();
    }
    return AgentMemoryBridge.instance;
  }

  public async getRelevantMemories(userId: string, categoryKeyword?: string): Promise<FashionMemoryItem[]> {
    const all = memoryEngine.getMemories();
    if (!categoryKeyword) return all;

    const lower = categoryKeyword.toLowerCase();
    return all.filter(m => {
      const valStr = typeof m.value === 'string' ? m.value : JSON.stringify(m.value);
      return m.category.toLowerCase().includes(lower) || valStr.toLowerCase().includes(lower);
    });
  }

  public async recordAgentInsight(
    userId: string, 
    category: string, 
    summary: string, 
    confidence: number = 0.9
  ): Promise<void> {
    await memoryEngine.updateMemory({
      category: category as any,
      value: summary,
      source: 'system_inferred',
      level: 'preference',
      confidence
    });
  }
}

export const agentMemoryBridge = AgentMemoryBridge.getInstance();
