import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, SlidersHorizontal, ArrowUpRight, Heart, Store, Sparkles, Filter, ChevronRight, Tag, Info } from 'lucide-react';
import { WardrobeItem } from '../../types';

interface MarketplaceScreenProps {
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  userWardrobe: WardrobeItem[];
  onSelectProduct: (product: any) => void;
  onNavigateToTab?: (tab: string) => void;
}

const BOUTIQUE_PRODUCTS = [
  {
    id: 'prod-1',
    brand: 'ZARA MAN COUTURE',
    title: 'Relaxed Fit Double-Breasted Blazer',
    price: 79.99,
    originalPrice: 99.99,
    discount: '20% OFF',
    rating: '4.8',
    reviews: 128,
    category: 'Formal' as const,
    availability: 'In Stock' as const,
    vibeTags: ['minimalist', 'classic', 'formal'],
    description: 'A structural, double-breasted suit blazer in organic viscose blend. Designed with relaxed shoulders, clean notched lapels, and double back vents.',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'prod-2',
    brand: 'NIKE LAB SERIES',
    title: "Air Force 1 '07 Premium Retro",
    price: 110.00,
    rating: '4.7',
    reviews: 342,
    category: 'Sportswear' as const,
    availability: 'Limited' as const,
    vibeTags: ['streetwear', 'sportswear', 'vintage'],
    description: 'The basketball icon returns in ultra-premium grain leather. Features bespoke double stitching and high-traction pivot rubber outsole.',
    imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'prod-3',
    brand: 'ARC’TERYX VEILANCE',
    title: 'Aris Techwear Waterproof Parka',
    price: 240.00,
    originalPrice: 295.00,
    discount: '18% OFF',
    rating: '4.9',
    reviews: 64,
    category: 'Outerwear' as const,
    availability: 'Limited' as const,
    vibeTags: ['techwear', 'waterproof', 'outerwear'],
    description: 'An advanced storm-grade shell parka equipped with GORE-TEX lining, articulated sleeves for mobility, and storm-guard adjusters.',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'prod-4',
    brand: 'LORENZO SARTORIAL',
    title: 'Italian Brushed Suede Loafers',
    price: 165.00,
    rating: '4.6',
    reviews: 82,
    category: 'Formal' as const,
    availability: 'In Stock' as const,
    vibeTags: ['luxury', 'formal', 'classic'],
    description: 'Handcrafted luxury shoes assembled in Tuscany. Real brushed suede, soft calfskin cushion lining, and durable welted leather sole.',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'prod-5',
    brand: 'COS ESSENTIALS',
    title: 'Brushed Mohair Knit Sweater',
    price: 115.00,
    rating: '4.8',
    reviews: 95,
    category: 'Casual' as const,
    availability: 'In Stock' as const,
    vibeTags: ['nordic', 'cozy', 'minimalist'],
    description: 'Thick mohair blend wool crewneck sweater. Exceptional insulation with an atmospheric fuzzy surface. Perfect for overcast layering.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'prod-6',
    brand: 'ATELIER LINEN CO',
    title: 'Minimalist Sandstone Summer Shirt',
    price: 65.00,
    originalPrice: 85.00,
    discount: '23% OFF',
    rating: '4.5',
    reviews: 112,
    category: 'Casual' as const,
    availability: 'In Stock' as const,
    vibeTags: ['relaxed', 'coastal', 'casual'],
    description: 'An ultra-light, breathable button-up shirt crafted from 100% Belgian flax linen. Pre-washed for premium textured softness.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop'
  }
];

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  onAddGarment,
  userWardrobe,
  onSelectProduct,
  onNavigateToTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'All' | 'New In' | 'Brands' | 'Sale'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(300);
  const [showFilters, setShowFilters] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
      detail: likedMap[id] ? 'Removed from favorites' : 'Added product to style favorites' 
    }));
  };

  const handleAcquire = async (product: typeof BOUTIQUE_PRODUCTS[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddGarment) {
      await onAddGarment(
        product.title, 
        product.description, 
        product.category, 
        { imageUrl: product.imageUrl, price: product.price }
      );
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: `Acquired ${product.title} into Closet!` 
      }));
    }
  };

  const filteredProducts = useMemo(() => {
    return BOUTIQUE_PRODUCTS.filter(item => {
      // 1. Search Query Match
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(searchLower) || 
                            item.brand.toLowerCase().includes(searchLower) ||
                            item.vibeTags.some(t => t.includes(searchLower));
      
      // 2. Tab Filter Match
      let matchesTab = true;
      if (activeSubTab === 'New In') matchesTab = item.availability === 'Limited';
      if (activeSubTab === 'Brands') matchesTab = item.price > 100;
      if (activeSubTab === 'Sale') matchesTab = !!item.discount;

      // 3. Category Match
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      // 4. Price Match
      const matchesPrice = item.price <= priceRange;

      return matchesSearch && matchesTab && matchesCategory && matchesPrice;
    });
  }, [searchQuery, activeSubTab, selectedCategory, priceRange]);

  return (
    <div className="w-full min-h-screen bg-[#05050a] text-zinc-100 p-4 sm:p-6 lg:p-8 select-none">
      
      {/* Editorial Title Header */}
      <div className="max-w-6xl mx-auto space-y-3 pb-8 border-b border-white/5 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-500 uppercase block font-light">
              CURATED COMMERCE TERMINAL
            </span>
            <h1 className="font-serif font-light tracking-tight text-4xl text-white">
              Boutique Storefront
            </h1>
          </div>

          {/* Quick Stats bar */}
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-3">
              <Store className="w-4 h-4 text-emerald-400" />
              <div className="text-left font-mono">
                <span className="block text-[8px] uppercase text-zinc-500">Active Partners</span>
                <span className="block text-xs text-white font-bold">14 Boutiques</span>
              </div>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <div className="text-left font-mono">
                <span className="block text-[8px] uppercase text-zinc-500">Closet Size</span>
                <span className="block text-xs text-white font-bold">{userWardrobe.length} Pieces</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xl font-light">
          Acquire physical and digital garments verified for high AI wardrobe compatibility. One-click integration installs listings directly onto your virtual shelves.
        </p>
      </div>

      {/* Control Utility Bar (Search & Filter triggers) */}
      <div className="max-w-6xl mx-auto py-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Modern Search */}
        <div className="relative w-full md:w-96 select-text">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search brands, styles, wool, GORE-TEX..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 hover:border-white/10 focus:border-white/20 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none transition-all font-mono uppercase tracking-wider"
          />
        </div>

        {/* Subtab Pill Navigation */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
          {['All', 'New In', 'Brands', 'Sale'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab as any)}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === tab 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                  : 'bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer ${
            showFilters || selectedCategory !== 'All' || priceRange < 300
              ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-bold'
              : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>[ Filters {selectedCategory !== 'All' ? '· 1' : ''} ]</span>
        </button>

      </div>

      {/* Expandable Advanced Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-w-6xl mx-auto overflow-hidden border-b border-white/5 mb-6"
          >
            <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-4">
              
              {/* Category selector */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">Classification Filter</span>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Casual', 'Formal', 'Outerwear', 'Sportswear', 'Accessories'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-zinc-950/40 border border-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price slider */}
              <div className="space-y-3 select-text">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  <span>Price Boundary Limit</span>
                  <span className="text-emerald-400 font-bold">Max: ${priceRange} USD</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                  <span>$50</span>
                  <span>$150</span>
                  <span>$300+</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Product Catalog Listings */}
      <div className="max-w-6xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center border border-white/5 rounded-2xl bg-white/[0.01] space-y-3">
            <span className="text-zinc-600 text-3xl block">◇</span>
            <h3 className="font-serif text-lg text-zinc-400">No Listings Matched Your Filters</h3>
            <p className="text-xs text-zinc-600 max-w-xs mx-auto">Try refining your filter ranges or reset active tags.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveSubTab('All');
                setSelectedCategory('All');
                setPriceRange(300);
              }}
              className="px-4 py-2 mt-4 text-[10px] font-mono uppercase bg-white/5 border border-white/10 hover:border-white/30 rounded-lg cursor-pointer transition-colors"
            >
              [ Clear All Filters ]
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-12">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group flex flex-col justify-between bg-[#08080f]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/20 hover:scale-[1.01] duration-300 transition-all cursor-pointer shadow-2xl relative"
              >
                {/* Visual Cover Artwork */}
                <div className="relative aspect-[4/5] bg-[#09090f] overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104 grayscale-[30%] group-hover:grayscale-0"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=200&auto=format&fit=crop"; }}
                    referrerPolicy="no-referrer"
                  />

                  {/* Promo Badge overlay */}
                  {product.discount && (
                    <div className="absolute top-4 left-4">
                      <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-1 rounded-lg border border-rose-500/20 shadow-md">
                        {product.discount}
                      </span>
                    </div>
                  )}

                  {/* Like/Favorite Toggle */}
                  <button
                    onClick={(e) => toggleLike(product.id, e)}
                    className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedMap[product.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* High coherence matching score indicator */}
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[8px] font-mono bg-violet-600/90 text-white font-bold px-2 py-1 rounded border border-violet-500/10">
                      ★ AI Match 94%
                    </span>
                  </div>
                </div>

                {/* Info and action panel */}
                <div className="p-4 space-y-3 text-left">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                      {product.brand}
                    </span>
                    <h4 className="text-sm text-white font-semibold mt-1 truncate group-hover:text-emerald-300 transition-colors">
                      {product.title}
                    </h4>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-white font-sans font-bold text-sm">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-zinc-500 line-through font-mono text-[11px]">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                      <span className="text-amber-400">★</span>
                      <span>{product.rating}</span>
                      <span className="text-zinc-600">({product.reviews})</span>
                    </div>

                    {/* Quick acquire CTA */}
                    <button
                      onClick={(e) => handleAcquire(product, e)}
                      className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-90 shadow-md shadow-emerald-950/20"
                      title="Add to Closet"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-black font-bold" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
