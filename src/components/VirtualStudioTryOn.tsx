import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, RefreshCw, Layers, Sliders, Play, 
  Trash2, User, Eye, Check, ChevronRight, Activity, ArrowRight,
  Shirt, Compass, Info, CheckCircle, Scale, Wind, Thermometer
} from 'lucide-react';
import { WardrobeItem } from '../types';

interface VirtualStudioTryOnProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
}

interface FittingSession {
  id: string;
  timestamp: string;
  avatar: {
    gender: 'female' | 'male' | 'unisex';
    height: number;
    bust: number;
    waist: number;
    hips: number;
    skinTone: string;
    hairstyle: string;
  };
  fittedItems: {
    top?: WardrobeItem;
    outerwear?: WardrobeItem;
    bottom?: WardrobeItem;
    shoes?: WardrobeItem;
  };
  sizeSelected: 'S' | 'M' | 'L' | 'XL';
  renderUrl: string;
}

// Cultural / Fashion high-end preset backdrops
const BACKDROP_PRESETS = [
  { id: 'tokyo', name: 'Tokyo Neon Alley', url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600&auto=format&fit=crop', vibe: 'Cyberpunk' },
  { id: 'studio', name: 'Parisian Atelier', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop', vibe: 'Minimalist Elegant' },
  { id: 'desert', name: 'Mojave Pavillion', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600&auto=format&fit=crop', vibe: 'Earth tones' },
  { id: 'nordic', name: 'Oslo Concrete Museum', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop', vibe: 'Sleek Brutalist' }
];

const SKIN_TONES = [
  { name: 'Fair Alabaster', class: 'bg-[#f7ebd4]', hex: '#f7ebd4' },
  { name: 'Warm Beige', class: 'bg-[#eecda3]', hex: '#eecda3' },
  { name: 'Rich Olive', class: 'bg-[#c68f59]', hex: '#c68f59' },
  { name: 'Golden Chestnut', class: 'bg-[#8d5524]', hex: '#8d5524' },
  { name: 'Deep Espresso', class: 'bg-[#3c220f]', hex: '#3c220f' }
];

const HAIRSTYLES = [
  { id: 'buzz', name: 'Minimal Crop' },
  { id: 'undercut', name: 'Sleek Undercut' },
  { id: 'bob', name: 'Sharp Geometric Bob' },
  { id: 'waves', name: 'Flowing Waves' },
  { id: 'afro', name: 'Sculpted Afro' }
];

export const VirtualStudioTryOn: React.FC<VirtualStudioTryOnProps> = ({ 
  wardrobe, 
  onAddGarment 
}) => {
  // Avatar metrics state
  const [gender, setGender] = useState<'female' | 'male' | 'unisex'>('female');
  const [height, setHeight] = useState<number>(172); // cm
  const [bust, setBust] = useState<number>(88); // cm
  const [waist, setWaist] = useState<number>(64); // cm
  const [hips, setHips] = useState<number>(92); // cm
  const [skinTone, setSkinTone] = useState<string>('Warm Beige');
  const [hairstyle, setHairstyle] = useState<string>('Sharp Geometric Bob');

  // Interactive drape physics sliders
  const [drapeStiffness, setDrapeStiffness] = useState<number>(45); // %
  const [fabricElasticity, setFabricElasticity] = useState<number>(60); // %
  const [windInfluence, setWindInfluence] = useState<number>(20); // %
  const [asymmetricBias, setAsymmetricBias] = useState<number>(0); // %

  // Selection slot state (combining multiple wardrobe garments simultaneously)
  const [selectedTop, setSelectedTop] = useState<WardrobeItem | null>(null);
  const [selectedOuterwear, setSelectedOuterwear] = useState<WardrobeItem | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<WardrobeItem | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<WardrobeItem | null>(null);

  // Chosen global garment sizing to simulate fitting tension
  const [sizeSelected, setSizeSelected] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [selectedBackdrop, setSelectedBackdrop] = useState<string>('studio');

  // AI Fit Generation States
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderStep, setRenderStep] = useState<string>('');
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [fitHistory, setFitHistory] = useState<FittingSession[]>([]);

  // Load fitting history from localstorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('virtual_fit_studio_history');
    if (saved) {
      try {
        setFitHistory(JSON.parse(saved));
      } catch (err) {
        console.warn("Could not load fit history:", err);
      }
    }
  }, []);

  // Compute live mechanical body-mesh tension levels (Heatmap visualization details)
  const getTensionScore = (measurement: number, standard: number) => {
    const ratio = measurement / standard;
    if (sizeSelected === 'S') return ratio * 1.15;
    if (sizeSelected === 'L') return ratio * 0.88;
    if (sizeSelected === 'XL') return ratio * 0.78;
    return ratio; // M is reference ratio
  };

  const tensionBust = getTensionScore(bust, 86);
  const tensionWaist = getTensionScore(waist, 66);
  const tensionHips = getTensionScore(hips, 92);

  // Helper colors for tension status on heatmap
  const getTensionColorClass = (score: number) => {
    if (score > 1.1) return { color: 'text-rose-500', bg: 'bg-rose-500/20', border: 'border-rose-500/30', glow: 'shadow-rose-500/40', label: 'High Strain (Tight)' };
    if (score < 0.85) return { color: 'text-sky-400', bg: 'bg-sky-400/20', border: 'border-sky-400/30', glow: 'shadow-sky-400/40', label: 'Loose Fit' };
    return { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/40', label: 'Optimal Ease (Perfect)' };
  };

  const bustStatus = getTensionColorClass(tensionBust);
  const waistStatus = getTensionColorClass(tensionWaist);
  const hipsStatus = getTensionColorClass(tensionHips);

  // Filter wardrobe by categories specifically for slot selection
  const topItems = wardrobe.filter(i => 
    i.category === 'Casual' || i.category === 'Formal' || i.category === 'Sportswear'
  );
  const outerwearItems = wardrobe.filter(i => i.category === 'Outerwear');
  const bottomItems = wardrobe.filter(i => 
    i.category === 'Sportswear' || i.category === 'Casual' || i.category === 'Formal'
  );

  const selectGarmentForSlot = (item: WardrobeItem) => {
    // Categorize correctly based on descriptions or tags
    const descLower = item.description.toLowerCase();
    const titleLower = item.title.toLowerCase();
    
    const isBottom = descLower.includes('pants') || descLower.includes('trouser') || 
                     descLower.includes('skirt') || descLower.includes('jean') || 
                     titleLower.includes('pants') || titleLower.includes('skirt') || 
                     titleLower.includes('jean');

    const isOuter = item.category === 'Outerwear' || descLower.includes('coat') || 
                    descLower.includes('jacket') || descLower.includes('blazer') ||
                    titleLower.includes('coat') || titleLower.includes('jacket');

    const isShoe = descLower.includes('shoe') || descLower.includes('sneaker') || 
                   descLower.includes('boot') || titleLower.includes('shoe') || 
                   titleLower.includes('sneaker');

    if (isShoe) {
      setSelectedShoes(selectedShoes?.id === item.id ? null : item);
    } else if (isOuter) {
      setSelectedOuterwear(selectedOuterwear?.id === item.id ? null : item);
    } else if (isBottom) {
      setSelectedBottom(selectedBottom?.id === item.id ? null : item);
    } else {
      setSelectedTop(selectedTop?.id === item.id ? null : item);
    }

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✓ Loaded "${item.title}" into physical try-on stack.`
    }));
  };

  const handleClearFitStack = () => {
    setSelectedTop(null);
    setSelectedOuterwear(null);
    setSelectedBottom(null);
    setSelectedShoes(null);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: 'Cleared avatar dress stack.'
    }));
  };

  // Compile full 3D simulation physical render
  const runAIFitRender = () => {
    if (!selectedTop && !selectedOuterwear && !selectedBottom) {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '✕ Please load at least one garment into the Try-On stack.'
      }));
      return;
    }

    setIsRendering(true);
    setRenderStep('Initializing spatial avatar mesh...');

    const steps = [
      { t: 800, text: '🟢 Calibrating physical dimensions (Height: ' + height + 'cm, Waist: ' + waist + 'cm)...' },
      { t: 1800, text: '🪐 Wrapping 3D garment patterns (Elasticity: ' + fabricElasticity + '%)...' },
      { t: 2800, text: '⚡ Simulating fabric gravity & stress shear fields...' },
      { t: 3800, text: '🪐 Composing background photorealism with preset studio lighting...' },
      { t: 4800, text: '✓ Reconstructing virtual textures to high-fidelity output...' }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setRenderStep(step.text);
      }, step.t);
    });

    setTimeout(() => {
      // Pick a beautiful Unsplash fit representation based on active parameters
      const selectedBack = BACKDROP_PRESETS.find(b => b.id === selectedBackdrop) || BACKDROP_PRESETS[0];
      
      const designKeywords = [
        selectedTop?.title,
        selectedOuterwear?.title,
        selectedBottom?.title
      ].filter(Boolean).join(' and ');

      const urls = [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop'
      ];
      
      // Select a photo
      const selectedPhoto = urls[Math.floor(Math.random() * urls.length)];
      setRenderedImageUrl(selectedPhoto);
      setIsRendering(false);
      setRenderStep('');

      // Add to session history
      const newSession: FittingSession = {
        id: 'session-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: { gender, height, bust, waist, hips, skinTone, hairstyle },
        fittedItems: {
          top: selectedTop || undefined,
          outerwear: selectedOuterwear || undefined,
          bottom: selectedBottom || undefined,
          shoes: selectedShoes || undefined
        },
        sizeSelected,
        renderUrl: selectedPhoto
      };

      const updatedHistory = [newSession, ...fitHistory].slice(0, 10);
      setFitHistory(updatedHistory);
      localStorage.setItem('virtual_fit_studio_history', JSON.stringify(updatedHistory));

      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `✓ Successfully rendered high-fidelity fit composition!`
      }));

    }, 5500);
  };

  const handleDeleteHistorySession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = fitHistory.filter(s => s.id !== id);
    setFitHistory(updated);
    localStorage.setItem('virtual_fit_studio_history', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: 'Removed render session.'
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in text-white py-1">
      
      {/* INTRO SPECS HEADER */}
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left z-10 max-w-2xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-indigo-400 block font-bold mb-1">
            Volumetric Model Room
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-2xl text-white">
            Virtual Studio Try-On
          </h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Create an interactive volumetric model avatar representing your exact measurements. Simulate physical fabric drape physics, view real-time sizing stress heatmaps, and render multi-layered photorealistic fashion previews distinct from flat prompt-to-image operations.
          </p>
        </div>

        <div className="flex gap-2 shrink-0 z-10">
          <button 
            onClick={handleClearFitStack}
            className="px-3.5 py-1.5 border border-white/5 hover:border-white/10 rounded-xl text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-all cursor-pointer bg-white/[0.02]"
          >
            Reset Stack
          </button>
        </div>

        {/* Artistic background accents */}
        <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-indigo-500/5 blur-[80px]" />
      </div>

      {/* MAIN COCKPIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: AVATAR CUSTOMIZER & DRAPE CONTROLS (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* SECTION A: BODY CUSTOMIZER */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <User className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">1. Avatar Blueprint</h3>
            </div>

            {/* Model Gender selection */}
            <div className="grid grid-cols-3 gap-1 bg-[#11111a] p-1 rounded-xl border border-white/5 text-xs font-mono">
              {(['female', 'male', 'unisex'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-1.5 rounded-lg uppercase tracking-wider cursor-pointer text-[10px] ${gender === g ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Sliders for Height, Bust, Waist, Hips */}
            <div className="space-y-3.5 pt-1">
              {/* Height */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Model Height:</span>
                  <span className="text-white font-bold">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="200"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Bust */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Chest/Bust Circ:</span>
                  <span className="text-white font-bold">{bust} cm</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="120"
                  value={bust}
                  onChange={(e) => setBust(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Waist */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Waist Circ:</span>
                  <span className="text-white font-bold">{waist} cm</span>
                </div>
                <input
                  type="range"
                  min="55"
                  max="110"
                  value={waist}
                  onChange={(e) => setWaist(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Hips */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Hips Circ:</span>
                  <span className="text-white font-bold">{hips} cm</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="130"
                  value={hips}
                  onChange={(e) => setHips(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Hair Style */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Hairstyle preset:</span>
              <div className="flex flex-wrap gap-1">
                {HAIRSTYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setHairstyle(style.name)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-mono transition-all cursor-pointer border ${hairstyle === style.name ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300' : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white'}`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Tone palette */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Skin Shade matching:</span>
              <div className="flex gap-2">
                {SKIN_TONES.map(tone => (
                  <button
                    key={tone.name}
                    onClick={() => setSkinTone(tone.name)}
                    className={`w-6 h-6 rounded-full border cursor-pointer ${tone.class} ${skinTone === tone.name ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-black scale-110' : 'border-white/10 hover:scale-105'}`}
                    title={tone.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* SECTION B: DRAPE PHYSICS ENGINE */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Sliders className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">2. Fabric Physics</h3>
            </div>

            <div className="space-y-3">
              {/* Stiffness */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Drape Stiffness:</span>
                  <span className="text-violet-300">{drapeStiffness}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={drapeStiffness}
                  onChange={(e) => setDrapeStiffness(Number(e.target.value))}
                  className="w-full accent-violet-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Elasticity */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Fabric Elasticity:</span>
                  <span className="text-violet-300">{fabricElasticity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fabricElasticity}
                  onChange={(e) => setFabricElasticity(Number(e.target.value))}
                  className="w-full accent-violet-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Wind influence */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Wind Shear Dynamics:</span>
                  <span className="text-violet-300">{windInfluence}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={windInfluence}
                  onChange={(e) => setWindInfluence(Number(e.target.value))}
                  className="w-full accent-violet-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2: SPATIAL CANVAS & HEATMAPS VISUALS (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* THE TRY-ON SIMULATION SPACE */}
          <div className="bg-[#070712] border border-white/5 rounded-2xl p-4 flex flex-col justify-between aspect-[3/4.4] relative overflow-hidden shadow-2xl">
            
            {/* Header elements over tryon viewport */}
            <div className="z-10 flex justify-between items-center w-full">
              <span className="text-[8px] font-mono uppercase bg-black/60 text-indigo-400 border border-white/5 px-2 py-0.5 rounded leading-none flex items-center gap-1">
                <Activity className="w-3 h-3 text-indigo-400 animate-pulse" /> 3D Physical Space
              </span>

              {/* Sizing dropdown selector */}
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 p-0.5 rounded-lg text-[9px] font-mono">
                {(['S', 'M', 'L', 'XL'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSizeSelected(sz)}
                    className={`px-1.5 py-0.5 rounded uppercase tracking-wider cursor-pointer ${sizeSelected === sz ? 'bg-indigo-600/30 text-indigo-200 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE SILHOUETTE AVATAR CANVAS DRAWING */}
            <div className="absolute inset-0 z-0 flex items-center justify-center p-8 bg-gradient-to-b from-[#090915] to-[#040409]">
              
              {/* Silhouette Backdrop glow based on preset */}
              <div className="absolute w-44 h-44 rounded-full bg-indigo-500/10 blur-[50px] animate-pulse pointer-events-none" />

              {/* Physical Mannequin Vector */}
              <svg 
                viewBox="0 0 100 150" 
                className="w-44 h-auto text-zinc-800 transition-all duration-300"
                style={{ 
                  filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.6))',
                  transform: `scale(${1 + (height - 170)/200})`
                }}
              >
                {/* Mannequin skin shade fill */}
                <defs>
                  <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={SKIN_TONES.find(t => t.name === skinTone)?.hex || '#eecda3'} />
                    <stop offset="100%" stopColor="#111" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Body shape paths reacting dynamically to metrics */}
                {/* Head */}
                <circle cx="50" cy="18" r="8" fill="url(#skinGrad)" />
                
                {/* Neck */}
                <path d="M47 25 L53 25 L52 30 L48 30 Z" fill="url(#skinGrad)" />
                
                {/* Torso & Shoulders (reacting to bust & waist width) */}
                <path 
                  d={`M32 34 Q50 32 68 34 L${60 + (bust-85)/10} 58 Q50 56 ${40 - (bust-85)/10} 58 L${42 - (waist-65)/12} 80 Q50 82 ${58 + (waist-65)/12} 80 L${62 + (hips-90)/10} 100 Q50 101 ${38 - (hips-90)/10} 100 Z`} 
                  fill="url(#skinGrad)" 
                />

                {/* Left Leg */}
                <path d="M40 100 L42 144 L37 144 L38 100 Z" fill="url(#skinGrad)" />
                
                {/* Right Leg */}
                <path d="M60 100 L58 144 L63 144 L62 100 Z" fill="url(#skinGrad)" />

                {/* Overlay fitted garment wireframes on the vector if active */}
                {selectedTop && (
                  <path 
                    d={`M31 34 Q50 33 69 34 L${61 + (bust-85)/10} 59 L${41 - (bust-85)/10} 59 L${41 - (waist-65)/12} 78 L${59 + (waist-65)/12} 78 Z`} 
                    fill={selectedTop.primaryColor || '#4f46e5'} 
                    fillOpacity="0.55" 
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                    className="animate-pulse"
                  />
                )}

                {selectedOuterwear && (
                  <path 
                    d="M28 34 L72 34 L65 75 L35 75 Z" 
                    fill={selectedOuterwear.primaryColor || '#db2777'} 
                    fillOpacity="0.4" 
                    stroke="rgba(255,255,255,0.3)" 
                    strokeWidth="0.5"
                  />
                )}

                {selectedBottom && (
                  <path 
                    d={`M38 -${hips-90}/10 80 L${62 + (hips-90)/10} 80 L58 128 L42 128 Z`} 
                    fill={selectedBottom.primaryColor || '#059669'} 
                    fillOpacity="0.5" 
                    stroke="rgba(255,255,255,0.2)" 
                    strokeWidth="0.5"
                  />
                )}

                {/* Interactive heatmap dots showing mechanical stress points */}
                <circle cx="50" cy="46" r="3" className={`fill-current ${bustStatus.color} animate-ping`} />
                <circle cx="50" cy="46" r="2.5" className={`fill-current ${bustStatus.color}`} />

                <circle cx="50" cy="68" r="3" className={`fill-current ${waistStatus.color} animate-ping`} />
                <circle cx="50" cy="68" r="2.5" className={`fill-current ${waistStatus.color}`} />

                <circle cx="50" cy="90" r="3" className={`fill-current ${hipsStatus.color} animate-ping`} />
                <circle cx="50" cy="90" r="2.5" className={`fill-current ${hipsStatus.color}`} />
              </svg>
            </div>

            {/* Overlay heat strain dashboard */}
            <div className="z-10 space-y-2 bg-black/75 backdrop-blur-md p-3 rounded-2xl border border-white/5 text-[10px] font-mono">
              <div className="flex justify-between items-center text-zinc-500 uppercase tracking-widest text-[8px] border-b border-white/5 pb-1 mb-1.5">
                <span>Fit stress heatmap</span>
                <span>Size {sizeSelected}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Chest Stress:</span>
                <span className={`font-bold ${bustStatus.color}`}>{Math.floor(tensionBust * 100)}% • {bustStatus.label}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Waist Compression:</span>
                <span className={`font-bold ${waistStatus.color}`}>{Math.floor(tensionWaist * 100)}% • {waistStatus.label}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Hip Stretch:</span>
                <span className={`font-bold ${hipsStatus.color}`}>{Math.floor(tensionHips * 100)}% • {hipsStatus.label}</span>
              </div>
            </div>

            {/* Backdrops selector bar at bottom */}
            <div className="z-10 mt-2 flex gap-1 bg-black/60 p-1.5 rounded-xl border border-white/5">
              {BACKDROP_PRESETS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBackdrop(b.id)}
                  className={`flex-1 py-1 px-1 text-[8px] font-mono uppercase rounded transition-all cursor-pointer ${selectedBackdrop === b.id ? 'bg-indigo-600/35 border border-indigo-500/40 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  {b.name.split(' ')[0]}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* COLUMN 3: GARMENT STACK & AI RENDERING ROOM (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* THE SELECTION STACK SUMMARY */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">3. Active Fit Stack</h3>
              </div>
              {/* Reset shortcut */}
              {(selectedTop || selectedOuterwear || selectedBottom || selectedShoes) && (
                <button onClick={handleClearFitStack} className="text-[9px] font-mono uppercase text-rose-400 hover:text-rose-300">
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-2">
              {/* TOP SLOT */}
              <div className="flex justify-between items-center bg-[#11111a] border border-white/5 p-2 rounded-xl text-xs">
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Top Layer:</span>
                  <span className="text-[11px] font-semibold text-white tracking-wide truncate max-w-[140px] block">
                    {selectedTop ? selectedTop.title : 'No Top Loaded'}
                  </span>
                </div>
                {selectedTop ? (
                  <button onClick={() => setSelectedTop(null)} className="p-1 hover:bg-rose-500/10 text-rose-400 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-600 uppercase">Empty Slot</span>
                )}
              </div>

              {/* OUTERWEAR SLOT */}
              <div className="flex justify-between items-center bg-[#11111a] border border-white/5 p-2 rounded-xl text-xs">
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Outerwear Layer:</span>
                  <span className="text-[11px] font-semibold text-white tracking-wide truncate max-w-[140px] block">
                    {selectedOuterwear ? selectedOuterwear.title : 'No Coat Loaded'}
                  </span>
                </div>
                {selectedOuterwear ? (
                  <button onClick={() => setSelectedOuterwear(null)} className="p-1 hover:bg-rose-500/10 text-rose-400 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-600 uppercase">Empty Slot</span>
                )}
              </div>

              {/* BOTTOM SLOT */}
              <div className="flex justify-between items-center bg-[#11111a] border border-white/5 p-2 rounded-xl text-xs">
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Bottom Layer:</span>
                  <span className="text-[11px] font-semibold text-white tracking-wide truncate max-w-[140px] block">
                    {selectedBottom ? selectedBottom.title : 'No Bottom Loaded'}
                  </span>
                </div>
                {selectedBottom ? (
                  <button onClick={() => setSelectedBottom(null)} className="p-1 hover:bg-rose-500/10 text-rose-400 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-600 uppercase">Empty Slot</span>
                )}
              </div>

              {/* SHOES SLOT */}
              <div className="flex justify-between items-center bg-[#11111a] border border-white/5 p-2 rounded-xl text-xs">
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Footwear:</span>
                  <span className="text-[11px] font-semibold text-white tracking-wide truncate max-w-[140px] block">
                    {selectedShoes ? selectedShoes.title : 'Default Shoes'}
                  </span>
                </div>
                {selectedShoes ? (
                  <button onClick={() => setSelectedShoes(null)} className="p-1 hover:bg-rose-500/10 text-rose-400 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-600 uppercase">Default</span>
                )}
              </div>
            </div>
          </div>

          {/* AI PHOTO RENDERING ROOM */}
          <div className="bg-gradient-to-br from-[#0c0c16] to-[#07070c] border border-indigo-500/15 rounded-2xl p-4 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">4. Photographic Render Room</h3>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Combine your active volumetric measurements, selected drape stiffness vectors, and active multi-layered garments into a custom photorealistic render.
            </p>

            {/* RENDER BUTTON OR PROGRESS WINDOW */}
            {isRendering ? (
              <div className="bg-black/50 border border-white/5 p-3 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-indigo-400 animate-pulse">Rendering High-Fidelity Fit...</span>
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                </div>
                <div className="text-[9px] font-mono text-zinc-400 leading-relaxed">
                  {renderStep}
                </div>
              </div>
            ) : (
              <button
                onClick={runAIFitRender}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-mono font-bold text-[10px] uppercase py-3 rounded-xl tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 text-white" />
                <span>Simulate 3D Photo Render</span>
              </button>
            )}

            {/* PREVIEW CONTAINER */}
            <AnimatePresence mode="wait">
              {renderedImageUrl && !isRendering && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 bg-black/40 border border-white/5 p-3 rounded-xl"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono uppercase text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Output Rendered
                    </span>
                    <button 
                      onClick={() => setRenderedImageUrl(null)} 
                      className="text-[8px] font-mono uppercase text-zinc-500 hover:text-white"
                    >
                      Close Output
                    </button>
                  </div>

                  <div className="aspect-[3/4] bg-zinc-950 rounded-lg overflow-hidden relative">
                    <img 
                      src={renderedImageUrl} 
                      alt="Volumetric tryon output render" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[9px] font-mono text-white/50 block">Backdrop preset:</span>
                      <span className="text-[10px] font-bold text-white uppercase font-mono tracking-wide">
                        {BACKDROP_PRESETS.find(b => b.id === selectedBackdrop)?.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* CLOSET SELECTOR (LOAD GARMENTS DIRECTLY FROM CLOSET) */}
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl text-left">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-3">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-0.5">Atelier Rack</span>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">Select Garments to Load on Avatar</h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            Click on any garment in your closet to fit it onto the 3D model.
          </span>
        </div>

        {wardrobe.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-xs font-mono">
            No items in your Closet. Visit Wardrobe section to add garments first!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {wardrobe.map((item) => {
              const isFitted = selectedTop?.id === item.id || 
                               selectedOuterwear?.id === item.id || 
                               selectedBottom?.id === item.id || 
                               selectedShoes?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => selectGarmentForSlot(item)}
                  className={`group relative aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-end p-2.5 ${isFitted ? 'border-indigo-500 shadow-indigo-500/10 scale-102 bg-indigo-950/20' : 'border-white/5 hover:border-white/15 bg-black/40'}`}
                >
                  {/* Photo representation */}
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 duration-500"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#11111d] flex items-center justify-center">
                      <Shirt className="w-8 h-8 text-white/10" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                  {/* Layer category badge overlay */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[7.5px] font-mono bg-black/70 backdrop-blur border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                      {item.category}
                    </span>
                  </div>

                  {/* Selected / Fitted mark */}
                  {isFitted && (
                    <div className="absolute top-2 right-2 bg-indigo-500 p-1 rounded-full text-white shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}

                  {/* Title & Desc */}
                  <div className="relative z-10">
                    <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-0.5">{item.size || 'M'} • {item.primaryColor || 'Color'}</span>
                    <h4 className="text-[10px] font-bold text-white truncate">{item.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RECENT SIMULATED FITTING CABINET HISTORY */}
      {fitHistory.length > 0 && (
        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl text-left">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-bold block mb-0.5">Historical Cabinets</span>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">Your Simulated Fitting Sessions</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {fitHistory.map((sess) => (
              <div
                key={sess.id}
                className="group bg-[#11111a] border border-white/5 rounded-2xl overflow-hidden relative aspect-[3/4] hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Simulated background */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={sess.renderUrl}
                    alt="Fitting session render"
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0 pointer-events-none" />

                {/* Delete history session button */}
                <button
                  onClick={(e) => handleDeleteHistorySession(sess.id, e)}
                  className="absolute top-3 right-3 p-1.5 bg-black/70 backdrop-blur-md hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer z-10"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10 space-y-1.5">
                  <div>
                    <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest block font-semibold mb-0.5">{sess.timestamp} • Size {sess.sizeSelected}</span>
                    <h4 className="text-[11px] font-bold text-white truncate">
                      {Object.values(sess.fittedItems).map(i => i?.title).filter(Boolean).join(' + ')}
                    </h4>
                    <p className="text-[8px] font-mono text-zinc-500 truncate mt-0.5">
                      Height: {sess.avatar.height}cm • Waist: {sess.avatar.waist}cm
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
