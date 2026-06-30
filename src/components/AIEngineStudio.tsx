import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Cpu, Layers, Shirt, User, Info, 
  Award, TrendingUp, Compass, HelpCircle, Check, ArrowRight, Play, Eye
} from 'lucide-react';
import { WardrobeItem } from '../types';
import { AIFashionMVPSuite } from './AIFashionMVPSuite';

interface AIEngineStudioProps {
  wardrobe: WardrobeItem[];
}

interface Avatar {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'unisex';
  imgUrl: string;
  description: string;
  styleDNA: string;
}

export const AIEngineStudio: React.FC<AIEngineStudioProps> = ({ wardrobe }) => {
  const [studioSubTab, setStudioSubTab] = useState<'GENERATOR' | 'TRY_ON'>('GENERATOR');

  // Virtual Try On States
  const [selectedAvatar, setSelectedAvatar] = useState<string>('avatar-1');
  const [selectedTop, setSelectedTop] = useState<string>('');
  const [selectedBottom, setSelectedBottom] = useState<string>('');
  const [selectedShoes, setSelectedShoes] = useState<string>('');
  const [isFitting, setIsFitting] = useState(false);
  const [fitReport, setFitReport] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const avatars: Avatar[] = [
    {
      id: 'avatar-1',
      name: 'Elena (Noir Muse)',
      gender: 'female',
      imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      description: 'Sleek dark silhouettes & silk drapes',
      styleDNA: 'Classic Noir / Minimalist'
    },
    {
      id: 'avatar-2',
      name: 'Marcus (Avant-Garde Lead)',
      gender: 'male',
      imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      description: 'Asymmetric drapes & utility layers',
      styleDNA: 'Cyber Couture / Streetwear'
    },
    {
      id: 'avatar-3',
      name: 'Sari (Nordic Editorialist)',
      gender: 'unisex',
      imgUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
      description: 'Warm cashmere layers & beige neutrals',
      styleDNA: 'Nordic Warm / Minimalist'
    }
  ];

  const handleRunFitting = () => {
    if (!selectedTop && !selectedBottom && !selectedShoes) {
      setErrorMessage("Please select at least one garment from your archive to fit onto the avatar.");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    setErrorMessage(null);
    setIsFitting(true);
    setFitReport(null);

    setTimeout(() => {
      setIsFitting(false);
      const topItem = wardrobe.find(w => w.id === selectedTop);
      const bottomItem = wardrobe.find(w => w.id === selectedBottom);
      
      setFitReport({
        suitabilityScore: 88 + Math.floor(Math.random() * 10),
        comradeAlignment: "96% High Coherence",
        commercialValueIndex: "A+ ($180 Affiliate potential)",
        stylistComments: `The drapes of ${topItem?.title || 'the selected top'} blend gracefully with ${bottomItem?.title || 'the bottom outline'}. Excellent volume proportions.`
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 select-none animate-fade-in text-white py-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
            AI Co-Creation Suite
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-3xl text-white mt-1">
            AI Design Studio
          </h2>
          <p className="text-xs text-white/40 font-serif italic mt-1">
            "Leveraging high-fidelity style models for try-on & outfits compilation."
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
          {[
            { id: 'GENERATOR', label: 'Outfit Stylist' },
            { id: 'TRY_ON', label: 'Virtual Try-On' }
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setStudioSubTab(sub.id as any)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                studioSubTab === sub.id 
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
        {studioSubTab === 'GENERATOR' ? (
          <motion.div
            key="generator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* RENDER THE HIGH END CORE INTERACTIVE MVPSUITE */}
            <AIFashionMVPSuite />
          </motion.div>
        ) : (
          <motion.div
            key="try-on"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
          >
            {/* LEFT: FIT SELECTION PANEL (8 Columns) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Avatar Model Grid */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">
                  Step 1: Select Avatar Model
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {avatars.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`group border rounded-xl overflow-hidden p-3 transition-all text-left space-y-3 cursor-pointer flex flex-col justify-between ${
                        selectedAvatar === av.id 
                          ? 'bg-white/10 border-white' 
                          : 'bg-white/[0.01] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-900 relative">
                        <img 
                          src={av.imgUrl} 
                          alt={av.name} 
                          className="absolute inset-0 w-full h-full object-cover grayscale opacity-65 group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                      <div>
                        <span className="block text-xs font-serif font-medium text-white">{av.name}</span>
                        <span className="block text-[9px] font-mono text-white/40 mt-0.5 leading-tight">{av.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Garment Archive Dressing Room Selection */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">
                  Step 2: Dress Up From Archive Wall
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Select Top */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">Tops / Layer</label>
                    <select
                      value={selectedTop}
                      onChange={(e) => setSelectedTop(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-white transition-all text-white/80"
                    >
                      <option value="">[ Bare shoulder ]</option>
                      {wardrobe.filter(w => w.category === 'Casual' || w.title.toLowerCase().includes('shirt') || w.title.toLowerCase().includes('tee')).map(item => (
                        <option key={item.id} value={item.id}>{item.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Bottom */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">Bottoms / Silhouette</label>
                    <select
                      value={selectedBottom}
                      onChange={(e) => setSelectedBottom(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-white transition-all text-white/80"
                    >
                      <option value="">[ Clean legs ]</option>
                      {wardrobe.filter(w => w.category === 'Formal' || w.title.toLowerCase().includes('pant') || w.title.toLowerCase().includes('denim') || w.title.toLowerCase().includes('trouser')).map(item => (
                        <option key={item.id} value={item.id}>{item.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Footwear */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">Footwear</label>
                    <select
                      value={selectedShoes}
                      onChange={(e) => setSelectedShoes(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-white transition-all text-white/80"
                    >
                      <option value="">[ Bare foot ]</option>
                      {wardrobe.filter(w => w.title.toLowerCase().includes('shoe') || w.title.toLowerCase().includes('boot') || w.title.toLowerCase().includes('sneaker') || w.title.toLowerCase().includes('loafer')).map(item => (
                        <option key={item.id} value={item.id}>{item.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl flex items-start gap-2.5 text-xs font-mono"
                    >
                      <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={handleRunFitting}
                    disabled={isFitting}
                    className="w-full bg-white hover:bg-neutral-200 text-black py-3.5 rounded-xl font-mono text-[11px] uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isFitting ? (
                      <>
                        <Cpu className="w-4 h-4 animate-spin text-indigo-600" />
                        <span>Running Coherence Fitting Check...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Run Virtual Fitting Check</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: LIVE PREVIEW & SCORE (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              {/* The Live Dresser Mockup */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden h-full min-h-[380px]">
                {/* Background ambient lighting */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                {(() => {
                  const currentAvatarObj = avatars.find(a => a.id === selectedAvatar) || avatars[0];
                  return (
                    <div className="w-full space-y-6 relative z-10">
                      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/30 block">
                        Dressing Preview Pane
                      </span>

                      {/* Display avatar silhouette layered with selected garments text */}
                      <div className="w-[180px] aspect-[3/4] mx-auto rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg relative">
                        <img 
                          src={currentAvatarObj.imgUrl} 
                          alt={currentAvatarObj.name}
                          className={`absolute inset-0 w-full h-full object-cover transition-all ${isFitting ? 'scale-105 blur-sm opacity-50' : 'grayscale opacity-75'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4">
                          <span className="text-[10px] font-mono text-white/40 block uppercase">Fitted Avatar</span>
                          <strong className="text-xs font-serif text-white">{currentAvatarObj.name}</strong>
                        </div>
                      </div>

                      {/* Dress status labels */}
                      <div className="space-y-1 max-w-[220px] mx-auto">
                        <div className="flex justify-between text-[9px] font-mono text-white/50">
                          <span>TOP:</span>
                          <span className="text-white font-medium truncate max-w-[150px]">
                            {selectedTop ? wardrobe.find(w => w.id === selectedTop)?.title : '[ BARE ]'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-white/50">
                          <span>BOTTOM:</span>
                          <span className="text-white font-medium truncate max-w-[150px]">
                            {selectedBottom ? wardrobe.find(w => w.id === selectedBottom)?.title : '[ BARE ]'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-white/50">
                          <span>SHOES:</span>
                          <span className="text-white font-medium truncate max-w-[150px]">
                            {selectedShoes ? wardrobe.find(w => w.id === selectedShoes)?.title : '[ BARE ]'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Live Scores Reports */}
                <AnimatePresence>
                  {fitReport && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-left space-y-3 pt-4 border-t border-dashed"
                    >
                      <div className="flex justify-between items-center pb-1 border-b border-white/5">
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Suitability metrics</span>
                        <span className="text-amber-400 font-mono text-xs font-bold">★ {fitReport.suitabilityScore}% Match</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pb-1.5">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono text-white/30 uppercase block">Affiliate Potential</span>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold">{fitReport.commercialValueIndex}</span>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <span className="text-[8px] font-mono text-white/30 uppercase block">Coherence index</span>
                          <span className="text-[10px] font-mono text-purple-300 font-semibold">{fitReport.comradeAlignment}</span>
                        </div>
                      </div>

                      <p className="text-[10px] font-serif italic text-white/50 leading-relaxed border-t border-white/5 pt-2">
                        "{fitReport.stylistComments}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
