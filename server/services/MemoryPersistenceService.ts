import { getFirestore } from 'firebase-admin/firestore';
import { StyleDNAData } from '../../src/ai/stylist';
import { FirestoreStyleProfileDoc } from '../types/AIStylistBackend';

export class MemoryPersistenceService {
  private static instance: MemoryPersistenceService | null = null;
  private memoryProfiles = new Map<string, StyleDNAData>();
  private memoryEntries = new Map<string, Map<string, any>>();

  private constructor() {}

  public static getInstance(): MemoryPersistenceService {
    if (!MemoryPersistenceService.instance) {
      MemoryPersistenceService.instance = new MemoryPersistenceService();
    }
    return MemoryPersistenceService.instance;
  }

  private getDb() {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return null;
    }
    try {
      return getFirestore();
    } catch (_) {
      return null;
    }
  }

  public async saveStyleProfile(userId: string, profile: StyleDNAData): Promise<void> {
    this.memoryProfiles.set(userId, JSON.parse(JSON.stringify(profile)));

    const db = this.getDb();
    if (!db) return;

    try {
      const ref = db.collection('users').doc(userId).collection('styleProfiles').doc('default');
      const docData: FirestoreStyleProfileDoc = {
        userId: profile.userId,
        archetype: profile.archetype,
        primaryVibe: profile.primaryVibe,
        colorPalette: profile.colorPalette,
        fitPreference: profile.fitPreference,
        brandAffinity: profile.brandAffinity,
        riskTolerance: profile.riskTolerance,
        updatedAt: profile.updatedAt
      };
      await ref.set(docData, { merge: true });
    } catch (_) {}
  }

  public async loadStyleProfile(userId: string): Promise<StyleDNAData | null> {
    const db = this.getDb();
    if (db) {
      try {
        const ref = db.collection('users').doc(userId).collection('styleProfiles').doc('default');
        const doc = await ref.get();
        if (doc.exists) {
          const data = doc.data() as FirestoreStyleProfileDoc;
          const profile: StyleDNAData = {
            userId: data.userId,
            archetype: data.archetype,
            primaryVibe: data.primaryVibe,
            colorPalette: data.colorPalette,
            fitPreference: data.fitPreference,
            brandAffinity: data.brandAffinity,
            riskTolerance: data.riskTolerance,
            updatedAt: data.updatedAt
          };
          this.memoryProfiles.set(userId, JSON.parse(JSON.stringify(profile)));
          return profile;
        }
      } catch (_) {}
    }

    return this.memoryProfiles.get(userId) || null;
  }

  public async saveMemoryEntry(userId: string, key: string, value: any, category?: string): Promise<void> {
    if (!this.memoryEntries.has(userId)) {
      this.memoryEntries.set(userId, new Map<string, any>());
    }
    const userMap = this.memoryEntries.get(userId)!;
    userMap.set(key, { value, category, updatedAt: new Date().toISOString() });

    const db = this.getDb();
    if (!db) return;

    try {
      const ref = db.collection('users').doc(userId).collection('memory').doc(key);
      await ref.set(
        {
          key,
          value,
          category: category || 'general',
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (_) {}
  }

  public async loadMemoryEntries(userId: string): Promise<Record<string, any>> {
    const result: Record<string, any> = {};

    const db = this.getDb();
    if (db) {
      try {
        const snap = await db.collection('users').doc(userId).collection('memory').get();
        if (!snap.empty) {
          snap.docs.forEach(doc => {
            const d = doc.data();
            if (d && d.key) {
              result[d.key] = d.value;
            }
          });
          return result;
        }
      } catch (_) {}
    }

    const userMap = this.memoryEntries.get(userId);
    if (userMap) {
      userMap.forEach((v, k) => {
        result[k] = v.value;
      });
    }

    return result;
  }
}

export const memoryPersistenceService = MemoryPersistenceService.getInstance();
