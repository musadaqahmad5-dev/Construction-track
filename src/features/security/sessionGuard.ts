export interface SessionInfo {
  tokenExpiryTime: number;
  rateLimitHits: number;
  lastRequestTime: number;
  tamperDetected: boolean;
}

export class SessionGuard {
  private static readonly SESSION_STATE_KEY = 'ai_fashion_session_guard';

  public static getSessionInfo(): SessionInfo {
    try {
      const data = localStorage.getItem(this.SESSION_STATE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Swallowed
    }

    const defaultSession: SessionInfo = {
      tokenExpiryTime: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
      rateLimitHits: 0,
      lastRequestTime: Date.now(),
      tamperDetected: false
    };

    this.saveSessionInfo(defaultSession);
    return defaultSession;
  }

  public static saveSessionInfo(info: SessionInfo): void {
    try {
      localStorage.setItem(this.SESSION_STATE_KEY, JSON.stringify(info));
    } catch {
      // Swallowed
    }
  }

  public static checkRequestValidity(): { permitted: boolean; reason?: string } {
    const info = this.getSessionInfo();
    const now = Date.now();

    // 1. Token Lifetime Check
    if (now > info.tokenExpiryTime) {
      return { permitted: false, reason: 'EPHEMERAL_TOKEN_EXPIRED' };
    }

    // 2. Tampered Storage Detection
    if (info.tamperDetected) {
      return { permitted: false, reason: 'INTEGRITY_VIOLATION_TAMPER' };
    }

    // 3. Simple Client Rate Controller
    const timeSinceLast = now - info.lastRequestTime;
    if (timeSinceLast < 150) { // Max 6 requests per second burst limit
      info.rateLimitHits++;
      if (info.rateLimitHits > 8) {
        this.saveSessionInfo(info);
        return { permitted: false, reason: 'CONCURRENT_TPS_BURST_BREACH' };
      }
    } else {
      // Cooling off
      info.rateLimitHits = Math.max(0, info.rateLimitHits - 2);
    }

    info.lastRequestTime = now;
    this.saveSessionInfo(info);
    return { permitted: true };
  }

  public static forceSessionReset(): void {
    const info = this.getSessionInfo();
    info.tokenExpiryTime = Date.now() + 2 * 60 * 60 * 1000;
    info.rateLimitHits = 0;
    info.tamperDetected = false;
    this.saveSessionInfo(info);
  }
}
