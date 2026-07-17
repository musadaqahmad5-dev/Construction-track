import { useState } from 'react';
import { 
  EnterpriseReasoningEngine, 
  DecisionIntelligenceEngine, 
  ExplanationReport, 
  ExplainabilityMetrics 
} from '../../../engine';

export function useReasoningData(wardrobeItems: any[], uId: string, setAgentLog: (msg: string) => void) {
  const [xaiOccasion, setXaiOccasion] = useState("Premium Evening Wedding Gala");
  const [xaiWeather, setXaiWeather] = useState("Cool Overcast");
  const [xaiSeason, setXaiSeason] = useState("Autumn");
  const [activeReport, setActiveReport] = useState<ExplanationReport | null>(null);
  const [xaiArchive, setXaiArchive] = useState<ExplanationReport[]>(() => EnterpriseReasoningEngine.getArchive());
  const [xaiMetrics, setXaiMetrics] = useState<ExplainabilityMetrics>(() => EnterpriseReasoningEngine.getExplainabilityMetrics());
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'node-root': true,
    'node-weather': true,
    'node-occasion': true,
    'node-dna': true,
    'node-kg': true,
    'node-memory': true,
    'node-ranking': true
  });
  const [compareReportId, setCompareReportId] = useState<string | null>(null);

  const generateXAIReport = () => {
    const winner = DecisionIntelligenceEngine.evaluateAndSelectBest(wardrobeItems, {
      userId: uId,
      weather: xaiWeather,
      occasion: xaiOccasion,
      season: xaiSeason
    });

    const report = EnterpriseReasoningEngine.generateReasoningReport(winner, {
      userId: uId,
      weather: xaiWeather,
      occasion: xaiOccasion,
      season: xaiSeason
    }, wardrobeItems);

    setActiveReport(report);
    setXaiArchive(EnterpriseReasoningEngine.getArchive());
    setXaiMetrics(EnterpriseReasoningEngine.getExplainabilityMetrics());
    setAgentLog(`Explainable AI: Reasoning trace compiled successfully for "${winner.name}".`);
  };

  const handleXAISignal = (status: 'accepted' | 'rejected') => {
    EnterpriseReasoningEngine.optimizeMetrics(status);
    setXaiMetrics(EnterpriseReasoningEngine.getExplainabilityMetrics());
    setAgentLog(`XAI reinforcement completed. Model weights dynamically calibrated.`);
  };

  const toggleTreeNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  return {
    xaiOccasion,
    setXaiOccasion,
    xaiWeather,
    setXaiWeather,
    xaiSeason,
    setXaiSeason,
    activeReport,
    setActiveReport,
    xaiArchive,
    xaiMetrics,
    expandedNodes,
    toggleTreeNode,
    compareReportId,
    setCompareReportId,
    generateXAIReport,
    handleXAISignal
  };
}
