// ============================================================================
// ENTERPRISE AGENT COMMUNICATION BUS & REGISTRY
// ============================================================================

export interface AgentMessage {
  id: string;
  sender: string;
  recipient: string | 'broadcast';
  topic: string;
  payload: any;
  priority: 'High' | 'Medium' | 'Low';
  timestamp: number;
}

export interface AgentTelemetry {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Idle' | 'Busy' | 'Degraded';
  currentTask: string;
  avgResponseTimeMs: number;
  memoryUsageMb: number;
  queueLength: number;
  healthScore: number;         // 0 to 100
  lastActivity: number;
}

type MessageCallback = (msg: AgentMessage) => void | Promise<void>;

export class AgentCommunicationBus {
  private static subscribers = new Map<string, MessageCallback[]>();
  private static messageHistory: AgentMessage[] = [];
  private static registry = new Map<string, AgentTelemetry>();

  // SEED INITIAL AGENT REGISTRY TELEMETRY (Phase Registry)
  static initializeRegistry(): void {
    if (this.registry.size > 0) return;

    const agents: AgentTelemetry[] = [
      {
        id: 'agent-stylist',
        name: 'FashionStylistAgent',
        role: 'Outfit curation, combinations & occasion matching',
        status: 'Active',
        currentTask: 'Waiting for dynamic coordination prompt',
        avgResponseTimeMs: 42,
        memoryUsageMb: 18.5,
        queueLength: 0,
        healthScore: 100,
        lastActivity: Date.now()
      },
      {
        id: 'agent-memory',
        name: 'FashionMemoryAgent',
        role: 'Style DNA profiling, user history, preferences & dislikes',
        status: 'Active',
        currentTask: 'Idle (Sustaining client profile state)',
        avgResponseTimeMs: 15,
        memoryUsageMb: 12.1,
        queueLength: 0,
        healthScore: 98,
        lastActivity: Date.now()
      },
      {
        id: 'agent-vision',
        name: 'FashionVisionAgent',
        role: 'Visual similarity analysis, garment categorization',
        status: 'Active',
        currentTask: 'Standby for image-vector extraction',
        avgResponseTimeMs: 68,
        memoryUsageMb: 24.8,
        queueLength: 0,
        healthScore: 99,
        lastActivity: Date.now()
      },
      {
        id: 'agent-knowledge',
        name: 'FashionKnowledgeAgent',
        role: 'Harmony graph matching, styling rules & taxonomy',
        status: 'Active',
        currentTask: 'Idle (Graph structure loaded)',
        avgResponseTimeMs: 25,
        memoryUsageMb: 16.3,
        queueLength: 0,
        healthScore: 100,
        lastActivity: Date.now()
      },
      {
        id: 'agent-decision',
        name: 'DecisionAgent',
        role: 'Candidate ranking, multi-node trees, scoring & explanation',
        status: 'Active',
        currentTask: 'Idle (Local decision weights synced)',
        avgResponseTimeMs: 34,
        memoryUsageMb: 14.2,
        queueLength: 0,
        healthScore: 100,
        lastActivity: Date.now()
      },
      {
        id: 'agent-coordinator',
        name: 'AgentCoordinator',
        role: 'Orchestrator routing, conflict resolution & telemetry',
        status: 'Active',
        currentTask: 'Awaiting collaborative pipeline trigger',
        avgResponseTimeMs: 8,
        memoryUsageMb: 8.6,
        queueLength: 0,
        healthScore: 100,
        lastActivity: Date.now()
      }
    ];

    agents.forEach(agent => {
      this.registry.set(agent.id, agent);
    });
  }

  // PUBLISH & SUBSCRIBE
  static subscribe(topic: string, callback: MessageCallback): void {
    const list = this.subscribers.get(topic) || [];
    list.push(callback);
    this.subscribers.set(topic, list);
  }

  static publish(msg: AgentMessage): void {
    this.messageHistory.unshift(msg);
    if (this.messageHistory.length > 50) {
      this.messageHistory.pop(); // limit size
    }

    // Dynamic registry telemetry update on message trigger
    this.updateAgentActivity(msg.sender, msg.topic, msg.priority);

    // Topic listeners
    const list = this.subscribers.get(msg.topic) || [];
    list.forEach(cb => {
      try {
        cb(msg);
      } catch (err) {
        console.error(`[BUS] Failed callback on topic "${msg.topic}" for sender "${msg.sender}":`, err);
      }
    });

    // Handle recipient specific callback
    if (msg.recipient !== 'broadcast' && msg.recipient !== msg.sender) {
      const recipientTopic = `direct:${msg.recipient}`;
      const directList = this.subscribers.get(recipientTopic) || [];
      directList.forEach(cb => {
        try {
          cb(msg);
        } catch (err) {
          console.error(`[BUS] Failed direct dispatch to "${msg.recipient}":`, err);
        }
      });
    }
  }

  // REQUEST RESPONSE MAP
  static async request(
    sender: string,
    recipient: string,
    topic: string,
    payload: any,
    priority: 'High' | 'Medium' | 'Low' = 'Medium'
  ): Promise<any> {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const responseTopic = `res:${requestId}`;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.unsubscribe(responseTopic, handler);
        reject(new Error(`Agent request timeout between ${sender} and ${recipient} on topic ${topic}`));
      }, 5000);

      const handler = (msg: AgentMessage) => {
        clearTimeout(timeout);
        this.unsubscribe(responseTopic, handler);
        resolve(msg.payload);
      };

      this.subscribe(responseTopic, handler);

      // Publish request
      this.publish({
        id: requestId,
        sender,
        recipient,
        topic,
        payload: { payload, responseTopic },
        priority,
        timestamp: Date.now()
      });
    });
  }

  static unsubscribe(topic: string, callback: MessageCallback): void {
    const list = this.subscribers.get(topic) || [];
    const index = list.indexOf(callback);
    if (index > -1) {
      list.splice(index, 1);
      this.subscribers.set(topic, list);
    }
  }

  // TELEMETRY UPDATERS
  private static updateAgentActivity(agentName: string, task: string, priority: string): void {
    const found = Array.from(this.registry.values()).find(a => a.name === agentName);
    if (found) {
      found.status = 'Busy';
      found.currentTask = `Processing "${task}"`;
      found.lastActivity = Date.now();
      found.queueLength = Math.min(10, found.queueLength + 1);
      if (priority === 'High') {
        found.avgResponseTimeMs = Math.round(found.avgResponseTimeMs * 0.95 + 4);
      } else {
        found.avgResponseTimeMs = Math.round(found.avgResponseTimeMs * 0.98 + 1);
      }
      setTimeout(() => {
        found.status = 'Active';
        found.queueLength = Math.max(0, found.queueLength - 1);
      }, 400);
    }
  }

  static getTelemetry(): AgentTelemetry[] {
    this.initializeRegistry();
    return Array.from(this.registry.values());
  }

  static getHistory(): AgentMessage[] {
    return this.messageHistory;
  }

  static clearHistory(): void {
    this.messageHistory = [];
  }
}
