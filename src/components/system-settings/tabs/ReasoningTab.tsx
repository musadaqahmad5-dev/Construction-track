import React from 'react';
import { motion } from 'motion/react';
import { Brain, Sliders, ChevronDown, ChevronRight, CheckCircle, Award } from 'lucide-react';
import { ExplanationReport, ExplainabilityMetrics } from '../../../engine';

interface ReasoningTabProps {
  xaiMetrics: ExplainabilityMetrics;
  xaiOccasion: string;
  setXaiOccasion: (val: string) => void;
  xaiWeather: string;
  setXaiWeather: (val: string) => void;
  xaiSeason: string;
  setXaiSeason: (val: string) => void;
  activeReport: ExplanationReport | null;
  setActiveReport: (val: ExplanationReport | null) => void;
  xaiArchive: ExplanationReport[];
  expandedNodes: Record<string, boolean>;
  toggleTreeNode: (nodeId: string) => void;
  compareReportId: string | null;
  setCompareReportId: (id: string | null) => void;
  generateXAIReport: () => void;
  handleXAISignal: (status: 'accepted' | 'rejected') => void;
}

export const ReasoningTab: React.FC<ReasoningTabProps> = ({
  xaiMetrics,
  xaiOccasion,
  setXaiOccasion,
  xaiWeather,
  setXaiWeather,
  xaiSeason,
  setXaiSeason,
  activeReport,
  setActiveReport,
  xaiArchive,
  expandedNodes,
  toggleTreeNode,
  compareReportId,
  setCompareReportId,
  generateXAIReport,
  handleXAISignal
}) => {
  const comparedReport = xaiArchive.find(r => r.id === compareReportId);

  const renderReasoningNode = (node: any) => {
    const isExpanded = !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="pl-4 border-l border-white/5 space-y-2 mt-1">
        <div 
          onClick={() => toggleTreeNode(node.id)}
          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
            hasChildren ? 'cursor-pointer hover:bg-white/[0.02]' : ''
          }`}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="w-3 h-3 text-indigo-400" /> : <ChevronRight className="w-3 h-3 text-zinc-500" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 ml-1 shrink-0" />
          )}

          <div className="flex-1 flex justify-between items-center flex-wrap gap-2 text-left">
            <div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase mr-2">[{node.type}]</span>
              <span className="text-[10.5px] font-sans text-zinc-200">{node.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {node.weight !== undefined && (
                <span className="text-[8px] font-mono text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded border border-indigo-500/5">
                  w:{node.weight.toFixed(2)}
                </span>
              )}
              {node.score !== undefined && (
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/5">
                  s:{Math.round(node.score)}
                </span>
              )}
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children.map((child: any) => renderReasoningNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      key="explainability"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left text-white"
    >
      {/* EXPLAINABILITY SUBTAB HEADER */}
      <div className="bg-gradient-to-br from-indigo-950/20 via-slate-900/10 to-black/50 border border-white/5 p-6 rounded-2xl space-y-4">
        <div className="flex flex-wrap gap-4 justify-between items-center pb-3 border-b border-white/5">
          <div className="space-y-1">
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400 animate-pulse" />
              Explainable AI (XAI) & Local Reasoning Trace Hub
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">
              Deterministic reasoning engine explaining styling choices, resolving multi-agent conflicts, and tracing logic flows in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase">Transparency Index:</span>
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
              {xaiMetrics.transparencyScore}%
            </span>
          </div>
        </div>

        {/* DYNAMIC REINFORCEMENT CONTROLLER */}
        <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-xl flex flex-wrap justify-between items-center gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-zinc-300">
              <span className="text-indigo-400 font-bold mr-2">REINFORCEMENT BACKPROPAGATION:</span>
              Train the local model by indicating if the AI's explanation aligns with your real-world expectations.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleXAISignal('accepted')}
              className="bg-indigo-500/10 border border-indigo-500/25 hover:bg-indigo-500/20 text-indigo-400 font-mono text-[9px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
            >
              [ Align Trace (+3% Accuracy) ]
            </button>
            <button
              onClick={() => handleXAISignal('rejected')}
              className="bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-400 font-mono text-[9px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
            >
              [ Re-calibrate (-5% Entropy) ]
            </button>
          </div>
        </div>
      </div>

      {/* LIVE EXPLAINABILITY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Transparency Score", value: `${xaiMetrics.transparencyScore}%`, desc: "System auditability factor", color: "text-indigo-400" },
          { label: "Explainability", value: `${xaiMetrics.explainabilityScore}%`, desc: "Trace semantic detail", color: "text-purple-400" },
          { label: "Reason Consistency", value: `${xaiMetrics.reasonConsistency}%`, desc: "Logic stability rate", color: "text-teal-400" },
          { label: "Conflict Resolution", value: `${xaiMetrics.conflictResolutionRate}%`, desc: "Arbiter bypass rate", color: "text-emerald-400" },
          { label: "Decision Stability", value: `${xaiMetrics.decisionStability}%`, desc: "Historical drift rate", color: "text-pink-400" },
          { label: "Confidence Accuracy", value: `${xaiMetrics.confidenceAccuracy}%`, desc: "Prediction fidelity score", color: "text-amber-400" }
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

      {/* DYNAMIC CONTEXT TEST PANEL */}
      <div className="bg-slate-950/40 border border-white/5 p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Trace Parameter Evaluator</h4>
            <p className="text-[9px] text-zinc-500 font-mono">Synthesize custom styling conditions to test deterministic engine explanations on-demand</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[8px] font-mono text-zinc-400 uppercase">Test Occasion</label>
            <select
              value={xaiOccasion}
              onChange={(e) => setXaiOccasion(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-indigo-500 focus:outline-none bg-slate-950"
            >
              {[
                "Premium Evening Wedding Gala", "Work & Office Duties", "General Daily Casual",
                "Weekend Outdoor Gallery Visit", "Aesthetic Travel & Airport Transit", "High Fashion Runway Gala",
                "Resort Beachside Lounge"
              ].map(o => (
                <option key={o} value={o} className="bg-slate-950">{o}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-mono text-zinc-400 uppercase">Test Weather Context</label>
            <select
              value={xaiWeather}
              onChange={(e) => setXaiWeather(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-indigo-500 focus:outline-none bg-slate-950"
            >
              {[
                "Cool Overcast", "Sunny Warm Sky", "Heavy Rain Winter Storm", "Mild Weather Cozy",
                "Sub-10°C Frost Breeze"
              ].map(w => (
                <option key={w} value={w} className="bg-slate-950">{w}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-mono text-zinc-400 uppercase">Test Season</label>
            <select
              value={xaiSeason}
              onChange={(e) => setXaiSeason(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-indigo-500 focus:outline-none bg-slate-950"
            >
              {["Spring", "Summer", "Autumn", "Winter"].map(s => (
                <option key={s} value={s} className="bg-slate-950">{s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={generateXAIReport}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-mono text-[9px] uppercase tracking-wider py-2.5 rounded-lg font-bold cursor-pointer transition-all"
          >
            [ Trace Reasoning Flow ]
          </button>
        </div>
      </div>

      {/* TWO-COLUMN RESULTS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVE TRACE REPORT DECISION TREE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Trace Reasoning Path Node Tree</h4>
              <span className="text-[8px] text-zinc-500 font-mono">Click folders to expand</span>
            </div>

            {activeReport ? (
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3 font-mono text-[10px]">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.03] text-[9px] text-zinc-400">
                  <span>REPORT ID: {activeReport.id}</span>
                  <span>COMPILED AT: {activeReport.timestamp}</span>
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex gap-2 items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-zinc-500 text-[8px] uppercase block">Selected Outfit Winner:</span>
                      <span className="text-zinc-200 font-bold text-xs">{activeReport.outfitName}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-indigo-500/5 rounded-lg border border-indigo-500/10 text-[9.5px] leading-relaxed text-indigo-200 font-sans italic">
                    "{activeReport.whySelected[0] || 'Optimized confidence styling match'}"
                  </div>

                  {/* RENDER THE TREE ROOT NODE */}
                  <div className="pt-2">
                    <span className="text-[8px] text-zinc-500 uppercase block tracking-wider mb-1">Decision Path Traces</span>
                    {activeReport.decisionTreeNodes && activeReport.decisionTreeNodes.length > 0 && renderReasoningNode(activeReport.decisionTreeNodes[0])}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-black/20 rounded-xl border border-dashed border-white/5 text-center space-y-2">
                <span className="text-xl">📊</span>
                <p className="text-xs text-zinc-400 font-mono">No tracing compiled in this buffer session.</p>
                <p className="text-[9px] text-zinc-500 font-mono">Trigger "Trace Reasoning Flow" to evaluate style decisions headlessly.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REASONING HISTORY & ARCHIVE COMPARISON */}
        <div className="space-y-6">
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold pb-2 border-b border-white/5">Tracing Archive Logs</h4>
            
            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {xaiArchive.map(report => (
                <div
                  key={report.id}
                  onClick={() => {
                    setActiveReport(report);
                    setCompareReportId(report.id === compareReportId ? null : report.id);
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    report.id === activeReport?.id 
                      ? 'bg-indigo-950/20 border-indigo-500/30' 
                      : 'bg-black/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500">
                    <span>{report.id}</span>
                    <span>{report.timestamp}</span>
                  </div>
                  <h5 className="text-[10px] font-mono font-bold text-white mt-1 truncate">{report.outfitName}</h5>
                  <p className="text-[9px] text-zinc-400 font-sans truncate mt-0.5">{report.whySelected[0] || 'Optimized styling choice'}</p>
                </div>
              ))}
            </div>
          </div>

          {comparedReport && (
            <div className="bg-slate-950/40 border border-teal-500/15 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-teal-400">
                <Award className="w-4 h-4" />
                <h4 className="text-xs font-mono font-bold uppercase">Archive Inspect Mode</h4>
              </div>

              <div className="space-y-2 font-mono text-[9px] text-left text-zinc-400">
                <div>
                  <span className="text-[8px] text-zinc-600 block uppercase">Context Occasion:</span>
                  <span className="text-zinc-300 font-bold">{comparedReport.context.occasion}</span>
                </div>
                <div>
                  <span className="text-[8px] text-zinc-600 block uppercase">Weather Mapped:</span>
                  <span className="text-zinc-300 font-bold">{comparedReport.context.weather}</span>
                </div>
                <div>
                  <span className="text-[8px] text-zinc-600 block uppercase">Winning Score:</span>
                  <span className="text-emerald-400 font-bold">{comparedReport.confidenceScore}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};
