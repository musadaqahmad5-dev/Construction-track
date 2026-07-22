import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Heart, Bookmark, MessageSquare, Send, Plus, Award, 
  Tag, Sparkles, Image as ImageIcon, Check, Info, Flame, Eye, 
  TrendingUp, Compass, Shield, RefreshCw, Star, Share2, 
  ChevronRight, ChevronLeft, CheckCircle2, Copy, FolderPlus, PlusCircle, 
  X, HelpCircle, Layers, Grid, SlidersHorizontal, ArrowUpRight,
  Loader2, Upload
} from 'lucide-react';
import { WardrobeItem } from '../../types';
import { db, auth } from '../../firebase';
import { CommunityGenerator } from '../CommunityGenerator';
import { FashionInstructorWorkspace } from './FashionInstructorWorkspace';
import { ImageGenerationRegistry } from '../../features/image-generation/imageGenerationProvider';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  getDocs,
  where
} from 'firebase/firestore';

import { 
  IntelligentCollectionsEngine, 
  FashionSimilarityEngine, 
  VisualRecommendationEngine, 
  CreatorDiversityEngine, 
  FeedRotationEngine, 
  FreshnessEngine, 
  InspirationEngine, 
  AutomaticRankingEngine, 
  FashionTrendDetectionEngine,
  type IntelligentCollectionType,
  type RankingEngineType
} from '../../engine/communityDiscoveryIntelligence';

interface CommunityScreenProps {
  user: any;
  userWardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onNavigateToTab?: (tab: string) => void;
}

interface Creator {
  name: string;
  handle: string;
  avatar: string;
  uid: string;
}

interface Blueprint {
  gender: string;
  age: string;
  faceShape: string;
  hairStyle: string;
  hairColor: string;
  skinTone: string;
  bodyProportions: string;
  height: string;
  pose: string;
  expression: string;
}

interface GarmentBlueprint {
  silhouette: string;
  collar: string;
  sleeves: string;
  stitching: string;
  fabric: string;
  material: string;
  folds: string;
  texture: string;
  accessories: string;
  shoes: string;
  jewelry: string;
}

interface SceneBlueprint {
  location: string;
  lighting: string;
  camera: string;
}

export interface CommunityPost {
  id: string;
  lookId?: string;
  userId?: string;
  author: Creator;
  caption: string;
  imageUrl: string;
  likes: number;
  commentsCount?: number;
  shares: number;
  saves: number;
  views: number;
  trendingScore: number;
  vibeTags: string[];
  taggedGarment?: { title: string; price: number; category: any };
  comments: { author: string; handle: string; avatar: string; text: string; createdAt: string }[];
  aiScore: number;
  aiBreakdown: { color: string; texture: string; seasonal: string };
  avatarBlueprint?: Blueprint;
  garmentBlueprint?: GarmentBlueprint;
  sceneBlueprint?: SceneBlueprint;
  isEditorPick?: boolean;
  isWeeklyHighlight?: boolean;
  collectionName?: string;
  createdAt: string;
}

interface InspirationBoard {
  id: string;
  name: string;
  coverImage?: string;
  postIds: string[];
}

// Deterministic generators to provide flawless blueprints for user-generated looks
function getDeterministicValue(seed: string, list: string[]): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return list[Math.abs(hash) % list.length];
}

function generateDeterministicAvatarBlueprint(seed: string): Blueprint {
  return {
    gender: getDeterministicValue(seed, ['Female', 'Male', 'Non-Binary']),
    age: getDeterministicValue(seed, ['21', '24', '26', '28', '32']),
    faceShape: getDeterministicValue(seed, ['Oval Contour', 'Chiseled Structured', 'Heart-shaped Sculpt', 'Angular Square']),
    hairStyle: getDeterministicValue(seed, ['Sleek Low Bun', 'Structured Textured Bob', 'Sharp Buzz Cut', 'Loose Architectural Waves', 'Wet-look Slicked Back']),
    hairColor: getDeterministicValue(seed, ['Sartorial Black', 'Warm Ash Blonde', 'Platinized Slate', 'Deep Ochre', 'Raw Chocolate']),
    skinTone: getDeterministicValue(seed, ['Alabaster Porcelain', 'Warm Golden Honey', 'Deep Espresso Obsidian', 'Sienna Terracotta', 'Neutral Olive']),
    bodyProportions: getDeterministicValue(seed, ['Editorial Slim', 'Athletic Structured', 'Statuesque Avant-Garde', 'Soft Drape Fluid']),
    height: getDeterministicValue(seed, ['178cm', '180cm', '182cm', '185cm', '188cm']),
    pose: getDeterministicValue(seed, ['Static Solitary Frontal', 'Contrapposto Weight Shift', 'Strode Dynamic Editorial', 'Resting Slouch Angular']),
    expression: getDeterministicValue(seed, ['Intense Stoic Calm', 'Quiet Sidelong Glance', 'Neutral Demure', 'Subtle Haunting Serenity'])
  };
}

function generateDeterministicGarmentBlueprint(seed: string): GarmentBlueprint {
  return {
    silhouette: getDeterministicValue(seed, ['Asymmetrical Cocoon', 'Sharp Double-Breasted Tailored', 'Architectural Oversized', 'Draped Fluid Column']),
    collar: getDeterministicValue(seed, ['Deconstructed Funnel Neck', 'Razor Shawl Lapel', 'Humble Banded Collar', 'Dropped Lapel Notch']),
    sleeves: getDeterministicValue(seed, ['Elongated Dropped-Shoulder', 'Pleated Bishop Bell', 'Minimalist Symmetrical Raglan', 'Sleeveless Sculpted Vest']),
    stitching: getDeterministicValue(seed, ['Blind-Hem Seamless', 'High-Contrast Double Indigo Needle', 'Exposed Structural Overlock', 'Tone-on-Tone Flatlock']),
    fabric: getDeterministicValue(seed, ['Heavy Belgian Flax Linen', 'Brushed Virgin Alpaca Wool', 'Double-Faced Matte Silk Gazar', 'Waterproof Rubberized Tech Cotton']),
    material: getDeterministicValue(seed, ['Sartorial Slate Blend', 'Structured Architectural Crepe', 'Raw Organic Hemp', 'Luxe High-Density Twill']),
    folds: getDeterministicValue(seed, ['Deep Sculptural Box Pleats', 'Soft Gravity Bias Drapes', 'Pressed Creased Lines', 'Micro-Gathered Texturing']),
    texture: getDeterministicValue(seed, ['Subtle Slub Matte', 'Hairy Fibrous Nap', 'Smooth Paper-like Crispness', 'Interlocked Micro-Ribbed Knit']),
    accessories: getDeterministicValue(seed, ['Matte Slate Utility Satchel', 'Monolithic Leather Wrap Belt', 'Brutalist Acetate Frame Shield', 'None - Sculpted Purity']),
    shoes: getDeterministicValue(seed, ['Lug-Sole Square-Toe Chelsea Boots', 'Minimalist Raw Edge Leather Mules', 'Tapered Neoprene Tech Sneakers', 'Monolithic Brushed Leather Derbies']),
    jewelry: getDeterministicValue(seed, ['Brutalist Oxidized Silver Torc', 'Raw Polished Slate Ring', 'Minimal Matte Brass Studs', 'None - Purist Campaign'])
  };
}

function generateDeterministicSceneBlueprint(seed: string): SceneBlueprint {
  return {
    location: getDeterministicValue(seed, ['Brutalist Concrete Atrium, Berlin', 'Overcast Slate Sea Cliffs, Iceland', 'Minimalist Sandstone Courtyard, Milan', 'Fog-Veiled Architectural Observatory, Kyoto', 'Sun-Baked Monolithic Quarry, Carrara']),
    lighting: getDeterministicValue(seed, ['Soft Overcast Sculpted Diffuse', 'High-Contrast Late Afternoon Piercing Solitary', 'Moody Low-Key Ambient Cyan Twilight', 'Warm Golden Hour Raking Rim Light', 'Volumetric Misty Silhouette Backlighting']),
    camera: getDeterministicValue(seed, ['Medium Format Hasselblad, 80mm lens, f/4.0', 'Cinematic Panavision Anamorphic, 50mm, f/2.8', 'Leica M11 Rangefinder, 35mm Summilux, f/5.6', 'Studio Graflex 4x5 Large Format Film'])
  };
}

