import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, doc, getDoc, setDoc, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

export interface StyleProfile {
  userId: string;
  styleVector: number[]; // [minimalist, streetwear, classic, luxury, cyberpunk, traditional, casual, formal]
  vibe: string;
  updatedAt: any;
  feedbackCounter: {
    wears: number;
    skips: number;
    modifies: number;
  };
}

export interface StylistHistoryEntry {
  id?: string;
  userId: string;
  outfitId: string;
  outfitName: string;
  action: 'WORN_CONFIRMED' | 'SKIPPED' | 'MODIFIED_FIT';
  timestamp: any;
  suitabilityScore: number;
  moment: string;
  reflection: string;
}

export class ProfileService {
  private static localProfileCache: Record<string, StyleProfile> = {};
  private static syncQueue: StylistHistoryEntry[] = [];
  private static syncInterval: any = null;

  /**
   * Loads the style profile with caching and offline-first fallback.
 *   */
  static async loadProfile(userId: string): Promise<StyleProfile> {
    if (!userId) {
      throw new Error('UserId is required to load style profile');
    }

    // Check local memory cache first
    if (this.localProfileCache[userId]) {
      return this.localProfileCache[userId];
    }

    // Check localStorage fallback
    const key = `style_profile_${userId}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as StyleProfile;
        this.localProfileCache[userId] = parsed;
        return parsed;
      } catch (e) {
        console.warn('Stale profile cache cleared:', e);
      }
    }

    // Default Profile DNA
    const defaultProfile: StyleProfile = {
      userId,
      styleVector: [0.6, 0.5, 0.4, 0.5, 0.3, 0.4, 0.5, 0.5],
      vibe: 'minimalist',
      updatedAt: new Date().toISOString(),
      feedbackCounter: { wears: 0, skips: 0, modifies: 0 }
    };

    // If guest/anonymous, return default immediately
    if (userId.startsWith('guest-') || userId === 'active_user') {
      this.localProfileCache[userId] = defaultProfile;
      localStorage.setItem(key, JSON.stringify(defaultProfile));
      return defaultProfile;
    }

    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<StyleProfile, 'userId'>;
        const profile = { userId, ...data } as StyleProfile;
        this.localProfileCache[userId] = profile;
        localStorage.setItem(key, JSON.stringify(profile));
        return profile;
      } else {
        // Safe initialize in remote Firestore
        await setDoc(docRef, {
          styleVector: defaultProfile.styleVector,
          vibe: defaultProfile.vibe,
          updatedAt: serverTimestamp(),
          feedbackCounter: defaultProfile.feedbackCounter
        });
        this.localProfileCache[userId] = defaultProfile;
        localStorage.setItem(key, JSON.stringify(defaultProfile));
        return defaultProfile;
      }
    } catch (e) {
      console.warn('Firestore profile fetch fallback to default:', e);
      this.localProfileCache[userId] = defaultProfile;
      return defaultProfile;
    }
  }

  /**
   * Saves the style profile locally, and queues/writes to Firestore.
   */
  static async saveProfile(userId: string, profile: StyleProfile): Promise<void> {
    this.localProfileCache[userId] = profile;
    localStorage.setItem(`style_profile_${userId}`, JSON.stringify(profile));

    if (userId.startsWith('guest-') || userId === 'active_user') {
      return;
    }

    try {
      const docRef = doc(db, 'profiles', userId);
      await setDoc(docRef, {
        styleVector: profile.styleVector,
        vibe: profile.vibe,
        updatedAt: serverTimestamp(),
        feedbackCounter: profile.feedbackCounter
      }, { merge: true });
    } catch (e) {
      console.error('Failed to update remote profile:', e);
    }
  }

  /**
   * Log feedback action (worn, skipped, modified) offline-first, queued for batch syncing.
   */
  static logFeedback(userId: string, entry: Omit<StylistHistoryEntry, 'userId' | 'timestamp'>): void {
    const fullEntry: StylistHistoryEntry = {
      ...entry,
      userId,
      timestamp: new Date().toISOString()
    };

    // 1. Store in memory queue
    this.syncQueue.push(fullEntry);

    // 2. Append to local history list
    const historyKey = `history_log_${userId}`;
    try {
      const currentVal = JSON.parse(localStorage.getItem(historyKey) || '[]');
      currentVal.unshift(fullEntry);
      localStorage.setItem(historyKey, JSON.stringify(currentVal.slice(0, 100))); // Cap at 100 items locally
    } catch (e) {}

    // 3. Proactively trigger batch synchronization check
    this.flushQueue();
  }

  /**
   * Background batched queue synchronization to Firebase.
   */
  static async flushQueue(): Promise<void> {
    if (this.syncQueue.length === 0) return;

    const batch = [...this.syncQueue];
    this.syncQueue = []; // clear queue to prevent multi-sync collisions

    for (const entry of batch) {
      // Guest modes do not sync to remote db
      if (entry.userId.startsWith('guest-') || entry.userId === 'active_user') {
        continue;
      }

      try {
        await addDoc(collection(db, 'history'), {
          userId: entry.userId,
          outfitId: entry.outfitId,
          outfitName: entry.outfitName,
          action: entry.action,
          timestamp: serverTimestamp(),
          suitabilityScore: entry.suitabilityScore,
          moment: entry.moment,
          reflection: entry.reflection
        });
      } catch (e) {
        console.warn('Failed to upload historical entry, re-queueing:', e);
        this.syncQueue.push(entry); // put back in queue to try again
      }
    }
  }

  /**
   * Setup background timer to batch synchronize feedback.
   */
  static startSyncTimer(): void {
    if (this.syncInterval) return;
    this.syncInterval = setInterval(() => {
      this.flushQueue();
    }, 60000); // sync every 60 seconds of inactivity
  }
}
