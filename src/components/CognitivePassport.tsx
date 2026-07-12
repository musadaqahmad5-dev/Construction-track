import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Award, Key, Save, Check, RefreshCw, Sparkles, LogOut, ShieldAlert,
  Sliders, Trash2, Calendar, Edit2, Plus, Info, Ruler, BookOpen, Fingerprint,
  CreditCard, ExternalLink, QrCode, Sparkle, Tag, CheckSquare, Square, ChevronDown, ChevronUp, Mail,
  Clock, ShoppingBag
} from 'lucide-react';
import { ProfileService, type StylistHistoryEntry, type StyleProfile } from '../platform';

interface CognitivePassportProps {
  user?: any;
  onLogout?: () => void;
}

interface SartorialGoal {
  id: string;
  text: string;
  targetDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export const CognitivePassport: React.FC<CognitivePassportProps> = ({ user, onLogout }) => {
  // Sizing Profile States
  const [topSize, setTopSize] = useState<string>(() => localStorage.getItem('user_size_top') || 'M');
  const [bottomSize, setBottomSize] = useState<string>(() => localStorage.getItem('user_size_bottom') || '32');
  const [shoeSize, setShoeSize] = useState<string>(() => localStorage.getItem('user_size_shoe') || 'US 10');
  
  // Custom Fine Measurements States
  const [chestVal, setChestVal] = useState<number>(() => Number(localStorage.getItem('user_meas_chest') || '40'));
  const [sleeveVal, setSleeveVal] = useState<number>(() => Number(localStorage.getItem('user_meas_sleeve') || '34'));
  const [waistVal, setWaistVal] = useState<number>(() => Number(localStorage.getItem('user_meas_waist') || '32'));
  const [inseamVal, setInseamVal] = useState<number>(() => Number(localStorage.getItem('user_meas_inseam') || '32'));

  const [isSavingSize, setIsSavingSize] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Stylist History Logs
  const [stylistLogs, setStylistLogs] = useState<StylistHistoryEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Sartorial DNA Preference Scores (Sliders for interactive editing)
  const [dnaScores, setDnaScores] = useState({
    minimalist: 5,
    streetwear: 5,
    luxury: 5,
    experimental: 5
  });

  // Style Membership Card Skins
  const [cardSkin, setCardSkin] = useState<'midnight' | 'gold' | 'emerald' | 'violet'>('midnight');
  const [showQRModal, setShowQRModal] = useState(false);

  // Accordion active toggles - only one open at a time or multi (let's do custom toggles)
  const [activeSection, setActiveSection] = useState<string | null>('dna'); // default open 'dna' or first

  // Sartorial Goals & Notes states
  const [goals, setGoals] = useState<SartorialGoal[]>(() => {
    const cached = localStorage.getItem('sartorial_goals');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return []; }
    }
    return [
      { id: '1', text: 'Acquire pleated wool trousers for smart casual settings', targetDate: '2026-08-15', priority: 'High', completed: false },
      { id: '2', text: 'Calibrate oversized layers with minimalist outerwear', targetDate: '2026-09-01', priority: 'Medium', completed: true },
      { id: '3', text: 'Explore artisan denim with sustainable certifications', targetDate: '2026-10-10', priority: 'Low', completed: false }
    ];
  });
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalPriority, setNewGoalPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newGoalDate, setNewGoalDate] = useState('');

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('sartorial_goals', JSON.stringify(goals));
  }, [goals]);

  // Load User Style Profile
  useEffect(() => {
    if (!user) return;
    setLoadingLogs(true);
    ProfileService.loadProfile(user.uid)
      .then(p => {
        if (p) {
          const vector = p.styleVector || [0.6, 0.5, 0.4, 0.5, 0.3, 0.4, 0.5, 0.5];
          setDnaScores({
            minimalist: Math.round((vector[0] || 0.5) * 10),
            streetwear: Math.round((vector[1] || 0.5) * 10),
            luxury: Math.round((vector[3] || 0.5) * 10),
            experimental: Math.round((vector[4] || 0.5) * 10)
          });
          const historyKey = `history_log_${user.uid}`;
          const cachedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
          setStylistLogs(cachedHistory);
        }
      })
      .catch(err => console.error("Error loading DNA metrics:", err))
      .finally(() => setLoadingLogs(false));
  }, [user]);

  // Save both sizes & fine measurements + DNA scores
  const handleSaveProfile = async () => {
    setIsSavingSize(true);
    setSavedSuccess(false);

    // Save sizes to local storage
    localStorage.setItem('user_size_top', topSize);
    localStorage.setItem('user_size_bottom', bottomSize);
    localStorage.setItem('user_size_shoe', shoeSize);
    
    localStorage.setItem('user_meas_chest', chestVal.toString());
    localStorage.setItem('user_meas_sleeve', sleeveVal.toString());
    localStorage.setItem('user_meas_waist', waistVal.toString());
    localStorage.setItem('user_meas_inseam', inseamVal.toString());

    // Update style profile in database if possible
    if (user) {
      try {
        const currentProfile = await ProfileService.loadProfile(user.uid);
        const updatedVector = [...(currentProfile.styleVector || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5])];
        // Map back sliders [0] = minimalist, [1] = streetwear, [3] = luxury, [4] = experimental
        updatedVector[0] = dnaScores.minimalist / 10;
        updatedVector[1] = dnaScores.streetwear / 10;
        updatedVector[3] = dnaScores.luxury / 10;
        updatedVector[4] = dnaScores.experimental / 10;

        await ProfileService.saveProfile(user.uid, {
          ...currentProfile,
          styleVector: updatedVector,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Failed to write updated vector back to profile:", err);
      }
    }

    setTimeout(() => {
      setIsSavingSize(false);
      setSavedSuccess(true);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: 'Sartorial passport variables fully calibrated!'
      }));
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 800);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal: SartorialGoal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      targetDate: newGoalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: newGoalPriority,
      completed: false
    };

    setGoals([newGoal, ...goals]);
    setNewGoalText('');
    setNewGoalDate('');
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: 'Added new sartorial goal!'
    }));
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  // Simulation handler to instantly log events and demonstrate the history mechanics
  const handleSimulateLog = (actionType: 'WORN_CONFIRMED' | 'SKIPPED' | 'MODIFIED_FIT' | 'SYSTEM_CALIBRATED' | 'RESERV_SECURED') => {
    if (!user) return;
    
    let outfitName = "";
    let reflection = "";
    let suitabilityScore = 90;
    let moment = "Simulated Event";
    
    if (actionType === 'WORN_CONFIRMED') {
      const names = [
        "Monochromatic Cashmere Coord",
        "Cyberpunk Techwear Silhouette",
        "Vintage Heavyweight Denim Set",
        "Brutalist Minimalist Outerwear"
      ];
      outfitName = names[Math.floor(Math.random() * names.length)];
      reflection = "Simulated Outfit Match: Seamless fit calibrated perfectly with local style DNA.";
      suitabilityScore = 95;
      moment = "Style Recommendation Confirmed";
    } else if (actionType === 'MODIFIED_FIT') {
      outfitName = "Tailored Wool Overcoat";
      reflection = "Simulated Adjustment: Chest and sleeve measurements fine-tuned for a slimmer profile.";
      suitabilityScore = 88;
      moment = "Fit Modification Calibrated";
    } else if (actionType === 'SKIPPED') {
      outfitName = "Experimental Avant-Garde Cloak";
      reflection = "Simulated Skip: Decided to style a more minimalist coordinate for the occasion.";
      suitabilityScore = 45;
      moment = "Alternative Option Selected";
    } else if (actionType === 'SYSTEM_CALIBRATED') {
      outfitName = "Sartorial Sizing Calibration";
      reflection = `Recalibrated fine tailor measurements (Chest: ${chestVal}", Inseam: ${inseamVal}").`;
      suitabilityScore = 100;
      moment = "Physical Dimensions Saved";
    } else if (actionType === 'RESERV_SECURED') {
      outfitName = "Boutique Tweed Blazer Reserve";
      reflection = "Secured real-time showcase inventory reservation with premium Milan partner showroom.";
      suitabilityScore = 98;
      moment = "Commerce Asset Lock";
    }

    const newLog: StylistHistoryEntry = {
      id: `sim-log-${Date.now()}`,
      userId: user.uid,
      outfitId: `outfit-${Math.floor(Math.random() * 1000)}`,
      outfitName,
      action: actionType as any,
      timestamp: new Date().toISOString(),
      suitabilityScore,
      moment,
      reflection
    };

    // Save to profile database logic locally
    const historyKey = `history_log_${user.uid}`;
    try {
      const currentVal = JSON.parse(localStorage.getItem(historyKey) || '[]');
      currentVal.unshift(newLog);
      localStorage.setItem(historyKey, JSON.stringify(currentVal.slice(0, 100)));
      setStylistLogs([newLog, ...stylistLogs]);
      
      // Also log remotely using ProfileService (background flusher takes care of it)
      ProfileService.logFeedback(user.uid, {
        outfitId: newLog.outfitId,
        outfitName: newLog.outfitName,
        action: newLog.action,
        suitabilityScore: newLog.suitabilityScore,
        moment: newLog.moment,
        reflection: newLog.reflection
      });

      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `Successfully logged "${outfitName}" into your Sartorial History!`
      }));
    } catch (e) {
      console.error("Simulation log error:", e);
    }
  };

  // Sizing Profile Helper Descriptors
  const getSleeveFit = (val: number) => {
    if (val < 32) return 'Short Trim';
    if (val > 35) return 'Classic Draped';
    return 'Standard Slender';
  };

  const getChestFit = (val: number) => {
    if (val < 38) return 'Tailored Slim';
    if (val > 44) return 'Oversized Boxy';
    return 'Athletic Proportional';
  };

  // Accordion Toggle helper
  const toggleSection = (sec: string) => {
    setActiveSection(activeSection === sec ? null : sec);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in text-white py-2 max-w-4xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-violet-400 block font-light">
            Sartorial Identity Passport
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-2xl text-white mt-1">
            Cognitive Style Passport
          </h2>
          <p className="text-xs text-white/40 font-serif italic mt-0.5">
            Manage your digital DNA, custom tailor measurements, alpha sizing, and real-time advisor logs below.
          </p>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          className="text-[10px] font-mono uppercase tracking-[0.15em] border border-white/10 hover:border-white px-4 py-2 transition-all hover:bg-white/5 cursor-pointer text-white/70 hover:text-white rounded-xl font-bold shrink-0"
        >
          [ Sign Out ]
        </button>
      </div>

      {/* CORE PROFILE INTERACTIVE ACCORDIONS */}
      <div className="space-y-3">
        
        {/* LINE 1: COGNITIVE DNA TUNER */}
        <div className="border border-white/5 rounded-xl bg-[#07070c] overflow-hidden transition-all hover:border-indigo-500/15">
          <button 
            onClick={() => toggleSection('dna')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.01] transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white">Stylistic DNA Tuner</span>
                <span className="block text-[10px] text-zinc-400 font-mono truncate">
                  Minimalist: {dnaScores.minimalist * 10}% &bull; Streetwear: {dnaScores.streetwear * 10}% &bull; Luxury: {dnaScores.luxury * 10}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                Tuned
              </span>
              {activeSection === 'dna' ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeSection === 'dna' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-white/[0.03] bg-black/25"
              >
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                    {/* Minimalist */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-300">
                        <span>MINIMALIST TONE</span>
                        <span className="font-bold text-white">{dnaScores.minimalist * 10}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={dnaScores.minimalist} 
                        onChange={(e) => setDnaScores({ ...dnaScores, minimalist: Number(e.target.value) })}
                        className="w-full accent-indigo-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Streetwear */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-300">
                        <span>STREETWEAR ACCENT</span>
                        <span className="font-bold text-cyan-400">{dnaScores.streetwear * 10}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={dnaScores.streetwear} 
                        onChange={(e) => setDnaScores({ ...dnaScores, streetwear: Number(e.target.value) })}
                        className="w-full accent-cyan-400 bg-white/5 h-1 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Luxury */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-300">
                        <span>LUXURY CLASS</span>
                        <span className="font-bold text-amber-400">{dnaScores.luxury * 10}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={dnaScores.luxury} 
                        onChange={(e) => setDnaScores({ ...dnaScores, luxury: Number(e.target.value) })}
                        className="w-full accent-amber-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Experimental */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-300">
                        <span>AVANT-GARDE FOCUS</span>
                        <span className="font-bold text-purple-400">{dnaScores.experimental * 10}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={dnaScores.experimental} 
                        onChange={(e) => setDnaScores({ ...dnaScores, experimental: Number(e.target.value) })}
                        className="w-full accent-purple-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl text-[10.5px] text-zinc-400 leading-relaxed flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Dynamic Stylist Insight</p>
                      <p className="font-serif italic mt-0.5">
                        {dnaScores.minimalist > 7 
                          ? '"High minimalist tone calibrates lookbooks to showcase architectural silhouettes, clean tailored structure, and neutral fabrics."' 
                          : dnaScores.luxury > 7 
                          ? '"Premium luxury bias prioritizes fine wool weaves, verified boutiques, and structured artisanal silhouettes."' 
                          : '"Adjust sliders to dynamically filter custom lookbooks generated by LookVision artificial intelligence."'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingSize}
                      className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/15 text-indigo-300 rounded-lg text-[9.5px] font-mono uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {isSavingSize ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>[ Sync Style DNA Parameters ]</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LINE 2: SARTORIAL GOALS & PLANNER */}
        <div className="border border-white/5 rounded-xl bg-[#07070c] overflow-hidden transition-all hover:border-emerald-500/15">
          <button 
            onClick={() => toggleSection('goals')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.01] transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white">Atelier Goals & Planner Ledger</span>
                <span className="block text-[10px] text-zinc-400 font-mono truncate">
                  {goals.filter(g => !g.completed).length} active style goals &bull; {goals.filter(g => g.completed).length} completed target profiles
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                {goals.filter(g => !g.completed).length} Pending
              </span>
              {activeSection === 'goals' ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeSection === 'goals' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-white/[0.03] bg-black/25"
              >
                <div className="p-5 space-y-4">
                  {/* Quick Add Form */}
                  <form onSubmit={handleAddGoal} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add style goal (e.g. Find double-breasted slate blazer)..."
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/[0.02] border border-white/5 hover:border-white/10 focus:border-emerald-500/40 rounded-lg text-xs placeholder-zinc-500 outline-none transition-all"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>[ Save ]</span>
                      </button>
                    </div>

                    <div className="flex gap-4 items-center justify-between text-[10px] font-mono text-zinc-400">
                      <div className="flex gap-2 items-center">
                        <span>Priority:</span>
                        {(['High', 'Medium', 'Low'] as const).map((pr) => (
                          <button
                            key={pr}
                            type="button"
                            onClick={() => setNewGoalPriority(pr)}
                            className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
                              newGoalPriority === pr
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold'
                                : 'bg-transparent border-white/5 text-zinc-500'
                            }`}
                          >
                            {pr}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span>Target Date:</span>
                        <input
                          type="date"
                          value={newGoalDate}
                          onChange={(e) => setNewGoalDate(e.target.value)}
                          className="bg-white/[0.02] border border-white/5 rounded px-2 py-0.5 text-[10px] text-zinc-300 outline-none focus:border-emerald-500/40"
                        />
                      </div>
                    </div>
                  </form>

                  {/* Scrollable Goals List */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar pt-1">
                    {goals.map((g) => (
                      <div 
                        key={g.id}
                        className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                          g.completed 
                            ? 'bg-white/[0.01] border-white/5 opacity-50' 
                            : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                        }`}
                      >
                        <button
                          onClick={() => toggleGoal(g.id)}
                          className="text-zinc-400 hover:text-white mt-0.5 shrink-0 transition-all cursor-pointer"
                        >
                          {g.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        <div className="flex-1 text-left space-y-1 min-w-0">
                          <p className={`text-xs ${g.completed ? 'line-through text-zinc-500 font-light' : 'text-white'}`}>
                            {g.text}
                          </p>
                          <div className="flex gap-2.5 items-center font-mono text-[8px] uppercase tracking-widest text-zinc-500">
                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                              g.priority === 'High' 
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                : g.priority === 'Medium'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                            }`}>
                              {g.priority} Priority
                            </span>
                            <span>Target: {g.targetDate}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteGoal(g.id)}
                          className="text-zinc-500 hover:text-rose-400 shrink-0 cursor-pointer p-1 rounded hover:bg-white/5 transition-all"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {goals.length === 0 && (
                      <div className="text-center py-8 space-y-2">
                        <BookOpen className="w-8 h-8 text-zinc-700 mx-auto" />
                        <p className="text-xs font-serif italic text-zinc-500">"No style targets added. Complete planner above."</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LINE 3: TAILOR CALIBRATION LABORATORY */}
        <div className="border border-white/5 rounded-xl bg-[#07070c] overflow-hidden transition-all hover:border-violet-500/15">
          <button 
            onClick={() => toggleSection('tailor')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.01] transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                <Ruler className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white">Tailor Calibration Lab</span>
                <span className="block text-[10px] text-zinc-400 font-mono truncate">
                  Chest: {chestVal}" &bull; Sleeve: {sleeveVal}" &bull; Waist: {waistVal}" &bull; Inseam: {inseamVal}"
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                Inch Calibrated
              </span>
              {activeSection === 'tailor' ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeSection === 'tailor' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-white/[0.03] bg-black/25"
              >
                <div className="p-5 space-y-5">
                  <div className="space-y-4">
                    {/* Chest Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10.5px] font-mono text-zinc-400">
                        <span>Chest Circumference</span>
                        <span className="text-white font-bold">{chestVal}" ({getChestFit(chestVal)})</span>
                      </div>
                      <input 
                        type="range" 
                        min="34" 
                        max="50" 
                        value={chestVal} 
                        onChange={(e) => setChestVal(Number(e.target.value))}
                        className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Sleeve Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10.5px] font-mono text-zinc-400">
                        <span>Sleeve Length</span>
                        <span className="text-white font-bold">{sleeveVal}" ({getSleeveFit(sleeveVal)})</span>
                      </div>
                      <input 
                        type="range" 
                        min="30" 
                        max="38" 
                        value={sleeveVal} 
                        onChange={(e) => setSleeveVal(Number(e.target.value))}
                        className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Waist Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10.5px] font-mono text-zinc-400">
                        <span>Waist Circumference</span>
                        <span className="text-white font-bold">{waistVal}"</span>
                      </div>
                      <input 
                        type="range" 
                        min="26" 
                        max="44" 
                        value={waistVal} 
                        onChange={(e) => setWaistVal(Number(e.target.value))}
                        className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Inseam Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10.5px] font-mono text-zinc-400">
                        <span>Inseam Length</span>
                        <span className="text-white font-bold">{inseamVal}"</span>
                      </div>
                      <input 
                        type="range" 
                        min="28" 
                        max="36" 
                        value={inseamVal} 
                        onChange={(e) => setInseamVal(Number(e.target.value))}
                        className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingSize}
                      className="px-5 py-2.5 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/15 text-violet-300 rounded-lg text-[9.5px] font-mono uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSavingSize ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : savedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved Calibration</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>[ Save Calibration Variables ]</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LINE 4: STANDARD SIZE MATRIX */}
        <div className="border border-white/5 rounded-xl bg-[#07070c] overflow-hidden transition-all hover:border-amber-500/15">
          <button 
            onClick={() => toggleSection('sizes')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.01] transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white">Standard Alpha Sizing Matrix</span>
                <span className="block text-[10px] text-zinc-400 font-mono truncate">
                  Tops: {topSize} &bull; Bottoms: {bottomSize} &bull; Shoes: {shoeSize}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                Alpha Fit
              </span>
              {activeSection === 'sizes' ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeSection === 'sizes' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-white/[0.03] bg-black/25"
              >
                <div className="p-5 space-y-4">
                  {/* Tops Sizes Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 block">Tops / Coat size</label>
                    <div className="grid grid-cols-6 gap-1.5">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setTopSize(sz)}
                          className={`py-1.5 text-[9.5px] font-mono uppercase rounded-lg border transition-all cursor-pointer ${
                            topSize === sz 
                              ? 'bg-white text-black font-bold border-white' 
                              : 'bg-transparent border-white/5 hover:border-white/20 text-zinc-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottoms Sizes Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 block">Bottoms / Waist width</label>
                    <div className="grid grid-cols-6 gap-1.5">
                      {['28', '30', '32', '34', '36', '38'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setBottomSize(sz)}
                          className={`py-1.5 text-[9.5px] font-mono uppercase rounded-lg border transition-all cursor-pointer ${
                            bottomSize === sz 
                              ? 'bg-white text-black font-bold border-white' 
                              : 'bg-transparent border-white/5 hover:border-white/20 text-zinc-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footwear selection */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 block">Footwear sizing</label>
                    <div className="grid grid-cols-6 gap-1.5">
                      {['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setShoeSize(sz)}
                          className={`py-1.5 text-[9.5px] font-mono uppercase rounded-lg border transition-all cursor-pointer ${
                            shoeSize === sz 
                              ? 'bg-white text-black font-bold border-white' 
                              : 'bg-transparent border-white/5 hover:border-white/20 text-zinc-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg font-mono text-[9.5px] uppercase tracking-wider font-semibold transition-all cursor-pointer"
                    >
                      [ Sync Sizing Parameters ]
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LINE 5: ATELIER DIGITAL MEMBER SIGNATURE CARD */}
        <div className="border border-white/5 rounded-xl bg-[#07070c] overflow-hidden transition-all hover:border-cyan-500/15">
          <button 
            onClick={() => toggleSection('card')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.01] transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white">Digital Signature & Membership Pass</span>
                <span className="block text-[10px] text-zinc-400 font-mono truncate">
                  Skin style: {cardSkin} &bull; Signature QR verified
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                Signature Active
              </span>
              {activeSection === 'card' ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeSection === 'card' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-white/[0.03] bg-black/25"
              >
                <div className="p-5 space-y-4">
                  {/* Skin Selector */}
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[10px] font-mono text-zinc-400 mr-2 uppercase">Card Aesthetics:</span>
                    {(['midnight', 'gold', 'emerald', 'violet'] as const).map((skin) => (
                      <button
                        key={skin}
                        onClick={() => setCardSkin(skin)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-mono uppercase border cursor-pointer transition-all ${
                          cardSkin === skin
                            ? 'bg-white text-black border-white font-bold'
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/10'
                        }`}
                      >
                        {skin}
                      </button>
                    ))}
                  </div>

                  {/* Holographic membership block */}
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className={`relative h-48 rounded-xl p-5 overflow-hidden flex flex-col justify-between border shadow-xl transition-all duration-500 mx-auto max-w-sm ${
                      cardSkin === 'midnight' 
                        ? 'bg-gradient-to-br from-[#0c0c16] via-[#07070c] to-[#040408] border-white/10' 
                        : cardSkin === 'gold'
                        ? 'bg-gradient-to-br from-[#1c160c] via-[#0e0a05] to-[#050402] border-amber-500/20'
                        : cardSkin === 'emerald'
                        ? 'bg-gradient-to-br from-[#0c1c13] via-[#050e09] to-[#010503] border-emerald-500/20'
                        : 'bg-gradient-to-br from-[#190c2a] via-[#0a0512] to-[#040208] border-violet-500/20'
                    }`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02),transparent_45%)] pointer-events-none" />

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif tracking-tight font-bold text-xs text-white">LOOKVISION</h3>
                        <p className="text-[6.5px] font-mono uppercase tracking-widest text-zinc-400">Unified Fashion OS</p>
                      </div>
                      <button 
                        onClick={() => setShowQRModal(true)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all cursor-pointer text-white"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[7px] font-mono tracking-widest text-zinc-400 block uppercase">SARTORIAL MEMBER PROFILE</span>
                      <h4 className="font-serif text-base tracking-tight font-light truncate">
                        {user?.displayName || 'Sartorial Companion'}
                      </h4>
                    </div>

                    <div className="border-t border-white/[0.05] pt-2.5 flex justify-between items-end text-[8px] font-mono text-zinc-400">
                      <div>
                        <span className="block text-[6px] uppercase text-zinc-500">ID Credentials</span>
                        <span className="text-[9px] text-zinc-300 font-bold">{user?.uid?.slice(0, 12) || 'GUEST-ID'}</span>
                      </div>
                      <span className="text-[7px] uppercase tracking-widest text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        Verified Signature
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LINE 6: HISTORICAL CONSULTATION LOGS */}
        <div className="border border-white/5 rounded-xl bg-[#07070c] overflow-hidden transition-all hover:border-purple-500/15">
          <button 
            onClick={() => toggleSection('logs')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.01] transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white">Historical Consulting & Outfit Logs</span>
                <span className="block text-[10px] text-zinc-400 font-mono truncate">
                  {stylistLogs.length} verified advisor logs registered
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                {stylistLogs.length} Consults
              </span>
              {activeSection === 'logs' ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeSection === 'logs' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-white/[0.03] bg-black/25"
              >
                <div className="p-5 space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                  {stylistLogs.map((log, index) => (
                    <div key={index} className="border-b border-white/5 pb-3.5 last:border-0 last:pb-0 text-xs text-left">
                      <div className="flex justify-between items-center pb-1">
                        <span className="font-mono text-[10px] text-zinc-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                        <span className="font-mono text-amber-400 uppercase tracking-wider text-[8px] border border-amber-500/10 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          {log.action}
                        </span>
                      </div>
                      <strong className="block text-white mb-0.5 font-medium">{log.outfitName}</strong>
                      <p className="text-zinc-400 font-serif italic text-[11.5px]">"{log.reflection}"</p>
                    </div>
                  ))}

                  {stylistLogs.length === 0 && (
                    <div className="text-center py-8 space-y-2">
                      <Award className="w-8 h-8 text-zinc-700 mx-auto" />
                      <p className="text-xs font-serif italic text-zinc-500">
                        "Ask the LookVision floating AI advisor to coordinate outfits to register consultation history logs."
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LINE 7: SARTORIAL HISTORY LEDGER & MECHANICS (EXPLAINED & INTERACTIVE) */}
        <div className="border border-white/5 rounded-xl bg-[#07070c] overflow-hidden transition-all hover:border-emerald-500/15">
          <button 
            onClick={() => toggleSection('history_explained')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.01] transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white">Sartorial History Ledger & Mechanics</span>
                <span className="block text-[10px] text-zinc-400 font-mono truncate">
                  Understand how your actions save & build unified style timelines
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                Learn & Simulate
              </span>
              {activeSection === 'history_explained' ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeSection === 'history_explained' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-white/[0.03] bg-black/25"
              >
                <div className="p-5 space-y-5">
                  {/* Explanation Section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300">How is your profile history built?</h3>
                    <p className="text-[11.5px] text-zinc-400 leading-relaxed font-serif italic">
                      "LookVision operates on an offline-first decentralized sync engine. Every sartorial recommendation you confirm, size calibration you save, or showroom selection you reserve immediately appends to your permanent cryptographic style ledger."
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-indigo-400">
                          <Sparkles className="w-3.5 h-3.5" />
                          <h4 className="text-[10.5px] font-mono uppercase font-bold">1. AI Recommendation</h4>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">
                          Confirming style coordination feedback sets the <span className="text-white">WORN_CONFIRMED</span> event, updating your AI style vectors.
                        </p>
                      </div>

                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-amber-400">
                          <Ruler className="w-3.5 h-3.5" />
                          <h4 className="text-[10.5px] font-mono uppercase font-bold">2. Fit Modification</h4>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">
                          Modifying fine measurements on custom items logs a physical <span className="text-white">MODIFIED_FIT</span> baseline on-chain.
                        </p>
                      </div>

                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <h4 className="text-[10.5px] font-mono uppercase font-bold">3. Showroom Locks</h4>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">
                          Securing physical items or reserving boutique coordinates creates a permanent commerce transaction history.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Simulation Section */}
                  <div className="border-t border-white/5 pt-4 space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400">Live Simulation Sandbox</h3>
                    <p className="text-[10.5px] text-zinc-400">
                      Test and simulate real actions below to watch how they automatically construct and display in your timeline in real-time.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1.5">
                      <button
                        onClick={() => handleSimulateLog('WORN_CONFIRMED')}
                        className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/15 text-indigo-300 rounded-lg text-[9.5px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
                      >
                        [ Simulate Outfit Wear ]
                      </button>
                      <button
                        onClick={() => handleSimulateLog('MODIFIED_FIT')}
                        className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 text-amber-300 rounded-lg text-[9.5px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
                      >
                        [ Simulate Measurement Fit ]
                      </button>
                      <button
                        onClick={() => handleSimulateLog('RESERV_SECURED')}
                        className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 text-emerald-300 rounded-lg text-[9.5px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
                      >
                        [ Simulate Boutique Reservation ]
                      </button>
                      <button
                        onClick={() => handleSimulateLog('SKIPPED')}
                        className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 rounded-lg text-[9.5px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
                      >
                        [ Simulate Skip Action ]
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* DETAILED DIGITAL PASS QR MODAL OVERLAY */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#07070c] border border-white/10 rounded-2xl p-6 text-center space-y-5"
            >
              <div className="space-y-1">
                <h3 className="font-serif text-lg text-white">Sartorial Signature QR</h3>
                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Atelier storefront connectivity key</p>
              </div>

              {/* Centered QR block */}
              <div className="w-48 h-48 bg-white p-4 rounded-xl mx-auto flex items-center justify-center border border-white/10 relative">
                {/* Visual Simulation of premium QR code */}
                <div className="w-full h-full relative border-[3px] border-black/80 rounded p-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-10 h-10 border-4 border-black bg-transparent" />
                    <div className="w-10 h-10 border-4 border-black bg-transparent" />
                  </div>
                  <div className="flex-1 my-2 grid grid-cols-6 grid-rows-6 gap-1 opacity-90 p-1">
                    {Array.from({ length: 36 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`rounded-sm ${(idx * 7 + 13) % 5 === 0 || (idx * 3) % 4 === 0 ? 'bg-black' : 'bg-transparent'}`} 
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-10 h-10 border-4 border-black bg-transparent" />
                    <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-[8px] font-mono font-bold">LV</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-400">
                <p>Present this live dynamic key at custom partner storefronts to sync wardrobe parameters immediately.</p>
                <div className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 py-1.5 rounded border border-emerald-500/20 uppercase tracking-widest font-bold">
                  Workspace Connected
                </div>
              </div>

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-2.5 bg-white text-black font-mono text-xs uppercase tracking-widest hover:bg-zinc-200 rounded-xl font-bold cursor-pointer transition-all"
              >
                [ Dismiss Scan ]
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
