import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Heart, Share2, Wand2, ShoppingBag, Eye, Volume2, VolumeX, 
  Play, Pause, ChevronDown, CheckCircle2, ShieldCheck, Zap, Layers, 
  Tag, Compass, Plus, ArrowUpRight, Check, X, Copy, ExternalLink,
  MessageCircle, Bookmark, RefreshCw, SlidersHorizontal, Store
} from 'lucide-react';
import { WardrobeItem } from '../types';

export interface BundledProductItem {
  id: string;
  title: string;
  vendorName: string;
  vendorHandle: string;
  price: number;
  category: 'Outerwear' | 'Top' | 'Bottom' | 'Footwear' | 'Accessories';
  imageUrl: string;
  inStock: boolean;
  selected?: boolean;
}

export interface StyleFeedAsset {
  id: string;
  mediaType: 'video' | 'image';
  mediaUrl: string;
  posterUrl?: string;
  aspectRatio?: string;
  title: string;
  description: string;
  aestheticCategory: string;
  aiPrompt: string;
  creator: {
    name: string;
    handle: string;
    avatarUrl: string;
    isVerified: boolean;
    tier: string;
    royaltyPercentage: number;
  };
  metrics: {
    likes: number;
    remixes: number;
    shares: number;
    suitabilityScore: number;
  };
  bundle: {
    bundleDiscountPercent: number;
    items: BundledProductItem[];
  };
  tags: string[];
}

export interface AIStyleFeedProps {
  userWardrobe?: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onNavigateToTab?: (tab: string) => void;
  onInstantBuy?: (asset: StyleFeedAsset, selectedItems: BundledProductItem[]) => void;
}

