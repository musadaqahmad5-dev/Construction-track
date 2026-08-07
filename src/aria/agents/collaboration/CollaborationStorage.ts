/**
 * ARIA v2.8 Collaboration Storage & Persistence Bridge
 * Product: LOOK VISION v2.4
 * 
 * Persists collective decisions to Firestore (`users/{uid}/aria/agents/collaborations/{collaborationId}`)
 * with offline local caching (`aria_agent_collaboration_cache_v2.8`).
 */

import { CollectiveDecision } from './CollaborationTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../../firebase';
import { doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';

const LOCAL_COLLAB_CACHE_KEY = 'aria_agent_collaboration_cache_v2.8';

export class CollaborationStorage {
  private static instance: CollaborationStorage;

  private constructor() {}

  public static getInstance(): CollaborationStorage {
    if (!CollaborationStorage.instance) {
      CollaborationStorage.instance = new CollaborationStorage();
    }
    return CollaborationStorage.instance;
  }

  public getLocalCollaborations(): CollectiveDecision[] {
    try {
      const raw = localStorage.getItem(LOCAL_COLLAB_CACHE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      console.warn('[CollaborationStorage] Local read warning:', err);
    }
    return [];
  }

  public setLocalCollaborations(records: CollectiveDecision[]): void {
    try {
      localStorage.setItem(LOCAL_COLLAB_CACHE_KEY, JSON.stringify(records.slice(0, 50)));
    } catch (err) {
      console.warn('[CollaborationStorage] Local write warning:', err);
    }
  }

  public async saveCollaboration(userId: string, decision: CollectiveDecision): Promise<void> {
    const local = this.getLocalCollaborations();
    local.unshift(decision);
    this.setLocalCollaborations(local);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      const ref = doc(db, 'users', userId, 'aria', 'agents', 'collaborations', decision.collaborationId);
      await setDoc(ref, {
        ...decision,
        savedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[CollaborationStorage] Firestore sync skipped:', err);
    }
  }

  public async fetchCollaborations(userId: string): Promise<CollectiveDecision[]> {
    const local = this.getLocalCollaborations();
    if (isFirestoreOfflineFallbackActive || !db || !userId) return local;

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'agents', 'collaborations');
      const snap = await getDocs(colRef);
      const fetched: CollectiveDecision[] = [];

      snap.forEach((d) => {
        fetched.push(d.data() as CollectiveDecision);
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setLocalCollaborations(fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[CollaborationStorage] Firestore fetch fallback:', err);
    }

    return local;
  }
}

export const collaborationStorage = CollaborationStorage.getInstance();
