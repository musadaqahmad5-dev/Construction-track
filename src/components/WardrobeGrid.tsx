import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Trash2, Shield, PlusCircle, Wind, Sparkles, Command, X, HelpCircle } from 'lucide-react';
import { WardrobeItem, ClothingCategory } from '../types';

interface WardrobeGridProps {
  items: WardrobeItem[];
  onDelete: (item: WardrobeItem) => void;
  onSelect?: (item: WardrobeItem) => void;
  onAddTrigger?: () => void;
  categories: ClothingCategory[];
  id?: string;
}

// Semantic constants for local NLP classification
const COLORS = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey', 'gray', 'navy', 'beige', 'gold', 'silver', 'tweed', 'noir', 'charcoal', 'slate', 'indigo', 'emerald', 'violet', 'cream', 'khaki'];
const MATERIALS = ['cotton', 'wool', 'silk', 'leather', 'linen', 'denim', 'tweed', 'polyester', 'satin', 'cashmere', 'velvet', 'knit', 'knitted', 'nylon', 'fur', 'canvas'];
const SEASONS = ['spring', 'summer', 'autumn', 'fall', 'winter'];
const OCCASIONS = {
  office: ['office', 'work', 'business', 'interview', 'meeting', 'corporate', 'professional', 'desk'],
  wedding: ['wedding', 'marriage', 'gala', 'ceremony', 'formal party', 'celebration'],
  formal: ['formal', 'tuxedo', 'gown', 'suit', 'elegant', 'dressy', 'evening', 'smart'],
  casual: ['casual', 'relaxed', 'daily', 'home', 'lounge', 'everyday', 'weekend', 'chilling'],
  sportswear: ['sportswear', 'gym', 'workout', 'running', 'active', 'sports', 'athletic', 'training'],
  party: ['party', 'night out', 'club', 'celebration', 'festive', 'cocktail', 'date']
};
const STYLES = ['minimalist', 'classic', 'streetwear', 'vintage', 'bold', 'chic', 'retro', 'modern'];

interface SemanticQuery {
  colors: string[];
  materials: string[];
  seasons: string[];
  occasions: string[];
  styles: string[];
  keywords: string[];
}

interface MatchInsight {
  type: 'color' | 'material' | 'season' | 'occasion' | 'style' | 'keyword';
  label: string;
  value: string;
}

interface ScoredItemEntry {
  item: WardrobeItem;
  score: number;
  insights: MatchInsight[];
}

function parseSemanticQuery(query: string): SemanticQuery {
  const clean = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = clean.split(/\s+/).filter(t => t.length > 0);
  
  const foundColors: string[] = [];
  const foundMaterials: string[] = [];
  const foundSeasons: string[] = [];
  const foundOccasions: string[] = [];
  const foundStyles: string[] = [];
  const foundKeywords: string[] = [];
  
  for (const token of tokens) {
    let matched = false;
    
    if (COLORS.includes(token)) {
      foundColors.push(token);
      matched = true;
    }
    
    if (MATERIALS.includes(token)) {
      foundMaterials.push(token);
      matched = true;
    }
    
    if (SEASONS.includes(token)) {
      foundSeasons.push(token === 'fall' ? 'autumn' : token);
      matched = true;
    }
    
    for (const [key, aliases] of Object.entries(OCCASIONS)) {
      if (key === token || aliases.includes(token)) {
        if (!foundOccasions.includes(key)) {
          foundOccasions.push(key);
        }
        matched = true;
      }
    }
    
    if (STYLES.includes(token)) {
      foundStyles.push(token);
      matched = true;
    }
    
    if (!matched && token.length > 2) {
      foundKeywords.push(token);
    }
  }
  
  return {
    colors: foundColors,
    materials: foundMaterials,
    seasons: foundSeasons,
    occasions: foundOccasions,
    styles: foundStyles,
    keywords: foundKeywords
  };
}

