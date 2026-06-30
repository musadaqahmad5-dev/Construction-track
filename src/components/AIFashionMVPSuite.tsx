import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Loader2, 
  Shirt, 
  Tag, 
  Compass, 
  AlertTriangle, 
  Coins, 
  Activity, 
  ShoppingBag,
  Award,
  Layers,
  Cpu,
  Database,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Info,
  Copy,
  Check,
  Bookmark,
  FileText,
  Lock,
  User,
  History,
  Cloud,
  Save,
  Trash2,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { FirestoreService } from '../lib/firestoreService';
import { UnifiedFashionOS } from '../features/ai-core/UnifiedFashionOS';

interface OutfitItem {
  items: {
    top: string;
    bottom: string;
    shoes: string;
  };
  scores: {
    style_match: number;
    occasion_match: number;
    trend_alignment: number;
    comfort: number;
    commercial_value: number;
    revenue_priority_score: number;
    total_score: number;
  };
  affiliate_potential: boolean;
  fashion_reason: string;
  why_this_works?: string;
  where_to_wear?: string;
  confidence?: number;
  quick_alternative?: string;
  imageUrl?: string;
}

interface UserProfile {
  style: string;
  occasion: string;
  fashion_maturity_score: number;
  style_drift_index: number;
  trend_adoption_level: number;
  confidence: number;
}

interface StyleEvolution {
  style_evolution_curve: string;
  preference_drift_forecast: string;
}

interface ControlPlane {
  decision_type: string;
  api_cost_optimization: boolean;
  response_enhanced: boolean;
}

interface SystemHealth {
  confidence: number;
  quality_score: number;
}

interface MonetizationSummary {
  best_conversion_outfit_index: number;
  high_value_picks: string[];
}

interface FiosResponse {
  mode: string;
  tenant_id: string;
  control_plane: ControlPlane;
  user_profile: UserProfile;
  style_evolution: StyleEvolution;
  outfits: OutfitItem[];
  final_recommendation: string;
  quick_summary?: string;
  why_this_works?: string;
  style_title?: string;
  style_summary?: string;
  monetization_summary: MonetizationSummary;
  system_health: SystemHealth;
}

