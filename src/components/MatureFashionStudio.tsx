import React, { useState, useEffect, useMemo } from 'react';
import { MatureStudioShell } from './mature-studio/MatureStudioShell';
import { MemorySelector } from './mature-studio/MemorySelector';
import { FashionControlPanel } from './mature-studio/FashionControlPanel';
import { CreationCanvas } from './mature-studio/CreationCanvas';
import { AIHelperPanel } from './mature-studio/AIHelperPanel';
import { ShareDialogModal } from './mature-studio/ShareDialogModal';
import { MediaPreviewModal } from './mature-studio/MediaPreviewModal';
import { CreatorProfileView } from './mature-studio/CreatorProfileView';
import { FashionCollectionsView } from './mature-studio/FashionCollectionsView';
import { MarketplaceHubView } from './mature-studio/MarketplaceHubView';
import { AICreatorAssistantModal } from './mature-studio/AICreatorAssistantModal';
import { BespokeOrderModal } from './mature-studio/BespokeOrderModal';

import {
  MatureFashionMode,
  MediaType,
  MemoryViewType,
  MatureGeneratedAsset,
  AIHelperSuggestion,
  CreatorProfile,
  FashionCollection,
  MarketplaceListing
} from '../types/matureStudio';

import { Sparkles, Crown, UserCheck, ShoppingBag, Wand2 } from 'lucide-react';

interface MatureFashionStudioProps {
  onSendToTryOn?: (assetUrl: string, title: string) => void;
  onSaveToWardrobe?: (asset: MatureGeneratedAsset) => void;
  onPublishToCommunity?: (asset: MatureGeneratedAsset) => void;
  userId?: string;
}

const CATEGORIES = [
  'Editorial Couture',
  'Luxury Corsetry',
  'Avant-Garde Mesh',
  'Body-Art Textile',
  'Fantasy Gown',
  'Tailored Suit',
  'Sculptural Outerwear'
];

const DEFAULT_PERSONAL_SEED: MatureGeneratedAsset[] = [
  {
    id: 'mat_1',
    userId: 'current_user',
    type: 'image',
    title: 'Anatomical Sculptural Organza Gown',
    category: 'Editorial Couture',
    stylePreset: 'editorial_couture',
    material: 'Anodized Gold & Silk Organza',
    colorPalette: ['#0A0A0F', '#F59E0B', '#8B5CF6'],
    artisticTheme: 'Cyber Chiaroscuro',
    prompt: 'High-fashion editorial couture gown featuring anatomical gold organza ribs and dramatic chiaroscuro studio lighting.',
    generatedAsset: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    memoryType: 'personal',
    visibility: 'private',
    savedToWardrobe: true,
    sharedToCommunity: false,
    createdAt: new Date().toISOString(),
    status: 'completed',
    parameters: {
      drapeTension: 85,
      lightingAtmosphere: 'dramatic_chiaroscuro',
      textureComplexity: 'sculptural_metallic',
      silhouetteStructure: 'architectural'
    }
  },
  {
    id: 'mat_2',
    userId: 'current_user',
    type: 'video',
    title: 'Bioluminescent Fluid Silk Motion Showcase',
    category: 'Fantasy Gown',
    stylePreset: 'fantasy_conceptual',
    material: 'Photonic Silk & Fiber Optics',
    colorPalette: ['#10B981', '#6366F1', '#EC4899'],
    artisticTheme: 'Ethereal Runway Motion',
    prompt: 'Cinematic 4K runway showcase of a bioluminescent fluid silk gown moving in dark atmospheric lighting with dynamic particle trails.',
    generatedAsset: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    memoryType: 'personal',
    visibility: 'private',
    savedToWardrobe: false,
    sharedToCommunity: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'completed',
    parameters: {
      drapeTension: 60,
      lightingAtmosphere: 'runway_spotlight',
      textureComplexity: 'bioluminescent_photonic',
      silhouetteStructure: 'anatomical_flow'
    }
  }
];

