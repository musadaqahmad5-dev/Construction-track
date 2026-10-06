/**
 * EAOS Look Vision AI Fashion OS - Transaction State Machine & DAG Workflow Supervisor
 * Path: packages/workflow-engine/src/WorkflowDagSupervisor.ts
 * Subsystem: Topological DAG Validation, Parallel Async Stage Execution, Exponential Backoff & Compensating Rollback
 */

import crypto from 'crypto';

// ============================================================================
// STRICT DOMAIN CONTRACTS & TYPE DEFINITIONS
// ============================================================================

export type StepExecutionState = 'IDLE' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';

export type WorkflowCompletionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK';

export interface StateHistoryEntry {
  stepId: string;
  previousState: StepExecutionState;
  newState: StepExecutionState;
  timestamp: string;
  retryAttempt: number;
  message?: string;
}

export type StepActionHandler = (
  context: Record<string, any>,
  traceId: string
) => Promise<Record<string, any> | void>;

export type CompensatingRollbackHandler = (
  context: Record<string, any>,
  traceId: string
) => Promise<void>;

export interface WorkflowStepTask {
  stepId: string;
  stepName: string;
  dependencyStepIds: string[];
  executionState: StepExecutionState;
  currentRetryCount: number;
  maxRetryCeiling: number;
  action?: StepActionHandler;
  compensatingAction?: CompensatingRollbackHandler;
  baseBackoffMs?: number;
}

export interface TransactionDagContext {
  workflowInstanceId: string;
  activeContextRecord: Record<string, any>;
  stateHistoryLog: StateHistoryEntry[];
  completionStatus: WorkflowCompletionStatus;
  startedAt: string;
  completedAt?: string;
  traceId: string;
}

export interface WorkflowDagSupervisorOptions {
  defaultMaxRetries?: number;
  defaultBaseBackoffMs?: number;
  maxExecutionTimeoutMs?: number;
}

// ============================================================================
// CUSTOM EXCEPTION CLASSES
// ============================================================================

export class CyclicGraphException extends Error {
  public readonly code: string = 'DAG_CYCLIC_DEPENDENCY_DETECTED';
  public readonly conflictingCycleNodes: string[];

  constructor(message: string, cycleNodes: string[] = []) {
    super(message);
    this.name = 'CyclicGraphException';
    this.conflictingCycleNodes = cycleNodes;
    Object.setPrototypeOf(this, CyclicGraphException.prototype);
  }
}

export class WorkflowExecutionException extends Error {
  public readonly code: string = 'DAG_WORKFLOW_EXECUTION_FAILURE';
  public readonly failedStepId: string;
  public readonly rollbackStatus: 'SUCCEEDED' | 'PARTIAL' | 'FAILED';

  constructor(message: string, failedStepId: string, rollbackStatus: 'SUCCEEDED' | 'PARTIAL' | 'FAILED') {
    super(message);
    this.name = 'WorkflowExecutionException';
    this.failedStepId = failedStepId;
    this.rollbackStatus = rollbackStatus;
    Object.setPrototypeOf(this, WorkflowExecutionException.prototype);
  }
}

// ============================================================================
// WORKFLOW DAG SUPERVISOR ENGINE IMPLEMENTATION
// ============================================================================

export class WorkflowDagSupervisor {
  private readonly defaultMaxRetries: number;
  private readonly defaultBaseBackoffMs: number;
  private readonly maxExecutionTimeoutMs: number;

  constructor(options?: WorkflowDagSupervisorOptions) {
    this.defaultMaxRetries = options?.defaultMaxRetries ?? 3;
    this.defaultBaseBackoffMs = options?.defaultBaseBackoffMs ?? 200;
    this.maxExecutionTimeoutMs = options?.maxExecutionTimeoutMs ?? 60000;
  }

