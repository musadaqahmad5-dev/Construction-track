/**
 * ARIA v2.5 Style DNA Profile View Component
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Dna, 
  RefreshCw, 
  Palette, 
  Scissors, 
  Shirt, 
  Box, 
  Sparkles, 
  Bookmark, 
  Clock, 
  ShieldCheck, 
  History, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { useARIAContext } from '../../aria/core/ARIAContext';
import { StyleConfidenceBadge } from './StyleConfidenceBadge';
import { StyleVectorCard } from './StyleVectorCard';
import { ColorIdentityPanel } from './ColorIdentityPanel';
import { FashionIdentityTimeline } from './FashionIdentityTimeline';

interface StyleDNAProfileProps {
  className?: string;
}

export const StyleDNAProfileComponent: React.FC<StyleDNAProfileProps> = ({
  className = ''
}) => {
  const { styleDNAProfile, styleDNASnapshots, refreshStyleDNA, styleDNAStatus } = useARIAContext();
  const [activeTab, setActiveTab] = useState<'VECTORS' | 'COLOR' | 'TIMELINE'>('VECTORS');

  if (!styleDNAProfile) {
    return (
      <div className={`p-6 rounded-3xl bg-[#05050a] border border-white/10 text-center space-y-3 ${className}`}>
        <Dna className="w-8 h-8 text-violet-400 animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-400">Loading Style DNA Profile...</p>
      </div>
    );
  }

  const p = styleDNAProfile;

  return (
    <div className={`space-y-6 text-left ${className}`}>
      {/* Header Banner */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-r from-violet-950/60 via-indigo-950/40 to-[#05050a] border border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 border border-violet-400 text-white shadow-lg shrink-0">
              <Dna className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold uppercase">
                  Version v{p.version}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold text-white uppercase tracking-wider mt-1">
                {p.identityName}
              </h2>
              <p className="text-xs text-zinc-400 font-serif italic mt-0.5">
                Structured personal fashion identity synthesized from explicit user signals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <StyleConfidenceBadge 
              confidence={p.overallConfidence} 
              evidenceCount={p.totalEvidenceCount}
            />

            <button
              onClick={() => refreshStyleDNA()}
              disabled={styleDNAStatus.isAnalyzing}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/30 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-mono"
            >
              <RefreshCw className={`w-4 h-4 ${styleDNAStatus.isAnalyzing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reanalyze</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'VECTORS', label: 'All Vectors', icon: Layers },
          { id: 'COLOR', label: 'Color Identity', icon: Palette },
          { id: 'TIMELINE', label: `Snapshots (${styleDNASnapshots.length})`, icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                isActive
                  ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.2)] font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'VECTORS' && (
        <div className="space-y-6">
          {/* Silhouettes */}
          {p.silhouetteProfile.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Scissors className="w-3.5 h-3.5 text-indigo-400" />
                Silhouette Vectors ({p.silhouetteProfile.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {p.silhouetteProfile.map((attr) => (
                  <StyleVectorCard key={attr.id} attribute={attr} vectorType="silhouette" />
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          {p.materialProfile.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Shirt className="w-3.5 h-3.5 text-emerald-400" />
                Material Vectors ({p.materialProfile.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {p.materialProfile.map((attr) => (
                  <StyleVectorCard key={attr.id} attribute={attr} vectorType="material" />
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          {p.brandAffinity.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-amber-400" />
                Brand Affinity Vectors ({p.brandAffinity.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {p.brandAffinity.map((attr) => (
                  <StyleVectorCard key={attr.id} attribute={attr} vectorType="brand" />
                ))}
              </div>
            </div>
          )}

          {/* Lifestyle & Occasions */}
          {(p.lifestyleAlignment.length > 0 || p.occasionPreferences.length > 0) && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Lifestyle & Occasion Vectors
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {p.lifestyleAlignment.map((attr) => (
                  <StyleVectorCard key={attr.id} attribute={attr} vectorType="lifestyle" />
                ))}
                {p.occasionPreferences.map((attr) => (
                  <StyleVectorCard key={attr.id} attribute={attr} vectorType="occasion" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'COLOR' && (
        <ColorIdentityPanel colors={p.colorProfile} />
      )}

      {activeTab === 'TIMELINE' && (
        <FashionIdentityTimeline snapshots={styleDNASnapshots} />
      )}
    </div>
  );
};
