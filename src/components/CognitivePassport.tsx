import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Award, Key, Save, Check, RefreshCw, Sparkles, LogOut, ShieldAlert,
  Sliders, Trash2, Calendar, Edit2, Plus, Info, Ruler, BookOpen, Fingerprint,
  CreditCard, ExternalLink, QrCode, Sparkle, Tag, CheckSquare, Square, ChevronDown, ChevronUp, Mail,
  Clock, ShoppingBag, TrendingUp, Compass, Shield, Lock, Eye, EyeOff, Globe, Sparkles as SparklesIcon,
  Heart, AlertCircle, Search
} from 'lucide-react';
import { ProfileService, type StylistHistoryEntry, type StyleProfile } from '../platform';
import { LOOK_VISION_THEMES } from './AIStyleHub';

interface CognitivePassportProps {
  user?: any;
  onLogout?: () => void;
  currentTheme?: string;
  setCurrentTheme?: (theme: string) => void;
}

interface SartorialGoal {
  id: string;
  text: string;
  targetDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export const CognitivePassport: React.FC<CognitivePassportProps> = ({ user, onLogout, currentTheme, setCurrentTheme }) => {
  // Navigation Tabs for unified Profile Management & Style Passport
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'PASSPORT' | 'MEASUREMENTS' | 'GOALS' | 'HISTORY'>('IDENTITY');

  // --- TAB 1: IDENTITY & GENERAL PROFILE STATES ---
  const [profileName, setProfileName] = useState(() => localStorage.getItem('user_profile_name') || 'Sarah Khan');
  const [username, setUsername] = useState(() => localStorage.getItem('user_profile_username') || 'sarah_khan');
  const [email, setEmail] = useState(() => user?.email || 'sarah.khan@sartorial.io');
  const [bio, setBio] = useState(() => localStorage.getItem('user_profile_bio') || 'Avant-garde minimalist enthusiast. Exploring sustainable fabrics, architectural silhouettes, and smart tailoring.');
  const [location, setLocation] = useState(() => localStorage.getItem('user_profile_location') || 'Milan, Italy');
  const [language, setLanguage] = useState(() => localStorage.getItem('user_profile_language') || 'English (UK)');
  const [currency, setCurrency] = useState(() => localStorage.getItem('user_profile_currency') || 'EUR (€)');
  
  // Security Simulation States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => localStorage.getItem('user_security_2fa') === 'true');
  const [marketingOptIn, setMarketingOptIn] = useState(() => localStorage.getItem('user_privacy_marketing') !== 'false');

  // Theme Search & Tag filter states for Appearance and Active Theme Selection
  const [themeSearch, setThemeSearch] = useState('');
  const [selectedThemeTag, setSelectedThemeTag] = useState('all');

  // --- TAB 2: STYLE PASSPORT STATES ---
  const [dnaScores, setDnaScores] = useState({
    minimalist: 8,
    streetwear: 4,
    luxury: 9,
    experimental: 7
  });
  const [styleArchetype, setStyleArchetype] = useState('Luxury Minimalist Avant-Garde');
  const [favColorPalette, setFavColorPalette] = useState(() => localStorage.getItem('user_fav_palette') || 'Cosmic Slate & Charcoal');
  const [cardSkin, setCardSkin] = useState<'midnight' | 'gold' | 'emerald' | 'violet'>('midnight');
  const [showQRModal, setShowQRModal] = useState(false);

  // --- TAB 3: MEASUREMENTS STATES ---
  const [topSize, setTopSize] = useState<string>(() => localStorage.getItem('user_size_top') || 'M');
  const [bottomSize, setBottomSize] = useState<string>(() => localStorage.getItem('user_size_bottom') || '32');
  const [shoeSize, setShoeSize] = useState<string>(() => localStorage.getItem('user_size_shoe') || 'US 10');
  const [heightVal, setHeightVal] = useState<number>(() => Number(localStorage.getItem('user_meas_height') || '178'));
  const [chestVal, setChestVal] = useState<number>(() => Number(localStorage.getItem('user_meas_chest') || '40'));
  const [sleeveVal, setSleeveVal] = useState<number>(() => Number(localStorage.getItem('user_meas_sleeve') || '34'));
  const [waistVal, setWaistVal] = useState<number>(() => Number(localStorage.getItem('user_meas_waist') || '32'));
  const [inseamVal, setInseamVal] = useState<number>(() => Number(localStorage.getItem('user_meas_inseam') || '32'));
  const [bodyShape, setBodyShape] = useState(() => localStorage.getItem('user_meas_shape') || 'Athletic');

  // --- TAB 4: GOALS & PREFERENCES ---
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
  const [fabricExclusions, setFabricExclusions] = useState<string[]>(() => {
    const cached = localStorage.getItem('user_fabric_exclusions');
    return cached ? JSON.parse(cached) : ['Synthetic Polyester', 'Rough Wool'];
  });
  const [newFabricInput, setNewFabricInput] = useState('');

  // --- TAB 5: HISTORICAL ADVISOR LOGS ---
  const [stylistLogs, setStylistLogs] = useState<StylistHistoryEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Common UI Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load User Style Profile on mount / user change
  useEffect(() => {
    if (!user) return;
    setLoadingLogs(true);
    ProfileService.loadProfile(user.uid)
      .then(p => {
        if (p) {
          const vector = p.styleVector || [0.8, 0.4, 0.5, 0.9, 0.7, 0.5, 0.5, 0.5];
          setDnaScores({
            minimalist: Math.round((vector[0] || 0.8) * 10),
            streetwear: Math.round((vector[1] || 0.4) * 10),
            luxury: Math.round((vector[3] || 0.9) * 10),
            experimental: Math.round((vector[4] || 0.7) * 10)
          });
          const historyKey = `history_log_${user.uid}`;
          const cachedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
          setStylistLogs(cachedHistory);
        }
      })
      .catch(err => console.error("Error loading DNA metrics:", err))
      .finally(() => setLoadingLogs(false));
  }, [user]);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('sartorial_goals', JSON.stringify(goals));
  }, [goals]);

  // Save fabric exclusions
  useEffect(() => {
    localStorage.setItem('user_fabric_exclusions', JSON.stringify(fabricExclusions));
  }, [fabricExclusions]);

  // General profile persistence
  const handleSaveAllSettings = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    // Write metadata to local storage
    localStorage.setItem('user_profile_name', profileName);
    localStorage.setItem('user_profile_username', username);
    localStorage.setItem('user_profile_bio', bio);
    localStorage.setItem('user_profile_location', location);
    localStorage.setItem('user_profile_language', language);
    localStorage.setItem('user_profile_currency', currency);
    localStorage.setItem('user_security_2fa', twoFactorEnabled.toString());
    localStorage.setItem('user_privacy_marketing', marketingOptIn.toString());
    localStorage.setItem('user_fav_palette', favColorPalette);

    // Save sizes
    localStorage.setItem('user_size_top', topSize);
    localStorage.setItem('user_size_bottom', bottomSize);
    localStorage.setItem('user_size_shoe', shoeSize);
    localStorage.setItem('user_meas_height', heightVal.toString());
    localStorage.setItem('user_meas_chest', chestVal.toString());
    localStorage.setItem('user_meas_sleeve', sleeveVal.toString());
    localStorage.setItem('user_meas_waist', waistVal.toString());
    localStorage.setItem('user_meas_inseam', inseamVal.toString());
    localStorage.setItem('user_meas_shape', bodyShape);

    // Call ProfileService database integration
    if (user) {
      try {
        const currentProfile = await ProfileService.loadProfile(user.uid);
        const updatedVector = [...(currentProfile.styleVector || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5])];
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
      setIsSaving(false);
      setSavedSuccess(true);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '✨ Profile, Security & Style Passport DNA variables successfully calibrated!'
      }));
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 800);
  };

  // Add goal handler
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
      detail: '📌 Sartorial goal successfully added to ledger!'
    }));
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  // Fabric Exclusions helpers
  const handleAddFabricExclusion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFabricInput.trim()) return;
    if (!fabricExclusions.includes(newFabricInput.trim())) {
      setFabricExclusions([...fabricExclusions, newFabricInput.trim()]);
    }
    setNewFabricInput('');
  };

  const handleRemoveFabricExclusion = (fabric: string) => {
    setFabricExclusions(fabricExclusions.filter(f => f !== fabric));
  };

  // Log simulation to demonstrate history tracking
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
      reflection = "Secured real-time showcase inventory reservation with Milan partner showroom.";
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

    const historyKey = `history_log_${user.uid}`;
    try {
      const currentVal = JSON.parse(localStorage.getItem(historyKey) || '[]');
      currentVal.unshift(newLog);
      localStorage.setItem(historyKey, JSON.stringify(currentVal.slice(0, 100)));
      setStylistLogs([newLog, ...stylistLogs]);
      
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

  // Card Skins Style Mapper
  const getCardSkinClass = () => {
    switch (cardSkin) {
      case 'gold':
        return 'from-[#1e1502] via-[#2f2003] to-[#120c01] border-amber-500/30 text-amber-100';
      case 'emerald':
        return 'from-[#031d10] via-[#052c18] to-[#010c06] border-emerald-500/30 text-emerald-100';
      case 'violet':
        return 'from-[#14022a] via-[#200344] to-[#090114] border-violet-500/30 text-violet-100';
      case 'midnight':
      default:
        return 'from-[#090911] via-[#121222] to-[#040408] border-white/10 text-zinc-100';
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in text-white py-2 max-w-5xl mx-auto text-left">
      
      {/* 1. COMPACT MASTER HEADER & USER PREVIEW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5 bg-gradient-to-r from-white/[0.01] to-transparent p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
              alt="Profile Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-violet-500/30 group-hover:border-violet-500/60 duration-300 transition-all shadow-xl"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 transition-opacity cursor-pointer">
              <span className="text-[9px] font-mono uppercase text-white tracking-widest">Edit</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-light tracking-tight text-2xl text-white">{profileName}</h2>
              <span className="text-[9px] font-mono bg-violet-600/10 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                Premium
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">@{username} &bull; {location}</p>
            <p className="text-[10px] text-zinc-500 font-sans mt-1 max-w-md line-clamp-1 italic">
              "{bio}"
            </p>
          </div>
        </div>

        {/* Unified Save & Action buttons */}
        <div className="flex gap-2.5 self-end md:self-auto">
          <button
            onClick={handleSaveAllSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 disabled:brightness-75 transition-all text-white font-bold cursor-pointer shadow-lg shadow-emerald-500/10 border border-emerald-400/20"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Calibrating...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Calibrated</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Passport Changes</span>
              </>
            )}
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider border border-white/10 hover:border-red-500/40 hover:bg-red-500/5 px-4 py-2.5 transition-all cursor-pointer text-zinc-400 hover:text-red-400 rounded-xl"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2. TAB SEGMENT NAVIGATION */}
      <div className="flex bg-[#07070c] border border-white/5 p-1 rounded-2xl shadow-inner overflow-x-auto gap-1">
        {[
          { id: 'IDENTITY', label: 'Profile & Account', icon: User },
          { id: 'PASSPORT', label: 'Style Passport DNA', icon: Fingerprint },
          { id: 'MEASUREMENTS', label: 'Measurements & Sizes', icon: Ruler },
          { id: 'GOALS', label: 'Sartorial Preferences', icon: Award },
          { id: 'HISTORY', label: 'Stylist Logs & Audit', icon: Clock },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shrink-0 whitespace-nowrap ${
                isSelected 
                  ? 'bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/25 text-violet-300 font-semibold' 
                  : 'bg-transparent border border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-violet-400' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. DYNAMIC CONTENT VIEWER */}
      <div className="bg-[#07070c]/50 border border-white/5 rounded-3xl p-6 md:p-8 min-h-[450px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: IDENTITY & PROFILE ACCOUNT */}
          {activeTab === 'IDENTITY' && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-sm font-mono text-violet-400 uppercase tracking-wider">Atelier Identity & Accounts</h3>
                <p className="text-xs text-zinc-500 mt-1">Configure your public styling persona, locale preferences, and secure ledger parameters.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Profile form settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-widest border-b border-white/5 pb-2">Profile Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Full Name</label>
                      <input 
                        type="text" 
                        value={profileName} 
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-[#11111a] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Username</label>
                      <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#11111a] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input 
                        type="email" 
                        value={email} 
                        disabled
                        className="w-full bg-[#11111a]/50 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-xs text-zinc-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Bio & Fashion Manifesto</label>
                    <textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full bg-[#11111a] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Styling City Locale</label>
                      <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-[#11111a] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Sartorial Currency</label>
                      <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-[#11111a] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
                      >
                        <option value="EUR (€)">EUR (€)</option>
                        <option value="USD ($)">USD ($)</option>
                        <option value="GBP (£)">GBP (£)</option>
                        <option value="JPY (¥)">JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Security Simulator */}
                <div className="space-y-5">
                  <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-widest border-b border-white/5 pb-2">Account & Security Settings</h4>
                  
                  <div className="bg-[#11111a] border border-white/5 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-zinc-200 block">Two-Factor Authentication</span>
                        <p className="text-[10px] text-zinc-500 leading-normal">Requires high-entropy physical token for showroom catalog locks.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTwoFactorEnabled(!twoFactorEnabled);
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                            detail: !twoFactorEnabled ? '🔐 2FA Security layer enabled!' : '🔓 2FA Security layer disabled.'
                          }));
                        }}
                        className={`w-10 h-6 rounded-full p-1 transition-all ${
                          twoFactorEnabled ? 'bg-violet-600' : 'bg-zinc-800'
                        } flex items-center`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                          twoFactorEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-zinc-200 block">Personalised Marketing & Sync</span>
                        <p className="text-[10px] text-zinc-500 leading-normal">Synchronise style vectors with international high-fashion partners.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMarketingOptIn(!marketingOptIn);
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                            detail: !marketingOptIn ? '🌍 Ecosystem synchronization opted in!' : '🔒 Ecosystem sync set to private mode.'
                          }));
                        }}
                        className={`w-10 h-6 rounded-full p-1 transition-all ${
                          marketingOptIn ? 'bg-violet-600' : 'bg-zinc-800'
                        } flex items-center`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                          marketingOptIn ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Appearance & Active Theme Selection (UX-Studied Placement) */}
                  {currentTheme && setCurrentTheme && (() => {
                    const themeDetails: Record<string, { description: string, tags: string[] }> = {
                      'classic-noir': {
                        description: 'Sleek monochrome dark skin designed for timeless minimalism.',
                        tags: ['dark', 'noir', 'minimalist', 'monochrome', 'clean']
                      },
                      'cyber-couture': {
                        description: 'Neon-infused futuristic vibe with glowing fuchsia and violet accents.',
                        tags: ['dark', 'cyber', 'futuristic', 'purple', 'glow', 'high-tech']
                      },
                      'nordic-editorial': {
                        description: 'Cozy warm-stone palette with elegant amber and comfortable earthy styling.',
                        tags: ['dark', 'warm', 'editorial', 'stone', 'beige', 'cozy']
                      },
                      'cosmic-dream': {
                        description: 'Deep starlight indigo slate designed with premium astral gradients.',
                        tags: ['dark', 'cosmic', 'indigo', 'stellar', 'purple', 'dreamy']
                      },
                      'solar-day': {
                        description: 'High-clarity light mode crafted in bright, off-white solar stone.',
                        tags: ['light', 'solar', 'white', 'bright', 'clean', 'day']
                      }
                    };

                    // Filter theme list based on search and selected tag
                    const filteredThemes = LOOK_VISION_THEMES.filter(theme => {
                      const details = themeDetails[theme.id] || { description: '', tags: [] };
                      const matchesSearch = theme.name.toLowerCase().includes(themeSearch.toLowerCase()) ||
                                            theme.id.toLowerCase().includes(themeSearch.toLowerCase()) ||
                                            details.description.toLowerCase().includes(themeSearch.toLowerCase()) ||
                                            details.tags.some(t => t.toLowerCase().includes(themeSearch.toLowerCase()));
                      const matchesTag = selectedThemeTag === 'all' || details.tags.includes(selectedThemeTag);
                      return matchesSearch && matchesTag;
                    });

                    const allTags = ['all', 'dark', 'light', 'minimalist', 'futuristic', 'warm', 'cosmic'];

                    const triggerRandomTheme = () => {
                      const randomIndex = Math.floor(Math.random() * LOOK_VISION_THEMES.length);
                      const selected = LOOK_VISION_THEMES[randomIndex];
                      setCurrentTheme(selected.id);
                      localStorage.setItem('look_vision_theme', selected.id);
                      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Surprise! 🔮 Aesthetic Alignment: ${selected.name}` }));
                    };

                    return (
                      <div className="bg-[#11111a] border border-white/5 rounded-2xl p-4 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest block">
                            Appearance & Workspace Themes
                          </span>
                          <button
                            type="button"
                            onClick={triggerRandomTheme}
                            className="text-[9px] font-mono flex items-center gap-1 text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-2 py-1 rounded-md transition-all cursor-pointer"
                            title="Surprise me with a random theme!"
                          >
                            <Sparkle className="w-2.5 h-2.5" />
                            Surprise Me
                          </button>
                        </div>

                        <p className="text-[10px] text-zinc-500 leading-normal">
                          Personalize your system workspace's handling mode with our responsive theme engine. Find a skin matching your present mood:
                        </p>

                        {/* Search and filter engine bar */}
                        <div className="space-y-2">
                          <div className="relative flex items-center">
                            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 pointer-events-none" />
                            <input
                              type="text"
                              value={themeSearch}
                              onChange={(e) => setThemeSearch(e.target.value)}
                              placeholder="Search themes, tags, vibes (e.g., 'warm', 'cyber')..."
                              className="bg-black/40 border border-white/5 rounded-xl pl-9 pr-8 py-2 text-[11px] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/30 w-full transition-all"
                            />
                            {themeSearch && (
                              <button
                                type="button"
                                onClick={() => setThemeSearch('')}
                                className="absolute right-2.5 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer p-1"
                              >
                                &times;
                              </button>
                            )}
                          </div>

                          {/* Quick selection tag pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {allTags.map(tag => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setSelectedThemeTag(tag)}
                                className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase transition-all cursor-pointer ${
                                  selectedThemeTag === tag
                                    ? 'bg-violet-600 text-white border-violet-500'
                                    : 'bg-black/30 text-zinc-500 border border-white/5 hover:border-white/10 hover:text-zinc-400'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Themes display grid */}
                        {filteredThemes.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                            {filteredThemes.map((theme) => {
                              const isSelected = currentTheme === theme.id;
                              const details = themeDetails[theme.id] || { description: '', tags: [] };
                              
                              // Pre-compute visual swatch colors
                              const swatches: Record<string, { bg: string, accent: string }> = {
                                'classic-noir': { bg: 'bg-zinc-950', accent: 'bg-white' },
                                'cyber-couture': { bg: 'bg-[#03020c]', accent: 'bg-fuchsia-500' },
                                'nordic-editorial': { bg: 'bg-[#0d0c0b]', accent: 'bg-amber-400' },
                                'cosmic-dream': { bg: 'bg-[#05050a]', accent: 'bg-indigo-500' },
                                'solar-day': { bg: 'bg-[#fcfbf9]', accent: 'bg-stone-900' },
                              };
                              const swatch = swatches[theme.id] || { bg: 'bg-zinc-950', accent: 'bg-zinc-400' };

                              return (
                                <button
                                  key={theme.id}
                                  type="button"
                                  onClick={() => {
                                    setCurrentTheme(theme.id);
                                    localStorage.setItem('look_vision_theme', theme.id);
                                    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Theme switched to: ${theme.name}` }));
                                  }}
                                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2.5 cursor-pointer text-zinc-100 ${
                                    isSelected 
                                      ? 'bg-white/5 border-violet-500/50 shadow-md' 
                                      : 'bg-black/40 border-white/5 hover:border-white/10'
                                  }`}
                                >
                                  <div className="flex justify-between items-start w-full">
                                    <div>
                                      <span className="block text-xs font-semibold text-zinc-200">{theme.name}</span>
                                      <span className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5 block leading-none">
                                        {theme.id.replace('-', ' ')}
                                      </span>
                                    </div>
                                    <div className="flex gap-1">
                                      <span className={`w-3 h-3 rounded-full border border-white/10 ${swatch.bg}`} />
                                      <span className={`w-3 h-3 rounded-full border border-white/10 ${swatch.accent}`} />
                                    </div>
                                  </div>

                                  {/* Short Description */}
                                  <p className="text-[10px] text-zinc-400 font-sans leading-snug">
                                    {details.description}
                                  </p>

                                  {/* Clickable individual hashtags */}
                                  <div className="flex flex-wrap gap-1">
                                    {details.tags.map(t => (
                                      <span
                                        key={t}
                                        onClick={(e) => {
                                          e.stopPropagation(); // prevent theme selection on tag click
                                          setSelectedThemeTag(t);
                                        }}
                                        className={`text-[8px] font-mono px-1 rounded hover:text-white transition-colors ${
                                          selectedThemeTag === t
                                            ? 'text-violet-400 bg-violet-500/10'
                                            : 'text-zinc-600 bg-zinc-900/40 hover:bg-zinc-900/80'
                                        }`}
                                      >
                                        #{t}
                                      </span>
                                    ))}
                                  </div>

                                  {isSelected && (
                                    <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 bg-black/20 border border-dashed border-white/5 rounded-xl text-center space-y-1">
                            <p className="text-[11px] text-zinc-400 font-medium">No matching themes found</p>
                            <p className="text-[9px] text-zinc-600">
                              Try resetting filters or searching for "dark", "light", or "minimalist".
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setThemeSearch('');
                                setSelectedThemeTag('all');
                              }}
                              className="text-[9px] font-mono text-violet-400 hover:underline pt-1 block mx-auto cursor-pointer"
                            >
                              Reset Theme Search
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Password Simulator Form */}
                  <div className="bg-[#11111a] border border-white/5 rounded-2xl p-4 space-y-3.5">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Credential Ledger Encryption</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40"
                        />
                      </div>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="New password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>Toggle Visibility</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!currentPassword || !newPassword) {
                            window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                              detail: '⚠️ Fill both current and new password credentials!'
                            }));
                            return;
                          }
                          setCurrentPassword('');
                          setNewPassword('');
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                            detail: '🔒 Dynamic credential password hash rotated successfully!'
                          }));
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-300 font-mono text-[10px] uppercase hover:bg-violet-600/20 transition-all cursor-pointer font-semibold"
                      >
                        Rotate Credentials
                      </button>
                    </div>
                  </div>

                  <div className="bg-red-950/15 border border-red-500/10 rounded-2xl p-4 flex gap-3 items-start">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Zone of Irreversibility</span>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Once logged out or reset, cached temporary look profiles and 3D solvers will be flushed from browser local buffers.</p>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: STYLE PASSPORT DNA */}
          {activeTab === 'PASSPORT' && (
            <motion.div
              key="passport"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-sm font-mono text-violet-400 uppercase tracking-wider">Style Passport & Aesthetic DNA</h3>
                <p className="text-xs text-zinc-500 mt-1">Configure style archetypes, active DNA preference vectors, and generate your physical NFC passport.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left 7 columns: DNA tuners and Color palette */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Archetype selector & Fav Palette */}
                  <div className="bg-[#11111a] border border-white/5 rounded-2xl p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Active Style Archetype</label>
                        <select 
                          value={styleArchetype}
                          onChange={(e) => setStyleArchetype(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-zinc-100 cursor-pointer"
                        >
                          <option value="Luxury Minimalist Avant-Garde">Luxury Minimalist Avant-Garde</option>
                          <option value="Subcultural Cyber-Streetwear">Subcultural Cyber-Streetwear</option>
                          <option value="Quiet Luxury Classic Tailoring">Quiet Luxury Classic Tailoring</option>
                          <option value="Deconstructed High-Fashion Atelier">Deconstructed High-Fashion Atelier</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Color Temperature Palette</label>
                        <input 
                          type="text" 
                          value={favColorPalette} 
                          onChange={(e) => setFavColorPalette(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* DNA Preference Sliders */}
                  <div className="bg-[#11111a] border border-white/5 rounded-2xl p-5 space-y-5">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">8D Sartorial DNA Vector</span>
                    
                    <div className="space-y-4">
                      {/* Minimalist */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-300">
                          <span>MINIMALIST ACCENT</span>
                          <span className="font-bold text-white">{dnaScores.minimalist * 10}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={dnaScores.minimalist} 
                          onChange={(e) => setDnaScores({ ...dnaScores, minimalist: Number(e.target.value) })}
                          className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Streetwear */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-300">
                          <span>STREETWEAR SILHOUETTES</span>
                          <span className="font-bold text-white">{dnaScores.streetwear * 10}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={dnaScores.streetwear} 
                          onChange={(e) => setDnaScores({ ...dnaScores, streetwear: Number(e.target.value) })}
                          className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Luxury */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-300">
                          <span>LUXURY HERITAGE TEXTURES</span>
                          <span className="font-bold text-white">{dnaScores.luxury * 10}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={dnaScores.luxury} 
                          onChange={(e) => setDnaScores({ ...dnaScores, luxury: Number(e.target.value) })}
                          className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Experimental */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-300">
                          <span>EXPERIMENTAL AVANT-GARDE</span>
                          <span className="font-bold text-white">{dnaScores.experimental * 10}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={dnaScores.experimental} 
                          onChange={(e) => setDnaScores({ ...dnaScores, experimental: Number(e.target.value) })}
                          className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right 5 columns: Stylized passport physical card preview */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* PASS CARD */}
                  <div className={`bg-gradient-to-br ${getCardSkinClass()} border p-5 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl transition-all duration-500`}>
                    
                    {/* Watermark circle */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full border border-white/5 opacity-10 pointer-events-none" />

                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5 text-left">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                          SARTORIAL MEMBER
                        </span>
                        <h4 className="text-sm font-serif font-semibold text-white tracking-tight">Style Passport DNA</h4>
                      </div>
                      <Fingerprint className="w-8 h-8 text-violet-400" />
                    </div>

                    <div className="space-y-4 text-left">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Aesthetic DNA Hash</span>
                        <span className="text-xs font-mono text-white tracking-widest block font-bold">
                          LV-{dnaScores.minimalist}{dnaScores.streetwear}{dnaScores.luxury}{dnaScores.experimental}-SK99
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Archetype</span>
                          <span className="text-[10px] font-sans text-zinc-300 font-medium block truncate">{styleArchetype}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Palette Temp</span>
                          <span className="text-[10px] font-sans text-zinc-300 font-medium block truncate">{favColorPalette}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                      <div>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block leading-none">Security Clearance</span>
                        <span className="text-[9px] font-mono text-emerald-400 tracking-wider block font-bold uppercase mt-1">Verified Client</span>
                      </div>

                      <button
                        onClick={() => setShowQRModal(true)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 text-white transition-all cursor-pointer"
                      >
                        <QrCode className="w-4 h-4 text-violet-400" />
                      </button>
                    </div>

                  </div>

                  {/* Card skin controllers */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Passport Theme Skin</span>
                    <div className="flex gap-2">
                      {[
                        { id: 'midnight', label: 'Slate', color: 'bg-zinc-800 border-white/20' },
                        { id: 'gold', label: 'Gold', color: 'bg-amber-800/80 border-amber-500/20' },
                        { id: 'emerald', label: 'Emerald', color: 'bg-emerald-800/80 border-emerald-500/20' },
                        { id: 'violet', label: 'Violet', color: 'bg-violet-800/80 border-violet-500/20' }
                      ].map(skin => (
                        <button
                          key={skin.id}
                          onClick={() => setCardSkin(skin.id as any)}
                          className={`px-3 py-1.5 rounded-full border text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                            cardSkin === skin.id 
                              ? 'bg-white/10 border-violet-500 text-white font-bold' 
                              : 'bg-transparent border-white/5 text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${skin.color}`} />
                          <span>{skin.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* QR Modal Overlay */}
              {showQRModal && (
                <div 
                  className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in"
                  onClick={() => setShowQRModal(false)}
                >
                  <div 
                    className="bg-[#090911] border border-white/10 rounded-3xl p-6 text-center max-w-sm space-y-4 relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto shadow-2xl flex items-center justify-center">
                      <QrCode className="w-full h-full text-black stroke-[1]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white font-serif">Physical NFC Passport QR</h4>
                      <p className="text-[10px] text-zinc-400 mt-1 max-w-xs leading-normal">
                        Scan this QR code at high-fashion physical store terminals to instant-sync measurements and customized AI style vectors with fitting rooms.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowQRModal(false)}
                      className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-mono uppercase font-bold cursor-pointer transition-colors"
                    >
                      Close QR
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* TAB 3: MEASUREMENTS & TAILORING */}
          {activeTab === 'MEASUREMENTS' && (
            <motion.div
              key="measurements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-sm font-mono text-violet-400 uppercase tracking-wider">Tailoring & Sizing Ledger</h3>
                <p className="text-xs text-zinc-500 mt-1">Calibrate precise body parameters and sizing drapes to ensure perfect fits in physical or generative ateliers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Sizing categories */}
                <div className="space-y-6">
                  
                  {/* Alpha sizing */}
                  <div className="bg-[#11111a] border border-white/5 rounded-2xl p-5 space-y-4">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">1. Alpha Outfit Sizes</span>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Top Size</label>
                        <select 
                          value={topSize}
                          onChange={(e) => setTopSize(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-100 cursor-pointer"
                        >
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Bottom Waist</label>
                        <select 
                          value={bottomSize}
                          onChange={(e) => setBottomSize(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-100 cursor-pointer"
                        >
                          {['28', '30', '32', '34', '36', '38', '40'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Footwear US</label>
                        <select 
                          value={shoeSize}
                          onChange={(e) => setShoeSize(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-100 cursor-pointer"
                        >
                          {['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12', 'US 13'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Height & Body Shape parameters */}
                  <div className="bg-[#11111a] border border-white/5 rounded-2xl p-5 space-y-4">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">2. Physical Dimensions</span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Height (cm)</label>
                        <input 
                          type="number" 
                          value={heightVal}
                          onChange={(e) => setHeightVal(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-violet-500/40"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Body Type Shape</label>
                        <select 
                          value={bodyShape}
                          onChange={(e) => setBodyShape(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-100 cursor-pointer"
                        >
                          {['Athletic', 'Slim', 'Regular', 'Boxy', 'Broad'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Sizing Detail Sliders */}
                <div className="space-y-6">
                  <div className="bg-[#11111a] border border-white/5 rounded-2xl p-5 space-y-4">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">3. Detailed Body Measurement Inches</span>
                    
                    <div className="space-y-4 text-left">
                      
                      {/* Chest */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-zinc-400">Chest Circumference</span>
                          <span className="text-violet-400 font-bold">{chestVal}" ({getChestFit(chestVal)})</span>
                        </div>
                        <input 
                          type="range" 
                          min="34" 
                          max="48" 
                          value={chestVal} 
                          onChange={(e) => setChestVal(Number(e.target.value))}
                          className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Sleeve */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-zinc-400">Sleeve Length</span>
                          <span className="text-violet-400 font-bold">{sleeveVal}" ({getSleeveFit(sleeveVal)})</span>
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

                      {/* Waist */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-zinc-400">Waist Parameter</span>
                          <span className="text-violet-400 font-bold">{waistVal}"</span>
                        </div>
                        <input 
                          type="range" 
                          min="28" 
                          max="44" 
                          value={waistVal} 
                          onChange={(e) => setWaistVal(Number(e.target.value))}
                          className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Inseam */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-zinc-400">Leg Inseam</span>
                          <span className="text-violet-400 font-bold">{inseamVal}"</span>
                        </div>
                        <input 
                          type="range" 
                          min="28" 
                          max="38" 
                          value={inseamVal} 
                          onChange={(e) => setInseamVal(Number(e.target.value))}
                          className="w-full accent-violet-500 bg-white/5 h-1 rounded-lg cursor-pointer"
                        />
                      </div>

                    </div>
                  </div>

                  <div className="bg-[#11111a]/40 border border-white/5 rounded-2xl p-4 flex gap-3 items-start text-left select-text">
                    <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider font-semibold">
                        Sartorial Solver Integration
                      </h5>
                      <p className="text-[10px] text-zinc-500 font-sans leading-relaxed mt-1">
                        Calibrated body parameters directly modify the active 3D parameter meshes in the Render Sandbox, keeping model dimensions aligned with your style DNA.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: GOALS & PREFERENCES */}
          {activeTab === 'GOALS' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-sm font-mono text-violet-400 uppercase tracking-wider">Aesthetic Goals & Preferences</h3>
                <p className="text-xs text-zinc-500 mt-1">Track upcoming style acquisitions, target materials, and material exclusion catalogs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                
                {/* Left col: Goals tracker */}
                <div className="space-y-5">
                  <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-widest border-b border-white/5 pb-2">Active Style Acquisitions</h4>
                  
                  {/* Goals List */}
                  <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                    {goals.length === 0 ? (
                      <div className="p-4 rounded-2xl border border-dashed border-white/5 bg-white/[0.01] text-center text-zinc-500 text-xs">
                        No active wardrobe goals logged.
                      </div>
                    ) : (
                      goals.map(g => (
                        <div 
                          key={g.id} 
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            g.completed 
                              ? 'bg-black/20 border-white/5 text-zinc-500' 
                              : 'bg-[#11111a] border-white/10 text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              onClick={() => toggleGoal(g.id)}
                              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                            >
                              {g.completed ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 text-zinc-600" />
                              )}
                            </button>
                            <div className="min-w-0 text-left">
                              <p className={`text-xs font-medium leading-tight truncate ${g.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                                {g.text}
                              </p>
                              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block mt-0.5">
                                Target: {g.targetDate} &bull; <span className={
                                  g.priority === 'High' ? 'text-red-400' : g.priority === 'Medium' ? 'text-amber-400' : 'text-blue-400'
                                }>{g.priority}</span>
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => deleteGoal(g.id)}
                            className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Goal Mini Form */}
                  <form onSubmit={handleAddGoal} className="bg-[#11111a] p-4 rounded-2xl border border-white/5 space-y-3">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Add Style Target</span>
                    
                    <input 
                      type="text" 
                      placeholder="e.g., Acquire tailored grey blazer"
                      value={newGoalText}
                      onChange={(e) => setNewGoalText(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase">Target Date</span>
                        <input 
                          type="date"
                          value={newGoalDate}
                          onChange={(e) => setNewGoalDate(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-1.5 text-[11px] text-zinc-200 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase">Priority</span>
                        <select
                          value={newGoalPriority}
                          onChange={(e) => setNewGoalPriority(e.target.value as any)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-2 py-1.5 text-[11px] text-zinc-200 cursor-pointer"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 border border-violet-500/20 rounded-xl font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Target Acquisition</span>
                    </button>
                  </form>
                </div>

                {/* Right col: Fabric/Material Preferences */}
                <div className="space-y-5">
                  <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-widest border-b border-white/5 pb-2">Material Exclusions Ledger</h4>
                  
                  <div className="bg-[#11111a] border border-white/5 rounded-2xl p-5 space-y-4">
                    <p className="text-[10px] text-zinc-400 leading-normal">
                      Excluding specific textiles prevents AI generation pipelines from recommending clothes with allergens or undesirable drape-weights.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {fabricExclusions.map(fab => (
                        <span 
                          key={fab} 
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-mono bg-red-950/20 border border-red-500/20 text-red-300"
                        >
                          <span>{fab}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveFabricExclusion(fab)}
                            className="text-red-400/60 hover:text-red-300 cursor-pointer text-xs"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>

                    <form onSubmit={handleAddFabricExclusion} className="flex gap-2 border-t border-white/5 pt-3">
                      <input 
                        type="text" 
                        placeholder="Ex: Polyamide..."
                        value={newFabricInput}
                        onChange={(e) => setNewFabricInput(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-mono uppercase font-bold cursor-pointer transition-all"
                      >
                        Add
                      </button>
                    </form>
                  </div>

                  <div className="bg-emerald-950/15 border border-emerald-500/10 rounded-2xl p-4 flex gap-3 items-start">
                    <Sparkle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Eco-Certifications Sync</span>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-normal">All future AI creations will prioritize GOTS organic cottons, certified ethical wool, and recycled performance materials automatically.</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 5: HISTORICAL LOGS */}
          {activeTab === 'HISTORY' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 text-left"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-sm font-mono text-violet-400 uppercase tracking-wider">Stylist History & System Audit Ledger</h3>
                  <p className="text-xs text-zinc-500 mt-1">Audit logs generated from interactive AI creations, drapes, and fit calibrations.</p>
                </div>

                {/* Simulation trigger console */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSimulateLog('WORN_CONFIRMED')}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/5 hover:border-violet-500/20 text-zinc-400 hover:text-zinc-200 text-[9px] font-mono uppercase cursor-pointer"
                  >
                    [Simulate Worn]
                  </button>
                  <button
                    onClick={() => handleSimulateLog('MODIFIED_FIT')}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/5 hover:border-violet-500/20 text-zinc-400 hover:text-zinc-200 text-[9px] font-mono uppercase cursor-pointer"
                  >
                    [Simulate Fit Adjust]
                  </button>
                  <button
                    onClick={() => handleSimulateLog('SYSTEM_CALIBRATED')}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/5 hover:border-violet-500/20 text-zinc-400 hover:text-zinc-200 text-[9px] font-mono uppercase cursor-pointer"
                  >
                    [Simulate Calibrate]
                  </button>
                </div>
              </div>

              {/* Logs output */}
              <div className="bg-[#11111a] border border-white/5 rounded-2xl p-5 space-y-4">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Live Style Audit Records</span>
                
                {loadingLogs ? (
                  <div className="py-12 flex justify-center items-center">
                    <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
                  </div>
                ) : stylistLogs.length === 0 ? (
                  <div className="py-12 text-center text-zinc-600 text-xs font-mono">
                    No styling actions logged. Try simulating an event above.
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2">
                    {stylistLogs.map(log => (
                      <div 
                        key={log.id} 
                        className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 relative overflow-hidden text-left"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono bg-violet-600/10 text-violet-300 border border-violet-500/10 px-2 py-0.5 rounded uppercase">
                              {log.action}
                            </span>
                            <h5 className="text-xs font-bold text-white mt-1.5">{log.outfitName}</h5>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-500">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{log.reflection}</p>

                        <div className="flex justify-between items-center pt-2 border-t border-white/[0.03]">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase">{log.moment}</span>
                          <span className="text-[9px] font-mono text-emerald-400 font-bold">Suitability Score: {log.suitabilityScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
