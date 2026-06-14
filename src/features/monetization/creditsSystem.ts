import { SubscriptionEngine } from './subscriptionEngine';

export interface CreditBalance {
  totalBalance: number;
  promoCredits: number;
  purchasedCredits: number;
  allocatedMonthly: number;
}

export class CreditsSystem {
  private static userBalance = 24; // starting budget balance

  static getBalance(): CreditBalance {
    const activeSub = SubscriptionEngine.getActiveSubscription();
    return {
      totalBalance: this.userBalance + activeSub.maxCredits,
      promoCredits: 10,
      purchasedCredits: this.userBalance,
      allocatedMonthly: activeSub.maxCredits
    };
  }

  static deductCredits(amount: number): boolean {
    const current = this.getBalance().totalBalance;
    if (current >= amount) {
      this.userBalance -= amount;
      return true;
    }
    return false; // insufficient credits
  }

  static purchasePack(packType: 'small' | 'large'): void {
    if (packType === 'small') {
      this.userBalance += 50;
    } else {
      this.userBalance += 150;
    }
  }
}
