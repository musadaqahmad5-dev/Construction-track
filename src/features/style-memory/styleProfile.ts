import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ClothingCategory } from '../../types';

export interface PersistentStyleProfile {
  userId: string;
  preferredCategories: ClothingCategory[];
  favoriteColors: string[];
  rejectedOutfitIds: string[][]; // Array of outfit combinations (item ID arrays) that were rejected
  styleVibe: 'minimalist' | 'classic' | 'streetwear' | 'vintage' | 'bold';
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'fashion_persistent_style_profile';

export class StyleProfileMemory {
  /**
   * Loads the dynamic style memory model.
   */
  static async load(userId: string): Promise<PersistentStyleProfile> {
    const defaultProfile: PersistentStyleProfile = {
      userId,
      preferredCategories: ['Casual', 'Outerwear'],
      favoriteColors: ['Pitch Black', 'Oatmeal Beige', 'Minimalist White'],
      rejectedOutfitIds: [],
      styleVibe: 'minimalist',
      updatedAt: new Date().toISOString()
    };

    if (!userId || userId === 'anonymous-user') {
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) return JSON.parse(local);
      } catch (e) {
        console.warn('[StyleProfileMemory] LocalStorage read failed:', e);
      }
      return defaultProfile;
    }

    try {
      const docRef = doc(db, 'styleProfiles', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          userId,
          preferredCategories: data.preferredCategories || defaultProfile.preferredCategories,
          favoriteColors: data.favoriteColors || defaultProfile.favoriteColors,
          rejectedOutfitIds: data.rejectedOutfitIds || defaultProfile.rejectedOutfitIds,
          styleVibe: data.styleVibe || defaultProfile.styleVibe,
          updatedAt: data.updatedAt || defaultProfile.updatedAt
        };
      }
    } catch (e: any) {
      console.warn('[StyleProfileMemory] Firestore load failed, trying localStorage:', e.message);
    }

    try {
      const local = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${userId}`);
      if (local) return JSON.parse(local);
    } catch (e) {
      console.warn('[StyleProfileMemory] LocalStorage fallback read failed:', e);
    }

    return defaultProfile;
  }

  /**
   * Persists user style profiles safely.
   */
  static async save(profile: PersistentStyleProfile): Promise<void> {
    profile.updatedAt = new Date().toISOString();

    // 1. Local storage save
    try {
      const storageKey = (!profile.userId || profile.userId === 'anonymous-user') 
        ? LOCAL_STORAGE_KEY 
        : `${LOCAL_STORAGE_KEY}_${profile.userId}`;
      localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch (e) {
      console.warn('[StyleProfileMemory] LocalStorage write failed:', e);
    }

    // 2. Cloud Firestore save
    if (db && profile.userId && profile.userId !== 'anonymous-user') {
      try {
        const docRef = doc(db, 'styleProfiles', profile.userId);
        await setDoc(docRef, profile);
        console.log('[StyleProfileMemory] Style profile written to Firestore');
      } catch (e: any) {
        console.error('[StyleProfileMemory] Firestore write failure:', e.message);
      }
    }
  }
}
