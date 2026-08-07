/**
 * ARIA v3.1 Generation Storage Adapter
 * Product: LOOK VISION v2.4
 * 
 * Manages Firestore persistence and offline local caching for ARIA Generative Fashion Intelligence.
 * Paths:
 * - User Generations: users/{uid}/aria/generation/{generationId}
 * - Global Design Concepts: global/aria/designConcepts/{conceptId}
 * - Offline Cache: aria_generation_cache_v3.1
 */

import { FashionConcept, CreativeDirection, CapsuleCollection } from './GenerativeTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';

const LOCAL_GENERATION_CACHE_KEY = 'aria_generation_cache_v3.1';

export class GenerationStorage {
  private static instance: GenerationStorage;

  private constructor() {}

  public static getInstance(): GenerationStorage {
    if (!GenerationStorage.instance) {
      GenerationStorage.instance = new GenerationStorage();
    }
    return GenerationStorage.instance;
  }

  public getLocalGenerations(): any[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_GENERATION_CACHE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[GenerationStorage] Error reading local generation cache:', err);
    }
    return [];
  }

  public setLocalGenerations(generations: any[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_GENERATION_CACHE_KEY, JSON.stringify(generations.slice(0, 50)));
      }
    } catch (err) {
      console.warn('[GenerationStorage] Error saving local generation cache:', err);
    }
  }

  public async saveGeneration(
    userId: string,
    generationId: string,
    type: 'CONCEPT' | 'CREATIVE_DIRECTION' | 'CAPSULE',
    payload: FashionConcept | CreativeDirection | CapsuleCollection
  ): Promise<void> {
    const entry = { generationId, type, payload, savedAt: new Date().toISOString() };
    const local = this.getLocalGenerations();
    local.unshift(entry);
    this.setLocalGenerations(local);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      // Save under user's aria generation subcollection
      const userRef = doc(db, 'users', userId, 'aria', 'generation', generationId);
      await setDoc(userRef, {
        generationId,
        type,
        payload,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // If it's a concept or creative direction, save global summary
      if (type === 'CONCEPT') {
        const globalRef = doc(db, 'global', 'aria', 'designConcepts', generationId);
        await setDoc(globalRef, {
          conceptId: generationId,
          title: (payload as FashionConcept).title,
          theme: (payload as FashionConcept).aestheticTheme,
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(() => {});
      }
    } catch (err) {
      console.warn('[GenerationStorage] Firestore sync skipped:', err);
    }
  }

  public async fetchUserGenerations(userId: string): Promise<any[]> {
    const local = this.getLocalGenerations();
    if (isFirestoreOfflineFallbackActive || !db || !userId) return local;

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'generation');
      const snap = await getDocs(colRef);
      const fetched: any[] = [];

      snap.forEach((d) => {
        fetched.push(d.data());
      });

      if (fetched.length > 0) {
        this.setLocalGenerations(fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[GenerationStorage] Firestore fetch fallback:', err);
    }

    return local;
  }
}

export const generationStorage = GenerationStorage.getInstance();
