import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ShoppingBag, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  Shirt,
  PenSquare,
  Plus,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronDown,
  Info,
  Store,
  AlertCircle,
  PlusCircle,
  WifiOff,
  Heart,
  Share2,
  Bookmark,
  Award,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { FeedItem } from '../features/feed/feedTypes';
import { AIEngine } from '../features/feed/AIEngine';
import { LazyFeedCard } from './LazyFeedCard';
import { MarketplaceModule } from './MarketplaceModule';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useStyleProfile } from '../hooks/useStyleProfile';
import { WardrobeItem, Seller } from '../types';
import { WardrobeGrid } from './WardrobeGrid';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';

const SellerDashboard = React.lazy(() => import('./SellerDashboard').then(m => ({ default: m.SellerDashboard })));

interface HomeFeedProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onDeleteGarment?: (id: string) => Promise<void>;
  user?: any;
  onLogout?: () => void;
  onReset?: () => void;
  onLoadSamples?: () => void;
}

const FALLBACK_CURATED_OUTFITS: FeedItem[] = [
  {
    id: "fallback-curated-silhouette-1",
    type: 'outfit',
    category: 'silhouette',
    title: "The Autumn Monochrome Silhouette",
    description: "AI curated look combining structured grey trench coats with clean linen bases to evoke serene confidence during overcast mornings.",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop",
    outfitItems: [],
    suitabilityScore: 97,
    vibeTags: ["minimalist", "classic", "silhouette"],
    occasion: "Gallery Walk & Creative Meetups",
    statsLabel: "Curator Concept — 97% Match",
    likesCount: 245,
    bookmarksCount: 68,
    createdAt: new Date().toISOString()
  },
  {
    id: "fallback-curated-look-2",
    type: 'outfit',
    category: 'look',
    title: "Nordic Minimalist Drape Look",
    description: "A meticulously assembled look combining heavy double-breasted charcoal wool blazers with loose-cut silk-blend trousers.",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    outfitItems: [],
    suitabilityScore: 94,
    vibeTags: ["nordic", "look", "minimalist"],
    occasion: "Artisanal Studio Workspace",
    statsLabel: "Editorial Feature — 94% Match",
    likesCount: 189,
    bookmarksCount: 42,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "fallback-curated-set-3",
    type: 'outfit',
    category: 'style-set',
    title: "Sandstone Relaxed Layering Style-Set",
    description: "Warm tonal alignment blending structured corduroy over-shirts with organic ecru cotton base tees and fine metal highlights.",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
    outfitItems: [],
    suitabilityScore: 91,
    vibeTags: ["warm-tonal", "style-set", "relaxed"],
    occasion: "Sunday High Street Walk",
    statsLabel: "Heritage Series — 91% Match",
    likesCount: 156,
    bookmarksCount: 38,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const HomeFeed: React.FC<HomeFeedProps> = ({
  wardrobe,
  onAddGarment,
  onDeleteGarment,
  user,
  onLogout,
  onReset,
  onLoadSamples
}) => {
  const isOnline = useOnlineStatus();
  const styleProfile = useStyleProfile();
  const [dailyRefreshFilter, setDailyRefreshFilter] = useState<'ALL' | 'TODAYS_PICKS' | 'TRENDING_STYLE' | 'NEW_DROPS'>('ALL');

  // Feed state
  const [originalFeed, setOriginalFeed] = useState<FeedItem[]>([]);
  const [visibleFeed, setVisibleFeed] = useState<FeedItem[]>([]);
  const [rawProducts, setRawProducts] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('sartorial_cached_products');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [sellersMap, setSellersMap] = useState<Record<string, Seller>>(() => {
    try {
      const cached = localStorage.getItem('sartorial_cached_sellers');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  // Derived high-performance list combining products and stable sellers memory
  const customShopPosts = useMemo<FeedItem[]>(() => {
    return rawProducts.map(data => {
      const seller = sellersMap[data.shopId] || null;
      return {
        id: data.id,
        type: 'shop_product',
        title: data.title,
        description: data.description,
        price: data.price,
        location: seller ? (seller.storeType === 'ONLINE_STORE' ? 'Online Brand' : (seller.location || data.location || "Boutique Shop")) : (data.location || "Boutique Shop"),
        category: data.category,
        availability: data.availability === 'Out of Stock' ? 'Sold Out' : data.availability,
        shopName: seller ? seller.name : (data.shopName || "Boutique Shop"),
        shopAvatarUrl: seller ? (seller.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop") : (data.shopAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"),
        imageUrl: data.imageUrl,
        vibeTags: data.vibeTags || [data.category.toLowerCase(), 'boutique'],
        statsLabel: "Live Artisan upload",
        likesCount: data.likesCount || 1,
        bookmarksCount: data.bookmarksCount || 0,
        createdAt: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),

        // Expanded seller coordinates matching types
        storeType: seller ? (seller.storeType || 'LOCAL_BOUTIQUE') : 'LOCAL_BOUTIQUE',
        instagramUrl: seller ? seller.instagramUrl : '',
        whatsAppNumber: seller ? seller.whatsAppNumber : '',
        websiteLink: seller ? seller.websiteLink : '',
        shippingMode: seller ? (seller.shippingMode || 'pickup') : 'pickup',
        verified: seller ? (seller.verified !== undefined ? seller.verified : true) : false,
        deliveryEstimate: seller ? (seller.deliveryEstimate || '2-4 business days') : '2-4 business days',
      } as FeedItem;
    });
  }, [rawProducts, sellersMap]);

  // Real-time synchronization of all seller profiles
  useEffect(() => {
    const unsubSellers = onSnapshot(collection(db, 'sellers'), (snapshot) => {
      const map: Record<string, Seller> = {};
      snapshot.forEach(docSnap => {
        map[docSnap.id] = { id: docSnap.id, ...docSnap.data() } as Seller;
      });
      setSellersMap(map);
      try {
        localStorage.setItem('sartorial_cached_sellers', JSON.stringify(map));
      } catch (err) {
        console.warn("Storage capacity exceeded for sellers:", err);
      }
    }, (error) => {
      console.warn("Sellers snapshot listener error:", error);
    });
    return () => unsubSellers();
  }, []);

  // Active secure buyer orders log
  const [isBuyerOrdersOpen, setIsBuyerOrdersOpen] = useState(false);
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.isAnonymous || user.uid.startsWith('guest-')) {
      setBuyerOrders([]);
      return;
    }
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matchOrders = snapshot.docs
        .map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            productId: data.productId,
            productTitle: data.productTitle,
            productPrice: data.productPrice,
            productImageUrl: data.productImageUrl,
            shopName: data.shopName,
            status: data.status,
            timestamp: data.timestamp ? (data.timestamp.seconds * 1000) : Date.now(),
            shippingDetails: data.shippingDetails
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp);
      setBuyerOrders(matchOrders);
    }, (error) => {
      console.warn("Orders snapshot error:", error);
    });
    return () => unsubscribe();
  }, [user]);
  
  // AI Prompt search states
  const [searchPrompt, setSearchPrompt] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [isAiCurating, setIsAiCurating] = useState(false);
  const [showUnderstanding, setShowUnderstanding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUnderstanding(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Modals & Panels
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isClosetDrawerOpen, setIsClosetDrawerOpen] = useState(false);
  const [activeFeedFilter, setActiveFeedFilter] = useState<'ALL' | 'OUTFITS' | 'PRODUCTS' | 'TRENDS'>('ALL');

  // Loading / Stream states
  const [pageLimit, setPageLimit] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Real-Time Marketplace Feed Streamer with read count limiting optimization
  useEffect(() => {
    // Only fetch top 40 products to reduce database reads and system memory footprint
    const q = query(collection(db, 'products'), limit(40));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs
        .filter(docSnap => {
          const data = docSnap.data();
          return data && data.title && data.price && data.shopId;
        })
        .map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title,
            description: data.description,
            price: data.price,
            shopId: data.shopId,
            category: data.category,
            availability: data.availability,
            imageUrl: data.imageUrl,
            vibeTags: data.vibeTags,
            likesCount: data.likesCount,
            bookmarksCount: data.bookmarksCount,
            createdAt: data.createdAt?.seconds ? { seconds: data.createdAt.seconds } : null
          };
        });
      setRawProducts(posts);
      try {
        localStorage.setItem('sartorial_cached_products', JSON.stringify(posts));
      } catch (err) {
        console.warn("Storage capacity exceeded for products:", err);
      }
    }, (error) => {
      console.warn("Products stream offline fallback active:", error);
    });

    return () => unsubscribe();
  }, []);

  // Helper to personalize feed by calculating matching style coefficient
  const personalizeFeed = (items: FeedItem[]) => {
    return [...items].sort((a, b) => {
      const getScore = (item: FeedItem) => {
        let sc = 0;
        const tags = (item.vibeTags || []).map(t => t.toLowerCase());
        const cat = (item.category || '').toLowerCase();
        const price = item.price || 0;

        // Minimalist match weighting
        if (tags.includes('minimalist') || tags.includes('classic') || cat === 'formal') {
          sc += styleProfile.scores.minimalist;
        }
        // Streetwear match weighting
        if (tags.includes('streetwear') || tags.includes('casual') || cat === 'casual') {
          sc += styleProfile.scores.streetwear;
        }
        // Luxury match weighting
        if (tags.includes('luxury') || tags.includes('boutique') || price >= 180) {
          sc += styleProfile.scores.luxury;
        }
        // Experimental/outfit match weighting
        if (item.type === 'outfit' || tags.includes('vintage') || tags.includes('custom') || tags.includes('experimental')) {
          sc += styleProfile.scores.experimental;
        }
        return sc;
      };

      return getScore(b) - getScore(a);
    });
  };

  // Helper to safely apply selected filters with relaxed outfit mapping & safe fallback
  const applyFilter = (rawItems: FeedItem[]) => {
    let list = [...rawItems];

    // Part A: Primary selection feed filters
    if (activeFeedFilter === 'OUTFITS') {
      list = list.filter(i => {
        const t = (i.type || '').toLowerCase();
        const c = (i.category || '').toLowerCase();
        const tags = (i.vibeTags || []).map(tg => tg.toLowerCase());
        
        return (
          t === 'outfit' || t === 'silhouette' || t === 'look' || t === 'style-set' ||
          c === 'outfit' || c === 'silhouette' || c === 'look' || c === 'style-set' ||
          tags.includes('outfit') || tags.includes('silhouette') || tags.includes('look') || tags.includes('style-set')
        );
      });

      if (list.length === 0) {
        list = FALLBACK_CURATED_OUTFITS;
      }
    } else if (activeFeedFilter === 'PRODUCTS') {
      list = list.filter(i => i.type === 'shop_product' || i.type === 'budget_pick');
    } else if (activeFeedFilter === 'TRENDS') {
      list = list.filter(i => i.type === 'trending_fashion');
    }

    // Part B: Daily Fresh Curations sub-filter layers
    if (dailyRefreshFilter === 'TODAYS_PICKS') {
      const dayIndex = new Date().getDay(); // 0-6 rotating multiplier
      list = list.filter((_, idx) => (idx + dayIndex) % 2 === 0);
      if (list.length === 0) list = rawItems.slice(0, 3);
    } else if (dailyRefreshFilter === 'TRENDING_STYLE') {
      const prefList = [
        { id: 'minimalist', tags: ['minimalist', 'classic', 'formal'] },
        { id: 'streetwear', tags: ['streetwear', 'casual', 'sportswear'] },
        { id: 'luxury', tags: ['luxury', 'boutique'] },
        { id: 'experimental', tags: ['vintage', 'custom', 'experimental', 'outfit'] }
      ];
      prefList.sort((a, b) => (styleProfile.scores[b.id as keyof typeof styleProfile.scores] || 0) - (styleProfile.scores[a.id as keyof typeof styleProfile.scores] || 0));
      const topTags = prefList[0].tags;
      list = list.filter(item => {
        const itemTags = (item.vibeTags || []).map(t => t.toLowerCase());
        const itemCat = (item.category || '').toLowerCase();
        return itemTags.some(t => topTags.includes(t)) || topTags.includes(itemCat) || (prefList[0].id === 'experimental' && item.type === 'outfit');
      });
      if (list.length === 0) list = rawItems;
    } else if (dailyRefreshFilter === 'NEW_DROPS') {
      list = list.filter(item => item.type === 'shop_product' || (item.vibeTags || []).includes('boutique') || (item.vibeTags || []).includes('streetwear'));
    }

    // Part C: Apply smart ranking personalization
    return personalizeFeed(list);
  };

  // Initialize Feed
  useEffect(() => {
    // Generate feed combining user wardrobe + local shop catalogs + preset tips
    const computed = AIEngine.generateFeed(wardrobe, customShopPosts);
    setOriginalFeed(computed);
    
    // Apply initial filters/searches
    const { items, explanation } = AIEngine.processSearchQuery(searchPrompt, computed);
    
    const filtered = applyFilter(items);
    setVisibleFeed(filtered);

    // Set curated explanation based on dailyRefreshFilter
    if (dailyRefreshFilter === 'TODAYS_PICKS') {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = days[new Date().getDay()];
      setAiExplanation(`Today's Picks: Enjoy hand-selected style curated for you this ${dayName}.`);
    } else if (dailyRefreshFilter === 'TRENDING_STYLE') {
      setAiExplanation(`Recommended For You: Showing collections aligned with your highest-rated style: "${styleProfile.getPrimaryStyleName()}".`);
    } else if (dailyRefreshFilter === 'NEW_DROPS') {
      setAiExplanation("Boutique Drops: Displaying recently cataloged garment designs fresh from local shop inventories.");
    } else {
      setAiExplanation(explanation || "Welcome to your style feed. Your interactions like liking, saving, and trying on items help refine your style preference scores.");
    }
  }, [wardrobe, customShopPosts, activeFeedFilter, dailyRefreshFilter, styleProfile.scores]);

  // Handle Search Input Submit or on-the-fly search ranking
  const [stylistError, setStylistError] = useState<string | null>(null);

  // Handle Search Input text state
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchPrompt(val);

    if (!val.trim()) {
      setIsAiCurating(false);
      setAiExplanation('');
      setStylistError(null);
      // Reset visible feed
      const base = AIEngine.generateFeed(wardrobe, customShopPosts);
      const filtered = applyFilter(base);
      setVisibleFeed(filtered);
    }
  };

  const handleStylistConsult = (query: string) => {
    // 6. Debug Logging - Input received
    console.log("[AI Stylist Consult] Input received: '" + query + "'");
    setStylistError(null);

    // 4. Fix Empty Input Handling
    if (!query || !query.trim()) {
      console.warn("[AI Stylist Consult] Empty search prompt submitted, halting AI call.");
      setStylistError("Describe your style or select an outfit");
      setIsAiCurating(false);
      return;
    }

    // 3. Fix Loading State Lifecycle - Transition to loading
    setIsAiCurating(true);
    setAiExplanation("");

    // 6. Debug Logging - Request started
    console.log("[AI Stylist Consult] Request started for style synthesis query: " + query);

    // Set up a safety timeout (e.g., 6 seconds) to prevent infinite pending/loading
    // 2. Add Guaranteed Timeout Safety
    let isRequestResolved = false;
    
    const timeoutId = setTimeout(() => {
      if (!isRequestResolved) {
        // 6. Debug Logging - Timeout triggered
        console.warn("[AI Stylist Consult] Timeout triggered! Request took longer than safety window.");
        isRequestResolved = true;
        
        // Let's stop the loading state
        setIsAiCurating(false);
        
        // Show fallback message
        const fallbackMsg = "Try a minimalist outfit with neutral tones for a balanced look.";
        setAiExplanation(fallbackMsg);
        
        // Reset/Adjust feed gracefully with safe fallback filtering
        try {
          const base = AIEngine.generateFeed(wardrobe, customShopPosts);
          const filtered = applyFilter(base);
          setVisibleFeed(filtered);
        } catch (e) {
          console.error("[AI Stylist Consult] Failed to generate fallback feed in timeout:", e);
        }
      }
    }, 6000); // 5-8 seconds window, we pick 6000ms

    // Wrap in try/catch for safety (5. Add Error Catch Safety Layer)
    try {
      // Simulate real AI response with loading states
      setTimeout(() => {
        if (isRequestResolved) {
          console.log("[AI Stylist Consult] AI request returned but timeout has already handled fallback.");
          return;
        }
        
        // Mark as resolved so that timeout won't fire fallback values
        isRequestResolved = true;
        clearTimeout(timeoutId);

        try {
          // Verify that query is still active / didn't change to empty
          const base = AIEngine.generateFeed(wardrobe, customShopPosts);
          const { items, explanation } = AIEngine.processSearchQuery(query, base);
          
          // 6. Debug Logging - Request success
          console.log("[AI Stylist Consult] Request success. Response processed successfully.");
          const filtered = applyFilter(items);
          
          if (explanation) {
            setVisibleFeed(filtered);
            setAiExplanation(explanation);
          } else {
            const fallbackMsg = "Try a minimalist black outfit with neutral tones for a balanced look.";
            setVisibleFeed(filtered);
            setAiExplanation(fallbackMsg);
          }
        } catch (error) {
          // 6. Debug Logging - Request failed (nested error)
          console.error("[AI Stylist Consult] Request failed inside processing:", error);
          
          const fallbackMsg = "Try a minimalist outfit with neutral tones for a balanced look.";
          // Reset feed but make sure we apply our safe fallback filtering so the feed is never empty or broken
          const base = AIEngine.generateFeed(wardrobe, customShopPosts);
          const filtered = applyFilter(base);
          setVisibleFeed(filtered);
          setAiExplanation(fallbackMsg);
        } finally {
          // 3. Fix Loading State Lifecycle - Transition back to idle
          setIsAiCurating(false);
        }
      }, 850);
    } catch (outerError) {
      // 6. Debug Logging - Request failed (outer error)
      console.error("[AI Stylist Consult] Request failed in outer context:", outerError);
      if (!isRequestResolved) {
        isRequestResolved = true;
        clearTimeout(timeoutId);
      }
      
      const fallbackMsg = "Try a minimalist outfit with neutral tones for a balanced look.";
      const base = AIEngine.generateFeed(wardrobe, customShopPosts);
      const filtered = applyFilter(base);
      setVisibleFeed(filtered);
      setAiExplanation(fallbackMsg);
      
      // 3. Fix Loading State Lifecycle - Transition back to idle
      setIsAiCurating(false);
    }
  };

  // Preset quick suggestion prompts
  const quickSearches = [
    { label: "Winter luxury under $300", query: "luxury winter under 300" },
    { label: "Streetwear hoodies", query: "hoodie streetwear" },
    { label: "Casual own closet outfit", query: "closet own outfit" },
    { label: "Tokyo trending", query: "trending" }
  ];

  const applyQuickSearch = (query: string) => {
    setSearchPrompt(query);
    handleStylistConsult(query);
  };

  // Liked interactions helper
  const handleLikeItem = (itemId: string) => {
    setVisibleFeed(prev => prev.map(item => {
      if (item.id === itemId) {
        const hasLiked = !item.hasLiked;
        if (hasLiked) {
          styleProfile.trackInteraction('like', item);
        }
        return {
          ...item,
          hasLiked,
          likesCount: hasLiked ? item.likesCount + 1 : item.likesCount - 1
        };
      }
      return item;
    }));
  };

  // Bookmark interactions helper
  const handleBookmarkItem = (itemId: string) => {
    setVisibleFeed(prev => prev.map(item => {
      if (item.id === itemId) {
        const hasBookmarked = !item.hasBookmarked;
        if (hasBookmarked) {
          styleProfile.trackInteraction('save', item);
        }
        return {
          ...item,
          hasBookmarked,
          bookmarksCount: hasBookmarked ? item.bookmarksCount + 1 : item.bookmarksCount - 1
        };
      }
      return item;
    }));
  };

  // Add shop posted item
  const handleAddShopPost = (newPostData: any) => {
    const post = {
      ...newPostData,
      id: `custom-shop-${Date.now()}`,
      likesCount: 1,
      bookmarksCount: 0,
      createdAt: { seconds: Math.floor(Date.now() / 1000) }
    };
    setRawProducts(prev => [post, ...prev]);
  };

  // Save shop item to user's real digital wardrobe
  const handleSaveToCloset = (title: string, description: string, category: string, imageUrl: string, price?: number) => {
    if (onAddGarment) {
      // Direct call to wardrobe context adder
      onAddGarment(title, description, category, { imageUrl, price });
      // Track engagement
      const itemMatch = visibleFeed.find(i => i.title === title) || originalFeed.find(i => i.title === title);
      if (itemMatch) {
         styleProfile.trackInteraction('save', itemMatch);
      }
    }
  };

  // Log outfit worn event
  const [feedbackSuccessToast, setFeedbackSuccessToast] = useState('');
  const handleWearOutfit = (outfitId: string, clothesNames: string[]) => {
    setFeedbackSuccessToast(`Selected Outfit Logged! We marked: ${clothesNames.join(' & ')} as worn today.`);
    setTimeout(() => {
      setFeedbackSuccessToast('');
    }, 4500);
  };

  // Load more / Infinite scroll simulator
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setPageLimit(prev => prev + 3);
      setIsLoadingMore(false);
    }, 700);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 pb-32 animate-fade-in relative selection:bg-transparent">
      {/* Toast Notification */}
      <AnimatePresence>
        {feedbackSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 border border-[#ccc]/20 max-w-sm w-full py-3.5 px-4 rounded-xl shadow-2xl flex items-center gap-3 text-black text-xs font-mono font-medium"
          >
            <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full animate-ping" />
            <span className="flex-1 leading-snug">{feedbackSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1-Line Explanation Overlay with elegant fade/slide animation */}
      <AnimatePresence>
        {showUnderstanding && !styleProfile.showWelcomeBack && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 text-center w-full max-w-lg px-4 pointer-events-none"
          >
            <div className="bg-amber-400 text-black text-xs font-semibold px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-amber-300 flex items-center justify-between gap-3 pointer-events-auto">
              <span className="flex-1 text-center font-sans tracking-wide">
                ✨ <strong>This is your AI fashion feed</strong> — shop clothes, try outfits, and explore brands.
              </span>
              <button 
                onClick={() => setShowUnderstanding(false)}
                className="opacity-70 hover:opacity-100 transition-opacity text-base font-bold select-none cursor-pointer pr-1 leading-none"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RETENTION RECALL WELCOME BANNER */}
      <AnimatePresence>
        {styleProfile.showWelcomeBack && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden bg-[#fafafa]/[0.02] border border-cyan-500/10 p-4.5 rounded-2xl flex items-start gap-4 shadow-lg text-left"
          >
            <div className="p-2.5 bg-cyan-400/10 text-cyan-400 rounded-xl flex-shrink-0">
              <UserCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-cyan-400 font-bold">RECALL: Welcome back</span>
                <button 
                  onClick={styleProfile.dismissWelcomeBack}
                  className="text-white/30 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  [Dismiss]
                </button>
              </div>
              <p className="text-xs italic text-white/80 leading-relaxed font-serif">
                "Welcome back! Since your last visit, we found {styleProfile.simulatedNewStylesCount} new couture drops and updated shop recommendations matching your preferences. Your highest style preference score is currently {styleProfile.getPrimaryStyleName()}."
              </p>
              <div className="pt-2 flex gap-4">
                <button
                  onClick={() => {
                    setDailyRefreshFilter('TODAYS_PICKS');
                    styleProfile.dismissWelcomeBack();
                    const element = document.getElementById('classification-tabs-start');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[9px] font-mono text-cyan-400 hover:text-white uppercase transition-colors cursor-pointer"
                >
                  → View Today's curate picks
                </button>
                <span className="text-white/10 shrink-0">|</span>
                <p className="text-[8px] font-mono text-white/30 self-center">Updated minutes ago</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PRIMARY APP BRANDING HEADER */}
      <div className="text-[#dfd7c2] space-y-3 pt-6 pb-2 text-center">
        {!isOnline && (
          <div className="max-w-md mx-auto mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-xl flex items-center gap-2.5 text-[10px] justify-center font-mono">
            <WifiOff className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
            <span>Running in Offline Mode. Browsing cached feed. Writes (Buy, Upload, Post) are temporarily paused.</span>
          </div>
        )}

        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 block">
          Curated Picks & Brands
        </span>
        <h1 className="font-serif font-light tracking-[-0.03em] text-4xl text-white">Fashion Feed</h1>
        <p className="text-sm text-[#dfd7c2]/90 font-serif italic max-w-sm mx-auto leading-relaxed">
          "Discover fashion. Try styles. Shop from real and online stores."
        </p>
      </div>

      {/* Visual Quick Onboarding Entry Grid */}
      <div className="grid grid-cols-2 gap-3 pb-2 pt-1">
        <button
          onClick={() => {
            setActiveFeedFilter('ALL');
            const element = document.getElementById('classification-tabs-start');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="group cursor-pointer bg-white/[0.01] hover:bg-white/[0.04] text-left p-4.5 rounded-2xl border border-white/[0.04] hover:border-white/15 transition-all text-white flex flex-col justify-between h-[120px] shadow-sm text-left"
        >
          <div className="flex justify-between items-start w-full">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono uppercase bg-emerald-400/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/15">Active</span>
          </div>
          <div>
            <span className="block text-xs font-serif font-medium tracking-wide">🛍 Browse Fashion</span>
            <span className="text-[10px] text-white/55 font-mono leading-none mt-1 block">Scroll down & explore the feed</span>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveFeedFilter('OUTFITS');
            const element = document.getElementById('classification-tabs-start');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="group cursor-pointer bg-white/[0.01] hover:bg-white/[0.04] text-left p-4.5 rounded-2xl border border-white/[0.04] hover:border-white/15 transition-all text-white flex flex-col justify-between h-[120px] shadow-sm text-left"
        >
          <div className="flex justify-between items-start w-full">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono uppercase bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/15">Try-On</span>
          </div>
          <div>
            <span className="block text-xs font-serif font-medium tracking-wide">🧑🎨 Try Virtual Outfits</span>
            <span className="text-[10px] text-white/55 font-mono leading-none mt-1 block">Fit style combinations on avatars</span>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveFeedFilter('PRODUCTS');
            const element = document.getElementById('classification-tabs-start');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="group cursor-pointer bg-white/[0.01] hover:bg-white/[0.04] text-left p-4.5 rounded-2xl border border-white/[0.04] hover:border-white/15 transition-all text-white flex flex-col justify-between h-[120px] shadow-sm text-left"
        >
          <div className="flex justify-between items-start w-full">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono uppercase bg-sky-400/10 text-sky-300 px-2 py-0.5 rounded border border-sky-500/15">Shops</span>
          </div>
          <div>
            <span className="block text-xs font-serif font-medium tracking-wide">🏪 Explore Shops</span>
            <span className="text-[10px] text-white/55 font-mono leading-none mt-1 block">View local boutique products</span>
          </div>
        </button>

        <button
          onClick={() => setIsSellerDashboardOpen(true)}
          className="group cursor-pointer bg-white/[0.01] hover:bg-white/[0.04] text-left p-4.5 rounded-2xl border border-white/[0.04] hover:border-white/15 transition-all text-white flex flex-col justify-between h-[120px] shadow-sm text-left"
        >
          <div className="flex justify-between items-start w-full">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono uppercase bg-purple-400/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/15">Hub</span>
          </div>
          <div>
            <span className="block text-xs font-serif font-medium tracking-wide">🧾 Become a Seller</span>
            <span className="text-[10px] text-white/55 font-mono leading-none mt-1 block">List apparel & reach buyers</span>
          </div>
        </button>
      </div>

      {/* Quick Access Portal buttons for Wardrobe overlays */}
      <div className="grid grid-cols-3 gap-2.5 w-full">
        <button
          onClick={() => setIsClosetDrawerOpen(true)}
          className="cursor-pointer bg-white/[0.02] hover:bg-white/[0.07] text-white/80 border border-white/5 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
          id="btn-open-closet-drawer"
        >
          <Shirt className="w-3.5 h-3.5 opacity-60" />
          <span>Closet ({wardrobe.length})</span>
        </button>

        <button
          onClick={() => setIsBuyerOrdersOpen(true)}
          className="cursor-pointer bg-white/[0.02] hover:bg-white/[0.07] text-white/80 border border-white/5 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
          id="btn-open-orders-history"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
          <span>Orders ({buyerOrders.length})</span>
        </button>

        <button
          onClick={() => setIsSellerDashboardOpen(true)}
          className="cursor-pointer bg-white text-black hover:bg-neutral-200 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 transition-colors font-medium shadow-sm"
          id="btn-open-seller-portal"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Seller Hub</span>
        </button>
      </div>

      {/* 1.5 AESTHETIC STYLE IDENTITY CARD (FASHION PROFILE PARAMETERS) */}
      <div className="bg-[#121212]/30 border border-white/5 p-4.5 rounded-2xl space-y-3.5 shadow-sm text-left">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.1em] text-white/90 font-semibold">Style Preference Card</h3>
          </div>
          <span className="text-[9px] font-mono text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/10 flex items-center gap-1">
            <TrendingUp className="w-2.5 h-2.5" />
            Style Profile
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-1">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Primary Style</span>
            <span className="text-white text-xs font-serif italic">{styleProfile.getPrimaryStyleName()}</span>
          </div>
          <div className="space-y-0.5 text-right">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Interaction Tracking</span>
            <span className="text-white text-xs font-mono">{styleProfile.metrics.likes + styleProfile.metrics.saves + styleProfile.metrics.tryons + styleProfile.metrics.purchases} interactions</span>
          </div>
        </div>

        {/* Mini progress bars for style focus elements */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2 border-t border-white/5">
          {/* Minimalist */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-white/50">
              <span className="uppercase">Minimalist Tone</span>
              <span>{Math.min(100, styleProfile.scores.minimalist * 10)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-slate-300"
                initial={false}
                animate={{ width: `${Math.min(100, styleProfile.scores.minimalist * 10)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Streetwear */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-white/50">
              <span className="uppercase">Streetwear Swag</span>
              <span>{Math.min(100, styleProfile.scores.streetwear * 10)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-cyan-400"
                initial={false}
                animate={{ width: `${Math.min(100, styleProfile.scores.streetwear * 10)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Luxury */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-white/50">
              <span className="uppercase">Luxury Class</span>
              <span>{Math.min(100, styleProfile.scores.luxury * 10)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-amber-400"
                initial={false}
                animate={{ width: `${Math.min(100, styleProfile.scores.luxury * 10)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Experimental */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-white/50">
              <span className="uppercase">Avant-Garde</span>
              <span>{Math.min(100, styleProfile.scores.experimental * 10)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-purple-400"
                initial={false}
                animate={{ width: `${Math.min(100, styleProfile.scores.experimental * 10)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI CONCIERGE PROMPT BOX */}
      <div className="bg-[#0b0b0b] border border-white/[0.05] p-4 rounded-2xl shadow-xl space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); handleStylistConsult(searchPrompt); }} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-widest text-[#9c9c9c] uppercase block">AI Style Advice</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text"
                placeholder="What are you looking for today? Describe your style..."
                value={searchPrompt}
                onChange={handleSearchChange}
                className="w-full bg-white/[0.01] border border-white/5 pl-9 pr-14 py-3 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/10 rounded-xl transition-all font-light"
                id="ai-feed-search-input"
              />
              {searchPrompt && (
                <button 
                  type="button"
                  onClick={() => {
                    setSearchPrompt('');
                    setStylistError(null);
                    setAiExplanation('');
                    const base = AIEngine.generateFeed(wardrobe, customShopPosts);
                    setVisibleFeed(base);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/35 hover:text-white text-xs font-mono px-1 bg-white/5 rounded"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isAiCurating}
            className="w-full py-2 bg-white/10 hover:bg-white text-white hover:text-black transition-all text-[10px] font-mono uppercase tracking-wider rounded-lg font-medium cursor-pointer flex items-center justify-center gap-1.5"
            id="ai-stylist-consult-submit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAiCurating ? "Styling..." : "Consult Stylist"}</span>
          </button>
        </form>

        {/* Input Validation Error */}
        {stylistError && (
          <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-center gap-2 text-rose-400 text-xs font-mono mt-1">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{stylistError}</span>
          </div>
        )}

        {/* Curation Loading State */}
        {isAiCurating && (
          <div className="p-3 bg-white/[0.02] border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 animate-pulse mt-1 text-xs font-mono text-amber-300">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Stylist is analyzing your style...</span>
          </div>
        )}

        {/* Quick chip ideas */}
        <div className="flex flex-wrap gap-1.5">
          {quickSearches.map((qs, i) => (
            <button
              key={i}
              onClick={() => applyQuickSearch(qs.query)}
              className="text-[9px] font-mono text-white/35 hover:text-white/85 hover:bg-white/[0.03] border border-white/[0.03] px-2 py-0.5 rounded transition-all cursor-pointer"
            >
              {qs.label}
            </button>
          ))}
        </div>

        {/* AI curation context note */}
        <AnimatePresence>
          {aiExplanation && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-[#fafafa]/[0.02] border-t border-dashed border-white/10 pt-3 flex gap-2.5 items-start mt-1"
            >
              <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-white mt-0.5">
                <Sparkles className="w-3 h-3 animate-spin duration-3000" />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-[8px] font-mono uppercase tracking-[0.15em] text-white/30">Curation Logic</p>
                <p className="text-xs text-white/75 font-serif italic leading-relaxed">
                  {aiExplanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. CLASSIFICATION TABS / FEED FILTERS */}
      <div id="classification-tabs-start" className="flex justify-between items-center border-b border-white/[0.04] pb-2">
        <div className="flex gap-4">
          {[
            { id: 'ALL', label: 'All Feed' },
            { id: 'OUTFITS', label: 'Outfits' },
            { id: 'PRODUCTS', label: 'Shops' },
            { id: 'TRENDS', label: 'Trending' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFeedFilter(tab.id as any)}
              className={`text-[10px] font-mono uppercase tracking-[0.1em] pb-2 relative transition-all cursor-pointer ${
                activeFeedFilter === tab.id ? 'text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              <span>{tab.label}</span>
              {activeFeedFilter === tab.id && (
                <motion.div layoutId="feedActiveLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          ))}
        </div>

        <span className="text-[8px] font-mono uppercase tracking-widest text-white/20">
          Showing {Math.min(visibleFeed.length, pageLimit)} of {visibleFeed.length} Items
        </span>
      </div>

      {/* 3.1 DAILY CURATED REFRESH LOOP RAIL */}
      <div className="bg-[#fafafa]/[0.01] border border-white/[0.03] p-2.5 rounded-xl flex items-center justify-between text-left gap-2.5">
        <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-white/40 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Recommended:
        </span>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Picks' },
            { id: 'TODAYS_PICKS', label: "Today's Curated" },
            { id: 'TRENDING_STYLE', label: 'Recommended For You' },
            { id: 'NEW_DROPS', label: 'Boutique Drops' }
          ].map((subtab) => (
            <button
              key={subtab.id}
              onClick={() => setDailyRefreshFilter(subtab.id as any)}
              className={`text-[9px] font-mono px-2.5 py-1.5 rounded-lg uppercase transition-all whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
                dailyRefreshFilter === subtab.id 
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold' 
                  : 'text-white/40 hover:text-white/75 bg-white/[0.01] border border-white/5'
              }`}
            >
              {subtab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN FEED FEED ITEMS STREAM */}
      <div className="space-y-10">
        <AnimatePresence mode="popLayout">
          {visibleFeed.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-12 border border-dashed border-white/5 bg-white/[0.01] rounded-2xl space-y-4"
              id="feed-empty-state-guidance"
            >
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/30">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div className="space-y-1.5">
                <p className="font-serif italic text-sm text-white/70">"Awaiting style combinations..."</p>
                <p className="text-[11px] font-sans text-white/40 max-w-sm mx-auto leading-relaxed">
                  Try searching for keywords like <span className="text-white font-mono text-[9px] bg-white/5 px-1 rounded uppercase">formal</span>, <span className="text-white font-mono text-[9px] bg-white/5 px-1 rounded uppercase">minimalist</span>, or <span className="text-white font-mono text-[9px] bg-white/5 px-1 rounded uppercase">hoodies</span> in the AI Stylist consult input, or clear active searches to explore default silhouettes.
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSearchPrompt('');
                    const base = AIEngine.generateFeed(wardrobe, customShopPosts);
                    const filtered = applyFilter(base);
                    setVisibleFeed(filtered);
                  }}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-white text-white hover:text-black border border-white/5 hover:border-white transition-all text-[9px] font-mono uppercase tracking-widest rounded cursor-pointer"
                >
                  Clear Searches
                </button>
                {/* Clean inline check without redundant manual trigger */}
              </div>
            </motion.div>
          ) : (
            visibleFeed.slice(0, pageLimit).map((feedItem) => (
              <LazyFeedCard 
                key={feedItem.id} 
                item={feedItem}
                onLike={handleLikeItem}
                onBookmark={handleBookmarkItem}
                onSaveToCloset={handleSaveToCloset}
                onWearOutfit={handleWearOutfit}
              />
            ))
          )}
        </AnimatePresence>

        {/* Load More Trigger */}
        {visibleFeed.length > pageLimit && (
          <div className="text-center pt-4">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-2 bg-white/[0.02] hover:bg-white text-white hover:text-black border border-white/5 hover:border-white transition-all text-[10px] font-mono uppercase tracking-widest rounded-lg cursor-pointer inline-flex items-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Loading Stream...</span>
                </>
              ) : (
                <span>Fetch More Outfits</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 5. PORTABLE DIGITAL CLOSET DRAWER (SLIDE-OVER LAYOUT) */}
      <AnimatePresence>
        {isClosetDrawerOpen && (
          <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex justify-end selection:bg-transparent">
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsClosetDrawerOpen(false)} />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#070707] border-l border-white/10 h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Content */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-[#ababab] uppercase">SARTORIAL STORAGE v4</span>
                    <h3 className="font-serif text-2xl font-light text-white flex items-center gap-2">
                      <Shirt className="w-5 h-5 text-white/80" /> My Wardrobe
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsClosetDrawerOpen(false)}
                    className="text-white/40 hover:text-white hover:bg-white/5 px-2.5 py-1 text-xs font-mono transition-colors rounded-md"
                  >
                    [ HIDE ]
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-2">
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-light">Digital Closet Guidelines</span>
                    <p className="text-xs text-white/60 leading-relaxed font-serif font-light">
                      Items saved from the Marketplace or added manually are cataloged below. Use categories to sort your collection.
                    </p>
                  </div>

                  {/* Integrated Quick Closet Manual Adder */}
                  <QuickGarmentAdder onAdd={onAddGarment} />

                  {/* Wardrobe Grid sub-panel */}
                  <WardrobeGrid
                    items={wardrobe}
                    categories={['Casual', 'Formal', 'Sportswear', 'Outerwear', 'Accessories']}
                    onDelete={(item) => onDeleteGarment && onDeleteGarment(item.id)}
                  />

                  {/* Item 6: WISHLIST / CLOSET RECALL SUGGESTIONS */}
                  {(() => {
                    const closetRecommendations = originalFeed
                      .filter(recItem => !wardrobe.some(g => g.title === recItem.title))
                      .slice(0, 2);
                    if (closetRecommendations.length === 0) return null;

                    return (
                      <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="flex items-center gap-1.5 text-cyan-400">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-cyan-300 font-semibold">Recommended for Your Closet</span>
                        </div>
                        <p className="text-[10px] text-white/50 leading-relaxed font-serif italic">
                          Based on your style preferences, expand your rotation with these:
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                          {closetRecommendations.map(rec => (
                            <div key={rec.id} className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl space-y-2 flex flex-col justify-between">
                              <div className="space-y-1.5">
                                <img 
                                  src={rec.imageUrl} 
                                  alt={rec.title}
                                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=150&auto=format&fit=crop"; }}
                                  className="w-full h-18 object-cover rounded-lg border border-white/5"
                                />
                                <div className="space-y-0.5">
                                  <span className="block text-[10px] font-medium text-white/95 truncate">{rec.title}</span>
                                  <span className="block text-[8px] font-mono text-cyan-400 capitalize">{rec.category || 'Apparel'}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleSaveToCloset(rec.title, rec.description || '', rec.category || 'Casual', rec.imageUrl, rec.price)}
                                className="w-full py-1 bg-white/5 hover:bg-cyan-500/10 text-white/60 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/10 text-[9px] font-mono uppercase rounded transition-all cursor-pointer font-medium"
                              >
                                + Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Reset/Control footer */}
              <div className="border-t border-white/5 pt-4 flex justify-between items-center bg-[#070707]">
                <button
                  onClick={() => {
                    if (onReset) onReset();
                    setIsClosetDrawerOpen(false);
                  }}
                  className="text-[9px] font-mono text-white/20 hover:text-rose-400 transition-colors uppercase cursor-pointer"
                >
                  [ RESET TO ORIGINAL VALUES ]
                </button>
                <button
                  onClick={() => {
                    if (onLoadSamples) onLoadSamples();
                    setIsClosetDrawerOpen(false);
                  }}
                  className="text-[9px] font-mono text-white/20 hover:text-white/70 transition-colors uppercase cursor-pointer"
                >
                  [ LOAD SAMPLE CLOTHES ]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Marketplace adding product modal */}
      <MarketplaceModule 
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAddShopPost={handleAddShopPost}
      />

      {/* Real-time Seller Onboarding and Dashboard System */}
      <AnimatePresence>
        {isSellerDashboardOpen && (
          <React.Suspense fallback={
            <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center text-white space-y-3">
              <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Atelier Portal Loading...</p>
            </div>
          }>
            <SellerDashboard 
              user={user}
              onClose={() => setIsSellerDashboardOpen(false)}
            />
          </React.Suspense>
        )}
      </AnimatePresence>

      {/* Real-time Order Log History system */}
      <AnimatePresence>
        {isBuyerOrdersOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-45 flex justify-end"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setIsBuyerOrdersOpen(false)} />

            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-black/95 border-l border-white/5 h-full shadow-2xl flex flex-col justify-between p-6 overflow-hidden z-50 text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-light text-white tracking-tight">Active Reservations</h2>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[#9c9c9c] mt-0.5">Boutique Ledger Registry</p>
                </div>
                <button 
                  onClick={() => setIsBuyerOrdersOpen(false)}
                  className="text-white/40 hover:text-white font-mono text-[10px] uppercase font-bold cursor-pointer bg-white/5 px-2.5 py-1 rounded"
                >
                  [ Close ]
                </button>
              </div>

              {/* Scrollable contents */}
              <div className="flex-1 py-4 overflow-y-auto space-y-4">
                {(!user || user.isAnonymous || user.uid.startsWith('guest-')) ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-amber-400">
                      <AlertCircle className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-white/50 uppercase">SIGN IN REQUIRED</p>
                      <p className="text-xs font-serif text-white/40 italic">"Log in to Google to monitor active smart wardrobe orders."</p>
                    </div>
                  </div>
                ) : buyerOrders.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/20">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 max-w-[200px] mx-auto">
                      <p className="text-xs font-mono text-white/40 uppercase tracking-widest font-bold">No reservations</p>
                      <p className="text-[11px] font-serif text-white/30 italic">"Explore the fashion feed to discover original boutique apparel."</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 pr-1">
                    {buyerOrders.map((ord) => (
                      <div 
                        key={ord.id} 
                        className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl space-y-3 relative overflow-hidden transition-all hover:border-white/10"
                      >
                        {/* Shimmer top border line to show Confirmed color */}
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-emerald-500/40" />

                        <div className="flex gap-3 text-xs">
                          {ord.productImageUrl ? (
                            <img 
                              src={ord.productImageUrl} 
                              alt={ord.productTitle} 
                              className="w-14 h-18 object-cover rounded border border-white/10 flex-shrink-0 bg-[#080808]"
                            />
                          ) : (
                            <div className="w-14 h-18 bg-white/5 border border-white/10 rounded flex items-center justify-center text-white/20 flex-shrink-0">
                              <Shirt className="w-4 h-4" />
                            </div>
                          )}

                          <div className="space-y-1 flex-1 min-w-0">
                            <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-500/10">
                              Confirmed Secure Item
                            </span>
                            <h4 className="font-serif text-sm font-light text-white truncate pt-1">{ord.productTitle}</h4>
                            <p className="text-[10px] text-white/40 font-mono">{ord.shopName || "Boutique Shop"}</p>
                            <p className="text-[11px] text-[#dfd7c2] font-semibold">${ord.productPrice}</p>
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-2.5 flex justify-between items-center text-[9px] font-mono text-white/30">
                          <div>
                            <span className="block text-[8px] uppercase text-white/20 leading-none">Placed On</span>
                            <span className="text-white/50">{new Date(ord.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[8px] uppercase text-white/20 leading-none">Smart Ledger ID</span>
                            <span className="text-neutral-400 font-bold select-all truncate max-w-[120px] block font-mono">{ord.id}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer status summary info */}
              <div className="border-t border-white/5 pt-4 space-y-1 font-mono text-[8.5px] text-neutral-500 leading-normal uppercase">
                <p>&copy; Fashion Feed Services</p>
                <p className="text-white/20 font-bold">Total active boutique contracts: {buyerOrders.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// HELPER CONTROL FOR MANUAL CLOTHES REGISTRATION INSIDE EXTENDED CLOSET DRAWER
interface QuickGarmentAdderProps {
  onAdd?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
}

export const QuickGarmentAdder: React.FC<QuickGarmentAdderProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'Casual' | 'Formal' | 'Outerwear' | 'Accessories'>('Casual');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !onAdd) return;

    setIsAdding(true);
    try {
      await onAdd(title, desc || "Personal favorite coordinate piece from private wardrobe.", category);
      setTitle('');
      setDesc('');
      setIsOpen(false);
    } catch(err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white/[0.015] border border-white/5 p-3 md:p-4 rounded-xl space-y-2">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-[9px] font-mono uppercase tracking-widest text-white/50 hover:text-white flex justify-between items-center cursor-pointer transition-colors"
      >
        <span>[ {isOpen ? 'Hide Manual Adder' : 'Add Closet Piece Manually'} ]</span>
        <span>{isOpen ? '—' : '+'}</span>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <label className="text-[8px] font-mono uppercase tracking-wider text-white/40 block pb-1">Garment Identifier Label *</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Linen Summer Trouser"
              className="w-full bg-black/60 border border-white/10 px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-white/20 rounded-md transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] font-mono uppercase tracking-wider text-white/40 block pb-1">Style Type</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-black/60 border border-white/10 px-1 py-1.5 text-xs text-white/80 font-mono focus:outline-none rounded-md"
              >
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] font-mono uppercase tracking-wider text-white/40 block pb-1">Craftsmanship brief</label>
              <input 
                type="text" 
                value={desc} 
                onChange={e => setDesc(e.target.value)}
                placeholder="Details & weavings..."
                className="w-full bg-black/60 border border-white/10 px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-white/20 rounded-md transition-colors"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isAdding}
            className="w-full bg-white text-black py-2 text-[9px] font-mono uppercase tracking-wider rounded-md font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            {isAdding ? 'Registering Piece...' : 'Add to Closet'}
          </button>
        </form>
      )}
    </div>
  );
};

