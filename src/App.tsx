import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { 
  Shirt, 
  Sparkles, 
  CalendarDays, 
  Palette, 
  Home, 
  LogOut, 
  RefreshCcw, 
  ChevronRight, 
  CheckCircle2, 
  Heart,
  HelpCircle,
  FolderMinus,
  Camera,
  Cpu,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, signInWithGoogle, logout, OperationType, handleFirestoreError } from './firebase';
import { WardrobeItem, ClothingCategory } from './types';
import { WardrobeService } from './features/wardrobe/wardrobeService';
import { FashionEngine } from './features/fashion/fashionEngine';

// Component Imports
import { FashionHome } from './components/FashionHome';
import { WardrobeGrid } from './components/WardrobeGrid';
import { TodaySuggestionCard } from './components/TodaySuggestionCard';
import { TomorrowPlanner } from './components/TomorrowPlanner';
import { StyleAssistantPanel } from './components/StyleAssistantPanel';
import { VisualAnalysisPanel } from './components/VisualAnalysisPanel';
import { AIStyleHub } from './components/AIStyleHub';
import { FashionCommandCenter } from './components/FashionCommandCenter';
import { PlatformControlCenter } from './components/PlatformControlCenter';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [constructions, setConstructions] = useState<WardrobeItem[]>([]);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Active Tab Navigator
  const [activeTab, setActiveTab] = useState<'home' | 'command' | 'platform' | 'wardrobe' | 'today' | 'tomorrow' | 'assistant' | 'vision' | 'aihub'>('command');
  const [styleVibe, setStyleVibe] = useState<'minimalist' | 'classic' | 'streetwear' | 'vintage' | 'bold'>('minimalist');
  const [generatingStrategyId, setGeneratingStrategyId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to the wardrobe database collection
  useEffect(() => {
    if (!user) {
      setWardrobe([]);
      return;
    }

    const q = query(
      collection(db, 'wardrobe'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<WardrobeItem, 'id'>)
      })) as WardrobeItem[];
      
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setWardrobe(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'wardrobe');
    });

    return () => unsubscribe();
  }, [user]);

  // Backward Compatibility: Listen to legacy constructions and map to wardrobe items dynamically
  useEffect(() => {
    if (!user) {
      setConstructions([]);
      return;
    }

    const q = query(
      collection(db, 'constructions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const raw = doc.data();
        
        // Map legacy states to equivalent fashion model states
        const statusMap: Record<string, WardrobeItem['status']> = {
          'Planning': 'In Closet',
          'In Progress': 'Planned',
          'Completed': 'Worn/Wash'
        };
        const categoryMap: Record<string, ClothingCategory> = {
          'Residential': 'Casual',
          'Commercial': 'Formal',
          'Infrastructure': 'Sportswear',
          'Renovation': 'Outerwear',
          'Other': 'Accessories'
        };

        const mappedCategory = (categoryMap[raw.category || ''] || raw.category || 'Casual') as ClothingCategory;
        const mappedStatus = (statusMap[raw.status || ''] || raw.status || 'In Closet') as WardrobeItem['status'];

        return {
          id: doc.id,
          title: raw.title || 'Untitled Apparel',
          description: raw.description || '',
          status: mappedStatus,
          category: mappedCategory,
          userId: raw.userId,
          createdAt: raw.createdAt,
          strategy: raw.strategy,
          collectionSource: 'constructions' // Metadata to track original collection
        } as WardrobeItem & { collectionSource: 'constructions' | 'wardrobe' };
      });
      
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setConstructions(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'constructions');
    });

    return () => unsubscribe();
  }, [user]);

  // Combined wardrobe streams safely for active displays
  const allItems = [...wardrobe, ...constructions].sort((a, b) => {
    return (b.createdAt?.seconds || 0) * 1000 + (b.createdAt?.nanoseconds || 0) / 1000000 - 
           ((a.createdAt?.seconds || 0) * 1000 + (a.createdAt?.nanoseconds || 0) / 1000000);
  });

  const handleAddGarment = async (
    title: string, 
    description: string, 
    category: ClothingCategory, 
    extraOptions?: {
      season?: WardrobeItem['season'];
      primaryColor?: string;
      secondaryColor?: string;
    }
  ) => {
    if (!user) return;
    try {
      await WardrobeService.addGarment(user.uid, title, description, category, {
        season: extraOptions?.season,
        primaryColor: extraOptions?.primaryColor,
        secondaryColor: extraOptions?.secondaryColor,
        wearCount: 0,
        lastUsed: ''
      });
    } catch (error) {
      console.error("Failed to store garment:", error);
    }
  };

  const handleAddSampleWardrobe = async () => {
    if (!user) return;
    setIsResetting(true);

    const sampleItems = [
      { title: 'Oversized Shearling Trench', description: 'Heavy insulation wool exterior, double-breasted shape, waterproof coating.', category: 'Outerwear' as ClothingCategory, season: 'Winter' as any, primaryColor: 'Pitch Black', secondaryColor: 'Warm Rust', wearCount: 0 },
      { title: 'Tailored Single-Breasted Blazer', description: 'Thin lightweight tailored Italian blazer, breathable fit for workplace dinners.', category: 'Formal' as ClothingCategory, season: 'Summer' as any, primaryColor: 'Oatmeal Beige', secondaryColor: 'Minimalist White', wearCount: 1 },
      { title: 'Loopback Heavy Cotton Hoodie', description: '100% organic heavy loopback French terry cotton, wide drop shoulder comfort fit.', category: 'Casual' as ClothingCategory, season: 'Spring' as any, primaryColor: 'Minimalist White', secondaryColor: 'Oatmeal Beige', wearCount: 5 },
      { title: 'Technical GoreTex Weather Jacket', description: 'Taped seams, windproof ventilation flaps, tailored high hood boundary.', category: 'Sportswear' as ClothingCategory, season: 'Winter' as any, primaryColor: 'Navy Blue', secondaryColor: 'Pitch Black', wearCount: 8 },
      { title: 'Chunky Acetate Classic Sunglasses', description: 'Deep UV protection lens, dark olive green frame, premium gold accents.', category: 'Accessories' as ClothingCategory, season: 'Summer' as any, primaryColor: 'Olive Drab', secondaryColor: 'Dry Sage', wearCount: 3 },
      { title: 'Sage Cotton Ribbed Beanie', description: 'High-stretch waffle weave organic cotton blend beanie.', category: 'Accessories' as ClothingCategory, season: 'Autumn' as any, primaryColor: 'Dry Sage', secondaryColor: 'Minimalist White', wearCount: 0 }
    ];

    try {
      for (const item of sampleItems) {
        await WardrobeService.addGarment(user.uid, item.title, item.description, item.category, {
          season: item.season,
          primaryColor: item.primaryColor,
          secondaryColor: item.secondaryColor,
          wearCount: item.wearCount,
          lastUsed: new Date().toISOString().split('T')[0]
        });
      }
      setResetMessage("Successfully loaded 6 sample outfits!");
      setTimeout(() => setResetMessage(null), 3000);
    } catch (err) {
      console.error("Failed to inject samples:", err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteItem = async (item: WardrobeItem) => {
    const sourceCollection = (item as any).collectionSource || 'wardrobe';
    try {
      await WardrobeService.removeGarment(item.id, sourceCollection);
    } catch (error) {
      console.error("Failed to delete garment:", error);
    }
  };

  const handleToggleStatus = async (item: WardrobeItem) => {
    const sourceCollection = (item as any).collectionSource || 'wardrobe';
    try {
      await WardrobeService.cycleGarmentStatus(item.id, item.status, sourceCollection);
    } catch (error) {
      console.error("Failed to cycle status:", error);
    }
  };

  const handleGenerateStrategy = async (item: WardrobeItem) => {
    setGeneratingStrategyId(item.id);
    try {
      const sourceCollection = (item as any).collectionSource || 'wardrobe';
      const strategy = await FashionEngine.generateStylingStrategy(item.title, item.category, item.description);
      await updateDoc(doc(db, sourceCollection, item.id), { strategy });
    } catch (error) {
      console.error("Failed to generate strategy:", error);
    } finally {
      setGeneratingStrategyId(null);
    }
  };

  const handleLockOutfit = async (itemIds: string[]) => {
    if (!user) return;
    try {
      // Transition matched items to Planned state to synchronize with dressing drawer
      for (const id of itemIds) {
        const item = allItems.find(x => x.id === id);
        if (item) {
          const sourceCollection = (item as any).collectionSource || 'wardrobe';
          await updateDoc(doc(db, sourceCollection, id), { 
            status: 'Planned',
            wearCount: (item.wearCount || 0) + 1,
            lastUsed: new Date().toISOString().split('T')[0]
          });
        }
      }
    } catch (err) {
      console.error("Failed to lock matched pieces:", err);
    }
  };

  const handleStageOutfit = async (itemIds: string[]) => {
    if (!user) return;
    try {
      // Stage items for tomorrow morning by updating Wear counters and setting Planned statuses
      for (const id of itemIds) {
        const item = allItems.find(x => x.id === id);
        if (item) {
          const sourceCollection = (item as any).collectionSource || 'wardrobe';
          await updateDoc(doc(db, sourceCollection, id), {
            status: 'Planned',
            wearCount: (item.wearCount || 0) + 1,
            lastUsed: new Date().toISOString().split('T')[0]
          });
        }
      }
    } catch (error) {
      console.error("Failed to stage tomorrow selection:", error);
    }
  };

  const handleReset = async () => {
    if (!user) return;
    const itemsCount = allItems.length;
    const confirmMessage = itemsCount > 0 
      ? `This will PERMANENTLY erase all ${itemsCount} items in your smart wardrobe. This action is irreversible. Proceed?`
      : 'This will attempt to reset your personal wardrobe workspace. Proceed?';
    
    if (!confirm(confirmMessage)) return;

    setIsResetting(true);
    try {
      // 1. Clear wardrobe entries
      const qWardrobe = query(collection(db, 'wardrobe'), where('userId', '==', user.uid));
      const snapsWardrobe = await getDocs(qWardrobe);
      const pr1 = snapsWardrobe.docs.map(d => deleteDoc(doc(db, 'wardrobe', d.id)));

      // 2. Clear legacy construction entries
      const qConst = query(collection(db, 'constructions'), where('userId', '==', user.uid));
      const snapsConst = await getDocs(qConst);
      const pr2 = snapsConst.docs.map(d => deleteDoc(doc(db, 'constructions', d.id)));

      await Promise.all([...pr1, ...pr2]);
      setResetMessage(`Successfully cleared ${snapsWardrobe.size + snapsConst.size} closet items.`);
      setTimeout(() => setResetMessage(null), 3000);
    } catch (error) {
      console.error("Failed to reset wardrobe workspace:", error);
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <RefreshCcw className="text-blue-600 w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  // Auth Protection Splash Screen (Visually Stunning, High Contrast Light Theme)
  if (!user) {
    return (
      <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-250 rotate-3"
          >
            <Shirt className="text-white w-10 h-10" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight text-slate-900"
          >
            Curate Your <br /> 
            <span className="text-blue-600 font-serif italic font-normal tracking-wide">Outfits.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-slate-500 max-w-xl mb-12 leading-relaxed font-light"
          >
            An elegant smart closet companion and styling assistant. Intelligently organize your outfits, balance garment rotation, and plan matching looks.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-sm"
          >
            <button 
              onClick={signInWithGoogle}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-slate-300 cursor-pointer"
            >
              Sign In with Google <ChevronRight size={16} />
            </button>
          </motion.div>
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-slate-100 pt-16">
            {[
              { icon: <CheckCircle2 className="text-blue-500" size={24} />, title: "Digital Closet", desc: "Log active winter coats, summer t-shirts, blazers, and accessory assets." },
              { icon: <Sparkles className="text-emerald-500" size={24} />, title: "Palette Auditor", desc: "Examine wardrobe metrics to construct balanced neutral and accent colors." },
              { icon: <CalendarDays className="text-amber-500" size={24} />, title: "Agendas Planner", desc: "Sync matching lookbooks for formal meetings, loungewears, and workouts." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="bg-slate-50/50 p-6 rounded-2xl text-left border border-slate-100"
              >
                <div className="mb-3">{feature.icon}</div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">{feature.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      {/* Top sticky responsive Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-150 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Gate */}
          <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shirt className="text-white w-4 h-4" />
            </div>
            <span className="font-serif font-black text-lg tracking-wide">
              Wardrobe Companion
            </span>
          </div>

          {/* Quick Header status notifications */}
          <div className="flex items-center gap-2 sm:gap-4">
            <AnimatePresence>
              {resetMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="hidden md:flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"
                >
                  <CheckCircle2 size={12} /> {resetMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handleReset} 
              disabled={isResetting}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Permanently remove all your clothes"
            >
              <RefreshCcw className={isResetting ? 'animate-spin' : ''} size={13} /> 
              <span className="text-[10px] uppercase font-mono tracking-wider hidden sm:inline">Reset Closet</span>
            </button>

            <div className="h-5 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold leading-tight">{user.displayName || 'Sartorialist'}</p>
                <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">Closet Member</p>
              </div>
              <button 
                onClick={logout} 
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                title="Logs out of profile"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Layout Navigation */}
      <div className="bg-white border-b border-slate-150 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-1 scrollbar-none" aria-label="Tabs navigation">
            {[
              { id: 'home', label: 'Home', icon: <Home size={14} /> },
              { id: 'command', label: 'Style Companion', icon: <Cpu size={14} className="text-indigo-600 animate-pulse" /> },
              { id: 'platform', label: 'Control Plane', icon: <Settings size={14} className="text-amber-500 animate-spin-slow" /> },
              { id: 'aihub', label: 'AI Operating Layer', icon: <Cpu size={14} className="text-blue-500" /> },
              { id: 'wardrobe', label: 'My Wardrobe', icon: <Shirt size={14} /> },
              { id: 'today', label: "Today's Outfit", icon: <Sparkles size={14} /> },
              { id: 'tomorrow', label: 'Tomorrow Planner', icon: <CalendarDays size={14} /> },
              { id: 'assistant', label: 'Style Assistant', icon: <Palette size={14} /> },
              { id: 'vision', label: 'Visual Scan', icon: <Camera size={14} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Primary Display viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'home' && (
              <FashionHome 
                wardrobe={allItems} 
                onNavigate={setActiveTab} 
                onAddSampleWardrobe={handleAddSampleWardrobe}
              />
            )}

            {activeTab === 'command' && (
              <FashionCommandCenter 
                wardrobe={allItems}
                onAddGarment={async (title, desc, cat, extra) => {
                  try {
                    await handleAddGarment(title, desc, cat, extra);
                  } finally {}
                }}
              />
            )}

            {activeTab === 'platform' && (
              <PlatformControlCenter 
                wardrobe={allItems}
                currentVibe={styleVibe}
                onSetVibe={(v) => setStyleVibe(v)}
              />
            )}

            {activeTab === 'wardrobe' && (
              <WardrobeGrid 
                wardrobe={allItems}
                onAddGarment={handleAddGarment}
                onDeleteItem={handleDeleteItem}
                onToggleStatus={handleToggleStatus}
                onGenerateStrategy={handleGenerateStrategy}
                generatingStrategyId={generatingStrategyId}
              />
            )}

            {activeTab === 'today' && (
              <TodaySuggestionCard 
                wardrobe={allItems} 
                onLockOutfit={handleLockOutfit}
                styleVibe={styleVibe}
                userId={user?.uid}
              />
            )}

            {activeTab === 'tomorrow' && (
              <TomorrowPlanner 
                wardrobe={allItems} 
                onStageOutfit={handleStageOutfit}
              />
            )}

            {activeTab === 'assistant' && (
              <StyleAssistantPanel 
                wardrobe={allItems}
                styleVibe={styleVibe}
                onUpdateVibe={(v) => setStyleVibe(v)}
              />
            )}

            {activeTab === 'vision' && (
              <VisualAnalysisPanel 
                wardrobe={allItems}
                onAddGarment={async (title, desc, category, extra) => {
                  await handleAddGarment(title, desc, category, extra);
                  setActiveTab('wardrobe'); // Redirect to overview to see newly mapped garment
                }}
              />
            )}

            {activeTab === 'aihub' && (
              <AIStyleHub 
                wardrobe={allItems}
                onAddGarment={async (title, desc, category, extra) => {
                  await handleAddGarment(title, desc, category, extra);
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Humble Elegant footer element */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center border-t border-slate-100 mt-20">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Intelligent Personal Style Hub & Closet Auditor</p>
      </footer>
    </div>
  );
}