// Initial Curated Stream of Fashion Assets (Dual Video & Image AI Renderings)
const INITIAL_FEED_ASSETS: StyleFeedAsset[] = [
  {
    id: 'look-runway-01',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-neon-illuminated-room-39878-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    title: 'Tokyo Midnight Cyber-Tailoring',
    description: 'High-density matte charcoal wool paired with kinetic reflective piping and structured shoulder draping for dusk studio presentations.',
    aestheticCategory: 'Cyber Couture',
    aiPrompt: 'Hyper-tailored double-breasted structured overcoat in virgin charcoal wool, luminescent graphite edge seam piping, Tokyo neo-noir atmospheric lighting, architectural silhouette, 8k octane render',
    creator: {
      name: 'Elena Rostova',
      handle: '@elena_luxe',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      tier: 'Master Curateur',
      royaltyPercentage: 88,
    },
    metrics: {
      likes: 1840,
      remixes: 420,
      shares: 310,
      suitabilityScore: 97,
    },
    bundle: {
      bundleDiscountPercent: 15,
      items: [
        {
          id: 'bundle-01-coat',
          title: 'Architectural Charcoal Wool Overcoat',
          vendorName: 'Atelier Rostova Milano',
          vendorHandle: '@rostova_milano',
          price: 520,
          category: 'Outerwear',
          imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop',
          inStock: true,
          selected: true,
        },
        {
          id: 'bundle-01-pants',
          title: 'Pleated Matte Wool Trousers',
          vendorName: 'Kuro Studio Tokyo',
          vendorHandle: '@kuro_studio',
          price: 260,
          category: 'Bottom',
          imageUrl: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=400&auto=format&fit=crop',
          inStock: true,
          selected: true,
        },
        {
          id: 'bundle-01-boots',
          title: 'Structured Chelsea Platform Boots',
          vendorName: 'Vance Leatherworks',
          vendorHandle: '@vance_atelier',
          price: 340,
          category: 'Footwear',
          imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=400&auto=format&fit=crop',
          inStock: true,
          selected: true,
        },
      ],
    },
    tags: ['#TokyoRunway', '#CyberCouture', '#MonochromeLuxury', '#StructuredDrape'],
  },
  {
    id: 'look-couture-02',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    title: 'Avant-Garde Architectural Drapes',
    description: 'Volumetric sculpted canary outerwear over deconstructed monochromatic layers with geometric asymmetry.',
    aestheticCategory: 'Avant-Garde',
    aiPrompt: 'High-concept haute couture look, sculptural bold yellow tailored outerwear, deconstructed minimalist underlayers, clean gallery spotlight, editorial fashion photography',
    creator: {
      name: 'Julian Vance',
      handle: '@julian_cyber',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      tier: 'Avant Stylist',
      royaltyPercentage: 85,
    },
    metrics: {
      likes: 2490,
      remixes: 680,
      shares: 512,
      suitabilityScore: 94,
    },
    bundle: {
      bundleDiscountPercent: 20,
      items: [
        {
          id: 'bundle-02-jacket',
          title: 'Sculpted Canary Kinetic Anorak',
          vendorName: 'Vance Studio Neo',
          vendorHandle: '@vance_neo',
          price: 480,
          category: 'Outerwear',
          imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop',
          inStock: true,
          selected: true,
        },
        {
          id: 'bundle-02-knit',
          title: 'Seamless Ribbed Mockneck',
          vendorName: 'Atelier Rostova',
          vendorHandle: '@rostova_milano',
          price: 190,
          category: 'Top',
          imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop',
          inStock: true,
          selected: true,
        },
      ],
    },
    tags: ['#SculpturalCouture', '#AvantGarde', '#VibrantMinimalism'],
  },
  {
    id: 'look-runway-03',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-walking-down-a-runway-at-a-fashion-show-42352-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop',
    title: 'Parisian Obsidian Trench Symphony',
    description: 'Floor-sweeping structured silk-wool trench with cinched belt detailing and fluid walking drape designed for Paris Fashion Week.',
    aestheticCategory: 'Haute Runway',
    aiPrompt: 'Parisian fashion week runway show, model in floor-sweeping obsidian silk-wool trench coat, cinched waist, flowing fabric movement, cinematic bokeh lights',
    creator: {
      name: 'Clara Moreau',
      handle: '@clara_couture',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      tier: 'Grand Couturier',
      royaltyPercentage: 90,
    },
    metrics: {
      likes: 3120,
      remixes: 890,
      shares: 740,
      suitabilityScore: 99,
    },
    bundle: {
      bundleDiscountPercent: 18,
      items: [
        {
          id: 'bundle-03-trench',
          title: 'Monolithic Obsidian Silk Trench',
          vendorName: 'Maison Moreau Paris',
          vendorHandle: '@moreau_paris',
          price: 680,
          category: 'Outerwear',
          imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop',
          inStock: true,
          selected: true,
        },
        {
          id: 'bundle-03-gloves',
          title: 'Supple Nappa Leather Opera Gloves',
          vendorName: 'Maison Moreau Paris',
          vendorHandle: '@moreau_paris',
          price: 150,
          category: 'Accessories',
          imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop',
          inStock: true,
          selected: true,
        },
      ],
    },
    tags: ['#ParisFashionWeek', '#ObsidianLuxury', '#HauteRunway', '#SilkWool'],
  },
  {
    id: 'look-linen-04',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    title: 'Milano Quiet Sandstone Linen Suite',
    description: 'Subtle tonal earth shades layered in organic Belgian flax linen, capturing quiet Mediterranean confidence.',
    aestheticCategory: 'Quiet Luxury',
    aiPrompt: 'Relaxed sandstone linen tailored outfit, soft natural coastal lighting, tonal earth tones, effortless Mediterranean elegance, minimalist luxury lookbook',
    creator: {
      name: 'Elena Rostova',
      handle: '@elena_luxe',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      tier: 'Master Curateur',
      royaltyPercentage: 88,
    },
    metrics: {
      likes: 1980,
      remixes: 340,
      shares: 280,
      suitabilityScore: 92,
    },
    bundle: {
      bundleDiscountPercent: 12,
      items: [
        {
          id: 'bundle-04-shirt',
          title: 'Belgian Flax Oversized Linen Overshirt',
          vendorName: 'Atelier Rostova Milano',
          vendorHandle: '@rostova_milano',
          price: 240,
          category: 'Top',
          imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop',
          inStock: true,
          selected: true,
        },
        {
          id: 'bundle-04-pant',
          title: 'Ecru Wide-Leg Linen Trousers',
          vendorName: 'Atelier Rostova Milano',
          vendorHandle: '@rostova_milano',
          price: 280,
          category: 'Bottom',
          imageUrl: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=400&auto=format&fit=crop',
          inStock: true,
          selected: true,
        },
      ],
    },
    tags: ['#QuietLuxury', '#LinenDrape', '#MilanoStyle', '#EarthTones'],
  }
];

