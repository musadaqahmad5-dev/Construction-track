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
import { DecisionTracker, OutcomeAction } from '../features/decision-loop/decisionTracker';
import { PreferenceLearner } from '../features/style-memory/preferenceLearner';
import { OutcomeEvaluator } from '../features/decision-loop/outcomeEvaluator';
import { 
  Activity, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Clipboard, 
  HelpCircle as HelpIcon, 
  Flame, 
  LightbulbIcon, 
  Globe, 
  AlertTriangle,
  Eye,
  Layers,
  ShoppingBag,
  Luggage,
  CalendarDays,
  CheckCheck,
  CreditCard,
  ChevronRight,
  TrendingUp,
  User,
  Info,
  Tag
} from 'lucide-react';

// Phase L4 Feature Imports
import { VirtualTryOn } from '../features/tryon/virtualTryOn';
import { SceneComposer } from '../features/lookbook/sceneComposer';
import { VisualRanker } from '../features/lookbook/visualRanker';
import { LookbookGenerator } from '../features/lookbook/lookbookGenerator';
import { MissingItemDetector } from '../features/commerce/missingItemDetector';
import { CatalogMatcher } from '../features/commerce/catalogMatcher';
import { BundleGenerator } from '../features/commerce/bundleGenerator';
import { ExecutionPlanner } from '../features/execution/executionPlanner';
import { VisualDecisionAnalytics } from '../features/analytics/visualDecisionAnalytics';

interface TodaySuggestionCardProps {
  wardrobe: WardrobeItem[];
  onLockOutfit: (itemIds: string[]) => Promise<void>;
  styleVibe?: string;
  userId?: string;
}

