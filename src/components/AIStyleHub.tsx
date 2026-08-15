import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Shirt, ShoppingBag, Eye, Layers, Compass, User, 
  Settings, LogOut, ChevronRight, Check, RefreshCw, Upload, 
  Camera, SlidersHorizontal, ArrowRight, ShieldCheck, Cpu, 
  Activity, CloudSun, Bell, X, Search, Heart, Store,
  Zap, Award, CheckCircle, Smartphone, Monitor, Globe, Plus,
  Bookmark, Sliders, MessageSquare, Palette, Lock, Users, Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WardrobeItem, ProfileService, type StyleProfile } from '../platform';
import { getGarmentImage } from '../features/feed/AIEngine';
import { 
  UnifiedFashionOS, 
  type UnifiedState,
  type UnifiedOutfit,
  VisualSuggestion,
  useThemeIntelligence,
  ThemeCoatRenderer
} from '../engine';

// Sub-screen and component imports
import { WardrobeGrid } from './WardrobeGrid';
import { SellerDashboard } from './SellerDashboard';
import { AIEngineStudio } from './AIEngineStudio';
import { SystemSettingsAudit } from './SystemSettingsAudit';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { MarketplaceScreen, BOUTIQUE_PRODUCTS } from './screens/MarketplaceScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CreatorWorkspaceScreen } from './screens/CreatorWorkspaceScreen';
import { VirtualStudioTryOn } from './VirtualStudioTryOn';
import { OutfitPlanner } from './OutfitPlanner';
import { FashionInstructorWorkspace } from './screens/FashionInstructorWorkspace';
import { AIAssistantStudio } from './AIAssistantStudio';
import { MatureFashionStudio } from './MatureFashionStudio';
import { SocialHubView } from './social/SocialHubView';
import { SubscriptionHubView } from './payment/SubscriptionHubView';
import { AdminShell } from '../admin';
import { ARIAStatusWidget, ARIAAssistantPanel } from './aria';
import { FocusSearchPalette } from './FocusSearchPalette';
import { AIStyleFeed } from './AIStyleFeed';
import { VendorOnboarding } from './VendorOnboarding';

export interface LookVisionTheme {
  id: string;
  name: string;
  bg: string;
  text: string;
  accent: string;
  accentBg: string;
  glassBg: string;
  glassBorder: string;
  glowClass: string;
  badgeBg: string;
  sidebarBg: string;
  cardBg: string;
}

export const LOOK_VISION_THEMES: LookVisionTheme[] = [
  {
    id: 'cosmic-dream',
    name: 'Cosmic Couture',
    bg: 'bg-[#05050a] text-zinc-100',
    text: 'text-zinc-100',
    accent: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20',
    accentBg: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90',
    glassBg: 'bg-[#07070c]/80 backdrop-blur-xl',
    glassBorder: 'border-white/5',
    glowClass: 'shadow-[0_0_35px_rgba(99,102,241,0.2)]',
    badgeBg: 'bg-indigo-950/40 text-indigo-200 border-indigo-500/20',
    sidebarBg: 'bg-[#07070c] border-r border-white/5',
    cardBg: 'bg-[#0a0a12]/80 border border-white/5',
  },
  {
    id: 'classic-noir',
    name: 'Classic Noir',
    bg: 'bg-[#05050a] text-zinc-100',
    text: 'text-zinc-100',
    accent: 'text-white border-white/20 bg-white/10 hover:bg-white/20',
    accentBg: 'bg-white text-black hover:bg-neutral-200',
    glassBg: 'bg-zinc-900/60 backdrop-blur-xl',
    glassBorder: 'border-white/10',
    glowClass: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]',
    badgeBg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    sidebarBg: 'bg-[#07070c] border-r border-white/5',
    cardBg: 'bg-zinc-900/40 border border-white/5',
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Atelier',
    bg: 'bg-[#05050a] text-zinc-100',
    text: 'text-zinc-100',
    accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20',
    accentBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90',
    glassBg: 'bg-emerald-950/20 backdrop-blur-xl',
    glassBorder: 'border-emerald-500/20',
    glowClass: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    badgeBg: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20',
    sidebarBg: 'bg-[#07070c] border-r border-white/5',
    cardBg: 'bg-emerald-950/10 border border-emerald-500/10',
  }
];

export const ImageWithFade: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden w-full h-full bg-[#0d0d15] flex items-center justify-center ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-white/[0.02] animate-pulse" />
      )}
      <img
        src={hasError ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60' : src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export function hasArchiveQualities(item: WardrobeItem): boolean {
  return (item.wearCount || 0) > 10 || item.formality === 'Formal' || item.category === 'Outerwear';
}

export function getAtmosphereLine(item: WardrobeItem): string {
  if (item.category === 'Outerwear') return 'Subtle drape tailored for brisk city mornings.';
  if (item.category === 'Formal') return 'Structured silhouette cut with evening precision.';
  return 'Effortless quiet luxury crafted for everyday elegance.';
}

