/**
 * LOOK VISION v2.4 - Developer & Preview Persona Switcher Widget
 * Floating developer toolbar allowing instant switching between demo personas.
 */

import React, { useState } from 'react';
import { usePersonaSimulation } from '../../features/simulation/PersonaSimulationContext';
import { DemoPersonaId } from '../../features/simulation/personaSimulationTypes';
import { UserCheck, Sparkles, Cpu, Leaf, Crown, RefreshCw, Layers, ShieldCheck, ChevronDown, ChevronUp, Zap } from 'lucide-react';

export const PersonaSwitcherWidget: React.FC = () => {
  const {
    activePersonaId,
    activePersona,
    allPersonas,
    setPersona,
    isSyncing,
    syncStatusMessage,
    operatingMode,
    setOperatingMode,
    productionUserState
  } = usePersonaSimulation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getPersonaIcon = (id: DemoPersonaId) => {
    switch (id) {
      case 'LUXURY_MINIMALIST':
        return <Crown className="w-3.5 h-3.5 text-amber-400" />;
      case 'CYBER_FUTURISTIC':
        return <Zap className="w-3.5 h-3.5 text-indigo-400" />;
      case 'NATURE_ORGANIC':
        return <Leaf className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getPersonaBadgeColor = (id: DemoPersonaId) => {
    switch (id) {
      case 'LUXURY_MINIMALIST':
        return 'border-amber-500/30 text-amber-300 bg-amber-950/20';
      case 'CYBER_FUTURISTIC':
        return 'border-indigo-500/30 text-indigo-300 bg-indigo-950/20';
      case 'NATURE_ORGANIC':
        return 'border-emerald-500/30 text-emerald-300 bg-emerald-950/20';
      default:
        return 'border-emerald-500/30 text-emerald-300 bg-emerald-950/20';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans select-none animate-fade-in" id="persona-switcher-widget">
      {/* Floating Minimized Bar / Trigger */}
      <div className="flex items-center gap-2 bg-[#06060c]/90 backdrop-blur-md border border-white/10 p-1.5 rounded-full shadow-2xl hover:border-white/20 transition-all duration-300">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-medium cursor-pointer transition-colors"
          title="Toggle Multi-User Reality Simulation Toolbar"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${operatingMode === 'PRODUCTION_USER' ? 'bg-emerald-400' : 'bg-indigo-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${operatingMode === 'PRODUCTION_USER' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
          </span>
          <span className="text-[10px] font-mono tracking-wider uppercase text-white/50">
            {operatingMode === 'PRODUCTION_USER' ? 'Prod Mode:' : 'Dev Sim:'}
          </span>
          <span className="flex items-center gap-1.5 text-white font-medium text-xs">
            {operatingMode === 'PRODUCTION_USER' ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : getPersonaIcon(activePersonaId)}
            {activePersona.name}
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-white/50" /> : <ChevronUp className="w-3.5 h-3.5 text-white/50" />}
        </button>

        {/* Quick Mode Toggle Pills */}
        {!isOpen && (
          <div className="hidden md:flex items-center gap-1 pr-1">
            <button
              onClick={() => setOperatingMode(operatingMode === 'PRODUCTION_USER' ? 'DEVELOPER_SIMULATION' : 'PRODUCTION_USER')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-tight transition-all duration-200 cursor-pointer flex items-center gap-1 border ${
                operatingMode === 'PRODUCTION_USER'
                  ? 'border-emerald-500/30 text-emerald-300 bg-emerald-950/20 font-semibold'
                  : 'border-indigo-500/30 text-indigo-300 bg-indigo-950/20'
              }`}
            >
              {operatingMode === 'PRODUCTION_USER' ? <ShieldCheck className="w-3 h-3 text-emerald-400" /> : <Cpu className="w-3 h-3 text-indigo-400" />}
              <span>{operatingMode === 'PRODUCTION_USER' ? 'User Mode' : 'Dev Sim Mode'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Expanded Multi-User Simulation Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 md:w-96 bg-[#07070d] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <div>
                <h4 className="text-xs font-semibold tracking-wide uppercase font-mono text-white/90">Identity & Simulation Engine</h4>
                <p className="text-[10px] text-white/40 font-mono">LOOK VISION v2.4 Architecture</p>
              </div>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[10px] font-mono text-white/40 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/5 cursor-pointer"
            >
              {showDetails ? 'Hide DNA' : 'Inspect DNA'}
            </button>
          </div>

          {/* Mode Selector Switch */}
          <div className="bg-black/40 p-1.5 rounded-xl border border-white/10 grid grid-cols-2 gap-1 font-mono text-[10.5px]">
            <button
              onClick={() => setOperatingMode('PRODUCTION_USER')}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                operatingMode === 'PRODUCTION_USER'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Production User</span>
            </button>
            <button
              onClick={() => setOperatingMode('DEVELOPER_SIMULATION')}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                operatingMode === 'DEVELOPER_SIMULATION'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold shadow-sm'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Developer Sim</span>
            </button>
          </div>

          {/* Sync Status Alert */}
          {syncStatusMessage && (
            <div className="bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono p-2 rounded-lg flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 text-indigo-400" />
              <span className="truncate">{syncStatusMessage}</span>
            </div>
          )}

          {/* Mode 1: Production User Identity */}
          {operatingMode === 'PRODUCTION_USER' ? (
            <div className="space-y-3 bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">Active Production User</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase border border-emerald-500/30 text-emerald-300 bg-emerald-950/40">
                  Firebase Sync Ready
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={activePersona.avatar}
                  alt={activePersona.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/30 shrink-0"
                />
                <div>
                  <h5 className="text-xs font-semibold text-white">{activePersona.name}</h5>
                  <p className="text-[10px] text-white/50 font-mono truncate">{activePersona.userId}</p>
                  <p className="text-[10px] text-emerald-300/80 font-mono mt-0.5">Style DNA: {activePersona.styleDNA.primaryVibe}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Mode 2: Developer Simulation Personas */
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">Select Demo User Persona</label>
              <div className="grid grid-cols-1 gap-2">
                {allPersonas.map(persona => {
                  const isActive = activePersonaId === persona.id;
                  return (
                    <div
                      key={persona.id}
                      onClick={() => setPersona(persona.id)}
                      className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'border-indigo-500/50 bg-indigo-950/20 shadow-lg shadow-indigo-500/5'
                          : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={persona.avatar}
                          alt={persona.name}
                          className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-white">{persona.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase border ${getPersonaBadgeColor(persona.id)}`}>
                              {persona.themeProfile.activeThemeName}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50 line-clamp-1">{persona.styleDNA.primaryVibe}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono text-[10px] text-white/40">
                        <span className="block text-indigo-300 font-semibold">{persona.ariaProfile.accuracyEstimate}% DNA</span>
                        <span className="block text-[9px] text-white/30 uppercase">{persona.ariaProfile.reasoningMode.split('_')[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Persona Style DNA & ARIA Details Inspector */}
          {showDetails && activePersona && (
            <div className="pt-2 border-t border-white/10 space-y-3 font-mono text-[11px] bg-white/[0.01] p-3 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-white/40 uppercase tracking-wider text-[10px]">Active User ID:</span>
                <span className="text-indigo-300 font-semibold">{activePersona.userId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40 uppercase tracking-wider text-[10px]">ARIA Agent:</span>
                <span className="text-white/80">{activePersona.ariaProfile.agentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40 uppercase tracking-wider text-[10px]">Formality / Experimental:</span>
                <span className="text-white/80">{activePersona.styleDNA.formalityPreference * 100}% / {activePersona.styleDNA.experimentalIndex * 100}%</span>
              </div>
              <div>
                <span className="text-white/40 uppercase tracking-wider text-[10px] block mb-1">Favorite Palette:</span>
                <div className="flex flex-wrap gap-1">
                  {activePersona.styleDNA.favColors.map((color, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/70">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-white/40 uppercase tracking-wider text-[10px] block mb-1">Firestore Schema Paths:</span>
                <div className="text-[9.5px] text-emerald-400/80 bg-black/40 p-2 rounded border border-emerald-500/10 space-y-0.5">
                  <p>users/{activePersona.userId}/identity/profile</p>
                  <p>users/{activePersona.userId}/styleDNA/profile</p>
                  <p>users/{activePersona.userId}/themeProfile/active</p>
                  <p>users/{activePersona.userId}/ariaProfile/context</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="flex items-center justify-between text-[10px] font-mono text-white/30 pt-1 border-t border-white/5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Firestore User Identity Engine Active
            </span>
            <span>v2.4.0</span>
          </div>
        </div>
      )}
    </div>
  );
};
