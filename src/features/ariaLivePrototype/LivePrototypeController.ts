/**
 * ARIA Live Prototype Controller
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import {
  ARIAPrototypeLiveState,
  ARIAUserSession,
  ARIAPrototypeRequest,
  ARIAPrototypeResponse,
  ARIAEngineStatus
} from './LivePrototypeTypes';
import { LivePrototypeEngine } from './LivePrototypeEngine';
import { db } from '../../firebase';
import { doc, setDoc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';

const LOCAL_STORAGE_KEY_V4 = 'aria_live_prototype_sessions_v4.0';

export class LivePrototypeController {
  private static instance: LivePrototypeController;

  private state: ARIAPrototypeLiveState = {
    isOnline: true,
    isProcessing: false,
    availableSessions: [],
    activeEngines: [
      { engineId: 'aria_orchestrator', name: 'ARIA Core Orchestrator', category: 'CORE', isOnline: true, averageLatencyMs: 14, readinessPercentage: 100 },
      { engineId: 'style_dna', name: 'Style DNA Engine', category: 'CORE', isOnline: true, averageLatencyMs: 8, readinessPercentage: 100 },
      { engineId: 'fashion_memory', name: 'Personal Fashion Memory', category: 'MEMORY', isOnline: true, averageLatencyMs: 12, readinessPercentage: 100 },
      { engineId: 'civ_graph', name: 'Civilization Memory Graph', category: 'MEMORY', isOnline: true, averageLatencyMs: 18, readinessPercentage: 100 },
      { engineId: 'adaptive_agents', name: 'Adaptive Multi-Agent Mesh', category: 'AGENT', isOnline: true, averageLatencyMs: 25, readinessPercentage: 100 },
      { engineId: 'visual_intelligence', name: 'Visual Fashion Perception', category: 'VISION', isOnline: true, averageLatencyMs: 45, readinessPercentage: 100 },
      { engineId: 'generative_intelligence', name: 'Generative Fashion Layer', category: 'GENERATIVE', isOnline: true, averageLatencyMs: 65, readinessPercentage: 100 },
      { engineId: 'predictive_intelligence', name: 'Predictive Style Trajectory', category: 'PREDICTION', isOnline: true, averageLatencyMs: 32, readinessPercentage: 100 },
      { engineId: 'decision_engine', name: 'Contextual Decision Engine', category: 'DECISION', isOnline: true, averageLatencyMs: 10, readinessPercentage: 100 }
    ],
    overallReadinessScore: 98.5
  };

  private listeners: Set<(state: ARIAPrototypeLiveState) => void> = new Set();

  private constructor() {}

  public static getInstance(): LivePrototypeController {
    if (!LivePrototypeController.instance) {
      LivePrototypeController.instance = new LivePrototypeController();
    }
    return LivePrototypeController.instance;
  }

  public subscribe(listener: (state: ARIAPrototypeLiveState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }

  private updateState(partial: Partial<ARIAPrototypeLiveState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public getState(): ARIAPrototypeLiveState {
    return this.state;
  }

  /**
   * Initialize live prototype environment
   */
  public async initialize(userId: string = 'guest_user'): Promise<void> {
    try {
      const sessions = await this.listSessions(userId);
      let activeSession = sessions[0];

      if (!activeSession) {
        activeSession = await this.startNewSession(userId, 'Autonomous Fashion Prototype Session');
      }

      this.updateState({
        activeSessionId: activeSession.sessionId,
        currentSession: activeSession,
        availableSessions: sessions.length > 0 ? sessions : [activeSession],
        lastResponse: activeSession.responseHistory[0] || undefined
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updateState({ errorMessage: msg });
    }
  }

  /**
   * Start new user session
   */
  public async startNewSession(userId: string = 'guest_user', title: string = 'Live Fashion Session'): Promise<ARIAUserSession> {
    const sessionId = `live_session_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newSession: ARIAUserSession = {
      sessionId,
      userId,
      title,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      totalInteractions: 0,
      interactionHistory: [],
      responseHistory: []
    };

    await this.persistSession(newSession);

    const updatedList = [newSession, ...this.state.availableSessions];
    this.updateState({
      activeSessionId: sessionId,
      currentSession: newSession,
      availableSessions: updatedList,
      lastResponse: undefined
    });

    return newSession;
  }

  /**
   * Execute request in live prototype engine
   */
  public async executeRequest(params: {
    prompt: string;
    userId?: string;
    imageUrl?: string;
    imageBase64?: string;
    imageName?: string;
    intent?: any;
    context?: any;
  }): Promise<ARIAPrototypeResponse> {
    const userId = params.userId || this.state.currentSession?.userId || 'guest_user';
    const sessionId = this.state.activeSessionId || `live_session_${Date.now()}`;

    this.updateState({
      isProcessing: true,
      currentStepSummary: 'Orchestrating Autonomous Fashion Intelligence Pipeline...',
      errorMessage: undefined
    });

    const request: ARIAPrototypeRequest = {
      requestId: `req_live_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId,
      userId,
      prompt: params.prompt,
      intent: params.intent,
      imageUrl: params.imageUrl,
      imageBase64: params.imageBase64,
      imageName: params.imageName,
      context: params.context,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await LivePrototypeEngine.getInstance().executeFashionRequest(request);

      const current = this.state.currentSession || {
        sessionId,
        userId,
        title: 'Live Session',
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        totalInteractions: 0,
        interactionHistory: [],
        responseHistory: []
      };

      const updatedSession: ARIAUserSession = {
        ...current,
        lastActiveAt: new Date().toISOString(),
        totalInteractions: current.totalInteractions + 1,
        interactionHistory: [...current.interactionHistory, request],
        responseHistory: [response, ...current.responseHistory]
      };

      await this.persistSession(updatedSession);

      const updatedSessions = this.state.availableSessions.map((s) =>
        s.sessionId === sessionId ? updatedSession : s
      );

      this.updateState({
        isProcessing: false,
        currentStepSummary: undefined,
        currentSession: updatedSession,
        availableSessions: updatedSessions,
        lastResponse: response
      });

      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updateState({
        isProcessing: false,
        currentStepSummary: undefined,
        errorMessage: msg
      });
      throw err;
    }
  }

  /**
   * Pre-packaged Demo Scenarios
   */
  public async runScenario(scenario: 'LUXURY_OUTFIT' | 'VISION_ANALYSIS' | 'STYLE_EVOLUTION' | 'WARDROBE_OPT' | 'KNOWLEDGE_QUERY'): Promise<ARIAPrototypeResponse> {
    switch (scenario) {
      case 'LUXURY_OUTFIT':
        return this.executeRequest({
          prompt: 'Create my executive luxury summer travel outfit',
          intent: 'OUTFIT_RECOMMENDATION',
          context: { occasion: 'Executive Travel', season: 'Summer', temperatureC: 28 }
        });

      case 'VISION_ANALYSIS':
        return this.executeRequest({
          prompt: 'Analyze this tailored garment and evaluate visual composition',
          intent: 'IMAGE_ANALYSIS',
          imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
          imageName: 'Luxury Tailored Blazer'
        });

      case 'STYLE_EVOLUTION':
        return this.executeRequest({
          prompt: 'How will my personal style evolve in the next 12 months?',
          intent: 'STYLE_PREDICTION',
          context: { timeHorizonMonths: 12 }
        });

      case 'WARDROBE_OPT':
        return this.executeRequest({
          prompt: 'Optimize my capsule wardrobe for maximum versatility across business and leisure',
          intent: 'WARDROBE_OPTIMIZATION'
        });

      case 'KNOWLEDGE_QUERY':
        return this.executeRequest({
          prompt: 'Explain the historical sartorial heritage of Italian unstructured tailoring',
          intent: 'GENERAL_CONSULTATION'
        });
    }
  }

  /* Persistence */
  private async persistSession(session: ARIAUserSession): Promise<void> {
    this.saveToLocalStorage(session);

    if (db && session.userId && session.userId !== 'guest_user') {
      try {
        const sessionRef = doc(db, 'users', session.userId, 'aria', 'liveSessions', session.sessionId);
        await setDoc(sessionRef, session, { merge: true });
      } catch (_) {}
    }
  }

  private async listSessions(userId: string): Promise<ARIAUserSession[]> {
    const local = this.loadFromLocalStorage();

    if (db && userId && userId !== 'guest_user') {
      try {
        const sessionsRef = collection(db, 'users', userId, 'aria', 'liveSessions');
        const q = query(sessionsRef, limit(20));
        const snapshot = await getDocs(q);
        const remote: ARIAUserSession[] = [];
        snapshot.forEach((d) => remote.push(d.data() as ARIAUserSession));
        if (remote.length > 0) return remote;
      } catch (_) {}
    }

    return local;
  }

  private loadFromLocalStorage(): ARIAUserSession[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_V4);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  private saveToLocalStorage(session: ARIAUserSession): void {
    try {
      const existing = this.loadFromLocalStorage();
      const filtered = existing.filter((s) => s.sessionId !== session.sessionId);
      filtered.unshift(session);
      localStorage.setItem(LOCAL_STORAGE_KEY_V4, JSON.stringify(filtered.slice(0, 30)));
    } catch (_) {}
  }
}
