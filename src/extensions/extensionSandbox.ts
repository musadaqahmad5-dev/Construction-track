import { RuntimeGuard } from '../platform/runtimeGuard';

export interface ExtensionManifest {
  id: string;
  name: string;
  category: 'stylist' | 'scoring' | 'lookbook' | 'planner';
  author: string;
  enabled: boolean;
  permissionRequired?: string;
}

export class ExtensionSandbox {
  /**
   * Executes custom code blocks wrapped inside safety assertion boundaries.
   */
  static executeSafely<T>(
    manifest: ExtensionManifest,
    block: () => T,
    fallback: T
  ): { result: T; success: boolean; error?: string } {
    if (!manifest.enabled) {
      return { result: fallback, success: false, error: `Extension "${manifest.name}" is deactivated.` };
    }

    // Check runtime guard permissions
    if (manifest.permissionRequired) {
      const check = RuntimeGuard.preventUnauthorizedCall('mod-agent', manifest.permissionRequired);
      if (!check.success) {
        return { result: fallback, success: false, error: check.reason };
      }
    }

    try {
      const result = block();
      return { result, success: true };
    } catch (err: any) {
      return { result: fallback, success: false, error: err?.message || 'Unknown sandbox error' };
    }
  }
}
