import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, Award, Key, Save, Check, RefreshCw, Sparkles, LogOut, ShieldAlert
} from 'lucide-react';
import { ProfileService, StylistHistoryEntry } from '../features/wardrobe/profileService';

interface CognitivePassportProps {
  user?: any;
  onLogout?: () => void;
}

export const CognitivePassport: React.FC<CognitivePassportProps> = ({ user, onLogout }) => {
  // Sizing Profile States
  const [topSize, setTopSize] = useState<string>(() => localStorage.getItem('user_size_top') || 'M');
  const [bottomSize, setBottomSize] = useState<string>(() => localStorage.getItem('user_size_bottom') || '32');
  const [shoeSize, setShoeSize] = useState<string>(() => localStorage.getItem('user_size_shoe') || 'US 10');
  const [isSavingSize, setIsSavingSize] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Stylist History Logs
  const [stylistLogs, setStylistLogs] = useState<StylistHistoryEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Sartorial DNA Preference Scores
  const [dnaScores, setDnaScores] = useState({
    minimalist: 5,
    streetwear: 5,
    luxury: 5,
    experimental: 5
  });

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

  const handleSaveSizes = () => {
    setIsSavingSize(true);
    setSavedSuccess(false);
    
    setTimeout(() => {
      localStorage.setItem('user_size_top', topSize);
      localStorage.setItem('user_size_bottom', bottomSize);
      localStorage.setItem('user_size_shoe', shoeSize);
      setIsSavingSize(false);
      setSavedSuccess(true);
      
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 800);
  };

  return (
    <div className="space-y-8 select-none animate-fade-in text-white py-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
            Sartorial Identity Passport
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-3xl text-white mt-1">
            Cognitive Style Passport
          </h2>
          <p className="text-xs text-white/40 font-serif italic mt-1">
            "Your taste passport mapping size metrics, stylistic DNA, and advisor logs."
          </p>
        </div>

        {/* sign out button */}
        <button
          onClick={onLogout}
          className="text-[10px] font-mono uppercase tracking-[0.15em] border border-white/10 hover:border-white px-5 py-2.5 transition-all hover:bg-white/5 cursor-pointer text-white/70 hover:text-white rounded-xl"
        >
          [ Sign Out ]
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* LEFT COLUMN: IDENTIFICATION & SIZES CARDS (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* USER CARD PASSPORT */}
          <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block leading-none mb-1">Holder Passport</span>
                <strong className="text-base font-serif font-light text-white block">
                  {user?.displayName || user?.email?.split('@')[0] || 'Sartorialist Partner'}
                </strong>
                <span className="text-[9px] font-mono text-white/50">{user?.email || 'Temporary Guest'}</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-white/30 uppercase tracking-wider">Presence Tier</span>
                <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  {user?.isAnonymous ? 'TEMP VISITOR' : 'ARCHIVE PARTNER'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-white/30 uppercase tracking-wider">Secure UID</span>
                <span className="text-white/40 font-light text-[9px]">{user?.uid?.slice(0, 14)}...</span>
              </div>
            </div>
          </div>

          {/* EDITABLE SIZES CARD */}
          <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block font-light">
                Physical Size Card
              </span>
              <span className="text-[9px] font-mono text-neutral-400">
                Measurement parameters
              </span>
            </div>

            <div className="space-y-4">
              {/* Tops Sizes Selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">Tops / Coat size</label>
                <div className="grid grid-cols-6 gap-1">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setTopSize(sz)}
                      className={`py-1.5 text-[9px] font-mono uppercase rounded-lg border transition-all cursor-pointer ${
                        topSize === sz 
                          ? 'bg-white text-black font-semibold border-white' 
                          : 'bg-transparent border-white/5 hover:border-white/20 text-white/50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottoms Sizes Selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">Bottoms / Waist width</label>
                <div className="grid grid-cols-6 gap-1">
                  {['28', '30', '32', '34', '36', '38'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setBottomSize(sz)}
                      className={`py-1.5 text-[9px] font-mono uppercase rounded-lg border transition-all cursor-pointer ${
                        bottomSize === sz 
                          ? 'bg-white text-black font-semibold border-white' 
                          : 'bg-transparent border-white/5 hover:border-white/20 text-white/50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footwear selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">Footwear sizing</label>
                <div className="grid grid-cols-6 gap-1">
                  {['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setShoeSize(sz)}
                      className={`py-1.5 text-[9px] font-mono uppercase rounded-lg border transition-all cursor-pointer ${
                        shoeSize === sz 
                          ? 'bg-white text-black font-semibold border-white' 
                          : 'bg-transparent border-white/5 hover:border-white/20 text-white/50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveSizes}
                disabled={isSavingSize}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-mono text-[9px] uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSavingSize ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved successfully</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Sizes to Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SARTORIAL DNA SCORER & ADVISOR LOGS (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* COGNITIVE DNA PROGRESS BARS */}
          <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block font-light">
              Stylistic DNA Indices
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Minimalist */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-white/60">
                  <span>MINIMALIST TONE</span>
                  <span>{dnaScores.minimalist * 10}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full" style={{ width: `${dnaScores.minimalist * 10}%` }} />
                </div>
              </div>

              {/* Streetwear */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-white/60">
                  <span>STREETWEAR ACCENT</span>
                  <span>{dnaScores.streetwear * 10}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${dnaScores.streetwear * 10}%` }} />
                </div>
              </div>

              {/* Luxury */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-white/60">
                  <span>LUXURY CLASS</span>
                  <span>{dnaScores.luxury * 10}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${dnaScores.luxury * 10}%` }} />
                </div>
              </div>

              {/* Experimental */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-white/60">
                  <span>AVANT-GARDE FOCUS</span>
                  <span>{dnaScores.experimental * 10}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${dnaScores.experimental * 10}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* HISTORICAL STYLIST LOGS */}
          <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-5">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block font-light">
              Stylist consulting Logs
            </span>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
              {stylistLogs.map((log) => (
                <div key={log.timestamp} className="border-b border-white/5 pb-4 last:border-0 last:pb-0 text-xs">
                  <div className="flex justify-between items-center pb-1">
                    <span className="font-mono text-white/40">{new Date(log.timestamp).toLocaleDateString()}</span>
                    <span className="font-mono text-amber-400 uppercase tracking-wider text-[8px] border border-amber-500/10 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {log.action}
                    </span>
                  </div>
                  <strong className="block text-white mb-0.5 font-medium">{log.outfitName}</strong>
                  <p className="text-white/60 font-serif italic">"{log.reflection}"</p>
                </div>
              ))}

              {stylistLogs.length === 0 && (
                <div className="text-center py-10 space-y-3">
                  <Award className="w-8 h-8 text-white/20 mx-auto animate-pulse" />
                  <p className="text-xs font-serif italic text-white/30">
                    "Consulting logs are blank. Ask the floating AI stylist to compile outfits to register advice logs."
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
