import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  MessageCircle, 
  RefreshCw, 
  Bookmark, 
  MoreVertical, 
  ShoppingBag, 
  ChevronRight, 
  Users, 
  Calendar,
  Sparkle
} from 'lucide-react';

interface DashboardGridProps {
  // WardrobePanel props
  aiCreationsTab: string;
  setAiCreationsTab: (tab: string) => void;
  aiLooks: any[];
  seedAiLooks: any[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  setActiveSubTab?: (tab: any) => void;

  // CommunityFeed props
  communityTab: string;
  setCommunityTab: (tab: string) => void;
  communityPosts: any[];
  seedCommunityFits: any[];
  toggleBookmark: (id: string) => void;
  bookmarkedPosts: Record<string, boolean>;

  // MarketplacePanel props
  marketplaceTab: string;
  setMarketplaceTab: (tab: string) => void;
  seedMarketplaceProducts: any[];

  // Shared props
  likedPosts: Record<string, boolean>;
  toggleLike: (id: string) => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  aiCreationsTab,
  setAiCreationsTab,
  aiLooks,
  seedAiLooks,
  onAddGarment,
  setActiveSubTab,

  communityTab,
  setCommunityTab,
  communityPosts,
  seedCommunityFits,
  toggleBookmark,
  bookmarkedPosts,

  marketplaceTab,
  setMarketplaceTab,
  seedMarketplaceProducts,

  likedPosts,
  toggleLike
}) => {

  // 1. Resolve AI Creations Items (2 items)
  const aiItems = (aiCreationsTab === 'For You' ? [
    {
      id: 'ai-f-1',
      title: 'Minimal Beige',
      prompt: 'Minimal beige outfit, clean aesthetic',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop',
      likesCount: '2.4K',
      commentsCount: 136,
      creator: 'Elena Rostova',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop'
    },
    {
      id: 'ai-f-2',
      title: 'Y2K Pink Vibes',
      prompt: 'Y2K pink streetwear with cargo pants',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=500&auto=format&fit=crop',
      likesCount: '3.1K',
      commentsCount: 214,
      creator: 'Zaynab',
      creatorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=80&auto=format&fit=crop'
    }
  ] : (aiLooks.length > 0 ? aiLooks : seedAiLooks)).slice(0, 2);

  // 2. Resolve Community Items (2 items)
  const communityItems = (communityTab === 'Following' ? [
    {
      id: 'comm-f-1',
      username: 'Ayesha Malik',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop',
      imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500&auto=format&fit=crop',
      caption: 'Street style walking vibes in urban neutral tones, wool and silk combo.',
      likesCount: '2.6K',
      commentsCount: 89,
      time: '2h ago'
    },
    {
      id: 'comm-f-2',
      username: 'Hamza Ali',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&auto=format&fit=crop',
      imageUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=500&auto=format&fit=crop',
      caption: 'Ready for monochrome tailoring season. Minimal structured overcoat.',
      likesCount: '1.8K',
      commentsCount: 72,
      time: '4h ago'
    }
  ] : (communityPosts.length > 0 ? communityPosts : seedCommunityFits)).slice(0, 2);

  // 3. Resolve Marketplace Items (2 items)
  const marketplaceItems = (marketplaceTab === 'For You' ? [
    {
      id: 'm-f-1',
      brand: 'ZARA',
      title: 'Relaxed Fit Blazer',
      price: 79.99,
      originalPrice: 99.99,
      discount: '-20%',
      rating: '4.8',
      reviews: 128,
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=500&auto=format&fit=crop'
    },
    {
      id: 'm-f-2',
      brand: 'NIKE',
      title: "Air Force 1 '07",
      price: 110.00,
      rating: '4.7',
      reviews: 342,
      imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=500&auto=format&fit=crop'
    }
  ] : seedMarketplaceProducts).slice(0, 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full text-left">
      
      {/* ================= COLUMN 1: AI CREATIONS ================= */}
      <div className="bg-[#080810]/60 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-full shadow-2xl relative overflow-hidden">
        
        {/* Header Block */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-violet-400 fill-violet-400/10" />
              <h3 className="text-xs font-bold font-sans uppercase tracking-widest text-violet-400">AI Creations</h3>
            </div>
            
            {/* Create with AI direct link button */}
            <button
              onClick={() => setActiveSubTab && setActiveSubTab('PRODUCT_AI_CREATIONS')}
              className="bg-violet-600 hover:bg-violet-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-violet-600/15"
            >
              <Sparkle className="w-2.5 h-2.5 fill-white" />
              <span>Create with AI</span>
            </button>
          </div>
          <p className="text-[10.5px] text-zinc-400 font-sans font-light">AI generated looks by our community</p>

          {/* Sub tabs pills */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {['For You', 'Trending', 'New', 'Remix'].map((tab) => (
              <button
                key={tab}
                onClick={() => setAiCreationsTab(tab)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-medium transition-all cursor-pointer ${
                  aiCreationsTab === tab 
                    ? 'bg-[#2e1065] text-[#d8b4fe] border border-[#a855f7]/30 shadow-lg' 
                    : 'bg-[#13131f]/60 text-zinc-400 hover:bg-white/5 hover:text-white border border-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Card Grid (2 cards side-by-side) with internal scroll */}
        <div className="grid grid-cols-2 gap-3.5 mt-4 max-h-[235px] overflow-y-auto no-scrollbar pr-1">
          {aiItems.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a14]/60 border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-300 relative aspect-[3/4.4] group shadow-xl"
            >
              {/* Card Image */}
              <div className="absolute inset-0 bg-zinc-950 z-0">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Top Left AI Generated Badge Overlay */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="text-[8px] font-sans font-semibold bg-black/60 backdrop-blur-md text-violet-300 px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                  <Sparkle className="w-2 h-2 text-violet-400 fill-violet-400" /> AI Generated
                </span>
              </div>

              {/* Top Right Heart Overlay */}
              <button 
                onClick={() => toggleLike(item.id)}
                className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer z-10 active:scale-90"
              >
                <Heart className={`w-3 h-3 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Bottom Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none z-0" />

              {/* Text & Specs */}
              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5 text-left z-10">
                <div>
                  <h4 className="text-[11.5px] font-bold text-white font-sans tracking-wide truncate">{item.title}</h4>
                  <p className="text-[9px] font-sans text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                    Prompt: {item.prompt.replace('Prompt:', '').trim()}
                  </p>
                </div>

                {/* Creator Avatar & Specs Line */}
                <div className="flex items-center gap-1.5 border-t border-white/5 pt-1.5 text-[9px] font-sans text-zinc-400">
                  <img 
                    src={item.creatorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop"} 
                    className="w-3.5 h-3.5 rounded-full object-cover border border-white/10 shrink-0"
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                  <span className="truncate">{item.creator || 'AI Generated'}</span>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 pt-1">
                  <div className="flex gap-2.5">
                    <button onClick={() => toggleLike(item.id)} className={`flex items-center gap-1 hover:text-rose-400 transition-colors ${likedPosts[item.id] ? 'text-rose-400' : ''}`}>
                      <Heart className={`w-3 h-3 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{item.likesCount || '2.4K'}</span>
                    </button>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <MessageCircle className="w-3 h-3" />
                      <span>{item.commentsCount || '136'}</span>
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (onAddGarment) {
                        onAddGarment(item.title, item.prompt, 'Outerwear', { imageUrl: item.imageUrl });
                        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Sartorial alignment parsed and transferred into your active Closet.' }));
                      }
                    }}
                    className="text-violet-400 hover:text-white uppercase font-sans font-bold text-[8.5px] tracking-wider flex items-center gap-1 cursor-pointer bg-violet-500/10 hover:bg-violet-600 px-1.5 py-0.5 rounded transition-all active:scale-95"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Remix</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Footer Button */}
        <div className="border-t border-white/5 pt-4 mt-5 flex justify-center">
          <button 
            onClick={() => setActiveSubTab && setActiveSubTab('PRODUCT_AI_CREATIONS')}
            className="text-violet-400 hover:text-violet-300 font-sans font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-none py-1"
          >
            <span>View more AI looks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ================= COLUMN 2: COMMUNITY ================= */}
      <div className="bg-[#080810]/60 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-full shadow-2xl relative overflow-hidden">
        
        {/* Header Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-blue-400 fill-blue-400/10" />
            <h3 className="text-xs font-bold font-sans uppercase tracking-widest text-blue-400">Community</h3>
          </div>
          <p className="text-[10.5px] text-zinc-400 font-sans font-light">Real people, real looks, real inspiration</p>

          {/* Sub tabs pills */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {['Following', 'Popular', 'New', 'Challenge'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCommunityTab(tab)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-medium transition-all cursor-pointer ${
                  communityTab === tab 
                    ? 'bg-[#1e3a8a] text-[#93c5fd] border border-[#3b82f6]/30 shadow-lg' 
                    : 'bg-[#13131f]/60 text-zinc-400 hover:bg-white/5 hover:text-white border border-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Card Grid (2 cards side-by-side) with internal scroll */}
        <div className="grid grid-cols-2 gap-3.5 mt-4 max-h-[235px] overflow-y-auto no-scrollbar pr-1">
          {communityItems.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a14]/60 border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-blue-500/20 hover:scale-[1.01] transition-all duration-300 relative aspect-[3/4.4] group shadow-xl"
            >
              {/* Card Image */}
              <div className="absolute inset-0 bg-zinc-950 z-0">
                <img 
                  src={item.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"; }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Community User Header Overlay */}
              <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 min-w-0">
                  <img 
                    src={item.userAvatar} 
                    className="w-5 h-5 rounded-full object-cover border border-white/10 shrink-0" 
                    alt="" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <span className="block text-[9.5px] font-bold text-white leading-none truncate">{item.username}</span>
                    <span className="block text-[7.5px] font-mono text-zinc-400 leading-none mt-0.5">{item.time || '2h ago'}</span>
                  </div>
                </div>

                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Connecting to stylist network node.' }))}
                  className="p-1 text-zinc-400 hover:text-white bg-[#0e0e18]/80 hover:bg-[#1a1a2b] rounded-full border border-white/5 transition-all cursor-pointer shrink-0"
                >
                  <MoreVertical className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Bottom Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none z-0" />

              {/* Caption details */}
              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2 text-left z-10">
                <p className="text-[9px] text-zinc-200 line-clamp-2 leading-relaxed font-sans">{item.caption}</p>

                {/* Footer Stats row */}
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 pt-1.5 border-t border-white/5">
                  <div className="flex gap-2.5">
                    <button onClick={() => toggleLike(item.id)} className={`flex items-center gap-1 hover:text-rose-400 transition-colors ${likedPosts[item.id] ? 'text-rose-400' : ''}`}>
                      <Heart className={`w-3 h-3 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{item.likesCount || '2.6K'}</span>
                    </button>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <MessageCircle className="w-3 h-3" />
                      <span>{item.commentsCount || '89'}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`hover:text-blue-400 transition-all p-1 rounded bg-[#0e0e18]/80 border border-white/5 shrink-0 ${bookmarkedPosts[item.id] ? 'text-blue-400' : 'text-zinc-500'}`}
                  >
                    <Bookmark className={`w-2.5 h-2.5 ${bookmarkedPosts[item.id] ? 'fill-blue-400 text-blue-400' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Footer Button */}
        <div className="border-t border-white/5 pt-4 mt-5 flex justify-center">
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('lookvision_navigate', { detail: 'COMMUNITY_ROOM' }));
            }}
            className="text-blue-400 hover:text-blue-300 font-sans font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-none py-1"
          >
            <span>Explore community</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ================= COLUMN 3: MARKETPLACE ================= */}
      <div className="bg-[#080810]/60 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-full shadow-2xl relative overflow-hidden">
        
        {/* Header Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4.5 h-4.5 text-emerald-400 fill-emerald-400/10" />
            <h3 className="text-xs font-bold font-sans uppercase tracking-widest text-emerald-400">Marketplace</h3>
          </div>
          <p className="text-[10.5px] text-zinc-400 font-sans font-light">Shop real products from top brands</p>

          {/* Sub tabs pills */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {['For You', 'New In', 'Brands', 'Sale'].map((tab) => (
              <button
                key={tab}
                onClick={() => setMarketplaceTab(tab)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-medium transition-all cursor-pointer ${
                  marketplaceTab === tab 
                    ? 'bg-[#064e3b] text-[#6ee7b7] border border-[#10b981]/30 shadow-lg' 
                    : 'bg-[#13131f]/60 text-zinc-400 hover:bg-white/5 hover:text-white border border-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Card Grid (2 cards side-by-side) with internal scroll */}
        <div className="grid grid-cols-2 gap-3.5 mt-4 max-h-[235px] overflow-y-auto no-scrollbar pr-1">
          {marketplaceItems.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a14]/60 border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-emerald-500/20 hover:scale-[1.01] transition-all duration-300 relative aspect-[3/4.4] group shadow-xl"
            >
              {/* Card Image */}
              <div 
                onClick={() => window.dispatchEvent(new CustomEvent('lookvision_view_product', { detail: item }))}
                className="absolute inset-0 bg-zinc-950 z-0 cursor-pointer"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=200&auto=format&fit=crop"; }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Top Left Discount Badge */}
              {item.discount && (
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded border border-red-500/20 shadow-md">
                    {item.discount}
                  </span>
                </div>
              )}

              {/* Top Right Heart Overlay */}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer z-10 active:scale-90"
              >
                <Heart className={`w-3 h-3 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Bottom Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none z-0" />

              {/* Text & Specs */}
              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5 text-left z-10">
                <div 
                  onClick={() => window.dispatchEvent(new CustomEvent('lookvision_view_product', { detail: item }))}
                  className="cursor-pointer"
                >
                  <span className="text-[8.5px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">{item.brand}</span>
                  <h4 className="text-[11.5px] font-bold text-white font-sans truncate mt-0.5 hover:text-emerald-300 transition-colors">{item.title}</h4>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-mono">
                  <span className="text-amber-400 font-bold">★</span>
                  <span>{item.rating || '4.8'}</span>
                  <span className="text-zinc-500">({item.reviews || '128'})</span>
                </div>

                {/* Price and Add to Closet Cart Button */}
                <div className="flex justify-between items-end pt-1.5 border-t border-white/5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-white font-extrabold text-xs">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-zinc-500 line-through font-mono text-[9px]">${item.originalPrice}</span>
                    )}
                  </div>

                  <button 
                    onClick={() => {
                      if (onAddGarment) {
                        onAddGarment(item.title, `Purchased piece from ${item.brand}`, 'Casual', { imageUrl: item.imageUrl, price: item.price });
                        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Registered ${item.title} into your local Closet!` }));
                      }
                    }}
                    className="w-7 h-7 rounded-lg bg-[#10b981] hover:bg-[#059669] text-black flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-90 shadow-lg shadow-emerald-900/20"
                    title="Add to Closet"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-black font-extrabold" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Footer Button */}
        <div className="border-t border-white/5 pt-4 mt-5 flex justify-center">
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('lookvision_navigate', { detail: 'MARKETPLACE_ROOM' }));
            }}
            className="text-emerald-400 hover:text-emerald-300 font-sans font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-none py-1"
          >
            <span>Shop all products</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
