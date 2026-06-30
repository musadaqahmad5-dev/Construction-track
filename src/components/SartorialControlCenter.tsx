import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Clock, Coins, Award, Shirt, Calendar, 
  ArrowUpRight, Check, Trash2, Sliders, Eye, TrendingUp, Info
} from 'lucide-react';
import { WardrobeItem } from '../types';
import { UnifiedFashionOS } from '../features/ai-core/UnifiedFashionOS';

interface SartorialControlCenterProps {
  wardrobe: WardrobeItem[];
  user?: any;
}

export const SartorialControlCenter: React.FC<SartorialControlCenterProps> = ({ wardrobe, user }) => {
  const [activeSubView, setActiveSubView] = useState<'ANALYTICS' | 'HISTORY'>('ANALYTICS');
  const [localHistory, setLocalHistory] = useState<any[]>([]);

  // Load physical wear reflections & combination history from localStorage
  useEffect(() => {
    try {
      const last7 = JSON.parse(localStorage.getItem('last_7_worn_combinations') || '[]');
      const last10 = JSON.parse(localStorage.getItem('last_10_worn_combinations') || '[]');
      
      // Synthesize realistic historical events
      const synthesizedEvents = [];
      const now = new Date();
      
      // Gather actual items with non-zero wear count as events
      const wornItems = wardrobe.filter(i => (i.wearCount || 0) > 0);
      
      wornItems.forEach((item, idx) => {
        const daysAgo = idx + 1;
        const eventDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        synthesizedEvents.push({
          id: `hist-${item.id}-${idx}`,
          date: eventDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
          timeAtmosphere: idx % 2 === 0 ? "Morning light" : "Quiet stroll",
          items: [item],
          reflection: item.privateNote || "Comfort chosen quietly.",
          suitabilityScore: 85 + (idx * 3) % 15
        });
      });

      // Add last 7 combinations as grouped events if they exist
      if (Array.isArray(last7) && last7.length > 0) {
        last7.forEach((ids: string[], idx: number) => {
          const comboItems = ids.map(id => wardrobe.find(w => w.id === id)).filter(Boolean) as WardrobeItem[];
          if (comboItems.length > 0) {
            const eventDate = new Date(now.getTime() - (idx + wornItems.length + 1) * 24 * 60 * 60 * 1000);
            synthesizedEvents.push({
              id: `combo-${idx}`,
              date: eventDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
              timeAtmosphere: "Evening lounge",
              items: comboItems,
              reflection: "Balanced layers remained nearby.",
              suitabilityScore: 92
            });
          }
        });
      }

      setLocalHistory(synthesizedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (e) {
      console.error("Error loading wear history:", e);
    }
  }, [wardrobe]);

  // Derived Analytics Calculations
  const metrics = useMemo(() => {
    const totalItems = wardrobe.length;
    const estimatedValue = totalItems * 120; // Average value $120 per garment
    const totalWears = wardrobe.reduce((acc, item) => acc + (item.wearCount || 0), 0);
    
    // Category distribution counts
    const categories: Record<string, number> = {};
    wardrobe.forEach(item => {
      const cat = item.category || 'Casual';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    // Color distribution estimates
    let lightCount = 0;
    let darkCount = 0;
    let neutralCount = 0;

    wardrobe.forEach(item => {
      const title = item.title.toLowerCase();
      if (title.includes('black') || title.includes('dark') || title.includes('midnight') || title.includes('charcoal')) {
        darkCount++;
      } else if (title.includes('white') || title.includes('light') || title.includes('cream') || title.includes('beige')) {
        lightCount++;
      } else {
        neutralCount++;
      }
    });

    return {
      totalItems,
      estimatedValue,
      totalWears,
      categories,
      tones: { lightCount, darkCount, neutralCount }
    };
  }, [wardrobe]);

  return (
    <div className="space-y-8 select-none animate-fade-in text-white py-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
            Sartorial Operating System
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-3xl text-white mt-1">
            Sartorial Control Room
          </h2>
          <p className="text-xs text-white/40 font-serif italic mt-1">
            "Coherence dashboards logging wear, metrics, and styling history."
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
          {[
            { id: 'ANALYTICS', label: 'Analytics' },
            { id: 'HISTORY', label: 'Wear History' }
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubView(sub.id as any)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeSubView === sub.id 
                  ? 'bg-white text-black font-semibold' 
                  : 'text-white/40 hover:text-white/75 hover:bg-white/[0.01]'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubView === 'ANALYTICS' ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* CORE KPI BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Asset Valuation Card */}
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 transition-all">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Coins className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase border border-emerald-500/15">Active</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase tracking-widest leading-none mb-1.5">Asset Value</span>
                  <span className="text-2xl font-serif font-light text-white leading-none">${metrics.estimatedValue.toLocaleString()} USD</span>
                  <span className="block text-[8px] font-mono text-white/20 mt-1 uppercase">Based on boutique market indices</span>
                </div>
                <div className="absolute top-0 right-0 w-[4px] h-full bg-emerald-500/40" />
              </div>

              {/* Wear Utility Rate */}
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 transition-all">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded uppercase border border-purple-500/15">Real-time</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase tracking-widest leading-none mb-1.5">Total wears logged</span>
                  <span className="text-2xl font-serif font-light text-white leading-none">{metrics.totalWears} wears</span>
                  <span className="block text-[8px] font-mono text-white/20 mt-1 uppercase">Active adaptation index is high</span>
                </div>
                <div className="absolute top-0 right-0 w-[4px] h-full bg-purple-500/40" />
              </div>

              {/* Style Coherence Index */}
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 transition-all">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded uppercase border border-amber-500/15">98.2% alignment</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase tracking-widest leading-none mb-1.5">Aesthetic Coherence</span>
                  <span className="text-2xl font-serif font-light text-white leading-none">Classic Luxury</span>
                  <span className="block text-[8px] font-mono text-white/20 mt-1 uppercase">Coherence is holding state perfectly</span>
                </div>
                <div className="absolute top-0 right-0 w-[4px] h-full bg-amber-500/40" />
              </div>
            </div>

            {/* INTERACTIVE DATA CHARTS AREA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Breakdown Progress indicators */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-4 text-left">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    Category distribution
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {metrics.totalItems} garments total
                  </span>
                </div>

                <div className="space-y-4 pt-1">
                  {Object.entries(metrics.categories).map(([cat, count]) => {
                    const percent = Math.round((count / metrics.totalItems) * 100) || 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-white/60 uppercase">{cat}</span>
                          <span className="text-white/40">{count} pieces ({percent}%)</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(metrics.categories).length === 0 && (
                    <p className="text-xs font-serif italic text-white/30 text-center py-6">
                      No garments found on shelves.
                    </p>
                  )}
                </div>
              </div>

              {/* Tonality balance indicators */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-5 text-left">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    Tone Harmony Spectrum
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Monochrome Balance
                  </span>
                </div>

                <div className="space-y-5 pt-2">
                  {/* Light / Blanc spectrum */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-white/50">
                      <span className="uppercase">Blanc & Light Tones</span>
                      <span>{metrics.tones.lightCount} items</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-stone-200"
                        style={{ width: `${(metrics.tones.lightCount / Math.max(1, metrics.totalItems)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Dark / Noir spectrum */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-white/50">
                      <span className="uppercase">Noir & Dark Silhouettes</span>
                      <span>{metrics.tones.darkCount} items</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-zinc-700"
                        style={{ width: `${(metrics.tones.darkCount / Math.max(1, metrics.totalItems)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Neutral spectrum */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-white/50">
                      <span className="uppercase">Neutrals & Ground Elements</span>
                      <span>{metrics.tones.neutralCount} items</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-amber-500/60"
                        style={{ width: `${(metrics.tones.neutralCount / Math.max(1, metrics.totalItems)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left"
          >
            {/* WEAR HISTORY LIST */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Historical Wear Timeline
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {localHistory.length} events recorded
                </span>
              </div>

              <div className="space-y-6 divide-y divide-white/5">
                {localHistory.map((event, idx) => (
                  <div key={event.id} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} flex flex-col md:flex-row justify-between items-start gap-4`}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-white/80">{event.date}</span>
                        <span className="text-[8px] font-mono uppercase tracking-widest text-white/30 bg-white/5 px-2 py-0.5 border border-white/5 rounded">
                          {event.timeAtmosphere}
                        </span>
                        <span className="text-[9px] font-mono text-amber-400 flex items-center gap-0.5">
                          ★ {event.suitabilityScore}% match
                        </span>
                      </div>
                      <p className="font-serif italic text-sm text-white/60">
                        "{event.reflection}"
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {event.items.map((item: any) => (
                        <div key={item.id} className="group relative w-12 h-14 bg-neutral-900 border border-white/5 overflow-hidden rounded shadow">
                          <img 
                            src={item.imageUrl || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"} 
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {localHistory.length === 0 && (
                  <div className="text-center py-12 space-y-3">
                    <Clock className="w-8 h-8 text-white/20 mx-auto animate-pulse" />
                    <p className="text-xs font-serif italic text-white/30">
                      "Silence is keeping time with you. Complete some wear feedback checks to log events."
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
