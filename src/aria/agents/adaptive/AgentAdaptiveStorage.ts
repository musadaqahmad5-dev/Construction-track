/**
 * ARIA v2.9 Agent Adaptive Storage & Persistence Engine
 * Product: LOOK VISION v2.4
 * 
 * Manages performance profile state and learning signals in Firestore
 * (`users/{uid}/aria/agents/performance/{agentId}` & `global/aria/agentPerformanceDefaults`)
 * with local offline caching (`aria_agent_performance_cache_v2.9`).
 */

import { AgentPerformanceProfile, AgentLearningSignal, AdaptivePerformanceCache } from './AdaptiveTypes';
import { AgentRole } from '../AgentTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../../firebase';
import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';

const LOCAL_PERFORMANCE_CACHE_KEY = 'aria_agent_performance_cache_v2.9';

export const DEFAULT_AGENT_PROFILES: Record<AgentRole, AgentPerformanceProfile> = {
  FASHION_ANALYST: {
    agentId: 'agent_fashion_analyst',
    agentRole: 'FASHION_ANALYST',
    totalExecutions: 120,
    successfulExecutions: 115,
    averageConfidence: 0.91,
    averageLatencyMs: 175,
    userAcceptanceRate: 0.92,
    reliabilityScore: 91,
    confidenceAccuracy: 0.90,
    collaborationValueScore: 0.91,
    lastEvaluated: new Date().toISOString()
  },
  PERSONAL_STYLIST: {
    agentId: 'agent_personal_stylist',
    agentRole: 'PERSONAL_STYLIST',
    totalExecutions: 150,
    successfulExecutions: 147,
    averageConfidence: 0.92,
    averageLatencyMs: 180,
    userAcceptanceRate: 0.94,
    reliabilityScore: 92,
    confidenceAccuracy: 0.91,
    collaborationValueScore: 0.95,
    lastEvaluated: new Date().toISOString()
  },
  FASHION_HISTORIAN: {
    agentId: 'agent_fashion_historian',
    agentRole: 'FASHION_HISTORIAN',
    totalExecutions: 95,
    successfulExecutions: 92,
    averageConfidence: 0.88,
    averageLatencyMs: 220,
    userAcceptanceRate: 0.89,
    reliabilityScore: 88,
    confidenceAccuracy: 0.87,
    collaborationValueScore: 0.88,
    lastEvaluated: new Date().toISOString()
  },
  TREND_INTELLIGENCE: {
    agentId: 'agent_trend_intelligence',
    agentRole: 'TREND_INTELLIGENCE',
    totalExecutions: 130,
    successfulExecutions: 125,
    averageConfidence: 0.90,
    averageLatencyMs: 210,
    userAcceptanceRate: 0.91,
    reliabilityScore: 90,
    confidenceAccuracy: 0.89,
    collaborationValueScore: 0.90,
    lastEvaluated: new Date().toISOString()
  },
  WARDROBE_OPTIMIZER: {
    agentId: 'agent_wardrobe_optimizer',
    agentRole: 'WARDROBE_OPTIMIZER',
    totalExecutions: 140,
    successfulExecutions: 138,
    averageConfidence: 0.95,
    averageLatencyMs: 160,
    userAcceptanceRate: 0.96,
    reliabilityScore: 95,
    confidenceAccuracy: 0.94,
    collaborationValueScore: 0.96,
    lastEvaluated: new Date().toISOString()
  },
  CREATIVE_DIRECTOR: {
    agentId: 'agent_creative_director',
    agentRole: 'CREATIVE_DIRECTOR',
    totalExecutions: 80,
    successfulExecutions: 77,
    averageConfidence: 0.86,
    averageLatencyMs: 240,
    userAcceptanceRate: 0.88,
    reliabilityScore: 86,
    confidenceAccuracy: 0.85,
    collaborationValueScore: 0.87,
    lastEvaluated: new Date().toISOString()
  },
  VISUAL_ANALYSIS: {
    agentId: 'agent_visual_analysis',
    agentRole: 'VISUAL_ANALYSIS',
    totalExecutions: 110,
    successfulExecutions: 106,
    averageConfidence: 0.91,
    averageLatencyMs: 195,
    userAcceptanceRate: 0.92,
    reliabilityScore: 91,
    confidenceAccuracy: 0.90,
    collaborationValueScore: 0.92,
    lastEvaluated: new Date().toISOString()
  }
};

