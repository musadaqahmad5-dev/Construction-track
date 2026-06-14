import { SnapshotManager, PlatformSnapshot } from './snapshotManager';
import { WardrobeItem } from '../types';

export class RecoveryCoordinator {
  /**
   * Restores wardrobe and state values from a historical snapshot.
   */
  static rollbackToSnapshot(
    snapshotId: string,
    setWardrobeCallback: (items: WardrobeItem[]) => void,
    setVibeCallback: (vibe: any) => void
  ): { success: boolean; snapshot?: PlatformSnapshot; error?: string } {
    const snaps = SnapshotManager.getSnapshots();
    const target = snaps.find(s => s.id === snapshotId);
    if (!target) {
      return { success: false, error: `Snapshot "${snapshotId}" was not found or is corrupted.` };
    }

    try {
      // Execute state rollbacks cleanly
      setWardrobeCallback(target.wardrobeData);
      setVibeCallback(target.vibeSetting);
      return { success: true, snapshot: target };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error occurred during rollback restoration.' };
    }
  }
}
