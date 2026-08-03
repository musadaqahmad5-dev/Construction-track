/**
 * ARIA v2.5 Agent Communication Bus
 * Product: LOOK VISION v2.4
 */

import { AgentRole, AgentExecutionRecord } from './AgentTypes';

export type AgentBusEventListener = (record: AgentExecutionRecord) => void;

export class AgentCommunicationBus {
  private static instance: AgentCommunicationBus;
  private listeners: Set<AgentBusEventListener> = new Set();
  private eventHistory: AgentExecutionRecord[] = [];

  private constructor() {}

  public static getInstance(): AgentCommunicationBus {
    if (!AgentCommunicationBus.instance) {
      AgentCommunicationBus.instance = new AgentCommunicationBus();
    }
    return AgentCommunicationBus.instance;
  }

  public subscribe(listener: AgentBusEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public publish(record: AgentExecutionRecord): void {
    this.eventHistory.unshift(record);
    if (this.eventHistory.length > 200) {
      this.eventHistory = this.eventHistory.slice(0, 200);
    }

    this.listeners.forEach(fn => {
      try {
        fn(record);
      } catch (err) {
        console.warn('[AgentCommunicationBus] Listener error:', err);
      }
    });
  }

  public getHistory(): AgentExecutionRecord[] {
    return [...this.eventHistory];
  }
}

export const agentCommunicationBus = AgentCommunicationBus.getInstance();
