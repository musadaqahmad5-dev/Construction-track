export type ConversationStatus =
  | 'Idle'
  | 'Thinking'
  | 'Streaming'
  | 'Generating'
  | 'Waiting'
  | 'Cancelled'
  | 'Completed'
  | 'Failed';

export interface StateTransitionEvent {
  from: ConversationStatus;
  to: ConversationStatus;
  timestamp: string;
  reason?: string;
}

export interface ConversationStateMetadata {
  status: ConversationStatus;
  startedAt: string | null;
  endedAt: string | null;
  durationMs: number;
  tokensStreamed: number;
  thinkingStep: string;
  thinkingStepIndex: number;
  thinkingTotalSteps: number;
  progressPercentage: number;
  retryCount: number;
  maxRetries: number;
  errorMessage: string | null;
  canCancel: boolean;
  canRetry: boolean;
  canResume: boolean;
}

export const INITIAL_CONVERSATION_STATE: ConversationStateMetadata = {
  status: 'Idle',
  startedAt: null,
  endedAt: null,
  durationMs: 0,
  tokensStreamed: 0,
  thinkingStep: '',
  thinkingStepIndex: 0,
  thinkingTotalSteps: 6,
  progressPercentage: 0,
  retryCount: 0,
  maxRetries: 3,
  errorMessage: null,
  canCancel: false,
  canRetry: false,
  canResume: false
};

const VALID_TRANSITIONS: Record<ConversationStatus, ConversationStatus[]> = {
  Idle: ['Thinking', 'Streaming', 'Generating', 'Waiting', 'Cancelled', 'Failed'],
  Thinking: ['Streaming', 'Generating', 'Waiting', 'Cancelled', 'Failed'],
  Streaming: ['Generating', 'Thinking', 'Waiting', 'Cancelled', 'Completed', 'Failed'],
  Generating: ['Streaming', 'Thinking', 'Waiting', 'Cancelled', 'Completed', 'Failed'],
  Waiting: ['Thinking', 'Streaming', 'Generating', 'Cancelled', 'Completed', 'Failed'],
  Cancelled: ['Idle', 'Thinking', 'Streaming'],
  Completed: ['Idle', 'Thinking', 'Streaming'],
  Failed: ['Idle', 'Thinking', 'Streaming', 'Waiting']
};

export class RealtimeConversationStateMachine {
  private metadata: ConversationStateMetadata;
  private listeners: Set<(state: ConversationStateMetadata, event: StateTransitionEvent) => void> = new Set();
  private history: StateTransitionEvent[] = [];

  constructor(initialState?: Partial<ConversationStateMetadata>) {
    this.metadata = {
      ...INITIAL_CONVERSATION_STATE,
      ...initialState
    };
  }

  public getState(): ConversationStateMetadata {
    return { ...this.metadata };
  }

  public canTransitionTo(targetStatus: ConversationStatus): boolean {
    const currentStatus = this.metadata.status;
    if (currentStatus === targetStatus) return true;
    return VALID_TRANSITIONS[currentStatus]?.includes(targetStatus) ?? false;
  }

  public transitionTo(
    targetStatus: ConversationStatus,
    reason?: string,
    updates?: Partial<ConversationStateMetadata>
  ): ConversationStateMetadata {
    const currentStatus = this.metadata.status;

    if (!this.canTransitionTo(targetStatus)) {
      console.warn(`[RealtimeStateMachine] Invalid transition from ${currentStatus} to ${targetStatus}`);
    }

    const now = new Date().toISOString();
    let startedAt = this.metadata.startedAt;
    let endedAt = this.metadata.endedAt;
    let durationMs = this.metadata.durationMs;

    if (currentStatus === 'Idle' && targetStatus !== 'Idle') {
      startedAt = now;
      endedAt = null;
    }

    if (['Completed', 'Cancelled', 'Failed'].includes(targetStatus)) {
      endedAt = now;
      if (startedAt) {
        durationMs = new Date(now).getTime() - new Date(startedAt).getTime();
      }
    }

    const canCancel = ['Thinking', 'Streaming', 'Generating', 'Waiting'].includes(targetStatus);
    const canRetry = targetStatus === 'Failed' || targetStatus === 'Cancelled';
    const canResume = targetStatus === 'Cancelled' || targetStatus === 'Failed' || targetStatus === 'Waiting';

    this.metadata = {
      ...this.metadata,
      ...updates,
      status: targetStatus,
      startedAt,
      endedAt,
      durationMs,
      canCancel,
      canRetry,
      canResume
    };

    const transitionEvent: StateTransitionEvent = {
      from: currentStatus,
      to: targetStatus,
      timestamp: now,
      reason
    };

    this.history.push(transitionEvent);
    this.notifyListeners(transitionEvent);

    return this.getState();
  }

  public updateMetadata(updates: Partial<ConversationStateMetadata>): ConversationStateMetadata {
    this.metadata = { ...this.metadata, ...updates };
    return this.getState();
  }

  public reset(): ConversationStateMetadata {
    this.metadata = { ...INITIAL_CONVERSATION_STATE };
    return this.getState();
  }

  public subscribe(
    listener: (state: ConversationStateMetadata, event: StateTransitionEvent) => void
  ): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(event: StateTransitionEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState(), event);
      } catch (e) {
        console.error('[RealtimeStateMachine] Error in state listener:', e);
      }
    });
  }

  public getHistory(): StateTransitionEvent[] {
    return [...this.history];
  }
}
