import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  Briefcase, 
  Globe, 
  Landmark, 
  Percent, 
  CheckCircle, 
  CheckCircle2,
  Store, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Wallet, 
  CreditCard, 
  DollarSign, 
  Sparkles, 
  FileText, 
  Info, 
  AlertCircle, 
  ChevronRight,
  TrendingUp,
  Tag,
  Lock,
  Layers,
  Award,
  Zap
} from 'lucide-react';

export type FashionNiche = 
  | 'Streetwear Noir'
  | 'Haute Runway'
  | 'Avant-Garde'
  | 'Quiet Luxury'
  | 'Cyber Couture'
  | 'Sustainable Knitwear'
  | 'Bespoke Tailoring'
  | 'Artisan Accessories';

export type PayoutMethod = 'wire' | 'iban' | 'wallet';

export interface VendorProfileState {
  // Step 1: Boutique Identity Profile
  storeName: string;
  brandHandle: string;
  contactEmail: string;
  websiteOrLookbook: string;
  selectedNiches: FashionNiche[];
  countryOfOperation: string;
  brandBio: string;

  // Step 2: Global Alternative Payout Gateway
  payoutMethod: PayoutMethod;
  bankName: string;
  accountHolderName: string;
  routingNumber: string;
  accountNumber: string;
  ibanSwiftCode: string;
  freelanceIban: string;
  digitalWalletType: 'usdc' | 'paypal' | 'revolut' | 'wise';
  digitalWalletAddress: string;

  // Step 3: Commission Agreement & Fee Consent
  sampleProjectedMonthlySales: number;
  agreeToPlatformFee: boolean;
  agreeToQualityCharter: boolean;
  agreeToReturnPolicy: boolean;
}

export interface VendorOnboardingProps {
  onComplete?: (vendorData: VendorProfileState) => void;
  onCancel?: () => void;
  initialData?: Partial<VendorProfileState>;
}

const AVAILABLE_NICHES: { id: FashionNiche; title: string; description: string }[] = [
  { id: 'Quiet Luxury', title: 'Quiet Luxury', description: 'Monochrome minimalist tailoring, cashmere & linen' },
  { id: 'Cyber Couture', title: 'Cyber Couture', description: 'Kinetic reflective piping & futuristic silhouettes' },
  { id: 'Avant-Garde', title: 'Avant-Garde', description: 'Sculptural asymmetric cuts and conceptual runway drape' },
  { id: 'Streetwear Noir', title: 'Streetwear Noir', description: 'Matte technical shells, modular webbing & tactical layers' },
  { id: 'Haute Runway', title: 'Haute Runway', description: 'Floor-sweeping silk-wool overcoats & editorial fashion' },
  { id: 'Bespoke Tailoring', title: 'Bespoke Tailoring', description: 'Hand-sewn Italian wool blazers & pleated trousers' },
  { id: 'Sustainable Knitwear', title: 'Sustainable Knitwear', description: 'Organic regenerative fibers & zero-waste knitting' },
  { id: 'Artisan Accessories', title: 'Artisan Accessories', description: 'Full-grain leather platform boots & hand-hammered metals' },
];

const INITIAL_VENDOR_STATE: VendorProfileState = {
  storeName: '',
  brandHandle: '',
  contactEmail: '',
  websiteOrLookbook: '',
  selectedNiches: ['Quiet Luxury', 'Bespoke Tailoring'],
  countryOfOperation: 'Italy',
  brandBio: '',
  payoutMethod: 'iban',
  bankName: '',
  accountHolderName: '',
  routingNumber: '',
  accountNumber: '',
  ibanSwiftCode: '',
  freelanceIban: '',
  digitalWalletType: 'wise',
  digitalWalletAddress: '',
  sampleProjectedMonthlySales: 15000,
  agreeToPlatformFee: false,
  agreeToQualityCharter: false,
  agreeToReturnPolicy: false,
};

