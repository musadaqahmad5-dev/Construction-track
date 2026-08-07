import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Heart, MessageCircle, RefreshCw, 
  Search, SlidersHorizontal, Eye, Copy, Check, X, Bookmark,
  Cpu, Layers, Maximize2, Share2, Terminal, Info, ChevronRight, Play, ArrowRight,
  Compass, User, Folder, Stars, ListFilter, Trash2, Archive, Plus,
  BookOpen, Award, Crown, Scissors, Box, MapPin, Activity, CheckSquare,
  FileText, Sliders, Shield, ShieldCheck, Users, UserCheck, Loader2, Upload, Wand2, BarChart3
} from 'lucide-react';
import { WardrobeItem } from '../types';
import { db, auth } from '../firebase';
import { collection, query, onSnapshot, limit, addDoc, serverTimestamp } from 'firebase/firestore';

// Premium AI Creations Platform subcomponents
import { AICreation, AICreationCreator, AICreationTab } from './ai-creations/types';
import { INITIAL_CREATIONS, MOCK_CREATORS } from './ai-creations/data';
import { CreationCard } from './ai-creations/CreationCard';
import { ImageExperienceModal } from './ai-creations/ImageExperienceModal';
import { PortfolioSection } from './ai-creations/PortfolioSection';
import { DiscoverySection } from './ai-creations/DiscoverySection';
import { AICreationsUniverseStudio } from './ai-creations/AICreationsUniverseStudio';
import { Solver3DWorkbench } from './solver3d/Solver3DWorkbench';
import { AdminVirtualThemePanel } from './AdminVirtualThemePanel';
import { PromptIntelligenceEngine } from '../features/image-generation/PromptIntelligenceEngine';
import { GenerationIntelligenceEngine } from '../features/image-generation/GenerationIntelligenceEngine';
import { ImageGenerationRegistry } from '../features/image-generation/imageGenerationProvider';
import { AIStyleHubV17Architecture } from '../features/global/AIStyleHubV17Architecture';
import { AIStudioWorkspace } from '../features/creations';
import { ariaService } from '../services/ariaService';
import { ARIAInvestorDashboard } from './dashboard/ARIAInvestorDashboard';
import { ARIAUserProfileDashboard } from './dashboard/ARIAUserProfileDashboard';
import { ARIAPreviewHealth } from './dashboard/ARIAPreviewHealth';

interface StudentGroup {
  id: string;
  name: string;
  ageRange: string;
  focus: string;
  styleVibe: string;
  needs: string[];
  vibeColor: string;
  vibeBadge: string;
}

interface WorkerAgent {
  id: string;
  name: string;
  role: string;
  needs: string[];
  isChosen: boolean;
  workingStatus: 'idle' | 'operational' | 'training';
  efficiency: number;
  cageId: string;
  toolsNeeded: string[];
}

interface AIEngineStudioProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onNavigateToTab?: (tab: string) => void;
}

