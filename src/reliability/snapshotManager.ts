import { WardrobeItem } from '../types';

export interface PlatformSnapshot {
  id: string;
  timestamp: string;
  wardrobeLength: number;
  wardrobeData: WardrobeItem[];
  vibeSetting: string;
}

export class SnapshotManager {
  private static STORAGE_KEY = 'fashion_platform_snapshots';

  static getSnapshots(): PlatformSnapshot[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveSnapshots(snapshots: PlatformSnapshot[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(snapshots));
  }

  /**
   * Captures the active states at a single point in time.
   */
  static captureSnapshot(wardrobe: WardrobeItem[], vibe: string): PlatformSnapshot {
    const list = this.getSnapshots();
    const snap: PlatformSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toISOString(),
      wardrobeLength: wardrobe.length,
      wardrobeData: [...wardrobe],
      vibeSetting: vibe
    };
    list.unshift(snap); // Newest first
    this.saveSnapshots(list.slice(0, 10)); // Keep top 10 snapshots
    return snap;
  }

  static deleteSnapshot(id: string) {
    const list = this.getSnapshots().filter(s => s.id !== id);
    this.saveSnapshots(list);
  }
}
