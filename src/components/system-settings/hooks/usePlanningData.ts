import { useState } from 'react';
import { EnterprisePlanningEngine, GoalType, PlanningHorizon } from '../../../engine';

export function usePlanningData(wardrobeItems: any[], uId: string, setAgentLog: (msg: string) => void) {
  const [plans, setPlans] = useState(() => EnterprisePlanningEngine.getActivePlans());
  const [planningMetrics, setPlanningMetrics] = useState(() => EnterprisePlanningEngine.getMetrics());
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>('plan-office-capsule');
  
  // Custom Plan inputs
  const [customTitle, setCustomTitle] = useState('My Winter Capsule Wardrobe');
  const [customGoalType, setCustomGoalType] = useState<GoalType>('Capsule Wardrobe');
  const [customHorizon, setCustomHorizon] = useState<PlanningHorizon>('This Month');
  const [customPriority, setCustomPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [customCost, setCustomCost] = useState(150);
  const [customTime, setCustomTime] = useState(6);

  const refreshPlanningState = () => {
    setPlans([...EnterprisePlanningEngine.getActivePlans()]);
    setPlanningMetrics(EnterprisePlanningEngine.getMetrics());
  };

  const handleCreatePlan = () => {
    const newPlan = EnterprisePlanningEngine.createPlan({
      goal: customGoalType,
      title: customTitle,
      horizon: customHorizon,
      priority: customPriority,
      estimatedCost: customCost,
      estimatedTimeHours: customTime,
      items: wardrobeItems
    });
    refreshPlanningState();
    setSelectedPlanId(newPlan.id);
    setAgentLog(`EnterprisePlanningEngine: Launched plan "${customTitle}" (ID: ${newPlan.id}).`);
  };

  const handleCompleteStep = (planId: string, stepIdx: number) => {
    const plan = EnterprisePlanningEngine.getActivePlans().find(p => p.id === planId);
    if (plan && plan.milestones[stepIdx]) {
      EnterprisePlanningEngine.toggleMilestone(planId, plan.milestones[stepIdx].id);
      refreshPlanningState();
      setAgentLog(`EnterprisePlanningEngine: Completed milestone step ${stepIdx + 1} on plan #${planId}.`);
    }
  };

  const handleDeletePlan = (planId: string) => {
    EnterprisePlanningEngine.deletePlan(planId);
    refreshPlanningState();
    if (selectedPlanId === planId) setSelectedPlanId(null);
    setAgentLog(`EnterprisePlanningEngine: Aborted strategic capsule plan: ${planId}.`);
  };

  const handleAutoReplan = () => {
    EnterprisePlanningEngine.autoReplan();
    refreshPlanningState();
    setAgentLog("EnterprisePlanningEngine: Replanned active strategies. Discovered seasonal anomalies. Optimal adjustments applied.");
  };

  return {
    plans,
    planningMetrics,
    selectedPlanId,
    setSelectedPlanId,
    customTitle,
    setCustomTitle,
    customGoalType,
    setCustomGoalType,
    customHorizon,
    setCustomHorizon,
    customPriority,
    setCustomPriority,
    customCost,
    setCustomCost,
    customTime,
    setCustomTime,
    handleCreatePlan,
    handleCompleteStep,
    handleDeletePlan,
    handleAutoReplan
  };
}