export class AgentAdaptiveStorage {
  private static instance: AgentAdaptiveStorage;

  private constructor() {}

  public static getInstance(): AgentAdaptiveStorage {
    if (!AgentAdaptiveStorage.instance) {
      AgentAdaptiveStorage.instance = new AgentAdaptiveStorage();
    }
    return AgentAdaptiveStorage.instance;
  }

  public getLocalProfiles(): Record<AgentRole, AgentPerformanceProfile> {
    try {
      const raw = localStorage.getItem(LOCAL_PERFORMANCE_CACHE_KEY);
      if (raw) {
        const parsed: AdaptivePerformanceCache = JSON.parse(raw);
        if (parsed.profiles) {
          return { ...DEFAULT_AGENT_PROFILES, ...parsed.profiles } as Record<AgentRole, AgentPerformanceProfile>;
        }
      }
    } catch (err) {
      console.warn('[AgentAdaptiveStorage] Local read warning:', err);
    }
    return { ...DEFAULT_AGENT_PROFILES };
  }

  public setLocalProfiles(profiles: Partial<Record<AgentRole, AgentPerformanceProfile>>): void {
    try {
      const cache: AdaptivePerformanceCache = {
        profiles,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_PERFORMANCE_CACHE_KEY, JSON.stringify(cache));
    } catch (err) {
      console.warn('[AgentAdaptiveStorage] Local write warning:', err);
    }
  }

  public async getPerformanceProfile(userId: string, agentRole: AgentRole): Promise<AgentPerformanceProfile> {
    const local = this.getLocalProfiles();
    const fallback = local[agentRole] || DEFAULT_AGENT_PROFILES[agentRole];

    if (isFirestoreOfflineFallbackActive || !db || !userId) return fallback;

    try {
      const docRef = doc(db, 'users', userId, 'aria', 'agents', 'performance', agentRole);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as AgentPerformanceProfile;
        local[agentRole] = data;
        this.setLocalProfiles(local);
        return data;
      }
    } catch (err) {
      console.warn('[AgentAdaptiveStorage] Firestore read fallback:', err);
    }

    return fallback;
  }

  public async getAllPerformanceProfiles(userId: string): Promise<Record<AgentRole, AgentPerformanceProfile>> {
    const local = this.getLocalProfiles();
    if (isFirestoreOfflineFallbackActive || !db || !userId) return local;

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'agents', 'performance');
      const snap = await getDocs(colRef);
      const fetched: Partial<Record<AgentRole, AgentPerformanceProfile>> = {};

      snap.forEach((d) => {
        const data = d.data() as AgentPerformanceProfile;
        if (data && data.agentRole) {
          fetched[data.agentRole] = data;
        }
      });

      if (Object.keys(fetched).length > 0) {
        const merged = { ...local, ...fetched } as Record<AgentRole, AgentPerformanceProfile>;
        this.setLocalProfiles(merged);
        return merged;
      }
    } catch (err) {
      console.warn('[AgentAdaptiveStorage] Firestore batch read fallback:', err);
    }

    return local;
  }

  public async savePerformanceProfile(userId: string, profile: AgentPerformanceProfile): Promise<void> {
    const local = this.getLocalProfiles();
    local[profile.agentRole] = profile;
    this.setLocalProfiles(local);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      const userRef = doc(db, 'users', userId, 'aria', 'agents', 'performance', profile.agentRole);
      await setDoc(userRef, {
        ...profile,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Save to global defaults reference path as well
      const globalRef = doc(db, 'global', 'aria', 'agentPerformanceDefaults', profile.agentRole);
      await setDoc(globalRef, {
        ...profile,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});
    } catch (err) {
      console.warn('[AgentAdaptiveStorage] Firestore write skipped:', err);
    }
  }

  public async saveLearningSignal(userId: string, signal: AgentLearningSignal): Promise<void> {
    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      const signalRef = doc(db, 'users', userId, 'aria', 'agents', 'signals', signal.signalId);
      await setDoc(signalRef, {
        ...signal,
        savedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[AgentAdaptiveStorage] Signal write skipped:', err);
    }
  }
}

export const agentAdaptiveStorage = AgentAdaptiveStorage.getInstance();
