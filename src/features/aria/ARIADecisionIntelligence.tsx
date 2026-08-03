import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitBranch, Cpu, Sliders, CheckCircle2, ShieldCheck, Zap, Sparkles, RefreshCw, Calendar, Award, BarChart3, Check } from 'lucide-react';
import { DecisionIntelligenceEngine, CandidateOutfit, DecisionWeights, DecisionContext, StrategicOutfitPlan } from '../../engine/decisionIntelligence';
import { WardrobeItem } from '../../types';

interface ARIADecisionIntelligenceProps {
  userId?: string;
  wardrobe?: WardrobeItem[];
  onApplyOutfitToStudio?: (outfitName: string) => void;
}

// Default fallback items if wardrobe is minimal
const DEFAULT_SAMPLE_WARDROBE: WardrobeItem[] = [
  {
    id: 'w_1',
    title: 'Architectural Charcoal Wool Blazer',
    category: 'Outerwear',
    status: 'In Closet',
    userId: 'guest-user',
    createdAt: new Date().toISOString(),
    primaryColor: 'Charcoal',
    description: 'Structured Italian wool blazer with sharp shoulders and notch lapel.',
    wearCount: 4,
    lastUsed: '2026-07-28'
  },
  {
    id: 'w_2',
    title: 'Heavyweight Heavy Cotton Tee',
    category: 'Casual',
    status: 'In Closet',
    userId: 'guest-user',
    createdAt: new Date().toISOString(),
    primaryColor: 'Cream',
    description: '280gsm organic combed cotton shirt in clean off-white.',
    wearCount: 12,
    lastUsed: '2026-07-29'
  },
  {
    id: 'w_3',
    title: 'Pleated Tapered Trousers',
    category: 'Formal',
    status: 'In Closet',
    userId: 'guest-user',
    createdAt: new Date().toISOString(),
    primaryColor: 'Black',
    description: 'Double pleated wide tapered wool blend trousers in deep black.',
    wearCount: 8,
    lastUsed: '2026-07-25'
  },
  {
    id: 'w_4',
    title: 'Minimalist Calfskin Leather Loafers',
    category: 'Formal',
    status: 'In Closet',
    userId: 'guest-user',
    createdAt: new Date().toISOString(),
    primaryColor: 'Black',
    description: 'Full grain leather penny loafers with lugged rubber sole.',
    wearCount: 5,
    lastUsed: '2026-07-27'
  },
  {
    id: 'w_5',
    title: 'Minimal Raw Denim Jacket',
    category: 'Outerwear',
    status: 'In Closet',
    userId: 'guest-user',
    createdAt: new Date().toISOString(),
    primaryColor: 'Indigo',
    description: 'Japanese selvedge raw denim trucker jacket.',
    wearCount: 6,
    lastUsed: '2026-07-20'
  },
  {
    id: 'w_6',
    title: 'Silk Knit Black Tie',
    category: 'Accessories',
    status: 'In Closet',
    userId: 'guest-user',
    createdAt: new Date().toISOString(),
    primaryColor: 'Black',
    description: 'Square end silk knit necktie.',
    wearCount: 2,
    lastUsed: '2026-07-15'
  }
];