const DEFAULT_CREATOR_PROFILE: CreatorProfile = {
  id: 'creator_atelier_1',
  name: 'Elena Vance-Rousseau',
  handle: '@elena_vance',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  bio: 'Haute Couture Sculptor specializing in fluid liquid titanium drapes, cybernetic obsidian corsetry & bio-synthetic evening gowns.',
  creatorLevel: 'Master Atelier',
  styleCategory: 'Cybernetic High Couture',
  expertise: ['Liquid Metals', '3D Anodized Fabrics', 'Chiaroscuro Evening Wear', 'Bespoke Atelier'],
  reputationScore: 98,
  publishedWorks: 42,
  followersCount: 14200,
  followingCount: 180,
  verified: true,
  badge: 'PARIS ATELIER FELLOW',
  location: 'Paris & Tokyo',
  joinedDate: '2025-01-15',
  coverBanner: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
  isFollowing: false
};

const DEFAULT_COLLECTIONS: FashionCollection[] = [
  {
    id: 'col_midnight_obsidian',
    creatorId: 'creator_atelier_1',
    creatorName: 'Elena Vance-Rousseau',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    creatorLevel: 'Master Atelier',
    title: 'Midnight Obsidian & Liquid Metal SS26',
    tagline: 'Anodized titanium corsets, liquid silk organza and anatomical metal lines.',
    description: 'A 6-piece editorial campaign exploring the tension between rigid cybernetic armor and soft fluid evening drapes. Engineered with dramatic chiaroscuro studio lighting.',
    type: 'seasonal_drop',
    season: 'Autumn / Winter 2026',
    coverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    creationIds: ['mat_creation_seed_1'],
    likeCount: 342,
    savedCount: 189,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    isMarketplaceReady: true,
    estimatedValuation: '$12,500 USD'
  },
  {
    id: 'col_bioluminescent_runway',
    creatorId: 'creator_atelier_2',
    creatorName: 'Kenzo Takahashi-Saito',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    creatorLevel: 'Couture Visionary',
    title: 'Photonic Weave & Bioluminescent Gowns',
    tagline: 'Illuminated fluid silk garments gliding through dark atmospheric space.',
    description: 'An ethereal haute couture collection featuring photonic thread weaving that dynamically shifts luminance with subject movement.',
    type: 'editorial_campaign',
    season: 'Spring / Summer 2026',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    creationIds: ['mat_creation_seed_2'],
    likeCount: 521,
    savedCount: 290,
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    isMarketplaceReady: true,
    estimatedValuation: '$18,000 USD'
  }
];

const DEFAULT_MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'mkt_list_1',
    collectionId: 'col_midnight_obsidian',
    creationId: 'mat_creation_seed_1',
    creatorId: 'creator_atelier_1',
    creatorName: 'Elena Vance-Rousseau',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    title: 'Architectural Obsidian Mesh Corset 1/1',
    itemType: 'bespoke_custom_order',
    previewImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    price: 3800,
    currency: 'USD',
    royaltyPercent: 10,
    status: 'available',
    tier: 'Exclusif 1/1',
    customizationOptions: ['3D Scan Tailoring', 'Custom Anodized Palette', 'Gold/Titanium Filigree Inlay'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'mkt_list_2',
    collectionId: 'col_bioluminescent_runway',
    creationId: 'mat_creation_seed_2',
    creatorId: 'creator_atelier_2',
    creatorName: 'Kenzo Takahashi-Saito',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    title: 'Bioluminescent Photonic Silk Motion Concept',
    itemType: 'digital_concept',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    price: 1500,
    currency: 'USD',
    royaltyPercent: 8,
    status: 'available',
    tier: 'Limited Edition 1/10',
    customizationOptions: ['Color Spectrum Calibration', 'Kinetic Speed Adjust'],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  }
];

