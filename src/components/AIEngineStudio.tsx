import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Heart, MessageCircle, RefreshCw, 
  Search, SlidersHorizontal, Eye, Copy, Check, X, Bookmark,
  Cpu, Layers, Maximize2, Share2, Terminal, Info, ChevronRight, Play
} from 'lucide-react';
import { WardrobeItem } from '../types';
import { db } from '../firebase';
import { collection, query, onSnapshot, limit, addDoc, serverTimestamp } from 'firebase/firestore';

interface AIEngineStudioProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
}

interface AILook {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  provider: string;
  vibe: string;
  season: string;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
}

const SEED_CREATIONS: AILook[] = [
  {
    id: 'seed-c-1',
    title: 'Cyberpunk Tech Shell',
    prompt: 'Neon cybernetic futuristic jacket, loose fitting, modular tactical pockets, glowing purple lining, Unreal Engine 5.4 Path Tracer render on Male Athletic Mannequin',
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=500&auto=format&fit=crop',
    provider: 'Unreal Engine 5.4 Render',
    vibe: 'Cyberpunk',
    season: 'Winter',
    createdAt: new Date().toISOString(),
    likesCount: 245,
    commentsCount: 18
  },
  {
    id: 'seed-c-2',
    title: 'Nordic Minimalist Coat',
    prompt: 'Minimalist double breasted wool trench overcoat, heavy charcoal, with flowing cream silk trouser, CLO 3D CAD drape solve on Female Runway Avatar',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=500&auto=format&fit=crop',
    provider: 'CLO 3D CAD Cloth Engine',
    vibe: 'Minimalist',
    season: 'Autumn',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likesCount: 182,
    commentsCount: 12
  },
  {
    id: 'seed-c-3',
    title: 'Desert Linen Wanderer',
    prompt: 'Ethereal organic beige linen draped shawl, wide cropped raw linen pants, earth tones, Marvelous Designer simulation on Gravitational Mannequin',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop',
    provider: 'Marvelous Designer Solver',
    vibe: 'Desert',
    season: 'Summer',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likesCount: 310,
    commentsCount: 25
  },
  {
    id: 'seed-c-4',
    title: 'Deconstructed Slate Blazer',
    prompt: 'Deconstructed asymmetric tailored charcoal jacket, loose threads, matte black buttoning, Octane Holographic Shader render on Xenon Cyberspace Body',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=500&auto=format&fit=crop',
    provider: 'Octane Holographic Render',
    vibe: 'Avant-Garde',
    season: 'All-Season',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    likesCount: 420,
    commentsCount: 37
  }
];

