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
  Info
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
  
  // Checkout simulator state
  const [showCheckout, setShowCheckout] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const startTryon = () => {
    setIsPlayingTryon(true);
    setTryonStep(1);
    
    // Simulate smart AI draping steps
    setTimeout(() => setTryonStep(2), 1000);
    setTimeout(() => setTryonStep(3), 2000);
    setTimeout(() => setTryonStep(4), 3000);
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
            className="absolute inset-0 bg-black/95 z-30 flex flex-col justify-center items-center p-6 text-center space-y-4"
          >
            <Shirt className="w-10 h-10 text-white/50 animate-bounce" />
            
            {tryonStep === 1 && (
              <div className="space-y-1">
                <p className="text-sm font-sans text-neutral-200">Retrieving camera and mannequin state...</p>
                <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Initializing Canvas Matrix</p>
              </div>
            )}
            {tryonStep === 2 && (
              <div className="space-y-1">
                <p className="text-sm font-sans text-neutral-200">Adapting pattern to user silhouette...</p>
                <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Executing Generative Fitting Grid</p>
              </div>
            )}
            {tryonStep === 3 && (
              <div className="space-y-1 animate-pulse">
                <p className="text-sm font-sans text-amber-400">Rendering lighting and material drape...</p>
                <p className="text-[10px] font-mono text-amber-500/50 tracking-widest uppercase">Draping Satin Overlay</p>
              </div>
            )}
            {tryonStep === 4 && (
              <div className="space-y-2">
                <div className="relative w-28 h-28 mx-auto overflow-hidden rounded-full border border-white/20">
                  <img src={item.imageUrl} alt="try-on-result" className="w-full h-full object-cover grayscale" />
                  <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-8 h-8 text-white filter drop-shadow" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-sans text-emerald-400 font-medium">96% Size Match Confirmed!</p>
                  <p className="text-xs text-white/50 italic font-serif">"Fitted beautifully across the shoulders & drape."</p>
                </div>
                <button
                  onClick={() => setIsPlayingTryon(false)}
                  className="mt-2 px-4 py-1.5 bg-white text-black font-mono text-[10px] uppercase rounded-md tracking-wider cursor-pointer"
                >
                  [ Done ]
                </button>
              </div>
            )}

            {tryonStep < 4 && (
              <div className="w-32 bg-white/5 h-1 rounded-full overflow-hidden mx-auto">
                <div 
                  className="bg-white h-full transition-all duration-1000" 
                  style={{ width: `${tryonStep * 33.3}%` }} 
                />
              </div>
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
