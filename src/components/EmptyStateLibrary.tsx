import React from 'react';

interface EmptyStateProps {
  type: 'no_wardrobe' | 'no_planner' | 'no_feedback' | 'offline' | 'guest_mode';
  onAction?: () => void;
  onSecondaryAction?: () => void;
  isOnline?: boolean;
}

export const EmptyStateLibrary: React.FC<EmptyStateProps> = ({ 
  type, 
  onAction, 
  onSecondaryAction,
  isOnline = true
}) => {
  switch (type) {
    case 'no_wardrobe':
      return (
        <div id="empty-state-no-wardrobe" className="py-24 text-center space-y-6 max-w-md mx-auto select-none">
          <div className="space-y-2">
            <h4 className="font-serif font-light tracking-[-0.03em] text-2xl text-white">Nothing here yet.</h4>
            <p className="text-sm text-white/30 max-w-sm mx-auto leading-relaxed font-light italic font-serif">
              Begin with one piece.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <button
              id="cta-load-samples"
              onClick={onAction}
              className="bg-white hover:bg-[#EAEAEA] text-black font-mono text-[11px] font-semibold py-4 px-10 rounded-none uppercase tracking-[0.25em] cursor-pointer transition-all active:scale-[0.99]"
            >
              [ Add Something ]
            </button>
          </div>
        </div>
      );

    case 'no_planner':
      return (
        <div id="empty-state-no-planner" className="py-16 text-center space-y-8 max-w-md mx-auto select-none">
          <div className="space-y-3">
            <h4 className="font-serif font-normal tracking-[-0.03em] text-3xl text-white">Nothing here yet.</h4>
            <p className="text-sm text-white/40 max-w-sm mx-auto leading-relaxed font-light italic font-serif">
              "Left in place."
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <button
              id="cta-schedule-quick"
              onClick={onAction}
              className="border border-[rgba(255,255,255,0.2)] hover:border-white text-white font-mono text-[11px] font-semibold py-4 px-10 rounded-none uppercase tracking-[0.25em] cursor-pointer transition-all active:scale-[0.99]"
            >
              [ Place Look ]
            </button>
          </div>
        </div>
      );

    case 'no_feedback':
      return (
        <div id="empty-state-no-feedback" className="py-16 text-center space-y-8 max-w-md mx-auto select-none">
          <div className="space-y-3">
            <h4 className="font-serif font-normal tracking-[-0.03em] text-3xl text-white">Nothing here yet.</h4>
            <p className="text-sm text-white/40 max-w-sm mx-auto leading-relaxed font-light italic font-serif">
               "Still here."
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <button
              id="cta-jump-home"
              onClick={onAction}
              className="bg-white hover:bg-[#EAEAEA] text-black font-mono text-[11px] font-semibold py-4 px-10 rounded-none uppercase tracking-[0.25em] cursor-pointer transition-all active:scale-[0.99]"
            >
              [ Morning table ]
            </button>
          </div>
        </div>
      );

    case 'offline':
      return (
        <div id="empty-state-offline" className="py-16 text-center space-y-8 max-w-md mx-auto select-none">
          <div className="space-y-3">
            <h4 className="font-serif font-normal tracking-[-0.03em] text-3xl text-white">Offline focus</h4>
            <p className="text-sm text-white/40 max-w-sm mx-auto leading-relaxed font-light italic font-serif">
               "Your garments and unwritten desk are securely remembered in the quiet memory of your device."
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <button
              id="cta-offline-ok"
              onClick={onAction}
              className="border border-[rgba(255,255,255,0.2)] hover:border-white text-white font-mono text-[11px] font-semibold py-4 px-10 rounded-none uppercase tracking-[0.25em] cursor-pointer transition-all active:scale-[0.99]"
            >
              [ Continue ]
            </button>
          </div>
        </div>
      );

    case 'guest_mode':
      return (
        <div id="empty-state-guest" className="py-8 flex flex-col sm:flex-row items-center justify-between text-left gap-6 max-w-xl mx-auto border-t border-white/5 mt-12 pt-8">
          <div className="space-y-2 text-center sm:text-left">
            <h5 className="font-serif font-normal tracking-[-0.03em] text-2xl text-white">Local companion</h5>
            <p className="text-sm text-white/40 font-light max-w-md leading-relaxed italic font-serif">
              "Your signatures are remembered locally. Secure your space to remember garments permanently."
            </p>
          </div>
          <button
            id="cta-guest-auth"
            onClick={onAction}
            className="bg-white hover:bg-[#EAEAEA] text-black font-mono text-[11px] font-semibold py-4 px-10 rounded-none uppercase tracking-[0.25em] transition-all cursor-pointer whitespace-nowrap active:scale-[0.99]"
          >
            [ Preserve Space ]
          </button>
        </div>
      );

    default:
      return null;
  }
};
