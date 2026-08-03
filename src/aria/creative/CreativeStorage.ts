/**
 * ARIA v2.5 Creative Storage Adapter
 * Product: LOOK VISION v2.4
 */

import { CreativeConcept } from './CreativeTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, setDoc, getDocs, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';

const LOCAL_CREATIVE_KEY = 'lookvision_aria_creative_v2.5';

export class CreativeStorage {
  private static instance: CreativeStorage;

  private constructor() {}

  public static getInstance(): CreativeStorage {
    if (!CreativeStorage.instance) {
      CreativeStorage.instance = new CreativeStorage();
    }
    return CreativeStorage.instance;
  }

  public getLocalHistory(): CreativeConcept[] {
    try {
      const raw = localStorage.getItem(LOCAL_CREATIVE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[CreativeStorage] Local storage read error:', err);
    }
    return [];
  }

  public setLocalHistory(history: CreativeConcept[]): void {
    try {
      localStorage.setItem(LOCAL_CREATIVE_KEY, JSON.stringify(history.slice(0, 100)));
    } catch (err) {
      console.warn('[CreativeStorage] Local storage write error:', err);
    }
  }

  public async saveConcept(userId: string, concept: CreativeConcept): Promise<void> {
    const history = this.getLocalHistory();
    history.unshift(concept);
    this.setLocalHistory(history);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      // Main history record
      const conceptRef = doc(db, 'users', userId, 'aria', 'creative', 'history', concept.creativeId);
      await setDoc(conceptRef, {
        ...concept,
        savedAt: serverTimestamp()
      }, { merge: true });

      // Secondary category indexing
      const subColName = concept.category === 'CAPSULE_WARDROBE' ? 'collections'
        : concept.category === 'MOOD_BOARD' ? 'moodboards'
        : 'concepts';

      const subRef = doc(db, 'users', userId, 'aria', 'creative', subColName, concept.creativeId);
      await setDoc(subRef, {
        creativeId: concept.creativeId,
        title: concept.title,
        category: concept.category,
        confidence: concept.confidence,
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (err) {
      console.warn('[CreativeStorage] Firestore save concept skipped/deferred:', err);
    }
  }

  public async fetchHistory(userId: string): Promise<CreativeConcept[]> {
    const local = this.getLocalHistory();

    if (isFirestoreOfflineFallbackActive || !db || !userId) {
      return local;
    }

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'creative', 'history');
      const snapDocs = await getDocs(colRef);
      const fetched: CreativeConcept[] = [];
      snapDocs.forEach((d) => {
        fetched.push(d.data() as CreativeConcept);
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setLocalHistory(fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[CreativeStorage] Firestore fetch concepts fallback to local:', err);
    }

    return local;
  }

  public async deleteConcept(userId: string, creativeId: string): Promise<boolean> {
    const history = this.getLocalHistory().filter(c => c.creativeId !== creativeId);
    this.setLocalHistory(history);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return true;

    try {
      const conceptRef = doc(db, 'users', userId, 'aria', 'creative', 'history', creativeId);
      await deleteDoc(conceptRef);
      return true;
    } catch (err) {
      console.warn('[CreativeStorage] Firestore delete concept error:', err);
      return true;
    }
  }
}

export const creativeStorage = CreativeStorage.getInstance();
