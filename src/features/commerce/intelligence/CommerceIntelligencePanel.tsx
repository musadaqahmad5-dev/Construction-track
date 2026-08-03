import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, TrendingUp, DollarSign, Tag, Award, Users, 
  Brain, ShieldCheck, Zap, ArrowUpRight, BarChart3, Search, 
  ShoppingBag, Layers, Percent, Check, AlertCircle, Eye, Star
} from 'lucide-react';
import { calculateAIPricingSuggestion, PricingSuggestion } from './AIPricingIntelligence';
import { generateARIAMarketplaceRecommendations, ARIAShoppingIntelligenceResponse } from './MarketplaceRecommendationEngine';
import { fetchCreatorProfile, CreatorIdentityProfile } from './CreatorProfileEngine';
import { fetchUserCommerceMemory, UserCommerceMemoryProfile } from './CommerceMemoryEngine';
import { CatalogItem } from './AICatalogMatcher';

const SAMPLE_CATALOG: CatalogItem[] = [
  {
    id: 'prod-01',
    creatorId: 'cr-01',
    creatorName: 'Valerie Vance',
    title: 'Architectural Liquid Cashmere Trench',
    category: 'Outerwear',
    price: 380,
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
    styleDNA: ['Architectural', 'Quiet Luxury', 'Monochrome'],
    fabric: 'Italian Mulberry Silk & Cashmere',
    colorPalette: ['#05050A', '#1C1C28', '#D4AF37'],
    occasion: 'Formal Editorial',
    rating: 4.9,
    salesCount: 42,
    isCustomTailored: true
  },
  {
    id: 'prod-02',
    creatorId: 'cr-02',
    creatorName: 'Aero Labs Design',
    title: 'Cybernetic Metallic Shell Jacket',
    category: 'Jacket',
    price: 290,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    styleDNA: ['Cyberpunk', 'Technical Outerwear', 'Liquid Metallic'],
    fabric: 'Technical Liquid Metallic Nylon',
    colorPalette: ['#05050A', '#8B5CF6'],
    occasion: 'Avant-Garde Streetwear',
    rating: 4.8,
    salesCount: 35,
    isCustomTailored: false
  },
  {
    id: 'prod-03',
    creatorId: 'cr-01',
    creatorName: 'Valerie Vance',
    title: 'Bespoke Sculpted Blazer',
    category: 'Bespoke Suits',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    styleDNA: ['Architectural', 'Minimalist', 'Quiet Luxury'],
    fabric: 'Super 150s Merino Wool',
    colorPalette: ['#05050A', '#8B5CF6', '#D4AF37'],
    occasion: 'Gala & Evening',
    rating: 5.0,
    salesCount: 28,
    isCustomTailored: true
  }
];

interface CommerceIntelligencePanelProps {
  userId?: string;
  creatorId?: string;
}

