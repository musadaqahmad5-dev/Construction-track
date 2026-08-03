/**
 * ARIA v2.5 Memory Service (Express / Backend Engine)
 * Product: LOOK VISION v2.4
 */

export interface ServerMemoryItem {
  id: string;
  userId?: string;
  category: string;
  subcategory?: string;
  value: any;
  confidence: number;
  source: string;
  level: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export class ARIAMemoryService {
  private static instance: ARIAMemoryService;
  private serverMemoryStore: Map<string, ServerMemoryItem[]> = new Map();

  private constructor() {}

  public static getInstance(): ARIAMemoryService {
    if (!ARIAMemoryService.instance) {
      ARIAMemoryService.instance = new ARIAMemoryService();
    }
    return ARIAMemoryService.instance;
  }

  /**
   * Process memory update or creation
   */
  public async updateMemory(
    userId: string,
    payload: {
      category: string;
      subcategory?: string;
      value: any;
      confidence?: number;
      source?: string;
      level?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<ServerMemoryItem> {
    const userMemories = this.serverMemoryStore.get(userId) || [];
    const now = new Date().toISOString();

    const existingIndex = userMemories.findIndex(
      (m) => m.category === payload.category && (m.subcategory || 'general') === (payload.subcategory || 'general')
    );

    if (existingIndex >= 0) {
      const existing = userMemories[existingIndex];
      const updatedItem: ServerMemoryItem = {
        ...existing,
        value: payload.value,
        confidence: payload.confidence ?? Math.min(1.0, existing.confidence + 0.05),
        source: payload.source || existing.source,
        level: payload.level || existing.level,
        updatedAt: now,
        metadata: {
          ...existing.metadata,
          ...payload.metadata
        }
      };

      userMemories[existingIndex] = updatedItem;
      this.serverMemoryStore.set(userId, userMemories);
      return updatedItem;
    } else {
      const newItem: ServerMemoryItem = {
        id: `mem_srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        category: payload.category,
        subcategory: payload.subcategory || 'general',
        value: payload.value,
        confidence: payload.confidence ?? 0.90,
        source: payload.source || 'user_explicit',
        level: payload.level || 'preference',
        createdAt: now,
        updatedAt: now,
        metadata: payload.metadata || {}
      };

      userMemories.unshift(newItem);
      this.serverMemoryStore.set(userId, userMemories);
      return newItem;
    }
  }

  /**
   * Retrieve memory context summary for a user
   */
  public async getMemoryContext(userId: string): Promise<{
    userId: string;
    totalMemories: number;
    memories: ServerMemoryItem[];
    lastSyncedAt: string;
  }> {
    const userMemories = this.serverMemoryStore.get(userId) || [];
    return {
      userId,
      totalMemories: userMemories.length,
      memories: userMemories,
      lastSyncedAt: new Date().toISOString()
    };
  }

  /**
   * Delete memory item by ID
   */
  public async deleteMemoryItem(userId: string, itemId: string): Promise<boolean> {
    const userMemories = this.serverMemoryStore.get(userId) || [];
    const filtered = userMemories.filter((m) => m.id !== itemId);
    const removed = filtered.length < userMemories.length;
    if (removed) {
      this.serverMemoryStore.set(userId, filtered);
    }
    return removed;
  }
}

export const ariaMemoryService = ARIAMemoryService.getInstance();
