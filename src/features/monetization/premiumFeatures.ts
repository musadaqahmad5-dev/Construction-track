import { SubscriptionEngine } from './subscriptionEngine';

export interface UnlockedFeature {
  featureId: string;
  name: string;
  isUnlocked: boolean;
  requiredTier: 'free' | 'pro' | 'creator';
  tokenPriceCost: number;
}

export class PremiumFeatures {
  private static mockFeatures: UnlockedFeature[] = [
    {
      featureId: 'feat-hi-res',
      name: 'Ultra High-Res 4K Vector Renders',
      isUnlocked: false,
      requiredTier: 'pro',
      tokenPriceCost: 5
    },
    {
      featureId: 'feat-private-showroom',
      name: 'Curated Designer Interactive Showroom',
      isUnlocked: false,
      requiredTier: 'pro',
      tokenPriceCost: 10
    },
    {
      featureId: 'feat-unlimited-remixes',
      name: 'Automatic Cross-Creator Feed Remixer',
      isUnlocked: false,
      requiredTier: 'creator',
      tokenPriceCost: 25
    }
  ];

  static queryFeaturesList(): UnlockedFeature[] {
    const activeLevel = SubscriptionEngine.getActiveSubscription().level;
    return this.mockFeatures.map(f => {
      // Unlocked if user level matches or exceeds required
      const tierHierarchy = ['free', 'pro', 'creator', 'enterprise'];
      const userIndex = tierHierarchy.indexOf(activeLevel);
      const reqIndex = tierHierarchy.indexOf(f.requiredTier);
      
      return {
        ...f,
        isUnlocked: userIndex >= reqIndex
      };
    });
  }
}
