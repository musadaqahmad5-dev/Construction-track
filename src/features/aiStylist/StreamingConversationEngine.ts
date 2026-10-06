import {
  StylistRequest,
  StylistResponse,
  StylistRecommendation,
  aiStylistBrain,
  StylistIntent
} from '../../ai/stylist';
import {
  RealtimeConversationStateMachine,
  ConversationStateMetadata,
  ConversationStatus
} from './RealtimeConversationState';
import { TypingPipeline } from './TypingPipeline';

export interface StreamEventChunk {
  type: 'thinking' | 'token' | 'recommendation' | 'intent' | 'complete' | 'error';
  step?: string;
  stepIndex?: number;
  totalSteps?: number;
  token?: string;
  recommendation?: StylistRecommendation;
  intent?: StylistIntent;
  response?: StylistResponse;
  error?: string;
}

export interface StreamingEngineOptions {
  onStateChange?: (state: ConversationStateMetadata) => void;
  onThinkingStep?: (step: string, index: number, total: number) => void;
  onTokenChunk?: (token: string, fullText: string) => void;
  onRecommendationStream?: (recommendation: StylistRecommendation, allRecommendations: StylistRecommendation[]) => void;
  onComplete?: (response: StylistResponse) => void;
  onError?: (error: string) => void;
  timeoutMs?: number;
}

const THINKING_STAGES = [
  { step: 'Analyzing Style DNA & Archetype', index: 0 },
  { step: 'Reading Digital Wardrobe & Fits', index: 1 },
  { step: 'Checking Fashion Memory & DNA', index: 2 },
  { step: 'Consulting Unified Fashion Intelligence', index: 3 },
  { step: 'Synthesizing Color & Silhouette Constraints', index: 4 },
  { step: 'Ranking Recommendations & Confidence', index: 5 },
  { step: 'Building Final Executive Response', index: 6 }
];

export class StreamingConversationEngine {
  private stateMachine: RealtimeConversationStateMachine;
  private typingPipeline: TypingPipeline;
  private abortController: AbortController | null = null;
  private options: StreamingEngineOptions;
  
  private currentRequest: StylistRequest | null = null;
  private streamedTextBuffer: string = '';
  private streamedRecommendations: StylistRecommendation[] = [];
  private timeoutTimer: NodeJS.Timeout | null = null;
  private timeoutMs: number;

  constructor(options: StreamingEngineOptions = {}) {
    this.options = options;
    this.timeoutMs = options.timeoutMs ?? 25000;
    this.stateMachine = new RealtimeConversationStateMachine();
    
    this.typingPipeline = new TypingPipeline({
      baseDelayMs: 12,
      varianceMs: 8,
      onTokenTyped: (chunk, fullText) => {
        if (this.options.onTokenChunk) {
          this.options.onTokenChunk(chunk, fullText);
        }
      }
    });

    this.stateMachine.subscribe(state => {
      if (this.options.onStateChange) {
        this.options.onStateChange(state);
      }
    });
  }

  public getState(): ConversationStateMetadata {
    return this.stateMachine.getState();
  }

  public async streamRequest(request: StylistRequest): Promise<StylistResponse | null> {
    this.cancelInternal(); // Cancel any existing run cleanly

    this.currentRequest = request;
    this.streamedTextBuffer = '';
    this.streamedRecommendations = [];
    this.typingPipeline.reset();

    this.abortController = new AbortController();

    this.stateMachine.transitionTo('Thinking', 'Initiating live reasoning pipeline', {
      thinkingStep: THINKING_STAGES[0].step,
      thinkingStepIndex: 0,
      thinkingTotalSteps: THINKING_STAGES.length,
      progressPercentage: 5,
      errorMessage: null
    });

    this.startTimeoutTimer();

    try {
      // 1. Attempt Server-Sent Events / Streaming API Endpoint if available
      const streamSuccess = await this.tryServerStream(request, this.abortController.signal);
      if (streamSuccess) {
        return this.finalizeStream();
      }

      // 2. Client-side Intelligent Real-Time Simulation Engine Fallback
      return await this.executeClientSideSimulationStream(request);
    } catch (err: any) {
      if (err.name === 'AbortError' || this.getState().status === 'Cancelled') {
        this.stateMachine.transitionTo('Cancelled', 'User cancelled streaming request');
        return null;
      }

      const errorMsg = err.message || 'Stream processing failed';
      this.stateMachine.transitionTo('Failed', errorMsg, { errorMessage: errorMsg });
      if (this.options.onError) {
        this.options.onError(errorMsg);
      }
      return null;
    } finally {
      this.clearTimeoutTimer();
    }
  }

