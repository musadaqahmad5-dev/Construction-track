/**
 * ARIA v2.5 Decision Storage Adapter
 * Product: LOOK VISION v2.4
 */

import { FashionRecommendation } from './DecisionTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, setDoc, getDocs, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';

const LOCAL_DECISIONS_KEY = 'lookvision_aria_decisions_v2.5';

export class DecisionStorage {
  private static instance: DecisionStorage;

  private constructor() {}

  public static getInstance(): DecisionStorage {
    if (!DecisionStorage.instance) {
      DecisionStorage.instance = new DecisionStorage();
    }
    return DecisionStorage.instance;
  }

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

  public async saveRecommendation(userId: string, recommendation: FashionRecommendation): Promise<void> {
    const history = this.getLocalHistory();
    history.unshift(recommendation);
    this.setLocalHistory(history);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      const recRef = doc(db, 'users', userId, 'aria', 'decisions', 'history', recommendation.recommendationId);
      await setDoc(recRef, {
        ...recommendation,
        savedAt: serverTimestamp()
      }, { merge: true });

      const scoreRef = doc(db, 'users', userId, 'aria', 'decisions', 'scores', recommendation.recommendationId);
      await setDoc(scoreRef, {
        recommendationId: recommendation.recommendationId,
        overallScore: recommendation.overallScore,
        confidence: recommendation.confidence,
        scoringBreakdown: recommendation.scoringBreakdown,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[DecisionStorage] Firestore save decision skipped/deferred:', err);
    }
  }

  public async fetchHistory(userId: string): Promise<FashionRecommendation[]> {
    const local = this.getLocalHistory();

    if (isFirestoreOfflineFallbackActive || !db || !userId) {
      return local;
    }

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'decisions', 'history');
      const snapDocs = await getDocs(colRef);
      const fetched: FashionRecommendation[] = [];
      snapDocs.forEach((d) => {
        fetched.push(d.data() as FashionRecommendation);
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setLocalHistory(fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[DecisionStorage] Firestore fetch decisions fallback to local:', err);
    }

    return local;
  }

  public async deleteRecommendation(userId: string, recommendationId: string): Promise<boolean> {
    const history = this.getLocalHistory().filter(r => r.recommendationId !== recommendationId);
    this.setLocalHistory(history);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return true;

    try {
      const recRef = doc(db, 'users', userId, 'aria', 'decisions', 'history', recommendationId);
      await deleteDoc(recRef);
      const scoreRef = doc(db, 'users', userId, 'aria', 'decisions', 'scores', recommendationId);
      await deleteDoc(scoreRef);
      return true;
    } catch (err) {
      console.warn('[DecisionStorage] Firestore delete decision error:', err);
      return true;
    }
  }
}

export const decisionStorage = DecisionStorage.getInstance();
