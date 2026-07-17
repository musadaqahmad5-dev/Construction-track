import React, { useState } from 'react';
import { Heart, Eye, Bookmark, Sparkles, MessageSquare, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { AICreation } from './types';

interface CreationCardProps {
  creation: AICreation;
  onSelect: (creation: AICreation) => void;
  onLike: (id: string, e: React.MouseEvent) => void;
  isLiked: boolean;
  onSave?: (id: string, e: React.MouseEvent) => void;
  isSaved?: boolean;
  onVisitCreator: (creatorId: string, e: React.MouseEvent) => void;
}

export const CreationCard: React.FC<CreationCardProps> = ({
  creation,
  onSelect,
  onLike,
  isLiked,
  onSave,
  isSaved,
  onVisitCreator
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(creation.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ Prompt copied to clipboard!'
    }));
  };

  return (
    <motion.div
      layoutId={`creation-card-container-${creation.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(creation)}
      className="group bg-[#080810]/60 border border-white/5 rounded-2xl overflow-hidden relative aspect-[3/4.2] hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-end"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-zinc-950 z-0">
        <img
          src={creation.imageUrl}
          alt={creation.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=500&auto=format&fit=crop"; }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05050a]/95 via-black/30 to-transparent z-10" />

      {/* Header Overlay Badges (Visible on hover or default) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-start">
        <span className="text-[9px] font-mono font-semibold bg-[#07070c]/80 backdrop-blur-md text-violet-300 px-2.5 py-1 rounded-full border border-violet-500/20 flex items-center gap-1 shadow-lg">
          <Sparkles className="w-2.5 h-2.5 text-violet-400 animate-pulse" /> {creation.model}
        </span>

        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="p-1.5 bg-[#07070c]/85 backdrop-blur-md hover:bg-violet-600/25 text-zinc-300 hover:text-white rounded-lg border border-white/5 transition-all shadow-md cursor-pointer"
            title="Copy Prompt"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          
          <button
            type="button"
            onClick={(e) => onLike(creation.id, e)}
            className={`p-1.5 bg-[#07070c]/85 backdrop-blur-md hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 rounded-lg border border-white/5 transition-all shadow-md cursor-pointer ${isLiked ? 'text-rose-400' : ''}`}
            title="Like Creation"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {onSave && (
            <button
              type="button"
              onClick={(e) => onSave(creation.id, e)}
              className={`p-1.5 bg-[#07070c]/85 backdrop-blur-md hover:bg-indigo-500/20 text-zinc-300 hover:text-indigo-400 rounded-lg border border-white/5 transition-all shadow-md cursor-pointer ${isSaved ? 'text-indigo-400' : ''}`}
              title="Save to Collection"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-500 text-indigo-500' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Info Block */}
      <div className="p-4 z-20 space-y-2 text-left">
        <div>
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest font-bold">
              {creation.style} • {creation.aspectRatio}
            </span>
            <span className="text-[9px] font-mono text-white/30">
              #{creation.id.slice(-5)}
            </span>
          </div>

          <h4 className="text-[13px] font-semibold text-zinc-100 tracking-wide truncate group-hover:text-white transition-colors">
            {creation.title}
          </h4>

          <p className="text-[10px] font-sans text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed font-light">
            {creation.prompt}
          </p>
        </div>

        {/* Creator and Actions Row */}
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/[0.04]">
          {/* Creator Profile Link */}
          <div 
            onClick={(e) => onVisitCreator(creation.creator.id, e)}
            className="flex items-center gap-2 group/creator cursor-pointer"
          >
            <img
              src={creation.creator.avatar}
              alt={creation.creator.name}
              className="w-5 h-5 rounded-full object-cover border border-white/10 group-hover/creator:border-violet-500/40 transition-colors"
            />
            <span className="text-[10px] text-zinc-400 group-hover/creator:text-zinc-100 transition-colors truncate max-w-[80px]">
              @{creation.creator.name}
            </span>
          </div>

          {/* Engagement Numbers */}
          <div className="flex items-center gap-2.5 text-zinc-500">
            <span className="flex items-center gap-1 hover:text-rose-400 transition-colors">
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isLiked ? creation.likesCount + 1 : creation.likesCount}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{creation.viewsCount}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
