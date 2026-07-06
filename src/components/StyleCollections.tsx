import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, Plus, Tag, HelpCircle, Check, Award, LayoutGrid, Trash2, Sliders } from 'lucide-react';
import { WardrobeItem } from '../types';

interface StyleCollectionsProps {
  wardrobe: WardrobeItem[];
}

interface Capsule {
  id: string;
  name: string;
  description: string;
  vibe: string;
  colorTheme: string;
  baseItems: Array<{ id: string; title: string; category: string; imageUrl?: string }>;
}

export const StyleCollections: React.FC<StyleCollectionsProps> = ({ wardrobe }) => {
  const [capsules, setCapsules] = useState<Capsule[]>([
    {
      id: 'cap-1',
      name: 'Nordic Autumn Capsule',
      description: 'Elegant, muted sand tones paired with soft cashmere knit layers.',
      vibe: 'Nordic Warm / Minimalist',
      colorTheme: 'Sand, Oatmeal, Cream',
      baseItems: [
        { id: 'b-1', title: 'Double-Breasted Wool Overcoat', category: 'Outerwear' },
        { id: 'b-2', title: 'Ribbed Cashmere Turtleneck', category: 'Knitwear' },
        { id: 'b-3', title: 'Relaxed Tailored Chinos', category: 'Casual' }
      ]
    },
    {
      id: 'cap-2',
      name: 'Avant-Garde Noir rotation',
      description: 'Sleek asymmetric shapes and architectural midnight silhouettes.',
      vibe: 'Classic Noir / Cyber Couture',
      colorTheme: 'Charcoal, Midnight, Matte Black',
      baseItems: [
        { id: 'b-4', title: 'Asymmetric Drape Trench', category: 'Outerwear' },
        { id: 'b-5', title: 'Structured Utility Vest', category: 'Accessories' }
      ]
    },
    {
      id: 'cap-3',
      name: 'Boutique Office Integrity',
      description: 'Relaxed-fit tailoring for smart, elevated contemporary office environments.',
      vibe: 'Modern Tailoring / Professional',
      colorTheme: 'Slate, Light Gray, Ice Blue',
      baseItems: [
        { id: 'b-6', title: 'Relaxed Fit Wool Blazer', category: 'Outerwear' },
        { id: 'b-7', title: 'Off-White Linen Shirt', category: 'Formal' }
      ]
    }
  ]);

  const [activeCapsuleId, setActiveCapsuleId] = useState<string>('cap-1');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  const activeCapsule = capsules.find(c => c.id === activeCapsuleId) || capsules[0];
  
  // Calculate dynamic capsule balance indexes
  const totalItemsCount = activeCapsule.baseItems.length;
  const balanceScore = Math.min(100, Math.floor((totalItemsCount / 6) * 100));
  
  let balanceLevel = "Developing (Under 5 items)";
  let balanceColor = "text-amber-400";
  if (totalItemsCount >= 5 && totalItemsCount < 8) {
    balanceLevel = "Highly Coherent (Cohesive Rotation)";
    balanceColor = "text-violet-400";
  } else if (totalItemsCount >= 8) {
    balanceLevel = "Gold Standard (10-Piece Minimalist Capsule)";
    balanceColor = "text-emerald-400";
  }

  const handleAddCustomCapsule = () => {
    const name = prompt("Enter capsule name:");
    if (!name) return;
    const desc = prompt("Enter description:");
    const vibe = prompt("Enter style vibe (e.g. Streetwear / Casual):");
    
    const newCap: Capsule = {
      id: `custom-cap-${Date.now()}`,
      name,
      description: desc || 'Custom styling collection.',
      vibe: vibe || 'Sartorial',
      colorTheme: 'Multi-Tone',
      baseItems: []
    };

    setCapsules(prev => [...prev, newCap]);
    setActiveCapsuleId(newCap.id);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Created "${name}" Capsule portfolio!` }));
  };

  const handleAssignItem = () => {
    if (!selectedItemId) return;
    const chosenItem = wardrobe.find(w => w.id === selectedItemId);
    if (!chosenItem) return;

    // Check if already exists in active capsule
    if (activeCapsule.baseItems.some(i => i.id === chosenItem.id)) {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: "This wardrobe piece is already allocated into this capsule." 
      }));
      return;
    }

    const updatedCapsules = capsules.map(c => {
      if (c.id === activeCapsuleId) {
        return {
          ...c,
          baseItems: [
            ...c.baseItems,
            { id: chosenItem.id, title: chosenItem.title, category: chosenItem.category, imageUrl: chosenItem.imageUrl }
          ]
        };
      }
      return c;
    });

    setCapsules(updatedCapsules);
    setShowAssignModal(false);
    setSelectedItemId('');
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Assigned ${chosenItem.title} to ${activeCapsule.name}!` }));
  };

  const handleRemoveFromCapsule = (itemId: string, itemTitle: string) => {
    const updatedCapsules = capsules.map(c => {
      if (c.id === activeCapsuleId) {
        return {
          ...c,
          baseItems: c.baseItems.filter(i => i.id !== itemId)
        };
      }
      return c;
    });

    setCapsules(updatedCapsules);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Removed ${itemTitle} from capsule rotation.` }));
  };

  return (
    <div className="space-y-6 text-white text-left animate-fade-in" id="style-collections-root">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
            Sartorial Portfolios
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-3xl text-white mt-1">
            Capsule Collections
          </h2>
          <p className="text-xs text-white/40 font-serif italic mt-1">
            "Organize coordinates, design templates, and acquisitions into seasonal boards."
          </p>
        </div>

        <button
          onClick={handleAddCustomCapsule}
          className="px-3.5 py-2 bg-white hover:bg-neutral-200 text-black rounded-xl font-mono text-[9.5px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Capsule Portfolio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: CAPSULE BOARDS SELECTION (4 Columns) */}
        <div className="lg:col-span-4 bg-[#07070c]/50 border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block font-bold">Active Collections</span>
            
            <div className="space-y-2">
              {capsules.map((cap) => {
                const isActive = cap.id === activeCapsuleId;
                return (
                  <button
                    key={cap.id}
                    onClick={() => setActiveCapsuleId(cap.id)}
                    className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer block ${
                      isActive 
                        ? 'bg-[#181135] border-violet-500/30' 
                        : 'bg-[#07070c] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest block mb-1">{cap.vibe}</span>
                    <h4 className="text-xs font-bold text-white leading-snug">{cap.name}</h4>
                    <p className="text-[10px] text-white/40 mt-1.5 line-clamp-2 leading-relaxed">{cap.description}</p>
                    <div className="mt-3 flex items-center justify-between text-[8.5px] font-mono text-white/30">
                      <span>THEME: <span className="text-white/60">{cap.colorTheme}</span></span>
                      <span>{cap.baseItems.length} pieces</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CURRENT CAPSULE BOARD (8 Columns) */}
        <div className="lg:col-span-8 bg-[#07070c]/50 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header Block with metrics */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
              <div>
                <span className="text-[9px] font-mono text-violet-400 uppercase tracking-wider block font-semibold">Active Board</span>
                <h3 className="text-base font-bold text-white font-sans mt-0.5">{activeCapsule.name}</h3>
              </div>

              {/* Integrity Meter */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex gap-4 text-left items-center">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider block">Capsule Integrity</span>
                  <span className={`text-[10.5px] font-bold font-sans ${balanceColor}`}>{balanceLevel}</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white/5 flex items-center justify-center text-[10px] font-mono font-bold text-white bg-white/[0.01]">
                  {balanceScore}%
                </div>
              </div>
            </div>

            {/* Grid of capsule items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              {/* Add trigger card */}
              <button
                onClick={() => setShowAssignModal(true)}
                className="border border-dashed border-white/10 hover:border-white/20 rounded-xl flex flex-col items-center justify-center p-4 text-center h-44 cursor-pointer bg-white/[0.005] hover:bg-white/[0.01] transition-all"
              >
                <Plus className="w-6 h-6 text-white/25 mb-2" />
                <span className="text-[10px] font-mono text-white/45 uppercase tracking-wider">Allocate Closet Item</span>
                <span className="text-[8px] font-mono text-white/20 mt-1 uppercase">from local closet</span>
              </button>

              {activeCapsule.baseItems.map((item, idx) => {
                const wardrobeRef = wardrobe.find(w => w.id === item.id);
                const isCustomAllocated = !!wardrobeRef;
                const fallbackUrl = wardrobeRef?.imageUrl || "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=200&auto=format&fit=crop";
                
                return (
                  <div
                    key={idx}
                    className="relative bg-[#05050a] border border-white/5 p-3.5 rounded-xl flex flex-col justify-between h-44 overflow-hidden group hover:border-violet-500/20 duration-300 transition-all"
                  >
                    <div className="space-y-2 relative z-10 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">{item.category}</span>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                          isCustomAllocated 
                            ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20' 
                            : 'bg-white/5 text-white/40'
                        }`}>
                          {isCustomAllocated ? 'ALLOCATED' : 'BASELINE'}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-bold text-white font-mono line-clamp-2 leading-snug">{item.title}</h4>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                      <span className="text-[8px] font-mono text-white/30 uppercase">ID: {item.id.slice(0, 5)}</span>
                      <button
                        onClick={() => handleRemoveFromCapsule(item.id, item.title)}
                        className="p-1.5 bg-white/[0.02] hover:bg-red-950/20 text-white/30 hover:text-red-400 border border-white/5 rounded-md transition-all cursor-pointer"
                        title="Remove from capsule"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeCapsule.baseItems.length === 0 && (
              <div className="py-16 text-center bg-white/[0.005] border border-white/5 rounded-2xl">
                <p className="text-xs font-serif italic text-white/30">"This capsule has no coordinates allocated yet."</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Garment Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0b14] border border-white/10 rounded-2xl max-w-md w-full p-6 text-left space-y-5"
            >
              <div>
                <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider">Allocate Garment to Capsule</h3>
                <p className="text-xs text-white/40 font-sans mt-1">Select a garment from your physical closet archive below to assign to "{activeCapsule.name}".</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-white/40 block">Select Garment</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white/80 focus:outline-none focus:border-violet-500 transition-all"
                >
                  <option value="">[ Select item from local closet ]</option>
                  {wardrobe.map(item => (
                    <option key={item.id} value={item.id}>{item.title} ({item.category})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedItemId('');
                  }}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-mono font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignItem}
                  disabled={!selectedItemId}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center"
                >
                  Confirm Allocation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