export const CommerceIntelligencePanel: React.FC<CommerceIntelligencePanelProps> = ({
  userId,
  creatorId = 'cr-01'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'pricing' | 'recommendations' | 'memory'>('overview');
  
  // Pricing Calculator State
  const [pricingCategory, setPricingCategory] = useState('Jacket');
  const [pricingFabric, setPricingFabric] = useState('Italian Mulberry Silk & Cashmere');
  const [pricingLuxuryScore, setPricingLuxuryScore] = useState(90);
  const [pricingSuggestion, setPricingSuggestion] = useState<PricingSuggestion | null>(null);

  // Recommendations Search Query
  const [recommendationQuery, setRecommendationQuery] = useState('I need a formal jacket');
  const [recommendationsData, setRecommendationsData] = useState<ARIAShoppingIntelligenceResponse | null>(null);

  // Profile & Memory State
  const [creatorProfile, setCreatorProfile] = useState<CreatorIdentityProfile | null>(null);
  const [commerceMemory, setCommerceMemory] = useState<UserCommerceMemoryProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recalculate AI Pricing
  useEffect(() => {
    const suggestion = calculateAIPricingSuggestion({
      title: 'Custom Creation',
      category: pricingCategory,
      fabric: pricingFabric,
      luxuryIntensity: pricingLuxuryScore,
      creatorRating: creatorProfile?.designQualityScore ? creatorProfile.designQualityScore / 20 : 4.8,
      trendVelocity: 'high'
    });
    setPricingSuggestion(suggestion);
  }, [pricingCategory, pricingFabric, pricingLuxuryScore, creatorProfile]);

  // Load Creator & Recommendations Data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const [profile, memory] = await Promise.all([
        fetchCreatorProfile(creatorId),
        fetchUserCommerceMemory(userId)
      ]);

      if (isMounted) {
        setCreatorProfile(profile);
        setCommerceMemory(memory);

        const recs = generateARIAMarketplaceRecommendations(SAMPLE_CATALOG, {
          userQuery: recommendationQuery,
          userStyleDNA: profile.primaryStyleDNA,
          userPreferredColors: ['#05050A', '#8B5CF6', '#D4AF37']
        });
        setRecommendationsData(recs);

        setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [creatorId, userId]);

  const handleSearchRecommendations = () => {
    if (!creatorProfile) return;
    const recs = generateARIAMarketplaceRecommendations(SAMPLE_CATALOG, {
      userQuery: recommendationQuery,
      userStyleDNA: creatorProfile.primaryStyleDNA,
      userPreferredColors: ['#05050A', '#8B5CF6', '#D4AF37']
    });
    setRecommendationsData(recs);
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER BAR */}
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>Creator Commerce Intelligence Center</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ARIA v2.4
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Predictive AI pricing, creator reputation graphs, & ARIA smart recommendations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs font-semibold text-indigo-300 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>ARIA Engine Active</span>
            </div>
          </div>
        </div>

        {/* METRICS DASHBOARD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#05050a] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">Creator Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-indigo-300">{creatorProfile?.designQualityScore || 94}%</span>
              <span className="text-[10px] text-indigo-400 font-mono">Master Tier</span>
            </div>
          </div>

          <div className="bg-[#05050a] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">Gross Creator Revenue</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-400">
                ${(creatorProfile?.totalRevenueUSD || 38400).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-500 font-mono">+18% MoM</span>
            </div>
          </div>

          <div className="bg-[#05050a] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">Customer Preference Match</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-amber-300">{creatorProfile?.customerPreferenceAlignment || 96}%</span>
              <span className="text-[10px] text-amber-400 font-mono">High Affinity</span>
            </div>
          </div>

          <div className="bg-[#05050a] p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">Total Sales Volume</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-purple-300">{creatorProfile?.totalSalesVolume || 124}</span>
              <span className="text-[10px] text-purple-400 font-mono">Pieces Sold</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto">
          {[
            { id: 'overview', label: 'Creator Analytics', icon: BarChart3 },
            { id: 'pricing', label: 'AI Pricing Intelligence', icon: Tag },
            { id: 'recommendations', label: 'ARIA Shopping Intelligence', icon: Sparkles },
            { id: 'memory', label: 'Commerce Memory', icon: Brain }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  active 
                    ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-[#05050a] text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT 1: OVERVIEW & ANALYTICS */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CREATOR PROFILE & DNA */}
          <div className="lg:col-span-7 bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={creatorProfile?.avatarUrl} 
                  alt="Creator Avatar" 
                  className="w-10 h-10 rounded-full object-cover border border-indigo-500/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{creatorProfile?.creatorName}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {creatorProfile?.tier}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-500 font-mono block">Signature Style Theme</span>
                <span className="text-xs font-bold text-amber-300">{creatorProfile?.signatureTheme}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-[#05050a] p-3 rounded-xl border border-white/5">
              "{creatorProfile?.bio}"
            </p>

            {/* STYLE DNA TAGS */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Creator Style DNA Alignment</span>
              <div className="flex flex-wrap gap-2">
                {creatorProfile?.primaryStyleDNA.map((dna, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    #{dna}
                  </span>
                ))}
              </div>
            </div>

            {/* POPULAR CATEGORIES */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Top Revenue Categories</span>
              <div className="space-y-2">
                {creatorProfile?.popularCategories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#05050a] p-3 rounded-xl border border-white/5 text-xs">
                    <span className="font-semibold text-white">{cat.category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-400 font-mono">{cat.count} items sold</span>
                      <span className="text-emerald-400 font-bold font-mono">${cat.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TRENDING CATEGORIES & REPUTATION */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Market Velocity & Demand</span>
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  VIRAL DEMAND
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-[#05050a] p-3 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">Architectural Outerwear</span>
                    <span className="text-emerald-400 font-bold">+142% Demand Surge</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 w-[92%]" />
                  </div>
                </div>

                <div className="bg-[#05050a] p-3 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">Liquid Metallic Silks</span>
                    <span className="text-indigo-400 font-bold">+88% Category Growth</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[78%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: AI PRICING INTELLIGENCE */}
      {activeSubTab === 'pricing' && pricingSuggestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PRICING INPUT CONTROL */}
          <div className="lg:col-span-5 bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Configure Piece Parameters</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Garment Category</label>
                <select 
                  value={pricingCategory}
                  onChange={e => setPricingCategory(e.target.value)}
                  className="w-full bg-[#05050a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Jacket">Jacket & Outerwear</option>
                  <option value="Couture Dress">Couture Dress</option>
                  <option value="Suit">Bespoke Suit</option>
                  <option value="Outfit">Full Outfit</option>
                  <option value="Footwear">Luxury Footwear</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Fabric & Material Composition</label>
                <select 
                  value={pricingFabric}
                  onChange={e => setPricingFabric(e.target.value)}
                  className="w-full bg-[#05050a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Italian Mulberry Silk & Cashmere">Italian Mulberry Silk & Cashmere</option>
                  <option value="Technical Liquid Metallic Nylon">Technical Liquid Metallic Nylon</option>
                  <option value="Super 150s Merino Wool">Super 150s Merino Wool</option>
                  <option value="Vegetable Tanned Leather">Vegetable Tanned Leather</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Luxury Craft Intensity</label>
                  <span className="text-xs font-mono text-emerald-400">{pricingLuxuryScore}%</span>
                </div>
                <input 
                  type="range"
                  min={50}
                  max={100}
                  value={pricingLuxuryScore}
                  onChange={e => setPricingLuxuryScore(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* AI PRICING RESULT CARD */}
          <div className="lg:col-span-7 bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>AI Pricing Suggestion</span>
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Confidence: {pricingSuggestion.confidenceScore}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#05050a] p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Suggested Retail Price</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                  ${pricingSuggestion.suggestedPrice}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Market Positioning</span>
                <span className="text-sm font-bold text-amber-300 block pt-1">
                  {pricingSuggestion.marketPosition}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block pt-1">
                  Range: ${pricingSuggestion.priceRange.min} - ${pricingSuggestion.priceRange.max}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">AI Valuation Reasoning</span>
              <div className="space-y-2">
                {pricingSuggestion.reasoning.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-300 bg-[#05050a] p-2.5 rounded-lg border border-white/5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ARIA SHOPPING RECOMMENDATIONS */}
      {activeSubTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input 
                  type="text"
                  value={recommendationQuery}
                  onChange={e => setRecommendationQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchRecommendations()}
                  placeholder="Ask ARIA (e.g. 'I need a formal jacket matching my closet')..."
                  className="w-full bg-[#05050a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                onClick={handleSearchRecommendations}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Query ARIA</span>
              </button>
            </div>

            {recommendationsData && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{recommendationsData.wardrobeContextNote}</span>
              </div>
            )}
          </div>

          {/* RECOMMENDATION LIST */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendationsData?.recommendations.map((rec, i) => (
              <div key={i} className="bg-[#07070c] border border-white/5 rounded-2xl overflow-hidden space-y-3 p-4 shadow-xl hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-300">
                <div className="relative h-48 rounded-xl overflow-hidden bg-[#05050a]">
                  <img src={rec.item.imageUrl} alt={rec.item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-black shadow">
                    {rec.overallScore}% Match
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-white truncate">{rec.item.title}</h5>
                  <span className="text-[10px] text-zinc-400 font-mono">By {rec.item.creatorName}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-sm font-bold text-emerald-400 font-mono">${rec.item.price}</span>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Fit: {rec.fitScore}%
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 bg-[#05050a] p-2 rounded-lg border border-white/5">
                  {rec.ariaRecommendationNote}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: COMMERCE MEMORY */}
      {activeSubTab === 'memory' && commerceMemory && (
        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Learned Commerce Memory Profile</span>
            </h4>
            <span className="text-[10px] font-mono text-zinc-400">
              {commerceMemory.totalSignalsCaptured} Signals Captured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#05050a] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono uppercase block">Total Collector Spend</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">${commerceMemory.totalSpentUSD.toLocaleString()}</span>
            </div>

            <div className="bg-[#05050a] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono uppercase block">Spending Tier</span>
              <span className="text-sm font-bold text-amber-300 block pt-1">{commerceMemory.spendingPatternTier}</span>
            </div>

            <div className="bg-[#05050a] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono uppercase block">Average Item Value</span>
              <span className="text-xl font-bold text-indigo-300 font-mono">${commerceMemory.averageItemSpendUSD}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
