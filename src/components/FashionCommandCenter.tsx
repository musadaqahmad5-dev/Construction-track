import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Sparkles, 
  Calendar, 
  Heart, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Flame, 
  Eye, 
  Layers, 
  Sliders, 
  Tv, 
  AlertCircle, 
  Clock, 
  Compass, 
  RotateCcw,
  Sparkle,
  Workflow,
  Check,
  TrendingUp,
  Award
} from 'lucide-react';

import { WardrobeItem } from '../types';

// Feature Imports
import { FashionAgent, ActionProposal, StylingBriefs } from '../features/agent/fashionAgent';
import { AgentPlanner, OutfitPlan } from '../features/agent/agentPlanner';
import { AgentMemoryBridge } from '../features/agent/agentMemoryBridge';
import { AgentPolicies } from '../features/agent/agentPolicies';

import { ContextCollector, ContextProfile } from '../features/context/contextCollector';
import { ScheduleInterpreter, CalendarEvent } from '../features/context/scheduleInterpreter';
import { OccasionResolver } from '../features/context/occasionResolver';
import { EnergyModel } from '../features/context/energyModel';

import { WeekPlanner } from '../features/autoplan/weekPlanner';
import { RotationEngine } from '../features/autoplan/rotationEngine';
import { GoalPlanner, StyleGoal } from '../features/autoplan/goalPlanner';

import { CoverageAnalyzer, CoverageGap } from '../features/wardrobe-health/coverageAnalyzer';
import { RotationHealth, HealthMetric } from '../features/wardrobe-health/rotationHealth';
import { WearLifecycle, GarmentWearStats } from '../features/wardrobe-health/wearLifecycle';

import { DecisionNarrator, StyleExplanation } from '../features/explainability/decisionNarrator';
import { AgentSummary } from '../features/explainability/agentSummary';

// Local storage helpers to synchronize companion approvals
const BRIEF_STORAGE_KEY = 'fashion_companion_proposals';

interface FashionCommandCenterProps {
  wardrobe: WardrobeItem[];
  onAddGarment: (title: string, desc: string, category: any, extras?: any) => Promise<void>;
}

