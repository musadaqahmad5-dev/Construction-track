export type WorkflowStage = 'input' | 'analyze' | 'rank' | 'render' | 'explain' | 'publish' | 'persist';

export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';

export interface WorkflowStep {
  stage: WorkflowStage;
  status: WorkflowStatus;
  durationMs: number;
  qualityScore: number;
  error?: string;
  recoverable: boolean;
  retryCount: number;
}

export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  currentStageIndex: number;
  steps: WorkflowStep[];
  overallQualityScore: number;
  createdAt: string;
  completedAt?: string;
  totalDurationMs: number;
  inputPayload: any;
  outputPayload?: any;
}

export interface ExecutionState {
  workflows: Workflow[];
  activeWorkflowId: string | null;
}

// In-memory state store for workflows
let inMemoryExecutionState: ExecutionState = {
  workflows: [
    {
      id: 'wf-initial-001',
      name: 'Corporate Capsule Outfit Synth',
      status: 'completed',
      currentStageIndex: 6,
      overallQualityScore: 0.94,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3500000).toISOString(),
      totalDurationMs: 1250,
      inputPayload: { style: 'classic', context: 'Executive Boardroom' },
      outputPayload: { lookId: 'look-991', outfitScore: 95 },
      steps: [
        { stage: 'input', status: 'completed', durationMs: 50, qualityScore: 1.0, recoverable: true, retryCount: 0 },
        { stage: 'analyze', status: 'completed', durationMs: 150, qualityScore: 0.92, recoverable: true, retryCount: 0 },
        { stage: 'rank', status: 'completed', durationMs: 120, qualityScore: 0.95, recoverable: true, retryCount: 0 },
        { stage: 'render', status: 'completed', durationMs: 450, qualityScore: 0.96, recoverable: true, retryCount: 0 },
        { stage: 'explain', status: 'completed', durationMs: 200, qualityScore: 0.90, recoverable: true, retryCount: 0 },
        { stage: 'publish', status: 'completed', durationMs: 180, qualityScore: 0.95, recoverable: true, retryCount: 0 },
        { stage: 'persist', status: 'completed', durationMs: 100, qualityScore: 1.0, recoverable: true, retryCount: 0 }
      ]
    },
    {
      id: 'wf-initial-002',
      name: 'Cyberpunk Shield Active Wear',
      status: 'completed',
      currentStageIndex: 6,
      overallQualityScore: 0.88,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      completedAt: new Date(Date.now() - 1700000).toISOString(),
      totalDurationMs: 2150,
      inputPayload: { style: 'cyberpunk', context: 'Acid Mist' },
      outputPayload: { lookId: 'look-992', outfitScore: 89 },
      steps: [
        { stage: 'input', status: 'completed', durationMs: 60, qualityScore: 1.0, recoverable: true, retryCount: 0 },
        { stage: 'analyze', status: 'completed', durationMs: 320, qualityScore: 0.85, recoverable: true, retryCount: 1 },
        { stage: 'rank', status: 'completed', durationMs: 180, qualityScore: 0.90, recoverable: true, retryCount: 0 },
        { stage: 'render', status: 'completed', durationMs: 850, qualityScore: 0.91, recoverable: true, retryCount: 0 },
        { stage: 'explain', status: 'completed', durationMs: 350, qualityScore: 0.85, recoverable: true, retryCount: 0 },
        { stage: 'publish', status: 'completed', durationMs: 240, qualityScore: 0.89, recoverable: true, retryCount: 0 },
        { stage: 'persist', status: 'completed', durationMs: 150, qualityScore: 1.0, recoverable: true, retryCount: 0 }
      ]
    }
  ],
  activeWorkflowId: null
};

export const getExecutionState = (): ExecutionState => {
  return inMemoryExecutionState;
};

export const addWorkflowToState = (wf: Workflow) => {
  inMemoryExecutionState.workflows = [wf, ...inMemoryExecutionState.workflows];
};

export const updateWorkflowInState = (wfId: string, updater: (wf: Workflow) => Workflow) => {
  inMemoryExecutionState.workflows = inMemoryExecutionState.workflows.map(wf => {
    if (wf.id === wfId) {
      return updater(wf);
    }
    return wf;
  });
};

export const setActiveWorkflowId = (id: string | null) => {
  inMemoryExecutionState.activeWorkflowId = id;
};