export const AIEngineStudio: React.FC<AIEngineStudioProps> = ({ 
  wardrobe, 
  onAddGarment,
  onNavigateToTab 
}) => {
  // Navigation: UNIVERSE_STUDIO, DISCOVERY, GALLERY, PORTFOLIO, 3D_LAB
  const [activeTab, setActiveTab] = useState<AICreationTab>('UNIVERSE_STUDIO');

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

  // --- CREATE WITH AI STATES ---
  const [promptInput, setPromptInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [aiGeneratedResult, setAiGeneratedResult] = useState<{
    imageUrl: string;
    vibe: string;
    prompt: string;
    description: string;
    category: 'Casual' | 'Formal' | 'Outerwear';
  } | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aiGenLiked, setAiGenLiked] = useState(false);
  const [aiGenBookmarked, setAiGenBookmarked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [selectedDemographic, setSelectedDemographic] = useState<string>(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('look_vision_selected_demographic') || 'youth' : 'youth';
  });
  const [selectedInstructor, setSelectedInstructor] = useState<string>(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('look_vision_selected_instructor') || 'pattern_maker' : 'pattern_maker';
  });
  const [curriculumTopic, setCurriculumTopic] = useState<string>(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('look_vision_curriculum_topic') || 'cyber_mesh' : 'cyber_mesh';
  });
  const [instructionIntensity, setInstructionIntensity] = useState<number>(() => {
    return typeof localStorage !== 'undefined' ? Number(localStorage.getItem('look_vision_instruction_intensity') || '75') : 75;
  });
  const [practicalStudioHours, setPracticalStudioHours] = useState<number>(() => {
    return typeof localStorage !== 'undefined' ? Number(localStorage.getItem('look_vision_practical_hours') || '65') : 65;
  });
  const [semesterResults, setSemesterResults] = useState<any>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('look_vision_semester_results');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { return null; }
      }
    }
    return null;
  });

  const [semesterHistory, setSemesterHistory] = useState<Array<{
    id: string;
    demographic: string;
    topic: string;
    leadInstructor: string;
    score: number;
    grade: string;
    timestamp: string;
  }>>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('look_vision_semester_history');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { return []; }
      }
    }
    return [];
  });
  const [isSimulatingSemester, setIsSimulatingSemester] = useState<boolean>(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState<boolean>(false);
  const [simulatorSubTab, setSimulatorSubTab] = useState<'SIMULATE' | 'STUDENTS' | 'WORKERS' | 'DISPATCH'>('SIMULATE');

  const [workers, setWorkers] = useState<WorkerAgent[]>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('look_vision_workers_state');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
    }
    return [
      {
        id: 'pattern_maker',
        name: 'Artisan Pattern Maker',
        role: 'Pattern & Fit Solver',
        needs: ['CLO3D CAD integration', 'Kinetic drape physics weights', 'Fabric thickness multipliers'],
        isChosen: true,
        workingStatus: 'operational',
        efficiency: 94,
        cageId: 'Cage Alpha (Structure)',
        toolsNeeded: ['3D Mesh Renderer', 'Seam Friction Solver']
      },
      {
        id: 'trend_scout',
        name: 'Trend Ingestion Scout',
        role: 'Telemetry & Sourcing Analytics',
        needs: ['Pinterest RSS data endpoints', 'Instagram Style tag scrapers', 'Semantic trend aggregators'],
        isChosen: true,
        workingStatus: 'operational',
        efficiency: 89,
        cageId: 'Cage Beta (Intelligence)',
        toolsNeeded: ['Vogue Crawl Engine', 'Social Ingestion Pipeline']
      },
      {
        id: 'prompt_alchemist',
        name: 'Prompt Styling Alchemist',
        role: 'High Fidelity Image Generation',
        needs: ['Imagen 4.0 API access', 'Aspect-ratio config bounds', 'Zero negative-prompt restriction'],
        isChosen: false,
        workingStatus: 'idle',
        efficiency: 76,
        cageId: 'Cage Gamma (Visuals)',
        toolsNeeded: ['Imagen 3.0 Solver', 'Aesthetic Quality Estimator']
      },
      {
        id: 'decision_oracle',
        name: 'Sartorial Decision Oracle',
        role: 'Personalized Matching Logic',
        needs: ['Local SQLite database state', 'User preference history mapping', 'Climate feedback parameters'],
        isChosen: false,
        workingStatus: 'idle',
        efficiency: 81,
        cageId: 'Cage Delta (Judgment)',
        toolsNeeded: ['Preference Learner DB', 'Decoupled Event Bus']
      }
    ];
  });

  const [trainingWorkerId, setTrainingWorkerId] = useState<string | null>(null);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [stateRegion, setStateRegion] = useState<string>('Capital Province');
  const [activeSimulationLog, setActiveSimulationLog] = useState<string[]>([]);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<boolean>(false);

  // Sync workers to localStorage when updated
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('look_vision_workers_state', JSON.stringify(workers));
    }
  }, [workers]);

  const studentGroups: StudentGroup[] = useMemo(() => [
    {
      id: 'youth',
      name: 'Youth Division',
      ageRange: 'Ages 12-18',
      focus: 'Fast-fashion agility & energetic street expression',
      styleVibe: 'Vibrant Cyberpunk Streetwear & Athletic Fusion',
      needs: [
        'Real-time TikTok & gaming trend integrations',
        'Gamified virtual fittings with high-contrast avatars',
        'Ultra-affordable digital wardrobe capsules'
      ],
      vibeColor: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400',
      vibeBadge: 'text-pink-400 bg-pink-950/30 border-pink-500/20'
    },
    {
      id: 'young-adults',
      name: 'Young Adults',
      ageRange: 'Ages 19-25',
      focus: 'Expressive sustainability & digital style passports',
      styleVibe: 'Deconstructed Minimalist & Eco-Conscious Thrift',
      needs: [
        'Inter-operable digital identity metadata schemas',
        'Campus-to-internship multi-use capsule generators',
        'Direct connection to local certified thrift curators'
      ],
      vibeColor: 'from-violet-500/20 to-indigo-500/10 border-violet-500/30 text-violet-400',
      vibeBadge: 'text-violet-400 bg-violet-950/30 border-violet-500/20'
    },
    {
      id: 'professionals',
      name: 'Active Professionals',
      ageRange: 'Ages 26-45',
      focus: 'Sleek corporate minimalism & high-efficiency wardrobes',
      styleVibe: 'Quiet Luxury, Precision Tailoring & High-Performance Outerwear',
      needs: [
        'Smart weather-adapted layering suggestion pipelines',
        'Algorithmic color harmony matching metrics',
        'High-density corporate capsule layout engines'
      ],
      vibeColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      vibeBadge: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20'
    },
    {
      id: 'elders',
      name: 'Noble Elders',
      ageRange: 'Ages 46+',
      focus: 'Ergonomic comfort & timeless legacy heritage',
      styleVibe: 'Classic Editorial, Premium Organic Linens & Fine Merino',
      needs: [
        'High-contrast visual interfaces with voice command prompts',
        'Ergonomic clothing stretch & seam pressure solvers',
        'Durable heritage tailoring catalog archives'
      ],
      vibeColor: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      vibeBadge: 'text-amber-400 bg-amber-950/30 border-amber-500/20'
    }
  ], []);

  useEffect(() => {
    const handleSync = () => {
      if (typeof localStorage !== 'undefined') {
        const demo = localStorage.getItem('look_vision_selected_demographic') || 'youth';
        const inst = localStorage.getItem('look_vision_selected_instructor') || 'pattern_maker';
        const topic = localStorage.getItem('look_vision_curriculum_topic') || 'cyber_mesh';
        const intensity = Number(localStorage.getItem('look_vision_instruction_intensity') || '75');
        const practical = Number(localStorage.getItem('look_vision_practical_hours') || '65');
        const resultsStr = localStorage.getItem('look_vision_semester_results');
        const historyStr = localStorage.getItem('look_vision_semester_history');
        
        let results = null;
        if (resultsStr) {
          try { results = JSON.parse(resultsStr); } catch (e) {}
        }
        let history = [];
        if (historyStr) {
          try { history = JSON.parse(historyStr); } catch (e) {}
        }

        setSelectedDemographic(prev => prev !== demo ? demo : prev);
        setSelectedInstructor(prev => prev !== inst ? inst : prev);
        setCurriculumTopic(prev => prev !== topic ? topic : prev);
        setInstructionIntensity(prev => prev !== intensity ? intensity : prev);
        setPracticalStudioHours(prev => prev !== practical ? practical : prev);
        setSemesterResults(prev => JSON.stringify(prev) !== JSON.stringify(results) ? results : prev);
        setSemesterHistory(prev => JSON.stringify(prev) !== JSON.stringify(history) ? history : prev);
      }
    };
    window.addEventListener('lookvision_sync_instructor', handleSync);
    return () => {
      window.removeEventListener('lookvision_sync_instructor', handleSync);
    };
  }, []);



  const instructorDemographics = useMemo(() => [
    { id: 'youth', name: 'Youth Division', ageRange: '12-18', styleVibe: 'Vibrant Cyberpunk Streetwear & Athletic Fusion', focus: 'Fast-fashion agility & energetic street expression' },
    { id: 'young-adults', name: 'Young Adults', ageRange: '19-25', styleVibe: 'Deconstructed Minimalist & Eco-Conscious Thrift', focus: 'Expressive sustainability & digital style passports' },
    { id: 'professionals', name: 'Active Professionals', ageRange: '26-45', styleVibe: 'Quiet Luxury, Precision Tailoring & High-Performance Outerwear', focus: 'Sleek corporate minimalism & high-efficiency wardrobes' },
    { id: 'elders', name: 'Noble Elders', ageRange: '46+', styleVibe: 'Classic Editorial, Premium Organic Linens & Fine Merino', focus: 'Ergonomic comfort & timeless legacy heritage' }
  ], []);

  const instructorWorkers = useMemo(() => [
    { id: 'pattern_maker', name: 'Artisan Pattern Maker', role: 'Pattern & Fit Solver', cageId: 'Cage Alpha (Structure)', needs: 'CLO3D CAD integration, Kinetic drape physics weights' },
    { id: 'trend_scout', name: 'Trend Ingestion Scout', role: 'Telemetry & Sourcing Analytics', cageId: 'Cage Beta (Intelligence)', needs: 'Pinterest RSS data endpoints, Vogue crawl engine' },
    { id: 'prompt_alchemist', name: 'Prompt Styling Alchemist', role: 'High Fidelity Image Generation', cageId: 'Cage Gamma (Visuals)', needs: 'Imagen 4.0 API access, Aesthetic Quality Estimator' },
    { id: 'decision_oracle', name: 'Sartorial Decision Oracle', role: 'Personalized Matching Logic', cageId: 'Cage Delta (Judgment)', needs: 'Local SQLite database state, Preference Learner DB' }
  ], []);

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

  // --- CREATE WITH AI HANDLERS ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateAIStyle = async (overridePrompt?: string, chosenCategory?: 'Casual' | 'Formal' | 'Outerwear') => {
    const activePreset = vibePreset || 'Cyberpunk';
    const activeStyleDirection = (selectedStyle && selectedStyle !== 'All') ? selectedStyle : activePreset;
    const queryText = (overridePrompt || promptInput).trim();
    const finalQuery = queryText ? `${queryText} (${activeStyleDirection} style)` : `${activeStyleDirection} style high-fashion luxury look`;
    
    setIsGenerating(true);
    setErrorMessage(null);
    setHasSaved(false);
    setAiGenLiked(false);
    setAiGenBookmarked(false);

    const steps = [
      'Accessing Google Gemini Fashion AI...',
      'Solving fabric tension, stitching structures...',
      'Analyzing style balance and color pallet...',
      'Simulating photorealistic lighting drape...',
      'Mapping custom blueprint reference image...'
    ];

    let currentStep = 0;
    setGenerationStep(steps[0]);
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setGenerationStep(steps[currentStep]);
      }
    }, 1100);

    try {
      const strictStylePrompt = `${finalQuery}, ${activeStyleDirection} style aesthetic, luxurious high-fashion lookbook, high fidelity photorealistic, neutral studio backdrop, exquisite fabrics drape and stitches details, ${uploadedImage ? 'fitted on uploaded reference model' : 'mannequin model portrait'}, aesthetic high contrast studio lighting, studio background`;

      let token = '';
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      } else {
        token = 'guest-token';
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/image-generation/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          theme: chosenCategory || activeStyleDirection || 'Casual',
          vibe: strictStylePrompt,
          garments: [],
          gender: 'All-Gender',
          formality: 'High-Fidelity',
          season: 'All-Season',
          setting: 'Studio Backdrop',
          provider: 'Gemini-3.1-Flash-Image',
          hasUploadedUserImage: Boolean(uploadedImage)
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned status ${response.status}`);
      }

      const result = await response.json();

      clearInterval(stepInterval);

      if (result.success && result.imageUrl) {
        // Classify category intelligently
        const queryLower = finalQuery.toLowerCase();
        let finalCat: 'Casual' | 'Formal' | 'Outerwear' = chosenCategory || 'Casual';
        if (!chosenCategory) {
          if (queryLower.includes('blazer') || queryLower.includes('suit') || queryLower.includes('formal') || queryLower.includes('office') || queryLower.includes('trousers') || queryLower.includes('tuxedo')) {
            finalCat = 'Formal';
          } else if (queryLower.includes('jacket') || queryLower.includes('coat') || queryLower.includes('overcoat') || queryLower.includes('parka') || queryLower.includes('outerwear') || queryLower.includes('windbreaker')) {
            finalCat = 'Outerwear';
          } else {
            finalCat = 'Casual';
          }
        }

        setAiGeneratedResult({
          imageUrl: result.imageUrl,
          vibe: overridePrompt ? overridePrompt : (queryText ? queryText : 'Bespoke Atelier Silhouette'),
          prompt: finalQuery,
          description: `An exquisite generative fashion masterpiece. Custom stitched with high fidelity materials, featuring perfect drapes and balanced shadows. Optimized on custom physical mannequin dimensions.`,
          category: finalCat
        });

        // Record in AIStyleHub V17 Architecture Memory (Private Asset)
        AIStyleHubV17Architecture.recordAICreationGenerated({
          id: `gen-style-${Date.now()}`,
          title: overridePrompt ? overridePrompt : (queryText ? queryText : 'Bespoke Atelier Silhouette'),
          imageUrl: result.imageUrl,
          prompt: finalQuery,
          style: activeStyleDirection,
          category: finalCat
        });
        window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
        
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
          detail: '✨ Create with AI: Masterpiece successfully designed!' 
        }));
      } else {
        throw new Error(result.error || 'Atelier style synthesis timed out.');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || 'Unable to connect to Google Gemini. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAIToWardrobe = async () => {
    if (!aiGeneratedResult || hasSaved || !onAddGarment) return;
    try {
      await onAddGarment(
        `${aiGeneratedResult.vibe.charAt(0).toUpperCase() + aiGeneratedResult.vibe.slice(1)} Piece`,
        aiGeneratedResult.description,
        aiGeneratedResult.category,
        {
          imageUrl: aiGeneratedResult.imageUrl,
          primaryColor: 'Studio Gray',
          secondaryColor: 'Charcoal'
        }
      );

      setHasSaved(true);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: '💾 AI Creation added directly to your digital closet ledger!' 
      }));
    } catch (err) {
      console.error('Failed to save AI garment:', err);
    }
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
      `[0.1s] Initializing 3D GPU vertex pipeline & loading topology mesh: ${meshNames[garmentMesh]}...`,
      `[0.4s] Aligning avatar skeletal kinematics to: ${avatarNames[avatarType]}...`,
      `[0.8s] Compiling UV spatial surface coordinates & material shader: ${vibePreset}...`,
      `[1.3s] Solving non-linear cloth tension equations (Gravity mode: ${physicsNames[drapePhysics]})...`,
      `[1.9s] Calculating 120k quad polygon drape deformation matrix...`,
      `[2.5s] Dispatching path-trace rays to ${engineNames[renderEngine]} shader engine...`,
      `[3.2s] Calculating subsurface scattering & specular normal displacement...`,
      `[3.9s] Finalizing 3D CAD mesh snapshot render...`
    ];

    // Stream logs synchronously
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 450));
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

    const finalPrompt = `3D CAD mesh render of a ${title}. Topology: ${meshNames[garmentMesh]} mapped on ${avatarNames[avatarType]}. Solved with ${engineNames[renderEngine]} under ${physicsNames[drapePhysics]} tension. ${customDetails ? `Mesh Parameters: ${customDetails}` : ''}`;

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
      tags: ['3d-solver', garmentMesh.toLowerCase(), vibePreset.toLowerCase()],
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

    // Record in AIStyleHub V17 Architecture Memory (Private Asset)
    AIStyleHubV17Architecture.recordAICreationGenerated({
      id: newLook.id,
      title: newLook.title,
      imageUrl: newLook.imageUrl,
      prompt: newLook.prompt,
      style: vibePreset,
      category: garmentMesh,
      tags: newLook.tags
    });
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
  };

  const handleRunSemesterSimulation = () => {
    setIsSimulatingSemester(true);
    
    setTimeout(() => {
      // 1. Calculate Demographic Synergy
      let synergy = 10;
      let matchedDemo = "";
      if (selectedDemographic === 'youth' && curriculumTopic === 'cyber_mesh') {
        synergy = 25;
        matchedDemo = "Youth Division (optimal mesh alignment)";
      } else if (selectedDemographic === 'young-adults' && curriculumTopic === 'eco_thrift') {
        synergy = 25;
        matchedDemo = "Young Adults (optimal thrift alignment)";
      } else if (selectedDemographic === 'professionals' && curriculumTopic === 'corp_layer') {
        synergy = 25;
        matchedDemo = "Active Professionals (optimal corporate/performance alignment)";
      } else if (selectedDemographic === 'elders' && curriculumTopic === 'heritage_tailor') {
        synergy = 25;
        matchedDemo = "Noble Elders (optimal heritage tailoring alignment)";
      } else {
        synergy = 12;
        matchedDemo = "Standard alignment";
      }

      // 2. Calculate Lead Instructor Synergy
      let instBonus = 5;
      let matchedInstructorName = "";
      const currentLead = instructorWorkers.find(w => w.id === selectedInstructor) || instructorWorkers[0];
      
      if (curriculumTopic === 'cyber_mesh' && selectedInstructor === 'prompt_alchemist') {
        instBonus = 15;
        matchedInstructorName = "Prompt Styling Alchemist (excellent mesh & visual support)";
      } else if (curriculumTopic === 'eco_thrift' && selectedInstructor === 'trend_scout') {
        instBonus = 15;
        matchedInstructorName = "Trend Ingestion Scout (excellent eco & thrift trend sensing)";
      } else if (curriculumTopic === 'corp_layer' && selectedInstructor === 'decision_oracle') {
        instBonus = 15;
        matchedInstructorName = "Sartorial Decision Oracle (excellent personalized coordinate analytics)";
      } else if (curriculumTopic === 'heritage_tailor' && selectedInstructor === 'pattern_maker') {
        instBonus = 15;
        matchedInstructorName = "Artisan Pattern Maker (excellent tailoring & fit physics rendering)";
      } else {
        instBonus = 7;
        matchedInstructorName = `${currentLead.name} (standard support)`;
      }

      // 3. Balance Bonus
      const balanceDiff = Math.abs(instructionIntensity - practicalStudioHours);
      const balanceBonus = Math.max(0, Math.round((100 - balanceDiff) * 0.15)); // max 15

      // 4. Teamwork contribution
      const teamBonus = 10;

      // 5. Overall lead instructor base efficiency weight (max 35)
      const efficiencies: Record<string, number> = {
        pattern_maker: 94,
        trend_scout: 89,
        prompt_alchemist: 76,
        decision_oracle: 81
      };
      const activeEff = efficiencies[selectedInstructor] || 85;
      const leadEfficiencyWeight = Math.round((activeEff / 100) * 35);

      // Total overall score
      const totalScore = Math.min(100, 35 + synergy + instBonus + balanceBonus + teamBonus + (leadEfficiencyWeight - 30));

      // Calculate engagement rate & instructor efficiency index
      const engagementRate = Math.round(Math.min(100, (instructionIntensity * 0.4 + practicalStudioHours * 0.6) * (synergy / 25 + 0.5)));
      const finalInstructorEfficiency = Math.round(activeEff * (1 + (teamBonus / 100)));

      // Grade classification
      let grade = 'C';
      let reportText = "";
      if (totalScore >= 95) {
        grade = 'S';
        reportText = `Sartorial perfection accomplished! The combination of the ${matchedDemo} with the advanced leadership of ${matchedInstructorName} led to unprecedented student performance. Spacings and color pairings are highly optimized, with perfect instructional-practical balance (${instructionIntensity}% : ${practicalStudioHours}%). Truly a masterclass in modern digital style.`;
      } else if (totalScore >= 85) {
        grade = 'A';
        reportText = `Outstanding instructional semester! Your Lead Instructor ${currentLead.name} successfully deployed the curriculum. The synergy with the ${selectedDemographic} division is strong. Tip: Fine-tune the balance slider or deploy additional commissioned assistants to achieve S-Class level.`;
      } else if (totalScore >= 70) {
        grade = 'B';
        reportText = `Healthy performance. The student cohort showed solid growth. However, there is room for improvement: the synergy between the curriculum topic ("${curriculumTopic}") and either the demographic or Lead Instructor is slightly sub-optimal. Aligning these more closely will yield higher style metrics.`;
      } else if (totalScore >= 55) {
        grade = 'C';
        reportText = `Satisfactory pass. The students are clothing themselves with basic discipline, but the curriculum feels unbalanced. Consider shifting the Practical Studio Hours slider to better match Instruction Intensity, or choose a lead instructor whose credentials directly map to "${curriculumTopic}".`;
      } else {
        grade = 'F';
        reportText = `Sartorial Red Alert! The curriculum failed to engage the student demographic. The lead instructor was severely mismatched with the subject materials, and the instruction-to-practical ratio was too skewed. Re-align your divisions immediately!`;
      }

      const results = {
        grade,
        overallScore: totalScore,
        synergyScore: synergy * 4,
        instructorEfficiency: Math.min(100, finalInstructorEfficiency),
        engagementRate,
        reportText,
        timestamp: new Date().toLocaleTimeString()
      };

      setSemesterResults(results);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('look_vision_semester_results', JSON.stringify(results));
      }

      const historyItem = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        demographic: instructorDemographics.find(g => g.id === selectedDemographic)?.name || selectedDemographic,
        topic: curriculumTopic === 'cyber_mesh' ? 'Cyberpunk Mesh Reconstruction' :
               curriculumTopic === 'eco_thrift' ? 'Eco-friendly Thrift Deconstruction' :
               curriculumTopic === 'corp_layer' ? 'High-Performance Corporate Layering' :
               'Classic Editorial Legacy Tailoring',
        leadInstructor: currentLead.name,
        score: totalScore,
        grade,
        timestamp: new Date().toLocaleTimeString()
      };

      setSemesterHistory(prev => {
        const updated = [historyItem, ...prev.slice(0, 9)];
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('look_vision_semester_history', JSON.stringify(updated));
        }
        return updated;
      });

      setIsSimulatingSemester(false);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `✨ Semester complete: Graded at "${grade}" with score ${totalScore}%.`
      }));
      window.dispatchEvent(new Event('lookvision_sync_instructor'));
    }, 1000);
  };

  const handleResetSimulatorHistory = () => {
    setSemesterHistory([]);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('look_vision_semester_history');
    }
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ Simulator history registry successfully purged.'
    }));
  };

  // --- WORKER TRAINING, CAGES, AND DISPATCH CONTROLS (Migrated Production Features) ---
  const toggleWorkerSelection = (id: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === id) {
        const nextChosen = !w.isChosen;
        return {
          ...w,
          isChosen: nextChosen,
          workingStatus: nextChosen ? 'operational' : 'idle'
        };
      }
      return w;
    }));

    const targetWorker = workers.find(w => w.id === id);
    if (targetWorker) {
      addDispatchLog(`Governor status update: ${targetWorker.name} has been ${!targetWorker.isChosen ? 'commissioned and placed in ' + targetWorker.cageId : 'recalled back to barracks'}.`);
    }
  };

  const addDispatchLog = (message: string) => {
    setActiveSimulationLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 15)]);
  };

  const handleTrainWorker = (id: string) => {
    if (trainingWorkerId) return;
    setTrainingWorkerId(id);
    setTrainingProgress(0);
    
    const targetWorker = workers.find(w => w.id === id);
    if (targetWorker) {
      addDispatchLog(`[Training Mode] Initiating deep-learning instruction calibration for ${targetWorker.name}...`);
    }

    setWorkers(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, workingStatus: 'training' };
      }
      return w;
    }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setTrainingProgress(progress);
      if (targetWorker) {
        addDispatchLog(`[Training] ${targetWorker.name} calibration: ${progress}% compiled...`);
      }
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setWorkers(prev => prev.map(w => {
            if (w.id === id) {
              const newEfficiency = Math.min(100, w.efficiency + 5);
              addDispatchLog(`✨ [Training Complete] ${w.name} successfully certified! Efficiency upgraded from ${w.efficiency}% to ${newEfficiency}%.`);
              window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                detail: `🎯 AGENT CALIBRATED: ${w.name} efficiency upgraded to ${newEfficiency}%!`
              }));
              return {
                ...w,
                efficiency: newEfficiency,
                workingStatus: w.isChosen ? 'operational' : 'idle'
              };
            }
            return w;
          }));
          setTrainingWorkerId(null);
          setTrainingProgress(0);
        }, 300);
      }
    }, 400);
  };

  const handleDispatchWorkers = () => {
    const activeWorkers = workers.filter(w => w.isChosen);
    if (activeWorkers.length === 0) {
      addDispatchLog("❌ Dispatch aborted: No commissioned workers are assigned to cages!");
      return;
    }

    setIsDispatching(true);
    setDispatchSuccess(false);
    addDispatchLog(`Initiating state-wide fashion deployment in [${stateRegion}] for [${studentGroups.find(g => g.id === selectedDemographic)?.name || 'selected division'}]...`);

    setTimeout(() => {
      activeWorkers.forEach((worker, idx) => {
        setTimeout(() => {
          addDispatchLog(`⚡ ${worker.name} operating inside [${worker.cageId}]: Processing working needs [${worker.needs[0]}] with ${worker.efficiency}% efficiency.`);
        }, (idx + 1) * 400);
      });
    }, 400);

    setTimeout(() => {
      setIsDispatching(false);
      setDispatchSuccess(true);
      addDispatchLog(`✨ Dispatch complete! Governor of Fashion successfully deployed style wisdom to ${stateRegion}. Students' wardrobes are updated permanently!`);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `🚀 DISPATCH SUCCESSFUL: Instructors active in ${stateRegion}!`
      }));
    }, (activeWorkers.length + 1.5) * 400);
  };

  return (
    <div className="space-y-8 select-none animate-fade-in text-white py-2">
      
      {/* ATELIER NAVIGATION BANNER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pb-4 border-b border-white/5 w-full">
        <div className="text-left max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider shrink-0">
              ✨ AI Creations Hub
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
              Community & Generative Studio
            </span>
          </div>
          <h2 className="font-serif font-light tracking-[-0.02em] text-2xl sm:text-3xl text-white mt-1.5">
            AI Creations Studio
          </h2>
          <p className="text-xs text-zinc-400 font-serif italic mt-1">
            Synthesize bespoke high-fashion garments, photorealistic AI images, 4K motion videos, and explore community creations.
          </p>
        </div>

        {/* Tab switch mechanism - drops down cleanly below title line on small/medium screens */}
        <div className="flex flex-wrap sm:flex-nowrap bg-[#07070c] border border-white/5 p-1 rounded-2xl shadow-inner w-full xl:w-auto overflow-x-auto gap-1">
          {[
            { id: 'CREATION_STUDIO', label: '✨ AI Design Studio', icon: Wand2 },
            { id: 'UNIVERSE_STUDIO', label: '🎨 Studio & Generator', icon: Sparkles },
            { id: 'DISCOVERY', label: '🔥 Discovery Feed', icon: Compass },
            { id: 'GALLERY', label: '🖼️ Showroom', icon: Layers },
            { id: 'PORTFOLIO', label: '👤 My Portfolio', icon: User },
            { id: '3D_LAB', label: '⚡ 3D Garment Lab', icon: Cpu },
            { id: 'VIRTUAL_THEME', label: '👑 Virtual Theme Engine', icon: Crown },
            { id: 'INVESTOR_VIEW', label: '📊 Investor View', icon: BarChart3 },
            { id: 'USER_PROFILE', label: '👤 ARIA User Profile', icon: User },
            { id: 'PREVIEW_HEALTH', label: '🛡️ Preview Health', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 ring-1 ring-violet-400/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-violet-300 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ARIA RUNTIME & INTELLIGENCE TELEMETRY BANNER */}
      <div className="bg-[#080812] border border-violet-500/20 rounded-2xl p-4 shadow-xl text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-violet-300 font-bold uppercase tracking-wider">
              ARIA v3.2 Autonomous Intelligence Mesh Telemetry
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
            {ariaService.getRuntimeHealth().status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase block">Active Modules</span>
            <span className="text-xs font-mono font-bold text-white mt-0.5 block">
              {ariaService.getRuntimeHealth().activeModules.length} Connected
            </span>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase block">Execution Latency</span>
            <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block">
              {ariaService.getRuntimeStatus().orchestratorStatus.averageLatencyMs} ms
            </span>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase block">Executions Logged</span>
            <span className="text-xs font-mono font-bold text-violet-300 mt-0.5 block">
              {ariaService.getRuntimeHealth().totalRequestsHandled}
            </span>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase block">Reasoning Status</span>
            <span className="text-xs font-mono font-bold text-amber-300 mt-0.5 block uppercase">
              {ariaService.getRuntimeHealth().memoryStatus}
            </span>
          </div>
        </div>
      </div>

      {/* CORE EXPERIENCE RENDER SWITCH */}
      <AnimatePresence mode="wait">

        {/* TAB -1: CREATION STUDIO (NEW PRODUCTION ARIA DESIGN LAB) */}
        {activeTab === 'CREATION_STUDIO' && (
          <motion.div
            key="creation_studio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <AIStudioWorkspace
              onNavigateToTab={onNavigateToTab}
            />
          </motion.div>
        )}

        {/* TAB 0: UNIVERSE STUDIO */}
        {activeTab === 'UNIVERSE_STUDIO' && (
          <motion.div
            key="universe_studio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <AICreationsUniverseStudio 
              onCreationGenerated={(newCreation) => {
                setDbLooks(prev => [newCreation, ...prev]);
              }}
              onNavigateToTab={onNavigateToTab}
            />
          </motion.div>
        )}

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

        {/* TAB 4: 3D SOLVER DESIGN LAB (Standalone Professional CAD Workbench) */}
        {activeTab === '3D_LAB' && (
          <motion.div
            key="3d_lab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <Solver3DWorkbench onSaveToWardrobe={onAddGarment} />
          </motion.div>
        )}

        {/* TAB 5: VIRTUAL THEME ENGINE (Admin & User Theme Intelligence) */}
        {activeTab === 'VIRTUAL_THEME' && (
          <motion.div
            key="virtual_theme"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <AdminVirtualThemePanel />
          </motion.div>
        )}

        {/* TAB 6: INVESTOR PRESENTATION VIEW */}
        {activeTab === 'INVESTOR_VIEW' && (
          <motion.div
            key="investor_view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <ARIAInvestorDashboard />
          </motion.div>
        )}

        {/* TAB 7: ARIA USER PROFILE DASHBOARD */}
        {activeTab === 'USER_PROFILE' && (
          <motion.div
            key="user_profile_view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <ARIAUserProfileDashboard />
          </motion.div>
        )}

        {/* TAB 8: PREVIEW HEALTH PANEL */}
        {activeTab === ('PREVIEW_HEALTH' as any) && (
          <motion.div
            key="preview_health_view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-5xl mx-auto py-4"
          >
            <ARIAPreviewHealth />
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
