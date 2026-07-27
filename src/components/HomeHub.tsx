import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Heart, Bookmark, Plus, ArrowRight, Shirt, Palette, 
  FolderPlus, Folder, Image as ImageIcon, Camera, MessageSquare, Send, 
  Share2, Tag, Check, Lock, Globe, Clock, Layers, Sparkles, X, Eye, 
  Wand2, ShieldCheck, Cpu, Trash2, ChevronRight, Sliders, Upload, Video,
  Smartphone, Monitor, CheckCircle, Save, Download, RefreshCw, Compass,
  Search, UserPlus, UserCheck, Users, Play, Pause, Film
} from 'lucide-react';
import { 
  AIStyleHubV17Architecture, 
  UnifiedHomeHubMemory, 
  UniversalPublishableAsset, 
  AnonymousDraftAsset, 
  HomeHubLikedItem,
  HomeHubDownloadedItem,
  HomeHubCollection,
  HomeHubPost,
  HomeHubStory,
  HomeHubSocialEntity,
  PersonalFashionIdentity
} from '../features/global/AIStyleHubV17Architecture';
import { WardrobeItem } from '../types';

interface HomeHubProps {
  wardrobe: WardrobeItem[];
  user?: any;
  onNavigateTab?: (tab: string) => void;
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onDeleteGarment?: (id: string) => Promise<void>;
  onLoadSamples?: () => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({
  wardrobe,
  user,
  onNavigateTab,
  onAddGarment,
  onDeleteGarment
}) => {
  // Main Navigation Tabs
  const [activeTab, setActiveTab] = useState<'FEED_STORIES' | 'SEARCH_DISCOVER' | 'MY_WORLD' | 'STYLE_DNA'>('FEED_STORIES');

  // Sub-filter for My World tab
  const [myWorldSubTab, setMyWorldSubTab] = useState<'CLOSET' | 'COLLECTIONS' | 'SAVE_OTHER_USERS' | 'SAVED' | 'IMPORT_MEMORY'>('CLOSET');

  // View Mode: Auto Responsive vs Forced Mobile vs Forced Desktop
  const [viewMode, setViewMode] = useState<'AUTO' | 'MOBILE' | 'DESKTOP'>('AUTO');

  // Core V17 Data States
  const [posts, setPosts] = useState<HomeHubPost[]>(() => AIStyleHubV17Architecture.getHomeHubPosts());
  const [stories, setStories] = useState<HomeHubStory[]>(() => AIStyleHubV17Architecture.getHomeHubStories());
  const [collections, setCollections] = useState<HomeHubCollection[]>(() => AIStyleHubV17Architecture.getPersonalCollections());
  const [anonymousDrafts, setAnonymousDrafts] = useState<AnonymousDraftAsset[]>(() => AIStyleHubV17Architecture.getAnonymousDrafts());
  const [recentLikes, setRecentLikes] = useState<HomeHubLikedItem[]>(() => AIStyleHubV17Architecture.getRecentLikes());
  const [styleDNASummary, setStyleDNASummary] = useState(() => AIStyleHubV17Architecture.getStyleDNASummaryForHomeHub());
  const [memory, setMemory] = useState<UnifiedHomeHubMemory>(() => AIStyleHubV17Architecture.getUnifiedMemory());

  // Search, Friends, Pages & Groups Social State
  const [socialEntities, setSocialEntities] = useState<HomeHubSocialEntity[]>(() => AIStyleHubV17Architecture.getSocialEntities());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<'ALL' | 'USERS' | 'PAGES' | 'GROUPS'>('ALL');

  // Modal States
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postCaption, setPostCaption] = useState<string>('');
  const [postImageUrl, setPostImageUrl] = useState<string>('');
  const [postMediaType, setPostMediaType] = useState<'image' | 'video'>('image');
  const [postTags, setPostTags] = useState<string>('fashion, homehub, aesthetic');
  const postFileInputRef = useRef<HTMLInputElement>(null);

  // Story Creation State (With Camera File Upload & Memory Picker)
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState<boolean>(false);
  const [storySourceTab, setStorySourceTab] = useState<'CAMERA_FILE' | 'MEMORY_PICKER' | 'URL'>('CAMERA_FILE');
  const [storyImageUrl, setStoryImageUrl] = useState<string>('');
  const [storyMediaType, setStoryMediaType] = useState<'image' | 'video'>('image');
  const [storyCaption, setStoryCaption] = useState<string>('');
  const cameraFileInputRef = useRef<HTMLInputElement>(null);

  const [selectedStory, setSelectedStory] = useState<HomeHubStory | null>(null);

  // "Upload For Give Your Name" Modal State
  const [selectedImportDraft, setSelectedImportDraft] = useState<AnonymousDraftAsset | null>(null);
  const [importGivenTitle, setImportGivenTitle] = useState<string>('');
  const [importGivenCaption, setImportGivenCaption] = useState<string>('');

  // Save Other Users' Image / Video Modal State
  const [isSaveOtherAssetOpen, setIsSaveOtherAssetOpen] = useState<boolean>(false);
  const [saveOtherTitle, setSaveOtherTitle] = useState<string>('');
  const [saveOtherUrl, setSaveOtherUrl] = useState<string>('');
  const [saveOtherCategory, setSaveOtherCategory] = useState<'tops' | 'bottoms' | 'outerwear' | 'dresses' | 'shoes' | 'accessories'>('outerwear');
  const [saveOtherMediaType, setSaveOtherMediaType] = useState<'image' | 'video'>('image');

  // Create Collection Modal State
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState<boolean>(false);
  const [colName, setColName] = useState<string>('');
  const [colDesc, setColDesc] = useState<string>('');
  const [colTags, setColTags] = useState<string>('minimalism, haute, runway');

  // Style Identity & DNA Collector Interactive State
  const initialIdentity = styleDNASummary.identity || {
    styleArchetype: 'Minimalist Haute Couture',
    colorPersonality: 'Monochrome Charcoal & Slate',
    fashionMood: 'Architectural Structural Elegance',
    creativityLevel: 88,
    luxuryPreference: 94,
    minimalismScore: 82,
    experimentalScore: 85,
    formalityPreference: 70,
    seasonalPreference: 'Autumn Tailoring & Transseasonal',
    overallConfidenceScore: 92,
    totalSignalsLearned: 38,
    lastEvolvedTimestamp: new Date().toISOString()
  };

