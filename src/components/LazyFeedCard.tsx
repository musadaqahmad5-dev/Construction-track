import React, { useState, useEffect, useRef, Suspense } from 'react';
import { FeedItem } from '../features/feed/feedTypes';

// Dynamically import FeedCard to code split major modules like try-on and checkout embedded inside it
const FeedCard = React.lazy(() => 
  import('./FeedCard').then(m => ({ default: m.FeedCard }))
);

interface LazyFeedCardProps {
  item: FeedItem;
  onLike: (itemId: string) => void;
  onBookmark: (itemId: string) => void;
  onSaveToCloset: (title: string, description: string, category: string, imageUrl: string, price?: number) => void;
  onWearOutfit?: (outfitId: string, clothesNames: string[]) => void;
}

export const LazyFeedCard: React.FC<LazyFeedCardProps> = React.memo(({ 
  item, 
  onLike, 
  onBookmark, 
  onSaveToCloset,
  onWearOutfit 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '150px', // Pre-load 150px before entering viewport
        threshold: 0.01
      }
    );

    const el = containerRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-[350px] transition-all">
      {isVisible ? (
        <Suspense fallback={<FeedSkeleton />}>
          <FeedCard
            item={item}
            onLike={onLike}
            onBookmark={onBookmark}
            onSaveToCloset={onSaveToCloset}
            onWearOutfit={onWearOutfit}
          />
        </Suspense>
      ) : (
        <FeedSkeleton />
      )}
    </div>
  );
});

// Lightweight beautiful skeleton loader matching the typography, spacing and borders of FeedCard
const FeedSkeleton: React.FC = () => {
  return (
    <div className="bg-[#0b0b0b] border border-white/[0.04] rounded-3xl p-5 space-y-4 animate-pulse">
      {/* Skeleton Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 rounded-full" />
          <div className="space-y-1.5">
            <div className="w-24 h-3 bg-white/10 rounded" />
            <div className="w-16 h-2 bg-white/5 rounded" />
          </div>
        </div>
        <div className="w-16 h-5 bg-white/5 rounded-full" />
      </div>

      {/* Skeleton Main Image Space */}
      <div className="w-full aspect-[3/4] bg-[#070707] rounded-2xl border border-white/5 flex items-center justify-center">
        <div className="w-7 h-7 bg-white/5 rounded-full" />
      </div>

      {/* Skeleton Content */}
      <div className="space-y-2 pt-2">
        <div className="w-1/3 h-4 bg-white/10 rounded" />
        <div className="w-3/4 h-2.5 bg-white/5 rounded" />
        <div className="w-1/2 h-2.5 bg-white/5 rounded" />
      </div>

      {/* Skeleton Controls */}
      <div className="flex justify-between items-center border-t border-white/5 pt-4">
        <div className="flex gap-4">
          <div className="w-8 h-4 bg-white/5 rounded" />
          <div className="w-8 h-4 bg-white/5 rounded" />
        </div>
        <div className="w-14 h-6 bg-white/5 rounded-lg" />
      </div>
    </div>
  );
};

LazyFeedCard.displayName = 'LazyFeedCard';
