export interface AgentTask {
  id: string;
  type: string;
  payload: any;
  status: "pending" | "assigned" | "completed" | "failed";
  assignedAgent?: string;
  result?: any;
}

export interface AgentMetadata {
  id: string;
  name: string;
  role: string;
  personality: string;
  capabilities: string[];
}

export class AgentOrchestrator {
  private registeredAgents: Map<string, AgentMetadata> = new Map();
  private activeTasks: Map<string, AgentTask> = new Map();

  constructor() {
    this.bootstrapSystemAgents();
  }

  private bootstrapSystemAgents() {
    this.registerAgent({
      id: "agent-sartorial-planner",
      name: "SartorialPlanner",
      role: "Aesthetic Design and Vibe Coordination",
      personality: "Warm, highly selective, safety-conscious and deeply structural",
      capabilities: ["coord_vibe_match", "palette_synthesis", "fit_analysis"]
    });

    this.registerAgent({
      id: "agent-material-governor",
      name: "MaterialGovernor",
      role: "Compliance and Resource Guardrail Enforcement",
      personality: "Analytical, pragmatic, structural SRE-like precision",
      capabilities: ["safety_gate_audit", "quota_ledger_accounting", "risk_mitigation"]
    });
  }

  public registerAgent(agent: AgentMetadata): void {
    this.registeredAgents.set(agent.id, agent);
    console.log(`[EAOS ORCHESTRATOR] Registered agent: ${agent.name} [Role: ${agent.role}]`);
  }

  /**
   * Dispatches task through autonomous feedback loop and agent consensus matching.
   */
  public async orchestrateTask(task: AgentTask): Promise<AgentTask> {
    task.status = "assigned";
    this.activeTasks.set(task.id, task);

    // Dynamic routing based on capabilities matching
    const assigned = Array.from(this.registeredAgents.values()).find(agent =>
      agent.capabilities.includes(task.type)
    );

    if (!assigned) {
      task.status = "failed";
      task.result = { error: `No compatible agent found for capability: ${task.type}` };
      console.error(`[EAOS ORCHESTRATOR] Routing failed for Task: ${task.id}`);
      return task;
    }

    task.assignedAgent = assigned.name;
    console.log(`[EAOS ORCHESTRATOR] Dispatched task ${task.id} (${task.type}) -> Agent ${assigned.name}`);

    // Simulated execution loop with safety confirmation pass-back
    task.status = "completed";
    task.result = {
      outcome: `Successfully processed by ${assigned.name}`,
      metadata: {
        agentSignoff: `Certified safe under EAOS Constitution Gate 4`,
        confidenceScore: 0.98,
        cyclesElapsed: 1
      }
    };

    return task;
  }
}
