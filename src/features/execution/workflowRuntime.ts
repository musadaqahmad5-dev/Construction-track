import { Workflow, WorkflowStep, WorkflowStage, updateWorkflowInState, getExecutionState } from './executionState';

export type WorkflowListener = (wf: Workflow) => void;

class WorkflowRuntimeManager {
  private activeIntervals: Record<string, NodeJS.Timeout> = {};
  private pausedWorkflows: Record<string, boolean> = {};
  private abortedWorkflows: Record<string, boolean> = {};
  private listeners: Record<string, WorkflowListener[]> = {};

  addListener(wfId: string, listener: WorkflowListener) {
    if (!this.listeners[wfId]) {
      this.listeners[wfId] = [];
    }
    this.listeners[wfId].push(listener);
  }

  removeListeners(wfId: string) {
    delete this.listeners[wfId];
  }

  private notify(wf: Workflow) {
    if (this.listeners[wf.id]) {
      this.listeners[wf.id].forEach(cb => cb(wf));
    }
  }

  /**
   * Starts running a visual/logic workflow step-by-step
   */
  async executeWorkflow(
    wf: Workflow,
    onProgress: WorkflowListener,
    executeStageMock: (stage: WorkflowStage, payload: any) => Promise<{ quality: number; payload: any }>
  ) {
    const wfId = wf.id;
    this.addListener(wfId, onProgress);
    this.abortedWorkflows[wfId] = false;
    this.pausedWorkflows[wfId] = false;

    updateWorkflowInState(wfId, current => ({
      ...current,
      status: 'running',
    }));

    let currentWf = getExecutionState().workflows.find(w => w.id === wfId) || wf;
    this.notify(currentWf);

    let outputResult: any = null;

    for (let index = 0; index < currentWf.steps.length; index++) {
      if (this.abortedWorkflows[wfId]) {
        this.markStatus(wfId, 'cancelled');
        return;
      }

      // Handle raw pause loops safely
      while (this.pausedWorkflows[wfId]) {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (this.abortedWorkflows[wfId]) {
          this.markStatus(wfId, 'cancelled');
          return;
        }
      }

      // Refresh state to fetch dynamic manual adjustments
      currentWf = getExecutionState().workflows.find(w => w.id === wfId) || currentWf;
      const step = currentWf.steps[index];

      // Update active index
      updateWorkflowInState(wfId, cur => {
        const nextSteps = [...cur.steps];
        nextSteps[index].status = 'running';
        return {
          ...cur,
          currentStageIndex: index,
          steps: nextSteps,
        };
      });
      currentWf = getExecutionState().workflows.find(w => w.id === wfId)!;
      this.notify(currentWf);

      const startTime = Date.now();
      let success = false;
      let finalQuality = step.qualityScore;
      outputResult = null;

      // Retries Loop
      while (!success && step.retryCount <= 2) {
        try {
          // Timeout mock protection
          const stageExecutionPromise = executeStageMock(step.stage, currentWf.inputPayload);
          const timeoutPromise = new Promise<{ quality: number; payload: any }>((_, reject) =>
            setTimeout(() => reject(new Error('Stage Timeout Executing Out of bounds')), 3000)
          );

          const result = await Promise.race([stageExecutionPromise, timeoutPromise]);
          finalQuality = result.quality;
          outputResult = result.payload;
          success = true;
        } catch (err: any) {
          step.retryCount++;
          if (step.retryCount > 2 || !step.recoverable) {
            updateWorkflowInState(wfId, cur => {
              const nextSteps = [...cur.steps];
              nextSteps[index].status = 'failed';
              nextSteps[index].error = err.message || 'Fatal execution error';
              return {
                ...cur,
                status: 'failed',
                steps: nextSteps,
              };
            });
            currentWf = getExecutionState().workflows.find(w => w.id === wfId)!;
            this.notify(currentWf);
            this.removeListeners(wfId);
            return;
          }
          // Brief backoff before next retry
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      const elapsed = Date.now() - startTime;

      updateWorkflowInState(wfId, cur => {
        const nextSteps = [...cur.steps];
        nextSteps[index].status = 'completed';
        nextSteps[index].durationMs = elapsed;
        nextSteps[index].qualityScore = finalQuality;
        return {
          ...cur,
          totalDurationMs: cur.totalDurationMs + elapsed,
          steps: nextSteps,
        };
      });
      currentWf = getExecutionState().workflows.find(w => w.id === wfId)!;
      this.notify(currentWf);
      
      // Delay to simulate computation rhythm
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Compute aggregate average quality score
    updateWorkflowInState(wfId, cur => {
      const activeTotalQuality = cur.steps.reduce((sum, s) => sum + s.qualityScore, 0);
      const overallQualityScore = activeTotalQuality / cur.steps.length;
      return {
        ...cur,
        status: 'completed',
        overallQualityScore,
        completedAt: new Date().toISOString(),
        outputPayload: outputResult || { lookId: `rendered-${Date.now()}` }
      };
    });

    currentWf = getExecutionState().workflows.find(w => w.id === wfId)!;
    this.notify(currentWf);
    this.removeListeners(wfId);
  }

  cancelWorkflow(wfId: string) {
    this.abortedWorkflows[wfId] = true;
    this.pausedWorkflows[wfId] = false;
  }

  togglePause(wfId: string): boolean {
    this.pausedWorkflows[wfId] = !this.pausedWorkflows[wfId];
    updateWorkflowInState(wfId, cur => ({
      ...cur,
      status: this.pausedWorkflows[wfId] ? 'paused' : 'running',
    }));
    const currentWf = getExecutionState().workflows.find(w => w.id === wfId);
    if (currentWf) this.notify(currentWf);
    return this.pausedWorkflows[wfId];
  }

  private markStatus(wfId: string, status: 'cancelled' | 'failed') {
    updateWorkflowInState(wfId, cur => ({
      ...cur,
      status,
      completedAt: new Date().toISOString(),
    }));
    const currentWf = getExecutionState().workflows.find(w => w.id === wfId);
    if (currentWf) this.notify(currentWf);
    this.removeListeners(wfId);
  }
}

export const WorkflowRuntime = new WorkflowRuntimeManager();
