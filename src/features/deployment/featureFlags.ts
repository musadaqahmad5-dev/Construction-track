export interface SystemFeatureFlag {
  flagKey: string;
  labelName: string;
  isEnabled: boolean;
  isEmergencyKillSwitch: boolean;
  affectedSubsystem: string;
}

export class FeatureFlags {
  private static flags: SystemFeatureFlag[] = [
    {
      flagKey: 'opt-b2b-gateway',
      labelName: 'Enable Partner Public APIs',
      isEnabled: true,
      isEmergencyKillSwitch: false,
      affectedSubsystem: 'Enterprise API Platform'
    },
    {
      flagKey: 'kill-high-res-3d',
      labelName: '3D AR Try-On Canvas (Emergency Toggle)',
      isEnabled: true,
      isEmergencyKillSwitch: true,
      affectedSubsystem: '3D Vector Engine rendering'
    },
    {
      flagKey: 'enable-cross-region-sync',
      labelName: 'Synthesize Regional Intelligence Trends',
      isEnabled: true,
      isEmergencyKillSwitch: false,
      affectedSubsystem: 'World Fashion Graph'
    }
  ];

  static queryFlags(): SystemFeatureFlag[] {
    return this.flags;
  }

  static toggleFlag(key: string): boolean {
    const f = this.flags.find(fl => fl.flagKey === key);
    if (f) {
      f.isEnabled = !f.isEnabled;
      return f.isEnabled;
    }
    return false;
  }
}
