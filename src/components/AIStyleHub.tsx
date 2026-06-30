import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Shield, Settings, AlertTriangle, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';
import { WardrobeItem } from '../types';
import { EmptyStateLibrary } from './EmptyStateLibrary';
import { 
  UnifiedFashionOS, 
  UnifiedState,
  UnifiedOutfit
} from '../features/ai-core/UnifiedFashionOS';
import { db } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { OutfitCard } from './OutfitCard';
import { WardrobeGrid } from './WardrobeGrid';
import { HomeFeed } from './HomeFeed';
import { StyleBadge } from './StyleBadge';
import { SystemHealthPanel } from './SystemHealthPanel';
import { FeedbackButtons } from './FeedbackButtons';
import { ProfileService, StyleProfile, StylistHistoryEntry } from '../features/wardrobe/profileService';
import { FounderDashboard } from './FounderDashboard';
import { FloatingAIChat } from './FloatingAIChat';

// Get current theme class specifically for details overlays & backdrops
function getTemporalThemeBackground() {
  const hr = new Date().getHours();
  if (hr >= 4 && hr < 12) {
    return "bg-[#1a1a1a]";
  } else if (hr >= 12 && hr < 18) {
    return "bg-[#0f0f0f]";
  } else {
    return "bg-[#050505]";
  }
}

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

