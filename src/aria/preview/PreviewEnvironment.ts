/**
 * ARIA Preview Environment Detection & Config
 * Product: LOOK VISION v2.4.0-telemetry
 * Architecture: ARIA Autonomous Fashion Intelligence Runtime
 */

export interface PreviewEnvironmentStatus {
  isPreview: boolean;
  isOfflineMode: boolean;
  hasBackendApi: boolean;
  isFirebaseAvailable: boolean;
  isIframe: boolean;
  environmentName: string;
}

export class PreviewEnvironment {
  private static forcedPreviewMode: boolean | null = null;

  /**
   * Set explicit preview mode override
   */
  public static setPreviewOverride(enabled: boolean): void {
    this.forcedPreviewMode = enabled;
  }

  /**
   * Detects whether the current execution context is inside Google AI Studio Preview
   * or a sandboxed local container environment.
   */
  public static isPreviewEnvironment(): boolean {
    if (this.forcedPreviewMode !== null) return this.forcedPreviewMode;

    if (typeof window === 'undefined') return false;

    const host = window.location.hostname || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const isCloudRunDev = host.includes('run.app') || host.includes('ais-dev') || host.includes('ais-pre');
    const isIframe = window.self !== window.top;
    const hasPreviewParam = new URLSearchParams(window.location.search).get('preview') === 'true';

    return isCloudRunDev || isIframe || hasPreviewParam || isLocalhost;
  }

  /**
   * Checks whether the backend API (/api/aria/request) is reachable
   */
  public static async checkBackendApiHealth(): Promise<boolean> {
    if (typeof fetch === 'undefined') return false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch('/api/health', {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch (_) {
      return false;
    }
  }

  /**
   * Returns complete preview environment diagnostic status
   */
  public static getDiagnosticStatus(): PreviewEnvironmentStatus {
    const isIframe = typeof window !== 'undefined' && window.self !== window.top;
    const isPreview = this.isPreviewEnvironment();

    return {
      isPreview,
      isOfflineMode: true, // Always support offline-first local runtime fallback
      hasBackendApi: false, // Default to local runtime in preview
      isFirebaseAvailable: true, // Handled with memory cache fallbacks
      isIframe,
      environmentName: isPreview ? 'Google AI Studio Preview' : 'Production Cloud Run'
    };
  }
}
