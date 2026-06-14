import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export interface VisualInteractionRecord {
  id?: string;
  userId: string;
  eventType: 'preview_open' | 'compare_looks' | 'complete_outfit_click' | 'visual_accept' | 'bundle_purchase_simulate';
  timestamp: string;
  itemId?: string;
  metaData?: Record<string, any>;
}

const LOCAL_STORAGE_KEY = 'fashion_visual_analytics';

export class VisualDecisionAnalytics {
  /**
   * Tracks discrete UX visual interactions.
   */
  static async logInteraction(userId: string, eventType: VisualInteractionRecord['eventType'], metaData?: Record<string, any>): Promise<VisualInteractionRecord> {
    const record: VisualInteractionRecord = {
      userId,
      eventType,
      timestamp: new Date().toISOString(),
      metaData
    };

    // Store in local storage first
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
      const list: VisualInteractionRecord[] = existing ? JSON.parse(existing) : [];
      list.unshift(record);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list.slice(0, 300)));
    } catch (e) {
      console.warn('[VisualDecisionAnalytics] Local write skipped:', e);
    }

    // Sync to Cloud Firestore if connected
    if (db && userId && userId !== 'anonymous-user') {
      try {
        const colRef = collection(db, 'visualInteractions');
        const docRef = await addDoc(colRef, record);
        record.id = docRef.id;
        console.log('[VisualDecisionAnalytics] Synced visual metric:', docRef.id, eventType);
      } catch (err: any) {
        console.warn('[VisualDecisionAnalytics] Bypassed Firebase sync:', err.message);
      }
    }

    return record;
  }

  /**
   * Calculates the Visual Outcome Score (0 to 100).
   * High opens, compares, visual completions boost the scoring value.
   */
  static async getVisualOutcomeScore(userId: string): Promise<{ score: number; totalInteractionsCount: number; completionRate_percent: number }> {
    let list: VisualInteractionRecord[] = [];

    if (db && userId && userId !== 'anonymous-user') {
      try {
        const colRef = collection(db, 'visualInteractions');
        const q = query(
          colRef,
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(100)
        );
        const snap = await getDocs(q);
        snap.forEach(docSnap => {
          list.push(docSnap.data() as VisualInteractionRecord);
        });
      } catch (err: any) {
        console.warn('[VisualDecisionAnalytics] Firestore metrics read failed, falling back locally:', err.message);
      }
    }

    if (list.length === 0) {
      try {
        const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (existing) {
          list = JSON.parse(existing).filter((v: any) => v.userId === userId);
        }
      } catch (e) {
        console.warn('[VisualDecisionAnalytics] Local load error:', e);
      }
    }

    if (list.length === 0) {
      // Trusting high baseline on empty data
      return { score: 75, totalInteractionsCount: 0, completionRate_percent: 65 };
    }

    const previewOpens = list.filter(r => r.eventType === 'preview_open').length;
    const compares = list.filter(r => r.eventType === 'compare_looks').length;
    const acceptances = list.filter(r => r.eventType === 'visual_accept').length;
    const completions = list.filter(r => r.eventType === 'complete_outfit_click').length;
    const purchases = list.filter(r => r.eventType === 'bundle_purchase_simulate').length;

    // We calculate a Visual Completion Rate = (completions + acceptances) / max(1, preview_opens)
    const baseDenom = Math.max(1, previewOpens);
    const completionRate_percent = Math.min(100, Math.round(((completions + acceptances) / baseDenom) * 100));

    // Calculate score using weighted sum
    let aggregateScore = 60; // Starting point
    aggregateScore += previewOpens * 3;
    aggregateScore += compares * 6;
    aggregateScore += acceptances * 10;
    aggregateScore += completions * 12;
    aggregateScore += purchases * 15;

    const finalScore = Math.max(0, Math.min(100, Math.round(aggregateScore)));

    return {
      score: finalScore,
      totalInteractionsCount: list.length,
      completionRate_percent
    };
  }
}
