import { useState } from 'react';
import { 
  AutonomousExecutionEngine, 
  AutonomousGoalRecord, 
  ExecutionMetricsSummary 
} from '../../../engine';

export function useAutonomousData(wardrobeItems: any[], uId: string, setAgentLog: (msg: string) => void) {
  const [autonomousGoals, setAutonomousGoals] = useState<AutonomousGoalRecord[]>(() => {
    return AutonomousExecutionEngine.getGoals(uId);
  });

  const [activeGoalId, setActiveGoalId] = useState<string>('goal-seasonal-curator');
  const [customGoalName, setCustomGoalName] = useState<string>('');
  const [customGoalDesc, setCustomGoalDesc] = useState<string>('');
  const [schedulerPolicy, setSchedulerPolicy] = useState<'Priority First' | 'FCFS' | 'Interactive Adaptive'>('Priority First');

  const runGoalStep = (goalId: string, taskId: string) => {
    const updated = AutonomousExecutionEngine.executeNextStep(uId, goalId, taskId, wardrobeItems);
    setAutonomousGoals(updated);
    setAgentLog(`AutonomousEngine: Executed step for Task ID "${taskId}" in Goal ID "${goalId}".`);
  };

  const rollbackGoal = (goalId: string) => {
    const updated = AutonomousExecutionEngine.triggerRollback(uId, goalId);
    setAutonomousGoals(updated);
    setAgentLog(`AutonomousEngine: Rolled back Goal ID "${goalId}". All original params restored.`);
  };

  const recoverGoalTask = (goalId: string, taskId: string) => {
    const updated = AutonomousExecutionEngine.triggerRecovery(uId, goalId, taskId);
    setAutonomousGoals(updated);
    setAgentLog(`AutonomousEngine: Triggered high-integrity recovery override on Task ID "${taskId}".`);
  };

  const createCustomGoal = () => {
    if (!customGoalName.trim()) return;
    const newGoal: AutonomousGoalRecord = {
      id: `goal-custom-${Date.now()}`,
      name: customGoalName,
      description: customGoalDesc || 'Manually created custom wardrobe sequence.',
      overallState: 'Idle',
      createdAt: Date.now(),
      tasks: [
        {
          id: `task-custom-rot-${Date.now()}`,
          type: 'Wardrobe Rotation',
          priority: 'High',
          dependencies: [],
          state: 'Idle',
          progress: 0,
          retryCount: 0,
          maxRetries: 3,
          executionTimeMs: 0,
          logs: ['[QUEUE] Initialized in custom goal loop.']
        },
        {
          id: `task-custom-ref-${Date.now()}`,
          type: 'Learning Refresh',
          priority: 'Medium',
          dependencies: [`task-custom-rot-${Date.now()}`],
          state: 'Idle',
          progress: 0,
          retryCount: 0,
          maxRetries: 3,
          executionTimeMs: 0,
          logs: ['[QUEUE] Awaiting predecessor rotation completion.']
        }
      ]
    };

    const updated = [newGoal, ...autonomousGoals];
    AutonomousExecutionEngine.saveGoals(updated);
    setAutonomousGoals(updated);
    setActiveGoalId(newGoal.id);
    setCustomGoalName('');
    setCustomGoalDesc('');
    setAgentLog(`AutonomousEngine: Dispatched custom goal "${newGoal.name}" with topological dependencies.`);
  };

  const executionMetrics = AutonomousExecutionEngine.getExecutionMetrics(autonomousGoals);

  return {
    autonomousGoals,
    setAutonomousGoals,
    activeGoalId,
    setActiveGoalId,
    customGoalName,
    setCustomGoalName,
    customGoalDesc,
    setCustomGoalDesc,
    schedulerPolicy,
    setSchedulerPolicy,
    runGoalStep,
    rollbackGoal,
    recoverGoalTask,
    createCustomGoal,
    executionMetrics
  };
}
