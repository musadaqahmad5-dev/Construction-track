import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Heart, MessageCircle, RefreshCw, 
  Search, SlidersHorizontal, Eye, Copy, Check, X, Bookmark,
  Cpu, Layers, Maximize2, Share2, Terminal, Info, ChevronRight, Play,
  Compass, User, Folder, Stars, ListFilter, Trash2, Archive, Plus
} from 'lucide-react';
import { WardrobeItem } from '../types';
import { db } from '../firebase';
import { collection, query, onSnapshot, limit, addDoc, serverTimestamp } from 'firebase/firestore';

// Premium AI Creations Platform subcomponents
import { AICreation, AICreationCreator, AICreationTab } from './ai-creations/types';
import { INITIAL_CREATIONS, MOCK_CREATORS } from './ai-creations/data';
import { CreationCard } from './ai-creations/CreationCard';
import { ImageExperienceModal } from './ai-creations/ImageExperienceModal';
import { PortfolioSection } from './ai-creations/PortfolioSection';
import { DiscoverySection } from './ai-creations/DiscoverySection';
import { PromptIntelligenceEngine } from '../features/image-generation/PromptIntelligenceEngine';
import { GenerationIntelligenceEngine } from '../features/image-generation/GenerationIntelligenceEngine';

interface AIEngineStudioProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
}

