import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db, logout, OperationType, handleFirestoreError } from './firebase';
import { WardrobeItem, ClothingCategory } from './types';
import { WardrobeService } from './features/wardrobe/wardrobeService';
import { AuthModule } from './components/AuthModule';
import { ErrorBoundary } from './components/ErrorBoundary';
import { WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
const AIStyleHub = React.lazy(() => import('./components/AIStyleHub').then(m => ({ default: m.AIStyleHub })));
import { UnifiedFashionOS } from './features/ai-core/UnifiedFashionOS';

// Temporal light rules mapper
export function getTemporalTheme() {
  const hr = new Date().getHours();
  if (hr >= 4 && hr < 12) {
    // Morning: soft lifted paper light (slightly more open)
    return {
      bg: 'bg-[#161614]',
      text: 'text-neutral-200',
      tracking: 'tracking-[0.05em]',
      leading: 'leading-relaxed',
      densityClass: 'tracking-wide leading-relaxed opacity-85',
      timeLabel: 'Morning light'
    };
  } else if (hr >= 12 && hr < 18) {
    // Afternoon: neutral grounded stillness
    return {
      bg: 'bg-[#0c0c0d]',
      text: 'text-neutral-300',
      tracking: 'tracking-normal',
      leading: 'leading-normal',
      densityClass: 'tracking-normal leading-normal opacity-90',
      timeLabel: 'Quiet stillness'
    };
  } else {
    // Evening: dense quiet shadow (slightly denser)
    return {
      bg: 'bg-[#020202]',
      text: 'text-white/80',
      tracking: 'tracking-tight',
      leading: 'leading-tight',
      densityClass: 'tracking-tight leading-normal opacity-100',
      timeLabel: 'Evening shadow'
    };
  }
}

const initialUser = (() => {
  try {
    const stored = localStorage.getItem('firebase_user_session');
    if (stored) {
      return JSON.parse(stored) as User;
    }
  } catch (e) {
    console.warn("Stored user session fallback parsing halted:", e);
  }
  try {
    const wasGuestActive = localStorage.getItem('auth_guest_active') === 'true';
    if (wasGuestActive) {
      return {
        uid: 'guest-sartorialist-user-100',
        displayName: 'Guest Sartorialist',
        email: 'guest@companion.com',
        isAnonymous: true
      } as User;
    }
  } catch (e) {
    console.warn("Guest presence verification failed:", e);
  }
  return null;
})();

export default function App() {
  const [user, setUser] = useState<User | null>(initialUser);
  const [constructions, setConstructions] = useState<WardrobeItem[]>([]);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaderStage, setLoaderStage] = useState(0);
  const [isSilent, setIsSilent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showCover, setShowCover] = useState(false);
  
  // Rotating footer index
  const [footerIndex, setFooterIndex] = useState(0);
  useEffect(() => {
    const tm = setInterval(() => {
      setFooterIndex(prev => (prev + 1) % 4);
    }, 15000);
    return () => clearInterval(tm);
  }, []);

  // Offline State Tracking
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Soft staged loading timer steps mapping to physical space appearance
  useEffect(() => {
    if (loading) {
      const s1 = setTimeout(() => setLoaderStage(1), 200);
      const s2 = setTimeout(() => setLoaderStage(2), 800);
      const s3 = setTimeout(() => setLoaderStage(3), 1500);
      return () => {
        clearTimeout(s1);
        clearTimeout(s2);
        clearTimeout(s3);
      };
    }
  }, [loading]);

  // Sync authentication state either through Firebase or through local Guest persistence
  useEffect(() => {
    // 1. Listen to Firebase standard state
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      const minDelay = new Promise(resolve => setTimeout(resolve, 2600));
      if (u) {
        const uSession = {
          uid: u.uid,
          displayName: u.displayName || 'Sartorialist',
          email: u.email || '',
          isAnonymous: u.isAnonymous
        };
        localStorage.setItem('firebase_user_session', JSON.stringify(uSession));
        setUser(u);
        UnifiedFashionOS.trackEvent('login', { type: 'firebase' });
      } else {
        localStorage.removeItem('firebase_user_session');
        // 2. Check if Guest mode was previously activated
        const wasGuestActive = localStorage.getItem('auth_guest_active') === 'true';
        if (wasGuestActive) {
          setUser({
            uid: 'guest-sartorialist-user-100',
            displayName: 'Guest Sartorialist',
            email: 'guest@companion.com',
            isAnonymous: true
          } as User);
        } else {
          setUser(null);
        }
      }
      await minDelay;
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync core user identity and role to Firestore upon successful authentication
  useEffect(() => {
    if (!user || user.isAnonymous || user.uid.startsWith('guest-')) {
      return;
    }

    const { uid, displayName, email } = user;
    const userDocRef = doc(db, 'users', uid);

    const unsubUser = onSnapshot(userDocRef, (snap) => {
      if (!snap.exists()) {
        const defaultProfile = {
          uid,
          displayName: displayName || 'Sartorialist',
          email: email || '',
          role: 'user',
          createdAt: new Date().toISOString()
        };
        setDoc(userDocRef, defaultProfile).catch((err) => {
          console.error("Failed to bootstrap user role tracking document in Firestore:", err);
        });
      }
    }, (error) => {
      console.warn("User profile sync stream paused (offline fallback active):", error.message || error);
    });

    return () => unsubUser();
  }, [user]);

  // Listen to the wardrobe database collection
  useEffect(() => {
    if (!user) {
      setWardrobe([]);
      return;
    }

    // In guest mode, bypass reading from cloud database to respect offline sandbox performance
    if (user.isAnonymous || user.uid.startsWith('guest-')) {
      const stored = localStorage.getItem('local_wardrobe_items');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as WardrobeItem[];
          setWardrobe(parsed);
          UnifiedFashionOS.syncWardrobeItems(parsed);
        } catch (e) {
          console.error("Local wardrobe read failure:", e);
        }
      } else {
        setWardrobe([]);
        UnifiedFashionOS.syncWardrobeItems([]);
      }
      return;
    }

    const q = query(
      collection(db, 'wardrobe'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<WardrobeItem, 'id'>)
      })) as WardrobeItem[];
      
      docs.sort((a, b) => (b.createdAt?.seconds || 0) * 1000 - (a.createdAt?.seconds || 0) * 1000);
      setWardrobe(docs);
      UnifiedFashionOS.syncWardrobeItems(docs);

      // Enable resilient offline cache backup
      try {
        localStorage.setItem(`cached_wardrobe_${user.uid}`, JSON.stringify(docs));
      } catch (e) {
        console.warn("Storage limit reached for local caching:", e);
      }
    }, (error) => {
      // Gracefully handle connection drop or firestore transient unavailability
      console.warn("Firestore wardrobe connection degraded (offline fallback active):", error.message || error);
      try {
        const stored = localStorage.getItem(`cached_wardrobe_${user.uid}`);
        if (stored) {
          const parsed = JSON.parse(stored) as WardrobeItem[];
          setWardrobe(parsed);
          UnifiedFashionOS.syncWardrobeItems(parsed);
        }
      } catch (fallbackErr) {
        console.error("Local backup retrieval stalled:", fallbackErr);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Backward Compatibility: Listen to legacy constructions and map to wardrobe items dynamically
  useEffect(() => {
    if (!user) {
      setConstructions([]);
      return;
    }

    // Skip constructions lookup in guest modes
    if (user.isAnonymous || user.uid.startsWith('guest-')) {
      setConstructions([]);
      return;
    }

    const q = query(
      collection(db, 'constructions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const raw = doc.data();
        
        // Map legacy states to equivalent fashion model states
        const statusMap: Record<string, WardrobeItem['status']> = {
          'Planning': 'In Closet',
          'In Progress': 'Planned',
          'Completed': 'Worn/Wash'
        };
        const categoryMap: Record<string, ClothingCategory> = {
          'Residential': 'Casual',
          'Commercial': 'Formal',
          'Infrastructure': 'Sportswear',
          'Renovation': 'Outerwear',
          'Other': 'Accessories'
        };

        const mappedCategory = (categoryMap[raw.category || ''] || raw.category || 'Casual') as ClothingCategory;
        const mappedStatus = (statusMap[raw.status || ''] || raw.status || 'In Closet') as WardrobeItem['status'];

        return {
          id: doc.id,
          title: raw.title || 'Untitled Apparel',
          description: raw.description || '',
          status: mappedStatus,
          category: mappedCategory,
          userId: raw.userId,
          createdAt: raw.createdAt,
          strategy: raw.strategy,
          collectionSource: 'constructions' // Metadata to track original collection
        } as WardrobeItem & { collectionSource: 'constructions' | 'wardrobe' };
      });
      
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setConstructions(docs);

      // Save offline backup for legacy constructions stream
      try {
        localStorage.setItem(`cached_constructions_${user.uid}`, JSON.stringify(docs));
      } catch (e) {
        console.warn("Storage limit reached for local constructions cache:", e);
      }
    }, (error) => {
      console.warn("Firestore constructions connection degraded:", error.message || error);
      try {
        const stored = localStorage.getItem(`cached_constructions_${user.uid}`);
        if (stored) {
          const parsed = JSON.parse(stored) as any[];
          setConstructions(parsed);
        }
      } catch (fallbackErr) {
        console.error("Local constructions backup retrieval stalled:", fallbackErr);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Combined wardrobe streams safely for active displays
  const allItems = useMemo(() => {
    return [...wardrobe, ...constructions].sort((a, b) => {
      const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 + (a.createdAt.nanoseconds || 0) / 1000000 : 0;
      const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 + (b.createdAt.nanoseconds || 0) / 1000000 : 0;
      return timeB - timeA;
    });
  }, [wardrobe, constructions]);

  const handleAddGarment = async (
    title: string, 
    description: string, 
    category: ClothingCategory, 
    extraOptions?: {
      season?: WardrobeItem['season'];
      primaryColor?: string;
      secondaryColor?: string;
      imageUrl?: string;
    }
  ) => {
    if (!user) return;

    // Guest Mode local isolation
    if (user.isAnonymous || user.uid.startsWith('guest-')) {
      const localItem: WardrobeItem = {
        id: `gar-${Date.now()}`,
        title,
        description,
        category,
        userId: user.uid,
        status: 'In Closet',
        season: extraOptions?.season || 'All-Season',
        primaryColor: extraOptions?.primaryColor || 'Neutral Gray',
        secondaryColor: extraOptions?.secondaryColor || 'Minimalist White',
        wearCount: 0,
        lastUsed: '',
        imageUrl: extraOptions?.imageUrl || '',
        createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
      };

      const updated = [localItem, ...wardrobe];
      setWardrobe(updated);
      localStorage.setItem('local_wardrobe_items', JSON.stringify(updated));
      UnifiedFashionOS.syncWardrobeItems(updated);
      UnifiedFashionOS.trackEvent('wardrobe_added', { title, category });
      return;
    }

    try {
      await WardrobeService.addGarment(user.uid, title, description, category, {
        season: extraOptions?.season,
        primaryColor: extraOptions?.primaryColor,
        secondaryColor: extraOptions?.secondaryColor,
        imageUrl: extraOptions?.imageUrl,
        wearCount: 0,
        lastUsed: ''
      });
      UnifiedFashionOS.trackEvent('wardrobe_added', { title, category });
    } catch (error) {
      console.error("Failed to store garment:", error);
    }
  };

  const handleDeleteGarment = async (id: string) => {
    if (!user) return;
    if (user.isAnonymous || user.uid.startsWith('guest-')) {
      const updated = wardrobe.filter(item => item.id !== id);
      setWardrobe(updated);
      localStorage.setItem('local_wardrobe_items', JSON.stringify(updated));
      UnifiedFashionOS.syncWardrobeItems(updated);
      return;
    }
    try {
      await deleteDoc(doc(db, 'wardrobe', id));
    } catch (e) {
      try {
        await deleteDoc(doc(db, 'constructions', id));
      } catch (err) {
        console.error("Failed to delete garment:", err);
      }
    }
  };

  const handleAddSampleWardrobe = async () => {
    if (!user) return;
    setIsResetting(true);

    const sampleItems = [
      // 7 Tops
      { title: 'Supima Heavy-Knit Cotton Tee', description: 'Oversized luxury modular base, classic drop shoulder fit.', category: 'Casual' as ClothingCategory, season: 'Spring' as any, primaryColor: 'White', secondaryColor: 'Beige', wearCount: 0 },
      { title: 'Structured Linen Button-Up', description: 'French front fine linen shirt, breathable formal look.', category: 'Formal' as ClothingCategory, season: 'Summer' as any, primaryColor: 'Natural Linen', secondaryColor: 'White', wearCount: 1 },
      { title: 'Loopback Heavy Cotton Hoodie', description: '100% organic heavy loopback French terry cotton.', category: 'Casual' as ClothingCategory, season: 'Spring' as any, primaryColor: 'Sage Green', secondaryColor: 'Gray', wearCount: 2 },
      { title: 'Fine Merino Wool Polo', description: 'Breathable, lightweight, fine-knit polo shirt collar top.', category: 'Formal' as ClothingCategory, season: 'Autumn' as any, primaryColor: 'Navy Blue', secondaryColor: 'Brown', wearCount: 0 },
      { title: 'Utility Chambray Workshirt', description: 'Double-pocket vintage washed work shirt top.', category: 'Casual' as ClothingCategory, season: 'Autumn' as any, primaryColor: 'Vintage Indigo', secondaryColor: 'Black', wearCount: 0 },
      { title: 'Box-Fit Graphic Tee 260GSM', description: 'Retro enzyme washed heavy jersey shirt.', category: 'Casual' as ClothingCategory, season: 'Summer' as any, primaryColor: 'Washed Charcoal', secondaryColor: 'White', wearCount: 1 },
      { title: 'Minimalist Silk-Blend Blouse', description: 'Soft flowing silk elegant blouse top.', category: 'Formal' as ClothingCategory, season: 'Spring' as any, primaryColor: 'Ivory White', secondaryColor: 'Beige', wearCount: 0 },

      // 6 Bottoms
      { title: 'Sleek Dark Tailored Chinos', description: 'Pleated dark chinos tailored trousers.', category: 'Formal' as ClothingCategory, season: 'All-Season' as any, primaryColor: 'Midnight Black', secondaryColor: 'Navy', wearCount: 0 },
      { title: 'Raw Selvedge Indigo Jeans', description: 'Standard fit unwashed indigo denim pants.', category: 'Casual' as ClothingCategory, season: 'All-Season' as any, primaryColor: 'Indigo Blue', secondaryColor: 'White', wearCount: 0 },
      { title: 'Pleated Slate Wool Trousers', description: 'High-waist double pleated refined trousers pants.', category: 'Formal' as ClothingCategory, season: 'Winter' as any, primaryColor: 'Slate Gray', secondaryColor: 'Black', wearCount: 1 },
      { title: 'Relaxed Linen Drawstring Pants', description: 'Extremely breathable lightweight resort trousers pants.', category: 'Casual' as ClothingCategory, season: 'Summer' as any, primaryColor: 'Sand Beige', secondaryColor: 'White', wearCount: 0 },
      { title: 'Lightweight Technical Joggers', description: 'Water-resistant stretch athletic joggers pants.', category: 'Sportswear' as ClothingCategory, season: 'All-Season' as any, primaryColor: 'Midnight Obsidian', secondaryColor: 'Gray', wearCount: 0 },
      { title: 'Heavy Twill Cargo Pants', description: 'Rugged cargo utility pants with multi pockets.', category: 'Casual' as ClothingCategory, season: 'Autumn' as any, primaryColor: 'Olive Drab', secondaryColor: 'Black', wearCount: 0 },

      // 3 Outerwear
      { title: 'Tailored Camel Wool Overcoat', description: 'Double-breasted structured classic camel overcoat.', category: 'Outerwear' as ClothingCategory, season: 'Winter' as any, primaryColor: 'Camel Brown', secondaryColor: 'Black', wearCount: 0 },
      { title: 'Technical Shell Windrunner', description: 'Waterproof obsidian sports windrunner outerwear.', category: 'Outerwear' as ClothingCategory, season: 'Spring' as any, primaryColor: 'Obsidian Black', secondaryColor: 'Blue', wearCount: 1 },
      { title: 'Vintage Leather Bomber Jacket', description: 'Distressed black leather flight jacket outerwear.', category: 'Outerwear' as ClothingCategory, season: 'Autumn' as any, primaryColor: 'Distressed Black', secondaryColor: 'Charcoal', wearCount: 0 },

      // 5 Shoes
      { title: 'Classic White Leather Sneakers', description: 'Margom-sole minimalist athletic white shoe.', category: 'Casual' as ClothingCategory, season: 'All-Season' as any, primaryColor: 'Minimalist White', secondaryColor: 'Beige', wearCount: 0 },
      { title: 'Calfskin Chelsea Boots', description: 'Handcrafted premium black leather ankle boots shoe.', category: 'Formal' as ClothingCategory, season: 'Autumn' as any, primaryColor: 'Polished Black', secondaryColor: 'Gray', wearCount: 0 },
      { title: 'Split-Toe Suede Loafers', description: 'Breathable snuff suede penny loafers shoe.', category: 'Formal' as ClothingCategory, season: 'Summer' as any, primaryColor: 'Snuff Suede Brown', secondaryColor: 'White', wearCount: 0 },
      { title: 'Vibram Off-Road Trail Runners', description: 'Responsive all-terrain technical trail running shoe.', category: 'Sportswear' as ClothingCategory, season: 'All-Season' as any, primaryColor: 'Slate Grey', secondaryColor: 'Orange', wearCount: 0 },
      { title: 'Refined Leather Derby Shoes', description: 'Traditional custom polished dress derby shoes.', category: 'Formal' as ClothingCategory, season: 'All-Season' as any, primaryColor: 'Espresso Brown', secondaryColor: 'Black', wearCount: 0 },

      // 3 Accessories
      { title: 'Aesthetic Heavy Ribbed Beanie', description: 'Unisex sage green warm knit warm beanie hat.', category: 'Accessories' as ClothingCategory, season: 'Winter' as any, primaryColor: 'Sage Green', secondaryColor: 'Olive', wearCount: 0 },
      { title: 'Matte Acetate Circular Sunglasses', description: 'UV-protected acetate polarized sunglasses.', category: 'Accessories' as ClothingCategory, season: 'Summer' as any, primaryColor: 'Tortoiseshell', secondaryColor: 'Black', wearCount: 0 },
      { title: 'Minimalist Brass Buckle Belt', description: 'Vegetable-tanned full-grain leather belt accessories.', category: 'Accessories' as ClothingCategory, season: 'All-Season' as any, primaryColor: 'Chestnut Brown', secondaryColor: 'Gold', wearCount: 0 }
    ];

    try {
      if (user.isAnonymous || user.uid.startsWith('guest-')) {
        const localSamples: WardrobeItem[] = sampleItems.map((item, index) => ({
          id: `gar-sample-${index}-${Date.now()}`,
          title: item.title,
          description: item.description,
          category: item.category,
          userId: user.uid,
          status: 'In Closet',
          season: item.season,
          primaryColor: item.primaryColor,
          secondaryColor: item.secondaryColor,
          wearCount: item.wearCount,
          lastUsed: new Date().toISOString().split('T')[0],
          createdAt: { seconds: Math.floor(Date.now() / 1000) - (index * 60), nanoseconds: 0 }
        }));
        const updated = [...localSamples, ...wardrobe];
        setWardrobe(updated);
        localStorage.setItem('local_wardrobe_items', JSON.stringify(updated));
        UnifiedFashionOS.syncWardrobeItems(updated);
      } else {
        for (const item of sampleItems) {
          await WardrobeService.addGarment(user.uid, item.title, item.description, item.category, {
            season: item.season,
            primaryColor: item.primaryColor,
            secondaryColor: item.secondaryColor,
            wearCount: item.wearCount,
            lastUsed: new Date().toISOString().split('T')[0]
          });
        }
      }
    } catch (err) {
      console.error("Failed to inject samples:", err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleReset = async () => {
    if (!user) return;
    setIsResetting(true);
    try {
      if (user.isAnonymous || user.uid.startsWith('guest-')) {
        setWardrobe([]);
        localStorage.removeItem('local_wardrobe_items');
        UnifiedFashionOS.syncWardrobeItems([]);
      } else {
        // 1. Clear wardrobe entries
        const qWardrobe = query(collection(db, 'wardrobe'), where('userId', '==', user.uid));
        const snapsWardrobe = await getDocs(qWardrobe);
        const pr1 = snapsWardrobe.docs.map(d => deleteDoc(doc(db, 'wardrobe', d.id)));

        // 2. Clear legacy construction entries
        const qConst = query(collection(db, 'constructions'), where('userId', '==', user.uid));
        const snapsConst = await getDocs(qConst);
        const pr2 = snapsConst.docs.map(d => deleteDoc(doc(db, 'constructions', d.id)));

        await Promise.all([...pr1, ...pr2]);
      }
    } catch (error) {
      console.error("Failed to reset wardrobe workspace:", error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleGuestActivation = () => {
    localStorage.setItem('auth_guest_active', 'true');
    const guestUser = {
      uid: 'guest-sartorialist-user-100',
      displayName: 'Guest Sartorialist',
      email: 'guest@companion.com',
      isAnonymous: true
    } as User;
    setUser(guestUser);
    UnifiedFashionOS.trackEvent('login', { type: 'guest' });
    UnifiedFashionOS.trackEvent('signup', { source: 'guest' });
  };

  const handleLogout = async () => {
    localStorage.removeItem('auth_guest_active');
    localStorage.removeItem('firebase_user_session');
    setWardrobe([]);
    setUser(null);
    await logout();
    UnifiedFashionOS.restartJourney();
  };

  // 1. Loading screen / Opening moment (staged room entrance)
  if (loading) {
    const theme = getTemporalTheme();
    const openingPhrases = [
      "Take your time.",
      "Not everything needs choosing.",
      "Style is easier when nothing competes."
    ];
    // Consistently select based on the current hour/minute to rotate beautifully
    const phrase = openingPhrases[(new Date().getHours() + new Date().getMinutes()) % openingPhrases.length];

    return (
      <div id="opening-moment" className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col justify-center items-center py-10 px-4 select-none`}>
        <div className="text-center space-y-10 max-w-md mx-auto">
          
          {/* Greeting: Step 1 */}
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: loaderStage >= 1 ? 0.45 : 0 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] font-mono uppercase tracking-[0.25em] block font-light"
          >
            AI Fashion
          </motion.span>

          {/* Settle: Step 2 */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: loaderStage >= 2 ? 1 : 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="font-serif font-light text-5xl tracking-[-0.03em] text-white"
          >
            Marketplace
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: loaderStage >= 2 ? 0.2 : 0 }}
            className="h-px w-8 bg-white mx-auto"
          />

          {/* Short poetic line: Step 3 */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: loaderStage >= 3 ? 0.4 : 0 }}
            transition={{ duration: 0.9 }}
            className="text-sm font-serif italic tracking-wide leading-relaxed"
          >
            "{phrase}"
          </motion.p>

        </div>
      </div>
    );
  }

  // 8. LAST SCREEN: Meditative Silence View
  if (isSilent) {
    const theme = getTemporalTheme();
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col justify-center items-center py-10 px-4 select-none animate-fade-in`}>
        <div className="text-center space-y-4">
          <p className="text-white/40 text-2xl font-light">—</p>
          <p className="font-serif italic text-lg text-white/55 tracking-wide">
            Until next time.
          </p>
        </div>
      </div>
    );
  }

  // 2. Wrap everything in ErrorBoundary for guaranteed runtime resilience
  const theme = getTemporalTheme();

  // If we are logged in, we check the COVER view first
  if (user && showCover) {
    return (
      <div 
        id="magazine-cover" 
        onClick={() => setShowCover(false)}
        className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col justify-center items-center py-24 px-6 cursor-pointer select-none animate-fade-in`}
      >
        <div className="text-center space-y-4 max-w-lg mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 block font-light">
            wardrobe companion / vol. xi
          </span>
          <h1 className="font-serif font-light text-7xl md:text-8xl tracking-[-0.04em] leading-none mb-1 text-white">
            Quiet hours
          </h1>
          <p className="text-sm font-serif italic opacity-45 tracking-wide leading-relaxed pt-2">
            "Collected slowly."
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      
      {/* Offline mode banner alert */}
      {!isOnline && (
        <div className="bg-[#111111] border-b border-dashed border-[rgba(255,255,255,0.2)] text-white text-[10px] font-mono tracking-wider text-center py-2.5 px-4 z-50 flex items-center justify-center gap-2 uppercase font-light">
          <WifiOff size={11} className="shrink-0" />
          <span>Running in Offline Mode</span>
          <span className="opacity-75 font-light text-[9.5px] lowercase hidden sm:inline">— utilizing local memory fallback</span>
        </div>
      )}

      {/* Auth Screening */}
      {!user ? (
        <AuthModule onGuestMode={handleGuestActivation} />
      ) : (
        /* Main Workspace - 100% Black & White Consumer Product */
        <div className={`min-h-screen ${theme.bg} ${theme.text} selection:bg-white/20 selection:text-white antialiased font-sans`}>
          
          {/* Primary Display viewport - physically spaced breathing transitions */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 lg:pt-28 lg:pb-36 animate-fade-in">
            <React.Suspense fallback={
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Initializing Fashion OS...</p>
              </div>
            }>
              <AIStyleHub 
                wardrobe={allItems}
                onAddGarment={async (title, desc, category, extra) => {
                  await handleAddGarment(title, desc, category, extra);
                }}
                onDeleteGarment={handleDeleteGarment}
                user={user}
                onLogout={handleLogout}
                onReset={handleReset}
                onLoadSamples={handleAddSampleWardrobe}
                isResetting={isResetting}
                onEnterSilence={() => setIsSilent(true)}
              />
            </React.Suspense>
          </main>

          {/* Physical Footer Section */}
          <footer className="py-24 text-center select-none mt-12 pb-32">
            <p className="text-white/20 text-lg font-light">—</p>
            <p className="font-serif italic text-xs text-white/30 tracking-wide mt-2">
              {[
                "Still here.",
                "Nothing missing.",
                "Collected quietly.",
                "Enough for now."
              ][footerIndex]}
            </p>
          </footer>
        </div>
      )}
    </ErrorBoundary>
  );
}
