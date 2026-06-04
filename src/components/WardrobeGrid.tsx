import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shirt, 
  Trash2, 
  Zap, 
  ChevronRight, 
  Plus, 
  Search, 
  Info,
  SlidersHorizontal,
  FolderHeart,
  CalendarDays,
  Palette,
  Timer
} from 'lucide-react';
import { WardrobeItem, ClothingCategory } from '../types';

interface WardrobeGridProps {
  wardrobe: WardrobeItem[];
  onAddGarment: (title: string, description: string, category: ClothingCategory, extraOptions?: {
    season?: WardrobeItem['season'];
    primaryColor?: string;
    secondaryColor?: string;
  }) => Promise<void>;
  onDeleteItem: (item: WardrobeItem) => Promise<void>;
  onToggleStatus: (item: WardrobeItem) => Promise<void>;
  onGenerateStrategy: (item: WardrobeItem) => Promise<void>;
  generatingStrategyId: string | null;
}

const CATEGORIES: ClothingCategory[] = ['Casual', 'Formal', 'Sportswear', 'Outerwear', 'Accessories'];
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter', 'All-Season'] as const;
const COLOR_OPTIONS = [
  { name: 'Pitch Black', value: '#0f172a' },
  { name: 'Oatmeal Beige', value: '#f5f5f4' },
  { name: 'Minimalist White', value: '#ffffff' },
  { name: 'Olive Drab', value: '#3f6212' },
  { name: 'Navy Blue', value: '#1e3a8a' },
  { name: 'Warm Rust', value: '#7c2d12' },
  { name: 'Dry Sage', value: '#065f46' }
];

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  wardrobe,
  onAddGarment,
  onDeleteItem,
  onToggleStatus,
  onGenerateStrategy,
  generatingStrategyId
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('Casual');
  const [season, setSeason] = useState<WardrobeItem['season']>('All-Season');
  const [primaryColor, setPrimaryColor] = useState(COLOR_OPTIONS[0].name);
  const [secondaryColor, setSecondaryColor] = useState(COLOR_OPTIONS[1].name);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selCategory, setSelCategory] = useState<string>('All');
  const [selSeason, setSelSeason] = useState<string>('All');
  const [selStatus, setSelStatus] = useState<string>('All');

  const [addingItem, setAddingItem] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAddGarment(title, desc, category, {
      season,
      primaryColor,
      secondaryColor
    });

    setTitle('');
    setDesc('');
    setCategory('Casual');
    setSeason('All-Season');
    setPrimaryColor(COLOR_OPTIONS[0].name);
    setSecondaryColor(COLOR_OPTIONS[1].name);
    setAddingItem(false);
  };

  const filteredItems = wardrobe.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selCategory === 'All' || item.category === selCategory;
    const matchesSeason = selSeason === 'All' || item.season === selSeason;
    const matchesStatus = selStatus === 'All' || item.status === selStatus;
    return matchesSearch && matchesCategory && matchesSeason && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans" id="wardrobe-grid-view">
      {/* Sidebar: Creation & Filters */}
      <aside className="lg:col-span-4 space-y-6">
        
        {/* Creation Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6" id="creation-form-box">
          <button 
            type="button"
            onClick={() => setAddingItem(!addingItem)}
            className="w-full flex items-center justify-between text-sm font-black uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Plus size={16} className="text-blue-600" /> Add Outfit Item
            </span>
            <span className="text-xs text-blue-500">{addingItem ? 'Hide' : 'Expand'}</span>
          </button>

          <AnimatePresence initial={false}>
            {(addingItem || wardrobe.length === 0) && (
              <motion.form 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit} 
                className="space-y-4 mt-6 overflow-hidden"
              >
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Garment Descriptor</label>
                  <input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="E.g., Flannel Checked Overshirt" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Style Class</label>
                    <select 
                      value={category} 
                      onChange={e => setCategory(e.target.value as ClothingCategory)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Season Cycle</label>
                    <select 
                      value={season} 
                      onChange={e => setSeason(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                    >
                      {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Fabric Color</label>
                    <select 
                      value={primaryColor} 
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                    >
                      {COLOR_OPTIONS.map(col => <option key={col.name} value={col.name}>{col.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Contrast Hue</label>
                    <select 
                      value={secondaryColor} 
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                    >
                      {COLOR_OPTIONS.map(col => <option key={col.name} value={col.name}>{col.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Fabric, Fit & Texture Details</label>
                  <textarea 
                    value={desc} 
                    onChange={e => setDesc(e.target.value)} 
                    placeholder="E.g., 100% thick wool blend, cream checkered patterns, heavy fit." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none text-xs placeholder:text-slate-400 leading-relaxed" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-150 text-xs cursor-pointer uppercase tracking-wider"
                >
                  Verify and Store Garment
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Tactical Search Filter Dashboard */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5" id="refinement-filters-box">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal className="text-slate-400" size={16} />
            <h3 className="text-xs uppercase font-black tracking-wider text-slate-500">Refine View</h3>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search items, fabrics..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-slate-400 mb-1 block">Apparel Class</label>
              <select
                value={selCategory}
                onChange={e => setSelCategory(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-medium"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-slate-400 mb-1 block">Seasonal Preference</label>
              <select
                value={selSeason}
                onChange={e => setSelSeason(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-medium"
              >
                <option value="All">All Seasons</option>
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-slate-400 mb-1 block">Rotation State</label>
              <select
                value={selStatus}
                onChange={e => setSelStatus(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="In Closet">In Closet</option>
                <option value="Planned">Planned</option>
                <option value="Worn/Wash">Worn/Wash</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Grid View */}
      <section className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-serif font-black tracking-tight text-slate-900">
              Personal Catalog
            </span>
            <span className="text-xs font-mono font-bold bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-full">
              {filteredItems.length} items
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="closet-items-bento">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const currentImgColor = COLOR_OPTIONS.find(c => c.name === item.primaryColor)?.value || '#94a3b8';
              return (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative group hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Mock Representation */}
                    <div className="h-32 mb-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-4 relative overflow-hidden group-hover:bg-slate-100/50 transition-colors">
                      {/* Interactive clothes color overlay */}
                      <div 
                        style={{ backgroundColor: currentImgColor }} 
                        className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm opacity-90 transition-transform duration-300 group-hover:scale-105"
                      >
                        <Shirt className={item.primaryColor === 'Minimalist White' ? 'text-slate-800' : 'text-white'} size={28} />
                      </div>
                      
                      {/* Floating Category tag */}
                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-[2px] px-2 py-0.5 rounded-md text-[9px] font-mono leading-tight border border-slate-100 uppercase tracking-tighter">
                        {item.category}
                      </div>

                      {/* Floating Season Tag */}
                      <div className="absolute top-2 right-2 bg-slate-900/10 text-slate-700 px-1.5 py-0.5 rounded-md text-[9px] font-mono leading-tight tracking-tighter">
                        {item.season || 'All-Season'}
                      </div>
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider ${
                        item.status === 'Worn/Wash' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        item.status === 'Planned' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                        'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {item.status}
                      </span>
                      
                      <button 
                        onClick={() => onDeleteItem(item)}
                        title="Delete wardrobe garment"
                        className="p-1 px-1.5 rounded-md text-slate-300 hover:text-rose-500 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-900 tracking-tight text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light mb-4 line-clamp-2">
                      {item.description || "Simple elegant garment."}
                    </p>

                    {/* Meta Palette Row */}
                    <div className="flex items-center gap-4 mb-4 text-[10px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <FolderHeart size={11} />
                        <span>{item.primaryColor || 'Neutral'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Timer size={11} />
                        <span>Worn: {item.wearCount || 0}x</span>
                      </div>
                    </div>

                    {/* Dynamic offline style suggestion blocks */}
                    {item.strategy ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 bg-blue-50/40 rounded-xl border border-blue-100 text-[11px] text-slate-700 leading-relaxed font-light mb-4"
                      >
                        <div className="flex items-center gap-1 font-bold uppercase tracking-wider text-[9px] text-blue-600 mb-1">
                          <Zap size={10} /> Style Insight
                        </div>
                        <div className="whitespace-pre-wrap">{item.strategy}</div>
                      </motion.div>
                    ) : null}
                  </div>

                  <div className="space-y-2 mt-auto">
                    {!item.strategy && (
                      <button
                        onClick={() => onGenerateStrategy(item)}
                        disabled={generatingStrategyId === item.id}
                        className="w-full py-1.5 bg-slate-950 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        {generatingStrategyId === item.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Zap size={11} />
                        )}
                        Formulate Styling Strategy
                      </button>
                    )}

                    <button 
                      onClick={() => onToggleStatus(item)}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-150"
                    >
                      Cycle Rotation <ChevronRight size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="col-span-full py-16 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <Shirt size={22} />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">No matched clothing found</h4>
              <p className="text-xs text-slate-400 max-w-[200px]">Alter your sidebar refinement filters or add some new styled pieces above.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
