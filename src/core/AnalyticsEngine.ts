import { db, auth } from '../firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

export type AnalyticsEventType =
  | 'auth_signup'
  | 'guest_start'
  | 'wardrobe_item_added'
  | 'outfit_generated'
  | 'outfit_worn'
  | 'outfit_skipped'
  | 'feedback_submitted'
  | 'subscription_clicked'
  | 'planner_used'
  | 'signup_started'
  | 'signup_completed'
  | 'recommendation_generated'
  | 'image_generated'
  | 'checkout_started'
  | 'checkout_completed'
  | 'subscription_canceled';

export interface AnalyticsEvent {
  id: string;
  eventType: AnalyticsEventType;
  timestamp: string;
  userId: string | null;
  params?: Record<string, any>;
}

export interface AnalyticsHealth {
  status: 'HEALTHY' | 'WARNING' | 'ERROR';
  queueSize: number;
  totalEventsTracked: number;
  lastSyncTime: string | null;
  errorCount: number;
}

export class AnalyticsEngine {
  private static eventQueue: AnalyticsEvent[] = [];
  private static totalEventsTracked = 0;
  private static errorCount = 0;
  private static lastSyncTime: string | null = null;
  private static STORAGE_KEY = 'offline_analytics_events';
  private static isSyncing = false;

  static {
    // Load offline events on startup
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          this.eventQueue = JSON.parse(stored);
        }
        const trackedCount = localStorage.getItem('total_events_tracked_count');
        if (trackedCount) {
          this.totalEventsTracked = parseInt(trackedCount, 10);
        }
      } catch (e) {
        console.error('Failed to load offline analytics queue:', e);
      }
    }
  }

  public static track(
    eventType: AnalyticsEventType,
    params?: Record<string, any>,
    productMode: 'DEMO_MODE' | 'LIVE_MODE' | 'AUTOPILOT_MODE' = 'LIVE_MODE'
  ) {
    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      eventType,
      timestamp: new Date().toISOString(),
      userId: auth?.currentUser?.uid || null,
      params,
    };

    this.totalEventsTracked++;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('total_events_tracked_count', this.totalEventsTracked.toString());
      } catch (_) {}
    }

    console.log(`[Analytics Tracked] ${eventType}`, event);

    // Disable in DEMO_MODE - do not persist to queue or Firestore
    if (productMode === 'DEMO_MODE') {
      console.log(`[Analytics] In Demo Mode. Event ${eventType} discarded from persistent queue.`);
      return;
    }

    // Add to queue
    this.eventQueue.push(event);
    this.saveQueueToStorage();

    // Trigger batch write if queue threshold reached (e.g. 3 events) or immediately for high priority events
    if (this.eventQueue.length >= 3 || eventType === 'auth_signup' || eventType === 'subscription_clicked') {
      this.syncBatch();
    }
  }

  public static async syncBatch(): Promise<boolean> {
    if (this.isSyncing || this.eventQueue.length === 0) return false;
    this.isSyncing = true;

    try {
      const batch = writeBatch(db);
      const toSync = [...this.eventQueue];

      toSync.forEach((evt) => {
        const docRef = doc(collection(db, 'analytics'), evt.id);
        batch.set(docRef, {
          eventType: evt.eventType,
          timestamp: evt.timestamp,
          userId: evt.userId,
          params: evt.params || {},
          schema_version: '1.0.0'
        });
      });

      await batch.commit();

      // Clear successful items from queue
      this.eventQueue = this.eventQueue.filter(
        (queued) => !toSync.some((synced) => synced.id === queued.id)
      );
      this.saveQueueToStorage();

      this.lastSyncTime = new Date().toISOString();
      console.log(`[Analytics] Batched sync of ${toSync.length} events succeeded.`);
      this.isSyncing = false;
      return true;
    } catch (err) {
      this.errorCount++;
      console.error('[Analytics] Sync batch failed. Retaining offline queue.', err);
      this.isSyncing = false;
      return false;
    }
  }

  private static saveQueueToStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.eventQueue));
    } catch (e) {
      console.error('Failed to save offline analytics queue to storage:', e);
    }
  }

  public static forceFlush() {
    this.syncBatch();
  }

  public static getHealth(): AnalyticsHealth {
    let status: 'HEALTHY' | 'WARNING' | 'ERROR' = 'HEALTHY';
    if (this.errorCount > 3) {
      status = 'ERROR';
    } else if (this.eventQueue.length > 5) {
      status = 'WARNING';
    }

    return {
      status,
      queueSize: this.eventQueue.length,
      totalEventsTracked: this.totalEventsTracked,
      lastSyncTime: this.lastSyncTime,
      errorCount: this.errorCount,
    };
  }

  public static clearLocalData() {
    this.eventQueue = [];
    this.totalEventsTracked = 0;
    this.errorCount = 0;
    this.lastSyncTime = null;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem('total_events_tracked_count');
      } catch (_) {}
    }
  }
}