// 4. IMAGE BEHAVIOR: Pristine 240ms opacity fade-in with film grain + printed matte style (Shelf Integrity F)
export const ImageWithFade: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [prevSrc, setPrevSrc] = useState<string | null>(null);
  const [isNewLoaded, setIsNewLoaded] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src !== currentSrc) {
      setPrevSrc(currentSrc);
      setCurrentSrc(src);
      setIsNewLoaded(false);
      setHasError(false);
    }
  }, [src, currentSrc]);

  return (
    <div className="w-full bg-[#0a0a0a] overflow-hidden aspect-[4/5] relative select-none rounded-none border border-white/[0.02]">
      {/* Film grain noise using an SVG filter overlay of extremely low impact for subtle texturing */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      {hasError ? (
        <div className="absolute inset-0 bg-[#070707] flex flex-col items-center justify-center p-6 text-center select-none border border-white/[0.03] space-y-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 animate-pulse">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block">Artisan Asset Unavailable</span>
            <span className="text-[8px] text-white/20 font-mono italic block">Image offline or network interrupted</span>
          </div>
        </div>
      ) : (
        <>
          {/* Previous Image kept visible while next loads */}
          {prevSrc && (
            <img
              src={prevSrc}
              alt={alt}
              referrerPolicy="no-referrer"
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[420ms] ease-out ${
                isNewLoaded ? 'opacity-0 z-0' : 'opacity-100 z-10'
              }`}
            />
          )}

          {/* New Image fading in once loaded */}
          <img
            key={currentSrc}
            src={currentSrc}
            alt={alt}
            onLoad={() => {
              setIsNewLoaded(true);
              setTimeout(() => {
                setPrevSrc(null);
              }, 450);
            }}
            onError={() => {
              setHasError(true);
            }}
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[420ms] ease-out ${
              isNewLoaded ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        </>
      )}
    </div>
  );
};

// 6. MONOCHROME PHOTOGRAPHY RULE: Curate beautiful monochrome visual fallbacks automatically
export function getGarmentImage(title: string): string {
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

export function hasArchiveQualities(item: WardrobeItem): boolean {
  const hasPrivateNote = !!(item.privateNote && item.privateNote.trim() !== "");
  const hasCareNote = !!(item.careNote && item.careNote.trim() !== "");
  const hasPreparation = !!(item.location && item.location.trim() !== "") || item.status === 'Planned';
  const hasPairingMemory = !!(item.worksWith && item.worksWith.trim() !== "") || (() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const penalties = JSON.parse(localStorage.getItem('pairing_penalties') || '[]');
        if (Array.isArray(penalties)) {
          return penalties.some(key => key.split('-').includes(item.id));
        }
      }
    } catch (e) {}
    return false;
  })();
  
  return hasPrivateNote || hasCareNote || hasPreparation || hasPairingMemory;
}

// 3. OBJECT MEMORY: Stable atmosphere quiet line selector incorporating lived-time evolution
export function getAtmosphereLine(item: WardrobeItem): string {
  if (item.placedElsewhere) {
    const rareLabels = [
      "This returned.",
      "This was still here.",
      "Found again.",
      "Placed elsewhere."
    ];
    let hash = 0;
    const str = item.title || "";
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return rareLabels[Math.abs(hash) % rareLabels.length];
  }

  // OBJECT PRESERVATION: Surface unworn garments gently
  if ((item.wearCount || 0) === 0) {
    return "This piece has been waiting.";
  }

  // 1. SEASONS WITHOUT CALENDAR: Quietly gather seasonal atmosphere
  const month = new Date().getMonth();
  const isWarmSeason = month >= 4 && month <= 8; // May to September

  const atmosphericLines = isWarmSeason ? [
    "Returned during the warm hours.",
    "Stayed nearby recently.",
    "Chosen when things felt lighter.",
    "Belongs both here and outside.",
    "An easy layer for the afternoon.",
    "Felt as an easy choice.",
    "An understated shape keeping time with you.",
    "Familiar on slower days.",
    "Always holds its place here in stillness.",
    "Gently woven into the room's fabric."
  ] : [
    "Returned during colder days.",
    "Stayed wrapped nearby recently.",
    "Chosen when things felt softer.",
    "Belongs both here and outside.",
    "A cozy layer for the cold afternoon.",
    "Felt as a soft, comforting choice.",
    "An understated shape keeping time with you.",
    "Familiar on slower days.",
    "Always holds its wrapped place here in stillness.",
    "Gently woven into the room's fabric."
  ];

  // Stable selection based on title hash so each item retains its unique, quiet atmosphere
  let hash = 0;
  const str = item.title || "";
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % atmosphericLines.length;
  return atmosphericLines[idx];
}

// Memory of garment combinations
export function registerCombination(items: WardrobeItem[]) {
  if (!items || items.length < 2) return;
  try {
    const history = JSON.parse(localStorage.getItem('wardrobe_combination_history') || '{}');
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const idA = items[i].id;
        const idB = items[j].id;
        const key = idA < idB ? `${idA}+${idB}` : `${idB}+${idA}`;
        history[key] = (history[key] || 0) + 1;
      }
    }
    localStorage.setItem('wardrobe_combination_history', JSON.stringify(history));
  } catch (e) {}
}

export function getStayTogetherPartner(itemId: string, allItems: WardrobeItem[]): WardrobeItem | null {
  try {
    const history = JSON.parse(localStorage.getItem('wardrobe_combination_history') || '{}');
    let maxCount = 0;
    let partnerId: string | null = null;
    for (const key of Object.keys(history)) {
      if (key.includes(itemId)) {
        const count = history[key];
        if (count >= 2 && count > maxCount) {
          const parts = key.split('+');
          const other = parts[0] === itemId ? parts[1] : parts[0];
          maxCount = count;
          partnerId = other;
        }
      }
    }
    if (partnerId) {
      return allItems.find(x => x.id === partnerId) || null;
    }
  } catch (e) {}
  return null;
}

// CONTEXT WITHOUT INPUT signal synthesis (Requirement 2 & Seasonal Weight E)
function getQuietContextNote(items: WardrobeItem[]): string {
  if (!items || items.length === 0) return "Something easier today.";

  const hasAdapted = typeof localStorage !== 'undefined' ? localStorage.getItem('adapted_sourcing') === 'true' : false;
  if (hasAdapted) {
    const notes = ["Closer at hand.", "Already nearby.", "Something easier today."];
    const savedNote = typeof localStorage !== 'undefined' ? localStorage.getItem('adapted_note') : null;
    if (savedNote && notes.includes(savedNote)) {
      return savedNote;
    }
    return "Something easier today.";
  }

  const weatherWeight = typeof localStorage !== 'undefined' ? localStorage.getItem('weather_weight') || 'lighter' : 'lighter';

  if (weatherWeight === 'lighter') {
    return "lighter days";
  } else if (weatherWeight === 'easier') {
    return "easier weather";
  } else if (weatherWeight === 'heavier') {
    return "slower weather";
  } else {
    return "layered days";
  }
}

// OBJECT RELATIONSHIPS (Requirement 4)
function getRelatedNearbyPiecePhrase(item: WardrobeItem, allItems: WardrobeItem[]): string | null {
  if (!allItems || allItems.length <= 1) return null;
  let partner = getStayTogetherPartner(item.id, allItems);
  if (!partner) {
    const family = allItems.filter(x => x.id !== item.id && x.category === item.category);
    if (family.length > 0) {
      const day = new Date().getDate();
      partner = family[day % family.length];
    } else {
      const idx = allItems.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        partner = allItems[(idx + 1) % allItems.length];
      }
    }
  }

  if (partner && partner.id !== item.id) {
    const isEven = item.title.length % 2 === 0;
    return isEven 
      ? `Goes back to this.` 
      : "Often rests nearby.";
  }
  return null;
}

// ONE QUIET DETAIL: Exactly one optional detail per look
const QUIET_DETAILS = [
  "Roll sleeves.",
  "Leave one button open.",
  "Tuck softly.",
  "Keep layers relaxed."
];

function getQuietDetailForOutfit(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const positiveHash = Math.abs(hash);
  return QUIET_DETAILS[positiveHash % QUIET_DETAILS.length];
}

// THE ONE PIECE RULE helper
function getDailyOnePiece(items: WardrobeItem[]): WardrobeItem | null {
  if (!items || items.length === 0) return null;

  const restingPieces = items.filter(i => i.placedElsewhere);
  const normalPieces = items.filter(i => !i.placedElsewhere);

  const todayStr = new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = todayStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const positiveHash = Math.abs(hash);

  // 20% stable chance on a given day of surfacing resting pieces if any exist
  const shouldSurfaceResting = restingPieces.length > 0 && (positiveHash % 5 === 0);

  const candidates = shouldSurfaceResting ? restingPieces : normalPieces;
  if (candidates.length === 0) {
    return items[0] || null;
  }

  // Conditions: prioritize items with lowest wearCount, stable selected per day
  const sorted = [...candidates].sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0));
  const idx = positiveHash % sorted.length;
  return sorted[idx];
}

// PREPARATION MEMORY hour context
function getTimeAtmosphere(savedAtHour?: number): string {
  const hr = savedAtHour !== undefined ? savedAtHour : new Date().getHours();
  if (hr >= 18 || hr < 6) {
    return "Prepared during quiet hours.";
  }
  return "Left for tomorrow.";
}

// NATURAL ROTATION helper
function getNaturalRotatedList(list: WardrobeItem[]): WardrobeItem[] {
  if (!list) return [];
  try {
    const history = JSON.parse(localStorage.getItem('wardrobe_touch_history') || '{}');
    return [...list].sort((a, b) => {
      const timeA = history[a.id] || 0;
      const timeB = history[b.id] || 0;
      if (timeA !== timeB) {
        return timeB - timeA; // most recently touched moves gently upward
      }
      // fallback to original timestamp order
      const secA = (a.createdAt as any)?.seconds || 0;
      const secB = (b.createdAt as any)?.seconds || 0;
      return secB - secA;
    });
  } catch (e) {
    return list;
  }
}


export const AIStyleHub: React.FC<AIStyleHubProps> = ({ 
  wardrobe, 
  onAddGarment, 
  onDeleteGarment,
  user,
  onLogout,
  onReset,
  onLoadSamples,
  isResetting = false,
  onEnterSilence
}) => {
  const [state, setState] = useState<UnifiedState>(() => UnifiedFashionOS.getState());
  const hasRestoredRef = useRef(false);
  const [activeSubTab, setActiveSubTab] = useState<'HOME' | 'WARDROBE' | 'PLANNER' | 'LEARN' | 'SIGNATURE' | 'PRESENCE'>(() => {
    const saved = localStorage.getItem('last_active_place_subtab');
    if (saved && ['HOME', 'WARDROBE', 'PLANNER', 'LEARN', 'SIGNATURE', 'PRESENCE'].includes(saved)) {
      return saved as any;
    }
    return 'HOME';
  });
  const [showFounderConsole, setShowFounderConsole] = useState(false);
  
  // Ceremony of Addition Form Steps States (Restore draft silently)
  const [addStep, setAddStep] = useState<'CLOSED' | 'IMAGE' | 'NAME' | 'NOTE'>(() => {
    return (localStorage.getItem('draft_add_step') as any) || 'CLOSED';
  });
  const [ceremonyStatus, setCeremonyStatus] = useState<string | null>(null);

  const [gTitle, setGTitle] = useState(() => localStorage.getItem('draft_g_title') || '');
  const [gDesc, setGDesc] = useState(() => localStorage.getItem('draft_g_desc') || '');
  const [gCategory, setGCategory] = useState<any>('Casual');
  const [gImage, setGImage] = useState(''); // Photographer URL
  
  const [schedTitle, setSchedTitle] = useState('');
  const [schedTime, setSchedTime] = useState('Morning light');
  const [schedOccasion, setSchedOccasion] = useState('Quiet stroll');
  
  const [isCompiling, setIsCompiling] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('Quietly noted.');

  // One line memory continuity state
  const [memoryLine, setMemoryLine] = useState('');

  // Stillness / Intentional Pause State
  const [isHoldingStill, setIsHoldingStill] = useState(false);

  // Selected Garment detail page state
  const [selectedGarment, setSelectedGarment] = useState<WardrobeItem | null>(null);

  // GENTLE TOMORROW Tomorrow room state
  const [tomorrowOutfit, setTomorrowOutfitState] = useState<{ items: WardrobeItem[]; note: string; timeAtmosphere?: string } | null>(() => {
    const saved = localStorage.getItem('tomorrow_outfit');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [tomorrowNote, setTomorrowNote] = useState(() => localStorage.getItem('draft_tomorrow_note') || '');
  const [tempTomorrowItems, setTempTomorrowItems] = useState<WardrobeItem[]>([]);

  // 3. Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Requirement D & E: Gentle Packing & Seasonal Weight states
  const [tomorrowFrozen, setTomorrowFrozenState] = useState<boolean>(() => {
    return localStorage.getItem('tomorrow_frozen') === 'true';
  });

  const saveTomorrowFrozen = (val: boolean) => {
    setTomorrowFrozenState(val);
    localStorage.setItem('tomorrow_frozen', val ? 'true' : 'false');
  };

  const [weatherWeight, setWeatherWeightState] = useState<'lighter' | 'heavier' | 'layered'>(() => {
    const saved = localStorage.getItem('weather_weight');
    return (saved === 'lighter' || saved === 'heavier' || saved === 'layered') ? saved : 'lighter';
  });

  const [viewMode, setViewMode] = useState<'EDITORIAL' | 'GRID'>(() => {
    return (localStorage.getItem('wardrobe_view_mode') as 'EDITORIAL' | 'GRID') || 'GRID';
  });

  const saveViewMode = (mode: 'EDITORIAL' | 'GRID') => {
    setViewMode(mode);
    localStorage.setItem('wardrobe_view_mode', mode);
  };

  const saveWeatherWeight = (weight: 'lighter' | 'heavier' | 'layered') => {
    setWeatherWeightState(weight);
    localStorage.setItem('weather_weight', weight);
  };

  // 7. Ownership Export states
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [snapshotData, setSnapshotData] = useState('');

  const saveTomorrowOutfit = (outfit: { items: WardrobeItem[]; note: string; timeAtmosphere?: string } | null) => {
    setTomorrowOutfitState(outfit);
    if (outfit) {
      localStorage.setItem('tomorrow_outfit', JSON.stringify(outfit));
      if (outfit.items.length >= 2) {
        registerCombination(outfit.items);
      }
    } else {
      localStorage.removeItem('tomorrow_outfit');
      saveTomorrowFrozen(false);
    }
  };

  const [wearingConfirmation, setWearingConfirmation] = useState(false);
  const [undoAction, setUndoAction] = useState<{
    message: string;
    rollback: () => void;
  } | null>(null);
  const undoTimeoutRef = useRef<any>(null);

  const registerUndo = (rollbackFn: () => void) => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
    setUndoAction({
      message: "Left open.",
      rollback: rollbackFn
    });
    undoTimeoutRef.current = setTimeout(() => {
      setUndoAction(null);
    }, 6000);
  };

  useEffect(() => {
    setWearingConfirmation(false);
  }, [state.activeSuggestion?.id]);

  const handleUpdateGarment = async (itemId: string, updates: Partial<WardrobeItem>) => {
    if (selectedGarment && selectedGarment.id === itemId) {
      setSelectedGarment(prev => prev ? { ...prev, ...updates } : null);
    }
    const isGuest = user?.uid ? (user.isAnonymous || user.uid.startsWith('guest-')) : true;
    if (isGuest) {
      const stored = localStorage.getItem('local_wardrobe_items');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as WardrobeItem[];
          const idx = parsed.findIndex(x => x.id === itemId);
          if (idx !== -1) {
            parsed[idx] = { ...parsed[idx], ...updates };
            localStorage.setItem('local_wardrobe_items', JSON.stringify(parsed));
            UnifiedFashionOS.syncWardrobeItems(parsed);
          }
        } catch (e) {
          console.error("Local update failed:", e);
        }
      }
    } else {
      try {
        const item = activeWardrobeList.find(x => x.id === itemId);
        const col = (item as any)?.collectionSource === 'constructions' ? 'constructions' : 'wardrobe';
        await updateDoc(doc(db, col, itemId), updates);
      } catch (err) {
        console.error("Firestore update failed:", err);
      }
    }
  };


  const activeWardrobeList = wardrobe && wardrobe.length > 0 ? wardrobe : state.unifiedStyleMemory.wardrobe_items;

  const displayedWardrobeList = (() => {
    let list = activeWardrobeList || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(item => 
        item.title.toLowerCase().includes(q) || 
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.privateNote && item.privateNote.toLowerCase().includes(q))
      );
    } else {
      return list.filter(item => !item.placedElsewhere);
    }
  })();

  // URL Router & Synchronization - Merged for ultimate stability
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      let mappedTab: 'HOME' | 'WARDROBE' | 'PLANNER' | 'LEARN' | 'SIGNATURE' | 'PRESENCE' | null = null;
      if (path === '/home' || path === '/' || path === '') mappedTab = 'HOME';
      else if (path === '/wardrobe') mappedTab = 'WARDROBE';
      else if (path === '/planner') mappedTab = 'PLANNER';
      else if (path === '/learn') mappedTab = 'LEARN';
      else if (path === '/signature') mappedTab = 'SIGNATURE';
      else if (path === '/dashboard' || path === '/presence') mappedTab = 'PRESENCE';
      
      if (mappedTab) {
        setActiveSubTab(mappedTab);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    let targetPath = '';
    if (activeSubTab === 'HOME') targetPath = '/home';
    else if (activeSubTab === 'WARDROBE') targetPath = '/wardrobe';
    else if (activeSubTab === 'PLANNER') targetPath = '/planner';
    else if (activeSubTab === 'LEARN') targetPath = '/learn';
    else if (activeSubTab === 'SIGNATURE') targetPath = '/signature';
    else if (activeSubTab === 'PRESENCE') targetPath = '/dashboard';

    if (targetPath && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [activeSubTab]);

  useEffect(() => {
    const unsub = UnifiedFashionOS.subscribe((latest) => {
      setState(latest);
    });
    return () => unsub();
  }, []);

  // Profile Syncing
  useEffect(() => {
    if (!user) return;
    const loadStyleProfile = async () => {
      try {
        const p = await ProfileService.loadProfile(user.uid);
        if (p?.styleVector && p.styleVector.length === 8) {
          // Sync with the AI engines preference vector
          const osState = UnifiedFashionOS.getState();
          osState.unifiedStyleMemory.user_preferences_vector = p.styleVector;
        }
      } catch (err) {
        console.error("Profile loading failed:", err);
      }
    };
    loadStyleProfile();
    ProfileService.startSyncTimer();
  }, [user]);

  const activeWardrobeListDependency = activeWardrobeList
    ? `${activeWardrobeList.length}:${activeWardrobeList.map(x => x.id).join(',')}`
    : '';

  const wardrobeDependency = wardrobe
    ? `${wardrobe.length}:${wardrobe.map(x => x.id).join(',')}`
    : '';

  const tomorrowOutfitItemsDependency = tomorrowOutfit
    ? `${tomorrowOutfit.note}:${tomorrowOutfit.items.map(x => x.id).join(',')}`
    : '';

  useEffect(() => {
    const savedGarmentId = localStorage.getItem('last_active_place_garment_id');
    if (savedGarmentId && activeWardrobeList.length > 0 && !selectedGarment) {
      const found = activeWardrobeList.find(x => x.id === savedGarmentId);
      if (found) {
        setSelectedGarment(found);
      }
    }
  }, [activeWardrobeListDependency]);

  useEffect(() => {
    if (wardrobe && wardrobe.length > 0) {
      UnifiedFashionOS.syncWardrobeItems(wardrobe);
    }
  }, [wardrobeDependency]);

  // Auto-persist active subtab and selected garment
  useEffect(() => {
    try {
      if (localStorage.getItem('last_active_place_subtab') !== activeSubTab) {
        localStorage.setItem('last_active_place_subtab', activeSubTab);
      }
      if (selectedGarment) {
        if (localStorage.getItem('last_active_place_garment_id') !== selectedGarment.id) {
          localStorage.setItem('last_active_place_garment_id', selectedGarment.id);
        }
      } else {
        if (localStorage.getItem('last_active_place_garment_id') !== null) {
          localStorage.removeItem('last_active_place_garment_id');
        }
      }
    } catch (e) {}
  }, [activeSubTab, selectedGarment]);

  // Silently auto-save drafts
  useEffect(() => {
    try {
      if (addStep !== 'CLOSED') {
        if (localStorage.getItem('draft_add_step') !== addStep) {
          localStorage.setItem('draft_add_step', addStep);
        }
      } else {
        if (localStorage.getItem('draft_add_step') !== null) {
          localStorage.removeItem('draft_add_step');
        }
      }
    } catch (e) {}
  }, [addStep]);

  useEffect(() => {
    try {
      if (localStorage.getItem('draft_g_title') !== gTitle) {
        localStorage.setItem('draft_g_title', gTitle);
      }
    } catch (e) {}
  }, [gTitle]);

  useEffect(() => {
    try {
      if (localStorage.getItem('draft_g_desc') !== gDesc) {
        localStorage.setItem('draft_g_desc', gDesc);
      }
    } catch (e) {}
  }, [gDesc]);

  useEffect(() => {
    try {
      if (localStorage.getItem('draft_tomorrow_note') !== tomorrowNote) {
        localStorage.setItem('draft_tomorrow_note', tomorrowNote);
      }
    } catch (e) {}
  }, [tomorrowNote]);

  // Respect frozen tomorrow preparation (Requirement D)
  useEffect(() => {
    if (tomorrowFrozen && tomorrowOutfit && activeSubTab === 'HOME') {
      const currentActive = state.activeSuggestion;
      const isAlreadyLoaded = !!(currentActive && 
        currentActive.items && 
        tomorrowOutfit.items &&
        currentActive.items.length === tomorrowOutfit.items.length && 
        currentActive.items.every((it, idx) => it && tomorrowOutfit.items[idx] && it.id === tomorrowOutfit.items[idx].id));

      if (!isAlreadyLoaded) {
        const stableId = `out-frozen-${tomorrowOutfit.items.map(x => x.id).join('-')}`;
        UnifiedFashionOS.getState().activeSuggestion = {
          id: stableId,
          name: tomorrowOutfit.items.map(i => i.title).join(" & "),
          items: tomorrowOutfit.items,
          suitabilityScore: 100,
          occasion: tomorrowOutfit.note,
          generatedAt: new Date().toISOString().split('T')[0],
          vibeTags: ['minimalist']
        };
        UnifiedFashionOS.notify();
      }
    }
  }, [tomorrowFrozen, tomorrowOutfitItemsDependency, activeSubTab, state.activeSuggestion?.id]);

  // Save today's recommendation automatically whenever state.activeSuggestion changes
  useEffect(() => {
    if (state.activeSuggestion) {
      localStorage.setItem('today_recommendation_v3', JSON.stringify({
        suggestion: state.activeSuggestion,
        dateStr: new Date().toISOString().split('T')[0],
        isWarmSeason: new Date().getMonth() >= 4 && new Date().getMonth() <= 8
      }));
    } else {
      localStorage.removeItem('today_recommendation_v3');
    }
  }, [state.activeSuggestion?.id]);

  // Single line Memory Continuity soft return lines and Restore Today's Recommendation
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const month = new Date().getMonth();
    const currentIsWarm = month >= 4 && month <= 8;

    let restoredSuccessfully = false;
    if (!hasRestoredRef.current) {
      hasRestoredRef.current = true;
      const savedRecStr = localStorage.getItem('today_recommendation_v3');
      if (savedRecStr) {
        try {
          const stored = JSON.parse(savedRecStr);
          if (stored && stored.dateStr === todayStr && stored.isWarmSeason === currentIsWarm && !tomorrowFrozen && stored.suggestion && Array.isArray(stored.suggestion.items)) {
            // Verify if suggested items still exist in wardrobe
            const allExistAndInCloset = stored.suggestion.items.every((item: any) => 
              activeWardrobeList.some((w: any) => w.id === item.id)
            );
            if (allExistAndInCloset) {
              UnifiedFashionOS.getState().activeSuggestion = stored.suggestion;
              UnifiedFashionOS.notify();
              restoredSuccessfully = true;
            }
          }
        } catch (e) {
          console.error("Failed to restore today recommendation:", e);
        }
      }
    } else if (state.activeSuggestion) {
      restoredSuccessfully = true;
    }

    const savedTab = localStorage.getItem('last_active_place_subtab');
    const savedGarmentId = localStorage.getItem('last_active_place_garment_id');
    const draftTitle = localStorage.getItem('draft_g_title');
    const draftNote = localStorage.getItem('draft_tomorrow_note');
    
    // Draft restored signals
    if ((draftTitle && draftTitle.trim() !== '') || (draftNote && draftNote.trim() !== '')) {
      const draftLines = [
        "Still here.",
        "Left in place."
      ];
      const idx = Math.abs((new Date().getDate() + new Date().getHours())) % draftLines.length;
      setMemoryLine(draftLines[idx]);
    } else {
      // Reopened signals
      if (restoredSuccessfully) {
        // Same day restore: Allowed phrases under A: "Still here.", "Left in place."
        const sameDayLines = [
          "Still here.",
          "Left in place."
        ];
        const idx = Math.abs((new Date().getDate() + new Date().getHours())) % sameDayLines.length;
        setMemoryLine(sameDayLines[idx]);
      } else {
        // Multi-day reopen or no recommendation restored: Allowed phrases: "Everything stayed.", "Nothing here yet."
        const multiDayLines = [
          "Everything stayed.",
          "Nothing here yet."
        ];
        const idx = Math.abs((new Date().getDate() + new Date().getHours())) % multiDayLines.length;
        setMemoryLine(multiDayLines[idx]);
      }
    }
  }, [activeWardrobeListDependency, tomorrowFrozen, state.activeSuggestion?.id]);


  const presets = [
    // 7 Tops
    { title: 'Supima Heavy-Knit Cotton Tee', desc: 'Oversized luxury modular base, classic drop shoulder fit.', cat: 'Casual' },
    { title: 'Structured Linen Button-Up', desc: 'French front fine linen shirt, breathable formal look.', cat: 'Formal' },
    { title: 'Loopback Heavy Cotton Hoodie', desc: '100% organic heavy loopback French terry cotton.', cat: 'Casual' },
    { title: 'Fine Merino Wool Polo', desc: 'Breathable, lightweight, fine-knit polo shirt collar top.', cat: 'Formal' },
    { title: 'Utility Chambray Workshirt', desc: 'Double-pocket vintage washed work shirt top.', cat: 'Casual' },
    { title: 'Box-Fit Graphic Tee 260GSM', desc: 'Retro enzyme washed heavy jersey shirt.', cat: 'Casual' },
    { title: 'Minimalist Silk-Blend Blouse', desc: 'Soft flowing silk elegant blouse top.', cat: 'Formal' },

    // 6 Bottoms
    { title: 'Sleek Dark Tailored Chinos', desc: 'Pleated dark chinos tailored trousers.', cat: 'Formal' },
    { title: 'Raw Selvedge Indigo Jeans', desc: 'Standard fit unwashed indigo denim pants.', cat: 'Casual' },
    { title: 'Pleated Slate Wool Trousers', desc: 'High-waist double pleated refined trousers pants.', cat: 'Formal' },
    { title: 'Relaxed Linen Drawstring Pants', desc: 'Extremely breathable lightweight resort trousers pants.', cat: 'Casual' },
    { title: 'Lightweight Technical Joggers', desc: 'Water-resistant stretch athletic joggers pants.', cat: 'Sportswear' },
    { title: 'Heavy Twill Cargo Pants', desc: 'Rugged cargo utility pants with multi pockets.', cat: 'Casual' },

    // 3 Outerwear
    { title: 'Tailored Camel Overcoat', desc: 'Symmetrical structured wool overcoat', cat: 'Outerwear' },
    { title: 'Breathable Technical Windrunner', desc: 'Waterproof obsidian outer shell', cat: 'Outerwear' },
    { title: 'Vintage Leather Bomber Jacket', desc: 'Distressed black leather flight jacket outerwear.', cat: 'Outerwear' },

    // 5 Shoes
    { title: 'Classic White Leather Sneakers', desc: 'Margom-sole minimalist athletic white shoe.', cat: 'Casual' },
    { title: 'Calfskin Chelsea Boots', desc: 'Handcrafted premium black leather ankle boots shoe.', cat: 'Formal' },
    { title: 'Split-Toe Suede Loafers', desc: 'Breathable snuff suede penny loafers shoe.', cat: 'Formal' },
    { title: 'Vibram Off-Road Trail Runners', desc: 'Responsive all-terrain technical trail running shoe.', cat: 'Sportswear' },
    { title: 'Refined Leather Derby Shoes', desc: 'Traditional custom polished dress derby shoes.', cat: 'Formal' },

    // 3 Accessories
    { title: 'Aesthetic Heavy Ribbed Beanie', desc: 'Unisex Sage green knit beanie', cat: 'Accessories' },
    { title: 'Matte Acetate Circular Sunglasses', desc: 'UV-protected acetate polarized sunglasses.', cat: 'Accessories' },
    { title: 'Minimalist Brass Buckle Belt', desc: 'Vegetable-tanned full-grain leather belt accessories.', cat: 'Accessories' }
  ];

  // Global action pause wrapper (950ms stillness)
  const triggerQuietPause = (action: () => void | Promise<void>) => {
    setIsHoldingStill(true);
    setTimeout(async () => {
      await action();
      setTimeout(() => {
        setIsHoldingStill(false);
      }, 900);
    }, 50);
  };

  const handleApplyPreset = async (preset: typeof presets[0]) => {
    const fallbackUrl = getGarmentImage(preset.title);
    triggerQuietPause(async () => {
      if (onAddGarment) {
        await onAddGarment(preset.title, preset.desc, preset.cat, { imageUrl: fallbackUrl });
      } else {
        const items = [...state.unifiedStyleMemory.wardrobe_items];
        items.push({
          id: `local-${Date.now()}`,
          title: preset.title,
          description: preset.desc,
          category: preset.cat as any,
          status: 'In Closet',
          userId: 'simulated-guest',
          createdAt: new Date(),
          imageUrl: fallbackUrl,
          primaryColor: 'Aesthetic Accent'
        });
        UnifiedFashionOS.syncWardrobeItems(items);
      }
    });
  };

  const handleLoadPresetsAutomatically = async () => {
    triggerQuietPause(async () => {
      for (const p of presets) {
        const fallbackUrl = getGarmentImage(p.title);
        if (onAddGarment) {
          await onAddGarment(p.title, p.desc, p.cat, { imageUrl: fallbackUrl });
        }
      }
    });
  };

  const handleNotThisTogether = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedGarment || !state.activeSuggestion) return;
    
    const otherItems = state.activeSuggestion.items.filter(item => item.id !== selectedGarment.id);
    if (otherItems.length === 0) return;

    try {
      if (typeof localStorage !== 'undefined') {
        let penalties: string[] = JSON.parse(localStorage.getItem('pairing_penalties') || '[]');
        if (!Array.isArray(penalties)) penalties = [];

        otherItems.forEach(other => {
          const pairKey = [selectedGarment.id, other.id].sort().join('-');
          if (!penalties.includes(pairKey)) {
            penalties.push(pairKey);
          }
        });

        localStorage.setItem('pairing_penalties', JSON.stringify(penalties));
        
        // Show gentle quiet acknowledgment note
        setFeedbackNote("Pairing reduced.");
        setFeedbackSuccess(true);
        setTimeout(() => {
          setFeedbackSuccess(false);
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [showAdjustOptions, setShowAdjustOptions] = useState(false);

  const handleAdjustSlightly = (type: 'swap' | 'lighter' | 'quieter' | 'familiar') => {
    const activeOutfit = state.activeSuggestion;
    if (!activeOutfit || !activeOutfit.items || activeOutfit.items.length === 0) return;

    let adjustedItems = [...activeOutfit.items];

    if (type === 'swap') {
      const idxToSwap = Math.floor(Math.random() * adjustedItems.length);
      const targetItem = adjustedItems[idxToSwap];
      const candidates = activeWardrobeList.filter(u => u.category === targetItem.category && !adjustedItems.some(x => x.id === u.id));
      if (candidates.length > 0) {
        const replacement = candidates[Math.floor(Math.random() * candidates.length)];
        adjustedItems[idxToSwap] = replacement;
      }
    } else if (type === 'lighter') {
      const heavyIdx = adjustedItems.findIndex(i => i.category === 'Outerwear' || i.title.toLowerCase().includes('coat') || i.title.toLowerCase().includes('heavy'));
      const lighterTops = activeWardrobeList.filter(u => (u.category === 'Casual' || u.title.toLowerCase().includes('shirt') || u.title.toLowerCase().includes('tee')) && !adjustedItems.some(x => x.id === u.id));
      if (heavyIdx !== -1 && lighterTops.length > 0) {
        const replacement = lighterTops[Math.floor(Math.random() * lighterTops.length)];
        adjustedItems[heavyIdx] = replacement;
      } else {
        const candidates = activeWardrobeList.filter(u => (u.title.toLowerCase().includes('shirt') || u.title.toLowerCase().includes('tee') || u.title.toLowerCase().includes('linen') || u.title.toLowerCase().includes('short')) && !adjustedItems.some(x => x.id === u.id));
        if (candidates.length > 0 && adjustedItems.length > 0) {
          adjustedItems[0] = candidates[Math.floor(Math.random() * candidates.length)];
        }
      }
    } else if (type === 'quieter') {
      const idxToSwap = Math.floor(Math.random() * adjustedItems.length);
      const targetItem = adjustedItems[idxToSwap];
      const quieterColorCandidates = activeWardrobeList.filter(u => 
        u.category === targetItem.category && 
        !adjustedItems.some(x => x.id === u.id) &&
        (u.title.toLowerCase().includes('black') || u.title.toLowerCase().includes('gray') || u.title.toLowerCase().includes('charcoal') || u.title.toLowerCase().includes('white') || u.title.toLowerCase().includes('sand') || u.title.toLowerCase().includes('neutral'))
      );
      if (quieterColorCandidates.length > 0) {
        adjustedItems[idxToSwap] = quieterColorCandidates[Math.floor(Math.random() * quieterColorCandidates.length)];
      }
    } else if (type === 'familiar') {
      const idxToSwap = Math.floor(Math.random() * adjustedItems.length);
      const targetCategory = adjustedItems[idxToSwap].category;
      const candidates = activeWardrobeList.filter(u => u.category === targetCategory && !adjustedItems.some(x => x.id === u.id));
      if (candidates.length > 0) {
        candidates.sort((a,b) => (b.wearCount || 0) - (a.wearCount || 0));
        adjustedItems[idxToSwap] = candidates[0];
      }
    }

    triggerQuietPause(() => {
      const updatedSuggestion = {
        ...activeOutfit,
        items: adjustedItems,
        name: adjustedItems.map(i => i.title).join(" & ")
      };
      UnifiedFashionOS.getState().activeSuggestion = updatedSuggestion;
      UnifiedFashionOS.notify();
    });
  };

  const handleWearAction = () => {
    setWearingConfirmation(true);
  };

  const handleConfirmWearWithReflection = (noteToSurface: "Returned quietly." | "This stayed.") => {
    const activeOutfit = state.activeSuggestion;
    if (!activeOutfit) return;

    const hr = new Date().getHours();
    let moment = "steady hours";
    if (hr >= 4 && hr < 12) {
      moment = "morning";
    } else if (hr >= 12 && hr < 18) {
      moment = "steady hours";
    } else {
      moment = "quiet hours";
    }

    if (activeOutfit.items.length >= 2) {
      registerCombination(activeOutfit.items);
    }

    // Capture state for undo
    const itemsPreUpdate = activeOutfit.items.map(item => ({
      id: item.id,
      wearCount: item.wearCount || 0,
      lastWornMoment: item.lastWornMoment || "",
      privateNote: item.privateNote || ""
    }));
    const prevYesterdayIds = typeof localStorage !== 'undefined' ? localStorage.getItem('yesterday_outfit_ids') : null;
    const prevLast7 = typeof localStorage !== 'undefined' ? localStorage.getItem('last_7_worn_combinations') : null;
    const prevLast10 = typeof localStorage !== 'undefined' ? localStorage.getItem('last_10_worn_combinations') : null;

    try {
      if (typeof localStorage !== 'undefined') {
        const itemIds = activeOutfit.items.map(i => i.id);
        localStorage.setItem('yesterday_outfit_ids', itemIds.join(','));

        // Store last 7 worn combinations (Requirement D)
        let last7 = JSON.parse(localStorage.getItem('last_7_worn_combinations') || '[]');
        if (!Array.isArray(last7)) {
          last7 = [];
        }
        last7.push(itemIds);
        if (last7.length > 7) {
          last7 = last7.slice(-7);
        }
        localStorage.setItem('last_7_worn_combinations', JSON.stringify(last7));

        // Store last 10 worn combinations (Requirement E: Real Repeat Protection)
        let last10 = JSON.parse(localStorage.getItem('last_10_worn_combinations') || '[]');
        if (!Array.isArray(last10)) {
          last10 = [];
        }
        last10.push(itemIds);
        if (last10.length > 10) {
          last10 = last10.slice(-10);
        }
        localStorage.setItem('last_10_worn_combinations', JSON.stringify(last10));
      }
    } catch (e) {}

    triggerQuietPause(() => {
      setFeedbackNote(noteToSurface);
      setFeedbackSuccess(true);
      setWearingConfirmation(false);

      activeOutfit.items.forEach(item => {
        handleUpdateGarment(item.id, {
          wearCount: (item.wearCount || 0) + 1,
          lastWornMoment: moment,
          privateNote: noteToSurface
        });
      });

      if (user) {
        ProfileService.logFeedback(user.uid, {
          outfitId: activeOutfit.id,
          outfitName: activeOutfit.name,
          action: 'WORN_CONFIRMED',
          suitabilityScore: activeOutfit.suitabilityScore || 85,
          moment,
          reflection: noteToSurface
        });

        ProfileService.loadProfile(user.uid).then(p => {
          const updated = { ...p };
          updated.feedbackCounter.wears += 1;
          const activeCategories = activeOutfit.items.map(i => i.category);
          if (activeCategories.includes('Formal') && updated.styleVector[7] < 1.0) updated.styleVector[7] += 0.05;
          if (activeCategories.includes('Casual') && updated.styleVector[6] < 1.0) updated.styleVector[6] += 0.05;
          if (activeCategories.includes('Outerwear') && updated.styleVector[3] < 1.0) updated.styleVector[3] += 0.03;
          ProfileService.saveProfile(user.uid, updated);
        }).catch(() => {});
      }

      UnifiedFashionOS.receiveRealityFeedback(
        activeOutfit.id,
        activeOutfit.name,
        'WORN_CONFIRMED',
        activeOutfit.suitabilityScore,
        85,
        100,
        activeOutfit.vibeTags,
        moment,
        noteToSurface
      );

      // Register undo
      registerUndo(() => {
        itemsPreUpdate.forEach(prev => {
          handleUpdateGarment(prev.id, {
            wearCount: prev.wearCount,
            lastWornMoment: prev.lastWornMoment,
            privateNote: prev.privateNote
          });
        });
        if (typeof localStorage !== 'undefined') {
          if (prevYesterdayIds === null) {
            localStorage.removeItem('yesterday_outfit_ids');
          } else {
            localStorage.setItem('yesterday_outfit_ids', prevYesterdayIds);
          }
          if (prevLast7 === null) {
            localStorage.removeItem('last_7_worn_combinations');
          } else {
            localStorage.setItem('last_7_worn_combinations', prevLast7);
          }
          if (prevLast10 === null) {
            localStorage.removeItem('last_10_worn_combinations');
          } else {
            localStorage.setItem('last_10_worn_combinations', prevLast10);
          }
        }
        setFeedbackNote('Returned quietly.');
        setFeedbackSuccess(false);
      });

      setTimeout(() => {
        setFeedbackSuccess(false);
      }, 3500);
    });
  };

  const triggerOutfitCompilation = () => {
    setIsCompiling(true);
    triggerQuietPause(() => {
      UnifiedFashionOS.generateOutfit(activeWardrobeList, 'Today\'s Styled Spread');
      setIsCompiling(false);
      setFeedbackNote("Not today.");
      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackSuccess(false);
      }, 3500);
    });
  };

  const handleRegisterScheduler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle.trim()) return;
    triggerQuietPause(() => {
      UnifiedFashionOS.addScheduledEvent(schedTitle, schedTime, schedOccasion);
      setSchedTitle('');
    });
  };

  const getAtmosphere = (count: number) => {
    if (count < 5) return 'museum';
    if (count <= 12) return 'archive';
    return 'library';
  };

  // 5. PASSAGE OF TIME: Enforce absolute physical layout stability per Rule 3
  const getTemporalSpacing = () => {
    return {
      containerSpace: 'space-y-16 md:space-y-20',
      itemGap: 'space-y-24 md:space-y-28',
      padding: 'py-8',
      editorialSpace: 'space-y-12'
    };
  };

  const temporalVals = getTemporalSpacing();

  // 8. END OF DAY: Show quiet closing line based on local time inside spread
  const EveningClosing = () => {
    const lines = [
      "Returned quietly.",
      "Left in place.",
      "Enough remained.",
      "Until later."
    ];
    // Rotate based on day of month or hours
    const index = (new Date().getDate() + new Date().getHours()) % 4;
    const selectedLine = lines[index];
    return (
      <div className="pt-24 pb-12 text-center select-none animate-fade-in">
        <p className="font-serif italic text-xs text-white/20 tracking-[0.1em] leading-relaxed">
          —<br />
          {selectedLine}
        </p>
      </div>
    );
  };

  // 4. OBJECT DETAIL VIEW (Fulfills Rule 4 perfectly)
  if (selectedGarment) {
    const backdropClass = getTemporalThemeBackground();
    return (
      <div 
        onClick={() => {
          triggerQuietPause(() => {
            setSelectedGarment(null);
          });
        }}
        className={`fixed inset-0 z-50 ${backdropClass} flex flex-col justify-center items-center p-8 select-none cursor-pointer animate-fade-in`}
      >
        <div className="max-w-md w-full space-y-10 text-center">
          
          {/* Photograph */}
          <div className="w-full aspect-[4/5] overflow-hidden bg-black/40">
            <ImageWithFade 
              src={selectedGarment.imageUrl || getGarmentImage(selectedGarment.title)} 
              alt={selectedGarment.title} 
            />
          </div>

          {/* Text lines */}
          <div className="space-y-3">
            <h2 className="font-serif font-light text-4xl text-white tracking-[-0.03em] leading-tight">
              {selectedGarment.title}
            </h2>
            <p className="font-serif italic text-base text-neutral-400 max-w-xs mx-auto leading-relaxed">
              {getAtmosphereLine(selectedGarment)}
            </p>

            {/* Memory of Combinations and Object Relationships (Requirement 4 & 5) */}
            {(() => {
              const phrase = getRelatedNearbyPiecePhrase(selectedGarment, activeWardrobeList);
              if (phrase) {
                return (
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 pt-1">
                    {phrase}
                  </p>
                );
              }
              return null;
            })()}

            {/* Inline Private Note (Requirement 2 & 6) */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="pt-4 max-w-xs mx-auto"
            >
              <input
                type="text"
                placeholder="Write a private line..."
                value={selectedGarment.privateNote || ""}
                onChange={(e) => {
                  handleUpdateGarment(selectedGarment.id, { privateNote: e.target.value });
                }}
                className="w-full bg-transparent text-center border-b border-dashed border-white/10 hover:border-white/30 focus:border-white focus:outline-none transition-all py-1 text-xs font-serif italic text-white/70 placeholder-white/20"
              />
              
              {/* Preset Phrase Chips (Requirement 6) */}
              <div className="flex flex-wrap gap-1.5 justify-center pt-3 selection:bg-transparent">
                {["Works easily", "Usually reliable", "Feels lighter", "Better folded", "Easy outside"].map(phrase => (
                  <button
                    key={phrase}
                    onClick={() => {
                      handleUpdateGarment(selectedGarment.id, { privateNote: phrase });
                    }}
                    className="text-[8.5px] font-mono text-white/25 hover:text-white/60 hover:bg-white/[0.03] border border-white/[0.04] px-2 py-0.5 transition-all duration-150 cursor-pointer"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* Works with Field (Requirement C) */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="pt-4 max-w-xs mx-auto space-y-1"
            >
              <label className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase block">
                Works with
              </label>
              <input
                type="text"
                placeholder="e.g. white shoes"
                value={selectedGarment.worksWith || ""}
                onChange={(e) => {
                  handleUpdateGarment(selectedGarment.id, { worksWith: e.target.value });
                }}
                className="w-full bg-transparent text-center border-b border-dashed border-white/10 hover:border-white/30 focus:border-white focus:outline-none transition-all py-1 text-xs font-serif italic text-white/70 placeholder-white/20"
                id="garment-works-with-input"
              />
            </div>

            {/* Real Closet Care Note Cycling — Tap to cycle option */}
            <div 
              id="closet-care-control"
              onClick={(e) => {
                e.stopPropagation(); // Avoid closing screen!
                const careOptions = [
                  "",
                  "Washes well.",
                  "Needs ironing.",
                  "Feels better folded.",
                  "Dry before returning."
                ];
                const currentIdx = careOptions.indexOf(selectedGarment.careNote || "");
                const nextIdx = (currentIdx + 1) % careOptions.length;
                const updatedNote = careOptions[nextIdx];
                handleUpdateGarment(selectedGarment.id, { careNote: updatedNote });
              }}
              className="pt-4 cursor-pointer"
            >
              <span className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase hover:text-white/70 transition-colors">
                Care: {selectedGarment.careNote || "[ default ]"}
              </span>
            </div>

            {/* Physical Details Location Cycling — Tap to cycle option */}
            <div 
              id="closet-location-control"
              onClick={(e) => {
                e.stopPropagation(); // Avoid closing screen!
                const locationOptions = [
                  "",
                  "Top shelf",
                  "Near the door",
                  "Folded away",
                  "Easy to reach",
                  "Hanging on rail"
                ];
                const currentIdx = locationOptions.indexOf(selectedGarment.location || "");
                const nextIdx = (currentIdx + 1) % locationOptions.length;
                const updatedLocation = locationOptions[nextIdx];
                handleUpdateGarment(selectedGarment.id, { location: updatedLocation });
              }}
              className="pt-2 cursor-pointer"
            >
              <span className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase hover:text-white/70 transition-colors">
                Belongs: {selectedGarment.location || "[ default ]"}
              </span>
            </div>

            {/* The Archive Mark (Requirement 3: "Placed elsewhere.") */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                const isPlacedElsewhere = !selectedGarment.placedElsewhere;
                handleUpdateGarment(selectedGarment.id, { placedElsewhere: isPlacedElsewhere });
              }}
              className="pt-4 cursor-pointer select-none"
            >
              <span className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase hover:text-white/70 transition-colors">
                {selectedGarment.placedElsewhere ? "[ Return to shelves ]" : "[ Put away ]"}
              </span>
            </div>

            {/* Gentle Correction: [ not this together ] (Requirement B) */}
            {state.activeSuggestion && state.activeSuggestion.items.some(i => i.id === selectedGarment.id) && (
              <div 
                onClick={handleNotThisTogether}
                className="pt-4 cursor-pointer select-none"
                id="garment-not-this-together-control"
              >
                <span className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase hover:text-white/70 transition-colors">
                  [ not this together ]
                </span>
              </div>
            )}
          </div>

          <div 
            onClick={(e) => {
              e.stopPropagation();
              triggerQuietPause(() => {
                setSelectedGarment(null);
                setActiveSubTab('HOME');
              });
            }}
            className="pt-4 cursor-pointer select-none"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 hover:text-white/60 transition-colors">
              [ return ]
            </span>
          </div>

        </div>
      </div>
    );
  }

  // 3. THE PAUSE View (Fulfills Rule 3 perfectly)
  if (isHoldingStill) {
    return (
      <div className="min-h-[480px] flex items-center justify-center select-none py-24">
        {/* Only stillness, no loader, no text, no animation */}
      </div>
    );
  }

  return (
    <div className={`py-4 animate-fade-in ${temporalVals.containerSpace}`} id="editorial-style-hub-root">
      
      <div className={`max-w-4xl mx-auto ${temporalVals.containerSpace}`}>
        
        {/* 1. MEMORY CONTINUITY (CORE CHANGE): Show ONE line only */}
        {memoryLine && (
          <div className="text-center pt-2 pb-2 select-none animate-fade-in relative z-15">
            <p className="font-serif italic text-sm text-white/55">
              “{memoryLine}”
            </p>
          </div>
        )}

        {undoAction && (
          <div className="text-center py-2 select-none animate-fade-in relative z-20 flex justify-center items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
              {undoAction.message}
            </span>
            <button
              onClick={() => {
                undoAction.rollback();
                setUndoAction(null);
                if (undoTimeoutRef.current) {
                  clearTimeout(undoTimeoutRef.current);
                }
              }}
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-white hover:text-white/80 underline cursor-pointer"
            >
              [ Undo ]
            </button>
          </div>
        )}

        {/* Unified HomeFeed Engine Implementation */}
        <HomeFeed 
          wardrobe={activeWardrobeList}
          onAddGarment={onAddGarment}
          onDeleteGarment={onDeleteGarment}
          user={user}
          onLogout={onLogout}
          onReset={onReset}
          onLoadSamples={onLoadSamples}
        />

        <div className="hidden pointer-events-none opacity-0 h-0 overflow-hidden select-none">
          <div className="flex justify-center gap-8 md:gap-12 border-b border-white/5 pb-6 overflow-x-auto select-none">
            {[
              { id: 'HOME', label: 'Morning table' },
              { id: 'WARDROBE', label: 'Archive wall' },
              { id: 'PLANNER', label: 'Unwritten desk' },
              { id: 'LEARN', label: 'Memory corner' },
              { id: 'SIGNATURE', label: 'Personal imprint' },
              { id: 'PRESENCE', label: 'Quiet control space' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  triggerQuietPause(() => {
                    setActiveSubTab(tab.id as any);
                  });
                }}
                className={`py-2 text-[10.5px] font-mono tracking-[0.25em] uppercase transition-all duration-150 cursor-pointer relative ${
                  activeSubTab === tab.id ? 'text-white' : 'text-white/30 hover:text-white/70'
                }`}
              >
                <span>{tab.label}</span>
                {activeSubTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-white/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              
              {/* ROOM 1: TODAY LOOK = EDITORIAL SPREAD */}
              {activeSubTab === 'HOME' && (
                <div className="space-y-16 max-w-sm mx-auto">
                  
                  {!state.activeSuggestion ? (
                    <div className="py-12 max-w-md mx-auto text-center space-y-16 select-none">
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">Placed on the morning table</span>
                        <h3 className="font-serif font-light tracking-[-0.03em] text-3xl text-white">A clean page</h3>
                        <p className="text-sm text-white/40 leading-relaxed font-light font-serif italic">
                          "Style is easier when nothing competes."
                        </p>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={triggerOutfitCompilation}
                          disabled={isCompiling}
                          className="bg-white hover:bg-[#EAEAEA] text-black text-[11px] font-mono font-semibold py-4 px-10 rounded-none uppercase tracking-[0.25em] cursor-pointer transition-all w-full sm:w-auto disabled:opacity-50"
                        >
                          {isCompiling ? "Arranging..." : "Arrange the morning table"}
                        </button>
                      </div>
                      
                      {(() => {
                        const onePiece = getDailyOnePiece(activeWardrobeList);
                        if (!onePiece) return null;
                        return (
                          <div className="pt-16 border-t border-white/5 space-y-6 text-center select-none">
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
                              Today, this came forward.
                            </span>
                            <div 
                              onClick={() => {
                                triggerQuietPause(() => {
                                  setSelectedGarment(onePiece);
                                });
                              }}
                              className="w-[180px] aspect-[4/5] mx-auto overflow-hidden bg-white/5 cursor-pointer hover:opacity-85 transition-opacity"
                            >
                              <ImageWithFade 
                                src={onePiece.imageUrl || getGarmentImage(onePiece.title)} 
                                alt={onePiece.title} 
                              />
                            </div>
                            <span className="text-[11px] font-serif pr-1 text-white/50 italic block">
                              {onePiece.title}
                            </span>
                          </div>
                        );
                      })()}

                      <EveningClosing />
                    </div>
                  ) : (
                    // Convert recommendation to beautiful physical fashion editorial page layout (no cards, wide margins)
                    <div className="space-y-12 max-w-sm mx-auto text-center py-4">
                      
                      {/* Placed for Today Title */}
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block select-none font-light">
                        Placed on the morning table
                      </span>

                      {/* Hero garment image */}
                      <div className="w-full relative shadow-sm aspect-[4/5] overflow-hidden bg-[#0d0d0d]">
                        <ImageWithFade 
                          src={state.activeSuggestion.items[0]?.imageUrl || getGarmentImage(state.activeSuggestion.items[0]?.title || '')} 
                          alt="Hero apparel" 
                        />
                      </div>
                      
                      {/* Text contents: quiet, clean luxury format */}
                      <div className="space-y-4 pt-4 select-none">
                        <h2 className="font-serif font-light text-2xl text-white tracking-[-0.03em] leading-tight">
                          {state.activeSuggestion.name || "Quiet Structure"}
                        </h2>
                        
                        {/* Dynamic weather-aware look note adapted quietly into the recommendation sentence */}
                        <p className="text-xs font-serif italic text-white/45 leading-relaxed max-w-xs mx-auto">
                          {getQuietContextNote(state.activeSuggestion.items)}
                        </p>

                        {/* Requirement A: Missing Pieces Awareness */}
                        {(() => {
                          const items = state.activeSuggestion.items;
                          const hasOuterwear = items.some(i => i.category === 'Outerwear' || i.title.toLowerCase().includes('coat') || i.title.toLowerCase().includes('jacket') || i.title.toLowerCase().includes('blazer'));
                          const hasAccessories = items.some(i => i.category === 'Accessories');
                          
                          if (!hasOuterwear || !hasAccessories) {
                            return (
                              <p className="text-[10px] font-mono tracking-[0.1em] text-white/30 pt-1" id="missing-pieces-sentence">
                                "This may be missing something."
                              </p>
                            );
                          }
                          return null;
                        })()}

                        {/* One Quiet Detail styling instruction */}
                        <p className="text-[11.5px] font-mono tracking-[0.12em] text-white/45 pt-1">
                          ↳ {getQuietDetailForOutfit(state.activeSuggestion.id)}
                        </p>

                        {/* STYLE GRAVITY ACTIVE RECOMMENDATION INDICATOR */}
                        {(() => {
                          const topAlt = state.alternativeOutfits?.[0];
                          if (topAlt && topAlt.styleIdentity) {
                            const badgeColor = topAlt.gravityMatch === 'High' 
                              ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' 
                              : topAlt.gravityMatch === 'Medium' 
                              ? 'border-blue-500/10 bg-blue-500/5 text-blue-400' 
                              : 'border-amber-500/10 bg-amber-500/5 text-amber-400';

                            return (
                              <div className="flex flex-col items-center gap-1.5 select-none pt-3 pb-1 border-y border-white/5 my-3 animate-fade-in">
                                <div className="flex justify-center items-center gap-2">
                                  <span className={`text-[8.5px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 border ${badgeColor}`}>
                                    Gravity: {topAlt.gravityMatch}
                                  </span>
                                  <span className="text-[8.5px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 border border-white/10 bg-white/5 text-white/70">
                                    {topAlt.styleIdentity}
                                  </span>
                                </div>
                                <span className="text-[10px] font-serif italic text-white/40 max-w-xs text-center px-4 leading-relaxed">
                                  "{topAlt.explanation || 'Matches your style density preferences.'}"
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* COLLECTION RHYTHM: Wear-aware repeat balance language */}
                        <p className="text-[10.5px] font-serif italic text-white/35 pt-2 animate-fade-in font-light">
                          {(() => {
                            const avgWear = activeWardrobeList.length > 0
                              ? activeWardrobeList.reduce((sum, item) => sum + (item.wearCount || 0), 0) / activeWardrobeList.length
                              : 0;
                            // shares at least one item with yesterday's outfit, or has a familiar (frequently worn) item
                            const sharesYesterday = (() => {
                              try {
                                const yestStr = typeof localStorage !== 'undefined' ? localStorage.getItem('yesterday_outfit_ids') || '' : '';
                                if (!yestStr) return false;
                                const yestIds = yestStr.split(',');
                                return state.activeSuggestion && state.activeSuggestion.items.some(item => yestIds.includes(item.id));
                              } catch (e) {
                                return false;
                              }
                            })();
                            const hasFamiliar = state.activeSuggestion.items.some(item => (item.wearCount || 0) > avgWear);
                            const isNear = sharesYesterday || hasFamiliar;
                            return isNear ? "Not far from yesterday." : "A different arrangement.";
                          })()}
                        </p>
                      </div>

                      {/* Requirement E: Seasonal Weight Atmosphere Selector */}
                      <div className="flex justify-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 pb-4 select-none">
                        <span className="text-white/20 font-light">Atmosphere:</span>
                        <button
                          onClick={() => {
                            saveWeatherWeight('lighter');
                            triggerOutfitCompilation();
                          }}
                          className={`hover:text-white transition-colors cursor-pointer ${weatherWeight === 'lighter' ? 'text-white font-medium border-b border-white/40' : 'text-white/30'}`}
                        >
                          [ lighter ]
                        </button>
                        <button
                          onClick={() => {
                            saveWeatherWeight('heavier');
                            triggerOutfitCompilation();
                          }}
                          className={`hover:text-white transition-colors cursor-pointer ${weatherWeight === 'heavier' ? 'text-white font-medium border-b border-white/40' : 'text-white/30'}`}
                        >
                          [ heavier ]
                        </button>
                        <button
                          onClick={() => {
                            saveWeatherWeight('layered');
                            triggerOutfitCompilation();
                          }}
                          className={`hover:text-white transition-colors cursor-pointer ${weatherWeight === 'layered' ? 'text-white font-medium border-b border-white/40' : 'text-white/30'}`}
                        >
                          [ layered ]
                        </button>
                      </div>

                      {/* Single Action Button */}
                      <div className="pt-2 flex flex-col items-center space-y-4">
                        {!wearingConfirmation ? (
                          <button
                            onClick={handleWearAction}
                            className="bg-white hover:bg-[#EAEAEA] text-black text-[11px] font-mono font-semibold py-4 px-12 rounded-none uppercase tracking-[0.25em] cursor-pointer transition-all active:scale-[0.99] w-full sm:w-auto"
                          >
                            [ wear ]
                          </button>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <button
                              onClick={() => handleConfirmWearWithReflection("Returned quietly.")}
                              className="bg-white hover:bg-[#EAEAEA] text-[#050505] text-[11px] font-mono font-bold py-4 px-8 rounded-none uppercase tracking-[0.22em] cursor-pointer transition-all active:scale-[0.99] w-full sm:w-auto"
                            >
                              [ Returned quietly. ]
                            </button>
                            <button
                              onClick={() => handleConfirmWearWithReflection("This stayed.")}
                              className="bg-[#121212] hover:bg-[#1f1f1f] border border-white/10 text-white text-[11px] font-mono py-4 px-8 rounded-none uppercase tracking-[0.18em] cursor-pointer transition-all active:scale-[0.99] w-full sm:w-auto"
                            >
                              [ This stayed. ]
                            </button>
                          </div>
                        )}
                        
                        <div className="flex flex-col items-center gap-2 pt-2">
                          <button
                            onClick={() => setShowAdjustOptions(!showAdjustOptions)}
                            className="text-[10px] text-white/50 hover:text-white font-mono uppercase tracking-[0.2em] transition-all font-light"
                          >
                            {showAdjustOptions ? "[ close ]" : "[ adjust ]"}
                          </button>
                          {showAdjustOptions && (
                            <div className="flex flex-col gap-2 pt-2 text-center animate-fade-in border-t border-white/5 w-full max-w-[200px]">
                              <button
                                onClick={() => {
                                  handleAdjustSlightly('swap');
                                  setShowAdjustOptions(false);
                                }}
                                className="text-[9.5px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white/80 py-1 transition-colors"
                              >
                                [ swap one piece ]
                              </button>
                              <button
                                onClick={() => {
                                  handleAdjustSlightly('lighter');
                                  setShowAdjustOptions(false);
                                }}
                                className="text-[9.5px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white/80 py-1 transition-colors"
                              >
                                [ lighter ]
                              </button>
                              <button
                                onClick={() => {
                                  handleAdjustSlightly('quieter');
                                  setShowAdjustOptions(false);
                                }}
                                className="text-[9.5px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white/80 py-1 transition-colors"
                              >
                                [ quieter ]
                              </button>
                              <button
                                onClick={() => {
                                  handleAdjustSlightly('familiar');
                                  setShowAdjustOptions(false);
                                }}
                                className="text-[9.5px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white/80 py-1 transition-colors"
                              >
                                [ familiar ]
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={triggerOutfitCompilation}
                          className="text-[10px] text-white/30 hover:text-white/60 font-mono uppercase tracking-[0.2em] pt-2 transition-all font-light"
                        >
                          [ Re-arrange ]
                        </button>
                      </div>

                      {feedbackSuccess && (
                        <div className="text-center text-xs text-white/60 font-mono uppercase tracking-[0.2em] py-2 animate-fade-in font-light">
                          {feedbackNote}
                        </div>
                      )}

                      {/* Alternative Outfits suggestions list */}
                      {state.alternativeOutfits && state.alternativeOutfits.length > 1 && (
                        <div className="pt-12 border-t border-white/5 space-y-6 text-center select-none animate-fade-in">
                          <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/40 block font-light">
                            [ alternative arrangements ]
                          </span>
                          <div className="flex flex-col gap-3 max-w-xs mx-auto text-left">
                            {state.alternativeOutfits.slice(1, 10).map((altOutfit, altIdx) => (
                              <button
                                key={altOutfit.id || altIdx}
                                onClick={() => {
                                  triggerQuietPause(() => {
                                    if (state.activeSuggestion) {
                                      const updatedSuggestion = {
                                        ...state.activeSuggestion,
                                        id: altOutfit.id,
                                        name: altOutfit.name,
                                        items: altOutfit.items,
                                        suitabilityScore: altOutfit.score,
                                      };
                                      state.activeSuggestion = updatedSuggestion;
                                      UnifiedFashionOS.notify();
                                    }
                                  });
                                }}
                                className="group w-full p-4 border border-white/5 bg-[#070707] hover:bg-[#101010] transition-all hover:border-white/10 flex flex-col gap-25 text-left rounded-none cursor-pointer animate-fade-in"
                              >
                                <div className="flex justify-between items-start gap-2 w-full">
                                  <span className="text-[10.5px] font-mono uppercase tracking-wider text-white/70 group-hover:text-white transition-colors">
                                    {altOutfit.name}
                                  </span>
                                  {altOutfit.gravityMatch && (
                                    <span className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 border ${
                                      altOutfit.gravityMatch === 'High' 
                                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                                        : altOutfit.gravityMatch === 'Medium'
                                        ? 'border-blue-500/20 bg-blue-500/5 text-blue-400'
                                        : 'border-amber-500/20 bg-amber-500/5 text-amber-400'
                                    }`}>
                                      {altOutfit.gravityMatch}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-serif italic text-white/45 leading-relaxed group-hover:text-white/60 transition-colors py-1.5 display-block">
                                  {altOutfit.explanation || altOutfit.reason || "High coherence pairing."}
                                </span>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5 w-full">
                                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">
                                    {altOutfit.styleIdentity || "Stylized Ensemble"}
                                  </span>
                                  <span className="text-[8px] font-mono tracking-widest text-[#ff3399]/60 uppercase font-semibold">
                                    {altOutfit.score} pts
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {(() => {
                        const onePiece = getDailyOnePiece(activeWardrobeList);
                        if (!onePiece) return null;
                        return (
                          <div className="pt-16 border-t border-white/5 space-y-6 text-center select-none">
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
                              Today, this came forward.
                            </span>
                            <div 
                              onClick={() => {
                                triggerQuietPause(() => {
                                  setSelectedGarment(onePiece);
                                });
                              }}
                              className="w-[180px] aspect-[4/5] mx-auto overflow-hidden bg-white/5 cursor-pointer hover:opacity-85 transition-opacity"
                            >
                              <ImageWithFade 
                                src={onePiece.imageUrl || getGarmentImage(onePiece.title)} 
                                alt={onePiece.title} 
                              />
                            </div>
                            <span className="text-[11px] font-serif pr-1 text-white/50 italic block">
                              {onePiece.title}
                            </span>
                          </div>
                        );
                      })()}

                      <EveningClosing />
                    </div>
                  )}

                </div>
              )}

              {/* ROOM 2: SHELVES ARCHIVE WITH MONO ATMOSPHERE */}
              {activeSubTab === 'WARDROBE' && (
                <div className="space-y-16 max-w-sm mx-auto animate-fade-in">
                  
                  {/* Human Header with Environmental Space label */}
                  <div className="text-center space-y-3 select-none">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
                      signature collection — {getAtmosphere(activeWardrobeList.length)}
                    </span>
                    <h2 className="font-serif font-light tracking-[-0.03em] text-4xl text-white">Archive wall</h2>
                    <p className="text-sm text-white/40 leading-relaxed font-light font-serif italic">
                      "A quiet collection of pieces waiting to be placed."
                    </p>
                  </div>

                  {/* Clean, minimalist search input (Requirement 3: searchable internally) */}
                  <div className="space-y-4 max-w-sm mx-auto">
                    <input
                      type="text"
                      placeholder="Search shelves..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-center border-b border-white/5 hover:border-white/15 focus:border-white/30 focus:outline-none transition-all py-3 text-xs font-mono uppercase tracking-[0.15em] text-white placeholder-white/20 select-text"
                    />

                    {/* Ownership Export Action (Requirement 6) */}
                    <div className="flex justify-center select-none pt-1">
                      <button
                        onClick={() => {
                          let penalties: any = [];
                          let last7: any = [];
                          let last10: any = [];
                          try {
                            penalties = JSON.parse(localStorage.getItem('pairing_penalties') || '[]');
                            last7 = JSON.parse(localStorage.getItem('last_7_worn_combinations') || '[]');
                            last10 = JSON.parse(localStorage.getItem('last_10_worn_combinations') || '[]');
                          } catch (e) {}

                          const snapshotObj = {
                            collected: activeWardrobeList.map(item => ({
                              title: item.title,
                              description: item.description,
                              belongs: item.location || "",
                              care: item.careNote || "",
                              note: item.privateNote || "",
                              placedElsewhere: !!item.placedElsewhere
                            })),
                            tomorrow_intention: tomorrowOutfit ? {
                              items: tomorrowOutfit.items.map(i => i.title),
                              note: tomorrowOutfit.note,
                              frozen: !!tomorrowFrozen
                            } : null,
                            penalties: penalties,
                            continuity_state: {
                              last_7_worn: last7,
                              last_10_worn: last10
                            }
                          };
                          setSnapshotData(JSON.stringify(snapshotObj, null, 2));
                          setShowSnapshot(true);
                        }}
                        className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                      >
                        [ Export collected snapshot ]
                      </button>
                    </div>

                    {/* View Switcher: Editorial vs Bento Grid (Requirement 🚀) */}
                    <div className="flex justify-center items-center gap-4 text-[9px] font-mono uppercase tracking-[0.2em] text-white/30 pt-4 select-none pb-2 border-b border-white/5">
                      <button
                        onClick={() => saveViewMode('GRID')}
                        className={`transition-colors cursor-pointer ${viewMode === 'GRID' ? 'text-white font-bold underline decoration-white/20 underline-offset-4' : 'hover:text-white/60'}`}
                      >
                        [ Bento Grid ]
                      </button>
                      <button
                        onClick={() => saveViewMode('EDITORIAL')}
                        className={`transition-colors cursor-pointer ${viewMode === 'EDITORIAL' ? 'text-white font-bold underline decoration-white/20 underline-offset-4' : 'hover:text-white/60'}`}
                      >
                        [ Editorial Layout ]
                      </button>
                    </div>
                  </div>

                  {/* Ownership Snapshot modal overlay (Requirement 6: Collected snapshot) */}
                  {showSnapshot && (
                    <div 
                      className="bg-neutral-900 border border-white/5 p-6 space-y-4 animate-fade-in text-left select-text relative"
                    >
                      <div className="flex justify-between items-center select-none border-b border-white/5 pb-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/60">Collected snapshot</span>
                        <button 
                          onClick={() => setShowSnapshot(false)}
                          className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 hover:text-white cursor-pointer"
                        >
                          [ close ]
                        </button>
                      </div>
                      <pre className="text-[10px] font-mono text-white/80 overflow-auto max-h-[250px] p-2 bg-black/40 rounded border border-white/5 whitespace-pre-wrap select-text">
                        {snapshotData}
                      </pre>
                    </div>
                  )}

                  {/* Forgotten Recovery (Requirement D: If active wardrobe list length > 8, surface up to 3 never worn or absent longest pieces on the wall) */}
                  {(() => {
                    if (activeWardrobeList.length <= 8) return null;

                    // Filter & sort: items with 0 wearCount (never worn) OR sorted by lastUsed (absent longest / oldest first)
                    const sortedForgotten = [...activeWardrobeList].sort((a, b) => {
                      const countA = a.wearCount || 0;
                      const countB = b.wearCount || 0;
                      if (countA !== countB) {
                        return countA - countB; // never worn first
                      }
                      const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
                      const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
                      return dateA - dateB; // oldest/absent longest first
                    });

                    const forgottenPieces = sortedForgotten.slice(0, 3);
                    if (forgottenPieces.length === 0) return null;

                    return (
                      <div className="pt-2 pb-6 border-b border-white/5 space-y-4 flex flex-col items-center">
                        <div className="flex justify-center gap-6 overflow-x-auto w-full pb-2">
                          {forgottenPieces.map(item => (
                            <div 
                              key={item.id}
                              onClick={() => setSelectedGarment(item)}
                              className="text-center cursor-pointer group w-16 flex-shrink-0"
                            >
                              <div className="w-16 mx-auto overflow-hidden bg-neutral-950 border border-white/5 aspect-[4/5] relative group-hover:border-white/20 transition-all duration-300">
                                <img 
                                  src={item.imageUrl || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"} 
                                  alt={item.title}
                                  className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-40 group-hover:opacity-85 transition-opacity"
                                  referrerPolicy="no-referrer"
                                />
                                {hasArchiveQualities(item) && (
                                  <div className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 border border-white/5 select-none z-10">
                                    <span className="text-[6px] font-mono uppercase tracking-wider text-white/50 block font-light">
                                      Kept.
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {searchQuery && displayedWardrobeList.length === 0 && (
                    <p className="text-center text-xs font-mono uppercase tracking-widest text-white/20 pt-6 select-none">
                      No matches found.
                    </p>
                  )}

                  {/* Ceremony state banner feedback */}
                  {ceremonyStatus && (
                    <div className="text-center text-sm font-serif italic text-white/65 py-3 animate-pulse pb-4">
                      {ceremonyStatus}
                    </div>
                  )}

                  {/* ADD PIECE CEREMONY STEP-BY-STEP FLOW */}
                  <div className="py-4 border-b border-white/5 pb-8">
                    {addStep === 'CLOSED' && (
                      <div className="flex justify-center select-none py-2">
                        <button
                          onClick={() => setAddStep('IMAGE')}
                          className="border border-white/10 hover:border-white/40 text-white/80 font-mono text-[11px] font-normal py-4 px-12 rounded-none uppercase tracking-[0.25em] cursor-pointer transition-all hover:bg-white/5 active:scale-[0.99]"
                        >
                          [ Place Piece ]
                        </button>
                      </div>
                    )}

                    {addStep === 'IMAGE' && (
                      <div className="space-y-6 max-w-sm mx-auto py-4 text-center animate-fade-in select-none">
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] block font-light">
                          Ceremony of Placing — The Photograph
                        </span>
                        <input
                          type="text"
                          placeholder="Paste image URL (or leave empty for fallback)..."
                          value={gImage}
                          onChange={(e) => setGImage(e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-center text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
                        />
                        <div className="flex justify-center gap-6 pt-2 font-mono text-[10px]">
                          <button
                            onClick={() => setAddStep('NAME')}
                            className="text-white hover:text-white/80 uppercase tracking-widest bg-white/5 px-6 py-3 border border-white/10 cursor-pointer font-light"
                          >
                            [ Next ]
                          </button>
                          <button
                            onClick={() => {
                              localStorage.removeItem('draft_add_step');
                              localStorage.removeItem('draft_g_title');
                              localStorage.removeItem('draft_g_desc');
                              setGImage('');
                              setGTitle('');
                              setGDesc('');
                              setAddStep('CLOSED');
                            }}
                            className="text-white/30 hover:text-white/60 uppercase tracking-widest py-3 cursor-pointer font-light"
                          >
                            [ Cancel ]
                          </button>
                        </div>
                      </div>
                    )}

                    {addStep === 'NAME' && (
                      <div className="space-y-6 max-w-sm mx-auto py-4 text-center animate-fade-in select-none">
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] block font-light">
                          Ceremony of Placing — Name of The Piece
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Black Wool Coat"
                          value={gTitle}
                          onChange={(e) => setGTitle(e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-center text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-serif font-light"
                        />
                        <div className="flex justify-center gap-6 pt-2 font-mono text-[10px]">
                          <button
                            onClick={() => {
                              if (gTitle.trim()) setAddStep('NOTE');
                            }}
                            disabled={!gTitle.trim()}
                            className="text-white hover:text-white/80 uppercase tracking-widest bg-white/5 px-6 py-3 border border-white/10 disabled:opacity-30 cursor-pointer font-light"
                          >
                            [ Next ]
                          </button>
                          <button
                            onClick={() => {
                              localStorage.removeItem('draft_add_step');
                              localStorage.removeItem('draft_g_title');
                              localStorage.removeItem('draft_g_desc');
                              setGImage('');
                              setGTitle('');
                              setGDesc('');
                              setAddStep('CLOSED');
                            }}
                            className="text-white/30 hover:text-white/60 uppercase tracking-widest py-3 cursor-pointer font-light"
                          >
                            [ Cancel ]
                          </button>
                        </div>
                      </div>
                    )}


                    {addStep === 'NOTE' && (
                      <div className="space-y-6 max-w-sm mx-auto py-4 text-center animate-fade-in select-none">
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] block font-light">
                          Ceremony of Placing — Memory / Footnote
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Cold mornings. (optional)"
                          value={gDesc}
                          onChange={(e) => setGDesc(e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-center text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-serif italic font-light"
                        />
                        <div className="flex justify-center gap-6 pt-4 font-mono text-[10px]">
                          <button
                            onClick={async () => {
                              if (!gTitle.trim()) return;
                              const fallbackUrl = gImage.trim() || getGarmentImage(gTitle);
                              const cleanNote = gDesc.trim() || 'Still feels right.';
                              triggerQuietPause(async () => {
                                if (onAddGarment) {
                                  await onAddGarment(gTitle, cleanNote, 'Casual', { imageUrl: fallbackUrl });
                                } else {
                                  const items = [...state.unifiedStyleMemory.wardrobe_items];
                                  items.push({
                                    id: `local-${Date.now()}`,
                                    title: gTitle,
                                    description: cleanNote,
                                    category: 'Casual',
                                    status: 'In Closet',
                                    userId: 'simulated-guest',
                                    createdAt: new Date(),
                                    imageUrl: fallbackUrl,
                                    primaryColor: 'Neutrals'
                                  });
                                  UnifiedFashionOS.syncWardrobeItems(items);
                                }

                                const responses = ['Newly remembered.', 'Placed on the shelf.'];
                                const word = responses[Math.floor(Math.random() * responses.length)];
                                setCeremonyStatus(word);
                                
                                localStorage.removeItem('draft_add_step');
                                localStorage.removeItem('draft_g_title');
                                localStorage.removeItem('draft_g_desc');
                                setGTitle('');
                                setGDesc('');
                                setGImage('');
                                setAddStep('CLOSED');

                                setTimeout(() => {
                                  setCeremonyStatus(null);
                                }, 2100);
                              });
                            }}
                            className="bg-white text-black hover:bg-[#EAEAEA] font-semibold px-10 py-4 uppercase tracking-[0.25em] cursor-pointer transition-all"
                          >
                            [ Keep This ]
                          </button>
                          <button
                            onClick={() => {
                              localStorage.removeItem('draft_add_step');
                              localStorage.removeItem('draft_g_title');
                              localStorage.removeItem('draft_g_desc');
                              setGImage('');
                              setGTitle('');
                              setGDesc('');
                              setAddStep('CLOSED');
                            }}
                            className="text-white/30 hover:text-white/60 uppercase tracking-widest py-4 cursor-pointer font-light"
                          >
                            [ Cancel ]
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Curated Pre-made Presets (Now Curated Pieces) */}
                  <div className="text-center space-y-6 pt-4">
                    <span className="text-[10px] font-mono text-white/35 uppercase tracking-[0.25em] block font-light">CURATED PIECES</span>
                    <div className="flex flex-wrap justify-center gap-2 select-none">
                      {presets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handleApplyPreset(preset)}
                          className="text-[9.5px] font-mono text-white/60 bg-white/5 hover:bg-white hover:text-black border border-white/10 px-4 py-2 rounded-none transition-all cursor-pointer whitespace-nowrap font-light"
                        >
                          + {preset.title.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Closet Showcase — Shelves single column layout with large vertical rhythm */}
                  <div className="pt-12 select-none">
                    {activeWardrobeList.length === 0 ? (
                       <EmptyStateLibrary 
                         type="no_wardrobe" 
                         onAction={handleLoadPresetsAutomatically} 
                       />
                    ) : viewMode === 'GRID' ? (
                        <div className="pt-6">
                          <WardrobeGrid
                            items={displayedWardrobeList}
                            categories={['Casual', 'Formal', 'Sportswear', 'Outerwear', 'Accessories']}
                            onSelect={(item: any) => {
                              triggerQuietPause(() => {
                                try {
                                  const history = JSON.parse(localStorage.getItem('wardrobe_touch_history') || '{}');
                                  history[item.id] = Date.now();
                                  localStorage.setItem('wardrobe_touch_history', JSON.stringify(history));
                                } catch (e) {}
                                setSelectedGarment(item);
                              });
                            }}
                            onDelete={async (item: any) => {
                              if (confirm(`Let go of "${item.title}"?`)) {
                                triggerQuietPause(async () => {
                                  if (onDeleteGarment) {
                                    await onDeleteGarment(item.id);
                                  } else {
                                    const updated = activeWardrobeList.filter((x) => x.id !== item.id);
                                    UnifiedFashionOS.syncWardrobeItems(updated);
                                  }
                                });
                              }
                            }}
                          />
                        </div>
                    ) : (
                       <div className="space-y-12">
                         {/* COLLECTION VIEW */}
                         <div className={`py-12 select-none flex flex-col ${temporalVals.itemGap}`}>
                           {getNaturalRotatedList(displayedWardrobeList).map((item, index) => {
                             const offsetItem = [
                               'max-w-[290px] mr-auto pl-4 text-left',
                               'max-w-[330px] mx-auto px-6 text-center',
                               'max-w-[300px] ml-auto pr-4 text-right',
                               'max-w-[310px] mx-auto pl-8 text-center',
                             ][index % 4];

                             return (
                               <div 
                                 key={item.id} 
                                 onClick={() => {
                                   triggerQuietPause(() => {
                                     try {
                                        const history = JSON.parse(localStorage.getItem('wardrobe_touch_history') || '{}');
                                        history[item.id] = Date.now();
                                        localStorage.setItem('wardrobe_touch_history', JSON.stringify(history));
                                      } catch (e) {}
                                      setSelectedGarment(item);
                                   });
                                 }}
                                 className={`flex flex-col gap-5 group relative p-1 transition-all duration-150 cursor-pointer ${offsetItem}`}
                               >
                                
                                 {/* Image First */}
                                <div className="w-full relative overflow-hidden bg-[#0d0d0d]">
                                  <ImageWithFade 
                                    src={item.imageUrl || getGarmentImage(item.title)} 
                                    alt={item.title} 
                                  />
                                  {hasArchiveQualities(item) && (
                                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 border border-white/5 select-none z-10">
                                      <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-white/50 block font-light">
                                        Kept.
                                      </span>
                                    </div>
                                  )}
                                </div>

                                 {/* Title and Footnote */}
                                <div className="space-y-4 pt-1">
                                  <h3 className="font-serif font-light text-[21px] text-white/95 tracking-[-0.02em] leading-tight">
                                    {item.title}
                                  </h3>
                                  
                                  <p className="text-xs font-serif italic text-white/40 tracking-wide leading-relaxed">
                                    {getAtmosphereLine(item)}{item.careNote ? ` · ${item.careNote}` : ""}
                                  </p>
                                </div>

                                 {/* Hover menu release action */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 py-1">
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation(); // Avoid opening garment details page screen overlay!
                                      if (confirm("Let go of this piece?")) {
                                        triggerQuietPause(async () => {
                                          if (onDeleteGarment) {
                                            await onDeleteGarment(item.id);
                                          } else {
                                            const updated = activeWardrobeList.filter((x) => x.id !== item.id);
                                            UnifiedFashionOS.syncWardrobeItems(updated);
                                          }
                                        });
                                      }
                                    }}
                                    className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors cursor-pointer font-light"
                                  >
                                    [ Let go ]
                                  </button>
                                </div>

                                 {/* Physical asymmetrical shelf element underneath each garment */}
                                <div className={`mt-5 border-b border-white/[0.04] group-hover:border-white/[0.09] transition-all duration-300 ${
                                  index % 4 === 0 ? 'w-[75%] mr-auto' :
                                  index % 4 === 1 ? 'w-[92%] mx-auto' :
                                  index % 4 === 2 ? 'w-[80%] ml-auto' :
                                  'w-[86%] mx-auto'
                                }`} />

                              </div>
                             );
                           })}
                         </div>
                       </div>
                    )}
                  </div>

                </div>
              )}

              {/* Seen again faint rows (Requirement 5) */}
              {activeSubTab === 'WARDROBE' && activeWardrobeList.filter(item => item.placedElsewhere).length > 0 && (
                <div className="pt-24 border-t border-white/[0.04] space-y-8 select-none max-w-sm mx-auto">
                  <div className="text-center">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
                      Seen again.
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 pb-8">
                    {activeWardrobeList.filter(item => item.placedElsewhere).map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => {
                          triggerQuietPause(() => {
                            setSelectedGarment(item);
                          });
                        }}
                        className="space-y-3 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity duration-150 animate-fade-in"
                        id={`seen-again-item-${item.id}`}
                      >
                        <div className="w-full aspect-[4/5] overflow-hidden bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
                          <img 
                            src={item.imageUrl || getGarmentImage(item.title)} 
                            alt={item.title}
                            className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-center min-w-0">
                          <h4 className="font-serif font-light text-sm text-white/50 group-hover:text-white/95 truncate px-1 transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[8px] font-mono uppercase tracking-[0.1em] text-white/30 block mt-0.5 group-hover:text-white/50 transition-colors">
                            [ put away ]
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real Closet Awareness: These have not been seen lately. (Requirement 4) */}
              {activeSubTab === 'WARDROBE' && activeWardrobeList.length >= 5 && (
                <div className="pt-24 border-t border-white/[0.04] space-y-8 select-none max-w-sm mx-auto">
                  <div className="text-center">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
                      These have not been seen lately.
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pb-8">
                    {[...activeWardrobeList]
                      .sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0))
                      .slice(0, 3)
                      .map((item) => (
                        <div 
                          key={item.id} 
                          className="space-y-2 cursor-pointer group/seen"
                          onClick={() => {
                            triggerQuietPause(() => {
                              setSelectedGarment(item);
                            });
                          }}
                        >
                          <div className="w-full aspect-[4/5] overflow-hidden bg-white/5 relative bg-[#0d0d0d]">
                            <ImageWithFade 
                              src={item.imageUrl || getGarmentImage(item.title)} 
                              alt={item.title} 
                            />
                          </div>
                          <div className="text-center">
                            <h4 className="font-serif font-light text-[10.5px] text-white/50 group-hover/seen:text-white/80 truncate px-1 transition-colors">
                              {item.title}
                            </h4>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ROOM 3: TOMORROW (PLANNER) */}
              {activeSubTab === 'PLANNER' && (
                <div className="space-y-12 max-w-sm mx-auto">
                  
                  {/* Human Scheduler Header */}
                  <div className="text-center space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">UNWRITTEN DESK</span>
                    <h2 className="font-serif font-light tracking-[-0.03em] text-4xl text-white">Tomorrow's look</h2>
                    <p className="text-sm text-white/40 leading-relaxed font-light font-serif italic">
                      "Place exactly one outfit for the hours ahead."
                    </p>
                  </div>

                  {!tomorrowOutfit ? (
                    <div className="space-y-10 py-4 text-left">
                      {/* Form to save exactly one outfit */}
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-mono text-white/30 uppercase tracking-[0.14em] block font-light mb-3">
                            Select garment
                          </label>
                          {activeWardrobeList.length === 0 ? (
                            <p className="text-xs text-white/30 italic font-serif">Nothing here yet.</p>
                          ) : (
                            <select
                              id="tomorrow-garment-select"
                              className="w-full bg-[#111] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/35 font-serif rounded-none"
                              defaultValue=""
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                  const found = activeWardrobeList.find(x => x.id === val);
                                  if (found) {
                                    setTempTomorrowItems([found]);
                                  }
                                }
                              }}
                            >
                              <option value="" disabled>Choose a piece to place...</option>
                              {activeWardrobeList.map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.title}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Prepare now (Requirement 3) */}
                        {state.activeSuggestion && (
                          <div className="text-center p-4 bg-white/[0.02] border border-white/5 space-y-2 select-none">
                            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30 block">
                              Carry over today's look
                            </span>
                            <button
                              onClick={() => {
                                if (state.activeSuggestion) {
                                  const prevTomorrow = tomorrowOutfit;
                                  saveTomorrowOutfit({
                                    items: state.activeSuggestion.items,
                                    note: "Left in place."
                                  });
                                  registerUndo(() => {
                                    saveTomorrowOutfit(prevTomorrow);
                                  });
                                }
                              }}
                              className="bg-white hover:bg-[#EAEAEA] text-black text-[10px] font-mono font-semibold py-2.5 px-6 rounded-none uppercase tracking-[0.2em] cursor-pointer transition-all animate-fade-in"
                            >
                              Prepare now
                            </button>
                          </div>
                        )}

                        {tempTomorrowItems.length > 0 && (
                          <div className="p-3 bg-white/5 border border-white/5 text-center text-xs italic font-serif text-white/70">
                            Selected: {tempTomorrowItems.map(i => i.title).join(" & ")}
                          </div>
                        )}

                        <div className="space-y-3">
                          <label className="text-[10px] font-mono text-white/30 uppercase tracking-[0.14em] block font-light">
                            A short note
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. For early hours."
                            value={tomorrowNote}
                            onChange={(e) => setTomorrowNote(e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
                          />
                          
                          <div className="flex flex-wrap gap-2 pt-1">
                            {["For early hours.", "For walking.", "Keep simple."].map(presetNote => (
                              <button
                                key={presetNote}
                                onClick={() => setTomorrowNote(presetNote)}
                                className="text-[9px] font-mono text-white/40 hover:text-white/85 border border-white/5 px-2.5 py-1 cursor-pointer"
                              >
                                {presetNote}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 flex justify-center">
                          <button
                            onClick={() => {
                              if (tempTomorrowItems.length === 0) {
                                alert("Please select a garment first.");
                                return;
                              }
                              const prevTomorrow = tomorrowOutfit;
                              saveTomorrowOutfit({
                                items: tempTomorrowItems,
                                note: tomorrowNote || "Keep simple."
                              });
                              registerUndo(() => {
                                saveTomorrowOutfit(prevTomorrow);
                              });
                            }}
                            className="bg-white hover:bg-[#EAEAEA] text-black text-[11px] font-mono font-semibold py-4 px-10 rounded-none uppercase tracking-[0.25em] cursor-pointer transition-all"
                          >
                            [ Save for tomorrow ]
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-10 py-4 text-center">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block select-none font-light">
                        Placed on the desk
                      </span>

                      {/* Outfit Preview */}
                      <div className="w-[280px] mx-auto relative shadow-sm aspect-[4/5] overflow-hidden bg-[#0d0d0d]">
                        <ImageWithFade 
                          src={tomorrowOutfit.items[0]?.imageUrl || getGarmentImage(tomorrowOutfit.items[0]?.title || '')} 
                          alt="Tomorrow look" 
                        />
                      </div>

                      <div className="space-y-2 select-none">
                        <h4 className="font-serif font-light text-2xl text-white">
                          {tomorrowOutfit.items.map(i => i.title).join(" & ")}
                        </h4>
                        <p className="text-xs font-serif italic text-white/50 max-w-xs mx-auto leading-relaxed">
                          "{tomorrowOutfit.note}"
                        </p>
                      </div>

                      <div className="pt-4 flex flex-col items-center gap-4">
                        <button
                          onClick={() => {
                            const prevTomorrow = tomorrowOutfit;
                            const prevActiveSuggestion = state.activeSuggestion;
                            // Move tomorrow look to today's suggestion
                            triggerQuietPause(() => {
                              const suggested: UnifiedOutfit = {
                                id: `out-${Date.now()}`,
                                name: tomorrowOutfit.items.map(i => i.title).join(" & "),
                                items: tomorrowOutfit.items,
                                suitabilityScore: 100,
                                occasion: tomorrowOutfit.note,
                                generatedAt: new Date().toISOString().split('T')[0],
                                vibeTags: ['minimalist']
                              };
                              UnifiedFashionOS.getState().activeSuggestion = suggested;
                              // Clear tomorrow look and reset temp choices
                              saveTomorrowOutfit(null);
                              setTempTomorrowItems([]);
                              setTomorrowNote('');
                              // Go to HOME tab
                              setActiveSubTab('HOME');

                              registerUndo(() => {
                                saveTomorrowOutfit(prevTomorrow);
                                UnifiedFashionOS.getState().activeSuggestion = prevActiveSuggestion;
                                setActiveSubTab('PLANNER');
                              });
                            });
                          }}
                          className="bg-white hover:bg-[#EAEAEA] text-black text-[11px] font-mono font-semibold py-4 px-12 rounded-none uppercase tracking-[0.25em] cursor-pointer transition-all w-full sm:w-auto"
                        >
                          [ wear look today ]
                        </button>
                        
                        <button
                          onClick={() => {
                            saveTomorrowFrozen(!tomorrowFrozen);
                          }}
                          className={`text-[10px] uppercase tracking-[0.25em] font-mono transition-all cursor-pointer ${
                            tomorrowFrozen 
                              ? 'text-white border-b border-dashed border-white/50 pb-0.5' 
                              : 'text-white/40 hover:text-white/85'
                          }`}
                          id="tomorrow-freeze-toggle"
                        >
                          {tomorrowFrozen ? '[ Frozen ready ]' : '[ Leave ready ]'}
                        </button>

                        <button
                          onClick={() => {
                            triggerQuietPause(() => {
                              saveTomorrowOutfit(null);
                              setTempTomorrowItems([]);
                              setTomorrowNote('');
                            });
                          }}
                          className="text-[10px] text-white/30 hover:text-white/60 font-mono uppercase tracking-[0.2em] transition-all font-light cursor-pointer"
                        >
                          [ Let go of this look ]
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ROOM 4: MOMENTS (Reflections journal without numbers) */}
              {activeSubTab === 'LEARN' && (
                <div className="space-y-16 max-w-xl mx-auto pb-12 animate-fade-in">
                  
                  <div className="space-y-16">
                    <div className="space-y-3 text-center">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">WARDROBE JOURNAL</span>
                      <h2 className="font-serif font-light tracking-[-0.03em] text-4xl text-white">Memory corner</h2>
                      <p className="text-sm text-white/40 leading-relaxed font-light font-serif italic">
                        "Quiet reflections on choices worn over time."
                      </p>
                    </div>

                    {/* Poetic lines precisely as requested */}
                    <div className="space-y-20 text-center select-none py-12 border-t border-b border-white/5">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono tracking-[0.25em] text-white/30 uppercase block font-light">Yesterday</span>
                        <p className="font-serif italic text-2xl text-white/75 font-light max-w-xs mx-auto leading-relaxed">
                          Comfort chosen quietly.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono tracking-[0.25em] text-white/30 uppercase block font-light">Earlier</span>
                        <p className="font-serif italic text-2xl text-white/75 font-light max-w-xs mx-auto leading-relaxed">
                          Repeated without effort.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-mono tracking-[0.25em] text-white/30 uppercase block font-light">Returned often</span>
                        <p className="font-serif italic text-2xl text-white/75 font-light max-w-xs mx-auto leading-relaxed">
                          Certain shapes remain.
                        </p>
                      </div>
                    </div>

                    {/* Understated journal signature lines with zero logs/timestamps */}
                    <div className="space-y-8 text-center max-w-xs mx-auto">
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.25em] block font-light">
                        ROOM SILHOUETTES
                      </span>
                      <div className="space-y-4">
                        {(() => {
                          const feedbackSignals = state.unifiedStyleMemory.feedback_signals;
                          if (feedbackSignals.length === 0) {
                            return (
                              <p className="text-xs text-white/35 italic font-serif leading-relaxed">
                                No silhouettes have left their imprint yet. Rhythms are waiting.
                              </p>
                            );
                          }
                          
                          // MEMORY WITHOUT HISTORY: Simple poetic summaries based on wardrobe content
                          const summaries = [];
                          const hasDark = activeWardrobeList.some(item => {
                            const t = item.title.toLowerCase();
                            return t.includes("black") || t.includes("dark") || t.includes("charcoal") || t.includes("slate") || t.includes("midnight");
                          });
                          const hasLight = activeWardrobeList.some(item => {
                            const t = item.title.toLowerCase();
                            return t.includes("white") || t.includes("light") || t.includes("cream") || t.includes("linen") || t.includes("ivory") || t.includes("beige");
                          });
                          
                          if (hasLight) {
                            summaries.push("Lighter pieces stayed nearby.");
                          }
                          if (hasDark) {
                            summaries.push("Darker silhouettes returned to the rack.");
                          }
                          summaries.push("A preference for softer layers.");
                          if (feedbackSignals.length > 2) {
                            summaries.push("Steady outlines have begun to settle.");
                          } else {
                            summaries.push("Silence is keeping time with you.");
                          }

                          return summaries.map((phrase, idx) => (
                            <div key={idx} className="text-xs font-serif italic text-white/50 py-1">
                              {phrase}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ROOM 5: SIGNATURE */}
              {activeSubTab === 'SIGNATURE' && (
                <div className="space-y-16 max-w-md mx-auto py-8 text-center animate-fade-in select-none">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
                      SARTORIAL IDENTITY
                    </span>
                    <h2 className="font-serif font-light tracking-[-0.03em] text-4xl text-white">Personal imprint</h2>
                    <p className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed font-serif italic italic">
                      "Your taste is a quiet signature of the archives you hold."
                    </p>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em] block font-light">
                        Current Holder
                      </span>
                      <strong className="font-serif font-light text-xl text-white">
                        {user?.displayName || 'Sartorialist'}
                      </strong>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em] block font-light">
                        Presence Tier
                      </span>
                      <span className="text-xs font-mono text-white/60 tracking-wider">
                        {user?.isAnonymous ? 'TEMPORARY PRESENCE' : 'PERMANENT ARCHIVE MEMBER'}
                      </span>
                    </div>

                    <div className="pt-8">
                      <button
                        onClick={onLogout}
                        className="text-[10px] font-mono uppercase tracking-[0.2em] border border-white/10 hover:border-white px-8 py-4 transition-all hover:bg-white/5 cursor-pointer text-white/70 hover:text-white"
                      >
                        [ Sign out of Signature ]
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ROOM 6: PRESENCE */}
              {activeSubTab === 'PRESENCE' && (
                <div className={`${showFounderConsole ? 'max-w-4xl' : 'max-w-md'} mx-auto py-8 text-center animate-fade-in select-none`}>
                  {showFounderConsole ? (
                    <div className="space-y-6 text-left">
                      <div className="flex justify-between items-center pb-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">ADMINISTRATIVE CONTROL BOUNDARY</span>
                        <button 
                          onClick={() => setShowFounderConsole(false)}
                          className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-[0.15em] cursor-pointer"
                        >
                          [ Back to Quiet Space ]
                        </button>
                      </div>
                      <FounderDashboard />
                    </div>
                  ) : (
                    <div className="space-y-16">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
                          ROOM ATMOSPHERE
                        </span>
                        <h2 className="font-serif font-light tracking-[-0.03em] text-4xl text-white">Quiet control space</h2>
                        <p className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed font-serif italic italic">
                          "Maintain the quiet space of your monochrome room."
                        </p>
                      </div>

                      {/* Founder Dashboard Gateway */}
                      <div className="pt-2">
                        <button
                          onClick={() => setShowFounderConsole(true)}
                          className="w-full bg-white/5 border border-white/10 hover:bg-white/15 text-white/80 py-4 font-mono text-[10px] uppercase tracking-[0.25em] transition-all cursor-pointer font-semibold"
                        >
                          [ Open Founder Dashboard ]
                        </button>
                      </div>

                      <div className="space-y-8 pt-6 border-t border-[#1a1a1a]/5 border-white/5">
                    
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em] block font-light">
                        Actions
                      </span>
                      
                      <div className="flex flex-col gap-4 max-w-xs mx-auto pt-2">
                        <button
                          onClick={() => {
                            if (onLoadSamples) {
                              onLoadSamples();
                            }
                          }}
                          disabled={isResetting}
                          className="bg-white hover:bg-neutral-200 text-black py-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer font-semibold"
                        >
                          [ Gather sample pieces ]
                        </button>
 
                        <button
                          onClick={() => {
                            if (onReset) {
                              if (confirm("Let go of all pieces? This action is permanent.")) {
                               onReset();
                              }
                            }
                          }}
                          disabled={isResetting}
                          className="border border-white/15 hover:border-white/30 text-white/80 hover:text-white py-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer font-light"
                        >
                          [ Let Go of All Pieces ]
                        </button>
 
                        <button
                          onClick={() => {
                            if (onEnterSilence) {
                              onEnterSilence();
                            }
                          }}
                          className="bg-transparent text-white/40 hover:text-white py-2 font-mono text-[9.5px] uppercase tracking-[0.2em] transition-all cursor-pointer font-light pt-4"
                        >
                          [ Enter Silence ]
                        </button>
                      </div>
                    </div>

                    <div className="pt-6 text-[10px] font-mono text-white/20 uppercase tracking-[0.15em] font-light">
                      Companion volume 11 // offline resilient signature space.
                    </div>

                    {/* SYSTEM GOVERNOR & ADAPTIVE LOOP REPORT */}
                    {(() => {
                      const report = state.systemGovernorReport || {
                        status: 'Balanced',
                        detectedIssues: ['Initial system launch - system parameters fully stable.'],
                        weights: { scoring: 35, diversity: 25, quietControl: 20, gravity: 20 },
                        learningUpdates: {
                          updatedPreferences: 'Initial factory coordinates loaded.',
                          ignoredPatterns: 'No repetitive negative signals registered.',
                          reinforcedStyles: 'Sartorial DNA is awaiting custom wear and planning confirmations.'
                        },
                        nextCyclePrediction: 'Excellent stability predicted. Open for discovery style coordinates.'
                      };

                      return (
                        <div className="pt-8">
                          <SystemHealthPanel
                            systemHealthScore={state.systemGovernorReport ? 100 - (state.systemGovernorReport.detectedIssues?.length || 0) * 15 : 95}
                            learningSpeedPercent={85}
                            biasReductionFactor={92}
                            readyForProduction={true}
                            avgGenerationTime={32}
                            storageUsageBytes={5200}
                            onRunRehearsal={() => {
                              triggerQuietPause(() => {
                                // Simulate rehearsal log update
                                const internalState = UnifiedFashionOS.getState();
                                if (internalState.systemGovernorReport) {
                                  internalState.systemGovernorReport.detectedIssues = [
                                    "System rehearsal successful. Offline synchronization queue is empty.",
                                    "All 3 core security rules checked against Firestore blueprints successfully."
                                  ];
                                  UnifiedFashionOS.recalculateGoLiveGate();
                                  UnifiedFashionOS.notify();
                                }
                              });
                            }}
                            onClearMemory={() => {
                              if (confirm("Reset current adaptation loop weights?")) {
                                triggerQuietPause(() => {
                                  const internalState = UnifiedFashionOS.getState();
                                  if (internalState.systemGovernorReport?.weights) {
                                    internalState.systemGovernorReport.weights = { scoring: 35, diversity: 25, quietControl: 20, gravity: 20 };
                                    internalState.systemGovernorReport.detectedIssues = [
                                      "Memory buffer flushed. System weights reset to equal distribution parameters."
                                    ];
                                    UnifiedFashionOS.recalculateGoLiveGate();
                                    UnifiedFashionOS.notify();
                                  }
                                });
                              }
                            }}
                          />
                        </div>
                      );
                    })()}
                  </div>
                  </div>
                )}
              </div>
            )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <FloatingAIChat wardrobe={activeWardrobeList} />
    </div>
  );
};
