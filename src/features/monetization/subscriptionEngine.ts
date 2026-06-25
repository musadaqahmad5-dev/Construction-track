import { auth, db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export type SubscriptionLevel = 'free' | 'pro' | 'creator' | 'enterprise';

export interface SubscriptionStats {
  level: SubscriptionLevel;
  monthlyFee: number;
  maxCredits: number;
  perMatchFeePercent: number; // For marketplace transactions
  coCreateAllowed: boolean;
  priorityRendering: boolean;
}

export class SubscriptionEngine {
  private static activeStatus: SubscriptionLevel = 'free';

  static {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const tier = data?.subscription?.tier;
            if (tier) {
              const normalized = tier.toLowerCase();
              if (['free', 'pro', 'creator', 'enterprise'].includes(normalized)) {
                this.activeStatus = normalized as SubscriptionLevel;
              }
            }
          } else {
            this.activeStatus = 'free';
          }
        });
      } else {
        this.activeStatus = 'free';
      }
    });
  }

  static getSubscriptionTierData(level: SubscriptionLevel): SubscriptionStats {
    switch (level) {
      case 'pro':
        return {
          level: 'pro',
          monthlyFee: 19,
          maxCredits: 500,
          perMatchFeePercent: 1.5,
          coCreateAllowed: true,
          priorityRendering: true
        };
      case 'creator':
        return {
          level: 'creator',
          monthlyFee: 49,
          maxCredits: 2000,
          perMatchFeePercent: 0.5,
          coCreateAllowed: true,
          priorityRendering: true
        };
      case 'enterprise':
        return {
          level: 'enterprise',
          monthlyFee: 199,
          maxCredits: 9999,
          perMatchFeePercent: 0.2,
          coCreateAllowed: true,
          priorityRendering: true
        };
      case 'free':
      default:
        return {
          level: 'free',
          monthlyFee: 0,
          maxCredits: 30,
          perMatchFeePercent: 3.5,
          coCreateAllowed: false,
          priorityRendering: false
        };
    }
  }

  static getActiveSubscription(): SubscriptionStats {
    return this.getSubscriptionTierData(this.activeStatus);
  }

  static upgradeSubscription(level: SubscriptionLevel): void {
    this.activeStatus = level;
  }
}

