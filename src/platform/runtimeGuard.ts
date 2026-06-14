import { CapabilityRegistry } from './capabilityRegistry';

export class RuntimeGuard {
  /**
   * Evaluates if a process can execute based on module permissions and enabled status.
   */
  static preventUnauthorizedCall(moduleId: string, requiredPermission?: string): { success: boolean; reason?: string } {
    const list = CapabilityRegistry.loadRegistry();
    const target = list.find(m => m.id === moduleId);

    if (!target) {
      return { success: false, reason: `Module Registry: ID "${moduleId}" is not registered on this platform.` };
    }

    if (!target.enabled) {
      return { success: false, reason: `Module Registry: Module "${target.name}" is deactivated. Please enable it in the Control Plane.` };
    }

    if (requiredPermission && !target.permissions.includes(requiredPermission)) {
      return { success: false, reason: `Module Registry: Permission violation. Module "${target.name}" lacks permission attribute "${requiredPermission}".` };
    }

    return { success: true };
  }
}
