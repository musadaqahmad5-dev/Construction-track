/**
 * ARIA v2.5 Client Service
 * Product: LOOK VISION v2.4
 */

import { 
  ARIAQueryRequest, 
  ARIAStructuredResponse, 
  ARIAContextState, 
  ARIAConfig, 
  ARIASystemStatus 
} from '../core/ARIATypes';
import { db, auth, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export class ARIAService {
  private static instance: ARIAService;

  private constructor() {}

  public static getInstance(): ARIAService {
    if (!ARIAService.instance) {
      ARIAService.instance = new ARIAService();
    }
    return ARIAService.instance;
  }

  /**
   * Dispatches AI query request to backend ARIA API route
   */
  public async queryARIA<T = unknown>(
    request: ARIAQueryRequest
  ): Promise<ARIAStructuredResponse<T>> {
    const endpoint = '/api/aria/query';
    const currentUser = auth.currentUser;
    const token = currentUser ? await currentUser.getIdToken().catch(() => 'guest-token') : 'guest-token';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown network error');
      throw new Error(`ARIA API request failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'ARIA processing error');
    }

    return data.data as ARIAStructuredResponse<T>;
  }

  /**
   * Firestore Structure Helper: users/{userId}/aria/context
   */
  public async getFirestoreContext(userId: string): Promise<Partial<ARIAContextState> | null> {
    if (isFirestoreOfflineFallbackActive || !db) return null;
    try {
      const ref = doc(db, 'users', userId, 'aria', 'context');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as Partial<ARIAContextState>;
      }
    } catch (err) {
      console.warn('[ARIAService] Firestore context fetch skipped:', err);
    }
    return null;
  }

  public async saveFirestoreContext(userId: string, context: ARIAContextState): Promise<void> {
    if (isFirestoreOfflineFallbackActive || !db) return;
    try {
      const ref = doc(db, 'users', userId, 'aria', 'context');
      await setDoc(ref, {
        ...context,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[ARIAService] Firestore context save skipped:', err);
    }
  }

  /**
   * Firestore Structure Helper: users/{userId}/aria/config
   */
  public async getFirestoreConfig(userId: string): Promise<Partial<ARIAConfig> | null> {
    if (isFirestoreOfflineFallbackActive || !db) return null;
    try {
      const ref = doc(db, 'users', userId, 'aria', 'config');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as Partial<ARIAConfig>;
      }
    } catch (err) {
      console.warn('[ARIAService] Firestore config fetch skipped:', err);
    }
    return null;
  }

  public async saveFirestoreConfig(userId: string, config: ARIAConfig): Promise<void> {
    if (isFirestoreOfflineFallbackActive || !db) return;
    try {
      const ref = doc(db, 'users', userId, 'aria', 'config');
      await setDoc(ref, {
        ...config,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[ARIAService] Firestore config save skipped:', err);
    }
  }

  /**
   * Firestore Structure Helper: users/{userId}/aria/status
   */
  public async getFirestoreStatus(userId: string): Promise<Partial<ARIASystemStatus> | null> {
    if (isFirestoreOfflineFallbackActive || !db) return null;
    try {
      const ref = doc(db, 'users', userId, 'aria', 'status');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as Partial<ARIASystemStatus>;
      }
    } catch (err) {
      console.warn('[ARIAService] Firestore status fetch skipped:', err);
    }
    return null;
  }

  public async updateFirestoreStatus(userId: string, status: ARIASystemStatus): Promise<void> {
    if (isFirestoreOfflineFallbackActive || !db) return;
    try {
      const ref = doc(db, 'users', userId, 'aria', 'status');
      await setDoc(ref, {
        ...status,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[ARIAService] Firestore status update skipped:', err);
    }
  }
}

export const ariaService = ARIAService.getInstance();