  /**
   * Generates or validates an active trace ID
   */
  private resolveTraceId(context: Record<string, any>): string {
    if (context && typeof context['x-trace-id'] === 'string' && context['x-trace-id'].trim()) {
      return context['x-trace-id'].trim();
    }
    return `trc_dag_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Pauses execution for exponential backoff calculations
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validates topological ordering and asserts graph contains zero cycles or deadlocks
   * Kahn's Algorithm / In-degree evaluation
   */
  public validateTopologicalGraph(stepsPool: WorkflowStepTask[]): void {
    const stepMap = new Map<string, WorkflowStepTask>();
    const inDegree = new Map<string, number>();
    const adjacencyList = new Map<string, string[]>();

    // 1. Initialize data structures and verify step ID uniqueness
    for (const step of stepsPool) {
      if (stepMap.has(step.stepId)) {
        throw new CyclicGraphException(
          `Duplicate stepId '${step.stepId}' detected in workflow task pool.`
        );
      }
      stepMap.set(step.stepId, step);
      inDegree.set(step.stepId, 0);
      adjacencyList.set(step.stepId, []);
    }

    // 2. Build dependency graph and count in-degrees
    for (const step of stepsPool) {
      const dependencies = step.dependencyStepIds || [];
      for (const depId of dependencies) {
        if (!stepMap.has(depId)) {
          throw new CyclicGraphException(
            `Unresolved dependency: Step '${step.stepId}' depends on non-existent step '${depId}'.`
          );
        }
        adjacencyList.get(depId)!.push(step.stepId);
        inDegree.set(step.stepId, (inDegree.get(step.stepId) || 0) + 1);
      }
    }

    // 3. Queue nodes with 0 incoming dependencies
    const queue: string[] = [];
    inDegree.forEach((degree, stepId) => {
      if (degree === 0) {
        queue.push(stepId);
      }
    });

    let visitedCount = 0;
    const visitedNodes: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      visitedCount++;
      visitedNodes.push(current);

      const neighbors = adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        const currentDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, currentDegree);
        if (currentDegree === 0) {
          queue.push(neighbor);
        }
      }
    }

    // 4. If visited count does not match total steps, a cycle/deadlock exists
    if (visitedCount !== stepsPool.length) {
      const cycleNodes: string[] = [];
      inDegree.forEach((degree, stepId) => {
        if (degree > 0) {
          cycleNodes.push(stepId);
        }
      });

      throw new CyclicGraphException(
        `Cyclic dependency detected: Graph contains circular deadlock loop involving steps [${cycleNodes.join(', ')}].`,
        cycleNodes
      );
    }
  }

  /**
   * Executes reverse compensating rollback routines across succeeded tasks
   */
  private async executeCompensatingRollbacks(
    succeededSteps: WorkflowStepTask[],
    dagContext: TransactionDagContext,
    traceId: string
  ): Promise<'SUCCEEDED' | 'PARTIAL' | 'FAILED'> {
    console.warn(
      JSON.stringify({
        level: 'WARN',
        event: 'DAG_ROLLBACK_INITIATED',
        'x-trace-id': traceId,
        instanceId: dagContext.workflowInstanceId,
        succeededStepCount: succeededSteps.length,
        timestamp: new Date().toISOString()
      })
    );

    let rollbackFailures = 0;
    // Execute rollback in reverse topological order
    const reverseOrder = [...succeededSteps].reverse();

    for (const step of reverseOrder) {
      if (step.compensatingAction) {
        try {
          console.info(
            JSON.stringify({
              level: 'INFO',
              event: 'EXECUTING_STEP_ROLLBACK',
              'x-trace-id': traceId,
              stepId: step.stepId,
              stepName: step.stepName,
              timestamp: new Date().toISOString()
            })
          );
          await step.compensatingAction(dagContext.activeContextRecord, traceId);
        } catch (rollbackErr: unknown) {
          rollbackFailures++;
          const errMessage = rollbackErr instanceof Error ? rollbackErr.message : String(rollbackErr);
          console.error(
            JSON.stringify({
              level: 'ERROR',
              event: 'STEP_ROLLBACK_FAILED',
              'x-trace-id': traceId,
              stepId: step.stepId,
              error: errMessage,
              timestamp: new Date().toISOString()
            })
          );
        }
      }
    }

    dagContext.completionStatus = 'ROLLED_BACK';

    if (rollbackFailures === 0) return 'SUCCEEDED';
    if (rollbackFailures < reverseOrder.length) return 'PARTIAL';
    return 'FAILED';
  }

  /**
   * Executes a single step task with automated exponential backoff retry loop
   */
  private async executeSingleStepWithRetry(
    step: WorkflowStepTask,
    dagContext: TransactionDagContext,
    traceId: string
  ): Promise<void> {
    const maxRetries = step.maxRetryCeiling ?? this.defaultMaxRetries;
    const baseBackoff = step.baseBackoffMs ?? this.defaultBaseBackoffMs;

    step.executionState = 'RUNNING';
    dagContext.stateHistoryLog.push({
      stepId: step.stepId,
      previousState: 'IDLE',
      newState: 'RUNNING',
      timestamp: new Date().toISOString(),
      retryAttempt: step.currentRetryCount
    });

    while (step.currentRetryCount <= maxRetries) {
      const startTime = performance.now();
      try {
        if (step.action) {
          const stepResult = await step.action(dagContext.activeContextRecord, traceId);
          if (stepResult && typeof stepResult === 'object') {
            // Safely merge emitted mutations into active context record
            Object.assign(dagContext.activeContextRecord, stepResult);
          }
        }

        const elapsedMs = (performance.now() - startTime).toFixed(2);
        step.executionState = 'SUCCEEDED';

        dagContext.stateHistoryLog.push({
          stepId: step.stepId,
          previousState: 'RUNNING',
          newState: 'SUCCEEDED',
          timestamp: new Date().toISOString(),
          retryAttempt: step.currentRetryCount,
          message: `Completed successfully in ${elapsedMs}ms`
        });

        console.info(
          JSON.stringify({
            level: 'INFO',
            event: 'DAG_STEP_SUCCEEDED',
            'x-trace-id': traceId,
            instanceId: dagContext.workflowInstanceId,
            stepId: step.stepId,
            stepName: step.stepName,
            retryCount: step.currentRetryCount,
            elapsedMs,
            timestamp: new Date().toISOString()
          })
        );

        return;
      } catch (stepErr: unknown) {
        const elapsedMs = (performance.now() - startTime).toFixed(2);
        step.currentRetryCount++;
        const errorMsg = stepErr instanceof Error ? stepErr.message : String(stepErr);

        console.warn(
          JSON.stringify({
            level: 'WARN',
            event: 'DAG_STEP_ATTEMPT_FAILED',
            'x-trace-id': traceId,
            instanceId: dagContext.workflowInstanceId,
            stepId: step.stepId,
            stepName: step.stepName,
            attempt: step.currentRetryCount,
            maxRetries,
            error: errorMsg,
            elapsedMs,
            timestamp: new Date().toISOString()
          })
        );

        if (step.currentRetryCount > maxRetries) {
          step.executionState = 'FAILED';
          dagContext.stateHistoryLog.push({
            stepId: step.stepId,
            previousState: 'RUNNING',
            newState: 'FAILED',
            timestamp: new Date().toISOString(),
            retryAttempt: step.currentRetryCount,
            message: `Breached max retries ceiling (${maxRetries}). Error: ${errorMsg}`
          });
          throw stepErr;
        }

        // Exponential backoff calculation with jitter: Base * 2^(attempt - 1) + jitter
        const backoffDelay = baseBackoff * Math.pow(2, step.currentRetryCount - 1) + Math.random() * 50;
        await this.delay(backoffDelay);
      }
    }
  }

  /**
   * Orchestrates full transaction DAG lifecycle with parallel execution branches & error isolation
   *
   * @param instanceId Unique execution correlation identifier
   * @param stepsPool Set of interdependent workflow step tasks
   * @param sharedContext Shared memory state record
   * @returns Final consolidated output context
   */
  public async executeTransactionDag(
    instanceId: string,
    stepsPool: WorkflowStepTask[],
    sharedContext: Record<string, any>
  ): Promise<Record<string, any>> {
    const startTime = performance.now();
    const traceId = this.resolveTraceId(sharedContext);
    const cleanInstanceId = instanceId?.trim() || `wf_${crypto.randomBytes(8).toString('hex')}`;

    if (!Array.isArray(stepsPool) || stepsPool.length === 0) {
      throw new Error('[WORKFLOW SUPERVISOR] Invalid argument: stepsPool must contain at least 1 task.');
    }

    // 1. Ingress Validation & Topological Cycle Check
    this.validateTopologicalGraph(stepsPool);

    const clonedTasks: WorkflowStepTask[] = stepsPool.map(task => ({
      ...task,
      executionState: 'IDLE',
      currentRetryCount: 0,
      dependencyStepIds: [...(task.dependencyStepIds || [])]
    }));

    const taskMap = new Map<string, WorkflowStepTask>();
    clonedTasks.forEach(task => taskMap.set(task.stepId, task));

    const dagContext: TransactionDagContext = {
      workflowInstanceId: cleanInstanceId,
      activeContextRecord: { ...sharedContext },
      stateHistoryLog: [],
      completionStatus: 'RUNNING',
      startedAt: new Date().toISOString(),
      traceId
    };

    console.info(
      JSON.stringify({
        level: 'INFO',
        event: 'TRANSACTION_DAG_STARTED',
        'x-trace-id': traceId,
        instanceId: cleanInstanceId,
        totalTasks: clonedTasks.length,
        timestamp: dagContext.startedAt
      })
    );

    const succeededTasks: WorkflowStepTask[] = [];
    const runningTasks = new Set<string>();

    try {
      while (succeededTasks.length < clonedTasks.length) {
        // Find tasks ready to execute (IDLE and all dependencies SUCCEEDED)
        const readyTasks = clonedTasks.filter(task => {
          if (task.executionState !== 'IDLE' || runningTasks.has(task.stepId)) {
            return false;
          }
          const allDepsSatisfied = task.dependencyStepIds.every(depId => {
            const depTask = taskMap.get(depId);
            return depTask && depTask.executionState === 'SUCCEEDED';
          });
          return allDepsSatisfied;
        });

        if (readyTasks.length === 0 && runningTasks.size === 0 && succeededTasks.length < clonedTasks.length) {
          throw new CyclicGraphException(
            `Deadlock encountered: No tasks ready to execute, but workflow is incomplete (${succeededTasks.length}/${clonedTasks.length} succeeded).`
          );
        }

        // Launch ready tasks concurrently in non-blocking event-loop promises
        const stepPromises = readyTasks.map(async task => {
          runningTasks.add(task.stepId);
          try {
            await this.executeSingleStepWithRetry(task, dagContext, traceId);
            succeededTasks.push(task);
          } finally {
            runningTasks.delete(task.stepId);
          }
        });

        // Wait for at least one batch progress event
        await Promise.all(stepPromises);
      }

      dagContext.completionStatus = 'COMPLETED';
      dagContext.completedAt = new Date().toISOString();
      const elapsedMs = (performance.now() - startTime).toFixed(2);

      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'TRANSACTION_DAG_COMPLETED',
          'x-trace-id': traceId,
          instanceId: cleanInstanceId,
          totalStepsExecuted: succeededTasks.length,
          elapsedMs,
          timestamp: dagContext.completedAt
        })
      );

      return dagContext.activeContextRecord;
    } catch (dagError: unknown) {
      const elapsedMs = (performance.now() - startTime).toFixed(2);
      dagContext.completionStatus = 'FAILED';
      dagContext.completedAt = new Date().toISOString();

      const failedTask = clonedTasks.find(t => t.executionState === 'FAILED');
      const failedStepId = failedTask?.stepId || 'UNKNOWN_STAGE';
      const errMsg = dagError instanceof Error ? dagError.message : String(dagError);

      console.error(
        JSON.stringify({
          level: 'ERROR',
          event: 'TRANSACTION_DAG_ABORTED',
          'x-trace-id': traceId,
          instanceId: cleanInstanceId,
          failedStepId,
          error: errMsg,
          elapsedMs,
          timestamp: dagContext.completedAt
        })
      );

      // Execute Compensating Rollback Routine
      const rollbackStatus = await this.executeCompensatingRollbacks(succeededTasks, dagContext, traceId);

      throw new WorkflowExecutionException(
        `Transaction DAG '${cleanInstanceId}' aborted at step '${failedStepId}': ${errMsg}`,
        failedStepId,
        rollbackStatus
      );
    }
  }
}
