import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Trash2, Bookmark, Check, Share2, Sparkles, Tag, Layers, Lock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface LightboxDetail {
  id?: string;
  imageUrl: string;
  videoUrl?: string;
  isVideo?: boolean;
  title?: string;
  description?: string;
  category?: string;
  creatorName?: string;
  creatorAvatar?: string;
  aspectRatio?: string;
  onDelete?: (id: string) => void;
  onSave?: (imageUrl: string) => void;
  isSaved?: boolean;
  isPrivate?: boolean;
  isOwnClosetItem?: boolean;
}

export const ImageLightboxModal: React.FC = () => {
  const [activeItem, setActiveItem] = useState<LightboxDetail | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isSavedLocal, setIsSavedLocal] = useState<boolean>(false);
  const [savingState, setSavingState] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [isItemInCloset, setIsItemInCloset] = useState<boolean>(false);
  const [itemIsPrivate, setItemIsPrivate] = useState<boolean>(true);

  useEffect(() => {
    const handleOpenLightbox = (e: CustomEvent<LightboxDetail>) => {
      if (e.detail && e.detail.imageUrl) {
        setActiveItem(e.detail);
        setScale(1);
        setRotation(0);
        setIsSavedLocal(!!e.detail.isSaved);
        setConfirmDelete(false);

        // Check if this item is in user's personal wardrobe
        let foundInCloset = false;
        let privState = e.detail.isPrivate !== false;

        try {
          const stored = localStorage.getItem('local_wardrobe_items');
          if (stored) {
            const items = JSON.parse(stored);
            const match = items.find((x: any) => 
              (x.id && e.detail.id && x.id === e.detail.id) || 
              (x.imageUrl && x.imageUrl === e.detail.imageUrl)
            );
            if (match) {
              foundInCloset = true;
              privState = match.isPrivate !== false;
            }
          }
        } catch (err) {}

        setIsItemInCloset(foundInCloset || !!e.detail.isOwnClosetItem);
        setItemIsPrivate(privState);
      }
    };

    window.addEventListener('lookvision_open_lightbox' as any, handleOpenLightbox as any);
    return () => {
      window.removeEventListener('lookvision_open_lightbox' as any, handleOpenLightbox as any);
    };
  }, []);

  if (!activeItem) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setScale(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = activeItem.imageUrl;
    a.download = `lookvision-${activeItem.id || 'export'}-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ Image downloaded in full high resolution!'
    }));
  };

  const handleTogglePrivacyInLightbox = () => {
    const newPrivateState = !itemIsPrivate;
    setItemIsPrivate(newPrivateState);

    try {
      const stored = localStorage.getItem('local_wardrobe_items');
      if (stored) {
        const items = JSON.parse(stored);
        const updated = items.map((x: any) => {
          if ((x.id && x.id === activeItem.id) || (x.imageUrl && x.imageUrl === activeItem.imageUrl)) {
            return { ...x, isPrivate: newPrivateState, isPublic: !newPrivateState };
          }
          return x;
        });
        localStorage.setItem('local_wardrobe_items', JSON.stringify(updated));
      }
    } catch (err) {}

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: newPrivateState 
        ? '🔒 Item is now PRIVATE in My Closet!' 
        : '🌐 Item is now PUBLIC in Community World Gallery!'
    }));
  };

  const handleSaveDeduplicated = () => {
    if (savingState || isSavedLocal || isItemInCloset) {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '⚠️ Image is already saved in your wardrobe collection!'
      }));
      return;
    }

    setSavingState(true);
    
    // Check if item URL already exists in local wardrobe cache
    try {
      const stored = localStorage.getItem('local_wardrobe_items');
      if (stored) {
        const items = JSON.parse(stored);
        const duplicate = items.find((x: any) => x.imageUrl === activeItem.imageUrl || x.title === activeItem.title);
        if (duplicate) {
          setIsSavedLocal(true);
          setIsItemInCloset(true);
          setSavingState(false);
          window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
            detail: '⚠️ This exact image is already saved in your collection!'
          }));
          return;
        }
      }
    } catch (e) {
      console.warn("Deduplication check error:", e);
    }

    // Perform save
    if (activeItem.onSave) {
      activeItem.onSave(activeItem.imageUrl);
    } else {
      // Default fallback save to local wardrobe
      const newGarment = {
        id: activeItem.id || `gar-saved-${Date.now()}`,
        title: activeItem.title || 'Saved AI Fashion Look',
        description: activeItem.description || 'Saved from Lightbox Full View',
        category: activeItem.category || 'Outerwear',
        imageUrl: activeItem.imageUrl,
        isPrivate: true,
        isPublic: false,
        userId: 'guest-sartorialist-user-100',
        createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
      };
      try {
        const stored = localStorage.getItem('local_wardrobe_items');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newGarment);
        localStorage.setItem('local_wardrobe_items', JSON.stringify(list));
      } catch (err) {
        console.error("Save to local wardrobe error:", err);
      }
    }

    setIsSavedLocal(true);
    setIsItemInCloset(true);
    setItemIsPrivate(true);
    setSavingState(false);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ Saved safely to your AI Wardrobe Collection (My Closet & World)!'
    }));
  };

  const handleDeleteImage = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    if (activeItem.onDelete && activeItem.id) {
      activeItem.onDelete(activeItem.id);
    } else {
      // Local storage cleanup fallback
      try {
        const stored = localStorage.getItem('local_wardrobe_items');
        if (stored) {
          const list = JSON.parse(stored).filter((x: any) => x.imageUrl !== activeItem.imageUrl && x.id !== activeItem.id);
          localStorage.setItem('local_wardrobe_items', JSON.stringify(list));
        }
      } catch (e) {
        console.error("Delete from storage error:", e);
      }
    }

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '🗑️ Image removed successfully from your library!'
    }));
    setActiveItem(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8 select-none">
        {/* Background Backdrop Click to Close */}
        <div 
          className="absolute inset-0 z-0 cursor-zoom-out" 
          onClick={() => setActiveItem(null)} 
        />

        {/* Top Floating Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-auto">
          {/* Metadata Title Badge */}
          <div className="flex items-center gap-3 bg-[#07070c]/90 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md shadow-2xl">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <div>
              <h3 className="text-xs font-semibold text-white tracking-wide truncate max-w-[200px] sm:max-w-md">
                {activeItem.title || 'AI Fashion Render Lightbox'}
              </h3>
              {activeItem.category && (
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
                  {activeItem.category}
                </span>
              )}
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomIn}
              className="p-2.5 bg-[#07070c]/80 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2.5 bg-[#07070c]/80 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-2.5 bg-[#07070c]/80 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Rotate Image"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 bg-[#07070c]/80 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Download Full Image"
            >
              <Download className="w-4 h-4" />
            </button>
            
            {/* If item belongs to user's My Closet & World, show Public/Private Visibility Toggle. Otherwise show Save to Closet! */}
            {isItemInCloset ? (
              <button
                type="button"
                onClick={handleTogglePrivacyInLightbox}
                className={`px-3.5 py-2.5 rounded-xl border font-mono text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  itemIsPrivate
                    ? 'bg-zinc-800/90 border-white/10 text-zinc-300 hover:text-white hover:border-violet-500/40'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                }`}
                title={itemIsPrivate ? "Click to publish to Public World Gallery" : "Click to make Private in My Closet"}
              >
                {itemIsPrivate ? (
                  <>
                    <Lock className="w-4 h-4 text-zinc-400" />
                    <span>Private (In Closet)</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Public (In World)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSaveDeduplicated}
                disabled={isSavedLocal || savingState}
                className={`px-3.5 py-2.5 rounded-xl border font-mono text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSavedLocal 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-not-allowed'
                    : 'bg-violet-600/20 hover:bg-violet-600/40 border-violet-500/30 text-violet-200 hover:text-white'
                }`}
                title={isSavedLocal ? "Already Saved in Wardrobe" : "Save Image to My Closet & World"}
              >
                {isSavedLocal ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Saved in Closet</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-violet-400" />
                    <span>Save to My Closet & World</span>
                  </>
                )}
              </button>
            )}

            {/* Remove / Delete Image Option */}
            <button
              onClick={handleDeleteImage}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                confirmDelete 
                  ? 'bg-rose-600 border-rose-500 text-white font-mono text-xs px-3' 
                  : 'bg-[#07070c]/80 hover:bg-rose-500/20 border-white/10 text-zinc-400 hover:text-rose-400'
              }`}
              title="Remove / Delete Image"
            >
              <Trash2 className="w-4 h-4" />
              {confirmDelete && <span>Confirm Delete?</span>}
            </button>

            {/* Close Lightbox */}
            <button
              onClick={() => setActiveItem(null)}
              className="p-2.5 bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 text-rose-300 rounded-xl transition-all cursor-pointer ml-2"
              title="Close Full View (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Displayed Full-Scale Media Container (Image or Video) */}
        <div className="relative z-10 max-w-full max-h-full flex items-center justify-center p-4">
          {(() => {
            const mediaUrl = activeItem.videoUrl || activeItem.imageUrl || '';
            const isVideoMedia = activeItem.isVideo || 
              (activeItem.videoUrl && !activeItem.imageUrl) ||
              mediaUrl.toLowerCase().includes('.mp4') || 
              mediaUrl.toLowerCase().includes('.webm') || 
              mediaUrl.toLowerCase().includes('video');

            if (isVideoMedia) {
              return (
                <video
                  src={mediaUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  style={{
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/10 pointer-events-auto"
                />
              );
            }

            return (
              <motion.img
                src={mediaUrl}
                alt={activeItem.title || "Full Resolution View"}
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/10 pointer-events-auto select-none cursor-pointer"
                loading="eager"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop";
                }}
              />
            );
          })()}
        </div>

        {/* Bottom Details Drawer */}
        {activeItem.description && (
          <div className="absolute bottom-4 left-4 right-4 z-20 max-w-xl mx-auto bg-[#07070c]/90 border border-white/10 p-4 rounded-2xl backdrop-blur-md shadow-2xl text-left pointer-events-auto">
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              {activeItem.description}
            </p>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
