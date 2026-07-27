/**
 * DeviceReactionEngine.ts
 * AIStyleHub - Backend Auto-Adaptive Layout & User Device Reaction Engine
 * 
 * Analyzes real-time client viewport metrics, user-agent device signatures, screen DPI,
 * touch parameters, and network constraints to generate server-driven adaptive layout
 * profiles and device reaction telemetry logs.
 */

export interface DeviceTelemetryPayload {
  width: number;
  height: number;
  pixelRatio: number;
  orientation?: 'PORTRAIT' | 'LANDSCAPE';
  userAgent?: string;
  viewportMode?: 'AUTO' | 'MOBILE' | 'DESKTOP';
  touchCapable?: boolean;
  connectionType?: string;
  colorScheme?: 'dark' | 'light';
  userId?: string;
}

export interface AdaptiveLayoutResponse {
  breakpoint: 'XS' | 'SM' | 'MD' | 'LG' | 'XL' | '2XL' | '3XL';
  deviceType: 'MOBILE_PHONE' | 'TABLET' | 'DESKTOP' | 'LARGE_DISPLAY' | 'FOLDABLE';
  operatingSystem: 'iOS' | 'Android' | 'macOS' | 'Windows' | 'Linux' | 'Unknown';
  browserEngine: 'Chromium' | 'WebKit' | 'Gecko' | 'Other';
  recommendedColumns: {
    feed: number;
    closet: number;
    marketplace: number;
  };
  cardDensity: 'COMPACT' | 'COMFORTABLE' | 'SPACIOUS';
  sidebarBehavior: 'COLLAPSED_ICON_BAR' | 'FULL_EXPANDED' | 'MOBILE_BOTTOM_SHEET';
  mediaQuality: 'HIGH_RES_WEBP' | 'OPTIMIZED_JPEG' | 'BANDWIDTH_SAVER';
  touchTargetPadding: string;
  deviceReactionStatus: string;
  telemetrySummary: string;
  timestamp: string;
}

export class DeviceReactionEngine {
  private static userPreferencesMap = new Map<string, string>();

