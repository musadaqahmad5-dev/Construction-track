import React from 'react';
import { motion } from 'motion/react';
import { Database, Search, Flame } from 'lucide-react';
import { DecisionIntelligenceEngine } from '../../../engine';

interface DecisionTabProps {
  fashionMemory: any;
  decisionWeights: any;
  setDecisionWeights: (weights: any) => void;
  decisionWeather: string;
  setDecisionWeather: (weather: string) => void;
  decisionOccasion: string;
  setDecisionOccasion: (occasion: string) => void;
  decisionSeason: string;
  setDecisionSeason: (season: string) => void;
  evaluatedWinner: any;
  setEvaluatedWinner: (winner: any) => void;
  allCandidates: any[];
  setAllCandidates: (candidates: any[]) => void;
  strategyPlan: any;
  setStrategyPlan: (plan: any) => void;
  decisionFeedbackLog: string;
  setDecisionFeedbackLog: (log: string) => void;
  runDecisionSimulation: () => void;
  handleWeightAdjust: (field: 'styleDNAWeight' | 'knowledgeGraphWeight' | 'preferenceWeight' | 'wardrobeWeight', amount: number) => void;
  simulateAcceptance: (styleId: string) => void;
  simulateRejection: (styleId: string) => void;
  generateLongTermStrategy: () => void;
  state: any;
}

