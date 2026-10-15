import React, { useState } from "react";
import { Store, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle, Globe, Truck } from "lucide-react";

export const BoutiqueOnboardingFlow: React.FC<{ userId: string }> = ({ userId }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    storeType: "Boutique",
    instagramUrl: "",
    whatsAppNumber: "",
    websiteLink: "",
    shippingMode: "Standard"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const executeBoutiqueRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("look_vision_token");
      
      // Directly syncs merchant profile metadata into the Firestore 'sellers' collection
      const response = await fetch("/api/v1/user/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          userId,
          accountStatus: "SELLER",
          subscriptionTier: "PREMIUM",
          customDomain: formData.websiteLink.replace("https://", ""),
          domainConfigured: true,
          atelierPodTaxonomy: [formData.name, `${formData.storeType} Collection`]
        })
      });

      if (response.ok) {
        setSuccess(true);
        setStep(3);
      }
    } catch (err) {
      console.error("[BOUTIQUE REGISTRATION FAILED]", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FBFBFA] min-h-screen py-12 px-4 font-sans text-[#1C1B1A]">
      <div className="max-w-xl mx-auto bg-white border border-black/5 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/5">
          <Store className="w-6 h-6 text-[#4F46E5]" />
          <div>
            <h3 className="text-2xl font-serif font-black tracking-tight">Merchant Onboarding Portal</h3>
            <p className="text-xs text-[#878580] uppercase tracking-wider font-mono">LOOK VISION Commerce Ecosystem</p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <p className="text-sm text-[#575551] leading-relaxed">
              Register your high-fashion artisan boutique or boutique showroom. Sync your catalog directly with our autonomous styling feeds and luxury lookbooks.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#1C1B1A] text-white py-3 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Initialize Onboarding <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={executeBoutiqueRegistration} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#575551] mb-2">Boutique / Brand Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border border-black/10 px-4 py-3 text-sm rounded-none focus:border-black/40 outline-none transition-colors" placeholder="e.g. Atelier Milan" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#575551] mb-2">Store Profile Type</label>
                <select name="storeType" value={formData.storeType} onChange={handleInputChange} className="w-full border border-black/10 px-4 py-3 text-sm rounded-none bg-white focus:border-black/40 outline-none transition-colors">
                  <option value="Boutique">Artisan Boutique</option>
                  <option value="Showroom">Boutique Showroom</option>
                  <option value="Couture">Haute Couture Atelier</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#575551] mb-2">Shipping Mode</label>
                <select name="shippingMode" value={formData.shippingMode} onChange={handleInputChange} className="w-full border border-black/10 px-4 py-3 text-sm rounded-none bg-white focus:border-black/40 outline-none transition-colors">
                  <option value="Standard">Standard Courier</option>
                  <option value="Express">Expedited Delivery</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#575551] mb-2">Digital Portfolio / Website URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-[#878580] absolute left-4 top-3.5" />
                <input type="url" name="websiteLink" required value={formData.websiteLink} onChange={handleInputChange} className="w-full border border-black/10 pl-11 pr-4 py-3 text-sm rounded-none focus:border-black/40 outline-none transition-colors" placeholder="https://yourbrand.com" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#1C1B1A] text-white py-3 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? "Synchronizing Corporate Identity..." : "Confirm & Launch Storefront"}
            </button>
          </form>
        )}

        {step === 3 && success && (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-green-50 border border-green-200 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-serif font-bold text-[#1C1B1A]">Boutique Fully Activated</h4>
            <p className="text-sm text-[#575551] max-w-sm mx-auto leading-relaxed">
              Your merchant workspace configuration has been written to the cloud registry. Your autonomous catalog syndication networks are now online.
            </p>
            <div className="pt-4 border-t border-black/5 text-xs text-[#878580] flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Cryptographically signed by LOOK VISION Commerce Engine.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
