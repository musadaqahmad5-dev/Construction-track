import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export interface OutfitHistoryRecord {
  id?: string;
  userId: string;
  items: string[]; // WardrobeItem IDs that were recommended
  action: 'suggested' | 'accept' | 'reject' | 'wear';
  timestamp: string;
  weatherCondition?: string;
  agenda?: string;
  vibe?: string;
}

const LOCAL_STORAGE_KEY = 'fashion_outfit_history';

export class OutfitHistory {
  /**
   * Appends an outfit suggestion or client action event to the pipeline log.
   */
  static async logEvent(record: Omit<OutfitHistoryRecord, 'timestamp'>): Promise<OutfitHistoryRecord> {
    const fullRecord: OutfitHistoryRecord = {
      ...record,
      timestamp: new Date().toISOString()
    };

    // 1. Save to local storage for instant offline feedback loops
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const history: OutfitHistoryRecord[] = localData ? JSON.parse(localData) : [];
      history.unshift(fullRecord);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history.slice(0, 100))); // Cap local history
    } catch (e) {
      console.warn('[OutfitHistory] LocalStorage write failed:', e);
    }

    // 2. Persist to Firestore if user is logged in
    if (db && record.userId && record.userId !== 'anonymous-user') {
      try {
        const colRef = collection(db, 'outfitHistory');
        const docRef = await addDoc(colRef, fullRecord);
        fullRecord.id = docRef.id;
        console.log('[OutfitHistory] Logged event to Firestore:', docRef.id);
      } catch (e: any) {
        console.warn('[OutfitHistory] Firestore bypass or failure:', e.message);
      }
    }

    return fullRecord;
  }

  /**
   * Retrieves previous items suggested or worn to track frequency and prevent styling fatigue.
   */
  static async getHistory(userId: string, count: number = 20): Promise<OutfitHistoryRecord[]> {
    if (db && userId && userId !== 'anonymous-user') {
      try {
        const colRef = collection(db, 'outfitHistory');
        const q = query(
          colRef,
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(count)
        );
        const snap = await getDocs(q);
        const records: OutfitHistoryRecord[] = [];
        snap.forEach(docSnap => {
          const data = docSnap.data();
          records.push({
            id: docSnap.id,
            userId: data.userId,
            items: data.items || [],
            action: data.action || 'suggested',
            timestamp: data.timestamp,
            weatherCondition: data.weatherCondition,
            agenda: data.agenda,
            vibe: data.vibe
          });
        });
        if (records.length > 0) {
          return records;
        }
      } catch (e: any) {
        console.warn('[OutfitHistory] Firestore retrieve failed, cascading to LocalStorage:', e.message);
      }
    }

    // Offline LocalStorage fallback
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        const history: OutfitHistoryRecord[] = JSON.parse(localData);
        return history.filter(r => r.userId === userId).slice(0, count);
      }
    } catch (e) {
      console.warn('[OutfitHistory] LocalStorage read failed:', e);
    }

    return [];
  }
}
