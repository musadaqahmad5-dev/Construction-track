import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Sparkle, ShoppingBag, Search, ChevronRight, ChevronLeft, Shirt, Plus, RefreshCw, 
  Clock, Heart, Share2, Bookmark, Award, TrendingUp, UserCheck, Users, Compass, 
  Layers, MessageSquare, Mail, Crown, Star, MessageCircle, Check, MapPin, 
  SlidersHorizontal, CheckCircle, Flame, ArrowUpRight, Zap, Palette, ChevronDown, MoreVertical
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
  const [carouselIndex, setCarouselIndex] = useState(1);

  // Column Sub-tabs states to match the imaginary image
  const [aiCreationsTab, setAiCreationsTab] = useState('For You');
  const [communityTab, setCommunityTab] = useState('Following');
  const [marketplaceTab, setMarketplaceTab] = useState('For You');

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
    { title: "Summer Edit", subtitle: "2024", imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop" },
    { title: "Monochrome", subtitle: "Collection", imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=400&auto=format&fit=crop" },
    { title: "Wedding", subtitle: "Inspo", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop" },
    { title: "Street Icons", subtitle: "This Week", imageUrl: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=400&auto=format&fit=crop" },
    { title: "Street Icons", subtitle: "This Week", imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=400&auto=format&fit=crop" }
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
      title: "Minimal Beige",
      subtitle: "Y2K beige outfit, clean aesthetic",
      imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop",
      creator: "@elena_rostova",
      glow: "rgba(168,85,247,0.3)"
    },
    {
      title: "Monochrome Tailoring Core",
      subtitle: "Tactical sleek black suits & chains",
      imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop",
      creator: "@hamza_ali",
      glow: "rgba(168,85,247,0.4)"
    },
    {
      title: "Midnight Silhouette",
      subtitle: "Avant-garde flowing leather alignments",
      imageUrl: "https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=600&auto=format&fit=crop",
      creator: "@ayesha_malik",
      glow: "rgba(168,85,247,0.3)"
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
    <div className="w-full animate-fade-in relative text-left select-none pb-24">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left/Center Main Content Column */}
        <div className="xl:col-span-3 space-y-10">
          
          {/* 1. HERO HEADER AREA (SPLIT HERO + CAROUSEL STACK) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-[#0e0e18] to-transparent p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        
        {/* Hero Left Content */}
        <div className="lg:col-span-7 space-y-6 z-10 relative">
          
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold font-sans tracking-tight text-white leading-[1.15]">
            Create. Inspire.<br />
            Express with <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.35)]">AI.</span>
          </h2>
          
          <p className="text-white/60 text-xs sm:text-sm max-w-md font-sans leading-relaxed">
            Generate stunning fashion looks,<br className="hidden sm:inline" /> in seconds.
          </p>

           {/* Prompt Generator Box */}
          <form onSubmit={handleGenerate} className="max-w-xl space-y-4 pt-1">
            <div className="relative">
              <Sparkle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400/80 fill-violet-400/10" />
              <input 
                type="text"
                placeholder="What do you want to wear today?"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="w-full bg-black/50 hover:bg-black/75 border border-white/5 pl-11 pr-28 py-3.5 text-xs text-white placeholder-white/20 rounded-2xl focus:outline-none focus:border-violet-500/40 transition-all font-light"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-5 py-2 rounded-xl cursor-pointer transition-all shadow-md shadow-violet-600/20"
              >
                Generate
              </button>
            </div>

            {/* Quick Vibe Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {['Casual', 'Streetwear', 'Minimal', 'Luxury', 'Korean', 'Y2K'].map((vtag) => (
                <button
                  type="button"
                  key={vtag}
                  onClick={() => setPromptInput(`A stunning ${vtag.toLowerCase()} outfit arrangement, detailed fabrics, premium studio look`)}
                  className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/10 hover:text-white border border-white/5 rounded-xl text-[10.5px] font-sans text-white/50 cursor-pointer transition-colors"
                >
                  {vtag}
                </button>
              ))}
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center bg-white/[0.04] hover:bg-white/10 border border-white/5 text-white/50 hover:text-white rounded-xl text-xs cursor-pointer transition-all"
              >
                +
              </button>
            </div>
          </form>

          {/* Social Proof Avatar Stack */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop" className="w-6 h-6 rounded-full border border-black object-cover" alt="" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&auto=format&fit=crop" className="w-6 h-6 rounded-full border border-black object-cover" alt="" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop" className="w-6 h-6 rounded-full border border-black object-cover" alt="" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=80&auto=format&fit=crop" className="w-6 h-6 rounded-full border border-black object-cover" alt="" referrerPolicy="no-referrer" />
            </div>
            <p className="text-[11px] font-sans text-white/40 tracking-wide text-left leading-normal">
              <span className="text-white font-bold">50,000+</span> fashion lovers <br /> creating with AI
            </p>
          </div>
        </div>

        {/* Hero Right: Overlapping 3D Carousel Stack */}
        <div className="lg:col-span-5 h-[340px] flex items-center justify-center relative select-none mt-4 lg:mt-0 px-2">
          <div className="absolute inset-0 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Orbital ring track as shown in the imaginary image */}
          <div className="absolute w-[106%] h-[160px] border border-violet-500/20 rounded-[50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[6deg] pointer-events-none z-0">
            <div className="absolute top-[10%] left-[20%] text-violet-400 opacity-60 animate-pulse"><Sparkles className="w-2.5 h-2.5 fill-violet-400" /></div>
            <div className="absolute bottom-[10%] right-[20%] text-violet-400 opacity-60 animate-pulse"><Sparkles className="w-2.5 h-2.5 fill-violet-400" /></div>
            <div className="absolute top-[80%] left-[10%] text-violet-400 opacity-40 animate-pulse"><Sparkles className="w-2 h-2 fill-violet-400" /></div>
            <div className="absolute top-[20%] right-[10%] text-violet-400 opacity-40 animate-pulse"><Sparkles className="w-2 h-2 fill-violet-400" /></div>
          </div>

          <div className="relative w-full max-w-[420px] h-[300px] flex items-center justify-center">
            {/* Left/Right Arrow buttons floating on the orbital ring */}
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-[3%] top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 border border-white/5 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-[3%] top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 border border-white/5 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Left Slide (Unfocused, rotated) */}
            {(() => {
              const leftIdx = (carouselIndex - 1 + carouselSlides.length) % carouselSlides.length;
              const slide = carouselSlides[leftIdx];
              return (
                <div 
                  onClick={() => setCarouselIndex(leftIdx)}
                  className="absolute left-[0%] top-1/2 -translate-y-1/2 w-[135px] h-[230px] z-10 opacity-55 hover:opacity-80 transition-all duration-300 rounded-[24px] overflow-hidden border border-white/5 -rotate-[8deg] cursor-pointer shadow-lg group select-none"
                >
                  <img src={slide.imageUrl} alt="" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                </div>
              );
            })()}

            {/* Center Slide (Focused, glowing, highlighted) */}
            {(() => {
              const slide = carouselSlides[carouselIndex % carouselSlides.length];
              return (
                <div 
                  onClick={() => {
                    if (setActiveSubTab) setActiveSubTab('AI_STUDIO');
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[185px] h-[285px] z-20 transition-all duration-300 rounded-[28px] overflow-hidden border border-violet-500/20 cursor-pointer shadow-[0_20px_50px_rgba(139,92,246,0.35)] group select-none"
                >
                  <img src={slide.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  
                  {/* AI Generated Pill Badge */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg select-none">
                    <Sparkles className="w-3 h-3 text-violet-400 fill-violet-400" />
                    <span className="text-[9.5px] font-sans font-semibold tracking-wide text-white uppercase leading-none">AI Generated</span>
                  </div>
                </div>
              );
            })()}

            {/* Right Slide (Unfocused, rotated) */}
            {(() => {
              const rightIdx = (carouselIndex + 1) % carouselSlides.length;
              const slide = carouselSlides[rightIdx];
              return (
                <div 
                  onClick={() => setCarouselIndex(rightIdx)}
                  className="absolute right-[0%] top-1/2 -translate-y-1/2 w-[135px] h-[230px] z-10 opacity-55 hover:opacity-80 transition-all duration-300 rounded-[24px] overflow-hidden border border-white/5 rotate-[8deg] cursor-pointer shadow-lg group select-none"
                >
                  <img src={slide.imageUrl} alt="" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                </div>
              );
            })()}

            {/* Pagination Dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40">
              {[0, 1, 2, 3, 4].map((dotIndex) => {
                const isActive = (carouselIndex % carouselSlides.length) === (dotIndex % carouselSlides.length);
                return (
                  <button
                    key={dotIndex}
                    onClick={() => setCarouselIndex(dotIndex % carouselSlides.length)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-violet-500 scale-125' : 'bg-white/25 hover:bg-white/45'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC THREE-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* ================= COLUMN 1: AI CREATIONS ================= */}
        <div className="space-y-4">
          <div className="space-y-1.5 pb-2 border-b border-white/5 text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-white">AI CREATIONS</h3>
            </div>
            <p className="text-[10px] text-white/40 font-sans font-light">AI generated looks by our community</p>
            
            {/* Sub-tabs selection */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['For You', 'Trending', 'New', 'Remix'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setAiCreationsTab(tab)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-sans font-medium transition-all cursor-pointer ${
                    aiCreationsTab === tab 
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10 font-semibold' 
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Render items based on active tab */}
            {(aiCreationsTab === 'For You' ? [
              {
                id: 'ai-f-1',
                title: 'Minimal Beige',
                prompt: 'Prompt: Minimal beige outfit, clean aesthetic',
                imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop',
                likesCount: '2.4K',
                commentsCount: 136,
                creator: 'AI Generated',
                creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop'
              },
              {
                id: 'ai-f-2',
                title: 'Y2K Pink Vibes',
                prompt: 'Prompt: Y2K pink streetwear with cargo pants',
                imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=500&auto=format&fit=crop',
                likesCount: '3.1K',
                commentsCount: 214,
                creator: 'AI Generated',
                creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop'
              }
            ] : (aiLooks.length > 0 ? aiLooks : seedAiLooks)).map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 transition-all group shadow-lg flex flex-col"
              >
                <div className="absolute inset-0 bg-zinc-950">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
                  />
                </div>

                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[9px] font-sans font-medium uppercase tracking-wider bg-black/70 backdrop-blur-md text-white/90 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-violet-400" /> AI Generated
                  </span>
                </div>

                <button 
                  onClick={() => toggleLike(item.id)}
                  className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer z-10"
                >
                  <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Bottom details gradient background overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none z-0" />

                <div className="absolute bottom-0 left-0 right-0 p-3.5 space-y-2.5 text-left z-10">
                  <div>
                    <h4 className="text-[12px] font-bold text-white leading-tight">{item.title}</h4>
                    <p className="text-[9.5px] font-sans text-white/60 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.prompt.startsWith('Prompt:') ? item.prompt : `Prompt: ${item.prompt}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <img 
                      src={item.creatorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop"} 
                      className="w-4 h-4 rounded-full object-cover" 
                      alt="" 
                    />
                    <span className="text-[10px] text-white/40">{item.creator || 'AI Generated'}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-[10.5px] font-mono text-white/55 border-t border-white/5">
                    <div className="flex gap-4">
                      <button onClick={() => toggleLike(item.id)} className={`flex items-center gap-1 hover:text-rose-400 transition-colors ${likedPosts[item.id] ? 'text-rose-400' : ''}`}>
                        <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{item.likesCount}</span>
                      </button>
                      <span className="flex items-center gap-1 text-white/35">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{item.commentsCount}</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        if (onAddGarment) {
                          onAddGarment(item.title, item.prompt, 'Outerwear', { imageUrl: item.imageUrl });
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'AI generated look compiled into your local closet!' }));
                        }
                      }}
                      className="text-violet-400 hover:text-white uppercase font-sans font-bold text-[9px] tracking-wider flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Remix</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => setActiveSubTab && setActiveSubTab('AI_STUDIO')}
            className="w-full py-2.5 bg-violet-950/10 hover:bg-violet-950/25 border border-violet-500/10 hover:border-violet-500/20 rounded-xl text-[10px] font-sans font-semibold uppercase tracking-wider text-violet-400 hover:text-violet-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View more AI looks</span>
            <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
          </button>
        </div>

        {/* ================= COLUMN 2: COMMUNITY ================= */}
        <div className="space-y-4">
          <div className="space-y-1.5 pb-2 border-b border-white/5 text-left">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-white">COMMUNITY</h3>
            </div>
            <p className="text-[10px] text-white/40 font-sans font-light">Real people, real looks, real inspiration</p>
            
            {/* Sub-tabs selection */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Following', 'Popular', 'New', 'Challenge'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCommunityTab(tab)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-sans font-medium transition-all cursor-pointer ${
                    communityTab === tab 
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10 font-semibold' 
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Render items based on active tab */}
            {(communityTab === 'Following' ? [
              {
                id: 'comm-f-1',
                username: 'Ayesha Malik',
                userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop',
                imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500&auto=format&fit=crop',
                caption: 'Street style walking vibes in urban neutral tones.',
                likesCount: '2.6K',
                commentsCount: 89,
                time: '2h ago'
              },
              {
                id: 'comm-f-2',
                username: 'Hamza Ali',
                userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&auto=format&fit=crop',
                imageUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=500&auto=format&fit=crop',
                caption: 'Ready for monochrome tailoring season. Minimal outerwear rules.',
                likesCount: '1.8K',
                commentsCount: 72,
                time: '4h ago'
              }
            ] : (communityPosts.length > 0 ? communityPosts : seedCommunityFits)).map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0b0b14] border border-white/5 rounded-2xl overflow-hidden transition-all group flex flex-col"
              >
                {/* Community Header with Avatar & Time */}
                <div className="p-3.5 flex items-center justify-between text-left border-b border-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={item.userAvatar} 
                      className="w-7 h-7 rounded-full object-cover"
                      alt="" 
                    />
                    <div>
                      <span className="block text-xs font-semibold text-white leading-tight">{item.username}</span>
                      <span className="block text-[9px] font-mono text-white/30 tracking-wide mt-0.5">{item.time}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Account options loaded.` }))}
                    className="p-1 text-white/40 hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950">
                  <img 
                    src={item.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"; }}
                  />
                </div>

                <div className="p-3.5 pt-2.5 text-left">
                  <div className="flex justify-between items-center text-[11px] font-mono text-white/55">
                    <div className="flex gap-4">
                      <button onClick={() => toggleLike(item.id)} className={`flex items-center gap-1 hover:text-rose-400 transition-colors ${likedPosts[item.id] ? 'text-rose-400' : ''}`}>
                        <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{item.likesCount}</span>
                      </button>
                      <span className="flex items-center gap-1 text-white/35">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{item.commentsCount}</span>
                      </span>
                    </div>
                    
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className={`hover:text-violet-400 flex items-center gap-1.5 transition-colors ${bookmarkedPosts[item.id] ? 'text-violet-400 font-bold' : 'text-white/40'}`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarkedPosts[item.id] ? 'fill-violet-400 text-violet-400' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Loading community directory.' }));
            }}
            className="w-full py-2.5 bg-blue-950/10 hover:bg-blue-950/25 border border-blue-500/10 hover:border-blue-500/20 rounded-xl text-[10px] font-sans font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Explore community</span>
            <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
          </button>
        </div>

        {/* ================= COLUMN 3: MARKETPLACE ================= */}
        <div className="space-y-4">
          <div className="space-y-1.5 pb-2 border-b border-white/5 text-left">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-white">MARKETPLACE</h3>
            </div>
            <p className="text-[10px] text-white/40 font-sans font-light">Shop real products from top brands</p>
            
            {/* Sub-tabs selection */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['For You', 'New In', 'Brands', 'Sale'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMarketplaceTab(tab)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-sans font-medium transition-all cursor-pointer ${
                    marketplaceTab === tab 
                      ? 'bg-[#183a2b] border border-emerald-500/20 text-emerald-400 font-semibold' 
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Render items based on active tab */}
            {(marketplaceTab === 'For You' ? [
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
            ] : seedMarketplaceProducts).map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0b0b14] border border-white/5 rounded-2xl overflow-hidden transition-all group flex flex-col justify-between relative"
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
                      <span className="text-[9px] font-sans font-bold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-1 rounded-lg border border-rose-500/20">
                        {item.discount}
                      </span>
                    </div>
                  )}

                  <button 
                    onClick={() => toggleLike(item.id)}
                    className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-3.5 space-y-2.5 text-left">
                  <div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider block">{item.brand}</span>
                    <h4 className="text-[11px] text-white/50 font-sans mt-0.5 truncate">{item.title}</h4>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {item.originalPrice ? (
                        <>
                          <span className="text-white font-sans font-bold text-xs">${item.price}</span>
                          <span className="text-white/30 line-through font-sans text-[10px]">${item.originalPrice}</span>
                        </>
                      ) : (
                        <span className="text-white font-sans font-bold text-xs">${item.price}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center gap-1 text-[10px] text-white/40">
                      <span className="text-amber-400 font-bold">★</span>
                      <span>{item.rating}</span>
                      <span>({item.reviews})</span>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (onAddGarment) {
                          onAddGarment(item.title, `Purchased piece from ${item.brand}`, 'Casual', { imageUrl: item.imageUrl, price: item.price });
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Registered ${item.title} into your local Closet!` }));
                        }
                      }}
                      className="w-7 h-7 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-black flex items-center justify-center cursor-pointer transition-colors"
                      title="Add to Closet"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Displaying complete boutique list.' }));
            }}
            className="w-full py-2.5 bg-emerald-950/10 hover:bg-emerald-950/25 border border-emerald-500/10 hover:border-emerald-500/20 rounded-xl text-[10px] font-sans font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Shop all products</span>
            <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
          </button>
        </div>

      </div>

      {/* 3. EDITOR'S PICKS BOTTOM HORIZONTAL CAROUSEL */}
      <div className="space-y-4 pt-6 border-t border-white/5 text-left">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-violet-400 fill-violet-400" />
              <h3 className="text-sm font-bold text-white tracking-widest uppercase font-sans">EDITOR'S PICKS</h3>
            </div>
            <p className="text-[10px] text-white/40 font-sans leading-none uppercase tracking-wider">Curated by our editors</p>
          </div>
          
          <div className="flex gap-1.5">
            <button 
              onClick={() => scrollHorizontal('left')}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center justify-center cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollHorizontal('right')}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center justify-center cursor-pointer transition-all"
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
              className="min-w-[270px] w-[270px] h-[92px] bg-[#07070c] border border-white/5 rounded-2xl overflow-hidden flex cursor-pointer select-none group"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Displaying curated collection: ${pick.title}` }));
                if (setActiveSubTab) setActiveSubTab('AI_STUDIO');
              }}
            >
              {/* Left side: Image */}
              <div className="w-[100px] h-full overflow-hidden relative shrink-0 border-r border-white/5 bg-zinc-950">
                <img 
                  src={pick.imageUrl} 
                  alt={pick.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"; }}
                />
              </div>

              {/* Right side: Metadata and Call to Action */}
              <div className="flex-1 p-2.5 flex flex-col justify-between text-left min-w-0 bg-[#07070c]">
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-bold text-white font-sans truncate leading-tight">{pick.title}</h4>
                  <span className="text-[9px] text-white/35 font-mono block tracking-wider uppercase">{pick.subtitle}</span>
                </div>
                
                <button className="self-start text-[8px] font-sans font-bold text-violet-400 bg-violet-600/10 hover:bg-violet-600 hover:text-white px-2 py-1 rounded transition-all">
                  View Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

        </div> {/* End of xl:col-span-3 (Left Content Column) */}

        {/* Right Sidebar Area (25% width on xl screens) */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* A. QUICK ACTIONS */}
          <div className="bg-[#07070c]/50 border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-sans tracking-wide text-left">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveSubTab && setActiveSubTab('AI_STUDIO')}
                className="bg-[#13112b] hover:bg-[#1a173d] border border-violet-500/20 rounded-xl p-3 flex items-center gap-2.5 transition-all cursor-pointer group text-left shadow-lg shadow-violet-950/25"
              >
                <div className="p-1.5 bg-violet-500/20 rounded-lg text-violet-300 group-hover:bg-violet-500 group-hover:text-white transition-all">
                  <Sparkles className="w-3.5 h-3.5 fill-violet-300 group-hover:fill-white" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-bold text-white truncate">AI Studio</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveSubTab && setActiveSubTab('VIRTUAL_TRY' as any)}
                className="bg-[#07070c] hover:bg-[#0e0e18] border border-white/5 rounded-xl p-3 flex items-center gap-2.5 transition-all cursor-pointer group text-left"
              >
                <div className="p-1.5 bg-white/5 rounded-lg text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all">
                  <Shirt className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-medium text-white/70 group-hover:text-white truncate">Virtual Try-On</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveSubTab && setActiveSubTab('OUTFIT_GEN' as any)}
                className="bg-[#07070c] hover:bg-[#0e0e18] border border-white/5 rounded-xl p-3 flex items-center gap-2.5 transition-all cursor-pointer group text-left"
              >
                <div className="p-1.5 bg-white/5 rounded-lg text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-medium text-white/70 group-hover:text-white truncate">AI Stylist</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveSubTab && setActiveSubTab('SYSTEM_ROOM' as any)}
                className="bg-[#07070c] hover:bg-[#0e0e18] border border-white/5 rounded-xl p-3 flex items-center gap-2.5 transition-all cursor-pointer group text-left"
              >
                <div className="p-1.5 bg-white/5 rounded-lg text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all">
                  <Palette className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-medium text-white/70 group-hover:text-white truncate">Color Palette</span>
                </div>
              </button>
            </div>
          </div>

          {/* B. TRENDING TAGS */}
          <div className="bg-[#07070c]/50 border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-white font-sans tracking-wide">Trending Tags</h3>
              </div>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Loading full style tag database.' }))}
                className="text-[10px] font-sans font-medium text-white/40 hover:text-white hover:underline transition-colors"
              >
                See all
              </button>
            </div>

            <div className="space-y-2">
              {[
                { name: '# Streetwear', views: '12.5K' },
                { name: '# OldMoney', views: '9.8K' },
                { name: '# KoreanStyle', views: '8.3K' },
                { name: '# Minimal', views: '7.1K' },
                { name: '# Y2K', views: '6.3K' }
              ].map((tag, tIdx) => (
                <button
                  key={tIdx}
                  onClick={() => {
                    setPromptInput(`A classic high-end ${tag.name.replace('# ', '').toLowerCase()} look`);
                    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Vibe prompt preset configured: ${tag.name}` }));
                  }}
                  className="w-full flex justify-between items-center py-2 px-3 bg-transparent hover:bg-white/[0.02] rounded-xl transition-all text-left text-xs text-white/80 group cursor-pointer"
                >
                  <span className="font-medium group-hover:text-violet-400 transition-colors">{tag.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-mono text-white/30">{tag.views}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* C. TRY VIRTUAL TRY-ON */}
          <div className="relative bg-gradient-to-br from-violet-950/40 via-indigo-950/30 to-black/60 border border-violet-500/10 rounded-3xl overflow-hidden p-5 flex justify-between items-center group">
            <div className="space-y-3.5 z-10 max-w-[60%] text-left">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-violet-600/30 border border-violet-500/30 rounded-full">
                <span className="text-[8px] font-sans font-extrabold uppercase tracking-wider text-violet-300">NEW</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white font-sans tracking-wide leading-snug">Try Virtual Try-On</h4>
                <p className="text-[10px] text-white/50 leading-relaxed font-sans font-light">See how outfits look on you instantly.</p>
              </div>
              <button 
                onClick={() => setActiveSubTab && setActiveSubTab('VIRTUAL_TRY' as any)}
                className="py-1.5 px-3 bg-transparent border border-white/10 hover:border-white text-white font-sans text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Try Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-[42%] pointer-events-none overflow-hidden flex items-end justify-end">
              <img 
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=250&auto=format&fit=crop" 
                className="h-full w-full object-cover object-center translate-y-2 translate-x-1 group-hover:scale-105 transition-transform duration-500" 
                alt="" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* D. TOP CONTRIBUTORS */}
          <div className="bg-[#07070c]/50 border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white font-sans tracking-wide">Top Contributors</h3>
              <div className="flex items-center gap-1 text-[9.5px] font-sans text-white/40 border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded-lg cursor-pointer">
                <span>This Week</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>

            <div className="space-y-3">
              {[
                { rank: 1, name: 'Ayesha Malik', views: '12.4K', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' },
                { rank: 2, name: 'Hamza Ali', views: '9.8K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
                { rank: 3, name: 'Noor Fatima', views: '8.2K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
                { rank: 4, name: 'Zaynab', views: '7.1K', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=150&auto=format&fit=crop' }
              ].map((contributor) => (
                <div 
                  key={contributor.rank}
                  className="flex items-center justify-between py-1 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-sans font-semibold text-white/30 w-3">{contributor.rank}</span>
                    <img 
                      src={contributor.avatar} 
                      className="w-8 h-8 rounded-full object-cover" 
                      alt="" 
                    />
                    <div>
                      <span className="block text-xs font-semibold text-white leading-tight">{contributor.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-violet-400">
                    <Heart className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-[10.5px] font-mono font-bold text-white/60">{contributor.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
