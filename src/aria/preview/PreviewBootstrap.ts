/**
 * ARIA Preview Bootstrap Layer
 * Product: LOOK VISION v2.4.0-telemetry
 * Safely initializes ARIA Runtime for Google AI Studio Preview and local sandboxes.
 */

import { PreviewEnvironment } from './PreviewEnvironment';
import { PREVIEW_DEMO_USER, DemoUserSession } from './PreviewMockData';
import { ARIARuntime } from '../runtime/ARIARuntime';
import { memoryEngine } from '../memory/MemoryEngine';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';
import { PersonalFashionMemoryEngine } from '../../engine/personalMemory';

export class PreviewBootstrap {
  private static isBootstrapped = false;
  private static activeSession: DemoUserSession = PREVIEW_DEMO_USER;

  /**
   * Initializes ARIA preview layer safely with zero unhandled exceptions
   */
  public static async initializePreviewRuntime(): Promise<{
    success: boolean;
    session: DemoUserSession;
    mode: 'PREVIEW' | 'PRODUCTION';
  }> {
    if (this.isBootstrapped) {
      return { success: true, session: this.activeSession, mode: 'PREVIEW' };
    }

    const startTime = performance.now();
    const envStatus = PreviewEnvironment.getDiagnosticStatus();

    try {
      console.log('[PreviewBootstrap] Bootstrapping ARIA Autonomous Fashion Intelligence Runtime...');

      // 1. Seed Personal Memory Engine for preview user
      const memory = PersonalFashionMemoryEngine.getMemory('preview_user');
      memory.favColors = ['Onyx Black', 'Titanium Silver', 'Charcoal Slate', 'Deep Indigo'];
      memory.favBrands = ['Acne Studios', 'Rick Owens', 'Issey Miyake', 'Zegna Tech'];
      memory.favGarmentTypes = ['Blazer', 'Trousers', 'Loafers', 'Trenchcoat', 'Base Top'];
      memory.styleDNA = {
        primaryVibe: PREVIEW_DEMO_USER.styleDNA.archetype,
        formalityPreference: PREVIEW_DEMO_USER.styleDNA.formalityIndex,
        experimentalIndex: PREVIEW_DEMO_USER.styleDNA.experimentalIndex
      };

      // 2. Initialize ARIA Memory Engine in offline mode
      await memoryEngine.initialize('preview_user');

      // 3. Initialize Style DNA Engine with preview profile
      await styleDNAEngine.initialize('preview_user');

      // 4. Initialize Core ARIA Runtime
      await ARIARuntime.getInstance().initialize('preview_user');

      this.isBootstrapped = true;

      const latencyMs = Math.round(performance.now() - startTime);

      // 5. Send Telemetry to Enterprise Observability Engine
      EnterpriseObservabilityEngine.logTrace({
        engine: 'PreviewBootstrap',
        eventName: 'PREVIEW_BOOTSTRAP_COMPLETE',
        category: 'Workflow',
        payload: `Bootstrapped ARIA Runtime in Preview Mode for user "${PREVIEW_DEMO_USER.userId}" (${PREVIEW_DEMO_USER.styleDNA.archetype}). Active items: ${PREVIEW_DEMO_USER.wardrobe.length}.`,
        latencyMs,
        status: 'Success'
      });

      return {
        success: true,
        session: this.activeSession,
        mode: envStatus.isPreview ? 'PREVIEW' : 'PRODUCTION'
      };
    } catch (err: any) {
      console.warn('[PreviewBootstrap] Preview initialization warning, using safe fallback session:', err);

      this.isBootstrapped = true;

      EnterpriseObservabilityEngine.logTrace({
        engine: 'PreviewBootstrap',
        eventName: 'PREVIEW_BOOTSTRAP_FALLBACK',
        category: 'Workflow',
        payload: `Recovered with local fallback session. Error: ${err.message || String(err)}`,
        latencyMs: Math.round(performance.now() - startTime),
        status: 'Recovered'
      });

      return {
        success: true,
        session: this.activeSession,
        mode: 'PREVIEW'
      };
    }
  }

  /**
   * Returns current active preview user session
   */
  public static getActiveSession(): DemoUserSession {
    return this.activeSession;
  }
}
