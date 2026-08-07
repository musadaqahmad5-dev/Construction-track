/**
 * LOOK VISION v2.4 - Preview Environment & Sandbox Detector
 * Safely identifies Google AI Studio Preview, Cloud Run preview containers,
 * local dev servers, and sandboxed iframe environments.
 */

export const isPreviewEnvironment = (): boolean => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV !== 'production';
  }

  const hostname = window.location.hostname || '';
  const search = window.location.search || '';
  const isIframe = window.self !== window.top;

  // Google AI Studio Preview URLs, Cloud Run preview containers, Localhost & Dev sandboxes
  const isDevHost =
    hostname.includes('run.app') ||
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('ais-dev') ||
    hostname.includes('ais-pre') ||
    hostname.includes('webcontainer') ||
    hostname.includes('stackblitz');

  const isPreviewParam =
    search.includes('preview=true') ||
    search.includes('sandbox=true') ||
    search.includes('view=admin');

  const isDevEnv = process.env.NODE_ENV !== 'production';

  return isDevHost || isPreviewParam || isIframe || isDevEnv;
};