// Aesthetic Feed Filter Categories
const FEED_CATEGORIES = [
  'All Discoveries',
  'Haute Runway',
  'Cyber Couture',
  'Avant-Garde',
  'Quiet Luxury',
  'Streetwear Noir'
];

export const AIStyleFeed: React.FC<AIStyleFeedProps> = ({
  userWardrobe = [],
  onAddGarment,
  onNavigateToTab,
  onInstantBuy
}) => {
  const [feedItems, setFeedItems] = useState<StyleFeedAsset[]>(INITIAL_FEED_ASSETS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Discoveries');
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [isGlobalMuted, setIsGlobalMuted] = useState<boolean>(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [remixModalAsset, setRemixModalAsset] = useState<StyleFeedAsset | null>(null);
  const [checkoutModalAsset, setCheckoutModalAsset] = useState<{
    asset: StyleFeedAsset;
    selectedItems: BundledProductItem[];
  } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All Discoveries') return feedItems;
    return feedItems.filter(item => item.aestheticCategory === selectedCategory);
  }, [feedItems, selectedCategory]);

  // Infinite Scroll Generator Hook
  const generateMoreAssets = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      const generatedTemplates: StyleFeedAsset[] = [
        {
          id: `look-synth-${Date.now()}-1`,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
          title: 'Nordic Architectural Wool Cape',
          description: 'Sculpted heavy felt cape in glacial grey with raw-edge seams and hidden magnet closures.',
          aestheticCategory: 'Quiet Luxury',
          aiPrompt: 'Nordic minimalist architectural wool cape, glacial grey tones, high contrast studio lighting, editorial fashion lookbook, 8k resolution',
          creator: {
            name: 'Elena Rostova',
            handle: '@elena_luxe',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            isVerified: true,
            tier: 'Master Curateur',
            royaltyPercentage: 88,
          },
          metrics: {
            likes: 1240,
            remixes: 210,
            shares: 190,
            suitabilityScore: 95,
          },
          bundle: {
            bundleDiscountPercent: 15,
            items: [
              {
                id: `bundle-gen-${Date.now()}-1`,
                title: 'Nordic Sculpted Wool Cape',
                vendorName: 'Atelier Rostova Milano',
                vendorHandle: '@rostova_milano',
                price: 490,
                category: 'Outerwear',
                imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop',
                inStock: true,
                selected: true,
              },
              {
                id: `bundle-gen-${Date.now()}-2`,
                title: 'Cashmere Ribbed Turtleneck',
                vendorName: 'Kuro Studio Tokyo',
                vendorHandle: '@kuro_studio',
                price: 210,
                category: 'Top',
                imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop',
                inStock: true,
                selected: true,
              }
            ]
          },
          tags: ['#NordicCouture', '#FeltCape', '#GlacialMinimalism']
        },
        {
          id: `look-synth-${Date.now()}-2`,
          mediaType: 'video',
          mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-studio-with-red-lighting-39880-large.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
          title: 'Cyberpunk Crimson Tactical Armor',
          description: 'Waterproof technical trench coat with magnetic modular chest pouches and iridescent crimson reflections.',
          aestheticCategory: 'Cyber Couture',
          aiPrompt: 'Cyberpunk tactical streetwear lookbook, waterproof high-tech crimson and black shell jacket, modular webbing, studio neon atmosphere',
          creator: {
            name: 'Julian Vance',
            handle: '@julian_cyber',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            isVerified: true,
            tier: 'Avant Stylist',
            royaltyPercentage: 85,
          },
          metrics: {
            likes: 3820,
            remixes: 940,
            shares: 820,
            suitabilityScore: 98,
          },
          bundle: {
            bundleDiscountPercent: 20,
            items: [
              {
                id: `bundle-gen-${Date.now()}-3`,
                title: 'Crimson Tech-Shell Overcoat',
                vendorName: 'Vance Studio Neo',
                vendorHandle: '@vance_neo',
                price: 540,
                category: 'Outerwear',
                imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=400&auto=format&fit=crop',
                inStock: true,
                selected: true,
              },
              {
                id: `bundle-gen-${Date.now()}-4`,
                title: 'Modular Magnetic Chest Rig',
                vendorName: 'Vance Studio Neo',
                vendorHandle: '@vance_neo',
                price: 180,
                category: 'Accessories',
                imageUrl: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=400&auto=format&fit=crop',
                inStock: true,
                selected: true,
              }
            ]
          },
          tags: ['#TacticalArmor', '#CyberStreetwear', '#CrimsonTech']
        }
      ];

      setFeedItems(prev => [...prev, ...generatedTemplates]);
      setIsLoadingMore(false);
      
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: { message: 'AI discovery stream synthesized new lookbook entries', type: 'info' }
      }));
    }, 900);
  }, [isLoadingMore]);

  // Like Toggle Handler with Spring Animation
  const handleToggleLike = (id: string) => {
    setLikedMap(prev => {
      const nextState = !prev[id];
      if (nextState) {
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
          detail: { message: 'Added to your Sartorial Favorites!', type: 'success' }
        }));
      }
      return { ...prev, [id]: nextState };
    });
  };

  // Bookmark Toggle Handler
  const handleToggleBookmark = (id: string) => {
    setBookmarkedMap(prev => {
      const nextState = !prev[id];
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: { 
          message: nextState ? 'Lookbook saved to your private style board' : 'Removed from style board',
          type: 'info'
        }
      }));
      return { ...prev, [id]: nextState };
    });
  };

  // Share Look Handler
  const handleShareLook = async (asset: StyleFeedAsset) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI Fashion Look: ${asset.title}`,
          text: `Check out ${asset.title} by ${asset.creator.name} on LookVision AI Market.`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        copyLinkToClipboard(asset);
      }
    } else {
      copyLinkToClipboard(asset);
    }
  };

  const copyLinkToClipboard = (asset: StyleFeedAsset) => {
    navigator.clipboard.writeText(`${window.location.origin}/discover?look=${asset.id}`);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: { message: 'Direct lookbook link copied to clipboard!', type: 'success' }
    }));
  };

  // Copy Prompt to Clipboard
  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: { message: 'Generative prompt copied to clipboard!', type: 'success' }
    }));
  };

  // Send to AI Creator Studio
  const handleRemixInStudio = (asset: StyleFeedAsset) => {
    setRemixModalAsset(null);
    if (onNavigateToTab) {
      onNavigateToTab('PRODUCT_AI_CREATIONS');
    } else {
      window.dispatchEvent(new CustomEvent('lookvision_navigate', { detail: 'PRODUCT_AI_CREATIONS' }));
    }
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: { message: `Prompt loaded for remixing "${asset.title}"`, type: 'info' }
    }));
  };

  return (
    <div id="ai-style-feed-root" className="relative w-full h-full min-h-screen bg-[#05050a] text-zinc-100 flex flex-col items-center select-none overflow-hidden">
      
      {/* Top Floating Aesthetic Filter Bar */}
      <header className="sticky top-0 z-30 w-full max-w-2xl px-4 pt-3 pb-2 flex items-center justify-between gap-3 bg-[#05050a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <div className="w-full h-full bg-[#07070c] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-wider uppercase text-white flex items-center gap-1.5">
              <span>Sartorial Stream</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h1>
            <span className="text-[10px] font-mono text-zinc-400">Live 60 FPS Generative AI Stream</span>
          </div>
        </div>

        {/* Global Audio Toggle */}
        <button
          onClick={() => setIsGlobalMuted(!isGlobalMuted)}
          className="p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer"
          title={isGlobalMuted ? 'Unmute video stream' : 'Mute video stream'}
          aria-label={isGlobalMuted ? 'Unmute video stream' : 'Mute video stream'}
        >
          {isGlobalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
        </button>
      </header>

      {/* Horizontal Aesthetic Category Scroller */}
      <nav className="w-full max-w-2xl px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar z-20 bg-[#05050a]/60 backdrop-blur-md">
        {FEED_CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]' 
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </nav>

      {/* Main Snap Feed Stream Container */}
      <main 
        ref={containerRef}
        className="w-full max-w-2xl flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar h-[calc(100vh-6.5rem)] md:h-[calc(100vh-7rem)] pb-12"
        style={{
          scrollBehavior: 'smooth',
          contain: 'content',
        }}
      >
        {filteredItems.map((asset, idx) => (
          <FeedCard
            key={asset.id}
            asset={asset}
            index={idx}
            isActive={activeItemIndex === idx}
            isGlobalMuted={isGlobalMuted}
            isLiked={!!likedMap[asset.id]}
            isBookmarked={!!bookmarkedMap[asset.id]}
            onToggleLike={() => handleToggleLike(asset.id)}
            onToggleBookmark={() => handleToggleBookmark(asset.id)}
            onOpenRemix={() => setRemixModalAsset(asset)}
            onShare={() => handleShareLook(asset)}
            onInstantBuy={(selectedItems) => {
              if (onInstantBuy) {
                onInstantBuy(asset, selectedItems);
              } else {
                setCheckoutModalAsset({ asset, selectedItems });
              }
            }}
            onVisible={() => {
              setActiveItemIndex(idx);
              // Trigger infinite loading when near end
              if (idx >= filteredItems.length - 2) {
                generateMoreAssets();
              }
            }}
          />
        ))}

        {/* Infinite Loading Indicator */}
        {isLoadingMore && (
          <div className="w-full h-28 snap-start flex items-center justify-center gap-3 text-xs font-mono text-zinc-500">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Synthesizing next generative lookbook vectors...</span>
          </div>
        )}
      </main>

      {/* AI Prompt Remix Modal */}
      <AnimatePresence>
        {remixModalAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-lg rounded-2xl bg-[#07070c] border border-white/10 p-6 shadow-2xl space-y-5 relative"
            >
              <button
                onClick={() => setRemixModalAsset(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Remix Generative Style Prompt</h3>
                  <p className="text-xs text-zinc-400">Created by {remixModalAsset.creator.name} ({remixModalAsset.creator.tier})</p>
                </div>
              </div>

              {/* Prompt Text Container */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>Generative Synthesis Prompt</span>
                  <span className="text-indigo-400">Model: LookVision Core v3</span>
                </div>
                <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs text-zinc-200 leading-relaxed max-h-40 overflow-y-auto">
                  "{remixModalAsset.aiPrompt}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleCopyPrompt(remixModalAsset.aiPrompt)}
                  className="py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
                  <span>{copiedPrompt ? 'Copied Prompt' : 'Copy Prompt'}</span>
                </button>

                <button
                  onClick={() => handleRemixInStudio(remixModalAsset)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open in AI Studio</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Express Checkout Modal */}
      <AnimatePresence>
        {checkoutModalAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md rounded-2xl bg-[#07070c] border border-emerald-500/30 p-6 shadow-2xl space-y-5 relative"
            >
              <button
                onClick={() => setCheckoutModalAsset(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Instant Express Checkout</h3>
                  <span className="text-xs font-mono text-emerald-400">Cross-Seller Multi-Vendor Bundle</span>
                </div>
              </div>

              {/* Selected Garments List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {checkoutModalAsset.selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded-lg object-cover bg-zinc-900" />
                      <div>
                        <h4 className="text-xs font-medium text-white truncate max-w-[180px]">{item.title}</h4>
                        <span className="text-[10px] text-zinc-400">{item.vendorName}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">${item.price}</span>
                  </div>
                ))}
              </div>

              {/* Bundle Pricing Summary */}
              {(() => {
                const totalOriginal = checkoutModalAsset.selectedItems.reduce((acc, i) => acc + i.price, 0);
                const discount = Math.round(totalOriginal * (checkoutModalAsset.asset.bundle.bundleDiscountPercent / 100));
                const finalTotal = totalOriginal - discount;

                return (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Subtotal ({checkoutModalAsset.selectedItems.length} items)</span>
                      <span>${totalOriginal}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-400">
                      <span>Bundle Cross-Seller Discount ({checkoutModalAsset.asset.bundle.bundleDiscountPercent}%)</span>
                      <span>-${discount}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-emerald-500/20">
                      <span>Total Amount</span>
                      <span className="text-emerald-400 font-mono">${finalTotal}</span>
                    </div>
                  </div>
                );
              })()}

              <button
                onClick={() => {
                  setCheckoutModalAsset(null);
                  window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                    detail: { message: 'Order placed successfully via ARIA Express Checkout!', type: 'success' }
                  }));
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Authorize Instant Payment</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: VIRTUALIZED FEED CARD
// ==========================================
interface FeedCardProps {
  asset: StyleFeedAsset;
  index: number;
  isActive: boolean;
  isGlobalMuted: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onOpenRemix: () => void;
  onShare: () => void;
  onInstantBuy: (selectedItems: BundledProductItem[]) => void;
  onVisible: () => void;
}

const FeedCard: React.FC<FeedCardProps> = ({
  asset,
  index,
  isActive,
  isGlobalMuted,
  isLiked,
  isBookmarked,
  onToggleLike,
  onToggleBookmark,
  onOpenRemix,
  onShare,
  onInstantBuy,
  onVisible
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [selectedBundleItems, setSelectedBundleItems] = useState<BundledProductItem[]>(
    asset.bundle.items.filter(i => i.selected !== false)
  );
  const [isBundleDrawerOpen, setIsBundleDrawerOpen] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  // Viewport Intersection Observer for 60 FPS Flat Memory Performance
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          onVisible();
          if (asset.mediaType === 'video' && videoRef.current) {
            videoRef.current.play().catch(() => {
              // Browser auto-play policy catch
              setIsPlaying(false);
            });
            setIsPlaying(true);
          }
        } else {
          if (asset.mediaType === 'video' && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: [0.6] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [asset.mediaType, onVisible]);

  // Video Time Update Listener for Custom Progress Bar
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setVideoProgress((current / duration) * 100);
  };

  // Toggle Video Play / Pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle Single Item in Multi-Vendor Bundle
  const toggleBundleItem = (item: BundledProductItem) => {
    setSelectedBundleItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least one item
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  // Bundle Pricing Math
  const totalBundleOriginalPrice = useMemo(() => {
    return selectedBundleItems.reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedBundleItems]);

  const bundleDiscountAmount = useMemo(() => {
    return Math.round(totalBundleOriginalPrice * (asset.bundle.bundleDiscountPercent / 100));
  }, [totalBundleOriginalPrice, asset.bundle.bundleDiscountPercent]);

  const discountedBundlePrice = totalBundleOriginalPrice - bundleDiscountAmount;

  return (
    <div
      ref={cardRef}
      id={`feed-card-${asset.id}`}
      className="w-full h-[calc(100vh-8.5rem)] md:h-[calc(100vh-9.5rem)] min-h-[560px] snap-start snap-always p-2 flex items-center justify-center relative"
      style={{
        containIntrinsicSize: '0 750px',
        contentVisibility: 'auto'
      }}
    >
      {/* Visual Asset Container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#07070c] border border-white/5 group hover:border-violet-500/20 transition-all duration-300 shadow-2xl flex items-center justify-center">
        
        {/* ==========================================
            DUAL MEDIA RENDERER ENGINE
           ========================================== */}
        {asset.mediaType === 'video' ? (
          <div 
            onClick={togglePlayPause}
            className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer overflow-hidden"
          >
            <video
              ref={videoRef}
              src={asset.mediaUrl}
              poster={asset.posterUrl}
              playsInline
              loop
              muted={isGlobalMuted}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Play / Pause Glassmorphic Overlay Icon (Fades on active playback) */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
                >
                  <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white shadow-2xl">
                    <Play className="w-7 h-7 ml-1 text-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-100"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-[#07070c] overflow-hidden">
            {/* Shimmer Placeholder during asset load */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-white/[0.03] animate-pulse flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-400/40 animate-spin" />
              </div>
            )}
            <img
              src={asset.mediaUrl}
              alt={asset.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setIsImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        )}

        {/* Ambient Dark Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

        {/* Top Badges & Aesthetic Pill */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium tracking-wide text-indigo-300 flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{asset.aestheticCategory}</span>
          </span>
          <span className="px-2 py-1 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
            {asset.metrics.suitabilityScore}% Style Match
          </span>
        </div>

        {/* ==========================================
            RIGHT FLOATING ACTION BUTTONS (LUCIDE ICONS)
           ========================================== */}
        <div className="absolute right-3.5 bottom-24 z-20 flex flex-col items-center gap-3.5">
          
          {/* Like / Upvote Button with Spring Physics */}
          <div className="flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike();
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all cursor-pointer shadow-xl ${
                isLiked 
                  ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
                  : 'bg-black/60 text-zinc-300 border-white/10 hover:text-white hover:bg-black/80'
              }`}
              title="Like look"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
            <span className="text-[10px] font-mono font-semibold text-white mt-1 drop-shadow-md">
              {asset.metrics.likes + (isLiked ? 1 : 0)}
            </span>
          </div>

          {/* Remix Generative Style Prompt Button */}
          <div className="flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenRemix();
              }}
              className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 text-zinc-300 hover:text-indigo-300 flex items-center justify-center transition-all cursor-pointer shadow-xl"
              title="Remix style prompt"
            >
              <Wand2 className="w-5 h-5" />
            </motion.button>
            <span className="text-[10px] font-mono text-zinc-300 mt-1 drop-shadow-md">
              {asset.metrics.remixes}
            </span>
          </div>

          {/* Bookmark Button */}
          <div className="flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark();
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all cursor-pointer shadow-xl ${
                isBookmarked 
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                  : 'bg-black/60 text-zinc-300 border-white/10 hover:text-white hover:bg-black/80'
              }`}
              title="Bookmark look"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Share Look Button */}
          <div className="flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xl"
              title="Share look"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* ==========================================
            INTEGRATED COMMERCE & CREATOR OVERLAY
           ========================================== */}
        <div className="absolute left-3.5 right-18 bottom-3.5 z-20 flex flex-col gap-2">
          
          {/* Creator Brand Badge & Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <img 
                src={asset.creator.avatarUrl} 
                alt={asset.creator.name} 
                className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-md" 
              />
              <span className="text-xs font-semibold text-white tracking-wide flex items-center gap-1">
                <span>{asset.creator.name}</span>
                {asset.creator.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                {asset.creator.handle}
              </span>
            </div>

            <h2 className="text-sm md:text-base font-bold text-white tracking-tight drop-shadow-md">
              {asset.title}
            </h2>
            <p className="text-xs text-zinc-300 line-clamp-1 drop-shadow-sm font-sans">
              {asset.description}
            </p>
          </div>

          {/* Emerald Commerce Checkout Card */}
          <div className="p-2.5 rounded-xl bg-[#07070c]/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-2">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400">
                  Get Look: -{asset.bundle.bundleDiscountPercent}%
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  ${discountedBundlePrice}
                </span>
                <span className="text-[10px] font-mono line-through text-zinc-500">
                  ${totalBundleOriginalPrice}
                </span>
              </div>

              {/* Toggle Bundle Item Accordion */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBundleDrawerOpen(!isBundleDrawerOpen);
                }}
                className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{selectedBundleItems.length} Pieces</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isBundleDrawerOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable Multi-Vendor Bundle Garment Selector */}
            <AnimatePresence>
              {isBundleDrawerOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 pt-2 border-t border-white/5 overflow-hidden"
                >
                  {asset.bundle.items.map((item) => {
                    const isSelected = selectedBundleItems.some(i => i.id === item.id);
                    return (
                      <div 
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBundleItem(item);
                        }}
                        className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-white' 
                            : 'bg-white/[0.02] border-white/5 text-zinc-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-600'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-[11px] truncate max-w-[130px] font-medium">{item.title}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400">${item.price}</span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instant Buy CTA */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInstantBuy(selectedBundleItems);
              }}
              className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Instant Buy • ${discountedBundlePrice}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
