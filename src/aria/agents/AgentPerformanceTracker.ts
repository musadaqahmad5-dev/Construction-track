/**
 * ARIA v2.7 Agent Performance Tracker & Storage Bridge
 * Product: LOOK VISION v2.4
 * 
 * Handles execution persistence to Firestore (`users/{uid}/aria/agents/history/{executionId}`)
 * and offline synchronization cache (`aria_agent_execution_cache_v2.7`).
 */

import { AgentProfile, AgentExecutionRecord } from './AgentTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';

const LOCAL_AGENT_EXEC_KEY = 'aria_agent_execution_cache_v2.7';

export class AgentPerformanceTracker {
  private static instance: AgentPerformanceTracker;

  private constructor() {}

  public static getInstance(): AgentPerformanceTracker {
    if (!AgentPerformanceTracker.instance) {
      AgentPerformanceTracker.instance = new AgentPerformanceTracker();
    }
    return AgentPerformanceTracker.instance;
  }

  public getLocalExecutions(): AgentExecutionRecord[] {
    try {
      const raw = localStorage.getItem(LOCAL_AGENT_EXEC_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      console.warn('[AgentPerformanceTracker] Read error:', err);
    }
    return [];
  }

  public setLocalExecutions(records: AgentExecutionRecord[]): void {
    try {
      localStorage.setItem(LOCAL_AGENT_EXEC_KEY, JSON.stringify(records.slice(0, 100)));
    } catch (err) {
      console.warn('[AgentPerformanceTracker] Write error:', err);
    }
  }

  public updateAgentMetrics(
    agent: AgentProfile,
    isSuccess: boolean,
    latencyMs: number,
    confidence: number
  ): AgentProfile {
    const metrics = agent.metrics;
    const total = metrics.totalExecutions + 1;
    const success = isSuccess ? metrics.successfulExecutions + 1 : metrics.successfulExecutions;
    const failed = isSuccess ? metrics.failedExecutions : metrics.failedExecutions + 1;

    const avgLatency = Math.round(((metrics.averageLatencyMs * metrics.totalExecutions) + latencyMs) / total);
    const avgConfidence = Number((((metrics.averageConfidence * metrics.totalExecutions) + confidence) / total).toFixed(2));

    agent.metrics = {
      ...metrics,
      totalExecutions: total,
      successfulExecutions: success,
      failedExecutions: failed,
      averageLatencyMs: avgLatency,
      averageConfidence: avgConfidence
    };

    agent.lastExecutedAt = new Date().toISOString();
    agent.status = isSuccess ? 'SUCCESS' : 'FAILED';
    agent.confidence = confidence;

    return agent;
  }

  public async saveExecutionRecord(userId: string, record: AgentExecutionRecord): Promise<void> {
    const records = this.getLocalExecutions();
    records.unshift(record);
    this.setLocalExecutions(records);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      // Primary Task 8 path: users/{uid}/aria/agents/history/{executionId}
      const historyRef = doc(db, 'users', userId, 'aria', 'agents', 'history', record.executionId);
      await setDoc(historyRef, {
        ...record,
        savedAt: serverTimestamp()
      }, { merge: true });

      // Legacy fallback path: users/{uid}/aria/agents/executions/{executionId}
      const execRef = doc(db, 'users', userId, 'aria', 'agents', 'executions', record.executionId);
      await setDoc(execRef, {
        ...record,
        savedAt: serverTimestamp()
      }, { merge: true });

      const perfRef = doc(db, 'users', userId, 'aria', 'agents', 'performance', record.agentRole);
      await setDoc(perfRef, {
        agentRole: record.agentRole,
        lastExecutionId: record.executionId,
        confidence: record.confidence,
        latencyMs: record.latencyMs,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[AgentPerformanceTracker] Firestore sync skipped:', err);
    }
  }

  public async fetchExecutionHistory(userId: string): Promise<AgentExecutionRecord[]> {
    const local = this.getLocalExecutions();
    if (isFirestoreOfflineFallbackActive || !db || !userId) return local;

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'agents', 'history');
      const snapDocs = await getDocs(colRef);
      const fetched: AgentExecutionRecord[] = [];
      snapDocs.forEach((d) => {
        fetched.push(d.data() as AgentExecutionRecord);
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());
        this.setLocalExecutions(fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[AgentPerformanceTracker] Firestore fetch fallback:', err);
    }

    return local;
  }
}

export const agentPerformanceTracker = AgentPerformanceTracker.getInstance();
