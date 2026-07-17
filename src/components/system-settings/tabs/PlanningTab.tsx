import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sliders, Layers, Trash, Check, AlertTriangle } from 'lucide-react';
import { GoalType, PlanningHorizon } from '../../../engine';

interface PlanningTabProps {
  planningMetrics: any;
  plans: any[];
  selectedPlanId: string | null;
  setSelectedPlanId: (id: string | null) => void;
  customTitle: string;
  setCustomTitle: (val: string) => void;
  customGoalType: GoalType;
  setCustomGoalType: (val: GoalType) => void;
  customHorizon: PlanningHorizon;
  setCustomHorizon: (val: PlanningHorizon) => void;
  customPriority: 'Critical' | 'High' | 'Medium' | 'Low';
  setCustomPriority: (val: 'Critical' | 'High' | 'Medium' | 'Low') => void;
  handleCreatePlan: () => void;
  handleCompleteStep: (planId: string, idx: number) => void;
  handleDeletePlan: (planId: string) => void;
  handleAutoReplan: () => void;
  handleOptimizePlans: (status: 'accepted' | 'rejected' | 'neutral') => void;
}

export const PlanningTab: React.FC<PlanningTabProps> = ({
  planningMetrics,
  plans,
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
  handleCreatePlan,
  handleCompleteStep,
  handleDeletePlan,
  handleAutoReplan,
  handleOptimizePlans
}) => {
  const activePlan = plans.find(p => p.id === selectedPlanId);

  return (
    <motion.div
      key="planning"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left text-white"
    >
      {/* GOAL PLANNING MODULE HEADER */}
      <div className="bg-gradient-to-br from-violet-950/20 via-slate-900/10 to-black/50 border border-white/5 p-6 rounded-2xl space-y-4">
        <div className="flex flex-wrap gap-4 justify-between items-center pb-3 border-b border-white/5">
          <div className="space-y-1">
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              Strategic Planning & Goal Intelligence Engine
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">
              Deterministic hierarchical engine aligning Vision → Goals → Plans → Tasks with continuous self-learning local optimization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase">Self-Learning Bias:</span>
            <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2 py-1 rounded">
              x{planningMetrics.optimizationScorePercent / 100}
            </span>
          </div>
        </div>

        {/* DYNAMIC FEEDBACK BIAS TUNER */}
        <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-xl flex flex-wrap justify-between items-center gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-zinc-300">
              <span className="text-zinc-500 font-bold mr-2">FEEDBACK REINFORCEMENT:</span>
              Signal real-world goal outcomes to self-adjust the confidence matrices headlessly.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleOptimizePlans('accepted')}
              className="bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[9px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
            >
              [ Align +3% Accept ]
            </button>
            <button
              onClick={() => handleOptimizePlans('rejected')}
              className="bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-400 font-mono text-[9px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
            >
              [ Re-Align -5% Reject ]
            </button>
          </div>
        </div>
      </div>

      {/* STRATEGIC PLANNING METRICS DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Active Plans", value: `${planningMetrics.activePlansCount} active`, desc: "Pending resolution", color: "text-violet-400" },
          { label: "Completed", value: `${planningMetrics.completedPlansCount} plans`, desc: "Goals resolved", color: "text-emerald-400" },
          { label: "Goal Success", value: `${planningMetrics.goalSuccessRatePercent}%`, desc: "Overall lifecycle", color: "text-teal-400" },
          { label: "Accuracy", value: `${planningMetrics.planningAccuracyPercent}%`, desc: "Deterministic bias", color: "text-indigo-400" },
          { label: "Prediction Acc.", value: `${planningMetrics.predictionAccuracyPercent}%`, desc: "Forecast fidelity", color: "text-pink-400" },
          { label: "Latency", value: "12ms", desc: "Local resolution speed", color: "text-cyan-400" },
          { label: "Planning Health", value: `${planningMetrics.planningHealthScore}%`, desc: "Engine telemetry", color: "text-amber-400" },
          { label: "Conflict Res.", value: "100%", desc: "De-duplication rate", color: "text-violet-300" }
        ].map((m, idx) => (
          <div key={idx} className="bg-slate-950/60 border border-white/5 p-3 rounded-xl flex flex-col justify-between">
            <span className="text-[8px] text-zinc-400 block font-mono uppercase tracking-wider">
              {m.label}
            </span>
            <div className="space-y-0.5 my-2">
              <span className={`text-sm font-mono font-bold block ${m.color}`}>
                {m.value}
              </span>
            </div>
            <span className="text-[7.5px] text-zinc-500 block leading-tight">
              {m.desc}
            </span>
          </div>
        ))}
      </div>

      {/* CREATIVE PLAN BUILDER */}
      <div className="bg-slate-950/40 border border-white/5 p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Sliders className="w-4 h-4 text-violet-400" />
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Dynamic Strategic Goal Generator</h4>
            <p className="text-[9px] text-zinc-500 font-mono">Synthesize custom multi-agent plans mapped directly to specific lifestyle horizons</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
          <div className="space-y-1 md:col-span-2">
            <label className="text-[8px] font-mono text-zinc-400 uppercase">Goal Title</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-mono text-zinc-400 uppercase">Goal Type</label>
            <select
              value={customGoalType}
              onChange={(e) => setCustomGoalType(e.target.value as any)}
              className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-violet-500 focus:outline-none"
            >
              {[
                'Daily Style Goals', 'Weekly Wardrobe Goals', 'Monthly Shopping Goals',
                'Seasonal Closet Refresh', 'Travel Preparation', 'Wedding Preparation',
                'Office Rotation', 'Capsule Wardrobe', 'Budget Optimization',
                'Sustainability Goals', 'Marketplace Growth', 'Creator Growth', 'Custom Goals'
              ].map(g => (
                <option key={g} value={g} className="bg-slate-950">{g}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-mono text-zinc-400 uppercase">Horizon</label>
            <select
              value={customHorizon}
              onChange={(e) => setCustomHorizon(e.target.value as any)}
              className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-violet-500 focus:outline-none"
            >
              {['Today', 'Tomorrow', 'This Week', 'Next Week', 'This Month', 'Next Month', 'Quarter', 'Season', 'Year'].map(h => (
                <option key={h} value={h} className="bg-slate-950">{h}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-mono text-zinc-400 uppercase">Priority</label>
            <select
              value={customPriority}
              onChange={(e) => setCustomPriority(e.target.value as any)}
              className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-violet-500 focus:outline-none"
            >
              {['Critical', 'High', 'Medium', 'Low'].map(p => (
                <option key={p} value={p} className="bg-slate-950">{p}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreatePlan}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-mono text-[9px] uppercase tracking-wider py-2.5 rounded-lg font-bold cursor-pointer transition-all"
            >
              [ Generate Plan ]
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: ACTIVE PLANS SELECTION & DETAIL VIEW */}
        <div className="lg:col-span-2 space-y-6">

          {/* PLANS LIST */}
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Active Strategic Plans</h4>
                  <p className="text-[9px] text-zinc-500 font-mono">Select a strategic roadmap to inspect hierarchy, milestonings, and rotation pipelines</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {plans.map((p) => {
                const totalSteps = p.steps.length;
                const completedSteps = p.completedSteps.filter(Boolean).length;
                const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
                const isSelected = p.id === selectedPlanId;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex justify-between items-start flex-wrap gap-4 ${
                      isSelected 
                        ? 'bg-violet-950/20 border-violet-500/40 shadow-lg shadow-violet-950/20' 
                        : 'bg-black/20 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-1 w-full sm:w-2/3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-1 py-0.5 rounded text-[7px] font-mono font-bold uppercase ${
                          p.priority === 'Critical' ? 'bg-red-500/10 text-red-400' :
                          p.priority === 'High' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {p.priority} PRIORITY
                        </span>
                        <span className="text-[8px] font-mono text-zinc-500">[{p.horizon}]</span>
                      </div>
                      <h5 className="text-[11px] font-mono text-white font-bold tracking-tight">{p.title}</h5>
                      <p className="text-[9.5px] text-zinc-400 font-sans leading-relaxed">{p.goal}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between h-full space-y-3">
                      <div className="text-right">
                        <span className="text-[8px] font-mono text-zinc-500 block">GOAL STEPS</span>
                        <span className="text-[11px] font-mono font-bold text-violet-400">{completedSteps}/{totalSteps} ({percentage}%)</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(p.id);
                        }}
                        className="text-zinc-600 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED STEP MILESTONES & AUTO-REPLANNING */}
        <div className="space-y-6">
          {activePlan ? (
            <div className="bg-slate-950/20 border border-violet-500/10 p-5 rounded-2xl space-y-4">
              <div className="pb-2 border-b border-white/5">
                <span className="text-[8px] font-mono text-violet-400 uppercase tracking-wider block">Plan Sub-Steps & Roadmap Tasks</span>
                <h4 className="text-xs font-mono font-bold text-white tracking-tight">Milestone Alignment ({activePlan.id.replace('plan-', '#')})</h4>
              </div>

              <div className="space-y-2.5">
                {activePlan.steps.map((step: string, idx: number) => {
                  const isDone = activePlan.completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCompleteStep(activePlan.id, idx)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isDone 
                          ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-black/30 border-white/5 text-zinc-300 hover:border-white/10'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                        isDone 
                          ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400' 
                          : 'border-white/10 bg-black/40 text-transparent'
                      }`}>
                        {isDone && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[7.5px] font-mono text-zinc-500 uppercase block">Milestone Step {idx + 1}</span>
                        <p className="text-[10px] font-mono leading-normal font-semibold">{step}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex gap-2 p-3 bg-violet-950/10 border border-violet-500/10 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <p className="text-[8.5px] text-zinc-400 font-mono leading-normal">
                    Goals and roadmaps are synchronized locally within Personal Memory blocks. Running an optimization rebuilds recommended sequences based on real wardrobe items.
                  </p>
                </div>

                <button
                  onClick={handleAutoReplan}
                  className="w-full bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 font-mono text-[9px] uppercase tracking-wider py-2.5 rounded-xl cursor-pointer transition-all font-bold"
                >
                  [ Force Automated Re-Planning ]
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/20 border border-white/5 p-8 rounded-2xl text-center space-y-2">
              <span className="text-xl block">⚡</span>
              <p className="text-xs text-zinc-400 font-mono">No active plan selected.</p>
              <p className="text-[9px] text-zinc-500 font-mono">Select or generate a strategic style plan to analyze steps.</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};