  /**
   * Main server-side device reaction algorithm.
   * Analyzes incoming client parameters to return optimal layout parameters.
   */
  public static analyzeClientDevice(payload: DeviceTelemetryPayload): AdaptiveLayoutResponse {
    const w = payload.width || 1280;
    const h = payload.height || 800;
    const ratio = payload.pixelRatio || 1;
    const ua = payload.userAgent || '';
    const orientation = payload.orientation || (w > h ? 'LANDSCAPE' : 'PORTRAIT');

    // 1. Breakpoint Classification
    let breakpoint: 'XS' | 'SM' | 'MD' | 'LG' | 'XL' | '2XL' | '3XL' = 'XL';
    if (w < 480) breakpoint = 'XS';
    else if (w < 640) breakpoint = 'SM';
    else if (w < 768) breakpoint = 'MD';
    else if (w < 1024) breakpoint = 'LG';
    else if (w < 1440) breakpoint = 'XL';
    else if (w < 1920) breakpoint = '2XL';
    else breakpoint = '3XL';

    // 2. OS & Browser Detection
    let operatingSystem: 'iOS' | 'Android' | 'macOS' | 'Windows' | 'Linux' | 'Unknown' = 'Unknown';
    if (/iPhone|iPad|iPod/i.test(ua)) operatingSystem = 'iOS';
    else if (/Android/i.test(ua)) operatingSystem = 'Android';
    else if (/Mac OS X|Macintosh/i.test(ua)) operatingSystem = 'macOS';
    else if (/Windows/i.test(ua)) operatingSystem = 'Windows';
    else if (/Linux/i.test(ua)) operatingSystem = 'Linux';

    let browserEngine: 'Chromium' | 'WebKit' | 'Gecko' | 'Other' = 'Other';
    if (/Chrome|Chromium|Edg|Brave/i.test(ua)) browserEngine = 'Chromium';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browserEngine = 'WebKit';
    else if (/Firefox/i.test(ua)) browserEngine = 'Gecko';

    // 3. Device Category Classification
    let deviceType: 'MOBILE_PHONE' | 'TABLET' | 'DESKTOP' | 'LARGE_DISPLAY' | 'FOLDABLE' = 'DESKTOP';
    if (operatingSystem === 'iOS' || operatingSystem === 'Android') {
      if (w >= 768) {
        deviceType = 'TABLET';
      } else {
        deviceType = 'MOBILE_PHONE';
      }
    } else {
      if (w >= 1920) {
        deviceType = 'LARGE_DISPLAY';
      } else if (w < 768) {
        deviceType = 'MOBILE_PHONE';
      } else {
        deviceType = 'DESKTOP';
      }
    }

    // Explicit override if viewportMode is set to MOBILE or DESKTOP
    if (payload.viewportMode === 'MOBILE') {
      deviceType = 'MOBILE_PHONE';
    } else if (payload.viewportMode === 'DESKTOP') {
      deviceType = 'DESKTOP';
    }

    // 4. Grid Columns Calculation
    let feedCols = 3;
    let closetCols = 4;
    let marketplaceCols = 3;

    if (deviceType === 'MOBILE_PHONE' || breakpoint === 'XS' || breakpoint === 'SM') {
      feedCols = 1;
      closetCols = 2;
      marketplaceCols = 1;
    } else if (deviceType === 'TABLET' || breakpoint === 'MD' || breakpoint === 'LG') {
      feedCols = 2;
      closetCols = 3;
      marketplaceCols = 2;
    } else if (breakpoint === 'XL') {
      feedCols = 3;
      closetCols = 4;
      marketplaceCols = 3;
    } else {
      feedCols = 4;
      closetCols = 6;
      marketplaceCols = 4;
    }

    // 5. Card Density & Sidebar Behavior
    let cardDensity: 'COMPACT' | 'COMFORTABLE' | 'SPACIOUS' = 'COMFORTABLE';
    if (breakpoint === 'XS' || breakpoint === 'SM') cardDensity = 'COMPACT';
    else if (breakpoint === 'XL' || breakpoint === '2XL' || breakpoint === '3XL') cardDensity = 'SPACIOUS';

    let sidebarBehavior: 'COLLAPSED_ICON_BAR' | 'FULL_EXPANDED' | 'MOBILE_BOTTOM_SHEET' = 'FULL_EXPANDED';
    if (deviceType === 'MOBILE_PHONE' || w < 768) {
      sidebarBehavior = 'MOBILE_BOTTOM_SHEET';
    } else if (w < 1280) {
      sidebarBehavior = 'COLLAPSED_ICON_BAR';
    }

    // 6. Media Quality Optimization
    let mediaQuality: 'HIGH_RES_WEBP' | 'OPTIMIZED_JPEG' | 'BANDWIDTH_SAVER' = 'HIGH_RES_WEBP';
    if (payload.connectionType === '2g' || payload.connectionType === '3g') {
      mediaQuality = 'BANDWIDTH_SAVER';
    } else if (ratio < 1.5) {
      mediaQuality = 'OPTIMIZED_JPEG';
    }

    // 7. Touch Target Padding
    const touchTargetPadding = payload.touchCapable || deviceType === 'MOBILE_PHONE' ? 'p-3.5 min-h-[44px]' : 'p-2 min-h-[36px]';

    const statusMsg = `Device Reaction Active: ${deviceType} (${w}x${h}px @ ${ratio}x DPI, ${orientation}, ${breakpoint} Viewport)`;
    const summary = `${operatingSystem} (${browserEngine}) • ${feedCols}-Col Feed / ${closetCols}-Col Closet • ${cardDensity} Density`;

    return {
      breakpoint,
      deviceType,
      operatingSystem,
      browserEngine,
      recommendedColumns: {
        feed: feedCols,
        closet: closetCols,
        marketplace: marketplaceCols
      },
      cardDensity,
      sidebarBehavior,
      mediaQuality,
      touchTargetPadding,
      deviceReactionStatus: statusMsg,
      telemetrySummary: summary,
      timestamp: new Date().toISOString()
    };
  }

  public static setPreference(userId: string, mode: string): void {
    this.userPreferencesMap.set(userId, mode);
  }

  public static getPreference(userId: string): string {
    return this.userPreferencesMap.get(userId) || 'AUTO';
  }
}
