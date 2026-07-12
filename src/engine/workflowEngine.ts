import { WardrobeItem } from '../types';
import { AgentCommunicationBus } from '../agents/agentBus';
import { 
  FashionStylistAgent, 
  FashionMemoryAgent, 
  FashionVisionAgent, 
  FashionKnowledgeAgent, 
  DecisionAgent 
} from '../agents/agents';

// ============================================================================
// WORKFLOW MODEL INTERFACES
// ============================================================================

export type WorkflowStatus = 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Paused' | 'Cancelled';

export interface ExecutionStep {
  id: string;
  name: string;
  targetAgent: string;
  actionName: string;
  input: any;
  output?: any;
  durationMs?: number;
  confidence?: number;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Skipped';
  error?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  trigger: string;
  conditions: string[];
  requiredAgents: string[];
  steps: ExecutionStep[];
  dependencies: string[]; // IDs of other workflows that must complete first
  retryPolicy: {
    maxAttempts: number;
    delayMs: number;
  };
  timeoutMs: number;
  status: WorkflowStatus;
  createdTime: number;
  startTime?: number;
  completedTime?: number;
  durationMs?: number;
  confidenceScore: number;
  resultSummary?: string;
}

export interface EnterpriseWorkflowMetrics {
  runningCount: number;
  completedCount: number;
  failedCount: number;
  averageDurationMs: number;
  successRatePercent: number;
  totalWorkflowsRegistered: number;
  queueSize: number;
  retryOperationsCount: number;
  agentUtilizationMap: Record<string, number>;
}

// ============================================================================
// DETERMINISTIC ENTERPRISE WORKFLOW ORCHESTRATION ENGINE
// ============================================================================

export class EnterpriseWorkflowEngine {
  private static registeredWorkflows = new Map<string, WorkflowDefinition>();
  private static workflowQueue: string[] = []; // Queue of workflow IDs to run
  private static runningWorkflows = new Set<string>();
  private static executionHistory: WorkflowDefinition[] = [];
  private static retryStatsCount = 0;

