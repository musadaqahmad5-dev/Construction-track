export interface UserConsent {
  allowStyleProfileTracking: boolean;
  allowMarketplacePublishing: boolean;
  cookieConsentAccepted: boolean;
  versionSigned: string;
  signedAt: Date;
}

export class ConsentManager {
  private static activeConsent: UserConsent = {
    allowStyleProfileTracking: true,
    allowMarketplacePublishing: true,
    cookieConsentAccepted: true,
    versionSigned: 'GDPR-v2.1',
    signedAt: new Date(Date.now() - 86400000 * 10)
  };

  static queryConsent(): UserConsent {
    return this.activeConsent;
  }

  static updateConsent(updated: Partial<UserConsent>): void {
    this.activeConsent = {
      ...this.activeConsent,
      ...updated,
      signedAt: new Date()
    };
  }
}
