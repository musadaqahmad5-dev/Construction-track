/**
 * ARIA Prototype Controller
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 * 
 * Central controller for the ARIA Prototype Experience Integration Layer.
 * Connects request routing, state management, session persistence, demo scenarios, and observability.
 */

import {
  ARIAPrototypeState,
  ARIAUserRequest,
  ARIARecommendationResult,
  ARIAExperienceSession,
  ARIAInteractionEvent
} from './ARIAPrototypeTypes';
import { ARIAWorkflowEngine } from './ARIAWorkflowEngine';
import { ARIAPrototypeStorage } from './ARIAPrototypeStorage';
import { ARIAExperienceController } from '../ariaExperience/ARIAExperienceController';
import { ARIAIntent } from '../../aria/orchestrator/ARIAOrchestratorTypes';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class ARIAPrototypeController {
  private static instance: ARIAPrototypeController;

  private state: ARIAPrototypeState = {
    isInitialized: false,
    isProcessing: false,
    availableSessions: [],
    activeEnginesCount: 17
  };

  private listeners: Set<(state: ARIAPrototypeState) => void> = new Set();

  private constructor() {}

  public static getInstance(): ARIAPrototypeController {
    if (!ARIAPrototypeController.instance) {
      ARIAPrototypeController.instance = new ARIAPrototypeController();
    }
    return ARIAPrototypeController.instance;
  }

  public subscribe(listener: (state: ARIAPrototypeState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }

  private updateState(partial: Partial<ARIAPrototypeState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public getState(): ARIAPrototypeState {
    return this.state;
  }

  /**
   * Initialize prototype environment and load stored user sessions
   */
  public async initialize(userId: string = 'guest_user'): Promise<void> {
    if (this.state.isInitialized) return;

    try {
      // Initialize ARIA Experience Controller
      await ARIAExperienceController.getInstance().initializeExperience(userId);

      const sessions = await ARIAPrototypeStorage.listUserSessions(userId);
      let activeSession = sessions[0];

      if (!activeSession) {
        activeSession = await this.startNewSession(userId, 'Autonomous Fashion Studio Session');
      }

      this.updateState({
        isInitialized: true,
        activeSessionId: activeSession.sessionId,
        currentSession: activeSession,
        availableSessions: sessions.length > 0 ? sessions : [activeSession],
        lastResult: activeSession.resultsHistory[0] || undefined
      });

      EnterpriseObservabilityEngine.logTrace({
        engine: 'ARIAPrototypeController',
        eventName: 'PROTOTYPE_INITIALIZED',
        category: 'Execution',
        payload: `ARIA Prototype Controller initialized for ${userId} with session ${activeSession.sessionId}`,
        latencyMs: 12,
        status: 'Success'
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updateState({ isInitialized: true, errorMessage: msg });
    }
  }

  /**
   * Start a brand new prototype session
   */
  public async startNewSession(userId: string = 'guest_user', title: string = 'New Fashion Session'): Promise<ARIAExperienceSession> {
    const sessionId = `aria_session_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newSession: ARIAExperienceSession = {
      sessionId,
      userId,
      sessionTitle: title,
      createdAt: new Date().toISOString(),
      lastInteractionAt: new Date().toISOString(),
      totalRequestsCount: 0,
      requestsHistory: [],
      resultsHistory: []
    };

    await ARIAPrototypeStorage.saveSession(newSession);

    const updatedList = [newSession, ...this.state.availableSessions];
    this.updateState({
      activeSessionId: sessionId,
      currentSession: newSession,
      availableSessions: updatedList,
      lastResult: undefined
    });

    return newSession;
  }

  /**
   * Switch active session
   */
  public async switchSession(sessionId: string): Promise<void> {
    const session = this.state.availableSessions.find((s) => s.sessionId === sessionId);
    if (session) {
      this.updateState({
        activeSessionId: sessionId,
        currentSession: session,
        lastResult: session.resultsHistory[0] || undefined
      });
    }
  }

  /**
   * Submit request to the ARIA End-to-End Prototype Experience Integration Layer
   */
  public async submitRequest(params: {
    userPrompt: string;
    userId?: string;
    imageUrl?: string;
    imageBase64?: string;
    imageName?: string;
    intent?: ARIAIntent;
    context?: Record<string, unknown>;
  }): Promise<ARIARecommendationResult> {
    const userId = params.userId || this.state.currentSession?.userId || 'guest_user';
    const sessionId = this.state.activeSessionId || `aria_session_${Date.now()}`;

    this.updateState({ isProcessing: true, errorMessage: undefined });

    const userRequest: ARIAUserRequest = {
      requestId: `aria_req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId,
      userId,
      userPrompt: params.userPrompt,
      imageUrl: params.imageUrl,
      imageBase64: params.imageBase64,
      imageName: params.imageName,
      intent: params.intent,
      context: params.context as any,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Log Request Event
      const reqEvent: ARIAInteractionEvent = {
        eventId: `evt_req_${Date.now()}`,
        sessionId,
        userId,
        eventType: 'REQUEST',
        payload: { prompt: params.userPrompt, intent: params.intent },
        timestamp: new Date().toISOString()
      };
      await ARIAPrototypeStorage.logInteractionEvent(reqEvent);

      // 2. Execute full workflow
      const result = await ARIAWorkflowEngine.getInstance().executeWorkflow(userRequest);

      // 3. Update Experience Session
      const current = this.state.currentSession || {
        sessionId,
        userId,
        sessionTitle: 'Fashion Session',
        createdAt: new Date().toISOString(),
        lastInteractionAt: new Date().toISOString(),
        totalRequestsCount: 0,
        requestsHistory: [],
        resultsHistory: []
      };

      const updatedSession: ARIAExperienceSession = {
        ...current,
        lastInteractionAt: new Date().toISOString(),
        totalRequestsCount: current.totalRequestsCount + 1,
        requestsHistory: [...current.requestsHistory, userRequest],
        resultsHistory: [result, ...current.resultsHistory]
      };

      // 4. Save Session
      await ARIAPrototypeStorage.saveSession(updatedSession);

      // 5. Update Local State
      const updatedSessions = this.state.availableSessions.map((s) =>
        s.sessionId === sessionId ? updatedSession : s
      );

      this.updateState({
        isProcessing: false,
        currentSession: updatedSession,
        availableSessions: updatedSessions,
        lastResult: result
      });

      // 6. Sync with ARIA Experience Controller for UI consistency
      await ARIAExperienceController.getInstance().sendMessage(params.userPrompt, userId);

      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updateState({ isProcessing: false, errorMessage: msg });

      EnterpriseObservabilityEngine.logTrace({
        engine: 'ARIAPrototypeController',
        eventName: 'PROTOTYPE_ERROR',
        category: 'Execution',
        payload: `Error submitting request: ${msg}`,
        latencyMs: 0,
        status: 'Failure'
      });

      throw err;
    }
  }

  /**
   * Execute predefined Demo Scenarios
   */
  public async executeDemoScenario(scenarioId: 'SCENARIO_1_EXECUTIVE' | 'SCENARIO_2_OUTFIT_ANALYSIS' | 'SCENARIO_3_STYLE_EVOLUTION'): Promise<ARIARecommendationResult> {
    if (scenarioId === 'SCENARIO_1_EXECUTIVE') {
      return this.submitRequest({
        userPrompt: 'Create luxury summer executive travel outfit',
        intent: 'OUTFIT_RECOMMENDATION',
        context: { occasion: 'Executive Travel', season: 'Summer', temperatureC: 28 }
      });
    }

    if (scenarioId === 'SCENARIO_2_OUTFIT_ANALYSIS') {
      return this.submitRequest({
        userPrompt: 'Analyze this tailored blazer outfit and evaluate visual style compatibility',
        intent: 'IMAGE_ANALYSIS',
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
        imageName: 'Tailored Luxury Suit'
      });
    }

    return this.submitRequest({
      userPrompt: 'What will my style evolve into next year?',
      intent: 'STYLE_PREDICTION',
      context: { timeHorizonMonths: 12 }
    });
  }
}
