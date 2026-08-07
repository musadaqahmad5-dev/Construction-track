/**
 * ARIA v3.2 Vision Storage Adapter
 * Product: LOOK VISION v2.4
 * 
 * Manages Firestore persistence and offline local storage for ARIA Visual Intelligence.
 * Paths:
 * - User Visual Analyses: users/{uid}/aria/vision/{analysisId}
 * - Global Visual Knowledge: global/aria/visualKnowledge/{analysisId}
 * - Offline Local Cache: aria_visual_cache_v3.2
 */

import { VisualFashionAnalysis, VisionAnalysisResult } from './VisionTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, setDoc, getDocs, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';

const LOCAL_VISUAL_CACHE_KEY = 'aria_visual_cache_v3.2';

export class VisionStorage {
  private static instance: VisionStorage;

  private constructor() {}

  public static getInstance(): VisionStorage {
    if (!VisionStorage.instance) {
      VisionStorage.instance = new VisionStorage();
    }
    return VisionStorage.instance;
  }

  public getLocalHistory(): any[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_VISUAL_CACHE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[VisionStorage] Local visual cache read error:', err);
    }
    return [];
  }

  public setLocalHistory(history: any[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_VISUAL_CACHE_KEY, JSON.stringify(history.slice(0, 50)));
      }
    } catch (err) {
      console.warn('[VisionStorage] Local visual cache write error:', err);
    }
  }

  /**
   * Save a Visual Fashion Analysis record to local cache and Firestore
   */
  public async saveVisualAnalysis(userId: string, analysis: VisualFashionAnalysis): Promise<void> {
    const history = this.getLocalHistory();
    history.unshift(analysis);
    this.setLocalHistory(history);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      // 1. User specific analysis document at users/{uid}/aria/vision/{analysisId}
      const userDocRef = doc(db, 'users', userId, 'aria', 'vision', analysis.analysisId);
      await setDoc(userDocRef, {
        ...analysis,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 2. Global visual knowledge document at global/aria/visualKnowledge/{analysisId}
      const globalDocRef = doc(db, 'global', 'aria', 'visualKnowledge', analysis.analysisId);
      await setDoc(globalDocRef, {
        analysisId: analysis.analysisId,
        imageName: analysis.imageName,
        garmentCount: analysis.garments.length,
        aestheticTag: analysis.visualEmbedding.aestheticTag,
        confidence: analysis.confidence.finalVisualConfidence,
        createdAt: analysis.createdAt,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});

    } catch (err) {
      console.warn('[VisionStorage] Firestore sync deferred:', err);
    }
  }

  /**
   * Legacy adapter method for backwards compatibility
   */
  public async saveAnalysis(userId: string, result: VisionAnalysisResult): Promise<void> {
    const history = this.getLocalHistory();
    history.unshift(result);
    this.setLocalHistory(history);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      const userDocRef = doc(db, 'users', userId, 'aria', 'vision', result.analysisId);
      await setDoc(userDocRef, {
        ...result,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[VisionStorage] Legacy save skipped:', err);
    }
  }

  public async fetchHistory(userId: string): Promise<any[]> {
    const local = this.getLocalHistory();

    if (isFirestoreOfflineFallbackActive || !db || !userId) {
      return local;
    }

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'vision');
      const snapDocs = await getDocs(colRef);
      const fetched: any[] = [];
      snapDocs.forEach((d) => {
        fetched.push(d.data());
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setLocalHistory(fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[VisionStorage] Firestore fetch fallback to local cache:', err);
    }

    return local;
  }

  public async deleteAnalysis(userId: string, analysisId: string): Promise<boolean> {
    const history = this.getLocalHistory().filter((c: any) => c.analysisId !== analysisId);
    this.setLocalHistory(history);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return true;

    try {
      const docRef = doc(db, 'users', userId, 'aria', 'vision', analysisId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn('[VisionStorage] Firestore delete error:', err);
      return true;
    }
  }
}

export const visionStorage = VisionStorage.getInstance();