// Text highlighting component for match visualization
const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!text || !query.trim()) return <>{text}</>;
  
  const clean = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = clean.split(/\s+/).filter(t => t.length > 2);
  
  if (tokens.length === 0) return <>{text}</>;
  
  const escapedTokens = tokens.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
  
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-violet-500/35 text-violet-100 px-0.5 rounded border border-violet-500/20 font-medium">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  items,
  onDelete,
  onSelect,
  onAddTrigger,
  categories,
  id
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut integration: [/] or [Alt+S] or [Ctrl+K] focus search, [Esc] blurs & clears
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' && document.activeElement !== inputRef.current) || 
          (e.key === 's' && e.altKey) || 
          (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debouncing to maintain snappy UI performance
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 200);
    return () => clearTimeout(handler);
  }, [search]);

  // Compute smart semantic metadata tags of the debounced search
  const queryMeta = useMemo(() => {
    return parseSemanticQuery(debouncedSearch);
  }, [debouncedSearch]);

  const hasSemanticMeta = useMemo(() => {
    return queryMeta.colors.length > 0 ||
      queryMeta.materials.length > 0 ||
      queryMeta.seasons.length > 0 ||
      queryMeta.occasions.length > 0 ||
      queryMeta.styles.length > 0;
  }, [queryMeta]);

  // Scored items matrix mapping
  const scoredItems = useMemo<ScoredItemEntry[]>(() => {
    const query = debouncedSearch.trim();
    if (!query) {
      return items.map(item => ({ item, score: 0, insights: [] }));
    }
    
    const parsed = parseSemanticQuery(query);
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    return items.map(item => {
      let score = 0;
      const insights: MatchInsight[] = [];
      
      const titleLower = (item.title || '').toLowerCase();
      const descLower = (item.description || '').toLowerCase();
      const catLower = (item.category || '').toLowerCase();
      const seasonLower = (item.season || '').toLowerCase();
      const pColorLower = (item.primaryColor || '').toLowerCase();
      const sColorLower = (item.secondaryColor || '').toLowerCase();
      const formalityLower = (item.formality || '').toLowerCase();
      const worksWithLower = (item.worksWith || '').toLowerCase();
      const strategyLower = (item.strategy || '').toLowerCase();
      
      // 1. Color matching
      parsed.colors.forEach(color => {
        if (pColorLower === color || sColorLower === color) {
          score += 35;
          insights.push({ type: 'color', label: 'Color Match', value: color });
        } else if (titleLower.includes(color) || descLower.includes(color) || worksWithLower.includes(color)) {
          score += 15;
          insights.push({ type: 'color', label: 'Color Word', value: color });
        }
      });
      
      // 2. Material matching
      parsed.materials.forEach(mat => {
        if (titleLower.includes(mat)) {
          score += 35;
          insights.push({ type: 'material', label: 'Material', value: mat });
        } else if (descLower.includes(mat)) {
          score += 20;
          insights.push({ type: 'material', label: 'Material Info', value: mat });
        }
      });
      
      // 3. Season matching
      parsed.seasons.forEach(season => {
        if (seasonLower === season) {
          score += 25;
          insights.push({ type: 'season', label: 'Season Match', value: season });
        } else if (seasonLower === 'all-season') {
          score += 10;
          insights.push({ type: 'season', label: 'All-Season', value: 'all' });
        } else if (descLower.includes(season)) {
          score += 10;
        }
      });
      
      // 4. Occasions / Formality matching
      parsed.occasions.forEach(occ => {
        let matchesFormality = false;
        if (occ === 'office' && (formalityLower.includes('formal') || formalityLower.includes('semi-formal') || formalityLower.includes('smart'))) {
          matchesFormality = true;
        } else if (occ === 'wedding' && formalityLower.includes('formal')) {
          matchesFormality = true;
        } else if (occ === 'formal' && formalityLower.includes('formal')) {
          matchesFormality = true;
        } else if (occ === 'casual' && formalityLower.includes('casual')) {
          matchesFormality = true;
        } else if (occ === 'sportswear' && formalityLower.includes('sportswear')) {
          matchesFormality = true;
        } else if (occ === 'party' && (formalityLower.includes('casual') || descLower.includes('party') || strategyLower.includes('party'))) {
          matchesFormality = true;
        }
        
        if (matchesFormality) {
          score += 30;
          insights.push({ type: 'occasion', label: 'Occasion Vibe', value: occ });
        } else if (descLower.includes(occ) || strategyLower.includes(occ) || worksWithLower.includes(occ)) {
          score += 20;
          insights.push({ type: 'occasion', label: 'Fit Vibe', value: occ });
        }
      });
      
      // 5. Styles matching
      parsed.styles.forEach(style => {
        if (descLower.includes(style) || strategyLower.includes(style)) {
          score += 20;
          insights.push({ type: 'style', label: 'Style Vibe', value: style });
        }
      });
      
      // 6. Keywords/Garments matching
      parsed.keywords.forEach(word => {
        if (titleLower.includes(word)) {
          score += 30;
          insights.push({ type: 'keyword', label: 'Garment', value: word });
        } else if (descLower.includes(word)) {
          score += 15;
        }
      });
      
      // 7. General search query fallback
      if (score === 0) {
        let keywordMatches = 0;
        queryWords.forEach(word => {
          if (titleLower.includes(word) || descLower.includes(word) || catLower.includes(word) || seasonLower.includes(word)) {
            keywordMatches++;
          }
        });
        if (keywordMatches > 0) {
          score += keywordMatches * 15;
          insights.push({ type: 'keyword', label: 'Text Match', value: `${keywordMatches} terms` });
        }
      }
      
      return { item, score, insights };
    });
  }, [items, debouncedSearch]);

  const filtered = useMemo<ScoredItemEntry[]>(() => {
    return scoredItems
      .filter(({ item, score }) => {
        const isCategoryMatch = selectedCategory === 'ALL' || item.category === selectedCategory;
        const isSeasonMatch = selectedSeason === 'ALL' || item.season === selectedSeason;
        const isSearchMatch = !debouncedSearch.trim() || score > 0;
        return isCategoryMatch && isSeasonMatch && isSearchMatch;
      })
      .sort((a, b) => {
        if (debouncedSearch.trim()) {
          return b.score - a.score;
        }
        return 0;
      });
  }, [scoredItems, selectedCategory, selectedSeason, debouncedSearch]);

  const SUGGESTIONS = [
    'Black shirt for office',
    'White sneakers',
    'Formal outfit for wedding',
    'Winter casual',
    'Blue jeans',
    'Cotton shirt',
    'Summer outfit',
    'Black shoes with jeans'
  ];

  return (
    <div id={id || "wardrobe-grid-container"} className="space-y-6">
      {/* Search and Filter panel */}
      <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center w-full">
          {/* Main search with hotkey and clear button */}
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
            <input
              ref={inputRef}
              id="wardrobe-search"
              type="text"
              placeholder="Semantic search (e.g. 'black shirt office', 'white sneakers')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 focus-within:border-indigo-500/40 pl-9 pr-14 py-2 text-xs font-mono text-white/80 placeholder-white/30 rounded-lg focus:outline-none transition-all duration-300 shadow-inner"
            />
            {search ? (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[9px] font-mono text-white/20 select-none bg-white/[0.03] border border-white/5 px-1 py-0.5 rounded">
                /
              </span>
            )}
          </div>

          {/* Categories filters */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <span className="text-[9px] font-mono text-white/30 self-center uppercase mr-1">Category:</span>
            {['ALL', ...categories].map((cat) => (
              <button
                key={cat}
                id={`filter-cat-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-[9.5px] font-mono tracking-wider uppercase rounded-md border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black border-white shadow-lg shadow-white/5'
                    : 'bg-white/[0.01] text-white/50 border-white/5 hover:border-white/10 hover:text-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Season filters */}
        <div className="flex flex-wrap gap-2 items-center border-t border-white/[0.03] pt-3">
          <span className="text-[9px] font-mono text-white/30 uppercase mr-1">Season Filter:</span>
          {['ALL', 'Spring', 'Summer', 'Autumn', 'Winter'].map((sea) => (
            <button
              key={sea}
              id={`filter-season-${sea.toLowerCase()}`}
              onClick={() => setSelectedSeason(sea)}
              className={`px-3 py-1 text-[9px] font-mono tracking-wider uppercase rounded-md border transition-all cursor-pointer ${
                selectedSeason === sea
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-md shadow-amber-500/5'
                  : 'bg-white/[0.01] text-white/40 border-white/5 hover:border-white/10 hover:text-white/70'
              }`}
            >
              {sea}
            </button>
          ))}
        </div>

        {/* Semantic Parser Insights Subpanel */}
        {debouncedSearch && hasSemanticMeta && (
          <motion.div 
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 items-center text-[10px] font-mono text-white/40 pt-2 border-t border-white/[0.03]"
          >
            <span className="text-indigo-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" /> AI Semantic Parse:
            </span>
            {queryMeta.colors.map(c => (
              <span key={c} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px] font-light">
                🌈 {c}
              </span>
            ))}
            {queryMeta.materials.map(m => (
              <span key={m} className="bg-teal-500/10 border border-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px] font-light">
                🧵 {m}
              </span>
            ))}
            {queryMeta.seasons.map(s => (
              <span key={s} className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px] font-light">
                ☀️ {s}
              </span>
            ))}
            {queryMeta.occasions.map(o => (
              <span key={o} className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px] font-light">
                💼 {o}
              </span>
            ))}
            {queryMeta.styles.map(st => (
              <span key={st} className="bg-violet-500/10 border border-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px] font-light">
                ✨ {st}
              </span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Grid items layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {onAddTrigger && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border border-dashed border-white/10 hover:border-white/20 rounded-xl flex flex-col items-center justify-center p-6 text-center h-52 cursor-pointer bg-white/[0.005]/[0.1] hover:bg-white/[0.01] transition-all"
            onClick={onAddTrigger}
          >
            <PlusCircle className="w-8 h-8 text-white/20 mb-3" />
            <span className="text-xs font-mono text-white/45 tracking-wider uppercase">
              Add New Garment
            </span>
            <span className="text-[10px] font-serif text-white/25 italic mt-1">
              "Enlist look slowly."
            </span>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {filtered.map(({ item, score, insights }) => {
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelect?.(item)}
                className="group relative bg-zinc-950/20 border border-white/5 hover:border-white/10 rounded-xl p-4 flex flex-col justify-between h-52 overflow-hidden transition-all duration-300 cursor-pointer"
              >
                {/* Clean soft drop shimmer */}
                <div className="absolute inset-0 bg-white/[0.002] group-hover:bg-white/[0.01] transition-all duration-300" />
                
                <div className="space-y-2 relative z-10 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.1em] block font-light">
                      {item.category}
                    </span>
                    
                    {/* Clothing Lifecyle Status Badge */}
                    <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-medium tracking-wide leading-none border ${
                      item.status === 'In Closet' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                      item.status === 'Planned' ? 'bg-amber-500/10 text-amber-400 border-amber-500/10' :
                      'bg-zinc-800 text-zinc-400 border-zinc-700/50'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-sm font-mono font-medium text-white truncate block">
                    <HighlightText text={item.title} query={debouncedSearch} />
                  </h4>

                  {item.description && (
                    <p className="text-[10px] font-serif italic text-white/45 leading-relaxed line-clamp-2">
                      <HighlightText text={item.description} query={debouncedSearch} />
                    </p>
                  )}

                  {/* Semantic matching reasons inside item card */}
                  {debouncedSearch && insights.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 z-15 relative">
                      {insights.slice(0, 2).map((ins, idx) => (
                        <span 
                          key={idx} 
                          className="text-[8px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/15 px-1 py-0.5 rounded-sm flex items-center gap-0.5"
                          title={`${ins.label}: ${ins.value}`}
                        >
                          <Sparkles className="w-1.5 h-1.5" />
                          {ins.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Foot/Actions */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="space-y-0.5">
                    {item.season && (
                      <span className="text-[9px] font-mono text-white/30 block">
                        SEASON: <span className="text-white/60 font-light">{item.season}</span>
                      </span>
                    )}
                    {item.primaryColor && (
                      <span className="text-[9px] font-mono text-white/30 block truncate max-w-[120px]">
                        COLOR: <span className="text-white/60 font-light">{item.primaryColor}</span>
                      </span>
                    )}
                  </div>

                   <button
                    id={`btn-delete-${item.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (deletingId === item.id) {
                        onDelete(item);
                        setDeletingId(null);
                      } else {
                        setDeletingId(item.id);
                        setTimeout(() => {
                          setDeletingId(prev => prev === item.id ? null : prev);
                        }, 4000);
                      }
                    }}
                    className={`p-1.5 rounded-md cursor-pointer transition-all relative z-20 border ${
                      deletingId === item.id 
                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                        : 'bg-white/[0.02] border-white/5 text-white/30 hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/20'
                    }`}
                    title={deletingId === item.id ? "Click again to confirm delete" : "Remove item"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-12 px-6 text-center space-y-4 bg-white/[0.005] border border-white/5 rounded-2xl select-none flex flex-col items-center">
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-full">
            <Search className="w-6 h-6 text-white/25" />
          </div>
          <div>
            <p className="text-sm font-serif italic text-white/35">
              "No closet items matched your semantic query."
            </p>
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest block font-light mt-1">
              try selecting from one of our semantic suggestions:
            </span>
          </div>

          <div className="flex flex-wrap gap-2 justify-center max-w-xl">
            {SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                onClick={() => setSearch(sug)}
                className="px-2.5 py-1.5 text-[10px] font-mono bg-white/[0.01] border border-white/5 rounded-lg text-white/50 hover:bg-white/[0.04] hover:text-white/80 hover:border-indigo-500/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-2.5 h-2.5 text-indigo-400" />
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