export const ARIADecisionIntelligence: React.FC<ARIADecisionIntelligenceProps> = ({
  userId = 'guest-sartorialist-user-100',
  wardrobe = [],
  onApplyOutfitToStudio
}) => {
  const activeWardrobe = wardrobe.length >= 3 ? wardrobe : DEFAULT_SAMPLE_WARDROBE;

  // Context State
  const [context, setContext] = useState<DecisionContext>({
    userId,
    weather: 'Cool & Crisp 16°C',
    occasion: 'Executive Tech Summit',
    season: 'Autumn / Winter'
  });

  // Engine Outputs
  const [winningOutfit, setWinningOutfit] = useState<CandidateOutfit | null>(null);
  const [rankedCandidates, setRankedCandidates] = useState<CandidateOutfit[]>([]);
  const [decisionWeights, setDecisionWeights] = useState<DecisionWeights>(() =>
    DecisionIntelligenceEngine.loadDecisionWeights(userId)
  );
  const [strategicPlan, setStrategicPlan] = useState<StrategicOutfitPlan | null>(null);

  // UI Navigation
  const [activeTab, setActiveTab] = useState<'DECISION_TREE' | 'RANKINGS' | 'WEIGHTS' | 'STRATEGIC_PLAN'>('DECISION_TREE');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Evaluate initial best candidate
  const runDecisionEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const best = DecisionIntelligenceEngine.evaluateAndSelectBest(activeWardrobe, context);
      const plan = DecisionIntelligenceEngine.generateStrategicPlan(activeWardrobe, userId);

      // Derive ranked candidates from plan & evaluations
      const ranked: CandidateOutfit[] = [
        best,
        plan.tomorrow,
        plan.weekend,
        plan.travel,
        plan.weddingPlan,
        plan.vacationPlan,
        ...plan.officeWeek
      ].filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

      ranked.sort((a, b) => b.overallScore - a.overallScore);

      setWinningOutfit(best);
      setRankedCandidates(ranked);
      setStrategicPlan(plan);
      setIsEvaluating(false);
    }, 400);
  };

  useEffect(() => {
    runDecisionEvaluation();
  }, [context.weather, context.occasion, context.season]);

  const handleWeightChange = (key: keyof DecisionWeights, val: number) => {
    const updated = { ...decisionWeights, [key]: val };
    DecisionIntelligenceEngine.saveDecisionWeights(userId, updated);
    setDecisionWeights(updated);
    runDecisionEvaluation();
    setNotification(`Updated Decision Engine parameter: ${key} = ${val}`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full space-y-6 text-zinc-100 font-sans">
      {/* Top Header & Context Controller */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">ARIA Autonomous Decision Intelligence Engine</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                  Multi-Factor Reasoner
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                Evaluates candidate outfit combinations against weather, occasion, style DNA, knowledge graph rules, and wardrobe reuse metrics with full decision-tree explainability.
              </p>
            </div>
          </div>

          <button
            onClick={runDecisionEvaluation}
            disabled={isEvaluating}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/20 border border-violet-400/30 transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
            <span>{isEvaluating ? 'Evaluating Candidates...' : 'Re-Evaluate Decision Tree'}</span>
          </button>
        </div>

        {/* Input Controls for Decision Context */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/5">
          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Occasion Context</label>
            <select
              value={context.occasion}
              onChange={(e) => setContext(prev => ({ ...prev, occasion: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="Executive Tech Summit">Executive Tech Summit</option>
              <option value="Formal Gala & Evening Event">Formal Gala & Evening Event</option>
              <option value="Weekend Gallery Hop & Coffee">Weekend Gallery Hop & Coffee</option>
              <option value="Smart Casual Office Work">Smart Casual Office Work</option>
              <option value="Travel & Airport Lounge">Travel & Airport Lounge</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Weather Context</label>
            <select
              value={context.weather}
              onChange={(e) => setContext(prev => ({ ...prev, weather: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="Cool & Crisp 16°C">Cool & Crisp 16°C</option>
              <option value="Sunny & Warm 25°C">Sunny & Warm 25°C</option>
              <option value="Rainy & Cold 10°C">Rainy & Cold 10°C</option>
              <option value="Freezing Winter 2°C">Freezing Winter 2°C</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Season</label>
            <select
              value={context.season}
              onChange={(e) => setContext(prev => ({ ...prev, season: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="Autumn / Winter">Autumn / Winter</option>
              <option value="Spring / Summer">Spring / Summer</option>
            </select>
          </div>
        </div>

        {notification && (
          <div className="text-xs text-indigo-300 font-mono bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Main Tab Bar */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('DECISION_TREE')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'DECISION_TREE'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 font-bold shadow-md shadow-violet-600/10'
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-violet-400" />
          <span>Decision Explainer & Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('RANKINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'RANKINGS'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-md shadow-emerald-600/10'
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Multi-Candidate Rankings ({rankedCandidates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('WEIGHTS')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'WEIGHTS'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-md shadow-indigo-600/10'
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Decision Weight Customizer</span>
        </button>

        <button
          onClick={() => setActiveTab('STRATEGIC_PLAN')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'STRATEGIC_PLAN'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold shadow-md shadow-purple-600/10'
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>Strategic Multi-Day Plan</span>
        </button>
      </div>

      {/* Tab 1: Decision Explainer & Tree */}
      {activeTab === 'DECISION_TREE' && winningOutfit && (
        <div className="space-y-6">
          {/* Winner Hero Card */}
          <div className="bg-gradient-to-br from-violet-950/30 via-black to-indigo-950/20 border border-violet-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Rank 1 Winner
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    Style Profile: <strong className="text-white">{winningOutfit.styleIdentity}</strong>
                  </span>
                </div>

                <h4 className="text-xl font-bold font-mono text-white">
                  {winningOutfit.name}
                </h4>

                <p className="text-xs text-zinc-300 font-mono leading-relaxed max-w-xl">
                  {winningOutfit.explainability}
                </p>

                {/* Garments Breakdown */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Selected Garments</span>
                  <div className="flex flex-wrap gap-2">
                    {winningOutfit.items.map((item) => (
                      <span key={item.id} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-200">
                        {item.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Score Dial */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/50 border border-violet-500/30 text-center shrink-0 min-w-[180px]">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Overall Score</span>
                <div className="text-4xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-300 to-violet-400 my-1">
                  {winningOutfit.overallScore}%
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> High Confidence
                </span>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-6 pt-5 border-t border-white/10">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-[9px] font-mono text-zinc-400 block">Style Match</span>
                <span className="text-sm font-bold font-mono text-indigo-300">{winningOutfit.styleMatch}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-[9px] font-mono text-zinc-400 block">Comfort</span>
                <span className="text-sm font-bold font-mono text-emerald-300">{winningOutfit.comfort}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-[9px] font-mono text-zinc-400 block">Trend Index</span>
                <span className="text-sm font-bold font-mono text-violet-300">{winningOutfit.trend}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-[9px] font-mono text-zinc-400 block">Weather Fit</span>
                <span className="text-sm font-bold font-mono text-cyan-300">{winningOutfit.weather}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-[9px] font-mono text-zinc-400 block">Occasion</span>
                <span className="text-sm font-bold font-mono text-purple-300">{winningOutfit.occasion}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-[9px] font-mono text-zinc-400 block">Wardrobe Reuse</span>
                <span className="text-sm font-bold font-mono text-emerald-300">{winningOutfit.wardrobeReuse}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-[9px] font-mono text-zinc-400 block">Novelty Index</span>
                <span className="text-sm font-bold font-mono text-amber-300">{winningOutfit.novelty}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-[9px] font-mono text-zinc-400 block">Confidence</span>
                <span className="text-sm font-bold font-mono text-indigo-400">{winningOutfit.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Decision Tree & Reasoning Details */}
          {winningOutfit.explanation && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Decision Tree Trace */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                <h5 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-violet-400" />
                  <span>Execution Decision Tree</span>
                </h5>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-xs text-zinc-300 space-y-2 leading-relaxed">
                  {winningOutfit.explanation.decisionTree.map((step, idx) => (
                    <div key={idx} className="hover:text-white transition-colors">
                      {step}
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Winning Factors</span>
                  <div className="space-y-1.5">
                    {winningOutfit.explanation.winningFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Reasoning Chain & Trade-offs */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                <h5 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>Reasoning Chain & Trade-Off Analysis</span>
                </h5>

                <div className="space-y-2">
                  {winningOutfit.explanation.reasoningChain.map((chain, idx) => (
                    <div key={idx} className="text-xs font-mono text-zinc-300 bg-black/30 border border-white/5 p-2.5 rounded-xl leading-relaxed">
                      {chain}
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Alternative Choices Evaluated</span>
                  <div className="flex flex-wrap gap-2">
                    {winningOutfit.explanation.alternativeChoices.map((alt, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-400">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Multi-Candidate Rankings */}
      {activeTab === 'RANKINGS' && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Multi-Candidate Score Comparisons</span>
            </h4>
            <span className="text-xs font-mono text-zinc-500">{rankedCandidates.length} Combinations Evaluated</span>
          </div>

          <div className="space-y-3">
            {rankedCandidates.slice(0, 8).map((candidate, index) => (
              <div
                key={candidate.id}
                className={`p-4 rounded-xl border transition-all ${
                  index === 0
                    ? 'bg-violet-950/20 border-violet-500/30'
                    : 'bg-black/30 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        index === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-zinc-400'
                      }`}>
                        Rank #{index + 1}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {candidate.styleIdentity}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold font-mono text-white">
                      {candidate.name}
                    </h5>

                    <p className="text-[11px] text-zinc-400 font-mono line-clamp-1">
                      {candidate.items.map(i => i.title).join(' • ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block">Overall Score</span>
                      <span className="text-lg font-bold font-mono text-emerald-400">{candidate.overallScore}%</span>
                    </div>

                    {onApplyOutfitToStudio && (
                      <button
                        onClick={() => onApplyOutfitToStudio(candidate.name)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-mono transition-all"
                      >
                        Apply Look
                      </button>
                    )}
                  </div>
                </div>

                {/* Score Bar */}
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${candidate.overallScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Decision Weight Customizer */}
      {activeTab === 'WEIGHTS' && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-6">
          <div>
            <h4 className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Decision Weight Parameter Matrix</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Adjust the weight coefficients to fine-tune how ARIA evaluates style match versus weather, trend, or wardrobe reuse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold">Style DNA Weight</span>
                <span className="text-indigo-400">{decisionWeights.styleDNAWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={decisionWeights.styleDNAWeight}
                onChange={(e) => handleWeightChange('styleDNAWeight', parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500 font-mono">
                Prioritizes alignment with user's core aesthetic archetype.
              </p>
            </div>

            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold">Knowledge Graph Weight</span>
                <span className="text-indigo-400">{decisionWeights.knowledgeGraphWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={decisionWeights.knowledgeGraphWeight}
                onChange={(e) => handleWeightChange('knowledgeGraphWeight', parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500 font-mono">
                Controls strictness of fashion rules and occasion standards.
              </p>
            </div>

            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold">Personal Preference Weight</span>
                <span className="text-indigo-400">{decisionWeights.preferenceWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={decisionWeights.preferenceWeight}
                onChange={(e) => handleWeightChange('preferenceWeight', parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500 font-mono">
                Gives higher weight to comfort and individual item preferences.
              </p>
            </div>

            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold">Creativity & Novelty Index</span>
                <span className="text-amber-400">{decisionWeights.creativityIndex}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={decisionWeights.creativityIndex}
                onChange={(e) => handleWeightChange('creativityIndex', parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500 font-mono">
                Encourages experimental garment combinations and novel pairings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Strategic Multi-Day Plan */}
      {activeTab === 'STRATEGIC_PLAN' && strategicPlan && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Multi-Day Strategic Outfit Forecast</span>
            </h4>
            <span className="text-xs font-mono text-zinc-500">Autonomous Rotation Plan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Today</span>
              <h5 className="text-xs font-bold font-mono text-white line-clamp-1">{strategicPlan.today.name}</h5>
              <p className="text-[11px] text-zinc-400 font-mono">{strategicPlan.today.styleIdentity}</p>
              <div className="text-xs font-bold font-mono text-emerald-400 pt-1">Score: {strategicPlan.today.overallScore}%</div>
            </div>

            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Tomorrow</span>
              <h5 className="text-xs font-bold font-mono text-white line-clamp-1">{strategicPlan.tomorrow.name}</h5>
              <p className="text-[11px] text-zinc-400 font-mono">{strategicPlan.tomorrow.styleIdentity}</p>
              <div className="text-xs font-bold font-mono text-emerald-400 pt-1">Score: {strategicPlan.tomorrow.overallScore}%</div>
            </div>

            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Weekend Getaway</span>
              <h5 className="text-xs font-bold font-mono text-white line-clamp-1">{strategicPlan.weekend.name}</h5>
              <p className="text-[11px] text-zinc-400 font-mono">{strategicPlan.weekend.styleIdentity}</p>
              <div className="text-xs font-bold font-mono text-emerald-400 pt-1">Score: {strategicPlan.weekend.overallScore}%</div>
            </div>

            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Travel & Airport</span>
              <h5 className="text-xs font-bold font-mono text-white line-clamp-1">{strategicPlan.travel.name}</h5>
              <p className="text-[11px] text-zinc-400 font-mono">{strategicPlan.travel.styleIdentity}</p>
              <div className="text-xs font-bold font-mono text-emerald-400 pt-1">Score: {strategicPlan.travel.overallScore}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
