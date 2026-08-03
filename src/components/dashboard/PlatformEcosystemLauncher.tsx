import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Shirt, Video, Music, Box, Gamepad2, Home, Scissors, 
  ArrowUpRight, Upload, Sparkle, UserCheck, Play, Lock, Compass, ShoppingBag
} from 'lucide-react';
import { db, auth } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface PlatformEcosystemLauncherProps {
  user: any;
  setActiveSubTab?: (tab: any) => void;
}

export const PlatformEcosystemLauncher: React.FC<PlatformEcosystemLauncherProps> = ({
  user,
  setActiveSubTab
}) => {
  const [userRole, setUserRole] = useState<'user' | 'seller'>('user');

  // Sync user role securely
  useEffect(() => {
    if (!user || user.isAnonymous || user.uid.startsWith('guest-')) {
      setUserRole('user');
      return;
    }
    const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserRole(docSnap.data().role || 'user');
      } else {
        setUserRole('user');
      }
    }, () => {
      setUserRole('user');
    });
    return () => unsub();
  }, [user]);

  const handleNavigate = (tab: string) => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
  };

  const handleOpenSellerDashboard = () => {
    window.dispatchEvent(new CustomEvent('lookvision_open_seller_dashboard'));
  };

  const ecosystems = [
    {
      id: 'aria-intelligence',
      name: 'ARIA Intelligence Layer',
      description: 'Personal Fashion Intelligence, Style DNA, Wardrobe Synergy & Theme Adaptation.',
      icon: Sparkles,
      status: 'active',
      badge: 'v2.4 Live',
      actionLabel: 'Launch ARIA',
      targetTab: 'AI_ASSISTANT',
      color: 'from-indigo-500/20 to-violet-500/10 border-indigo-500/30 text-indigo-400'
    },
    {
      id: 'fashion-ai',
      name: 'Fashion AI Studio',
      description: 'Identity-based generative fashion, Virtual Try-on, and custom photoshoots.',
      icon: Shirt,
      status: 'active',
      badge: 'Active Now',
      actionLabel: 'Enter Studio',
      targetTab: 'ECOSYSTEM_GENERATE',
      color: 'from-violet-500/20 to-indigo-500/10 border-violet-500/30 text-violet-400'
    },
    {
      id: 'creative-ai',
      name: 'Creative AI Ecosystem',
      description: 'Concept art, anime styles, futuristic fantasy avatars, and creature designs.',
      icon: Sparkles,
      status: 'active',
      badge: 'Active Now',
      actionLabel: 'Launch Engine',
      targetTab: 'ECOSYSTEM_CREATE',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400'
    },
    {
      id: 'ai-video',
      name: 'AI Video Studio',
      description: 'Generate hyper-realistic cinematic fashion runway videos and walking sequences.',
      icon: Video,
      status: 'coming-soon',
      badge: 'Coming Soon',
      actionLabel: 'Restricted',
      color: 'from-zinc-800/10 to-zinc-900/10 border-white/5 text-zinc-500'
    },
    {
      id: 'ai-music',
      name: 'AI Music Studio',
      description: 'Synthesize generative ambient soundscapes, background tracks, and runway beats.',
      icon: Music,
      status: 'coming-soon',
      badge: 'Coming Soon',
      actionLabel: 'Restricted',
      color: 'from-zinc-800/10 to-zinc-900/10 border-white/5 text-zinc-500'
    },
    {
      id: 'ai-3d',
      name: 'AI 3D Space & Engine',
      description: 'Solve spatial cloth drapes, interactive avatars, and spatial showrooms.',
      icon: Box,
      status: 'coming-soon',
      badge: 'Coming Soon',
      actionLabel: 'Restricted',
      color: 'from-zinc-800/10 to-zinc-900/10 border-white/5 text-zinc-500'
    },
    {
      id: 'ai-game',
      name: 'AI Game Studio',
      description: 'Custom game asset generation, clothing meshes, and character wearables.',
      icon: Gamepad2,
      status: 'coming-soon',
      badge: 'Coming Soon',
      actionLabel: 'Restricted',
      color: 'from-zinc-800/10 to-zinc-900/10 border-white/5 text-zinc-500'
    },
    {
      id: 'ai-interior',
      name: 'AI Interior Studio',
      description: 'Synthesize generative architectural layouts, walk-in closets, and spatial showcases.',
      icon: Home,
      status: 'coming-soon',
      badge: 'Coming Soon',
      actionLabel: 'Restricted',
      color: 'from-zinc-800/10 to-zinc-900/10 border-white/5 text-zinc-500'
    },
    {
      id: 'tailor-picks',
      name: "Curator's Tailor Picks",
      description: 'Continuous editor picks, algorithmic trend boards, and digital collections.',
      icon: Scissors,
      status: 'coming-soon',
      badge: 'Coming Soon',
      actionLabel: 'Restricted',
      color: 'from-zinc-800/10 to-zinc-900/10 border-white/5 text-zinc-500'
    }
  ];

  return (
    <div className="w-full bg-[#05050c]/40 border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden select-none text-left">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkle className="w-4 h-4 text-violet-400 fill-violet-400/20" />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-violet-400 font-bold">
              LookVision Engine Core
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-tight">
            Platform Ecosystem Launcher
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-xl">
            Welcome to the unified gateway of LookVision intelligence. Seamlessly traverse specialized fashion studios, creative engines, and local marketplaces.
          </p>
        </div>

        {/* Quick Social Proof Stack */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop" className="w-7 h-7 rounded-full border border-black object-cover" alt="" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&auto=format&fit=crop" className="w-7 h-7 rounded-full border border-black object-cover" alt="" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop" className="w-7 h-7 rounded-full border border-black object-cover" alt="" referrerPolicy="no-referrer" />
          </div>
          <div className="text-[10px] font-mono leading-tight">
            <p className="font-semibold text-zinc-300">50,000+ creators</p>
            <p className="text-zinc-500">active in LookVision</p>
          </div>
        </div>
      </div>

      {/* Primary Gateway Action CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Community Action Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c0a21] to-[#040409] border border-violet-500/10 flex flex-col justify-between hover:border-violet-500/20 duration-300">
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase text-violet-400 tracking-wider">Identity-based fashion AI</span>
            <h3 className="text-base font-semibold text-white">Community</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Generate breathtaking portraits and virtual fits matching your unique identity directly into the social stream.
            </p>
          </div>
          <button
            onClick={() => handleNavigate('ECOSYSTEM_GENERATE')}
            className="mt-5 w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-[11px] font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 shadow-md shadow-violet-950/20"
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Generate Outfit</span>
          </button>
        </div>

        {/* AI Creations Action Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#120a1f] to-[#040409] border border-purple-500/10 flex flex-col justify-between hover:border-purple-500/20 duration-300">
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase text-purple-400 tracking-wider font-semibold">High concept digital art</span>
            <h3 className="text-base font-semibold text-white font-sans">AI Creations</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Create anime, pixel, fantasy, cinematic, sci-fi avatars, and clothing meshes using CLO3D / Unreal Engine simulations.
            </p>
          </div>
          <button
            onClick={() => handleNavigate('PRODUCT_AI_CREATIONS')}
            className="mt-5 w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-[11px] font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 shadow-md shadow-purple-950/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Concepts</span>
          </button>
        </div>

        {/* Commerce Action Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#07130f] to-[#040409] border border-emerald-500/10 flex flex-col justify-between hover:border-emerald-500/20 duration-300">
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase text-emerald-400 tracking-wider font-semibold">Sartorial commerce hub</span>
            <h3 className="text-base font-semibold text-white">Marketplace</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Acquire exclusive custom designs from physical local boutiques or use Virtual Try-On before purchase.
            </p>
          </div>
          
          {userRole === 'seller' ? (
            <button
              onClick={handleOpenSellerDashboard}
              className="mt-5 w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-black rounded-xl text-[11px] font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 shadow-md shadow-emerald-950/20"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Product</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavigate('PRODUCT_MARKETPLACE')}
              className="mt-5 w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[11px] font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Browse Catalog</span>
            </button>
          )}
        </div>
      </div>

      {/* Specialized Ecosystem Grid */}
      <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold mb-4">
        Specialized Core Ecosystems
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ecosystems.map((eco) => {
          const Icon = eco.icon;
          const isActive = eco.status === 'active';

          return (
            <div
              key={eco.id}
              onClick={() => {
                if (isActive && eco.targetTab) {
                  handleNavigate(eco.targetTab);
                }
              }}
              className={`p-4 rounded-xl border bg-black/20 flex flex-col justify-between gap-4 transition-all duration-300 relative group overflow-hidden ${
                isActive 
                  ? 'hover:border-white/10 hover:bg-[#070710] cursor-pointer' 
                  : 'opacity-70 cursor-not-allowed'
              }`}
            >
              {/* Overlay glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-white/5 text-zinc-400 group-hover:text-white transition-colors`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <span className={`text-[8.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isActive 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-zinc-800/20 border-white/5 text-zinc-500'
                  }`}>
                    {eco.badge}
                  </span>
                </div>

                <div className="text-left pt-1">
                  <h4 className="text-xs font-bold text-white tracking-wide group-hover:text-violet-400 transition-colors">
                    {eco.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-sans mt-1">
                    {eco.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.03] pt-2.5 relative">
                <span className="text-[9px] font-mono text-zinc-600 uppercase">Status</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                    {eco.actionLabel}
                  </span>
                  {isActive ? (
                    <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  ) : (
                    <Lock className="w-3 h-3 text-zinc-600" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
