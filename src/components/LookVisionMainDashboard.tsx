import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { WardrobeItem } from '../types';

// Import modular dashboard subcomponents
import { PlatformEcosystemLauncher } from './dashboard/PlatformEcosystemLauncher';
import { EditorsPicks } from './dashboard/EditorsPicks';
import { SidebarWidgets } from './dashboard/SidebarWidgets';

interface LookVisionMainDashboardProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onDeleteGarment?: (id: string) => Promise<void>;
  user?: any;
  onLogout?: () => void;
  onReset?: () => void;
  onLoadSamples?: () => void;
  setActiveSubTab?: (tab: any) => void;
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

  // Column Sub-tabs states to match the visual layout
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
      setActiveSubTab('PRODUCT_AI_CREATIONS');
    }
  };

  return (
    <div className="w-full animate-fade-in relative text-left select-none pb-2">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        
        {/* Left/Center Main Content Column */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* Platform Ecosystem Launcher */}
          <PlatformEcosystemLauncher
            user={user}
            setActiveSubTab={setActiveSubTab}
          />
          
          {/* CURATOR'S PICKS BOTTOM HORIZONTAL CAROUSEL */}
          <EditorsPicks setActiveSubTab={setActiveSubTab} onAddGarment={onAddGarment} />

        </div>

        {/* Right Sidebar Area */}
        <SidebarWidgets
          setActiveSubTab={setActiveSubTab}
          setPromptInput={setPromptInput}
        />

      </div>
    </div>
  );
};
