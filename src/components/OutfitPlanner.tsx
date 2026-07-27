import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, Plus, Trash2, CheckCircle, Copy, Edit2, 
  Sparkles, Check, ChevronRight, RefreshCw, X, AlertCircle, CloudSun, Sunset, ArrowRight
} from 'lucide-react';
import { UnifiedFashionOS, ScheduledEvent } from '../features/ai-core/UnifiedFashionOS';
import { WardrobeItem } from '../types';
import { AIStyleHubV17Architecture } from '../features/global/AIStyleHubV17Architecture';

interface OutfitPlannerProps {
  wardrobe: WardrobeItem[];
  themeObj: any;
}

export const OutfitPlanner: React.FC<OutfitPlannerProps> = ({ wardrobe, themeObj }) => {
  const [state, setState] = useState(() => UnifiedFashionOS.getState());
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'tomorrow' | 'this_week' | 'future'>('all');
  
  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('Morning light');
  const [occasion, setOccasion] = useState('Quiet stroll');
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<WardrobeItem[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync state with UnifiedFashionOS
  useEffect(() => {
    const handleStateUpdate = () => {
      setState({ ...UnifiedFashionOS.getState() });
    };
    window.addEventListener('lookvision_state_changed', handleStateUpdate);
    return () => {
      window.removeEventListener('lookvision_state_changed', handleStateUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: msg }));
  };

  // Preset occasion options
  const occasionPresets = [
    'Quiet stroll', 'Office duty', 'Evening dinner', 'Art gallery visit', 'Weekend lounge', 'Gala event'
  ];

  // Preset time options
  const timePresets = [
    'Morning light', 'Midday warmth', 'Golden hour', 'Twilight', 'Late night'
  ];

  // Map occasion to beautiful simulated weather
  const getSimulatedWeather = (occ: string) => {
    const o = occ.toLowerCase();
    if (o.includes('stroll') || o.includes('gallery') || o.includes('lounge')) {
      return 'Sunny Clear, 22°C';
    }
    if (o.includes('office') || o.includes('duty') || o.includes('dinner')) {
      return 'Cozy Mild AC, 20°C';
    }
    if (o.includes('gala') || o.includes('evening')) {
      return 'Crisp Twilight, 16°C';
    }
    return 'Mild Overcast, 18°C';
  };

  // Handle recommendation generation using current Recommendation Engine
  const handleGenerateAIOutfit = () => {
    if (wardrobe.length === 0) {
      showToast('No items in wardrobe to generate outfit from.');
      return;
    }
    setAiGenerating(true);
    
    // Simulate generation SLA time
    setTimeout(() => {
      try {
        // Trigger recommendation engine
        UnifiedFashionOS.generateOutfit(wardrobe, occasion || 'Quiet stroll');
        const activeSuggestion = UnifiedFashionOS.getState().activeSuggestion;
        if (activeSuggestion && activeSuggestion.items.length > 0) {
          setSelectedItems(activeSuggestion.items);
          showToast(`Attached AI recommendation: ${activeSuggestion.name}`);
        } else {
          showToast('Failed to compile recommendation combo.');
        }
      } catch (err) {
        console.error(err);
        showToast('AI recommendation pipeline temporarily offline.');
      } finally {
        setAiGenerating(false);
      }
    }, 1200);
  };

  const handlePublishOutfitToPublicMemory = () => {
    if (selectedItems.length === 0) {
      showToast('Select or generate pieces first.');
      return;
    }
    const outfitTitle = title.trim() || `${occasion || 'Sartorial'} Ensemble`;
    const outfitImg = selectedItems[0]?.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800';

    AIStyleHubV17Architecture.convertToAnonymousDraft({
      imageUrl: outfitImg,
      title: outfitTitle,
      originModule: 'OUTFITS',
      category: occasion || 'Outfit Combination',
      styleVibe: occasion || 'Planned Look',
      tags: selectedItems.map(i => i.category || 'item')
    });

    showToast('🌐 Outfit published to Public Memory for the community to discover & wear!');
  };

  // Handle Submit Form (Create / Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please specify an event title.');
      return;
    }

    const payload = {
      title,
      time,
      occasion,
      isCompleted: false,
      date,
      notes,
      assignedItems: selectedItems,
      weather: getSimulatedWeather(occasion),
      aiGeneratedOutfitName: selectedItems.length > 0 ? selectedItems.map(i => i.title).join(' & ') : undefined
    };

    if (editingId) {
      UnifiedFashionOS.updateScheduledEvent(editingId, payload);
      showToast('Outfit plan updated successfully.');
      setEditingId(null);
    } else {
      UnifiedFashionOS.addCustomScheduledEvent(payload);
      showToast('Outfit plan registered.');
    }

    AIStyleHubV17Architecture.recordLearningSignal('OUTFITS', 'SAVE', occasion || 'Planned Look');
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('Morning light');
    setOccasion('Quiet stroll');
    setNotes('');
    setSelectedItems([]);
    setIsCreating(false);
    setEditingId(null);
  };

  // Start Editing
  const startEdit = (evt: ScheduledEvent) => {
    setEditingId(evt.id);
    setTitle(evt.title);
    setDate(evt.date || new Date().toISOString().split('T')[0]);
    setTime(evt.time);
    setOccasion(evt.occasion);
    setNotes(evt.notes || '');
    setSelectedItems(evt.assignedItems || []);
    setIsCreating(true);
  };

  // Duplicate Plan
  const handleDuplicate = (id: string) => {
    UnifiedFashionOS.duplicateScheduledEvent(id);
    showToast('Plan duplicated.');
  };

  // Delete Plan
  const handleDelete = (id: string) => {
    UnifiedFashionOS.deleteEvent(id);
    showToast('Plan cancelled.');
  };

  // Toggle Completion
  const toggleComplete = (id: string, isCompleted: boolean) => {
    UnifiedFashionOS.updateScheduledEvent(id, { isCompleted: !isCompleted });
    showToast(isCompleted ? 'Marked planned.' : 'Look worn successfully.');
  };

  // Grouping Filters
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  const getWeekRange = () => {
    const today = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + 7);
    return { today, endOfWeek };
  };

  const isThisWeek = (dateStr: string) => {
    const { today, endOfWeek } = getWeekRange();
    const d = new Date(dateStr);
    return d >= today && d <= endOfWeek;
  };

  const filteredEvents = (state.schedulerEvents || []).filter(evt => {
    const d = evt.date || '';
    if (activeFilter === 'today') return d === todayStr;
    if (activeFilter === 'tomorrow') return d === tomorrowStr;
    if (activeFilter === 'this_week') return isThisWeek(d);
    if (activeFilter === 'future') return d > tomorrowStr;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-2 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-violet-400 font-bold">
              Unified Calendar Core
            </span>
          </div>
          <h2 className="text-3xl font-serif font-light text-white tracking-tight">
            Interactive Outfit Planner
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-lg">
            Curate and schedule daily wardrobing arrangements. Attach tailored coordinates generated from your AI Recommendation Engine.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-black font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isCreating ? (
          /* Create / Edit Form View */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`p-6 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-6 text-left relative overflow-hidden`}
          >
            {/* Ambient Accent Light */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                {editingId ? 'Edit Schedulers Detail' : 'Establish New Wardrobe Arrangement'}
              </span>
              <button 
                onClick={resetForm} 
                className="text-zinc-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Form Inputs */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Event Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Boardroom Briefing, Casual Afternoon Walk"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Time</label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all font-serif"
                      >
                        {timePresets.map(preset => (
                          <option key={preset} value={preset}>{preset}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Occasion Context</label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all font-serif"
                    >
                      {occasionPresets.map(preset => (
                        <option key={preset} value={preset}>{preset}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Sartorial Notes</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Keep style simple with lightweight breathable layers."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Right Selection Column: Wardrobe & AI attachment */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Wardrobe Selections</label>
                      <button
                        type="button"
                        onClick={handleGenerateAIOutfit}
                        disabled={aiGenerating}
                        className="flex items-center gap-1.5 text-[9px] font-mono uppercase bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 px-2.5 py-1.5 border border-violet-500/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{aiGenerating ? 'Compiling AI...' : 'Generate with AI'}</span>
                      </button>
                    </div>

                    {/* Wardrobe Items checklist */}
                    <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3 h-48 overflow-y-auto space-y-1.5 no-scrollbar">
                      {wardrobe.length === 0 ? (
                        <p className="text-xs text-zinc-600 italic py-16 text-center">Your Archive Wall is currently empty.</p>
                      ) : (
                        wardrobe.map(item => {
                          const isChecked = selectedItems.some(i => i.id === item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                if (isChecked) {
                                  setSelectedItems(selectedItems.filter(i => i.id !== item.id));
                                } else {
                                  setSelectedItems([...selectedItems, item]);
                                }
                              }}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                                isChecked ? 'bg-violet-950/20 border border-violet-500/20' : 'hover:bg-white/[0.02] border border-transparent'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                                isChecked ? 'bg-violet-600 border-violet-500' : 'border-zinc-700'
                              }`}>
                                {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <img
                                src={item.imageUrl || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=150&auto=format&fit=crop'}
                                alt=""
                                className="w-8 h-8 rounded object-cover border border-white/5"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 text-left min-w-0">
                                <p className="text-xs text-zinc-200 font-mono truncate">{item.title}</p>
                                <p className="text-[9px] text-zinc-500 uppercase tracking-wider">{item.category}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Summary of Selected Items */}
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest text-left">Selected Ensemble</p>
                    {selectedItems.length === 0 ? (
                      <p className="text-xs text-zinc-600 italic text-left">No pieces selected. Use AI Generator or tick items above.</p>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedItems.map(item => (
                            <span key={item.id} className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700 max-w-[140px] truncate">
                              {item.title}
                            </span>
                          ))}
                        </div>

                        {/* RECOMMENDATION OVERLAY FOR OUTFIT DESTINATION */}
                        <div className="p-3 bg-gradient-to-r from-violet-950/60 via-indigo-950/60 to-purple-950/60 border border-violet-500/40 rounded-xl space-y-2 text-left">
                          <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Where should this outfit go?</span>
                          </span>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              type="submit"
                              className="py-2 px-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-[10px] font-mono font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <Calendar className="w-3.5 h-3.5 text-amber-300" />
                              <span>🔒 Personal Schedule</span>
                            </button>

                            <button
                              type="button"
                              onClick={handlePublishOutfitToPublicMemory}
                              className="py-2 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                              <span>🌐 Public Memory</span>
                            </button>
                          </div>

                          <p className="text-[9px] font-mono text-zinc-400 leading-tight">
                            💡 If unsaved, this generated outfit automatically flows into <span className="text-cyan-300">Public Memories</span> so other users can wear it!
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-mono text-[10.5px] uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black font-mono text-[10.5px] font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer"
                >
                  {editingId ? 'Save Arrangements' : 'Commit to Calendar'}
                </button>
              </div>

            </form>
          </motion.div>
        ) : (
          /* List View */
          <div className="space-y-6">
            
            {/* Filters Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 select-none">
              {[
                { id: 'all', label: 'All Plans' },
                { id: 'today', label: 'Today' },
                { id: 'tomorrow', label: 'Tomorrow' },
                { id: 'this_week', label: 'This Week' },
                { id: 'future', label: 'Future Days' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as any)}
                  className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-widest cursor-pointer transition-all border ${
                    activeFilter === filter.id 
                      ? 'bg-white text-black border-white font-bold' 
                      : 'bg-zinc-950/40 text-zinc-400 border-white/5 hover:text-white hover:border-white/20'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* List Grid */}
            {filteredEvents.length === 0 ? (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center space-y-4 border border-dashed border-white/5 rounded-2xl bg-zinc-950/20"
              >
                <span className="text-zinc-500 text-3xl block">◇</span>
                <p className="text-sm font-serif text-zinc-400 italic">"The unwritten desk remains clear."</p>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">No scheduled outfits for this cohort</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="mt-4 px-4 py-2 text-[9px] font-mono bg-violet-950/20 border border-violet-500/20 text-violet-400 uppercase tracking-widest hover:bg-violet-950/40 cursor-pointer"
                >
                  Schedule Your First Look
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map(evt => {
                  const hasItems = evt.assignedItems && evt.assignedItems.length > 0;
                  const itemPic = hasItems ? evt.assignedItems![0].imageUrl : undefined;

                  return (
                    <motion.div
                      key={evt.id}
                      layoutId={`planner-${evt.id}`}
                      className={`p-5 rounded-xl bg-zinc-900/40 border border-white/5 flex flex-col justify-between hover:border-violet-500/20 hover:scale-[1.01] duration-300 relative group overflow-hidden text-left`}
                    >
                      {/* Status indicator blur */}
                      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none ${
                        evt.isCompleted ? 'bg-emerald-500/5' : 'bg-violet-500/5'
                      }`} />

                      <div className="space-y-4">
                        {/* Header metadata */}
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                              {evt.date || todayStr} — {evt.time}
                            </span>
                            <h3 className="text-base font-serif text-white leading-tight font-light truncate max-w-[200px]">
                              {evt.title}
                            </h3>
                          </div>
                          <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border font-semibold ${
                            evt.isCompleted 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-violet-500/10 border-violet-500/20 text-violet-400 animate-pulse'
                          }`}>
                            {evt.isCompleted ? 'Completed' : 'Planned'}
                          </span>
                        </div>

                        {/* Middle Info with preview */}
                        <div className="flex gap-4 items-center">
                          <div className="w-14 h-18 bg-zinc-950/80 rounded overflow-hidden border border-white/10 shrink-0 relative flex items-center justify-center">
                            {hasItems && itemPic ? (
                              <img
                                src={itemPic}
                                alt=""
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <CloudSun className="w-5 h-5 text-zinc-700" />
                            )}
                          </div>
                          
                          <div className="space-y-1 min-w-0 flex-1">
                            <p className="text-[10px] font-mono text-zinc-500 uppercase">Occasion Context</p>
                            <p className="text-xs text-zinc-300 font-serif italic truncate">"{evt.occasion}"</p>
                            
                            <p className="text-[10px] font-mono text-zinc-500 uppercase mt-2">Weather Anchor</p>
                            <p className="text-xs text-zinc-400 font-sans truncate">{evt.weather || 'Sunny Clear, 22°C'}</p>
                          </div>
                        </div>

                        {/* Assigned Items Collage */}
                        {hasItems && (
                          <div className="pt-2 border-t border-white/[0.03] space-y-1">
                            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Outfit Pieces</p>
                            <div className="flex gap-1 overflow-x-auto no-scrollbar">
                              {evt.assignedItems!.map(i => (
                                <span key={i.id} className="text-[9.5px] font-mono bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-white/5 truncate max-w-[120px] shrink-0">
                                  {i.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Custom Notes */}
                        {evt.notes && (
                          <p className="text-[11px] font-sans text-zinc-500 leading-relaxed bg-zinc-950/20 p-2.5 rounded-lg border border-white/5 italic">
                            "{evt.notes}"
                          </p>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 relative">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleComplete(evt.id, evt.isCompleted)}
                            className={`p-1.5 rounded-lg transition-all border cursor-pointer hover:scale-105 ${
                              evt.isCompleted 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600'
                            }`}
                            title={evt.isCompleted ? 'Mark planned' : 'Wear look / Mark complete'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => startEdit(evt)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-all cursor-pointer hover:scale-105"
                            title="Edit Plan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(evt.id)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-all cursor-pointer hover:scale-105"
                            title="Duplicate Plan"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleDelete(evt.id)}
                          className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-red-950/40 text-zinc-600 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all cursor-pointer hover:scale-105"
                          title="Cancel Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            )}

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
