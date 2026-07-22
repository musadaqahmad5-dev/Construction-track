import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, Plus, Trash2, Edit3, BarChart2, DollarSign, Eye, Award, CheckCircle2, ShoppingBag, Settings, Sparkles, Sliders, ArrowUpRight, Percent, RefreshCw } from 'lucide-react';
import { WardrobeItem } from '../../types';
import { FounderDashboard } from '../FounderDashboard';

interface CreatorWorkspaceScreenProps {
  user: any;
  userWardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onNavigateToTab?: (tab: string) => void;
}

export const CreatorWorkspaceScreen: React.FC<CreatorWorkspaceScreenProps> = ({
  user,
  userWardrobe,
  onAddGarment,
  onNavigateToTab
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'listings' | 'predictions' | 'profile' | 'seller'>('analytics');
  
  // Local products catalog state
  const [listings, setListings] = useState([
    { id: 'l-1', title: 'Brushed Mohair Sweater', price: 115.00, category: 'Casual', stock: 12, sales: 34, imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop' },
    { id: 'l-2', title: 'Relaxed Double-Breasted Blazer', price: 79.99, category: 'Formal', stock: 8, sales: 48, imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop' },
    { id: 'l-3', title: 'Aris Waterproof Tech Parka', price: 240.00, category: 'Outerwear', stock: 5, sales: 14, imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=200&auto=format&fit=crop' }
  ]);

  // Form states to add new listings
  const [isNewListingFormOpen, setIsNewListingFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<'Casual' | 'Formal' | 'Sportswear' | 'Outerwear' | 'Accessories'>('Casual');
  const [newStock, setNewStock] = useState('10');
  const [newDesc, setNewDesc] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=400&auto=format&fit=crop');
  const [listingSuccess, setListingSuccess] = useState(false);

  // Shop profile states
  const [shopName, setShopName] = useState('ATELIER NO. 12');
  const [shopLocation, setShopLocation] = useState('Milano, Italy');
  const [shopBio, setShopBio] = useState('Crafting minimalist luxury and tactile knitwear with Belgian flax and soft brushed mohair.');
  const [shopProfileSaved, setShopProfileSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setShopProfileSaved(true);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Boutique brand profile updated.' }));
    setTimeout(() => setShopProfileSaved(false), 2000);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    const newListing = {
      id: `l-local-${Date.now()}`,
      title: newTitle.trim(),
      price: parseFloat(newPrice) || 0,
      category: newCategory,
      stock: parseInt(newStock) || 10,
      sales: 0,
      imageUrl: newImageUrl
    };

    setListings([newListing, ...listings]);
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    setListingSuccess(true);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `${newListing.title} listed to social catalog.` }));
    setTimeout(() => {
      setListingSuccess(false);
      setIsNewListingFormOpen(false);
    }, 1500);
  };

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter(x => x.id !== id));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Listing removed from storefront.' }));
  };

  // Analytics helper calculations
  const totalSalesCount = useMemo(() => listings.reduce((sum, x) => sum + x.sales, 0), [listings]);
  const estimatedRevenue = useMemo(() => listings.reduce((sum, x) => sum + (x.sales * x.price), 0).toFixed(2), [listings]);

  return (
    <div className="w-full min-h-screen bg-[#05050a] text-zinc-100 p-4 sm:p-6 lg:p-8 select-none">
      
      {/* Visual Title Header */}
      <div className="max-w-6xl mx-auto space-y-3 pb-8 border-b border-white/5 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-500 uppercase block font-light">
              CREATOR DESIGN WORKSPACE
            </span>
            <h1 className="font-serif font-light tracking-tight text-4xl text-white flex items-center gap-2">
              <Store className="w-8 h-8 text-violet-400" /> {shopName}
            </h1>
          </div>

          {/* Quick Tab switcher */}
          <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-xl">
            {[
              { id: 'analytics', label: 'Analytics' },
              { id: 'listings', label: 'Store Listings' },
              { id: 'predictions', label: 'AI Demand' },
              { id: 'profile', label: 'Shop Profile' },
              { id: 'seller', label: 'Seller Hub' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-violet-600 text-white font-bold' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xl font-light">
          Monitor boutique sales performance, publish brand new garments, customize shop styles, and utilize real-time AI styling models to forecast regional fashion demand cycles.
        </p>
      </div>

      {/* Main Stats metrics bar */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 text-left">
        {[
          { label: 'Boutique Revenue', value: `$${estimatedRevenue} USD`, sub: 'Estimated earnings', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Units Assembled', value: totalSalesCount, sub: 'Items sold to clients', icon: ShoppingBag, color: 'text-violet-400' },
          { label: 'Storefront Views', value: '1.4K', sub: '+18% weekly growth', icon: Eye, color: 'text-cyan-400' },
          { label: 'Conversion Threshold', value: '8.4%', sub: 'High customer loyalty', icon: Percent, color: 'text-amber-400' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-[#08080f]/50 border border-white/5 shadow-xl space-y-2">
              <div className="flex justify-between items-center select-none">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-bold font-sans text-white">{stat.value}</h3>
                <span className="text-[9.5px] text-zinc-500 font-mono block">{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content tabs render area */}
      <div className="max-w-6xl mx-auto text-left">
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
              <h3 className="text-sm font-bold font-mono uppercase text-white tracking-widest">Atelier Engagement Stream</h3>
              
              <div className="space-y-3">
                {[
                  { user: 'Sasha D.', action: 'placed "Relaxed Blazer" into their Closet shelves', time: '14 minutes ago' },
                  { user: 'Marcus K.', action: 'submitted a 5-star tactile review on "Brushed Mohair Knit"', time: '2 hours ago' },
                  { user: 'Elena R.', action: 'shared outfit coordination look using your "Waterproof Parka"', time: '1 day ago' }
                ].map((log, lIdx) => (
                  <div key={lIdx} className="p-3 bg-zinc-950/40 border border-white/[0.02] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-violet-300 font-bold font-mono">{log.user}</span>
                      <span className="text-zinc-400">{log.action}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-white">Active Catalog Listings ({listings.length})</h3>
              <button
                onClick={() => setIsNewListingFormOpen(true)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Garment</span>
              </button>
            </div>

            {/* List entries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listings.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between hover:border-violet-500/15 duration-300 transition-all">
                  <div className="space-y-3">
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-zinc-500">{item.category}</span>
                      <h4 className="text-sm font-semibold text-white truncate mt-0.5">{item.title}</h4>
                      <div className="flex justify-between items-center mt-2 text-xs font-mono">
                        <span className="text-white font-bold">${item.price}</span>
                        <span className="text-zinc-500">In Stock: {item.stock} u</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.03] mt-4 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-emerald-400">{item.sales} Units Sold</span>
                    <button
                      onClick={() => handleDeleteListing(item.id)}
                      className="p-2 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="p-6 bg-gradient-to-r from-violet-950/20 to-purple-950/25 border border-violet-500/10 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
                <span className="text-xs font-mono uppercase text-white tracking-widest font-bold">Predictive Style Forecast</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl font-light">
                Our dynamic AI engine mapped regional style indices and seasonal micro-climate forecasts. Below are style configurations with predicted high sales demand metrics for the next 7 days.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Dark Slate Tailored Blazers', rate: '+24%', demand: 'Critical Demand', text: 'Corporate creative workspace wardrobes are shifting toward slate gray loose drapes.' },
                { title: 'Textured Belgian Flax Linen Shirts', rate: '+15%', demand: 'High Demand', text: 'Warm weekend high street strolls are promoting off-white loose linen selections.' },
                { title: 'Technical Stormproof Outerwear', rate: '+9%', demand: 'Stable Demand', text: 'Predicted overcast rainfall spikes technical storm parka interest.' }
              ].map((pred, pIdx) => (
                <div key={pIdx} className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2.5">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-white">{pred.title}</h4>
                    <span className="px-2.5 py-1 rounded-md text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {pred.rate}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">{pred.text}</p>
                  <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                    <span>Algorithm confidence: 91%</span>
                    <span className="text-violet-400 uppercase font-bold">{pred.demand}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in max-w-xl">
            <form onSubmit={handleSaveProfile} className="p-6 bg-[#08080f]/50 border border-white/5 rounded-2xl space-y-4 select-text">
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-white border-b border-white/5 pb-3">Configure Brand Registry</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase block">Atelier Brand Name</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase block">Atelier Physical Headquarters Location</label>
                <input
                  type="text"
                  required
                  value={shopLocation}
                  onChange={(e) => setShopLocation(e.target.value)}
                  className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase block">Boutique Brand Identity Summary (Bio)</label>
                <textarea
                  value={shopBio}
                  onChange={(e) => setShopBio(e.target.value)}
                  rows={3}
                  className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 transition-colors text-white font-mono text-xs uppercase tracking-widest rounded-xl cursor-pointer font-bold"
              >
                Save Atelier Profile
              </button>

              {shopProfileSaved && (
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block text-center">✓ Brand contract successfully synchronized.</span>
              )}
            </form>
          </div>
        )}

        {activeTab === 'seller' && (
          <div className="space-y-6 animate-fade-in text-left">
            <FounderDashboard />
          </div>
        )}
      </div>

      {/* Pop-up Overlay for New listings creation */}
      <AnimatePresence>
        {isNewListingFormOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-text">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b10] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 relative"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 select-none">
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">LOCAL MERCHANT GATEWAY</span>
                  <h3 className="font-serif text-lg text-white">List Brand Garment</h3>
                </div>
                <button
                  onClick={() => setIsNewListingFormOpen(false)}
                  className="text-xs font-mono text-zinc-500 hover:text-white cursor-pointer"
                >
                  [ CLOSE ]
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brushed Mohair Sweater"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block">Price ($ USD)</label>
                    <input
                      type="number"
                      required
                      placeholder="120"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block">Inventory Units</label>
                    <input
                      type="number"
                      required
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block">Tactile Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                  >
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Sportswear">Sportswear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block">Product Image URL</label>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 transition-colors text-black font-mono text-xs uppercase tracking-widest rounded-xl font-bold mt-2"
                >
                  List to Social Stream
                </button>

                {listingSuccess && (
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block text-center">✓ Product published successfully!</span>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
