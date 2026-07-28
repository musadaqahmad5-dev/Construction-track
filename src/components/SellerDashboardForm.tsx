import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Check,
  Plus,
  Tag,
  ShieldCheck,
  DollarSign
} from 'lucide-react';

export type GarmentCategory = 'Tops' | 'Outerwear' | 'Bottoms' | 'Footwear';
export type GarmentSize = 'S' | 'M' | 'L' | 'XL';

export interface GarmentListingPayload {
  productTitle: string;
  basePricePKR: number;
  productCategory: GarmentCategory;
  sizingAvailable: GarmentSize[];
  description?: string;
  imageUrl?: string;
}

interface SellerDashboardFormProps {
  onListProduct?: (product: GarmentListingPayload) => void;
  grossSalesPKR?: number;
  activeListingsCount?: number;
  sartorialOrderVolume?: number;
}

export const SellerDashboardForm: React.FC<SellerDashboardFormProps> = ({
  onListProduct,
  grossSalesPKR = 1485000,
  activeListingsCount = 38,
  sartorialOrderVolume = 142
}) => {
  const [productTitle, setProductTitle] = useState<string>('');
  const [basePricePKR, setBasePricePKR] = useState<string>('');
  const [productCategory, setProductCategory] = useState<GarmentCategory>('Outerwear');
  const [sizingAvailable, setSizingAvailable] = useState<GarmentSize[]>(['M', 'L']);
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<boolean>(false);

  const toggleSize = (size: GarmentSize) => {
    setSizingAvailable((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setValidationError(null);

    const priceNum = parseFloat(basePricePKR);

    if (!productTitle.trim()) {
      setValidationError('Product title is required and cannot be empty.');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      setValidationError('Base price must be a valid numerical value greater than 0 PKR.');
      return;
    }

    if (sizingAvailable.length === 0) {
      setValidationError('At least one sizing option must be selected.');
      return;
    }

    const payload: GarmentListingPayload = {
      productTitle: productTitle.trim(),
      basePricePKR: priceNum,
      productCategory,
      sizingAvailable,
      description: description.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
    };

    if (onListProduct) {
      onListProduct(payload);
    }

    setSuccessBanner(true);
    setProductTitle('');
    setBasePricePKR('');
    setDescription('');
    setImageUrl('');
    setHasSubmitted(false);

    setTimeout(() => {
      setSuccessBanner(false);
    }, 4000);
  };

  const isTitleInvalid = hasSubmitted && !productTitle.trim();
  const priceNum = parseFloat(basePricePKR);
  const isPriceInvalid = hasSubmitted && (isNaN(priceNum) || priceNum <= 0);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 text-zinc-100 p-6 bg-[#05050a] rounded-2xl border border-white/5 shadow-2xl">
      {/* Top Analytical Card Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Gross Sales Card */}
        <div className="p-5 rounded-2xl bg-[#07070c] border border-white/5 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Gross Marketplace Sales
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Rs {grossSalesPKR.toLocaleString('en-PK')}
              </h3>
              <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-0.5">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +18.4%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Aggregate revenue in PKR</p>
          </div>
        </div>

        {/* Active Digital Listings Card */}
        <div className="p-5 rounded-2xl bg-[#07070c] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Active Digital Listings
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {activeListingsCount} <span className="text-xs font-normal text-zinc-400">Assets</span>
            </h3>
            <p className="text-[11px] text-zinc-500 mt-1">Virtual inventory shapes currently active</p>
          </div>
        </div>

        {/* Order Volume Card */}
        <div className="p-5 rounded-2xl bg-[#07070c] border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Sartorial Order Volume
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {sartorialOrderVolume} <span className="text-xs font-normal text-zinc-400">Transactions</span>
            </h3>
            <p className="text-[11px] text-zinc-500 mt-1">Total customer checkout orders executed</p>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 animate-fade-in">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span className="text-xs font-medium">
            Garment asset listed successfully in LOOK VISION Boutique Marketplace!
          </span>
        </div>
      )}

      {/* List New Garment Asset Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#07070c] border border-white/5 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-white/5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">List New Garment Asset</h2>
            <p className="text-xs text-zinc-400">Boutique Marketplace Product Upload Pipeline</p>
          </div>
        </div>

        {/* Validation Warning Message Banner */}
        {validationError && (
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 animate-fade-in">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
            <span className="text-xs font-medium">{validationError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Title */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Product Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="e.g. Italian Cashmere Double-Breasted Jacket"
                className={`w-full min-h-[44px] px-4 rounded-xl bg-slate-950/80 text-white text-xs placeholder-zinc-600 border transition-all focus:outline-none ${
                  isTitleInvalid
                    ? 'border-amber-500/80 focus:border-amber-500 ring-1 ring-amber-500/30'
                    : 'border-white/10 focus:border-indigo-500/50'
                }`}
              />
            </div>

            {/* Base Price PKR */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Base Price (PKR) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={basePricePKR}
                onChange={(e) => setBasePricePKR(e.target.value)}
                placeholder="e.g. 45000"
                min="1"
                step="any"
                className={`w-full min-h-[44px] px-4 rounded-xl bg-slate-950/80 text-white text-xs placeholder-zinc-600 border transition-all focus:outline-none ${
                  isPriceInvalid
                    ? 'border-amber-500/80 focus:border-amber-500 ring-1 ring-amber-500/30'
                    : 'border-white/10 focus:border-indigo-500/50'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Category Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Product Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value as GarmentCategory)}
                className="w-full min-h-[44px] px-4 rounded-xl bg-slate-950/80 text-white text-xs border border-white/10 focus:border-indigo-500/50 focus:outline-none"
              >
                <option value="Tops">Tops</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>

            {/* Image URL Optional Field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Asset Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full min-h-[44px] px-4 rounded-xl bg-slate-950/80 text-white text-xs placeholder-zinc-600 border border-white/10 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Sizing Multi-Checkbox Matrix */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Sizing Available <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {(['S', 'M', 'L', 'XL'] as GarmentSize[]).map((size) => {
                const isSelected = sizingAvailable.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`min-h-[44px] min-w-[56px] px-4 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-200'
                        : 'bg-slate-950/60 border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                    }`}
                  >
                    <span>{size}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Garment Description */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Garment Specifications & Textile Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail fabric composition, tailoring parameters, or care guidelines..."
              className="w-full p-4 rounded-xl bg-slate-950/80 text-white text-xs placeholder-zinc-600 border border-white/10 focus:border-indigo-500/50 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="min-h-[44px] px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] flex items-center space-x-2"
            >
              <Tag className="w-4 h-4" />
              <span>Publish Listing to Marketplace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
