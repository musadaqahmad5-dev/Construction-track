/**
 * ARIA v2.5 Style Evolution Storage Adapter
 * Handles Firestore & Local Storage persistence for Evolution Snapshots, Feedback Events, and Intelligence Summaries.
 * Product: LOOK VISION v2.4
 */

import {
  StyleEvolutionSnapshot,
  UserFeedbackEvent,
  IntelligenceSummary
} from './StyleEvolutionTypes';
import { db, auth, isFirestoreOfflineFallbackActive } from '../../firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

const LOCAL_EVOLUTION_PREFIX = 'lookvision_aria_evolution_timeline_';
const LOCAL_FEEDBACK_PREFIX = 'lookvision_aria_feedback_history_';
const LOCAL_INTELLIGENCE_PREFIX = 'lookvision_aria_intelligence_summary_';

export class StyleEvolutionStorage {
  private static instance: StyleEvolutionStorage;

  private constructor() {}

  public static getInstance(): StyleEvolutionStorage {
    if (!StyleEvolutionStorage.instance) {
      StyleEvolutionStorage.instance = new StyleEvolutionStorage();
    }
    return StyleEvolutionStorage.instance;
  }

  // ============================================================================
  // EVOLUTION SNAPSHOTS
  // ============================================================================

  public getLocalEvolutionHistory(userId: string): StyleEvolutionSnapshot[] {
    try {
      const raw = localStorage.getItem(`${LOCAL_EVOLUTION_PREFIX}${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('[StyleEvolutionStorage] Error loading local evolution history:', e);
    }
    return [];
  }

  public saveLocalEvolutionHistory(userId: string, history: StyleEvolutionSnapshot[]): void {
    try {
      localStorage.setItem(
        `${LOCAL_EVOLUTION_PREFIX}${userId}`,
        JSON.stringify(history.slice(0, 100))
      );
    } catch (e) {
      console.warn('[StyleEvolutionStorage] Error saving local evolution history:', e);
    }
  }

  public async saveEvolutionSnapshot(userId: string, snapshot: StyleEvolutionSnapshot): Promise<void> {
    const history = this.getLocalEvolutionHistory(userId);
    history.unshift(snapshot);
    this.saveLocalEvolutionHistory(userId, history);

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return;
    }

    try {
      // Document path: users/{uid}/evolution/{snapshotId}
      const snapRef = doc(db, 'users', userId, 'evolution', snapshot.snapshotId);
      await setDoc(snapRef, {
        ...snapshot,
        createdAt: serverTimestamp()
      }, { merge: true });
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[StyleEvolutionStorage] Firestore evolution save error, local retained:', err);
      }
    }
  }

  public async fetchEvolutionHistory(userId: string): Promise<StyleEvolutionSnapshot[]> {
    const local = this.getLocalEvolutionHistory(userId);
    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return local;
    }

    try {
      const colRef = collection(db, 'users', userId, 'evolution');
      const snapDocs = await getDocs(colRef);
      const fetched: StyleEvolutionSnapshot[] = [];
      snapDocs.forEach((d) => {
        fetched.push(d.data() as StyleEvolutionSnapshot);
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
        this.saveLocalEvolutionHistory(userId, fetched);
        return fetched;
      }
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[StyleEvolutionStorage] Firestore evolution fetch error, using local:', err);
      }
    }

    return local;
  }

  // ============================================================================
  // USER FEEDBACK EVENTS
  // ============================================================================

  public getLocalFeedbackHistory(userId: string): UserFeedbackEvent[] {
    try {
      const raw = localStorage.getItem(`${LOCAL_FEEDBACK_PREFIX}${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('[StyleEvolutionStorage] Error loading local feedback history:', e);
    }
    return [];
  }

  public saveLocalFeedbackEvent(userId: string, event: UserFeedbackEvent): void {
    try {
      const history = this.getLocalFeedbackHistory(userId);
      history.unshift(event);
      localStorage.setItem(
        `${LOCAL_FEEDBACK_PREFIX}${userId}`,
        JSON.stringify(history.slice(0, 150))
      );
    } catch (e) {
      console.warn('[StyleEvolutionStorage] Error saving local feedback event:', e);
    }
  }

  public async saveFeedbackEvent(userId: string, event: UserFeedbackEvent): Promise<void> {
    this.saveLocalFeedbackEvent(userId, event);

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return;
    }

    try {
      // Document path: users/{uid}/feedback/{feedbackId}
      const fbRef = doc(db, 'users', userId, 'feedback', event.feedbackId);
      await setDoc(fbRef, {
        ...event,
        createdAt: serverTimestamp()
      }, { merge: true });
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[StyleEvolutionStorage] Firestore feedback save error, local retained:', err);
      }
    }
  }

  public async fetchFeedbackHistory(userId: string): Promise<UserFeedbackEvent[]> {
    const local = this.getLocalFeedbackHistory(userId);
    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return local;
    }

    try {
      const colRef = collection(db, 'users', userId, 'feedback');
      const snapDocs = await getDocs(colRef);
      const fetched: UserFeedbackEvent[] = [];
      snapDocs.forEach((d) => {
        fetched.push(d.data() as UserFeedbackEvent);
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return fetched;
      }
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[StyleEvolutionStorage] Firestore feedback fetch error, using local:', err);
      }
    }

    return local;
  }

  // ============================================================================
  // INTELLIGENCE SUMMARY
  // ============================================================================

  public getLocalIntelligenceSummary(userId: string): IntelligenceSummary | null {
    try {
      const raw = localStorage.getItem(`${LOCAL_INTELLIGENCE_PREFIX}${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('[StyleEvolutionStorage] Error loading local intelligence summary:', e);
    }
    return null;
  }

  public async saveIntelligenceSummary(userId: string, summary: IntelligenceSummary): Promise<void> {
    try {
      localStorage.setItem(`${LOCAL_INTELLIGENCE_PREFIX}${userId}`, JSON.stringify(summary));
    } catch (e) {
      console.warn('[StyleEvolutionStorage] Error saving local intelligence summary:', e);
    }

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return;
    }

    try {
      // Document path: users/{uid}/intelligence/summary
      const summaryRef = doc(db, 'users', userId, 'intelligence', 'summary');
      await setDoc(summaryRef, {
        ...summary,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[StyleEvolutionStorage] Firestore summary save error, local retained:', err);
      }
    }
  }

  public async fetchIntelligenceSummary(userId: string): Promise<IntelligenceSummary | null> {
    const local = this.getLocalIntelligenceSummary(userId);
    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return local;
    }

    try {
      const summaryRef = doc(db, 'users', userId, 'intelligence', 'summary');
      const snap = await getDoc(summaryRef);
      if (snap.exists()) {
        const remote = snap.data() as IntelligenceSummary;
        localStorage.setItem(`${LOCAL_INTELLIGENCE_PREFIX}${userId}`, JSON.stringify(remote));
        return remote;
      }
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[StyleEvolutionStorage] Firestore summary fetch error, using local:', err);
      }
    }

    return local;
  }
}

export const styleEvolutionStorage = StyleEvolutionStorage.getInstance();