export function registerCombination(items: WardrobeItem[]) {
  try {
    const existing = JSON.parse(localStorage.getItem('lookvision_saved_combos') || '[]');
    existing.unshift({
      id: `combo_${Date.now()}`,
      items: items.map(i => ({ id: i.id, title: i.title, category: i.category })),
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('lookvision_saved_combos', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {}
}

export function getStayTogetherPartner(itemId: string, allItems: WardrobeItem[]): WardrobeItem | null {
  return allItems.find(i => i.id !== itemId && i.category !== 'Outerwear') || null;
}

export type MainSubTab = 
  | 'PRODUCT_HOME'
  | 'PRODUCT_AI_CREATIONS'
  | 'STYLE_STREAM'
  | 'PRODUCT_COMMUNITY'
  | 'PRODUCT_MARKETPLACE'
  | 'WARDROBE'
  | 'VIRTUAL_TRY'
  | 'DISCOVER'
  | 'CREATOR_WORKSPACE'
  | 'PRODUCT_DETAIL'
  | 'PLANNER'
  | 'FASHION_INSTRUCTOR'
  | 'AI_ASSISTANT'
  | 'MATURE_FASHION_STUDIO'
  | 'SOCIAL_HUB'
  | 'SUBSCRIPTION_HUB'
  | 'VENDOR_ONBOARDING'
  | 'SYSTEM_ROOM'
  | 'ADMIN_COMMAND';

interface AIStyleHubProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onDeleteGarment?: (id: string) => Promise<void>;
  user?: any;
  onLogout?: () => void;
  onReset?: () => void;
  onLoadSamples?: () => void;
  isResetting?: boolean;
  onEnterSilence?: () => void;
}

export const AIStyleHub: React.FC<AIStyleHubProps> = ({
  wardrobe = [],
  onAddGarment,
  onDeleteGarment,
  user,
  onLogout,
  onReset,
  onLoadSamples,
  isResetting
}) => {
  // Theme and coat context
  let themeCtx: ReturnType<typeof useThemeIntelligence> | null = null;
  try {
    themeCtx = useThemeIntelligence();
  } catch {
    themeCtx = null;
  }
  const coatDNA = themeCtx?.coatDNA;

  const [currentTheme, setCurrentTheme] = useState<string>('cosmic-dream');
  const [weatherWeight, setWeatherWeight] = useState<'lighter' | 'heavier' | 'layered'>('layered');

  // Navigation and view states
  const [activeSubTab, setActiveSubTab] = useState<MainSubTab>(() => {
    const path = window.location.pathname;
    if (path === '/ai-studio') return 'PRODUCT_AI_CREATIONS';
    if (path === '/stream' || path === '/feed') return 'STYLE_STREAM';
    if (path === '/marketplace') return 'PRODUCT_MARKETPLACE';
    if (path === '/community') return 'PRODUCT_COMMUNITY';
    if (path === '/wardrobe') return 'WARDROBE';
    if (path === '/virtual-try') return 'VIRTUAL_TRY';
    if (path === '/discover') return 'DISCOVER';
    if (path === '/creator') return 'CREATOR_WORKSPACE';
    if (path === '/fashion-instructor') return 'FASHION_INSTRUCTOR';
    if (path === '/aria' || path === '/assistant') return 'AI_ASSISTANT';
    if (path === '/social') return 'SOCIAL_HUB';
    if (path === '/subscription' || path === '/billing') return 'SUBSCRIPTION_HUB';
    if (path === '/vendor-onboarding' || path === '/become-seller' || path === '/merchant-register') return 'VENDOR_ONBOARDING';
    if (path === '/settings') return 'SYSTEM_ROOM';
    if (path === '/admin') return 'ADMIN_COMMAND';
    return 'PRODUCT_HOME';
  });

  const [state, setState] = useState<UnifiedState>(() => UnifiedFashionOS.getState());
  const [isARIAPanelOpen, setIsARIAPanelOpen] = useState(false);
  const [isFocusSearchOpen, setIsFocusSearchOpen] = useState(false);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'info' | 'success' | 'warning' }>>([]);

  // Bento Grid Curation Board Tabs ('TODAY_CURATION' vs 'MARKETPLACE')
  const [curationBoardTab, setCurationBoardTab] = useState<'TODAY_CURATION' | 'MARKETPLACE'>('TODAY_CURATION');

  // Active Curated Outfit State
  const [activeOutfitSuggestion, setActiveOutfitSuggestion] = useState<{
    id: string;
    name: string;
    occasion: string;
    reasoning: string;
    score: number;
    items: WardrobeItem[];
  }>(() => ({
    id: 'outfit_init',
    name: 'Architectural Obsidian Ensemble',
    occasion: 'High-Fashion Creative Studio',
    reasoning: 'Engineered with clean vertical lines and monochromatic charcoal saturation to optimize silhouette elegance under gallery studio lighting.',
    score: 96,
    items: wardrobe.slice(0, 3)
  }));

  // Virtual Dressing Canvas Combinator State
  const [combinatorSlots, setCombinatorSlots] = useState<{
    outerwear: WardrobeItem | null;
    top: WardrobeItem | null;
    bottom: WardrobeItem | null;
    footwear: WardrobeItem | null;
  }>({
    outerwear: null,
    top: null,
    bottom: null,
    footwear: null
  });
  const [activeSlotPicker, setActiveSlotPicker] = useState<'outerwear' | 'top' | 'bottom' | 'footwear' | null>(null);

  // Multi-Modal Ingestion & Camera State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    name: string;
    category: string;
    primaryColor: string;
    pattern: string;
    material: string;
    confidence: number;
    previewUrl?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize initial wardrobe into combinator slots and suggestion if available
  useEffect(() => {
    if (wardrobe.length > 0) {
      setCombinatorSlots(prev => ({
        outerwear: prev.outerwear || wardrobe.find(i => i.category === 'Outerwear') || null,
        top: prev.top || wardrobe.find(i => i.category === 'Casual' || i.category === 'Formal') || wardrobe[0] || null,
        bottom: prev.bottom || wardrobe.find(i => i.title.toLowerCase().includes('pant') || i.title.toLowerCase().includes('trouser') || i.title.toLowerCase().includes('jean')) || null,
        footwear: prev.footwear || wardrobe.find(i => i.title.toLowerCase().includes('boot') || i.title.toLowerCase().includes('shoe') || i.title.toLowerCase().includes('loafer')) || null,
      }));

      if (activeOutfitSuggestion.items.length === 0) {
        setActiveOutfitSuggestion(prev => ({
          ...prev,
          items: wardrobe.slice(0, 3)
        }));
      }
    }
  }, [wardrobe]);

  // Toast Helper
  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Route Synchronization & Custom Event Listeners
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/ai-studio') setActiveSubTab('PRODUCT_AI_CREATIONS');
      else if (path === '/marketplace') setActiveSubTab('PRODUCT_MARKETPLACE');
      else if (path === '/community') setActiveSubTab('PRODUCT_COMMUNITY');
      else if (path === '/wardrobe') setActiveSubTab('WARDROBE');
      else if (path === '/virtual-try') setActiveSubTab('VIRTUAL_TRY');
      else if (path === '/discover') setActiveSubTab('DISCOVER');
      else if (path === '/creator') setActiveSubTab('CREATOR_WORKSPACE');
      else if (path === '/fashion-instructor') setActiveSubTab('FASHION_INSTRUCTOR');
      else if (path === '/aria' || path === '/assistant') setActiveSubTab('AI_ASSISTANT');
      else if (path === '/social') setActiveSubTab('SOCIAL_HUB');
      else if (path === '/subscription' || path === '/billing') setActiveSubTab('SUBSCRIPTION_HUB');
      else if (path === '/settings') setActiveSubTab('SYSTEM_ROOM');
      else if (path === '/admin') setActiveSubTab('ADMIN_COMMAND');
      else if (path === '/' || path === '/home') setActiveSubTab('PRODUCT_HOME');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('lookvision_route_change', handleLocationChange);

    const handleGlobalShowToast = (e: any) => {
      if (e?.detail?.message) {
        showToast(e.detail.message, e.detail.type || 'info');
      }
    };
    window.addEventListener('lookvision_show_toast', handleGlobalShowToast);

    const handleGlobalNavigate = (e: any) => {
      const dest = e?.detail;
      if (dest) handleNavigate(dest);
    };
    window.addEventListener('lookvision_navigate', handleGlobalNavigate);

    const handleGlobalViewProduct = (e: any) => {
      if (e?.detail) {
        setSelectedProduct(e.detail);
        handleNavigate('PRODUCT_DETAIL');
      }
    };
    window.addEventListener('lookvision_view_product', handleGlobalViewProduct);

    const handleOpenAria = () => setIsARIAPanelOpen(true);
    window.addEventListener('lookvision_open_aria', handleOpenAria);

    const handleOpenSearch = () => setIsFocusSearchOpen(true);
    window.addEventListener('lookvision_open_focus_search', handleOpenSearch);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('lookvision_route_change', handleLocationChange);
      window.removeEventListener('lookvision_show_toast', handleGlobalShowToast);
      window.removeEventListener('lookvision_navigate', handleGlobalNavigate);
      window.removeEventListener('lookvision_view_product', handleGlobalViewProduct);
      window.removeEventListener('lookvision_open_aria', handleOpenAria);
      window.removeEventListener('lookvision_open_focus_search', handleOpenSearch);
    };
  }, []);

  const handleNavigate = (tab: MainSubTab) => {
    setActiveSubTab(tab);
    let targetPath = '/home';
    if (tab === 'PRODUCT_AI_CREATIONS') targetPath = '/ai-studio';
    else if (tab === 'STYLE_STREAM') targetPath = '/stream';
    else if (tab === 'PRODUCT_MARKETPLACE') targetPath = '/marketplace';
    else if (tab === 'PRODUCT_COMMUNITY') targetPath = '/community';
    else if (tab === 'WARDROBE') targetPath = '/wardrobe';
    else if (tab === 'VIRTUAL_TRY') targetPath = '/virtual-try';
    else if (tab === 'DISCOVER') targetPath = '/discover';
    else if (tab === 'CREATOR_WORKSPACE') targetPath = '/creator';
    else if (tab === 'FASHION_INSTRUCTOR') targetPath = '/fashion-instructor';
    else if (tab === 'AI_ASSISTANT') targetPath = '/aria';
    else if (tab === 'SOCIAL_HUB') targetPath = '/social';
    else if (tab === 'SUBSCRIPTION_HUB') targetPath = '/subscription';
    else if (tab === 'VENDOR_ONBOARDING') targetPath = '/vendor-onboarding';
    else if (tab === 'SYSTEM_ROOM') targetPath = '/settings';
    else if (tab === 'ADMIN_COMMAND') targetPath = '/admin';

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
      window.dispatchEvent(new CustomEvent('lookvision_route_change'));
    }
  };

  // Trigger Outfit Generation with AI Stylist Reasoning
  const [isCompilingOutfit, setIsCompilingOutfit] = useState(false);
  const handleRegenerateOutfit = async () => {
    setIsCompilingOutfit(true);
    try {
      if (wardrobe.length === 0) {
        showToast('Add garments to your digital closet to synthesize custom outfits.', 'warning');
        setIsCompilingOutfit(false);
        return;
      }
      // Pick cohesive garments
      const tops = wardrobe.filter(w => w.category === 'Casual' || w.category === 'Formal');
      const bottoms = wardrobe.filter(w => w.title.toLowerCase().includes('pant') || w.title.toLowerCase().includes('jean') || w.title.toLowerCase().includes('trouser'));
      const outerwear = wardrobe.filter(w => w.category === 'Outerwear');

      const pickedItems: WardrobeItem[] = [];
      if (outerwear.length > 0) pickedItems.push(outerwear[Math.floor(Math.random() * outerwear.length)]);
      if (tops.length > 0) pickedItems.push(tops[Math.floor(Math.random() * tops.length)]);
      if (bottoms.length > 0) pickedItems.push(bottoms[Math.floor(Math.random() * bottoms.length)]);
      if (pickedItems.length === 0) pickedItems.push(wardrobe[0]);

      setTimeout(() => {
        setActiveOutfitSuggestion({
          id: `outfit_${Date.now()}`,
          name: 'Architectural Obsidian Ensemble',
          occasion: 'High-Fashion Creative Studio',
          reasoning: 'Engineered with clean vertical lines and monochromatic charcoal saturation to optimize silhouette elegance under gallery studio lighting.',
          score: 96,
          items: pickedItems
        });
        setIsCompilingOutfit(false);
        showToast('New sartorial curation compiled successfully!', 'success');
      }, 700);
    } catch (err) {
      setIsCompilingOutfit(false);
      showToast('Stylist synchronization failed', 'warning');
    }
  };

  // Ingestion File Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Str = reader.result as string;
      setIsScanning(true);
      setScanResult(null);

      // Simulate multi-modal ingestion response
      setTimeout(() => {
        setIsScanning(false);
        setScanResult({
          name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Structured Sartorial Coat',
          category: 'Outerwear',
          primaryColor: 'Pitch Black',
          pattern: 'Solid Matte',
          material: 'Virgin Wool Twill',
          confidence: 0.94,
          previewUrl: base64Str
        });
        showToast('Garment features extracted via multi-modal AI vision.', 'success');
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveScannedGarment = async () => {
    if (!scanResult) return;
    try {
      if (onAddGarment) {
        await onAddGarment(
          scanResult.name,
          `Analyzed: ${scanResult.material} • ${scanResult.pattern} • ${scanResult.primaryColor}`,
          scanResult.category,
          { imageUrl: scanResult.previewUrl }
        );
      }
      showToast(`Added "${scanResult.name}" to your closet!`, 'success');
      setScanResult(null);
    } catch (e) {
      showToast('Failed to register garment', 'warning');
    }
  };

  // Calculate Aesthetic Combinator Coherence
  const combinatorScore = useMemo(() => {
    let base = 75;
    if (combinatorSlots.top) base += 8;
    if (combinatorSlots.bottom) base += 7;
    if (combinatorSlots.outerwear) base += 5;
    if (combinatorSlots.footwear) base += 4;
    return Math.min(base, 98);
  }, [combinatorSlots]);

  // Render Sub-Views
  const renderCurrentView = () => {
    switch (activeSubTab) {
      case 'PRODUCT_AI_CREATIONS':
        return (
          <AIEngineStudio 
            wardrobe={wardrobe}
            onAddGarment={onAddGarment}
            onNavigateToTab={(t) => handleNavigate(t as any)}
          />
        );
      case 'PRODUCT_COMMUNITY':
        return (
          <CommunityScreen 
            user={user}
            userWardrobe={wardrobe}
            onAddGarment={onAddGarment}
            onNavigateToTab={(t) => handleNavigate(t as any)}
          />
        );
      case 'PRODUCT_MARKETPLACE':
        return (
          <MarketplaceScreen 
            userWardrobe={wardrobe}
            onAddGarment={onAddGarment}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              handleNavigate('PRODUCT_DETAIL');
            }}
            onNavigateToTab={(t) => handleNavigate(t as any)}
            onOpenSellerDashboard={() => setIsSellerDashboardOpen(true)}
            user={user}
          />
        );
      case 'PRODUCT_DETAIL':
        return (
          <ProductDetailScreen 
            product={selectedProduct || BOUTIQUE_PRODUCTS[0]}
            onBack={() => handleNavigate('PRODUCT_MARKETPLACE')}
            onAddGarment={onAddGarment}
            onNavigateToTab={(t) => handleNavigate(t as any)}
            userWardrobe={wardrobe}
            user={user}
          />
        );
      case 'WARDROBE':
        return (
          <WardrobeGrid 
            items={wardrobe}
            onDelete={(item) => onDeleteGarment ? onDeleteGarment(item.id) : undefined}
            onAddTrigger={() => handleNavigate('PRODUCT_HOME')}
            categories={['Casual', 'Formal', 'Sportswear', 'Outerwear', 'Accessories']}
          />
        );
      case 'VIRTUAL_TRY':
        return (
          <VirtualStudioTryOn 
            wardrobe={wardrobe}
            onAddGarment={onAddGarment}
          />
        );
      case 'STYLE_STREAM':
        return (
          <AIStyleFeed 
            userWardrobe={wardrobe}
            onAddGarment={onAddGarment}
            onNavigateToTab={(t) => handleNavigate(t as any)}
          />
        );
      case 'DISCOVER':
        return (
          <DiscoverScreen 
            userWardrobe={wardrobe} 
            onNavigateToTab={(t) => handleNavigate(t as any)}
            onAddGarment={onAddGarment}
          />
        );
      case 'CREATOR_WORKSPACE':
        return (
          <CreatorWorkspaceScreen 
            user={user}
            userWardrobe={wardrobe}
            onAddGarment={onAddGarment}
            onNavigateToTab={(t) => handleNavigate(t as any)}
          />
        );
      case 'PLANNER':
        return <OutfitPlanner wardrobe={wardrobe} themeObj={LOOK_VISION_THEMES[0]} />;
      case 'FASHION_INSTRUCTOR':
        return <FashionInstructorWorkspace />;
      case 'AI_ASSISTANT':
        return (
          <AIAssistantStudio 
            wardrobe={wardrobe} 
            onNavigateToTab={(t) => handleNavigate(t as any)} 
          />
        );
      case 'MATURE_FASHION_STUDIO':
        return <MatureFashionStudio />;
      case 'SOCIAL_HUB':
        return <SocialHubView />;
      case 'SUBSCRIPTION_HUB':
        return <SubscriptionHubView />;
      case 'VENDOR_ONBOARDING':
        return (
          <VendorOnboarding 
            onCancel={() => handleNavigate('PRODUCT_MARKETPLACE')}
            onComplete={(vendorData) => {
              setIsSellerDashboardOpen(true);
              handleNavigate('PRODUCT_MARKETPLACE');
            }}
          />
        );
      case 'SYSTEM_ROOM':
        return (
          <SystemSettingsAudit 
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
            weatherWeight={weatherWeight}
            saveWeatherWeight={setWeatherWeight}
            isResetting={isResetting || false}
            onReset={onReset}
            onLoadSamples={onLoadSamples}
            state={state}
            triggerQuietPause={(fn) => fn()}
          />
        );
      case 'ADMIN_COMMAND':
        return <AdminShell onExitAdmin={() => handleNavigate('PRODUCT_HOME')} />;
      case 'PRODUCT_HOME':
      default:
        return renderBentoGridHome();
    }
  };

  // Main Bento Grid View for PRODUCT_HOME
  const renderBentoGridHome = () => {
    return (
      <div className="space-y-6 animate-fade-in pb-16">
        {/* Top Operational Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#07070c]/60 border border-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-white">Paris Atelier</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-white/50">18°C Mild Overcast</span>
              </div>
              <p className="text-[11px] text-zinc-400">Atmospheric humidity 62% • Structured mid-weight drape optimal</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsFocusSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-zinc-400 hover:text-white hover:border-white/10 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search wardrobe, looks & boutiques...</span>
              <kbd className="text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-zinc-500">⌘K</kbd>
            </button>

            <button
              onClick={() => setIsARIAPanelOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-xs font-medium text-indigo-200 hover:bg-indigo-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>ARIA Live</span>
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: User Sartorial DNA & Maturity Index (4 Cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-[#07070c]/80 border border-white/5 p-6 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group hover:border-violet-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    <div className="w-full h-full rounded-[14px] bg-[#07070c] flex items-center justify-center overflow-hidden">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="User avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-indigo-300" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{user?.displayName || 'Haute Stylist'}</h3>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      Tier 1 • Master Curateur
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">89%</span>
                  <span className="block text-[9px] font-mono uppercase tracking-widest text-zinc-500">Maturity</span>
                </div>
              </div>

              {/* Progress Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Sartorial Vector Calibration</span>
                  <span className="text-indigo-300 font-mono">89 / 100</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-[89%] transition-all duration-1000" />
                </div>
              </div>

              {/* Vector Attributes */}
              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Dominant Archetype</span>
                  <span className="text-zinc-200 font-medium">Minimalist Haute Couture</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Color Palette Resonance</span>
                  <span className="text-zinc-200 font-medium">Monochrome Charcoal & Obsidian</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Silhouettes</span>
                  <span className="text-zinc-200 font-medium">Architectural Column Draping</span>
                </div>
              </div>

              {/* Attribute Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <span className="block text-xs font-mono font-bold text-white">88%</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Creativity</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <span className="block text-xs font-mono font-bold text-emerald-400">94%</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Luxury</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <span className="block text-xs font-mono font-bold text-indigo-400">96%</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Coherence</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNavigate('AI_ASSISTANT')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Calibrate Style Passport</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>

          {/* Card 2: Interactive Curation Board (8 Cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-[#07070c]/80 border border-white/5 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-violet-500/20 transition-all duration-300">
            <div className="space-y-5">
              {/* Header with Switcher Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Curation Intelligence Board</span>
                  </h2>
                  <p className="text-xs text-zinc-400">Synchronized daily lookbook generation and boutique marketplace integration</p>
                </div>

                <div className="flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/5 self-start">
                  <button
                    onClick={() => setCurationBoardTab('TODAY_CURATION')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      curationBoardTab === 'TODAY_CURATION' 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Shirt className="w-3.5 h-3.5" />
                    <span>Today's Outfit</span>
                  </button>
                  <button
                    onClick={() => setCurationBoardTab('MARKETPLACE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      curationBoardTab === 'MARKETPLACE' 
                        ? 'bg-emerald-500 text-black font-semibold shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Marketplace Highlights</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Today's Outfit Curation (Indigo accents) */}
              {curationBoardTab === 'TODAY_CURATION' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Hero Garment */}
                    <div className="md:col-span-1 rounded-xl aspect-[3/4] overflow-hidden bg-zinc-900/60 border border-white/5 relative group">
                      <ImageWithFade 
                        src={activeOutfitSuggestion.items[0]?.imageUrl || getGarmentImage(activeOutfitSuggestion.items[0]?.title || 'Obsidian Wool Coat')} 
                        alt="Hero look" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">Prime Piece</span>
                        <h4 className="text-xs font-medium text-white truncate">{activeOutfitSuggestion.items[0]?.title || 'Obsidian Tailored Overcoat'}</h4>
                      </div>
                    </div>

                    {/* Outfit Breakdown & Reasoning */}
                    <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-white">
                            {activeOutfitSuggestion.name}
                          </h3>
                          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                            {activeOutfitSuggestion.score}% Aesthetic Match
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed font-serif italic bg-white/[0.02] p-3 rounded-xl border border-white/5">
                          "{activeOutfitSuggestion.reasoning}"
                        </p>

                        {/* Garment pills */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Garment Layering</span>
                          <div className="flex flex-wrap gap-2">
                            {activeOutfitSuggestion.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-zinc-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                <span>{item.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3">
                        <button
                          onClick={handleRegenerateOutfit}
                          disabled={isCompilingOutfit}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.25)] disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isCompilingOutfit ? 'animate-spin' : ''}`} />
                          <span>{isCompilingOutfit ? 'Synthesizing...' : 'Regenerate Ensemble'}</span>
                        </button>
                        <button
                          onClick={() => handleNavigate('VIRTUAL_TRY')}
                          className="py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-300" />
                          <span>3D Try-On</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Marketplace Highlights (Emerald accents) */}
              {curationBoardTab === 'MARKETPLACE' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BOUTIQUE_PRODUCTS.slice(0, 3).map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setSelectedProduct(item);
                          handleNavigate('PRODUCT_DETAIL');
                        }}
                        className="rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer group hover:scale-[1.01]"
                      >
                        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-zinc-900/60 mb-2 relative">
                          <ImageWithFade src={item.imageUrl} alt={item.title} />
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white">
                            {item.availability}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-medium text-white truncate flex-1 group-hover:text-emerald-400 transition-colors">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-[10px] text-zinc-400 truncate">{item.brand}</p>
                          <div className="flex justify-between items-center pt-1 border-t border-white/5">
                            <span className="text-xs font-mono font-bold text-emerald-400">
                              ${item.price}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-500">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleNavigate('PRODUCT_MARKETPLACE')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Explore Full Marketplace Boutique</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Virtual Dressing Canvas (Interactive Combinator) (8 Cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-[#07070c]/80 border border-white/5 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-violet-500/20 transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Virtual Dressing Canvas & Combinator</span>
                  </h3>
                  <p className="text-xs text-zinc-400">Layer garments dynamically to evaluate harmony, drape, and silhouette cohesion</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400">Coherence:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {combinatorScore}%
                  </span>
                </div>
              </div>

              {/* Combinator Slots */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Outerwear Slot */}
                <div 
                  onClick={() => setActiveSlotPicker('outerwear')}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col items-center text-center space-y-2 group"
                >
                  <span className="text-[10px] font-mono uppercase text-zinc-500">Outerwear</span>
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-900/60 border border-white/5 flex items-center justify-center">
                    {combinatorSlots.outerwear ? (
                      <ImageWithFade src={combinatorSlots.outerwear.imageUrl || getGarmentImage(combinatorSlots.outerwear.title)} alt="Outerwear" />
                    ) : (
                      <Plus className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-300 font-medium truncate w-full">
                    {combinatorSlots.outerwear?.title || 'Select Coat'}
                  </span>
                </div>

                {/* Top Slot */}
                <div 
                  onClick={() => setActiveSlotPicker('top')}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col items-center text-center space-y-2 group"
                >
                  <span className="text-[10px] font-mono uppercase text-zinc-500">Top Layer</span>
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-900/60 border border-white/5 flex items-center justify-center">
                    {combinatorSlots.top ? (
                      <ImageWithFade src={combinatorSlots.top.imageUrl || getGarmentImage(combinatorSlots.top.title)} alt="Top" />
                    ) : (
                      <Plus className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-300 font-medium truncate w-full">
                    {combinatorSlots.top?.title || 'Select Top'}
                  </span>
                </div>

                {/* Bottom Slot */}
                <div 
                  onClick={() => setActiveSlotPicker('bottom')}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col items-center text-center space-y-2 group"
                >
                  <span className="text-[10px] font-mono uppercase text-zinc-500">Bottom</span>
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-900/60 border border-white/5 flex items-center justify-center">
                    {combinatorSlots.bottom ? (
                      <ImageWithFade src={combinatorSlots.bottom.imageUrl || getGarmentImage(combinatorSlots.bottom.title)} alt="Bottom" />
                    ) : (
                      <Plus className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-300 font-medium truncate w-full">
                    {combinatorSlots.bottom?.title || 'Select Pants'}
                  </span>
                </div>

                {/* Footwear Slot */}
                <div 
                  onClick={() => setActiveSlotPicker('footwear')}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col items-center text-center space-y-2 group"
                >
                  <span className="text-[10px] font-mono uppercase text-zinc-500">Footwear</span>
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-900/60 border border-white/5 flex items-center justify-center">
                    {combinatorSlots.footwear ? (
                      <ImageWithFade src={combinatorSlots.footwear.imageUrl || getGarmentImage(combinatorSlots.footwear.title)} alt="Footwear" />
                    ) : (
                      <Plus className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-300 font-medium truncate w-full">
                    {combinatorSlots.footwear?.title || 'Select Shoes'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  const activeItems = Object.values(combinatorSlots).filter(Boolean) as WardrobeItem[];
                  if (activeItems.length === 0) {
                    showToast('Select at least one piece to save combination.', 'warning');
                    return;
                  }
                  registerCombination(activeItems);
                  showToast('Sartorial combination saved to memory archive!', 'success');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                <span>Save Combination</span>
              </button>

              <button
                onClick={() => handleNavigate('VIRTUAL_TRY')}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Test Live Fit</span>
              </button>
            </div>
          </div>

          {/* Card 4: Multi-Modal Visual Ingestion Card (4 Cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-[#07070c]/80 border border-white/5 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-violet-500/20 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-purple-400" />
                  <span>Visual Ingestion</span>
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Gemini Vision</span>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />

              {!scanResult && !isScanning && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-xl p-6 text-center space-y-3 cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03] group"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-zinc-200 block">Upload or capture garment</span>
                    <span className="text-[10px] text-zinc-500">Auto-extracts silhouette, hue, and fabric traits</span>
                  </div>
                </div>
              )}

              {isScanning && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                  <span className="text-xs font-mono text-zinc-400">Parsing sartorial attributes...</span>
                </div>
              )}

              {scanResult && (
                <div className="space-y-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    {scanResult.previewUrl && (
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-zinc-900/60 border border-white/5">
                        <img src={scanResult.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{scanResult.name}</h4>
                      <span className="text-[10px] font-mono text-emerald-400">{scanResult.category} • {(scanResult.confidence * 100).toFixed(0)}% confidence</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/5">
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase">Color</span>
                      <span className="text-zinc-300 font-medium">{scanResult.primaryColor}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase">Material</span>
                      <span className="text-zinc-300 font-medium">{scanResult.material}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveScannedGarment}
                    className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm & Add to Closet</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-[10px] text-zinc-500 italic text-center pt-3">
              Multi-modal engine automatically standardizes metadata for wardrobe algorithms.
            </p>
          </div>

        </div>

        {/* Slot Picker Modal */}
        <AnimatePresence>
          {activeSlotPicker && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-[#0c0c14] border border-white/10 rounded-2xl p-6 space-y-4 text-left shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                    Select {activeSlotPicker} piece
                  </h3>
                  <button 
                    onClick={() => setActiveSlotPicker(null)}
                    className="text-zinc-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                  {wardrobe.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCombinatorSlots(prev => ({ ...prev, [activeSlotPicker]: item }));
                        setActiveSlotPicker(null);
                        showToast(`Selected ${item.title}`, 'info');
                      }}
                      className="p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/40 cursor-pointer space-y-1.5 group transition-all"
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900/60">
                        <ImageWithFade src={item.imageUrl || getGarmentImage(item.title)} alt={item.title} />
                      </div>
                      <span className="text-[10px] font-medium text-zinc-300 block truncate group-hover:text-indigo-400">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const appContent = (
    <div className="h-screen w-screen overflow-hidden bg-[#05050a] text-zinc-100 flex select-text">
      
      {/* Fixed Left Navigation Sidebar */}
      <aside className="w-64 h-full bg-[#07070c] border-r border-white/5 flex flex-col justify-between z-30 shrink-0 select-none">
        
        {/* Brand & Logo */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div 
            onClick={() => handleNavigate('PRODUCT_HOME')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold font-mono tracking-widest uppercase text-white">LOOK VISION</h1>
              <span className="text-[9px] font-mono text-zinc-500">AI Fashion OS</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
          
          {/* Section: AI Operations (Indigo / Violet highlights) */}
          <div className="space-y-1">
            <span className="px-3 text-[9px] font-mono uppercase tracking-widest text-indigo-400/70 font-semibold block">
              AI Intelligence
            </span>

            <button
              onClick={() => handleNavigate('PRODUCT_HOME')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'PRODUCT_HOME'
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Shirt className={`w-4 h-4 ${activeSubTab === 'PRODUCT_HOME' ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <span>Home Hub & Bento</span>
            </button>

            <button
              onClick={() => handleNavigate('PRODUCT_AI_CREATIONS')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'PRODUCT_AI_CREATIONS'
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeSubTab === 'PRODUCT_AI_CREATIONS' ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <span>AI Creations Studio</span>
            </button>

            <button
              onClick={() => handleNavigate('STYLE_STREAM')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'STYLE_STREAM'
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Zap className={`w-4 h-4 ${activeSubTab === 'STYLE_STREAM' ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <span className="flex items-center gap-1.5">
                <span>AI Style Stream</span>
                <span className="px-1 py-0.2 rounded bg-indigo-500/20 text-[8px] font-mono text-indigo-300 font-bold border border-indigo-500/30">60FPS</span>
              </span>
            </button>

            <button
              onClick={() => handleNavigate('VIRTUAL_TRY')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'VIRTUAL_TRY'
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Eye className={`w-4 h-4 ${activeSubTab === 'VIRTUAL_TRY' ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <span>Virtual Studio Try-On</span>
            </button>

            <button
              onClick={() => handleNavigate('AI_ASSISTANT')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'AI_ASSISTANT'
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Cpu className={`w-4 h-4 ${activeSubTab === 'AI_ASSISTANT' ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <span>ARIA Stylist Brain</span>
            </button>

            <button
              onClick={() => handleNavigate('FASHION_INSTRUCTOR')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'FASHION_INSTRUCTOR'
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Award className={`w-4 h-4 ${activeSubTab === 'FASHION_INSTRUCTOR' ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <span>Fashion Academy</span>
            </button>
          </div>

          {/* Section: Closet & Community */}
          <div className="space-y-1">
            <span className="px-3 text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-semibold block">
              Wardrobe & Social
            </span>

            <button
              onClick={() => handleNavigate('WARDROBE')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'WARDROBE'
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Layers className={`w-4 h-4 ${activeSubTab === 'WARDROBE' ? 'text-white' : 'text-zinc-500'}`} />
              <span>Digital Closet Vault</span>
            </button>

            <button
              onClick={() => handleNavigate('PRODUCT_COMMUNITY')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'PRODUCT_COMMUNITY'
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Users className={`w-4 h-4 ${activeSubTab === 'PRODUCT_COMMUNITY' ? 'text-white' : 'text-zinc-500'}`} />
              <span>Community Lookbooks</span>
            </button>

            <button
              onClick={() => handleNavigate('DISCOVER')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'DISCOVER'
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Compass className={`w-4 h-4 ${activeSubTab === 'DISCOVER' ? 'text-white' : 'text-zinc-500'}`} />
              <span>Discover Trends</span>
            </button>

            <button
              onClick={() => handleNavigate('CREATOR_WORKSPACE')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'CREATOR_WORKSPACE'
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Palette className={`w-4 h-4 ${activeSubTab === 'CREATOR_WORKSPACE' ? 'text-white' : 'text-zinc-500'}`} />
              <span>Creator Workspace</span>
            </button>
          </div>

          {/* Section: Commerce & Marketplace (Emerald Green highlights) */}
          <div className="space-y-1">
            <span className="px-3 text-[9px] font-mono uppercase tracking-widest text-emerald-400/80 font-semibold block">
              Commerce & Boutique
            </span>

            <button
              onClick={() => handleNavigate('PRODUCT_MARKETPLACE')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'PRODUCT_MARKETPLACE'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${activeSubTab === 'PRODUCT_MARKETPLACE' ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>Marketplace Boutique</span>
            </button>

            <button
              onClick={() => setIsSellerDashboardOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/5 transition-all cursor-pointer"
            >
              <Store className="w-4 h-4 text-emerald-500/70" />
              <span>Seller Studio</span>
            </button>

            <button
              onClick={() => handleNavigate('VENDOR_ONBOARDING')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'VENDOR_ONBOARDING'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                  : 'text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/5'
              }`}
            >
              <Building className={`w-4 h-4 ${activeSubTab === 'VENDOR_ONBOARDING' ? 'text-emerald-400' : 'text-emerald-500/70'}`} />
              <span className="flex items-center gap-1.5">
                <span>Vendor Onboarding</span>
                <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-[8px] font-mono text-emerald-300 font-bold border border-emerald-500/30">90%</span>
              </span>
            </button>
          </div>

          {/* Section: System & Settings */}
          <div className="space-y-1">
            <span className="px-3 text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-semibold block">
              System Settings
            </span>

            <button
              onClick={() => handleNavigate('SYSTEM_ROOM')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'SYSTEM_ROOM'
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Settings className="w-4 h-4 text-zinc-500" />
              <span>Diagnostics & Audits</span>
            </button>

            <button
              onClick={() => handleNavigate('ADMIN_COMMAND')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'ADMIN_COMMAND'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin Gateway</span>
            </button>
          </div>

        </div>

        {/* User Profile & Logout Bottom Bar */}
        <div className="p-4 border-t border-white/5 bg-[#05050a]/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white truncate block">{user?.email || 'Guest User'}</span>
                <span className="text-[10px] font-mono text-zinc-500 truncate block">Pro Subscription</span>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* Main Canvas Workspace Container */}
      <main className="flex-1 h-full overflow-y-auto bg-[#05050a] p-4 md:p-8 relative">
        <div className="max-w-7xl mx-auto">
          {renderCurrentView()}
        </div>
      </main>

      {/* Floating ARIA Assistant Panel Drawer */}
      <AnimatePresence>
        {isARIAPanelOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-96 shadow-2xl">
            <ARIAAssistantPanel 
              isOpen={isARIAPanelOpen}
              onClose={() => setIsARIAPanelOpen(false)} 
            />
          </div>
        )}
      </AnimatePresence>

      {/* Focus Search Palette Modal */}
      <FocusSearchPalette 
        isOpen={isFocusSearchOpen} 
        onClose={() => setIsFocusSearchOpen(false)}
        onNavigate={(tab) => {
          handleNavigate(tab as any);
          setIsFocusSearchOpen(false);
        }}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      />

      {/* Seller Dashboard Modal */}
      <AnimatePresence>
        {isSellerDashboardOpen && (
          <SellerDashboard 
            user={user} 
            onClose={() => setIsSellerDashboardOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`pointer-events-auto px-4 py-2.5 rounded-xl border text-xs font-medium shadow-2xl flex items-center gap-2.5 backdrop-blur-xl ${
                toast.type === 'warning'
                  ? 'bg-amber-950/80 border-amber-500/30 text-amber-200'
                  : toast.type === 'info'
                  ? 'bg-indigo-950/80 border-indigo-500/30 text-indigo-200'
                  : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );

  if (coatDNA) {
    return (
      <ThemeCoatRenderer coatDNA={coatDNA} className="w-full h-full min-h-screen">
        {appContent}
      </ThemeCoatRenderer>
    );
  }

  return appContent;
};
