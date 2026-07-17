import React from 'react';
import { motion } from 'motion/react';
import { Award, Layers, Sparkles, Activity, Clock } from 'lucide-react';
import { LearningCycleReport, PreferenceEvolutionPoint, HabitMetrics, EvolutionTimelineEvent } from '../../../engine';

interface LearningTabProps {
  learningProfile: LearningCycleReport;
  learningHistory: LearningCycleReport[];
  compareLearningId: string | null;
  setCompareLearningId: (id: string | null) => void;
  preferenceEvolution: PreferenceEvolutionPoint[];
  habitMetrics: HabitMetrics;
  evolutionTimeline: EvolutionTimelineEvent[];
  triggerProfileEvolution: (action: 'accepted' | 'rejected' | 'ignored') => void;
}

export const LearningTab: React.FC<LearningTabProps> = ({
  learningProfile,
  learningHistory,
  compareLearningId,
  setCompareLearningId,
  preferenceEvolution,
  habitMetrics,
  evolutionTimeline,
  triggerProfileEvolution
}) => {
  const comparedHistoryItem = learningHistory.find(h => h.cycleId === compareLearningId);

  return (
    <motion.div
      key="learning"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left"
    >
      {/* INTERACTIVE CONTROLS HEADER */}
      <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-widest">
              Continuous Adaptation Engine Active
            </span>
          </div>
          <h3 className="text-xl font-serif font-light text-white tracking-tight">
            Learning & Intelligence Evolution
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Analyze dynamic style drift indices, calibrate multidimensional preference vectors, and review automatic weighting optimizations compiled locally from user interactions.
          </p>
        </div>

        {/* Live Training Stimulator */}
        <div className="bg-black/50 p-4 rounded-2xl border border-white/10 space-y-3.5 w-full lg:w-auto min-w-[320px]">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Feed Training Signal</span>
            <span className="text-[8px] font-mono text-violet-400 font-bold">EPOCH_ITERATION_LATEST</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => triggerProfileEvolution('accepted')}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-white font-mono text-[9.5px] uppercase tracking-wider py-2 px-3 rounded-lg border border-emerald-500/20 transition-all cursor-pointer font-bold"
            >
              [ Accept ]
            </button>
            <button
              onClick={() => triggerProfileEvolution('rejected')}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-white font-mono text-[9.5px] uppercase tracking-wider py-2 px-3 rounded-lg border border-rose-500/20 transition-all cursor-pointer font-bold"
            >
              [ Reject ]
            </button>
            <button
              onClick={() => triggerProfileEvolution('ignored')}
              className="bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 hover:text-white font-mono text-[9.5px] uppercase tracking-wider py-2 px-3 rounded-lg border border-white/10 transition-all cursor-pointer font-bold"
            >
              [ Ignore ]
            </button>
          </div>
          <p className="text-[8px] font-mono text-center text-zinc-500 italic">
            Simulate recommendation reactions to trigger dynamic, automated local backpropagation.
          </p>
        </div>
      </div>

      {/* LIVE INTELLIGENCE GROWTH METRICS (FEATURE 9) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Intelligence Score', val: learningProfile.metrics.intelligenceScore, color: 'from-violet-500 to-indigo-500', desc: 'Weighted diagnostic capability index' },
          { label: 'Learning Score', val: learningProfile.metrics.learningScore, color: 'from-fuchsia-500 to-purple-500', desc: 'Responsiveness to style feedback' },
          { label: 'Adaptation Index', val: learningProfile.metrics.adaptationScore, color: 'from-pink-500 to-rose-500', desc: 'Climatic and behavioral tuning compliance' },
          { label: 'Memory Quality', val: learningProfile.metrics.memoryQuality, color: 'from-blue-500 to-cyan-500', desc: 'Fidelity of past outfit records saved' },
          { label: 'Prediction Score', val: learningProfile.metrics.predictionQuality, color: 'from-emerald-500 to-teal-500', desc: 'Mathematical forecast success rate' },
        ].map((m, idx) => (
          <div key={idx} className="bg-slate-950/25 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-3.5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-all duration-500" />
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">{m.label}</span>
              <span className="text-2xl font-mono text-white font-bold leading-none">
                {m.val.toFixed(1)}%
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${m.color} transition-all duration-700`}
                  style={{ width: `${m.val}%` }}
                />
              </div>
              <span className="text-[7.5px] font-mono text-zinc-400 block line-clamp-1">{m.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SECONDARY ROW DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feature 6: Learning Confidence Vectors */}
        <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-400" />
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Confidence Calibration Suite
                </h4>
                <p className="text-[8px] text-zinc-500 font-mono">Multidimensional statistical certainty parameters</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded font-bold border border-violet-500/20">
              {learningProfile.metrics.experienceLevel}
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Learning Confidence', value: 94.2, desc: 'Overall mathematical parameter certainty index' },
              { label: 'Prediction Accuracy', value: learningProfile.metrics.predictionQuality, desc: 'Verification of past forecast alignments' },
              { label: 'Learning Stability', value: 91.5, desc: 'Dampening coefficient avoiding wild weight oscillations' },
              { label: 'Preference Stability', value: 87.1, desc: 'Temporal coherence of brand & color matrices' },
              { label: 'Behavioral Stability', value: 89.4, desc: 'Uniformity of wardrobe checkout and dress habits' },
              { label: 'Knowledge Growth Rate', value: learningProfile.metrics.evolutionRate, desc: 'Accumulation velocity of fashion semantic nodes' },
              { label: 'Confidence Calibration', value: 95.8, desc: 'Dissonance reduction with explainable decision bounds' }
            ].map((conf, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-zinc-300">{conf.label}</span>
                  <strong className="text-violet-400">{conf.value.toFixed(1)}%</strong>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-violet-500 h-full" style={{ width: `${conf.value}%` }} />
                </div>
                <p className="text-[7.5px] text-zinc-500 font-sans tracking-tight block leading-tight">{conf.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 7: Style Drift Vectors */}
        <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Activity className="w-4 h-4 text-violet-400" />
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Dynamic Style Drift Analyzer
              </h4>
              <p className="text-[8px] text-zinc-500 font-mono">Real-time preference gradient direction vectors</p>
            </div>
          </div>

          <div className="space-y-3">
            {learningProfile.styleDriftVectors.map((drift, i) => (
              <div key={i} className="bg-black/30 p-3 rounded-xl border border-white/[0.03] space-y-2">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-[10px] font-mono text-zinc-200 font-bold">{drift.category}</span>
                  <span className={`text-[8.5px] font-mono px-1 rounded uppercase font-bold ${
                    drift.driftDirection === 'UP' ? 'bg-emerald-500/10 text-emerald-400' :
                    drift.driftDirection === 'DOWN' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    {drift.driftDirection} ({drift.driftValue > 0 ? `+${drift.driftValue}` : drift.driftValue}%)
                  </span>
                </div>
                <p className="text-[9px] text-zinc-400 font-sans leading-relaxed">{drift.explanation}</p>
                <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 border-t border-white/[0.03] pt-1.5">
                  <span>STABILITY INDEX: {drift.stability}%</span>
                  <span>VELOCITY: {drift.velocity}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 8: Behavioral Habits & Preferences */}
        <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Clock className="w-4 h-4 text-violet-400" />
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Temporal Habit Correlation
              </h4>
              <p className="text-[8px] text-zinc-500 font-mono">Co-occurrence tracking and usage matrices</p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-[9px]">
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
              <span className="text-zinc-500 text-[8px] uppercase">Peak Activity Slot:</span>
              <div className="flex justify-between items-center text-zinc-200">
                <span>{habitMetrics.peakUsageHour}:00 - {habitMetrics.peakUsageHour + 1}:00</span>
                <span className="text-violet-400 font-bold">{habitMetrics.peakUsageRatio}% density</span>
              </div>
            </div>

            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
              <span className="text-zinc-500 text-[8px] uppercase">Daily Consistency Ratios:</span>
              <div className="space-y-1">
                {Object.entries(habitMetrics.dailyCoefficients).map(([day, val]) => (
                  <div key={day} className="flex justify-between items-center text-zinc-300">
                    <span className="capitalize">{day}:</span>
                    <span>{(val as number * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
              <span className="text-zinc-500 text-[8px] uppercase">Action Habit Sequences:</span>
              <p className="text-zinc-400 font-sans leading-normal text-[9.5px]">
                High-frequency paths: <span className="text-violet-300 font-semibold">{habitMetrics.commonPathSeq.join(' → ')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HISTORIC EVOLUTION MAPS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold pb-2 border-b border-white/5">
            Preference Drift Chart & Weight Alignments
          </h4>

          <div className="h-52 bg-black/40 rounded-2xl border border-white/5 p-4 relative flex items-end justify-between gap-1">
            {preferenceEvolution.map((pt, i) => {
              const score = (i === 0 ? 72 : i === 1 ? 84 : i === 2 ? 89 : 94);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[7.5px] font-mono text-zinc-500 scale-90 opacity-0 group-hover:opacity-100 transition-opacity">
                    {score}%
                  </span>
                  <div className="w-full bg-white/5 rounded-t-sm relative overflow-hidden" style={{ height: `${score}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 to-violet-500" />
                  </div>
                  <span className="text-[7.5px] font-mono text-zinc-400 uppercase rotate-45 origin-left truncate mt-1">
                    {pt.period}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature 10: Style Evolution Timeline */}
        <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold pb-2 border-b border-white/5">
            Neural Style Evolution Trace
          </h4>

          <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
            {evolutionTimeline.map((item, index) => {
              const isCurrent = index === evolutionTimeline.length - 1;
              return (
                <div 
                  key={index} 
                  className={`p-2.5 rounded-lg border text-left font-mono text-[9px] ${
                    isCurrent ? 'bg-violet-900/10 border-violet-500/25' : 'bg-black/20 border-white/[0.03]'
                  }`}
                >
                  <div className="flex justify-between text-zinc-500 text-[8px]">
                    <span>{item.period}</span>
                    <span className="text-violet-400 uppercase font-bold">{item.dominantStyle}</span>
                  </div>
                  <p className="text-zinc-300 mt-1 font-sans leading-normal text-[9.5px]">{item.coreAestheticSummary}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ARCHIVE AND PROFILE METRICS */}
      <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Layers className="w-4 h-4 text-violet-400" />
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Archived Brain State Dumps (Epoch Cycles)
            </h4>
            <p className="text-[8px] text-zinc-500 font-mono">Select a historic cycle to analyze weighting drift or trigger calibration comparisons</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {learningHistory.map(report => (
              <div
                key={report.cycleId}
                onClick={() => setCompareLearningId(report.cycleId === compareLearningId ? null : report.cycleId)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  report.cycleId === compareLearningId 
                    ? 'bg-violet-950/20 border-violet-500/30' 
                    : 'bg-black/30 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500">
                  <span>{report.cycleId}</span>
                  <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                </div>
                <h5 className="text-[10px] font-mono font-bold text-white mt-1">Adaptation Level: {report.metrics.adaptationScore.toFixed(0)}%</h5>
                <p className="text-[9px] text-zinc-400 font-sans truncate mt-0.5">Scanned {Math.round(report.metrics.personalizationScore * 0.4)} items in epoch.</p>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
            {comparedHistoryItem ? (
              <div className="space-y-4 text-zinc-300">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.03]">
                  <h6 className="text-[10.5px] font-mono font-bold text-violet-300">ARCHIVE CYCLE {comparedHistoryItem.cycleId}</h6>
                  <span className="text-[9px] font-mono text-zinc-500">{new Date(comparedHistoryItem.timestamp).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Historic Growth KPIs</span>
                    <div className="space-y-1 font-mono text-[9px]">
                      <div className="flex justify-between">
                        <span>Intelligence Score:</span>
                        <strong className="text-white">{comparedHistoryItem.metrics.intelligenceScore.toFixed(1)}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Learning Factor:</span>
                        <strong className="text-white">{comparedHistoryItem.metrics.learningScore.toFixed(1)}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Adaptation Compliance:</span>
                        <strong className="text-white">{comparedHistoryItem.metrics.adaptationScore.toFixed(1)}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Session Details</span>
                    <div className="space-y-1 font-mono text-[9px] text-zinc-400">
                      <div>Items Sampled: <strong className="text-zinc-200">{Math.round(comparedHistoryItem.metrics.personalizationScore * 0.4)}</strong></div>
                      <div>Entropy Loss Ratio: <strong className="text-zinc-200">{(100 - comparedHistoryItem.metrics.memoryQuality).toFixed(1)}%</strong></div>
                      <div>Gradient Step Index: <strong className="text-zinc-200">{Math.round(comparedHistoryItem.metrics.evolutionRate * 3)} steps</strong></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-violet-500/5 rounded-xl border border-violet-500/10 text-[9.5px] leading-relaxed italic">
                  "Dynamic epoch alignment complete. Past bias states recovered for comparison audits. Local backpropagation memory contains accurate temporal links."
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center space-y-2 text-zinc-500 font-mono text-xs">
                <span>📂</span>
                <span>Select a historic epoch cycle from the list to compare brain weights.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
