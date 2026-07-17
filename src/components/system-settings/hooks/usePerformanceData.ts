import { useState } from 'react';
import { 
  EnterpriseResourceIntelligenceEngine, 
  ResourceOptimizationSuggestion, 
  PerformanceTimelineEvent 
} from '../../../engine';

export function usePerformanceData(wardrobeItems: any[], uId: string, setAgentLog: (msg: string) => void) {
  const [perfSuggestions, setPerfSuggestions] = useState<ResourceOptimizationSuggestion[]>(() =>
    EnterpriseResourceIntelligenceEngine.getOptimizationSuggestions()
  );

  const [perfTimeline, setPerfTimeline] = useState<PerformanceTimelineEvent[]>(() =>
    EnterpriseResourceIntelligenceEngine.getPerformanceTimeline()
  );

  const resourceMetrics = EnterpriseResourceIntelligenceEngine.getMetrics(uId, wardrobeItems);

  const togglePerformanceOption = (suggestionId: string) => {
    const updated = EnterpriseResourceIntelligenceEngine.toggleOptimization(suggestionId);
    setPerfSuggestions(updated);
    
    const optItem = updated.find(s => s.id === suggestionId);
    const eventTime = new Date().toTimeString().split(' ')[0];
    const newEvent: PerformanceTimelineEvent = {
      timestamp: eventTime,
      engine: optItem?.targetEngine || 'ResourceIntelligenceEngine',
      operation: `${optItem?.applied ? 'Enable' : 'Disable'} Optimization: ${optItem?.title}`,
      latencyMs: 14,
      status: optItem?.applied ? 'Optimized' : 'Nominal'
    };
    setPerfTimeline([newEvent, ...perfTimeline]);
    setAgentLog(`ResourceIntelligenceEngine: Optimization parameter "${optItem?.title}" was toggled.`);
  };

  return {
    perfSuggestions,
    perfTimeline,
    resourceMetrics,
    togglePerformanceOption
  };
}
