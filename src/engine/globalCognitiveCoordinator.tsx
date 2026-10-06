import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { WardrobeItem } from '../types';
import { PersonalFashionMemoryEngine, PersonalFashionMemory } from './personalMemory';
import { StyleDNAEngine, UserStyleDNA, WardrobeMemoryEngine } from './sharedEngines';
import { UnifiedStyleDNAEngine, VisionIntelligenceEngine, UnifiedStyleDNAReport } from './visionIntelligence';
import { FashionKnowledgeGraphEngine, GraphStats } from './fashionKnowledgeGraph';
import { KnowledgeGraphEngine } from './knowledgeGraphEngine';
import { DecisionIntelligenceEngine, DecisionWeights } from './decisionIntelligence';
import { EnterpriseLearningEngine, IntelligenceGrowthMetrics, LearningCycleReport } from './learningEngine';
import { EnterprisePredictiveEngine, ForecastMetrics } from './predictiveEngine';
import { EnterpriseReasoningEngine } from './reasoningEngine';
import { EnterprisePlanningEngine } from './planningEngine';
import { EnterpriseSystemCoordinationEngine, SystemCoordinationSummary, SynchronizationEvent } from './systemCoordinationEngine';
import { AgentCoordinator } from '../agents/agents';
import { AgentCommunicationBus } from '../agents/agentBus';
import { AIFashionDirector, FashionDNAEngine } from './fashionIntelligenceEngine';

export interface CognitiveSnapshot {
  userId: string;
  isInitialized: boolean;
  userMemory: PersonalFashionMemory;
  styleDNA: UserStyleDNA;
  unifiedDNA: UnifiedStyleDNAReport;
  knowledgeGraphStats: GraphStats;
  decisionWeights: DecisionWeights;
  learningMetrics: IntelligenceGrowthMetrics;
  predictiveForecast: ForecastMetrics;
  coordinationSummary: SystemCoordinationSummary;
  lastSyncTime: string;
}

export class GlobalCognitiveCoordinator {
  private static instance: GlobalCognitiveCoordinator | null = null;
  private initialized = false;
  private currentUserId = 'user-1';
  private listeners: Set<(snapshot: CognitiveSnapshot) => void> = new Set();

  private constructor() {}

  public static getInstance(): GlobalCognitiveCoordinator {
    if (!GlobalCognitiveCoordinator.instance) {
      GlobalCognitiveCoordinator.instance = new GlobalCognitiveCoordinator();
    }
    return GlobalCognitiveCoordinator.instance;
  }

  public initialize(userId: string = 'user-1', items: WardrobeItem[] = []): void {
    if (this.initialized && this.currentUserId === userId) {
      return;
    }

    this.currentUserId = userId;

    KnowledgeGraphEngine.init();

    PersonalFashionMemoryEngine.getMemory(userId);

    StyleDNAEngine.computeDNA(userId, items);

    DecisionIntelligenceEngine.loadDecisionWeights(userId);

    EnterpriseLearningEngine.getLearningProfile(userId, items);

    EnterprisePredictiveEngine.getForecastForTimeline(userId, items, '30 Days');

    this.initialized = true;

    this.recordSyncEvent('GlobalCognitiveCoordinator', 'AllCognitiveEngines', 'StateSync', 'Activated Global Cognitive Layer across workspace engines');

    this.notifyListeners();
  }

  public isFullyInitialized(): boolean {
    return this.initialized;
  }

  public getCognitiveSnapshot(userId: string = this.currentUserId, items: WardrobeItem[] = []): CognitiveSnapshot {
    if (!this.initialized) {
      this.initialize(userId, items);
    }

    const userMemory = PersonalFashionMemoryEngine.getMemory(userId);
    const styleDNA = StyleDNAEngine.computeDNA(userId, items);
    const unifiedDNA = UnifiedStyleDNAEngine.generateUnifiedStyleDNA(userId);
    const knowledgeGraphStats = FashionKnowledgeGraphEngine.getStats();
    const decisionWeights = DecisionIntelligenceEngine.loadDecisionWeights(userId);
    const learningProfile = EnterpriseLearningEngine.getLearningProfile(userId, items);
    const predictiveForecast = EnterprisePredictiveEngine.getForecastForTimeline(userId, items, '30 Days');
    const coordinationSummary = EnterpriseSystemCoordinationEngine.getCoordinationSummary(userId, items);

    return {
      userId,
      isInitialized: this.initialized,
      userMemory,
      styleDNA,
      unifiedDNA,
      knowledgeGraphStats,
      decisionWeights,
      learningMetrics: learningProfile.metrics,
      predictiveForecast,
      coordinationSummary,
      lastSyncTime: new Date().toLocaleTimeString()
    };
  }

  public recordUserFeedback(userId: string, styleId: string, accepted: boolean, context?: any): void {
    if (accepted) {
      DecisionIntelligenceEngine.handleAcceptRecommendation(userId, styleId);
      PersonalFashionMemoryEngine.logEvent(userId, 'RECOMMENDATION_ACCEPTED', { styleId, context });
    } else {
      DecisionIntelligenceEngine.handleRejectRecommendation(userId, styleId);
      PersonalFashionMemoryEngine.logEvent(userId, 'RECOMMENDATION_REJECTED', { styleId, context });
    }

    EnterpriseLearningEngine.processInteractionFeedback(
      userId,
      accepted ? 'accepted' : 'rejected',
      []
    );

    this.recordSyncEvent(
      'UserFeedbackEngine',
      'PersonalMemoryAndDecisionEngine',
      'StateSync',
      `Synchronized ${accepted ? 'positive' : 'negative'} feedback for style ${styleId}`
    );

    this.notifyListeners();
  }

