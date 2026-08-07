/**
 * ARIA v2.5 Global Context & React Hooks
 * Product: LOOK VISION v2.4
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ARIAContextState, 
  ARIAConfig, 
  ARIASystemStatus, 
  ARIAModule, 
  ARIAQueryRequest, 
  ARIAStructuredResponse 
} from './ARIATypes';
import { ariaEngine } from './ARIAEngine';
import { 
  memoryEngine, 
  FashionMemoryItem, 
  MemoryContextSummary, 
  MemoryStatus, 
  MemoryUpdatePayload 
} from '../memory';
import {
  styleDNAEngine,
  StyleDNAProfile,
  StyleDNASnapshot,
  StyleDNAStatus,
  StyleDNAUpdatePayload
} from '../styleDNA';
import {
  decisionEngine,
  FashionRecommendation,
  DecisionEngineStatus,
  DecisionQueryRequest
} from '../decision';
import {
  creativeEngine,
  CreativeConcept,
  CreativeEngineStatus,
  CreativeQueryRequest
} from '../creative';
import {
  visualIntelligenceEngine,
  VisionAnalysisResult,
  VisionAnalysisRequest,
  VisionEngineStatus
} from '../vision';
import {
  agentOrchestrator,
  agentRegistry,
  AgentProfile,
  AgentOrchestratorStatus,
  AgentExecutionRequest,
  AgentExecutionRecord
} from '../agents';
import {
  digitalTwinEngine,
  DigitalTwinModel,
  DigitalTwinEngineStatus
} from '../digitalTwin';
import {
  simulationEngine,
  SimulationReport,
  SimulationScenarioType,
  SimulationEngineStatus
} from '../simulation';
import {
  civilizationMemoryEngine,
  KnowledgeGraphData,
  SearchQueryOptions,
  SearchResultItem
} from '../civilization';
import { PersonalFashionMemoryEngine } from '../../engine/personalMemory';

interface ARIAContextValue {
  context: ARIAContextState;
  config: ARIAConfig;
  status: ARIASystemStatus;
  digitalTwin: DigitalTwinModel | null;
  digitalTwinStatus: DigitalTwinEngineStatus;
  refreshDigitalTwin: () => Promise<DigitalTwinModel>;
  analyzeDigitalTwin: () => Promise<DigitalTwinModel>;
  simulationState: SimulationReport | null;
  simulationHistory: SimulationReport[];
  simulationStatus: SimulationEngineStatus;
  runSimulation: (
    scenarioType?: SimulationScenarioType,
    params?: Record<string, any>,
    title?: string,
    desc?: string
  ) => Promise<SimulationReport>;
  refreshSimulation: () => Promise<SimulationReport[]>;
  civilizationMemory: typeof civilizationMemoryEngine;
  knowledgeGraph: KnowledgeGraphData | null;
  searchCivilization: (options: SearchQueryOptions) => SearchResultItem[];
  refreshCivilization: () => Promise<KnowledgeGraphData>;
  registeredModules: ARIAModule[];
  memories: FashionMemoryItem[];
  memorySummary: MemoryContextSummary;
  memoryStatus: MemoryStatus;
  styleDNA: typeof styleDNAEngine;
  styleDNAProfile: StyleDNAProfile | null;
  styleDNAStatus: StyleDNAStatus;
  styleDNASnapshots: StyleDNASnapshot[];
  decisionEngine: typeof decisionEngine;
  decisionHistory: FashionRecommendation[];
  decisionStatus: DecisionEngineStatus;
  creativeEngine: typeof creativeEngine;
  creativeHistory: CreativeConcept[];
  creativeStatus: CreativeEngineStatus;
  updateContext: (partial: Partial<ARIAContextState>) => void;
  updateConfig: (partial: Partial<ARIAConfig>) => void;
  registerModule: (module: ARIAModule) => void;
  unregisterModule: (moduleId: string) => void;
  queryARIA: <T = unknown>(request: ARIAQueryRequest) => Promise<ARIAStructuredResponse<T>>;
  updateMemory: (payload: MemoryUpdatePayload) => Promise<FashionMemoryItem>;
  deleteMemory: (itemId: string) => Promise<boolean>;
  syncMemory: () => Promise<MemoryStatus>;
  refreshStyleDNA: (manualUpdates?: StyleDNAUpdatePayload) => Promise<StyleDNAProfile>;
  updateStyleDNA: (manualUpdates: StyleDNAUpdatePayload) => Promise<StyleDNAProfile>;
  generateRecommendation: (request?: DecisionQueryRequest) => Promise<FashionRecommendation>;
  deleteRecommendation: (recommendationId: string) => Promise<boolean>;
  refreshDecisionHistory: () => Promise<FashionRecommendation[]>;
  generateCreativeConcept: (request?: CreativeQueryRequest) => Promise<CreativeConcept>;
  deleteCreativeConcept: (creativeId: string) => Promise<boolean>;
  refreshCreativeHistory: () => Promise<CreativeConcept[]>;
  visionEngine: typeof visualIntelligenceEngine;
  visionHistory: VisionAnalysisResult[];
  visionStatus: VisionEngineStatus;
  analyzeImage: (request?: VisionAnalysisRequest) => Promise<VisionAnalysisResult>;
  deleteVisionAnalysis: (analysisId: string) => Promise<boolean>;
  refreshVisionHistory: () => Promise<VisionAnalysisResult[]>;
  agents: AgentProfile[];
  agentStatus: AgentOrchestratorStatus;
  executeAgent: (request: AgentExecutionRequest) => Promise<AgentExecutionRecord>;
  agentHistory: AgentExecutionRecord[];
}

const ARIAContext = createContext<ARIAContextValue | null>(null);

export interface ARIAProviderProps {
  children: React.ReactNode;
  initialWorkspace?: string;
  userId?: string;
}

export const ARIAProvider: React.FC<ARIAProviderProps> = ({
  children,
  initialWorkspace = 'LookVisionMainDashboard',
  userId
}) => {
  const [context, setContext] = useState<ARIAContextState>(() => ariaEngine.getContext());
  const [config, setConfig] = useState<ARIAConfig>(() => ariaEngine.getConfig());
  const [status, setStatus] = useState<ARIASystemStatus>(() => ariaEngine.getStatus());
  const [registeredModules, setRegisteredModules] = useState<ARIAModule[]>(() => ariaEngine.getRegisteredModules());

  // Memory states
  const [memories, setMemories] = useState<FashionMemoryItem[]>(() => memoryEngine.getMemories());
  const [memorySummary, setMemorySummary] = useState<MemoryContextSummary>(() => memoryEngine.getContextSummary());
  const [memoryStatus, setMemoryStatus] = useState<MemoryStatus>(() => memoryEngine.getStatus());

  // Style DNA states
  const [styleDNAProfile, setStyleDNAProfile] = useState<StyleDNAProfile | null>(() => styleDNAEngine.getProfile());
  const [styleDNAStatus, setStyleDNAStatus] = useState<StyleDNAStatus>(() => styleDNAEngine.getStatus());
  const [styleDNASnapshots, setStyleDNASnapshots] = useState<StyleDNASnapshot[]>([]);

  // Decision Engine states
  const [decisionHistory, setDecisionHistory] = useState<FashionRecommendation[]>([]);
  const [decisionStatus, setDecisionStatus] = useState<DecisionEngineStatus>(() => decisionEngine.getStatus());

  // Creative Engine states
  const [creativeHistory, setCreativeHistory] = useState<CreativeConcept[]>([]);
  const [creativeStatus, setCreativeStatus] = useState<CreativeEngineStatus>(() => creativeEngine.getStatus());

  // Vision Engine states
  const [visionHistory, setVisionHistory] = useState<VisionAnalysisResult[]>([]);
  const [visionStatus, setVisionStatus] = useState<VisionEngineStatus>(() => visualIntelligenceEngine.getStatus());

  // Agent Orchestrator states
  const [agents, setAgents] = useState<AgentProfile[]>(() => agentRegistry.getAllAgents());
  const [agentStatus, setAgentStatus] = useState<AgentOrchestratorStatus>(() => agentOrchestrator.getStatus());
  const [agentHistory, setAgentHistory] = useState<AgentExecutionRecord[]>([]);

  // Digital Twin states
  const [digitalTwin, setDigitalTwin] = useState<DigitalTwinModel | null>(() => digitalTwinEngine.getProfile());
  const [digitalTwinStatus, setDigitalTwinStatus] = useState<DigitalTwinEngineStatus>(() => digitalTwinEngine.getStatus());

  // Simulation Engine states
  const [simulationState, setSimulationState] = useState<SimulationReport | null>(() => simulationEngine.getCurrentReport());
  const [simulationHistory, setSimulationHistory] = useState<SimulationReport[]>(() => simulationEngine.getHistory(userId));
  const [simulationStatus, setSimulationStatus] = useState<SimulationEngineStatus>(() => simulationEngine.getStatus());

  // Civilization Memory states
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraphData | null>(() => civilizationMemoryEngine.getGraph());

  // Initialize Memory Engine, Style DNA Engine, Decision Engine, Creative Engine, Vision Engine & Agent Orchestrator
  useEffect(() => {
    let isMounted = true;
    memoryEngine.initialize(userId).then(async (st) => {
      if (!isMounted) return;
      setMemoryStatus(st);
      setMemories(memoryEngine.getMemories());
      setMemorySummary(memoryEngine.getContextSummary());

      // Initialize Style DNA Engine
      const dnaSt = await styleDNAEngine.initialize(userId);
      if (isMounted) {
        setStyleDNAStatus(dnaSt);
        setStyleDNAProfile(styleDNAEngine.getProfile());
        const snaps = await styleDNAEngine.getSnapshots();
        if (isMounted) setStyleDNASnapshots(snaps);
      }

      // Initialize Decision Engine
      const decSt = await decisionEngine.initialize(userId);
      if (isMounted) {
        setDecisionStatus(decSt);
        const history = await decisionEngine.getHistory();
        if (isMounted) setDecisionHistory(history);
      }

      // Initialize Creative Engine
      const crtSt = await creativeEngine.initialize(userId);
      if (isMounted) {
        setCreativeStatus(crtSt);
        const cHistory = await creativeEngine.getHistory();
        if (isMounted) setCreativeHistory(cHistory);
      }

      // Initialize Vision Engine
      const visSt = await visualIntelligenceEngine.initialize(userId);
      if (isMounted) {
        setVisionStatus(visSt);
        const vHistory = await visualIntelligenceEngine.getHistory();
        if (isMounted) setVisionHistory(vHistory);
      }

      // Initialize Agent Orchestrator
      const agSt = await agentOrchestrator.initialize(userId);
      if (isMounted) {
        setAgentStatus(agSt);
        setAgents(agentRegistry.getAllAgents());
        const agHist = await agentOrchestrator.getHistory();
        if (isMounted) setAgentHistory(agHist);
      }

      // Initialize Digital Twin Engine
      try {
        const dtProfile = await digitalTwinEngine.initialize(userId);
        if (isMounted) {
          setDigitalTwin(dtProfile);
          setDigitalTwinStatus(digitalTwinEngine.getStatus());
        }
      } catch (e) {
        console.warn('[ARIAContext] Digital Twin initialization fallback:', e);
      }

      // Initialize Simulation Engine
      try {
        const simSt = await simulationEngine.initialize(userId);
        if (isMounted) {
          setSimulationStatus(simSt);
          setSimulationState(simulationEngine.getCurrentReport());
          setSimulationHistory(simulationEngine.getHistory(userId));
        }
      } catch (e) {
        console.warn('[ARIAContext] Simulation Engine initialization fallback:', e);
      }

      // Initialize Civilization Memory Platform
      try {
        const graph = await civilizationMemoryEngine.initialize(userId);
        if (isMounted) {
          setKnowledgeGraph(graph);
        }
      } catch (e) {
        console.warn('[ARIAContext] Civilization Memory initialization fallback:', e);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Keep engine status in sync
  useEffect(() => {
    const unsubscribe = ariaEngine.subscribeStatus((newStatus) => {
      setStatus(newStatus);
    });
    return unsubscribe;
  }, []);

  // Update context when props change
  useEffect(() => {
    if (initialWorkspace || userId) {
      const updated = ariaEngine.updateContext({
        ...(initialWorkspace ? { currentWorkspace: initialWorkspace } : {}),
        ...(userId ? { userId } : {})
      });
      setContext(updated);
    }
  }, [initialWorkspace, userId]);

  const updateContext = useCallback((partial: Partial<ARIAContextState>) => {
    const updated = ariaEngine.updateContext(partial);
    setContext(updated);
  }, []);

  const updateConfig = useCallback((partial: Partial<ARIAConfig>) => {
    const updated = ariaEngine.updateConfig(partial);
    setConfig(updated);
  }, []);

  const registerModule = useCallback((module: ARIAModule) => {
    ariaEngine.registerModule(module);
    setRegisteredModules(ariaEngine.getRegisteredModules());
  }, []);

  const unregisterModule = useCallback((moduleId: string) => {
    ariaEngine.unregisterModule(moduleId);
    setRegisteredModules(ariaEngine.getRegisteredModules());
  }, []);

  const queryARIA = useCallback(async <T = unknown>(request: ARIAQueryRequest) => {
    return await ariaEngine.processQuery<T>(request);
  }, []);

  const updateMemory = useCallback(async (payload: MemoryUpdatePayload) => {
    const item = await memoryEngine.updateMemory(payload);
    setMemories(memoryEngine.getMemories());
    setMemorySummary(memoryEngine.getContextSummary());
    setMemoryStatus(memoryEngine.getStatus());

    // Trigger Style DNA reanalysis after memory updates
    const newProfile = await styleDNAEngine.reanalyzeProfile();
    setStyleDNAProfile(newProfile);
    setStyleDNAStatus(styleDNAEngine.getStatus());
    const snaps = await styleDNAEngine.getSnapshots();
    setStyleDNASnapshots(snaps);

    return item;
  }, []);

  const deleteMemory = useCallback(async (itemId: string) => {
    const success = await memoryEngine.deleteMemory(itemId);
    if (success) {
      setMemories(memoryEngine.getMemories());
      setMemorySummary(memoryEngine.getContextSummary());
      setMemoryStatus(memoryEngine.getStatus());

      // Reanalyze Style DNA
      const newProfile = await styleDNAEngine.reanalyzeProfile();
      setStyleDNAProfile(newProfile);
      setStyleDNAStatus(styleDNAEngine.getStatus());
      const snaps = await styleDNAEngine.getSnapshots();
      setStyleDNASnapshots(snaps);
    }
    return success;
  }, []);

  const syncMemory = useCallback(async () => {
    const st = await memoryEngine.sync();
    setMemoryStatus(st);
    setMemories(memoryEngine.getMemories());
    setMemorySummary(memoryEngine.getContextSummary());

    const newProfile = await styleDNAEngine.reanalyzeProfile();
    setStyleDNAProfile(newProfile);
    setStyleDNAStatus(styleDNAEngine.getStatus());
    return st;
  }, []);

  const syncStyleDNABridge = useCallback(async (
    targetUserId?: string,
    profile?: StyleDNAProfile | null
  ) => {
    const activeUid = targetUserId || userId;
    if (!activeUid || activeUid.startsWith('guest-')) return;

    try {
      // 1. Sync in-memory PersonalFashionMemoryEngine
      if (profile) {
        const memory = PersonalFashionMemoryEngine.getMemory(activeUid);
        const favColors = (profile.colorProfile || []).map(c => c.value);
        const favMaterials = (profile.materialProfile || []).map(m => m.value);
        const favBrands = (profile.brandAffinity || []).map(b => b.value);
        const favSilhouettes = (profile.silhouetteProfile || []).map(s => s.value);

        if (favColors.length) memory.favColors = Array.from(new Set([...memory.favColors, ...favColors]));
        if (favMaterials.length) memory.favMaterials = Array.from(new Set([...memory.favMaterials, ...favMaterials]));
        if (favBrands.length) memory.favBrands = Array.from(new Set([...memory.favBrands, ...favBrands]));
        if (favSilhouettes.length) memory.favSilhouettes = Array.from(new Set([...memory.favSilhouettes, ...favSilhouettes]));

        memory.accuracyEstimate = Math.round((profile.overallConfidence || 0.85) * 100);
        PersonalFashionMemoryEngine.saveMemory(memory);
      }

      // 2. Safely sync to Firestore user memory documents
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../firebase');

      if (db && profile) {
        const now = new Date().toISOString();
        const styleDocRef = doc(db, 'users', activeUid, 'styleDNA', 'profile');
        await setDoc(styleDocRef, {
          userId: activeUid,
          updatedAt: now,
          styleDNAProfile: profile,
          version: profile.version || 1,
          overallConfidence: profile.overallConfidence
        }, { merge: true });

        const ariaDocRef = doc(db, 'users', activeUid, 'ariaProfile', 'context');
        await setDoc(ariaDocRef, {
          userId: activeUid,
          updatedAt: now,
          lastStyleDNASync: now,
          accuracyEstimate: Math.round((profile.overallConfidence || 0.85) * 100)
        }, { merge: true });
      }
    } catch (err) {
      console.warn('[ARIAContext] Style DNA Firestore sync skipped or offline:', err);
    }
  }, [userId]);

  const refreshStyleDNA = useCallback(async (manualUpdates?: StyleDNAUpdatePayload) => {
    const newProfile = await styleDNAEngine.reanalyzeProfile(manualUpdates);
    setStyleDNAProfile(newProfile);
    setStyleDNAStatus(styleDNAEngine.getStatus());
    const snaps = await styleDNAEngine.getSnapshots();
    setStyleDNASnapshots(snaps);
    await syncStyleDNABridge(userId, newProfile);
    return newProfile;
  }, [userId, syncStyleDNABridge]);

  useEffect(() => {
    if (userId && styleDNAProfile && !userId.startsWith('guest-')) {
      syncStyleDNABridge(userId, styleDNAProfile);
    }
  }, [userId, styleDNAProfile, syncStyleDNABridge]);

  const updateStyleDNA = useCallback(async (manualUpdates: StyleDNAUpdatePayload) => {
    return await refreshStyleDNA(manualUpdates);
  }, [refreshStyleDNA]);

  const generateRecommendation = useCallback(async (request?: DecisionQueryRequest) => {
    const rec = await decisionEngine.generateRecommendation(request);
    const history = await decisionEngine.getHistory();
    setDecisionHistory(history);
    setDecisionStatus(decisionEngine.getStatus());
    return rec;
  }, []);

  const deleteRecommendation = useCallback(async (recommendationId: string) => {
    const success = await decisionEngine.deleteRecommendation(recommendationId);
    if (success) {
      const history = await decisionEngine.getHistory();
      setDecisionHistory(history);
      setDecisionStatus(decisionEngine.getStatus());
    }
    return success;
  }, []);

  const refreshDecisionHistory = useCallback(async () => {
    const history = await decisionEngine.getHistory();
    setDecisionHistory(history);
    setDecisionStatus(decisionEngine.getStatus());
    return history;
  }, []);

  const generateCreativeConcept = useCallback(async (request?: CreativeQueryRequest) => {
    const concept = await creativeEngine.generateCreativeConcept(request);
    const history = await creativeEngine.getHistory();
    setCreativeHistory(history);
    setCreativeStatus(creativeEngine.getStatus());
    return concept;
  }, []);

  const deleteCreativeConcept = useCallback(async (creativeId: string) => {
    const success = await creativeEngine.deleteConcept(creativeId);
    if (success) {
      const history = await creativeEngine.getHistory();
      setCreativeHistory(history);
      setCreativeStatus(creativeEngine.getStatus());
    }
    return success;
  }, []);

  const refreshCreativeHistory = useCallback(async () => {
    const history = await creativeEngine.getHistory();
    setCreativeHistory(history);
    setCreativeStatus(creativeEngine.getStatus());
    return history;
  }, []);

  const analyzeImage = useCallback(async (request?: VisionAnalysisRequest) => {
    const analysis = await visualIntelligenceEngine.analyzeImage(request || {});
    const history = await visualIntelligenceEngine.getHistory();
    setVisionHistory(history);
    setVisionStatus(visualIntelligenceEngine.getStatus());
    return analysis;
  }, []);

  const deleteVisionAnalysis = useCallback(async (analysisId: string) => {
    const success = await visualIntelligenceEngine.deleteAnalysis(analysisId);
    if (success) {
      const history = await visualIntelligenceEngine.getHistory();
      setVisionHistory(history);
      setVisionStatus(visualIntelligenceEngine.getStatus());
    }
    return success;
  }, []);

  const refreshVisionHistory = useCallback(async () => {
    const history = await visualIntelligenceEngine.getHistory();
    setVisionHistory(history);
    setVisionStatus(visualIntelligenceEngine.getStatus());
    return history;
  }, []);

  const executeAgentHandler = useCallback(async (request: AgentExecutionRequest) => {
    const rec = await agentOrchestrator.executeAgent(request);
    setAgents(agentRegistry.getAllAgents());
    setAgentStatus(agentOrchestrator.getStatus());
    const hist = await agentOrchestrator.getHistory();
    setAgentHistory(hist);
    return rec;
  }, []);

  const refreshDigitalTwin = useCallback(async (): Promise<DigitalTwinModel> => {
    const profile = await digitalTwinEngine.initialize(userId);
    setDigitalTwin(profile);
    setDigitalTwinStatus(digitalTwinEngine.getStatus());
    return profile;
  }, [userId]);

  const analyzeDigitalTwin = useCallback(async (): Promise<DigitalTwinModel> => {
    const profile = await digitalTwinEngine.synthesizeTwin(userId);
    setDigitalTwin(profile);
    setDigitalTwinStatus(digitalTwinEngine.getStatus());
    return profile;
  }, [userId]);

  const runSimulationHandler = useCallback(
    async (
      scenarioType?: SimulationScenarioType,
      params?: Record<string, any>,
      title?: string,
      desc?: string
    ): Promise<SimulationReport> => {
      const report = await simulationEngine.runSimulation(userId, scenarioType, params, title, desc);
      setSimulationState(report);
      setSimulationHistory(simulationEngine.getHistory(userId));
      setSimulationStatus(simulationEngine.getStatus());
      return report;
    },
    [userId]
  );

  const refreshSimulationHandler = useCallback(async (): Promise<SimulationReport[]> => {
    const history = simulationEngine.getHistory(userId);
    setSimulationHistory(history);
    setSimulationState(simulationEngine.getCurrentReport());
    setSimulationStatus(simulationEngine.getStatus());
    return history;
  }, [userId]);

  const searchCivilizationHandler = useCallback(
    (options: SearchQueryOptions): SearchResultItem[] => {
      return civilizationMemoryEngine.search(options);
    },
    []
  );

  const refreshCivilizationHandler = useCallback(async (): Promise<KnowledgeGraphData> => {
    const graph = await civilizationMemoryEngine.indexAndConsolidate(userId);
    setKnowledgeGraph(graph);
    return graph;
  }, [userId]);

  const value = useMemo<ARIAContextValue>(() => ({
    context,
    config,
    status,
    registeredModules,
    memories,
    memorySummary,
    memoryStatus,
    styleDNA: styleDNAEngine,
    styleDNAProfile,
    styleDNAStatus,
    styleDNASnapshots,
    decisionEngine,
    decisionHistory,
    decisionStatus,
    creativeEngine,
    creativeHistory,
    creativeStatus,
    visionEngine: visualIntelligenceEngine,
    visionHistory,
    visionStatus,
    agents,
    agentStatus,
    executeAgent: executeAgentHandler,
    agentHistory,
    digitalTwin,
    digitalTwinStatus,
    refreshDigitalTwin,
    analyzeDigitalTwin,
    simulationState,
    simulationHistory,
    simulationStatus,
    runSimulation: runSimulationHandler,
    refreshSimulation: refreshSimulationHandler,
    civilizationMemory: civilizationMemoryEngine,
    knowledgeGraph,
    searchCivilization: searchCivilizationHandler,
    refreshCivilization: refreshCivilizationHandler,
    updateContext,
    updateConfig,
    registerModule,
    unregisterModule,
    queryARIA,
    updateMemory,
    deleteMemory,
    syncMemory,
    refreshStyleDNA,
    updateStyleDNA,
    generateRecommendation,
    deleteRecommendation,
    refreshDecisionHistory,
    generateCreativeConcept,
    deleteCreativeConcept,
    refreshCreativeHistory,
    analyzeImage,
    deleteVisionAnalysis,
    refreshVisionHistory
  }), [
    context, 
    config, 
    status, 
    registeredModules, 
    memories,
    memorySummary,
    memoryStatus,
    styleDNAProfile,
    styleDNAStatus,
    styleDNASnapshots,
    decisionHistory,
    decisionStatus,
    creativeHistory,
    creativeStatus,
    visionHistory,
    visionStatus,
    agents,
    agentStatus,
    executeAgentHandler,
    agentHistory,
    digitalTwin,
    digitalTwinStatus,
    refreshDigitalTwin,
    analyzeDigitalTwin,
    simulationState,
    simulationHistory,
    simulationStatus,
    runSimulationHandler,
    refreshSimulationHandler,
    knowledgeGraph,
    searchCivilizationHandler,
    refreshCivilizationHandler,
    updateContext, 
    updateConfig, 
    registerModule, 
    unregisterModule, 
    queryARIA,
    updateMemory,
    deleteMemory,
    syncMemory,
    refreshStyleDNA,
    updateStyleDNA,
    generateRecommendation,
    deleteRecommendation,
    refreshDecisionHistory,
    generateCreativeConcept,
    deleteCreativeConcept,
    refreshCreativeHistory,
    analyzeImage,
    deleteVisionAnalysis,
    refreshVisionHistory
  ]);

  return (
    <ARIAContext.Provider value={value}>
      {children}
    </ARIAContext.Provider>
  );
};

export const useARIAContext = (): ARIAContextValue => {
  const ctx = useContext(ARIAContext);
  if (!ctx) {
    // Graceful fallback if component is used outside ARIAProvider
    return {
      context: ariaEngine.getContext(),
      config: ariaEngine.getConfig(),
      status: ariaEngine.getStatus(),
      registeredModules: ariaEngine.getRegisteredModules(),
      memories: memoryEngine.getMemories(),
      memorySummary: memoryEngine.getContextSummary(),
      memoryStatus: memoryEngine.getStatus(),
      styleDNA: styleDNAEngine,
      styleDNAProfile: styleDNAEngine.getProfile(),
      styleDNAStatus: styleDNAEngine.getStatus(),
      styleDNASnapshots: [],
      decisionEngine,
      decisionHistory: [],
      decisionStatus: decisionEngine.getStatus(),
      creativeEngine,
      creativeHistory: [],
      creativeStatus: creativeEngine.getStatus(),
      visionEngine: visualIntelligenceEngine,
      visionHistory: [],
      visionStatus: visualIntelligenceEngine.getStatus(),
      agents: agentRegistry.getAllAgents(),
      agentStatus: agentOrchestrator.getStatus(),
      executeAgent: (req) => agentOrchestrator.executeAgent(req),
      agentHistory: [],
      digitalTwin: digitalTwinEngine.getProfile(),
      digitalTwinStatus: digitalTwinEngine.getStatus(),
      refreshDigitalTwin: () => digitalTwinEngine.initialize('guest_user'),
      analyzeDigitalTwin: () => digitalTwinEngine.synthesizeTwin('guest_user'),
      simulationState: simulationEngine.getCurrentReport(),
      simulationHistory: simulationEngine.getHistory('guest_user'),
      simulationStatus: simulationEngine.getStatus(),
      runSimulation: (type, params, title, desc) => simulationEngine.runSimulation('guest_user', type, params, title, desc),
      refreshSimulation: () => Promise.resolve(simulationEngine.getHistory('guest_user')),
      civilizationMemory: civilizationMemoryEngine,
      knowledgeGraph: civilizationMemoryEngine.getGraph(),
      searchCivilization: (options) => civilizationMemoryEngine.search(options),
      refreshCivilization: () => civilizationMemoryEngine.initialize('guest_user'),
      updateContext: (p) => ariaEngine.updateContext(p),
      updateConfig: (p) => ariaEngine.updateConfig(p),
      registerModule: (m) => ariaEngine.registerModule(m),
      unregisterModule: (id) => ariaEngine.unregisterModule(id),
      queryARIA: (req) => ariaEngine.processQuery(req),
      updateMemory: (p) => memoryEngine.updateMemory(p),
      deleteMemory: (id) => memoryEngine.deleteMemory(id),
      syncMemory: () => memoryEngine.sync(),
      refreshStyleDNA: (updates) => styleDNAEngine.reanalyzeProfile(updates),
      updateStyleDNA: (updates) => styleDNAEngine.reanalyzeProfile(updates),
      generateRecommendation: (req) => decisionEngine.generateRecommendation(req),
      deleteRecommendation: (id) => decisionEngine.deleteRecommendation(id),
      refreshDecisionHistory: () => decisionEngine.getHistory(),
      generateCreativeConcept: (req) => creativeEngine.generateCreativeConcept(req),
      deleteCreativeConcept: (id) => creativeEngine.deleteConcept(id),
      refreshCreativeHistory: () => creativeEngine.getHistory(),
      analyzeImage: (req) => visualIntelligenceEngine.analyzeImage(req || {}),
      deleteVisionAnalysis: (id) => visualIntelligenceEngine.deleteAnalysis(id),
      refreshVisionHistory: () => visualIntelligenceEngine.getHistory()
    };
  }
  return ctx;
};

export const useARIA = useARIAContext;

