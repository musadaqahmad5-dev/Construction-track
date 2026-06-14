export interface DataRetentionRule {
  dataType: 'StyleDNAMap' | 'CheckoutBaskets' | 'B2BAccessLogs';
  retentionMonths: number;
  encryptionStandard: string;
  autoDeleteEnabled: boolean;
}

export class RetentionPolicy {
  private static rules: DataRetentionRule[] = [
    {
      dataType: 'StyleDNAMap',
      retentionMonths: 24,
      encryptionStandard: 'AES-256GCM',
      autoDeleteEnabled: true
    },
    {
      dataType: 'CheckoutBaskets',
      retentionMonths: 36,
      encryptionStandard: 'AES-256GCM',
      autoDeleteEnabled: false
    },
    {
      dataType: 'B2BAccessLogs',
      retentionMonths: 6,
      encryptionStandard: 'HMAC-SHA256',
      autoDeleteEnabled: true
    }
  ];

  static listRetentionPolicies(): DataRetentionRule[] {
    return this.rules;
  }
}
