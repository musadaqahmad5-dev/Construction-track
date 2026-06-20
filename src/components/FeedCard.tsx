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
  AlertCircle
} from 'lucide-react';
import { FeedItem } from '../features/feed/feedTypes';
import { ImageWithFade } from './AIStyleHub';

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
  
  // Controlled 3-step Try On system states
  const [selectedOutfitUrl, setSelectedOutfitUrl] = useState<string | null>(null);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null);
  const [selectedAvatarName, setSelectedAvatarName] = useState<string | null>(null);
  const [tryOnProcessingPhase, setTryOnProcessingPhase] = useState<number>(1);
  const [isProcessingFit, setIsProcessingFit] = useState(false);
  const [simulateAIError, setSimulateAIError] = useState(false);
  const [tryonError, setTryonError] = useState<string | null>(null);

  // Preset model options
  const PRESET_MODELS = [
    { id: 'm1', name: 'Marcus (Tailored Classic)', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&auto=format&fit=crop' },
    { id: 'm2', name: 'Zoe (Minimalist Base)', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop' },
    { id: 'm3', name: 'Noor (Editorial Fit)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
  ];

  // Checkout simulator state
  const [showCheckout, setShowCheckout] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const startTryon = () => {
    setSelectedOutfitUrl(item.imageUrl);
    setSelectedAvatarUrl(null);
    setSelectedAvatarName(null);
    setTryonError(null);
    setIsProcessingFit(false);
    setSimulateAIError(false);
    setIsPlayingTryon(true);
    setTryOnProcessingPhase(1);
    setTryonStep(1); // Set to Step 1 (Select Outfit) on initialization
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
    // CRITICAL INPUT VALIDATION
    if (!selectedOutfitUrl || !selectedAvatarUrl) {
      console.warn("[Try On] Validation failed: Please complete selected outfit and body reference before processing.");
      setTryonError("Upload a photo or select a model to try on");
      return;
    }

    setTryonError(null);
    setIsProcessingFit(true);
    setTryOnProcessingPhase(1);

    console.log("[Try On] Commencing physical coordinate triangulation...");

    setTimeout(() => {
      setTryOnProcessingPhase(2);
      console.log("[Try On] Aligning patterns to user silhouette...");
    }, 1000);

    setTimeout(() => {
      setTryOnProcessingPhase(3);
      console.log("[Try On] Synthesizing material reflections...");
    }, 2000);

    setTimeout(() => {
      setIsProcessingFit(false);
      setTryonStep(4); // Outcome Screen
      console.log("[Try On] Completed rendering pipeline. Error state simulation: " + simulateAIError);
    }, 3200);
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
    setShowCheckout(true);
    setCheckoutComplete(false);
  };

  const confirmPurchase = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      setTimeout(() => {
        setShowCheckout(false);
      }, 1800);
    }, 1200);
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
                
                <div className="space-y-1">
                  <span className="text-[8px] font-mono tracking-widest text-[#9c9c9c] uppercase block animate-pulse">Running Neural Fitting Model</span>
                  {tryOnProcessingPhase === 1 && (
                    <p className="text-sm font-sans text-neutral-200">Triangulating body silhouette coordinates...</p>
                  )}
                  {tryOnProcessingPhase === 2 && (
                    <p className="text-sm font-sans text-neutral-200">Aligning pattern drapes with body structure...</p>
                  )}
                  {tryOnProcessingPhase === 3 && (
                    <p className="text-sm font-sans text-neutral-200 animate-pulse text-amber-300">Evaluating shadows and fabric surface layers...</p>
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
                        <Sparkle className="w-3.5 h-3.5 animate-pulse text-amber-600 fill-amber-600" />
                        <span>Synthesize AI Fit</span>
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
                            AI Processing Failed
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
                            <span className="text-[7.5px] font-mono uppercase text-rose-300 tracking-wider">Prisinte original outfit asset (No distortion)</span>
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
                      /* SUCCESSFUL OUTCOME LAYOUT */
                      <div className="space-y-4">
                        <div className="space-y-1 text-center">
                          <span className="inline-block text-[8px] font-mono text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest leading-none">
                            Fitting Successful
                          </span>
                          <h4 className="font-serif text-md text-white font-light font-medium">Generative Fit Verified</h4>
                          <p className="text-xs text-white/45 font-light">calibrated sizing results based on selected modeling grid.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 items-center">
                          <div className="aspect-[3/4] relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
                            <img src={selectedOutfitUrl || item.imageUrl} alt="try-on result" className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 text-[7px] font-mono uppercase tracking-wider text-emerald-300">
                              Artisan
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-1">
                              <span className="text-[8px] font-mono tracking-widest text-[#9c9c9c] uppercase block">Drape Fit Evaluation</span>
                              <p className="text-lg font-serif text-white italic font-bold">96% Accuracy</p>
                            </div>
                            <div className="space-y-1 text-left">
                              <p className="text-[9px] font-mono text-white/60 tracking-tight uppercase">Calibrated Model:</p>
                              <p className="text-[10px] font-sans text-neutral-300 leading-none pb-1">{selectedAvatarName || "Marcus (Classic)"}</p>
                              <p className="text-xs text-white/50 italic font-serif leading-snug pt-1">
                                "Structured neatly at the shoulder contours and seam limits."
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setTryonStep(3);
                          setTryonError(null);
                        }}
                        className="w-1/3 bg-white/[0.05] text-white hover:bg-white/10 transition-all font-mono text-[9px] uppercase py-2 rounded-lg cursor-pointer"
                      >
                        Recalibrate
                      </button>
                      <button
                        onClick={() => setIsPlayingTryon(false)}
                        className="flex-1 bg-white text-black font-mono text-xs uppercase hover:bg-neutral-200 transition-all font-semibold py-2 rounded-lg cursor-pointer flex items-center justify-center"
                      >
                        <span>[ Done ]</span>
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
            className="absolute inset-0 bg-black/95 z-30 flex flex-col justify-center p-6 space-y-4"
          >
            {checkoutComplete ? (
              <div className="text-center p-4 space-y-3 animate-fade-in">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="font-serif text-lg text-white font-light">Order Placed Successfully</h4>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Confirming with boutique partners...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">SECURE CHECKOUT</span>
                  <h4 className="font-serif text-md text-white font-light">{item.title}</h4>
                  <p className="text-xs text-white/40 font-mono tracking-tight mt-0.5">{item.shopName}</p>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-white/50">
                    <span>Retail Price:</span>
                    <span>${item.price}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>VAT & Taxes:</span>
                    <span>$0.00 (Standard Promo)</span>
                  </div>
                  <div className="flex justify-between text-white/50 border-b border-white/5 pb-2">
                    <span>Boutique Courier:</span>
                    <span className="text-amber-400">FREE Shipping</span>
                  </div>
                  <div className="flex justify-between text-white font-medium pt-1">
                    <span>Total Cost:</span>
                    <span>${item.price}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    disabled={isCheckingOut}
                    onClick={confirmPurchase}
                    className="w-full bg-white text-black font-mono text-xs uppercase hover:bg-neutral-200 transition-all font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isCheckingOut ? (
                      <span className="animate-pulse">Authorizing Vault...</span>
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" /> Confirm Purchase
                      </>
                    )}
                  </button>
                  <button
                    disabled={isCheckingOut}
                    onClick={() => setShowCheckout(false)}
                    className="w-full text-white/40 hover:text-white transition-colors text-center font-mono text-[9px] uppercase tracking-widest block py-1 cursor-pointer"
                  >
                    [ Cancel ]
                  </button>
                </div>
              </div>
            )}
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
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/15 bg-neutral-900 flex-shrink-0">
              <img src={item.shopAvatarUrl} alt={item.shopName} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-sans text-white/90 font-medium tracking-wide leading-none">{item.shopName}</p>
              <div className="flex items-center gap-2 text-[8.5px] font-mono text-white/30 uppercase tracking-tight mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{item.location}</span>
                </div>
                {item.price !== undefined && (
                  <>
                    <span className="text-white/10">|</span>
                    <span className="text-[#dfd7c2] font-semibold font-mono">${item.price}</span>
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
        </div>

        {/* Marketplace Actions */}
        {(item.type === 'shop_product' || item.type === 'budget_pick') && (
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
        )}
      </div>
    </motion.div>
  );
};