export const VendorOnboarding: React.FC<VendorOnboardingProps> = ({
  onComplete,
  onCancel,
  initialData
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [vendorState, setVendorState] = useState<VendorProfileState>({
    ...INITIAL_VENDOR_STATE,
    ...initialData
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Math calculation for commission split (10% platform, 90% vendor retention)
  const mathCalculations = useMemo(() => {
    const grossSales = Number(vendorState.sampleProjectedMonthlySales) || 0;
    const platformFeeRate = 0.10; // Flat 10%
    const platformCommission = grossSales * platformFeeRate;
    const vendorNetPayout = grossSales * (1 - platformFeeRate);
    const averageOrderValue = 350;
    const estimatedOrders = Math.round(grossSales / averageOrderValue);

    return {
      grossSales,
      platformFeeRate: 10,
      platformCommission: Math.round(platformCommission),
      vendorNetPayout: Math.round(vendorNetPayout),
      estimatedOrders,
    };
  }, [vendorState.sampleProjectedMonthlySales]);

  // Validation Rules
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!vendorState.storeName.trim()) {
      newErrors.storeName = 'Store / Boutique name is required.';
    } else if (vendorState.storeName.trim().length < 3) {
      newErrors.storeName = 'Store name must be at least 3 characters.';
    }

    if (!vendorState.brandHandle.trim()) {
      newErrors.brandHandle = 'Brand handle is required.';
    } else {
      const cleanHandle = vendorState.brandHandle.replace(/^@/, '');
      const handleRegex = /^[a-zA-Z0-9_]{3,30}$/;
      if (!handleRegex.test(cleanHandle)) {
        newErrors.brandHandle = 'Handle must be alphanumeric (3-30 chars, underscores allowed).';
      }
    }

    if (!vendorState.contactEmail.trim()) {
      newErrors.contactEmail = 'Commercial contact email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorState.contactEmail)) {
      newErrors.contactEmail = 'Please provide a valid business email address.';
    }

    if (vendorState.selectedNiches.length === 0) {
      newErrors.selectedNiches = 'Please select at least one fashion niche.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (vendorState.payoutMethod === 'wire') {
      if (!vendorState.bankName.trim()) newErrors.bankName = 'Bank institution name is required.';
      if (!vendorState.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder legal name is required.';
      if (!vendorState.routingNumber.trim() || vendorState.routingNumber.length < 6) {
        newErrors.routingNumber = 'Valid Wire routing or ABA transit code is required.';
      }
      if (!vendorState.accountNumber.trim() || vendorState.accountNumber.length < 6) {
        newErrors.accountNumber = 'Account number is required.';
      }
    } else if (vendorState.payoutMethod === 'iban') {
      if (!vendorState.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder legal name is required.';
      const cleanIban = vendorState.freelanceIban.replace(/\s+/g, '').toUpperCase();
      if (!cleanIban) {
        newErrors.freelanceIban = 'IBAN is required for SEPA/International clearing.';
      } else if (cleanIban.length < 15 || cleanIban.length > 34) {
        newErrors.freelanceIban = 'Invalid IBAN length (expected 15-34 alphanumeric characters).';
      }
      if (!vendorState.ibanSwiftCode.trim() || vendorState.ibanSwiftCode.length < 8) {
        newErrors.ibanSwiftCode = 'BIC / SWIFT code (8 or 11 characters) is required.';
      }
    } else if (vendorState.payoutMethod === 'wallet') {
      if (!vendorState.digitalWalletAddress.trim()) {
        newErrors.digitalWalletAddress = 'Digital wallet recipient address or tag is required.';
      } else if (vendorState.digitalWalletType === 'usdc' && !vendorState.digitalWalletAddress.startsWith('0x') && vendorState.digitalWalletAddress.length < 32) {
        newErrors.digitalWalletAddress = 'Please enter a valid ERC-20 / Polygon USDC address (0x...).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!vendorState.agreeToPlatformFee) {
      newErrors.agreeToPlatformFee = 'You must accept the flat 10% platform commission fee terms.';
    }
    if (!vendorState.agreeToQualityCharter) {
      newErrors.agreeToQualityCharter = 'You must confirm adherence to LookVision Luxury Production Standards.';
    }
    if (!vendorState.agreeToReturnPolicy) {
      newErrors.agreeToReturnPolicy = 'You must agree to the 14-day client satisfaction escrow release policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    setErrors({});
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    // Simulate backend merchant registration RPC
    await new Promise(res => setTimeout(res, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: { 
        message: `Boutique "${vendorState.storeName}" verified & active! 90% payout gateway established.`, 
        type: 'success' 
      }
    }));

    if (onComplete) {
      setTimeout(() => {
        onComplete(vendorState);
      }, 1800);
    }
  };

  // Toggle Niche selection
  const toggleNiche = (niche: FashionNiche) => {
    setVendorState(prev => {
      const exists = prev.selectedNiches.includes(niche);
      const updated = exists 
        ? prev.selectedNiches.filter(n => n !== niche)
        : [...prev.selectedNiches, niche];
      return { ...prev, selectedNiches: updated };
    });
  };

  // Format IBAN input with standard 4-character spacing
  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setVendorState(prev => ({ ...prev, freelanceIban: formatted }));
  };

  return (
    <div id="vendor-onboarding-root" className="min-h-screen w-full bg-[#05050a] text-zinc-100 py-10 px-4 flex flex-col items-center justify-center select-none">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl space-y-6">
        
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-white/5 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-0.5 shadow-[0_0_25px_rgba(34,197,94,0.3)]">
              <div className="w-full h-full bg-[#07070c] rounded-[14px] flex items-center justify-center">
                <Store className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">Merchant & Atelier Onboarding</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400">
                  90% RETAINED REVENUE
                </span>
              </div>
              <p className="text-xs text-zinc-400">Direct-to-Consumer AI Fashion Marketplace Registration</p>
            </div>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              Exit Setup
            </button>
          )}
        </div>

        {/* 3-Step Wizard Navigation Indicator */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          
          {/* Step 1 Pill */}
          <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
            currentStep === 1 
              ? 'bg-[#07070c] border-emerald-500/40 shadow-[0_0_20px_rgba(34,197,94,0.15)]' 
              : currentStep > 1 
                ? 'bg-[#07070c]/50 border-emerald-500/20 text-emerald-400' 
                : 'bg-[#07070c]/20 border-white/5 opacity-50'
          }`}>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
              currentStep === 1 ? 'bg-emerald-500 text-black' : currentStep > 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-zinc-500'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '01'}
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Identity</span>
              <span className="text-xs font-bold text-white">Boutique Profile</span>
            </div>
          </div>

          {/* Step 2 Pill */}
          <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
            currentStep === 2 
              ? 'bg-[#07070c] border-emerald-500/40 shadow-[0_0_20px_rgba(34,197,94,0.15)]' 
              : currentStep > 2 
                ? 'bg-[#07070c]/50 border-emerald-500/20 text-emerald-400' 
                : 'bg-[#07070c]/20 border-white/5 opacity-50'
          }`}>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
              currentStep === 2 ? 'bg-emerald-500 text-black' : currentStep > 2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-zinc-500'
            }`}>
              {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : '02'}
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Treasury</span>
              <span className="text-xs font-bold text-white">Payout Gateway</span>
            </div>
          </div>

          {/* Step 3 Pill */}
          <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
            currentStep === 3 
              ? 'bg-[#07070c] border-emerald-500/40 shadow-[0_0_20px_rgba(34,197,94,0.15)]' 
              : 'bg-[#07070c]/20 border-white/5 opacity-50'
          }`}>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
              currentStep === 3 ? 'bg-emerald-500 text-black' : 'bg-white/5 text-zinc-500'
            }`}>
              03
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Commission</span>
              <span className="text-xs font-bold text-white">10% Platform Terms</span>
            </div>
          </div>

        </div>

        {/* Main Step Container Frame */}
        <div className="rounded-3xl bg-[#07070c] border border-white/5 shadow-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-2xl">
          
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(34,197,94,0.25)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold text-white">Boutique Successfully Verified</h2>
                <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto">
                  Your atelier profile for <strong className="text-white">{vendorState.storeName}</strong> ({vendorState.brandHandle}) is now live. Payouts are routed directly with zero middleman fees.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 w-full max-w-md text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Merchant Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Active & Verified
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Commission Rate</span>
                  <span className="text-white font-mono">10% (Vendor Retains 90%)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Payout Channel</span>
                  <span className="text-white font-mono uppercase">{vendorState.payoutMethod} Gateway</span>
                </div>
              </div>

              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  Enter Merchant Dashboard
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ==========================================
                  STEP 1: BOUTIQUE IDENTITY PROFILE
                 ========================================== */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                      <Building className="w-5 h-5 text-emerald-400" />
                      <span>Step 1: Boutique Identity & Curation Profile</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Configure your high-fashion storefront representation across global AI discover feeds.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Store Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                        <span>Store / Atelier Name *</span>
                        <span className="text-[10px] font-mono text-zinc-500">e.g. Atelier Rostova</span>
                      </label>
                      <input
                        type="text"
                        value={vendorState.storeName}
                        onChange={(e) => setVendorState(prev => ({ ...prev, storeName: e.target.value }))}
                        placeholder="Atelier Rostova Milano"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-xs text-white placeholder-zinc-600 focus:outline-none transition-all ${
                          errors.storeName ? 'border-rose-500 focus:border-rose-500' : 'border-white/10 focus:border-emerald-500/50'
                        }`}
                      />
                      {errors.storeName && <p className="text-[10px] text-rose-400">{errors.storeName}</p>}
                    </div>

                    {/* Brand Handle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                        <span>Brand Public Handle *</span>
                        <span className="text-[10px] font-mono text-zinc-500">Alphanumeric</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-zinc-500 text-xs font-mono">@</span>
                        <input
                          type="text"
                          value={vendorState.brandHandle.replace(/^@/, '')}
                          onChange={(e) => setVendorState(prev => ({ ...prev, brandHandle: `@${e.target.value.replace(/[^a-zA-Z0-9_]/g, '')}` }))}
                          placeholder="rostova_milano"
                          className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-black/40 border text-xs text-white placeholder-zinc-600 focus:outline-none transition-all font-mono ${
                            errors.brandHandle ? 'border-rose-500 focus:border-rose-500' : 'border-white/10 focus:border-emerald-500/50'
                          }`}
                        />
                      </div>
                      {errors.brandHandle && <p className="text-[10px] text-rose-400">{errors.brandHandle}</p>}
                    </div>

                    {/* Contact Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">Commercial Contact Email *</label>
                      <input
                        type="email"
                        value={vendorState.contactEmail}
                        onChange={(e) => setVendorState(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="concierge@rostova-milano.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-xs text-white placeholder-zinc-600 focus:outline-none transition-all ${
                          errors.contactEmail ? 'border-rose-500 focus:border-rose-500' : 'border-white/10 focus:border-emerald-500/50'
                        }`}
                      />
                      {errors.contactEmail && <p className="text-[10px] text-rose-400">{errors.contactEmail}</p>}
                    </div>

                    {/* Country of Origin */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">Atelier Country of Operation</label>
                      <select
                        value={vendorState.countryOfOperation}
                        onChange={(e) => setVendorState(prev => ({ ...prev, countryOfOperation: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
                      >
                        <option value="Italy">Italy (Milano / Florence)</option>
                        <option value="France">France (Paris)</option>
                        <option value="Japan">Japan (Tokyo / Kyoto)</option>
                        <option value="United Kingdom">United Kingdom (London)</option>
                        <option value="United States">United States (New York / LA)</option>
                        <option value="Germany">Germany (Berlin)</option>
                        <option value="Sweden">Sweden (Stockholm)</option>
                        <option value="Global">Other International Jurisdiction</option>
                      </select>
                    </div>

                  </div>

                  {/* Fashion Niche Selector */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Curated Fashion Niches *</span>
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {vendorState.selectedNiches.length} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      {AVAILABLE_NICHES.map((niche) => {
                        const isSelected = vendorState.selectedNiches.includes(niche.id);
                        return (
                          <div
                            key={niche.id}
                            onClick={() => toggleNiche(niche.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-emerald-950/20 border-emerald-500/40 text-white shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                                : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold">{niche.title}</span>
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${
                                isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-700'
                              }`}>
                                {isSelected && <CheckCircle className="w-3 h-3" />}
                              </div>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                              {niche.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    {errors.selectedNiches && <p className="text-[10px] text-rose-400">{errors.selectedNiches}</p>}
                  </div>

                  {/* Brand Statement / Bio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Atelier Manifesto / Bio</label>
                    <textarea
                      rows={3}
                      value={vendorState.brandBio}
                      onChange={(e) => setVendorState(prev => ({ ...prev, brandBio: e.target.value }))}
                      placeholder="Specializing in architectural monochrome silhouettes constructed from sustainably sourced Belgian linen and virgin merino wool..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                    />
                  </div>

                </motion.div>
              )}

              {/* ==========================================
                  STEP 2: GLOBAL ALTERNATIVE PAYOUT GATEWAY
                 ========================================== */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-emerald-400" />
                      <span>Step 2: Alternative Global Payout Gateway</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Direct treasury clearing bypasses intermediary card networks. Receive 90% net sales automatically.
                    </p>
                  </div>

                  {/* Payout Mechanism Selector */}
                  <div className="grid grid-cols-3 gap-3">
                    
                    {/* IBAN / SWIFT International */}
                    <div
                      onClick={() => setVendorState(prev => ({ ...prev, payoutMethod: 'iban' }))}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                        vendorState.payoutMethod === 'iban'
                          ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)] text-white'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-zinc-400'
                      }`}
                    >
                      <Globe className={`w-5 h-5 ${vendorState.payoutMethod === 'iban' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <div>
                        <span className="text-xs font-bold block">IBAN / SWIFT</span>
                        <span className="text-[10px] font-mono text-zinc-500">EU / International</span>
                      </div>
                    </div>

                    {/* Bank Wire Routing */}
                    <div
                      onClick={() => setVendorState(prev => ({ ...prev, payoutMethod: 'wire' }))}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                        vendorState.payoutMethod === 'wire'
                          ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)] text-white'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-zinc-400'
                      }`}
                    >
                      <Landmark className={`w-5 h-5 ${vendorState.payoutMethod === 'wire' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <div>
                        <span className="text-xs font-bold block">Direct Wire</span>
                        <span className="text-[10px] font-mono text-zinc-500">ABA / Transit Wire</span>
                      </div>
                    </div>

                    {/* Digital Wallet / Freelance Treasury */}
                    <div
                      onClick={() => setVendorState(prev => ({ ...prev, payoutMethod: 'wallet' }))}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                        vendorState.payoutMethod === 'wallet'
                          ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)] text-white'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-zinc-400'
                      }`}
                    >
                      <Wallet className={`w-5 h-5 ${vendorState.payoutMethod === 'wallet' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <div>
                        <span className="text-xs font-bold block">Digital Wallet</span>
                        <span className="text-[10px] font-mono text-zinc-500">Wise / USDC / Revolut</span>
                      </div>
                    </div>

                  </div>

                  {/* Payout Specific Fields */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    
                    {/* Account Holder Legal Name (Common) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">Account Holder Legal / Corporate Entity Name *</label>
                      <input
                        type="text"
                        value={vendorState.accountHolderName}
                        onChange={(e) => setVendorState(prev => ({ ...prev, accountHolderName: e.target.value }))}
                        placeholder="Atelier Elena Rostova S.r.l."
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-xs text-white placeholder-zinc-600 focus:outline-none transition-all ${
                          errors.accountHolderName ? 'border-rose-500' : 'border-white/10 focus:border-emerald-500/50'
                        }`}
                      />
                      {errors.accountHolderName && <p className="text-[10px] text-rose-400">{errors.accountHolderName}</p>}
                    </div>

                    {/* Conditional Fields: IBAN / SWIFT */}
                    {vendorState.payoutMethod === 'iban' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                            <span>International Bank Account Number (IBAN) *</span>
                            <span className="text-[10px] font-mono text-emerald-400">Auto-Formatted with Spaces</span>
                          </label>
                          <input
                            type="text"
                            value={vendorState.freelanceIban}
                            onChange={handleIbanChange}
                            placeholder="IT60 X054 2811 1010 0000 0123 456"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-xs text-white font-mono tracking-wider placeholder-zinc-600 focus:outline-none transition-all ${
                              errors.freelanceIban ? 'border-rose-500' : 'border-white/10 focus:border-emerald-500/50'
                            }`}
                          />
                          {errors.freelanceIban && <p className="text-[10px] text-rose-400">{errors.freelanceIban}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-300">BIC / SWIFT Code *</label>
                          <input
                            type="text"
                            value={vendorState.ibanSwiftCode}
                            onChange={(e) => setVendorState(prev => ({ ...prev, ibanSwiftCode: e.target.value.toUpperCase() }))}
                            placeholder="UNCRITMMXXX"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-xs text-white font-mono uppercase placeholder-zinc-600 focus:outline-none transition-all ${
                              errors.ibanSwiftCode ? 'border-rose-500' : 'border-white/10 focus:border-emerald-500/50'
                            }`}
                          />
                          {errors.ibanSwiftCode && <p className="text-[10px] text-rose-400">{errors.ibanSwiftCode}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-300">Bank Financial Institution</label>
                          <input
                            type="text"
                            value={vendorState.bankName}
                            onChange={(e) => setVendorState(prev => ({ ...prev, bankName: e.target.value }))}
                            placeholder="UniCredit Bank Milano"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Conditional Fields: DIRECT WIRE */}
                    {vendorState.payoutMethod === 'wire' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-300">Bank Institution Name *</label>
                          <input
                            type="text"
                            value={vendorState.bankName}
                            onChange={(e) => setVendorState(prev => ({ ...prev, bankName: e.target.value }))}
                            placeholder="JPMorgan Chase Commercial"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-xs text-white placeholder-zinc-600 focus:outline-none transition-all ${
                              errors.bankName ? 'border-rose-500' : 'border-white/10 focus:border-emerald-500/50'
                            }`}
                          />
                          {errors.bankName && <p className="text-[10px] text-rose-400">{errors.bankName}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-300">ABA / Wire Routing Transit Number *</label>
                          <input
                            type="text"
                            value={vendorState.routingNumber}
                            onChange={(e) => setVendorState(prev => ({ ...prev, routingNumber: e.target.value.replace(/[^0-9]/g, '') }))}
                            placeholder="021000021"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-xs text-white font-mono placeholder-zinc-600 focus:outline-none transition-all ${
                              errors.routingNumber ? 'border-rose-500' : 'border-white/10 focus:border-emerald-500/50'
                            }`}
                          />
                          {errors.routingNumber && <p className="text-[10px] text-rose-400">{errors.routingNumber}</p>}
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-medium text-zinc-300">Treasury Checking Account Number *</label>
                          <input
                            type="text"
                            value={vendorState.accountNumber}
                            onChange={(e) => setVendorState(prev => ({ ...prev, accountNumber: e.target.value.replace(/[^0-9]/g, '') }))}
                            placeholder="987654321012"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-xs text-white font-mono placeholder-zinc-600 focus:outline-none transition-all ${
                              errors.accountNumber ? 'border-rose-500' : 'border-white/10 focus:border-emerald-500/50'
                            }`}
                          />
                          {errors.accountNumber && <p className="text-[10px] text-rose-400">{errors.accountNumber}</p>}
                        </div>
                      </div>
                    )}

                    {/* Conditional Fields: DIGITAL WALLET */}
                    {vendorState.payoutMethod === 'wallet' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'wise', label: 'Wise Treasury' },
                            { id: 'revolut', label: 'Revolut Business' },
                            { id: 'usdc', label: 'USDC (ERC-20)' },
                            { id: 'paypal', label: 'PayPal Commerce' },
                          ].map((wallet) => (
                            <button
                              type="button"
                              key={wallet.id}
                              onClick={() => setVendorState(prev => ({ ...prev, digitalWalletType: wallet.id as any }))}
                              className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                                vendorState.digitalWalletType === wallet.id
                                  ? 'bg-emerald-500/20 border-emerald-500 text-white'
                                  : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
                              }`}
                            >
                              {wallet.label}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-300">
                            {vendorState.digitalWalletType === 'usdc' ? 'USDC Recipient Address (0x...)' : 'Registered Wallet Email / Handle *'}
                          </label>
                          <input
                            type="text"
                            value={vendorState.digitalWalletAddress}
                            onChange={(e) => setVendorState(prev => ({ ...prev, digitalWalletAddress: e.target.value }))}
                            placeholder={vendorState.digitalWalletType === 'usdc' ? '0x71C...3a92' : 'finance@rostova-milano.com'}
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-xs text-white font-mono placeholder-zinc-600 focus:outline-none transition-all ${
                              errors.digitalWalletAddress ? 'border-rose-500' : 'border-white/10 focus:border-emerald-500/50'
                            }`}
                          />
                          {errors.digitalWalletAddress && <p className="text-[10px] text-rose-400">{errors.digitalWalletAddress}</p>}
                        </div>
                      </div>
                    )}

                  </div>

                </motion.div>
              )}

              {/* ==========================================
                  STEP 3: COMMISSION AGREEMENT & CONSENT
                 ========================================== */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                      <Percent className="w-5 h-5 text-emerald-400" />
                      <span>Step 3: Multi-Vendor Commission Model & Operational Consent</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Transparent 10% platform fee. Zero listing fees, zero maintenance charges, vendor keeps 90%.
                    </p>
                  </div>

                  {/* Real-time Financial Breakdown Card */}
                  <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                        Interactive Revenue Simulation
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        AOV ~$350/Garment
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300">Projected Monthly Gross Volume</span>
                        <span className="text-white font-mono font-bold">${mathCalculations.grossSales.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="2000"
                        max="100000"
                        step="1000"
                        value={vendorState.sampleProjectedMonthlySales}
                        onChange={(e) => setVendorState(prev => ({ ...prev, sampleProjectedMonthlySales: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-500/20">
                      
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                          <span>Platform Fee</span>
                          <span className="text-rose-400 font-bold">10%</span>
                        </div>
                        <div className="text-base font-mono font-bold text-rose-300">
                          -${mathCalculations.platformCommission.toLocaleString()}
                        </div>
                        <p className="text-[9px] text-zinc-500">Covers AI 3D try-ons & global edge servers</p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                        <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                          <span>Vendor Net Payout</span>
                          <span className="text-emerald-400 font-bold">90% RETAINED</span>
                        </div>
                        <div className="text-base font-mono font-bold text-emerald-300">
                          +${mathCalculations.vendorNetPayout.toLocaleString()}
                        </div>
                        <p className="text-[9px] text-emerald-400/80">Direct daily dispatch to your configured gateway</p>
                      </div>

                    </div>
                  </div>

                  {/* Operational Legal Checkboxes */}
                  <div className="space-y-3 pt-1">
                    
                    {/* Checkbox 1: 10% Flat Commission */}
                    <div 
                      onClick={() => setVendorState(prev => ({ ...prev, agreeToPlatformFee: !prev.agreeToPlatformFee }))}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        vendorState.agreeToPlatformFee ? 'bg-emerald-950/20 border-emerald-500/40 text-white' : 'bg-white/[0.02] border-white/5 text-zinc-400'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                        vendorState.agreeToPlatformFee ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-600'
                      }`}>
                        {vendorState.agreeToPlatformFee && <CheckCircle className="w-3 h-3" />}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white block">Agree to 10% Flat Marketplace Commission</span>
                        <p className="text-[11px] text-zinc-400">
                          You acknowledge that LookVision deducts a 10% commission on finalized customer orders, retaining 90% for your boutique.
                        </p>
                      </div>
                    </div>
                    {errors.agreeToPlatformFee && <p className="text-[10px] text-rose-400 pl-2">{errors.agreeToPlatformFee}</p>}

                    {/* Checkbox 2: Luxury Standards */}
                    <div 
                      onClick={() => setVendorState(prev => ({ ...prev, agreeToQualityCharter: !prev.agreeToQualityCharter }))}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        vendorState.agreeToQualityCharter ? 'bg-emerald-950/20 border-emerald-500/40 text-white' : 'bg-white/[0.02] border-white/5 text-zinc-400'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                        vendorState.agreeToQualityCharter ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-600'
                      }`}>
                        {vendorState.agreeToQualityCharter && <CheckCircle className="w-3 h-3" />}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white block">Adherence to Luxury Quality & Authenticity Charter</span>
                        <p className="text-[11px] text-zinc-400">
                          All garments fulfilled must match AI lookbook rendering specs, tailoring descriptions, and material composition accuracy.
                        </p>
                      </div>
                    </div>
                    {errors.agreeToQualityCharter && <p className="text-[10px] text-rose-400 pl-2">{errors.agreeToQualityCharter}</p>}

                    {/* Checkbox 3: Escrow & Client Protection */}
                    <div 
                      onClick={() => setVendorState(prev => ({ ...prev, agreeToReturnPolicy: !prev.agreeToReturnPolicy }))}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        vendorState.agreeToReturnPolicy ? 'bg-emerald-950/20 border-emerald-500/40 text-white' : 'bg-white/[0.02] border-white/5 text-zinc-400'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                        vendorState.agreeToReturnPolicy ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-600'
                      }`}>
                        {vendorState.agreeToReturnPolicy && <CheckCircle className="w-3 h-3" />}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white block">Escrow Release & 14-Day Fit Guarantee</span>
                        <p className="text-[11px] text-zinc-400">
                          Funds are released to your alternative payout destination upon tracking confirmation or standard delivery window completion.
                        </p>
                      </div>
                    </div>
                    {errors.agreeToReturnPolicy && <p className="text-[10px] text-rose-400 pl-2">{errors.agreeToReturnPolicy}</p>}

                  </div>

                </motion.div>
              )}

              {/* Wizard Bottom Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>
                ) : <div />}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.25)]"
                  >
                    <span>Proceed to {currentStep === 1 ? 'Payout Gateway' : 'Terms & Consent'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="py-3 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_25px_rgba(34,197,94,0.35)] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Atelier Credentials...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-black" />
                        <span>Complete Vendor Registration</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}

        </div>

        {/* Footer Security Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono text-zinc-500 pt-2">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Payout Gateway Encryption</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct Multi-Vendor Treasury Escrow</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guaranteed 90% Merchant Retention</span>
          </span>
        </div>

      </div>

    </div>
  );
};
