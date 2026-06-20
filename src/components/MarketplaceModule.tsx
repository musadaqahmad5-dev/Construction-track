import React, { useState } from 'react';
import { Sparkles, Camera, MapPin, Tag, DollarSign, CheckCircle2, ShoppingBag } from 'lucide-react';
import { FeedItem } from '../features/feed/feedTypes';

interface MarketplaceModuleProps {
  onAddShopPost: (post: Omit<FeedItem, 'id' | 'likesCount' | 'bookmarksCount' | 'createdAt'>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PHOTOS = [
  { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop", label: "Summer Linen" },
  { url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=400&auto=format&fit=crop", label: "Autumn Tweed" },
  { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop", label: "Aesthetic Knit" },
  { url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop", label: "Silk Accessory" },
  { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400&auto=format&fit=crop", label: "Italian Suede Work" },
  { url: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=400&auto=format&fit=crop", label: "Sartorial Suit" }
];

export const MarketplaceModule: React.FC<MarketplaceModuleProps> = ({ onAddShopPost, isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'Casual' | 'Formal' | 'Outerwear' | 'Accessories'>('Casual');
  const [availability, setAvailability] = useState<'In Stock' | 'Limited'>('In Stock');
  const [shopName, setShopName] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_PHOTOS[0].url);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shopName.trim() || !price) return;

    onAddShopPost({
      type: 'shop_product',
      title,
      description: description || `Hand-curated piece by ${shopName}. Elegant design, premium materials selected for the season.`,
      price: parseFloat(price) || 0,
      location: location || "Local Boutique",
      category,
      availability,
      shopName,
      shopAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
      imageUrl: selectedImage,
      vibeTags: [category.toLowerCase(), 'marketplace', 'boutique'],
      statsLabel: "New Addition — local boutique"
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      // Reset
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setShopName('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 selection:bg-transparent">
      <div 
        className="bg-[#0b0b0b] border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="p-12 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white">
              <CheckCircle2 className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl text-white font-light">Listing Posted Successfully</h3>
            <p className="text-white/40 text-xs font-mono uppercase tracking-wider">Propagating through AI feed engine...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <span className="text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase">Local Merchant portal</span>
                <h2 className="font-serif text-xl font-light text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-white/70" /> Post Shop Product
                </h2>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="text-white/40 hover:text-white hover:bg-white/5 px-2 py-1 text-xs font-mono transition-colors rounded-md"
              >
                [ CLOSE ]
              </button>
            </div>

            <div className="space-y-4">
              {/* Product Cover Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">1. Choose Product Artwork</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_PHOTOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(p.url)}
                      className={`relative aspect-[4/5] bg-neutral-900 border overflow-hidden rounded-lg group transition-all ${
                        selectedImage === p.url ? 'border-white ring-1 ring-white/20' : 'border-white/5 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover grayscale" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-mono text-white tracking-tight truncate">{p.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shop info & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Shop Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Atelier No. 12"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-lg transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brushed Mohair Sweater"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-lg transition-colors"
                  />
                </div>
              </div>

              {/* Price and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 120"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-lg transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Physical Shop Area Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Beverly Hills, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-lg transition-colors"
                  />
                </div>
              </div>

              {/* Category & Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Fashion Classification</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs font-mono text-white/80 focus:outline-none focus:border-white/30 rounded-lg transition-colors"
                  >
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Inventory Availability</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs font-mono text-white/80 focus:outline-none focus:border-white/30 rounded-lg transition-colors"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited">Limited (Few remaining)</option>
                  </select>
                </div>
              </div>

              {/* Custom description */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Sartorial Craftsmanship Note (Description)</label>
                <textarea
                  placeholder="Describe fabric weave, weight, styling context, and sustainability factors..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-white/[0.02] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-lg transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-white text-black hover:bg-neutral-200 transition-colors py-3 rounded-xl font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" /> List to Social Feed
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
