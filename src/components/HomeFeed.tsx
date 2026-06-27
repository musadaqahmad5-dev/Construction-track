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
import { AIEngine, LOCAL_SHOP_ITEMS } from '../features/feed/AIEngine';
import { LazyFeedCard } from './LazyFeedCard';
import { MarketplaceModule } from './MarketplaceModule';
import { AIFashionMVPSuite } from './AIFashionMVPSuite';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useStyleProfile } from '../hooks/useStyleProfile';
import { WardrobeItem, Seller } from '../types';
import { WardrobeGrid } from './WardrobeGrid';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, where, limit, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

import { SellerDashboard } from './SellerDashboard';

interface HomeFeedProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onDeleteGarment?: (id: string) => Promise<void>;
  user?: any;
  onLogout?: () => void;
  onReset?: () => void;
  onLoadSamples?: () => void;
}

function getGarmentImage(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('tee') || lower.includes('t-shirt') || lower.includes('cotton classic') || lower.includes('cotton')) {
    return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop';
  }
  if (lower.includes('coat') || lower.includes('overcoat') || lower.includes('jacket') || lower.includes('trench') || lower.includes('outerwear')) {
    return 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop';
  }
  if (lower.includes('chino') || lower.includes('pant') || lower.includes('trouser') || lower.includes('jean') || lower.includes('denim')) {
    return 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop';
  }
  if (lower.includes('beanie') || lower.includes('ribbed') || lower.includes('hat') || lower.includes('knit')) {
    return 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600&auto=format&fit=crop';
  }
  if (lower.includes('hoodie') || lower.includes('sweatshirt') || lower.includes('sweater')) {
    return 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop';
  }
  if (lower.includes('shoes') || lower.includes('sneaker') || lower.includes('boot') || lower.includes('sandal')) {
    return 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop';
  }
  if (lower.includes('blazer') || lower.includes('formal') || lower.includes('suit')) {
    return 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop';
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

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  outfitDetails: string;
  vibeTags: string[];
  likesCount: number;
  hasLiked?: boolean;
  createdAt: string;
}

export interface AILook {
  id: string;
  imageUrl: string;
  prompt: string;
  provider: string;
  vibe: string;
  season?: string;
  createdAt: string;
}

const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "seed-comm-1",
    userId: "u1",
    username: "Elena Rostova",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    caption: "Ready for the rainy morning stroll! Calibrated with a heavy double-breasted coat and standard sneakers.",
    outfitDetails: "Cashmere overcoat, organic cotton basic tee, and linen trousers.",
    vibeTags: ["casual", "minimalist", "daily-routine"],
    likesCount: 124,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "seed-comm-2",
    userId: "u2",
    username: "Julian Vance",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
    caption: "Dressed down tailored aesthetic for today's remote creative work sessions.",
    outfitDetails: "Unstructured linen blazer, heavy wool pants.",
    vibeTags: ["classic", "editorial", "studiowork"],
    likesCount: 98,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "seed-comm-3",
    userId: "u3",
    username: "Sasha Dupont",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600&auto=format&fit=crop",
    caption: "Chasing the early sunlight. Love how the trench jacket drapes on the shoulders.",
    outfitDetails: "Trench Coat, white knitwear top.",
    vibeTags: ["autumn", "warm-tonal", "streets"],
    likesCount: 215,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