export const AIEngineStudio: React.FC<AIEngineStudioProps> = ({ 
  wardrobe, 
  onAddGarment 
}) => {
  // Main Tab: DESIGN_LAB (3D Avatar Creator) vs CREATIONS_FEED (Showroom)
  const [activeTab, setActiveTab] = useState<'DESIGN_LAB' | 'CREATIONS_FEED'>('DESIGN_LAB');

  const [dbLooks, setDbLooks] = useState<AILook[]>([]);
  const [loadingLooks, setLoadingLooks] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");

  // Local likes tracking
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  
  // Selected Look Modal State
  const [selectedLook, setSelectedLook] = useState<AILook | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // --- 3D DESIGN LAB INTERACTIVE STATES ---
  const [avatarType, setAvatarType] = useState<'RUNWAY_F' | 'ATHLETIC_M' | 'CYBORG_X' | 'MANNEQUIN_D'>('RUNWAY_F');
  const [garmentMesh, setGarmentMesh] = useState<'ARCHITECTURAL_GOWN' | 'TECH_PARKA' | 'DECONSTRUCTED_BLAZER' | 'BIOMORPHIC_VEST'>('TECH_PARKA');
  const [renderEngine, setRenderEngine] = useState<'UNREAL_5' | 'CLO3D' | 'MARVELOUS' | 'OCTANE'>('UNREAL_5');
  const [drapePhysics, setDrapePhysics] = useState<'LOW' | 'MEDIUM' | 'KINETIC'>('MEDIUM');
  const [vibePreset, setVibePreset] = useState<'Cyberpunk' | 'Minimalist' | 'Avant-Garde' | 'Desert' | 'Future-Punk'>('Cyberpunk');
  const [customDetails, setCustomDetails] = useState('');

  // Generation status
  const [isRendering, setIsRendering] = useState(false);
  const [renderLogs, setRenderLogs] = useState<string[]>([]);
  const [generatedLookResult, setGeneratedLookResult] = useState<AILook | null>(null);

  useEffect(() => {
    if (!db) {
      setLoadingLooks(false);
      return;
    }

    setLoadingLooks(true);
    const q = query(collection(db, 'generatedLooks'), limit(50));
    const unsub = onSnapshot(q, (snapshot) => {
      const looks: AILook[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        looks.push({
          id: docSnap.id,
          title: data.vibe || data.theme || 'Sartorial AI Concept',
          prompt: data.prompt || '',
          imageUrl: data.imageUrl || '',
          provider: data.provider || 'Imagen 4.0',
          vibe: data.vibe || 'Creative',
          season: data.season || 'All-Season',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
          likesCount: Math.floor(Math.random() * 200) + 50,
          commentsCount: Math.floor(Math.random() * 30) + 5
        });
      });
      // Sort newest first
      looks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDbLooks(looks);
      setLoadingLooks(false);
    }, (err) => {
      console.warn("Error fetching generatedLooks, using fallback seeds:", err);
      setLoadingLooks(false);
    });

    return () => unsub();
  }, []);

  const handleCopyPrompt = (look: AILook) => {
    navigator.clipboard.writeText(look.prompt);
    setCopiedPromptId(look.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ Prompt copied to clipboard!'
    }));
  };

  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRemixLook = async (look: AILook) => {
    if (!onAddGarment) {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '✕ Wardrobe integration is not active in this session.'
      }));
      return;
    }

    try {
      await onAddGarment(
        look.title,
        look.prompt,
        'Outerwear',
        { imageUrl: look.imageUrl }
      );
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `✓ "${look.title}" added to your 3D assets workspace!`
      }));
      setSelectedLook(null);
    } catch (err) {
      console.error(err);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '✕ Failed to import garment. Try again.'
      }));
    }
  };

  // --- 3D SOLVER AND COMPILATION SIMULATOR ---
  const handleExecute3DRender = async () => {
    if (isRendering) return;

    setIsRendering(true);
    setRenderLogs([]);
    setGeneratedLookResult(null);

    const avatarNames = {
      RUNWAY_F: 'Runway Avatar F-02 (Female)',
      ATHLETIC_M: 'Kinetic Mannequin M-05 (Male)',
      CYBORG_X: 'Xenon Cyberspace Body (Unisex)',
      MANNEQUIN_D: 'Gravitational Mannequin (Pure physics)'
    };

    const meshNames = {
      ARCHITECTURAL_GOWN: 'Asymmetric Liquid Gown Mesh',
      TECH_PARKA: 'Modular Tech-Shell Parka Mesh',
      DECONSTRUCTED_BLAZER: 'Deconstructed Spatial Blazer Mesh',
      BIOMORPHIC_VEST: 'Biomorphic Interlocking Vest Mesh'
    };

    const engineNames = {
      UNREAL_5: 'Unreal Engine 5.4 Path Tracer',
      CLO3D: 'CLO 3D CAD Cloth Solver',
      MARVELOUS: 'Marvelous Designer Cloth Simulator',
      OCTANE: 'Octane Holographic Spectral Renderer'
    };

    const physicsNames = {
      LOW: 'High Gravity, Dense Folds (Low Drag)',
      MEDIUM: 'Standard Friction-Aware Drape',
      KINETIC: 'Zero-Gravity Kinetic Air Flow Simulation'
    };

    const steps = [
      `[0.1s] Initializing 3D engine and loading mesh: ${meshNames[garmentMesh]}...`,
      `[0.6s] Resolving avatar geometry alignment to: ${avatarNames[avatarType]}...`,
      `[1.2s] Setting up fabric solve boundary conditions using preset vibe: ${vibePreset}...`,
      `[1.8s] Running non-linear cloth tension equations. Physics mode: ${physicsNames[drapePhysics]}...`,
      `[2.4s] Compiling vertex buffers and mapping texture coordinates...`,
      `[3.0s] Solving spatial friction and self-collision grids...`,
      `[3.6s] Dispatching path-trace rays to ${engineNames[renderEngine]} shader sub-system...`,
      `[4.2s] Finalizing color grading & HDR post-process. Creating snapshot...`
    ];

    // Stream logs
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 550));
      setRenderLogs(prev => [...prev, steps[i]]);
    }

    // Determine final image
    let imageUrl = '';
    let title = '';

    if (garmentMesh === 'ARCHITECTURAL_GOWN') {
      imageUrl = vibePreset === 'Minimalist' 
        ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500'
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500';
      title = `${vibePreset} Architectural Gown`;
    } else if (garmentMesh === 'TECH_PARKA') {
      imageUrl = 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=500';
      title = `Modular ${vibePreset} Parka`;
    } else if (garmentMesh === 'DECONSTRUCTED_BLAZER') {
      imageUrl = vibePreset === 'Minimalist'
        ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=500'
        : 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=500';
      title = `Deconstructed ${vibePreset} Blazer`;
    } else {
      imageUrl = vibePreset === 'Avant-Garde'
        ? 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=500'
        : 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=500';
      title = `Biomorphic ${vibePreset} Vest`;
    }

    const finalPrompt = `Highly advanced 3D render of a ${title}. Mesh geometry: ${meshNames[garmentMesh]} mapped meticulously on ${avatarNames[avatarType]}. Developed using ${engineNames[renderEngine]} under ${physicsNames[drapePhysics]} tension. ${customDetails ? `Custom parameters: ${customDetails}` : ''}`;

    const newLook: AILook = {
      id: `sim-look-${Date.now()}`,
      title,
      prompt: finalPrompt,
      imageUrl,
      provider: engineNames[renderEngine],
      vibe: vibePreset,
      season: 'All-Season',
      createdAt: new Date().toISOString(),
      likesCount: 150,
      commentsCount: 6
    };

    // Save to Firestore if available
    if (db) {
      try {
        await addDoc(collection(db, 'generatedLooks'), {
          vibe: vibePreset,
          theme: vibePreset,
          prompt: finalPrompt,
          imageUrl,
          provider: engineNames[renderEngine],
          season: 'All-Season',
          createdAt: serverTimestamp()
        });
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
          detail: '✓ Concept published to the Global Creations Feed!'
        }));
      } catch (err) {
        console.warn("Firestore save failed, keeping in local state:", err);
      }
    }

    setGeneratedLookResult(newLook);
    setIsRendering(false);
  };

  // Compute final lists for creations feed
  const displayLooks = dbLooks.length > 0 ? dbLooks : SEED_CREATIONS;
  const vibesList = ['All', ...Array.from(new Set(displayLooks.map(l => l.vibe).filter(Boolean)))];
  const seasonsList = ['All', ...Array.from(new Set(displayLooks.map(l => l.season).filter(Boolean)))];

  const filteredLooks = displayLooks.filter(look => {
    const matchesSearch = look.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          look.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVibe = selectedVibe === 'All' || look.vibe === selectedVibe;
    const matchesSeason = selectedSeason === 'All' || look.season === selectedSeason;
    return matchesSearch && matchesVibe && matchesSeason;
  });

  return (
    <div className="space-y-8 select-none animate-fade-in text-white py-2">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-white/5">
        <div className="text-left">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-violet-400 block font-bold">
            Interactive AI Atelier
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-3xl text-white mt-1">
            AI Creations Studio
          </h2>
          <p className="text-xs text-white/40 font-serif italic mt-1">
            "Construct high-concept garments on virtual bodies or browse continuous designs generated by fashion creators."
          </p>
        </div>

        {/* Tab switcher: Design Lab vs creations feed */}
        <div className="flex bg-[#07070c] border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('DESIGN_LAB')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'DESIGN_LAB'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>3D Design Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('CREATIONS_FEED')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'CREATIONS_FEED'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Creations Feed</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      <AnimatePresence mode="wait">
        {activeTab === 'DESIGN_LAB' ? (
          <motion.div
            key="design_lab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left"
          >
            
            {/* Left 7 Columns: Parameter Sandbox */}
            <div className="lg:col-span-7 bg-[#07070c] border border-white/5 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Cpu className="w-48 h-48 text-violet-500" />
              </div>

              <div>
                <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-ping" />
                  3D Parameter Workbench
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Configure virtual bodies, mesh bases, and draper solvers.</p>
              </div>

              {/* 1. SELECT AI BODY / AVATAR */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  1. Avatar / Virtual Body Frame
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'RUNWAY_F', label: 'Runway F-02', desc: 'Runway model (Female)' },
                    { id: 'ATHLETIC_M', label: 'Mannequin M-05', desc: 'Athletic model (Male)' },
                    { id: 'CYBORG_X', label: 'Xenon Cyber', desc: 'Mechanical (Unisex)' },
                    { id: 'MANNEQUIN_D', label: 'Pure Physics', desc: 'T-Pose drape testing' }
                  ].map(av => (
                    <button
                      key={av.id}
                      onClick={() => setAvatarType(av.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        avatarType === av.id
                          ? 'border-violet-500/50 bg-violet-600/5 text-white shadow-md'
                          : 'border-white/5 bg-[#11111a]/40 text-zinc-400 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold font-sans">{av.label}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{av.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. BASE MESH GEOMETRY */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  2. Garment Base Mesh & Topology
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ARCHITECTURAL_GOWN', label: 'Liquid Gown', desc: 'Flowing structural seams' },
                    { id: 'TECH_PARKA', label: 'Tech Shell Parka', desc: 'Ripstop pocket systems' },
                    { id: 'DECONSTRUCTED_BLAZER', label: 'Deconstructed Suit', desc: 'Asymmetric offset collars' },
                    { id: 'BIOMORPHIC_VEST', label: 'Biomorphic Vest', desc: 'Organic curved plating' }
                  ].map(mesh => (
                    <button
                      key={mesh.id}
                      onClick={() => setGarmentMesh(mesh.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        garmentMesh === mesh.id
                          ? 'border-violet-500/50 bg-violet-600/5 text-white shadow-md'
                          : 'border-white/5 bg-[#11111a]/40 text-zinc-400 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold font-sans">{mesh.label}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{mesh.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. SHADER ENGINE & SOLVER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                    3. CGI Solver Shader
                  </label>
                  <select
                    value={renderEngine}
                    onChange={(e) => setRenderEngine(e.target.value as any)}
                    className="w-full bg-[#11111a] border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer"
                  >
                    <option value="UNREAL_5">Unreal Engine 5.4 Path Tracer</option>
                    <option value="CLO3D">CLO 3D CAD Cloth Solve</option>
                    <option value="MARVELOUS">Marvelous Designer Sim</option>
                    <option value="OCTANE">Octane Spectral Dispersion</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                    4. Drape Gravity Tension
                  </label>
                  <select
                    value={drapePhysics}
                    onChange={(e) => setDrapePhysics(e.target.value as any)}
                    className="w-full bg-[#11111a] border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer"
                  >
                    <option value="LOW">Low Drag (Earth Heavy Folds)</option>
                    <option value="MEDIUM">Standard Physics Drape</option>
                    <option value="KINETIC">Kinetic Kinetic Air solver</option>
                  </select>
                </div>
              </div>

              {/* 4. DESIGN VIBE PRESETS */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
                  5. Style Concept Direction
                </label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {['Cyberpunk', 'Minimalist', 'Avant-Garde', 'Desert', 'Future-Punk'].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVibePreset(v as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all shrink-0 cursor-pointer ${
                        vibePreset === v
                          ? 'bg-violet-600/15 border-violet-500 text-violet-300'
                          : 'bg-[#11111a] border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* CUSTOM DETAILS */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
                  6. Fine Detail Engineering Details
                </label>
                <textarea
                  placeholder="e.g., iridescent liquid nylon fibers, asymmetrical laser-cut vents, chrome rivets..."
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  className="w-full bg-[#11111a] border border-white/5 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 resize-none h-20"
                />
              </div>

              {/* BUILD BUTTON */}
              <button
                onClick={handleExecute3DRender}
                disabled={isRendering}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-zinc-800 disabled:to-zinc-800 text-white font-mono uppercase tracking-wider py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/15 active:scale-[0.99] transition-all cursor-pointer border border-white/10"
              >
                {isRendering ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Executing 3D Mesh Solver...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-violet-300 fill-violet-300" />
                    <span>Run Interactive 3D Render</span>
                  </>
                )}
              </button>

            </div>

            {/* Right 5 Columns: Dynamic Rendering Output Sandbox */}
            <div className="lg:col-span-5 bg-[#07070c] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between min-h-[500px]">
              
              {/* TOP HEADER */}
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-violet-400" />
                  CGI Compile Screen
                </span>
                <span className="text-[9px] font-mono bg-zinc-900 border border-white/5 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Port 3000 Node
                </span>
              </div>

              {/* DYNAMIC MIDDLE CANVAS */}
              <div className="flex-1 flex flex-col justify-center items-center relative rounded-2xl bg-[#030307] border border-white/5 p-4 overflow-hidden min-h-[300px]">
                
                {/* 1. Normal state: Ready to design */}
                {!isRendering && !generatedLookResult && (
                  <div className="text-center space-y-4 max-w-xs">
                    <div className="w-12 h-12 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mx-auto shadow-md">
                      <Cpu className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">3D Solvers Standby</h4>
                      <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                        Tweak the mesh frame parameters and tap 'Run Interactive 3D Render' to solve, texture, and path-trace the design.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. Compiling/Rendering State logs */}
                {isRendering && (
                  <div className="w-full h-full flex flex-col justify-between space-y-4 select-text">
                    <div className="space-y-2 flex-1 font-mono text-[9px] text-zinc-400 text-left overflow-y-auto no-scrollbar max-h-[220px]">
                      {renderLogs.map((log, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="leading-relaxed border-l border-violet-500/20 pl-2 text-violet-300/80"
                        >
                          {log}
                        </motion.div>
                      ))}
                      <div className="flex items-center gap-2 text-violet-400 animate-pulse mt-2">
                        <span>●</span>
                        <span>Solving spatial vertices...</span>
                      </div>
                    </div>
                    
                    <div className="w-full space-y-1.5 pt-3 border-t border-white/5">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span>Render Status:</span>
                        <span>{Math.round((renderLogs.length / 8) * 100)}%</span>
                      </div>
                      <div className="w-full bg-[#11111a] h-1.5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          className="bg-gradient-to-r from-violet-500 to-indigo-600 h-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${(renderLogs.length / 8) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Generated Result Render */}
                {!isRendering && generatedLookResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-10 flex flex-col justify-between text-left"
                  >
                    {/* Rendered Background */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={generatedLookResult.imageUrl}
                        alt="Render Output"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                    </div>

                    {/* Meta Badge Overlays */}
                    <div className="absolute top-4 left-4 z-10 flex gap-1.5">
                      <span className="text-[8px] font-sans font-bold bg-black/80 backdrop-blur-md text-violet-300 px-2.5 py-0.5 rounded-full border border-violet-500/20 shadow-lg">
                        {renderEngine}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={() => setSelectedLook(generatedLookResult)}
                        className="p-1.5 bg-black/80 hover:bg-violet-600/30 text-white rounded-full transition-all border border-white/10"
                        title="Expand view"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Metadata Info panel */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2.5 z-10">
                      <div>
                        <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest block font-semibold">
                          COMPILATION COMPLETE • {vibePreset}
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5 truncate">{generatedLookResult.title}</h4>
                        <p className="text-[10px] font-sans text-zinc-400 line-clamp-2 mt-1 leading-relaxed font-light">
                          {generatedLookResult.prompt}
                        </p>
                      </div>

                      {/* Import and Share Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleRemixLook(generatedLookResult)}
                          className="flex items-center justify-center gap-1.5 bg-white text-black font-sans font-bold text-[10px] uppercase py-2 rounded-xl transition-all hover:bg-zinc-200 active:scale-95 cursor-pointer"
                        >
                          <Share2 className="w-3 h-3 text-black" />
                          <span>Export to 3D</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('CREATIONS_FEED');
                            window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                              detail: '✦ Navigated to continuous showroom!'
                            }));
                          }}
                          className="flex items-center justify-center gap-1.5 bg-[#11111a] border border-white/5 text-white font-sans font-bold text-[10px] uppercase py-2 rounded-xl transition-all hover:bg-white/5 active:scale-95 cursor-pointer"
                        >
                          <Layers className="w-3 h-3 text-violet-400" />
                          <span>View in Feed</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* COMPILER FOOTER / INSIGHTS */}
              <div className="bg-[#11111a]/40 border border-white/5 rounded-2xl p-4 flex gap-3 items-start select-text text-left">
                <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider font-semibold">
                    Creative AI Body Specs
                  </h5>
                  <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                    Unlike everyday styling, this workstation constructs mesh shapes dynamically on synthetic skeletons for professional look modeling, virtual reality assets, and 3D design drapes.
                  </p>
                </div>
              </div>

            </div>

          </motion.div>
        ) : (
          <motion.div
            key="creations"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 text-left animate-fade-in"
          >
            {/* SEARCH & FILTERS CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#07070c] border border-white/5 rounded-2xl p-4 shadow-xl">
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search prompts or themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#11111a] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>

              {/* Vibe Filter */}
              <div className="md:col-span-4 flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider shrink-0">Vibe:</span>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {vibesList.map(vibe => (
                    <button
                      key={vibe}
                      onClick={() => setSelectedVibe(vibe)}
                      className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all shrink-0 cursor-pointer ${
                        selectedVibe === vibe
                          ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                          : 'bg-[#11111a] text-zinc-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season Filter */}
              <div className="md:col-span-4 flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider shrink-0">Season:</span>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {seasonsList.map(season => (
                    <button
                      key={season}
                      onClick={() => setSelectedSeason(season)}
                      className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all shrink-0 cursor-pointer ${
                        selectedSeason === season
                          ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                          : 'bg-[#11111a] text-zinc-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CREATIONS GRID */}
            {loadingLooks ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
                <span className="text-zinc-500 text-xs font-mono">Synchronizing Sarto-Intelligence Feed...</span>
              </div>
            ) : filteredLooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-2xl bg-[#07070c]/50">
                <span className="text-zinc-400 text-xs font-sans">No matching AI Creations found.</span>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedVibe("All"); setSelectedSeason("All"); }}
                  className="mt-3 text-[10px] text-violet-400 hover:text-white font-mono uppercase tracking-wider underline cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredLooks.map((look) => (
                  <motion.div
                    key={look.id}
                    layoutId={`look-card-${look.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedLook(look)}
                    className="group bg-[#080810]/60 border border-white/5 rounded-2xl overflow-hidden relative aspect-[3/4.2] hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-zinc-950 z-0">
                      <img
                        src={look.imageUrl}
                        alt={look.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-0" />

                    {/* Verfied AI Stamp Overlay */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[8px] font-sans font-bold bg-black/70 backdrop-blur-md text-violet-300 px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5 text-violet-400" /> {look.provider.split(' ')[0] || 'AI'}
                      </span>
                    </div>

                    {/* Heart Option Overlay */}
                    <button
                      onClick={(e) => handleToggleLike(look.id, e)}
                      className="absolute top-3 right-3 p-1.5 bg-black/70 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer z-10 active:scale-90"
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedMap[look.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Bottom Info Block */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 space-y-2 z-10 text-left">
                      <div>
                        <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest block font-semibold mb-0.5">{look.vibe} • {look.season}</span>
                        <h4 className="text-[12px] font-bold text-white truncate">{look.title}</h4>
                        <p className="text-[9px] font-sans text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed font-light">{look.prompt}</p>
                      </div>

                      {/* Footer Row */}
                      <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 pt-1.5 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Heart className={`w-3 h-3 ${likedMap[look.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{likedMap[look.id] ? (look.likesCount || 100) + 1 : (look.likesCount || 100)}</span>
                          </span>
                          <span className="flex items-center gap-1 text-zinc-500">
                            <MessageCircle className="w-3 h-3" />
                            <span>{look.commentsCount || 12}</span>
                          </span>
                        </div>

                        <span className="text-[8px] text-zinc-500">View Detail</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedLook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#07070c] border border-white/5 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-2"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedLook(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Column: Image Canvas */}
              <div className="aspect-[3/4] bg-zinc-950 relative">
                <img
                  src={selectedLook.imageUrl}
                  alt={selectedLook.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 z-10 flex gap-2">
                  <span className="text-[9px] font-mono uppercase bg-violet-600/35 text-violet-200 px-2.5 py-1 rounded-full border border-violet-500/30 font-bold backdrop-blur-sm">
                    {selectedLook.vibe}
                  </span>
                  <span className="text-[9px] font-mono uppercase bg-black/60 text-zinc-300 px-2.5 py-1 rounded-full border border-white/10 font-bold backdrop-blur-sm">
                    {selectedLook.season}
                  </span>
                </div>
              </div>

              {/* Right Column: Spec Info & Actions */}
              <div className="p-6 flex flex-col justify-between h-full bg-[#090910]">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold">
                      Design Detail
                    </span>
                    <h3 className="text-xl font-bold font-sans text-white tracking-wide leading-tight">
                      {selectedLook.title}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Prompt Specification:</span>
                    <div className="bg-[#11111a] border border-white/5 rounded-xl p-3.5 relative group">
                      <p className="text-[11px] text-zinc-300 font-sans leading-relaxed select-text">
                        {selectedLook.prompt}
                      </p>
                      <button
                        onClick={() => handleCopyPrompt(selectedLook)}
                        className="absolute right-2.5 bottom-2.5 p-1.5 bg-black/50 hover:bg-violet-600/25 border border-white/5 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                        title="Copy prompt"
                      >
                        {copiedPromptId === selectedLook.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-400 border-t border-b border-white/5 py-3">
                    <div>
                      <span className="text-[9px] text-zinc-600 uppercase block">AI Generator:</span>
                      <span className="text-white text-[11px] font-bold tracking-wide">{selectedLook.provider}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-600 uppercase block">Created On:</span>
                      <span className="text-white text-[11px]">{new Date(selectedLook.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6">
                  {onAddGarment ? (
                    <button
                      onClick={() => handleRemixLook(selectedLook)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-sans font-bold text-xs uppercase py-3 rounded-xl tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Export to 3D Workspace</span>
                    </button>
                  ) : (
                    <div className="text-center text-[10px] font-mono text-zinc-500">
                      Connect closet account to download styles
                    </div>
                  )}

                  <button
                    onClick={() => handleToggleLike(selectedLook.id)}
                    className="w-full bg-[#11111a] hover:bg-[#161622] border border-white/5 text-zinc-300 hover:text-white font-sans font-semibold text-xs py-3 rounded-xl tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <Heart className={`w-4 h-4 ${likedMap[selectedLook.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>
                      {likedMap[selectedLook.id] ? 'Liked Outfit' : 'Like Concept'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
