import { db } from '../../firebase';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';

export interface LookHistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  provider: string;
  vibe: string;
  season?: string;
  createdAt: string;
}

export class GenerationHistory {
  /**
   * Loads look history items. Dual-read architecture: Queries Firestore, cascading to LocalStorage.
   */
  static async getHistory(userId: string = 'anonymous-designer'): Promise<LookHistoryItem[]> {
    const list: LookHistoryItem[] = [];

    // 1. Live Firestore Query
    if (db) {
      try {
        const looksRef = collection(db, 'generatedLooks');
        const q = query(
          looksRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            imageUrl: data.imageUrl || '',
            prompt: data.prompt || '',
            provider: data.provider || 'Google-Imagen-4.0',
            vibe: data.vibe || 'Creative',
            season: data.season || 'All-Season',
            createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
          });
        });

        if (list.length > 0) {
          return list;
        }
      } catch (err) {
        console.warn('[GenerationHistory] Fallback to LocalStorage due to Firestore read/index failure:', err);
      }
    }

    // 2. Local Registry Query
    try {
      const stored = localStorage.getItem('fashion_looks_registry');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          id: item.id || `local_${Math.random()}`,
          imageUrl: item.imageUrl || '',
          prompt: item.prompt || '',
          provider: item.provider || 'Picsum',
          vibe: item.vibe || 'Creative',
          createdAt: item.createdAt || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error('[GenerationHistory] Local registry read failed:', err);
    }

    return [];
  }
}
