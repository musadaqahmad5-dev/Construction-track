import { auth, db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { SubscriptionEngine } from './subscriptionEngine';

export interface UsageReport {
  monthlyQuotaAllocated: number;
  monthlyQuotaUsed: number;
  remainingPercentage: number;
  isGovernorActive: boolean;
  warningsRaised: string[];
}

export class UsageGovernor {
  private static imagesUsed = 0;
  private static recommendationsUsed = 0;
  private static snapshotUnsubscribe: (() => void) | null = null;

  static {
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      auth.onAuthStateChanged((user) => {
        if (this.snapshotUnsubscribe) {
          this.snapshotUnsubscribe();
          this.snapshotUnsubscribe = null;
        }

        if (user && db) {
          try {
            const cachedImages = localStorage.getItem(`quota_images_${user.uid}`);
            const cachedRecs = localStorage.getItem(`quota_recs_${user.uid}`);
            if (cachedImages) this.imagesUsed = parseInt(cachedImages, 10) || 0;
            if (cachedRecs) this.recommendationsUsed = parseInt(cachedRecs, 10) || 0;
          } catch (_) {}

          this.snapshotUnsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const quotaUsed = data?.quotaUsed || {};
              this.imagesUsed = typeof quotaUsed.images === 'number' ? quotaUsed.images : 0;
              this.recommendationsUsed = typeof quotaUsed.recommendations === 'number' ? quotaUsed.recommendations : 0;
              try {
                localStorage.setItem(`quota_images_${user.uid}`, String(this.imagesUsed));
                localStorage.setItem(`quota_recs_${user.uid}`, String(this.recommendationsUsed));
              } catch (_) {}
            } else {
              this.imagesUsed = 0;
              this.recommendationsUsed = 0;
            }
          }, (err) => {
            console.warn("[Quota System] Usage governor sync paused. Activating robust in-memory quota fallback tracking immediately:", err);
          });
        } else {
          this.imagesUsed = 0;
          this.recommendationsUsed = 0;
        }
      });
    }
  }

  static checkUsageStats(): UsageReport {
    const sub = SubscriptionEngine.getActiveSubscription();
    // Sum image generations and recommendations for total credits tracking or let it show the recommendations sum
    const totalUsed = this.imagesUsed + this.recommendationsUsed;
    const warns: string[] = [];
    
    const remainingFraction = Math.max(0, (sub.maxCredits - totalUsed) / sub.maxCredits);
    
    if (remainingFraction < 0.2) {
      warns.push("Usage exceeds 80% of your current tier. Upgrade to Pro/Creator to avoid throttling.");
    }

    return {
      monthlyQuotaAllocated: sub.maxCredits,
      monthlyQuotaUsed: totalUsed,
      remainingPercentage: Math.round(remainingFraction * 100),
      isGovernorActive: totalUsed >= sub.maxCredits,
      warningsRaised: warns
    };
  }

  static incrementUsage() {
    this.recommendationsUsed += 1;
    const user = auth.currentUser;
    if (user) {
      try {
        localStorage.setItem(`quota_recs_${user.uid}`, String(this.recommendationsUsed));
      } catch (_) {}
    }
  }
}

