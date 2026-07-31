import { getFirestore } from 'firebase-admin/firestore';
import { AIUsageRecord, CreditType } from './types';

// In-memory fallback history ledger
const memoryUsageLogs = new Map<string, AIUsageRecord[]>();
const usageById = new Map<string, AIUsageRecord>();

export class UsageService {
  /**
   * Logs a new AI request in the aiUsageHistory ledger
   */
  public static async logUsage(params: {
    userId: string;
    featureType: string;
    creditType: CreditType;
    creditsUsed: number;
    requestType?: string;
    metadata?: Record<string, any>;
  }): Promise<AIUsageRecord> {
    const usageId = `usg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record: AIUsageRecord = {
      id: usageId,
      userId: params.userId,
      featureType: params.featureType,
      creditType: params.creditType,
      creditsUsed: params.creditsUsed,
      requestType: params.requestType || 'standard',
      timestamp: new Date().toISOString(),
      successStatus: 'pending',
      refunded: false,
      metadata: params.metadata || {}
    };

    // Store in-memory
    usageById.set(usageId, record);
    if (!memoryUsageLogs.has(params.userId)) {
      memoryUsageLogs.set(params.userId, []);
    }
    const userLogs = memoryUsageLogs.get(params.userId)!;
    userLogs.unshift(record);
    if (userLogs.length > 200) userLogs.pop(); // Cap history length in memory

    // Persist to Firestore asynchronously
    try {
      const db = getFirestore();
      await db.collection('aiUsageHistory').doc(usageId).set(record);
    } catch (err: any) {
      console.warn(`[UsageService] Firestore usage log failed (${err.message}). Saved in memory.`);
    }

    return record;
  }

  /**
   * Updates execution status for an AI usage record
   */
  public static async updateUsageStatus(
    usageId: string,
    status: 'success' | 'failed' | 'cancelled',
    options?: { errorReason?: string; executionTimeMs?: number }
  ): Promise<AIUsageRecord | null> {
    const record = usageById.get(usageId);
    if (!record) return null;

    record.successStatus = status;
    if (options?.errorReason) record.errorReason = options.errorReason;
    if (options?.executionTimeMs) record.executionTimeMs = options.executionTimeMs;

    try {
      const db = getFirestore();
      await db.collection('aiUsageHistory').doc(usageId).update({
        successStatus: status,
        errorReason: record.errorReason || null,
        executionTimeMs: record.executionTimeMs || null
      });
    } catch (_) {}

    return record;
  }

  /**
   * Marks a usage record as refunded upon failed generation
   */
  public static async refundUsage(
    usageId: string,
    refundReason: string
  ): Promise<{ success: boolean; record?: AIUsageRecord }> {
    const record = usageById.get(usageId);
    if (!record) return { success: false };

    record.refunded = true;
    record.refundReason = refundReason;
    record.successStatus = 'failed';

    try {
      const db = getFirestore();
      await db.collection('aiUsageHistory').doc(usageId).update({
        refunded: true,
        refundReason,
        successStatus: 'failed'
      });
    } catch (_) {}

    return { success: true, record };
  }

  /**
   * Queries usage history for a given user
   */
  public static async getUsageHistory(
    userId: string,
    limit: number = 50
  ): Promise<AIUsageRecord[]> {
    try {
      const db = getFirestore();
      const snapshot = await db
        .collection('aiUsageHistory')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map(doc => doc.data() as AIUsageRecord);
      }
    } catch (err: any) {
      console.warn(`[UsageService] Firestore history query fallback: ${err.message}`);
    }

    return (memoryUsageLogs.get(userId) || []).slice(0, limit);
  }

  /**
   * Computes aggregated usage metrics for a user
   */
  public static async getUsageSummary(userId: string) {
    const history = await UsageService.getUsageHistory(userId, 500);

    let totalUsed = 0;
    let imageUsed = 0;
    let videoUsed = 0;
    let tryOnUsed = 0;
    let premiumUsed = 0;
    let totalRequests = history.length;
    let failedRequests = 0;

    for (const item of history) {
      if (!item.refunded && item.successStatus !== 'failed') {
        totalUsed += item.creditsUsed;
        if (item.creditType === 'image') imageUsed += item.creditsUsed;
        else if (item.creditType === 'video') videoUsed += item.creditsUsed;
        else if (item.creditType === 'tryOn') tryOnUsed += item.creditsUsed;
        else if (item.creditType === 'premium') premiumUsed += item.creditsUsed;
      }
      if (item.successStatus === 'failed' || item.refunded) {
        failedRequests += 1;
      }
    }

    return {
      totalUsed,
      imageUsed,
      videoUsed,
      tryOnUsed,
      premiumUsed,
      totalRequests,
      failedRequests
    };
  }
}
