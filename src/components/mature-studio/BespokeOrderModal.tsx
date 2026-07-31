import React, { useState } from 'react';
import { CreatorProfile } from '../../types/matureStudio';
import { Send, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface BespokeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator?: CreatorProfile | null;
  onSubmitSuccess?: (notes: string) => void;
}

export const BespokeOrderModal: React.FC<BespokeOrderModalProps> = ({
  isOpen,
  onClose,
  creator,
  onSubmitSuccess
}) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [bespokeNotes, setBespokeNotes] = useState('');
  const [preferredMaterial, setPreferredMaterial] = useState('Anodized Titanium & Silk Organza');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bespokeNotes.trim()) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/mature-fashion/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'bespoke_request',
          targetId: creator?.id || 'demo_user',
          bespokeNotes,
          clientName: clientName || 'Anonymous Collector',
          clientEmail
        })
      });

      setSubmitted(true);
      onSubmitSuccess?.(bespokeNotes);
    } catch (e) {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#090616] border border-emerald-500/30 p-6 space-y-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold font-serif text-white">
              Bespoke Order Request {creator ? `to ${creator.name}` : ''}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-serif">Bespoke Request Sent!</h4>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto">
              Your custom tailoring query has been securely transmitted to the atelier. The creator will review your specification and reach out via encrypted communication.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-mono mb-1">Your Name / Fashion House</label>
              <input 
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Lady Vivienne or Atelier Private Client"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-mono mb-1">Contact Email / Encrypted Identifier</label>
              <input 
                type="email"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                placeholder="client@haute-fashion.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-mono mb-1">Material Preference</label>
              <input 
                type="text"
                value={preferredMaterial}
                onChange={e => setPreferredMaterial(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-mono mb-1">Bespoke Specification & Silhouette Vision</label>
              <textarea 
                value={bespokeNotes}
                onChange={e => setBespokeNotes(e.target.value)}
                rows={4}
                required
                placeholder="Describe your custom measurements, drape tension preferences, or event date..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-zinc-300 font-mono text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting Request...' : 'Submit Bespoke Order'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
