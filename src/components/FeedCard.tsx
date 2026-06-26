import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Bookmark, 
  MapPin, 
  ShoppingBag, 
  Sparkles, 
  Sparkle,
  Plus, 
  Check, 
  Dribbble, 
  BookOpen, 
  CreditCard,
  Shirt,
  Info,
  ArrowLeft,
  Upload,
  AlertCircle,
  Phone,
  Globe,
  Instagram,
  Sliders,
  Eye,
  Layers,
  Cpu,
  Share2
} from 'lucide-react';
import { FeedItem } from '../features/feed/feedTypes';
import { ImageWithFade } from './AIStyleHub';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useStyleProfile } from '../hooks/useStyleProfile';
import { auth, db, signInWithGoogle, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UnifiedFashionOS } from '../features/ai-core/UnifiedFashionOS';
import { BillingService } from '../features/monetization/billingService';

interface FeedCardProps {
  item: FeedItem;
  onLike: (itemId: string) => void;
  onBookmark: (itemId: string) => void;
  onSaveToCloset: (title: string, description: string, category: string, imageUrl: string, price?: number) => void;
  onWearOutfit?: (outfitId: string, clothesNames: string[]) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({ 
  item, 
  onLike, 
  onBookmark, 
  onSaveToCloset,
  onWearOutfit 
}) => {
  const [isPlayingTryon, setIsPlayingTryon] = useState(false);
  const [tryonStep, setTryonStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  
  // Safe Image Failure Fallback Helper
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop";
  };

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}?style=${encodeURIComponent(item.id)}`;
    try {
      navigator.clipboard.writeText(shareUrl);
      setShareFeedback(true);
      styleProfile.trackInteraction('like', item); // Sharing contributes positive style reinforcement
      setTimeout(() => {
        setShareFeedback(false);
      }, 3000);
    } catch (err) {
      console.warn("Clipboard copy failed: ", err);
    }
  };

  const isOnline = useOnlineStatus();
  const styleProfile = useStyleProfile();
  const [shareFeedback, setShareFeedback] = useState(false);

  // Controlled 3-step Try On system states
  const [selectedOutfitUrl, setSelectedOutfitUrl] = useState<string | null>(null);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null);
  const [selectedAvatarName, setSelectedAvatarName] = useState<string | null>(null);
  const [tryOnProcessingPhase, setTryOnProcessingPhase] = useState<number>(1);
  const [isProcessingFit, setIsProcessingFit] = useState(false);
  const [simulateAIError, setSimulateAIError] = useState(false);
  const [tryonError, setTryonError] = useState<string | null>(null);

  // Calibration sliders for Interactive Body-Aware Simulation Layer
  const [sliderShoulderWidth, setSliderShoulderWidth] = useState(48); // cm
  const [sliderTorsoWidth, setSliderTorsoWidth] = useState(100); // %
  const [sliderAngle, setSliderAngle] = useState(0); // degrees
  const [sliderInseam, setSliderInseam] = useState(80); // cm
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [holographicMode, setHolographicMode] = useState(false);
  const [showBaseLayer, setShowBaseLayer] = useState(true);
  const [showMidLayer, setShowMidLayer] = useState(true);
  const [showBottomLayer, setShowBottomLayer] = useState(true);

  // Helper to resolve custom garment colors to active CSS Hex codes
  const getGarmentColor = (colorName?: string, fallback: string = '#CBD5E1') => {
    if (!colorName) return fallback;
    const name = colorName.toLowerCase();
    if (name.startsWith('#')) return colorName;
    if (name.includes('black') || name.includes('carbon')) return '#171717';
    if (name.includes('charcoal')) return '#2F3E46';
    if (name.includes('sand') || name.includes('beige') || name.includes('camel') || name.includes('trench')) return '#D2B48C';
    if (name.includes('white') || name.includes('cream')) return '#F8F9FA';
    if (name.includes('gray') || name.includes('grey') || name.includes('slate')) return '#6A7E89';
    if (name.includes('navy') || name.includes('denim') || name.includes('blue')) return '#2B4C7E';
    if (name.includes('sage') || name.includes('green') || name.includes('olive')) return '#4F5D50';
    if (name.includes('burgundy') || name.includes('wine')) return '#5C1D24';
    return fallback;
  };

  // Preset model options
  const PRESET_MODELS = [
    { id: 'm1', name: 'Marcus (Tailored Classic)', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&auto=format&fit=crop' },
    { id: 'm2', name: 'Zoe (Minimalist Base)', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop' },
    { id: 'm3', name: 'Noor (Editorial Fit)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
  ];

  // Robust checkout step state machine
  type CheckoutStep = 'cart' | 'address' | 'payment' | 'processing' | 'success' | 'login';
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Custom shipping/billing fields
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  
  // Demo credit card parameters (Prepopulated for sleekness)
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('825');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Monitor Auth User reactively inside FeedCard
  const [currentUser, setCurrentUser] = useState<any>(auth.currentUser);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setCurrentUser(u);
      if (u && !u.isAnonymous && !u.uid.startsWith('guest-')) {
        setCardHolder(u.displayName || '');
        setShippingName(u.displayName || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const startTryon = () => {
    setSelectedOutfitUrl(item.imageUrl);
    // Intelligent Fallback: Populate default model immediately to allow seamless "Try on on model" mode.
    setSelectedAvatarUrl(PRESET_MODELS[0].url);
    setSelectedAvatarName(PRESET_MODELS[0].name);
    setTryonError(null);
    setIsProcessingFit(false);
    setSimulateAIError(false);
    setIsPlayingTryon(true);
    setTryOnProcessingPhase(1);
    setTryonStep(1); // Set to Step 1 (Select Outfit) on initialization
    
    // Reset calibration values
    setSliderShoulderWidth(48);
    setSliderTorsoWidth(100);
    setSliderAngle(0);
    setSliderInseam(80);
    setShowSkeleton(true);
    setHolographicMode(false);
    setShowBaseLayer(true);
    setShowMidLayer(true);
    setShowBottomLayer(true);
  };

  const handleBodyPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedAvatarUrl(url);
      setSelectedAvatarName(file.name || "Custom User Avatar");
      setTryonError(null);
    }
  };

  const runTryOnExecution = () => {
    // Prevent double clicks or rapid execution loops
    if (isProcessingFit) {
      console.warn("[Try On] Execution currently in progress, skipping duplication.");
      return;
    }

    // CRITICAL INPUT VALIDATION
    if (!selectedOutfitUrl || !selectedAvatarUrl) {
      console.warn("[Try On] Validation failed: Please complete selected outfit and body reference before processing.");
      setTryonError("Upload a photo or select a model to try on");
      return;
    }

    setTryonError(null);
    setIsProcessingFit(true);
    setTryOnProcessingPhase(1);

    // Store active timeouts to prevent running if component state changed or unmounted
    const t1 = setTimeout(() => {
      setTryOnProcessingPhase(2);
    }, 1000);

    const t2 = setTimeout(() => {
      setTryOnProcessingPhase(3);
    }, 2000);

    const t3 = setTimeout(() => {
      setIsProcessingFit(false);
      setTryonStep(4); // Outcome Screen
      styleProfile.trackInteraction('tryon', item);
    }, 3200);

    // Guaranteed safety timeout (e.g. max 6-8 seconds absolute window)
    const safetyTimeout = setTimeout(() => {
      setIsProcessingFit((currentlyProcessing) => {
        if (currentlyProcessing) {
          setTryonStep(4);
          return false;
        }
        return currentlyProcessing;
      });
    }, 6000);

    // If step changes or overlay is closed, these should ideally clean up, handled gracefully
  };

  const handleSaveToCloset = () => {
    onSaveToCloset(
      item.title, 
      item.description, 
      item.category || 'Casual', 
      item.imageUrl,
      item.price
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleBuyNow = () => {
    setFormErrors({});
    setOrderId('');
    setIsCheckingOut(false);
    setCheckoutComplete(false);
    
    // Check if real registered user is active (exclude anonymous / guest UIDs)
    const isLoggedInRealUser = currentUser && !currentUser.isAnonymous && !currentUser.uid.startsWith('guest-');
    if (isLoggedInRealUser) {
      setCheckoutStep('cart');
    } else {
      setCheckoutStep('login');
    }
    setShowCheckout(true);
    UnifiedFashionOS.trackEvent('checkout_started', { productId: item.id, productTitle: item.title, price: item.price });
  };

  const handleCheckoutLogin = async () => {
    try {
      setFormErrors({});
      await signInWithGoogle();
      setCheckoutStep('cart');
    } catch (e: any) {
      console.error("[Checkout Login] Error:", e);
      if (e.code === 'auth/unauthorized-domain') {
        setFormErrors({ login: 'auth/unauthorized-domain' });
      } else {
        setFormErrors({ login: e.message || "Failed to authenticate account via Google popup." });
      }
    }
  };

  const proceedToAddress = () => {
    const isLoggedInRealUser = currentUser && !currentUser.isAnonymous && !currentUser.uid.startsWith('guest-');
    if (!isLoggedInRealUser) {
      setCheckoutStep('login');
      return;
    }
    setCheckoutStep('address');
  };

  const proceedToPayment = () => {
    const errors: Record<string, string> = {};
    if (!shippingName.trim()) errors.shippingName = "Full Name is required";
    if (!shippingAddress.trim()) errors.shippingAddress = "Delivery Address is required";
    if (!shippingCity.trim()) errors.shippingCity = "City is required";
    if (!shippingPhone.trim()) errors.shippingPhone = "Phone contact is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setCheckoutStep('payment');
  };

  const confirmPurchase = async () => {
    // Lock state to prevent rapid user double clicks during database saving operations
    if (isCheckingOut) {
      console.warn("[Checkout Engine] Secure purchase already in progress, blocking duplicate submit.");
      return;
    }

    if (!isOnline) {
      setFormErrors({ submit: "You are currently offline. Please reconnect your network to complete transaction bookings." });
      return;
    }

    const errors: Record<string, string> = {};
    if (!cardNumber.trim()) errors.cardNumber = "Card Number is required";
    if (!cardHolder.trim()) errors.cardHolder = "Cardholder Name is required";
    if (!cardExpiry.trim()) errors.cardExpiry = "Expiry Date is required";
    if (!cardCvc.trim()) errors.cardCvc = "CVC is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsCheckingOut(true);
    setCheckoutStep('processing');

    try {
      styleProfile.trackInteraction('buy', item);

      // Call secure Stripe checkout redirect via BillingService
      await BillingService.startProductCheckout({
        productId: item.id,
        productTitle: item.title,
        productPrice: Number(item.price || 0),
        productImageUrl: item.imageUrl,
        shopName: item.shopName || 'Bespoke Atelier'
      });
    } catch (err: any) {
      console.error("[Checkout Engine] Stripe checkout session initiation error:", err);
      setFormErrors({ submit: err.message || "Failed to initiate secure Stripe checkout session." });
      setCheckoutStep('payment');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <motion.div 
      id={`feed-card-${item.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-[#0b0b0b] border border-white/[0.04] p-4 md:p-6 rounded-2xl relative overflow-hidden group select-none space-y-4"
    >
      {/* Interactive Try-on overlay simulation */}
      <AnimatePresence>
        {isPlayingTryon && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-950/98 z-30 flex flex-col p-5 overflow-y-auto selection:bg-transparent"
          >
            {/* Header with Close */}
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-4">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">Virtual Try-On Suite</span>
              <button 
                onClick={() => setIsPlayingTryon(false)}
                className="text-xs font-mono uppercase text-white/40 hover:text-white cursor-pointer px-1 bg-white/5 hover:bg-white/10 rounded"
              >
                [ Close ]
              </button>
            </div>

            {/* IF PROCESSING COMPILING STATE */}
            {isProcessingFit ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 py-8">
                <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-amber-400 rotate-12" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase block animate-pulse">Generating fitting preview</span>
                  {tryOnProcessingPhase === 1 && (
                    <div className="space-y-1">
                      <p className="text-sm font-sans text-neutral-100 font-medium">Detecting body shape…</p>
                      <p className="text-[10px] font-mono text-white/30">Scanning basic silhouette dimensions (shoulders, torso, height)</p>
                    </div>
                  )}
                  {tryOnProcessingPhase === 2 && (
                    <div className="space-y-1">
                      <p className="text-sm font-sans text-neutral-100 font-medium">Aligning garment structure…</p>
                      <p className="text-[10px] font-mono text-white/30">Sizing garment patterns & aligning shoulder fall to model</p>
                    </div>
                  )}
                  {tryOnProcessingPhase === 3 && (
                    <div className="space-y-1">
                      <p className="text-sm font-sans text-amber-300 font-medium animate-pulse">Rendering fit preview…</p>
                      <p className="text-[10px] font-mono text-white/30">Composing layered garment views & shadow drapes</p>
                    </div>
                  )}
                </div>
                
                <div className="w-32 bg-white/5 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-1000" 
                    style={{ width: `${tryOnProcessingPhase * 33.3}%` }} 
                  />
                </div>
              </div>
            ) : (
              <>
                {/* STEP 1: OUTFIT SELECTION CHECK */}
                {tryonStep === 1 && (
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest block">Step 1 of 3</span>
                        <h4 className="font-serif text-md text-white font-light">Confirm Selected Outfit</h4>
                        <p className="text-xs text-white/45 font-light">Verify the artisan garment to drape.</p>
                      </div>

                      <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center gap-3">
                        <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 border border-white/10">
                          <img src={selectedOutfitUrl || item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1 leading-snug">
                          <p className="text-xs text-white uppercase font-sans font-medium tracking-wide">{item.title}</p>
                          <p className="text-[10px] font-mono text-white/45 uppercase tracking-wide">{item.category} • ${item.price}</p>
                          <span className="inline-block text-[9px] font-mono text-emerald-400 bg-emerald-400/5 px-1.5 py-0.5 rounded border border-emerald-500/10">✓ Verified Source</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setTryonStep(2)}
                      className="w-full bg-white text-black font-mono text-xs uppercase hover:bg-neutral-200 transition-all font-semibold py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Choose Body Model</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                )}

                {/* STEP 2: BODY/AVATAR REFERENCE */}
                {tryonStep === 2 && (
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest block">Step 2 of 3</span>
                        <h4 className="font-serif text-md text-white font-light font-medium">Select Body or Upload Photo</h4>
                        <p className="text-xs text-white/45 font-light">Provide a reference model silhouette or custom photo to calibrate size.</p>
                      </div>

                      {tryonError && (
                        <div className="p-2.5 bg-rose-500/5 border border-rose-500/15 text-rose-400 text-xs font-mono rounded-lg flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{tryonError}</span>
                        </div>
                      )}

                      {/* Presets Grid */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-white/20">Preset Models:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {PRESET_MODELS.map((model) => {
                            const isSelected = selectedAvatarUrl === model.url;
                            return (
                              <button
                                key={model.id}
                                onClick={() => {
                                  setSelectedAvatarUrl(model.url);
                                  setSelectedAvatarName(model.name);
                                  setTryonError(null);
                                }}
                                className={`group relative rounded-lg overflow-hidden border aspect-square transition-all cursor-pointer flex flex-col justify-end p-2 ${
                                  isSelected 
                                    ? 'border-amber-400 ring-1 ring-amber-400/20' 
                                    : 'border-white/5 opacity-65 hover:opacity-100 hover:border-white/10'
                                }`}
                              >
                                <img src={model.url} alt={model.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
                                <span className="z-10 text-[7.5px] font-mono text-white/90 truncate w-full uppercase block text-left">
                                  {model.name.split(' ')[0]}
                                </span>
                                {isSelected && (
                                  <div className="absolute top-1 right-1 bg-amber-400 text-black rounded-full p-0.5 z-10 shadow">
                                    <Check className="w-2 h-2 text-black" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Upload input */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-white/20">OR Personal Image:</span>
                        <label className="border border-dashed border-white/10 hover:border-white/25 rounded-xl py-3 px-4 text-center cursor-pointer block transition-colors bg-white/[0.01]">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleBodyPhotoUpload}
                            className="hidden" 
                          />
                          <div className="flex items-center justify-center gap-2 text-white/50 hover:text-white/80">
                            <Upload className="w-4 h-4 text-white/40" />
                            <span className="text-[10px] font-mono uppercase tracking-wider">
                              {selectedAvatarName ? "Replace photo" : "Upload Body Reference"}
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* Selection feedback */}
                      {selectedAvatarUrl && (
                        <div className="bg-white/[0.04] border border-white/10 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono text-white">
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10">
                              <img src={selectedAvatarUrl} alt="selected avatar preview" className="w-full h-full object-cover" />
                            </div>
                            <span className="truncate max-w-[150px]">{selectedAvatarName || "Custom Avatar"}</span>
                          </div>
                          <span className="text-emerald-400 capitalize text-[9px] border border-emerald-400/20 px-1.5 py-0.5 rounded">Selected</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setTryonStep(1)}
                        className="w-1/3 bg-white/[0.05] text-white hover:bg-white/10 transition-all font-mono text-[10px] uppercase py-2 rounded-lg cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          if (!selectedAvatarUrl) {
                            setTryonError("Upload a photo or select a model to try on");
                          } else {
                            setTryonStep(3);
                            setTryonError(null);
                          }
                        }}
                        className="flex-1 bg-white text-black font-mono text-xs uppercase hover:bg-neutral-200 transition-all font-semibold py-2 rounded-lg cursor-pointer"
                      >
                        Confirm Setup
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PREVIEW CALIBRATION */}
                {tryonStep === 3 && (
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest block">Step 3 of 3</span>
                        <h4 className="font-serif text-md text-white font-light font-medium">Calibrate try-on preview</h4>
                        <p className="text-xs text-white/45 font-light">Confirm the selected layers before running generative fit calculations.</p>
                      </div>

                      {tryonError && (
                        <div className="p-2.5 bg-rose-500/5 border border-rose-500/15 text-rose-400 text-xs font-mono rounded-lg flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{tryonError}</span>
                        </div>
                      )}

                      {/* Display Selected Pairing */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl text-center space-y-1.5">
                          <span className="text-[7.5px] font-mono uppercase tracking-wider text-white/30 block">Artisan Garment</span>
                          <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/5 bg-[#0a0a0a]">
                            <img src={selectedOutfitUrl || item.imageUrl} alt="selected outfit" className="w-full h-full object-cover" />
                          </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl text-center space-y-1.5">
                          <span className="text-[7.5px] font-mono uppercase tracking-wider text-white/30 block">Mannequin Frame</span>
                          <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/5 bg-[#0a0a0a]">
                            {selectedAvatarUrl ? (
                              <img src={selectedAvatarUrl} alt="selected body" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-mono text-white/20 p-2">
                                No Model Selected
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Custom Fallback testing toggle */}
                      <label className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 p-2.5 rounded-lg text-white/60 select-none hover:text-white cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={simulateAIError} 
                          onChange={(e) => setSimulateAIError(e.target.checked)}
                          className="rounded border-white/10 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <div className="text-[10px] font-mono uppercase tracking-wide leading-tight">
                          <span className="block font-medium">Incorporate Processing Error</span>
                          <span className="text-white/30 font-light lowercase text-[8px] mt-0.5 block">simulates an error to trigger fallback mechanism</span>
                        </div>
                      </label>
                    </div>

                    <div className="flex gap-2.5">
                      <button
                        onClick={() => setTryonStep(2)}
                        className="w-1/3 bg-white/[0.05] text-white hover:bg-white/10 transition-all font-mono text-[9px] uppercase py-2 rounded-lg cursor-pointer"
                      >
                        Adjust Setup
                      </button>
                      <button
                        onClick={runTryOnExecution}
                        className="flex-1 bg-[#dfd7c2] text-black font-mono text-xs uppercase hover:bg-white transition-all font-semibold py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                        <span>Apply Silhouette Fit</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: RESULT SCREEN & FALLBACK */}
                {tryonStep === 4 && (
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    {simulateAIError ? (
                      /* REQUIRED SAFE FALLBACK - ORIGINAL OUTFIT IMAGE COMPLETELY UNCHANGED & UNDISTORTED */
                      <div className="space-y-4">
                        <div className="space-y-1 text-center">
                          <span className="inline-block text-[8px] font-mono text-rose-400 bg-rose-400/5 px-2 py-0.5 rounded border border-rose-500/10 uppercase tracking-widest leading-none">
                            Fitting Simulation Failed
                          </span>
                          <h4 className="font-serif text-md text-white font-light">Safe Fallback Complete</h4>
                          <p className="text-xs text-white/45 font-light">Original outfit garment shown completely undistorted.</p>
                        </div>

                        <div className="relative aspect-[3/4] w-48 max-w-full mx-auto overflow-hidden rounded-xl border border-white/10 bg-[#080808] leading-none">
                          <img 
                            src={selectedOutfitUrl || item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-neutral-950/90 py-2 px-3 text-center border-t border-white/5">
                            <span className="text-[7.5px] font-mono uppercase text-rose-300 tracking-wider">Pristine original outfit asset (No distortion)</span>
                          </div>
                        </div>

                        <div className="bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-xl flex gap-2 items-start text-left">
                          <Info className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] font-mono text-rose-300 leading-normal">
                            System caught a network interruption. The platform auto-applied safe fallback values, protecting original asset coordinates from distortion.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* SUCCESSFUL OUTCOME LAYOUT - INTERACTIVE BODY-AWARE SIMULATION LAYER */
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="inline-block text-[8px] font-mono text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest leading-none mb-1">
                            Interactive Try-On Active
                          </span>
                          <h4 className="font-serif text-base text-white">Live Fitting Simulator</h4>
                          <p className="text-[10px] text-white/40 font-mono">Dynamic garment layering scale & alignment</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                          {/* STAGE 1: DYNAMIC ALIGNMENT DRESSING VIEWPORT */}
                          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#060606] shadow-2xl flex flex-col items-stretch justify-between p-3 select-none">
                            {/* CAD Tech Grid back-overlay in Holographic view */}
                            {holographicMode && (
                              <div className="absolute inset-0 z-0 opacity-45 bg-[linear-gradient(rgba(14,165,233,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.04)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                            )}

                            {/* Reference Model image */}
                            <div className="absolute inset-0 z-0">
                              {selectedAvatarUrl ? (
                                <img 
                                  src={selectedAvatarUrl} 
                                  alt="Reference Body Map" 
                                  className="w-full h-full object-cover transition-all duration-300"
                                  style={{
                                    filter: holographicMode 
                                      ? "brightness(0.22) contrast(1.4) saturate(0.2) sepia(0.6) hue-rotate(185deg)" 
                                      : "brightness(0.75) contrast(1.05)"
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-white/20 p-4">
                                  No Avatar Reference loaded
                                </div>
                              )}
                            </div>

                            {/* Holographic scanning overlay lines */}
                            {holographicMode && (
                              <div className="absolute inset-x-0 h-[2px] bg-sky-500/30 shadow-[0_0_8px_rgba(14,165,233,0.5)] top-0 animate-[ping_3.5s_infinite] pointer-events-none z-10" />
                            )}

                            {/* Corner Tech labels */}
                            <div className="absolute top-2.5 left-2.5 z-20 font-mono text-[6.5px] text-white/35 uppercase flex flex-col gap-0.5 tracking-wider">
                              <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>[ FIT_ALIGNMENT ] STABLE</span>
                              <span>CHANNELS: STABLE</span>
                            </div>
                            
                            <div className="absolute top-2.5 right-2.5 z-20 font-mono text-[6.5px] text-white/35 uppercase flex flex-col gap-0.5 items-end tracking-wider">
                              <span>ANGLE: {sliderAngle}°</span>
                              <span>DEPTH: LAYERED_{showMidLayer ? "MID" : "BASE"}</span>
                            </div>

                            <div className="absolute bottom-2.5 left-2.5 z-20 font-mono text-[6.5px] text-white/35 uppercase tracking-wider">
                              <span>FIT_PRESET: {selectedAvatarName ? selectedAvatarName.split(' ')[0] : "DEFAULT"}</span>
                            </div>

                            <div className="absolute bottom-2.5 right-2.5 z-20 font-mono text-[6.5px] text-emerald-400 font-medium px-1.5 py-0.5 bg-emerald-950/40 border border-emerald-500/20 rounded uppercase tracking-wider">
                              {96 - Math.abs(sliderShoulderWidth - 48)}% ACCURACY
                            </div>

                            {/* SVG MULTI-LAYER GARMENT AND SKELETON ALIGNMENT ENGINE */}
                            <svg 
                              className="absolute inset-0 w-full h-full z-10 pointer-events-none" 
                              viewBox="0 0 100 120"
                              preserveAspectRatio="none"
                            >
                              {/* Wrap everything in a general pose orientation tilt group around center */}
                              <g 
                                style={{
                                  transform: `rotate(${sliderAngle}deg)`,
                                  transformOrigin: "50px 50px"
                                }}
                                className="transition-transform duration-200"
                              >
                                {/* Static / Dynamic coordinates mapping inside the SVG 100x120 grid */}
                                {(() => {
                                  // Calibrate coordinates
                                  const cX = 50;
                                  const sWidth = Math.max(30, Math.min(62, sliderShoulderWidth * 1.0));
                                  const shL = cX - sWidth / 2;
                                  const shR = cX + sWidth / 2;

                                  const tScale = sliderTorsoWidth / 100;
                                  const wWidth = 26 * tScale * (sliderShoulderWidth / 48);
                                  const wL = cX - wWidth / 2;
                                  const wR = cX + wWidth / 2;

                                  const hWidth = 29 * tScale * (sliderShoulderWidth / 48);
                                  const hL = cX - hWidth / 2;
                                  const hR = cX + hWidth / 2;

                                  const nY = 19;
                                  const sY = 27;
                                  const cY = 41;
                                  const wY = 56;
                                  const hY = 70;
                                  const legY = Math.min(114, 70 + (sliderInseam - 65) * 1.0 + 16);

                                  const baseColor = getGarmentColor(item.title, '#CBD5E1');
                                  const midColor = getGarmentColor(item.description, '#334155');

                                  return (
                                    <>
                                      {/* ================= CLOTHING LAYER 1: BOTTOM (TROUSERS / CHINOS) ================= */}
                                      {showBottomLayer && (
                                        <path 
                                          d={`
                                            M ${wL} ${wY} 
                                            Q ${cX} ${wY + 1} ${wR} ${wY} 
                                            L ${hR} ${hY} 
                                            L ${cX + 4} ${legY} 
                                            Q ${cX + 2} ${legY} ${cX + 1.5} ${legY - 2}
                                            L ${cX} ${hY + 4}
                                            L ${cX - 1.5} ${legY - 2}
                                            Q ${cX - 2} ${legY} ${cX - 4} ${legY}
                                            L ${hL} ${hY} 
                                            Z
                                          `}
                                          fill="#1e293b"
                                          stroke="#334155"
                                          strokeWidth="0.5"
                                          fillOpacity={holographicMode ? "0.4" : "0.95"}
                                        />
                                      )}

                                      {/* ================= CLOTHING LAYER 2: BASE (T-SHIRT / TOP) ================= */}
                                      {showBaseLayer && (
                                        <path 
                                          d={`
                                            M ${shL} ${sY} 
                                            Q ${cX} ${nY + 3} ${shR} ${sY}
                                            C ${shR} ${sY} ${shR + 3} ${sY + 4} ${shR + 4.5} ${sY + 7}
                                            L ${shR + 1.5} ${sY + 9.5}
                                            L ${shR - 1.5} ${sY + 8.5}
                                            L ${wR - 0.5} ${cY}
                                            Q ${cX} ${wY - 1} ${wR - 2} ${wY - 2}
                                            L ${wL + 2} ${wY - 2}
                                            Q ${cX} ${wY - 1} ${wL + 0.5} ${cY}
                                            L ${shL + 1.5} ${sY + 8.5}
                                            L ${shL - 1.5} ${sY + 9.5}
                                            C ${shL - 3} ${sY + 4} ${shL} ${sY} ${shL} ${sY}
                                            Z
                                          `}
                                          fill={baseColor}
                                          stroke="#ffffff"
                                          strokeWidth="0.3"
                                          fillOpacity={holographicMode ? "0.3" : "0.9"}
                                        />
                                      )}

                                      {/* ================= CLOTHING LAYER 3: MID / OUTER (JACKET / BLAZER OVERLAY) ================= */}
                                      {showMidLayer && (
                                        <path 
                                          d={`
                                            M ${shL - 1} ${sY - 0.5} 
                                            Q ${cX} ${nY + 2} ${shR + 1} ${sY - 0.5}
                                            C ${shR + 1} ${sY - 0.5} ${shR + 4} ${sY + 11} ${shR + 5} ${sY + 16}
                                            L ${shR + 2.5} ${sY + 17.5}
                                            L ${shR - 0.5} ${sY + 13}
                                            L ${wR + 1.5} ${cY + 4}
                                            L ${wR + 2} ${hY - 4}
                                            C ${wR} ${hY - 2.5} ${cX} ${hY - 2} ${cX + 2} ${hY - 3}
                                            L ${cX} ${cY + 2}
                                            L ${cX - 2} ${hY - 3}
                                            C ${wL} ${hY - 2.5} ${wL - 2} ${hY - 4} ${wL - 2} ${cY + 4}
                                            L ${shL + 0.5} ${sY + 13}
                                            L ${shL - 2.5} ${sY + 17.5}
                                            C ${shL - 4} ${sY + 11} ${shL - 1} ${sY - 0.5} ${shL - 1} ${sY - 0.5}
                                            Z
                                          `}
                                          fill={midColor}
                                          stroke="#e2e8f0"
                                          strokeWidth="0.4"
                                          fillOpacity={holographicMode ? "0.35" : "0.95"}
                                        />
                                      )}

                                      {/* ================= SKELETON ALIGNMENT WIREFRAME (Joint tracking) ================= */}
                                      {showSkeleton && (
                                        <g stroke={holographicMode ? "#38bdf8" : "#fbbf24"} strokeWidth="0.5" strokeOpacity="0.8">
                                          {/* Crown center spinal references */}
                                          <line x1={cX} y1={nY} x2={cX} y2={sY} strokeDasharray="1 1" />
                                          <line x1={cX} y1={sY} x2={cX} y2={cY} />
                                          <line x1={cX} y1={cY} x2={cX} y2={wY} />
                                          <line x1={cX} y1={wY} x2={cX} y2={hY} />

                                          {/* Shoulder girdle */}
                                          <line x1={shL} y1={sY} x2={shR} y2={sY} />
                                          <line x1={shL} y1={sY} x2={wL} y2={wY} />
                                          <line x1={shR} y1={sY} x2={wR} y2={wY} />

                                          {/* Pelves mapping */}
                                          <line x1={wL} y1={wY} x2={hL} y2={hY} />
                                          <line x1={wR} y1={wY} x2={hR} y2={hY} />
                                          <line x1={hL} y1={hY} x2={hR} y2={hY} />

                                          {/* Leg structures */}
                                          <line x1={hL} y1={hY} x2={cX - 4} y2={legY} strokeDasharray="1" />
                                          <line x1={hR} y1={hY} x2={cX + 4} y2={legY} strokeDasharray="1" />

                                          {/* glowing Neon Joints */}
                                          <circle cx={shL} cy={sY} r="1.2" fill={holographicMode ? "#0ea5e9" : "#fb7185"} className="animate-pulse" />
                                          <circle cx={shR} cy={sY} r="1.2" fill={holographicMode ? "#0ea5e9" : "#fb7185"} className="animate-pulse" />
                                          <circle cx={cX} cy={cY} r="1.2" fill={holographicMode ? "#0ea5e9" : "#e11d48"} />
                                          <circle cx={wL} cy={wY} r="1.0" fill={holographicMode ? "#0ea5e9" : "#fb7185"} />
                                          <circle cx={wR} cy={wY} r="1.0" fill={holographicMode ? "#0ea5e9" : "#fb7185"} />
                                          <circle cx={hL} cy={hY} r="1.0" fill={holographicMode ? "#0ea5e9" : "#b45309"} />
                                          <circle cx={hR} cy={hY} r="1.0" fill={holographicMode ? "#0ea5e9" : "#b45309"} />
                                          <circle cx={cX - 4} cy={legY} r="0.8" fill={holographicMode ? "#38bdf8" : "#fbbf24"} />
                                          <circle cx={cX + 4} cy={legY} r="0.8" fill={holographicMode ? "#38bdf8" : "#fbbf24"} />
                                        </g>
                                      )}
                                    </>
                                  );
                                })()}
                              </g>
                            </svg>
                          </div>

                          {/* STAGE 2: CALIBRATION SLIDERS & CONTROLS CONTROL ROOM */}
                          <div className="flex flex-col justify-between space-y-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                            {/* Evaluation Status Card */}
                            <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 space-y-1.5 text-left">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-mono uppercase text-white/40">Evaluation Rating</span>
                                <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded ${
                                  (96 - Math.abs(sliderShoulderWidth - 48)) >= 94 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}>
                                  {96 - Math.abs(sliderShoulderWidth - 48)}% Fit Rate
                                </span>
                              </div>
                              <p className="text-[11px] text-white/80 font-sans italic">
                                {(() => {
                                  const acc = 96 - Math.abs(sliderShoulderWidth - 48);
                                  if (acc >= 95) return "\"Optimal customized match. Hem drape locks neatly with shoulder boundaries.\"";
                                  if (acc >= 91) return "\"Relaxed tailored fit. Minor chest span surplus detected in rendering.\"";
                                  return "\"Proportions extreme. Fabric tension exceeds recommended baseline bounds.\"";
                                })()}
                              </p>
                            </div>

                            {/* SMART PRESETS SELECTORS */}
                            <div className="space-y-2.5 text-left">
                              <div>
                                <span className="text-[9px] font-mono tracking-wider uppercase text-white/30 block mb-1">Body Reference Preset (Fallback Options)</span>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {PRESET_MODELS.map((p) => (
                                    <button
                                      key={p.id}
                                      onClick={() => {
                                        setSelectedAvatarUrl(p.url);
                                        setSelectedAvatarName(p.name);
                                      }}
                                      className={`text-[9px] py-1.5 font-mono uppercase bg-white/[0.02] border rounded cursor-pointer truncate transition-all px-1.5 ${
                                        selectedAvatarUrl === p.url
                                          ? "border-amber-400/80 text-amber-400 bg-amber-400/5 font-semibold"
                                          : "border-white/5 text-white/40 hover:text-white/80 hover:border-white/10"
                                      }`}
                                    >
                                      {p.name.split(' ')[0]}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="text-[9px] font-mono tracking-wider uppercase text-white/30 block mb-1">Sizing Dimension Profile</span>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {[
                                    { name: "Slim Fit", s: 42, t: 86, ins: 74 },
                                    { name: "Regular", s: 48, t: 100, ins: 80 },
                                    { name: "Oversized", s: 54, t: 118, ins: 86 }
                                  ].map((sz) => {
                                    const isActive = sliderShoulderWidth === sz.s && sliderTorsoWidth === sz.t;
                                    return (
                                      <button
                                        key={sz.name}
                                        onClick={() => {
                                          setSliderShoulderWidth(sz.s);
                                          setSliderTorsoWidth(sz.t);
                                          setSliderInseam(sz.ins);
                                        }}
                                        className={`text-[9px] py-1 font-mono uppercase bg-white/[0.02] border rounded cursor-pointer transition-all ${
                                          isActive
                                            ? "border-emerald-400 text-emerald-400 bg-emerald-400/5 font-semibold"
                                            : "border-white/5 text-white/40 hover:text-white/80 hover:border-white/10"
                                        }`}
                                      >
                                        {sz.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* CORE CALIBRATION SLIDERS */}
                            <div className="space-y-2.5 text-left bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                              <span className="text-[9px] font-mono tracking-wider uppercase text-white/20 block mb-0.5">Real-time Sizing Anchors</span>
                              
                              {/* Shoulder Span */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-white/50 flex items-center gap-1"><Sliders className="w-3 h-3 text-amber-400" /> Shoulder width</span>
                                  <span className="text-amber-400 font-medium">{sliderShoulderWidth} cm</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="38" 
                                  max="58"
                                  value={sliderShoulderWidth}
                                  onChange={(e) => setSliderShoulderWidth(Number(e.target.value))}
                                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                              </div>

                              {/* Torso Profiles */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-white/50 flex items-center gap-1"><Layers className="w-3 h-3 text-emerald-400" /> Torso profile</span>
                                  <span className="text-emerald-400 font-medium">{sliderTorsoWidth}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="80" 
                                  max="125"
                                  value={sliderTorsoWidth}
                                  onChange={(e) => setSliderTorsoWidth(Number(e.target.value))}
                                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                              </div>

                              {/* Angle Offset */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-white/50 flex items-center gap-1"><Eye className="w-3 h-3 text-blue-400" /> Posture rotation</span>
                                  <span className="text-blue-400 font-medium">{sliderAngle}°</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="-15" 
                                  max="15"
                                  value={sliderAngle}
                                  onChange={(e) => setSliderAngle(Number(e.target.value))}
                                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                              </div>

                              {/* Inseam Drop */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-white/50 flex items-center gap-1">Inseam length</span>
                                  <span className="text-purple-400 font-medium">{sliderInseam} cm</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="65" 
                                  max="95"
                                  value={sliderInseam}
                                  onChange={(e) => setSliderInseam(Number(e.target.value))}
                                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                              </div>
                            </div>

                            {/* STRUCTURAL TOGGLES & LAYER CONTROLLERS */}
                            <div className="grid grid-cols-2 gap-3 text-left">
                              <div className="bg-white/[0.01] border border-white/5 p-2 rounded-lg flex items-center justify-between text-[9px] font-mono">
                                <span className="text-white/50">Skeleton Overlay</span>
                                <input 
                                  type="checkbox" 
                                  checked={showSkeleton} 
                                  onChange={(e) => setShowSkeleton(e.target.checked)}
                                  className="rounded border-white/10 text-amber-500 focus:ring-0 cursor-pointer"
                                />
                              </div>

                              <div className="bg-white/[0.01] border border-white/5 p-2 rounded-lg flex items-center justify-between text-[9px] font-mono">
                                <span className="text-white/50">Hologram Blueprints</span>
                                <input 
                                  type="checkbox" 
                                  checked={holographicMode} 
                                  onChange={(e) => setHolographicMode(e.target.checked)}
                                  className="rounded border-white/10 text-sky-500 focus:ring-0 cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* LAYER STACK CONTROLLER PILLS */}
                            <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl text-left space-y-1.5">
                              <span className="text-[8px] font-mono tracking-wider uppercase text-white/30 block">Garment Layer Stack</span>
                              <div className="space-y-1">
                                {[
                                  { label: "Mid: Blazer Coat Overlay", active: showMidLayer, set: setShowMidLayer, col: "bg-slate-400" },
                                  { label: "Base: Premium Cotton Tee", active: showBaseLayer, set: setShowBaseLayer, col: "bg-white" },
                                  { label: "Bottom: Tailored leg trousers", active: showBottomLayer, set: setShowBottomLayer, col: "bg-indigo-600" }
                                ].map((lay) => (
                                  <label 
                                    key={lay.label}
                                    className="flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] p-1.5 rounded text-[9.5px] font-mono text-white/70 select-none cursor-pointer transition-colors"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <span className={`w-1.5 h-1.5 rounded-full ${lay.col}`}></span>
                                      <span>{lay.label}</span>
                                    </div>
                                    <input 
                                      type="checkbox" 
                                      checked={lay.active}
                                      onChange={(e) => lay.set(e.target.checked)}
                                      className="rounded border-white/10 text-amber-500 focus:ring-0 cursor-pointer"
                                    />
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2.5 pt-2 border-t border-white/5">
                      <button
                        onClick={() => {
                          setTryonStep(3);
                          setTryonError(null);
                        }}
                        className="w-1/3 bg-white/[0.05] text-white hover:bg-white/10 transition-all font-mono text-[9px] uppercase py-2.5 rounded-lg cursor-pointer"
                      >
                        Recalibrate Pairing
                      </button>
                      <button
                        onClick={() => setIsPlayingTryon(false)}
                        className="flex-1 bg-white text-black font-mono text-xs uppercase hover:bg-neutral-200 transition-all font-bold py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3px]" />
                        <span>Apply & Close Studio</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout overlay simulation */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/98 z-30 flex flex-col justify-between p-6 overflow-y-auto selection:bg-transparent"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/40">Secure Smart Checkout</span>
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-[10px] font-mono uppercase text-white/40 hover:text-white cursor-pointer px-1.5 py-0.5 bg-white/5 hover:bg-white/10 rounded"
              >
                [ Close ]
              </button>
            </div>

            {/* Container for scrollable state */}
            <div className="flex-1 py-4 flex flex-col justify-center">
              {checkoutStep === 'login' && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-amber-400">
                    <AlertCircle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-lg text-white font-light">Authentication Required</h4>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                      You must be signed in with a registered account to execute cloud secure purchases.
                    </p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-[11px] text-white/50 leading-relaxed font-serif text-left italic">
                    "Guest Mode is locked for active checkout transactions. Link with Google identity to claim genuine boutique items safely."
                  </div>
                  
                  {formErrors.login && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-rose-400 text-[10px] font-mono text-left">
                      {formErrors.login === 'auth/unauthorized-domain' ? (
                        <div className="space-y-2 text-neutral-300">
                          <p className="text-rose-400 font-semibold uppercase text-center flex items-center justify-center gap-1">
                            ⚠️ Domain Authorization Required
                          </p>
                          <p className="leading-relaxed">
                            Your custom Firebase project <strong>fashion-ai-56bd2</strong> has not authorized this preview domain yet.
                          </p>
                          <p className="leading-relaxed">
                            Please go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300 font-bold">Firebase Console</a> &gt; <strong>Authentication</strong> &gt; <strong>Settings</strong> &gt; <strong>Authorized domains</strong>, and add:
                          </p>
                          <div className="bg-black/50 p-2 rounded text-[9px] text-white font-mono select-all border border-white/5 break-all">
                            {window.location.hostname}
                          </div>
                        </div>
                      ) : (
                        formErrors.login
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleCheckoutLogin}
                    className="w-full bg-white text-black font-mono text-xs uppercase hover:bg-neutral-200 transition-all font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>[ SIGN IN WITH GOOGLE ]</span>
                  </button>
                </div>
              )}

              {checkoutStep === 'cart' && (
                <div className="space-y-4">
                  <div className="space-y-2 text-left">
                    <span className="text-[7.5px] font-mono text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest leading-none">
                      Step 1 of 4: Sartorial Bag
                    </span>
                    <h4 className="font-serif text-md text-white font-light">Confirm Bag Inventory</h4>
                  </div>

                  <div className="flex gap-3 items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl text-left">
                    <img src={item.imageUrl} alt={item.title} className="w-14 h-18 object-cover rounded-md border border-white/10 flex-shrink-0" />
                    <div>
                      <h5 className="font-serif text-sm text-neutral-100 font-light leading-snug">{item.title}</h5>
                      <p className="text-[10px] text-white/40 font-mono tracking-tight">{item.shopName || "Boutique Partner"}</p>
                      <p className="text-xs text-white/70 font-mono font-semibold mt-1">${item.price}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-white/50">
                      <span>Store Price:</span>
                      <span>${item.price}</span>
                    </div>
                    <div className="flex justify-between text-white/50 border-b border-white/5 pb-2">
                      <span>Availability:</span>
                      <span className="text-emerald-400">Guaranteed In Stock</span>
                    </div>
                    <div className="flex justify-between text-white font-medium pt-1">
                      <span>Total Subtotal:</span>
                      <span>${item.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={proceedToAddress}
                    className="w-full bg-white text-black font-mono text-xs uppercase hover:bg-neutral-200 transition-all font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Delivery &rarr;</span>
                  </button>
                </div>
              )}

              {checkoutStep === 'address' && (
                <div className="space-y-3">
                  <div className="space-y-1 text-left">
                    <span className="text-[7.5px] font-mono text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest leading-none">
                      Step 2 of 4: Shipping
                    </span>
                    <h4 className="font-serif text-md text-white font-light">Delivery Coordinates</h4>
                  </div>

                  <div className="space-y-2.5 text-left text-xs font-mono">
                    <div className="space-y-1">
                      <label className="text-white/40 text-[9px] uppercase">Receiver's Full Name</label>
                      <input 
                        type="text" 
                        value={shippingName} 
                        onChange={(e) => setShippingName(e.target.value)} 
                        placeholder="e.g. Eleanor Vance" 
                        className="w-full bg-white/[0.03] border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-white/30 text-[11px]"
                      />
                      {formErrors.shippingName && <p className="text-rose-400 text-[8px] uppercase">{formErrors.shippingName}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-white/40 text-[9px] uppercase">Street Address</label>
                      <input 
                        type="text" 
                        value={shippingAddress} 
                        onChange={(e) => setShippingAddress(e.target.value)} 
                        placeholder="e.g. 52 Wardrobe Lane, Level 4" 
                        className="w-full bg-white/[0.03] border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-white/30 text-[11px]"
                      />
                      {formErrors.shippingAddress && <p className="text-rose-400 text-[8px] uppercase">{formErrors.shippingAddress}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-white/40 text-[9px] uppercase">City / State</label>
                        <input 
                          type="text" 
                          value={shippingCity} 
                          onChange={(e) => setShippingCity(e.target.value)} 
                          placeholder="e.g. New York, NY" 
                          className="w-full bg-white/[0.03] border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-white/30 text-[11px]"
                        />
                        {formErrors.shippingCity && <p className="text-rose-400 text-[8px] uppercase">{formErrors.shippingCity}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-white/40 text-[9px] uppercase">Phone Number</label>
                        <input 
                          type="text" 
                          value={shippingPhone} 
                          onChange={(e) => setShippingPhone(e.target.value)} 
                          placeholder="e.g. +1 555-0199" 
                          className="w-full bg-white/[0.03] border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-white/30 text-[11px]"
                        />
                        {formErrors.shippingPhone && <p className="text-rose-400 text-[8px] uppercase">{formErrors.shippingPhone}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setCheckoutStep('cart')}
                      className="w-1/3 bg-white/[0.04] text-white hover:bg-white/10 border border-white/10 font-mono text-[9px] uppercase py-2.5 rounded-lg cursor-pointer"
                    >
                      &larr; Back
                    </button>
                    <button
                      onClick={proceedToPayment}
                      className="flex-1 bg-white text-black font-mono text-xs uppercase hover:bg-neutral-200 transition-all font-semibold py-2.5 rounded-lg cursor-pointer"
                    >
                      Choose Payment &rarr;
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-3">
                  <div className="space-y-1 text-left">
                    <span className="text-[7.5px] font-mono text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 uppercase tracking-widest leading-none">
                      Step 3 of 4: Transaction Payment Gate
                    </span>
                    <h4 className="font-serif text-md text-white font-light">Payment Gateway (Demo Mode)</h4>
                    <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-wide">Developer Sandbox Active. No real funds will be transferred.</p>
                  </div>

                  {formErrors.submit && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-rose-400 text-[10px] font-mono">
                      {formErrors.submit}
                    </div>
                  )}

                  <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 text-left font-mono space-y-3 relative overflow-hidden">
                    <div className="absolute top-2 right-3 text-[18px] text-white/15 italic font-bold">VISA</div>
                    
                    <div className="space-y-1 opacity-90">
                      <span className="text-[7px] text-white/35 uppercase">Vault Card Number</span>
                      <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)} 
                        className="w-full bg-white/[0.02] border border-white/5 rounded px-2 py-1 text-white text-[12px] focus:outline-none focus:border-white/20"
                      />
                      {formErrors.cardNumber && <p className="text-rose-400 text-[8px] uppercase">{formErrors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[7px] text-white/35 uppercase">Cardholder</span>
                        <input 
                          type="text" 
                          value={cardHolder} 
                          onChange={(e) => setCardHolder(e.target.value)} 
                          className="w-full bg-white/[0.02] border border-white/5 rounded px-2 py-1 text-white text-[10px] focus:outline-none focus:border-white/20"
                        />
                        {formErrors.cardHolder && <p className="text-rose-400 text-[8px] uppercase">{formErrors.cardHolder}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="space-y-1">
                          <span className="text-[7px] text-white/35 uppercase">Expiry</span>
                          <input 
                            type="text" 
                            value={cardExpiry} 
                            onChange={(e) => setCardExpiry(e.target.value)} 
                            className="w-full bg-white/[0.02] border border-white/5 rounded px-2 py-1 text-white text-[10px] text-center focus:outline-none focus:border-white/20"
                          />
                          {formErrors.cardExpiry && <p className="text-rose-400 text-[8px] uppercase">{formErrors.cardExpiry}</p>}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[7px] text-white/35 uppercase">CVC</span>
                          <input 
                            type="text" 
                            value={cardCvc} 
                            onChange={(e) => setCardCvc(e.target.value)} 
                            className="w-full bg-white/[0.02] border border-white/5 rounded px-2 py-1 text-white text-[10px] text-center focus:outline-none focus:border-white/20"
                          />
                          {formErrors.cardCvc && <p className="text-rose-400 text-[8px] uppercase">{formErrors.cardCvc}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 bg-white/[0.01] p-2.5 rounded border border-white/[0.03]">
                    <span>Simulated Total Price:</span>
                    <span className="text-white font-bold text-xs">${item.price}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCheckoutStep('address')}
                      disabled={isCheckingOut}
                      className="w-1/3 bg-white/[0.04] text-white hover:bg-white/10 border border-white/10 font-mono text-[9px] uppercase py-2.5 rounded-lg cursor-pointer disabled:opacity-50"
                    >
                      &larr; Back
                    </button>
                    <button
                      onClick={confirmPurchase}
                      disabled={!isOnline || isCheckingOut}
                      className={`flex-1 font-mono text-xs uppercase transition-all font-semibold py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 ${
                        isOnline && !isCheckingOut
                          ? 'bg-white text-black hover:bg-neutral-200' 
                          : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> {isCheckingOut ? "Connecting to Stripe..." : isOnline ? "Book Confirmed Order" : "Offline - Try reconnecting"}
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'processing' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-5 h-5 text-neutral-200" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-widest text-[#9c9c9c] uppercase block animate-pulse">AUTHORIZING TRANSACTION</span>
                    <p className="text-[11px] font-mono text-neutral-300">Debiting simulated secure ledger...</p>
                    <p className="text-[10px] font-mono text-neutral-400 italic">Transmitting credentials to {item.shopName || "Bespoke Atelier"}...</p>
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center p-2 space-y-4">
                  <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-sm shadow-emerald-500/5">
                    <Check className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg text-white font-light">Purchase Completed</h4>
                    <span className="inline-block text-[8px] font-mono text-emerald-400 bg-emerald-400/5 px-2.5 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest leading-none">
                      Reservation Locked
                    </span>
                  </div>

                  <div className="space-y-2 bg-[#0d0d0d] border border-white/[0.04] p-3 rounded-xl text-left font-mono text-[10px] text-white/50 space-y-1.5 leading-normal">
                    <div className="flex justify-between">
                      <span>Store Item:</span>
                      <span className="text-white font-light italic font-serif">{item.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retail Price:</span>
                      <span className="text-white">${item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipment:</span>
                      <span className="text-emerald-400 font-bold">Bespoke Courier</span>
                    </div>
                    {orderId && (
                      <div className="border-t border-white/5 pt-1.5 mt-1 text-[8px] text-white/30 flex justify-between">
                        <span>Ledger ID:</span>
                        <span className="text-neutral-400 select-all truncate max-w-[120px] font-bold">{orderId}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] font-normal text-white/40 leading-snug">
                    Confirmations sent to your dashboard log. The designer has been dispatched for fitting preparation.
                  </p>

                  <button
                    onClick={() => {
                      setShowCheckout(false);
                      setCheckoutStep('cart');
                    }}
                    className="w-full bg-white text-black font-mono text-[10px] uppercase font-bold hover:bg-neutral-200 transition-all py-2.5 rounded-lg cursor-pointer"
                  >
                    Close & Return to Feed
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[7px] font-mono text-white/20 uppercase tracking-widest">
              <span>Zero-Trust Protocol</span>
              <span>Atelier Ingress Secured</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Primary Image Section (Image First) */}
      {item.imageUrl && (
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/5 bg-[#080808]">
          <ImageWithFade src={item.imageUrl} alt={item.title} />

          {/* Try On Button overlay */}
          {(item.type === 'shop_product' || item.type === 'budget_pick' || item.type === 'trending_fashion') && (
            <button
              onClick={startTryon}
              className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/10 px-3 py-1 text-[9px] font-mono uppercase text-white hover:text-white/80 transition-colors z-10 flex items-center gap-1 cursor-pointer rounded-md shadow-lg"
            >
              <Sparkle className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span>Try On (AI Fit)</span>
            </button>
          )}

          {/* Suitability Score Star on Outfits */}
          {item.type === 'outfit' && item.suitabilityScore && (
            <div className="absolute top-3 right-3 bg-white text-black font-semibold px-2 py-1 z-10 rounded-md border border-white/20 text-center">
              <span className="text-xs block leading-none">{item.suitabilityScore}%</span>
              <span className="text-[7px] font-mono uppercase tracking-widest text-black/50 leading-none">Vibe Match</span>
            </div>
          )}
        </div>
      )}

      {/* 2. Price + Location details with shop info */}
      <div className="flex justify-between items-center text-xs pt-1">
        {/* Merchant Info or Tag */}
        {item.type === 'shop_product' || item.type === 'budget_pick' ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-white/15 bg-neutral-900 flex-shrink-0">
              <img src={item.shopAvatarUrl} alt={item.shopName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <p className="font-sans text-white/95 font-medium tracking-wide leading-none">{item.shopName}</p>
                {item.verified && (
                  <span className="inline-flex items-center justify-center bg-amber-500/10 text-amber-400 p-0.5 rounded-full border border-amber-500/10 scale-90" title="Verified Sartorial Seller">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[8.5px] font-mono text-white/40 uppercase tracking-tight mt-1">
                {/* Store Type Badge */}
                <span className={`px-1 rounded-sm border ${
                  item.storeType === 'ONLINE_STORE'
                    ? 'border-amber-500/10 bg-amber-500/5 text-amber-300'
                    : item.storeType === 'HYBRID_BRAND'
                      ? 'border-purple-500/10 bg-purple-500/5 text-purple-300'
                      : 'border-emerald-500/10 bg-emerald-500/5 text-emerald-300'
                }`}>
                  {item.storeType === 'ONLINE_STORE' ? 'Online' : item.storeType === 'HYBRID_BRAND' ? 'Hybrid' : 'Boutique'}
                </span>
                
                {item.storeType !== 'ONLINE_STORE' && item.location ? (
                  <div className="flex items-center gap-0.5 text-white/30 hover:text-white transition-colors">
                    <MapPin className="w-2.5 h-2.5 text-white/20" />
                    <span>{item.location}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5 text-white/30 hover:text-white transition-colors">
                    <Globe className="w-2.5 h-2.5 text-white/25" />
                    <span>Online Brand</span>
                  </div>
                )}

                {item.price !== undefined && (
                  <>
                    <span className="text-white/10">|</span>
                    <span className="text-[#dfd7c2] font-semibold font-mono">${item.price}</span>
                  </>
                )}

                {item.shippingMode && (
                  <>
                    <span className="text-white/10">|</span>
                    <span className="text-stone-400">{item.shippingMode === 'pickup' ? 'Pick-up' : `Ships (${item.deliveryEstimate || '2-4 days'})`}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-white/50 font-mono text-[9.5px] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-white/60 animate-pulse" />
            <span>{item.type === 'outfit' ? 'Closet Compilation' : 'AI Fashion Note'}</span>
          </div>
        )}

        {/* Quality Indicator / Stats Chip */}
        {item.statsLabel && (
          <div className="bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded-md">
            <span className="text-[8px] font-mono text-white/45 tracking-wider uppercase font-light">
              {item.statsLabel}
            </span>
          </div>
        )}
      </div>

      {/* 3. Description/Notes Block (AI Insight Third) */}
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-serif text-lg font-light text-white leading-snug group-hover:text-white/95 transition-colors">
            {item.title}
          </h3>
          {/* Quick badge */}
          {item.availability && (
            <span className={`text-[8.5px] font-mono uppercase tracking-widest border px-1.5 py-0.5 rounded ${
              item.availability === 'In Stock' 
                ? 'text-emerald-400 border-emerald-500/15 bg-emerald-500/[0.02]' 
                : 'text-amber-400 border-amber-500/15 bg-amber-500/[0.02]'
            }`}>
              {item.availability}
            </span>
          )}
        </div>

        {/* Custom Outfits - Items Inside closet and action */}
        {item.type === 'outfit' && item.outfitItems && item.outfitItems.length > 0 && (
          <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl space-y-2">
            <span className="text-[8.5px] font-mono text-white/30 uppercase tracking-widest block font-light">Layering Components:</span>
            <div className="flex flex-col gap-1.5">
              {item.outfitItems.map(garment => (
                <div key={garment.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20 flex-shrink-0" />
                    <span className="text-white/60 font-serif italic">{garment.title}</span>
                  </div>
                  <span className="font-mono text-[9px] text-white/30 uppercase tracking-wide bg-white/[0.03] px-1.5 py-0.5 rounded">
                    {garment.category}
                  </span>
                </div>
              ))}
            </div>

            {onWearOutfit && (
              <button
                onClick={() => onWearOutfit(item.id, item.outfitItems!.map(i => i.title))}
                className="w-full mt-2 cursor-pointer bg-white/[0.03] border border-white/10 hover:bg-white text-white hover:text-black transition-all py-1.5 rounded-lg text-[9.5px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Wear & Log Wardrobe Use
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-white/50 leading-relaxed font-serif font-light italic">
          "{item.description}"
        </p>

        {/* Vibe Chips List */}
        {item.vibeTags && item.vibeTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.vibeTags.map(tag => (
              <span key={tag} className="text-[8px] font-mono tracking-wider text-white/20 uppercase bg-white/[0.01] border border-white/[0.03] px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Dynamic Social Connection Coordinates */}
        {item.storeType !== 'LOCAL_BOUTIQUE' && (item.instagramUrl || item.whatsAppNumber || item.websiteLink) && (
          <div className="flex flex-wrap gap-2 pt-2.5 mt-1 border-t border-white/[0.04] text-[8.5px] font-mono uppercase tracking-wider text-neutral-300">
            {item.instagramUrl && (
              <a 
                href={`https://instagram.com/${item.instagramUrl.replace('@','')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 text-white/40 hover:text-white transition-colors bg-white/[0.02] border border-white/5 py-1 px-2 rounded-lg"
              >
                <Instagram className="w-3 h-3 text-white/30" />
                <span>Instagram: {item.instagramUrl}</span>
              </a>
            )}
            {item.whatsAppNumber && (
              <a 
                href={`https://wa.me/${item.whatsAppNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 text-white/40 hover:text-white transition-colors bg-white/[0.02] border border-white/5 py-1 px-2 rounded-lg"
              >
                <Phone className="w-3 h-3 text-white/30" />
                <span>WhatsApp: Message</span>
              </a>
            )}
            {item.websiteLink && (
              <a 
                href={item.websiteLink.startsWith('http') ? item.websiteLink : `https://${item.websiteLink}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 text-[#dfd7c2] hover:text-white transition-colors bg-white/[0.02] border border-[#dfd7c2]/10 py-1 px-2 rounded-lg font-bold"
              >
                <Globe className="w-3 h-3 text-[#dfd7c2]/50" />
                <span>Visit Store Website</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* 4. Interaction Panel */}
      <div className="flex justify-between items-center border-t border-white/5 pt-4">
        {/* Social Feed Actions */}
        <div className="flex items-center gap-6">
          {/* Like */}
          <button 
            onClick={() => onLike(item.id)}
            className="flex items-center gap-1.5 text-white/40 hover:text-rose-400 transition-colors cursor-pointer group/like"
          >
            <Heart className={`w-4 h-4 ${item.hasLiked ? 'text-rose-500 fill-rose-500' : 'text-current group-hover/like:scale-110 transition-transform'}`} />
            <span className="text-xs font-mono">{item.likesCount}</span>
          </button>
          
          {/* Bookmark */}
          <button 
            onClick={() => onBookmark(item.id)}
            className="flex items-center gap-1.5 text-white/40 hover:text-amber-400 transition-colors cursor-pointer group/book"
          >
            <Bookmark className={`w-4 h-4 ${item.hasBookmarked ? 'text-amber-500 fill-amber-500' : 'text-current group-hover/book:scale-110 transition-transform'}`} />
            <span className="text-xs font-mono">{item.bookmarksCount}</span>
          </button>

          {/* Share */}
          <button 
            onClick={handleShareClick}
            className="flex items-center gap-1.5 text-white/40 hover:text-cyan-400 transition-colors cursor-pointer group/share relative"
          >
            <Share2 className="w-4 h-4 text-current group-hover/share:scale-110 transition-transform" />
            <span className="text-xs font-mono">Share</span>
            <AnimatePresence>
              {shareFeedback && (
                <motion.span 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -24, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute left-1/2 transform -translate-x-1/2 bg-cyan-400 text-black text-[8px] font-mono leading-none py-1 px-1.5 rounded uppercase font-semibold tracking-wider whitespace-nowrap shadow-md z-10"
                >
                  Link Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Marketplace Actions */}
        {(item.type === 'shop_product' || item.type === 'budget_pick') ? (
          <div className="flex items-center gap-2">
            {/* Save to Closet */}
            <button
              onClick={handleSaveToCloset}
              disabled={isSaved}
              className={`border px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer rounded-lg flex items-center gap-1 ${
                isSaved 
                  ? 'border-emerald-500/35 text-emerald-400 bg-emerald-500/[0.02]' 
                  : 'border-white/5 text-white/50 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Saved
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" /> Save to Closet
                </>
              )}
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="bg-white text-black hover:bg-neutral-200 px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-1 cursor-pointer rounded-lg shadow-sm"
            >
              <ShoppingBag className="w-3 h-3" /> Buy Now
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Save AI Style to Closet */}
            <button
              onClick={handleSaveToCloset}
              disabled={isSaved}
              className={`border px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer rounded-lg flex items-center gap-1 ${
                isSaved 
                  ? 'border-emerald-500/35 text-emerald-400 bg-emerald-500/[0.02]' 
                  : 'border-white/5 text-white/50 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Saved
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" /> Save to Closet
                </>
              )}
            </button>

            {/* Try Style (Trigger AI Fit) */}
            <button
              onClick={startTryon}
              className="border border-white/5 text-amber-300 hover:text-amber-200 hover:bg-white/[0.02] px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider font-medium transition-all flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
            >
              <Sparkle className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" /> Try Style
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
