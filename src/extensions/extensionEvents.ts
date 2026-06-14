export type ExtensionEventType = 
  | 'onOutfitProposed' 
  | 'onGarmentWorn' 
  | 'onLifecycleAlert' 
  | 'onScoringBiasChanged';

export interface ExtensionEvent {
  type: ExtensionEventType;
  timestamp: string;
  payload: any;
}

export type ExtensionEventHandler = (event: ExtensionEvent) => void;

export class ExtensionEvents {
  private static listeners: Record<string, ExtensionEventHandler[]> = {};

  static subscribe(event: ExtensionEventType, handler: ExtensionEventHandler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  static emit(event: ExtensionEventType, payload: any) {
    const list = this.listeners[event] || [];
    const evt: ExtensionEvent = {
      type: event,
      timestamp: new Date().toISOString(),
      payload
    };
    list.forEach(handler => {
      try {
        handler(evt);
      } catch (err) {
        console.error(`Extension Event Dispatch Failure [${event}]:`, err);
      }
    });
  }

  static clearAll() {
    this.listeners = {};
  }
}
