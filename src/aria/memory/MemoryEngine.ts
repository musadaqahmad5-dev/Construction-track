/**
 * ARIA v2.5 Memory Engine Core Orchestrator
 * Product: LOOK VISION v2.4
 */

import { 
  FashionMemoryItem, 
  MemoryUpdatePayload, 
  MemoryContextSummary, 
  MemoryStatus,
  MemoryQueryFilter 
} from './MemoryTypes';
import { memoryStorageAdapter } from './MemoryStorageAdapter';
import { MemoryUpdater } from './MemoryUpdater';
import { MemoryRetriever } from './MemoryRetriever';

export class MemoryEngine {
  private static instance: MemoryEngine;

  private userId?: string;
  private memories: FashionMemoryItem[] = [];
  private status: MemoryStatus = {
    isInitialized: false,
    isSyncing: false,
    itemCount: 0,
    storageMode: 'offline_local'
  };

  private constructor() {}

  public static getInstance(): MemoryEngine {
    if (!MemoryEngine.instance) {
      MemoryEngine.instance = new MemoryEngine();
    }
    return MemoryEngine.instance;
  }

  /**
   * Initialize memory system for active user
   */
  public async initialize(userId?: string): Promise<MemoryStatus> {
    this.userId = userId;
    this.status.isSyncing = true;

    try {
      const loaded = await memoryStorageAdapter.fetchAllMemories(userId || 'guest_user');
      this.memories = loaded;
      this.status = {
        isInitialized: true,
        isSyncing: false,
        itemCount: loaded.length,
        storageMode: userId ? 'firestore' : 'offline_local',
        lastSyncedAt: new Date().toISOString()
      };
    } catch (err: any) {
      console.warn('[MemoryEngine] Initialize error, using fallback:', err);
      this.status = {
        isInitialized: true,
        isSyncing: false,
        itemCount: this.memories.length,
        storageMode: 'offline_local',
        lastError: err.message || 'Initialization fallback active',
        lastSyncedAt: new Date().toISOString()
      };
    }

    return this.status;
  }

  /**
   * Sync memory state with backend API / Firestore
   */
  public async sync(): Promise<MemoryStatus> {
    return await this.initialize(this.userId);
  }

  /**
   * Add or update explicit user preference memory
   */
  public async updateMemory(payload: MemoryUpdatePayload): Promise<FashionMemoryItem> {
    const activeUserId = this.userId || 'guest_user';
    const { updatedItem } = await MemoryUpdater.updatePreference(activeUserId, payload, this.memories);

    // Update in-memory state
    const index = this.memories.findIndex((m) => m.id === updatedItem.id);
    if (index >= 0) {
      this.memories[index] = updatedItem;
    } else {
      this.memories.unshift(updatedItem);
    }

    this.status.itemCount = this.memories.length;
    this.status.lastSyncedAt = new Date().toISOString();

    return updatedItem;
  }

  /**
   * Remove a memory item
   */
  public async deleteMemory(itemId: string): Promise<boolean> {
    const activeUserId = this.userId || 'guest_user';
    const success = await MemoryUpdater.deletePreference(activeUserId, itemId);
    if (success) {
      this.memories = this.memories.filter((m) => m.id !== itemId);
      this.status.itemCount = this.memories.length;
    }
    return success;
  }

  /**
   * Get all active memories filtered
   */
  public getMemories(filter?: MemoryQueryFilter): FashionMemoryItem[] {
    return MemoryRetriever.filterMemories(this.memories, filter);
  }

  /**
   * Get context summary for AI prompt context injection
   */
  public getContextSummary(): MemoryContextSummary {
    return MemoryRetriever.buildContextSummary(this.userId, this.memories);
  }

  /**
   * Get formatted prompt string
   */
  public getPromptFormattedSummary(): string {
    const summary = this.getContextSummary();
    return MemoryRetriever.formatSummaryForPrompt(summary);
  }

  /**
   * Get system memory status
   */
  public getStatus(): MemoryStatus {
    return { ...this.status };
  }
}

export const memoryEngine = MemoryEngine.getInstance();
