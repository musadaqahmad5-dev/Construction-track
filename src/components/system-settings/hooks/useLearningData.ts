import { useState } from 'react';
import { 
  EnterpriseLearningEngine, 
  LearningCycleReport, 
  PreferenceEvolutionPoint, 
  HabitMetrics, 
  EvolutionTimelineEvent 
} from '../../../engine';

export function useLearningData(wardrobeItems: any[], uId: string, setAgentLog: (msg: string) => void) {
  const [learningProfile, setLearningProfile] = useState<LearningCycleReport>(() => {
    return EnterpriseLearningEngine.getLearningProfile(uId, wardrobeItems);
  });
  const [learningHistory, setLearningHistory] = useState<LearningCycleReport[]>(() => {
    return EnterpriseLearningEngine.getHistoryArchive();
  });
  const [compareLearningId, setCompareLearningId] = useState<string | null>(null);
  const [preferenceEvolution, setPreferenceEvolution] = useState<PreferenceEvolutionPoint[]>(() => {
    return EnterpriseLearningEngine.getPreferenceEvolution();
  });
  const [habitMetrics, setHabitMetrics] = useState<HabitMetrics>(() => {
    return EnterpriseLearningEngine.getHabitMetrics();
  });
  const [evolutionTimeline, setEvolutionTimeline] = useState<EvolutionTimelineEvent[]>(() => {
    return EnterpriseLearningEngine.getStyleEvolutionTimeline();
  });

  const triggerProfileEvolution = (action: 'accepted' | 'rejected' | 'ignored') => {
    const updated = EnterpriseLearningEngine.processInteractionFeedback(uId, action, wardrobeItems);
    setLearningProfile(updated);
    setLearningHistory(EnterpriseLearningEngine.getHistoryArchive());
    setAgentLog(`Learning Engine: Cycle compiled for interaction "${action.toUpperCase()}". Intelligence score optimized.`);
  };

  return {
    learningProfile,
    learningHistory,
    compareLearningId,
    setCompareLearningId,
    preferenceEvolution,
    habitMetrics,
    evolutionTimeline,
    triggerProfileEvolution
  };
}
