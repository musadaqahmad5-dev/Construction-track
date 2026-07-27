import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, ChevronRight } from 'lucide-react';

interface MarketplacePanelProps {
  marketplaceTab: string;
  setMarketplaceTab: (tab: string) => void;
  seedMarketplaceProducts: any[];
  likedPosts: Record<string, boolean>;
  toggleLike: (id: string) => void;
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
}

export const MarketplacePanel: React.FC<MarketplacePanelProps> = ({
  marketplaceTab,
  setMarketplaceTab,
  seedMarketplaceProducts,
  likedPosts,
  toggleLike,
  onAddGarment
}) => {
  return (
    <div className="lg:col-span-1 space-y-6 bg-gradient-to-b from-[#07070c] to-transparent p-5 rounded-3xl border border-white/5 shadow-2xl">
      <div className="space-y-2 pb-3 border-b border-white/5 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4.5 h-4.5 text-emerald-400 fill-emerald-400/5 animate-pulse" />
            <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-white">Boutique</h3>
          </div>
          <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Storefront</span>
        </div>
        <p className="text-[10px] text-zinc-500 font-sans leading-relaxed font-light">Acquire real luxury and street apparel catalog items</p>
        
        {/* Elegant sub-tabs */}
        <div className="flex flex-wrap gap-1.5 pt-3">
          {['For You', 'New In', 'Brands', 'Sale'].map((tab) => (
            <button
              key={tab}
              onClick={() => setMarketplaceTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-sans font-semibold transition-all cursor-pointer ${
                marketplaceTab === tab 
                  ? 'bg-[#183a2b] border border-emerald-500/35 text-emerald-400 shadow-lg shadow-emerald-950/25' 
                  : 'bg-[#0f0f18]/60 text-zinc-400 hover:bg-white/5 hover:text-white border border-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {(marketplaceTab === 'For You' ? [
          {
            id: 'm-f-1',
            brand: 'ZARA MAN COUTURE',
            title: 'Relaxed Fit Double-Breasted Blazer',
            price: 79.99,
            originalPrice: 99.99,
            discount: '20% OFF',
            rating: '4.8',
            reviews: 128,
            imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=500&auto=format&fit=crop'
          },
          {
            id: 'm-f-2',
            brand: 'NIKE LAB SERIES',
            title: "Air Force 1 '07 Premium Retro",
            price: 110.00,
            rating: '4.7',
            reviews: 342,
            imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=500&auto=format&fit=crop'
          }
        ] : seedMarketplaceProducts).map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#080810] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:scale-[1.01] duration-300 transition-all group shadow-2xl flex flex-col justify-between relative"
          >
            <div 
              onClick={() => window.dispatchEvent(new CustomEvent('lookvision_view_product', { detail: item }))}
              className="relative aspect-[3/4] overflow-hidden bg-zinc-950 cursor-pointer"
            >
              <img src={item.imageUrl || null} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=200&auto=format&fit=crop"; }}
              />
              {item.discount && (
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-1 rounded-lg border border-rose-500/20 shadow-md">
                    {item.discount}
                  </span>
                </div>
              )}

              <button 
                onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                className="absolute top-3.5 right-3.5 p-2 bg-black/70 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer z-10"
              >
                <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            <div className="p-4 space-y-3 text-left bg-[#080810]">
              <div 
                onClick={() => window.dispatchEvent(new CustomEvent('lookvision_view_product', { detail: item }))}
                className="cursor-pointer"
              >
                <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">{item.brand}</span>
                <h4 className="text-[12px] text-white font-sans font-bold mt-1 truncate tracking-wide hover:text-emerald-300 transition-colors">{item.title}</h4>
                <div className="mt-2 flex items-center gap-2">
                  {item.originalPrice ? (
                    <>
                      <span className="text-white font-sans font-extrabold text-sm">${item.price}</span>
                      <span className="text-zinc-500 line-through font-mono text-[11px]">${item.originalPrice}</span>
                    </>
                  ) : (
                    <span className="text-white font-sans font-extrabold text-sm">${item.price}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <div className="flex items-center gap-1 text-[10.5px] text-zinc-400 font-mono">
                  <span className="text-amber-400 font-bold">★</span>
                  <span>{item.rating}</span>
                  <span className="text-zinc-600">({item.reviews})</span>
                </div>
                
                <button 
                  onClick={() => {
                    if (onAddGarment) {
                      onAddGarment(item.title, `Purchased piece from ${item.brand}`, 'Casual', { imageUrl: item.imageUrl, price: item.price });
                      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Registered ${item.title} into your local Closet!` }));
                    }
                  }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-90 shadow-lg shadow-emerald-900/10"
                  title="Add to Closet"
                >
                  <ShoppingBag className="w-4 h-4 text-black font-extrabold" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={() => {
          window.dispatchEvent(new CustomEvent('lookvision_navigate', { detail: 'MARKETPLACE_ROOM' }));
        }}
        className="w-full py-3 bg-[#0c1a14]/80 hover:bg-[#143325]/20 border border-emerald-500/15 hover:border-emerald-500/30 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <span>Browse All Boutiques</span>
        <ChevronRight className="w-4 h-4 animate-pulse" />
      </button>
    </div>
  );
};
