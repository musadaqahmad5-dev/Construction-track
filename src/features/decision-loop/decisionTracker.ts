import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export type OutcomeAction = 'viewed' | 'accepted' | 'rejected' | 'saved' | 'worn' | 'shared' | 'abandoned';

export interface DecisionOutcomeRecord {
  id?: string;
  userId: string;
  recommendationId: string; // ID of recommendation or a unique timestamp hash corresponding to recommendation run
  items: string[]; // WardrobeItem IDs that were part of this outfit recommendation
  action: OutcomeAction;
  timestamp: string;
  timeToDecisionMs?: number; // Time taken by user to act on suggestion
  variantId?: string; // For A/B experiment tagging
}

const LOCAL_STORAGE_KEY = 'fashion_decision_outcomes';

export class DecisionTracker {
  /**
   * Logs a user interaction outcome for styling evaluation.
   */
  static async logOutcome(record: Omit<DecisionOutcomeRecord, 'timestamp'>): Promise<DecisionOutcomeRecord> {
    const fullRecord: DecisionOutcomeRecord = {
      ...record,
      timestamp: new Date().toISOString()
    };

    // Save locally
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const outcomes: DecisionOutcomeRecord[] = localData ? JSON.parse(localData) : [];
      outcomes.unshift(fullRecord);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(outcomes.slice(0, 200)));
    } catch (e) {
      console.warn('[DecisionTracker] local write error:', e);
    }

    // Sync to Firestore if authenticated
    if (db && record.userId && record.userId !== 'anonymous-user') {
      try {
        const colRef = collection(db, 'decisionOutcomes');
        const docRef = await addDoc(colRef, fullRecord);
        fullRecord.id = docRef.id;
        console.log('[DecisionTracker] Synced outcome to Cloud:', docRef.id, record.action);
      } catch (e: any) {
        console.warn('[DecisionTracker] Firestore sync bypassed:', e.message);
      }
    }

    return fullRecord;
  }

  /**
   * Retrieves high frequency logs to evaluate design loop parameters.
   */
  static async getOutcomes(userId: string, count: number = 50): Promise<DecisionOutcomeRecord[]> {
    if (db && userId && userId !== 'anonymous-user') {
      try {
        const colRef = collection(db, 'decisionOutcomes');
        const q = query(
          colRef,
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(count)
        );
        const snap = await getDocs(q);
        const docs: DecisionOutcomeRecord[] = [];
        snap.forEach(docSnap => {
          const data = docSnap.data();
          docs.push({
            id: docSnap.id,
            userId: data.userId,
            recommendationId: data.recommendationId,
            items: data.items || [],
            action: data.action as OutcomeAction,
            timestamp: data.timestamp,
            timeToDecisionMs: data.timeToDecisionMs,
            variantId: data.variantId
          });
        });
        if (docs.length > 0) return docs;
      } catch (e: any) {
        console.warn('[DecisionTracker] Cloud read error, falling back locally:', e.message);
      }
    }

    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        const outcomes: DecisionOutcomeRecord[] = JSON.parse(localData);
        return outcomes.filter(o => o.userId === userId).slice(0, count);
      }
    } catch (err) {
      console.error('[DecisionTracker] Read local fallback failed:', err);
    }
    return [];
  }
}
