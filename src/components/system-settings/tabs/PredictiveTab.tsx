import React from 'react';
import { motion } from 'motion/react';
import { Activity, Award, BarChart2, Zap, Sliders, AlertTriangle } from 'lucide-react';
import { ForecastPeriod, ForecastMetrics, SimulationResult, ScenarioComparison } from '../../../engine';

interface PredictiveTabProps {
  forecastTimeline: ForecastPeriod;
  predictiveMetrics: ForecastMetrics;
  selectedScenario: 'buy_jacket' | 'remove_black' | 'weather_change' | 'travel_abroad' | 'gain_pieces' | 'change_style';
  simulationResult: SimulationResult;
  scenarioComparison: ScenarioComparison;
  customStyleValue: string;
  setCustomStyleValue: (val: string) => void;
  handlePeriodChange: (period: ForecastPeriod) => void;
  handleScenarioChange: (scenario: any) => void;
  handleSimulateCustomStyle: () => void;
}

export const PredictiveTab: React.FC<PredictiveTabProps> = ({
  forecastTimeline,
  predictiveMetrics,
  selectedScenario,
  simulationResult,
  scenarioComparison,
  customStyleValue,
  setCustomStyleValue,
  handlePeriodChange,
  handleScenarioChange,
  handleSimulateCustomStyle
}) => {
  return (
    <motion.div
      key="predictive"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left font-sans"
    >
      {/* ENTERPRISE PREDICTIVE HEADER */}
      <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
              Enterprise Predictive Intelligence Layer Active
            </span>
          </div>
          <h3 className="text-xl font-serif font-light text-white tracking-tight">
            Predictive Intelligence & Simulation Center
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Analyze wardrobe health, forecast purchase budgets, predict laundry cycles, and run deterministic local simulations of physical wardrobe alterations or weather shifts.
          </p>
        </div>

        {/* TIMELINE ADJUSTMENT CONTROLS */}
        <div className="bg-black/30 border border-white/5 p-1 rounded-xl flex flex-wrap gap-1">
          {(['7 Days', '14 Days', '30 Days', '90 Days', '180 Days', '365 Days'] as ForecastPeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                forecastTimeline === period
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold'
                  : 'text-zinc-500 hover:text-white hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* FORECAST DASHBOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Future Outfit Success Rate */}
        <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Future Outfit Success</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-light text-white font-mono">{predictiveMetrics.predictedOutfitSuccessRate.toFixed(1)}%</span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">Confidence</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2.5">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${predictiveMetrics.predictedOutfitSuccessRate}%` }}
              />
            </div>
          </div>
          <p className="text-[9px] font-mono text-zinc-500 leading-normal">
            Mathematical certainty index of high-harmony coordinations across the specified {forecastTimeline} horizon.
          </p>
        </div>

        {/* Card 2: Wardrobe Health & Season Compliance */}
        <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Health & Compliance</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1 text-zinc-400">
                <span>Curation Health</span>
                <span className="text-white font-bold">{predictiveMetrics.wardrobeHealthScore.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full" 
                  style={{ width: `${predictiveMetrics.wardrobeHealthScore}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1 text-zinc-400">
                <span>Climate Adaptability</span>
                <span className="text-white font-bold">{predictiveMetrics.climateAdaptationRating.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-400 h-full rounded-full" 
                  style={{ width: `${predictiveMetrics.climateAdaptationRating}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-[9px] font-mono text-zinc-500 leading-normal">
            Assesses fabric density compliance, styling redundancies, and thermal indices of active closet elements.
          </p>
        </div>

        {/* Card 3: Logistics & Lifecycle Estimates */}
        <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Logistics & Projections</span>
            <BarChart2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-4 font-mono">
            <div>
              <span className="text-[7.5px] text-zinc-500 block uppercase">Estimated Spend</span>
              <span className="text-xl font-bold text-white">${predictiveMetrics.expectedBudgetBurn}</span>
              <span className="text-[7.5px] text-zinc-500 block">Next {forecastTimeline}</span>
            </div>
            <div>
              <span className="text-[7.5px] text-zinc-500 block uppercase">Laundry Trigger</span>
              <span className="text-xl font-bold text-white">{predictiveMetrics.laundryVelocityIndex} pts</span>
              <span className="text-[7.5px] text-zinc-500 block">Required volume</span>
            </div>
          </div>
          <p className="text-[9px] font-mono text-zinc-500 leading-normal">
            Heuristic logistics matrices anticipating wear decay, laundry cycles, and capsule budget targets.
          </p>
        </div>
      </div>

      {/* CORE SIMULATION ENGINE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: ACTIVE INTERACTIVE SIMULATION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4">
            <div className="pb-2 border-b border-white/5 flex justify-between items-center flex-wrap gap-2">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Deterministic Wardrobe Simulator</h4>
                <p className="text-[9px] text-zinc-500 font-mono">Run speculative mutations to observe upstream shifts in overall coordination confidence</p>
              </div>
              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded font-bold border border-emerald-500/15">
                MUTATION_MODE_SANDBOX
              </span>
            </div>

            {/* Sandbox selection buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {[
                { id: 'buy_jacket', label: 'Buy Classic Denim Jacket', desc: 'Test capsule gap coverage' },
                { id: 'remove_black', label: 'Purge Low-Frequency Black', desc: 'Evaluate palette dispersion' },
                { id: 'weather_change', label: 'Simulate Sudden Cold Front', desc: 'Measure heavy thermal utility' },
                { id: 'travel_abroad', label: 'Prepare for 7-Day Travel', desc: 'Verify rotation flexibility' },
                { id: 'gain_pieces', label: 'Acquire High-Contrast Silks', desc: 'Assess texture elevation' },
                { id: 'change_style', label: 'Adopt High-Contrast Minimalist', desc: 'Calibrate DNA alignments' }
              ].map((scen) => (
                <button
                  key={scen.id}
                  onClick={() => handleScenarioChange(scen.id as any)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedScenario === scen.id
                      ? 'bg-emerald-950/15 border-emerald-500/40 shadow-lg'
                      : 'bg-black/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-white block leading-tight">{scen.label}</span>
                  <span className="text-[8px] font-mono text-zinc-500 mt-1.5">{scen.desc}</span>
                </button>
              ))}
            </div>

            {/* SIMULATION SUMMARY RESULT */}
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3 font-mono text-[10px]">
              <div className="flex justify-between items-center text-[8px] text-zinc-500 border-b border-white/[0.03] pb-1.5">
                <span>MUTATION: {simulationResult.scenarioName}</span>
                <span>STATUS: COMPILED SUCCESS</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-zinc-500 text-[8.5px] uppercase block">Resulting Style Success Rate</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl text-white font-bold">{simulationResult.predictedConfidence.toFixed(1)}%</span>
                    <span className={`text-[9px] font-bold ${
                      (simulationResult.predictedConfidence - 85) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      ({(simulationResult.predictedConfidence - 85) >= 0 ? `+${(simulationResult.predictedConfidence - 85).toFixed(1)}` : (simulationResult.predictedConfidence - 85).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-zinc-500 text-[8.5px] uppercase block">Resource Adaptability Rating</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl text-indigo-400 font-bold">{simulationResult.predictedRecommendationQuality.toFixed(0)}%</span>
                    <span className="text-[8.5px] text-zinc-500">MAPPED</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.03] space-y-1">
                <span className="text-zinc-500 text-[8px] uppercase">Automated AI Forecast Diagnosis:</span>
                <p className="text-[10px] text-zinc-300 font-sans leading-relaxed italic">
                  "{simulationResult.expectedImpact}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CUSTOM SCENARIO & COMPARATIVE TREND MAP */}
        <div className="space-y-6">
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-white/5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Custom Neural Style Simulator</h4>
                <p className="text-[8px] text-zinc-500 font-mono">Calibrate styling weights directly</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[8.5px] font-mono text-zinc-400 uppercase">Target Aesthetic Anchor</label>
                <input
                  type="text"
                  value={customStyleValue}
                  onChange={(e) => setCustomStyleValue(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2.5 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSimulateCustomStyle}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-[9px] uppercase tracking-wider py-2.5 rounded-xl font-bold cursor-pointer transition-all"
              >
                [ Simulate Aesthetic Shift ]
              </button>
            </div>
          </div>

          {/* Feature 5: Comparative Matrix */}
          <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold pb-2 border-b border-white/5">Comparative Mutation Matrix</h4>
            
            <div className="space-y-2 font-mono text-[9px]">
              <div className="flex justify-between items-center text-zinc-500 uppercase text-[8px] pb-1">
                <span>SPECULATIVE PATHWAY</span>
                <span>SUCCESS RATE</span>
              </div>

              <div className="space-y-1.5">
                {[
                  { name: 'Classic Denim (Acquisition)', score: scenarioComparison.scenarioA.confidence, color: 'bg-indigo-500' },
                  { name: 'Palette Purging (Loss)', score: scenarioComparison.scenarioB.confidence, color: 'bg-rose-500' },
                  { name: 'Weather Frost Front (Climate)', score: scenarioComparison.scenarioC.confidence, color: 'bg-sky-500' },
                  { name: 'Travel Rotation (Logistic)', score: scenarioComparison.reality.confidence, color: 'bg-emerald-500' }
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-zinc-300">
                      <span>{row.name}</span>
                      <span>{row.score.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color}`} style={{ width: `${row.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/[0.03] flex gap-2 p-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <AlertTriangle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <p className="text-[8px] text-zinc-400 font-sans leading-normal">
                  Sandbox mutations are computed headlessly on the local device without mutating real wardrobe database entries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
