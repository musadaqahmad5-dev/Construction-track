export interface WorkflowStep {
  id: string;
  name: string;
  dependsOn: string[];
  action: (context: any) => Promise<any>;
  status: "idle" | "running" | "succeeded" | "failed";
  retries: number;
  maxRetries: number;
}

export interface WorkflowInstance {
  id: string;
  steps: Map<string, WorkflowStep>;
  context: Record<string, any>;
  status: "pending" | "executing" | "succeeded" | "failed";
}

export class WorkflowEngine {
  private activeWorkflows: Map<string, WorkflowInstance> = new Map();

  constructor() {
    console.log("[EAOS WORKFLOW ENGINE] Workflow Engine core active.");
  }

  /**
   * Registers and executes a DAG network of steps, resolving dependencies in dynamic order.
   */
  public async executeWorkflow(id: string, stepsList: WorkflowStep[], initialContext: any): Promise<any> {
    const stepsMap = new Map<string, WorkflowStep>();
    stepsList.forEach(step => stepsMap.set(step.id, { ...step, status: "idle", retries: 0 }));

    const workflow: WorkflowInstance = {
      id,
      steps: stepsMap,
      context: { ...initialContext, _history: [] },
      status: "pending"
    };

    this.activeWorkflows.set(id, workflow);
    workflow.status = "executing";

    console.log(`[EAOS WORKFLOW ENGINE] Executing DAG workflow: ${id} with ${stepsList.length} defined stages`);

    try {
      while (this.hasUnfinishedSteps(workflow)) {
        const executableSteps = this.getExecutableSteps(workflow);
        if (executableSteps.length === 0 && this.hasUnfinishedSteps(workflow)) {
          throw new Error("Cyclic dependency or deadlock detected inside workflow DAG.");
        }

        // Run executable steps in parallel execution threads
        await Promise.all(executableSteps.map(step => this.executeStep(workflow, step)));
      }

      workflow.status = "succeeded";
      console.log(`[EAOS WORKFLOW ENGINE] Workflow ${id} executed successfully.`);
      return workflow.context;
    } catch (error: any) {
      workflow.status = "failed";
      console.error(`[EAOS WORKFLOW ENGINE] Workflow ${id} execution failed:`, error.message);
      throw error;
    }
  }

  private hasUnfinishedSteps(workflow: WorkflowInstance): boolean {
    return Array.from(workflow.steps.values()).some(step => step.status !== "succeeded" && step.status !== "failed");
  }

  private getExecutableSteps(workflow: WorkflowInstance): WorkflowStep[] {
    return Array.from(workflow.steps.values()).filter(step => {
      if (step.status !== "idle") return false;
      // All dependencies must be marked succeeded
      return step.dependsOn.every(depId => workflow.steps.get(depId)?.status === "succeeded");
    });
  }

  private async executeStep(workflow: WorkflowInstance, step: WorkflowStep): Promise<void> {
    step.status = "running";
    console.log(`[EAOS WORKFLOW ENGINE] Starting step: ${step.name}`);

    while (step.retries <= step.maxRetries) {
      try {
        const result = await step.action(workflow.context);
        workflow.context[step.id] = result;
        workflow.context._history.push({ step: step.id, timestamp: new Date(), status: "succeeded" });
        step.status = "succeeded";
        console.log(`[EAOS WORKFLOW ENGINE] Step succeeded: ${step.name}`);
        return;
      } catch (error: any) {
        step.retries++;
        console.warn(`[EAOS WORKFLOW ENGINE] Step failed: ${step.name} (Attempt ${step.retries}/${step.maxRetries + 1}). Error: ${error.message}`);
        if (step.retries > step.maxRetries) {
          step.status = "failed";
          workflow.context._history.push({ step: step.id, timestamp: new Date(), status: "failed", error: error.message });
          throw error;
        }
      }
    }
  }
}
