import { Workflow, addWorkflowToState, getExecutionState, setActiveWorkflowId } from './executionState';
import { ExecutionPlanner } from './executionPlanner';
import { WorkflowRuntime } from './workflowRuntime';

// Let's create a functional coordinator
export class TaskCoordinator {
  /**
   * Dispatches and immediately starts orchestrating a new design payload
   */
  static async triggerStyleGeneration(
    title: string,
    vibe: string,
    intensity: 'standard' | 'high-fidelity' | 'low-latency',
    context: string,
    onProgress: (wf: Workflow) => void,
    onFinishStyle: (lookResult: any) => void
  ) {
    // 1. Create the plan
    const dnaWeights: Record<string, number> = {
      minimalist: vibe === 'minimalist' ? 0.9 : 0.2,
      streetwear: vibe === 'streetwear' ? 0.9 : 0.2,
      classic: vibe === 'classic' ? 0.9 : 0.2,
      luxury: vibe === 'luxury' ? 0.9 : 0.2,
      cyberpunk: vibe === 'cyberpunk' ? 0.9 : 0.2,
    };

    const plan = ExecutionPlanner.createPlan({
      name: title || `${vibe.toUpperCase()} Style Sequence`,
      intensityLevel: intensity,
      context,
      styleDNA: dnaWeights,
      expectedPayload: { vibe }
    });

    // 2. Persist in active execution memory state
    addWorkflowToState(plan);
    setActiveWorkflowId(plan.id);

    // 3. Define the actual work simulator per stage
    const stageSimulator = async (stage: string, payload: any) => {
      // Simulate physical async delays
      let delay = 300;
      let scoreMultiplier = 1.0;

      switch (stage) {
        case 'input':
          delay = 80;
          break;
        case 'analyze':
          delay = 180;
          scoreMultiplier = 0.95;
          break;
        case 'rank':
          delay = 120;
          scoreMultiplier = 0.98;
          break;
        case 'render':
          delay = intensity === 'high-fidelity' ? 600 : 300;
          scoreMultiplier = 0.97;
          break;
        case 'explain':
          delay = 200;
          scoreMultiplier = 0.92;
          break;
        case 'publish':
          delay = 100;
          scoreMultiplier = 0.96;
          break;
        case 'persist':
          delay = 80;
          scoreMultiplier = 1.0;
          break;
      }

      await new Promise(resolve => setTimeout(resolve, delay));

      // Quality evaluation mapping
      const baseQuality = 0.85 + Math.random() * 0.15;
      const finalQuality = Math.min(1.0, baseQuality * scoreMultiplier);

      return {
        quality: parseFloat(finalQuality.toFixed(3)),
        payload: {
          lookId: `look-${Math.floor(Math.random() * 900) + 100}`,
          renderedColors: ['#0A0A0C', '#222530', '#DCE2E5'],
          vibe,
          renderedTitle: `${title || vibe.toUpperCase()} Rendered Outfit`,
          outfitScore: Math.round(finalQuality * 100)
        }
      };
    };

    // 4. Trigger the Runtime manager
    WorkflowRuntime.executeWorkflow(
      plan,
      (updatedWf) => {
        onProgress(updatedWf);
      },
      stageSimulator
    ).then(() => {
      const finishedWf = getExecutionState().workflows.find(w => w.id === plan.id);
      if (finishedWf && finishedWf.status === 'completed') {
        onFinishStyle(finishedWf.outputPayload);
      }
    });

    return plan.id;
  }
}
