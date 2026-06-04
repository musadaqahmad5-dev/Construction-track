import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Wind, 
  CheckCircle2, 
  UserCheck, 
  RefreshCw, 
  Lightbulb, 
  BookOpen, 
  Shirt, 
  Compass,
  Cpu,
  BrainCircuit,
  MessageSquare,
  HelpCircle,
  Briefcase,
  Gamepad,
  Music,
  Check
} from 'lucide-react';
import { WardrobeItem, ClothingCategory } from '../types';
import { StylePlanner } from '../features/stylist/stylePlanner';

interface TodaySuggestionCardProps {
  wardrobe: WardrobeItem[];
  onLockOutfit: (itemIds: string[]) => Promise<void>;
  styleVibe?: string;
}

export const TodaySuggestionCard: React.FC<TodaySuggestionCardProps> = ({ 
  wardrobe, 
  onLockOutfit,
  styleVibe = 'minimalist'
}) => {
  const [weather, setWeather] = useState<'Sunny' | 'Rainy' | 'Cold' | 'Breezy'>('Sunny');
  const [agenda, setAgenda] = useState<'Casual Outing' | 'Office Work' | 'Outdoor Sports' | 'Dinner Party'>('Casual Outing');
  const [isAiMode, setIsAiMode] = useState<boolean>(true);
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{ suggested: WardrobeItem[]; confidence: number; reasoning: string } | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  
  const [lockedSuccess, setLockedSuccess] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Deterministic fallback pipeline: Filter -> Match -> Suggest
  const selectTodaySuggestedItems = (): { suggested: WardrobeItem[]; explanation: string } => {
    if (wardrobe.length === 0) {
      return { suggested: [], explanation: "Your wardrobe is empty. Populate items inside the Catalog first." };
    }

    let candidatesList = [...wardrobe];
    let explanation = '';

    if (weather === 'Sunny') {
      candidatesList = wardrobe.filter(item => 
        item.category === 'Casual' || 
        item.category === 'Sportswear' || 
        item.category === 'Accessories' ||
        (item.season && ['Summer', 'Spring', 'All-Season'].includes(item.season))
      );
      explanation = "Sunny outlook: prioritizing lightweight Casual, Sportswear and active All-Season coordinates to maximize comfort and breathability.";
    } else if (weather === 'Rainy') {
      candidatesList = wardrobe.filter(item => 
        item.category === 'Outerwear' || 
        item.category === 'Formal' || 
        (item.description && item.description.toLowerCase().includes('wool') || item.description?.toLowerCase().includes('coat'))
      );
      explanation = "Rainy environment: recommending protective Outerwear layers and insulating materials for maximum humidity defense.";
    } else if (weather === 'Cold') {
      candidatesList = wardrobe.filter(item => 
        item.category === 'Outerwear' || 
        item.category === 'Formal' ||
        (item.season && ['Winter', 'Autumn', 'All-Season'].includes(item.season))
      );
      explanation = "Chilly conditions: matching warm Outerwear textures and dense fibers to prevent temperature fatigue.";
    } else { // Breezy
      candidatesList = wardrobe.filter(item => 
        item.category !== 'Sportswear' && 
        (item.season && ['Spring', 'Autumn', 'All-Season'].includes(item.season) || item.category === 'Outerwear' || item.category === 'Casual')
      );
      explanation = "Breezy conditions: opting for windproof transition boundaries, light sweaters, and adaptive smart casual pieces.";
    }

    if (candidatesList.length === 0) {
      candidatesList = [...wardrobe];
    }

    const categoriesSorted: Record<ClothingCategory, WardrobeItem[]> = {
      Casual: [],
      Formal: [],
      Sportswear: [],
      Outerwear: [],
      Accessories: []
    };

    candidatesList.forEach(item => {
      categoriesSorted[item.category].push(item);
    });

    const chosenSet: WardrobeItem[] = [];

    const pickOne = (arr: WardrobeItem[]): WardrobeItem | null => {
      if (arr.length === 0) return null;
      return arr[(shuffleSeed) % arr.length];
    };

    const mainPiece = pickOne([
      ...categoriesSorted.Casual, 
      ...categoriesSorted.Formal, 
      ...categoriesSorted.Sportswear
    ]);
    if (mainPiece) chosenSet.push(mainPiece);

    const outerItem = pickOne(categoriesSorted.Outerwear);
    if (outerItem && outerItem.id !== mainPiece?.id) {
      chosenSet.push(outerItem);
    }

    const accessoryItem = pickOne(categoriesSorted.Accessories);
    if (accessoryItem && accessoryItem.id !== mainPiece?.id && accessoryItem.id !== outerItem?.id) {
      chosenSet.push(accessoryItem);
    }

    if (chosenSet.length === 0) {
      for (let i = 0; i < Math.min(candidatesList.length, 3); i++) {
        chosenSet.push(candidatesList[(i + shuffleSeed) % candidatesList.length]);
      }
    }

    return { 
      suggested: chosenSet.filter((value, index, self) => self.findIndex(t => t.id === value.id) === index), 
      explanation 
    };
  };

  const localFallback = selectTodaySuggestedItems();

  // Unified suggestion retrieval based on mode
  useEffect(() => {
    if (isAiMode && wardrobe.length > 0) {
      const getRecommendations = async () => {
        setIsDrafting(true);
        try {
          const res = await StylePlanner.draftDailyRecommendation(
            'active_user',
            wardrobe,
            'Comfort Temp Range',
            weather,
            styleVibe,
            agenda
          );
          
          // Hydrate recommendation item IDs to actual closet objects
          const hydratedSuggested = res.todaySuggestion
            .map(id => wardrobe.find(w => w.id === id))
            .filter((item): item is WardrobeItem => !!item);

          setAiResult({
            suggested: hydratedSuggested.length > 0 ? hydratedSuggested : localFallback.suggested,
            confidence: res.confidence,
            reasoning: res.reasoning
          });
        } catch (e) {
          console.error("Failed fetching AI coordinate recommendations", e);
        } finally {
          setIsDrafting(false);
        }
      };

      getRecommendations();
    }
  }, [isAiMode, weather, agenda, styleVibe, wardrobe, shuffleSeed]);

  // Determine current active outfit recommendations displayed in UI
  const displaySuggested = isAiMode && aiResult 
    ? aiResult.suggested 
    : localFallback.suggested;

  const displayExplanation = isAiMode && aiResult 
    ? aiResult.reasoning 
    : localFallback.explanation;

  const handleLockIn = async () => {
    if (displaySuggested.length === 0) return;
    setLockedSuccess(true);
    const ids = displaySuggested.map(item => item.id);
    await onLockOutfit(ids);
    setTimeout(() => {
      setLockedSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6" id="today-suggestion-interface">
      {/* Editorial Title banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="text-blue-600" size={24} /> Today's Intelligent Vibe
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Let the matching layer propose coordinates based on your preferences.
          </p>
        </div>

        {/* Engine switcher toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-center" id="model-mode-selector">
          <button
            onClick={() => setIsAiMode(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all ${
              isAiMode 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' 
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <BrainCircuit size={14} className={isAiMode ? "animate-pulse" : ""} />
            AI Suggest
          </button>
          <button
            onClick={() => setIsAiMode(false)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all ${
              !isAiMode 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <Cpu size={14} />
            Deterministic
          </button>
        </div>
      </div>

      {/* METEOROLOGY & AGENDA INPUT ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-3xl border border-slate-150 shadow-xs">
        
        {/* Weather Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">1. Outer Meteorological state</label>
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100" id="weather-selectors">
            {[
              { id: 'Sunny', icon: <Sun size={13} className="text-amber-500" /> },
              { id: 'Rainy', icon: <CloudRain size={13} className="text-blue-500" /> },
              { id: 'Cold', icon: <Thermometer size={13} className="text-rose-500" /> },
              { id: 'Breezy', icon: <Wind size={13} className="text-slate-500" /> }
            ].map((w) => (
              <button
                key={w.id}
                onClick={() => { setWeather(w.id as any); setShuffleSeed(prev => prev + 1); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  weather === w.id ? 'bg-white text-slate-900 shadow-xs border border-slate-100/80' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {w.icon}
                <span>{w.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Agenda Context Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">2. Agenda context (AI inputs)</label>
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100" id="agenda-selectors">
            {[
              { id: 'Casual Outing', icon: <Music size={12} className="text-indigo-500" /> },
              { id: 'Office Work', icon: <Briefcase size={12} className="text-slate-500" /> },
              { id: 'Outdoor Sports', icon: <Gamepad size={12} className="text-emerald-500" /> },
              { id: 'Dinner Party', icon: <Sparkles size={12} className="text-amber-500" /> }
            ].map((ag) => (
              <button
                key={ag.id}
                onClick={() => { setAgenda(ag.id as any); setShuffleSeed(prev => prev + 1); }}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  agenda === ag.id ? 'bg-white text-slate-900 shadow-xs border border-slate-100/80' : 'text-slate-400 hover:text-slate-900'
                }`}
                disabled={isDrafting}
              >
                {ag.icon}
                <span className="hidden lg:inline">{ag.id.split(' ')[0]}</span>
                <span className="inline lg:hidden">{ag.id.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MATCH RECOMMENDATIONS BLOCK */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
            
            {/* Drafting Overlay */}
            <AnimatePresence>
              {isDrafting && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-xs z-20 flex flex-col items-center justify-center space-y-3"
                >
                  <RefreshCw className="text-blue-600 animate-spin" size={32} />
                  <div className="text-center">
                    <p className="text-sm font-serif font-bold text-slate-900 animate-pulse">Consulting AI Stylist Network...</p>
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-1">Evaluating color harmony indices</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-5">
              <div className="flex items-center gap-3">
                <span className={`p-3 rounded-2xl flex items-center justify-center ${
                  isAiMode ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'
                }`}>
                  {isAiMode ? <BrainCircuit size={20} /> : <Sparkles size={20} />}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 tracking-tight">
                    {isAiMode ? "Sartorial AI Recommendation" : "Deterministic Grid Coordinates"}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">
                    {isAiMode ? `Matched via ${styleVibe} style profile` : "Matched via local logical filters"}
                  </p>
                </div>
              </div>

              {wardrobe.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShuffleSeed(prev => prev + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold font-mono text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={12} /> RE-GENERATE
                </button>
              )}
            </div>

            {/* AI Output score overlay */}
            {isAiMode && aiResult && (
              <div className="flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-600 text-white rounded-lg font-mono text-xs font-black">
                    {Math.round(aiResult.confidence * 100)}%
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-indigo-900">Styling Match Score</h5>
                    <p className="text-[10px] text-indigo-500 font-light mt-0.25">Aligned with preferred favorite colors</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono leading-none font-bold uppercase py-1 px-2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Confidence High
                  </span>
                </div>
              </div>
            )}

            {/* Explanation rationale - Why this outfit */}
            <div className="bg-slate-50 p-5 rounded-2xl flex flex-col gap-2 border border-slate-150" id="forecast-interpretation">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isAiMode ? (
                    <MessageSquare className="text-indigo-600 shrink-0" size={16} />
                  ) : (
                    <Lightbulb className="text-amber-500 shrink-0" size={16} />
                  )}
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    {isAiMode ? "Why this outfit? (AI Styling Rationale)" : "Design Fallback Rationale"}
                  </h4>
                </div>
                <button 
                  onClick={() => setShowExplanation(prev => !prev)}
                  className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  {showExplanation ? "Collapse Explainer" : "Expand Explainer"}
                </button>
              </div>

              {showExplanation && (
                <div className="space-y-4 mt-2">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-xs leading-relaxed font-light ${isAiMode ? 'text-indigo-950 font-serif' : 'text-slate-600'}`}
                  >
                    {displayExplanation}
                  </motion.p>

                  {/* 5-PART OUTFIT EXPLAINER (Objective 4) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3.5 border-t border-slate-200" id="outfit-explainer-metrics">
                    {[
                      {
                        title: "Why Selected",
                        metric: `Selected for active ${agenda} lifestyle context balancing ${weather} conditions.`,
                        color: "border-blue-150 text-blue-850"
                      },
                      {
                        title: "Color Match",
                        metric: displaySuggested.length > 0 
                          ? `Aesthetic harmony combines ${displaySuggested.map(i => i.primaryColor || 'neutral').slice(0, 2).join(' & ')} dominant shades.`
                          : "Neutral anchors set to optimize quiet luxury contrasts.",
                        color: "border-purple-150 text-purple-850"
                      },
                      {
                        title: "Season Fit",
                        metric: displaySuggested.length > 0 
                          ? `Insulated layers matched to ${displaySuggested[0]?.season || 'All-Season'} thermal ratings.`
                          : "Multi-layered thermal barrier protection.",
                        color: "border-amber-150 text-amber-850"
                      },
                      {
                        title: "Rotation Reason",
                        metric: displaySuggested.length > 0 
                          ? `Pristine low fatigue index. Wear tally trending around ${displaySuggested[0]?.wearCount || 0}x.`
                          : "Refreshes wear coefficients to prevent fabric fatigue.",
                        color: "border-emerald-150 text-emerald-850"
                      },
                      {
                        title: "Alternative Choice",
                        metric: `Swap in casual tees or technical jackets from your catalog files for a modified blueprint.`,
                        color: "border-slate-150 text-slate-700 col-span-1 sm:col-span-2"
                      }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 bg-white border rounded-xl flex flex-col justify-between ${item.color}`}
                        id={`explainer-metric-card-${idx}`}
                      >
                        <span className="text-[9px] font-mono uppercase font-black tracking-widest text-slate-400 block mb-1">
                          {item.title}
                        </span>
                        <p className="text-[11px] font-light leading-relaxed">
                          {item.metric}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Matching items Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="matched-outfits-row">
              <AnimatePresence mode="popLayout">
                {displaySuggested.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-slate-50/60 rounded-2xl border border-slate-150 flex flex-col justify-between hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 mb-3 shadow-sm">
                        <Shirt size={18} />
                      </div>
                      <span className="text-[9px] font-mono uppercase font-bold text-blue-600 mb-1 block">
                        {item.category}
                      </span>
                      <h5 className="font-bold text-slate-900 text-sm tracking-tight mb-1 line-clamp-1">{item.title}</h5>
                      <p className="text-[10px] text-slate-400 font-mono tracking-wide">{item.primaryColor || 'Neutral shade'}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Wear tally: {item.wearCount || 0}x</span>
                      <span className="uppercase">{item.season || 'All-Season'}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {displaySuggested.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <Shirt className="text-slate-300 animate-bounce" size={32} />
                  <p className="font-bold text-slate-900 text-sm">No items in closet matching conditions</p>
                  <p className="text-xs text-slate-400 max-w-[220px]">Visit the Catalog list first to add clothing assets with aesthetic categories.</p>
                </div>
              )}
            </div>

            {/* Lock in Button */}
            {displaySuggested.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-slate-500 leading-relaxed font-light matches-explanation">
                  Set these items to <span className="font-bold text-amber-600">Planned</span> state so they represent active elements in your dressing drawer.
                </p>

                <button 
                  onClick={handleLockIn}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-500/15"
                >
                  Lock In Style Match
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SIDE TIPS PANEL (ELEGANT ADVICE PLAYBOOK) */}
        <aside className="lg:col-span-4" id="stylist-weekly-briefcase">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest">
                <BookOpen size={10} /> Sartorial Playbook
              </span>
              <h4 className="font-serif text-xl font-bold tracking-tight">Contrast Coordination</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Avoid wearing identical fabric weights across adjacent layers. If choosing a heavy cashmere sweater, pair it with thin chino boundaries or accessories to preserve silhouette integrity.
              </p>

              {isAiMode && (
                <div className="p-4 bg-slate-800/80 border border-slate-750 rounded-2xl space-y-2 mt-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-400">
                    <BrainCircuit size={13} />
                    <span>AI Pro tips</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    By coordinating a <span className="text-white font-medium">"{styleVibe}"</span> aesthetic flow today, we minimize graphic busy-ness and enhance quiet luxury tones.
                  </p>
                </div>
              )}
            </div>

            <AnimatePresence>
              {lockedSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4 flex items-start gap-2 text-blue-400"
                >
                  <UserCheck className="shrink-0 mt-0.5" size={16} />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider">Style Synchronized</h5>
                    <p className="text-[10px] opacity-80 leading-relaxed">Garments transitioned to Planned status registry. Check catalog tracker.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

      </div>
    </div>
  );
};
