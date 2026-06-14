export interface PlatformEvent {
  id: string;
  timestamp: string;
  aggregateId: string;
  eventType: string;
  data: any;
}

export class EventStore {
  private static STORAGE_KEY = 'fashion_platform_event_store';

  /**
   * Retrieves all logged platform events.
   */
  static getEvents(): PlatformEvent[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Commits a new event to historical storage.
   */
  static commit(eventType: string, aggregateId: string, data: any): PlatformEvent {
    const events = this.getEvents();
    const newEvent: PlatformEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      aggregateId,
      eventType,
      data
    };
    events.push(newEvent);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  }

  /**
   * Replays historical events to debug state flows.
   */
  static queryByAggregate(aggregateId: string): PlatformEvent[] {
    return this.getEvents().filter(e => e.aggregateId === aggregateId);
  }

  /**
   * Purges state history log.
   */
  static clearStore() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
  }
}
