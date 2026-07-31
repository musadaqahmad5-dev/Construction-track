import React from 'react';
import { motion } from 'motion/react';
import { 
  Shirt, 
  Trash2, 
  Layers, 
  Users, 
  Calendar, 
  Plus, 
  Sparkle, 
  ArrowUpRight, 
  HelpCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { WardrobeItem, ClothingCategory } from '../types';
import { 
  useThemeIntelligence, 
  ThemeCoatRenderer, 
  FoundationInteractionWrapper 
} from '../engine';

interface HomeFeedProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: ClothingCategory, extraOptions?: any) => Promise<void>;
  onDeleteGarment?: (id: string) => Promise<void>;
  user?: any;
  onLogout?: () => void;
  onReset?: () => void;
  onLoadSamples?: () => void;
  setActiveSubTab?: (tab: any) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  wardrobe,
  onDeleteGarment,
  user,
  onReset,
  onLoadSamples,
  setActiveSubTab
}) => {
  // Connect to Theme Intelligence Engine
  let themeCtx: ReturnType<typeof useThemeIntelligence> | null = null;
  try {
    themeCtx = useThemeIntelligence();
  } catch {
    themeCtx = null;
  }

  const themeDNA = themeCtx?.themeDNA;
  const coatDNA = themeCtx?.coatDNA;
  const sequenceId = themeCtx?.sequenceId;

  // Dynamic Wardrobe Calculations
  const totalGarments = wardrobe.length;
  const categoryCounts = wardrobe.reduce((acc, item) => {
    const cat = item.category || 'Casual';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleNavigate = (tab: string) => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
      // Dispatch scroll/tab sync
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: `Entering ${tab.replace('PRODUCT_', '')} environment...` 
      }));
    }
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!onDeleteGarment) return;
    try {
      await onDeleteGarment(id);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: `Removed "${title}" from Closet.` 
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const renderContent = () => (
    <div id="home-feed-main" className="w-full max-w-4xl mx-auto space-y-10 pb-24 px-4 sm:px-6 text-left">
      
      {/* 1. LUXURY GREETING HERO SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 pt-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-violet-400">
            <Sparkle className="w-4 h-4 text-violet-400 fill-violet-400 filter drop-shadow-[0_0_6px_rgba(168,85,247,0.5)] animate-pulse-slow" />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold">Personal Closet Portal</span>
            {sequenceId && (
              <span className="text-[9px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 hidden lg:inline-block">
                SEQ: {sequenceId.substring(0, 10)}...
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-white tracking-tight">
            Welcome, {user?.displayName || user?.email?.split('@')[0] || 'Sartorialist'}
          </h1>
          <p className="text-zinc-400 text-xs max-w-xl font-light">
            Manage your high-fidelity style ledger, review curated silhouettes, and orchestrate outfits with AI-driven lookbook coordination.
          </p>
        </div>

        {/* Quick Control Actions */}
        <div className="flex gap-2 shrink-0">
          {totalGarments === 0 && onLoadSamples && (
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                onClick={onLoadSamples}
                className="px-3.5 py-2 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 text-violet-300 font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Load Samples</span>
              </button>
            </FoundationInteractionWrapper>
          )}
          {totalGarments > 0 && onReset && (
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                onClick={() => {
                  if (confirm('Clear entire digital closet state?')) {
                    onReset();
                    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Digital Closet Reset Complete.' }));
                  }
                }}
                className="px-3.5 py-2 bg-red-950/10 hover:bg-red-950/20 border border-red-500/15 text-red-400 font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Clear Closet
              </button>
            </FoundationInteractionWrapper>
          )}
        </div>
      </div>

      {/* 2. CORE INTERACTION METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Closet Items', val: totalGarments, desc: 'Active styled garments', accent: 'text-zinc-100' },
          { label: 'Formal Wear', val: categoryCounts['Formal'] || 0, desc: 'Tailored silhouettes', accent: 'text-violet-400' },
          { label: 'Casual & Lounge', val: categoryCounts['Casual'] || 0, desc: 'Comfort continuities', accent: 'text-emerald-400' },
          { label: 'Outerwear Jackets', val: categoryCounts['Outerwear'] || 0, desc: 'Stitched armor drapes', accent: 'text-amber-400' }
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between h-24 text-left">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">{stat.label}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-mono font-bold ${stat.accent}`}>{stat.val}</span>
              <span className="text-[9.5px] text-zinc-500 truncate">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. SIMPLIFIED USER INTERACTION DIRECTORY SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            title: 'Design Styles',
            desc: 'Co-create bespoke fits with LookVision active AI studio.',
            actionLabel: 'Enter AI Studio',
            tab: 'PRODUCT_AI_CREATIONS',
            icon: Sparkles,
            accentBorder: 'hover:border-violet-500/25',
            accentText: 'text-violet-400'
          },
          {
            title: 'Discovery Gallery',
            desc: 'Explore luxury design layouts & generate styles from blueprints.',
            actionLabel: 'Browse Feed',
            tab: 'PRODUCT_COMMUNITY',
            icon: Users,
            accentBorder: 'hover:border-indigo-500/25',
            accentText: 'text-indigo-400'
          },
          {
            title: 'Sartorial Planner',
            desc: 'Sequence custom coordinates on an unwritten weekly timeline.',
            actionLabel: 'Open Planner',
            tab: 'PLANNER',
            icon: Calendar,
            accentBorder: 'hover:border-emerald-500/25',
            accentText: 'text-emerald-400'
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <FoundationInteractionWrapper key={idx} themeDNA={themeDNA}>
              <div 
                onClick={() => handleNavigate(item.tab)}
                className={`p-5 bg-[#07070c] border border-white/5 rounded-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer group flex flex-col justify-between h-44 text-left shadow-lg ${item.accentBorder}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                      <Icon className="w-4 h-4 text-zinc-300" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">{item.title}</h3>
                  <p className="text-[11px] text-zinc-400 leading-normal">{item.desc}</p>
                </div>

                <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest font-bold pt-2 border-t border-white/[0.02]">
                  <span className={item.accentText}>{item.actionLabel}</span>
                  <span className="text-zinc-600 group-hover:translate-x-0.5 transition-transform duration-300">→</span>
                </div>
              </div>
            </FoundationInteractionWrapper>
          );
        })}
      </div>

      {/* 4. ACTIVE WARDROBE LEDGER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300 font-mono">My Active Wardrobe Grid</h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">{totalGarments} items in catalog</span>
        </div>

        {totalGarments === 0 ? (
          <div className="p-16 border border-dashed border-white/5 rounded-2xl text-center bg-white/[0.01]">
            <Shirt className="w-8 h-8 text-zinc-600 mx-auto mb-3 animate-pulse" />
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Digital Closet is Unwritten</p>
            <p className="text-[11px] text-zinc-500 mt-1 max-w-sm mx-auto">
              Your high-fidelity closet ledger is empty. Click "Load Samples" or enter "Design Styles" above to populate your custom wardrobe slots.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {wardrobe.map((item) => (
              <FoundationInteractionWrapper key={item.id} themeDNA={themeDNA}>
                <div 
                  className="bg-[#07070c] border border-white/5 rounded-2xl p-3 flex flex-col space-y-3 justify-between hover:border-white/10 transition-all duration-300 relative group h-full"
                >
                  {/* 3:4 aspect ratio portrait frame */}
                  <div className="aspect-[3/4] overflow-hidden rounded-xl bg-zinc-950 relative border border-white/5 shadow-inner">
                    {item.imageUrl ? (
                      <img src={item.imageUrl || null} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                        alt={item.title} 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <Shirt className="w-8 h-8" />
                      </div>
                    )}

                    <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded-lg border border-white/5 backdrop-blur-sm">
                      <span className="text-[8px] font-mono text-violet-300 uppercase font-bold">{item.category}</span>
                    </div>

                    {/* Delete button showing on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id, item.title);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-left space-y-1">
                    <span className="text-[11.5px] font-bold text-white block truncate leading-tight">{item.title}</span>
                    <span className="text-[9.5px] text-zinc-400 block line-clamp-1 leading-normal font-light">{item.description}</span>
                    
                    {/* Subtle color descriptors */}
                    {item.primaryColor && (
                      <div className="flex gap-1.5 items-center pt-1 font-mono text-[8px] text-zinc-500 border-t border-white/[0.02] mt-1.5">
                        <span className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: item.primaryColor === 'Studio Gray' ? '#555' : '#111' }} />
                        <span>{item.primaryColor}</span>
                      </div>
                    )}
                  </div>
                </div>
              </FoundationInteractionWrapper>
            ))}
          </div>
        )}
      </div>

    </div>
  );

  if (coatDNA) {
    return (
      <ThemeCoatRenderer coatDNA={coatDNA} className="w-full h-full">
        {renderContent()}
      </ThemeCoatRenderer>
    );
  }

  return renderContent();
};

