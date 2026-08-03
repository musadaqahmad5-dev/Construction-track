/**
 * ARIA v2.5 Memory Updater Service
 * Product: LOOK VISION v2.4
 */

import { 
  FashionMemoryItem, 
  MemoryUpdatePayload, 
  FashionMemoryCategory, 
  MemorySource, 
  MemoryLevel 
} from './MemoryTypes';
import { MemoryConfidenceEvaluator } from './MemoryConfidence';
import { memoryStorageAdapter } from './MemoryStorageAdapter';

export class MemoryUpdater {
  /**
   * Upsert a new memory preference or update an existing matching preference item
   */
  public static async updatePreference(
    userId: string,
    payload: MemoryUpdatePayload,
    existingMemories: FashionMemoryItem[]
  ): Promise<{ updatedItem: FashionMemoryItem; isNew: boolean }> {
    const category = payload.category;
    const subcategory = payload.subcategory || 'general';
    const source: MemorySource = payload.source || 'user_explicit';
    const level: MemoryLevel = payload.level || 'preference';

    // Find if a memory already exists for this exact category + subcategory
    const existingIndex = existingMemories.findIndex(
      (m) => m.category === category && (m.subcategory || 'general') === subcategory
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = existingMemories[existingIndex];

      // Calculate confidence adjustment
      const action = source === 'correction' ? 'CORRECT' : 'REINFORCE';
      const newConfidence = MemoryConfidenceEvaluator.adjustConfidence(existing, action);

      const updatedItem: FashionMemoryItem = {
        ...existing,
        value: payload.value,
        confidence: payload.confidence ?? newConfidence,
        source: source,
        level: level,
        updatedAt: now,
        metadata: {
          ...existing.metadata,
          ...payload.metadata,
          interactionCount: (existing.metadata?.interactionCount || 1) + 1
        }
      };

      await memoryStorageAdapter.saveMemoryItem(userId, updatedItem);
      return { updatedItem, isNew: false };
    } else {
      const initialConfidence = payload.confidence ?? MemoryConfidenceEvaluator.calculateInitialConfidence(source, level);

      const newItem: FashionMemoryItem = {
        id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        category,
        subcategory,
        value: payload.value,
        confidence: initialConfidence,
        source,
        level,
        createdAt: now,
        updatedAt: now,
        metadata: {
          ...payload.metadata,
          interactionCount: 1
        }
      };

      await memoryStorageAdapter.saveMemoryItem(userId, newItem);
      return { updatedItem: newItem, isNew: true };
    }
  }

  /**
   * Delete memory item
   */
  public static async deletePreference(userId: string, itemId: string): Promise<boolean> {
    return await memoryStorageAdapter.deleteMemoryItem(userId, itemId);
  }
}
