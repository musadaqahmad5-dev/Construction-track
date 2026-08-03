/**
 * ARIA v2.5 Simulation Dashboard
 * Product: LOOK VISION v2.4
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, RefreshCw, Cpu, AlertCircle } from 'lucide-react';
import { simulationEngine } from '../../aria/simulation/SimulationEngine';
import {
  SimulationReport,
  SimulationScenarioType,
  SimulationEngineStatus
} from '../../aria/simulation/SimulationTypes';
import { ScenarioBuilderPanel } from './ScenarioBuilderPanel';
import { SimulationReportCard } from './SimulationReportCard';
import { OutcomeComparisonPanel } from './OutcomeComparisonPanel';
import { SimulationTimeline } from './SimulationTimeline';

interface SimulationDashboardProps {
  userId?: string;
}

export const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ userId = 'guest_user' }) => {
  const [currentReport, setCurrentReport] = useState<SimulationReport | null>(null);
  const [history, setHistory] = useState<SimulationReport[]>([]);
  const [status, setStatus] = useState<SimulationEngineStatus>(simulationEngine.getStatus());
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      await simulationEngine.initialize(userId);
      const hist = simulationEngine.getHistory(userId);
      setHistory(hist);
      const latest = simulationEngine.getCurrentReport();
      setCurrentReport(latest || (hist.length > 0 ? hist[0] : null));
      setStatus(simulationEngine.getStatus());
    } catch (err: any) {
      console.error('[SimulationDashboard] Load error:', err);
      setErrorMsg(err.message || 'Failed to initialize simulation data.');
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleRunSimulation = async (
    type: SimulationScenarioType,
    params: Record<string, any>,
    customTitle?: string,
    customDesc?: string
  ) => {
    setIsSimulating(true);
    setErrorMsg(null);
    try {
      const report = await simulationEngine.runSimulation(userId, type, params, customTitle, customDesc);
      setCurrentReport(report);
      const updatedHist = simulationEngine.getHistory(userId);
      setHistory(updatedHist);
      setStatus(simulationEngine.getStatus());
    } catch (err: any) {
      console.error('[SimulationDashboard] Run simulation error:', err);
      setErrorMsg(err.message || 'Failed to execute fashion simulation.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in max-w-7xl mx-auto">
      {/* Top Banner Control Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#05050a] via-[#0b0c16] to-[#05050a] border border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-900/60 to-purple-900/40 border border-amber-500/30 text-amber-300 shadow-lg">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-white tracking-wide">
                ARIA Fashion Simulation Engine
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                Phase 9 Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Simulate fashion outcomes, wardrobe transitions, budget shopping, and style evolution scenarios.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
            Total Runs: {status.totalSimulationsRun}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Scenario Builder Input */}
      <ScenarioBuilderPanel
        onRunSimulation={handleRunSimulation}
        isSimulating={isSimulating}
      />

      {/* Simulation Report Result */}
      {currentReport && (
        <div className="space-y-6">
          <SimulationReportCard report={currentReport} />
          <OutcomeComparisonPanel alternatives={currentReport.alternativeOutcomes} />
        </div>
      )}

      {/* Simulation History Timeline */}
      {history.length > 0 && (
        <SimulationTimeline
          history={history}
          onSelectReport={(report) => setCurrentReport(report)}
        />
      )}
    </div>
  );
};