  // SEED WORKFLOW TEMPLATES
  static getTemplates(userId: string = 'user-1'): WorkflowDefinition[] {
    const defaultTemplates: WorkflowDefinition[] = [
      {
        id: 'wf-morning-planning',
        name: 'Morning Outfit Planning',
        description: 'Synchronizes daily climate logs, personal schedule triggers, and Style DNA to curate a personalized morning outfit.',
        priority: 'High',
        trigger: 'Daily startup',
        conditions: ['Weather data available', 'Wardrobe has items'],
        requiredAgents: ['FashionMemoryAgent', 'FashionKnowledgeAgent', 'DecisionAgent', 'FashionStylistAgent'],
        dependencies: [],
        retryPolicy: { maxAttempts: 3, delayMs: 100 },
        timeoutMs: 3000,
        status: 'Pending',
        createdTime: Date.now(),
        confidenceScore: 100,
        steps: [
          {
            id: 'step-mem-load',
            name: 'Extract Style DNA',
            targetAgent: 'FashionMemoryAgent',
            actionName: 'getProfileState',
            input: { userId },
            status: 'Pending'
          },
          {
            id: 'step-know-check',
            name: 'Check Harmony Graph',
            targetAgent: 'FashionKnowledgeAgent',
            actionName: 'getHarmonyRules',
            input: {},
            status: 'Pending'
          },
          {
            id: 'step-dec-rank',
            name: 'Rank Candidate Outfits',
            targetAgent: 'DecisionAgent',
            actionName: 'rankCandidates',
            input: { occasion: 'Casual Work Day', weather: 'Sunny 18°C' },
            status: 'Pending'
          },
          {
            id: 'step-sty-outfit',
            name: 'Formulate Stylist Recommendation',
            targetAgent: 'FashionStylistAgent',
            actionName: 'handleOutfitRequest',
            input: { occasion: 'Casual Work Day' },
            status: 'Pending'
          }
        ]
      },
      {
        id: 'wf-laundry-tracker',
        name: 'Laundry & Wear Frequency Audit',
        description: 'Analyzes high-wear items in the capsule wardrobe, updates life-cycle state to Worn/Wash, and recommends active laundry rotations.',
        priority: 'Medium',
        trigger: 'Weekly review',
        conditions: ['Wardrobe has items'],
        requiredAgents: ['FashionVisionAgent', 'DecisionAgent'],
        dependencies: [],
        retryPolicy: { maxAttempts: 2, delayMs: 150 },
        timeoutMs: 2500,
        status: 'Pending',
        createdTime: Date.now(),
        confidenceScore: 98,
        steps: [
          {
            id: 'step-vis-duplicate',
            name: 'Identify Duplicate Wear Patterns',
            targetAgent: 'FashionVisionAgent',
            actionName: 'analyzeGarments',
            input: {},
            status: 'Pending'
          },
          {
            id: 'step-dec-laundry',
            name: 'Classify Laundry Candidates',
            targetAgent: 'DecisionAgent',
            actionName: 'rankCandidates',
            input: { occasion: 'Laundry Rotation Analysis' },
            status: 'Pending'
          }
        ]
      },
      {
        id: 'wf-seasonal-refresh',
        name: 'Seasonal Closet Refresh',
        description: 'Sweeps existing wardrobe counts against current-season thermal levels to suggest storage rotation and waterproof deficiencies.',
        priority: 'Medium',
        trigger: 'Season changes',
        conditions: ['Season parameter change detected'],
        requiredAgents: ['FashionMemoryAgent', 'FashionKnowledgeAgent', 'FashionStylistAgent'],
        dependencies: [],
        retryPolicy: { maxAttempts: 2, delayMs: 200 },
        timeoutMs: 4000,
        status: 'Pending',
        createdTime: Date.now(),
        confidenceScore: 99,
        steps: [
          {
            id: 'step-mem-seasonal',
            name: 'Load Seasonal Memory Limits',
            targetAgent: 'FashionMemoryAgent',
            actionName: 'getProfileState',
            input: { userId },
            status: 'Pending'
          },
          {
            id: 'step-know-season-rules',
            name: 'Fetch Seasonal Fabric Taxonomy',
            targetAgent: 'FashionKnowledgeAgent',
            actionName: 'getHarmonyRules',
            input: {},
            status: 'Pending'
          },
          {
            id: 'step-sty-season-recommend',
            name: 'Orchestrate Seasonal Capsule Outfits',
            targetAgent: 'FashionStylistAgent',
            actionName: 'handleOutfitRequest',
            input: { occasion: 'Seasonal Transition' },
            status: 'Pending'
          }
        ]
      },
      {
        id: 'wf-capsule-optimize',
        name: 'Capsule Wardrobe Optimization',
        description: 'Fuses visual similarity analysis, wear metrics, and color harmonies to isolate low-utility items and recommend marketplace sales.',
        priority: 'High',
        trigger: 'New fashion trend detected',
        conditions: ['Wardrobe has items', 'Marketplace trend is loaded'],
        requiredAgents: ['FashionVisionAgent', 'FashionKnowledgeAgent', 'DecisionAgent'],
        dependencies: [],
        retryPolicy: { maxAttempts: 3, delayMs: 100 },
        timeoutMs: 3000,
        status: 'Pending',
        createdTime: Date.now(),
        confidenceScore: 100,
        steps: [
          {
            id: 'step-vis-similarity',
            name: 'Analyze Visual Similarity Matrix',
            targetAgent: 'FashionVisionAgent',
            actionName: 'analyzeGarments',
            input: {},
            status: 'Pending'
          },
          {
            id: 'step-know-capsule-harmony',
            name: 'Verify Capsule Color Harmonies',
            targetAgent: 'FashionKnowledgeAgent',
            actionName: 'getHarmonyRules',
            input: {},
            status: 'Pending'
          },
          {
            id: 'step-dec-capsule-rank',
            name: 'Identify Low-Utility Items',
            targetAgent: 'DecisionAgent',
            actionName: 'rankCandidates',
            input: { occasion: 'Capsule Utility Optimization' },
            status: 'Pending'
          }
        ]
      }
    ];

    return defaultTemplates;
  }

  // REGISTER WORKFLOW
  static registerWorkflow(wf: WorkflowDefinition): void {
    this.registeredWorkflows.set(wf.id, wf);
  }

  static getWorkflows(): WorkflowDefinition[] {
    if (this.registeredWorkflows.size === 0) {
      this.getTemplates().forEach(wf => this.registerWorkflow(wf));
    }
    return Array.from(this.registeredWorkflows.values());
  }

  static getQueue(): string[] {
    return this.workflowQueue;
  }

  static getHistory(): WorkflowDefinition[] {
    return this.executionHistory;
  }

  // TRIGGER WORKFLOW BY TRIGGER VALUE
  static triggerWorkflowsByEvent(trigger: string, contextItems: WardrobeItem[], userId: string = 'user-1'): void {
    const list = this.getWorkflows();
    list.forEach(wf => {
      if (wf.trigger.toLowerCase() === trigger.toLowerCase() && wf.status === 'Pending') {
        this.enqueueWorkflow(wf.id);
      }
    });
  }