export const PRESET_MOCK_LOOKS: CommunityPost[] = [
  {
    id: 'p-preset-1',
    author: {
      name: 'Elena Rostova',
      handle: '@elena_luxe',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      uid: 'elena-uid'
    },
    caption: 'Quiet autumn minimalism in Milan. A dialogue of paired sandstones, raw double-faced wool drapes, and high-density Belgian flax linen shirts to combat the early fog.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    likes: 24500,
    shares: 432,
    saves: 7200,
    views: 1200000,
    trendingScore: 98.4,
    vibeTags: ['minimalist', 'milan', 'sandstone', 'autumn-campaign'],
    taggedGarment: { title: 'Belgian Flax Linen Shirt', price: 185.00, category: 'Casual' },
    comments: [
      { author: 'Marcus Aurel', handle: '@marcus_k', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', text: 'The shoulder drape on this jacket is absolutely perfect.', createdAt: '2026-07-16T12:00:00.000Z' },
      { author: 'Sasha Dubois', handle: '@sasha_editorial', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop', text: 'Is that a brushed virgin alpaca wool blend?', createdAt: '2026-07-16T12:10:00.000Z' }
    ],
    aiScore: 97,
    aiBreakdown: { color: 'Perfect Symmetries', texture: 'Ultra-High Resolution Nap', seasonal: 'Flawless Comfort Weight' },
    avatarBlueprint: {
      gender: 'Female',
      age: '24',
      faceShape: 'Oval Contour',
      hairStyle: 'Sleek Low Bun',
      hairColor: 'Warm Ash Blonde',
      skinTone: 'Alabaster Porcelain',
      bodyProportions: 'Editorial Slim',
      height: '180cm',
      pose: 'Contrapposto Weight Shift',
      expression: 'Intense Stoic Calm'
    },
    garmentBlueprint: {
      silhouette: 'Asymmetrical Cocoon Coat',
      collar: 'Razor Shawl Lapel',
      sleeves: 'Elongated Dropped-Shoulder',
      stitching: 'Blind-Hem Seamless',
      fabric: 'Brushed Virgin Alpaca Wool',
      material: 'Sartorial Slate Blend',
      folds: 'Soft Gravity Bias Drapes',
      texture: 'Hairy Fibrous Nap',
      accessories: 'Monolithic Leather Wrap Belt',
      shoes: 'Minimalist Raw Edge Leather Mules',
      jewelry: 'Brutalist Oxidized Silver Torc'
    },
    sceneBlueprint: {
      location: 'Minimalist Sandstone Courtyard, Milan',
      lighting: 'Volumetric Misty Silhouette Backlighting',
      camera: 'Medium Format Hasselblad, 80mm lens, f/4.0'
    },
    isEditorPick: true,
    isWeeklyHighlight: true,
    collectionName: "Paris Couture '26",
    createdAt: '2026-07-16T10:00:00.000Z'
  },
  {
    id: 'p-preset-2',
    author: {
      name: 'Julian Vance',
      handle: '@julian_cyber',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      uid: 'julian-uid'
    },
    caption: 'Tokyo night drapes. Complete waterproof storm parka coordinates with high-density technical twill and tapered heavy-knit cargo pants. Structured for dynamic utility.',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    likes: 18200,
    shares: 219,
    saves: 5300,
    views: 890000,
    trendingScore: 96.1,
    vibeTags: ['techwear', 'tokyo', 'cyberpunk', 'utility'],
    taggedGarment: { title: 'Aris Waterproof Parka', price: 340.00, category: 'Outerwear' },
    comments: [
      { author: 'Elena Rostova', handle: '@elena_luxe', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop', text: 'Splendid material rendering. The seam seal taping lines are gorgeous.', createdAt: '2026-07-16T11:00:00.000Z' }
    ],
    aiScore: 93,
    aiBreakdown: { color: 'High Contrast Chroma', texture: 'Matte Rubberized Shield', seasonal: 'Optimized Storm Defense' },
    avatarBlueprint: {
      gender: 'Male',
      age: '28',
      faceShape: 'Chiseled Structured',
      hairStyle: 'Sharp Buzz Cut',
      hairColor: 'Sartorial Black',
      skinTone: 'Neutral Olive',
      bodyProportions: 'Athletic Structured',
      height: '185cm',
      pose: 'Strode Dynamic Editorial',
      expression: 'Quiet Sidelong Glance'
    },
    garmentBlueprint: {
      silhouette: 'Sharp Double-Breasted Tailored',
      collar: 'Deconstructed Funnel Neck',
      sleeves: 'Minimalist Symmetrical Raglan',
      stitching: 'Tone-on-Tone Flatlock',
      fabric: 'Waterproof Rubberized Tech Cotton',
      material: 'Luxe High-Density Twill',
      folds: 'Deep Sculptural Box Pleats',
      texture: 'Smooth Paper-like Crispness',
      accessories: 'Matte Slate Utility Satchel',
      shoes: 'Lug-Sole Square-Toe Chelsea Boots',
      jewelry: 'None - Purist Campaign'
    },
    sceneBlueprint: {
      location: 'Brutalist Concrete Atrium, Berlin',
      lighting: 'Moody Low-Key Ambient Cyan Twilight',
      camera: 'Cinematic Panavision Anamorphic, 50mm, f/2.8'
    },
    isEditorPick: false,
    isWeeklyHighlight: true,
    collectionName: "Subtle Brutalism",
    createdAt: '2026-07-16T09:00:00.000Z'
  },
  {
    id: 'p-preset-3',
    author: {
      name: 'Clara Oswald',
      handle: '@clara_couture',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
      uid: 'clara-uid'
    },
    caption: 'Experimental silhouette play. Structured linen cocoon drapes paired with heavy slab-knit accessories in a brutalist setting.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    likes: 12400,
    shares: 110,
    saves: 3400,
    views: 650000,
    trendingScore: 92.5,
    vibeTags: ['avant-garde', 'brutalist', 'linen', 'sculptural'],
    taggedGarment: { title: 'Cocoon Linen Vest', price: 210.00, category: 'Outerwear' },
    comments: [],
    aiScore: 95,
    aiBreakdown: { color: 'High Balance Hues', texture: 'Pristine Organic Slubs', seasonal: 'Breezy Layering Index' },
    avatarBlueprint: {
      gender: 'Female',
      age: '26',
      faceShape: 'Angular Square',
      hairStyle: 'Sharp Buzz Cut',
      hairColor: 'Platinized Slate',
      skinTone: 'Alabaster Porcelain',
      bodyProportions: 'Statuesque Avant-Garde',
      height: '182cm',
      pose: 'Static Solitary Frontal',
      expression: 'Subtle Haunting Serenity'
    },
    garmentBlueprint: {
      silhouette: 'Asymmetrical Cocoon',
      collar: 'Humble Banded Collar',
      sleeves: 'Sleeveless Sculpted Vest',
      stitching: 'Exposed Structural Overlock',
      fabric: 'Heavy Belgian Flax Linen',
      material: 'Raw Organic Hemp',
      folds: 'Micro-Gathered Texturing',
      texture: 'Subtle Slub Matte',
      accessories: 'None - Sculpted Purity',
      shoes: 'Minimalist Raw Edge Leather Mules',
      jewelry: 'Raw Polished Slate Ring'
    },
    sceneBlueprint: {
      location: 'Sun-Baked Monolithic Quarry, Carrara',
      lighting: 'High-Contrast Late Afternoon Piercing Solitary',
      camera: 'Leica M11 Rangefinder, 35mm Summilux, f/5.6'
    },
    isEditorPick: true,
    isWeeklyHighlight: false,
    collectionName: "Subtle Brutalism",
    createdAt: '2026-07-15T15:00:00.000Z'
  },
  {
    id: 'p-preset-4',
    author: {
      name: 'Matteo Ricci',
      handle: '@matteo_milano',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      uid: 'matteo-uid'
    },
    caption: 'High-density monolithic silk campaign. Heavy double-faced silk drapes combined with raw-hem knits for structured, dramatic luxury.',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
    likes: 31000,
    shares: 890,
    saves: 9800,
    views: 1800000,
    trendingScore: 99.2,
    vibeTags: ['silk', 'luxury', 'editorial', 'milan'],
    comments: [
      { author: 'Marcus Aurel', handle: '@marcus_k', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', text: 'Absolutely spectacular. This belongs on the cover of Vogue Runway!', createdAt: '2026-07-15T18:00:00.000Z' }
    ],
    aiScore: 98,
    aiBreakdown: { color: 'Sublime Saturated Tone', texture: 'Flawless Fluid Glissade', seasonal: 'Trans-seasonal Masterwork' },
    avatarBlueprint: {
      gender: 'Female',
      age: '21',
      faceShape: 'Oval Contour',
      hairStyle: 'Wet-look Slicked Back',
      hairColor: 'Raw Chocolate',
      skinTone: 'Alabaster Porcelain',
      bodyProportions: 'Editorial Slim',
      height: '178cm',
      pose: 'Contrapposto Weight Shift',
      expression: 'Intense Stoic Calm'
    },
    garmentBlueprint: {
      silhouette: 'Draped Fluid Column',
      collar: 'Dropped Lapel Notch',
      sleeves: 'Elongated Dropped-Shoulder',
      stitching: 'Blind-Hem Seamless',
      fabric: 'Double-Faced Matte Silk Gazar',
      material: 'Structured Architectural Crepe',
      folds: 'Soft Gravity Bias Drapes',
      texture: 'Smooth Paper-like Crispness',
      accessories: 'None - Sculpted Purity',
      shoes: 'Minimalist Raw Edge Leather Mules',
      jewelry: 'Brutalist Oxidized Silver Torc'
    },
    sceneBlueprint: {
      location: 'Brutalist Concrete Atrium, Berlin',
      lighting: 'Warm Golden Hour Raking Rim Light',
      camera: 'Medium Format Hasselblad, 80mm lens, f/4.0'
    },
    isEditorPick: true,
    isWeeklyHighlight: true,
    collectionName: "Paris Couture '26",
    createdAt: '2026-07-15T14:00:00.000Z'
  },
  {
    id: 'p-preset-5',
    author: {
      name: 'Kaelen Vance',
      handle: '@kaelen_nordic',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
      uid: 'kaelen-uid'
    },
    caption: 'A cocooning winter shelter. Heavily textured alpaca wool coordinate paired with deconstructed heavy-weight knit scarfs.',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
    likes: 11200,
    shares: 180,
    saves: 2800,
    views: 450000,
    trendingScore: 91.8,
    vibeTags: ['nordic', 'knitwear', 'winter-luxe', 'minimalism'],
    comments: [],
    aiScore: 94,
    aiBreakdown: { color: 'Perfect Chroma Unity', texture: 'Ultra-Tactile Ribbed Knit', seasonal: 'Absolute Thermal Optimization' },
    avatarBlueprint: {
      gender: 'Male',
      age: '32',
      faceShape: 'Chiseled Structured',
      hairStyle: 'Structured Textured Bob',
      hairColor: 'Platinized Slate',
      skinTone: 'Neutral Olive',
      bodyProportions: 'Athletic Structured',
      height: '188cm',
      pose: 'Resting Slouch Angular',
      expression: 'Intense Stoic Calm'
    },
    garmentBlueprint: {
      silhouette: 'Asymmetrical Cocoon',
      collar: 'Deconstructed Funnel Neck',
      sleeves: 'Pleated Bishop Bell',
      stitching: 'Exposed Structural Overlock',
      fabric: 'Brushed Virgin Alpaca Wool',
      material: 'Sartorial Slate Blend',
      folds: 'Micro-Gathered Texturing',
      texture: 'Interlocked Micro-Ribbed Knit',
      accessories: 'Monolithic Leather Wrap Belt',
      shoes: 'Monolithic Brushed Leather Derbies',
      jewelry: 'None - Purist Campaign'
    },
    sceneBlueprint: {
      location: 'Overcast Slate Sea Cliffs, Iceland',
      lighting: 'Soft Overcast Sculpted Diffuse',
      camera: 'Leica M11 Rangefinder, 35mm Summilux, f/5.6'
    },
    isEditorPick: false,
    isWeeklyHighlight: false,
    collectionName: "Digital Nomad Wool",
    createdAt: '2026-07-14T10:00:00.000Z'
  }
];

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  user,
  userWardrobe,
  onAddGarment,
  onNavigateToTab
}) => {
  // Discovery Tabs: Large editorial feed, Trending fashion, Newest creations, Luxury collections, Editor's Picks, Weekly highlights
  const [activeTab, setActiveTab] = useState<'EDITORIAL_FEED' | 'TRENDING' | 'NEWEST' | 'COLLECTIONS' | 'EDITORS_PICKS' | 'WEEKLY_HIGHLIGHTS' | 'COMMUNITY_GENERATOR' | 'INTELLIGENT_FASHION_AI'>('EDITORIAL_FEED');

  // AI Style Generation Sub-Component States
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedResult, setGeneratedResult] = useState<{
    imageUrl: string;
    vibe: string;
    prompt: string;
    description: string;
  } | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [genLiked, setGenLiked] = useState(false);
  const [genBookmarked, setGenBookmarked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickChips = [
    { label: 'Summer', prompt: 'Beige linen resort shirt and pleated linen shorts' },
    { label: 'Streetwear', prompt: 'Heavy drop-shoulder hoodie and structured cargo pants' },
    { label: 'Quiet Luxury', prompt: 'Cashmere cream sweater and tailored wool trousers' },
    { label: 'Office', prompt: 'Structured double-breasted navy blazer with crisp white shirt' }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateStyle = async (overridePrompt?: string) => {
    const queryText = (overridePrompt || promptInput).trim();
    const finalQuery = queryText || 'high-end minimalist outfit';
    
    setIsGenerating(true);
    setErrorMessage(null);
    setHasSaved(false);
    setGenLiked(false);
    setGenBookmarked(false);

    const steps = [
      'Consulting Gemini Fashion AI...',
      'Synthesizing professional style lookbook...',
      'Refining textile folds and stitching textures...',
      'Applying neutral studio backdrop lighting...'
    ];

    let currentStep = 0;
    setGenerationStep(steps[0]);
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setGenerationStep(steps[currentStep]);
      }
    }, 1200);

    try {
      const strictStylePrompt = `${finalQuery}, professional high-fashion studio lookbook photography, solid light grey or dark slate background, clean neutral studio lighting, focus on fabric drape, clothing stitching and material folds, headless mannequin model portrait, elegant fashion focus, clean minimalist backdrop, studio background`;

      let token = '';
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      } else {
        token = 'guest-token';
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/image-generation/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          theme: 'Community Style',
          vibe: strictStylePrompt,
          garments: [],
          gender: 'All-Gender',
          formality: 'High-Fidelity',
          season: 'All-Season',
          setting: 'Studio Backdrop',
          provider: 'Gemini-3.1-Flash-Image',
          hasUploadedUserImage: Boolean(uploadedImage)
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned status ${response.status}`);
      }

      const result = await response.json();

      clearInterval(stepInterval);

      if (result.success && result.imageUrl) {
        setGeneratedResult({
          imageUrl: result.imageUrl,
          vibe: overridePrompt ? overridePrompt : (queryText ? queryText : 'Minimalist Silhouette'),
          prompt: finalQuery,
          description: `A meticulously balanced garment curation focusing on structured drape and texture contrast. Features professional lookbook lighting set against a solid neutral studio backdrop.`
        });
        
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
          detail: '✨ Co-creation complete. Style successfully curated!' 
        }));
      } else {
        throw new Error(result.error || 'Style synthesis timed out.');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || 'Unable to connect to style engine. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToWardrobe = async () => {
    if (!generatedResult || hasSaved || !onAddGarment) return;
    try {
      const queryLower = generatedResult.prompt.toLowerCase();
      let category = 'Casual';
      if (queryLower.includes('blazer') || queryLower.includes('suit') || queryLower.includes('formal') || queryLower.includes('office')) {
        category = 'Formal';
      } else if (queryLower.includes('hoodie') || queryLower.includes('cargo') || queryLower.includes('street')) {
        category = 'Casual';
      } else if (queryLower.includes('jacket') || queryLower.includes('coat') || queryLower.includes('overcoat')) {
        category = 'Outerwear';
      }

      await onAddGarment(
        `${generatedResult.vibe.charAt(0).toUpperCase() + generatedResult.vibe.slice(1)} Piece`,
        generatedResult.description,
        category as any,
        {
          imageUrl: generatedResult.imageUrl,
          primaryColor: 'Studio Gray',
          secondaryColor: 'Charcoal'
        }
      );

      setHasSaved(true);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: '💾 Look added directly to your Closet archive!' 
      }));
    } catch (err) {
      console.error('Failed to commit garment to closet:', err);
    }
  };

  useEffect(() => {
    const handleCheckTarget = () => {
      const target = localStorage.getItem('community_target_tab');
      if (target) {
        setActiveTab(target as any);
        localStorage.removeItem('community_target_tab');
      }
    };
    handleCheckTarget();
    window.addEventListener('community_check_target', handleCheckTarget);
    return () => {
      window.removeEventListener('community_check_target', handleCheckTarget);
    };
  }, []);
  
  // Real Firestore and Fallback Preset Posts State
  const [cloudPosts, setCloudPosts] = useState<CommunityPost[]>([]);
  const [userLooks, setUserLooks] = useState<any[]>([]); // User's own generatedLooks
  const [isLedgerOpen, setIsLedgerOpen] = useState(false); // Studio Ledger Drawer
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null); // Detail View Modal
  const [activeBoardSelectorPost, setActiveBoardSelectorPost] = useState<CommunityPost | null>(null); // Board selector dialog
  
  // Local boards system (stored persistently)
  const [boards, setBoards] = useState<InspirationBoard[]>(() => {
    try {
      const saved = localStorage.getItem('lookvision_inspiration_boards');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'b-1', name: 'Parisian Autumn', postIds: ['p-preset-1', 'p-preset-4'] },
      { id: 'b-2', name: 'Cyber Minimalist', postIds: ['p-preset-2'] },
      { id: 'b-3', name: 'Brutalist Linens', postIds: ['p-preset-3'] }
    ];
  });

  // Local likes/saves trackers to feel completely responsive
  const [localLikes, setLocalLikes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lookvision_local_likes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const [localSaves, setLocalSaves] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lookvision_local_saves');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  // Local views tracker to avoid duplicate incrementing
  const [localViews, setLocalViews] = useState<Record<string, boolean>>({});

  // Board Creation States
  const [showNewBoardInput, setShowNewBoardInput] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  // Share dossier Dialog
  const [shareDossierPost, setShareDossierPost] = useState<CommunityPost | null>(null);

  // Comments Input
  const [commentText, setCommentText] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Cloud Sync state
  const [syncStatus, setSyncStatus] = useState<'cloud' | 'local'>('local');

  // Discovery Intelligence Layer states
  const [selectedCollection, setSelectedCollection] = useState<IntelligentCollectionType>('Luxury');
  const [activeRanking, setActiveRanking] = useState<RankingEngineType>('Trending Today');
  const [rotationSeed, setRotationSeed] = useState(() => Date.now().toString());

  // Publish Form States (when publishing a private generatedLook)
  const [publishingLook, setPublishingLook] = useState<any | null>(null);
  const [pubCaption, setPubCaption] = useState('');
  const [pubVibeTags, setPubVibeTags] = useState('');
  const [pubTaggedGarmentIdx, setPubTaggedGarmentIdx] = useState<number>(-1);
  const [pubSuccess, setPubSuccess] = useState(false);

  // Authenticated user credentials
  const currentUserDisplayName = user?.displayName || auth.currentUser?.displayName || 'Anonymous Designer';
  const currentUserHandle = `@${(user?.displayName || auth.currentUser?.displayName || 'designer').toLowerCase().replace(/\s+/g, '')}`;
  const currentUserAvatar = user?.photoURL || auth.currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop';
  const currentUserUid = user?.uid || auth.currentUser?.uid || 'anonymous-user-id';

  // 1. Live Firestore Synchronization & Local Merging
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const setupSync = async () => {
      try {
        const qComm = query(collection(db, 'communityPosts'), orderBy('createdAt', 'desc'));
        unsubscribe = onSnapshot(qComm, (snapshot) => {
          const posts: CommunityPost[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            posts.push({ id: docSnap.id, ...data } as CommunityPost);
          });
          setCloudPosts(posts);
          setSyncStatus('cloud');
        }, (error) => {
          console.warn("[Community] Switch to local fallback for communityPosts:", error);
          setSyncStatus('local');
        });
      } catch (err) {
        console.warn("[Community] Firestore connection failed:", err);
        setSyncStatus('local');
      }
    };

    setupSync();
    return () => unsubscribe();
  }, []);

  // 2. Fetch User's Private generatedLooks
  const fetchUserGeneratedLooks = async () => {
    if (!db) return;
    try {
      const userId = currentUserUid;
      const looksRef = collection(db, 'generatedLooks');
      // Read user's generated looks
      const q = query(looksRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const looks: any[] = [];
      querySnapshot.forEach((docSnap) => {
        looks.push({ id: docSnap.id, ...docSnap.data() });
      });
      setUserLooks(looks);
    } catch (err) {
      console.warn("[Community] Could not fetch private generatedLooks:", err);
      // Fallback from LocalStorage ledger
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('fashion_looks_registry');
        if (stored) {
          try {
            setUserLooks(JSON.parse(stored));
          } catch(e) {
            setUserLooks([]);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (isLedgerOpen) {
      fetchUserGeneratedLooks();
    }
  }, [isLedgerOpen]);

  // Save boards and likes to LocalStorage when changed
  useEffect(() => {
    localStorage.setItem('lookvision_inspiration_boards', JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    localStorage.setItem('lookvision_local_likes', JSON.stringify(localLikes));
  }, [localLikes]);

  useEffect(() => {
    localStorage.setItem('lookvision_local_saves', JSON.stringify(localSaves));
  }, [localSaves]);

  // Unify cloud and preset looks
  const allPosts = useMemo(() => {
    const merged = [...cloudPosts];
    // Statically seed preset posts to avoid duplicates
    PRESET_MOCK_LOOKS.forEach(preset => {
      if (!merged.some(p => p.id === preset.id)) {
        merged.push(preset);
      }
    });
    // Add dynamically computed fallback blueprints for any posts that lack them
    return merged.map(p => {
      const seed = p.id || p.imageUrl;
      return {
        ...p,
        avatarBlueprint: p.avatarBlueprint || generateDeterministicAvatarBlueprint(seed),
        garmentBlueprint: p.garmentBlueprint || generateDeterministicGarmentBlueprint(seed),
        sceneBlueprint: p.sceneBlueprint || generateDeterministicSceneBlueprint(seed)
      };
    });
  }, [cloudPosts]);

  // Compile user interactions for real-time visual recommendation and personalization
  const userInteractions = useMemo(() => {
    const likedIds = Object.keys(localLikes).filter(id => localLikes[id]);
    const savedIds = Object.keys(localSaves).filter(id => localSaves[id]);
    return InspirationEngine.compileUserInteractions(allPosts, likedIds, savedIds);
  }, [allPosts, localLikes, localSaves]);

  // Dynamically analyze current community trends
  const activeTrendsReport = useMemo(() => {
    return FashionTrendDetectionEngine.detectActiveTrends(allPosts);
  }, [allPosts]);

  // Filter and sort looks depending on selected Discovery Tab and search query
  const filteredFeed = useMemo(() => {
    let list: any[] = [...allPosts];

    // 1. Personalize lists using Inspiration Engine
    list = InspirationEngine.personalizeFeed(list, userInteractions);

    // 2. Search Query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.caption.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.author.handle.toLowerCase().includes(q) ||
        p.vibeTags.some(t => t.toLowerCase().includes(q)) ||
        (p.collectionName && p.collectionName.toLowerCase().includes(q))
      );
    }

    // 3. Tab Selection sorting & filtering using the Automatic Ranking & Intelligent Collections engines
    switch (activeTab) {
      case 'TRENDING':
        list = AutomaticRankingEngine.rank(list, activeRanking);
        break;
      case 'NEWEST':
        list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'COLLECTIONS':
        list = list.filter(p => {
          const cols = IntelligentCollectionsEngine.getCollectionsForPost(p);
          return cols.includes(selectedCollection);
        });
        // Sort by Trending This Month
        list = AutomaticRankingEngine.rank(list, 'Trending This Month');
        break;
      case 'EDITORS_PICKS':
        list = list.filter(p => p.isEditorPick);
        break;
      case 'WEEKLY_HIGHLIGHTS':
        list = list.filter(p => p.isWeeklyHighlight);
        break;
      case 'EDITORIAL_FEED':
      default:
        // Default editorial feed blends all posts, applying rotation
        list = AutomaticRankingEngine.rank(list, 'Trending This Week');
        break;
    }

    // 4. Apply Feed Rotation Engine (except for direct newest timeline or editor picks)
    if (activeTab !== 'NEWEST' && activeTab !== 'EDITORS_PICKS' && activeTab !== 'WEEKLY_HIGHLIGHTS' && !searchQuery.trim()) {
      list = FeedRotationEngine.rotateFeed(list, rotationSeed);
    }

    // 5. Apply Creator Diversity Engine to prevent clustering
    list = CreatorDiversityEngine.enforceCreatorDiversity(list);

    return list as any;
  }, [allPosts, activeTab, searchQuery, userInteractions, selectedCollection, activeRanking, rotationSeed]);

  // Check if a user's generatedLook is currently published to communityPosts
  const publishedLookUrls = useMemo(() => {
    return new Set(cloudPosts.map(p => p.imageUrl));
  }, [cloudPosts]);

  // Publish / Unpublish handler
  const handlePublishToggle = async (look: any) => {
    if (publishedLookUrls.has(look.imageUrl)) {
      // Find the corresponding post in cloudPosts and delete it
      const matchedPost = cloudPosts.find(p => p.imageUrl === look.imageUrl);
      if (matchedPost) {
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Unpublishing look from Community feed...' }));
        try {
          await deleteDoc(doc(db, 'communityPosts', matchedPost.id));
          window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '✓ Look successfully removed from feed.' }));
          setCloudPosts(prev => prev.filter(p => p.id !== matchedPost.id));
        } catch (e) {
          console.error("Failed to delete post:", e);
        }
      }
    } else {
      // Open the Publishing Options form
      setPublishingLook(look);
      setPubCaption(`A pristine AI-designed concept centered around ${look.vibe || 'couture drapes'}.`);
      setPubVibeTags((look.vibe || 'minimalist, couture').toLowerCase());
      setPubTaggedGarmentIdx(-1);
      setPubSuccess(false);
    }
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishingLook) return;

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Publishing AI creation with blueprints...' }));
    
    const tags = pubVibeTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    let taggedGarment = undefined;
    if (pubTaggedGarmentIdx >= 0 && userWardrobe[pubTaggedGarmentIdx]) {
      const g = userWardrobe[pubTaggedGarmentIdx];
      taggedGarment = { title: g.title, price: 0, category: g.category };
    }

    const seed = publishingLook.id || publishingLook.imageUrl;

    const newPostData = {
      lookId: publishingLook.id || `local-${Date.now()}`,
      userId: currentUserUid,
      author: {
        name: currentUserDisplayName,
        handle: currentUserHandle,
        avatar: currentUserAvatar,
        uid: currentUserUid
      },
      caption: pubCaption.trim(),
      imageUrl: publishingLook.imageUrl,
      likes: Math.floor(Math.random() * 200) + 50,
      shares: Math.floor(Math.random() * 40) + 10,
      saves: Math.floor(Math.random() * 100) + 15,
      views: Math.floor(Math.random() * 600) + 150,
      trendingScore: Math.floor(Math.random() * 15) + 84,
      vibeTags: tags.length > 0 ? tags : ['minimalist'],
      taggedGarment,
      comments: [],
      aiScore: publishingLook.aiScore || Math.floor(Math.random() * 10) + 89,
      aiBreakdown: { 
        color: 'Symmetrical Hue Integrity', 
        texture: 'High-Continuity Micro Slubs', 
        seasonal: 'Perfect Proportions Index' 
      },
      avatarBlueprint: generateDeterministicAvatarBlueprint(seed),
      garmentBlueprint: generateDeterministicGarmentBlueprint(seed),
      sceneBlueprint: generateDeterministicSceneBlueprint(seed),
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'communityPosts'), newPostData);
      setPubSuccess(true);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '✓ Concept published with full blueprints!' }));
      setTimeout(() => {
        setPublishingLook(null);
        setPubSuccess(false);
        fetchUserGeneratedLooks(); // Reload ledger state
      }, 1000);
    } catch (err: any) {
      console.error("Could not write post to Firestore:", err);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Error writing to cloud: ${err.message}` }));
    }
  };

  // Like look action
  const handleLikePost = async (post: CommunityPost) => {
    const isLiked = !!localLikes[post.id];
    const updatedLikes = { ...localLikes, [post.id]: !isLiked };
    setLocalLikes(updatedLikes);

    const increment = isLiked ? -1 : 1;
    // Real Firestore Sync if cloud item
    if (syncStatus === 'cloud' && !post.id.startsWith('p-preset')) {
      try {
        await updateDoc(doc(db, 'communityPosts', post.id), {
          likes: Math.max(0, (post.likes || 0) + increment)
        });
      } catch (e) {
        console.warn("Failed to update likes in Firestore:", e);
      }
    } else {
      // Dynamic preset like updates
      post.likes = Math.max(0, post.likes + increment);
    }
  };

  // View look action
  const handleViewPost = async (post: CommunityPost) => {
    if (localViews[post.id]) return;
    setLocalViews(prev => ({ ...prev, [post.id]: true }));

    if (syncStatus === 'cloud' && !post.id.startsWith('p-preset')) {
      try {
        await updateDoc(doc(db, 'communityPosts', post.id), {
          views: (post.views || 0) + 1
        });
      } catch (e) {}
    } else {
      post.views = (post.views || 0) + 1;
    }
  };

  // Open detail card
  const handleOpenDetail = (post: CommunityPost) => {
    setSelectedPost(post);
    handleViewPost(post);
  };

  // Add Comment Flow
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost) return;

    const newComment = {
      author: currentUserDisplayName,
      handle: currentUserHandle,
      avatar: currentUserAvatar,
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedComments = [...(selectedPost.comments || []), newComment];
    selectedPost.comments = updatedComments; // Snappy instant local feedback
    setCommentText('');

    if (syncStatus === 'cloud' && !selectedPost.id.startsWith('p-preset')) {
      try {
        await updateDoc(doc(db, 'communityPosts', selectedPost.id), {
          comments: updatedComments
        });
      } catch (e) {
        console.error("Failed to post comment to cloud:", e);
      }
    }
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Constructive feedback shared!' }));
  };

  // Save to Board Flow
  const handleSaveToBoard = (boardId: string) => {
    if (!activeBoardSelectorPost) return;

    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        if (b.postIds.includes(activeBoardSelectorPost.id)) {
          window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Look already saved in this board!' }));
          return b;
        }
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `✓ Saved to ${b.name}!` }));
        return { ...b, postIds: [...b.postIds, activeBoardSelectorPost.id] };
      }
      return b;
    }));

    setLocalSaves(prev => ({ ...prev, [activeBoardSelectorPost.id]: true }));
    setActiveBoardSelectorPost(null);
  };

  const handleCreateBoardAndSave = () => {
    if (!newBoardName.trim() || !activeBoardSelectorPost) return;
    const newBoard: InspirationBoard = {
      id: `b-custom-${Date.now()}`,
      name: newBoardName.trim(),
      postIds: [activeBoardSelectorPost.id]
    };
    setBoards(prev => [...prev, newBoard]);
    setLocalSaves(prev => ({ ...prev, [activeBoardSelectorPost.id]: true }));
    setNewBoardName('');
    setShowNewBoardInput(false);
    setActiveBoardSelectorPost(null);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `✓ Created board & saved look!` }));
  };

  // Copy dossier flow
  const handleCopyDossierLink = (post: CommunityPost) => {
    const dossierText = `LOOKVISION DIGITAL DOSSIER HASH: #${post.id}
Creator: ${post.author.name} (${post.author.handle})
Style Theme: ${post.vibeTags.join(', ').toUpperCase()}
Coherence Index: ${post.aiScore}%

AVATAR SPECS:
- Gender/Age: ${post.avatarBlueprint?.gender}, ${post.avatarBlueprint?.age}
- Face/Hair: ${post.avatarBlueprint?.faceShape}, ${post.avatarBlueprint?.hairStyle} (${post.avatarBlueprint?.hairColor})
- Pose: ${post.avatarBlueprint?.pose}

GARMENT COORDS:
- Silhouette: ${post.garmentBlueprint?.silhouette}
- Fabric/Material: ${post.garmentBlueprint?.fabric} (${post.garmentBlueprint?.material})
- Collar/Sleeves: ${post.garmentBlueprint?.collar}, ${post.garmentBlueprint?.sleeves}
- Shoes: ${post.garmentBlueprint?.shoes}

SCENE COORDS:
- Location: ${post.sceneBlueprint?.location}
- Lighting: ${post.sceneBlueprint?.lighting}
- Camera: ${post.sceneBlueprint?.camera}`;

    navigator.clipboard.writeText(dossierText);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '✓ Custom Dossier coordinates copied to clipboard!' }));
    setShareDossierPost(null);
  };

  // Duplication look onto user's closet shelves
  const handleImportToCloset = async (post: CommunityPost) => {
    if (!onAddGarment) return;
    try {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Acquiring layout blueprint...' }));
      const desc = `${post.caption}\n\nDesign Blueprint:\n- Silhouette: ${post.garmentBlueprint?.silhouette}\n- Fabric: ${post.garmentBlueprint?.fabric}\n- Details: ${post.garmentBlueprint?.collar}, ${post.garmentBlueprint?.sleeves}`;
      
      await onAddGarment(
        post.vibeTags[0]?.toUpperCase() + ' Design Layout' || 'Imported Design Layout',
        desc,
        'Casual',
        { imageUrl: post.imageUrl }
      );
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '✓ Blueprint loaded onto your shelves!' }));
    } catch (e) {
      console.error("Failed to import blueprint:", e);
    }
  };

  // Helper to format engagement counts nicely (e.g. 1200000 -> 1.2M)
  const formatCount = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  return (
    <div className="w-full min-h-screen bg-[#05050a] text-zinc-100 p-4 sm:p-6 lg:p-10 select-none font-sans relative overflow-x-hidden">
      
      {/* 1. ELEGANT LUXURY HEADER */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 text-left">
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-[0.3em] text-violet-400 uppercase block font-semibold">
            LUXURY COGNITIVE ENVIRONMENT
          </span>
          <h1 className="font-serif font-light tracking-tight text-4xl text-white flex items-center gap-3">
            <Users className="w-9 h-9 text-violet-400 font-light" /> Style Community
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl font-light">
            An elite social gallery for luxury AI fashion discovery. Explore dynamic design blueprints, inspect facial proportions, and import coordinate coordinates directly onto your shelves.
          </p>
        </div>

        {/* Action button to open private Studio Ledger */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-mono text-[10.5px] uppercase tracking-wider rounded-xl flex items-center gap-2.5 shadow-lg shadow-emerald-600/15 transition-all duration-300 transform active:scale-95 font-bold cursor-pointer border border-emerald-400/20"
          >
            <Sparkles className="w-4 h-4 text-white/90 animate-pulse" />
            <span>Generate Style</span>
          </button>

          <button
            onClick={() => setIsLedgerOpen(true)}
            className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-mono text-[10.5px] uppercase tracking-wider rounded-xl flex items-center gap-2.5 transition-all duration-300 transform active:scale-95 font-bold cursor-pointer"
          >
            <Layers className="w-4 h-4 text-white/90" />
            <span>My Studio Ledger</span>
          </button>
        </div>
      </header>

      {/* 2. DISCOVERY NAVIGATION RIBBON & SEARCH */}
      <section className="max-w-7xl mx-auto mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-white/[0.03] pb-6 w-full">
        {/* All Tab Buttons Wrap Cleanly so ALL Buttons Are Fully Visible */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-1 w-full">
          {[
            { id: 'EDITORIAL_FEED', label: 'Editorial Feed', icon: Compass },
            { id: 'TRENDING', label: 'Trending Fashion', icon: Flame },
            { id: 'NEWEST', label: 'Newest Creations', icon: Star },
            { id: 'COLLECTIONS', label: 'Luxury Collections', icon: Layers },
            { id: 'EDITORS_PICKS', label: "Editor's Picks", icon: Award },
            { id: 'WEEKLY_HIGHLIGHTS', label: 'Weekly Highlights', icon: Star },
            { id: 'COMMUNITY_GENERATOR', label: 'Body Style Mapping', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-[10.5px] font-mono uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-violet-500/15 text-violet-200 border border-violet-500/30 font-bold shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-violet-500/20' 
                    : 'text-zinc-300 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400 animate-pulse' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Rotate Feed Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
          <button
            onClick={() => {
              setRotationSeed(Date.now().toString());
              window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Seeded Feed Rotation Engine triggered!' }));
            }}
            className="px-3.5 py-2.5 bg-[#07070c] border border-white/10 hover:border-violet-500/30 rounded-xl text-zinc-300 hover:text-violet-200 transition-all flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-wider cursor-pointer font-bold"
            title="Rotate Feed Order Deterministically"
          >
            <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
            <span>Rotate Feed</span>
          </button>

          <div className="relative w-full lg:w-72 shrink-0">
            <input
              type="text"
              placeholder="Search campaign, tag, designer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#07070c] border border-white/10 hover:border-white/20 focus:border-violet-500/40 px-4 py-2.5 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none rounded-xl transition-all duration-300 font-mono"
            />
            <div className="absolute left-3.5 top-3 text-zinc-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2B. INTELLIGENT COLLECTIONS SELECTOR DIR */}
      {activeTab === 'COLLECTIONS' && (
        <section className="max-w-7xl mx-auto mb-8 text-left animate-fade-in w-full">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-3 font-semibold">
            Intelligent Collection Directory ({selectedCollection}) - All Categories
          </span>
          <div className="flex flex-wrap gap-2 w-full">
            {[
              'Luxury', 'Streetwear', 'Editorial', 'Minimal', 'Avant Garde', 
              'Wedding', 'Formal', 'Winter', 'Summer', 'Autumn', 'Spring', 
              'Business', 'Sportswear', 'Traditional', 'Cultural', 'Runway', 
              'Photography', 'Portrait', 'Fashion Campaign', 'Magazine Cover', 
              'Fashion Week', 'Designer Concepts', 'Experimental'
            ].map((col) => {
              const isSelected = selectedCollection === col;
              const count = allPosts.filter(p => IntelligentCollectionsEngine.getCollectionsForPost(p).includes(col as any)).length;
              return (
                <button
                  key={col}
                  onClick={() => setSelectedCollection(col as any)}
                  className={`px-3.5 py-2 text-[10px] font-mono rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30 font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20' 
                      : 'text-zinc-300 hover:text-white bg-[#07070c] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  {col} <span className="text-[8px] opacity-70 ml-1">({count})</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 2C. TRENDING RANKING SELECTORS & LIVE TREND DETECTION */}
      {activeTab === 'TRENDING' && (
        <section className="max-w-7xl mx-auto mb-8 space-y-6 text-left animate-fade-in w-full">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-3 font-semibold">
              Select Ranking Engine - All Engines
            </span>
            <div className="flex flex-wrap gap-2 w-full">
              {[
                'Trending Today', 'Trending This Week', 'Trending This Month', 
                'Most Loved', 'Most Viewed', 'Most Saved', 'Most Shared', 
                'Fastest Growing', 'Hidden Gems', 'Fresh Discoveries', 'Editor\'s Choice'
              ].map((engine) => {
                const isSelected = activeRanking === engine;
                return (
                  <button
                    key={engine}
                    onClick={() => setActiveRanking(engine as any)}
                    className={`px-3.5 py-2 text-[10px] font-mono rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-violet-500/15 text-violet-200 border-violet-500/30 font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-violet-500/20' 
                        : 'text-zinc-300 hover:text-white bg-[#07070c] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    {engine}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Trend Detection Dashboard */}
          <div className="p-5 bg-[#07070c] border border-white/5 rounded-2xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Emerging Styles</span>
              <div className="space-y-1">
                {activeTrendsReport.emergingStyles.slice(0, 3).map(x => (
                  <span key={x.tag} className="block text-[10px] font-mono text-violet-300 truncate font-semibold">
                    #{x.tag} <span className="text-[8px] text-zinc-500 font-normal">({x.score}%)</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Popular Colors</span>
              <div className="space-y-1">
                {activeTrendsReport.popularColors.slice(0, 3).map(x => (
                  <span key={x.color} className="block text-[10px] font-mono text-zinc-300 truncate font-semibold">
                    {x.color} <span className="text-[8px] text-zinc-500 font-normal">({x.percentage}%)</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Silhouettes</span>
              <div className="space-y-1">
                {activeTrendsReport.popularGarments.slice(0, 3).map(x => (
                  <span key={x.item} className="block text-[10px] font-mono text-zinc-300 truncate font-semibold">
                    {x.item} <span className="text-[8px] text-zinc-500 font-normal">({x.count})</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Poses</span>
              <div className="space-y-1">
                {activeTrendsReport.popularPoses.slice(0, 3).map(x => (
                  <span key={x.pose} className="block text-[10px] font-mono text-zinc-300 truncate font-semibold">
                    {x.pose} <span className="text-[8px] text-zinc-500 font-normal">({x.count})</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Fabrics</span>
              <div className="space-y-1">
                {activeTrendsReport.popularFabrics.slice(0, 3).map(x => (
                  <span key={x.fabric} className="block text-[10px] font-mono text-zinc-300 truncate font-semibold">
                    {x.fabric} <span className="text-[8px] text-zinc-500 font-normal">({x.count})</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Lighting</span>
              <div className="space-y-1">
                {activeTrendsReport.popularLighting.slice(0, 3).map(x => (
                  <span key={x.lighting} className="block text-[10px] font-mono text-zinc-300 truncate font-semibold">
                    {x.lighting} <span className="text-[8px] text-zinc-500 font-normal">({x.count})</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Settings</span>
              <div className="space-y-1">
                {activeTrendsReport.popularBackgrounds.slice(0, 3).map(x => (
                  <span key={x.location} className="block text-[10px] font-mono text-zinc-300 truncate font-semibold">
                    {x.location} <span className="text-[8px] text-zinc-500 font-normal">({x.count})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. HERO SEGMENT (WEEKLY EDITORIAL POSTER) */}
      {activeTab === 'EDITORIAL_FEED' && !searchQuery && allPosts.find(p => p.isWeeklyHighlight) && (
        <section className="max-w-7xl mx-auto mb-10 text-left">
          {(() => {
            const spotlight = allPosts.find(p => p.isWeeklyHighlight) || allPosts[0];
            return (
              <div 
                onClick={() => handleOpenDetail(spotlight)}
                className="group relative w-full h-[450px] rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 cursor-pointer transition-all duration-500 shadow-2xl bg-[#07070c]"
              >
                {/* Visual Backdrop Overlay with Soft Film Grain */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10 duration-500 group-hover:via-black/50" />
                
                <img 
                  src={spotlight.imageUrl} 
                  alt="Spotlight campaign" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />

                {/* Content Card Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 z-15 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-md text-[9px] font-mono font-bold text-violet-300 uppercase tracking-widest inline-block animate-pulse">
                      WEEKLY EDITORIAL SELECTION
                    </span>
                    <h2 className="font-serif font-light text-2xl sm:text-4xl leading-tight text-white group-hover:text-violet-100 transition-colors">
                      {spotlight.caption.split('.')[0]}
                    </h2>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light font-sans">
                      {spotlight.caption}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {spotlight.vibeTags.map(tag => (
                        <span key={tag} className="text-[9px] font-mono text-zinc-400 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 border border-white/5 rounded-2xl">
                      <img src={spotlight.author.avatar} alt={spotlight.author.name} className="w-6 h-6 rounded-full object-cover border border-white/10" />
                      <div className="text-left">
                        <span className="block text-[11px] font-bold text-white leading-tight">{spotlight.author.name}</span>
                        <span className="block text-[9px] font-mono text-zinc-500 leading-none">{spotlight.author.handle}</span>
                      </div>
                    </div>
                    
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 hover:text-white transition-colors">
                      Inspect Concept Blueprints <ArrowUpRight className="w-3.5 h-3.5 text-violet-400" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* 4. MAIN DISCOVERY FEED GRID (MASONRY LAYOUT - IMAGES ARE THE HERO) */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'COMMUNITY_GENERATOR' ? (
          <CommunityGenerator
            user={user}
            userWardrobe={userWardrobe}
            onAddGarment={onAddGarment}
            onNavigateToTab={onNavigateToTab}
          />
        ) : filteredFeed.length === 0 ? (
          <div className="p-16 border border-dashed border-white/5 rounded-3xl text-center bg-[#07070c]/20 select-none max-w-lg mx-auto my-12">
            <Compass className="w-10 h-10 text-zinc-600 mx-auto mb-4 animate-pulse" />
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">No campaign coordinates found</p>
            <p className="text-[11px] text-zinc-500 mt-2 font-serif italic">Try searching with a different term or check your private Studio Ledger to publish a new AI-generated lookbook design.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 select-none">
            {filteredFeed.map((post) => {
              const liked = !!localLikes[post.id];
              const saved = !!localSaves[post.id];
              const displaysLikes = post.likes + (liked ? (PRESET_MOCK_LOOKS.some(p => p.id === post.id) ? 0 : 0) : 0);

              return (
                <div
                  key={post.id}
                  className="break-inside-avoid bg-[#07070c] border border-white/5 rounded-2xl overflow-hidden relative group transition-all duration-500 hover:border-violet-500/20 hover:scale-[1.015] shadow-xl"
                  onClick={() => handleOpenDetail(post)}
                >
                  {/* Subtle printed film grain overlay */}
                  <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                  
                  {/* Image container - hero of the card */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-950">
                    <img
                      src={post.imageUrl}
                      alt="Campaign piece"
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    
                    {/* Glowing Accent Borders */}
                    <div className="absolute inset-0 border border-white/[0.02] pointer-events-none" />

                    {/* Dark gradient to cover details at bottom on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-100 group-hover:opacity-100 transition-all duration-300 z-5" />

                    {/* Editor's pick badge if active */}
                    {post.isEditorPick && (
                      <div className="absolute top-4 left-4 z-15">
                        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[8px] uppercase tracking-widest rounded-lg flex items-center gap-1 font-bold shadow-lg shadow-black/45">
                          <Award className="w-3 h-3 text-amber-400 fill-current" /> EDITOR'S PICK
                        </span>
                      </div>
                    )}

                    {/* Coherence rating badge */}
                    <div className="absolute top-4 right-4 z-15">
                      <div className="bg-black/75 border border-white/5 px-2.5 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-violet-300">{post.aiScore}%</span>
                      </div>
                    </div>

                    {/* Bottom visual overlay (Metadata revealed seamlessly) */}
                    <div className="absolute inset-x-0 bottom-0 p-5 z-10 text-left space-y-3">
                      
                      {/* Creator badge */}
                      <div className="flex items-center gap-2.5 bg-black/45 backdrop-blur-md p-1.5 pr-3 rounded-2xl w-fit border border-white/5">
                        <img src={post.author.avatar} alt={post.author.name} className="w-5.5 h-5.5 rounded-full object-cover border border-white/10" />
                        <div className="text-left">
                          <span className="block text-[10px] font-bold text-white leading-tight">{post.author.name}</span>
                          <span className="block text-[8px] font-mono text-zinc-500 leading-none">{post.author.handle}</span>
                        </div>
                      </div>

                      {/* Campaign summary */}
                      <p className="text-[11.5px] text-zinc-200 line-clamp-2 leading-relaxed font-light">
                        {post.caption}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {post.vibeTags.slice(0, 3).map(t => (
                          <span key={t} className="text-[8px] font-mono text-violet-300 bg-violet-500/10 border border-violet-500/15 px-2 py-0.5 rounded uppercase">
                            #{t}
                          </span>
                        ))}
                      </div>

                      {/* Engagement Counters Grid (Standardized, visual, clean layout) */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-3.5 select-none z-10 relative flex-wrap sm:flex-nowrap gap-2">
                        <div className="flex items-center gap-2.5 sm:gap-3.5">
                          {/* Like Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikePost(post);
                            }}
                            className={`flex items-center gap-1.5 text-[10.5px] font-mono transition-colors cursor-pointer ${
                              liked ? 'text-rose-400 font-bold' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500 animate-bounce' : 'text-zinc-400'}`} />
                            <span>{formatCount(displaysLikes)}</span>
                          </button>

                          {/* Comment trigger */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(post);
                            }}
                            className="flex items-center gap-1.5 text-[10.5px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4 text-zinc-400" />
                            <span>{formatCount(post.comments?.length || 0)}</span>
                          </button>

                          {/* Share Trigger */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareDossierPost(post);
                            }}
                            className="flex items-center gap-1.5 text-[10.5px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Share digital coordinate dossier"
                          >
                            <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{formatCount(post.shares)}</span>
                          </button>
                        </div>

                        {/* Save Trigger */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveBoardSelectorPost(post);
                            }}
                            className={`transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5 ${
                              saved ? 'text-violet-400' : 'text-zinc-400 hover:text-white'
                            }`}
                            title="Save to Inspiration Board"
                          >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-violet-400 text-violet-400' : 'text-zinc-400'}`} />
                          </button>

                          <div className="flex items-center gap-1 text-[9.5px] font-mono text-zinc-500">
                            <Eye className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{formatCount(post.views)}</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. MY STUDIO LEDGER DRAWER / PUBLISHING PORTAL */}
      <AnimatePresence>
        {isLedgerOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 flex justify-end">
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 22, stiffness: 180 }}
              className="w-full max-w-xl bg-[#07070c] border-l border-white/5 h-full flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between text-left">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">PERSONAL PRODUCTION BANK</span>
                  <h3 className="font-serif text-lg text-white">My Studio Ledger</h3>
                </div>
                <button
                  onClick={() => {
                    setIsLedgerOpen(false);
                    setPublishingLook(null);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scroll Container */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                {publishingLook ? (
                  /* Look Publishing Detail Options Form */
                  <form onSubmit={handlePublishSubmit} className="space-y-5 text-left animate-fade-in">
                    <button
                      type="button"
                      onClick={() => setPublishingLook(null)}
                      className="text-[10px] font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1.5 uppercase tracking-wider mb-2 cursor-pointer"
                    >
                      ← Back to ledger listings
                    </button>

                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex gap-4 items-center">
                      <img src={publishingLook.imageUrl} className="w-16 h-20 object-cover rounded-lg border border-white/10" alt="" />
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Selected Studio Concept</span>
                        <h4 className="text-sm font-serif font-bold text-white mt-1">{publishingLook.vibe || 'Sartorial AI Concept'}</h4>
                        <span className="text-[9px] font-mono text-zinc-400 block mt-0.5 line-clamp-1">{publishingLook.prompt}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block font-semibold">Share Campaign Caption</label>
                      <textarea
                        required
                        placeholder="Write a storytelling description highlighting silhouette structures, fabric continuities, color accents..."
                        value={pubCaption}
                        onChange={(e) => setPubCaption(e.target.value)}
                        rows={4}
                        className="w-full bg-[#0c0c16] border border-white/5 focus:border-violet-500/20 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none rounded-xl transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block font-semibold">Vibe Hashtags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="minimalist, milan, alpaca, campaign"
                        value={pubVibeTags}
                        onChange={(e) => setPubVibeTags(e.target.value)}
                        className="w-full bg-[#0c0c16] border border-white/5 focus:border-violet-500/20 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none rounded-xl transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block font-semibold">Tag Wardrobe Garment (Optional)</label>
                      <select
                        value={pubTaggedGarmentIdx}
                        onChange={(e) => setPubTaggedGarmentIdx(parseInt(e.target.value))}
                        className="w-full bg-[#0c0c16] border border-white/5 focus:border-violet-500/20 px-4 py-3 text-xs text-white focus:outline-none rounded-xl font-mono"
                      >
                        <option value="-1">-- No garment tag selected --</option>
                        {userWardrobe.map((item, idx) => (
                          <option key={item.id} value={idx}>{item.title} ({item.category})</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-xs uppercase tracking-widest rounded-xl font-bold transition-all duration-300 transform active:scale-95 shadow-lg shadow-violet-600/15 cursor-pointer mt-4"
                    >
                      Publish Concept to Community Feed
                    </button>

                    {pubSuccess && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">✓ Published successfully to Feed!</span>
                      </div>
                    )}
                  </form>
                ) : (
                  /* Ledger List of private generated looks */
                  <div className="space-y-6">
                    <p className="text-xs text-zinc-400 leading-relaxed font-light text-left">
                      Below is your private archive of designs generated in your Studio workspace. Toggle publishing on any look to expose it with its automatic AI-generated blueprints to the global Discovery feed.
                    </p>

                    {userLooks.length === 0 ? (
                      <div className="p-12 border border-dashed border-white/5 rounded-2xl text-center bg-white/[0.01]">
                        <ImageIcon className="w-8 h-8 text-zinc-600 mx-auto mb-3 animate-pulse" />
                        <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">No generated looks found</p>
                        <p className="text-[11px] text-zinc-500 mt-1">Visit the AI Creations studio to design your first premium campaign lookbook.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {userLooks.map((look) => {
                          const isPublished = publishedLookUrls.has(look.imageUrl);
                          return (
                            <div key={look.id} className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col space-y-3 justify-between hover:border-white/10 transition-colors">
                              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-zinc-950 relative border border-white/5">
                                <img src={look.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 border border-white/5 rounded-lg backdrop-blur-md">
                                  <span className="text-[8px] font-mono text-white/50">{look.vibe || 'Studio'}</span>
                                </div>
                              </div>

                              <div className="text-left space-y-1">
                                <span className="text-[10px] font-bold text-zinc-300 block truncate">{look.vibe || 'Sartorial Concept'}</span>
                                <span className="text-[9px] font-mono text-zinc-500 block truncate leading-none">{look.prompt}</span>
                              </div>

                              <button
                                onClick={() => handlePublishToggle(look)}
                                className={`w-full py-2 rounded-xl text-[9px] font-mono uppercase tracking-widest font-bold transition-all transform active:scale-95 cursor-pointer border ${
                                  isPublished 
                                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20' 
                                    : 'bg-white/5 hover:bg-white/10 text-white border-white/5'
                                }`}
                              >
                                {isPublished ? 'Unpublish Look' : 'Publish to Feed'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. GLORIOUS DETAILED BLUEPRINT DRAWER */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-text">
            
            {/* Full Screen Close button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-6xl h-full max-h-[85vh] bg-[#07070c] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            >
              {/* Left Half: Art Presentation (Images are the Hero) */}
              <div className="md:w-1/2 h-1/2 md:h-full bg-zinc-950 relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5 group">
                {/* Micro Film grain overlay for textured photo realism */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                
                <img 
                  src={selectedPost.imageUrl} 
                  alt="Presentation view" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]" 
                  referrerPolicy="no-referrer"
                />

                {/* Sub-photo visual lens indicator */}
                <div className="absolute top-4 left-4 z-20 bg-black/75 px-3 py-1.5 border border-white/5 rounded-xl backdrop-blur-md">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">CAMPAIGN PREVIEW</span>
                  <span className="text-[10px] font-mono text-white font-bold">{selectedPost.vibeTags[0]?.toUpperCase()}</span>
                </div>
              </div>

              {/* Right Half: Design Intelligence & Information */}
              <div className="md:w-1/2 h-1/2 md:h-full flex flex-col justify-between overflow-hidden">
                {/* Scroll Container */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6 text-left">
                  
                  {/* Creator Credits & Coherence metrics */}
                  <div className="flex justify-between items-start gap-4 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <img src={selectedPost.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{selectedPost.author.name}</h4>
                        <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">{selectedPost.author.handle}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Sparkles className="w-4 h-4 text-violet-400 animate-spin" />
                        <span className="text-xs font-mono font-bold text-violet-300">Coherence: {selectedPost.aiScore}%</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block mt-1 leading-none">Diagnostic index</span>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">SARTORIAL FOCUS STATEMENT</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">{selectedPost.caption}</p>
                  </div>

                  {/* 1. INTERACTION OVERVIEW ROW */}
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between font-mono text-[10px] text-zinc-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> {formatCount(selectedPost.likes)}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-zinc-400" /> {formatCount(selectedPost.comments?.length || 0)}</span>
                      <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-zinc-400" /> {formatCount(selectedPost.shares)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5 text-violet-400" /> {formatCount(selectedPost.saves)}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-zinc-500" /> {formatCount(selectedPost.views)}</span>
                      <span className="flex items-center gap-1 text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded"><Flame className="w-3 h-3 fill-current" /> {selectedPost.trendingScore}</span>
                    </div>
                  </div>

                  {/* 2. AVATAR DESIGN BLUEPRINT */}
                  <div className="space-y-3 bg-[#0c0c16]/30 p-4 border border-white/5 rounded-2xl">
                    <h5 className="text-[10px] font-mono text-violet-400 uppercase tracking-widest block border-b border-white/5 pb-1.5 font-bold">
                      Avatar Identity Coordinates
                    </h5>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-mono">
                      <div className="flex justify-between"><span className="text-zinc-500">Gender / Age:</span> <span className="text-zinc-300">{selectedPost.avatarBlueprint?.gender} / {selectedPost.avatarBlueprint?.age}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Face Shape:</span> <span className="text-zinc-300">{selectedPost.avatarBlueprint?.faceShape}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Hair Style:</span> <span className="text-zinc-300">{selectedPost.avatarBlueprint?.hairStyle}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Hair Color:</span> <span className="text-zinc-300">{selectedPost.avatarBlueprint?.hairColor}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Skin Tone:</span> <span className="text-zinc-300">{selectedPost.avatarBlueprint?.skinTone}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Proportions:</span> <span className="text-zinc-300">{selectedPost.avatarBlueprint?.bodyProportions} ({selectedPost.avatarBlueprint?.height})</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Model Pose:</span> <span className="text-zinc-300 truncate max-w-[120px]">{selectedPost.avatarBlueprint?.pose}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Expression:</span> <span className="text-zinc-300 truncate max-w-[120px]">{selectedPost.avatarBlueprint?.expression}</span></div>
                    </div>
                  </div>

                  {/* 3. GARMENT BLUEPRINT SPECIFICATIONS */}
                  <div className="space-y-3 bg-[#0c0c16]/30 p-4 border border-white/5 rounded-2xl">
                    <h5 className="text-[10px] font-mono text-violet-400 uppercase tracking-widest block border-b border-white/5 pb-1.5 font-bold">
                      Garment Specifications
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-mono">
                      <div className="flex justify-between"><span className="text-zinc-500">Silhouette:</span> <span className="text-zinc-300 truncate max-w-[150px]">{selectedPost.garmentBlueprint?.silhouette}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Fabric Type:</span> <span className="text-zinc-300 truncate max-w-[150px]">{selectedPost.garmentBlueprint?.fabric}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Sleeves / Collar:</span> <span className="text-zinc-300 truncate max-w-[150px]">{selectedPost.garmentBlueprint?.sleeves} / {selectedPost.garmentBlueprint?.collar}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Material Composition:</span> <span className="text-zinc-300 truncate max-w-[150px]">{selectedPost.garmentBlueprint?.material}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Stitching Standard:</span> <span className="text-zinc-300 truncate max-w-[150px]">{selectedPost.garmentBlueprint?.stitching}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Fabric Folds:</span> <span className="text-zinc-300 truncate max-w-[150px]">{selectedPost.garmentBlueprint?.folds}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Texturing Feel:</span> <span className="text-zinc-300 truncate max-w-[150px]">{selectedPost.garmentBlueprint?.texture}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Footwear Style:</span> <span className="text-zinc-300 truncate max-w-[150px]">{selectedPost.garmentBlueprint?.shoes}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Accessories:</span> <span className="text-zinc-300 truncate max-w-[150px]">{selectedPost.garmentBlueprint?.accessories}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Jewelry:</span> <span className="text-zinc-300 truncate max-w-[150px]">{selectedPost.garmentBlueprint?.jewelry}</span></div>
                    </div>
                  </div>

                  {/* 4. SCENE COORDINATES */}
                  <div className="space-y-3 bg-[#0c0c16]/30 p-4 border border-white/5 rounded-2xl">
                    <h5 className="text-[10px] font-mono text-violet-400 uppercase tracking-widest block border-b border-white/5 pb-1.5 font-bold">
                      Scene Coordinates
                    </h5>
                    <div className="space-y-2 text-[11px] font-mono">
                      <div className="flex justify-between"><span className="text-zinc-500">Location Setting:</span> <span className="text-zinc-300">{selectedPost.sceneBlueprint?.location}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Lighting Matrix:</span> <span className="text-zinc-300">{selectedPost.sceneBlueprint?.lighting}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Capture System:</span> <span className="text-zinc-300">{selectedPost.sceneBlueprint?.camera}</span></div>
                    </div>
                  </div>

                  {/* 5. USER ENGAGEMENT ACTION PANEL */}
                  <div className="grid grid-cols-2 gap-3.5 pt-2">
                    <button
                      onClick={() => handleImportToCloset(selectedPost)}
                      className="py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[10.5px] uppercase tracking-widest rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer shadow-lg shadow-violet-600/10"
                    >
                      <Tag className="w-4 h-4 text-white" />
                      Acquire Blueprint Layout
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPost(null);
                        setShareDossierPost(selectedPost);
                      }}
                      className="py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/5 hover:border-white/15 font-mono text-[10.5px] uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-zinc-400" />
                      Get Share Dossier
                    </button>
                  </div>

                  {/* FASHION COGNITIVE SIMILARITY ENGINE ("YOU MAY ALSO LIKE") */}
                  {(() => {
                    const recommendations = VisualRecommendationEngine.getRecommendations(selectedPost, allPosts, 3);
                    if (recommendations.length === 0) return null;
                    return (
                      <div className="space-y-4 pt-4 border-t border-white/5 text-left">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest block font-bold">
                              Cognitive Similarity Matching
                            </span>
                            <span className="text-[9px] font-mono text-zinc-500 block">
                              7-dimensional visual & structural alignment
                            </span>
                          </div>
                          <span className="text-[8px] font-mono text-zinc-400 border border-white/5 px-2 py-0.5 rounded-md uppercase">
                            Visual recommendation engine
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {recommendations.map(({ post, similarity }) => {
                            return (
                              <div
                                key={post.id}
                                onClick={() => {
                                  setSelectedPost(post);
                                  window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Pivot design focused: ${similarity.overallScore}% matched.` }));
                                }}
                                className="group/rec bg-[#0c0c16]/30 border border-white/5 hover:border-violet-500/20 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 transform active:scale-98 flex sm:flex-col gap-3 relative overflow-hidden"
                              >
                                <div className="w-16 h-16 sm:w-full sm:h-28 rounded-xl overflow-hidden shrink-0 relative bg-zinc-900 border border-white/5">
                                  <img
                                    src={post.imageUrl}
                                    alt="Recommendation"
                                    className="w-full h-full object-cover group-hover/rec:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute top-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-emerald-400 font-bold border border-white/5">
                                    {similarity.overallScore}% Match
                                  </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-between text-left space-y-1">
                                  <div>
                                    <span className="block text-[10px] font-bold text-zinc-200 truncate group-hover/rec:text-violet-300 transition-colors">
                                      {post.caption.split('.')[0]}
                                    </span>
                                    <span className="block text-[9px] font-mono text-zinc-500">
                                      {post.author.name}
                                    </span>
                                  </div>

                                  <div className="pt-1.5 border-t border-white/[0.03] space-y-0.5 text-[8px] font-mono text-zinc-500 group-hover/rec:text-zinc-400 transition-all">
                                    <div className="flex justify-between">
                                      <span>Fashion:</span> 
                                      <span className="text-zinc-400">{similarity.fashionSimilarity}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Pose:</span> 
                                      <span className="text-zinc-400">{similarity.poseSimilarity}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Fabric:</span> 
                                      <span className="text-zinc-400">{similarity.fabricSimilarity}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Color:</span> 
                                      <span className="text-zinc-400">{similarity.colorSimilarity}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Style:</span> 
                                      <span className="text-zinc-400">{similarity.styleSimilarity}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Lighting:</span> 
                                      <span className="text-zinc-400">{similarity.lightingSimilarity}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Setting:</span> 
                                      <span className="text-zinc-400">{similarity.compositionSimilarity}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 6. CONVERSATIONAL FEEDBACK COMMENTS STREAM */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h5 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Conversational feedback</h5>
                    
                    {/* Add Comment input */}
                    <form onSubmit={handlePostComment} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Share constructive design feedback..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-white/[0.01] border border-white/5 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/15 focus:bg-white/[0.02] rounded-xl transition-all font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Comment Listings */}
                    {(!selectedPost.comments || selectedPost.comments.length === 0) ? (
                      <p className="text-[10.5px] text-zinc-500 italic text-center py-4 select-none">No feedback compiled yet. Share the first constructive critique.</p>
                    ) : (
                      <div className="space-y-3 max-h-56 overflow-y-auto no-scrollbar pr-1 select-text">
                        {selectedPost.comments.map((comm, cIdx) => (
                          <div key={cIdx} className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl flex justify-between gap-4 items-start">
                            <div className="flex gap-2.5">
                              <img src={comm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'} className="w-6 h-6 rounded-full object-cover mt-0.5 border border-white/10" alt="" />
                              <div>
                                <span className="block text-[10.5px] font-mono text-zinc-300 font-bold">{comm.author} <span className="text-zinc-500 font-normal">{comm.handle}</span></span>
                                <p className="text-[11px] text-zinc-400 mt-1 font-sans leading-relaxed">{comm.text}</p>
                              </div>
                            </div>
                            <span className="text-[8px] font-mono text-zinc-600">
                              {comm.createdAt ? new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. SAVE TO BOARD DIALOG */}
      <AnimatePresence>
        {activeBoardSelectorPost && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b10] border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-6 relative text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">PERSISTENT INSPIRATION BANK</span>
                  <h3 className="font-serif text-base text-white">Save to Inspiration Board</h3>
                </div>
                <button
                  onClick={() => {
                    setActiveBoardSelectorPost(null);
                    setShowNewBoardInput(false);
                  }}
                  className="p-1 text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Board grid selection */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar">
                {boards.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleSaveToBoard(b.id)}
                    className="w-full p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl flex items-center justify-between text-left transition-all group cursor-pointer"
                  >
                    <div>
                      <span className="block text-xs font-bold text-zinc-200 group-hover:text-white">{b.name}</span>
                      <span className="block text-[8.5px] font-mono text-zinc-500 uppercase">{b.postIds.length} Campaign Pieces Saved</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                  </button>
                ))}
              </div>

              {/* Create new Board option */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                {!showNewBoardInput ? (
                  <button
                    onClick={() => setShowNewBoardInput(true)}
                    className="w-full py-2.5 border border-dashed border-white/10 hover:border-white/20 text-[10px] font-mono text-zinc-400 hover:text-white uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                  >
                    <PlusCircle className="w-4 h-4 text-violet-400" />
                    Create New Inspiration Board
                  </button>
                ) : (
                  <div className="space-y-2.5">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Belgian Flax Linens"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      className="w-full bg-[#0c0c16] border border-white/5 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/15 rounded-xl font-mono"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateBoardAndSave}
                        className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[9.5px] uppercase tracking-wider rounded-xl font-bold transition-all cursor-pointer"
                      >
                        Create & Save
                      </button>
                      <button
                        onClick={() => setShowNewBoardInput(false)}
                        className="py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[9.5px] font-mono uppercase rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. SHARE DOSSIER DIALOG */}
      <AnimatePresence>
        {shareDossierPost && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b10] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 relative text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">COGNITIVE DOSSIER EXPORT</span>
                  <h3 className="font-serif text-base text-white">Sartorial Design Dossier</h3>
                </div>
                <button
                  onClick={() => setShareDossierPost(null)}
                  className="p-1 text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Blueprint Dossier Card Visual Mockup */}
              <div className="p-4 bg-zinc-950 border border-white/5 rounded-2xl space-y-3 font-mono text-[9px] relative select-text">
                <div className="absolute top-4 right-4 text-[7px] text-zinc-600 border border-zinc-700/50 px-1 py-0.5 rounded font-bold">EXCELLENT STATUS</div>
                <span className="text-zinc-600 block leading-none"># COORDINATE DOSSIER EXPORT</span>
                
                <div className="flex gap-4 items-center py-2 border-b border-white/[0.03]">
                  <img src={shareDossierPost.imageUrl} className="w-12 h-16 object-cover rounded-lg border border-white/5" alt="" />
                  <div>
                    <span className="text-white block font-bold text-xs">{shareDossierPost.vibeTags[0]?.toUpperCase() || 'CONCEPT'} DESIGN</span>
                    <span className="text-zinc-400 block mt-0.5 font-bold">Author: {shareDossierPost.author.name}</span>
                    <span className="text-zinc-500 block leading-none">{shareDossierPost.author.handle}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-zinc-400">
                  <p><span className="text-zinc-600 font-bold">DIAGNOSTIC RATIO:</span> Coherence {shareDossierPost.aiScore}%</p>
                  <p><span className="text-zinc-600 font-bold">AVATAR SPEC:</span> {shareDossierPost.avatarBlueprint?.gender}, {shareDossierPost.avatarBlueprint?.age} • {shareDossierPost.avatarBlueprint?.hairStyle}</p>
                  <p className="truncate"><span className="text-zinc-600 font-bold">GARMENT SILHOUETTE:</span> {shareDossierPost.garmentBlueprint?.silhouette}</p>
                  <p className="truncate"><span className="text-zinc-600 font-bold">FABRIC COMP:</span> {shareDossierPost.garmentBlueprint?.fabric}</p>
                  <p className="truncate"><span className="text-zinc-600 font-bold">SCENE MAT:</span> {shareDossierPost.sceneBlueprint?.location}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyDossierLink(shareDossierPost)}
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[10px] uppercase tracking-wider rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-600/10"
                >
                  <Copy className="w-4 h-4 text-white" />
                  Copy Dossier Specs
                </button>
                <button
                  onClick={() => setShareDossierPost(null)}
                  className="py-3 px-5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. PREMIUM SLIDING STYLE GENERATOR DRAWER */}
      <AnimatePresence>
        {isGeneratorOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end">
            {/* Click-outside back-drop */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsGeneratorOpen(false)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#05050c] border-l border-white/5 w-full max-w-xl h-full relative z-10 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-2xl p-6 md:p-8"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Sparkles className="w-4 h-4 fill-emerald-400/20" />
                    <span className="text-[9px] font-mono tracking-widest uppercase font-bold">Active Co-Creation Studio</span>
                  </div>
                  <h3 className="font-serif text-lg text-white">Fashion AI Generator</h3>
                </div>
                <button
                  onClick={() => setIsGeneratorOpen(false)}
                  className="p-1.5 bg-white/5 border border-white/5 text-zinc-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 space-y-6">
                
                {/* Drag and Drop Reference Box */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center space-y-3 relative overflow-hidden group select-none min-h-36 ${
                    isDragging 
                      ? 'border-violet-500 bg-violet-500/5' 
                      : uploadedImage 
                        ? 'border-white/10 bg-black/40' 
                        : 'border-white/5 hover:border-white/10 bg-white/[0.01]'
                  }`}
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {uploadedImage ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img 
                        src={uploadedImage} 
                        alt="Reference Silhouette" 
                        className="w-full h-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05050c] via-[#05050c]/45 to-transparent flex flex-col justify-end p-4">
                        <span className="text-[10px] font-mono text-zinc-300 bg-black/80 px-2 py-1 rounded-lg border border-white/5 inline-block mx-auto">
                          Reference Image Loaded
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            clearUploadedImage();
                          }}
                          className="text-[10px] font-mono text-red-400 hover:text-red-300 mt-2 block hover:underline cursor-pointer"
                        >
                          Remove reference
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-105 duration-300 transition-transform">
                        <Upload className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-zinc-200">
                          Upload visual fit blueprint
                        </p>
                        <p className="text-[10px] font-mono text-zinc-500">
                          Drag and drop reference image or click to browse
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Prompt Box */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Describe your outfit...</label>
                  <textarea
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="E.g., charcoal double-breasted coat paired with wide-leg silk trousers..."
                    rows={3}
                    className="w-full bg-[#030306] border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Generate Action Button */}
                <button
                  onClick={() => handleGenerateStyle()}
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-medium tracking-wide hover:brightness-110 disabled:brightness-75 active:scale-[0.99] transition-all duration-300 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-mono text-xs uppercase tracking-widest">{generationStep}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="font-sans uppercase text-xs tracking-wider font-semibold">Generate Style</span>
                    </>
                  )}
                </button>

                {/* Presets Chips */}
                <div className="space-y-2.5 pt-1">
                  <p className="text-[10px] font-mono tracking-wide text-zinc-500 uppercase">Preset Styles</p>
                  <div className="flex flex-wrap gap-2">
                    {quickChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPromptInput(chip.prompt);
                          handleGenerateStyle(chip.prompt);
                        }}
                        disabled={isGenerating}
                        className="px-3.5 py-1.5 rounded-full text-[10px] font-mono border border-white/5 bg-white/[0.01] text-zinc-400 hover:text-white hover:border-violet-500/20 hover:bg-violet-500/10 transition-all duration-300 cursor-pointer disabled:opacity-50"
                      >
                        [{chip.label}]
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Box */}
                {errorMessage && (
                  <div className="p-4 bg-red-950/20 border border-red-500/15 rounded-xl text-xs font-mono text-red-400 text-center animate-fade-in">
                    {errorMessage}
                  </div>
                )}

                {/* Generated Result Lookbook */}
                {generatedResult && (
                  <div className="space-y-5 pt-4 border-t border-white/5 animate-fade-in text-left">
                    <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase block text-center">Curated Silhouette</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-black/40 border border-white/5 rounded-2xl p-4 overflow-hidden">
                      {/* Left: 3:4 aspect image frame */}
                      <div className="md:col-span-2 aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/5 relative bg-zinc-950">
                        <img 
                          src={generatedResult.imageUrl} 
                          alt="Generated Look" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                          <button 
                            onClick={() => setGenLiked(!genLiked)}
                            className={`p-1.5 rounded-full border transition-all ${
                              genLiked ? 'bg-red-500 border-red-500 text-white' : 'bg-black/60 border-white/10 text-white hover:bg-black'
                            }`}
                          >
                            <Heart className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => setGenBookmarked(!genBookmarked)}
                            className={`p-1.5 rounded-full border transition-all ${
                              genBookmarked ? 'bg-violet-500 border-violet-500 text-white' : 'bg-black/60 border-white/10 text-white hover:bg-black'
                            }`}
                          >
                            <Bookmark className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Right: metadata description */}
                      <div className="md:col-span-3 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono border border-violet-500/20 bg-violet-500/5 text-violet-300 capitalize">
                              {generatedResult.vibe}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white tracking-tight">Studio Silhouette</h4>
                          <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-4">{generatedResult.description}</p>
                        </div>

                        {/* Emerald Add to Closet Button */}
                        <button
                          onClick={handleSaveToWardrobe}
                          disabled={hasSaved}
                          className={`w-full py-3 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer text-xs ${
                            hasSaved 
                              ? 'bg-zinc-800 border border-zinc-700 text-zinc-500' 
                              : 'bg-[#16a34a] hover:bg-[#22c55e] text-white shadow-[0_4px_15px_rgba(22,163,74,0.2)] hover:shadow-[0_4px_25px_rgba(22,163,74,0.4)]'
                          }`}
                        >
                          {hasSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-zinc-500" />
                              <span className="font-mono text-[10px] uppercase tracking-wider">Archived in Closet</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span className="font-sans text-[11px] tracking-wide font-semibold">Add to Closet</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
