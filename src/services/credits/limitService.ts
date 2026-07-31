import { PlanService } from './planService';

interface ActiveJobLock {
  jobId: string;
  userId: string;
  featureType: string;
  startTime: number;
}

// In-memory concurrent execution tracker
const activeJobs = new Map<string, ActiveJobLock[]>();
const userDailyUsageCount = new Map<string, { count: number; dateStr: string }>();

export class LimitService {
  /**
   * Evaluates rate limits, daily caps, and concurrent job capacity
   */
  public static checkLimits(
    userId: string,
    planTier: string,
    featureType: string
  ): { allowed: boolean; reason?: string; activeJobsCount: number; dailyGenerations: number } {
    const planConfig = PlanService.getPlanConfig(planTier);
    const today = new Date().toISOString().split('T')[0];

    // 1. Check daily generation limits
    let dailyData = userDailyUsageCount.get(userId);
    if (!dailyData || dailyData.dateStr !== today) {
      dailyData = { count: 0, dateStr: today };
      userDailyUsageCount.set(userId, dailyData);
    }

    if (dailyData.count >= planConfig.maxDailyGenerations) {
      return {
        allowed: false,
        reason: `Daily AI generation cap reached (${dailyData.count}/${planConfig.maxDailyGenerations}). Upgrade your plan for higher daily limits.`,
        activeJobsCount: (activeJobs.get(userId) || []).length,
        dailyGenerations: dailyData.count
      };
    }

    // 2. Check concurrent job locks
    const userJobs = activeJobs.get(userId) || [];
    // Clean up stale locks older than 5 minutes
    const now = Date.now();
    const validJobs = userJobs.filter(j => now - j.startTime < 300000);
    activeJobs.set(userId, validJobs);

    if (validJobs.length >= planConfig.maxConcurrentJobs) {
      return {
        allowed: false,
        reason: `Concurrent AI request limit reached (${validJobs.length}/${planConfig.maxConcurrentJobs}). Please wait for active generations to finish.`,
        activeJobsCount: validJobs.length,
        dailyGenerations: dailyData.count
      };
    }

    return {
      allowed: true,
      activeJobsCount: validJobs.length,
      dailyGenerations: dailyData.count
    };
  }

  /**
   * Acquires a concurrency lock for an active AI request
   */
  public static acquireLock(userId: string, featureType: string): string {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userJobs = activeJobs.get(userId) || [];
    userJobs.push({
      jobId,
      userId,
      featureType,
      startTime: Date.now()
    });
    activeJobs.set(userId, userJobs);

    // Increment daily usage count
    const today = new Date().toISOString().split('T')[0];
    let dailyData = userDailyUsageCount.get(userId);
    if (!dailyData || dailyData.dateStr !== today) {
      dailyData = { count: 0, dateStr: today };
    }
    dailyData.count += 1;
    userDailyUsageCount.set(userId, dailyData);

    return jobId;
  }

  /**
   * Releases a concurrency lock when job finishes or fails
   */
  public static releaseLock(userId: string, jobId: string): void {
    const userJobs = activeJobs.get(userId) || [];
    const filtered = userJobs.filter(j => j.jobId !== jobId);
    activeJobs.set(userId, filtered);
  }

  /**
   * Gets current user concurrency & daily stats
   */
  public static getUserLimitStats(userId: string, planTier: string) {
    const planConfig = PlanService.getPlanConfig(planTier);
    const today = new Date().toISOString().split('T')[0];
    const dailyData = userDailyUsageCount.get(userId) || { count: 0, dateStr: today };
    const userJobs = (activeJobs.get(userId) || []).filter(j => Date.now() - j.startTime < 300000);

    return {
      dailyGenerationsUsed: dailyData.count,
      maxDailyGenerations: planConfig.maxDailyGenerations,
      activeConcurrentJobs: userJobs.length,
      maxConcurrentJobs: planConfig.maxConcurrentJobs,
      priorityLevel: planConfig.priorityLevel
    };
  }
}