export const TodaySuggestionCard: React.FC<TodaySuggestionCardProps> = ({ 
  wardrobe, 
  onLockOutfit,
  styleVibe = 'minimalist',
  userId = 'active_user'
}) => {
  const [weather, setWeather] = useState<'Sunny' | 'Rainy' | 'Cold' | 'Breezy'>('Sunny');
  const [agenda, setAgenda] = useState<'Casual Outing' | 'Office Work' | 'Outdoor Sports' | 'Dinner Party'>('Casual Outing');
  const [isAiMode, setIsAiMode] = useState<boolean>(true);
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  
  // Enriched AI suggestion state to contain experiment variants and confidence payloads
  const [aiResult, setAiResult] = useState<{ 
    suggested: WardrobeItem[]; 
    confidence: number; 
    reasoning: string;
    experimentVariant?: {
      experimentId: string;
      variantId: string;
      strategyName: string;
    };
    confidencePayload?: {
      predictionConfidence: number;
      uncertainty: number;
      trustScore: number;
      fallbackIndicators: {
        isOffline: boolean;
        hasEmptyCloset: boolean;
        missingCategoryCoverage: boolean;
      };
    };
    recommendationOutcomeScore?: number;
  } | null>(null);
  
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [lockedSuccess, setLockedSuccess] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  
  // L3 Feedback loop states
  const [recId, setRecId] = useState<string>('rec_' + Date.now());
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [outcomeScore, setOutcomeScore] = useState<number>(75);

  // Phase L4 State Variables for Visual OS Console
  const [activeStudioTab, setActiveStudioTab] = useState<'tryon' | 'lookbook' | 'commerce' | 'execution'>('tryon');
  const [isTryOnLookbookView, setIsTryOnLookbookView] = useState<boolean>(true);
  const [visualStats, setVisualStats] = useState<{ totalInteractionsCount: number; completionRate_percent: number; score: number }>({
    totalInteractionsCount: 0,
    completionRate_percent: 65,
    score: 75
  });
  const [commerciallySimulated, setCommerciallySimulated] = useState<boolean>(false);
  const [wearTodayScheduledMsg, setWearTodayScheduledMsg] = useState<string | null>(null);

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
    // Generate a fresh recommendation session key
    const currentRecId = 'rec_' + Date.now();
    setRecId(currentRecId);
    
    // Fetch outcome performance history score
    const loadPerformanceHistory = async () => {
      try {
        const scoreObj = await OutcomeEvaluator.evaluateUserPerformance(userId);
        setOutcomeScore(Math.round(scoreObj.score));
      } catch (e) {
        console.warn('Failed to load historic outcome performance:', e);
      }
    };
    loadPerformanceHistory();

    // Fetch Phase L4 visual telemetry performance metrics
    const loadVisualStats = async () => {
      try {
        const stats = await VisualDecisionAnalytics.getVisualOutcomeScore(userId);
        setVisualStats(stats);
      } catch (e) {
        console.warn('Failed to load visual stats:', e);
      }
    };
    loadVisualStats();

    if (isAiMode && wardrobe.length > 0) {
      const getRecommendations = async () => {
        setIsDrafting(true);
        try {
          const res = await StylePlanner.draftDailyRecommendation(
            userId,
            wardrobe,
            'Comfort Temp Range',
            weather,
            styleVibe,
            agenda
          ) as any;
          
          // Hydrate recommendation item IDs to actual closet objects
          const hydratedSuggested = res.todaySuggestion
            .map((id: string) => wardrobe.find(w => w.id === id))
            .filter((item: any): item is WardrobeItem => !!item);

          const finalSuggested = hydratedSuggested.length > 0 ? hydratedSuggested : localFallback.suggested;

          setAiResult({
            suggested: finalSuggested,
            confidence: res.confidence,
            reasoning: res.reasoning,
            experimentVariant: res.experimentVariant,
            confidencePayload: res.confidencePayload,
            recommendationOutcomeScore: res.recommendationOutcomeScore
          });

          // Log the viewed event for Step 1 - Decision Outcome Layer
          if (finalSuggested.length > 0) {
            await DecisionTracker.logOutcome({
              userId,
              recommendationId: currentRecId,
              items: finalSuggested.map(item => item.id),
              action: 'viewed'
            });
          }
        } catch (e) {
          console.error("Failed fetching AI coordinate recommendations", e);
        } finally {
          setIsDrafting(false);
        }
      };

      getRecommendations();
    } else if (!isAiMode && wardrobe.length > 0) {
      // Deterministic path: also log a viewed trigger
      const fallbackList = localFallback.suggested;
      if (fallbackList.length > 0) {
        DecisionTracker.logOutcome({
          userId,
          recommendationId: currentRecId,
          items: fallbackList.map(item => item.id),
          action: 'viewed'
        }).catch(err => console.warn('Offline tracker logging failed:', err));
      }
    }
  }, [isAiMode, weather, agenda, styleVibe, wardrobe, shuffleSeed, userId]);

  // Determine current active outfit recommendations displayed in UI
  const displaySuggested = isAiMode && aiResult 
    ? aiResult.suggested 
    : localFallback.suggested;

  const displayExplanation = isAiMode && aiResult 
    ? aiResult.reasoning 
    : localFallback.explanation;

  const logDecisionAction = async (action: OutcomeAction) => {
    if (displaySuggested.length === 0) return;
    try {
      // 1. Log the transaction event to the Firestore-backed decision loop
      await DecisionTracker.logOutcome({
        userId,
        recommendationId: recId,
        items: displaySuggested.map(item => item.id),
        action
      });

      // 2. Closed-Loop Reinforced Learning:
      // Translate the outcome action into model weights & preference state rules in Style Profile Memory
      let learningAction: 'accept' | 'reject' | 'wear' | null = null;
      if (action === 'accepted' || action === 'saved') {
        learningAction = 'accept';
      } else if (action === 'rejected') {
        learningAction = 'reject';
      } else if (action === 'worn') {
        learningAction = 'wear';
      }

      if (learningAction) {
        await PreferenceLearner.learnFromAction(userId, learningAction, displaySuggested);
      }

      // 3. Update local feedback indicators
      setFeedbackMsg(`Reinforced loop action Logged: "${action.toUpperCase()}". Style profile memory weights and color biases updated.`);
      
      // Refresh current user outcome performance score
      const scoreObj = await OutcomeEvaluator.evaluateUserPerformance(userId);
      setOutcomeScore(Math.round(scoreObj.score));

      setTimeout(() => {
        setFeedbackMsg(null);
      }, 5000);
    } catch (e) {
      console.error('Error logging outcome decision:', e);
    }
  };

  const handleLockIn = async () => {
    if (displaySuggested.length === 0) return;
    setLockedSuccess(true);
    const ids = displaySuggested.map(item => item.id);
    await onLockOutfit(ids);
    
    // Automatically reinforce selection as "Worn" in closed-loop memory
    await logDecisionAction('worn');
    
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

            {/* Dynamic Loop Notification Feedback */}
            <AnimatePresence>
              {feedbackMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-250 text-xs flex items-center gap-2 font-medium"
                >
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                  <span>{feedbackMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* L3 Enterprise Model Observability Dashboard */}
            {isAiMode && aiResult && (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4" id="model-observability-panel">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 font-mono">
                      <Activity size={12} className="text-blue-600 animate-pulse" /> Diagnostics: Adaptive Style Health
                    </h5>
                  </div>
                  
                  {/* LIVE A/B EXPERIMENT VARIANT */}
                  {aiResult.experimentVariant && (
                    <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span>EXP: {aiResult.experimentVariant.variantId} ({aiResult.experimentVariant.strategyName})</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  {/* Metric 1: Match Score */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center relative overflow-hidden">
                    <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Match Confidence</span>
                    <span className="text-xl font-bold font-mono text-slate-900 block mt-1">{Math.round(aiResult.confidence * 100)}%</span>
                    <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: `${Math.round(aiResult.confidence * 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Metric 2: Model Trust Score */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Profile Trust Score</span>
                    <span className="text-xl font-bold font-mono text-slate-900 block mt-1">
                      {aiResult.confidencePayload ? Math.round(aiResult.confidencePayload.trustScore * 100) : 80}%
                    </span>
                    <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${aiResult.confidencePayload ? Math.round(aiResult.confidencePayload.trustScore * 100) : 80}%` }}></div>
                    </div>
                  </div>

                  {/* Metric 3: Model Uncertainty */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Stylist Uncertainty</span>
                    <span className="text-xl font-bold font-mono text-slate-900 block mt-1">
                      {aiResult.confidencePayload ? Math.round(aiResult.confidencePayload.uncertainty * 100) : 15}%
                    </span>
                    <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${aiResult.confidencePayload ? Math.round(aiResult.confidencePayload.uncertainty * 100) : 15}%` }}></div>
                    </div>
                  </div>

                  {/* Metric 4: Closed Loop Performance */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Outcome Efficiency</span>
                    <span className="text-xl font-bold font-mono text-slate-900 block mt-1">{outcomeScore}/100</span>
                    <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-indigo-600 h-full" style={{ width: `${outcomeScore}%` }}></div>
                    </div>
                  </div>

                </div>

                {/* Interactive Feedback & Logging Controller */}
                <div className="bg-white p-3.5 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono uppercase text-slate-400 font-bold block">Closed-Loop Outcomes Console (Adaptive Feedback Loop)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" id="interactive-decision-loop">
                    
                    <button
                      type="button"
                      onClick={() => logDecisionAction('accepted')}
                      className="py-2 px-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 size={11} className="text-emerald-550" /> Accept Look
                    </button>

                    <button
                      type="button"
                      onClick={() => logDecisionAction('saved')}
                      className="py-2 px-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Heart size={11} className="text-indigo-550" /> Save Look
                    </button>

                    <button
                      type="button"
                      onClick={() => logDecisionAction('shared')}
                      className="py-2 px-2 bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Share2 size={11} className="text-cyan-550" /> Share Look
                    </button>

                    <button
                      type="button"
                      onClick={() => logDecisionAction('worn')}
                      className="py-2 px-2 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Shirt size={11} className="text-purple-550" /> Mark Worn
                    </button>

                    <button
                      type="button"
                      onClick={() => logDecisionAction('rejected')}
                      className="py-2 px-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 rounded-lg text-[10px] font-bold col-span-2 sm:col-span-1 uppercase tracking-wider text-slate-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AlertTriangle size={11} className="text-rose-550" /> Reject Look
                    </button>

                  </div>
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

            {/* PHASE L4: VISUAL FASHION OPERATING SYSTEM SUITE */}
            {displaySuggested.length > 0 && (
              <div className="mt-8 bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 space-y-6" id="visual-fashion-os-suite">
                
                {/* Visual Header Panel with interactive quick actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                      <Layers size={18} />
                    </span>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider font-mono text-slate-200">Visual OS: Fit & Execution Suite</h4>
                      <p className="text-[10px] text-slate-400">Interactive virtual drapes, scene composition, and commerce completers</p>
                    </div>
                  </div>

                  {/* L4 QUICK ACTIONS BAR : Wear Today, Save Look, Complete Outfit */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await logDecisionAction('worn');
                        await VisualDecisionAnalytics.logInteraction(userId, 'visual_accept', { action: 'wear_now', items: displaySuggested.map(i => i.id) });
                        setWearTodayScheduledMsg("Outfit marked as worn! Closet wear stats incremented and style preference learning triggered.");
                        setTimeout(() => setWearTodayScheduledMsg(null), 5000);
                      }}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Shirt size={12} /> Wear Today
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await logDecisionAction('saved');
                        await VisualDecisionAnalytics.logInteraction(userId, 'visual_accept', { action: 'save_look', items: displaySuggested.map(i => i.id) });
                        setWearTodayScheduledMsg("Lookbook set securely saved into Style Profile memories.");
                        setTimeout(() => setWearTodayScheduledMsg(null), 5000);
                      }}
                      className="py-1.5 px-3 bg-indigo-650 hover:bg-indigo-700 text-slate-100 border border-indigo-500/30 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Heart size={12} className="text-rose-400" /> Save Look
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveStudioTab('commerce');
                        VisualDecisionAnalytics.logInteraction(userId, 'complete_outfit_click');
                      }}
                      className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag size={12} className="text-amber-400" /> Complete Outfit
                    </button>
                  </div>
                </div>

                {wearTodayScheduledMsg && (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2 font-mono">
                    <CheckCheck size={14} className="shrink-0 text-emerald-500" />
                    <span>{wearTodayScheduledMsg}</span>
                  </div>
                )}

                {/* TAB SWITCHERS - Try-On, Lookbook, Commerce, packing execution */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={async () => {
                      setActiveStudioTab('tryon');
                      await VisualDecisionAnalytics.logInteraction(userId, 'preview_open', { items: displaySuggested.map(i => i.id) });
                    }}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeStudioTab === 'tryon' ? 'bg-slate-950 text-blue-400 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye size={12} /> Try-On Studio
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      setActiveStudioTab('lookbook');
                      await VisualDecisionAnalytics.logInteraction(userId, 'compare_looks', { primaryCount: displaySuggested.length });
                    }}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeStudioTab === 'lookbook' ? 'bg-slate-950 text-indigo-400 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers size={12} /> Scene Lookbook
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveStudioTab('commerce');
                    }}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeStudioTab === 'commerce' ? 'bg-slate-950 text-amber-400 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShoppingBag size={12} /> Completer Items
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveStudioTab('execution');
                    }}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeStudioTab === 'execution' ? 'bg-slate-950 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Luggage size={12} /> Travel packing
                  </button>
                </div>

                {/* ACTIVE TAB MODULAR RENDER AREA */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden">
                  
                  {/* TAB 1: VIRTUAL TRY-ON STAGE */}
                  {activeStudioTab === 'tryon' && (() => {
                    const tryOnResult = VirtualTryOn.simulatedTryOn(displaySuggested);
                    return (
                      <div className="space-y-5">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
                          <div>
                            <h5 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Eye size={12} className="text-blue-400" /> Layered fitting avatar model
                            </h5>
                          </div>
                          
                          {/* Toggle Grid lookbook fallback view */}
                          <button
                            type="button"
                            onClick={() => setIsTryOnLookbookView(!isTryOnLookbookView)}
                            className="bg-slate-950 border border-slate-800 py-1 px-3 rounded-lg text-[9px] font-mono hover:text-white transition-colors cursor-pointer"
                          >
                            Viewing Mode: <span className="text-blue-400 font-bold uppercase">{isTryOnLookbookView ? 'Layered Avatar' : 'Flat lookbook display'}</span>
                          </button>
                        </div>

                        {/* Interactive try-on stage split */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          
                          {/* Left column: Visual Avatar drawing */}
                          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[300px] relative overflow-hidden">
                            {isTryOnLookbookView ? (
                              <div className="w-full h-full max-w-[200px] aspect-[1/2] relative flex items-center justify-center">
                                
                                {/* SVG Stylized Body Avatar Wireframe */}
                                <svg viewBox="0 0 100 200" className="absolute inset-0 w-full h-full text-slate-800 stroke-current stroke-[0.75] fill-none opacity-40">
                                  {/* Head */}
                                  <circle cx="50" cy="15" r="9" />
                                  {/* Neck */}
                                  <line x1="50" y1="24" x2="50" y2="30" />
                                  {/* Shoulders */}
                                  <line x1="25" y1="30" x2="75" y2="30" />
                                  {/* Spine */}
                                  <line x1="50" y1="30" x2="50" y2="105" />
                                  {/* Left Arm */}
                                  <path d="M 25,30 L 12,65" />
                                  {/* Right Arm */}
                                  <path d="M 75,30 L 88,65" />
                                  {/* Hips */}
                                  <line x1="30" y1="105" x2="70" y2="105" />
                                  {/* Left Leg */}
                                  <path d="M 30,105 L 30,190" />
                                  {/* Right Leg */}
                                  <path d="M 70,105 L 70,190" />
                                </svg>

                                {/* RENDER ACTIVE APPAREL OVERLAYS */}
                                {tryOnResult.overlays.map((overlay, idx) => (
                                  <motion.div
                                    key={overlay.itemId}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 0.9, scale: 1 }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="absolute hover:opacity-100 transition-opacity cursor-pointer group"
                                    style={{
                                      top: overlay.style.top,
                                      left: overlay.style.left,
                                      width: overlay.style.width,
                                      height: overlay.style.height,
                                      zIndex: overlay.style.zIndex
                                    }}
                                  >
                                    {/* Stylized vector bounding mask */}
                                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                                      <path 
                                        d={overlay.svgPlaceholderPath} 
                                        fill={overlay.color} 
                                        className="opacity-70 group-hover:opacity-90 transition-opacity" 
                                      />
                                    </svg>
                                    
                                    {/* Floating category tooltip */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-md text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                                      {overlay.name} ({overlay.category})
                                    </div>
                                  </motion.div>
                                ))}

                                {/* Live Wearer Pointer labels */}
                                <div className="absolute top-[8%] left-1 md:left-2 text-[8px] font-mono text-slate-500">HEAD & ACCESSORIES</div>
                                <div className="absolute top-[35%] left-1 md:left-2 text-[8px] font-mono text-slate-500">TORSO LINE</div>
                                <div className="absolute top-[70%] left-1 md:left-2 text-[8px] font-mono text-slate-500">LOWER PROFILE</div>
                              </div>
                            ) : (
                              // Lookbook Flat Grid view mode fallback
                              <div className="w-full grid grid-cols-2 gap-2 mt-4">
                                {displaySuggested.map(item => (
                                  <div key={item.id} className="p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-[10px] flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md border border-slate-700 shrink-0" style={{ backgroundColor: item.primaryColor || '#CBD5E1' }} />
                                    <div className="truncate">
                                      <p className="font-bold truncate text-slate-200">{item.title}</p>
                                      <p className="text-[8px] font-mono text-slate-400 capitalize">{item.category}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Right column: Fit stats and assessment logs */}
                          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                            
                            {/* Fit Index progress */}
                            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-2">
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-slate-400">Total Fit Confidence Index</span>
                                <span className="text-blue-400 font-black">{Math.round(tryOnResult.overallFitConfidence * 100)}%</span>
                              </div>
                              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full" style={{ width: `${Math.round(tryOnResult.overallFitConfidence * 100)}%` }} />
                              </div>
                              <p className="text-[10px] text-slate-400 font-light mt-1">Calculates optimal sleeve lengths, shoulder seam drapes, and trousers bounds.</p>
                            </div>

                            {/* Fit Assessment warnings */}
                            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                              {Object.entries(tryOnResult.assessments).map(([id, assessment]) => {
                                const item = displaySuggested.find(g => g.id === id);
                                if (!item) return null;
                                return (
                                  <div key={id} className="bg-slate-950 p-2.5 border border-slate-800 rounded-lg text-[10px] flex items-start gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.primaryColor || '#94A3B8' }} />
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-slate-200">{item.title}</span>
                                        <span className="py-0.5 px-1.5 rounded bg-blue-900/40 text-blue-300 font-mono text-[8px] font-bold uppercase">{assessment.fitLabel}</span>
                                      </div>
                                      <p className="text-slate-400 font-light mt-0.5">{assessment.styleAdviceNotes}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="bg-blue-950/20 text-blue-400 p-2 text-[9px] font-mono rounded-lg border border-blue-900/35">
                              ⚠️ Double-layering overlapping tops may increase torso bulk. Ensure a fine lightweight undershirt.
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB 2: SCENE COMPOSER & LOOKBOOK COMPARE */}
                  {activeStudioTab === 'lookbook' && (() => {
                    const alternatePool = wardrobe.filter(i => !displaySuggested.map(d => d.id).includes(i.id));
                    const lookbookShowcase = LookbookGenerator.compileShowcase(displaySuggested, alternatePool.slice(0, 3), agenda);
                    return (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h5 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Layers size={12} className="text-indigo-400" /> Comparative Scenographic Lookboards
                          </h5>
                          
                          <div className="flex items-center gap-1.5 bg-indigo-950/40 text-indigo-400 py-1 px-2 rounded-lg text-[10px] font-mono">
                            <span className="font-bold">Aesthetic Harmony Score:</span>
                            <span className="font-black text-white">{lookbookShowcase.averageVisualPerformance}/100</span>
                          </div>
                        </div>

                        {/* Showcase Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* CARD A: PRIMARY LOOKToday */}
                          <div className="bg-slate-950 rounded-xl border border-indigo-900/30 overflow-hidden relative" id="lookbook-today-scenography">
                            {/* Background Scenography Mask */}
                            <div className="h-28 bg-gradient-to-br from-indigo-950 to-slate-950 p-4 flex flex-col justify-between border-b border-slate-800 relative">
                              <span className="text-[8px] font-mono bg-blue-500/20 text-blue-300 py-0.5 px-2 rounded-full uppercase self-start border border-blue-500/30">
                                TODAY'S PRIMARY
                              </span>
                              <div>
                                <h6 className="font-bold text-xs mt-1 text-slate-100">{lookbookShowcase.primaryLook.scene.contextName}</h6>
                                <p className="text-[9px] text-slate-400 font-mono uppercase">Lighting Mode: {lookbookShowcase.primaryLook.scene.lightingMode}</p>
                              </div>
                              <span className="absolute top-4 right-4 text-xl font-bold font-mono text-indigo-400">
                                {lookbookShowcase.primaryLook.rankResult.visualComboScore}/100
                              </span>
                            </div>

                            {/* Card Content list elements */}
                            <div className="p-4 space-y-3">
                              <div className="flex items-center justify-between text-[10px] border-b border-slate-850 pb-2">
                                <span className="text-slate-400 font-mono">Color Harmony</span>
                                <span className="font-bold text-slate-200">{lookbookShowcase.primaryLook.rankResult.colorContrastRating}</span>
                              </div>

                              <div className="space-y-1">
                                {lookbookShowcase.primaryLook.items.map(item => (
                                  <div key={item.id} className="text-[10px] flex items-center justify-between text-slate-400">
                                    <span className="truncate max-w-[150px]">{item.title}</span>
                                    <span className="font-mono text-[8px] tracking-wide uppercase px-1.5 py-0.5 bg-slate-900 rounded">{item.category}</span>
                                  </div>
                                ))}
                              </div>

                              {lookbookShowcase.primaryLook.rankResult.aestheticNotes.map((note, idx) => (
                                <p key={idx} className="text-[10px] font-light leading-relaxed text-indigo-300 italic">
                                  ✦ "{note}"
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* CARD B: DETERMINISTIC OR ALTERNATIVE LOOK COMPARE */}
                          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative" id="lookbook-alternative-scenography">
                            {lookbookShowcase.alternativeLooks.length > 0 ? (
                              (() => {
                                const alt = lookbookShowcase.alternativeLooks[0];
                                return (
                                  <>
                                    <div className="h-28 bg-gradient-to-br from-slate-900 to-amber-950/20 p-4 flex flex-col justify-between border-b border-slate-800 relative">
                                      <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 py-0.5 px-2 rounded-full uppercase self-start border border-amber-500/20">
                                        COMPANION ALTERNATIVE
                                      </span>
                                      <div>
                                        <h6 className="font-bold text-xs mt-1 text-slate-150">{alt.scene.contextName}</h6>
                                        <p className="text-[9px] text-slate-400 font-mono uppercase">Lighting Mode: {alt.scene.lightingMode}</p>
                                      </div>
                                      <span className="absolute top-4 right-4 text-xl font-bold font-mono text-amber-500">
                                        {alt.rankResult.visualComboScore}/100
                                      </span>
                                    </div>

                                    {/* Card Content list elements */}
                                    <div className="p-4 space-y-3">
                                      <div className="flex items-center justify-between text-[10px] border-b border-slate-850 pb-2">
                                        <span className="text-slate-400 font-mono">Color Harmony</span>
                                        <span className="font-bold text-slate-300">{alt.rankResult.colorContrastRating}</span>
                                      </div>

                                      <div className="space-y-1">
                                        {alt.items.map(item => (
                                          <div key={item.id} className="text-[10px] flex items-center justify-between text-slate-400">
                                            <span className="truncate max-w-[150px]">{item.title}</span>
                                            <span className="font-mono text-[8px] tracking-wide uppercase px-1.5 py-0.5 bg-slate-900 rounded">{item.category}</span>
                                          </div>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        onClick={async () => {
                                          await onLockOutfit(alt.items.map(i => i.id));
                                          await VisualDecisionAnalytics.logInteraction(userId, 'visual_accept', { selected: 'alternative_look' });
                                          setWearTodayScheduledMsg("Successfully toggled Alternative set option as active plans!");
                                        }}
                                        className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 border border-slate-800 rounded-lg text-[10px] font-bold uppercase transition-colors text-center cursor-pointer"
                                      >
                                        Use Alternative Combination
                                      </button>
                                    </div>
                                  </>
                                );
                              })()
                            ) : (
                              <div className="p-12 text-center flex flex-col justify-center items-center space-y-2 h-full text-slate-500 text-[11px]">
                                <Layers size={18} className="text-slate-600" />
                                <p>To comparative test alternative alignments, verify you have at least 4 items saved inside your wardrobe catalog database.</p>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB 3: COMMERCE INTELLIGENCE - GAP COMPLETION */}
                  {activeStudioTab === 'commerce' && (() => {
                    const missingGaps = MissingItemDetector.scanForWardrobeGaps(displaySuggested, weather);
                    const matchedCatalogProducts = CatalogMatcher.matchSuggestions(missingGaps.map(g => g.categoryName));
                    const commerceBundle = BundleGenerator.generateCompleterBundle(matchedCatalogProducts);
                    return (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h5 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <ShoppingBag size={12} className="text-amber-400" /> Wardrobe Gaps & completion products
                          </h5>
                          
                          <span className="bg-amber-950/40 border border-amber-900/35 text-amber-500 py-0.5 px-2 rounded-md font-mono text-[8px] font-bold uppercase">
                            GAP COUNT: {missingGaps.length} GAPS DETECTED
                          </span>
                        </div>

                        {missingGaps.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                            <CheckCheck className="text-emerald-500" size={28} />
                            <p className="font-bold text-slate-200">Styling Completeness 100%</p>
                            <p className="text-[10px] text-slate-500 max-w-sm">
                              Wow! Your active recommended outfit possesses full layered coverage (Casual tops, pants, and meteorological protective outerwear). No gaps found.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            
                            {/* Missing categories checklist */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {missingGaps.map((gap, idx) => (
                                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-red-950/20 text-[10px] space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-200 tracking-tight uppercase flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {gap.categoryName} Deficit
                                    </span>
                                    <span className={`text-[8px] font-mono font-bold uppercase py-0.25 px-1.5 rounded ${
                                      gap.severity === 'high' ? 'bg-red-950 text-red-400' : 'bg-slate-800 text-slate-400'
                                    }`}>{gap.severity}</span>
                                  </div>
                                  <p className="text-slate-400 font-light">{gap.rationale}</p>
                                </div>
                              ))}
                            </div>

                            {/* Curation match catalog suggestions with Automated set Discount Bundle */}
                            {commerceBundle && (
                              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-4" id="shoppable-discount-bundle">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
                                  <div>
                                    <h6 className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
                                      <Tag className="text-amber-500" size={13} /> Set Completer completion Bundle (Save {commerceBundle.discountRatePercent}%)
                                    </h6>
                                    <p className="text-[9px] text-slate-400 mt-0.5">{commerceBundle.promoHeadline}</p>
                                  </div>
                                  <span className="bg-teal-950/30 text-teal-400 border border-teal-900/30 text-[9px] font-bold py-1 px-3.5 rounded-lg font-mono">
                                    Save ${commerceBundle.savingUsd} USD
                                  </span>
                                </div>

                                {/* Bundle Items Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {commerceBundle.items.map(prod => (
                                    <div key={prod.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[10px] flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-10 rounded bg-slate-950 shrink-0 border border-slate-800 flex items-center justify-center text-slate-600 font-bold font-mono">
                                          ${prod.priceUsd}
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-200 truncate max-w-[140px]">{prod.name}</p>
                                          <p className="text-[8px] font-light text-slate-400">{prod.curationLabel}</p>
                                        </div>
                                      </div>
                                      <span className="font-mono text-slate-300 font-bold">${prod.priceUsd.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Interaction Checkout simulator */}
                                <div className="pt-3 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                    <span className="text-[8px] text-slate-500 font-mono block">SET PROMOTIONAL TOTAL</span>
                                    <span className="text-sm font-bold font-mono text-slate-200">
                                      <span className="line-through text-slate-550 mr-1.5 text-xs">${commerceBundle.subtotal.toFixed(2)}</span> 
                                      <span className="text-teal-400">${commerceBundle.finalPrice.toFixed(2)}</span> USD
                                    </span>
                                  </div>

                                  {commerciallySimulated ? (
                                    <div className="text-[10px] font-mono text-teal-400 flex items-center gap-1 bg-teal-950/20 border border-teal-900/30 py-1.5 px-3 rounded-lg">
                                      <CheckCircle2 size={12} /> Complete Bundle coordinates cloned to closet wardrobe!
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        setCommerciallySimulated(true);
                                        await VisualDecisionAnalytics.logInteraction(userId, 'bundle_purchase_simulate', { bundlePrice: commerceBundle.finalPrice, items: commerceBundle.items.map(i => i.id) });
                                        
                                        // Refresh stats
                                        const statsObj = await VisualDecisionAnalytics.getVisualOutcomeScore(userId);
                                        setVisualStats(statsObj);
                                        
                                        setTimeout(() => setCommerciallySimulated(false), 6000);
                                      }}
                                      className="py-2.5 px-4 bg-teal-650 hover:bg-teal-700 text-slate-950 font-black rounded-lg text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-500/10"
                                    >
                                      <CreditCard size={12} /> Purchase Set complete Bundle
                                    </button>
                                  )}
                                </div>

                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* TAB 4: TRIP EXECUTION & CHECKLIST */}
                  {activeStudioTab === 'execution' && (() => {
                    const blueprint = ExecutionPlanner.compileBlueprint(wardrobe.length > 0 ? wardrobe : displaySuggested, 3, [agenda, 'Weekend Cafe Walk', 'Evening Dinner Lounge']);
                    return (
                      <div className="space-y-5" id="trip-wear-execution-scheduler">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h5 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Luggage size={12} className="text-emerald-400" /> Coordinated multi-day scheduler & packing checklist
                          </h5>
                          
                          <div className="bg-emerald-950/40 text-emerald-400 py-1 px-3.5 rounded-lg text-[10px] font-mono border border-emerald-900/35">
                            Baggage recommendation: <span className="font-bold text-white uppercase">{blueprint.packingChecklist.luggageTypeRecommended}</span> ({blueprint.packingChecklist.estimatedWeightKg}kg calculated weight)
                          </div>
                        </div>

                        {/* Travel Multi-day grids split */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          
                          {/* Left column: 3 day scheduling agenda logs */}
                          <div className="md:col-span-7 space-y-3">
                            <span className="text-[8px] font-mono text-slate-500 uppercase font-black block">Rotation visual calendar</span>
                            
                            <div className="space-y-2">
                              {blueprint.wearPlan.schedules.map((dayPlan) => (
                                <div key={dayPlan.dayNumber} className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center text-[9px] font-mono font-black border border-emerald-900/30">{dayPlan.dayNumber}</span>
                                      <span className="text-xs font-bold text-slate-200">{dayPlan.dayName}</span>
                                    </div>
                                    <span className="text-[8px] font-mono bg-slate-900 text-slate-400 py-0.5 px-2 rounded uppercase">{dayPlan.vibeTag}</span>
                                  </div>

                                  <div className="text-[10px] text-slate-400 flex justify-between gap-2">
                                    <span>Target Event: <strong className="text-slate-300 font-medium">{dayPlan.agenda}</strong></span>
                                    <span className="italic text-slate-500">{dayPlan.packingLayerHint}</span>
                                  </div>

                                  {/* Items assigned list */}
                                  <div className="flex flex-wrap gap-1">
                                    {dayPlan.suggestedItems.map(item => (
                                      <span key={item.id} className="text-[8px] font-mono py-0.5 px-2 bg-slate-900 border border-slate-800 text-slate-300 rounded font-bold">
                                        {item.title}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right column: Checklist checks */}
                          <div className="md:col-span-5 space-y-4">
                            <span className="text-[8px] font-mono text-slate-500 uppercase font-black block">Trip Suitcase Checklist</span>
                            
                            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-3.5">
                              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                {blueprint.packingChecklist.packingChecklist.length === 0 ? (
                                  <p className="text-[10px] text-slate-500 italic text-center">Empty clothes catalog. Populate items first.</p>
                                ) : (
                                  blueprint.packingChecklist.packingChecklist.map((packItem) => (
                                    <div key={packItem.item.id} className="flex items-center justify-between text-[10px] border-b border-slate-900 pb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: packItem.item.primaryColor || '#94A3B8' }} />
                                        <span className="truncate max-w-[120px] text-slate-300 font-bold">{packItem.item.title}</span>
                                      </div>
                                      <span className="text-[8px] font-mono uppercase bg-slate-900 text-slate-500 py-0.5 px-1.5 rounded-md font-bold">{packItem.priority}</span>
                                    </div>
                                  ))
                                )}
                              </div>

                              <div className="pt-2 border-t border-slate-900 text-[10px] font-light text-slate-400 leading-relaxed italic">
                                💡 <strong className="font-bold text-slate-300">Space Hack:</strong> {blueprint.packingChecklist.layeringStrategyAdvised}
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* VISUAL OS TELEMETRY INDICATORS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-slate-900 border border-slate-800 p-4.5 rounded-2xl" id="l4-visual-observability-telemetry">
                  
                  {/* Open Count metrics card */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center relative overflow-hidden">
                    <span className="text-[8px] font-mono uppercase text-slate-500 font-black tracking-wider block">Visual Engagements count</span>
                    <span className="text-lg font-bold font-mono text-slate-200 block mt-1">{visualStats.totalInteractionsCount} interactions</span>
                    <p className="text-[8px] text-slate-500 mt-1">Traces live preview opens, scenario comparisons and budget set completer clicks.</p>
                  </div>

                  {/* Completion rate meter */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
                    <span className="text-[8px] font-mono uppercase text-slate-500 font-black tracking-wider block">Visual Conversion efficiency</span>
                    <span className="text-lg font-bold font-mono text-blue-400 block mt-1">{visualStats.completionRate_percent}% Rating</span>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${visualStats.completionRate_percent}%` }}></div>
                    </div>
                  </div>

                  {/* Visual outcome score calculation */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600/10 text-blue-400 text-[8px] font-serif font-black px-2 py-0.5 border-b border-l border-slate-850 uppercase">
                      L4 ACTIVE
                    </div>
                    <span className="text-[8px] font-mono uppercase text-slate-500 font-black tracking-wider block">Unified telemetry VOS</span>
                    <span className="text-lg font-bold font-mono text-indigo-400 block mt-1">{visualStats.score}/100</span>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${visualStats.score}%` }}></div>
                    </div>
                  </div>

                </div>

              </div>
            )}

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