  private async tryServerStream(request: StylistRequest, signal: AbortSignal): Promise<boolean> {
    try {
      const response = await fetch('/api/stylist/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer guest-token'
        },
        body: JSON.stringify(request),
        signal
      });

      if (!response.ok || !response.body) return false;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      this.stateMachine.transitionTo('Streaming', 'Consuming server stream chunks');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace('data: ', '').trim();
            if (jsonStr === '[DONE]') break;
            try {
              const chunk: StreamEventChunk = JSON.parse(jsonStr);
              this.handleStreamChunk(chunk);
            } catch (_) {}
          }
        }
      }

      return true;
    } catch (_) {
      return false;
    }
  }

  private async executeClientSideSimulationStream(request: StylistRequest): Promise<StylistResponse | null> {
    // Stage 1: Live Thinking Pipeline Steps
    for (let i = 0; i < THINKING_STAGES.length - 1; i++) {
      if (this.abortController?.signal.aborted) throw new Error('AbortError');

      const stage = THINKING_STAGES[i];
      const progress = Math.min(90, Math.round(((i + 1) / THINKING_STAGES.length) * 100));

      this.stateMachine.updateMetadata({
        thinkingStep: stage.step,
        thinkingStepIndex: stage.index,
        progressPercentage: progress
      });

      if (this.options.onThinkingStep) {
        this.options.onThinkingStep(stage.step, stage.index, THINKING_STAGES.length);
      }

      await new Promise(r => setTimeout(r, 220 + Math.random() * 150));
    }

    if (this.abortController?.signal.aborted) throw new Error('AbortError');

    // Stage 2: Process request through AI Stylist Brain
    this.stateMachine.transitionTo('Generating', 'Synthesizing response & recommendations', {
      thinkingStep: THINKING_STAGES[THINKING_STAGES.length - 1].step,
      thinkingStepIndex: THINKING_STAGES.length - 1,
      progressPercentage: 95
    });

    const fullResponse = await aiStylistBrain.processRequest(request);

    if (this.abortController?.signal.aborted) throw new Error('AbortError');

    // Stage 3: Streaming text & progressive recommendations
    this.stateMachine.transitionTo('Streaming', 'Token streaming active');

    // Progressive emission of recommendations
    if (fullResponse.recommendations && fullResponse.recommendations.length > 0) {
      for (const rec of fullResponse.recommendations) {
        if (this.abortController?.signal.aborted) throw new Error('AbortError');
        this.streamedRecommendations.push(rec);
        if (this.options.onRecommendationStream) {
          this.options.onRecommendationStream(rec, [...this.streamedRecommendations]);
        }
        await new Promise(r => setTimeout(r, 180));
      }
    }

    // Incremental token streaming via typing pipeline
    const summaryText = fullResponse.summary || '';
    const chunks = summaryText.match(/.{1,8}/g) || [summaryText];

    for (const chunk of chunks) {
      if (this.abortController?.signal.aborted) throw new Error('AbortError');
      this.streamedTextBuffer += chunk;
      this.typingPipeline.appendToken(chunk);
      this.stateMachine.updateMetadata({
        tokensStreamed: this.streamedTextBuffer.length
      });
      await new Promise(r => setTimeout(r, 35));
    }

    // Wait for typing pipeline buffer flush
    this.typingPipeline.flush();

    return this.finalizeStream(fullResponse);
  }

  private handleStreamChunk(chunk: StreamEventChunk): void {
    if (chunk.type === 'thinking') {
      this.stateMachine.transitionTo('Thinking', chunk.step, {
        thinkingStep: chunk.step || '',
        thinkingStepIndex: chunk.stepIndex || 0,
        thinkingTotalSteps: chunk.totalSteps || THINKING_STAGES.length
      });
      if (this.options.onThinkingStep && chunk.step) {
        this.options.onThinkingStep(chunk.step, chunk.stepIndex || 0, chunk.totalSteps || THINKING_STAGES.length);
      }
    } else if (chunk.type === 'token' && chunk.token) {
      if (this.getState().status !== 'Streaming') {
        this.stateMachine.transitionTo('Streaming', 'Receiving tokens');
      }
      this.streamedTextBuffer += chunk.token;
      this.typingPipeline.appendToken(chunk.token);
      this.stateMachine.updateMetadata({
        tokensStreamed: this.streamedTextBuffer.length
      });
    } else if (chunk.type === 'recommendation' && chunk.recommendation) {
      this.streamedRecommendations.push(chunk.recommendation);
      if (this.options.onRecommendationStream) {
        this.options.onRecommendationStream(chunk.recommendation, [...this.streamedRecommendations]);
      }
    }
  }

  private finalizeStream(fallbackResp?: StylistResponse): StylistResponse {
    const resp: StylistResponse = fallbackResp || {
      id: `resp_${Date.now()}`,
      requestId: this.currentRequest?.id || `req_${Date.now()}`,
      intent: this.currentRequest?.overrideIntent || 'GENERAL',
      summary: this.streamedTextBuffer || this.typingPipeline.getFullText(),
      recommendations: this.streamedRecommendations,
      confidence: 0.96,
      actions: [
        {
          id: `act_${Date.now()}_1`,
          type: 'SAVE_OUTFIT',
          label: 'Save Active Outfit',
          payload: { summary: this.streamedTextBuffer }
        }
      ],
      followUpQuestions: [
        'Would you like me to generate lookbook visuals for this outfit?',
        'Shall we check marketplace availability for matching footwear?'
      ],
      metadata: {
        executionTimeMs: this.getState().durationMs || 1200
      },
      timestamp: new Date().toISOString()
    };

    this.stateMachine.transitionTo('Completed', 'Stream finalized successfully', {
      progressPercentage: 100,
      tokensStreamed: resp.summary.length
    });

    if (this.options.onComplete) {
      this.options.onComplete(resp);
    }

    return resp;
  }

  public cancel(): void {
    this.cancelInternal();
    const currentStatus = this.getState().status;
    if (['Thinking', 'Streaming', 'Generating', 'Waiting'].includes(currentStatus)) {
      this.stateMachine.transitionTo('Cancelled', 'User invoked cancellation');
    }
  }

  private cancelInternal(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.typingPipeline.stop();
    this.clearTimeoutTimer();
  }

  public async retry(): Promise<StylistResponse | null> {
    if (!this.currentRequest) return null;
    const retryCount = this.getState().retryCount + 1;
    this.stateMachine.updateMetadata({ retryCount });
    return this.streamRequest(this.currentRequest);
  }

  public async resume(): Promise<StylistResponse | null> {
    if (this.getState().status === 'Cancelled' && this.currentRequest) {
      return this.streamRequest(this.currentRequest);
    }
    this.typingPipeline.resume();
    return null;
  }

  public interrupt(): void {
    this.typingPipeline.flush();
    if (this.abortController) {
      this.abortController.abort();
    }
    this.stateMachine.transitionTo('Completed', 'Interrupted by user - flushed text');
  }

  private startTimeoutTimer(): void {
    this.clearTimeoutTimer();
    this.timeoutTimer = setTimeout(() => {
      if (['Thinking', 'Streaming', 'Generating'].includes(this.getState().status)) {
        this.cancelInternal();
        this.stateMachine.transitionTo('Failed', 'Stream request timed out after 25s', {
          errorMessage: 'Stream connection timed out. Click retry to recover.'
        });
        if (this.options.onError) {
          this.options.onError('Stream timeout exceeded');
        }
      }
    }, this.timeoutMs);
  }

  private clearTimeoutTimer(): void {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }
}