export const AIEngineStudio: React.FC<AIEngineStudioProps> = ({ 
  wardrobe, 
  onAddGarment 
}) => {
  // Navigation: GALLERY, DISCOVERY, PORTFOLIO, 3D_LAB
  const [activeTab, setActiveTab] = useState<AICreationTab>('DISCOVERY');

  const [dbLooks, setDbLooks] = useState<AICreation[]>([]);
  const [loadingLooks, setLoadingLooks] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Advanced Filter state variables
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [selectedResolution, setSelectedResolution] = useState<string>('All');
  const [activeFilter, setActiveFilter] = useState<string>('Trending'); // Newest, Trending, Most Liked, etc.

  // Core portfolio / social state variables
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('lookvision_liked_creations');
    return saved ? JSON.parse(saved) : {};
  });

  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('lookvision_following_creators');
    return saved ? JSON.parse(saved) : {};
  });

  const [customCollections, setCustomCollections] = useState<string[]>(() => {
    const saved = localStorage.getItem('lookvision_custom_collections_list');
    return saved ? JSON.parse(saved) : ['Favorites', 'Streetwear', 'Luxury', 'Formal', 'Minimal', 'Experimental', 'Editorial'];
  });

  const [savedCollections, setSavedCollections] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('lookvision_saved_collections_map');
    return saved ? JSON.parse(saved) : {
      'Favorites': ['look-c-3', 'look-c-5'],
      'Streetwear': ['look-c-1'],
      'Luxury': ['look-c-5'],
      'Minimal': ['look-c-2', 'look-c-6']
    };
  });

  // Selected Look modal
  const [selectedLook, setSelectedLook] = useState<AICreation | null>(null);

  // --- 3D INTERACTIVE WORKBENCH STATES (Preserving 3D model engine states exactly) ---
  const [avatarType, setAvatarType] = useState<'RUNWAY_F' | 'ATHLETIC_M' | 'CYBORG_X' | 'MANNEQUIN_D'>('RUNWAY_F');
  const [garmentMesh, setGarmentMesh] = useState<'ARCHITECTURAL_GOWN' | 'TECH_PARKA' | 'DECONSTRUCTED_BLAZER' | 'BIOMORPHIC_VEST'>('TECH_PARKA');
  const [renderEngine, setRenderEngine] = useState<'UNREAL_5' | 'CLO3D' | 'MARVELOUS' | 'OCTANE'>('UNREAL_5');
  const [drapePhysics, setDrapePhysics] = useState<'LOW' | 'MEDIUM' | 'KINETIC'>('MEDIUM');
  const [vibePreset, setVibePreset] = useState<'Cyberpunk' | 'Minimalist' | 'Avant-Garde' | 'Desert' | 'Future-Punk'>('Cyberpunk');
  const [customDetails, setCustomDetails] = useState('');

  // Generation status variables
  const [isRendering, setIsRendering] = useState(false);
  const [renderLogs, setRenderLogs] = useState<string[]>([]);
  const [generatedLookResult, setGeneratedLookResult] = useState<AICreation | null>(null);

  // Synchronize Firestore and map to the new premium object schema
  useEffect(() => {
    if (!db) {
      setLoadingLooks(false);
      return;
    }

    setLoadingLooks(true);
    const q = query(collection(db, 'generatedLooks'), limit(50));
    const unsub = onSnapshot(q, (snapshot) => {
      const looks: AICreation[] = [];
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const docId = docSnap.id;
        
        // Dynamic seed generator based on DocId hash
        const seedVal = data.seed || String(Math.floor(Math.sin(docId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) * 100000000) + 12000000000);
        
        // Style resolution mapped
        const resolution = data.resolution || (data.provider === 'CLO 3D CAD Cloth Solve' ? '2048x2048' : '1024x1024');
        const aspectRatio = data.aspectRatio || '1:1';
        
        looks.push({
          id: docId,
          title: data.vibe || data.theme || 'Sartorial AI Concept',
          prompt: data.prompt || '',
          negativePrompt: data.negativePrompt || 'blurry, distorted, low quality, bad stitching, text watermark',
          imageUrl: data.imageUrl || '',
          imageUrlBefore: data.imageUrlBefore || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800',
          model: data.provider || 'Imagen 4.0 Ultra',
          style: data.vibe || data.theme || 'Streetwear',
          resolution,
          aspectRatio,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
          seed: seedVal,
          likesCount: data.likesCount || Math.floor(Math.random() * 150) + 50,
          viewsCount: data.viewsCount || Math.floor(Math.random() * 600) + 120,
          savesCount: data.savesCount || Math.floor(Math.random() * 80) + 10,
          commentsCount: data.commentsCount || Math.floor(Math.random() * 20) + 2,
          creator: MOCK_CREATORS.currentUser,
          status: 'Published',
          tags: ['curated', 'generative', (data.vibe || 'couture').toLowerCase()],
          colorPalette: ['#0c0c16', '#21153b', '#fafafa'],
          variations: [
            data.imageUrl || 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800'
          ]
        });
      });
      
      // Sort newest first
      looks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDbLooks(looks);
      setLoadingLooks(false);
    }, (err) => {
      console.warn("Error fetching generatedLooks, using premium fallback dataset:", err);
      setLoadingLooks(false);
    });

    return () => unsub();
  }, []);

  // Save changes locally to retain persistent user engagement
  useEffect(() => {
    localStorage.setItem('lookvision_liked_creations', JSON.stringify(likedMap));
  }, [likedMap]);

  useEffect(() => {
    localStorage.setItem('lookvision_following_creators', JSON.stringify(followingMap));
  }, [followingMap]);

  useEffect(() => {
    localStorage.setItem('lookvision_custom_collections_list', JSON.stringify(customCollections));
  }, [customCollections]);

  useEffect(() => {
    localStorage.setItem('lookvision_saved_collections_map', JSON.stringify(savedCollections));
  }, [savedCollections]);

  // Merge pre-loaded high-fashion seed creations with user generated db looks
  const allCreations = useMemo(() => {
    const combined = [...dbLooks, ...INITIAL_CREATIONS];
    // Remove duplicate IDs
    const unique: Record<string, AICreation> = {};
    combined.forEach(item => {
      unique[item.id] = item;
    });
    return Object.values(unique);
  }, [dbLooks]);

  // Filter styles list
  const stylesList = useMemo(() => {
    return ['All', ...Array.from(new Set(allCreations.map(c => c.style).filter(Boolean)))];
  }, [allCreations]);

  // Filter models list
  const modelsList = useMemo(() => {
    return ['All', ...Array.from(new Set(allCreations.map(c => c.model).filter(Boolean)))];
  }, [allCreations]);

  // Resolutions List
  const resolutionsList = useMemo(() => {
    return ['All', ...Array.from(new Set(allCreations.map(c => c.resolution).filter(Boolean)))];
  }, [allCreations]);

  // Advanced search & filtering computations
  const filteredCreations = useMemo(() => {
    let result = [...allCreations];

    // Search query query parsing
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.prompt.toLowerCase().includes(q) ||
        item.creator.name.toLowerCase().includes(q) ||
        item.style.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.resolution.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Style dropdown filter
    if (selectedStyle !== 'All') {
      result = result.filter(item => item.style === selectedStyle);
    }

    // Model dropdown filter
    if (selectedModel !== 'All') {
      result = result.filter(item => item.model === selectedModel);
    }

    // Resolution dropdown filter
    if (selectedResolution !== 'All') {
      result = result.filter(item => item.resolution === selectedResolution);
    }

    // Sorting conditions
    if (activeFilter === 'Newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeFilter === 'Trending') {
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else if (activeFilter === 'Most Liked') {
      result.sort((a, b) => (b.likesCount + (likedMap[b.id] ? 1 : 0)) - (a.likesCount + (likedMap[a.id] ? 1 : 0)));
    } else if (activeFilter === 'Most Viewed') {
      result.sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (activeFilter === 'Most Saved') {
      result.sort((a, b) => b.savesCount - a.savesCount);
    }

    return result;
  }, [allCreations, searchQuery, selectedStyle, selectedModel, selectedResolution, activeFilter, likedMap]);

  // Social trigger handles
  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleFollow = (creatorId: string) => {
    setFollowingMap(prev => ({
      ...prev,
      [creatorId]: !prev[creatorId]
    }));
    const isNowFollowing = !followingMap[creatorId];
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: isNowFollowing ? '✓ Added artist to your favorites!' : '✓ Removed artist from favorites'
    }));
  };

  // Organize look into structured collection groups
  const handleSaveToCollection = (id: string, collectionName: string) => {
    setSavedCollections(prev => {
      const currentList = prev[collectionName] || [];
      const updated = currentList.includes(id) 
        ? currentList.filter(item => item !== id)
        : [...currentList, id];
      return {
        ...prev,
        [collectionName]: updated
      };
    });

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✓ Collection "${collectionName}" synchronized!`
    }));
  };

  const handleAddCustomCollectionName = (colName: string) => {
    if (!customCollections.includes(colName)) {
      setCustomCollections(prev => [...prev, colName]);
    }
  };

  // Remix preset preloading
  const handleRemixLook = (creation: AICreation) => {
    setActiveTab('3D_LAB');
    setCustomDetails(creation.prompt);
    setSelectedLook(null);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✦ Preloaded design prompt into 3D Parameter workbench!'
    }));
  };

  const handleGenerateVariations = (creation: AICreation) => {
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✦ Solved visual variation! Pre-rendered asset appended.'
    }));
  };

  // Portfolio navigation triggers
  const handleVisitCreatorProfile = (creatorId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveTab('PORTFOLIO');
    setSelectedLook(null);
  };

  // Creative actions
  const handleDeleteLook = (id: string) => {
    // Hide or filter out look
    setDbLooks(prev => prev.filter(look => look.id !== id));
    setSelectedLook(null);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ AI Concept permanently deleted'
    }));
  };

  const handleArchiveLook = (id: string) => {
    setDbLooks(prev => prev.map(look => look.id === id ? { ...look, status: 'Archived' } : look));
    setSelectedLook(null);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ AI Concept moved to offline archives'
    }));
  };

  const handleDuplicateLook = (creation: AICreation) => {
    const clone: AICreation = {
      ...creation,
      id: `clone-look-${Date.now()}`,
      title: `${creation.title} (Clone)`,
      createdAt: new Date().toISOString()
    };
    setDbLooks(prev => [clone, ...prev]);
    setSelectedLook(clone);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ AI Concept duplicated successfully'
    }));
  };

  // --- 3D SOLVER AND COMPILATION SIMULATOR (Fully Preserved Generation Pipeline) ---
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

    // Stream logs synchronously
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

    // Automatically perform all professional prompt engineering internally!
    const enhancedResult = PromptIntelligenceEngine.optimize(finalPrompt);
    const productionResult = GenerationIntelligenceEngine.process(enhancedResult, finalPrompt);
    const optimizedFinalPrompt = productionResult.prompt;
    const optimizedNegativePrompt = productionResult.negativePrompt;

    const newLook: AICreation = {
      id: `sim-look-${Date.now()}`,
      title,
      prompt: optimizedFinalPrompt,
      negativePrompt: optimizedNegativePrompt,
      imageUrl,
      imageUrlBefore: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800',
      model: engineNames[renderEngine],
      style: vibePreset,
      resolution: '1024x1024',
      aspectRatio: '1:1',
      createdAt: new Date().toISOString(),
      seed: String(Math.floor(Math.random() * 900000) + 100000),
      likesCount: 150,
      viewsCount: 520,
      savesCount: 12,
      commentsCount: 6,
      creator: MOCK_CREATORS.currentUser,
      status: 'Published',
      tags: ['interactive', vibePreset.toLowerCase()],
      colorPalette: ['#12121c', '#ececf2']
    };

    // Save to Firestore if available
    if (db) {
      try {
        await addDoc(collection(db, 'generatedLooks'), {
          vibe: vibePreset,
          theme: vibePreset,
          prompt: optimizedFinalPrompt,
          negativePrompt: optimizedNegativePrompt,
          imageUrl,
          provider: engineNames[renderEngine],
          season: 'All-Season',
          createdAt: serverTimestamp(),
          qualityScores: productionResult.qualityScores,
          criticFeedback: productionResult.criticFeedback
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

  return (
    <div className="space-y-8 select-none animate-fade-in text-white py-2">
      
      {/* ATELIER NAVIGATION BANNER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-white/5">
        <div className="text-left">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-violet-400 block font-bold">
            Interactive AI Atelier
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-3xl text-white mt-1">
            Atelier AI Creations
          </h2>
          <p className="text-xs text-white/40 font-serif italic mt-1">
            "Enter a luxury portfolio showcasing high-fashion generative meshes, verified digital garments, and interactive cloth solvers."
          </p>
        </div>

        {/* Tab switch mechanism */}
        <div className="flex bg-[#07070c] border border-white/5 p-1 rounded-xl shadow-inner shrink-0">
          {[
            { id: 'DISCOVERY', label: 'Discovery Feed', icon: Compass },
            { id: 'GALLERY', label: 'Continuous Showroom', icon: Layers },
            { id: 'PORTFOLIO', label: 'My Portfolio', icon: User },
            { id: '3D_LAB', label: '3D Solver Lab', icon: Cpu }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CORE EXPERIENCE RENDER SWITCH */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: DISCOVERY FEED */}
        {activeTab === 'DISCOVERY' && (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <DiscoverySection
              creations={allCreations}
              likedMap={likedMap}
              onSelectCreation={setSelectedLook}
              onLikeCreation={handleToggleLike}
              onSaveCreation={(id, e) => handleSaveToCollection(id, 'Favorites')}
              onVisitCreator={handleVisitCreatorProfile}
              onFollowCreator={handleToggleFollow}
              followingCreators={followingMap}
            />
          </motion.div>
        )}

        {/* TAB 2: CONTINUOUS SHOWROOM (REBUILT GALLERY VIEW) */}
        {activeTab === 'GALLERY' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 text-left"
          >
            {/* Search, Sorting & Filters bar */}
            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                
                {/* Text search */}
                <div className="relative w-full md:max-w-md">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by prompt, style, tag, creator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#11111a] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>

                {/* Sorting choices & Advanced filters toggle */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar shrink-0">
                  <div className="flex bg-[#11111a] border border-white/5 p-1 rounded-xl">
                    {['Trending', 'Newest', 'Most Liked', 'Most Viewed', 'Most Saved'].map(sortOpt => (
                      <button
                        key={sortOpt}
                        onClick={() => setActiveFilter(sortOpt)}
                        className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                          activeFilter === sortOpt ? 'bg-zinc-800 text-violet-300 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {sortOpt}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                      showAdvancedFilters ? 'bg-violet-600/10 border-violet-500 text-violet-300' : 'bg-[#11111a] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ListFilter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              {/* Advanced Parameter Selectors */}
              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.04] overflow-hidden"
                  >
                    {/* Style selector */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Style preset</label>
                      <select
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="w-full bg-[#11111a] border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer"
                      >
                        <option value="All">All styles (Streetwear, Luxury, Fantasy, etc.)</option>
                        {stylesList.filter(s => s !== 'All').map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Model selector */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">AI Generator Model</label>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-[#11111a] border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer"
                      >
                        <option value="All">All models (Imagen, Flux, Midjourney)</option>
                        {modelsList.filter(m => m !== 'All').map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Resolution selector */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Asset Resolution</label>
                      <select
                        value={selectedResolution}
                        onChange={(e) => setSelectedResolution(e.target.value)}
                        className="w-full bg-[#11111a] border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer"
                      >
                        <option value="All">All resolutions</option>
                        {resolutionsList.filter(r => r !== 'All').map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Continuous creations grid */}
            {loadingLooks ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
                <span className="text-zinc-500 text-xs font-mono">Synchronizing continuous showroom...</span>
              </div>
            ) : filteredCreations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-2xl bg-[#07070c]/50">
                <span className="text-zinc-400 text-xs font-sans">No matching AI Creations found.</span>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedStyle("All"); setSelectedModel("All"); setSelectedResolution("All"); }}
                  className="mt-3 text-[10px] text-violet-400 hover:text-white font-mono uppercase tracking-wider underline cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredCreations.map((look) => (
                  <CreationCard
                    key={look.id}
                    creation={look}
                    onSelect={setSelectedLook}
                    onLike={handleToggleLike}
                    isLiked={!!likedMap[look.id]}
                    onSave={(id, e) => handleSaveToCollection(id, 'Favorites')}
                    isSaved={savedCollections['Favorites']?.includes(look.id)}
                    onVisitCreator={handleVisitCreatorProfile}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: USER PORTFOLIO */}
        {activeTab === 'PORTFOLIO' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <PortfolioSection
              creator={MOCK_CREATORS.currentUser}
              creations={allCreations}
              likedMap={likedMap}
              savedCollections={savedCollections}
              onSelectCreation={setSelectedLook}
              onLikeCreation={handleToggleLike}
              onSaveCreation={(id, e) => handleSaveToCollection(id, 'Favorites')}
              onVisitCreator={handleVisitCreatorProfile}
            />
          </motion.div>
        )}

        {/* TAB 4: 3D SOLVER DESIGN LAB (Preserved Interactive Generator) */}
        {activeTab === '3D_LAB' && (
          <motion.div
            key="3d_lab"
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
                  5. Style Direction
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
                  6. Fine Detail Engineering details
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
                          onClick={() => {
                            if (onAddGarment) {
                              onAddGarment(
                                generatedLookResult.title,
                                generatedLookResult.prompt,
                                'Outerwear',
                                { imageUrl: generatedLookResult.imageUrl }
                              );
                            }
                          }}
                          className="flex items-center justify-center gap-1.5 bg-white text-black font-sans font-bold text-[10px] uppercase py-2 rounded-xl transition-all hover:bg-zinc-200 active:scale-95 cursor-pointer"
                        >
                          <Share2 className="w-3 h-3 text-black" />
                          <span>Export to 3D</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('GALLERY');
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
        )}

      </AnimatePresence>

      {/* FULLSCREEN DETAIL MODAL VIEW (IMAGE EXPERIENCE) */}
      <AnimatePresence>
        {selectedLook && (
          <ImageExperienceModal
            creation={selectedLook}
            onClose={() => setSelectedLook(null)}
            onLike={(id) => handleToggleLike(id)}
            isLiked={!!likedMap[selectedLook.id]}
            onSave={handleSaveToCollection}
            isSaved={savedCollections['Favorites']?.includes(selectedLook.id)}
            onRemix={handleRemixLook}
            onGenerateVariations={handleGenerateVariations}
            onFollowCreator={handleToggleFollow}
            isFollowingCreator={!!followingMap[selectedLook.creator.id]}
            onVisitCreator={handleVisitCreatorProfile}
            onDelete={handleDeleteLook}
            onArchive={handleArchiveLook}
            onDuplicate={handleDuplicateLook}
            onAddCustomCollection={handleAddCustomCollectionName}
            customCollections={customCollections}
          />
        )}
      </AnimatePresence>

    </div>
  );
};