export const AIFashionMVPSuite: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tab states for Assistant vs Studio
  const [activeTab, setActiveTab] = useState<'STYLIST' | 'STUDIO'>('STYLIST');

  // Interactive Imagen Fashion Studio state
  const [studioGender, setStudioGender] = useState<'male' | 'female' | 'unisex'>('unisex');
  const [studioTheme, setStudioTheme] = useState('Streetwear');
  const [studioFormality, setStudioFormality] = useState<'Casual' | 'Semi-formal' | 'Formal'>('Casual');
  const [studioUpper, setStudioUpper] = useState('Bomber Jacket');
  const [studioUpperColor, setStudioUpperColor] = useState('Beige Wool');
  const [studioLower, setStudioLower] = useState('Tailored Trousers');
  const [studioLowerColor, setStudioLowerColor] = useState('Slate Gray');
  const [studioShoes, setStudioShoes] = useState('Minimalist White Sneakers');
  const [studioShoesColor, setStudioShoesColor] = useState('Off-White');
  const [studioHeadwear, setStudioHeadwear] = useState('Structured Baseball Cap');
  const [studioHeadwearColor, setStudioHeadwearColor] = useState('Midnight Blue');
  const [studioSetting, setStudioSetting] = useState('an elegant architectural studio with soft daylight and concrete textures');
  const [studioVibe, setStudioVibe] = useState('clean, editorial, high-end fashion catalog');
  
  const [studioGeneratedImage, setStudioGeneratedImage] = useState<string | null>(null);
  const [studioGenerating, setStudioGenerating] = useState(false);
  const [studioError, setStudioError] = useState<string | null>(null);

  // V3 Productization states
  const [systemState, setSystemState] = useState<'READY' | 'LOADING' | 'RETRY' | 'OFFLINE'>('READY');
  const [generatedCount, setGeneratedCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [outfitFeedback, setOutfitFeedback] = useState<Record<number, string>>({});

  // Real Image Generation states
  const [outfitImages, setOutfitImages] = useState<Record<number, string>>({});
  const [generatingImage, setGeneratingImage] = useState<Record<number, boolean>>({});
  const [imageError, setImageError] = useState<Record<number, string>>({});

  // Isolated multi-tenant dropdown switcher
  const [selectedTenant, setSelectedTenant] = useState('enterprise-lux-01');

  // Session memory states (PHASE 2 - IN-MEMORY ONLY)
  const [lastStyle, setLastStyle] = useState<string>('');
  const [lastOccasion, setLastOccasion] = useState<string>('');
  const [lastGeneratedLooks, setLastGeneratedLooks] = useState<FiosResponse | null>(null);

  // Sharing states
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sharedCount, setSharedCount] = useState(0);
  const [similarClickedCount, setSimilarClickedCount] = useState(0);
  const [surpriseClickedCount, setSurpriseClickedCount] = useState(0);

  // Phase 1 - Outfit Memory Board
  const [recentLooks, setRecentLooks] = useState<{ id: string; styleTitle: string; timestamp: string; data: FiosResponse }[]>([]);

  // Phase 4 - Micro Delight Notice
  const [delightNotice, setDelightNotice] = useState<string | null>(null);

  // Firestore Sync & Loading States
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [savingOutfit, setSavingOutfit] = useState<Record<number, boolean>>({});
  const [savingStyle, setSavingStyle] = useState<boolean>(false);
  const [savingRec, setSavingRec] = useState<boolean>(false);

  const handleGenerateStudioImage = async () => {
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setStudioError("Device is currently offline");
      return;
    }

    setStudioGenerating(true);
    setStudioError(null);

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

      const garmentsList = [];
      if (studioUpper && studioUpper !== 'None') {
        garmentsList.push({ title: studioUpper, category: 'Upper Garment', primaryColor: studioUpperColor });
      }
      if (studioLower && studioLower !== 'None') {
        garmentsList.push({ title: studioLower, category: 'Lower Garment', primaryColor: studioLowerColor });
      }
      if (studioShoes && studioShoes !== 'None') {
        garmentsList.push({ title: studioShoes, category: 'Shoes', primaryColor: studioShoesColor });
      }
      if (studioHeadwear && studioHeadwear !== 'None') {
        garmentsList.push({ title: studioHeadwear, category: 'Headwear', primaryColor: studioHeadwearColor });
      }

      const response = await fetch('/api/image-generation/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          theme: studioTheme,
          vibe: studioVibe,
          garments: garmentsList,
          gender: studioGender,
          formality: studioFormality,
          season: 'All-Season',
          setting: studioSetting,
          provider: 'imagen'
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setStudioGeneratedImage(data.imageUrl);
        setDelightNotice("✓ Premium Studio Lookbook Photo Generated!");
        setGeneratedCount(prev => prev + 1);
      } else {
        throw new Error(data.error || "No image was returned from the generator");
      }
    } catch (err: any) {
      console.error("[Studio Image Gen Error]:", err);
      setStudioError(err.message || "Failed to generate studio visual.");
    } finally {
      setStudioGenerating(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          // Sync user configuration/profile to 'users' collection
          await FirestoreService.saveUserProfile(user.uid, {
            displayName: user.displayName || 'Fashion Analyst',
            email: user.email || '',
            stylePreference: 'Modern Minimalist',
            occasionPreference: 'Office / Occasion',
            fashionMaturityScore: 85,
            styleDriftIndex: 0.15,
            trendAdoptionLevel: 3
          });

          // Preload recent saved outfits
          const dbOutfits = await FirestoreService.getOutfits();
          if (dbOutfits.length > 0) {
            setRecentLooks(dbOutfits.map(o => ({
              id: o.id || Date.now().toString(),
              styleTitle: o.title,
              timestamp: o.createdAt?.toDate ? o.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              data: {
                mode: "NORMAL",
                tenant_id: selectedTenant,
                control_plane: { decision_type: "saas", api_cost_optimization: true, response_enhanced: true },
                user_profile: { style: o.title, occasion: "Saved", fashion_maturity_score: 85, style_drift_index: 0.15, trend_adoption_level: 3, confidence: 90 },
                style_evolution: { style_evolution_curve: "Steady", preference_drift_forecast: "Stable" },
                outfits: o.items.map((item, idx) => {
                  const base = typeof item === 'string' 
                    ? { items: { top: item, bottom: '', shoes: '' }, scores: { style_match: 90, occasion_match: 90, trend_alignment: 90, comfort: 90, commercial_value: 90, revenue_priority_score: 90, total_score: 90 }, affiliate_potential: false, fashion_reason: 'Saved outfit combination.' } 
                    : { ...item };
                  if (idx === 0 && o.imageUrl) {
                    base.imageUrl = o.imageUrl;
                  }
                  return base;
                }),
                final_recommendation: o.description || "",
                monetization_summary: { best_conversion_outfit_index: 0, high_value_picks: [] },
                system_health: { confidence: 95, quality_score: 95 }
              } as FiosResponse
            })));
          }

          // Preload saved styles into styleJourney
          const dbStyles = await FirestoreService.getStyles();
          if (dbStyles.length > 0) {
            setStyleJourney(dbStyles.map(s => ({
              timestamp: s.createdAt?.toDate ? s.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              style_title: s.title,
              confidence: 95,
              mood: s.description || 'Saved Preference',
              style_family: s.tags.join(', ') || 'Custom Style',
              interaction_count: 1
            })));
          }

          // Preload recommendations
          const dbRecs = await FirestoreService.getRecommendations();
          if (dbRecs.length > 0 && !lastGeneratedLooks) {
            const r = dbRecs[0];
            setFiosData({
              mode: "NORMAL",
              tenant_id: selectedTenant,
              control_plane: { decision_type: "saas", api_cost_optimization: true, response_enhanced: true },
              user_profile: { style: r.title, occasion: "Personal Curation", fashion_maturity_score: 85, style_drift_index: 0.15, trend_adoption_level: 3, confidence: 90 },
              style_evolution: { style_evolution_curve: "Steady", preference_drift_forecast: "Stable" },
              outfits: r.outfits,
              final_recommendation: r.finalRecommendation,
              monetization_summary: { best_conversion_outfit_index: 0, high_value_picks: [] },
              system_health: { confidence: 95, quality_score: 95 }
            } as FiosResponse);
          }
        } catch (err) {
          console.error("Failed to load user collections from Firestore:", err);
        } finally {
          setIsSyncing(false);
        }
      }
    });
    return () => unsubscribe();
  }, [selectedTenant]);

  // Growth, Journey, & Intelligence States (PHASE 1, 2, 3)
  const [saves, setSaves] = useState(0);
  const [compares, setCompares] = useState(0);
  const [refineActions, setRefineActions] = useState(0);
  const [reopenActions, setReopenActions] = useState(0);
  const [styleJourney, setStyleJourney] = useState<{ timestamp: string; style_title: string; confidence: number; mood: string; style_family: string; interaction_count: number }[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  // Dynamic conversion health calculation
  const totalInteractions = generatedCount + sharedCount + similarClickedCount + surpriseClickedCount + saves + compares + refineActions + reopenActions;
  const conversionHealth: 'EXPLORING' | 'ENGAGED' | 'POWER_USER' = 
    totalInteractions >= 5 ? 'POWER_USER' : 
    totalInteractions >= 2 ? 'ENGAGED' : 'EXPLORING';

  // Refine loop states (PHASE 3)
  const [refineValue, setRefineValue] = useState('');
  const [showRefineInput, setShowRefineInput] = useState(false);

  // Inactivity tracking (Auto-clear on inactivity of 3 minutes)
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setLastStyle('');
        setLastOccasion('');
        setLastGeneratedLooks(null);
        setFiosData(null);
        setGeneratedCount(0);
        setRecentLooks([]);
        setStyleJourney([]);
        setSaves(0);
        setCompares(0);
        setRefineActions(0);
        setReopenActions(0);
        setSharedCount(0);
        setSimilarClickedCount(0);
        setSurpriseClickedCount(0);
      }, 180000); // 3 minutes
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer();
    setDelightNotice("Welcome back");

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, []);

  // Multi-tenant simulated database memory slots
  const tenantMemories: Record<string, string> = {
    'enterprise-lux-01': 'Curated autumn minimal fits',
    'streetwear-edge-02': 'Avant-garde heavy textured apparel',
    'vintage-retail-03': 'Nostalgic modern crossover looks'
  };

  // State parameters holding the complete FIOS Contract response
  const [fiosData, setFiosData] = useState<FiosResponse | null>(null);
  
  // Step tracker during cognitive pipeline synthesis
  const [loadingStep, setLoadingStep] = useState('Initializing SaaS Gateway...');

  // Phase 1 "Try these styles" chips
  const suggestions = [
    { label: "🌸 Summer wedding", value: "Summer wedding style — Elegant formal lightweight tailoring fit for upscale garden events" },
    { label: "👟 Streetwear", value: "Streetwear style — Avant-garde urban garments utilizing relaxed proportions and comfortable layers" },
    { label: "💼 Quiet luxury", value: "Quiet luxury style — High-quality cashmere, fine knits, trousers and tailored pieces with zero branding" },
    { label: "👔 Office minimal", value: "Office minimal style — Clean-cut corporate essential pieces balancing aesthetic form and extreme comfort" }
  ];

  // Phase 2 rotating inspiration (Today's Style Mood)
  const styleMoods = [
    { title: "Clean Minimal", desc: "A sleek combination of neutral tones, sharp lines, and functional modern layers.", suggestion: "Clean-cut minimal coordinates featuring high-contrast tailoring" },
    { title: "Summer Energy", desc: "Vibrant, lightweight fabrics styled for breezy daytime events and radiant warmth.", suggestion: "Summer pastel tones and relaxed breathable linen sets" },
    { title: "Soft Luxury", desc: "Indulgent knitwear, cashmere layering, and tailored wool trousers for effortless elegance.", suggestion: "Quiet luxury aesthetic coordinates using soft beige and sand tones" },
    { title: "Smart Casual", desc: "Sophisticated structured pieces and fine knitwear that effortlessly bridge corporate and leisure.", suggestion: "Structured blazer and tailored trousers with comfortable minimalist shoes" }
  ];

  const currentDayIndex = typeof window !== 'undefined' ? (new Date().getDate() % styleMoods.length) : 0;
  const todaysMood = styleMoods[currentDayIndex];

  const handleGenerate = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setError("Try again in a moment");
      setSystemState('OFFLINE');
      setFiosData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSystemState('LOADING');
    setFiosData(null);
    setOutfitImages({});
    setGeneratingImage({});
    setImageError({});

    // Simulated micro-pipeline steps using human wording
    const steps = [
      'Authenticating style preference model...',
      'Analyzing wardrobe layer combinations...',
      'Optimizing climate weight profiles...',
      'Curation in synthesis...',
      'Assembling coordinates...',
      'Refining retail conversion values...'
    ];
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
        stepIndex++;
      }
    }, 550);

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

      const response = await fetch('/.netlify/functions/recommend-mvp', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          userInput: trimmed,
          tenantId: selectedTenant
        }),
      });

      if (!response.ok) {
        throw new Error(`Cloud gateway failure`);
      }

      const data = await response.json();
      
      if (data && (data.mode === "CONFIG_ERROR" || data.mode === "GEMINI_FAILED" || data.mode === "GEMINI_PARSE_ERROR")) {
        throw new Error("Fashion Intelligence Engine executed with terminal exception.");
      }
      
      if (data && Array.isArray(data.outfits) && data.user_profile && data.monetization_summary) {
        setFiosData(data);
        const nextGenCount = generatedCount + 1;
        setGeneratedCount(nextGenCount);
        setSystemState('READY');
        setDelightNotice("✓ Looks prepared");

        // Fire analytics events
        UnifiedFashionOS.trackEvent('recommendation_generated', {
          style_title: data.style_title || data.quick_summary,
          occasion: data.user_profile?.occasion,
          style: data.user_profile?.style,
        });
        UnifiedFashionOS.trackEvent('image_generated', {
          count: data.outfits?.length || 1,
        });

        // Add to Recent Looks (PHASE 1)
        const lookTitle = data.style_title || data.quick_summary || trimmed || "Curated Look";
        const newLook = {
          id: Date.now().toString(),
          styleTitle: lookTitle.length > 50 ? lookTitle.slice(0, 47) + "..." : lookTitle,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          data: data
        };
        setRecentLooks(prev => {
          const filtered = prev.filter(item => item.styleTitle !== newLook.styleTitle);
          return [newLook, ...filtered].slice(0, 5);
        });

        // Store Style Journey Item (PHASE 2)
        const journeyItem = {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          style_title: lookTitle.length > 40 ? lookTitle.slice(0, 37) + "..." : lookTitle,
          confidence: data.system_health?.confidence || data.outfits[0]?.confidence || 92,
          mood: data.user_profile.style || 'Minimalist',
          style_family: data.user_profile.occasion || 'Daily Casual',
          interaction_count: totalInteractions + 1
        };
        setStyleJourney(prev => [journeyItem, ...prev]);

        // Store current browser session looks (PHASE 2)
        setLastStyle(trimmed);
        setLastOccasion(data.user_profile.occasion || 'General Curation');
        setLastGeneratedLooks(data);
      } else {
        throw new Error('Retrieved output failed response validation.');
      }
    } catch (err: any) {
      console.error('[AIFashionMVPSuite] Error compiling FIOS request:', err);
      setError(err?.message || "Error compiling style request. Try again in a moment.");
      setSystemState('RETRY');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleGenerateOutfitImage = async (index: number) => {
    const outfit = fiosData?.outfits[index];
    if (!outfit) return;

    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setImageError(prev => ({ ...prev, [index]: "Device is currently offline" }));
      return;
    }

    setGeneratingImage(prev => ({ ...prev, [index]: true }));
    setImageError(prev => ({ ...prev, [index]: '' }));

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

      const garmentsList = [];
      if (outfit.items?.top) garmentsList.push({ title: outfit.items.top, category: 'Top', primaryColor: 'Selected' });
      if (outfit.items?.bottom) garmentsList.push({ title: outfit.items.bottom, category: 'Bottom', primaryColor: 'Selected' });
      if (outfit.items?.shoes) garmentsList.push({ title: outfit.items.shoes, category: 'Shoes', primaryColor: 'Selected' });

      const response = await fetch('/api/image-generation/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          theme: fiosData.user_profile?.style || 'Minimalist',
          vibe: outfit.fashion_reason || 'highly curated editorial fashion look',
          garments: garmentsList,
          gender: 'unisex',
          formality: 'Casual',
          season: (fiosData.user_profile as any)?.season || 'All-Season',
          setting: 'an elegant architectural studio with soft daylight and high-end concrete textures',
          provider: 'imagen'
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setOutfitImages(prev => ({ ...prev, [index]: data.imageUrl }));
        setDelightNotice("✓ Lookbook Photo Generated!");
      } else {
        throw new Error(data.error || "No image was returned from the generator");
      }
    } catch (err: any) {
      console.error("[Image Gen Error]:", err);
      setImageError(prev => ({ ...prev, [index]: err.message || "Failed to generate visual." }));
    } finally {
      setGeneratingImage(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleFeedback = (outfitIndex: number, feedback: string) => {
    setOutfitFeedback(prev => ({ ...prev, [outfitIndex]: feedback }));
    if (feedback === 'love_it') {
      setAcceptedCount(prev => prev + 1);
    }
  };

  const handleSaveOutfit = async (index: number) => {
    if (!auth.currentUser) {
      setDelightNotice("Please sign in to save looks to Firestore");
      return;
    }
    const outfit = fiosData?.outfits[index];
    if (!outfit) return;

    setSavingOutfit(prev => ({ ...prev, [index]: true }));
    try {
      const outfitId = await FirestoreService.createOutfit({
        title: fiosData?.style_title || `Curated Look 0${index + 1}`,
        description: outfit.fashion_reason || outfit.why_this_works || '',
        items: [outfit.items?.top, outfit.items?.bottom, outfit.items?.shoes].filter(Boolean),
        imageUrl: outfitImages[index] || undefined
      });
      setSaves(prev => prev + 1);
      setDelightNotice("✓ Saved to cloud outfits collection");
      
      const savedData = {
        ...fiosData!,
        outfits: fiosData!.outfits.map((o, idx) => 
          idx === index ? { ...o, imageUrl: outfitImages[index] } : o
        )
      };

      const newLook = {
        id: outfitId,
        styleTitle: fiosData?.style_title || `Curated Look 0${index + 1}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: savedData
      };
      setRecentLooks(prev => [newLook, ...prev].slice(0, 5));
    } catch (err) {
      console.error("Error saving outfit:", err);
      setDelightNotice("Failed to save outfit to Firestore");
    } finally {
      setSavingOutfit(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleDeleteOutfit = async (lookId: string) => {
    if (!auth.currentUser) {
      setDelightNotice("Please sign in to modify configurations");
      return;
    }
    try {
      await FirestoreService.deleteOutfit(lookId);
      setRecentLooks(prev => prev.filter(look => look.id !== lookId));
      setDelightNotice("✓ Deleted outfit from cloud collection");
    } catch (err) {
      console.error("Error deleting outfit:", err);
      setDelightNotice("Failed to delete outfit from cloud");
    }
  };

  const handleSaveStyle = async () => {
    if (!auth.currentUser) {
      setDelightNotice("Please sign in to save style configurations");
      return;
    }
    if (!fiosData) return;

    setSavingStyle(true);
    try {
      await FirestoreService.createStyle({
        title: fiosData.style_title || "My Preferred Look",
        description: fiosData.user_profile.style || "Minimalist Curation",
        tags: [fiosData.user_profile.occasion || "General"]
      });
      setCompares(prev => prev + 1);
      setDelightNotice("✓ Added to cloud styles collection");

      const journeyItem = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        style_title: fiosData.style_title || "My Preferred Look",
        confidence: fiosData.system_health?.confidence || 95,
        mood: fiosData.user_profile.style || 'Minimalist',
        style_family: fiosData.user_profile.occasion || 'Daily Casual',
        interaction_count: totalInteractions + 1
      };
      setStyleJourney(prev => [journeyItem, ...prev]);
    } catch (err) {
      console.error("Error saving style:", err);
      setDelightNotice("Failed to save style to Firestore");
    } finally {
      setSavingStyle(false);
    }
  };

  const handleSaveRecommendation = async () => {
    if (!auth.currentUser) {
      setDelightNotice("Please sign in to save curation recommendations");
      return;
    }
    if (!fiosData) return;

    setSavingRec(true);
    try {
      await FirestoreService.createRecommendation({
        title: fiosData.style_title || "Curation Recommendation",
        finalRecommendation: fiosData.final_recommendation,
        outfits: fiosData.outfits
      });
      setDelightNotice("✓ Added to cloud recommendations collection");
    } catch (err) {
      console.error("Error saving recommendation:", err);
      setDelightNotice("Failed to save recommendation to Firestore");
    } finally {
      setSavingRec(false);
    }
  };

  // Derived engagement score (LOW | MEDIUM | HIGH)
  const engagementScore = generatedCount === 0
    ? 'LOW'
    : (acceptedCount / generatedCount >= 0.7
      ? 'HIGH'
      : (acceptedCount / generatedCount >= 0.3 ? 'MEDIUM' : 'LOW'));

  // Dynamic Favorite Interaction calculation
  let favoriteInteraction = "Style Curation";
  if (sharedCount > similarClickedCount && sharedCount > surpriseClickedCount) {
    favoriteInteraction = "Outfit Sharing";
  } else if (similarClickedCount > sharedCount && similarClickedCount > surpriseClickedCount) {
    favoriteInteraction = "Variation Exploration";
  } else if (surpriseClickedCount > sharedCount && surpriseClickedCount > similarClickedCount) {
    favoriteInteraction = "Surprise Generator";
  }

  // Current Exploration Level
  const explorationLevel: 'Light' | 'Active' | 'Deep' = 
    totalInteractions >= 4 ? 'Deep' : 
    totalInteractions >= 2 ? 'Active' : 'Light';

  return (
    <div className="w-full bg-white/[0.01] border border-white/5 rounded-2xl p-5 md:p-6 space-y-6 text-left selection:bg-white/10" id="ai-fashion-fios-container">
      
      {/* 1. CONTROLS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shadow-md">
            <Cpu className="w-5 h-5 text-indigo-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[9px] font-mono uppercase tracking-[0.15em] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded">FIOS V5 SaaS</span>
              
              <span className={`text-[8.5px] font-mono uppercase border px-1.5 rounded leading-none py-0.5 font-bold ${
                conversionHealth === 'POWER_USER' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                conversionHealth === 'ENGAGED' ? 'bg-blue-500/20 text-blue-350 border-blue-500/30' :
                'bg-zinc-500/20 text-zinc-400 border-white/5'
              }`}>
                {conversionHealth} Model
              </span>

              {/* User states representation */}
              {systemState === 'READY' && (
                <span className="text-[8px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 rounded leading-none py-0.5">READY</span>
              )}
              {systemState === 'LOADING' && (
                <span className="text-[8px] font-mono uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-300/30 px-1.5 rounded leading-none py-0.5 animate-pulse">LOADING</span>
              )}
              {systemState === 'RETRY' && (
                <span className="text-[8px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 rounded leading-none py-0.5">RETRY</span>
              )}
              {systemState === 'OFFLINE' && (
                <span className="text-[8px] font-mono uppercase bg-neutral-500/20 text-neutral-400 border border-white/10 px-1.5 rounded leading-none py-0.5">OFFLINE</span>
              )}
            </div>
            <h2 className="text-base font-serif font-semibold text-white tracking-wide">Fashion Intelligence Operating System</h2>
          </div>
        </div>

        {/* Tenant Switcher & Real-time Active Tag */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-[8px] font-mono text-white/30 uppercase block leading-none">Sandbox Status</span>
            <span className="text-[10px] text-indigo-300 font-mono font-medium flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Authorized
            </span>
          </div>
          
          <div className="bg-black/30 border border-white/5 p-1 rounded-lg flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-indigo-400 ml-1.5" />
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              disabled={loading}
              className="bg-black/60 text-[10.5px] font-mono text-white font-medium border-none outline-none py-1 pr-2 rounded cursor-pointer select-none"
            >
              <option value="enterprise-lux-01">Tenant: LUX_01 (Retail-Max)</option>
              <option value="streetwear-edge-02">Tenant: STREET_02 (Gen-Z)</option>
              <option value="vintage-retail-03">Tenant: VINTAGE_03 (Classic)</option>
            </select>
          </div>
        </div>
      </div>

      {/* PHASE 4 — MICRO DELIGHT NOTICE */}
      {delightNotice && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2.5 rounded-xl flex items-center justify-between text-indigo-300 text-xs font-mono font-medium">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{delightNotice}</span>
          </div>
          <button 
            onClick={() => setDelightNotice(null)}
            className="text-[9px] uppercase tracking-wider text-white/40 hover:text-white font-bold ml-2 cursor-pointer font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* PHASE 5 — RELEASE CONFIDENCE */}
      <div className="flex flex-wrap gap-2 text-[9px] font-mono border-t border-b border-white/5 py-3">
        <span className="text-white/30 uppercase tracking-widest font-bold">Release Confidence:</span>
        <div className="flex items-center gap-1.5 bg-[#121212]/50 px-2 py-0.5 rounded border border-white/5">
          <span className="text-zinc-500">User Delight:</span>
          <span className="text-emerald-400 font-bold">Excellent</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#121212]/50 px-2 py-0.5 rounded border border-white/5">
          <span className="text-zinc-500">Session Quality:</span>
          <span className="text-indigo-400 font-bold">Strong</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#121212]/50 px-2 py-0.5 rounded border border-white/5">
          <span className="text-zinc-500">Repeat Intent:</span>
          <span className="text-purple-400 font-bold">Improving</span>
        </div>
      </div>

      {/* 1.5 PREMIUM VIEW TAB SWITCHER */}
      <div className="flex border-b border-white/10 p-1 bg-black/45 rounded-xl max-w-md mx-auto sm:mx-0">
        <button
          onClick={() => setActiveTab('STYLIST')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'STYLIST'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-md shadow-indigo-500/5'
              : 'text-zinc-400 hover:text-white border border-transparent cursor-pointer'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Stylist Curator</span>
        </button>
        <button
          onClick={() => setActiveTab('STUDIO')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'STUDIO'
              ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-white border border-purple-500/30 shadow-md shadow-purple-500/5'
              : 'text-zinc-400 hover:text-white border border-transparent cursor-pointer'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-purple-400" />
          <span>Fashion Look Studio</span>
        </button>
      </div>

      {activeTab === 'STYLIST' ? (
        <>
          {/* 2. PROMPT CONSOLE INPUT ZONE OR RETURN TRIGGER CAP */}
      {generatedCount >= 3 ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-950/25 via-purple-950/25 to-zinc-950/40 border border-indigo-500/20 p-6 md:p-8 rounded-2xl space-y-5 text-left relative overflow-hidden"
          id="ai-fios-return-trigger"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Cpu className="w-20 h-20 text-white" />
          </div>
          
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="text-[9.5px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Limit Reached</span>
              <span className="text-[9.5px] font-mono text-zinc-400">FIOS Usage Policy</span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-white tracking-wide">
              You've explored enough styles for today.
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              To guarantee optimal server latency and cost protection across active luxury clusters, generations are capped at 3 sessions. Save your active curation below, or click Continue to reset your session space.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                const title = fiosData?.style_title || "FIOS Curated Style";
                const summary = fiosData?.style_summary || "";
                let outfitsText = "";
                if (fiosData?.outfits) {
                  outfitsText = fiosData.outfits.map((o, i) => `Look 0${i+1}:\nTop: ${o.items?.top}\nBottom: ${o.items?.bottom}\nShoes: ${o.items?.shoes}`).join("\n\n");
                }
                const saveText = `FIOS Curated Style Series:\nTitle: ${title}\nSummary: ${summary}\n\n${outfitsText}`;
                navigator.clipboard.writeText(saveText);
                setDelightNotice("✓ Style copied");
              }}
              className="px-4 py-3 bg-[#121212] hover:bg-neutral-800 text-white font-mono text-xs font-semibold rounded-xl border border-white/10 transition-colors select-none min-h-[44px] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Save Idea</span>
            </button>
            
            <button
              onClick={() => {
                setGeneratedCount(0);
                setFiosData(null);
                setLastGeneratedLooks(null);
              }}
              className="px-6 py-3 bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 font-mono text-xs font-semibold rounded-xl border border-indigo-500/25 transition-colors select-none min-h-[44px] cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Continue</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Query structural outfit recommendations (e.g. minimalist autumn layers, avant-garde designer wear...)"
                className="w-full bg-black/40 hover:bg-black/50 focus:bg-black/80 text-xs text-white placeholder-white/20 border border-white/5 focus:border-indigo-500/30 rounded-xl py-3.5 px-4 outline-none transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate(userInput);
                }}
                disabled={loading}
                id="ai-fios-user-input"
              />
            </div>
            <button
              onClick={() => handleGenerate(userInput)}
              disabled={loading || !userInput.trim()}
              className="cursor-pointer bg-white text-black hover:bg-neutral-200 disabled:bg-white/5 disabled:text-white/20 border border-transparent font-sans py-3.5 px-6 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 select-none"
              id="ai-fios-generate-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Building your looks</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Styles</span>
                </>
              )}
            </button>
          </div>

          {/* Live Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[8.5px] font-mono text-white/30 tracking-wider mr-1 uppercase">Try these styles:</span>
            {suggestions.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserInput(chip.value);
                  handleGenerate(chip.value);
                }}
                disabled={loading}
                className="cursor-pointer text-[9.5px] font-mono text-white/60 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 px-2.5 py-1.5 rounded-lg transition-all active:scale-95 font-medium"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 1 — OUTFIT MEMORY BOARD */}
      {recentLooks.length > 0 && (
        <div className="bg-[#121212]/30 border border-white/5 p-4 rounded-xl space-y-3">
          <div className="flex items-center gap-1.5 justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Recent Looks</span>
            </div>
            <span className="text-[8px] font-mono text-zinc-500">In-Session Caches ({recentLooks.length}/5)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
            {recentLooks.map((look) => (
              <div 
                key={look.id}
                className="bg-black/45 border border-white/5 rounded-lg p-2.5 flex flex-col justify-between space-y-2 text-left"
              >
                <div>
                  <span className="text-[10.5px] text-white/90 font-serif leading-tight block font-medium truncate">
                    {look.styleTitle}
                  </span>
                  <span className="text-[8.5px] font-mono text-zinc-500 block">
                    {look.timestamp}
                  </span>
                </div>
                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      setFiosData(look.data);
                      setSystemState('READY');
                      setDelightNotice("Welcome back");
                    }}
                    className="flex-1 text-center py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-mono text-[9px] rounded border border-indigo-500/25 transition-all cursor-pointer select-none active:scale-95"
                  >
                    Reopen Look
                  </button>
                  <button
                    onClick={() => handleDeleteOutfit(look.id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 hover:text-red-300 rounded transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
                    title="Delete look"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 2 — CONTINUE YOUR LAST STYLE SESSION MEMORY BANNER */}
      {lastGeneratedLooks && !fiosData && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs text-indigo-300 font-mono font-bold uppercase tracking-wider">Continue your last style</p>
              <p className="text-xs text-white/85">Resume looks for: <span className="font-serif italic font-medium">"{lastStyle}"</span> ({lastOccasion})</p>
            </div>
          </div>
          <button
            onClick={() => {
              setFiosData(lastGeneratedLooks);
              setSystemState('READY');
            }}
            className="cursor-pointer bg-white text-black font-sans text-xs font-bold px-3.5 py-1.5 rounded-lg active:scale-95 transition-all select-none"
          >
            Restore Session
          </button>
        </motion.div>
      )}

      {/* PHASE 1 — FIRST IMPRESSION ENGINE */}
      {!fiosData && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pt-2"
        >
          {/* One-line Value Proposition */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-xs font-mono text-indigo-400 uppercase tracking-[0.2em] font-semibold">Intelligence Operating System</p>
            <p className="text-sm font-serif italic text-zinc-300 leading-relaxed">
              Find luxury style configurations tailored for your specific events and climate within seconds.
            </p>
          </div>

          {/* Empty-state Illustration Section */}
          <div className="py-10 bg-black/25 rounded-2xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-6 px-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            
            <div className="space-y-2 max-w-sm">
              <h2 className="text-base font-serif font-semibold text-white tracking-wide">
                Start Curation Journey
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                FIOS curates personalized luxury style coordinates designed for your unique events and seasonal weather profiles.
              </p>
            </div>

            <div className="bg-[#121212]/40 border border-white/5 rounded-xl p-4 max-w-xs w-full text-left space-y-2.5">
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">What users can do:</p>
              <ul className="text-xs text-zinc-300 space-y-2 font-sans">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Explore outfits</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Refine ideas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Save inspiration</span>
                </li>
              </ul>
            </div>
          </div>

          {/* PHASE 2 — DAILY DISCOVERY */}
          <div className="bg-gradient-to-r from-[#121212]/40 via-purple-950/10 to-transparent border border-purple-500/10 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-[9px] font-mono text-purple-300 uppercase tracking-widest font-bold">Today's Style Mood</span>
              </div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">Local Rotation</span>
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-serif font-semibold text-white tracking-wide">{todaysMood.title}</h4>
              <p className="text-xs text-zinc-300 font-light leading-relaxed font-sans">{todaysMood.desc}</p>
            </div>
            <button
              onClick={() => {
                setUserInput(todaysMood.suggestion);
                handleGenerate(todaysMood.suggestion);
              }}
              className="px-4 py-2.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 font-mono text-xs font-semibold rounded-xl border border-purple-500/20 transition-all select-none min-h-[44px] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>✦ Curation Loop: Apply "{todaysMood.title}" Mood</span>
            </button>
          </div>

          {/* Example Prompts Panel */}
          <div className="bg-[#121212]/30 border border-white/5 p-5 rounded-2xl space-y-3.5">
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Example Prompts</span>
              <p className="text-xs text-zinc-400 pt-0.5 leading-relaxed">Select any prompt concept below to immediately configure coordinated looks:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div 
                onClick={() => {
                  setUserInput("Summer wedding style");
                  handleGenerate("Summer wedding style");
                }}
                className="cursor-pointer group p-4 bg-white/[0.01] hover:bg-indigo-500/[0.04] border border-white/5 hover:border-indigo-500/30 rounded-xl transition-all text-left"
              >
                <span className="text-xs font-mono text-indigo-400 block font-bold mb-1">→ Summer wedding</span>
                <span className="text-xs text-zinc-350 group-hover:text-white transition-colors block font-serif italic">"Elegant formal lightweight tailoring fit for upscale garden events."</span>
              </div>

              <div 
                onClick={() => {
                  setUserInput("Streetwear style");
                  handleGenerate("Streetwear style");
                }}
                className="cursor-pointer group p-4 bg-white/[0.01] hover:bg-indigo-500/[0.04] border border-white/5 hover:border-indigo-500/30 rounded-xl transition-all text-left"
              >
                <span className="text-xs font-mono text-indigo-400 block font-bold mb-1">→ Streetwear</span>
                <span className="text-xs text-zinc-350 group-hover:text-white transition-colors block font-serif italic">"Avant-garde urban garments utilizing relaxed proportions and comfortable layers."</span>
              </div>

              <div 
                onClick={() => {
                  setUserInput("Quiet luxury style");
                  handleGenerate("Quiet luxury style");
                }}
                className="cursor-pointer group p-4 bg-white/[0.01] hover:bg-indigo-500/[0.04] border border-white/5 hover:border-indigo-500/30 rounded-xl transition-all text-left"
              >
                <span className="text-xs font-mono text-indigo-400 block font-bold mb-1">→ Quiet luxury</span>
                <span className="text-xs text-zinc-350 group-hover:text-white transition-colors block font-serif italic">"High-quality cashmere, fine knits & tailored trousers with zero branding."</span>
              </div>

              <div 
                onClick={() => {
                  setUserInput("Office minimal style");
                  handleGenerate("Office minimal style");
                }}
                className="cursor-pointer group p-4 bg-white/[0.01] hover:bg-indigo-500/[0.04] border border-white/5 hover:border-indigo-500/30 rounded-xl transition-all text-left"
              >
                <span className="text-xs font-mono text-indigo-400 block font-bold mb-1">→ Office minimal</span>
                <span className="text-xs text-zinc-350 group-hover:text-white transition-colors block font-serif italic">"Clean-cut corporate essential pieces balancing form and extreme comfort."</span>
              </div>
            </div>
          </div>

          {/* PHASE 2 — PREMIUM EXPERIENCES */}
          <div className="bg-[#121212]/30 border border-white/5 p-5 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Premium Styling Packs</span>
                <p className="text-xs text-zinc-400 pt-0.5 leading-relaxed">Elite personalized capsules configured by matching designer curves with regional micro-climates.</p>
              </div>
              <span className="text-[8px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase font-bold tracking-wider shrink-0 select-none">Preview Mode</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative overflow-hidden p-4 bg-white/[0.01] border border-white/5 rounded-xl text-left select-none group">
                <div className="absolute top-2 right-2 text-[8px] font-mono bg-zinc-850 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-bold select-none border border-white/5">
                  Coming Soon
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-xs font-mono text-zinc-300 block font-bold">🍂 Seasonal Pack</span>
                  <p className="text-[10px] text-zinc-400 font-serif italic">"Auto-synchronizing lightweight autumn Cashmere and Linen coats with current weather reports."</p>
                </div>
              </div>

              <div className="relative overflow-hidden p-4 bg-white/[0.01] border border-white/5 rounded-xl text-left select-none group">
                <div className="absolute top-2 right-2 text-[8px] font-mono bg-zinc-850 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-bold select-none border border-white/5">
                  Coming Soon
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-xs font-mono text-zinc-300 block font-bold">🌟 Celebrity Inspired</span>
                  <p className="text-[10px] text-zinc-400 font-serif italic">"High-contrast Hollywood tailoring profiles modeled on golden-era aesthetic coordinates."</p>
                </div>
              </div>

              <div className="relative overflow-hidden p-4 bg-white/[0.01] border border-white/5 rounded-xl text-left select-none group">
                <div className="absolute top-2 right-2 text-[8px] font-mono bg-zinc-850 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-bold select-none border border-white/5">
                  Coming Soon
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-xs font-mono text-zinc-300 block font-bold">👔 Occasion Deep Styling</span>
                  <p className="text-[10px] text-zinc-400 font-serif italic">"Bespoke formal coordinates specifically prepared for upscale dinners and high-profile galas."</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. SIMULATED DISPATCH LOADER */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-14 flex flex-col items-center justify-center text-center space-y-4 bg-black/20 rounded-2xl border border-white/5 border-dashed"
            id="ai-fios-loading-view"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 border border-indigo-500/20 rounded-full animate-ping absolute" />
              <div className="w-10 h-10 border-2 border-white/15 border-t-indigo-400 rounded-full animate-spin" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-serif italic text-white animate-pulse font-medium">
                Preparing styles
              </p>
              <p className="text-[9px] font-mono text-indigo-300 uppercase tracking-widest block pt-0.5 font-bold">
                Curation Loop Active
              </p>
            </div>

            {/* Skeleton Placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl px-4 pt-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4 animate-pulse text-left">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <div className="h-3.5 bg-white/10 rounded-md w-1/3" />
                    <div className="h-3 bg-white/10 rounded-md w-1/4" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 bg-white/5 rounded-lg" />
                    <div className="h-10 bg-white/5 rounded-lg" />
                    <div className="h-10 bg-white/5 rounded-lg" />
                  </div>
                  <div className="h-14 bg-white/5 rounded-lg" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 4. EXCEPTION CAPTURING */}
        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-neutral-900/50 border border-neutral-800 rounded-xl flex items-start gap-3.5 text-left"
            id="ai-fios-error-view"
          >
            <div className="p-2.5 bg-neutral-800 text-rose-400 rounded-xl shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-rose-350 font-bold">Status Alert</h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium">
                {error || "An unexpected error occurred. Please check your connection or try a different concept."}
              </p>
              <button 
                onClick={() => handleGenerate(userInput)}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 cursor-pointer block select-none font-bold"
              >
                ✦ Retry Generation
              </button>
            </div>
          </motion.div>
        )}

        {/* 5. LIVE CONTROL PLANE SaaS DASHBOARD */}
        {fiosData && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
            id="ai-fios-telemetry-payload"
          >
            {/* Success State Indicator (Phase 5) */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl flex items-center justify-between gap-2 text-emerald-400 text-xs font-mono font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 animate-pulse" />
                <span>Looks ready</span>
              </div>
              <span className="text-[9px] opacity-60">FIOS Curation Loop Completed</span>
            </div>
            
            {/* Session Summary Card (PHASE 4 — SESSION COMPLETION) */}
            <div className="bg-[#121212]/45 border border-white/5 p-5 rounded-2xl space-y-4 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none font-mono text-[70px] font-extrabold leading-none select-none">
                FIOS
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold">Session Summary</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-1">
                  <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">Styles Generated</span>
                  <span className="text-sm font-sans font-semibold text-white">{generatedCount} Look{generatedCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-1">
                  <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">Favorite Interaction</span>
                  <span className="text-sm font-sans font-semibold text-white truncate block">{favoriteInteraction}</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-1">
                  <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">Current Exploration Level</span>
                  <span className={`text-sm font-sans font-bold ${
                    explorationLevel === 'Deep' ? 'text-purple-400' :
                    explorationLevel === 'Active' ? 'text-indigo-400' : 'text-zinc-400'
                  }`}>{explorationLevel}</span>
                </div>
              </div>
            </div>

            {/* User Profile & Habit Drift Memory Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Profile Memory Details */}
              <div className="bg-[#121212]/30 border border-white/5 p-4 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold">1. Client Identity DNA</span>
                  <span className="text-[8.5px] font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded">Memory Log</span>
                </div>
                
                <div className="space-y-2 text-left pt-1 text-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-white/[0.03]">
                    <span className="text-white/40">Style Tag:</span>
                    <span className="text-white font-serif font-medium">{fiosData.user_profile?.style}</span>
                  </div>

                  <div className="flex items-center justify-between pb-1 border-b border-white/[0.03]">
                    <span className="text-white/40">Context/Occasion:</span>
                    <span className="text-white/80 font-sans">{fiosData.user_profile?.occasion}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Inference Confidence:</span>
                    <span className="text-amber-300 font-mono font-bold">{fiosData.user_profile?.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Long-Term Memory: Evolution curves */}
              <div className="bg-[#121212]/30 border border-white/5 p-4 rounded-xl space-y-2.5">
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-bold block">2. Style Evolution Curve</span>
                <p className="text-[11px] text-zinc-300 leading-normal font-sans pt-0.5 font-light">
                  {fiosData.style_evolution?.style_evolution_curve}
                </p>
                <div className="flex items-center gap-1 text-[8px] font-mono text-purple-300/60 uppercase">
                  <TrendingUp className="w-3 h-3 text-purple-400" />
                  <span>Evolution trend forecasted</span>
                </div>
              </div>

              {/* Long-Term Memory: Preference drift */}
              <div className="bg-[#121212]/30 border border-white/5 p-4 rounded-xl space-y-2.5">
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">3. Taste Preference Drift</span>
                <p className="text-[11px] text-zinc-300 leading-normal font-sans pt-0.5 font-light">
                  {fiosData.style_evolution?.preference_drift_forecast}
                </p>
                <div className="flex items-center gap-1 text-[8px] font-mono text-emerald-300/60 uppercase">
                  <Coins className="w-3 h-3 text-emerald-400" />
                  <span>Preference drift aligned</span>
                </div>
              </div>

            </div>

            {/* PHASE 1 — VALUE PERCEPTION ENGINE */}
            <div className="bg-gradient-to-r from-indigo-950/20 via-purple-950/15 to-transparent border border-indigo-500/15 p-6 rounded-xl space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-mono text-indigo-400 uppercase tracking-[0.2em] font-bold">Recommended Style Collection</p>
                <h3 className="text-xl font-serif font-semibold text-white tracking-wide leading-tight">
                  {fiosData.style_title || "Modern Capital Curation"}
                </h3>
              </div>
              <p className="text-xs text-zinc-300 font-light leading-relaxed max-w-3xl font-sans">
                {fiosData.style_summary || "Elegant neutral layers matching your specified style concept."}
              </p>
            </div>

            {/* Generated & Governance Enforced Outfit Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
              {fiosData.outfits.slice(0, 3).map((outfit, index) => {
                const isBestMonetized = fiosData.monetization_summary?.best_conversion_outfit_index === index;
                const isPrimary = index === 0;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08, duration: 0.35 }}
                    className={`p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between space-y-4 text-left relative border ${
                      isPrimary 
                        ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.12)] bg-indigo-500/[0.03]' 
                        : 'border-white/5 hover:border-white/10 bg-black/30'
                    }`}
                    id={`fios-look-card-${index}`}
                  >
                    <div className="space-y-4">
                      {/* Primary / Alternative Pick & Confidence Label Indicators */}
                      <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isPrimary ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-zinc-400 border border-white/5'
                          }`}>
                            {isPrimary ? '✦ Primary Pick' : 'Alternative Pick'}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500">Look 0{index + 1}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-zinc-500 font-mono">Confidence Label:</span>
                          <span className="text-emerald-400 font-mono font-bold">
                            {(outfit.confidence || 92) >= 90 ? 'Exceptional Match' : 'High Quality'}
                          </span>
                        </div>
                      </div>

                      {/* Premium AI Lookbook Image Section */}
                      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-950/80 border border-white/5 group/img">
                        {(outfitImages[index] || outfit.imageUrl) ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={outfitImages[index] || outfit.imageUrl} 
                              alt={`AI Lookbook ${index + 1}`} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[9px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/5">
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                                IMAGEN 4.0 ACTIVE
                              </span>
                              <span className="text-zinc-400">High-Fidelity</span>
                            </div>
                          </div>
                        ) : generatingImage[index] ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-3 bg-black/45 backdrop-blur-sm">
                            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-zinc-300 block uppercase tracking-wider animate-pulse">
                                Synthesizing Look...
                              </span>
                              <span className="text-[8px] font-mono text-zinc-500 block">
                                Curation in synthesis via cloud GPU
                              </span>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleGenerateOutfitImage(index)}
                            className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2 cursor-pointer transition-all bg-[#121214]/60 hover:bg-indigo-950/20 w-full h-full border-none outline-none"
                          >
                            <div className="p-3 rounded-full bg-white/[0.02] border border-white/5 group-hover/img:border-indigo-500/30 group-hover/img:bg-indigo-500/5 transition-all">
                              <ImageIcon className="w-5 h-5 text-zinc-400 group-hover/img:text-indigo-400 transition-colors" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-wider block group-hover/img:text-indigo-300 transition-colors">
                                ✦ Visualize Style Photo
                              </span>
                              <span className="text-[8px] font-mono text-zinc-500 block max-w-[200px] mx-auto leading-relaxed">
                                Generate a photorealistic 3:4 lookbook image for this outfit
                              </span>
                            </div>
                          </button>
                        )}

                        {imageError[index] && (
                          <div className="absolute inset-x-2 bottom-2 bg-rose-500/10 border border-rose-500/20 rounded-md p-1.5 text-center">
                            <p className="text-[8px] font-mono text-rose-300 leading-tight">
                              Error: {imageError[index]}
                            </p>
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); handleGenerateOutfitImage(index); }}
                              className="text-[8px] font-mono text-white underline mt-0.5 hover:text-rose-200"
                            >
                              Retry Visual Generation
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Wearable specific garments display */}
                      <div className="space-y-2">
                        {outfit.items?.top && (
                          <div className="flex items-start gap-2 bg-white/[0.01] border border-white/5 rounded-lg p-2 hover:bg-white/[0.03] transition-colors">
                            <Shirt className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                            <div className="text-left">
                              <span className="text-[8px] font-mono text-white/30 uppercase block">Fabric Top Coordinate</span>
                              <span className="text-[10.5px] text-white/90 leading-snug block font-medium">{outfit.items.top}</span>
                            </div>
                          </div>
                        )}

                        {outfit.items?.bottom && (
                          <div className="flex items-start gap-2 bg-white/[0.01] border border-white/5 rounded-lg p-2 hover:bg-white/[0.03] transition-colors">
                            <svg className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 3h16l2 9h-4l-1 9-5-2-5 2-1-9H2l2-9z" />
                            </svg>
                            <div className="text-left">
                              <span className="text-[8px] font-mono text-white/30 uppercase block">Undergarment Base</span>
                              <span className="text-[10.5px] text-white/90 leading-snug block font-medium">{outfit.items.bottom}</span>
                            </div>
                          </div>
                        )}

                        {outfit.items?.shoes && (
                          <div className="flex items-start gap-2 bg-white/[0.01] border border-white/5 rounded-lg p-2 hover:bg-white/[0.03] transition-colors">
                            <svg className="w-3.5 h-3.5 text-amber-500/70 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 18c0-3 .5-4.5 1.5-6C6 9.5 8 8 11.5 8h1S14 8 14 11.5v3.5c0 1.5.5 2.5 1.5 h.5M21 18a2 2 0 1 1-4 0v-4" />
                              <rect x="2" y="18" width="20" height="2" rx="1" />
                            </svg>
                            <div className="text-left">
                              <span className="text-[8px] font-mono text-white/30 uppercase block">Footwear Co-ordinate</span>
                              <span className="text-[10.5px] text-white/90 leading-snug block font-medium">{outfit.items.shoes}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Matrix Metrics panel */}
                      <div className="bg-black/40 border border-white/5 rounded-lg p-2.5 space-y-2">
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest block">Quality Dimension Scores</span>
                        
                        <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-white/40">Style:</span>
                            <span className="text-indigo-300 font-mono font-medium">{outfit.scores?.style_match}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Context:</span>
                            <span className="text-purple-300 font-mono font-medium">{outfit.scores?.occasion_match}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Trend align:</span>
                            <span className="text-emerald-300 font-mono font-medium">{outfit.scores?.trend_alignment}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Comfort:</span>
                            <span className="text-amber-300 font-mono font-medium">{outfit.scores?.comfort}%</span>
                          </div>
                          <div className="flex justify-between col-span-2 pt-1 border-t border-white/5 text-[9.5px]">
                            <span className="text-emerald-400 font-mono opacity-85 font-medium">Revenue Priority:</span>
                            <span className="text-emerald-400 font-mono font-bold">{outfit.scores?.revenue_priority_score || 80}%</span>
                          </div>
                        </div>

                        <div className="flex justify-between pt-1 border-t border-white/5 text-[10.5px]">
                          <span className="text-white/80 font-serif font-bold">Weighted Total:</span>
                          <span className="text-indigo-400 font-mono font-extrabold">{outfit.scores?.total_score}</span>
                        </div>
                      </div>

                    </div>

                    {/* V3 Advanced Consumer Metrics */}
                    <div className="space-y-2.5 pt-3 border-t border-white/5 text-xs">
                      <div>
                        <span className="text-[8px] font-mono text-white/30 uppercase block font-bold text-indigo-300">Where to Wear</span>
                        <p className="font-sans font-light leading-snug text-[10.5px] text-white/95">{outfit.where_to_wear || "Daily meetings and elegant social dinners."}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[8px] font-mono text-white/30 uppercase block font-bold text-amber-300">Quick Alternative</span>
                          <p className="font-sans font-light leading-snug text-[10px] text-white/80">{outfit.quick_alternative || "Clean leather trainers."}</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-white/30 uppercase block font-bold text-emerald-400">Confidence Match</span>
                          <p className="font-mono font-bold text-emerald-400 text-xs">{outfit.confidence || 92}% Match</p>
                        </div>
                      </div>

                      {/* PHASE 3 — DECISION ASSIST */}
                      <div className="bg-white/[0.01] border border-white/5 rounded-lg p-2.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-mono text-zinc-400 uppercase font-bold tracking-wider">Wear Confidence</span>
                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            (outfit.scores?.total_score || outfit.confidence || 90) >= 88 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            (outfit.scores?.total_score || outfit.confidence || 90) >= 75 ? 'bg-blue-500/10 text-indigo-300 border border-indigo-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {(outfit.scores?.total_score || outfit.confidence || 90) >= 88 ? 'STRONG' :
                             (outfit.scores?.total_score || outfit.confidence || 90) >= 75 ? 'GOOD' : 'LOW'}
                          </span>
                        </div>
                        <div className="space-y-1 pt-1.5 border-t border-white/5">
                          <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Best For</span>
                          <div className="grid grid-cols-3 gap-1 text-center">
                            <div className="bg-black/30 border border-white/5 rounded p-1">
                              <span className="text-[7px] text-white/45 block uppercase">Weather</span>
                              <span className="text-[9px] text-white/95 font-medium truncate block">
                                {outfit.scores?.comfort && outfit.scores.comfort > 85 ? 'Mild/Warm' : 'All Weather'}
                              </span>
                            </div>
                            <div className="bg-black/30 border border-white/5 rounded p-1">
                              <span className="text-[7px] text-white/45 block uppercase">Occasion</span>
                              <span className="text-[9px] text-white/95 font-medium truncate block">
                                {outfit.where_to_wear ? outfit.where_to_wear.split(' ')[0] : 'Sartorial'}
                              </span>
                            </div>
                            <div className="bg-black/30 border border-white/5 rounded p-1">
                              <span className="text-[7px] text-white/45 block uppercase">Comfort</span>
                              <span className="text-[9px] text-white/95 font-medium truncate block">
                                {outfit.scores?.comfort && outfit.scores.comfort >= 85 ? 'Strong' : 'Good'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {outfit.why_this_works && (
                        <div>
                          <span className="text-[8px] font-mono text-white/30 uppercase block font-bold text-purple-300">Sarto-Composition Detail</span>
                          <p className="font-sans font-light leading-relaxed text-[10px] text-[#dfd7c2]/80">{outfit.why_this_works}</p>
                        </div>
                      )}
                    </div>

                    {/* Reasoning write-up capsule */}
                    <div className="space-y-2 pt-3 border-t border-white/5 text-left text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider block font-bold text-zinc-400">Styling Rationale</span>
                        {outfit.affiliate_potential && (
                          <div className="flex items-center gap-1 text-emerald-400 text-[8px] font-mono bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">
                            <Coins className="w-2.5 h-2.5" />
                            <span>Affiliate Ready</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[10.5px] text-[#dfd7c2]/80 leading-relaxed font-sans font-light">
                        {outfit.fashion_reason}
                      </p>
                    </div>

                     {/* V3 Outfit Recommendation Feedback Engine (Phase B) & Social Share and Copier */}
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider font-bold">Feedback</span>
                        {outfitFeedback[index] === 'love_it' && (
                          <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Loved</span>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        <button
                          onClick={() => handleFeedback(index, 'love_it')}
                          disabled={outfitFeedback[index] !== undefined}
                          className={`text-[9px] font-mono py-1 rounded transition-all border text-center select-none cursor-pointer ${
                            outfitFeedback[index] === 'love_it'
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : 'bg-white/[0.01] hover:bg-white/[0.05] border-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          Love It
                        </button>
                        <button
                          onClick={() => handleFeedback(index, 'show_similar')}
                          disabled={outfitFeedback[index] !== undefined}
                          className={`text-[9px] font-mono py-1 rounded transition-all border text-center select-none cursor-pointer ${
                            outfitFeedback[index] === 'show_similar'
                              ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                              : 'bg-white/[0.01] hover:bg-white/[0.05] border-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          Similar
                        </button>
                        <button
                          onClick={() => handleFeedback(index, 'different_style')}
                          disabled={outfitFeedback[index] !== undefined}
                          className={`text-[9px] font-mono py-1 rounded transition-all border text-center select-none cursor-pointer ${
                            outfitFeedback[index] === 'different_style'
                              ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                              : 'bg-white/[0.01] hover:bg-white/[0.05] border-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          Different
                        </button>
                        <button
                          onClick={() => {
                            const title = fiosData?.quick_summary || "FIOS Curated Style";
                            const top = outfit.items?.top || "";
                            const bottom = outfit.items?.bottom || "";
                            const shoes = outfit.items?.shoes || "";
                            
                            const shareText = `My Fashion AI Look:
${title}

${top}
${bottom}
${shoes}`;

                            navigator.clipboard.writeText(shareText);
                            setCopiedIndex(index);
                            setSharedCount(prev => prev + 1);
                            setDelightNotice("✓ Style copied");
                            setTimeout(() => setCopiedIndex(null), 2500);
                          }}
                          className={`text-[9px] font-mono py-1 rounded transition-all border text-center select-none cursor-pointer flex items-center justify-center gap-1 ${
                            copiedIndex === index
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold'
                              : 'bg-white/[0.02] hover:bg-white/[0.07] border-white/10 text-white/80 hover:text-white'
                          }`}
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-2.5 h-2.5" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>Share</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Firestore Saving Loop */}
                      <div className="pt-2 border-t border-white/5 mt-2">
                        <button
                          onClick={() => handleSaveOutfit(index)}
                          disabled={savingOutfit[index]}
                          className="w-full text-[9.5px] font-mono py-1.5 rounded transition-all border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {savingOutfit[index] ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving to Firestore...</span>
                            </>
                          ) : (
                            <>
                              <Cloud className="w-3.5 h-3.5" />
                              <span>Save Outfit to Firestore</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* PHASE 3 — RECOMMENDATION LOOP PANEL */}
            <div className="bg-gradient-to-r from-purple-950/15 via-indigo-950/20 to-transparent border border-indigo-500/15 p-5 rounded-2xl space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-450 shrink-0 animate-spin-slow" />
                  <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest font-bold">Recommendation Loop</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const baseQuery = lastStyle || userInput;
                      setSimilarClickedCount(prev => prev + 1);
                      handleGenerate(`${baseQuery} with slight styling variation and alternative fabric texture coordinates`);
                    }}
                    disabled={loading}
                    className="cursor-pointer bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-white transition-all select-none font-medium"
                  >
                    ✦ Generate Similar
                  </button>
                  <button
                    onClick={() => {
                      setSurpriseClickedCount(prev => prev + 1);
                      const creativePrompts = [
                        "bold avant-garde runway fashion coordinates featuring dramatic textures",
                        "elegant resort attire with relaxed silk shirts and leather accessories",
                        "nightout metropolitan dark apparel with heavy visual contrast details",
                        "cozy winter ski lodge coordinates with heavy fine cashmere layering"
                      ];
                      const chosen = creativePrompts[Math.floor(Math.random() * creativePrompts.length)];
                      handleGenerate(chosen);
                    }}
                    disabled={loading}
                    className="cursor-pointer bg-purple-500/15 hover:bg-purple-500/30 active:scale-95 border border-purple-500/25 px-3.5 py-2 rounded-xl text-xs font-mono text-purple-300 transition-all select-none font-medium"
                  >
                    ⚡ Surprise Me
                  </button>
                  <button
                    onClick={() => setShowRefineInput(prev => !prev)}
                    className="cursor-pointer bg-indigo-500/15 hover:bg-indigo-500/30 active:scale-95 border border-indigo-500/25 px-3.5 py-2 rounded-xl text-xs font-mono text-indigo-300 transition-all select-none font-medium"
                  >
                    ✎ Refine Style
                  </button>
                </div>
              </div>

              {showRefineInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-3 border-t border-white/5 space-y-2.5"
                >
                  <p className="text-[10.5px] text-zinc-300 font-sans">Enter custom styling adjustments (e.g., darker accent palette, natural fabrics, relaxed cut sneakers):</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={refineValue}
                      onChange={(e) => setRefineValue(e.target.value)}
                      placeholder="e.g. add a heavy ribbed cashmere cardigan and black calfskin slippers..."
                      className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500/40"
                    />
                    <button
                      onClick={() => {
                        if (!refineValue.trim()) return;
                        const original = lastStyle || userInput;
                        handleGenerate(`${original} (Refinement adjustments: ${refineValue})`);
                        setRefineValue('');
                        setShowRefineInput(false);
                      }}
                      className="cursor-pointer bg-white text-black font-semibold text-xs px-4 py-2 rounded-xl hover:bg-neutral-200 transition-colors select-none"
                    >
                      Apply Refinement
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Combined Final Stylist Briefing & Monetization Dashboard Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              
              {/* Luxury Fashion consultant advice */}
              <div className="md:col-span-2 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 p-5 rounded-xl text-left space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <h4 className="text-[9.5px] font-mono uppercase tracking-wider text-indigo-300 font-bold">FIOS Consultant Styling Recommendation</h4>
                  </div>
                  <p className="text-xs text-white/85 leading-relaxed font-serif italic pt-2">
                    "{fiosData.final_recommendation}"
                  </p>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5 mt-3">
                    <button
                      onClick={handleSaveStyle}
                      disabled={savingStyle}
                      className="cursor-pointer text-[9.5px] font-mono py-1 px-2.5 rounded border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/25 text-purple-300 hover:text-white flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingStyle ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3" />
                          <span>Save Style Preset</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSaveRecommendation}
                      disabled={savingRec}
                      className="cursor-pointer text-[9.5px] font-mono py-1 px-2.5 rounded border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 hover:text-white flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingRec ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Saving Brief...</span>
                        </>
                      ) : (
                        <>
                          <Cloud className="w-3 h-3" />
                          <span>Save Recommendation Brief</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="text-[8px] font-mono text-white/30 pt-3 border-t border-white/5 uppercase">
                  Authorized sarto-adviser console signature
                </div>
              </div>

              {/* Monetization layer metrics */}
              {fiosData.monetization_summary && (
                <div className="bg-emerald-950/10 border border-emerald-500/15 p-5 rounded-xl text-left space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <h4 className="text-[9.5px] font-mono uppercase tracking-wider font-bold">Platform Conversion Layer</h4>
                    </div>

                    <div className="text-xs text-emerald-250/90 font-sans leading-relaxed pt-1">
                      <span className="text-white/45 block text-[8px] font-mono uppercase">Optimized Retail Target:</span>
                      Lookbook Outfit <span className="text-emerald-400 font-mono font-bold">#0{fiosData.monetization_summary.best_conversion_outfit_index + 1}</span> offers the peak purchase intent performance value.
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-emerald-500/10">
                    <span className="text-[8px] font-mono text-white/40 uppercase block">Affiliate High-Value Picks:</span>
                    <ul className="space-y-1">
                      {fiosData.monetization_summary.high_value_picks.map((pickText, index) => (
                        <li key={index} className="flex items-center gap-1.5 text-[10.5px] text-white/80">
                          <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{pickText}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>

          </motion.div>
        )}
      </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2"
        >
          {/* Left Panel: Configuration Form (7 columns) */}
          <div className="lg:col-span-7 bg-[#121212]/30 border border-white/5 p-6 rounded-2xl space-y-6 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-serif font-semibold text-white tracking-wide">Fashion & Style Look Studio</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Co-create and visualize custom high-fidelity model lookbook photos. Configure clothes, shoes, and caps for both men and women with real-time prompt building.
              </p>
            </div>

            {/* Selector: Gender representation */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">1. Model Gender Profile</label>
              <div className="grid grid-cols-3 gap-2">
                {(['female', 'male', 'unisex'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setStudioGender(g)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-bold capitalize border transition-all cursor-pointer ${
                      studioGender === g
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : 'bg-black/20 text-zinc-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {g === 'male' ? '👨 Men\'s Fashion' : g === 'female' ? '👩 Women\'s Fashion' : '👥 Unisex Style'}
                  </button>
                ))}
              </div>
            </div>

            {/* Clothing Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* UPPER CLOTHING */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">2. Upper Clothing / Top</label>
                <select
                  value={studioUpper}
                  onChange={(e) => setStudioUpper(e.target.value)}
                  className="w-full bg-black/40 text-xs text-white border border-white/5 rounded-xl p-3 outline-none focus:border-purple-500/30 cursor-pointer"
                >
                  <option value="Bomber Jacket">Casual Bomber Jacket</option>
                  <option value="Wool Cashmere Coat">Luxury Wool Cashmere Coat</option>
                  <option value="Silk Blend Double-Breasted Blazer">Elegant Silk Blend Blazer</option>
                  <option value="Heavy Knit Turtleneck Sweater">Fitted Heavy Knit Turtleneck</option>
                  <option value="Distressed Streetwear Hoodie">Distressed Streetwear Hoodie</option>
                  <option value="Minimalist Linen Button-Down Shirt">Minimalist Linen Button-Down</option>
                  <option value="Cropped Leather Biker Jacket">Cropped Leather Biker Jacket</option>
                  <option value="None">None (No Upper Piece)</option>
                </select>

                <select
                  value={studioUpperColor}
                  onChange={(e) => setStudioUpperColor(e.target.value)}
                  className="w-full bg-black/20 text-[11px] text-zinc-300 border border-white/5 rounded-lg p-2 outline-none focus:border-purple-500/20 cursor-pointer"
                >
                  <option value="Beige Wool">Beige Wool</option>
                  <option value="Sand Beige">Sand Beige</option>
                  <option value="Midnight Jet Black">Midnight Jet Black</option>
                  <option value="Emerald Green Velvet">Emerald Green Velvet</option>
                  <option value="Crimson Burgundy">Crimson Burgundy</option>
                  <option value="Soft Cream White">Soft Cream White</option>
                  <option value="Charcoal Gray">Charcoal Gray</option>
                </select>
              </div>

              {/* LOWER CLOTHING */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">3. Lower Clothing / Pants</label>
                <select
                  value={studioLower}
                  onChange={(e) => setStudioLower(e.target.value)}
                  className="w-full bg-black/40 text-xs text-white border border-white/5 rounded-xl p-3 outline-none focus:border-purple-500/30 cursor-pointer"
                >
                  <option value="Tailored Trousers">Tailored Pleated Trousers</option>
                  <option value="Wide-Leg Heavy Denim Jeans">Wide-Leg Heavy Denim Jeans</option>
                  <option value="A-Line Silk Wrap Skirt">A-Line Silk Wrap Skirt</option>
                  <option value="Structured Corduroy Utility Pants">Structured Corduroy Utility Pants</option>
                  <option value="Raw Edge Linen Chino Shorts">Raw Edge Linen Chino Shorts</option>
                  <option value="None">None (No Lower Piece)</option>
                </select>

                <select
                  value={studioLowerColor}
                  onChange={(e) => setStudioLowerColor(e.target.value)}
                  className="w-full bg-black/20 text-[11px] text-zinc-300 border border-white/5 rounded-lg p-2 outline-none focus:border-purple-500/20 cursor-pointer"
                >
                  <option value="Slate Gray">Slate Gray</option>
                  <option value="Classic Indigo Wash">Classic Indigo Wash</option>
                  <option value="Off-White Cream">Off-White Cream</option>
                  <option value="Warm Mocha Brown">Warm Mocha Brown</option>
                  <option value="Jet Black">Jet Black</option>
                </select>
              </div>

              {/* FOOTWEAR & SHOES */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">4. Footwear & Shoes</label>
                <select
                  value={studioShoes}
                  onChange={(e) => setStudioShoes(e.target.value)}
                  className="w-full bg-black/40 text-xs text-white border border-white/5 rounded-xl p-3 outline-none focus:border-purple-500/30 cursor-pointer"
                >
                  <option value="Minimalist White Sneakers">Minimalist White Sneakers</option>
                  <option value="Suede Chelsea Ankle Boots">Suede Chelsea Ankle Boots</option>
                  <option value="Patent Leather Penny Loafers">Patent Leather Penny Loafers</option>
                  <option value="Avant-Garde Chunky High-Tops">Avant-Garde Chunky High-Tops</option>
                  <option value="Chunky Platform Leather Sandals">Chunky Platform Leather Sandals</option>
                  <option value="None">None (No Shoes)</option>
                </select>

                <select
                  value={studioShoesColor}
                  onChange={(e) => setStudioShoesColor(e.target.value)}
                  className="w-full bg-black/20 text-[11px] text-zinc-300 border border-white/5 rounded-lg p-2 outline-none focus:border-purple-500/20 cursor-pointer"
                >
                  <option value="Off-White">Off-White</option>
                  <option value="Pristine Off-White">Pristine Off-White</option>
                  <option value="Rich Mahogany Brown">Rich Mahogany Brown</option>
                  <option value="Matte Obsidian Black">Matte Obsidian Black</option>
                  <option value="Polished Silver Metallic">Polished Silver Metallic</option>
                </select>
              </div>

              {/* HEADWEAR & CAPS */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">5. Headwear, Caps & Accessories</label>
                <select
                  value={studioHeadwear}
                  onChange={(e) => setStudioHeadwear(e.target.value)}
                  className="w-full bg-black/40 text-xs text-white border border-white/5 rounded-xl p-3 outline-none focus:border-purple-500/30 cursor-pointer"
                >
                  <option value="Structured Baseball Cap">Structured Baseball Cap</option>
                  <option value="Cozy Chunky Ribbed Beanie">Cozy Chunky Ribbed Beanie</option>
                  <option value="Classic Wool Wide-Brim Fedora">Classic Wool Wide-Brim Fedora</option>
                  <option value="Techwear Waterproof Bucket Hat">Techwear Waterproof Bucket Hat</option>
                  <option value="None">None (No Headwear)</option>
                </select>

                <select
                  value={studioHeadwearColor}
                  onChange={(e) => setStudioHeadwearColor(e.target.value)}
                  className="w-full bg-black/20 text-[11px] text-zinc-300 border border-white/5 rounded-lg p-2 outline-none focus:border-purple-500/20 cursor-pointer"
                >
                  <option value="Midnight Blue">Midnight Blue</option>
                  <option value="Deep Navy Blue">Deep Navy Blue</option>
                  <option value="Warm Buttercream">Warm Buttercream</option>
                  <option value="Muted Olive Green">Muted Olive Green</option>
                  <option value="Charcoal Black">Charcoal Black</option>
                </select>
              </div>

            </div>

            {/* Aesthetic Setting & Mood / Theme Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">6. Studio Background Setting</label>
                <select
                  value={studioSetting}
                  onChange={(e) => setStudioSetting(e.target.value)}
                  className="w-full bg-black/40 text-xs text-white border border-white/5 rounded-xl p-3 outline-none focus:border-purple-500/30 cursor-pointer"
                >
                  <option value="an elegant architectural studio with soft daylight and concrete textures">Brutalist Daylight Studio</option>
                  <option value="a cozy rustic cobblestone street in Paris during golden-hour autumn">Parisian Autumn Street</option>
                  <option value="a Tokyo urban nightscape with vibrant red and cyan neon reflections">Tokyo Cyberpunk Alley</option>
                  <option value="a sun-drenched marble courtyard of a classic Italian stone villa">Mediterranean Italian Villa</option>
                  <option value="an industrial raw steel art gallery warehouse space">Industrial Warehouse Gallery</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">7. Creative Vibe Theme</label>
                <select
                  value={studioTheme}
                  onChange={(e) => setStudioTheme(e.target.value)}
                  className="w-full bg-black/40 text-xs text-white border border-white/5 rounded-xl p-3 outline-none focus:border-purple-500/30 cursor-pointer"
                >
                  <option value="Streetwear">Streetwear Edge</option>
                  <option value="Quiet Luxury">Quiet Luxury Minimalist</option>
                  <option value="Avant-Garde Designer">Avant-Garde Designer</option>
                  <option value="Classic Vintage Retro">Classic Vintage Retro</option>
                  <option value="High Fashion Editorial">High Fashion Editorial</option>
                </select>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateStudioImage}
                disabled={studioGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-zinc-800 disabled:to-zinc-900 text-white font-sans py-4 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.99] select-none cursor-pointer shadow-lg shadow-purple-500/10 min-h-[44px]"
              >
                {studioGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Styling, rendering, and dressing model...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>Generate Lookbook Visual</span>
                  </>
                )}
              </button>
              {studioError && (
                <p className="text-red-400 text-[10px] font-mono text-center pt-2.5">
                  ⚠ {studioError}
                </p>
              )}
            </div>
          </div>

          {/* Right Panel: Lookbook Visualizer (5 columns) */}
          <div className="lg:col-span-5 bg-[#121212]/30 border border-white/5 p-6 rounded-2xl flex flex-col justify-between space-y-5 text-left">
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-bold block">Lookbook Display</span>
                <h4 className="text-sm font-serif font-semibold text-white tracking-wide">Studio Modeling Photo</h4>
              </div>

              {/* Lookbook Screen Frame */}
              <div className="relative aspect-[3/4] bg-black/60 rounded-xl overflow-hidden border border-white/5 flex flex-col items-center justify-center text-center p-4 shadow-inner group">
                {studioGenerating ? (
                  <div className="space-y-3.5 max-w-xs z-10">
                    <div className="relative w-12 h-12 mx-auto">
                      <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-purple-300 uppercase block tracking-wider animate-pulse">Imagen 4.0 Render Engine Active</span>
                      <p className="text-[10.5px] text-zinc-400 pt-1 leading-normal">
                        Dressing model with custom clothing, footwear, and cap matching...
                      </p>
                    </div>
                  </div>
                ) : studioGeneratedImage ? (
                  <>
                    <img
                      src={studioGeneratedImage}
                      alt="Studio Generated Fashion Outfit"
                      className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Editorial Telemetry Overlays */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 py-1 px-2.5 rounded text-[8px] font-mono text-purple-300 select-none">
                      MODEL: {studioGender.toUpperCase()}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md border border-white/10 p-2.5 rounded-lg text-left select-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-[8.5px] font-mono text-zinc-400 uppercase leading-none pb-1">Style Spec Matrix</p>
                      <p className="text-[9.5px] text-white font-sans font-medium line-clamp-2">
                        {studioUpper !== 'None' && `${studioUpperColor} ${studioUpper}, `}
                        {studioLower !== 'None' && `${studioLowerColor} ${studioLower}, `}
                        {studioShoes !== 'None' && `${studioShoesColor} ${studioShoes}`}
                        {studioHeadwear !== 'None' && ` and ${studioHeadwearColor} ${studioHeadwear}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 p-4 max-w-xs select-none">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20 mx-auto text-purple-400">
                      <ImageIcon className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10.5px] font-mono text-zinc-300 uppercase tracking-wider block font-bold text-center">Ready to Render</span>
                      <p className="text-[10px] text-zinc-500 pt-1 leading-relaxed text-center">
                        Configure customized clothes, footwear/shoes, and cap combinations, then launch your high-fidelity photorealistic look creation!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons under image */}
              {studioGeneratedImage && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(studioGeneratedImage);
                      setDelightNotice("✓ Image link copied to clipboard");
                    }}
                    className="cursor-pointer py-2.5 bg-black/40 hover:bg-neutral-800 border border-white/5 text-white font-mono text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors select-none"
                  >
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copy Link</span>
                  </button>
                  <a
                    href={studioGeneratedImage}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer py-2.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/20 text-purple-300 hover:text-white font-mono text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors text-center select-none"
                  >
                    <Compass className="w-3 h-3" />
                    <span>Open Original</span>
                  </a>
                </div>
              )}
            </div>

            {/* Sarto-tech specifications */}
            <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-2 text-[10.5px]">
              <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest font-bold block">Sartorial Specifications</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-500">Theme:</span>
                  <span className="text-white font-medium">{studioTheme}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-500">Formality:</span>
                  <span className="text-white font-medium">{studioFormality}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-500">Gender Ref:</span>
                  <span className="text-purple-300 font-medium capitalize">{studioGender}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-500">Engine:</span>
                  <span className="text-amber-400 font-medium">Google Imagen</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* PHASE 5 — TRUST & QUALITY FOOTER */}
      <footer className="text-center pt-8 pb-2 text-[10px] font-mono text-zinc-500 border-t border-white/5 mt-10">
        Fashion suggestions are generated to inspire exploration.
      </footer>
    </div>
  );
};