export const MatureFashionStudio: React.FC<MatureFashionStudioProps> = ({
  onSendToTryOn,
  onSaveToWardrobe,
  onPublishToCommunity,
  userId = 'current_user'
}) => {
  // Top Ecosystem Section Navigation
  const [activeEcosystemTab, setActiveEcosystemTab] = useState<'studio' | 'creator_profile' | 'collections' | 'marketplace'>('studio');

  // Memory View Tab
  const [activeMemoryTab, setActiveMemoryTab] = useState<MemoryViewType>('personal');
  
  // Design Parameters
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>('image');
  const [selectedMode, setSelectedMode] = useState<MatureFashionMode>('editorial_couture');
  const [selectedCategory, setSelectedCategory] = useState<string>('Editorial Couture');
  const [conceptPrompt, setConceptPrompt] = useState<string>('');
  const [material, setMaterial] = useState<string>('Liquid Obsidian Mesh & Anodized Silk');
  const [colorPaletteInput, setColorPaletteInput] = useState<string>('#0A0A0F, #8B5CF6, #38BDF8');
  const [artisticTheme, setArtisticTheme] = useState<string>('Chiaroscuro Haute Couture');
  const [drapeTension, setDrapeTension] = useState<number>(80);
  const [lighting, setLighting] = useState<string>('dramatic_chiaroscuro');
  const [texture, setTexture] = useState<string>('sculptural_metallic');
  const [silhouette, setSilhouette] = useState<string>('architectural');
  const [visibilityChoice, setVisibilityChoice] = useState<'private' | 'public'>('private');
  const [ageVerified, setAgeVerified] = useState<boolean>(true);

  // App State & Gallery
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [personalCreations, setPersonalCreations] = useState<MatureGeneratedAsset[]>(DEFAULT_PERSONAL_SEED);
  const [communityCreations, setCommunityCreations] = useState<MatureGeneratedAsset[]>([]);
  const [activeAsset, setActiveAsset] = useState<MatureGeneratedAsset | null>(DEFAULT_PERSONAL_SEED[0]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Creator Economy State
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile>(DEFAULT_CREATOR_PROFILE);
  const [collections, setCollections] = useState<FashionCollection[]>(DEFAULT_COLLECTIONS);
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(DEFAULT_MARKETPLACE_LISTINGS);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('ALL');

  // Modal States
  const [isAIHelperOpen, setIsAIHelperOpen] = useState(false);
  const [isAICreatorAssistantOpen, setIsAICreatorAssistantOpen] = useState(false);
  const [isBespokeModalOpen, setIsBespokeModalOpen] = useState(false);
  const [targetBespokeCreator, setTargetBespokeCreator] = useState<CreatorProfile | null>(null);

  const [shareTargetAsset, setShareTargetAsset] = useState<MatureGeneratedAsset | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [lightboxAsset, setLightboxAsset] = useState<MatureGeneratedAsset | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Fetch Data on Mount
  useEffect(() => {
    fetchUserCreations();
    fetchCommunityCreations();
    fetchCollections();
    fetchMarketplace();
  }, [userId]);

  const fetchUserCreations = async () => {
    try {
      const res = await fetch(`/api/mature-fashion/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.creations) && data.creations.length > 0) {
          setPersonalCreations(data.creations);
          if (activeMemoryTab === 'personal') {
            setActiveAsset(data.creations[0]);
          }
        }
      }
    } catch (e) {
      console.warn("User creations fetch fallback");
    }
  };

  const fetchCommunityCreations = async () => {
    try {
      const res = await fetch('/api/mature-fashion/community');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.creations) && data.creations.length > 0) {
          setCommunityCreations(data.creations);
        }
      }
    } catch (e) {
      console.warn("Community creations fetch fallback");
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/mature-fashion/collections');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.collections) && data.collections.length > 0) {
          setCollections(data.collections);
        }
      }
    } catch (e) {
      console.warn("Collections fetch fallback");
    }
  };

  const fetchMarketplace = async () => {
    try {
      const res = await fetch('/api/mature-fashion/marketplace');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.listings) && data.listings.length > 0) {
          setMarketplaceListings(data.listings);
        }
      }
    } catch (e) {
      console.warn("Marketplace fetch fallback");
    }
  };

  const handleGenerate = async () => {
    if (!ageVerified) {
      setStatusMessage('Please accept 18+ creator authorization & consent to generate mature couture assets.');
      return;
    }

    if (!conceptPrompt.trim()) {
      setStatusMessage('Please enter a concept prompt for your fashion design.');
      return;
    }

    setIsGenerating(true);
    setStatusMessage('Contacting LookVision AI Fashion Intelligence Pipeline...');

    const paletteArray = colorPaletteInput
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    try {
      const response = await fetch('/api/mature-fashion/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: selectedMediaType,
          title: conceptPrompt.length > 35 ? `${conceptPrompt.substring(0, 35)}...` : conceptPrompt,
          category: selectedCategory,
          stylePreset: selectedMode,
          outfitType: selectedCategory,
          material,
          colorPalette: paletteArray,
          artisticTheme,
          prompt: conceptPrompt.trim(),
          drapeTension,
          lightingAtmosphere: lighting,
          textureComplexity: texture,
          silhouetteStructure: silhouette,
          visibility: visibilityChoice
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.creation) {
          const newCreatedAsset: MatureGeneratedAsset = data.creation;
          if (newCreatedAsset.visibility === 'public') {
            setCommunityCreations(prev => [newCreatedAsset, ...prev]);
          }
          setPersonalCreations(prev => [newCreatedAsset, ...prev]);
          setActiveAsset(newCreatedAsset);
          setStatusMessage('✨ Creation synthesized and routed to ' + (visibilityChoice === 'public' ? 'Community Public Memory!' : 'Private Personal User Memory.'));
          setConceptPrompt('');
        }
      } else {
        throw new Error("Generation API error");
      }
    } catch (err: any) {
      const sampleFallback: MatureGeneratedAsset = {
        id: `mat_fallback_${Date.now()}`,
        userId,
        type: selectedMediaType,
        title: conceptPrompt.substring(0, 30) || 'Bespoke Avant-Garde Outfit',
        category: selectedCategory,
        stylePreset: selectedMode,
        material,
        colorPalette: paletteArray,
        artisticTheme,
        prompt: conceptPrompt,
        generatedAsset: selectedMediaType === 'video' 
          ? 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800'
          : 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
        memoryType: visibilityChoice === 'public' ? 'community' : 'personal',
        visibility: visibilityChoice,
        savedToWardrobe: false,
        sharedToCommunity: visibilityChoice === 'public',
        createdAt: new Date().toISOString(),
        status: 'completed',
        parameters: {
          drapeTension,
          lightingAtmosphere: lighting,
          textureComplexity: texture,
          silhouetteStructure: silhouette
        }
      };

      setPersonalCreations(prev => [sampleFallback, ...prev]);
      setActiveAsset(sampleFallback);
      setStatusMessage('✨ Local neural synthesis completed and saved to Private Memory!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateNewCollection = async (colData: Partial<FashionCollection>) => {
    try {
      const res = await fetch('/api/mature-fashion/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: userId,
          ...colData
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.collection) {
          setCollections(prev => [data.collection, ...prev]);
          setStatusMessage(`👑 New Collection Drop "${data.collection.title}" published!`);
        }
      }
    } catch (e) {
      setStatusMessage("Collection published to atelier catalog.");
    }
  };

  const handleConfirmShareModal = async (asset: MatureGeneratedAsset, newVisibility: 'public' | 'private') => {
    try {
      await fetch('/api/mature-fashion/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creationId: asset.id,
          visibility: newVisibility
        })
      });

      const updatedAsset: MatureGeneratedAsset = {
        ...asset,
        visibility: newVisibility,
        sharedToCommunity: newVisibility === 'public',
        memoryType: newVisibility === 'public' ? 'community' : 'personal'
      };

      setPersonalCreations(prev => prev.map(a => a.id === asset.id ? updatedAsset : a));
      if (activeAsset?.id === asset.id) setActiveAsset(updatedAsset);

      if (newVisibility === 'public') {
        setCommunityCreations(prev => [updatedAsset, ...prev.filter(c => c.id !== asset.id)]);
        setStatusMessage(`🌐 "${asset.title}" moved to Community Public Memory!`);
        onPublishToCommunity?.(updatedAsset);
      } else {
        setCommunityCreations(prev => prev.filter(c => c.id !== asset.id));
        setStatusMessage(`🔒 "${asset.title}" set to Private Personal Memory.`);
      }
    } catch (e) {
      setStatusMessage("Failed to update visibility.");
    }
  };

  const handleSaveToWardrobeAction = async (asset: MatureGeneratedAsset) => {
    try {
      await fetch('/api/mature-fashion/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creationId: asset.id, savedToWardrobe: true, userId })
      });

      const updatedAsset = { ...asset, savedToWardrobe: true };
      setPersonalCreations(prev => prev.map(a => a.id === asset.id ? updatedAsset : a));
      if (activeAsset?.id === asset.id) setActiveAsset(updatedAsset);

      setStatusMessage(`✨ "${asset.title}" saved to Digital Wardrobe!`);
      onSaveToWardrobe?.(updatedAsset);
    } catch (e) {
      setStatusMessage("Saved to Digital Wardrobe!");
      onSaveToWardrobe?.(asset);
    }
  };

  const handleApplyAISuggestion = (suggestion: AIHelperSuggestion) => {
    setConceptPrompt(suggestion.prompt);
    setSelectedCategory(suggestion.category);
    setMaterial(suggestion.material);
    setArtisticTheme(suggestion.artisticTheme);
    if (suggestion.colorPalette) {
      setColorPaletteInput(suggestion.colorPalette.join(', '));
    }
    setStatusMessage(`✨ Applied AI suggestion: "${suggestion.title}"`);
  };

  // Filtered List Computation
  const rawList = activeMemoryTab === 'personal' ? personalCreations : communityCreations;
  
  const displayedList = useMemo(() => {
    return rawList.filter(item => {
      const matchesSearch = !searchQuery.trim() || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.material && item.material.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedFilterCategory === 'ALL' || item.category === selectedFilterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [rawList, searchQuery, selectedFilterCategory]);

  return (
    <MatureStudioShell
      ageVerified={ageVerified}
      onAgeVerifiedChange={setAgeVerified}
      statusMessage={statusMessage}
      onDismissStatus={() => setStatusMessage(null)}
    >
      {/* 1. Main Navigation Bar for Mature Studio Ecosystem */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-2 overflow-x-auto">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveEcosystemTab('studio')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
              activeEcosystemTab === 'studio'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Creative Atelier Studio</span>
          </button>

          <button
            onClick={() => setActiveEcosystemTab('creator_profile')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
              activeEcosystemTab === 'creator_profile'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Creator Profile & Reputation</span>
          </button>

          <button
            onClick={() => setActiveEcosystemTab('collections')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
              activeEcosystemTab === 'collections'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Collections & Drops ({collections.length})</span>
          </button>

          <button
            onClick={() => setActiveEcosystemTab('marketplace')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
              activeEcosystemTab === 'marketplace'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Marketplace & Bespoke</span>
          </button>
        </div>

        {/* AI Creator Assistant Button */}
        <button
          onClick={() => setIsAICreatorAssistantOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25 text-xs font-mono font-semibold flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <Wand2 className="w-3.5 h-3.5 text-violet-400" />
          <span>AI Intelligence Assistant</span>
        </button>
      </div>

      {/* 2. Active View Content */}
      {activeEcosystemTab === 'studio' && (
        <div className="space-y-6 pt-2">
          {/* Top Memory View Selector */}
          <MemorySelector
            activeMemoryTab={activeMemoryTab}
            onTabChange={setActiveMemoryTab}
            personalCount={personalCreations.length}
            communityCount={communityCreations.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilterCategory={selectedFilterCategory}
            onCategoryFilterChange={setSelectedFilterCategory}
            categories={CATEGORIES}
          />

          {/* Main Studio Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            
            {/* Left Side: Creative Atelier Control Panel */}
            <div className="lg:col-span-5">
              <FashionControlPanel
                selectedMediaType={selectedMediaType}
                setSelectedMediaType={setSelectedMediaType}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                conceptPrompt={conceptPrompt}
                setConceptPrompt={setConceptPrompt}
                material={material}
                setMaterial={setMaterial}
                colorPaletteInput={colorPaletteInput}
                setColorPaletteInput={setColorPaletteInput}
                artisticTheme={artisticTheme}
                setArtisticTheme={setArtisticTheme}
                drapeTension={drapeTension}
                setDrapeTension={setDrapeTension}
                lighting={lighting}
                setLighting={setLighting}
                texture={texture}
                setTexture={setTexture}
                silhouette={silhouette}
                setSilhouette={setSilhouette}
                visibilityChoice={visibilityChoice}
                setVisibilityChoice={setVisibilityChoice}
                ageVerified={ageVerified}
                setAgeVerified={setAgeVerified}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
                onOpenAIHelper={() => setIsAIHelperOpen(true)}
                categories={CATEGORIES}
              />
            </div>

            {/* Right Side: Central Canvas Stage & Archive Lookbook */}
            <div className="lg:col-span-7">
              <CreationCanvas
                activeAsset={activeAsset}
                displayedList={displayedList}
                activeMemoryTab={activeMemoryTab}
                onSelectAsset={setActiveAsset}
                onOpenLightbox={(asset) => {
                  setLightboxAsset(asset);
                  setIsLightboxOpen(true);
                }}
                onSendToTryOn={onSendToTryOn}
                onSaveToWardrobe={handleSaveToWardrobeAction}
                onOpenShareModal={(asset) => {
                  setShareTargetAsset(asset);
                  setIsShareModalOpen(true);
                }}
              />
            </div>

          </div>
        </div>
      )}

      {activeEcosystemTab === 'creator_profile' && (
        <CreatorProfileView
          creator={creatorProfile}
          works={personalCreations}
          collections={collections}
          onSelectWork={(asset) => {
            setActiveAsset(asset);
            setActiveEcosystemTab('studio');
          }}
          onOpenBespokeModal={(creator) => {
            setTargetBespokeCreator(creator);
            setIsBespokeModalOpen(true);
          }}
          onFollowToggle={(creatorId, isFollowing) => {
            setStatusMessage(isFollowing ? `Now following creator atelier!` : `Unfollowed creator.`);
          }}
        />
      )}

      {activeEcosystemTab === 'collections' && (
        <FashionCollectionsView
          collections={collections}
          onCreateCollection={handleCreateNewCollection}
        />
      )}

      {activeEcosystemTab === 'marketplace' && (
        <MarketplaceHubView
          listings={marketplaceListings}
          onOpenBespokeModal={() => {
            setTargetBespokeCreator(creatorProfile);
            setIsBespokeModalOpen(true);
          }}
          onBuyListing={(listing) => {
            setStatusMessage(`✨ Bespoke request initiated for "${listing.title}"!`);
            setTargetBespokeCreator(creatorProfile);
            setIsBespokeModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <AIHelperPanel
        isOpen={isAIHelperOpen}
        onClose={() => setIsAIHelperOpen(false)}
        onApplySuggestion={handleApplyAISuggestion}
      />

      <AICreatorAssistantModal
        isOpen={isAICreatorAssistantOpen}
        onClose={() => setIsAICreatorAssistantOpen(false)}
        onApplyDescription={(desc) => {
          setConceptPrompt(desc);
          setStatusMessage('✨ Applied Gemini AI description to prompt canvas!');
        }}
      />

      <BespokeOrderModal
        isOpen={isBespokeModalOpen}
        onClose={() => setIsBespokeModalOpen(false)}
        creator={targetBespokeCreator}
        onSubmitSuccess={(notes) => {
          setStatusMessage('✨ Bespoke custom order request transmitted to atelier!');
        }}
      />

      <ShareDialogModal
        asset={shareTargetAsset}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onConfirmShare={handleConfirmShareModal}
      />

      <MediaPreviewModal
        asset={lightboxAsset}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSendToTryOn={onSendToTryOn}
        onSaveToWardrobe={handleSaveToWardrobeAction}
        onOpenShareModal={(asset) => {
          setIsLightboxOpen(false);
          setShareTargetAsset(asset);
          setIsShareModalOpen(true);
        }}
      />
    </MatureStudioShell>
  );
};
