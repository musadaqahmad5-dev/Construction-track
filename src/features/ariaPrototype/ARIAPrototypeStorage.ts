/**
 * ARIA Prototype Storage Layer
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 * 
 * Persistence & Caching layer for ARIA prototype experience sessions.
 * Primary: Firestore (`users/{uid}/aria/prototypeSessions/{sessionId}`)
 * Offline Fallback Cache: `aria_prototype_sessions_v3.3`
 */

import { ARIAExperienceSession, ARIAInteractionEvent } from './ARIAPrototypeTypes';
import { db } from '../../firebase';
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'aria_prototype_sessions_v3.3';

export class ARIAPrototypeStorage {
  /**
   * Save or update prototype session to Firestore and LocalStorage
   */
  public static async saveSession(session: ARIAExperienceSession): Promise<void> {
    // 1. Always update offline cache immediately for instant UI response & offline guarantees
    this.saveToLocalStorage(session);

    // 2. Attempt Firestore sync
    if (db && session.userId && session.userId !== 'guest_user') {
      try {
        const sessionRef = doc(db, 'users', session.userId, 'aria', 'prototypeSessions', session.sessionId);
        await setDoc(sessionRef, {
          sessionId: session.sessionId,
          userId: session.userId,
          sessionTitle: session.sessionTitle,
          createdAt: session.createdAt,
          lastInteractionAt: session.lastInteractionAt,
          totalRequestsCount: session.totalRequestsCount,
          requestsHistory: session.requestsHistory,
          resultsHistory: session.resultsHistory,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('[ARIAPrototypeStorage] Firestore sync fallback to offline storage:', err);
      }
    }
  }

  /**
   * Load session by ID
   */
  public static async loadSession(userId: string, sessionId: string): Promise<ARIAExperienceSession | null> {
    // Check local storage first
    const localSessions = this.loadAllFromLocalStorage();
    const localMatch = localSessions.find((s) => s.sessionId === sessionId);

    if (db && userId && userId !== 'guest_user') {
      try {
        const sessionRef = doc(db, 'users', userId, 'aria', 'prototypeSessions', sessionId);
        const snapshot = await getDoc(sessionRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as ARIAExperienceSession;
          this.saveToLocalStorage(data);
          return data;
        }
      } catch (err) {
        console.warn('[ARIAPrototypeStorage] Firestore load fallback to local:', err);
      }
    }

    return localMatch || null;
  }

  /**
   * List recent sessions for user
   */
  public static async listUserSessions(userId: string): Promise<ARIAExperienceSession[]> {
    const localSessions = this.loadAllFromLocalStorage();

    if (db && userId && userId !== 'guest_user') {
      try {
        const sessionsRef = collection(db, 'users', userId, 'aria', 'prototypeSessions');
        const q = query(sessionsRef, limit(20));
        const querySnapshot = await getDocs(q);
        const remoteSessions: ARIAExperienceSession[] = [];
        querySnapshot.forEach((docSnap) => {
          remoteSessions.push(docSnap.data() as ARIAExperienceSession);
        });

        if (remoteSessions.length > 0) {
          // Merge remote into local cache
          remoteSessions.forEach((s) => this.saveToLocalStorage(s));
          return remoteSessions;
        }
      } catch (err) {
        console.warn('[ARIAPrototypeStorage] Firestore list fallback to local:', err);
      }
    }

    return localSessions;
  }

  /**
   * Save telemetry interaction event
   */
  public static async logInteractionEvent(event: ARIAInteractionEvent): Promise<void> {
    if (db && event.userId && event.userId !== 'guest_user') {
      try {
        const eventRef = doc(db, 'users', event.userId, 'aria', 'prototypeEvents', event.eventId);
        await setDoc(eventRef, {
          ...event,
          loggedAt: new Date().toISOString()
        });
      } catch (_) {}
    }
  }

  /* Offline Storage Helpers */
  private static loadAllFromLocalStorage(): ARIAExperienceSession[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  private static saveToLocalStorage(session: ARIAExperienceSession): void {
    try {
      const existing = this.loadAllFromLocalStorage();
      const filtered = existing.filter((s) => s.sessionId !== session.sessionId);
      filtered.unshift(session);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered.slice(0, 30)));
    } catch (_) {}
  }
}
