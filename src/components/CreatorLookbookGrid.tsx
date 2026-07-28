import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Eye,
  Shirt,
  Play,
  Volume2,
  VolumeX,
  Tag,
  User,
  Loader2,
  ChevronRight
} from 'lucide-react';

export interface FeedAsset {
  id: string;
  creatorName: string;
  mediaType: 'image' | 'video';
  sourceUrl: string;
  styleTags: string[];
  metricsCount: {
    views: number;
    tryOns: number;
  };
}

interface CreatorLookbookGridProps {
  initialAssets?: FeedAsset[];
  onTryOn3D?: (asset: FeedAsset) => void;
  onFetchMore?: (page: number) => Promise<FeedAsset[]>;
}

const DEFAULT_MOCK_FEED: FeedAsset[] = [
  {
    id: 'feed_1',
    creatorName: 'Aria Vance',
    mediaType: 'video',
    sourceUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-black-outfit-41525-large.mp4',
    styleTags: ['Midnight Velvet', 'Gala Night', 'High Contrast'],
    metricsCount: { views: 14200, tryOns: 380 }
  },
  {
    id: 'feed_2',
    creatorName: 'Kaelen Thorne',
    mediaType: 'image',
    sourceUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    styleTags: ['Cyber Structured', 'Techwear', 'Monochrome'],
    metricsCount: { views: 9800, tryOns: 210 }
  },
  {
    id: 'feed_3',
    creatorName: 'Elena Rostova',
    mediaType: 'image',
    sourceUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
    styleTags: ['Silk Drapes', 'Avant-Garde', 'Fluid'],
    metricsCount: { views: 18500, tryOns: 512 }
  },
  {
    id: 'feed_4',
    creatorName: 'Julian Mercer',
    mediaType: 'video',
    sourceUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-model-wearing-a-coat-in-a-studio-41526-large.mp4',
    styleTags: ['Obsidian Trench', 'Architectural', 'Minimal'],
    metricsCount: { views: 11200, tryOns: 295 }
  },
  {
    id: 'feed_5',
    creatorName: 'Sora Takahashi',
    mediaType: 'image',
    sourceUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    styleTags: ['Footwear Art', 'Carbon Fiber', 'Futuristic'],
    metricsCount: { views: 8400, tryOns: 190 }
  },
  {
    id: 'feed_6',
    creatorName: 'Zara Lin',
    mediaType: 'image',
    sourceUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    styleTags: ['Double-Breasted', 'Velvet Suit', 'Boutique'],
    metricsCount: { views: 15300, tryOns: 410 }
  }
];

export const CreatorLookbookGrid: React.FC<CreatorLookbookGridProps> = ({
  initialAssets = DEFAULT_MOCK_FEED,
  onTryOn3D,
  onFetchMore
}) => {
  const [assets, setAssets] = useState<FeedAsset[]>(initialAssets);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadNextBatch = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      if (onFetchMore) {
        const nextBatch = await onFetchMore(page + 1);
        if (nextBatch && nextBatch.length > 0) {
          setAssets((prev) => [...prev, ...nextBatch]);
          setPage((p) => p + 1);
        } else {
          setHasMore(false);
        }
      } else {
        // Fallback mock pagination generator
        await new Promise((resolve) => setTimeout(resolve, 800));
        const newBatch: FeedAsset[] = DEFAULT_MOCK_FEED.map((item, idx) => ({
          ...item,
          id: `feed_p${page + 1}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          metricsCount: {
            views: item.metricsCount.views + Math.floor(Math.random() * 500),
            tryOns: item.metricsCount.tryOns + Math.floor(Math.random() * 30)
          }
        }));

        setAssets((prev) => [...prev, ...newBatch]);
        setPage((p) => p + 1);
        if (page >= 3) {
          setHasMore(false);
        }
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, onFetchMore, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          loadNextBatch();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => {
      observer.unobserve(sentinel);
    };
  }, [hasMore, isLoadingMore, loadNextBatch]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Community Feed Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-wide">Creator Lookbook Community Feed</h2>
            <p className="text-xs text-zinc-400">Real-time sartorial showcases & 3D virtual try-on assets</p>
          </div>
        </div>
      </div>

      {/* Bento Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <FeedAssetCard key={asset.id} asset={asset} onTryOn3D={onTryOn3D} />
        ))}
      </div>

      {/* Scroll Observer Sentinel Element */}
      <div ref={sentinelRef} className="py-8 flex justify-center items-center">
        {isLoadingMore ? (
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Fetching Sartorial Assets...</span>
          </div>
        ) : !hasMore ? (
          <span className="text-xs text-zinc-500">You have reached the end of the community lookbook feed</span>
        ) : null}
      </div>
    </div>
  );
};

interface FeedAssetCardProps {
  asset: FeedAsset;
  onTryOn3D?: (asset: FeedAsset) => void;
}

const FeedAssetCard: React.FC<FeedAssetCardProps> = ({ asset, onTryOn3D }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const handleMouseEnter = () => {
    if (asset.mediaType === 'video' && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (asset.mediaType === 'video' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-[#07070c] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col justify-between"
    >
      {/* Visual Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        {asset.mediaType === 'video' ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={asset.sourceUrl}
              muted={isMuted}
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Video Play / Mute Overlays */}
            <div className="absolute top-3 right-3 flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="p-3.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-white shadow-xl">
                  <Play className="w-5 h-5 ml-0.5 fill-white" />
                </div>
              </div>
            )}

            {/* Video Tracking Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <img
            src={asset.sourceUrl}
            alt={asset.creatorName}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800';
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-transparent to-transparent opacity-90" />

        {/* Floating Absolute 'Try on in 3D' Shortcut Action Button (Min 44px Hit Target) */}
        <button
          type="button"
          onClick={() => onTryOn3D?.(asset)}
          className="absolute top-3 left-3 min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/30 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 border border-white/20 z-20"
        >
          <Shirt className="w-4 h-4" />
          <span>Try on in 3D</span>
        </button>

        {/* Overlay Creator Info & Tags */}
        <div className="absolute bottom-3 left-3 right-3 space-y-2 z-10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold text-white">{asset.creatorName}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {asset.styleTags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 text-[10px] bg-slate-950/80 backdrop-blur-md border border-white/10 text-zinc-300 px-2 py-0.5 rounded-md"
              >
                <Tag className="w-2.5 h-2.5 text-indigo-400" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Metrics */}
      <div className="p-3.5 bg-[#07070c] border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            <span>{asset.metricsCount.views.toLocaleString()}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Shirt className="w-3.5 h-3.5 text-indigo-400" />
            <span>{asset.metricsCount.tryOns.toLocaleString()} Try-ons</span>
          </span>
        </div>
      </div>
    </div>
  );
};
