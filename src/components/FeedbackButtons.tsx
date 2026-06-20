import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, RefreshCw, XCircle } from 'lucide-react';

interface FeedbackButtonsProps {
  onWear: () => void;
  onSkip: () => void;
  onModify?: () => void;
  wearLabel?: string;
  skipLabel?: string;
  modifyLabel?: string;
  id?: string;
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  onWear,
  onSkip,
  onModify,
  wearLabel = 'Wear Look',
  skipLabel = 'Skip',
  modifyLabel = 'Modify Fit',
  id
}) => {
  return (
    <div id={id || "feedback-decision-buttons"} className="flex flex-wrap gap-3 items-center justify-start mt-4">
      {/* Wear Button */}
      <motion.button
        id="btn-feedback-wear"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onWear}
        className="px-4 py-2 bg-white text-black hover:bg-zinc-100 rounded-lg text-xs font-mono font-medium tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-sm cursor-pointer border border-white"
      >
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>{wearLabel}</span>
      </motion.button>

      {/* Modify Button (Optional) */}
      {onModify && (
        <motion.button
          id="btn-feedback-modify"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onModify}
          className="px-4 py-2 bg-white/[0.04] text-white/85 hover:bg-white/[0.08] hover:text-white border border-white/10 rounded-lg text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{modifyLabel}</span>
        </motion.button>
      )}

      {/* Skip/Reject Button */}
      <motion.button
        id="btn-feedback-skip"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSkip}
        className="px-4 py-2 bg-white/[0.02] text-white/45 hover:bg-red-950/20 hover:text-red-400 border border-white/5 hover:border-red-900/10 rounded-lg text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <XCircle className="w-3.5 h-3.5" />
        <span>{skipLabel}</span>
      </motion.button>
    </div>
  );
};
