import { WardrobeItem } from '../types';
import { db, auth } from '../firebase';
import { collection, writeBatch, doc, getDocs, query, where } from 'firebase/firestore';

export interface StorageHealth {
  status: 'HEALTHY' | 'CORRUPTED' | 'DEGRADED';
  databaseSyncStatus: 'ONLINE' | 'OFFLINE' | 'UNCONFIGURED';
  lastBackupTime: string | null;
  schemaVersion: string;
  isCloudSynced: boolean;
  corruptionsRecoveredCount: number;
}

export class StorageHardening {
  private static corruptionsRecoveredCount = 0;
  private static lastBackupTime: string | null = null;
  public static CURRENT_SCHEMA_VERSION = '1.2.0';

  /**
   * Safe JSON parse with automatic corruption detection and recovery
   */
  public static safeParse<T>(jsonStr: string | null, fallback: T, keyName: string): T {
    if (!jsonStr) return fallback;
    try {
      const parsed = JSON.parse(jsonStr);
      
      if (Array.isArray(parsed)) {
        return parsed.map(item => this.migrateItem(item)) as unknown as T;
      }
      return parsed as T;
    } catch (err) {
      this.corruptionsRecoveredCount++;
      console.error(`[StorageHardening] Corruption detected in local cache key "${keyName}". Restoring fallback.`, err);
      return fallback;
    }
  }

  /**
   * Migrate wardrobe item state schema to version 1.2.0
   */
  public static migrateItem(item: any): any {
    if (!item || typeof item !== 'object') return item;
    
    const needsMigration = !item.schema_version || item.schema_version !== this.CURRENT_SCHEMA_VERSION;
    
    if (needsMigration) {
      return {
        ...item,
        schema_version: this.CURRENT_SCHEMA_VERSION,
        title: item.title || item.name || 'Untitled Garment',
        status: item.status || 'In Closet',
        category: item.category || 'Casual',
        description: item.description || '',
        wearCount: item.wearCount ?? 0,
        createdAt: item.createdAt || { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
      };
    }
    return item;
  }

  /**
   * Conflict Resolution between Local state and Cloud backup
   */
  public static resolveConflicts(local: WardrobeItem[], cloud: WardrobeItem[]): WardrobeItem[] {
    const resolved: WardrobeItem[] = [];
    const localMap = new Map(local.map(i => [i.id, i]));
    const cloudMap = new Map(cloud.map(i => [i.id, i]));
    const allIds = new Set([...localMap.keys(), ...cloudMap.keys()]);

    allIds.forEach(id => {
      const lItem = localMap.get(id);
      const cItem = cloudMap.get(id);

      if (lItem && cItem) {
        const lTime = lItem.lastUsed ? new Date(lItem.lastUsed).getTime() : 0;
        const cTime = cItem.lastUsed ? new Date(cItem.lastUsed).getTime() : 0;
        
        if (lTime >= cTime) {
          resolved.push(this.migrateItem(lItem));
        } else {
          resolved.push(this.migrateItem(cItem));
        }
      } else if (lItem) {
        resolved.push(this.migrateItem(lItem));
      } else if (cItem) {
        resolved.push(this.migrateItem(cItem));
      }
    });

    return resolved;
  }

  /**
   * Cloud database backup trigger
   */
  public static async pushToCloudBackup(items: WardrobeItem[]): Promise<boolean> {
    const user = auth.currentUser;
    if (!user || user.isAnonymous) return false;

    try {
      const batch = writeBatch(db);
      
      // Sync each item to wardrobe collection
      items.forEach(item => {
        const docRef = doc(collection(db, 'wardrobe'), item.id);
        const migrated = this.migrateItem(item);
        batch.set(docRef, {
          title: migrated.title,
          description: migrated.description || '',
          category: migrated.category,
          status: migrated.status,
          userId: user.uid,
          createdAt: migrated.createdAt,
          schema_version: migrated.schema_version,
          wearCount: migrated.wearCount,
          lastUsed: migrated.lastUsed || null
        }, { merge: true });
      });

      await batch.commit();
      this.lastBackupTime = new Date().toISOString();
      return true;
    } catch (err) {
      console.error('[StorageHardening] Failed to sync wardrobe to Firestore:', err);
      return false;
    }
  }

  /**
   * Diagnostic health report
   */
  public static getHealth(isOnline: boolean): StorageHealth {
    const user = auth.currentUser;
    const isCloudConfigured = !!user && !user.isAnonymous;
    
    let status: 'HEALTHY' | 'CORRUPTED' | 'DEGRADED' = 'HEALTHY';
    if (this.corruptionsRecoveredCount > 0) {
      status = 'DEGRADED';
    }

    const databaseSyncStatus = !isOnline 
      ? 'OFFLINE' 
      : isCloudConfigured ? 'ONLINE' : 'UNCONFIGURED';

    return {
      status,
      databaseSyncStatus,
      lastBackupTime: this.lastBackupTime,
      schemaVersion: this.CURRENT_SCHEMA_VERSION,
      isCloudSynced: isCloudConfigured && isOnline && !!this.lastBackupTime,
      corruptionsRecoveredCount: this.corruptionsRecoveredCount
    };
  }

  /**
   * Backup export (JSON file)
   */
  public static exportJSON(items: WardrobeItem[]): string {
    const dataBlob = {
      exportedAt: new Date().toISOString(),
      schemaVersion: this.CURRENT_SCHEMA_VERSION,
      items: items.map(i => this.migrateItem(i))
    };
    return JSON.stringify(dataBlob, null, 2);
  }

  /**
   * Backup import from JSON
   */
  public static importJSON(jsonStr: string): WardrobeItem[] {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || !Array.isArray(parsed.items)) {
        throw new Error('Invalid export format. Missing outer items array.');
      }
      return parsed.items.map((i: any) => {
        const item = this.migrateItem(i);
        if (!item.id) {
          item.id = `garment-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
        return item as WardrobeItem;
      });
    } catch (err) {
      throw new Error(`Import failed. File content corrupted or type invalid: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
