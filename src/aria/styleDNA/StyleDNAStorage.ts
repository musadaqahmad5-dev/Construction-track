/**
 * ARIA v2.5 Style DNA Storage Adapter
 * Product: LOOK VISION v2.4
 */

import { StyleDNAProfile, StyleDNASnapshot, StyleDNAStatus } from './StyleDNATypes';
import { db, auth, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

const LOCAL_STORAGE_PROFILE_KEY = 'lookvision_aria_style_dna_profile_v2.5';
const LOCAL_STORAGE_SNAPSHOTS_KEY = 'lookvision_aria_style_dna_snapshots_v2.5';

export class StyleDNAStorage {
  private static instance: StyleDNAStorage;

  private constructor() {}

  public static getInstance(): StyleDNAStorage {
    if (!StyleDNAStorage.instance) {
      StyleDNAStorage.instance = new StyleDNAStorage();
    }
    return StyleDNAStorage.instance;
  }

  /**
   * Helper to load profile from localStorage
   */
  public getLocalProfile(): StyleDNAProfile | null {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[StyleDNAStorage] Error reading local profile:', err);
    }
    return null;
  }

  /**
   * Helper to save profile to localStorage
   */
  public setLocalProfile(profile: StyleDNAProfile): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.warn('[StyleDNAStorage] Error writing local profile:', err);
    }
  }

  /**
   * Helper to load snapshots from localStorage
   */
  public getLocalSnapshots(): StyleDNASnapshot[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SNAPSHOTS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[StyleDNAStorage] Error reading local snapshots:', err);
    }
    return [];
  }

  /**
   * Helper to save snapshots to localStorage
   */
  public saveLocalSnapshot(snapshot: StyleDNASnapshot): void {
    try {
      const snapshots = this.getLocalSnapshots();
      snapshots.unshift(snapshot);
      localStorage.setItem(LOCAL_STORAGE_SNAPSHOTS_KEY, JSON.stringify(snapshots.slice(0, 50)));
    } catch (err) {
      console.warn('[StyleDNAStorage] Error saving local snapshot:', err);
    }
  }

  /**
   * Save or update Style DNA profile in Firestore and Local Storage
   */
  public async saveProfile(userId: string, profile: StyleDNAProfile): Promise<void> {
    // 1. Update local storage
    this.setLocalProfile(profile);

    // 2. Persist to Firestore: users/{userId}/aria/styleDNA/profile/current
    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return;
    }

    try {
      const profileRef = doc(db, 'users', userId, 'aria', 'styleDNA', 'profile', 'current');
      await setDoc(profileRef, {
        ...profile,
        updatedAt: serverTimestamp()
      }, { merge: true });

      const confidenceRef = doc(db, 'users', userId, 'aria', 'styleDNA', 'confidence', 'summary');
      await setDoc(confidenceRef, {
        overallConfidence: profile.overallConfidence,
        totalEvidenceCount: profile.totalEvidenceCount,
        version: profile.version,
        updatedAt: serverTimestamp()
      }, { merge: true });

      const metaRef = doc(db, 'users', userId, 'aria', 'styleDNA', 'metadata', 'stats');
      await setDoc(metaRef, {
        lastSyncedAt: serverTimestamp(),
        version: profile.version,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[StyleDNAStorage] Firestore save profile skipped/deferred:', err);
      }
    }
  }

  /**
   * Fetch profile for a user
   */
  public async fetchProfile(userId: string): Promise<StyleDNAProfile | null> {
    const local = this.getLocalProfile();

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return local;
    }

    try {
      const profileRef = doc(db, 'users', userId, 'aria', 'styleDNA', 'profile', 'current');
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        const remoteProfile = snap.data() as StyleDNAProfile;
        this.setLocalProfile(remoteProfile);
        return remoteProfile;
      }
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[StyleDNAStorage] Firestore fetch fallback to local:', err);
      }
    }

    return local;
  }

  /**
   * Save a snapshot in Firestore & Local Storage
   */
  public async saveSnapshot(userId: string, snapshot: StyleDNASnapshot): Promise<void> {
    this.saveLocalSnapshot(snapshot);

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return;
    }

    try {
      const snapRef = doc(db, 'users', userId, 'aria', 'styleDNA', 'snapshots', snapshot.snapshotId);
      await setDoc(snapRef, {
        ...snapshot,
        capturedAt: serverTimestamp()
      });
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[StyleDNAStorage] Firestore snapshot save error:', err);
      }
    }
  }

  /**
   * Fetch historical snapshots
   */
  public async fetchSnapshots(userId: string): Promise<StyleDNASnapshot[]> {
    const local = this.getLocalSnapshots();

    if (
      isFirestoreOfflineFallbackActive ||
      !db ||
      !userId ||
      userId.startsWith('guest-') ||
      !auth?.currentUser ||
      auth.currentUser.isAnonymous ||
      auth.currentUser.uid !== userId
    ) {
      return local;
    }

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'styleDNA', 'snapshots');
      const snapDocs = await getDocs(colRef);
      const fetched: StyleDNASnapshot[] = [];
      snapDocs.forEach((d) => {
        fetched.push(d.data() as StyleDNASnapshot);
      });
      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
        return fetched;
      }
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && !err?.message?.includes('Missing or insufficient permissions')) {
        console.warn('[StyleDNAStorage] Fetch snapshots error:', err);
      }
    }

    return local;
  }
}

export const styleDNAStorage = StyleDNAStorage.getInstance();
