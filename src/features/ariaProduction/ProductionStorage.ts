/**
 * ARIA Production Storage Controller
 * Product: LOOK VISION v2.4.0-telemetry
 * Manages Firestore persistence and offline caching via aria_user_profile_cache_v6.0.
 */

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, isFirestoreOfflineFallbackActive } from '../../firebase';
import { UserFashionProfile } from './ProductionUserTypes';
import { UserOnboardingEngine } from './UserOnboardingEngine';

export const OFFLINE_CACHE_KEY = 'aria_user_profile_cache_v6.0';

export class ProductionStorage {
  /**
   * Reads cached profile from LocalStorage if available
   */
  public static getOfflineCache(): UserFashionProfile | null {
    try {
      const raw = localStorage.getItem(OFFLINE_CACHE_KEY);
      if (raw) {
        return JSON.parse(raw) as UserFashionProfile;
      }
    } catch (err) {
      console.warn('[ProductionStorage] Failed reading offline cache:', err);
    }
    return null;
  }

  /**
   * Writes profile to LocalStorage cache
   */
  public static syncOfflineCache(profile: UserFashionProfile): void {
    try {
      localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.warn('[ProductionStorage] Failed writing offline cache:', err);
    }
  }

  /**
   * Loads user profile from Firestore or local fallback
   */
  public static async loadUserProfile(uid?: string): Promise<UserFashionProfile> {
    const targetUid = uid || auth?.currentUser?.uid || 'guest_user';

    // First check local cache for immediate rendering
    const cached = this.getOfflineCache();
    if (cached && cached.userId === targetUid) {
      console.debug('[ProductionStorage] Loaded profile from offline cache v6.0');
    }

    if (isFirestoreOfflineFallbackActive || !auth?.currentUser) {
      if (cached) return cached;
      const defaultProf = UserOnboardingEngine.processOnboardingSubmission(
        targetUid,
        UserOnboardingEngine.getDefaultOnboardingState()
      );
      this.syncOfflineCache(defaultProf);
      return defaultProf;
    }

    const docPath = `users/${targetUid}/fashionProfile/main`;
    try {
      const docRef = doc(db, 'users', targetUid, 'fashionProfile', 'main');
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const loadedData = snap.data() as UserFashionProfile;
        this.syncOfflineCache(loadedData);
        return loadedData;
      } else {
        // Document does not exist yet; initialize default and write
        const newProf = UserOnboardingEngine.processOnboardingSubmission(
          targetUid,
          UserOnboardingEngine.getDefaultOnboardingState()
        );
        await this.saveUserProfile(newProf);
        return newProf;
      }
    } catch (error) {
      console.warn('[ProductionStorage] Firestore fetch warning, utilizing offline cache:', error);
      if (cached) return cached;
      const fallbackProf = UserOnboardingEngine.processOnboardingSubmission(
        targetUid,
        UserOnboardingEngine.getDefaultOnboardingState()
      );
      this.syncOfflineCache(fallbackProf);
      return fallbackProf;
    }
  }

  /**
   * Saves user profile to Firestore and syncs local cache
   */
  public static async saveUserProfile(profile: UserFashionProfile): Promise<void> {
    this.syncOfflineCache(profile);

    const targetUid = profile.userId || auth?.currentUser?.uid || 'guest_user';
    if (isFirestoreOfflineFallbackActive || !auth?.currentUser || targetUid === 'guest_user') {
      return;
    }

    const docPath = `users/${targetUid}/fashionProfile/main`;
    try {
      const docRef = doc(db, 'users', targetUid, 'fashionProfile', 'main');
      await setDoc(docRef, profile, { merge: true });
    } catch (error) {
      console.warn('[ProductionStorage] Saved to local cache, Firestore write fallback handled.');
    }
  }

  /**
   * Subscribes to real-time updates for user profile doc
   */
  public static listenToUserProfile(uid: string, callback: (profile: UserFashionProfile) => void): () => void {
    if (isFirestoreOfflineFallbackActive || !auth?.currentUser || uid === 'guest_user') {
      const cached = this.getOfflineCache();
      if (cached) callback(cached);
      return () => {};
    }

    const docPath = `users/${uid}/fashionProfile/main`;
    const docRef = doc(db, 'users', uid, 'fashionProfile', 'main');

    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const prof = snap.data() as UserFashionProfile;
          this.syncOfflineCache(prof);
          callback(prof);
        }
      },
      (error) => {
        console.warn('[ProductionStorage] Snapshot listener error, using cache:', error);
        const cached = this.getOfflineCache();
        if (cached) callback(cached);
      }
    );

    return unsubscribe;
  }
}
