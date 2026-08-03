/**
 * ARIA v2.5 Digital Twin Dashboard
 * Product: LOOK VISION v2.4
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Cpu, Layers, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { digitalTwinEngine } from '../../aria/digitalTwin/DigitalTwinEngine';
import { DigitalTwinModel, DigitalTwinEngineStatus } from '../../aria/digitalTwin/DigitalTwinTypes';
import { FashionIdentityCard } from './FashionIdentityCard';
import { StyleEvolutionTimeline } from './StyleEvolutionTimeline';
import { WardrobeBehaviourPanel } from './WardrobeBehaviourPanel';
import { FashionForecastCard } from './FashionForecastCard';

interface DigitalTwinDashboardProps {
  userId?: string;
}

export const DigitalTwinDashboard: React.FC<DigitalTwinDashboardProps> = ({ userId = 'guest_user' }) => {
  const [twin, setTwin] = useState<DigitalTwinModel | null>(null);
  const [status, setStatus] = useState<DigitalTwinEngineStatus>(digitalTwinEngine.getStatus());
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadOrSynthesize = async (force: boolean = false) => {
    setIsSynthesizing(true);
    setErrorMsg(null);
    try {
      let model: DigitalTwinModel;
      if (force) {
        model = await digitalTwinEngine.synthesizeTwin(userId);
      } else {
        model = await digitalTwinEngine.initialize(userId);
      }
      setTwin(model);
      setStatus(digitalTwinEngine.getStatus());
    } catch (err: any) {
      console.error('[DigitalTwinDashboard] Synthesis error:', err);
      setErrorMsg(err.message || 'Failed to synthesize digital twin model.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  useEffect(() => {
    loadOrSynthesize(false);
  }, [userId]);

  return (
    <div className="space-y-6 text-left animate-fade-in max-w-7xl mx-auto">
      {/* Top Banner Control Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#05050a] via-[#090a14] to-[#05050a] border border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-indigo-500/30 text-indigo-300 shadow-lg">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-white tracking-wide">
                ARIA Fashion Digital Twin Intelligence
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                v2.5 Live
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Continuously evolving profile synthesizing Memory, Style DNA, Decision History, Creative & Vision Engines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadOrSynthesize(true)}
            disabled={isSynthesizing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-serif text-xs font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>{isSynthesizing ? 'Synthesizing Intelligence...' : 'Re-Analyze Digital Twin'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {twin ? (
        <div className="space-y-6">
          {/* Main Identity Hero Card */}
          <FashionIdentityCard twin={twin} />

          {/* Forecast Engine & Wardrobe Behaviour */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WardrobeBehaviourPanel insights={twin.wardrobeBehaviour} />
            <FashionForecastCard forecasts={twin.futureForecasts} />
          </div>

          {/* Timeline Evolution */}
          <StyleEvolutionTimeline milestones={twin.evolutionTimeline} />

          {/* Evidence Grid */}
          <div className="p-6 rounded-3xl bg-[#07070c] border border-white/5 space-y-3">
            <h4 className="text-xs font-serif font-semibold text-zinc-400 uppercase tracking-wider">
              Cross-Engine Grounding & Evidence
            </h4>
            <div className="flex flex-wrap gap-2">
              {twin.supportingEvidence.map((ev, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-mono flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{ev}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#07070c] border border-white/5 text-zinc-400 space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm font-serif">Synthesizing ARIA Digital Twin Intelligence...</p>
        </div>
      )}
    </div>
  );
};
