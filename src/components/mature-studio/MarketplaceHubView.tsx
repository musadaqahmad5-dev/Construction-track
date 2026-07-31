import React, { useState } from 'react';
import { MarketplaceListing, CreatorProfile, BespokeCustomRequestPayload } from '../../types/matureStudio';
import { ShoppingBag, Sparkles, Crown, Send, Tag, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface MarketplaceHubViewProps {
  listings: MarketplaceListing[];
  onOpenBespokeModal?: (creatorId?: string) => void;
  onListItemModal?: () => void;
  onBuyListing?: (listing: MarketplaceListing) => void;
}

export const MarketplaceHubView: React.FC<MarketplaceHubViewProps> = ({
  listings,
  onOpenBespokeModal,
  onListItemModal,
  onBuyListing
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'ALL' | 'bespoke_custom_order' | 'digital_concept' | 'couture_nft'>('ALL');

  const filteredListings = listings.filter(item => {
    if (selectedCategoryFilter === 'ALL') return true;
    return item.itemType === selectedCategoryFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d0725] via-slate-950 to-[#05050a] border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold font-serif text-white">Marketplace & Bespoke Atelier Hub</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              COMMERCE ENABLED
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Bridge digital fashion concepts, exclusive 1/1 haute couture drops, and direct bespoke tailoring requests with verified atelier creators.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={onListItemModal}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 flex items-center justify-center space-x-2 cursor-pointer transition-all"
          >
            <Tag className="w-4 h-4 text-violet-400" />
            <span>List Concept</span>
          </button>

          <button
            onClick={() => onOpenBespokeModal?.()}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Request Bespoke Piece</span>
          </button>
        </div>
      </div>

      {/* 2. Category Filter Bar */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Opportunities' },
          { id: 'bespoke_custom_order', label: 'Bespoke Custom Orders' },
          { id: 'digital_concept', label: 'Digital Concepts' },
          { id: 'couture_nft', label: 'Couture 1/1 Drops' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategoryFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategoryFilter === tab.id
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl bg-slate-950/90 border border-white/10 overflow-hidden hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Preview Image */}
              <div className="h-64 w-full relative overflow-hidden bg-slate-900">
                <img 
                  src={item.previewImage} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-300 font-bold">
                  {item.tier}
                </span>

                <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                  <img src={item.creatorAvatar} alt={item.creatorName} className="w-6 h-6 rounded-full border border-white/20 object-cover" />
                  <span className="text-xs font-mono text-zinc-300">{item.creatorName}</span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-white font-serif line-clamp-1">{item.title}</h3>
                
                {/* Customization Badges */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Customization Features:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.customizationOptions.map((opt, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-[10px] font-mono text-zinc-300">
                        ✓ {opt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="p-5 pt-3 border-t border-white/5 bg-slate-900/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 block">Valuation Price</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  ${item.price.toLocaleString()} {item.currency}
                </span>
              </div>

              <button
                onClick={() => onBuyListing?.(item)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <span>Acquire / Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