  static enqueueWorkflow(id: string): void {
    const wf = this.registeredWorkflows.get(id);
    if (!wf) return;

    if (!this.workflowQueue.includes(id)) {
      wf.status = 'Pending';
      this.workflowQueue.push(id);
      // Sort queue based on priority weighting (Critical > High > Medium > Low)
      const priorityMap: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      this.workflowQueue.sort((a, b) => {
        const pA = priorityMap[this.registeredWorkflows.get(a)?.priority || 'Low'];
        const pB = priorityMap[this.registeredWorkflows.get(b)?.priority || 'Low'];
        return pB - pA;
      });

      AgentCommunicationBus.publish({
        id: `wf-event-queue-${Date.now()}`,
        sender: 'OrchestrationEngine',
        recipient: 'broadcast',
        topic: 'workflow:enqueued',
        payload: { workflowId: id, name: wf.name, priority: wf.priority },
        priority: 'Low',
        timestamp: Date.now()
      });
    }
  }

  // EXECUTE A WORKFLOW DETERMINISTICALLY (LOCAL-FIRST)
  static async runWorkflow(id: string, items: WardrobeItem[], userId: string = 'user-1'): Promise<WorkflowDefinition> {
    const wf = this.registeredWorkflows.get(id);
    if (!wf) throw new Error(`Workflow with ID ${id} not registered.`);

    // 1. Dependency Resolution Check
    for (const depId of wf.dependencies) {
      const depWf = this.registeredWorkflows.get(depId);
      if (depWf && depWf.status !== 'Completed') {
        throw new Error(`Cannot execute workflow ${wf.name} because its dependency ${depWf.name} is not completed.`);
      }
    }

    wf.status = 'Running';
    wf.startTime = Date.now();
    this.runningWorkflows.add(id);

    AgentCommunicationBus.publish({
      id: `wf-start-${Date.now()}`,
      sender: 'OrchestrationEngine',
      recipient: 'broadcast',
      topic: 'workflow:started',
      payload: { workflowId: id, name: wf.name },
      priority: 'High',
      timestamp: Date.now()
    });

    let currentAttempt = 1;
    let stepIndex = 0;

    while (stepIndex < wf.steps.length) {
      const step = wf.steps[stepIndex];
      step.status = 'Running';
      const stepStartTime = Date.now();

      try {
        // Execute step locally wrapping our modular agents with zero API calls
        let result: any = null;
        let confidence = 95;

        switch (step.targetAgent) {
          case 'FashionMemoryAgent':
            result = FashionMemoryAgent.getProfileState(userId);
            confidence = 98;
            break;
          case 'FashionKnowledgeAgent':
            result = FashionKnowledgeAgent.getHarmonyRules();
            confidence = 100;
            break;
          case 'FashionVisionAgent':
            result = FashionVisionAgent.analyzeGarments(items);
            confidence = 94;
            break;
          case 'DecisionAgent':
            result = DecisionAgent.rankCandidates(items, {
              userId,
              weather: 'Crisp 14°C',
              occasion: 'General Rotation',
              season: 'Autumn'
            }, {});
            confidence = result?.overallScore || 88;
            break;
          case 'FashionStylistAgent':
            result = FashionStylistAgent.handleOutfitRequest({
              items,
              occasion: 'General Outfit Matching',
              weather: 'Crisp 14°C',
              season: 'Autumn',
              userId
            });
            confidence = 92;
            break;
          default:
            // Optional/Skip fallback action
            result = { status: 'unsupported_agent_fall_back' };
            confidence = 50;
            break;
        }

        step.output = result;
        step.confidence = confidence;
        step.durationMs = Date.now() - stepStartTime;
        step.status = 'Completed';
        stepIndex++;
        currentAttempt = 1; // reset attempts on success
      } catch (err: any) {
        // Self-Healing & Failure Recovery Block
        console.warn(`[Orchestration Engine] Step "${step.name}" failed:`, err);
        
        if (currentAttempt < wf.retryPolicy.maxAttempts) {
          this.retryStatsCount++;
          currentAttempt++;
          console.log(`[Orchestration Engine] Retrying step "${step.name}" in ${wf.retryPolicy.delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, wf.retryPolicy.delayMs));
          // Re-loop on the same step
        } else {
          // Skip optional steps if failed or recover using fallback metrics
          step.status = 'Failed';
          step.error = err?.message || String(err);
          
          const isOptional = ['step-vis-duplicate', 'step-vis-similarity', 'step-know-season-rules'].includes(step.id);
          if (isOptional) {
            console.log(`[Orchestration Engine] Skipping failed optional step: "${step.name}"`);
            step.status = 'Skipped';
            stepIndex++;
            currentAttempt = 1;
          } else {
            // Core workflow failed
            wf.status = 'Failed';
            wf.completedTime = Date.now();
            wf.durationMs = wf.completedTime - wf.startTime;
            wf.resultSummary = `Execution aborted on core step: "${step.name}". Reason: ${step.error}`;
            this.runningWorkflows.delete(id);
            this.recordHistory(wf);

            AgentCommunicationBus.publish({
              id: `wf-fail-${Date.now()}`,
              sender: 'OrchestrationEngine',
              recipient: 'broadcast',
              topic: 'workflow:failed',
              payload: { workflowId: id, name: wf.name, error: step.error },
              priority: 'High',
              timestamp: Date.now()
            });

            return wf;
          }
        }
      }
    }

    // Workflow Successful Completion
    wf.status = 'Completed';
    wf.completedTime = Date.now();
    wf.durationMs = wf.completedTime - wf.startTime;
    
    // Compute total average confidence
    const completedSteps = wf.steps.filter(s => s.status === 'Completed');
    const avgConfidence = completedSteps.reduce((acc, curr) => acc + (curr.confidence || 90), 0) / (completedSteps.length || 1);
    wf.confidenceScore = Math.round(avgConfidence);

    // Format localized result summary
    const stylistStep = wf.steps.find(s => s.targetAgent === 'FashionStylistAgent');
    const outfitTitle = stylistStep?.output?.title || 'Classic Wardrobe Standard';
    wf.resultSummary = `Orchestrated ${completedSteps.length} modular tasks smoothly. Optimal output alignment: "${outfitTitle}" (Confidence: ${wf.confidenceScore}%).`;

    this.runningWorkflows.delete(id);
    this.recordHistory(wf);

    AgentCommunicationBus.publish({
      id: `wf-complete-${Date.now()}`,
      sender: 'OrchestrationEngine',
      recipient: 'broadcast',
      topic: 'workflow:completed',
      payload: { workflowId: id, name: wf.name, summary: wf.resultSummary },
      priority: 'Medium',
      timestamp: Date.now()
    });

    return wf;
  }

  // QUEUE PROCESSING DISPATCHER LOOP
  static async processQueue(items: WardrobeItem[], userId: string = 'user-1'): Promise<void> {
    while (this.workflowQueue.length > 0) {
      const nextId = this.workflowQueue.shift();
      if (nextId) {
        try {
          await this.runWorkflow(nextId, items, userId);
        } catch (err) {
          console.error(`[Orchestration Engine] Queue loop error running ${nextId}:`, err);
        }
      }
    }
  }

  private static recordHistory(wf: WorkflowDefinition): void {
    // Keep reference log
    const copy = { ...wf, steps: wf.steps.map(s => ({ ...s })) };
    this.executionHistory.unshift(copy);
    if (this.executionHistory.length > 30) {
      this.executionHistory.pop();
    }
  }

  // CANCEL RUNNING WORKFLOW
  static cancelWorkflow(id: string): void {
    const wf = this.registeredWorkflows.get(id);
    if (wf && wf.status === 'Running') {
      wf.status = 'Cancelled';
      wf.completedTime = Date.now();
      wf.resultSummary = 'Orchestration sequence forcefully aborted by admin override.';
      this.runningWorkflows.delete(id);
      this.recordHistory(wf);
    }
  }

  // RESET ALL STATE
  static resetEngineState(): void {
    this.registeredWorkflows.clear();
    this.workflowQueue = [];
    this.runningWorkflows.clear();
    this.executionHistory = [];
    this.retryStatsCount = 0;
  }

  // COMPILE METRICS
  static getMetrics(): EnterpriseWorkflowMetrics {
    const list = this.getWorkflows();
    const history = this.executionHistory;
    const completedHistory = history.filter(h => h.status === 'Completed');

    // Aggregate average duration
    const avgDuration = completedHistory.length > 0
      ? completedHistory.reduce((acc, curr) => acc + (curr.durationMs || 0), 0) / completedHistory.length
      : 8.5; // low scheduler overhead default

    // Success rate
    const successRate = history.length > 0
      ? (history.filter(h => h.status === 'Completed').length / history.length) * 100
      : 100;

    // Agent utilization metrics
    const utilMap: Record<string, number> = {
      'FashionStylistAgent': 0,
      'FashionMemoryAgent': 0,
      'FashionVisionAgent': 0,
      'FashionKnowledgeAgent': 0,
      'DecisionAgent': 0
    };

    history.forEach(h => {
      h.steps.forEach(s => {
        if (s.status === 'Completed' && utilMap[s.targetAgent] !== undefined) {
          utilMap[s.targetAgent]++;
        }
      });
    });

    return {
      runningCount: this.runningWorkflows.size,
      completedCount: history.filter(h => h.status === 'Completed').length,
      failedCount: history.filter(h => h.status === 'Failed').length,
      averageDurationMs: Math.round(avgDuration),
      successRatePercent: Math.round(successRate),
      totalWorkflowsRegistered: list.length,
      queueSize: this.workflowQueue.length,
      retryOperationsCount: this.retryStatsCount,
      agentUtilizationMap: utilMap
    };
  }
}
