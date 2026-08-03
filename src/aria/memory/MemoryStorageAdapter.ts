/**
 * ARIA v2.5 Memory Storage Adapter (Firebase Firestore & Offline Fallback)
 * Product: LOOK VISION v2.4
 */

import { FashionMemoryItem, MemoryStatus, MemoryQueryFilter } from './MemoryTypes';
import { db, auth, isFirestoreOfflineFallbackActive } from '../../firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'lookvision_aria_memory_store_v2.5';

export class MemoryStorageAdapter {
  private static instance: MemoryStorageAdapter;

  private constructor() {}

  public static getInstance(): MemoryStorageAdapter {
    if (!MemoryStorageAdapter.instance) {
      MemoryStorageAdapter.instance = new MemoryStorageAdapter();
    }
    return MemoryStorageAdapter.instance;
  }

  /**
   * Helper to load memories from localStorage (Offline Fallback)
   */
  private getLocalMemories(): FashionMemoryItem[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[MemoryStorageAdapter] Error reading local storage:', err);
    }
    return [];
  }

  /**
   * Helper to save memories to localStorage
   */
  private setLocalMemories(memories: FashionMemoryItem[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memories));
    } catch (err) {
      console.warn('[MemoryStorageAdapter] Error writing local storage:', err);
    }
  }

  /**
   * Save or update a memory item in Firestore and Local Storage
   */
  public async saveMemoryItem(userId: string, item: FashionMemoryItem): Promise<void> {
    // 1. Update Local Storage immediately for offline capability
    const local = this.getLocalMemories();
    const existingIndex = local.findIndex((m) => m.id === item.id);
    if (existingIndex >= 0) {
      local[existingIndex] = item;
    } else {
      local.unshift(item);
    }
    this.setLocalMemories(local);

    // 2. Persist to Firestore: users/{userId}/aria/memory/preferences/{itemId}
    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      const subcollection = item.category === 'wardrobe_behavior' 
        ? 'wardrobeSignals' 
        : item.category === 'feedback' || item.category === 'user_correction'
        ? 'interactions'
        : 'preferences';

      const ref = doc(db, 'users', userId, 'aria', 'memory', subcollection, item.id);
      await setDoc(ref, {
        ...item,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Update metadata document
      const metaRef = doc(db, 'users', userId, 'aria', 'memory', 'metadata', 'stats');
      await setDoc(metaRef, {
        lastSyncedAt: serverTimestamp(),
        totalItems: local.length,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[MemoryStorageAdapter] Firestore save skipped/deferred:', err);
    }
  }

  /**
   * Delete memory item by ID
   */
  public async deleteMemoryItem(userId: string, itemId: string): Promise<boolean> {
    // 1. Remove from Local Storage
    const local = this.getLocalMemories();
    const itemToDelete = local.find(m => m.id === itemId);
    const updated = local.filter((m) => m.id !== itemId);
    this.setLocalMemories(updated);

    if (!itemToDelete) return false;

    // 2. Remove from Firestore
    if (isFirestoreOfflineFallbackActive || !db || !userId) return true;

    try {
      const subcollection = itemToDelete.category === 'wardrobe_behavior' 
        ? 'wardrobeSignals' 
        : itemToDelete.category === 'feedback' || itemToDelete.category === 'user_correction'
        ? 'interactions'
        : 'preferences';

      const ref = doc(db, 'users', userId, 'aria', 'memory', subcollection, itemId);
      await deleteDoc(ref);
      return true;
    } catch (err) {
      console.warn('[MemoryStorageAdapter] Firestore delete error:', err);
      return true; // Still removed from local store
    }
  }

  /**
   * Fetch all memory items for a user
   */
  public async fetchAllMemories(userId: string): Promise<FashionMemoryItem[]> {
    const local = this.getLocalMemories();

    if (isFirestoreOfflineFallbackActive || !db || !userId) {
      return local;
    }

    try {
      const collectionsToFetch = ['preferences', 'interactions', 'wardrobeSignals'];
      const fetchedItems: FashionMemoryItem[] = [];

      for (const subcol of collectionsToFetch) {
        const colRef = collection(db, 'users', userId, 'aria', 'memory', subcol);
        const snap = await getDocs(colRef);
        snap.forEach((docSnap) => {
          fetchedItems.push(docSnap.data() as FashionMemoryItem);
        });
      }

      if (fetchedItems.length > 0) {
        // Synchronize local cache with remote Firestore data
        this.setLocalMemories(fetchedItems);
        return fetchedItems;
      }
    } catch (err) {
      console.warn('[MemoryStorageAdapter] Firestore fetch fallback to local:', err);
    }

    return local;
  }
}

export const memoryStorageAdapter = MemoryStorageAdapter.getInstance();