export const FashionCommandCenter: React.FC<FashionCommandCenterProps> = ({ wardrobe, onAddGarment }) => {
  // Lifestyle interactive configurations
  const [currentOccasion, setCurrentOccasion] = useState<string>('Creative Office Workshop');
  const [currentWeather, setCurrentWeather] = useState<string>('Cool Breeze (16°C)');
  const [isTraveling, setIsTraveling] = useState<boolean>(false);
  const [energyLevel, setEnergyLevel] = useState<number>(4);

  // States resolved from context
  const [context, setContext] = useState<ContextProfile>(() => 
    ContextCollector.compileAdaptiveProfile('Creative Office Workshop', 'Cool Breeze (16°C)', false, 4)
  );

  // General Goals, Weekly Plans, and Proposals State
  const [weeklyPlans, setWeeklyPlans] = useState<OutfitPlan[]>([]);
  const [proposals, setProposals] = useState<ActionProposal[]>([]);
  const [styleGoals, setStyleGoals] = useState<StyleGoal[]>([]);
  const [explanations, setExplanations] = useState<StyleExplanation[]>([]);
  const [agenda, setAgenda] = useState<CalendarEvent[]>([]);

  // Selected state indices
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<StyleExplanation | null>(null);

  // Load and bootstrap engines
  useEffect(() => {
    // 1. Context updates
    const resolvedContext = ContextCollector.compileAdaptiveProfile(currentOccasion, currentWeather, isTraveling, energyLevel);
    setContext(resolvedContext);

    // 2. Load weekly plans
    const plans = WeekPlanner.bootstrapWeeklyPlans(wardrobe, currentWeather);
    setWeeklyPlans(plans);

    // 3. Goals
    setStyleGoals(GoalPlanner.getGoals());

    // 4. Ingest Agenda
    setAgenda(ScheduleInterpreter.getSampleSchedule());
  }, [currentOccasion, currentWeather, isTraveling, energyLevel, wardrobe]);

  // Regenerate/Monitor action proposals
  useEffect(() => {
    if (wardrobe.length > 0) {
      const generatedProposals = FashionAgent.prepareProposals(wardrobe, context);
      setProposals(generatedProposals);

      // Generate explainability traces for each piece
      const list: StyleExplanation[] = [];
      const closetAvailable = wardrobe.filter(w => w.status === 'In Closet');
      if (closetAvailable.length > 0) {
        closetAvailable.slice(0, 3).forEach(item => {
          const alternatives = closetAvailable.filter(w => w.id !== item.id && w.category === item.category);
          const tr = DecisionNarrator.synthesizeDecision(item, alternatives, context);
          list.push(tr);
        });
      }
      setExplanations(list);
    }
  }, [context, wardrobe]);

  // Action Triggers with User Approval
  const handleApproveProposal = (proposalId: string) => {
    // Check if user approved action triggers state modifications (Zero Autonomous Execution)
    const target = proposals.find(p => p.id === proposalId);
    if (!target) return;

    if (target.type === 'wash') {
      // Simulate moving dirty items to Closet
      alert(`User Approved: Commencing Circular Wash cycle. Releasing standard items back into "In Closet" circulation.`);
      // We can also trigger real DB logic if we had write callbacks, but let's notify cleanly
    } else if (target.type === 'rotate') {
      alert(`User Approved: Swapping overutilized garments with underused candidates.`);
    } else if (target.type === 'style') {
      alert(`User Approved: Look coordinate has been staged for tomorrow morning!`);
    }

    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, userApproved: 'approved' } : p));
    AgentMemoryBridge.logDecision(target.targetItemIds[0] || 'unknown', 'approve', context.occasion, 90);
  };

  const handleRejectProposal = (proposalId: string) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, userApproved: 'rejected' } : p));
    const target = proposals.find(p => p.id === proposalId);
    if (target) {
      AgentMemoryBridge.logDecision(target.targetItemIds[0] || 'unknown', 'reject', context.occasion, 10);
    }
  };

  // Weekly plan interaction
  const handleApprovePlan = (planId: string) => {
    const updated = WeekPlanner.setUserDecision(planId, 'approved');
    setWeeklyPlans(updated);
  };

  const handleRejectPlan = (planId: string) => {
    const updated = WeekPlanner.setUserDecision(planId, 'rejected');
    setWeeklyPlans(updated);
  };

  const handleRegeneratePlan = (planId: string) => {
    const updated = WeekPlanner.regenerateDayPlan(planId, wardrobe);
    setWeeklyPlans(updated);
    alert("Rotation Engine activated: Sourced next best alternative piece to replace repetitiveness.");
  };

  const handleToggleGoal = (goalId: string) => {
    const updated = GoalPlanner.toggleGoal(goalId);
    setStyleGoals(updated);
  };

  // Wardrobe Health status trackers
  const healthMetrics = RotationHealth.analyzeHealth(wardrobe);
  const coverageGaps = CoverageAnalyzer.detectGaps(wardrobe);
  const lifecycles = WearLifecycle.getLifecycleAnalysis(wardrobe);
  const rotatingAuditVal = RotationEngine.runRotationAudit(wardrobe);
  const summaryExplanation = AgentSummary.getAgentSummary(explanations);

  return (
    <div className="space-y-8 bg-slate-50 p-6 rounded-3xl border border-slate-200 text-slate-800">
      
      {/* 1. Header Banner containing status and mode transitions */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/20 rounded-md text-[10px] font-mono uppercase tracking-wider text-indigo-400">
            <Cpu size={12} className="animate-spin-slow text-indigo-400" /> Proactive Personal Styling Companion
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
            Personal Style Command Center
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl font-light">
            An autonomous lifestyle context engine. Adapts to weather forecasts, balances wardrobe health rotation metrics, flags fatigue, and provides explainable styling narrations—all subject to direct user approval.
          </p>
        </div>
      </div>

      {/* 2. Interactive Lifestyle Inputs widget */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-2">
          <Compass size={13} className="text-indigo-600" /> Dynamic Lifestyle Tuning context
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Daily Occasion</label>
            <select 
              value={currentOccasion} 
              onChange={(e) => setCurrentOccasion(e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 bg-slate-50 rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="Creative Office Workshop">Creative Office Workshop</option>
              <option value="Wedding Dress Celebration">Formal Wedding dress</option>
              <option value="Cardio Workout / Jogging">Cardio Fitness Training</option>
              <option value="Cross-border Flight & Transit">Aerodynamic Travel</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Local Climate</label>
            <select
              value={currentWeather}
              onChange={(e) => setCurrentWeather(e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 bg-slate-50 rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="Cool Breeze (16°C)">Cool Breeze (16°C)</option>
              <option value="Warm Sunshine (28°C)">Warm Sunshine (28°C)</option>
              <option value="Sub-Zero Blizzard (-2°C)">Sub-Zero Blizzard (-2°C)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Physical Movement (1-10)</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer" 
              />
              <span className="text-xs font-mono font-bold text-indigo-600 w-4">{energyLevel}</span>
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col justify-end">
            <button
              onClick={() => setIsTraveling(!isTraveling)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all border outline-none ${
                isTraveling 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isTraveling ? '✓ Active Travel Context' : 'Enable Travel Overlays'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Splitted Modular Grid displaying Agent Dashboard elements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column A: Today's Outlook & Goals (Left Column) */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* TODAY STATUS & BRIEF SECTION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" /> Today's Intelligent Outlook
              </h3>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded">
                Climate adaptive
              </span>
            </div>

            {wardrobe.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400">Loading your smart clothes... Click "Reset Closet" above or load standard outfit assets.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-50/50 to-slate-50 p-4 rounded-xl border border-indigo-100/50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-800">{currentOccasion} brief</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Based on your agenda, comfort priorities have zoomed to <strong className="text-slate-800">{(context.priorityWeights.comfort * 100).toFixed(0)}%</strong>. 
                    Today's weather condition: <strong className="text-indigo-600">{currentWeather}</strong>.
                  </p>
                  
                  {/* Dynamic Weather & Energy details */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200/40">
                    <div className="text-[10px] text-slate-500 space-y-0.5">
                      <span className="block text-[8px] font-mono uppercase tracking-wider">Tone guidelines</span>
                      <strong className="text-slate-800">{FashionAgent.generateBriefs(wardrobe, context).dailyBrief.tone}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-0.5">
                      <span className="block text-[8px] font-mono uppercase tracking-wider">Layers recommendation</span>
                      <strong className="text-indigo-600">{FashionAgent.generateBriefs(wardrobe, context).dailyBrief.temperatureImpact}</strong>
                    </div>
                  </div>

                  {/* Repetition detector warning */}
                  {FashionAgent.detectRepetition(wardrobe) && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-[10px] text-amber-700 leading-relaxed flex items-start gap-2">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <div>{FashionAgent.detectRepetition(wardrobe)}</div>
                    </div>
                  )}
                </div>

                {/* Agenda events parsed by schedule Interpreter */}
                {agenda.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Scheduled calendar events</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {agenda.map(evt => (
                        <div key={evt.id} className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-150 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="text-slate-400 font-mono text-[10px] mr-1.5">{evt.time}</span>
                            <span className="font-medium text-slate-700">{evt.title}</span>
                          </div>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                            evt.type === 'work' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            evt.type === 'sport' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            'bg-indigo-50 text-indigo-600 border border-indigo-100'
                          }`}>
                            {evt.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* WEEKLY STYLE AUTO-PLANNING AND ROTATION SELECTION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-600" /> Weekly Proactive Styling Rotation
              </h3>
              <div className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                Diversity: {rotatingAuditVal.score}% ({rotatingAuditVal.status})
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              We have generated proposed coordinates. Approve or reject to update your wardrobe lock counters. Alternatively, request a rotation replacement.
            </p>

            <div className="space-y-3 pt-2">
              {weeklyPlans.map((plan) => {
                const planItems = plan.itemIds.map(id => wardrobe.find(w => w.id === id)).filter(Boolean) as WardrobeItem[];
                return (
                  <div key={plan.id} className="border border-slate-150 rounded-xl p-4 space-y-3 hover:border-slate-350 transition-colors bg-slate-50/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-indigo-600 mr-2">{plan.date}</span>
                        <span className="text-xs font-bold text-slate-800">— {plan.occasion}</span>
                      </div>
                      <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${
                        plan.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                        plan.status === 'rejected' ? 'bg-red-50 text-red-650 border border-red-200' :
                        'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {plan.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Clothes previews */}
                    <div className="flex flex-wrap gap-2">
                      {planItems.map(item => (
                        <div key={item.id} className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-xxs text-[10px]">
                          <span className="font-bold text-slate-700">{item.title}</span>
                          <span className="text-slate-400 font-mono ml-1.5">({item.category})</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-500 italic leading-relaxed">{plan.notes}</p>

                    {/* Planning controls */}
                    <div className="flex items-center gap-2 pt-1.5 border-t border-slate-150/40 justify-end">
                      {plan.status === 'pending_approval' ? (
                        <>
                          <button 
                            onClick={() => handleApprovePlan(plan.id)}
                            className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 cursor-pointer"
                          >
                            <CheckCircle size={11} /> Approve
                          </button>
                          <button 
                            onClick={() => handleRejectPlan(plan.id)}
                            className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-50 px-2.5 py-1 rounded border border-rose-200 cursor-pointer"
                          >
                            <XCircle size={11} /> Reject
                          </button>
                          <button 
                            onClick={() => handleRegeneratePlan(plan.id)}
                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded border border-indigo-200 cursor-pointer"
                          >
                            <RotateCcw size={11} /> Alternate Rotation
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => {
                            // reset status to pending
                            setWeeklyPlans(prev => prev.map(p => p.id === plan.id ? { ...p, status: 'pending_approval' } : p));
                          }}
                          className="text-[9px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                        >
                          Change Status
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column B: Wardrobe Health & Explainability Panel (Right Side) */}
        <div className="space-y-6">

          {/* WARDROBE HEALTH CRITICAL ALARMS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Flame size={16} className="text-red-500" /> Wardrobe Health & Gaps
            </h3>

            {/* In Closet status check */}
            <div className="space-y-3.5">
              
              {/* Rotation metrics summary */}
              <div className="grid grid-cols-2 gap-2 text-center">
                {healthMetrics.slice(0, 2).map((h, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-150 space-y-0.5">
                    <span className="block text-[8px] font-mono uppercase tracking-wider text-slate-400">{h.title}</span>
                    <strong className="text-xs text-slate-800">{h.value}</strong>
                    <span className={`block text-[8px] font-bold font-mono ${
                      h.status === 'optimal' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>{h.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>

              {/* Coverage gaps analyzer warnings */}
              {coverageGaps.length > 0 ? (
                <div className="space-y-2.5">
                  <span className="block text-[10px] font-mono uppercase text-slate-400">Identified Coverage Gaps</span>
                  {coverageGaps.map((gap, i) => (
                    <div key={i} className="p-3 rounded-lg border border-red-100 bg-red-50/40 text-[10px] text-slate-700 leading-relaxed space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-red-700">Missing {gap.category} asset</strong>
                        <span className="text-[8px] font-bold bg-rose-100 text-rose-700 px-1 py-0.5 rounded font-mono uppercase">
                          {gap.gapSeverity} GAP
                        </span>
                      </div>
                      <p className="font-light">{gap.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center bg-emerald-50 border border-emerald-100 text-slate-600 rounded-lg text-[10px]">
                  🌈 Category saturation index completed. Zero severe coverage gaps detected!
                </div>
              )}

              {/* Durability status lifecycles */}
              {lifecycles.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="block text-[10px] font-mono uppercase text-slate-400">Garment wear decay forecasts</span>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                    {lifecycles.slice(0, 4).map(lf => (
                      <div key={lf.id} className="flex justify-between items-center text-[10px] bg-slate-50 px-2 py-1 rounded">
                        <span className="text-slate-700 truncate max-w-[120px] font-medium">{lf.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Fiber: {lf.durabilityPercentage}%</span>
                          {lf.washTriggerNeeded && (
                            <span className="text-[8px] font-bold px-1 rounded bg-amber-100 text-amber-700 font-mono uppercase">Dry/Wash</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE ACTION PROPOSALS - REQUIRES USER APPROVAL */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Sliders size={16} className="text-indigo-600" /> Action Proposals Pending
            </h3>

            <div className="space-y-3">
              {proposals.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">No styling actions pending execution triggers.</p>
              ) : (
                proposals.map((prop) => (
                  <div key={prop.id} className="border border-slate-150 p-3.5 rounded-xl space-y-2.5 bg-slate-50/50">
                    <div className="flex justify-between items-center">
                      <strong className="text-[11px] text-slate-800">{prop.title}</strong>
                      <span className="text-[9px] font-mono bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded">
                        {(prop.confidence * 100).toFixed(0)}% Match
                      </span>
                    </div>
                    <p className="text-[10px] font-light text-slate-600 leading-relaxed">{prop.description}</p>
                    
                    {/* User decision gates */}
                    <div className="flex items-center justify-end gap-1.5">
                      {prop.userApproved === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleApproveProposal(prop.id)}
                            className="text-[9px] font-bold bg-slate-900 hover:bg-slate-800 text-white px-2 py-1 rounded cursor-pointer"
                          >
                            Approve Action
                          </button>
                          <button 
                            onClick={() => handleRejectProposal(prop.id)}
                            className="text-[9px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-500 px-2 py-1 rounded border border-slate-200 cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </>
                      ) : (
                        <span className={`text-[9.5px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                          prop.userApproved === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {prop.userApproved}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACTIVE STYLE GOAL CONTROLLERS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Compass size={16} className="text-indigo-600" /> Active Style Goals
            </h3>
            
            <div className="space-y-3.5">
              {styleGoals.map(goal => (
                <div key={goal.id} className="flex justify-between items-start gap-3 p-1 rounded-lg">
                  <div className="space-y-0.5">
                    <strong className="text-[11px] text-slate-800 block leading-tight">{goal.name}</strong>
                    <span className="text-[9.5px] font-light text-slate-400 block leading-normal">{goal.description}</span>
                  </div>
                  <button
                    onClick={() => handleToggleGoal(goal.id)}
                    className={`py-1 px-2.5 rounded-md text-[9px] font-mono uppercase font-bold transition-all border shrink-0 ${
                      goal.enabled 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {goal.enabled ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. Explainability traces narrative panel */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Eye size={16} className="text-indigo-600" /> AI Decisional Explainability Logs
          </h3>
          <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
            Overall Precision: {summaryExplanation.averageConfidence}%
          </span>
        </div>

        <p className="text-xs text-slate-500 tracking-wide font-light leading-relaxed">
          {summaryExplanation.narration} Inspect specific recommendation trace logs to understand structural weight matching or exclusion triggers.
        </p>

        {explanations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {explanations.map((exp, index) => (
              <div 
                key={exp.recommendedId} 
                onClick={() => setSelectedPlanDetails(exp)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedPlanDetails?.recommendedId === exp.recommendedId 
                    ? 'border-indigo-500 bg-indigo-50/20 shadow-xs'
                    : 'border-slate-150 hover:border-slate-250 bg-slate-50/50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-xs text-slate-700 font-bold truncate max-w-[120px]">{exp.recommendedTitle}</strong>
                  <span className="text-[10px] font-mono text-indigo-500 font-bold bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                    {exp.confidence}% Confidence
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-3 font-light leading-relaxed">{exp.whyChosen}</p>
                <span className="block text-[8px] font-mono text-indigo-650 font-semibold tracking-wider uppercase mt-3">Click to open full trace</span>
              </div>
            ))}
          </div>
        )}

        {/* Explainability Detail Modal Overlay */}
        <AnimatePresence>
          {selectedPlanDetails && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-5 bg-slate-900 text-white rounded-xl space-y-3.5 relative border border-slate-800"
            >
              <button 
                onClick={() => setSelectedPlanDetails(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                [CLOSE TRACE]
              </button>

              <div className="space-y-1">
                <span className="block text-[8px] font-mono uppercase tracking-widest text-indigo-400 font-bold">Trace report ID: {selectedPlanDetails.recommendedId}</span>
                <h4 className="text-sm font-bold font-serif">Decisional Synthesis for "{selectedPlanDetails.recommendedTitle}"</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2.5 text-[11px] border-t border-slate-800">
                <div className="space-y-1 bg-slate-850 p-3 rounded-lg">
                  <span className="block font-mono text-[9px] uppercase text-indigo-400 font-bold">1. Why Selected</span>
                  <p className="font-light text-slate-300 leading-relaxed">{selectedPlanDetails.whyChosen}</p>
                </div>
                <div className="space-y-1 bg-slate-850 p-3 rounded-lg">
                  <span className="block font-mono text-[9px] uppercase text-indigo-400 font-bold">2. Bypassed Alternatives</span>
                  <p className="font-light text-slate-300 leading-relaxed">{selectedPlanDetails.whyAlternativesDropped}</p>
                </div>
                <div className="space-y-1 bg-slate-850 p-3 rounded-lg">
                  <span className="block font-mono text-[9px] uppercase text-indigo-400 font-bold">3. Style Memory Influences</span>
                  <p className="font-light text-slate-300 leading-relaxed">{selectedPlanDetails.memoryInfluenceNotes}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