  const [dnaArchetype, setDnaArchetype] = useState<string>(initialIdentity.styleArchetype || 'Minimalist Haute Couture');
  const [dnaColorPersonality, setDnaColorPersonality] = useState<string>(initialIdentity.colorPersonality || 'Monochrome Charcoal & Slate');
  const [dnaFashionMood, setDnaFashionMood] = useState<string>(initialIdentity.fashionMood || 'Architectural Structural Elegance');
  const [dnaSeasonalPref, setDnaSeasonalPref] = useState<string>(initialIdentity.seasonalPreference || 'Autumn Tailoring & Transseasonal');
  const [dnaCreativity, setDnaCreativity] = useState<number>(initialIdentity.creativityLevel || 85);
  const [dnaLuxury, setDnaLuxury] = useState<number>(initialIdentity.luxuryPreference || 90);
  const [dnaMinimalism, setDnaMinimalism] = useState<number>(initialIdentity.minimalismScore || 80);
  const [dnaExperimental, setDnaExperimental] = useState<number>(initialIdentity.experimentalScore || 85);

  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Minimalist', 'Avant-Garde', 'Quiet Luxury']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Charcoal & Obsidian', 'Emerald Accent', 'Champagne Gold']);
  const [selectedSilhouettes, setSelectedSilhouettes] = useState<string[]>(['Architectural Over-Sized', 'Fluid Column Draping']);

  // Refresh helper
  const refreshAllState = useCallback(() => {
    setPosts(AIStyleHubV17Architecture.getHomeHubPosts());
    setStories(AIStyleHubV17Architecture.getHomeHubStories());
    setCollections(AIStyleHubV17Architecture.getPersonalCollections());
    setAnonymousDrafts(AIStyleHubV17Architecture.getAnonymousDrafts());
    setRecentLikes(AIStyleHubV17Architecture.getRecentLikes());
    setStyleDNASummary(AIStyleHubV17Architecture.getStyleDNASummaryForHomeHub());
    setMemory(AIStyleHubV17Architecture.getUnifiedMemory());
    setSocialEntities(AIStyleHubV17Architecture.getSocialEntities());
  }, []);

  useEffect(() => {
    refreshAllState();
    const handleSync = () => refreshAllState();
    window.addEventListener('lookvision_sync_v17_memory', handleSync);
    return () => {
      window.removeEventListener('lookvision_sync_v17_memory', handleSync);
    };
  }, [refreshAllState]);

  // Handle Camera / File Upload for Story (Image or Video)
  const handleCameraFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setStoryMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setStoryImageUrl(event.target.result as string);
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
          detail: `✦ ${isVideo ? 'Video' : 'Camera photo'} captured! Ready to publish as Story.`
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle File Upload for Post (Image or Video)
  const handlePostFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setPostMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPostImageUrl(event.target.result as string);
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
          detail: `✦ ${isVideo ? 'Video' : 'Image'} uploaded successfully! Ready to share in Post.`
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Create Story Handler
  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    const img = storyImageUrl.trim() || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800';
    const userName = user?.displayName || 'Personal Stylist';

    AIStyleHubV17Architecture.createHomeHubStory({
      authorName: userName,
      authorAvatar: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      imageUrl: img,
      mediaType: storyMediaType,
      caption: storyCaption.trim()
    });

    setStoryImageUrl('');
    setStoryCaption('');
    setIsCreateStoryOpen(false);
    refreshAllState();

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✦ Story added to your HomeHub Personal World!'
    }));
  };

  // Create Post Handler
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const img = postImageUrl.trim() || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800';
    const userName = user?.displayName || 'Personal Stylist';

    const tagsArray = postTags.split(',').map(t => t.trim()).filter(Boolean);
    AIStyleHubV17Architecture.createHomeHubPost({
      authorName: userName,
      authorAvatar: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      imageUrl: img,
      mediaType: postMediaType,
      title: postTitle.trim() || 'Personal Fashion Post',
      caption: postCaption.trim() || 'Sharing my current sartorial vision in HomeHub.',
      tags: tagsArray
    });

    setPostTitle('');
    setPostCaption('');
    setPostImageUrl('');
    setIsCreatePostOpen(false);
    refreshAllState();

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✦ New Post published to your HomeHub Personal Feed!'
    }));
  };

  // Social & Friend Requests Handlers
  const handleSendFriendRequest = (entityId: string) => {
    const updated = AIStyleHubV17Architecture.sendFriendRequest(entityId);
    setSocialEntities(updated);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✦ Friend request sent successfully!'
    }));
  };

  const handleAcceptFriendRequest = (entityId: string) => {
    const updated = AIStyleHubV17Architecture.acceptFriendRequest(entityId);
    setSocialEntities(updated);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✦ Friend request accepted! You are now connected.'
    }));
  };

  const handleDeclineFriendRequest = (entityId: string) => {
    const updated = AIStyleHubV17Architecture.declineFriendRequest(entityId);
    setSocialEntities(updated);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✦ Friend request declined.'
    }));
  };

  const handleToggleJoinOrFollow = (entityId: string) => {
    const updated = AIStyleHubV17Architecture.toggleJoinOrFollow(entityId);
    setSocialEntities(updated);
    const target = updated.find(e => e.id === entityId);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✦ ${target?.isJoinedOrFollowing ? 'Joined / Followed' : 'Unfollowed'} "${target?.name}"`
    }));
  };

  // "Upload For Give Your Name" Import Handler
  const handleExecuteImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImportDraft) return;

    const userName = user?.displayName || 'Personal Stylist';
    const resultPost = AIStyleHubV17Architecture.importPublicMemoryAssetToHomeHub(
      selectedImportDraft.id,
      importGivenTitle.trim() || selectedImportDraft.titleSuggestion || 'My Personalized Fashion Creation',
      importGivenCaption.trim() || 'Imported from Public Component Memory and titled with my identity.',
      userName
    );

    if (resultPost) {
      setSelectedImportDraft(null);
      setImportGivenTitle('');
      setImportGivenCaption('');
      refreshAllState();

      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `✦ Asset imported into HomeHub as "${resultPost.title}"! Removed from Public Memory.`
      }));
    }
  };

  // Save Other Users' Image / Video into Personal Closet & Fashion World
  const handleSaveOtherUserAsset = async (title: string, url: string, category: any) => {
    if (!url) return;
    const assetTitle = title || 'Shared Community Look';

    if (onAddGarment) {
      await onAddGarment(
        assetTitle,
        `Saved from another user's fashion upload in HomeHub.`,
        category,
        { imageUrl: url, originModule: 'COMMUNITY_IMPORT' }
      );
    } else {
      // Fallback save to recent likes
      AIStyleHubV17Architecture.addLikeItem({
        title: assetTitle,
        imageUrl: url,
        originModule: 'COMMUNITY',
        styleVibe: category
      });
    }

    refreshAllState();
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✦ Saved "${assetTitle}" into your Digital Closet & Fashion World!`
    }));
  };

  // Create Collection Handler
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) return;

    const tagsArr = colTags.split(',').map(t => t.trim()).filter(Boolean);
    AIStyleHubV17Architecture.createPersonalCollection(colName.trim(), colDesc.trim(), tagsArr);

    setColName('');
    setColDesc('');
    setIsCreateCollectionOpen(false);
    refreshAllState();

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✦ Personal Collection "${colName}" created successfully.`
    }));
  };

  // Save Style Identity & DNA Collector
  const handleSaveStyleDNA = () => {
    AIStyleHubV17Architecture.updateUserStyleDNA(
      {
        styleArchetype: dnaArchetype,
        colorPersonality: dnaColorPersonality,
        fashionMood: dnaFashionMood,
        seasonalPreference: dnaSeasonalPref,
        creativityLevel: dnaCreativity,
        luxuryPreference: dnaLuxury,
        minimalismScore: dnaMinimalism,
        experimentalScore: dnaExperimental
      },
      selectedStyles,
      selectedColors,
      selectedSilhouettes
    );

    refreshAllState();
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✦ Style Identity & DNA saved! All AI features are now personalized to your preferences.'
    }));
  };

  // Toggle Like on Post
  const handleTogglePostLike = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const isLikedNow = !p.isLiked;
        return {
          ...p,
          isLiked: isLikedNow,
          likesCount: isLikedNow ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    });
    setPosts(updated);
    AIStyleHubV17Architecture.saveHomeHubPosts(updated);
  };

  // Wrapper class depending on viewMode
  const containerResponsiveClasses = viewMode === 'MOBILE'
    ? 'max-w-md mx-auto space-y-5 px-3 py-4 text-left font-sans bg-[#05050a] rounded-3xl border border-white/10 p-3 shadow-2xl'
    : viewMode === 'DESKTOP'
      ? 'w-full max-w-7xl mx-auto space-y-8 pb-20 px-6 sm:px-8 text-left font-sans'
      : 'w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-20 px-3 sm:px-6 text-left font-sans';

  return (
    <div className={containerResponsiveClasses}>
      
      {/* VIEW MODE RESPONISVE TOGGLE BAR */}
      <div className="flex items-center justify-between bg-[#07070c] border border-white/10 rounded-2xl p-2.5 px-4 shadow-lg text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-zinc-200 font-semibold uppercase tracking-wider text-[11px]">HomeHub Auto-Adaptive Layout</span>
        </div>

        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setViewMode('AUTO')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'AUTO' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto Adjust</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('MOBILE')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'MOBILE' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-300" />
            <span>Mobile</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('DESKTOP')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'DESKTOP' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Full View</span>
          </button>
        </div>
      </div>

      {/* 1. PERSONAL FASHION WORLD PROFILE HEADER */}
      <div className="bg-[#07070c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Cover Banner Accent */}
        <div className="h-28 sm:h-40 w-full bg-gradient-to-r from-violet-950/80 via-indigo-950/90 to-purple-950/80 relative overflow-hidden flex items-end p-4 sm:p-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-black/20" />
          <span className="relative z-10 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-violet-300 rounded-full tracking-wider uppercase flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>HomeHub Personal World</span>
          </span>
        </div>

        {/* Profile Card Body */}
        <div className="p-4 sm:p-8 pt-0 relative z-10 -mt-10 sm:-mt-16 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-5 w-full sm:w-auto">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <img
                src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300'}
                alt="Profile Avatar"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-[#07070c] shadow-2xl bg-zinc-900 mx-auto sm:mx-0"
              />
              <button
                type="button"
                onClick={() => setIsCreateStoryOpen(true)}
                title="Add Story with Camera or Memories"
                className="absolute -bottom-1 -right-1 p-2 bg-violet-600 text-white rounded-xl border-2 border-[#07070c] hover:bg-violet-500 transition-all cursor-pointer shadow-lg"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name & Bio */}
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-serif font-medium text-white tracking-tight">
                  {user?.displayName || 'My Fashion World'}
                </h1>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-md">
                  Active
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">@fashion_visionary</p>
              <p className="text-xs text-zinc-300 font-light max-w-lg leading-relaxed">
                Curating my personal fashion world, stories, signature style DNA, and private lookbook.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-center">
            <button
              type="button"
              onClick={() => setIsCreateStoryOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-200 text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>+ Add Story</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreatePostOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-950/40 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Post</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-t border-white/5 bg-white/[0.01]">
          <div className="p-3 sm:p-4 text-center border-r border-white/5">
            <span className="block text-base sm:text-lg font-serif font-bold text-white">{posts.length}</span>
            <span className="block text-[9.5px] font-mono text-zinc-500 uppercase">Posts</span>
          </div>
          <div className="p-3 sm:p-4 text-center border-r border-white/5">
            <span className="block text-base sm:text-lg font-serif font-bold text-amber-300">{stories.length}</span>
            <span className="block text-[9.5px] font-mono text-zinc-500 uppercase">Stories</span>
          </div>
          <div className="p-3 sm:p-4 text-center border-r border-white/5">
            <span className="block text-base sm:text-lg font-serif font-bold text-cyan-300">
              {socialEntities.filter(e => e.category === 'USERS' && e.friendRequestStatus === 'ACCEPTED').length}
            </span>
            <span className="block text-[9.5px] font-mono text-zinc-500 uppercase">Friends</span>
          </div>
          <div className="p-3 sm:p-4 text-center border-r border-white/5">
            <span className="block text-base sm:text-lg font-serif font-bold text-violet-400">{wardrobe.length}</span>
            <span className="block text-[9.5px] font-mono text-zinc-500 uppercase">Closet Pieces</span>
          </div>
          <div className="p-3 sm:p-4 text-center">
            <span className="block text-base sm:text-lg font-serif font-bold text-emerald-400">{collections.length}</span>
            <span className="block text-[9.5px] font-mono text-zinc-500 uppercase">Collections</span>
          </div>
        </div>
      </div>

      {/* 2. RESPONSIVE UNDERSTANDABLE 4-TAB NAVIGATION */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none flex-nowrap">
        {[
          { id: 'FEED_STORIES', label: '📱 Feed & Video Stories', desc: 'Timeline & Stories' },
          { 
            id: 'SEARCH_DISCOVER', 
            label: `🔍 Search & Friends${socialEntities.filter(e => e.friendRequestStatus === 'PENDING_RECEIVED').length > 0 ? ` (${socialEntities.filter(e => e.friendRequestStatus === 'PENDING_RECEIVED').length} New)` : ''}`, 
            desc: 'Users, Pages, Groups & Friends' 
          },
          { id: 'MY_WORLD', label: '🗂️ My Closet & World', desc: 'Save & Collect Images/Videos' },
          { id: 'STYLE_DNA', label: '👤 Style Identity & DNA', desc: 'Preferences & AI Personalization' }
        ].map(tab => {
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-5 py-3 rounded-2xl text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap text-left shrink-0 min-h-[44px] ${
                isSel
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-950/40 border border-violet-400/30'
                  : 'bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="block font-semibold">{tab.label}</span>
              <span className="block text-[9px] font-mono opacity-70 mt-0.5">{tab.desc}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT VIEWS */}
      <AnimatePresence mode="wait">

        {/* TAB 1: PERSONAL FEED & STORIES */}
        {activeTab === 'FEED_STORIES' && (
          <motion.div
            key="feed_stories_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* STORIES BAR CAROUSEL */}
            <div className="bg-[#07070c] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <h3 className="font-serif text-sm font-medium text-white">Daily Fashion Stories</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{stories.length} Active Stories</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none pt-1">
                {/* Create Story Circle */}
                <button
                  type="button"
                  onClick={() => setIsCreateStoryOpen(true)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 shadow-lg group-hover:scale-105 transition-all">
                    <div className="w-full h-full bg-[#07070c] rounded-[14px] flex flex-col items-center justify-center text-violet-300">
                      <Plus className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white">Add Story</span>
                </button>

                {/* Published Stories */}
                {stories.map(story => {
                  const isVideo = story.imageUrl.endsWith('.mp4') || story.imageUrl.includes('video');
                  return (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => setSelectedStory(story)}
                      className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer relative"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 p-0.5 shadow-lg group-hover:scale-105 transition-all overflow-hidden relative">
                        {isVideo ? (
                          <div className="w-full h-full bg-zinc-900 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                            <video src={story.imageUrl} className="w-full h-full object-cover" muted />
                            <Video className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                          </div>
                        ) : (
                          <img
                            src={story.imageUrl}
                            alt="Story"
                            className="w-full h-full object-cover rounded-[14px]"
                          />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-300 truncate max-w-[70px]">
                        {story.authorName.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* POST COMPOSER CARD */}
            <div className="bg-[#07070c] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <img
                  src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                  alt="Avatar"
                  className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <button
                  type="button"
                  onClick={() => setIsCreatePostOpen(true)}
                  className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between min-h-[44px]"
                >
                  <span className="truncate">Share a story, fashion update, or style post...</span>
                  <Send className="w-3.5 h-3.5 text-violet-400 shrink-0 ml-2" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono text-zinc-400 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePostOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Upload Image/Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('MY_WORLD');
                    setMyWorldSubTab('IMPORT_MEMORY');
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl transition-all cursor-pointer text-violet-300"
                >
                  <Wand2 className="w-4 h-4 text-violet-400" />
                  <span>Import Memory (Give Name)</span>
                </button>
              </div>
            </div>

            {/* MAIN SOCIAL TIMELINE POSTS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-violet-400" />
                  <span>Personal World Timeline</span>
                </h3>
                <span className="text-xs font-mono text-zinc-500">{posts.length} Posts</span>
              </div>

              {posts.length === 0 ? (
                <div className="p-8 sm:p-10 bg-[#07070c] border border-white/5 rounded-3xl text-center space-y-3">
                  <MessageSquare className="w-8 h-8 text-violet-400/50 mx-auto" />
                  <h4 className="font-serif text-sm font-medium text-white">No Posts Yet</h4>
                  <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">
                    Create your first post or import an anonymous fashion creation to build your personal fashion timeline!
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreatePostOpen(true)}
                    className="px-4 py-2 bg-violet-600 text-white text-xs font-mono rounded-xl cursor-pointer hover:bg-violet-500"
                  >
                    + Create First Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {posts.map(post => (
                    <div key={post.id} className="bg-[#07070c] border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl hover:border-violet-500/20 transition-all">
                      {/* Post Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                            alt="Author"
                            className="w-10 h-10 rounded-xl object-cover border border-white/10"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif text-sm font-medium text-white">{post.authorName}</h4>
                              {post.isImportedFromPublicMemory && (
                                <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[9px] font-mono rounded">
                                  Imported & Titled
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Save to Closet button */}
                        <button
                          type="button"
                          onClick={() => handleSaveOtherUserAsset(post.title, post.imageUrl, 'outerwear')}
                          className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 text-violet-200 rounded-xl text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5 text-amber-300" />
                          <span className="hidden sm:inline">Save to Closet</span>
                        </button>
                      </div>

                      {/* Title & Caption */}
                      <div className="space-y-1">
                        <h3 className="font-serif text-base font-light text-white">{post.title}</h3>
                        {post.caption && (
                          <p className="text-xs text-zinc-300 font-light leading-relaxed">{post.caption}</p>
                        )}
                      </div>

                      {/* Post Image / Video */}
                      <div className="relative rounded-2xl overflow-hidden bg-zinc-950 max-h-[500px]">
                        {post.imageUrl.endsWith('.mp4') || post.imageUrl.includes('video') ? (
                          <video src={post.imageUrl} controls className="w-full h-auto object-cover max-h-[500px]" />
                        ) : (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-auto object-cover max-h-[500px]"
                          />
                        )}
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {post.tags.map(t => (
                            <span key={t} className="px-2.5 py-1 bg-white/[0.02] border border-white/5 text-zinc-400 text-[10px] font-mono rounded-lg">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Post Actions Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono text-zinc-400">
                        <button
                          type="button"
                          onClick={() => handleTogglePostLike(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            post.isLiked ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'hover:bg-white/5 text-zinc-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current text-rose-400' : ''}`} />
                          <span>{post.likesCount}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                              detail: '✦ Link copied to share post!'
                            }));
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                        >
                          <Share2 className="w-4 h-4 text-violet-400" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: SEARCH & FRIENDS (Users, Pages, Groups & Friend Requests) */}
        {activeTab === 'SEARCH_DISCOVER' && (
          <motion.div
            key="search_discover_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* SEARCH HEADER CARD */}
            <div className="bg-[#07070c] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-violet-400" />
                    <span>Search Users, Pages & Groups</span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-light">
                    Find fashion stylists, connect with friends, follow official runways, and join community groups.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono rounded-full flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{socialEntities.filter(e => e.category === 'USERS' && e.friendRequestStatus === 'ACCEPTED').length} Friends</span>
                  </span>
                </div>
              </div>

              {/* SEARCH INPUT BAR */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, category, group, page, or fashion topic..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-10 py-3.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* CATEGORY FILTER PILLS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap">
                {[
                  { id: 'ALL', label: 'All Categories', icon: Globe },
                  { id: 'USERS', label: 'Users & Stylists', icon: User },
                  { id: 'PAGES', label: 'Official Pages', icon: Sparkles },
                  { id: 'GROUPS', label: 'Groups & Collectives', icon: Users }
                ].map(cat => {
                  const isSel = searchCategory === cat.id;
                  const IconComp = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSearchCategory(cat.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                        isSel
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/50 border border-violet-400/30'
                          : 'bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INCOMING FRIEND REQUESTS BANNER (IF ANY) */}
            {socialEntities.filter(e => e.friendRequestStatus === 'PENDING_RECEIVED').length > 0 && (
              <div className="bg-gradient-to-r from-amber-950/40 via-[#07070c] to-violet-950/40 border border-amber-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif text-sm font-medium text-white">Pending Friend Requests Received</h4>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[10px] rounded-full">
                    {socialEntities.filter(e => e.friendRequestStatus === 'PENDING_RECEIVED').length} Pending
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socialEntities.filter(e => e.friendRequestStatus === 'PENDING_RECEIVED').map(req => (
                    <div key={req.id} className="bg-black/40 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                          alt={req.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <h5 className="font-serif text-xs font-medium text-white">{req.name}</h5>
                          <span className="text-[10px] font-mono text-zinc-400">{req.subTag || 'Fashion Creator'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAcceptFriendRequest(req.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-mono flex items-center gap-1 cursor-pointer shadow-md"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineFriendRequest(req.id)}
                          className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl text-[10px] font-mono cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEARCH RESULTS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-violet-400" />
                  <span>
                    {searchQuery ? `Results for "${searchQuery}"` : 'Recommended Community & Network'}
                  </span>
                </span>
                <span>{socialEntities.filter(entity => {
                  const matchesCategory = searchCategory === 'ALL' || entity.category === searchCategory;
                  const matchesQuery = !searchQuery.trim() || 
                    entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (entity.bio && entity.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (entity.subTag && entity.subTag.toLowerCase().includes(searchQuery.toLowerCase()));
                  return matchesCategory && matchesQuery;
                }).length} Found</span>
              </div>

              {socialEntities.filter(entity => {
                const matchesCategory = searchCategory === 'ALL' || entity.category === searchCategory;
                const matchesQuery = !searchQuery.trim() || 
                  entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (entity.bio && entity.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (entity.subTag && entity.subTag.toLowerCase().includes(searchQuery.toLowerCase()));
                return matchesCategory && matchesQuery;
              }).length === 0 ? (
                <div className="p-8 bg-[#07070c] border border-white/5 rounded-3xl text-center space-y-3">
                  <Search className="w-8 h-8 text-zinc-500 mx-auto" />
                  <h4 className="font-serif text-sm font-medium text-white">No Results Found</h4>
                  <p className="text-xs text-zinc-400 font-light">
                    Try searching for different keywords or select a different category filter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {socialEntities.filter(entity => {
                    const matchesCategory = searchCategory === 'ALL' || entity.category === searchCategory;
                    const matchesQuery = !searchQuery.trim() || 
                      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (entity.bio && entity.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (entity.subTag && entity.subTag.toLowerCase().includes(searchQuery.toLowerCase()));
                    return matchesCategory && matchesQuery;
                  }).map(item => (
                    <div
                      key={item.id}
                      className="bg-[#07070c] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl hover:border-violet-500/20 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                              alt={item.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-white/10 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-serif text-sm font-medium text-white">{item.name}</h4>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                                <Tag className="w-2.5 h-2.5 text-violet-400" />
                                {item.subTag || item.category}
                              </span>
                            </div>
                          </div>

                          <span className={`px-2.5 py-1 text-[9px] font-mono rounded-full border ${
                            item.category === 'USERS' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' :
                            item.category === 'PAGES' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' :
                            'bg-amber-500/10 border-amber-500/20 text-amber-300'
                          }`}>
                            {item.category}
                          </span>
                        </div>

                        {item.bio && (
                          <p className="text-xs text-zinc-300 font-light leading-relaxed line-clamp-2">
                            {item.bio}
                          </p>
                        )}

                        {item.membersOrFollowers && (
                          <span className="text-[10px] font-mono text-zinc-500 block">
                            {item.membersOrFollowers}
                          </span>
                        )}
                      </div>

                      {/* ACTION BUTTON DEPENDING ON CATEGORY AND FRIEND REQUEST STATUS */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                        {item.category === 'USERS' ? (
                          <>
                            {item.friendRequestStatus === 'ACCEPTED' ? (
                              <div className="w-full flex items-center justify-between">
                                <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono rounded-xl flex items-center gap-1.5">
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Friends & Connected</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeclineFriendRequest(item.id)}
                                  className="text-[10px] font-mono text-zinc-500 hover:text-rose-400 cursor-pointer"
                                >
                                  Remove Friend
                                </button>
                              </div>
                            ) : item.friendRequestStatus === 'PENDING_SENT' ? (
                              <button
                                type="button"
                                disabled
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-zinc-400 text-xs font-mono rounded-xl flex items-center justify-center gap-2 opacity-75 cursor-not-allowed"
                              >
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Friend Request Sent</span>
                              </button>
                            ) : item.friendRequestStatus === 'PENDING_RECEIVED' ? (
                              <div className="w-full flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleAcceptFriendRequest(item.id)}
                                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accept Friend</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeclineFriendRequest(item.id)}
                                  className="px-3 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-mono rounded-xl cursor-pointer"
                                >
                                  Decline
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSendFriendRequest(item.id)}
                                className="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-mono rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-950/40"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>+ Add Friend</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleJoinOrFollow(item.id)}
                            className={`w-full px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              item.isJoinedOrFollowing
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                            }`}
                          >
                            <CheckCircle className={`w-3.5 h-3.5 ${item.isJoinedOrFollowing ? 'text-emerald-400' : 'text-zinc-400'}`} />
                            <span>
                              {item.isJoinedOrFollowing
                                ? item.category === 'GROUPS' ? 'Joined Group ✓' : 'Following Page ✓'
                                : item.category === 'GROUPS' ? '+ Join Group' : '+ Follow Page'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: MY FASHION WORLD & CLOSET (Save Images & Videos From Other Users) */}
        {activeTab === 'MY_WORLD' && (
          <motion.div
            key="my_world_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Sub-navigation pill selector */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 overflow-x-auto scrollbar-none flex-nowrap">
              {[
                { id: 'CLOSET', label: `Digital Closet (${wardrobe.length})`, icon: Shirt },
                { id: 'SAVE_OTHER_USERS', label: `Save Other Users' Images/Videos`, icon: Download },
                { id: 'COLLECTIONS', label: `Collections (${collections.length})`, icon: Folder },
                { id: 'SAVED', label: `Saved & Liked (${recentLikes.length})`, icon: Bookmark },
                { id: 'IMPORT_MEMORY', label: `Public Drafts (${anonymousDrafts.length})`, icon: Wand2 }
              ].map(st => {
                const Icon = st.icon;
                const isSel = myWorldSubTab === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setMyWorldSubTab(st.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] ${
                      isSel
                        ? 'bg-violet-600/30 border border-violet-500/40 text-violet-200 font-bold'
                        : 'bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SUB TAB 1: DIGITAL CLOSET */}
            {myWorldSubTab === 'CLOSET' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-serif text-base font-medium text-white">Digital Closet & World</h3>
                    <p className="text-xs text-zinc-400 font-light">Your private collection of garments and saved items from other users.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSaveOtherAssetOpen(true)}
                      className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-200 text-xs font-mono rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ Add Other Users' Image/Video</span>
                    </button>
                  </div>
                </div>

                {wardrobe.length === 0 ? (
                  <div className="p-8 sm:p-10 bg-[#07070c] border border-white/5 rounded-3xl text-center space-y-3">
                    <Shirt className="w-8 h-8 text-amber-400/50 mx-auto" />
                    <h4 className="font-serif text-sm font-medium text-white">Digital Closet Empty</h4>
                    <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">
                      Save images or videos uploaded by other users or add garments generated in Virtual Try-On!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {wardrobe.map(item => (
                      <div key={item.id} className="p-3 bg-[#07070c] border border-white/5 rounded-2xl space-y-2 group hover:border-violet-500/30 transition-all">
                        <div className="aspect-square rounded-xl overflow-hidden bg-zinc-950 relative">
                          {item.imageUrl.endsWith('.mp4') || item.imageUrl.includes('video') ? (
                            <video src={item.imageUrl} controls className="w-full h-full object-cover" />
                          ) : (
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-serif text-xs font-medium text-white truncate">{item.title}</h4>
                          <span className="text-[10px] font-mono text-zinc-500 capitalize">{item.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB TAB 2: SAVE OTHER USERS' IMAGES & VIDEOS */}
            {myWorldSubTab === 'SAVE_OTHER_USERS' && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-violet-950/60 to-indigo-950/60 border border-violet-500/30 rounded-2xl space-y-1">
                  <h4 className="font-serif text-sm font-medium text-amber-300 flex items-center gap-2">
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Save Other Users' Shared Assets into My Closet & World</span>
                  </h4>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed">
                    You can preserve any image or video uploaded by other community members into your personal Digital Closet or Collections to style and wear later.
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-zinc-400">Available Public Community Assets</span>
                  <button
                    type="button"
                    onClick={() => setIsSaveOtherAssetOpen(true)}
                    className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Import Asset by Link</span>
                  </button>
                </div>

                {/* Sample Public Community Uploads by Other Users */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'user-asset-1',
                      author: 'Elena Vance (@elena_couture)',
                      title: 'Liquid Metal Drape Dress',
                      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
                      type: 'image',
                      cat: 'dresses'
                    },
                    {
                      id: 'user-asset-2',
                      author: 'Soren Vance (@soren_design)',
                      title: 'Deconstructed Oversized Trench',
                      url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800',
                      type: 'image',
                      cat: 'outerwear'
                    },
                    {
                      id: 'user-asset-3',
                      author: 'Aria Sterling (@aria_cyber)',
                      title: 'Runway Silk Trousers & Blazer',
                      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800',
                      type: 'image',
                      cat: 'tops'
                    }
                  ].map(asset => (
                    <div key={asset.id} className="p-4 bg-[#07070c] border border-white/10 rounded-2xl space-y-3 hover:border-violet-500/30 transition-all">
                      <div className="aspect-square rounded-xl overflow-hidden bg-zinc-950">
                        <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[9.5px] font-mono text-zinc-500 block truncate">{asset.author}</span>
                        <h4 className="font-serif text-xs font-medium text-white">{asset.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSaveOtherUserAsset(asset.title, asset.url, asset.cat)}
                        className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg"
                      >
                        <Save className="w-3.5 h-3.5 text-amber-300" />
                        <span>Save to My Closet</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB TAB 3: PERSONAL COLLECTIONS */}
            {myWorldSubTab === 'COLLECTIONS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base font-medium text-white">Personal Collections</h3>
                    <p className="text-xs text-zinc-400 font-light">Custom moodboards and lookbooks created in HomeHub.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateCollectionOpen(true)}
                    className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ New Collection</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {collections.map(col => (
                    <div key={col.id} className="p-4 bg-[#07070c] border border-white/5 rounded-2xl space-y-3 hover:border-violet-500/30 transition-all">
                      <div className="flex items-center justify-between">
                        <Folder className="w-5 h-5 text-emerald-400" />
                        <span className="text-[10px] font-mono text-zinc-500">{col.itemCount} Items</span>
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-medium text-white">{col.name}</h4>
                        <p className="text-xs text-zinc-400 font-light mt-0.5 line-clamp-2">{col.description}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        {col.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-white/5 text-zinc-400 text-[9px] font-mono rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB TAB 4: SAVED & LIKED */}
            {myWorldSubTab === 'SAVED' && (
              <div className="space-y-4">
                <h3 className="font-serif text-base font-medium text-white">Saved & Liked Assets</h3>
                {recentLikes.length === 0 ? (
                  <div className="p-8 bg-[#07070c] border border-white/5 rounded-3xl text-center">
                    <Heart className="w-8 h-8 text-rose-400/50 mx-auto mb-2" />
                    <p className="text-xs text-zinc-400 font-light">No saved or liked assets yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {recentLikes.map(like => (
                      <div key={like.id} className="p-3 bg-[#07070c] border border-white/5 rounded-2xl space-y-2 group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-zinc-950">
                          <img src={like.imageUrl} alt={like.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                        </div>
                        <div>
                          <h4 className="font-serif text-xs font-medium text-white truncate">{like.title}</h4>
                          <span className="text-[9.5px] font-mono text-violet-400 uppercase">{like.originModule}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB TAB 5: PUBLIC MEMORY DRAFTS */}
            {myWorldSubTab === 'IMPORT_MEMORY' && (
              <div className="space-y-4">
                <div className="p-4 bg-violet-950/20 border border-violet-500/20 rounded-2xl space-y-1">
                  <h4 className="font-serif text-sm font-medium text-violet-200 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-amber-400" />
                    <span>Upload For Give Your Name Protocol</span>
                  </h4>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed">
                    Pick an anonymous asset generated in Community, AI Creations, or Outfit Planner. Give it your title and caption to import it into your HomeHub Personal Feed with full ownership.
                  </p>
                </div>

                {anonymousDrafts.length === 0 ? (
                  <div className="p-8 bg-[#07070c] border border-white/5 rounded-3xl text-center">
                    <p className="text-xs text-zinc-400 font-light">No anonymous public memory assets currently pending.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {anonymousDrafts.map(draft => (
                      <div key={draft.id} className="p-4 bg-[#07070c] border border-white/10 rounded-2xl flex gap-4 items-center">
                        <img src={draft.imageUrl} alt="Draft" className="w-20 h-20 object-cover rounded-xl shrink-0" />
                        <div className="space-y-2 flex-1">
                          <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[9px] font-mono rounded">
                            {draft.originModule}
                          </span>
                          <h4 className="font-serif text-xs font-medium text-white">{draft.titleSuggestion || 'Anonymous Visual Creation'}</h4>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImportDraft(draft);
                              setImportGivenTitle(draft.titleSuggestion || '');
                            }}
                            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>Import & Give Name</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: INTERACTIVE STYLE IDENTITY & DNA (User Information & Preference Collector) */}
        {activeTab === 'STYLE_DNA' && (
          <motion.div
            key="style_dna_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header info banner */}
            <div className="p-5 bg-gradient-to-r from-violet-950/80 via-indigo-950/80 to-purple-950/80 border border-violet-500/40 rounded-3xl space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Interactive Style DNA Collector</span>
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono rounded-full">
                  Application Personalization
                </span>
              </div>
              <p className="text-xs text-zinc-200 font-light leading-relaxed">
                This section collects your unique sartorial choices, body preferences, and color palettes so that the AI Studio runs customized specifically for your style DNA.
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-[#07070c] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
              
              {/* 1. Body & Fit Profile */}
              <div className="space-y-3">
                <label className="block text-xs font-mono text-amber-300 uppercase font-bold tracking-wider">
                  1. Body Archetype & Fit Preference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {[
                    'Minimalist Haute Couture',
                    'Quiet Luxury',
                    'Avant-Garde Cyber',
                    'Streetwear Luxe',
                    'Boho Chic',
                    'Classic Sartorial'
                  ].map(arch => (
                    <button
                      key={arch}
                      type="button"
                      onClick={() => setDnaArchetype(arch)}
                      className={`py-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                        dnaArchetype === arch
                          ? 'bg-violet-600 border-violet-400 text-white font-bold shadow-lg'
                          : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      {arch}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Color Personality */}
              <div className="space-y-3">
                <label className="block text-xs font-mono text-amber-300 uppercase font-bold tracking-wider">
                  2. Color Palette & Tone Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {[
                    'Monochrome Charcoal & Slate',
                    'Warm Earth & Terracotta',
                    'Liquid Pastels & Silk Whites',
                    'Jewel Tones (Emerald & Sapphire)',
                    'High-Contrast Neon Cyber Accents'
                  ].map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setDnaColorPersonality(col)}
                      className={`py-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                        dnaColorPersonality === col
                          ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-lg'
                          : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Preferred Fashion Styles (Multi-select) */}
              <div className="space-y-3">
                <label className="block text-xs font-mono text-amber-300 uppercase font-bold tracking-wider">
                  3. Preferred Aesthetics & Vibes (Select Multiple)
                </label>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {[
                    'Minimalist',
                    'Avant-Garde',
                    'Quiet Luxury',
                    'Cyberpunk',
                    'Tailored Silk',
                    'Architectural Layering',
                    'Vintage Glamour',
                    'High Fashion Runway'
                  ].map(st => {
                    const isSelected = selectedStyles.includes(st);
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedStyles(selectedStyles.filter(s => s !== st));
                          } else {
                            setSelectedStyles([...selectedStyles, st]);
                          }
                        }}
                        className={`py-2 px-3 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                        <span>{st}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. AI Intensity Sliders */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <label className="block text-xs font-mono text-amber-300 uppercase font-bold tracking-wider">
                  4. AI Generation & Personalization Weights
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span>Creativity Level</span>
                      <span className="text-violet-400 font-bold">{dnaCreativity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={dnaCreativity}
                      onChange={e => setDnaCreativity(Number(e.target.value))}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span>Luxury Preference</span>
                      <span className="text-amber-400 font-bold">{dnaLuxury}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={dnaLuxury}
                      onChange={e => setDnaLuxury(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span>Minimalism Score</span>
                      <span className="text-emerald-400 font-bold">{dnaMinimalism}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={dnaMinimalism}
                      onChange={e => setDnaMinimalism(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span>Experimental Score</span>
                      <span className="text-cyan-400 font-bold">{dnaExperimental}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={dnaExperimental}
                      onChange={e => setDnaExperimental(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE DNA ACTION BUTTON */}
              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveStyleDNA}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-violet-950/50"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Save Style DNA & Personalize Application</span>
                </button>
              </div>

            </div>

            {/* Auto-learning timeline */}
            <div className="bg-[#07070c] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-serif text-sm font-medium text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Recent Auto-Learning Signal Timeline</span>
                </h3>
              </div>

              <div className="space-y-3">
                {styleDNASummary.recentEvolutions.map((evo, idx) => (
                  <div key={`${evo.id}-${idx}`} className="p-3.5 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-zinc-200 font-light">{evo.summary}</p>
                      <span className="text-[9.5px] font-mono text-zinc-500">{evo.timestamp}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0">+{evo.impactScore} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* MODAL: CREATE NEW STORY (With Camera Stream File Upload & Memory Picker) */}
      <AnimatePresence>
        {isCreateStoryOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c14] border border-white/10 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Add Fashion Story</span>
                </h3>
                <button type="button" onClick={() => setIsCreateStoryOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Story Source Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setStorySourceTab('CAMERA_FILE')}
                  className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    storySourceTab === 'CAMERA_FILE' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  📷 Camera / Upload
                </button>
                <button
                  type="button"
                  onClick={() => setStorySourceTab('MEMORY_PICKER')}
                  className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    storySourceTab === 'MEMORY_PICKER' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  🔒 Select Memory
                </button>
              </div>

              {storySourceTab === 'CAMERA_FILE' && (
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={cameraFileInputRef}
                    accept="image/*,video/*"
                    capture="environment"
                    onChange={handleCameraFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => cameraFileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-violet-500/40 hover:border-violet-400 bg-violet-950/20 hover:bg-violet-950/30 rounded-2xl text-xs font-mono text-violet-200 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-amber-400" />
                    <span className="font-bold">Snap Camera Photo / Video or Select File</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Supports images and videos directly from device</span>
                  </button>
                </div>
              )}

              {storySourceTab === 'MEMORY_PICKER' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Select from Personal Memories / Closet:</span>
                  <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                    {wardrobe.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStoryImageUrl(item.imageUrl)}
                        className={`aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          storyImageUrl === item.imageUrl ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Story Preview */}
              {storyImageUrl && (
                <div className="aspect-[9/16] max-h-48 rounded-2xl overflow-hidden bg-black border border-amber-400/50 relative">
                  {storyMediaType === 'video' || storyImageUrl.endsWith('.mp4') ? (
                    <video src={storyImageUrl} controls autoPlay loop muted className="w-full h-full object-cover" />
                  ) : (
                    <img src={storyImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-amber-300 font-mono text-[9px] rounded-full border border-amber-400/30">
                    Ready
                  </span>
                </div>
              )}

              <form onSubmit={handleCreateStory} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Image/Video Link (Or use above buttons)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={storyImageUrl}
                    onChange={e => setStoryImageUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Story Caption (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Runway Mood ✦ Paris"
                    value={storyCaption}
                    onChange={e => setStoryCaption(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateStoryOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-mono font-bold rounded-xl cursor-pointer shadow-lg"
                  >
                    Publish to Stories
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CREATE NEW POST */}
      <AnimatePresence>
        {isCreatePostOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c14] border border-white/10 rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-base font-medium text-white">Create HomeHub Post</h3>
                <button type="button" onClick={() => setIsCreatePostOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Post Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autumn Tailored Trench Look"
                    value={postTitle}
                    onChange={e => setPostTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono text-zinc-400">Media (Image or Video)</label>
                  
                  <input
                    type="file"
                    ref={postFileInputRef}
                    accept="image/*,video/*"
                    onChange={handlePostFileUpload}
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => postFileInputRef.current?.click()}
                    className="w-full py-3 border border-dashed border-violet-500/40 hover:border-violet-400 bg-violet-950/20 hover:bg-violet-950/30 rounded-xl text-xs font-mono text-violet-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-violet-400" />
                    <span>Upload Image or Video File from Device</span>
                  </button>

                  <input
                    type="url"
                    placeholder="Or paste Image/Video URL: https://..."
                    value={postImageUrl}
                    onChange={e => setPostImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Media Preview */}
                {postImageUrl && (
                  <div className="rounded-2xl overflow-hidden bg-black border border-violet-500/30 max-h-48 relative">
                    {postMediaType === 'video' || postImageUrl.endsWith('.mp4') || postImageUrl.includes('video') ? (
                      <video src={postImageUrl} controls className="w-full h-48 object-cover" />
                    ) : (
                      <img src={postImageUrl} alt="Post Preview" className="w-full h-48 object-cover" />
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Caption & Story</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your sartorial inspiration..."
                    value={postCaption}
                    onChange={e => setPostCaption(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={postTags}
                    onChange={e => setPostTags(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatePostOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono rounded-xl cursor-pointer shadow-lg font-bold"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: SAVE OTHER USER'S IMAGE / VIDEO TO MY CLOSET */}
      <AnimatePresence>
        {isSaveOtherAssetOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c14] border border-amber-500/30 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-base font-medium text-amber-300 flex items-center gap-2">
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Save Other User's Image/Video</span>
                </h3>
                <button type="button" onClick={() => setIsSaveOtherAssetOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!saveOtherUrl.trim()) return;
                  await handleSaveOtherUserAsset(saveOtherTitle.trim() || 'Shared Community Look', saveOtherUrl.trim(), saveOtherCategory);
                  setIsSaveOtherAssetOpen(false);
                  setSaveOtherTitle('');
                  setSaveOtherUrl('');
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Garment / Look Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shared Silk Couture Dress"
                    value={saveOtherTitle}
                    onChange={e => setSaveOtherTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Image or Video Link</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={saveOtherUrl}
                    onChange={e => setSaveOtherUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Closet Category</label>
                  <select
                    value={saveOtherCategory}
                    onChange={e => setSaveOtherCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-[#07070c] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="tops">Tops & Shirts</option>
                    <option value="outerwear">Outerwear & Jackets</option>
                    <option value="dresses">Dresses & Suits</option>
                    <option value="bottoms">Bottoms & Trousers</option>
                    <option value="shoes">Shoes & Footwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsSaveOtherAssetOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono rounded-xl cursor-pointer shadow-lg font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>Save to My Closet</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: "UPLOAD FOR GIVE YOUR NAME" IMPORT DRAFT */}
      <AnimatePresence>
        {selectedImportDraft && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c14] border border-violet-500/30 rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-amber-400" />
                  <span>Upload For Give Your Name Protocol</span>
                </h3>
                <button type="button" onClick={() => setSelectedImportDraft(null)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4 items-center p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <img src={selectedImportDraft.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-xl" />
                <div>
                  <span className="px-2 py-0.5 bg-violet-500/10 text-violet-300 font-mono text-[9px] rounded">
                    {selectedImportDraft.originModule} Anonymous Memory
                  </span>
                  <p className="text-xs text-zinc-300 font-light mt-1">
                    Once imported into HomeHub, this asset is removed from Public Memory and becomes owned by you under your title!
                  </p>
                </div>
              </div>

              <form onSubmit={handleExecuteImport} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Give Your Custom Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Signature Haute Couture Suit"
                    value={importGivenTitle}
                    onChange={e => setImportGivenTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Personal Caption</label>
                  <textarea
                    rows={2}
                    placeholder="Add your personal styling notes..."
                    value={importGivenCaption}
                    onChange={e => setImportGivenCaption(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedImportDraft(null)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-mono rounded-xl cursor-pointer shadow-lg"
                  >
                    Import to HomeHub Feed
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CREATE COLLECTION */}
      <AnimatePresence>
        {isCreateCollectionOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c14] border border-white/10 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-base font-medium text-white">Create Personal Collection</h3>
                <button type="button" onClick={() => setIsCreateCollectionOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Collection Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimalist Trench Lookbook"
                    value={colName}
                    onChange={e => setColName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Quiet luxury outerwear and cashmere knits"
                    value={colDesc}
                    onChange={e => setColDesc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateCollectionOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono rounded-xl cursor-pointer shadow-lg"
                  >
                    Create Collection
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN STORY VIEWER MODAL */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-sm w-full bg-[#0c0c14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-3"
            >
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/60 text-white rounded-full hover:bg-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[9/16] w-full bg-zinc-950">
                {selectedStory.imageUrl.endsWith('.mp4') || selectedStory.imageUrl.includes('video') ? (
                  <video src={selectedStory.imageUrl} controls autoPlay loop className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={selectedStory.imageUrl}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-5 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedStory.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                      alt="Author"
                      className="w-8 h-8 rounded-full border border-white/20 object-cover"
                    />
                    <span className="text-xs font-mono text-white font-medium">{selectedStory.authorName}</span>
                  </div>

                  {selectedStory.caption && (
                    <p className="text-xs font-serif text-white/90 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      {selectedStory.caption}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
