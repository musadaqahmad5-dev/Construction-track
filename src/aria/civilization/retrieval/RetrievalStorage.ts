/**
 * ARIA v2.6 Retrieval Storage & Cache Adapter
 * Product: LOOK VISION v2.4
 * 
 * Manages Firestore persistence and offline local caching for Civilization Knowledge
 * Retrieval queries, reasoning caches, and retrieval history.
 * 
 * Paths:
 * - Reasoning Cache: global/civilization/reasoningCache/{cacheId}
 * - User History: users/{uid}/aria/retrievalHistory/{queryId}
 */

import { RetrievalCacheEntry } from './RetrievalTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../../firebase';
import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';

const LOCAL_REASONING_CACHE_KEY = 'aria_civ_retrieval_cache_v2.6';
const LOCAL_RETRIEVAL_HISTORY_KEY = 'aria_civ_retrieval_history_v2.6';

export class RetrievalStorage {
  private static instance: RetrievalStorage;

  private constructor() {}

  public static getInstance(): RetrievalStorage {
    if (!RetrievalStorage.instance) {
      RetrievalStorage.instance = new RetrievalStorage();
    }
    return RetrievalStorage.instance;
  }

  // --- LOCAL OFFLINE CACHE ---

  public getLocalCache(): RetrievalCacheEntry[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_REASONING_CACHE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[RetrievalStorage] Error reading local reasoning cache:', err);
    }
    return [];
  }

  public setLocalCache(cache: RetrievalCacheEntry[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_REASONING_CACHE_KEY, JSON.stringify(cache.slice(0, 50)));
      }
    } catch (err) {
      console.warn('[RetrievalStorage] Error saving local reasoning cache:', err);
    }
  }

  public getLocalHistory(userId: string): RetrievalCacheEntry[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`${LOCAL_RETRIEVAL_HISTORY_KEY}_${userId}`);
        if (raw) return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[RetrievalStorage] Error reading local retrieval history:', err);
    }
    return [];
  }

  public setLocalHistory(userId: string, history: RetrievalCacheEntry[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${LOCAL_RETRIEVAL_HISTORY_KEY}_${userId}`, JSON.stringify(history.slice(0, 50)));
      }
    } catch (err) {
      console.warn('[RetrievalStorage] Error saving local retrieval history:', err);
    }
  }

  // --- FIRESTORE PERSISTENCE ---

  /**
   * Saves retrieval query entry to reasoningCache & user history
   */
  public async saveRetrievalEntry(entry: RetrievalCacheEntry): Promise<void> {
    const userId = entry.userId || 'guest_user';

    // Local cache save
    const cache = this.getLocalCache();
    cache.unshift(entry);
    this.setLocalCache(cache);

    const history = this.getLocalHistory(userId);
    history.unshift(entry);
    this.setLocalHistory(userId, history);

    if (isFirestoreOfflineFallbackActive || !db) return;

    try {
      // Global Reasoning Cache: global/civilization/reasoningCache/{cacheId}
      const cacheRef = doc(db, 'global', 'civilization', 'reasoningCache', entry.cacheId);
      await setDoc(cacheRef, {
        ...entry,
        savedAtServer: serverTimestamp()
      }, { merge: true });

      // User Retrieval History: users/{uid}/aria/retrievalHistory/{queryId}
      if (userId !== 'guest_user') {
        const userHistRef = doc(db, 'users', userId, 'aria', 'retrievalHistory', entry.cacheId);
        await setDoc(userHistRef, {
          ...entry,
          savedAtServer: serverTimestamp()
        }, { merge: true });
      }
    } catch (err) {
      console.warn('[RetrievalStorage] Firestore save retrieval entry deferred:', err);
    }
  }

  /**
   * Fetches user retrieval history
   */
  public async fetchUserRetrievalHistory(userId: string): Promise<RetrievalCacheEntry[]> {
    const local = this.getLocalHistory(userId);

    if (isFirestoreOfflineFallbackActive || !db || !userId || userId === 'guest_user') {
      return local;
    }

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'retrievalHistory');
      const snap = await getDocs(colRef);
      const fetched: RetrievalCacheEntry[] = [];

      snap.forEach((d) => {
        const data = d.data() as RetrievalCacheEntry;
        if (data.cacheId) fetched.push(data);
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setLocalHistory(userId, fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[RetrievalStorage] Firestore fetch retrieval history fallback:', err);
    }

    return local;
  }
}

export const retrievalStorage = RetrievalStorage.getInstance();
