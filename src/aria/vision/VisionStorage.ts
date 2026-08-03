/**
 * ARIA v2.5 Vision Storage Adapter
 * Product: LOOK VISION v2.4
 */

import { VisionAnalysisResult } from './VisionTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, setDoc, getDocs, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';

const LOCAL_VISION_KEY = 'lookvision_aria_vision_v2.5';

export class VisionStorage {
  private static instance: VisionStorage;

  private constructor() {}

  public static getInstance(): VisionStorage {
    if (!VisionStorage.instance) {
      VisionStorage.instance = new VisionStorage();
    }
    return VisionStorage.instance;
  }

  public getLocalHistory(): VisionAnalysisResult[] {
    try {
      const raw = localStorage.getItem(LOCAL_VISION_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[VisionStorage] Local storage read error:', err);
    }
    return [];
  }

  public setLocalHistory(history: VisionAnalysisResult[]): void {
    try {
      localStorage.setItem(LOCAL_VISION_KEY, JSON.stringify(history.slice(0, 100)));
    } catch (err) {
      console.warn('[VisionStorage] Local storage write error:', err);
    }
  }

  public async saveAnalysis(userId: string, result: VisionAnalysisResult): Promise<void> {
    const history = this.getLocalHistory();
    history.unshift(result);
    this.setLocalHistory(history);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      // Primary analysis document
      const docRef = doc(db, 'users', userId, 'aria', 'vision', 'analyses', result.analysisId);
      await setDoc(docRef, {
        ...result,
        savedAt: serverTimestamp()
      }, { merge: true });

      // Secondary garment index
      if (result.garments && result.garments.length > 0) {
        const garmentRef = doc(db, 'users', userId, 'aria', 'vision', 'garments', result.analysisId);
        await setDoc(garmentRef, {
          analysisId: result.analysisId,
          garmentCount: result.garments.length,
          categories: result.garments.map(g => g.category),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      // Secondary compatibility index
      const compRef = doc(db, 'users', userId, 'aria', 'vision', 'compatibility', result.analysisId);
      await setDoc(compRef, {
        analysisId: result.analysisId,
        compatibilityScore: result.compatibility.overallCompatibilityScore,
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (err) {
      console.warn('[VisionStorage] Firestore save analysis skipped/deferred:', err);
    }
  }

  public async fetchHistory(userId: string): Promise<VisionAnalysisResult[]> {
    const local = this.getLocalHistory();

    if (isFirestoreOfflineFallbackActive || !db || !userId) {
      return local;
    }

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'vision', 'analyses');
      const snapDocs = await getDocs(colRef);
      const fetched: VisionAnalysisResult[] = [];
      snapDocs.forEach((d) => {
        fetched.push(d.data() as VisionAnalysisResult);
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setLocalHistory(fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[VisionStorage] Firestore fetch analyses fallback to local:', err);
    }

    return local;
  }

  public async deleteAnalysis(userId: string, analysisId: string): Promise<boolean> {
    const history = this.getLocalHistory().filter(c => c.analysisId !== analysisId);
    this.setLocalHistory(history);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return true;

    try {
      const docRef = doc(db, 'users', userId, 'aria', 'vision', 'analyses', analysisId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn('[VisionStorage] Firestore delete analysis error:', err);
      return true;
    }
  }
}

export const visionStorage = VisionStorage.getInstance();