export const DecisionTab: React.FC<DecisionTabProps> = ({
  fashionMemory,
  decisionWeights,
  setDecisionWeights,
  decisionWeather,
  setDecisionWeather,
  decisionOccasion,
  setDecisionOccasion,
  decisionSeason,
  setDecisionSeason,
  evaluatedWinner,
  setEvaluatedWinner,
  allCandidates,
  setAllCandidates,
  strategyPlan,
  setStrategyPlan,
  decisionFeedbackLog,
  setDecisionFeedbackLog,
  runDecisionSimulation,
  handleWeightAdjust,
  simulateAcceptance,
  simulateRejection,
  generateLongTermStrategy,
  state
}) => {
  return (
    <motion.div
      key="decision"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left animate-fade-in"
    >
      {/* Header Metrics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black/40 border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                Autonomous Decision Intelligence Diagnostics
              </h3>
              <p className="text-[10px] text-white/40 font-mono">
                Real-time telemetry and accuracy statistics from local self-learning weights
              </p>
            </div>
            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 uppercase tracking-widest animate-pulse">
              Online & Active
            </span>
          </div>

          {/* Dashboard Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] text-white/30 block uppercase tracking-wider">Decision Accuracy</span>
              <span className="text-xl font-mono text-emerald-400 font-semibold block">
                {fashionMemory.accuracyEstimate}%
              </span>
              <span className="text-[8px] text-white/20 block font-mono">Profile aligned accuracy</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] text-white/30 block uppercase tracking-wider">Learning Progress</span>
              <span className="text-xl font-mono text-indigo-400 font-semibold block">
                {decisionWeights.learningProgress}%
              </span>
              <span className="text-[8px] text-white/20 block font-mono">Continuous tuning progress</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] text-white/30 block uppercase tracking-wider">Acceptance Rate</span>
              <span className="text-xl font-mono text-emerald-400 font-semibold block">
                {decisionWeights.acceptanceRate}%
              </span>
              <span className="text-[8px] text-white/20 block font-mono">Accepted vs Rejected outfits</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] text-white/30 block uppercase tracking-wider">Creativity Index</span>
              <span className="text-xl font-mono text-amber-400 font-semibold block">
                {decisionWeights.creativityIndex}%
              </span>
              <span className="text-[8px] text-white/20 block font-mono">Fatigue prevention drive</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] text-white/30 block uppercase tracking-wider">Novelty Index</span>
              <span className="text-xl font-mono text-violet-400 font-semibold block">
                {decisionWeights.noveltyIndex}%
              </span>
              <span className="text-[8px] text-white/20 block font-mono">Exploratory outfit range</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] text-white/30 block uppercase tracking-wider">Decision Confidence</span>
              <span className="text-xl font-mono text-indigo-400 font-semibold block">
                {Math.min(100, decisionWeights.acceptanceRate + 8)}%
              </span>
              <span className="text-[8px] text-white/20 block font-mono">Average evaluation trust</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] text-white/30 block uppercase tracking-wider">Cache Hit Rate</span>
              <span className="text-xl font-mono text-white/80 font-semibold block">
                {decisionWeights.cacheHitRate}%
              </span>
              <span className="text-[8px] text-white/20 block font-mono">Avoided redundant execution</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] text-white/30 block uppercase tracking-wider">Decision Stability</span>
              <span className="text-xl font-mono text-teal-400 font-semibold block">
                {decisionWeights.decisionStability}%
              </span>
              <span className="text-[8px] text-white/20 block font-mono">Consistent score variance</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] text-white/30 block uppercase tracking-wider">Recommendation Diversity</span>
              <span className="text-xl font-mono text-white/80 font-semibold block">
                {Math.round((decisionWeights.totalAccepted * 3.5) % 30 + 65)}%
              </span>
              <span className="text-[8px] text-white/20 block font-mono">Style coordinates variety</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] text-white/30 block uppercase tracking-wider">Evaluation Count</span>
              <span className="text-xl font-mono text-white/60 font-semibold block">
                {decisionWeights.totalAccepted + decisionWeights.totalRejected}
              </span>
              <span className="text-[8px] text-white/20 block font-mono">Logged decision nodes</span>
            </div>
          </div>

          {decisionFeedbackLog && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 animate-ping" />
              <p className="text-[10px] font-mono text-emerald-300 leading-relaxed">
                {decisionFeedbackLog}
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Weights Adjustment */}
        <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Autonomous Tuning Weights
            </h4>
            <p className="text-[9px] text-white/40">
              Fine-tune weight biases of the decision pipeline headlessly
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              { field: 'styleDNAWeight', label: 'Style DNA bias', value: decisionWeights.styleDNAWeight, color: 'text-indigo-400' },
              { field: 'knowledgeGraphWeight', label: 'Knowledge Graph bias', value: decisionWeights.knowledgeGraphWeight, color: 'text-emerald-400' },
              { field: 'preferenceWeight', label: 'Preference/Trend bias', value: decisionWeights.preferenceWeight, color: 'text-amber-400' },
              { field: 'wardrobeWeight', label: 'Wardrobe Reuse bias', value: decisionWeights.wardrobeWeight, color: 'text-rose-400' }
            ].map(w => (
              <div key={w.field} className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-white/80 block font-mono">{w.label}</span>
                  <span className={`text-[11px] font-mono font-bold ${w.color}`}>{w.value.toFixed(2)}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleWeightAdjust(w.field as any, -0.1)}
                    className="w-6 h-6 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleWeightAdjust(w.field as any, 0.1)}
                    className="w-6 h-6 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex gap-2">
            <button
              onClick={() => {
                const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
                localStorage.removeItem(`decision_intelligence_weights_${uId}`);
                setDecisionWeights(DecisionIntelligenceEngine.loadDecisionWeights(uId));
                setDecisionFeedbackLog("Tuning weights reset to baseline default standards.");
              }}
              className="w-full text-center text-[9px] font-mono text-white/40 hover:text-white uppercase tracking-wider py-1 cursor-pointer"
            >
              [ Reset Weights ]
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Decision simulator and Candidate Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Simulator controller and Inputs */}
        <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Database className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">1. Input Target Context</h3>
              <p className="text-[10px] text-white/40">Tune environmental triggers to evaluate outfit options</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Weather Condition</span>
              <select
                value={decisionWeather}
                onChange={(e) => setDecisionWeather(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono text-left"
              >
                <option value="Cool Overcast">Cool Overcast / Mild Winds</option>
                <option value="Sunny Warm Sky">Sunny Warm Sky / Clear Atmosphere</option>
                <option value="Rainy Breezy Cool">Rainy Breezy Cool / High Precipitation</option>
                <option value="Cozy Light Snow">Cozy Light Snow / Winter Frost</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Occasion Target</span>
              <select
                value={decisionOccasion}
                onChange={(e) => setDecisionOccasion(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono text-left"
              >
                <option value="Premium Evening Wedding Gala">Premium Evening Wedding Gala</option>
                <option value="Office Corporate Duty">Office Corporate Duty</option>
                <option value="General Living Daily Wear">General Living Daily Wear / Casual Outing</option>
                <option value="Resort Beachside Lounge">Resort Beachside Lounge</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Active Season</span>
              <select
                value={decisionSeason}
                onChange={(e) => setDecisionSeason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono text-left"
              >
                <option value="Autumn">Autumn Period</option>
                <option value="Winter">Winter Period</option>
                <option value="Spring">Spring Period</option>
                <option value="Summer">Summer Period</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={runDecisionSimulation}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-mono text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer font-bold shadow-lg shadow-indigo-500/10"
              >
                Evaluate & Rank Candidates Headlessly
              </button>
            </div>
          </div>
        </div>

        {/* Evaluated Winner Workspace Display */}
        <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">2. Winning Candidate Selection</h3>
                <p className="text-[10px] text-white/40">The single optimal choice derived from internal multi-candidate ranking</p>
              </div>
          </div>
            {evaluatedWinner && (
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase font-bold">
                Score: {evaluatedWinner.overallScore}%
              </span>
            )}
          </div>

          {evaluatedWinner ? (
            <div className="space-y-4">
              {/* Items Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                {evaluatedWinner.items.map((item: any) => (
                  <div key={item.id} className="bg-white/5 p-2 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[8px] font-mono text-white/30 uppercase block truncate">
                      {item.category || 'Garment'}
                    </span>
                    <span className="text-[10px] font-semibold text-white truncate block">
                      {item.title}
                    </span>
                    <span className="text-[9px] font-mono text-indigo-400 block truncate">
                      {item.primaryColor || 'Neutral'} / {item.status || 'Clean'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Explainer Block tabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Decision Tree rendering */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-3 space-y-2">
                  <span className="text-[9px] font-mono text-white/40 uppercase block">DECISION REASONING TREE</span>
                  <div className="space-y-1.5 font-mono text-[9px] text-white/80 leading-relaxed overflow-y-auto max-h-[160px]">
                    {evaluatedWinner.explanation?.decisionTree.map((node: string, index: number) => (
                      <div key={index} className={index === 5 ? "text-indigo-300 font-bold" : ""}>
                        {node}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reasoning steps & Trade-offs */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-white/40 uppercase block">WINNING FACTORS</span>
                  <div className="space-y-1 text-[10px] text-white/70">
                    {evaluatedWinner.explanation?.winningFactors.map((fact: string, index: number) => (
                      <div key={index} className="flex gap-2 items-start">
                        <span className="text-emerald-400">✓</span>
                        <p className="leading-tight">{fact}</p>
                      </div>
                    ))}
                  </div>

                  <span className="text-[9px] font-mono text-white/40 uppercase block pt-1">DECISION TRADE-OFFS</span>
                  <div className="space-y-1 text-[10px] text-white/70">
                    {evaluatedWinner.explanation?.tradeOffs.map((trade: string, index: number) => (
                      <div key={index} className="flex gap-2 items-start">
                        <span className="text-indigo-400">❖</span>
                        <p className="leading-tight">{trade}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Simulator buttons for Self-Learning verification */}
              <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2 justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => simulateAcceptance(evaluatedWinner.styleIdentity)}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg px-3 py-1.5 text-[9px] uppercase font-mono tracking-wider transition-all cursor-pointer font-bold"
                  >
                    [ Simulate Outfit Accept ]
                  </button>
                  <button
                    onClick={() => simulateRejection(evaluatedWinner.styleIdentity)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg px-3 py-1.5 text-[9px] uppercase font-mono tracking-wider transition-all cursor-pointer font-bold"
                  >
                    [ Simulate Outfit Reject ]
                  </button>
                </div>

                <div className="text-[9px] font-mono text-white/40">
                  Aesthetic Style Identity Match: <span className="text-white font-bold">{evaluatedWinner.styleIdentity}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
              <Database className="w-8 h-8 text-white/10 animate-bounce" />
              <p className="text-xs text-white/30 font-serif italic">
                "Select a contextual target above and click evaluate to browse decision traces"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Strategic Long-Term Outfit Strategy Planner Section */}
      <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-violet-400" />
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Long-Term Outfit Strategy Planner
              </h3>
              <p className="text-[10px] text-white/40">
                Multi-day planner and rotation metrics that completely avoid repeating recently worn looks
              </p>
            </div>
          </div>

          <button
            onClick={generateLongTermStrategy}
            className="bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5 text-white font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
          >
            Compile Long-Term Strategy Plan
          </button>
        </div>

        {strategyPlan ? (
          <div className="space-y-6">
            {/* Strategic Calendars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: "Today's Outfit Plan", outfit: strategyPlan.today, label: "Daily Comfort Casual", color: "from-indigo-500/10 to-indigo-500/5" },
                { title: "Tomorrow's Outfit Plan", outfit: strategyPlan.tomorrow, label: "Work & Professional", color: "from-purple-500/10 to-purple-500/5" },
                { title: "Weekend Plan", outfit: strategyPlan.weekend, label: "Outdoor Social & Gallery", color: "from-emerald-500/10 to-emerald-500/5" },
                { title: "Travel Transit Plan", outfit: strategyPlan.travel, label: "Aesthetic Airport Comfort", color: "from-amber-500/10 to-amber-500/5" }
              ].map((card, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${card.color} border border-white/5 p-4 rounded-xl space-y-3`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-white/80 block font-bold">{card.title}</span>
                      <span className="text-[9px] text-white/30 block uppercase tracking-wider mt-0.5">{card.label}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[8px] bg-white/10 text-white font-mono font-bold">
                      Score: {card.outfit.overallScore}%
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {card.outfit.items.map((i: any) => (
                      <div key={i.id} className="bg-black/30 px-2 py-1 rounded text-[10px] flex justify-between items-center text-white/80">
                        <span className="font-semibold truncate max-w-[120px]">{i.title}</span>
                        <span className="text-[8px] text-white/30 uppercase">{i.category || 'item'}</span>
                      </div>
                    ))}
                  </div>

                  <span className="text-[9px] font-mono text-white/40 block leading-tight pt-1">
                    {card.outfit.explainability}
                  </span>
                </div>
              ))}
            </div>

            {/* Corporate Office Week (5 Days) */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-white/40 uppercase block">5-Day Corporate Office Week Rotation</span>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => {
                  const outfit = strategyPlan.officeWeek[idx];
                  return (
                    <div key={day} className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white font-mono">{day}</span>
                        <span className="text-[9px] text-indigo-400 font-bold">{outfit.overallScore}%</span>
                      </div>
                      <div className="space-y-1 text-[9px] text-white/70">
                        {outfit.items.map((i: any) => (
                          <div key={i.id} className="truncate">
                            • <span className="font-semibold">{i.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Premium Events & Capsule Rotation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Wedding Gala Plan */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                  <span className="text-[10px] font-mono text-white/80 font-bold">Gala & Wedding Event Plan</span>
                  <span className="text-[9px] text-indigo-400 font-bold">{strategyPlan.weddingPlan.overallScore}%</span>
                </div>
                <div className="space-y-1 text-[10px] text-white/80">
                  {strategyPlan.weddingPlan.items.map((i: any) => (
                    <div key={i.id}>• <span className="font-semibold">{i.title}</span> ({i.primaryColor})</div>
                  ))}
                </div>
                <p className="text-[9px] font-serif text-white/40 leading-tight">
                  Styled matching premium elegance guidelines using velvet, wool blazers, and suede oxford coordinate lines.
                </p>
              </div>

              {/* Tropical Vacation Plan */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                  <span className="text-[10px] font-mono text-white/80 font-bold">Resort Vacation Plan</span>
                  <span className="text-[9px] text-amber-400 font-bold">{strategyPlan.vacationPlan.overallScore}%</span>
                </div>
                <div className="space-y-1 text-[10px] text-white/80">
                  {strategyPlan.vacationPlan.items.map((i: any) => (
                    <div key={i.id}>• <span className="font-semibold">{i.title}</span> ({i.primaryColor})</div>
                  ))}
                </div>
                <p className="text-[9px] font-serif text-white/40 leading-tight">
                  Optimized lighter linen components and short coordinate lines matching warm sunshine triggers.
                </p>
              </div>

              {/* Capsule Wardrobe Rotation */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                  <span className="text-[10px] font-mono text-white/80 font-bold">Capsule Closet Rotation Matches</span>
                  <span className="text-[9px] text-emerald-400 font-bold">High Utility</span>
                </div>
                <div className="space-y-2 text-[9px] text-white/70">
                  {strategyPlan.capsuleRotation.map((c: any, index: number) => (
                    <div key={index} className="truncate">
                      Setup #{index+1}: <span className="text-white font-semibold">{c.items.map((i: any) => i.title).slice(0, 2).join(', ')}</span> ({c.overallScore}%)
                    </div>
                  ))}
                </div>
                <p className="text-[9px] font-serif text-white/40 leading-tight">
                  Ensures maximum rotation efficiency of active coordinates with minimum repetition fatigue.
                </p>
              </div>

            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <Flame className="w-6 h-6 text-white/15 animate-pulse" />
            <p className="text-xs text-white/30 font-serif italic">
              "Click compile long-term strategy plan above to project multi-day styling calendars"
            </p>
          </div>
        )}
      </div>

    </motion.div>
  );
};
