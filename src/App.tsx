import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { 
  LayoutGrid, 
  Plus, 
  Trash2, 
  LogOut, 
  Hammer, 
  CheckCircle2, 
  Clock, 
  RefreshCcw, 
  ChevronRight,
  HardHat,
  Construction as ConstructionIcon,
  AlertCircle,
  Search,
  Filter,
  Camera,
  Scan,
  Zap,
  Info,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, signInWithGoogle, logout, OperationType, handleFirestoreError } from './firebase';
import { analyzeSiteImage, generateProjectStrategy } from './lib/gemini';
import { KiaTelemetry } from './components/KiaTelemetry';

interface Construction {
  id: string;
  title: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  createdAt: any;
  userId: string;
  category?: string;
  strategy?: string;
}

const CATEGORIES = ['Residential', 'Commercial', 'Infrastructure', 'Renovation', 'Other'];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [isResetting, setIsResetting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [visionResult, setVisionResult] = useState<string | null>(null);
  const [generatingStrategy, setGeneratingStrategy] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'projects' | 'fleet'>('projects');

  useEffect(() => {
// ... existing onAuthStateChanged logic remains same
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Construction, 'id'>)
      })) as Construction[];
      
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setConstructions(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'constructions');
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    try {
      await addDoc(collection(db, 'constructions'), {
        title: newTitle,
        description: newDesc,
        status: 'Planning',
        category: newCategory,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewTitle('');
      setNewDesc('');
      setNewCategory(CATEGORIES[0]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'constructions');
    }
  };

  const handleReset = async () => {
    if (!user) return;
    const confirmMessage = constructions.length > 0 
      ? `This will PERMANENTLY delete all ${constructions.length} construction projects. This action cannot be undone. Proceed?`
      : 'This will attempt to clear all construction projects associated with your account. Proceed?';
    
    if (!confirm(confirmMessage)) return;

    setIsResetting(true);
    try {
      const q = query(collection(db, 'constructions'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setResetMessage('No data found to clear.');
      } else {
        const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'constructions', d.id)));
        await Promise.all(deletePromises);
        setResetMessage(`Successfully cleared ${snapshot.size} projects.`);
      }
      
      setTimeout(() => setResetMessage(null), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'constructions');
    } finally {
      setIsResetting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: Construction['status']) => {
    const nextStatusMap: Record<Construction['status'], Construction['status']> = {
      'Planning': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'Planning'
    };
    try {
      await updateDoc(doc(db, 'constructions', id), {
        status: nextStatusMap[currentStatus]
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'constructions');
    }
  };

  const handleGenerateStrategy = async (item: Construction) => {
    setGeneratingStrategy(item.id);
    try {
      const strategy = await generateProjectStrategy(item.title, item.category || 'General', item.description);
      await updateDoc(doc(db, 'constructions', item.id), { strategy });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'constructions');
    } finally {
      setGeneratingStrategy(null);
    }
  };

  const filteredConstructions = constructions.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleVisionSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setVisionResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      const result = await analyzeSiteImage(base64String);
      setVisionResult(result);
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-40 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200 rotate-6"
          >
            <HardHat className="text-white w-10 h-10" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6"
          >
            Track Your <br /> 
            <span className="text-blue-600">Constructions.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed"
          >
            Professional-grade construction project management. From planning to completion. 
            Easily reset your workspace when starting fresh.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
          >
            <button 
              onClick={signInWithGoogle}
              className="flex-1 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              Sign In with Google <ChevronRight size={20} />
            </button>
          </motion.div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { icon: <Clock className="text-amber-500" />, title: "Progress Tracking", desc: "Monitor every phase from ground-breaking to handover." },
              { icon: <CheckCircle2 className="text-green-500" />, title: "Milestones", desc: "Mark completed projects and celebrate your builds." },
              { icon: <RefreshCcw className="text-blue-500" />, title: "Quick Reset", desc: "Clean your workspace instantly for new mobile projects." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="bg-slate-50 p-8 rounded-3xl text-left border border-slate-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-slate-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <HardHat className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight hidden sm:block">CONSTRUCT</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <AnimatePresence>
              {resetMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="hidden md:flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 px-3 py-1.5 rounded-lg border border-green-100"
                >
                  <CheckCircle2 size={12} /> {resetMessage}
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={handleReset} 
              disabled={isResetting}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Permanently delete all your projects"
            >
              <RefreshCcw className={isResetting ? 'animate-spin' : ''} size={14} /> 
              <span className="text-[11px] uppercase tracking-wider">Quick Reset</span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold">{user.displayName}</p>
                <p className="text-[10px] text-slate-400 font-mono uppercase">Contractor</p>
              </div>
              <button onClick={logout} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <LogOut size={18} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Add Section */}
          <aside className="lg:col-span-4 space-y-6">
            {/* AI Vision Tool */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-6 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Scan size={80} />
              </div>
              
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                <Camera className="text-blue-400" size={20} /> Site Vision AI
              </h2>
              
              <p className="text-xs text-slate-400 mb-6 relative z-10">
                Upload a site photo to analyze technical progress and detect milestones automatically.
              </p>

              {!visionResult && !analyzing && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-slate-800 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Scan className="w-8 h-8 mb-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Select Site Photo</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleVisionSelect} />
                </label>
              )}

              {analyzing && (
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4"
                  >
                    <Zap className="text-blue-400 animate-pulse" />
                  </motion.div>
                  <p className="text-xs font-mono text-blue-400 animate-pulse uppercase tracking-[0.2em]">Analyzing Data Streams...</p>
                </div>
              )}

              {visionResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 max-h-60 overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1">
                      <Info size={10} /> Intelligence Report
                    </span>
                    <button 
                      onClick={() => setVisionResult(null)}
                      className="text-slate-500 hover:text-white text-[10px] font-bold"
                    >
                      CLEAR
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono whitespace-pre-wrap text-slate-300 leading-relaxed">
                    {visionResult}
                  </pre>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border shadow-sm p-6"
            >
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Plus className="text-blue-600" size={20} /> New Project
              </h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Project Title</label>
                  <input 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)} 
                    placeholder="E.g., Riverside Mall" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Category</label>
                  <select 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Description</label>
                  <textarea 
                    value={newDesc} 
                    onChange={e => setNewDesc(e.target.value)} 
                    placeholder="Details about construction site..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100"
                >
                  Confirm Project
                </button>
              </form>
            </motion.div>
          </aside>

          {/* Main Content - List Section */}
          <section className="lg:col-span-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveView('projects')}
                  className={`text-2xl font-black tracking-tight flex items-center gap-3 transition-colors ${activeView === 'projects' ? 'text-slate-900' : 'text-slate-300 hover:text-slate-400'}`}
                >
                  <ConstructionIcon className={activeView === 'projects' ? 'text-blue-600' : 'text-slate-300'} size={24} /> 
                  Active Base
                </button>
                <div className="h-4 w-px bg-slate-200" />
                <button 
                  onClick={() => setActiveView('fleet')}
                  className={`text-2xl font-black tracking-tight flex items-center gap-3 transition-colors ${activeView === 'fleet' ? 'text-slate-900' : 'text-slate-300 hover:text-slate-400'}`}
                >
                  <Navigation className={activeView === 'fleet' ? 'text-blue-600' : 'text-slate-300'} size={24} /> 
                  Tactical Fleet
                </button>
              </div>
              
              {activeView === 'projects' && (
                <div className="flex items-center gap-2">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input 
                    type="search"
                    placeholder="Search sites..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-48 transition-all"
                  />
                </div>
                <select 
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                >
                  <option value="All">All Status</option>
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            )}
          </div>

            <AnimatePresence mode="wait">
              {activeView === 'projects' ? (
                <motion.div 
                  key="projects-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <AnimatePresence mode="popLayout">
                {filteredConstructions.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-xl hover:border-blue-200 transition-all duration-500"
                  >
                    <motion.div 
                      layout
                      className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none"
                    >
                      <LayoutGrid size={60} />
                    </motion.div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                        item.status === 'Completed' ? 'bg-green-50 text-green-700' :
                        item.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.status === 'Planning' && <Clock size={10} />}
                        {item.status === 'In Progress' && <Hammer size={10} />}
                        {item.status === 'Completed' && <CheckCircle2 size={10} />}
                        {item.status}
                      </div>
                      <button 
                        onClick={() => deleteDoc(doc(db, 'constructions', item.id))} 
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors tracking-tight">{item.title}</h3>
                    <p className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-tighter">{item.category || 'General'}</p>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{item.description || 'No additional site details recorded.'}</p>
                    
                    {item.strategy ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-normal"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5 text-blue-600 font-black uppercase tracking-widest text-[9px]">
                          <Zap size={10} /> Tactical Strategy
                        </div>
                        <div className="whitespace-pre-wrap opacity-80">{item.strategy}</div>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => handleGenerateStrategy(item)}
                        disabled={generatingStrategy === item.id}
                        className="mb-6 w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-100"
                      >
                        {generatingStrategy === item.id ? (
                          <RefreshCcw className="animate-spin" size={12} />
                        ) : (
                          <Zap size={12} />
                        )}
                        Initialize Hunt List
                      </button>
                    )}
                    
                    <button 
                      onClick={() => toggleStatus(item.id, item.status)}
                      className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      Cycle Status <ChevronRight size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredConstructions.length === 0 && (
                <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <ConstructionIcon size={32} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">No sites found</h3>
                  <p className="text-sm text-slate-400 max-w-[200px]">Try adjusting your search or add a new project.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="fleet-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <KiaTelemetry />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-slate-400">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Construction Site Management System v1.2</p>
      </footer>
    </div>
  );
}
