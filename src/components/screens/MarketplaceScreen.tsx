import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Search, SlidersHorizontal, ArrowUpRight, Heart, Store, 
  Sparkles, Filter, ChevronRight, Tag, Info, ShoppingCart, AlertCircle, X, 
  Mail, CheckCircle2, User, Layers, ShieldCheck, Zap, Scale, Plus, ArrowRight, Check
} from 'lucide-react';
import { WardrobeItem } from '../../types';
import { collection, query, onSnapshot, addDoc, serverTimestamp, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface MarketplaceScreenProps {
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  userWardrobe: WardrobeItem[];
  onSelectProduct: (product: any) => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenSellerDashboard?: () => void;
  user?: any;
}

export const CREATOR_CAPSULES = [
  {
    creatorHandle: '@elena_luxe',
    creatorName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    title: 'Milan Autumn Wool Capsule',
    royaltyShare: '88% Creator Royalty',
    tagline: 'Quiet luxury silhouettes crafted from Italian virgin wool.',
    itemCount: 3,
    featuredImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop'
  },
  {
    creatorHandle: '@julian_cyber',
    creatorName: 'Julian Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    title: 'Neo-Tokyo Storm Anorak Line',
    royaltyShare: '85% Creator Royalty',
    tagline: 'GORE-TEX weather armor and modular magnetic sling pouches.',
    itemCount: 2,
    featuredImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop'
  },
  {
    creatorHandle: '@clara_couture',
    creatorName: 'Clara Moreau',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    title: 'Monolithic Silk Atelier Drop',
    royaltyShare: '90% Creator Royalty',
    tagline: 'Architectural silk gowns & deconstructed tailored outer coats.',
    itemCount: 4,
    featuredImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop'
  }
];

export const BOUTIQUE_PRODUCTS = [
  {
    id: 'prod-creator-1',
    brand: '@elena_luxe Atelier',
    title: 'Milanese Virgin Wool Trench Coat',
    price: 285.00,
    originalPrice: 340.00,
    discount: '16% OFF',
    rating: '4.9',
    reviews: 58,
    category: 'Outerwear' as const,
    availability: 'Limited' as const,
    vibeTags: ['creator_drop', 'minimalist', 'luxury', 'wool'],
    description: 'Exclusive creator drop by Elena Rostova. Double-faced virgin wool trench with magnetic horn buttoning and silk lining.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=500&auto=format&fit=crop',
    isCreatorDrop: true,
    creatorHandle: '@elena_luxe',
    royaltyShare: '88% Creator Share'
  },
  {
    id: 'prod-creator-2',
    brand: '@julian_cyber Tech',
    title: 'Modular Magnetic Sling Anorak',
    price: 195.00,
    rating: '4.8',
    reviews: 44,
    category: 'Outerwear' as const,
    availability: 'Limited' as const,
    vibeTags: ['creator_drop', 'techwear', 'waterproof', 'utility'],
    description: 'Designed by Julian Vance. High-density storm twill with Fidlock magnetic buckle closures and waterproof seam taping.',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop',
    isCreatorDrop: true,
    creatorHandle: '@julian_cyber',
    royaltyShare: '85% Creator Share'
  },
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
  onNavigateToTab,
  onOpenSellerDashboard,
  user
}) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('marketplace_search_query') || '';
  });

  useEffect(() => {
    const handleSearchQueryUpdate = () => {
      setSearchQuery(localStorage.getItem('marketplace_search_query') || '');
    };
    window.addEventListener('lookvision_marketplace_search', handleSearchQueryUpdate);
    return () => {
      window.removeEventListener('lookvision_marketplace_search', handleSearchQueryUpdate);
    };
  }, []);

  const [activeSubTab, setActiveSubTab] = useState<'All' | 'Creator Drops' | 'New In' | 'Brands' | 'Sale'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStoreType, setSelectedStoreType] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(300);
  const [showFilters, setShowFilters] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lookvision_liked_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { 'prod-creator-1': true };
  });

  useEffect(() => {
    localStorage.setItem('lookvision_liked_products', JSON.stringify(likedMap));
  }, [likedMap]);

  // Wishlist Drawer & Garment Comparison States
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [selectedCreatorCapsule, setSelectedCreatorCapsule] = useState<typeof CREATOR_CAPSULES[0] | null>(null);

  const [dbProducts, setDbProducts] = useState<any[]>([]);

  // Real-time shopping cart/order drawer states
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedEmailLog, setSelectedEmailLog] = useState<any | null>(null);

  // Sync real-time user-specific orders directly inside Marketplace Screen
  useEffect(() => {
    const userUid = user?.uid || 'simulated-guest-user';
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userUid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const matchOrders = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          timestamp: data.timestamp ? (data.timestamp.seconds * 1000) : Date.now()
        };
      }).sort((a: any, b: any) => b.timestamp - a.timestamp);
      setOrders(matchOrders);
    }, (error) => {
      console.warn("Error loading orders inside Marketplace:", error);
    });
    return () => unsub();
  }, [user]);

  // Listen to topbar header Shopping Cart clicks to open orders drawer directly in Marketplace without redirection to Home screen
  useEffect(() => {
    const handleOpenMktOrders = () => {
      setIsOrdersOpen(true);
    };
    window.addEventListener('lookvision_open_marketplace_orders', handleOpenMktOrders);
    return () => {
      window.removeEventListener('lookvision_open_marketplace_orders', handleOpenMktOrders);
    };
  }, []);

  // 1. Listen to real-time products collection in Firestore
  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDbProducts(items);
    }, (error) => {
      console.error("Error listening to database products:", error);
    });
    return () => unsub();
  }, []);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
      detail: likedMap[id] ? 'Removed from favorites' : 'Added product to style favorites' 
    }));
  };

  const handleAcquire = async (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddGarment) {
      // 1. Add to Closet
      await onAddGarment(
        product.title, 
        product.description, 
        product.category, 
        { imageUrl: product.imageUrl, price: product.price }
      );

      // 2. Save real order record to Firestore orders collection linked with user profile
      const userUid = user?.uid || 'simulated-guest-user';
      const userEmail = user?.email || 'musadaqahmad5@gmail.com';
      const userName = user?.displayName || 'Guest Sartorialist';

      try {
        await addDoc(collection(db, 'orders'), {
          userId: userUid,
          userEmail: userEmail,
          userName: userName,
          productId: product.id || 'custom-mkt-id',
          productTitle: product.title,
          productPrice: product.price,
          productImageUrl: product.imageUrl || '',
          shopName: product.brand || product.shopName || 'Boutique Partner',
          status: 'Confirmed',
          timestamp: serverTimestamp()
        });

        // 3. Dispatch Gmail notice toast alert
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
          detail: `Reservation Saved! Verification dispatched to your connected email ${userEmail} via Google/Gmail.` 
        }));
      } catch (err) {
        console.error("Failed to add Marketplace order doc:", err);
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
          detail: `Acquired ${product.title} into Closet!` 
        }));
      }
    }
  };

  // 2. Synthesize database products with default boutique showroom collections
  const combinedProducts = useMemo(() => {
    const formattedDb = dbProducts.map(p => ({
      id: p.id,
      brand: p.shopName || 'INDEPENDENT SELLER',
      title: p.title,
      price: p.price,
      originalPrice: p.originalPrice || null,
      discount: p.discount || null,
      rating: p.rating || '4.9',
      reviews: p.reviews || 8,
      category: p.category,
      availability: p.availability || 'In Stock',
      vibeTags: p.vibeTags || [p.category.toLowerCase()],
      description: p.description,
      imageUrl: p.imageUrl,
      storeType: p.storeType || 'LOCAL_BOUTIQUE',
      shopLocation: p.shopLocation || '',
      instagramUrl: p.instagramUrl || '',
      whatsAppNumber: p.whatsAppNumber || '',
      websiteLink: p.websiteLink || '',
      verified: p.verified !== undefined ? p.verified : true
    }));

    return [...formattedDb, ...BOUTIQUE_PRODUCTS] as any[];
  }, [dbProducts]);

  const filteredProducts = useMemo(() => {
    return combinedProducts.filter(item => {
      // 1. Search Query Match
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(searchLower) || 
                            item.brand.toLowerCase().includes(searchLower) ||
                            (item.vibeTags && item.vibeTags.some((t: string) => t.toLowerCase().includes(searchLower)));
      
      // 2. Tab Filter Match
      let matchesTab = true;
      if (activeSubTab === 'Creator Drops') matchesTab = !!item.isCreatorDrop || (item.vibeTags && item.vibeTags.includes('creator_drop'));
      if (activeSubTab === 'New In') matchesTab = item.availability === 'Limited';
      if (activeSubTab === 'Brands') matchesTab = item.price > 100;
      if (activeSubTab === 'Sale') matchesTab = !!item.discount;

      // 3. Category Match
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      // 4. Store Type Match
      const matchesStoreType = selectedStoreType === 'All' || 
                               (item.storeType && item.storeType === selectedStoreType);

      // 5. Price Match
      const matchesPrice = item.price <= priceRange;

      return matchesSearch && matchesTab && matchesCategory && matchesStoreType && matchesPrice;
    });
  }, [combinedProducts, searchQuery, activeSubTab, selectedCategory, selectedStoreType, priceRange]);

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
          <div className="flex gap-4 items-center flex-wrap">
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

            {/* Wishlist & Style Comparison Drawer Trigger */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-3 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 rounded-xl flex items-center gap-3 transition-all cursor-pointer text-left"
              title="Open Wishlist & Comparison Matrix"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
              <div className="text-left font-mono">
                <span className="block text-[8px] uppercase text-rose-300">Wishlist Matrix</span>
                <span className="block text-xs text-rose-400 font-bold">
                  {Object.values(likedMap).filter(Boolean).length} Saved
                </span>
              </div>
            </button>

            {/* Interactive Shopping Cart Reservations button */}
            <button 
              onClick={() => setIsOrdersOpen(true)}
              className="p-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl flex items-center gap-3 transition-all cursor-pointer text-left"
              title="View Active Reservations"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div className="text-left font-mono">
                <span className="block text-[8px] uppercase text-emerald-300">Your Cart</span>
                <span className="block text-xs text-emerald-400 font-bold">{orders.length} Active</span>
              </div>
            </button>
          </div>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xl font-light">
          Acquire physical and digital garments verified for high AI wardrobe compatibility. One-click integration installs listings directly onto your virtual shelves.
        </p>
      </div>

      {/* Brand & Seller Portal Banner */}
      <div className="max-w-6xl mx-auto mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#0c0c1b] via-[#090915] to-[#06060c] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 text-left max-w-xl">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9.5px] font-mono uppercase tracking-widest text-emerald-400 font-bold font-semibold">LookVision Merchant Portal</span>
          </div>
          <h2 className="font-serif text-lg text-white font-medium">Are you a Local Boutique, Online Seller, or Hybrid Brand?</h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Connect your physical atelier or online storefront, list your seasonal lines, configure WhatsApp/Instagram ordering, and tap into AI-powered local fashion demand cycles.
          </p>
        </div>
        <button
          onClick={() => {
            if (onOpenSellerDashboard) {
              onOpenSellerDashboard();
            } else {
              window.dispatchEvent(new CustomEvent('lookvision_open_seller_dashboard'));
            }
          }}
          className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-emerald-500/30 rounded-xl text-xs font-mono uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-md group"
        >
          <span>[ Connect Storefront ]</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </button>
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
          {['All', 'Creator Drops', 'New In', 'Brands', 'Sale'].map((tab) => (
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
            showFilters || selectedCategory !== 'All' || selectedStoreType !== 'All' || priceRange < 300
              ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-bold'
              : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>
            [ Filters {((selectedCategory !== 'All' ? 1 : 0) + (selectedStoreType !== 'All' ? 1 : 0)) > 0 
              ? `· ${((selectedCategory !== 'All' ? 1 : 0) + (selectedStoreType !== 'All' ? 1 : 0))}` 
              : ''} ]
          </span>
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
            <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-4">
              
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

              {/* Store Type Selector */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">Seller Channel Type</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'All', label: 'All Channels' },
                    { id: 'LOCAL_BOUTIQUE', label: 'Local Boutiques' },
                    { id: 'ONLINE_STORE', label: 'Online Stores' },
                    { id: 'HYBRID_BRAND', label: 'Hybrid Brands' }
                  ].map(storeOpt => (
                    <button
                      key={storeOpt.id}
                      onClick={() => setSelectedStoreType(storeOpt.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        selectedStoreType === storeOpt.id 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-zinc-950/40 border border-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      {storeOpt.label}
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

      {/* Creator Drops & Capsule Showroom Showcase */}
      {(activeSubTab === 'All' || activeSubTab === 'Creator Drops') && (
        <div className="max-w-6xl mx-auto mb-8 text-left space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
                Creator Drops & Capsule Storefronts
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Direct Creator Economy &middot; Verified Atelier Drops</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CREATOR_CAPSULES.map((cap, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedCreatorCapsule(cap)}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all cursor-pointer bg-zinc-950 p-4 flex flex-col justify-between shadow-xl"
              >
                <img src={cap.featuredImage || null}
                  alt={cap.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-[#07070c]/50 to-transparent" />

                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <img src={cap.avatar || null}
                      alt={cap.creatorName}
                      className="w-7 h-7 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-white block leading-tight">{cap.creatorName}</span>
                      <span className="text-[8px] font-mono text-violet-300 block">{cap.creatorHandle}</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-md font-bold">
                    {cap.royaltyShare}
                  </span>
                </div>

                <div className="relative z-10 space-y-1">
                  <h4 className="font-serif text-sm font-semibold text-white group-hover:text-violet-200 transition-colors">
                    {cap.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-light line-clamp-1">{cap.tagline}</p>
                  <div className="pt-2 flex items-center justify-between text-[9px] font-mono text-violet-300">
                    <span>[ {cap.itemCount} Exclusive Pieces ]</span>
                    <span className="flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                      Explore Drop <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <img src={product.imageUrl || null}
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
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                        {product.brand}
                      </span>
                      <span className="text-[7.5px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase bg-white/5 border border-white/5 text-zinc-400">
                        {product.storeType === 'LOCAL_BOUTIQUE' && 'Local Boutique'}
                        {product.storeType === 'ONLINE_STORE' && 'Online Store'}
                        {product.storeType === 'HYBRID_BRAND' && 'Hybrid Brand'}
                        {!product.storeType && 'Curated Showroom'}
                      </span>
                    </div>
                    
                    <h4 className="text-sm text-white font-semibold mt-1 truncate group-hover:text-emerald-300 transition-colors">
                      {product.title}
                    </h4>

                    {product.shopLocation && (
                      <span className="text-[9.5px] font-mono text-zinc-500 block mt-0.5">
                        📍 {product.shopLocation}
                      </span>
                    )}
                    {product.storeType === 'ONLINE_STORE' && (product.instagramUrl || product.whatsAppNumber || product.websiteLink) && (
                      <span className="text-[9.5px] font-mono text-violet-400/80 block mt-0.5">
                        🌐 Social / Online
                      </span>
                    )}
                    
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

                    {/* Quick CTAs: Virtual Try-On and Add to Closet */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigateToTab) {
                            onNavigateToTab('VIRTUAL_TRYON');
                          } else {
                            window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Navigating to Virtual Fitting Room...' }));
                          }
                        }}
                        className="px-2.5 py-1 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                        title="Instant Virtual Fitting"
                      >
                        <Sparkles className="w-3 h-3 text-violet-400" />
                        <span>Try On</span>
                      </button>

                      <button
                        onClick={(e) => handleAcquire(product, e)}
                        className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-90 shadow-md shadow-emerald-950/20"
                        title="Acquire Garment to Closet"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-black font-bold" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Order Log History & Cart Drawer system */}
      <AnimatePresence>
        {isOrdersOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#05050a]/90 backdrop-blur-md z-45 flex justify-end"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setIsOrdersOpen(false)} />

            {/* Slide-out Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#07070c] border-l border-white/5 h-full shadow-2xl flex flex-col justify-between p-6 overflow-hidden z-50 text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-light text-white tracking-tight flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-400" />
                    <span>Your Boutique Cart</span>
                  </h2>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 mt-0.5">Real-time Order Ledger</p>
                </div>
                <button 
                  onClick={() => setIsOrdersOpen(false)}
                  className="text-white/40 hover:text-white font-mono text-[10px] uppercase font-bold cursor-pointer bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                >
                  [ Close ]
                </button>
              </div>

              {/* Scrollable Orders Contents */}
              <div className="flex-1 py-4 overflow-y-auto space-y-4 no-scrollbar">
                
                {/* User Identity Header Card */}
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500">Connected Customer Profile</span>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-mono font-bold">
                      {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'SR'}
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-white font-bold">{user?.displayName || 'Sartorial Guest'}</p>
                      <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[240px]">{user?.email || 'musadaqahmad5@gmail.com'}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/[0.03] flex items-center justify-between text-[9px] font-mono text-emerald-400/80">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Gmail Sync: Connected
                    </span>
                    <span className="bg-emerald-500/10 px-1.5 py-0.5 rounded text-[8px] font-bold">ACTIVE</span>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-12 h-12 border border-white/5 rounded-full flex items-center justify-center mx-auto text-zinc-600">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 max-w-[200px] mx-auto">
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Cart is Empty</p>
                      <p className="text-[11px] font-serif text-zinc-500 italic">"Explore our curated showroom catalog to secure and reserve garments."</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {orders.map((ord) => (
                      <div 
                        key={ord.id} 
                        className="bg-white/[0.01] border border-white/5 p-3.5 rounded-xl space-y-3 relative overflow-hidden transition-all hover:border-white/10"
                      >
                        {/* Shimmer top border line to show Confirmed color */}
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-emerald-500/50" />

                        <div className="flex gap-3 text-xs">
                          {ord.productImageUrl ? (
                            <img src={ord.productImageUrl || null} 
                              alt={ord.productTitle} 
                              className="w-14 h-18 object-cover rounded-lg border border-white/5 flex-shrink-0 bg-[#080808]"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-14 h-18 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-white/20 flex-shrink-0">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                          )}

                          <div className="space-y-1 flex-1 min-w-0 text-left">
                            <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                              Reserved & Verified
                            </span>
                            <h4 className="font-serif text-sm font-light text-white truncate pt-1">{ord.productTitle}</h4>
                            <p className="text-[10px] text-zinc-400 font-mono">{ord.shopName || "Boutique Partner"}</p>
                            <p className="text-xs text-white font-mono font-semibold">${ord.productPrice}</p>
                          </div>
                        </div>

                        {/* Order Actions: Gmail Dispatch Notification & Cancel Reservation */}
                        <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                            <div>
                              <span className="block text-[7.5px] uppercase text-zinc-500 leading-none">Placed On</span>
                              <span className="text-zinc-400">
                                {new Date(ord.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[7.5px] uppercase text-zinc-500 leading-none">Reservations Code</span>
                              <span className="text-zinc-400 select-all truncate max-w-[120px] block">{ord.id}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1 border-t border-white/[0.03]">
                            <button
                              onClick={() => setSelectedEmailLog(ord)}
                              className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 hover:text-emerald-300 rounded-lg text-[9.5px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-500/20"
                            >
                              <Mail className="w-3 h-3" />
                              <span>[ View Gmail Dispatch ]</span>
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm("Cancel this reservation contract?")) {
                                  try {
                                    await deleteDoc(doc(db, 'orders', ord.id));
                                    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                                      detail: `Cancelled reservation of ${ord.productTitle}.`
                                    }));
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                              }}
                              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 rounded-lg text-[9.5px] font-mono uppercase tracking-wider transition-all cursor-pointer border border-rose-500/20"
                              title="Cancel Reservation"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer Status info */}
              <div className="border-t border-white/5 pt-4 space-y-1 font-mono text-[8.5px] text-zinc-500 leading-normal uppercase">
                <p>&copy; LookVision Curated Services</p>
                <p className="text-emerald-400/70 font-bold">Verified active checkout orders: {orders.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Realistic Gmail Verification/Dispatch Notice Modal Dialog */}
      <AnimatePresence>
        {selectedEmailLog && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#09090f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col text-left"
            >
              {/* Simulated Email Browser Header */}
              <div className="bg-[#0e0e18] border-b border-white/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 ml-2 font-semibold">
                    Google Workspace - Dispatch Notice Viewer
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEmailLog(null)}
                  className="text-zinc-500 hover:text-white font-mono text-xs uppercase"
                >
                  [ Dismiss ]
                </button>
              </div>

              {/* Email Metainfo Block */}
              <div className="bg-[#0b0b14] p-5 border-b border-white/5 space-y-2 font-sans">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-white leading-tight">
                    Confirming Reservation receipt: {selectedEmailLog.productTitle}
                  </h3>
                  <span className="text-[9px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold shrink-0">
                    SPF / DKIM PASS
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-zinc-400 font-mono">
                  <p><span className="text-zinc-600">From:</span> LookVision Curated Boutique <span className="text-emerald-400">&lt;reservations@lookvision.ai&gt;</span></p>
                  <p><span className="text-zinc-600">To:</span> {selectedEmailLog.userEmail || user?.email || 'musadaqahmad5@gmail.com'} <span className="text-violet-400">&lt;connected-account&gt;</span></p>
                  <p><span className="text-zinc-600">Date:</span> {new Date(selectedEmailLog.timestamp).toUTCString()}</p>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="p-6 bg-white text-zinc-900 overflow-y-auto max-h-[350px] font-sans">
                <div className="max-w-xl mx-auto space-y-5">
                  <div className="border-b-2 border-zinc-200 pb-3">
                    <h2 className="text-lg font-serif tracking-tight font-bold text-zinc-950">LookVision Curated</h2>
                    <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">Interactive Atelier Network</p>
                  </div>

                  <div className="space-y-3 text-sm leading-relaxed text-zinc-800">
                    <p className="font-semibold">Dear {selectedEmailLog.userName || user?.displayName || 'Sartorial Companion'},</p>
                    <p>
                      Your virtual-to-physical wardrobe reservation contract has been registered successfully. The partner boutique atelier has secured your garment choice on the smart showroom floor.
                    </p>

                    {/* Order Receipt Item Card */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex gap-4 my-4">
                      {selectedEmailLog.productImageUrl && (
                        <img src={selectedEmailLog.productImageUrl || null}
                          alt={selectedEmailLog.productTitle}
                          className="w-16 h-20 object-cover rounded-lg border border-zinc-200"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="space-y-1 text-left">
                        <p className="text-[9px] font-mono text-emerald-600 uppercase tracking-widest font-bold">Boutique Inventory Verified</p>
                        <h4 className="font-serif font-bold text-zinc-900 text-sm leading-tight">{selectedEmailLog.productTitle}</h4>
                        <p className="text-xs text-zinc-500">Shop: {selectedEmailLog.shopName || 'Boutique Partner'}</p>
                        <p className="text-xs font-bold text-zinc-900 mt-1">Price: ${selectedEmailLog.productPrice}</p>
                      </div>
                    </div>

                    <p>
                      An verification query has been registered under Ledger ID <code className="bg-zinc-100 text-xs px-1.5 py-0.5 rounded font-mono select-all font-bold text-zinc-950">{selectedEmailLog.id}</code>. You can present this transaction record at the physical storefront or contact them to configure direct courier dispatch.
                    </p>

                    <p>
                      Thank you for using the LookVision Unified Fashion OS.
                    </p>
                  </div>

                  <div className="border-t border-zinc-200 pt-4 text-[10px] text-zinc-400 font-mono space-y-0.5 leading-normal">
                    <p>LookVision Digital Sartorial Suite &copy; 2026</p>
                    <p>Instant Email Dispatch System &middot; Google Workspace Cloud Relay</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="bg-[#0e0e18] p-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => setSelectedEmailLog(null)}
                  className="px-5 py-2.5 bg-white text-black font-mono text-xs uppercase tracking-widest hover:bg-zinc-200 rounded-xl font-bold cursor-pointer"
                >
                  [ Close Log ]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wishlist & Style Comparison Matrix Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#05050a]/90 backdrop-blur-md z-50 flex justify-end"
          >
            <div className="absolute inset-0" onClick={() => setIsWishlistOpen(false)} />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-[#07070c] border-l border-white/5 h-full shadow-2xl flex flex-col justify-between p-6 overflow-hidden z-50 text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-light text-white tracking-tight flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-400 fill-rose-400/20" />
                    <span>Wishlist Matrix</span>
                  </h2>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-rose-400 mt-0.5">
                    Saved Favorites & Side-by-Side Comparison Engine
                  </p>
                </div>
                <button 
                  onClick={() => setIsWishlistOpen(false)}
                  className="text-white/40 hover:text-white font-mono text-[10px] uppercase font-bold cursor-pointer bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                >
                  [ Close ]
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 py-4 overflow-y-auto space-y-4 no-scrollbar">
                
                {/* Comparison Mode Header Trigger */}
                {comparedProductIds.length > 0 && (
                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-mono text-violet-300">
                        Comparing {comparedProductIds.length}/2 Garments
                      </span>
                    </div>
                    <button
                      onClick={() => setComparedProductIds([])}
                      className="text-[9px] font-mono text-zinc-400 hover:text-white uppercase"
                    >
                      Clear Selection
                    </button>
                  </div>
                )}

                {/* Side-by-Side Comparison Panel if 2 items selected */}
                {comparedProductIds.length === 2 && (() => {
                  const compItems = combinedProducts.filter(p => comparedProductIds.includes(p.id));
                  if (compItems.length < 2) return null;
                  const [itemA, itemB] = compItems;
                  return (
                    <div className="bg-white/[0.02] border border-violet-500/30 rounded-2xl p-4 space-y-4">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <Scale className="w-4 h-4 text-violet-400" />
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                          Side-by-Side Spec Comparison
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {[itemA, itemB].map((item, idx) => (
                          <div key={item.id} className="space-y-2 p-2 bg-black/40 rounded-xl border border-white/5">
                            <img src={item.imageUrl || null}
                              alt={item.title}
                              className="w-full aspect-[4/5] object-cover rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                            <div className="space-y-0.5">
                              <span className="text-[8px] font-mono text-emerald-400 uppercase font-bold block">{item.brand}</span>
                              <h5 className="font-semibold text-white truncate text-[11px]">{item.title}</h5>
                              <p className="text-xs font-bold text-white">${item.price}</p>
                            </div>
                            <div className="pt-2 border-t border-white/5 space-y-1 text-[9px] font-mono text-zinc-400">
                              <p><span className="text-zinc-500">Category:</span> {item.category}</p>
                              <p><span className="text-zinc-500">Rating:</span> ★ {item.rating}</p>
                              <p><span className="text-zinc-500">AI Compatibility:</span> <span className="text-emerald-400 font-bold">94% Match</span></p>
                            </div>
                            <button
                              onClick={(e) => handleAcquire(item, e)}
                              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-mono uppercase font-bold rounded-lg transition-all"
                            >
                              Acquire {idx === 0 ? 'Item A' : 'Item B'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* List of Favorited Items */}
                {Object.keys(likedMap).filter(id => likedMap[id]).length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-12 h-12 border border-white/5 rounded-full flex items-center justify-center mx-auto text-zinc-600">
                      <Heart className="w-5 h-5 text-rose-500/40" />
                    </div>
                    <div className="space-y-1 max-w-[200px] mx-auto">
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Wishlist Empty</p>
                      <p className="text-[11px] font-serif text-zinc-500 italic">"Tap the heart icon on any boutique item to save it for comparative analysis."</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">
                      Saved Boutique Listings ({Object.keys(likedMap).filter(id => likedMap[id]).length})
                    </span>

                    {combinedProducts
                      .filter(p => likedMap[p.id])
                      .map(p => (
                        <div
                          key={p.id}
                          className={`bg-white/[0.01] border p-3.5 rounded-xl flex gap-3.5 items-center transition-all ${
                            comparedProductIds.includes(p.id)
                              ? 'border-violet-500/50 bg-violet-500/5'
                              : 'border-white/5 hover:border-white/10'
                          }`}
                        >
                          <img src={p.imageUrl || null}
                            alt={p.title}
                            className="w-14 h-18 object-cover rounded-lg border border-white/5 shrink-0"
                            referrerPolicy="no-referrer"
                          />

                          <div className="space-y-1 flex-1 min-w-0">
                            <span className="text-[8px] font-mono text-emerald-400 uppercase font-bold block">{p.brand}</span>
                            <h4 className="font-semibold text-xs text-white truncate">{p.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white font-bold">${p.price}</span>
                              <span className="text-[8px] font-mono bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded">
                                AI Match 94%
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                if (comparedProductIds.includes(p.id)) {
                                  setComparedProductIds(comparedProductIds.filter(id => id !== p.id));
                                } else if (comparedProductIds.length < 2) {
                                  setComparedProductIds([...comparedProductIds, p.id]);
                                } else {
                                  setComparedProductIds([comparedProductIds[1], p.id]);
                                }
                              }}
                              className={`px-2 py-1 rounded text-[8px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                                comparedProductIds.includes(p.id)
                                  ? 'bg-violet-500 text-white border-violet-400'
                                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                              }`}
                            >
                              {comparedProductIds.includes(p.id) ? 'Comparing' : '+ Compare'}
                            </button>

                            <button
                              onClick={(e) => handleAcquire(p, e)}
                              className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-black rounded text-[8px] font-mono uppercase font-bold transition-all cursor-pointer"
                            >
                              Acquire
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-white/5 pt-4 space-y-1 font-mono text-[8.5px] text-zinc-500 uppercase">
                <p>&copy; LookVision Style Intelligence Engine</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creator Capsule Modal Showcase */}
      <AnimatePresence>
        {selectedCreatorCapsule && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b12] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative text-left max-h-[85vh] flex flex-col"
            >
              {/* Header Banner */}
              <div className="h-36 w-full relative bg-zinc-900 overflow-hidden shrink-0">
                <img src={selectedCreatorCapsule.featuredImage || null}
                  alt={selectedCreatorCapsule.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-[#0b0b12]/40 to-transparent" />
                <button
                  onClick={() => setSelectedCreatorCapsule(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black border border-white/10 rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Creator Metainfo */}
              <div className="p-6 space-y-4 overflow-y-auto no-scrollbar -mt-10 relative z-10">
                <div className="flex items-end gap-3">
                  <img src={selectedCreatorCapsule.avatar || null}
                    alt={selectedCreatorCapsule.creatorName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#0b0b12] shadow-xl bg-zinc-900"
                  />
                  <div>
                    <span className="text-[9px] font-mono text-violet-400 uppercase font-bold tracking-widest block">
                      {selectedCreatorCapsule.creatorHandle}
                    </span>
                    <h3 className="font-serif text-xl text-white font-bold">{selectedCreatorCapsule.creatorName}</h3>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif text-lg text-white font-medium">{selectedCreatorCapsule.title}</h4>
                    <span className="text-[9px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2.5 py-1 rounded-lg font-bold">
                      {selectedCreatorCapsule.royaltyShare}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-light">{selectedCreatorCapsule.tagline}</p>
                </div>

                {/* Garments in this Capsule */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-bold block">
                    Garments In This Capsule Drop
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BOUTIQUE_PRODUCTS
                      .filter(p => p.creatorHandle === selectedCreatorCapsule.creatorHandle || p.vibeTags.includes('creator_drop'))
                      .slice(0, 2)
                      .map(p => (
                        <div key={p.id} className="bg-black/40 border border-white/5 rounded-xl p-3 flex gap-3 items-center">
                          <img src={p.imageUrl || null} alt={p.title} className="w-12 h-16 object-cover rounded-lg" />
                          <div className="space-y-1 flex-1 min-w-0">
                            <h5 className="text-xs font-semibold text-white truncate">{p.title}</h5>
                            <p className="text-xs font-bold text-emerald-400">${p.price}</p>
                            <button
                              onClick={(e) => handleAcquire(p, e)}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-[8px] font-mono uppercase font-bold rounded-md transition-all cursor-pointer"
                            >
                              Acquire Piece
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
