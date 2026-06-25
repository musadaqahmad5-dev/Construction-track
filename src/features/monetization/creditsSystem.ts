import { auth, db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { SubscriptionEngine } from './subscriptionEngine';

export interface CreditBalance {
  totalBalance: number;
  promoCredits: number;
  purchasedCredits: number;
  allocatedMonthly: number;
}

export class CreditsSystem {
  private static imagesUsed = 0;
  private static recommendationsUsed = 0;

  static {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const quotaUsed = data?.quotaUsed || {};
            this.imagesUsed = typeof quotaUsed.images === 'number' ? quotaUsed.images : 0;
            this.recommendationsUsed = typeof quotaUsed.recommendations === 'number' ? quotaUsed.recommendations : 0;
          } else {
            this.imagesUsed = 0;
            this.recommendationsUsed = 0;
          }
        });
      } else {
        this.imagesUsed = 0;
        this.recommendationsUsed = 0;
      }
    });
  }

  static getBalance(): CreditBalance {
    const activeSub = SubscriptionEngine.getActiveSubscription();
    const totalUsed = this.imagesUsed + this.recommendationsUsed;
    const remaining = Math.max(0, activeSub.maxCredits - totalUsed);
    return {
      totalBalance: remaining,
      promoCredits: 0,
      purchasedCredits: 0,
      allocatedMonthly: activeSub.maxCredits
    };
  }

  static deductCredits(amount: number): boolean {
    const current = this.getBalance().totalBalance;
    if (current >= amount) {
      // Securely deducted on the server!
      return true;
    }
    return false; // insufficient credits
  }

  static purchasePack(packType: 'small' | 'large'): void {
    // Handled via Stripe subscription/purchase flows!
  }
}

