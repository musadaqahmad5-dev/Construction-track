/**
 * ARIA v2.5 Decision Storage & Metrics Adapter
 * Product: LOOK VISION v2.4
 * 
 * Manages Firestore persistence and offline local caching for ARIA Contextual Decisions.
 * Path 1: users/{uid}/aria/decisions/{decisionId}
 * Path 2: users/{uid}/intelligence/recommendationMetrics
 */

import { FashionRecommendation, RecommendationMetrics, DecisionFeedbackAction } from './DecisionTypes';
import { db, auth, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, setDoc, getDoc, getDocs, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';

const LOCAL_DECISIONS_KEY = 'lookvision_aria_decisions_v2.5';
const LOCAL_METRICS_KEY = 'lookvision_aria_metrics_v2.5';

export class DecisionStorage {
  private static instance: DecisionStorage;

  private constructor() {}

  public static getInstance(): DecisionStorage {
    if (!DecisionStorage.instance) {
      DecisionStorage.instance = new DecisionStorage();
    }
    return DecisionStorage.instance;
  }

  // --- LOCAL STORAGE CACHE ---

  public getLocalHistory(): FashionRecommendation[] {
    try {
      const raw = localStorage.getItem(LOCAL_DECISIONS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DecisionStorage] Error reading local decisions:', err);
    }
    return [];
  }

  public setLocalHistory(history: FashionRecommendation[]): void {
    try {
      localStorage.setItem(LOCAL_DECISIONS_KEY, JSON.stringify(history.slice(0, 100)));
    } catch (err) {
      console.warn('[DecisionStorage] Error saving local decisions:', err);
    }
  }

  public getLocalMetrics(userId: string): RecommendationMetrics {
    try {
      const raw = localStorage.getItem(`${LOCAL_METRICS_KEY}_${userId}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DecisionStorage] Error reading local metrics:', err);
    }
    return {
      userId,
      totalDecisionsGenerated: 0,
      totalAccepted: 0,
      totalRejected: 0,
      totalModified: 0,
      acceptanceRate: 0.0,
      averageConfidence: 0.85,
      averageLatencyMs: 140,
      lastUpdated: new Date().toISOString()
    };
  }

  public setLocalMetrics(userId: string, metrics: RecommendationMetrics): void {
    try {
      localStorage.setItem(`${LOCAL_METRICS_KEY}_${userId}`, JSON.stringify(metrics));
    } catch (err) {
      console.warn('[DecisionStorage] Error saving local metrics:', err);
    }
  }

  // --- FIRESTORE PERSISTENCE ---

  /**
   * Saves decision to users/{uid}/aria/decisions/{decisionId} and history collection
   */
  public async saveRecommendation(userId: string, recommendation: FashionRecommendation): Promise<void> {
    const history = this.getLocalHistory();
    const existingIndex = history.findIndex(r => r.recommendationId === recommendation.recommendationId);
    if (existingIndex >= 0) {
      history[existingIndex] = recommendation;
    } else {
      history.unshift(recommendation);
    }
    this.setLocalHistory(history);

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      userId === 'guest_user' ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return;
    }

    try {
      // Primary specified path: users/{uid}/aria/decisions/{decisionId}
      const primaryRef = doc(db, 'users', userId, 'aria', 'decisions', recommendation.recommendationId);
      await setDoc(primaryRef, {
        ...recommendation,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Sub-collection backup path: users/{uid}/aria/decisions/history/{decisionId}
      const historyRef = doc(db, 'users', userId, 'aria', 'decisions', 'history', recommendation.recommendationId);
      await setDoc(historyRef, {
        ...recommendation,
        savedAt: serverTimestamp()
      }, { merge: true });
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[DecisionStorage] Firestore decision save deferred:', err);
      }
    }
  }

  /**
   * Fetches decisions history from Firestore / local storage
   */
  public async fetchHistory(userId: string): Promise<FashionRecommendation[]> {
    const local = this.getLocalHistory();

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      userId === 'guest_user' ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return local;
    }

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'decisions');
      const snapDocs = await getDocs(colRef);
      const fetched: FashionRecommendation[] = [];

      snapDocs.forEach((d) => {
        const data = d.data() as FashionRecommendation;
        if (data.recommendationId) {
          fetched.push(data);
        }
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setLocalHistory(fetched);
        return fetched;
      }
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[DecisionStorage] Firestore fetch decisions fallback to local:', err);
      }
    }

    return local;
  }

  /**
   * Deletes recommendation from Firestore / local storage
   */
  public async deleteRecommendation(userId: string, recommendationId: string): Promise<boolean> {
    const history = this.getLocalHistory().filter(r => r.recommendationId !== recommendationId);
    this.setLocalHistory(history);

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      userId === 'guest_user' ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return true;
    }

    try {
      const primaryRef = doc(db, 'users', userId, 'aria', 'decisions', recommendationId);
      await deleteDoc(primaryRef);

      const historyRef = doc(db, 'users', userId, 'aria', 'decisions', 'history', recommendationId);
      await deleteDoc(historyRef);
      return true;
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[DecisionStorage] Firestore delete recommendation error:', err);
      }
      return false;
    }
  }

  /**
   * Saves metrics to users/{uid}/intelligence/recommendationMetrics
   */
  public async saveRecommendationMetrics(userId: string, metrics: RecommendationMetrics): Promise<void> {
    this.setLocalMetrics(userId, metrics);

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      userId === 'guest_user' ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return;
    }

    try {
      const metricsRef = doc(db, 'users', userId, 'intelligence', 'recommendationMetrics');
      await setDoc(metricsRef, {
        ...metrics,
        lastUpdatedServer: serverTimestamp()
      }, { merge: true });
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[DecisionStorage] Firestore save metrics deferred:', err);
      }
    }
  }

  /**
   * Fetches recommendation metrics
   */
  public async fetchRecommendationMetrics(userId: string): Promise<RecommendationMetrics> {
    const local = this.getLocalMetrics(userId);

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      userId === 'guest_user' ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return local;
    }

    try {
      const metricsRef = doc(db, 'users', userId, 'intelligence', 'recommendationMetrics');
      const snap = await getDoc(metricsRef);
      if (snap.exists()) {
        const data = snap.data() as RecommendationMetrics;
        this.setLocalMetrics(userId, data);
        return data;
      }
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[DecisionStorage] Firestore fetch metrics fallback to local:', err);
      }
    }

    return local;
  }
}

export const decisionStorage = DecisionStorage.getInstance();
