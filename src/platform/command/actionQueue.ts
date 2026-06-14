export interface QueueAction {
  id: string;
  commandType: string;
  payload: any;
  priority: 'High' | 'Normal' | 'Low';
  status: 'queued' | 'executing' | 'completed' | 'failed' | 'paused';
  requiresApproval: boolean;
  userApproved?: 'approved' | 'rejected' | 'pending';
}

export class ActionQueue {
  private static STORAGE_KEY = 'fashion_platform_action_queue';

  static getQueue(): QueueAction[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveQueue(queue: QueueAction[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
  }

  /**
   * Pushes a new operation to the command pipeline.
   */
  static enqueue(commandType: string, payload: any, priority: 'High' | 'Normal' | 'Low' = 'Normal'): QueueAction {
    const queue = this.getQueue();
    const action: QueueAction = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      commandType,
      payload,
      priority,
      status: 'queued',
      requiresApproval: true,
      userApproved: 'pending'
    };
    queue.push(action);
    this.saveQueue(queue);
    return action;
  }

  /**
   * Approves and kicks off an action, updating status to completed.
   */
  static approveAndExecute(actionId: string): { success: boolean; error?: string } {
    const queue = this.getQueue();
    const target = queue.find(a => a.id === actionId);
    if (!target) return { success: false, error: 'Action not found in queue.' };

    target.userApproved = 'approved';
    target.status = 'completed';
    this.saveQueue(queue);
    return { success: true };
  }

  static rejectAction(actionId: string) {
    const queue = this.getQueue();
    const target = queue.find(a => a.id === actionId);
    if (target) {
      target.userApproved = 'rejected';
      target.status = 'failed';
      this.saveQueue(queue);
    }
  }

  static clearQueue() {
    this.saveQueue([]);
  }
}
