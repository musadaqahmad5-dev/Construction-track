export interface ReleaseChannel {
  channelName: 'canary' | 'beta' | 'stable';
  targetAllocationPercent: number;
  deployedRevisionHash: string;
  isLocked: boolean;
}

export class ReleaseChannels {
  private static channels: ReleaseChannel[] = [
    {
      channelName: 'stable',
      targetAllocationPercent: 90,
      deployedRevisionHash: 'rev-v15.0.0-stable',
      isLocked: true
    },
    {
      channelName: 'beta',
      targetAllocationPercent: 9,
      deployedRevisionHash: 'rev-v15.1.0-rc2',
      isLocked: false
    },
    {
      channelName: 'canary',
      targetAllocationPercent: 1,
      deployedRevisionHash: 'rev-v15.2.0-alpha1',
      isLocked: false
    }
  ];

  static queryChannelsList(): ReleaseChannel[] {
    return this.channels;
  }

  static calibrateAllocations(canary: number, beta: number): void {
    const stable = 100 - canary - beta;
    const stableChan = this.channels.find(c => c.channelName === 'stable');
    const betaChan = this.channels.find(c => c.channelName === 'beta');
    const canaryChan = this.channels.find(c => c.channelName === 'canary');

    if (stableChan && betaChan && canaryChan) {
      stableChan.targetAllocationPercent = stable;
      betaChan.targetAllocationPercent = beta;
      canaryChan.targetAllocationPercent = canary;
    }
  }
}
