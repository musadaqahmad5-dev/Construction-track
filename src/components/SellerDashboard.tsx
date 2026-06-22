import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit2, 
  MapPin, 
  Tag, 
  Store, 
  Package, 
  Check, 
  AlertCircle, 
  ArrowLeft,
  X,
  Sparkle,
  Globe,
  Phone,
  Instagram
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Seller, Product } from '../types';

interface SellerDashboardProps {
  user: any;
  onClose: () => void;
  onProductAddedOrChanged?: () => void;
}

const SELLER_CATEGORIES = [
  'Minimalist Luxury',
  'Avant-Garde Streetwear',
  'Bespoke Tailoring',
  'Artisan Leather Goods',
  'Sustainable Knitwear',
  'Modern Utility Accessories'
];

const PRESET_MERC_IMAGES = [
  { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=450&auto=format&fit=crop", label: "Italian Linen Set" },
  { url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=450&auto=format&fit=crop", label: "Structured Overcoat" },
  { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=450&auto=format&fit=crop", label: "Aesthetic Knit" },
  { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=450&auto=format&fit=crop", label: "Handcrafted Chelsea Boots" },
  { url: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=450&auto=format&fit=crop", label: "Tailored Blazer" },
  { url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=450&auto=format&fit=crop", label: "Silk Accents" }
];

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, onClose, onProductAddedOrChanged }) => {
  const isOnline = useOnlineStatus();
  const [sellerProfile, setSellerProfile] = useState<Seller | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userRole, setUserRole] = useState<'user' | 'seller' | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [myProducts, setMyProducts] = useState<Product[]>([]);

  // Onboarding Form States
  const [shopName, setShopName] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [shopCategory, setShopCategory] = useState(SELLER_CATEGORIES[0]);
  const [isOnboardingFormActive, setIsOnboardingFormActive] = useState(false);
  const [isSubmittingOnboard, setIsSubmittingOnboard] = useState(false);

  const [storeType, setStoreType] = useState<'LOCAL_BOUTIQUE' | 'ONLINE_STORE' | 'HYBRID_BRAND'>('LOCAL_BOUTIQUE');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [shippingMode, setShippingMode] = useState<'pickup' | 'nationwide' | 'international'>('pickup');
  const [verified, setVerified] = useState(true);
  const [deliveryEstimate, setDeliveryEstimate] = useState('2-4 business days');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Product Creator/Editor Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState<'Casual' | 'Formal' | 'Sportswear' | 'Outerwear' | 'Accessories'>('Casual');
  const [prodAvailability, setProdAvailability] = useState<'In Stock' | 'Limited' | 'Out of Stock'>('In Stock');
  const [prodImageUrl, setProdImageUrl] = useState(PRESET_MERC_IMAGES[0].url);
  const [customImageToggle, setCustomImageToggle] = useState(false);
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [onboardError, setOnboardError] = useState<string | null>(null);

  // Merchant Native Sign-In flow
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleMerchantSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
      // Success will trigger the onAuthStateChanged in App.tsx and cascade user state down.
    } catch (err: any) {
      console.error("Merchant Google Sign-In Failed:", err);
      let friendlyMessage = "Failed to authenticate with your Google Identity.";
      if (err.code === 'auth/popup-closed-by-user') {
        friendlyMessage = "Google sign-in window was closed. Please try again.";
      } else if (err.code === 'auth/cancelled-popup-request') {
        friendlyMessage = "Only one identity request can be handled at a time. Please wait or refresh.";
      } else if (err.code === 'auth/popup-blocked') {
        friendlyMessage = "Enable popups for login";
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setAuthError(friendlyMessage);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Authenticated State Guard
  const isGuest = !user || user.isAnonymous || user.uid.startsWith('guest-');

  // 1. Fetch/Listen User Role State
  useEffect(() => {
    if (isGuest) {
      setUserRole('user');
      setLoadingRole(false);
      return;
    }

    const unsubUser = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserRole(docSnap.data().role || 'user');
      } else {
        setUserRole('user');
      }
      setLoadingRole(false);
    }, (error) => {
      console.warn("User role fetch error:", error);
      setUserRole('user');
      setLoadingRole(false);
    });

    return () => unsubUser();
  }, [user, isGuest]);

  // 2. Fetch/Listen Seller Profile
  useEffect(() => {
    if (isGuest) {
      setLoadingProfile(false);
      return;
    }

    const unsubSeller = onSnapshot(doc(db, 'sellers', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setSellerProfile({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Seller, 'id'>)
        });
      } else {
        setSellerProfile(null);
      }
      setLoadingProfile(false);
    });

    return () => unsubSeller();
  }, [user, isGuest]);

  // Populate form states when profile loads or is edited
  useEffect(() => {
    if (sellerProfile) {
      setShopName(sellerProfile.name || '');
      setShopLocation(sellerProfile.location || '');
      setShopCategory(sellerProfile.category || SELLER_CATEGORIES[0]);
      setStoreType(sellerProfile.storeType || 'LOCAL_BOUTIQUE');
      setInstagramUrl(sellerProfile.instagramUrl || '');
      setWhatsAppNumber(sellerProfile.whatsAppNumber || '');
      setWebsiteLink(sellerProfile.websiteLink || '');
      setShippingMode(sellerProfile.shippingMode || 'pickup');
      setVerified(sellerProfile.verified !== undefined ? sellerProfile.verified : true);
      setDeliveryEstimate(sellerProfile.deliveryEstimate || '2-4 business days');
    }
  }, [sellerProfile, isEditingProfile]);

  // 2. Fetch/Listen Seller Products
  useEffect(() => {
    if (isGuest || !sellerProfile) {
      setMyProducts([]);
      return;
    }

    const q = query(
      collection(db, 'products'),
      where('ownerId', '==', user.uid)
    );

    const unsubProducts = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>)
      })) as Product[];
      
      prods.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds || 0);
      setMyProducts(prods);
    });

    return () => unsubProducts();
  }, [user, sellerProfile, isGuest]);

  // Onboard Shop Handler
  const handleOnboardShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardError(null);

    if (!isOnline) {
      setOnboardError("Platform is offline. Please restore network connection to edit your brand contract.");
      return;
    }

    if (!shopName.trim()) return;
    if (storeType !== 'ONLINE_STORE' && !shopLocation.trim()) return;

    setIsSubmittingOnboard(true);
    try {
      const sellerData: Omit<Seller, 'id'> = {
        name: shopName.trim(),
        location: storeType === 'ONLINE_STORE' ? '' : shopLocation.trim(),
        category: shopCategory,
        ownerId: user.uid,
        createdAt: sellerProfile?.createdAt || serverTimestamp(),
        avatarUrl: sellerProfile?.avatarUrl || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}-53994a69daeb?q=80&w=100&auto=format&fit=crop`,
        storeType,
        instagramUrl: storeType !== 'LOCAL_BOUTIQUE' ? instagramUrl.trim() : '',
        whatsAppNumber: storeType !== 'LOCAL_BOUTIQUE' ? whatsAppNumber.trim() : '',
        websiteLink: storeType !== 'LOCAL_BOUTIQUE' ? websiteLink.trim() : '',
        shippingMode,
        verified,
        deliveryEstimate: deliveryEstimate.trim() || '2-4 business days'
      };

      await setDoc(doc(db, 'sellers', user.uid), sellerData);

      // Also set/update user role to 'seller' synchronously in users collection
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName || 'Sartorialist',
        email: user.email || '',
        role: 'seller',
        updatedAt: serverTimestamp()
      }, { merge: true });

      setIsEditingProfile(false);
    } catch (err) {
      console.error("Seller Onboarding/Update Failed:", err);
    } finally {
      setIsSubmittingOnboard(false);
    }
  };

  // Open creation panel
  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setProdTitle('');
    setProdDesc('');
    setProdPrice('');
    setProdCategory('Casual');
    setProdAvailability('In Stock');
    setProdImageUrl(PRESET_MERC_IMAGES[0].url);
    setCustomImageToggle(false);
    setCustomImageUrlInput('');
    setFormError(null);
    setIsFormOpen(true);
  };

  // Open edit panel
  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setProdTitle(prod.title);
    setProdDesc(prod.description);
    setProdPrice(prod.price.toString());
    setProdCategory(prod.category);
    setProdAvailability(prod.availability);
    setProdImageUrl(prod.imageUrl);
    setCustomImageToggle(false);
    setCustomImageUrlInput('');
    setFormError(null);
    setIsFormOpen(true);
  };

  // Form Submit Handler (Adding or Editing)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isOnline) {
      setFormError("Platform is offline. Please restore your network link to list new products.");
      return;
    }

    if (!prodTitle.trim() || !prodPrice || !sellerProfile) {
      setFormError("Product title and price elements are required parameters.");
      return;
    }

    const numericPrice = parseFloat(prodPrice);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setFormError("Please register a valid numeric positive price.");
      return;
    }

    setIsSavingProduct(true);
    try {
      const finalImg = customImageToggle && customImageUrlInput.trim() 
        ? customImageUrlInput.trim() 
        : prodImageUrl;

      const productPayload = {
        shopId: user.uid,
        shopName: sellerProfile.name,
        title: prodTitle.trim(),
        description: prodDesc.trim() || `Hand-curated piece from ${sellerProfile.name}.`,
        price: numericPrice,
        category: prodCategory,
        availability: prodAvailability,
        imageUrl: finalImg,
        vibeTags: [prodCategory.toLowerCase(), sellerProfile.category.toLowerCase().split(' ')[0], 'curated'],
        ownerId: user.uid,
        createdAt: editingProduct ? editingProduct.createdAt : serverTimestamp()
      };

      if (editingProduct) {
        // Edit flow
        await setDoc(doc(db, 'products', editingProduct.id), productPayload);
      } else {
        // Create flow
        await addDoc(collection(db, 'products'), productPayload);
      }

      if (onProductAddedOrChanged) {
        onProductAddedOrChanged();
      }

      setIsFormOpen(false);
    } catch (err: any) {
      console.error("Saving product failed:", err);
      setFormError(err.message || "An exception occurred while uploading listing to cloud.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (prodId: string) => {
    if (!isOnline) {
      alert("Retiring listings is disabled while operating in offline mode.");
      return;
    }

    if (!window.confirm("Are you sure you want to retire this product listing from the active fashion feed?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', prodId));
    } catch (err) {
      console.error("Retiring listing failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex justify-center overflow-y-auto p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-full max-w-3xl bg-[#070707] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between my-auto relative shadow-2xl space-y-8"
      >
        {/* Absolute Header close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white hover:bg-white/5 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Guest Lock Screening (Requires Signup/Login) */}
        {isGuest ? (
          <div className="py-12 text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/40">
              <Store className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-light text-white">Seller Hub Access</h2>
              <p className="text-xs text-white/50 leading-relaxed font-serif italic">
                "Establish your shop registry, list craftsmanship designs, publish directly to user lifestyle feeds, and manage catalog editions."
              </p>
            </div>
            <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center">
              <p className="text-xs text-amber-400 font-mono font-medium">
                [ SIGN IN REQUIRED ]
              </p>
              <p className="text-[10px] text-white/55 font-mono uppercase tracking-wider mt-1.5 leading-normal">
                Please register or sign in with a verified account in order to register an active boutique shop profile.
              </p>
            </div>

            {/* Error notifications */}
            {authError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-stone-300 rounded-xl text-center">
                <p className="text-[10px] font-mono leading-normal">
                   Error: <span className="text-red-400">{authError}</span>
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={handleMerchantSignIn}
                disabled={isAuthenticating}
                className="w-full px-6 py-3 bg-white text-black text-[10px] uppercase font-mono tracking-widest font-semibold rounded-lg hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? 'Connecting Identity...' : 'Sign in with Merchant account'}
              </button>
              
              <button
                onClick={onClose}
                className="w-full px-6 py-2 border border-white/15 hover:border-white/30 text-white/60 hover:text-white text-[10px] uppercase font-mono tracking-widest font-semibold rounded-lg transition-all cursor-pointer"
              >
                Back to Browsing Feed
              </button>
            </div>
          </div>
        ) : (loadingProfile || loadingRole) ? (
          /* Profile Loading spinner */
          <div className="py-24 text-center space-y-2">
            <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Querying Merchant Ledgers...</p>
          </div>
        ) : (!sellerProfile || userRole !== 'seller' || isEditingProfile) ? (
          /* UNBOARDED SELLER CHANNELS OR EDIT PROFILE FORM */
          <div className="space-y-6">
            <div className="space-y-2 flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono tracking-[0.25em] text-white/30 uppercase block">
                  {isEditingProfile ? 'Modify Shop Registry' : 'Seller Hub Onboarding'}
                </span>
                <h2 className="font-serif text-3xl font-light text-white">
                  {isEditingProfile ? 'Configure Shop Settings' : 'Onboard as Fashion Seller'}
                </h2>
                <p className="text-xs text-white/40 leading-relaxed font-serif italic max-w-xl">
                  {isEditingProfile
                    ? '"Adjust your store types, online brand coordinates, shipping modes, and delivery estimates for the global/local buyer base."'
                    : '"Upload your fashion items and appear in the AI feeds instantly. Support physical stores, Instagram brands, and online-only labels."'}
                </p>
              </div>
              {isEditingProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="text-white/40 hover:text-white font-mono text-[10px] uppercase font-bold cursor-pointer bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5"
                >
                  [ Cancel ]
                </button>
              )}
            </div>

            <form onSubmit={handleOnboardShop} className="space-y-5 pt-4">
              {onboardError && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-rose-300 text-[10px] font-mono flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{onboardError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#a3a3a3] block pb-1.5">Shop / Store Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Noir Boutique"
                    value={shopName}
                    onChange={e => setShopName(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-xl transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#a3a3a3] block pb-1.5">Store Type *</label>
                  <select
                    value={storeType}
                    onChange={e => setStoreType(e.target.value as any)}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs font-mono text-white rounded-xl focus:outline-none focus:border-white/30"
                  >
                    <option value="LOCAL_BOUTIQUE">Local Boutique (with physical showroom)</option>
                    <option value="ONLINE_STORE">Online-Only Store (Instagram, TikTok, Web)</option>
                    <option value="HYBRID_BRAND">Hybrid Brand (both physical + online presence)</option>
                  </select>
                </div>
              </div>

              {storeType !== 'ONLINE_STORE' && (
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#a3a3a3] block pb-1.5">Physical Shop Location/City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Milan, Italy"
                    value={shopLocation}
                    onChange={e => setShopLocation(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-xl transition-colors"
                  />
                </div>
              )}

              {storeType !== 'LOCAL_BOUTIQUE' && (
                <div className="border border-white/5 bg-white/[0.01] p-4 rounded-2xl space-y-4">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-bold border-b border-white/5 pb-1">
                    [ Online Brand Coordinates ]
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-widest text-[#a3a3a3] block pb-1.5">Instagram Link / User *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. @noir_boutique"
                        value={instagramUrl}
                        onChange={e => setInstagramUrl(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-xl transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-widest text-[#a3a3a3] block pb-1.5">WhatsApp Link (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. +39 333 123456"
                        value={whatsAppNumber}
                        onChange={e => setWhatsAppNumber(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-xl transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-widest text-[#a3a3a3] block pb-1.5">Website URL (optional)</label>
                      <input
                        type="url"
                        placeholder="e.g. https://brand.com"
                        value={websiteLink}
                        onChange={e => setWebsiteLink(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-xl transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#a3a3a3] block pb-1.5">Shipping Mode Offered</label>
                  <select
                    value={shippingMode}
                    onChange={e => setShippingMode(e.target.value as any)}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs font-mono text-white rounded-xl focus:outline-none focus:border-white/30"
                  >
                    <option value="pickup">Local Boutique Pickup Only</option>
                    <option value="nationwide">Ships Nationwide (Standard/Express)</option>
                    <option value="international">Ships Globally / International</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#a3a3a3] block pb-1.5">Delivery Time Estimate *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2-4 business days"
                    value={deliveryEstimate}
                    onChange={e => setDeliveryEstimate(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-xl transition-colors"
                  />
                </div>

                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={verified}
                      onChange={e => setVerified(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-[#111] text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300">Verified Seller Status</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono uppercase tracking-widest text-[#a3a3a3] block pb-1.5">Aesthetic Focus category specialty</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SELLER_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setShopCategory(cat)}
                      className={`px-3 py-2.5 rounded-xl border font-mono text-[10px] text-left transition-all ${
                        shopCategory === cat 
                          ? 'border-white text-white bg-white/[0.03]' 
                          : 'border-white/5 text-white/40 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmittingOnboard}
                  className="flex-1 bg-white hover:bg-neutral-200 text-black py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  {isSubmittingOnboard 
                    ? 'Updating Registry...'
                    : isEditingProfile 
                      ? 'Save Shop Settings' 
                      : 'Register Shop & Open Dashboard'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ACTIVE SELLER DASHBOARD VIEW */
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-6 gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8.5px] font-mono text-[#a3a3a3] uppercase tracking-[0.2em]">Authorized Merchant Terminal</span>
                  {sellerProfile.verified && (
                    <span className="text-[8.5px] font-mono bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">Verified Seller</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif text-3xl font-light text-white leading-none">{sellerProfile.name}</h2>
                  <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                    sellerProfile.storeType === 'ONLINE_STORE' 
                      ? 'bg-amber-400/5 text-amber-300 border-amber-400/20'
                      : sellerProfile.storeType === 'HYBRID_BRAND'
                        ? 'bg-purple-400/5 text-purple-300 border-purple-400/20'
                        : 'bg-emerald-400/5 text-emerald-300 border-emerald-400/20'
                  }`}>
                    {sellerProfile.storeType === 'ONLINE_STORE' ? 'Online Brand' : sellerProfile.storeType === 'HYBRID_BRAND' ? 'Hybrid Brand' : 'Local Boutique'}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-[9.5px] font-mono text-white/45">
                  {sellerProfile.storeType !== 'ONLINE_STORE' && sellerProfile.location ? (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-white/30" />
                      <span>{sellerProfile.location}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-white/30" />
                      <span>ships nationwide</span>
                    </div>
                  )}
                  <span className="text-white/10">|</span>
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-white/30" />
                    <span>{sellerProfile.category}</span>
                  </div>
                  {sellerProfile.shippingMode && (
                    <>
                      <span className="text-white/10">|</span>
                      <span>Delivery: {sellerProfile.shippingMode === 'pickup' ? 'Store Pickup Only' : sellerProfile.shippingMode === 'international' ? 'Worldwide' : 'Nationwide'} ({sellerProfile.deliveryEstimate || '2-4 days'})</span>
                    </>
                  )}
                  
                  {/* Social Handles */}
                  {sellerProfile.instagramUrl && (
                    <>
                      <span className="text-white/10">|</span>
                      <a href={`https://instagram.com/${sellerProfile.instagramUrl.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                        <Instagram className="w-3 h-3 text-white/40" />
                        <span>{sellerProfile.instagramUrl}</span>
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white hover:bg-white/[0.08] rounded-xl text-[10px] font-mono uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 opacity-60" /> Profile
                </button>
                <button
                  onClick={handleOpenCreateForm}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-white text-black hover:bg-neutral-200 rounded-xl text-[10px] font-mono uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Craft product
                </button>
              </div>
            </div>

            {/* Editing/Creation Inline Panel Overlord */}
            {isFormOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 md:p-6 space-y-4 font-mono text-xs text-white"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#a3a3a3]">
                    {editingProduct ? `Modify Listing — ID: ${editingProduct.id.slice(0,6)}` : 'Register New Craft Entry'}
                  </span>
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="text-white/40 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                {formError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-2 text-[11px]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider text-[#ababab]">Title *</label>
                      <input 
                        type="text" 
                        required
                        value={prodTitle} 
                        onChange={e => setProdTitle(e.target.value)}
                        placeholder="e.g. Asymmetric Wool Cardigan"
                        className="w-full bg-[#111] border border-white/5 px-2.5 py-1.5 text-xs text-white rounded-lg focus:outline-none focus:border-white/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wider text-[#ababab]">Price (USD) *</label>
                        <input 
                          type="number" 
                          required
                          value={prodPrice} 
                          onChange={e => setProdPrice(e.target.value)}
                          placeholder="e.g. 140"
                          className="w-full bg-[#111] border border-white/5 px-2.5 py-1.5 text-xs text-white rounded-lg focus:outline-none focus:border-white/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wider text-[#ababab]">Vibe Category</label>
                        <select
                          value={prodCategory}
                          onChange={e => setProdCategory(e.target.value as any)}
                          className="w-full bg-[#111] border border-white/5 px-1 py-1.5 text-xs text-white rounded-lg focus:outline-none"
                        >
                          <option value="Casual">Casual</option>
                          <option value="Formal">Formal</option>
                          <option value="Outerwear">Outerwear</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Sportswear">Sportswear</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider text-[#ababab]">Description Craftsmanship Brief</label>
                      <textarea 
                        value={prodDesc} 
                        onChange={e => setProdDesc(e.target.value)}
                        placeholder="Details of materials, drape, and stitch patterns..."
                        rows={3}
                        className="w-full bg-[#111] border border-white/5 px-2.5 py-1.5 text-xs text-white rounded-lg focus:outline-none focus:border-white/20 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider text-[#ababab]">Availability Status</label>
                      <select
                        value={prodAvailability}
                        onChange={e => setProdAvailability(e.target.value as any)}
                        className="w-full bg-[#111] border border-white/5 px-1 py-1.5 text-xs text-white rounded-lg focus:outline-none mb-3"
                      >
                        <option value="In Stock">In Stock (Standard delivery)</option>
                        <option value="Limited">Limited Edition (Numbered release)</option>
                        <option value="Out of Stock">Out of Stock (Awaiting weave)</option>
                      </select>
                    </div>
                  </div>

                  {/* Artwork Selector */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[8px] uppercase tracking-wider text-[#ababab]">Image Artwork Asset</label>
                      <button
                        type="button"
                        onClick={() => setCustomImageToggle(!customImageToggle)}
                        className="text-[8.5px] uppercase tracking-widest text-[#9c9c9c] hover:text-white"
                      >
                        [ {customImageToggle ? 'Select Presets instead' : 'Enter Custom Image URL'} ]
                      </button>
                    </div>

                    {customImageToggle ? (
                      <input 
                        type="url" 
                        value={customImageUrlInput}
                        onChange={e => setCustomImageUrlInput(e.target.value)}
                        placeholder="Specify https:// image path..."
                        className="w-full bg-[#111] border border-white/5 px-2.5 py-1.5 text-xs text-white rounded-lg focus:outline-none focus:border-white/20"
                      />
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {PRESET_MERC_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setProdImageUrl(img.url)}
                            className={`relative aspect-[3/4] bg-neutral-900 border rounded-lg overflow-hidden transition-all ${
                              prodImageUrl === img.url ? 'border-white ring-1 ring-white/10' : 'border-white/5 opacity-55'
                            }`}
                          >
                            <img src={img.url} alt={img.label} className="w-full h-full object-cover grayscale" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="w-full bg-white text-black hover:bg-neutral-200 py-2.5 rounded-xl text-[10px] uppercase font-mono font-semibold tracking-widest transition-colors cursor-pointer"
                  >
                    {isSavingProduct ? 'Updating Feed Matrix...' : 'Publish Product Direct to Feed'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Active Inventory Registry */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-white font-light flex items-center gap-2">
                <Package className="w-4 h-4 text-white/50" /> Live Shop Collection ({myProducts.length})
              </h3>

              {myProducts.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.005] space-y-2">
                  <p className="font-serif italic text-xs text-white/35">"Your merchant rack is currently empty."</p>
                  <button
                    onClick={handleOpenCreateForm}
                    className="text-[9.5px] font-mono text-white/50 hover:text-white uppercase tracking-widest"
                  >
                    [ Post your first boutique garment + ]
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myProducts.map(prod => (
                    <div 
                      key={prod.id}
                      className="border border-white/5 bg-white/[0.015] rounded-2xl p-4 flex gap-4 transition-colors hover:bg-white/[0.03]"
                    >
                      <div className="w-16 h-20 bg-neutral-900 border border-white/10 overflow-hidden shrink-0 rounded-lg">
                        <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover grayscale" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-serif text-sm text-white truncate">{prod.title}</h4>
                            <span className="font-mono text-[9px] text-[#dfd7c2]">${prod.price}</span>
                          </div>
                          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-0.5">{prod.category} — {prod.availability}</p>
                          <p className="text-[10.5px] font-serif text-white/45 italic leading-snug line-clamp-2 mt-1">
                            "{prod.description}"
                          </p>
                        </div>

                        <div className="flex justify-end gap-2.5 pt-2 border-t border-white/5 mt-2">
                          <button
                            onClick={() => handleOpenEditForm(prod)}
                            className="text-[9px] font-mono uppercase text-white/40 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="text-[9px] font-mono uppercase text-rose-500/60 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-2.5 h-2.5" /> Retire
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
