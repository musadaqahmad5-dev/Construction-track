import React from 'react';
import { motion } from 'motion/react';
import { Shirt, Sparkles, Calendar, Heart, ArrowRight, Zap, RefreshCw, Layers, Camera, Cpu } from 'lucide-react';
import { WardrobeItem } from '../types';

interface FashionHomeProps {
  wardrobe: WardrobeItem[];
  onNavigate: (tab: 'home' | 'wardrobe' | 'today' | 'tomorrow' | 'assistant' | 'vision' | 'aihub') => void;
  onAddSampleWardrobe: () => void;
}

export const FashionHome: React.FC<FashionHomeProps> = ({ wardrobe, onNavigate, onAddSampleWardrobe }) => {
  const totalItems = wardrobe.length;
  const inClosetCount = wardrobe.filter(item => item.status === 'In Closet').length;
  const plannedCount = wardrobe.filter(item => item.status === 'Planned').length;
  const laundryCount = wardrobe.filter(item => item.status === 'Worn/Wash').length;

  return (
    <div className="space-y-10" id="fashion-home-viewport">
      {/* Editorial Hero Block */}
      <div 
        id="home-hero-editorial"
        className="relative bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl border border-slate-800"
      >
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          {/* Faint dynamic vector grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono uppercase tracking-widest"
          >
            <Sparkles size={12} /> Live Your Vibe
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight leading-tight">
            Style shouldn't be a <span className="font-sans font-normal italic text-slate-400">guessing</span> game.
          </h1>
          
          <p className="text-sm text-slate-400 leading-relaxed font-light">
            Welcome to your intelligent closet. Curate your wardrobe pieces, generate color-coordinated strategies, and choose the perfect daily outfits with simplicity.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('wardrobe')}
              id="hero-navigate-closet-btn"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] cursor-pointer flex items-center gap-2"
            >
              Enter Closet <ArrowRight size={14} />
            </button>
            
            {wardrobe.length === 0 && (
              <button
                onClick={onAddSampleWardrobe}
                id="hero-populate-sample-btn"
                className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700 active:scale-[0.98] cursor-pointer flex items-center gap-2"
              >
                <Layers size={14} /> Setup Sample Garments
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sartorial Health & Counter Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="home-stat-widgets">
        {[
          { label: 'Total Closet Assets', value: totalItems, color: 'text-slate-900', icon: <Shirt className="text-slate-500" size={18} /> },
          { label: 'Ready to Wear', value: inClosetCount, color: 'text-blue-600', icon: <CheckCircleIcon className="text-blue-500" size={18} /> },
          { label: 'Planned Outfits', value: plannedCount, color: 'text-amber-600', icon: <Calendar className="text-amber-500" size={18} /> },
          { label: 'In Laundry Bucket', value: laundryCount, color: 'text-rose-600', icon: <Trash2Icon className="text-rose-500" size={18} /> },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              {stat.icon}
            </div>
            <p className={`text-2xl font-serif font-black ${stat.color} tracking-tight mt-1`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Navigation Quick Gates */}
      <div className="space-y-4" id="home-quick-navigation">
        <h2 className="text-xs uppercase font-bold tracking-widest text-slate-400">Outfit Navigation Hub</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[
            {
              id: 'aihub',
              title: "AI Operating Layer",
              desc: "Learn your style DNA, generate custom coordinates organically, predict weekly lookbooks, and build designs with Pro tools.",
              act: "Boot Fashion OS",
              color: "hover:border-blue-500 bg-slate-950 text-white hover:shadow-xl hover:shadow-blue-950/20",
              icon: <Cpu className="text-blue-400 animate-pulse" size={24} />,
              customTextClass: "text-slate-300",
              customTitleClass: "text-white"
            },
            {
              id: 'today',
              title: "Today's Suggested Vibe",
              desc: "Generate styling recommendations from available garments using AI coordination matching.",
              act: "Suggest Now",
              color: "hover:border-blue-300 bg-white",
              icon: <Sparkles className="text-blue-600" size={24} />
            },
            {
              id: 'tomorrow',
              title: "Tomorrow's Planner",
              desc: "Preview forecasted matching sets to optimize morning routines & stage upcoming wardrobes.",
              act: "Plan Tomorrow",
              color: "hover:border-amber-300 bg-white",
              icon: <Calendar className="text-amber-500" size={24} />
            },
            {
              id: 'vision',
              title: "AI Visual Scan Tracker",
              desc: "Snap silhouettes or upload files to extract fabric coefficients, materials, & season tags using Gemini.",
              act: "Initiate Scan",
              color: "hover:border-indigo-300 bg-white",
              icon: <Camera className="text-indigo-600" size={24} />
            },
            {
              id: 'assistant',
              title: "Style & Color Auditor",
              desc: "Inspect color harmony ratios, density void parameters, and aesthetic fatigue profiles.",
              act: "Analyze Palette",
              color: "hover:border-emerald-300 bg-white",
              icon: <Layers className="text-emerald-500" size={24} />
            }
          ].map((gate) => (
            <div 
              key={gate.id}
              onClick={() => onNavigate(gate.id as any)}
              className={`p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between ${gate.color} group`}
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50/10 flex items-center justify-center mb-2">
                  {gate.icon}
                </div>
                <h3 className={`font-bold transition-colors tracking-tight text-base group-hover:text-blue-500 ${gate.customTitleClass || 'text-slate-900'}`}>{gate.title}</h3>
                <p className={`text-xs font-light leading-relaxed ${gate.customTextClass || 'text-slate-500'}`}>{gate.desc}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500 transition-colors">
                <span>{gate.act}</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Internal mini-renders to support modular icons
const CheckCircleIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Trash2Icon: React.FC<{ className?: string; size?: number }> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
