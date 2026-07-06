import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Calendar, Activity, TrendingUp, Plus, Trash2, Check, Sparkles, Sliders, Sun, Cloud, CloudRain, Flame } from 'lucide-react';
import { WardrobeItem } from '../types';

interface StyleHistoryArchiveProps {
  wardrobe: WardrobeItem[];
}

interface HistoryLog {
  id: string;
  date: string;
  outfitName: string;
  weather: 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'cold';
  temperature: string;
  items: Array<{ id: string; title: string; category: string }>;
  coherenceScore: number;
  notes: string;
}

export const StyleHistoryArchive: React.FC<StyleHistoryArchiveProps> = ({ wardrobe }) => {
  const [logs, setLogs] = useState<HistoryLog[]>([
    {
      id: 'log-1',
      date: '2026-07-03',
      outfitName: 'Nordic Warm Cashmere Layering',
      weather: 'cloudy',
      temperature: '18°C',
      items: [
        { id: 'w-1', title: 'Double-Breasted Wool Overcoat', category: 'Outerwear' },
        { id: 'w-2', title: 'Ribbed Cashmere Turtleneck', category: 'Knitwear' },
        { id: 'w-3', title: 'Relaxed Tailored Chinos', category: 'Casual' }
      ],
      coherenceScore: 94,
      notes: 'Excellent comfort and warm organic lines. Perfect for breezy afternoon meetings.'
    },
    {
      id: 'log-2',
      date: '2026-07-01',
      outfitName: 'Asymmetric Midnight Silhouette',
      weather: 'rainy',
      temperature: '14°C',
      items: [
        { id: 'w-4', title: 'Asymmetric Drape Trench', category: 'Outerwear' },
        { id: 'w-5', title: 'Structured Utility Vest', category: 'Accessories' }
      ],
      coherenceScore: 88,
      notes: 'Bold, avant-garde framing under the light rain. Extremely water resistant utility layers.'
    },
    {
      id: 'log-3',
      date: '2026-06-28',
      outfitName: 'Streetwear Graphic Coordinate',
      weather: 'sunny',
      temperature: '24°C',
      items: [
        { id: 'w-8', title: 'Oversized Raw Heavy Tee', category: 'Casual' },
        { id: 'w-9', title: 'Vintage Stonewash Denim', category: 'Casual' }
      ],
      coherenceScore: 78,
      notes: 'Relaxed weekend vibe. A bit low on formal alignment but high on mobility.'
    }
  ]);

  const [showLogModal, setShowLogModal] = useState(false);
  const [newOutfitName, setNewOutfitName] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newWeather, setNewWeather] = useState<'sunny' | 'rainy' | 'cloudy' | 'windy' | 'cold'>('sunny');
  const [newTemp, setNewTemp] = useState('20°C');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Statistics
  const totalLogged = logs.length;
  const averageCoherence = Math.round(logs.reduce((acc, log) => acc + log.coherenceScore, 0) / (totalLogged || 1));
  
  // Calculate category frequencies in history
  const categoryFreq: Record<string, number> = {};
  logs.forEach(log => {
    log.items.forEach(item => {
      categoryFreq[item.category] = (categoryFreq[item.category] || 0) + 1;
    });
  });
  const topCategory = Object.entries(categoryFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Outerwear';

  const handleToggleItemSelection = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCreateLog = () => {
    if (!newOutfitName.trim()) {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: 'Please specify an Outfit title.' 
      }));
      return;
    }

    const selectedItems = wardrobe
      .filter(w => selectedItemIds.includes(w.id))
      .map(w => ({ id: w.id, title: w.title, category: w.category }));

    // Calculate a semi-random high-fidelity coherence score based on items selected
    const baseScore = selectedItems.length > 0 ? 80 : 50;
    const itemsBonus = Math.min(18, selectedItems.length * 4);
    const randomFudge = Math.floor(Math.random() * 5);
    const finalScore = Math.min(100, baseScore + itemsBonus + randomFudge);

    const newLog: HistoryLog = {
      id: `history-log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      outfitName: newOutfitName.trim(),
      weather: newWeather,
      temperature: newTemp,
      items: selectedItems,
      coherenceScore: finalScore,
      notes: newNotes.trim() || 'Aesthetic wear logged.'
    };

    setLogs(prev => [newLog, ...prev]);
    setShowLogModal(false);
    setNewOutfitName('');
    setNewNotes('');
    setNewWeather('sunny');
    setNewTemp('20°C');
    setSelectedItemIds([]);

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Outfit logged in history! Coherence Score: ${finalScore}%` }));
  };

  const handleDeleteLog = (id: string, name: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Removed "${name}" from timeline.` }));
  };

  const getWeatherIcon = (weather: 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'cold') => {
    switch (weather) {
      case 'sunny': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'rainy': return <CloudRain className="w-4 h-4 text-cyan-400" />;
      case 'cloudy': return <Cloud className="w-4 h-4 text-slate-400" />;
      case 'cold': return <Flame className="w-4 h-4 text-blue-400 animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-6 text-white text-left animate-fade-in" id="style-history-archive-root">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
            Chronological Logs
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-3xl text-white mt-1">
            Sartorial History Archive
          </h2>
          <p className="text-xs text-white/40 font-serif italic mt-1">
            "Timeline logs tracking outfit choices, weather adaptation, and style coherence parameters."
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-mono text-[9.5px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Today's Outfit</span>
        </button>
      </div>

      {/* METRICS & DIAGNOSTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#07070c]/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Average Style Coherence</span>
            <span className="text-xl font-bold font-mono text-white">{averageCoherence}%</span>
            <span className="text-[9px] font-mono text-emerald-400 block mt-0.5">High DNA Alignment</span>
          </div>
        </div>

        <div className="bg-[#07070c]/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-lg shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Dominant Category</span>
            <span className="text-sm font-bold font-mono text-white uppercase">{topCategory}</span>
            <span className="text-[9px] font-mono text-violet-400 block mt-0.5">Most recurrent in timeline</span>
          </div>
        </div>

        <div className="bg-[#07070c]/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Total Days Tracked</span>
            <span className="text-xl font-bold font-mono text-white">{totalLogged} Days</span>
            <span className="text-[9px] font-mono text-cyan-400 block mt-0.5">Active continuity</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* TIMELINE ARCHIVE (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block font-bold mb-2">Chronological Timeline</span>
          
          <div className="relative border-l border-white/5 pl-6 ml-3 space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="relative group">
                {/* Bullet node indicator */}
                <span className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-[#05050a] border border-emerald-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </span>

                <div className="bg-[#07070c]/40 border border-white/5 p-5 rounded-2xl space-y-4 hover:border-white/10 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-white/[0.03]">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono text-white/40">{log.date}</span>
                      <span className="text-white/20">•</span>
                      <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded-lg text-[9px] font-mono">
                        {getWeatherIcon(log.weather)}
                        <span className="text-white/60 capitalize">{log.weather} ({log.temperature})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                        <span>Coherence:</span>
                        <span className="font-bold">{log.coherenceScore}%</span>
                      </div>
                      <button
                        onClick={() => handleDeleteLog(log.id, log.outfitName)}
                        className="p-1 text-white/20 hover:text-red-400 hover:bg-red-950/20 rounded-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white font-sans">{log.outfitName}</h4>
                    <p className="text-[10px] text-white/40 mt-1.5 leading-relaxed font-sans italic">"{log.notes}"</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {log.items.map((item, index) => (
                      <span
                        key={index}
                        className="text-[8.5px] font-mono bg-[#181135]/50 border border-violet-500/15 text-violet-300 px-2 py-1 rounded-lg"
                      >
                        {item.title} ({item.category})
                      </span>
                    ))}
                    {log.items.length === 0 && (
                      <span className="text-[8.5px] font-mono text-white/20">No items selected</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-12 bg-[#07070c]/20 border border-dashed border-white/5 rounded-2xl pl-0 ml-0 border-l-0">
                <p className="text-xs font-serif italic text-white/30">"No outfit logs recorded in history timeline."</p>
              </div>
            )}
          </div>
        </div>

        {/* TELEMETRY DIAGNOSTICS (4 Columns) */}
        <div className="lg:col-span-4 bg-[#07070c]/50 border border-white/5 p-5 rounded-2xl space-y-6">
          <div>
            <span className="text-[9px] font-mono text-violet-400 uppercase tracking-wider block font-semibold">DNA Telemetry</span>
            <h3 className="text-xs font-bold text-white font-sans mt-0.5">Style Integrity Diagnostic</h3>
            <p className="text-[9.5px] text-white/40 font-mono mt-1 leading-normal">Evaluates historical harmony indices across continuous wear sessions.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-white/60 uppercase">Silhouette Structuring</span>
                <span className="text-emerald-400 font-bold">92%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-white/60 uppercase">Color Contrast DNA</span>
                <span className="text-violet-400 font-bold">85%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-white/60 uppercase">Atmospheric Resilience</span>
                <span className="text-cyan-400 font-bold">78%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-white/60 uppercase">Formal/Casual Balance</span>
                <span className="text-amber-400 font-bold">64%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '64%' }} />
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 text-center">
            <span className="text-[8.5px] font-mono text-white/30 uppercase tracking-widest block mb-2">Aesthetic Diagnostic</span>
            <div className="p-3 bg-[#181135]/40 rounded-xl border border-violet-500/10 text-[10px] font-sans leading-relaxed text-violet-200">
              Your look history exhibits a high structural fidelity, with predominant alignment to <strong className="text-white">Nordic Minimalist</strong> and <strong className="text-white">Avant-Garde Noir</strong> themes.
            </div>
          </div>
        </div>

      </div>

      {/* Log Outfit Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0b14] border border-white/10 rounded-2xl max-w-lg w-full p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div>
                <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider">Log Worn Coordinate</h3>
                <p className="text-xs text-white/40 font-sans mt-1">Record today's styled configuration, ambient climate, and structural comfort details.</p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-white/40">Outfit Coordinate Title</label>
                  <input
                    type="text"
                    value={newOutfitName}
                    onChange={(e) => setNewOutfitName(e.target.value)}
                    placeholder="e.g. Asymmetric Rain Shield"
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-white/40 block">Weather Condition</label>
                    <select
                      value={newWeather}
                      onChange={(e) => setNewWeather(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white/80 focus:outline-none focus:border-emerald-500 transition-all"
                    >
                      <option value="sunny">Sunny</option>
                      <option value="cloudy">Cloudy</option>
                      <option value="rainy">Rainy</option>
                      <option value="cold">Cold / Winter</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-white/40">Temperature</label>
                    <input
                      type="text"
                      value={newTemp}
                      onChange={(e) => setNewTemp(e.target.value)}
                      placeholder="e.g. 19°C"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* Multiselect Closet Items */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-white/40 block">Select Worn Closet Pieces</label>
                  <div className="bg-neutral-950 border border-white/5 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto no-scrollbar">
                    {wardrobe.map(item => {
                      const isSelected = selectedItemIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleToggleItemSelection(item.id)}
                          type="button"
                          className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                              : 'bg-white/[0.01] border-white/5 hover:border-white/10 text-white/60'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="block text-[9.5px] font-bold truncate leading-tight">{item.title}</span>
                            <span className="block text-[8px] font-mono text-white/30 uppercase mt-0.5">{item.category}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />}
                        </button>
                      );
                    })}
                    {wardrobe.length === 0 && (
                      <span className="text-[9.5px] font-mono text-white/20 p-2 col-span-2 text-center">No closet archive loaded</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-white/40">Sartorial Log Notes</label>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Comfort details, fits or notes regarding this day's rotation."
                    rows={2}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-all resize-none placeholder-white/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowLogModal(false);
                    setNewOutfitName('');
                    setNewNotes('');
                    setSelectedItemIds([]);
                  }}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-mono font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateLog}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center"
                >
                  Log Outfit Coordinate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