const SEED_AI_LOOKS: AILook[] = [
  {
    id: "seed-ai-1",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop",
    prompt: "A gorgeous avant-garde structured trench coat with custom details and contrast lapels.",
    provider: "Google-Imagen-4.0",
    vibe: "Streetwear Luxury",
    season: "Autumn",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "seed-ai-2",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
    prompt: "Relaxed linen blazer with minimal pockets styled over organic beige crop top.",
    provider: "Google-Imagen-4.0",
    vibe: "Warm Minimalist",
    season: "Summer",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: "seed-ai-3",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
    prompt: "Oversized knitted cashmere hoodie combined with loose flannel wool trousers.",
    provider: "Google-Imagen-4.0",
    vibe: "Nordic Editorial",
    season: "Winter",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
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
  const [activeFeedFilter, setActiveFeedFilter] = useState<'COMMUNITY' | 'BRANDS' | 'AI_INVENT'>('COMMUNITY');

  // Categorized Feed States & Syncs
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [isUploadingCommunityPost, setIsUploadingCommunityPost] = useState(false);
  const [communityCaption, setCommunityCaption] = useState('');
  const [communityDetails, setCommunityDetails] = useState('');
  const [communityImage, setCommunityImage] = useState<string | null>(null);
  const [communityVibeTags, setCommunityVibeTags] = useState('daily-routine, fit-check');

  const [aiLooks, setAiLooks] = useState<AILook[]>([]);
  const [activeFiosReport, setActiveFiosReport] = useState<any | null>(null);

  // Local engagement mapping states
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedAiLookIds, setSavedAiLookIds] = useState<Set<string>>(new Set());

  // Input photo selection handler for fit checks
  const handleCommunityPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommunityImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new community fit checks
  const handleCommunityPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityImage) return;
    setIsUploadingCommunityPost(true);
    try {
      const tagsArray = communityVibeTags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      await addDoc(collection(db, 'community_posts'), {
        userId: user?.uid || 'guest-user',
        username: user?.displayName || user?.email?.split('@')[0] || 'Sartorialist Guest',
        userAvatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
        imageUrl: communityImage,
        caption: communityCaption,
        outfitDetails: communityDetails,
        vibeTags: tagsArray.length > 0 ? tagsArray : ['fit-check', 'daily-routine'],
        likesCount: 0,
        createdAt: new Date().toISOString()
      });

      // Reset Form fields on success
      setCommunityCaption('');
      setCommunityDetails('');
      setCommunityImage(null);
      setCommunityVibeTags('daily-routine, fit-check');
    } catch (err) {
      console.error("Error creating community post:", err);
    } finally {
      setIsUploadingCommunityPost(false);
    }
  };

  // Like community posted checks
  const handleLikeCommunityPost = async (postId: string, currentLikes: number) => {
    const isLiked = likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));
    
    try {
      const postRef = doc(db, 'community_posts', postId);
      await updateDoc(postRef, {
        likesCount: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1
      });
    } catch (err) {
      console.error("Failed to update like counter:", err);
    }
  };

  // Import high-fidelity AI generated looks directly to user wardrobe
  const handleSaveAiLookToCloset = async (look: any) => {
    if (savedAiLookIds.has(look.id)) return;
    try {
      if (onAddGarment) {
        await onAddGarment(
          `AI Look: ${look.vibe || 'Creative Design'}`,
          look.prompt || "Generated via styled design co-creation.",
          'Casual',
          { imageUrl: look.imageUrl }
        );
      }
      setSavedAiLookIds(prev => {
        const next = new Set(prev);
        next.add(look.id);
        return next;
      });
    } catch (err) {
      console.error("Failed to import AI design look:", err);
    }
  };

  // Fetch Community Posts and AI Looks in real-time from Firestore
  useEffect(() => {
    if (!db) return;
    try {
      const qComm = query(collection(db, 'community_posts'), limit(40));
      const unsubComm = onSnapshot(qComm, (snapshot) => {
        const posts: CommunityPost[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          posts.push({
            id: docSnap.id,
            userId: data.userId || 'guest',
            username: data.username || 'Anonymous Creator',
            userAvatar: data.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
            imageUrl: data.imageUrl || '',
            caption: data.caption || '',
            outfitDetails: data.outfitDetails || '',
            vibeTags: data.vibeTags || [],
            likesCount: data.likesCount || 0,
            createdAt: data.createdAt || new Date().toISOString()
          });
        });
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setCommunityPosts(posts);
      }, (err) => {
        console.warn("Community posts snapshot error, using seeds:", err);
      });

      const qAi = query(collection(db, 'generatedLooks'), limit(40));
      const unsubAi = onSnapshot(qAi, (snapshot) => {
        const looks: AILook[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          looks.push({
            id: docSnap.id,
            imageUrl: data.imageUrl || '',
            prompt: data.prompt || '',
            provider: data.provider || 'Google-Imagen-4.0',
            vibe: data.vibe || 'Creative',
            season: data.season || 'All-Season',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
          });
        });
        looks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAiLooks(looks);
      }, (err) => {
        console.warn("AI generated looks snapshot error, using seeds:", err);
      });

      return () => {
        unsubComm();
        unsubAi();
      };
    } catch (e) {
      console.error("Failed to initialize categorized snapshots:", e);
    }
  }, []);

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

  // 1. Memoized search filter for Community Posts
  const filteredCommunityPosts = useMemo(() => {
    const list = communityPosts.length > 0 ? communityPosts : SEED_COMMUNITY_POSTS;
    if (!searchPrompt.trim()) return list;
    const term = searchPrompt.toLowerCase();
    return list.filter(p => 
      p.caption?.toLowerCase().includes(term) || 
      p.outfitDetails?.toLowerCase().includes(term) || 
      p.username?.toLowerCase().includes(term)
    );
  }, [communityPosts, searchPrompt]);

  // 2. Memoized search filter and sub-filters for Brand boutique products
  const filteredBrandProducts = useMemo(() => {
    // Combine custom (uploaded) shop products with fallback mock boutique items
    const allProducts = [...customShopPosts, ...LOCAL_SHOP_ITEMS.map((mock, index) => ({
      id: `shop-item-${index}`,
      type: 'shop_product' as const,
      title: mock.title!,
      description: mock.description!,
      price: mock.price,
      location: mock.location,
      category: mock.category,
      availability: mock.availability as any,
      shopName: mock.shopName,
      shopAvatarUrl: mock.shopAvatarUrl,
      imageUrl: mock.imageUrl!,
      vibeTags: mock.vibeTags,
      statsLabel: mock.statsLabel,
      likesCount: mock.likesCount!,
      bookmarksCount: mock.bookmarksCount!,
      createdAt: new Date(Date.now() - (index + 1) * 7200000).toISOString()
    }))];

    let list = allProducts;

    // Apply sub-filters based on the curation quick-links
    if (dailyRefreshFilter === 'TODAYS_PICKS') {
      const dayIndex = new Date().getDay();
      list = list.filter((_, idx) => (idx + dayIndex) % 2 === 0);
    } else if (dailyRefreshFilter === 'TRENDING_STYLE') {
      list = list.filter(item => (item.likesCount || 0) > 100);
    } else if (dailyRefreshFilter === 'NEW_DROPS') {
      list = list.filter(item => item.id.includes('custom') || item.availability === 'In Stock');
    }

    if (!searchPrompt.trim()) return personalizeFeed(list);
    const term = searchPrompt.toLowerCase();
    const searched = list.filter(p => 
      p.title?.toLowerCase().includes(term) || 
      p.description?.toLowerCase().includes(term) || 
      p.category?.toLowerCase().includes(term) ||
      p.shopName?.toLowerCase().includes(term)
    );
    return personalizeFeed(searched);
  }, [customShopPosts, dailyRefreshFilter, searchPrompt, styleProfile.scores]);

  // 3. Memoized search filter for AI Generated Looks
  const filteredAiLooks = useMemo(() => {
    const list = aiLooks.length > 0 ? aiLooks : SEED_AI_LOOKS;
    if (!searchPrompt.trim()) return list;
    const term = searchPrompt.toLowerCase();
    return list.filter(p => 
      p.prompt?.toLowerCase().includes(term) || 
      p.vibe?.toLowerCase().includes(term) || 
      p.season?.toLowerCase().includes(term)
    );
  }, [aiLooks, searchPrompt]);

  // Handle feed state initialization and daily curation explanations
  useEffect(() => {
    const computed = AIEngine.generateFeed(wardrobe, customShopPosts);
    setOriginalFeed(computed);

    if (dailyRefreshFilter === 'TODAYS_PICKS') {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = days[new Date().getDay()];
      setAiExplanation(`Today's Picks: Enjoy hand-selected style curated for you this ${dayName}.`);
    } else if (dailyRefreshFilter === 'TRENDING_STYLE') {
      setAiExplanation(`Recommended For You: Showing collections aligned with your highest-rated style: "${styleProfile.getPrimaryStyleName()}".`);
    } else if (dailyRefreshFilter === 'NEW_DROPS') {
      setAiExplanation("Boutique Drops: Displaying recently cataloged garment designs fresh from local shop inventories.");
    } else {
      setAiExplanation("Welcome to your style feed. Discover fashion, try styles, and shop directly from boutique creators.");
    }
  }, [wardrobe, customShopPosts, dailyRefreshFilter, styleProfile.scores]);

  // Synchronize visibleFeed based on activeFeedFilter, filters, and searches
  useEffect(() => {
    if (activeFeedFilter === 'COMMUNITY') {
      setVisibleFeed(filteredCommunityPosts.map(p => ({
        id: p.id,
        type: 'outfit' as const,
        title: p.caption || "Community Fit Check",
        description: p.outfitDetails,
        imageUrl: p.imageUrl,
        vibeTags: p.vibeTags,
        likesCount: p.likesCount,
        bookmarksCount: 0,
        createdAt: p.createdAt,
        shopName: p.username,
        isCommunity: true,
        userAvatar: p.userAvatar,
        userId: p.userId
      } as unknown as FeedItem)));
    } else if (activeFeedFilter === 'BRANDS') {
      setVisibleFeed(filteredBrandProducts);
    } else if (activeFeedFilter === 'AI_INVENT') {
      setVisibleFeed(filteredAiLooks.map(l => ({
        id: l.id,
        type: 'outfit' as const,
        title: `AI Design: ${l.vibe}`,
        description: l.prompt,
        imageUrl: l.imageUrl,
        vibeTags: [l.vibe, l.season || 'All-Season', 'AI-Invent'].filter(Boolean),
        likesCount: 24,
        bookmarksCount: 5,
        createdAt: l.createdAt,
        shopName: l.provider || "Imagen 4.0",
        isAiLook: true
      } as unknown as FeedItem)));
    }
  }, [activeFeedFilter, filteredCommunityPosts, filteredBrandProducts, filteredAiLooks]);

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
    }
  };

  const handleStylistConsult = async (query: string) => {
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
    setAiExplanation("Analyzing style coordinates...");
    setActiveFiosReport(null);

    // Set up a safety timeout (20 seconds) to prevent infinite pending/loading
    let isRequestResolved = false;
    const timeoutId = setTimeout(() => {
      if (!isRequestResolved) {
        console.warn("[AI Stylist Consult] Timeout triggered! Request took longer than safety window.");
        isRequestResolved = true;
        setIsAiCurating(false);
        const fallbackMsg = "Unable to reach the styling engine. Try a minimalist look with neutral layers for a clean, timeless silhouette.";
        setAiExplanation(fallbackMsg);
      }
    }, 20000);

    try {
      let token: string | null = null;
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      } else if (typeof localStorage !== 'undefined' && localStorage.getItem('auth_guest_active') === 'true') {
        token = 'guest-token';
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      setAiExplanation("Connecting with Gemini recommendation engine...");

      const response = await fetch('/.netlify/functions/recommend-mvp', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          userInput: query.trim(),
          tenantId: 'default'
        }),
      });

      if (isRequestResolved) return; // Already timed out

      isRequestResolved = true;
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Styling engine returned status ${response.status}`);
      }

      const data = await response.json();

      if (data && (data.mode === "CONFIG_ERROR" || data.mode === "GEMINI_FAILED" || data.mode === "GEMINI_PARSE_ERROR")) {
        throw new Error("Fashion Intelligence Engine executed with exception.");
      }

      if (data && Array.isArray(data.outfits) && data.user_profile) {
        setActiveFiosReport(data);
        setAiExplanation(data.final_recommendation || data.style_summary || "Curation complete.");
        setSearchPrompt(query);
        
        // 1. Update the style preference scores dynamically based on Gemini's parsed style
        const styleName = (data.user_profile.style || "").toLowerCase();
        const queryLower = query.toLowerCase();
        
        styleProfile.setScores(prev => {
          const updated = { ...prev };
          if (styleName.includes('minimal') || queryLower.includes('minimal') || queryLower.includes('clean') || queryLower.includes('sleek')) {
            updated.minimalist = Math.min(100, updated.minimalist + 12);
          }
          if (styleName.includes('street') || queryLower.includes('street') || queryLower.includes('hoodie') || queryLower.includes('cargo')) {
            updated.streetwear = Math.min(100, updated.streetwear + 12);
          }
          if (styleName.includes('luxury') || queryLower.includes('luxury') || queryLower.includes('cashmere') || queryLower.includes('silk') || queryLower.includes('tailored') || queryLower.includes('wool')) {
            updated.luxury = Math.min(100, updated.luxury + 12);
          }
          if (styleName.includes('experimental') || styleName.includes('avant') || queryLower.includes('experimental') || queryLower.includes('bold') || queryLower.includes('asymmetric')) {
            updated.experimental = Math.min(100, updated.experimental + 12);
          }
          return updated;
        });

        // 2. Map the generated outfits to AILooks
        const mappedLooks: AILook[] = (data.outfits || []).map((outfit: any, index: number) => {
          const lookId = `ai-look-${Date.now()}-${index}`;
          const top = outfit.items?.top || '';
          const bottom = outfit.items?.bottom || '';
          const promptText = outfit.fashion_reason || outfit.why_this_works || `AI Curated Coord: ${top}, ${bottom}`;
          return {
            id: lookId,
            imageUrl: getGarmentImage(top || bottom || data.style_title || ''),
            prompt: promptText,
            provider: "Google-Imagen-4.0",
            vibe: data.user_profile?.style || "Curated",
            season: data.user_profile?.occasion || "All-Season",
            createdAt: new Date().toISOString()
          };
        });

        // Try writing to Firestore for persistence
        try {
          if (auth.currentUser) {
            for (const look of mappedLooks) {
              await addDoc(collection(db, 'generatedLooks'), {
                imageUrl: look.imageUrl,
                prompt: look.prompt,
                provider: look.provider,
                vibe: look.vibe,
                season: look.season,
                createdAt: serverTimestamp()
              });
            }
          }
        } catch (fsErr) {
          console.warn("Could not persist generated look to Firestore:", fsErr);
        }

        // Prepend to local state for immediate feedback
        setAiLooks(prev => [...mappedLooks, ...prev]);

        // 3. Shift active filter tab to AI_INVENT and scroll smoothly
        setActiveFeedFilter('AI_INVENT');
        setTimeout(() => {
          const element = document.getElementById('classification-tabs-start');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);

      } else {
        throw new Error('Retrieved output failed response validation.');
      }

    } catch (error) {
      console.error("[AI Stylist Consult] Request failed, using local fallback processor:", error);
      
      // Local fallback parsing using our static matching logic
      try {
        const base = AIEngine.generateFeed(wardrobe, customShopPosts);
        const { explanation } = AIEngine.processSearchQuery(query, base);
        setAiExplanation(explanation || "Try a minimalist outfit with neutral tones for a balanced look.");
        setSearchPrompt(query);
      } catch (fallbackErr) {
        setAiExplanation("Try a minimalist outfit with neutral tones for a balanced look.");
        setSearchPrompt(query);
      }
    } finally {
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

      {/* 1.1 AI STYLIST CORE MVP SUITE (PHASE 2) */}
      <AIFashionMVPSuite />

      {/* Visual Quick Onboarding Entry Grid */}
      <div className="grid grid-cols-2 gap-3 pb-2 pt-1">
        <button
          onClick={() => {
            setActiveFeedFilter('COMMUNITY');
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
            <span className="block text-xs font-serif font-medium tracking-wide">👥 Community Fits</span>
            <span className="text-[10px] text-white/55 font-mono leading-none mt-1 block">Scroll down & explore the feed</span>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveFeedFilter('AI_INVENT');
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
            <span className="block text-xs font-serif font-medium tracking-wide">🧑🎨 AI Generated Outfits</span>
            <span className="text-[10px] text-white/55 font-mono leading-none mt-1 block">Fit style combinations on avatars</span>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveFeedFilter('BRANDS');
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
            <span className="block text-xs font-serif font-medium tracking-wide">🏪 Explore Brands & Boutiques</span>
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

        {/* AI curation context note & deluxe report */}
        <AnimatePresence>
          {activeFiosReport && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-white/[0.01] border-t border-dashed border-white/10 pt-4 mt-3 space-y-4 text-left"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-bold">
                    Sartorial Synthesis Report
                  </span>
                  <h3 className="text-lg font-serif italic text-white font-light pt-1.5 leading-snug">
                    {activeFiosReport.style_title || "Modern Aesthetic Coordinates"}
                  </h3>
                </div>
                <div className="flex flex-col items-end shrink-0 bg-white/[0.03] px-3 py-1 rounded-xl border border-white/5">
                  <span className="text-[14px] font-mono font-bold text-amber-400">98%</span>
                  <span className="text-[8.5px] font-mono text-white/30 uppercase tracking-widest">Match Score</span>
                </div>
              </div>

              <div className="space-y-2 bg-[#0c0c0c] border border-white/5 p-3.5 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/50">Stylist Directives</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-serif italic">
                  "{activeFiosReport.style_summary || activeFiosReport.final_recommendation}"
                </p>
                {activeFiosReport.why_this_works && (
                  <p className="text-[10px] text-white/45 leading-relaxed pt-2 border-t border-white/[0.03] mt-2">
                    <span className="font-semibold text-white/60">Aesthetic Harmony:</span> {activeFiosReport.why_this_works}
                  </p>
                )}
              </div>

              {/* Coordinates Breakdown Grid */}
              <div className="space-y-2">
                <span className="text-[8px] font-mono uppercase tracking-widest text-white/30 block">Suggested Coordinates</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {(activeFiosReport.outfits || []).slice(0, 2).map((outfit: any, oIdx: number) => (
                    <div key={oIdx} className="bg-white/[0.01] border border-white/5 rounded-xl p-3 space-y-2.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-mono uppercase text-amber-300">Look Coordinate 0{oIdx + 1}</span>
                          <span className="text-[9px] font-mono text-white/50">{outfit.scores?.total_score || 94}% Confidence</span>
                        </div>
                        <div className="space-y-1 text-[11px] font-mono text-white/70">
                          {outfit.items?.top && (
                            <div className="flex gap-1">
                              <span className="text-white/30">├</span>
                              <span className="text-white/40">Top:</span>
                              <span className="text-white/80 truncate">{outfit.items.top}</span>
                            </div>
                          )}
                          {outfit.items?.bottom && (
                            <div className="flex gap-1">
                              <span className="text-white/30">├</span>
                              <span className="text-white/40">Btm:</span>
                              <span className="text-white/80 truncate">{outfit.items.bottom}</span>
                            </div>
                          )}
                          {outfit.items?.shoes && (
                            <div className="flex gap-1">
                              <span className="text-white/30">└</span>
                              <span className="text-white/40">Shoes:</span>
                              <span className="text-white/80 truncate">{outfit.items.shoes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] font-serif italic text-white/50 leading-relaxed border-t border-white/[0.03] pt-2">
                        {outfit.fashion_reason || outfit.why_this_works || "Curated layer coordination"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveFeedFilter('AI_INVENT');
                    const element = document.getElementById('classification-tabs-start');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 py-2 bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/20 hover:border-purple-500 transition-all text-[9.5px] font-mono uppercase tracking-wider rounded-lg font-bold cursor-pointer text-center"
                >
                  View Interactive Looks in Feed ↓
                </button>
              </div>
            </motion.div>
          )}

          {!activeFiosReport && aiExplanation && (
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
      <div id="classification-tabs-start" className="flex flex-col space-y-4 border-b border-white/[0.04] pb-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {[
              { id: 'COMMUNITY', label: 'Community Fits' },
              { id: 'BRANDS', label: 'Brands & Boutiques' },
              { id: 'AI_INVENT', label: 'AI Invent' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFeedFilter(tab.id as any);
                  setPageLimit(4); // Reset pagination on tab swap
                }}
                className={`text-[11px] font-mono uppercase tracking-[0.12em] pb-2 relative transition-all cursor-pointer ${
                  activeFeedFilter === tab.id ? 'text-white font-semibold' : 'text-white/30 hover:text-white/60'
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

        {/* Tab Taglines & CTAs */}
        {activeFeedFilter === 'COMMUNITY' && (
          <p className="text-[10px] font-mono text-[#dfd7c2]/40">
            ✓ Daily routine fit checks posted by creators. Publish yours when ready for a picture.
          </p>
        )}
        {activeFeedFilter === 'BRANDS' && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
            <p className="text-[10px] font-mono text-emerald-300">
              ✓ Verified boutique apparel assets. Open Seller Hub to register items & accept customer orders.
            </p>
            <button
              onClick={() => setIsSellerDashboardOpen(true)}
              className="text-[9px] font-mono uppercase text-white bg-emerald-500/20 hover:bg-emerald-500 px-2.5 py-1 rounded border border-emerald-500/20 transition-all font-semibold cursor-pointer"
            >
              Upload Brand Assets
            </button>
          </div>
        )}
        {activeFeedFilter === 'AI_INVENT' && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 bg-purple-500/5 border border-purple-500/10 p-3 rounded-xl">
            <p className="text-[10px] font-mono text-purple-300">
              ✓ Styled by AI. Co-create garment combinations using our high-fidelity Imagen models.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('ai-style-suite-header');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }
              }}
              className="text-[9px] font-mono uppercase text-white bg-purple-500/20 hover:bg-purple-500 px-2.5 py-1 rounded border border-purple-500/20 transition-all font-semibold cursor-pointer"
            >
              Launch Design Studio
            </button>
          </div>
        )}
      </div>

      {/* 3.1 DAILY CURATED REFRESH LOOP RAIL (Only for Brands) */}
      {activeFeedFilter === 'BRANDS' && (
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
      )}

      {/* Inline Uploader Form (Only for Community Fit check) */}
      {activeFeedFilter === 'COMMUNITY' && (
        <div className="bg-[#0b0b0b]/40 border border-white/[0.06] p-5 rounded-2xl shadow-xl space-y-4 text-left">
          <div className="flex items-center gap-2">
            <PenSquare className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-white">Daily Fit Check</h3>
          </div>
          <p className="text-[11px] font-serif text-white/50 italic leading-normal">
            "Share your daily style routine. Whenever you are ready for a picture, capture or upload your fit."
          </p>

          <form onSubmit={handleCommunityPostSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 block pb-1">Style Caption / Vibe</label>
                  <input
                    type="text"
                    required
                    value={communityCaption}
                    onChange={e => setCommunityCaption(e.target.value)}
                    placeholder="e.g. Vintage leather layering on a chilly Tuesday..."
                    className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/30 rounded-lg transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 block pb-1">Apparel Details</label>
                  <input
                    type="text"
                    required
                    value={communityDetails}
                    onChange={e => setCommunityDetails(e.target.value)}
                    placeholder="e.g. Leather jacket, thrifted denim, custom boots"
                    className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/30 rounded-lg transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-wider text-white/40 block pb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={communityVibeTags}
                    onChange={e => setCommunityVibeTags(e.target.value)}
                    placeholder="casual, vintage, layering"
                    className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/30 rounded-lg transition-colors"
                  />
                </div>
              </div>

              {/* Image upload widget */}
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block pb-1">Outfit Photo</span>
                  {communityImage ? (
                    <div className="relative group rounded-xl overflow-hidden border border-white/10 h-[115px] bg-[#0c0c0c] flex items-center justify-center">
                      <img src={communityImage} className="max-w-full max-h-full object-contain" alt="Fit check preview" />
                      <button
                        type="button"
                        onClick={() => setCommunityImage(null)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-rose-400 font-mono text-[10px] uppercase font-bold"
                      >
                        [ Remove Photo ]
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer border border-dashed border-white/10 hover:border-cyan-500/30 bg-white/[0.01] hover:bg-cyan-500/[0.02] rounded-xl flex flex-col items-center justify-center h-[115px] transition-all gap-1 text-center p-3">
                      <Plus className="w-5 h-5 text-white/30" />
                      <span className="text-[10px] font-mono text-white/60">Drag & Drop or Click to Upload</span>
                      <span className="text-[8px] font-mono text-white/25">Supports PNG, JPG (Fit Check Portrait)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCommunityPhotoChange}
                      />
                    </label>
                  )}
                </div>

                {/* Simulated Quick Selfie trigger for instant "ready for picture" feeling */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Seeding a random premium fit check picture
                      const pics = [
                        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop"
                      ];
                      setCommunityImage(pics[Math.floor(Math.random() * pics.length)]);
                    }}
                    className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-mono uppercase text-white/70 hover:text-white rounded-lg transition-all cursor-pointer"
                  >
                    📸 Simulate Camera
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploadingCommunityPost || !communityImage}
              className="w-full py-2 bg-white text-black hover:bg-neutral-200 transition-all text-[10px] font-mono uppercase tracking-wider rounded-lg font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isUploadingCommunityPost ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing Fit...</span>
                </>
              ) : (
                <span>Publish Daily Fit Check</span>
              )}
            </button>
          </form>
        </div>
      )}

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
                <p className="font-serif italic text-sm text-white/70">"No fits found under this selection"</p>
                <p className="text-[11px] font-sans text-white/40 max-w-sm mx-auto leading-relaxed">
                  Try searching for alternate keywords, posting a new fit check, or clear active searches to explore default silhouettes.
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSearchPrompt('');
                  }}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-white text-white hover:text-black border border-white/5 hover:border-white transition-all text-[9px] font-mono uppercase tracking-widest rounded cursor-pointer"
                >
                  Clear Searches
                </button>
              </div>
            </motion.div>
          ) : (
            visibleFeed.slice(0, pageLimit).map((rawFeedItem) => {
              const feedItem = rawFeedItem as any;
              // Custom Community Item Card Render
              if (feedItem.isCommunity) {
                const hasLiked = likedPosts[feedItem.id];
                return (
                  <motion.div 
                    key={feedItem.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0b0b0b]/40 border border-white/[0.05] rounded-3xl overflow-hidden p-5 flex flex-col md:flex-row gap-6 hover:border-white/10 transition-all text-left"
                  >
                    {/* Photo container */}
                    <div className="relative group w-full md:w-[180px] h-[240px] shrink-0 bg-[#070707] rounded-2xl overflow-hidden border border-white/5">
                      <img 
                        src={feedItem.imageUrl} 
                        alt={feedItem.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=150&auto=format&fit=crop"; }}
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[8px] font-mono uppercase tracking-widest bg-black/75 backdrop-blur-md text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/10 font-bold">
                          Community Fit
                        </span>
                      </div>
                    </div>

                    {/* Context and actions container */}
                    <div className="flex-1 flex flex-col justify-between py-1 space-y-4">
                      <div className="space-y-3">
                        {/* Poster Identity */}
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={feedItem.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'} 
                            className="w-7 h-7 rounded-full border border-white/10 shrink-0"
                            alt="User avatar" 
                          />
                          <div>
                            <span className="block text-[11px] font-mono font-medium text-white">{feedItem.shopName}</span>
                            <span className="block text-[8px] font-mono text-white/30 uppercase tracking-wider">
                              Routine Fit • {feedItem.createdAt ? new Date(feedItem.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just now"}
                            </span>
                          </div>
                        </div>

                        {/* Caption & details */}
                        <div className="space-y-2">
                          <h4 className="font-serif italic text-sm text-white/90 leading-relaxed font-light">
                            "{feedItem.title}"
                          </h4>
                          <div className="space-y-1 bg-white/[0.01] border border-white/[0.03] p-2.5 rounded-xl">
                            <span className="text-[8px] font-mono uppercase text-white/30 tracking-wider block">OUTFIT COMPOSITION:</span>
                            <p className="text-[11px] font-sans text-white/70">{feedItem.description}</p>
                          </div>
                        </div>

                        {/* Vibe Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {feedItem.vibeTags?.map((tag: string, tIdx: number) => (
                            <span key={tIdx} className="text-[8.5px] font-mono text-white/40 bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded uppercase">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Row */}
                      <div className="border-t border-white/5 pt-3.5 flex justify-between items-center">
                        <div className="flex gap-2">
                          {/* Like button */}
                          <button
                            onClick={() => handleLikeCommunityPost(feedItem.id, feedItem.likesCount || 0)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-mono uppercase transition-all cursor-pointer ${
                              hasLiked 
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold scale-105' 
                                : 'bg-white/[0.02] border-white/5 text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                            <span>{hasLiked ? (feedItem.likesCount || 0) + 1 : feedItem.likesCount || 0}</span>
                          </button>

                          {/* Closet Copy integration */}
                          <button
                            onClick={() => {
                              handleSaveToCloset(
                                `${feedItem.shopName}'s Fit Piece`,
                                feedItem.description || "Garment details imported from a beautiful community fit check.",
                                'Casual',
                                feedItem.imageUrl
                              );
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.02] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/20 text-[10px] font-mono uppercase text-white/50 hover:text-cyan-300 rounded-lg transition-all cursor-pointer"
                          >
                            <Shirt className="w-3.5 h-3.5" />
                            <span>Save to Closet</span>
                          </button>
                        </div>

                        {/* Wear/Simulation launcher */}
                        <button
                          onClick={() => handleWearOutfit(feedItem.id, [feedItem.title])}
                          className="px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/20 hover:border-cyan-500 transition-all text-[9px] font-mono uppercase tracking-wider rounded-lg font-bold cursor-pointer"
                        >
                          Try On Fit →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // Custom AI Invent Look Card Render
              if (feedItem.isAiLook) {
                const isSaved = savedAiLookIds.has(feedItem.id);
                return (
                  <motion.div 
                    key={feedItem.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0b0b0b]/40 border border-white/[0.05] rounded-3xl overflow-hidden p-5 flex flex-col md:flex-row gap-6 hover:border-white/10 transition-all text-left"
                  >
                    {/* Photo container with interactive zoom */}
                    <div className="relative group w-full md:w-[180px] h-[240px] shrink-0 bg-[#070707] rounded-2xl overflow-hidden border border-white/5">
                      <img 
                        src={feedItem.imageUrl} 
                        alt={feedItem.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=150&auto=format&fit=crop"; }}
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[8px] font-mono uppercase tracking-widest bg-purple-950/85 backdrop-blur-md text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/20 font-bold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 animate-pulse text-purple-300" />
                          AI INVENT
                        </span>
                      </div>
                    </div>

                    {/* Context and actions container */}
                    <div className="flex-1 flex flex-col justify-between py-1 space-y-4">
                      <div className="space-y-3">
                        {/* Poster Identity */}
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 font-mono text-[9px] font-bold">
                            AI
                          </div>
                          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                            GENERATED BY {feedItem.shopName}
                          </span>
                        </div>

                        {/* Prompt Details */}
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono uppercase text-purple-400/45 tracking-widest block">GENERATE INPUT PROMPT:</span>
                            <p className="text-[12px] font-serif italic text-white/95 leading-relaxed font-light">
                              "{feedItem.description}"
                            </p>
                          </div>
                        </div>

                        {/* Vibe Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {feedItem.vibeTags?.map((tag: string, tIdx: number) => (
                            <span key={tIdx} className="text-[8.5px] font-mono text-purple-300 bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons row */}
                      <div className="border-t border-white/5 pt-3.5 flex justify-between items-center">
                        {/* One-click Save directly to Closet */}
                        <button
                          onClick={() => handleSaveAiLookToCloset(feedItem)}
                          className={`px-3.5 py-1.5 border text-[10px] font-mono uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSaved 
                              ? 'bg-purple-500/10 border-purple-500/20 text-purple-300 font-semibold' 
                              : 'bg-white/[0.02] border-white/5 text-white/50 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Shirt className="w-3.5 h-3.5" />
                          <span>{isSaved ? "Saved!" : "Save to Closet"}</span>
                        </button>

                        {/* Virtual try on */}
                        <button
                          onClick={() => handleWearOutfit(feedItem.id, [feedItem.title])}
                          className="px-3.5 py-1.5 bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-black border border-purple-500/20 hover:border-purple-500 transition-all text-[9px] font-mono uppercase tracking-wider rounded-lg font-bold cursor-pointer"
                        >
                          Try On Design →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // Standard Brands/Products list card item
              return (
                <LazyFeedCard 
                  key={feedItem.id} 
                  item={feedItem}
                  onLike={handleLikeItem}
                  onBookmark={handleBookmarkItem}
                  onSaveToCloset={handleSaveToCloset}
                  onWearOutfit={handleWearOutfit}
                />
              );
            })
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