  public synchronizeEngines(userId: string = this.currentUserId, items: WardrobeItem[] = []): CognitiveSnapshot {
    this.initialize(userId, items);

    PersonalFashionMemoryEngine.getMemory(userId);
    DecisionIntelligenceEngine.loadDecisionWeights(userId);
    EnterpriseLearningEngine.getLearningProfile(userId, items);
    EnterprisePredictiveEngine.getForecastForTimeline(userId, items, '30 Days');

    this.recordSyncEvent('GlobalCognitiveCoordinator', 'SystemCoordinationEngine', 'StateSync', 'Manual trigger cross-engine synchronization completed');

    const snapshot = this.getCognitiveSnapshot(userId, items);
    this.notifyListeners();
    return snapshot;
  }

  public recordSyncEvent(sourceEngine: string, targetEngine: string, syncType: 'StateSync' | 'DependencyCheck' | 'GovernanceSync' | 'ResourceAllocation', details: string): void {
    const existing = EnterpriseSystemCoordinationEngine.getSynchronizationTimeline();
    const newEvent: SynchronizationEvent = {
      id: `sync-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString(),
      sourceEngine,
      targetEngine,
      syncType,
      status: 'Success',
      details
    };
    EnterpriseSystemCoordinationEngine.saveSynchronizationTimeline([newEvent, ...existing.slice(0, 49)]);
  }

  public subscribe(listener: (snapshot: CognitiveSnapshot) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const snapshot = this.getCognitiveSnapshot();
    this.listeners.forEach(listener => listener(snapshot));
  }
}

export const globalCognitiveCoordinator = GlobalCognitiveCoordinator.getInstance();

export interface CognitiveCoordinatorContextValue {
  coordinator: GlobalCognitiveCoordinator;
  snapshot: CognitiveSnapshot;
  isInitialized: boolean;
  synchronize: (items?: WardrobeItem[]) => CognitiveSnapshot;
  recordFeedback: (styleId: string, accepted: boolean, context?: any) => void;
  recordSyncEvent: (source: string, target: string, type: 'StateSync' | 'DependencyCheck' | 'GovernanceSync' | 'ResourceAllocation', details: string) => void;
}

const CognitiveCoordinatorContext = createContext<CognitiveCoordinatorContextValue | null>(null);

export interface CognitiveCoordinatorProviderProps {
  children: React.ReactNode;
  userId?: string;
  items?: WardrobeItem[];
}

const CognitiveCoordinatorProviderInner: React.FC<CognitiveCoordinatorProviderProps> = ({
  children,
  userId = 'user-1',
  items = []
}) => {
  const [snapshot, setSnapshot] = useState<CognitiveSnapshot>(() => {
    globalCognitiveCoordinator.initialize(userId, items);
    return globalCognitiveCoordinator.getCognitiveSnapshot(userId, items);
  });

  useEffect(() => {
    globalCognitiveCoordinator.initialize(userId, items);
    setSnapshot(globalCognitiveCoordinator.getCognitiveSnapshot(userId, items));

    const unsubscribe = globalCognitiveCoordinator.subscribe((updatedSnapshot) => {
      setSnapshot(updatedSnapshot);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const synchronize = useCallback((overrideItems?: WardrobeItem[]) => {
    return globalCognitiveCoordinator.synchronizeEngines(userId, overrideItems || items);
  }, [userId, items]);

  const recordFeedback = useCallback((styleId: string, accepted: boolean, context?: any) => {
    globalCognitiveCoordinator.recordUserFeedback(userId, styleId, accepted, context);
  }, [userId]);

  const recordSyncEvent = useCallback((source: string, target: string, type: 'StateSync' | 'DependencyCheck' | 'GovernanceSync' | 'ResourceAllocation', details: string) => {
    globalCognitiveCoordinator.recordSyncEvent(source, target, type, details);
  }, []);

  const value = useMemo<CognitiveCoordinatorContextValue>(() => ({
    coordinator: globalCognitiveCoordinator,
    snapshot,
    isInitialized: snapshot.isInitialized,
    synchronize,
    recordFeedback,
    recordSyncEvent
  }), [snapshot, synchronize, recordFeedback, recordSyncEvent]);

  return (
    <CognitiveCoordinatorContext.Provider value={value}>
      {children}
    </CognitiveCoordinatorContext.Provider>
  );
};

export const CognitiveCoordinatorProvider: React.FC<CognitiveCoordinatorProviderProps> = (props) => {
  const existingContext = useContext(CognitiveCoordinatorContext);
  if (existingContext) {
    return <>{props.children}</>;
  }
  return <CognitiveCoordinatorProviderInner {...props} />;
};

export function useCognitiveCoordinator(): CognitiveCoordinatorContextValue {
  const context = useContext(CognitiveCoordinatorContext);
  if (!context) {
    globalCognitiveCoordinator.initialize('user-1');
    const snapshot = globalCognitiveCoordinator.getCognitiveSnapshot('user-1');
    return {
      coordinator: globalCognitiveCoordinator,
      snapshot,
      isInitialized: snapshot.isInitialized,
      synchronize: (items) => globalCognitiveCoordinator.synchronizeEngines('user-1', items),
      recordFeedback: (styleId, accepted, ctx) => globalCognitiveCoordinator.recordUserFeedback('user-1', styleId, accepted, ctx),
      recordSyncEvent: (s, t, type, d) => globalCognitiveCoordinator.recordSyncEvent(s, t, type, d)
    };
  }
  return context;
}
