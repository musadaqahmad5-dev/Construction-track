import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, Heart, ShoppingBag, Shirt, Star, Check, Award, ShieldAlert, MessageSquare, Mail } from 'lucide-react';
import { WardrobeItem } from '../../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  useThemeIntelligence, 
  ThemeCoatRenderer, 
  FoundationInteractionWrapper 
} from '../../engine';

interface ProductDetailScreenProps {
  product: {
    id: string;
    brand?: string;
    shopName?: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    category: 'Casual' | 'Formal' | 'Sportswear' | 'Outerwear' | 'Accessories';
    availability: 'In Stock' | 'Limited' | 'Out of Stock';
    rating?: string;
    reviews?: number;
    vibeTags?: string[];
  };
  onBack: () => void;
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onNavigateToTab?: (tab: string) => void;
  userWardrobe: WardrobeItem[];
  user?: any;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onBack,
  onAddGarment,
  onNavigateToTab,
  userWardrobe,
  user
}) => {
  let themeCtx: ReturnType<typeof useThemeIntelligence> | null = null;
  try {
    themeCtx = useThemeIntelligence();
  } catch {
    themeCtx = null;
  }

  const themeDNA = themeCtx?.themeDNA;
  const coatDNA = themeCtx?.coatDNA;
  const sequenceId = themeCtx?.sequenceId;

  const [isLiked, setIsLiked] = useState(false);
  const [addedToCloset, setAddedToCloset] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'matching' | 'reviews'>('details');
  
  const [reviewsList, setReviewsList] = useState([
    { id: 1, author: 'Elena R.', rating: 5, date: '2 days ago', text: 'Stunning texture! The fabric weight is exactly what I needed for autumn layers.' },
    { id: 2, author: 'Marcus K.', rating: 4, date: '1 week ago', text: 'Excellent drape. Fits slightly relaxed but holds its shape exceptionally well.' }
  ]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const compatibilityScore = React.useMemo(() => {
    if (userWardrobe.length === 0) return 72;
    
    let score = 75;
    const descLower = product.description.toLowerCase();
    const titleLower = product.title.toLowerCase();

    userWardrobe.forEach(item => {
      const itemTitle = item.title.toLowerCase();
      if (item.category === 'Outerwear' && product.category === 'Casual') score += 4;
      if (item.category === 'Casual' && product.category === 'Outerwear') score += 5;
      if (itemTitle.includes('black') && (titleLower.includes('white') || descLower.includes('contrast'))) score += 6;
      if (itemTitle.includes('wool') && descLower.includes('mohair')) score += 5;
      if (itemTitle.includes('denim') && descLower.includes('relaxed')) score += 3;
    });

    return Math.min(score, 99);
  }, [product, userWardrobe]);

  const compatibleItems = React.useMemo(() => {
    return userWardrobe.filter(item => {
      const titleLower = item.title.toLowerCase();
      const catLower = item.category.toLowerCase();
      const pCatLower = product.category.toLowerCase();

      if (pCatLower === 'outerwear' && (catLower === 'casual' || catLower === 'formal')) return true;
      if (pCatLower === 'accessories' || catLower === 'accessories') return true;
      if (titleLower.includes('black') || titleLower.includes('slate') || titleLower.includes('wool')) return true;
      return false;
    }).slice(0, 3);
  }, [product, userWardrobe]);

  const handleAddToCloset = async () => {
    if (onAddGarment) {
      await onAddGarment(
        product.title, 
        product.description || `Handmade selection from ${product.brand || product.shopName || 'Boutique'}.`, 
        product.category, 
        { imageUrl: product.imageUrl, price: product.price }
      );
      setAddedToCloset(true);

      const userUid = user?.uid || 'simulated-guest-user';
      const userEmail = user?.email || 'musadaqahmad5@gmail.com';
      const userName = user?.displayName || 'Guest Sartorialist';

      try {
        await addDoc(collection(db, 'orders'), {
          userId: userUid,
          userEmail: userEmail,
          userName: userName,
          productId: product.id || 'custom-prod-id',
          productTitle: product.title,
          productPrice: product.price,
          productImageUrl: product.imageUrl || '',
          shopName: product.brand || product.shopName || 'Curated Boutique',
          status: 'Confirmed',
          timestamp: serverTimestamp()
        });

        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
          detail: `Order Confirmed! Receipt & verification dispatched to ${userEmail} via Google/Gmail.` 
        }));
      } catch (err) {
        console.error("Failed to register database order:", err);
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
          detail: `Acquired ${product.title} in local Closet!` 
        }));
      }

      setTimeout(() => setAddedToCloset(false), 3000);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      id: Date.now(),
      author: 'You (Sartorialist)',
      rating: newReviewRating,
      date: 'Just now',
      text: newReviewText.trim()
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2000);
  };

  const renderContent = () => (
    <div className="w-full min-h-screen bg-[#05050a] text-zinc-100 p-4 sm:p-6 lg:p-8 selection:bg-transparent">
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <FoundationInteractionWrapper themeDNA={themeDNA}>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors cursor-pointer group"
            id="product-detail-back-btn"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>[ Back to Boutique ]</span>
          </button>
        </FoundationInteractionWrapper>

        <div className="flex items-center gap-2">
          {sequenceId && (
            <span className="text-[9px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 hidden lg:inline-block">
              SEQ: {sequenceId.substring(0, 10)}...
            </span>
          )}
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase">
            {product.availability}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 bg-[#09090f] shadow-2xl group">
            <img src={product.imageUrl || null} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 pointer-events-none">
              {product.vibeTags?.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-[9px] font-mono tracking-wider text-white border border-white/10 rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>

            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-md hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </FoundationInteractionWrapper>
          </div>
          
          <div className="text-center">
            <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest block">
              High fidelity 360° tactile representation
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-[0.25em] block">
              {product.brand || product.shopName || 'ATELIER LUXE'}
            </span>
            <h1 className="font-serif font-light text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1">
                <span className="text-white font-sans font-extrabold text-2xl">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-zinc-500 line-through font-mono text-sm ml-2">${product.originalPrice}</span>
                )}
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-white font-bold">{product.rating || '4.8'}</span>
                <span>({product.reviews || 24} ratings)</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/20 to-purple-950/20 border border-violet-500/10 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-center select-none">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold">AI Wardrobe Coherence</span>
              </div>
              <span className="text-xs font-mono font-bold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded">
                Match {compatibilityScore}%
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Our intelligent fashion core analyzed your wardrobe. This piece has a <strong className="text-white">{compatibilityScore}% compatibility rating</strong>, meaning it fits perfectly with your Nordic/minimalist silhouette alignment and expands your coordinates by up to 12 new options.
            </p>
          </div>

          <div className="border-b border-white/5 flex gap-4">
            {[
              { id: 'details', label: 'Tactile Details' },
              { id: 'matching', label: 'Matching Suggestions' },
              { id: 'reviews', label: `Reviews (${reviewsList.length})` }
            ].map(tab => (
              <FoundationInteractionWrapper key={tab.id} themeDNA={themeDNA}>
                <button
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 text-[11px] font-mono uppercase tracking-wider transition-all border-b-2 cursor-pointer relative ${
                    activeTab === tab.id 
                      ? 'border-violet-500 text-white font-bold' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              </FoundationInteractionWrapper>
            ))}
          </div>

          <div className="min-h-[160px]">
            {activeTab === 'details' && (
              <div className="space-y-4 animate-fade-in text-xs text-zinc-400 leading-relaxed">
                <p>{product.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-zinc-500">Fabric Composition</span>
                    <p className="text-white font-medium">85% Organic Cotton, 15% Brushed Mohair Silk</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-zinc-500">Weight & Weave</span>
                    <p className="text-white font-medium">Heavyweight 320g, Interlock weave</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-zinc-500">Garment Origin</span>
                    <p className="text-white font-medium">Atelier Milan, Italy (Local Craft)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-zinc-500">Care Directives</span>
                    <p className="text-white font-medium">Gentle cold wash, Dry flat, Do not bleach</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'matching' && (
              <div className="space-y-4 animate-fade-in">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">
                  COORDINATING PIECES IN YOUR CLOSET:
                </span>
                {compatibleItems.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No compatible pieces discovered. Add items to your Closet to unlock coordinate maps.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {compatibleItems.map(item => (
                      <FoundationInteractionWrapper key={item.id} themeDNA={themeDNA}>
                        <div 
                          className="p-2.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-2 hover:border-violet-500/20 transition-all cursor-pointer"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
                              detail: `Coordinating map loaded with ${item.title}` 
                            }));
                          }}
                        >
                          <div className="aspect-[4/5] overflow-hidden bg-neutral-900 rounded-lg">
                            <img src={item.imageUrl || null} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="block text-[10px] font-mono text-white/80 truncate">{item.title}</span>
                        </div>
                      </FoundationInteractionWrapper>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 animate-fade-in max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                <form onSubmit={handleAddReview} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
                  <span className="text-[9px] font-mono uppercase text-zinc-400 block font-bold">Write a tactile feedback review</span>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FoundationInteractionWrapper key={star} themeDNA={themeDNA}>
                          <button
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${newReviewRating >= star ? 'fill-amber-400' : ''}`} />
                          </button>
                        </FoundationInteractionWrapper>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">({newReviewRating}/5 Rating)</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Comment on comfort, knit quality, styling compatibility..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="flex-1 bg-white/[0.02] border border-white/10 px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-lg transition-colors"
                    />
                    <FoundationInteractionWrapper themeDNA={themeDNA}>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors"
                      >
                        Post
                      </button>
                    </FoundationInteractionWrapper>
                  </div>
                  {reviewSubmitted && (
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block">✓ Review posted successfully!</span>
                  )}
                </form>

                <div className="space-y-3">
                  {reviewsList.map(rev => (
                    <div key={rev.id} className="p-3 border border-white/[0.03] rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-300 font-bold">{rev.author}</span>
                        <span className="text-zinc-500">{rev.date}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, sIdx) => (
                          <Star key={sIdx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal">{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-semibold block">Merchant Hub Connect</span>
              <span className="text-[8.5px] px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                {(product as any).storeType === 'LOCAL_BOUTIQUE' && 'Local Boutique'}
                {(product as any).storeType === 'ONLINE_STORE' && 'Online Store'}
                {(product as any).storeType === 'HYBRID_BRAND' && 'Hybrid Brand'}
                {!(product as any).storeType && 'Verified Curated Showroom'}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase text-zinc-500 block">Atelier/Seller Channel</span>
                <span className="text-white font-medium">{product.brand || product.shopName || 'LookVision Curated'}</span>
              </div>

              {(product as any).shopLocation && (
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Physical Location</span>
                  <span className="text-white font-medium">📍 {(product as any).shopLocation}</span>
                </div>
              )}
            </div>

            {((product as any).instagramUrl || (product as any).whatsAppNumber || (product as any).websiteLink || (product as any).storeType) && (
              <div className="pt-2 flex flex-wrap gap-2.5">
                {(product as any).instagramUrl && (
                  <FoundationInteractionWrapper themeDNA={themeDNA}>
                    <a
                      href={(product as any).instagramUrl.startsWith('http') ? (product as any).instagramUrl : `https://instagram.com/${(product as any).instagramUrl.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-zinc-950/40 border border-white/5 text-[10px] font-mono text-zinc-300 hover:text-white hover:border-violet-500/20 hover:bg-violet-500/5 transition-colors flex items-center gap-1.5"
                    >
                      📸 @{(product as any).instagramUrl.replace('https://instagram.com/', '').replace('http://instagram.com/', '').replace('@', '')}
                    </a>
                  </FoundationInteractionWrapper>
                )}
                {(product as any).whatsAppNumber && (
                  <FoundationInteractionWrapper themeDNA={themeDNA}>
                    <a
                      href={`https://wa.me/${(product as any).whatsAppNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-zinc-950/40 border border-white/5 text-[10px] font-mono text-zinc-300 hover:text-white hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-colors flex items-center gap-1.5"
                    >
                      💬 WhatsApp Chat
                    </a>
                  </FoundationInteractionWrapper>
                )}
                {(product as any).websiteLink && (
                  <FoundationInteractionWrapper themeDNA={themeDNA}>
                    <a
                      href={(product as any).websiteLink.startsWith('http') ? (product as any).websiteLink : `https://${(product as any).websiteLink}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-zinc-950/40 border border-white/5 text-[10px] font-mono text-zinc-300 hover:text-white hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-colors flex items-center gap-1.5"
                    >
                      🔗 Visit Website
                    </a>
                  </FoundationInteractionWrapper>
                )}
                {!(product as any).instagramUrl && !(product as any).whatsAppNumber && !(product as any).websiteLink && (
                  <span className="text-[10px] font-mono text-zinc-500 italic">
                    📦 Integrated logistics and direct checkouts managed securely by LookVision.
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                onClick={handleAddToCloset}
                disabled={addedToCloset}
                className={`py-4 px-6 rounded-xl font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] border font-bold ${
                  addedToCloset 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black border-transparent shadow-lg shadow-emerald-900/10'
                }`}
              >
                {addedToCloset ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>In Your Closet</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Acquire Piece</span>
                  </>
                )}
              </button>
            </FoundationInteractionWrapper>

            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                onClick={() => {
                  if (onNavigateToTab) {
                    onNavigateToTab('OUTFITS');
                    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
                      detail: `Synthesizing try-on environment with ${product.title}` 
                    }));
                  }
                }}
                className="py-4 px-6 bg-white/[0.02] hover:bg-white/5 border border-white/10 rounded-xl font-mono text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Shirt className="w-4 h-4 text-violet-400" />
                <span>Virtual Try-on</span>
              </button>
            </FoundationInteractionWrapper>
          </div>
        </div>
      </div>
    </div>
  );

  if (coatDNA) {
    return (
      <ThemeCoatRenderer coatDNA={coatDNA}>
        {renderContent()}
      </ThemeCoatRenderer>
    );
  }

  return renderContent();
};
