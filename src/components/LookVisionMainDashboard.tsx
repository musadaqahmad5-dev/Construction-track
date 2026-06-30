import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShoppingBag, Search, ChevronRight, ChevronLeft, Shirt, Plus, RefreshCw, 
  Clock, Heart, Share2, Bookmark, Award, TrendingUp, UserCheck, Users, Compass, 
  Layers, MessageSquare, Mail, Crown, Star, MessageCircle, Check, MapPin, 
  SlidersHorizontal, CheckCircle, Flame, ArrowUpRight, Zap
} from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, limit, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { WardrobeItem } from '../types';

interface LookVisionMainDashboardProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onDeleteGarment?: (id: string) => Promise<void>;
  user?: any;
  onLogout?: () => void;
  onReset?: () => void;
  onLoadSamples?: () => void;
  setActiveSubTab?: (tab: 'HOME' | 'AI_STUDIO' | 'WARDROBE' | 'DASHBOARD' | 'PROFILE' | 'SYSTEM_ROOM') => void;
}

export const LookVisionMainDashboard: React.FC<LookVisionMainDashboardProps> = ({
  wardrobe,
  onAddGarment,
  onDeleteGarment,
  user,
  onLogout,
  onReset,
  onLoadSamples,
  setActiveSubTab
}) => {
  // Search state
  const [promptInput, setPromptInput] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  // Firestore collections states
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [aiLooks, setAiLooks] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});

  // Hero carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Fallback / SEED data to ensure spectacular looks right out of the box
  const seedCommunityFits = [
    {
      id: 'seed-c-1',
      username: 'Ayesha Malik',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop',
      caption: 'Aesthetic minimal slate overcoat with loose linen layers.',
      likesCount: 1420,
      commentsCount: 98,
      bookmarksCount: 230,
      vibeTags: ['minimal', 'overcoat', 'streetwear'],
      time: '2h ago'
    },
    {
      id: 'seed-c-2',
      username: 'Hamza Ali',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      imageUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=500&auto=format&fit=crop',
      caption: 'Techwear cargo configurations with tactical outerwear straps.',
      likesCount: 980,
      commentsCount: 64,
      bookmarksCount: 112,
      vibeTags: ['techwear', 'cargo', 'streetwear'],
      time: '4h ago'
    },
    {
      id: 'seed-c-3',
      username: 'Noor Fatima',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop',
      caption: 'Tonal beige aesthetic knit coordinates for afternoon high-street strolls.',
      likesCount: 1820,
      commentsCount: 142,
      bookmarksCount: 310,
      vibeTags: ['tonal', 'aesthetic', 'knitwear'],
      time: '6h ago'
    }
  ];

  const seedAiLooks = [
    {
      id: 'seed-ai-1',
      title: 'Cyberpunk Tech Shell Jacket',
      prompt: 'Neon cybernetic futuristic jacket, loose fitting, modular tactical pockets, glowing purple lining',
      imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=500&auto=format&fit=crop',
      likesCount: 2400,
      remixesCount: 512,
      creator: 'AIStyleHub',
      isVerified: true
    },
    {
      id: 'seed-ai-2',
      title: 'Nordic Overcoat & Silk Trouser',
      prompt: 'Minimalist double breasted wool trench overcoat, heavy charcoal, with flowing cream silk trouser',
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=500&auto=format&fit=crop',
      likesCount: 1980,
      remixesCount: 384,
      creator: 'Elena Rostova',
      isVerified: true
    },
    {
      id: 'seed-ai-3',
      title: 'Distressed Urban Edge Hoodie',
      prompt: 'Acid wash oversized heavy hoodie, distressed seam finishes, streetwear drop shoulder fit',
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=500&auto=format&fit=crop',
      likesCount: 3100,
      remixesCount: 780,
      creator: 'AIStyleHub',
      isVerified: true
    }
  ];

  const seedMarketplaceProducts = [
    {
      id: 'seed-p-1',
      brand: 'ZARA COUTURE',
      title: 'Premium Wool Double-Breasted Trench',
      price: 189.00,
      originalPrice: 249.00,
      discount: '24% OFF',
      rating: '4.9',
      reviews: 142,
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=500&auto=format&fit=crop',
      category: 'Outerwear'
    },
    {
      id: 'seed-p-2',
      brand: 'NIKE SPECIAL PROJECT',
      title: 'Air Max Atmos Utility Shell Jacket',
      price: 220.00,
      rating: '4.8',
      reviews: 96,
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop',
      category: 'Streetwear'
    },
    {
      id: 'seed-p-3',
      brand: 'MINIMAL STUDIO',
      title: 'Raw Silk Blend Pleated Trouser',
      price: 95.00,
      originalPrice: 120.00,
      discount: '20% OFF',
      rating: '4.7',
      reviews: 64,
      imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=500&auto=format&fit=crop',
      category: 'Bottoms'
    }
  ];

  const contributorLeaderboard = [
    { rank: 1, name: 'Ayesha Malik', followers: '45.2K', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', score: 98 },
    { rank: 2, name: 'Hamza Ali', followers: '38.4K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', score: 94 },
    { rank: 3, name: 'Elena Rostova', followers: '32.1K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', score: 91 },
    { rank: 4, name: 'Julian Vance', followers: '28.9K', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', score: 88 }
  ];

  const editorsPicks = [
    { title: 'Summer Edit 2024', desc: 'Flowing linen coordinates and lightweight layers.', imageUrl: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=400&auto=format&fit=crop' },
    { title: 'Monochrome Luxe', desc: 'Heavy wool trench coats and midnight trousers.', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop' },
    { title: 'Wedding Inspo 24', desc: 'Ethereal tailoring and formal evening drapes.', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop' },
    { title: 'Street Icons', desc: 'Distressed acid washed utility configurations.', imageUrl: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=400&auto=format&fit=crop' }
  ];

  // Sync state with Firestore
  useEffect(() => {
    if (!db) return;
    const qComm = query(collection(db, 'community_posts'), limit(15));
    const unsubComm = onSnapshot(qComm, (snapshot) => {
      const posts: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        posts.push({
          id: docSnap.id,
          username: data.username || 'Anonymous',
          userAvatar: data.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
          imageUrl: data.imageUrl || '',
          caption: data.caption || '',
          likesCount: data.likesCount || 0,
          commentsCount: data.commentsCount || Math.floor(Math.random() * 25) + 5,
          bookmarksCount: data.bookmarksCount || Math.floor(Math.random() * 40) + 10,
          vibeTags: data.vibeTags || ['fashion', 'style'],
          time: 'Just now'
        });
      });
      if (posts.length > 0) {
        setCommunityPosts(posts);
      }
    });

    const qAi = query(collection(db, 'generatedLooks'), limit(15));
    const unsubAi = onSnapshot(qAi, (snapshot) => {
      const looks: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        looks.push({
          id: docSnap.id,
          title: data.vibe ? `${data.vibe} Style Generation` : 'AI Custom Look',
          prompt: data.prompt || 'Synthesized fashion piece.',
          imageUrl: data.imageUrl || '',
          likesCount: Math.floor(Math.random() * 1200) + 400,
          remixesCount: Math.floor(Math.random() * 300) + 50,
          creator: 'AIStyleHub',
          isVerified: true
        });
      });
      if (looks.length > 0) {
        setAiLooks(looks);
      }
    });

    return () => {
      unsubComm();
      unsubAi();
    };
  }, []);

  // Sync sidebar search/filters
  useEffect(() => {
    const handleSwitchFilter = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveTag(customEvent.detail === 'BRANDS' ? 'Luxury' : customEvent.detail === 'COMMUNITY' ? 'Minimal' : 'All');
      }
    };
    const handleSetQuery = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== undefined) {
        setPromptInput(customEvent.detail);
      }
    };

    window.addEventListener('lookvision_switch_feed_filter', handleSwitchFilter);
    window.addEventListener('lookvision_set_search_query', handleSetQuery);

    return () => {
      window.removeEventListener('lookvision_switch_feed_filter', handleSwitchFilter);
      window.removeEventListener('lookvision_set_search_query', handleSetQuery);
    };
  }, []);

  // Likes handlers
  const toggleLike = (postId: string) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Sartorial piece saved into archive memory.' }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    if (setActiveSubTab) {
      localStorage.setItem('prompt_generation_draft', promptInput);
      setActiveSubTab('AI_STUDIO');
    }
  };

  // Hero carousel slides
  const carouselSlides = [
    {
      title: "Streetwear Cargo Core",
      subtitle: "Tactical techwear alignments",
      imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=500&auto=format&fit=crop",
      creator: "@hamza_ali",
      glow: "rgba(168,85,247,0.4)"
    },
    {
      title: "Nordic Warm Cashmere",
      subtitle: "Classic winter trench & weave",
      imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=500&auto=format&fit=crop",
      creator: "@elena_rostova",
      glow: "rgba(99,102,241,0.4)"
    },
    {
      title: "Asymmetric Silk Drape",
      subtitle: "Avant-garde flowing tailoring",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop",
      creator: "@ayesha_malik",
      glow: "rgba(236,72,153,0.4)"
    }
  ];

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Horizontal scroll for editors picks
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollHorizontal = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full space-y-10 pb-24 animate-fade-in relative text-left select-none">
      
      {/* 1. HERO HEADER AREA (SPLIT HERO + CAROUSEL STACK) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-[#0e0e18] to-transparent p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        
        {/* Hero Left Content */}
        <div className="lg:col-span-7 space-y-6 z-10 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-300">Generation Engine v4.0 Live</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans tracking-tight text-white leading-[1.1]">
            Create. Inspire. <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              Express with AI.
            </span>
          </h2>
          
          <p className="text-white/60 text-sm max-w-md font-sans leading-relaxed">
            Generate stunning fashion looks in seconds, try them on virtually, and sync with your digital archive workspace.
          </p>

          {/* Prompt Generator Box */}
          <form onSubmit={handleGenerate} className="max-w-xl space-y-3 pt-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text"
                placeholder="What do you want to wear today? (e.g. Minimalist charcoal coat with linen...)"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="w-full bg-black/60 hover:bg-black/80 border border-white/5 pl-11 pr-28 py-3.5 text-xs text-white placeholder-white/20 rounded-2xl focus:outline-none focus:border-violet-500/40 transition-all font-light"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer transition-all shadow-md shadow-violet-600/20"
              >
                Generate
              </button>
            </div>

            {/* Quick Vibe Tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-white/40 text-[10px] font-mono">
              <span className="text-white/25 uppercase mr-1">VIBE CHIPS:</span>
              {['Casual', 'Streetwear', 'Minimal', 'Luxury', 'Korean', 'Y2K'].map((vtag) => (
                <button
                  type="button"
                  key={vtag}
                  onClick={() => setPromptInput(`A stunning ${vtag.toLowerCase()} outfit arrangement, detailed fabrics, premium studio look`)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 rounded-lg cursor-pointer transition-colors"
                >
                  {vtag}
                </button>
              ))}
              <span className="opacity-40 cursor-help">+</span>
            </div>
          </form>

          {/* Social Proof Avatar Stack */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2.5">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop" className="w-7 h-7 rounded-full border border-black object-cover" alt="" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&auto=format&fit=crop" className="w-7 h-7 rounded-full border border-black object-cover" alt="" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop" className="w-7 h-7 rounded-full border border-black object-cover" alt="" />
            </div>
            <p className="text-[11px] font-mono text-white/40 tracking-wide uppercase">
              <strong className="text-white font-bold">50,000+</strong> fashion lovers creating with AI
            </p>
          </div>
        </div>

        {/* Hero Right: Overlapping 3D Carousel Stack */}
        <div className="lg:col-span-5 h-[340px] flex items-center justify-center relative select-none mt-4 lg:mt-0">
          <div className="absolute inset-0 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative w-[240px] h-[300px]">
            <AnimatePresence mode="popLayout">
              {carouselSlides.map((slide, sIdx) => {
                // Circular layout calculation for overlapping cards
                const offset = (sIdx - carouselIndex + carouselSlides.length) % carouselSlides.length;
                if (offset > 2) return null;

                const zIndex = 30 - offset;
                const scale = 1 - offset * 0.08;
                const xOffset = offset * 25;
                const yOffset = -offset * 12;
                const rotate = offset * 4;

                return (
                  <motion.div
                    key={slide.title}
                    initial={{ opacity: 0, scale: 0.8, x: 100 }}
                    animate={{ 
                      opacity: 1 - offset * 0.35, 
                      scale, 
                      x: xOffset,
                      y: yOffset,
                      rotate,
                      zIndex 
                    }}
                    exit={{ opacity: 0, scale: 0.7, x: -100 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                    className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border cursor-pointer select-none group"
                    style={{ 
                      borderColor: offset === 0 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                      boxShadow: offset === 0 ? `0 10px 40px ${slide.glow}` : 'none'
                    }}
                    onClick={() => {
                      if (offset !== 0) {
                        setCarouselIndex(sIdx);
                      } else if (setActiveSubTab) {
                        setActiveSubTab('AI_STUDIO');
                      }
                    }}
                  >
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Glowing gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-5" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-left z-10 space-y-1">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-violet-400 bg-violet-950/80 border border-violet-500/20 px-2 py-0.5 rounded-full inline-block font-semibold">
                        {slide.creator}
                      </span>
                      <h4 className="text-sm font-semibold font-sans text-white leading-tight">{slide.title}</h4>
                      <p className="text-[10px] text-white/50 leading-none">{slide.subtitle}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Manual Controls */}
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black border border-white/10 hover:border-violet-500/30 flex items-center justify-center text-white cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black border border-white/10 hover:border-violet-500/30 flex items-center justify-center text-white cursor-pointer transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC THREE-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* ================= COLUMN 1: AI CREATIONS ================= */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/90 font-bold">AI Creations</h3>
            </div>
            <span className="text-[9px] font-mono text-violet-400 bg-violet-500/5 px-2 py-0.5 rounded-full border border-violet-500/10">Stable</span>
          </div>

          <div className="space-y-5">
            {(aiLooks.length > 0 ? aiLooks : seedAiLooks).map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0b0b12] hover:bg-[#0f0f1c]/40 border border-white/5 hover:border-violet-500/10 rounded-2xl overflow-hidden transition-all group flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[8px] font-mono uppercase tracking-widest bg-violet-950/85 backdrop-blur-md text-violet-300 px-2.5 py-1 rounded-full border border-violet-500/20 font-bold flex items-center gap-1">
                      <Sparkles className="w-2 h-2 text-violet-400" /> AI Design
                    </span>
                  </div>

                  <button 
                    onClick={() => toggleLike(item.id)}
                    className="absolute bottom-3 right-3 p-2 bg-black/65 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 hover:border-rose-500/20 rounded-full transition-all cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-white/90 truncate max-w-[120px]">{item.title}</span>
                      {item.isVerified && <CheckCircle className="w-3 h-3 text-violet-400 shrink-0" />}
                    </div>
                    <span className="text-[9px] font-mono text-white/30">by {item.creator || 'AIStyleHub'}</span>
                  </div>

                  <div className="p-2.5 bg-black/40 border border-white/[0.03] rounded-xl">
                    <span className="text-[7.5px] font-mono uppercase text-violet-400/50 block tracking-wider">Prompt Parameters:</span>
                    <p className="text-[10.5px] font-sans text-white/60 leading-normal italic line-clamp-2">
                      "{item.prompt}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-white/5 text-[9px] font-mono text-white/40">
                    <div className="flex gap-3">
                      <span>❤️ {likedPosts[item.id] ? (item.likesCount || 120) + 1 : (item.likesCount || 120)}</span>
                      <span>🔄 {item.remixesCount || 24} remixes</span>
                    </div>
                    <button 
                      onClick={() => {
                        if (onAddGarment) {
                          onAddGarment(item.title, item.prompt, 'Outerwear', { imageUrl: item.imageUrl });
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'AI generated look compiled into your local closet!' }));
                        }
                      }}
                      className="text-violet-400 hover:text-white uppercase font-bold text-[8.5px] tracking-wider"
                    >
                      [ ARCHIVE ]
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => setActiveSubTab && setActiveSubTab('AI_STUDIO')}
            className="w-full py-2.5 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-xl text-[9px] font-mono uppercase tracking-widest text-white/60 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View more AI looks</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* ================= COLUMN 2: COMMUNITY ================= */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/90 font-bold">Community</h3>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">Active</span>
          </div>

          <div className="space-y-5">
            {(communityPosts.length > 0 ? communityPosts : seedCommunityFits).map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#08080c] hover:bg-neutral-900/40 border border-white/5 hover:border-emerald-500/10 rounded-2xl overflow-hidden transition-all group flex flex-col justify-between"
              >
                {/* User profile header inside column card */}
                <div className="p-3 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={item.userAvatar} 
                      className="w-7 h-7 rounded-full object-cover border border-white/10"
                      alt="" 
                    />
                    <div>
                      <span className="block text-[11px] font-medium text-white leading-tight">{item.username}</span>
                      <span className="block text-[8px] font-mono text-white/30 uppercase tracking-wide">{item.time}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Now following ${item.username}` }))}
                    className="text-[9px] font-mono text-emerald-400 hover:text-white px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20"
                  >
                    Follow
                  </button>
                </div>

                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950">
                  <img 
                    src={item.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"; }}
                  />
                  
                  <button 
                    onClick={() => toggleLike(item.id)}
                    className="absolute bottom-3 right-3 p-2 bg-black/65 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 hover:border-rose-500/20 rounded-full transition-all cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4 space-y-3 text-left">
                  <p className="text-[11px] font-sans text-white/70 leading-relaxed font-light">
                    "{item.caption}"
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {item.vibeTags?.map((tag: string, tIdx: number) => (
                      <span key={tIdx} className="text-[8px] font-mono text-white/40 bg-white/5 border border-white/5 px-2 py-0.5 rounded uppercase">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t border-white/5 text-[9px] font-mono text-white/40">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-white/60">
                        ❤️ {likedPosts[item.id] ? (item.likesCount || 140) + 1 : (item.likesCount || 140)}
                      </span>
                      <span className="flex items-center gap-1 text-white/40">
                        💬 {item.commentsCount || 12}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className={`text-emerald-400 hover:text-white flex items-center gap-1 ${bookmarkedPosts[item.id] ? 'font-bold' : ''}`}
                    >
                      <Bookmark className={`w-3 h-3 ${bookmarkedPosts[item.id] ? 'fill-emerald-400' : ''}`} />
                      <span>{bookmarkedPosts[item.id] ? 'Saved' : 'Collect'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => {
              setActiveTag('Minimal');
              window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Filtered community feed stream.' }));
            }}
            className="w-full py-2.5 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-xl text-[9px] font-mono uppercase tracking-widest text-white/60 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Explore community</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* ================= COLUMN 3: MARKETPLACE ================= */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              <h3 className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/90 font-bold">Marketplace</h3>
            </div>
            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded-full border border-indigo-500/10">Boutique</span>
          </div>

          <div className="space-y-5">
            {seedMarketplaceProducts.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#08080f] hover:bg-neutral-900/40 border border-white/5 hover:border-indigo-500/10 rounded-2xl overflow-hidden transition-all group flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=200&auto=format&fit=crop"; }}
                  />
                  {item.discount && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[8px] font-mono uppercase tracking-widest bg-rose-600/90 text-white px-2.5 py-1 rounded-full border border-rose-500/20 font-bold">
                        {item.discount}
                      </span>
                    </div>
                  )}

                  <button 
                    onClick={() => toggleLike(item.id)}
                    className="absolute bottom-3 right-3 p-2 bg-black/65 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 hover:border-rose-500/20 rounded-full transition-all cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4 space-y-2.5 text-left">
                  <div>
                    <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest block font-bold">{item.brand}</span>
                    <h4 className="text-[11px] font-medium text-white truncate">{item.title}</h4>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-white/5 text-[9px] font-mono text-white/40">
                    <div>
                      {item.originalPrice ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-sans font-semibold text-xs">${item.price}</span>
                          <span className="text-white/30 line-through font-sans text-[10px]">${item.originalPrice}</span>
                        </div>
                      ) : (
                        <span className="text-white font-sans font-semibold text-xs">${item.price}</span>
                      )}
                      <span className="text-[8.5px] text-white/30 font-mono block mt-0.5">⭐️ {item.rating} ({item.reviews} Reviews)</span>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (onAddGarment) {
                          onAddGarment(item.title, `Purchased piece from ${item.brand}`, item.category || 'Casual', { imageUrl: item.imageUrl, price: item.price });
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Registered ${item.title} into your local Closet!` }));
                        }
                      }}
                      className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer transition-colors shadow-md shadow-emerald-600/15"
                      title="Add to Closet"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => {
              setActiveTag('Luxury');
              window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Displaying luxury boutique inventory.' }));
            }}
            className="w-full py-2.5 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-xl text-[9px] font-mono uppercase tracking-widest text-white/60 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Shop all products</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* 3. EDITOR'S PICKS BOTTOM HORIZONTAL CAROUSEL */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">Editor's Picks</h3>
            </div>
            <p className="text-[10px] text-white/40 font-sans leading-none uppercase">Curated boutique collections updated daily</p>
          </div>
          
          <div className="flex gap-1.5">
            <button 
              onClick={() => scrollHorizontal('left')}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollHorizontal('right')}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-3 select-none"
        >
          {editorsPicks.map((pick, pIdx) => (
            <div 
              key={pIdx}
              className="min-w-[260px] md:min-w-[280px] bg-[#07070c]/50 border border-white/5 rounded-2xl overflow-hidden relative group cursor-pointer"
              onClick={() => setActiveSubTab && setActiveSubTab('AI_STUDIO')}
            >
              <div className="aspect-[4/3] overflow-hidden bg-zinc-950 relative">
                <img 
                  src={pick.imageUrl} 
                  alt={pick.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-left" />
                
                <div className="absolute bottom-3 left-3 right-3 text-left space-y-1">
                  <h4 className="text-xs font-bold text-white font-sans">{pick.title}</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed font-sans">{pick.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
