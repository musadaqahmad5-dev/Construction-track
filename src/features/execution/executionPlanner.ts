import { WardrobeItem } from '../../types';
import { WearPlanGenerator, CoordinatedWearPlan } from './wearPlanGenerator';
import { PackingAssistant, PackingListResult } from './packingAssistant';
import { Workflow } from './executionState';

export interface FinalExecutionBlueprint {
  blueprintId: string;
  wearPlan: CoordinatedWearPlan;
  packingChecklist: PackingListResult;
  eventStatus: 'locked_ready' | 'planning_draft';
}

export class ExecutionPlanner {
  /**
   * Constructs a Workflow execution plan for TaskCoordinator tracking.
   */
  static createPlan(params: {
    name: string;
    intensityLevel: 'standard' | 'high-fidelity' | 'low-latency';
    context: string;
    styleDNA: any;
    expectedPayload: any;
  }): Workflow {
    const id = `wf-${Date.now()}`;
    const stages: ('input' | 'analyze' | 'rank' | 'render' | 'explain' | 'publish' | 'persist')[] = [
      'input',
      'analyze',
      'rank',
      'render',
      'explain',
      'publish',
      'persist'
    ];
    return {
      id,
      name: params.name,
      status: 'pending' as const,
      currentStageIndex: 0,
      overallQualityScore: 0,
      createdAt: new Date().toISOString(),
      totalDurationMs: 0,
      inputPayload: {
        intensityLevel: params.intensityLevel,
        context: params.context,
        styleDNA: params.styleDNA,
        ...params.expectedPayload
      },
      steps: stages.map(stage => ({
        stage,
        status: 'pending' as const,
        durationMs: 0,
        qualityScore: 0,
        recoverable: true,
        retryCount: 0
      }))
    };
  }

  /**
   * Translates a collection of garments into a complete executable style calendar and suitcase schedule.
   */
  static compileBlueprint(
    allItems: WardrobeItem[],
    targetDays: number,
    agendas: string[]
  ): FinalExecutionBlueprint {
    const blueprintId = `blue_exec_${Date.now()}`;
    
    // 1. Generate weekly/trip plan schedules
    const wearPlan = WearPlanGenerator.constructPlan(allItems, targetDays, agendas);

    // 2. Map coordinates list to packing requirements
    const matchedGarments = wearPlan.schedules.flatMap(s => s.suggestedItems);
    
    // Remove duplication by ID
    const uniqueGarments: WardrobeItem[] = [];
    const idSet = new Set<string>();
    matchedGarments.forEach(item => {
      if (!idSet.has(item.id)) {
        idSet.add(item.id);
        uniqueGarments.push(item);
      }
    });

    const packingChecklist = PackingAssistant.compileChecklist(uniqueGarments);

    return {
      blueprintId,
      wearPlan,
      packingChecklist,
      eventStatus: uniqueGarments.length > 0 ? 'locked_ready' : 'planning_draft'
    };
  }
}
