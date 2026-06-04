import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CalendarDays, 
  MapPin, 
  Sparkles, 
  Briefcase, 
  Users, 
  Dumbbell, 
  GlassWater, 
  Check, 
  ChevronRight, 
  PlusCircle, 
  Shirt, 
  Undo2 
} from 'lucide-react';
import { WardrobeItem } from '../types';

interface TomorrowPlannerProps {
  wardrobe: WardrobeItem[];
  onStageOutfit: (itemIds: string[]) => Promise<void>;
}

export const TomorrowPlanner: React.FC<TomorrowPlannerProps> = ({ wardrobe, onStageOutfit }) => {
  const [selectedAgenda, setSelectedAgenda] = useState<'Work' | 'Social' | 'Active' | 'Formal'>('Work');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [stagedSuccess, setStagedSuccess] = useState(false);

  const toggleSelect = (itemId: string) => {
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(prev => prev.filter(id => id !== itemId));
    } else {
      setSelectedItemIds(prev => [...prev, itemId]);
    }
  };

  const handleStage = async () => {
    if (selectedItemIds.length === 0) return;
    setStagedSuccess(true);
    await onStageOutfit(selectedItemIds);
    setTimeout(() => {
      setStagedSuccess(false);
      setSelectedItemIds([]);
    }, 4000);
  };

  const currentAvailableItems = wardrobe.filter(item => item.status === 'In Closet');

  return (
    <div className="space-y-6" id="tomorrow-planner-main">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="text-amber-500" size={24} /> Tomorrow's Planner
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Pre-orchestrate outfit combinations based on tomorrow's expected agenda topics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* AGENDA SELECTOR & CLOSET COMPATIBILITY INTERFACE */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Select Forecasted Agenda</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" id="agenda-grid">
              {[
                { id: 'Work', label: 'Office/Business', icon: <Briefcase size={16} /> },
                { id: 'Social', label: 'Casual Outing', icon: <Users size={16} /> },
                { id: 'Active', label: 'Sport/Mobility', icon: <Dumbbell size={16} /> },
                { id: 'Formal', label: 'Fine Dining/Gala', icon: <GlassWater size={16} /> }
              ].map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => setSelectedAgenda(ag.id as any)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 cursor-pointer transition-all ${
                    selectedAgenda === ag.id 
                      ? 'bg-amber-500/5 border-amber-500 text-amber-800' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className={selectedAgenda === ag.id ? 'text-amber-600' : 'text-slate-400'}>{ag.icon}</span>
                  <span className="text-xs font-bold leading-tight">{ag.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-150 pt-5 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Select Closet Pieces to Wear</label>
              <span className="text-xs text-slate-500 font-mono font-bold">Selected: {selectedItemIds.length} items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1" id="stager-closet-pool">
              {currentAvailableItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedItemIds.includes(item.id) 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl flex items-center justify-center ${
                      selectedItemIds.includes(item.id) ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Shirt size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
                      <p className={`text-[9px] font-mono leading-none mt-1 uppercase ${
                        selectedItemIds.includes(item.id) ? 'text-slate-400' : 'text-slate-400'
                      }`}>{item.category} / {item.primaryColor || 'Neutral shade'}</p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedItemIds.includes(item.id) ? 'bg-amber-400 border-amber-400 text-slate-900' : 'border-slate-300'
                  }`}>
                    {selectedItemIds.includes(item.id) && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              ))}

              {currentAvailableItems.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs text-slate-400">
                  No clean items currently "In Closet". Set laundering items to available inside the Catalog list first.
                </div>
              )}
            </div>
          </div>

          {selectedItemIds.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleStage}
                className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg"
              >
                Stage for Tomorrow morning
              </button>
            </div>
          )}
        </div>

        {/* SIDE BAR ANALYSIS PREVIEW */}
        <aside className="lg:col-span-4" id="tomorrow-briefing">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold uppercase tracking-wider text-[10px]">
                <MapPin size={12} /> Agenda Mapping
              </div>
              
              <h3 className="font-serif text-lg font-black text-slate-900">
                {selectedAgenda === 'Work' && 'Smart Commuting Look'}
                {selectedAgenda === 'Social' && 'Downtime Aesthetic'}
                {selectedAgenda === 'Active' && 'Adaptive Outer Shell'}
                {selectedAgenda === 'Formal' && 'Refined Formal Coordinates'}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed font-light">
                {selectedAgenda === 'Work' && 'We match structured blazers or formal shirts with robust fabric tones to optimize visual authority during professional briefings and morning coordinates.'}
                {selectedAgenda === 'Social' && 'We look for soft sweaters, casual joggers, or playful accessory coordinates. Comfort and casual silhouettes is our absolute primary priority here.'}
                {selectedAgenda === 'Active' && 'We prioritize flexible fabrics, high stretch tolerance and thermal-control materials optimized for dynamic physical workloads.'}
                {selectedAgenda === 'Formal' && 'Sharp outlines, deep dark colorways, and luxury contrast combinations. Suitable for upscale culinary dinners or prestigious gala agendas.'}
              </p>
            </div>

            <AnimatePresence>
              {stagedSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-600/10 border border-green-500/20 text-green-700/90 rounded-2xl p-4 flex gap-2.5 items-start"
                >
                  <Check className="shrink-0 mt-0.5" size={16} />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-widest">Staging Completed</h5>
                    <p className="text-[10px] leading-relaxed opacity-90">Your selection represents tomorrow's primary rotation outfit card.</p>
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
