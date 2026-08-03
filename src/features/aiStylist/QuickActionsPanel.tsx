import React from 'react';
import { motion } from 'motion/react';
import {
  Shirt,
  Sparkles,
  Eye,
  Camera,
  Video,
  ShoppingBag,
  Palette,
  Search,
  Zap
} from 'lucide-react';
import { StylistIntent, StylistAction, StylistActionType } from '../../ai/stylist';

export interface QuickActionItem {
  id: string;
  label: string;
  intent: StylistIntent;
  prompt: string;
  icon: React.ElementType;
  gradient: string;
  actionType: StylistActionType;
}

export interface QuickActionsPanelProps {
  onSelectAction: (
    prompt: string,
    intent: StylistIntent,
    actionType: StylistActionType
  ) => void;
  disabled?: boolean;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ onSelectAction, disabled }) => {
  const actions: QuickActionItem[] = [
    {
      id: 'gen_outfit',
      label: 'Generate Outfit',
      intent: 'OUTFIT',
      prompt: 'Curate a luxury complete outfit based on my Style DNA for an upscale event.',
      icon: Sparkles,
      gradient: 'from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/30',
      actionType: 'SAVE_OUTFIT'
    },
    {
      id: 'analyze_closet',
      label: 'Analyze Wardrobe',
      intent: 'WARDROBE',
      prompt: 'Perform a full digital wardrobe audit, highlighting gaps and versatile pairing options.',
      icon: Shirt,
      gradient: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30',
      actionType: 'ADD_TO_WARDROBE'
    },
    {
      id: 'try_on',
      label: 'Virtual Try-On',
      intent: 'TRY_ON',
      prompt: 'Initiate 3D Photorealistic Virtual Try-On with my digital body avatar.',
      icon: Eye,
      gradient: 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30',
      actionType: 'OPEN_TRY_ON'
    },
    {
      id: 'color_analysis',
      label: 'Color Analysis',
      intent: 'COLOR',
      prompt: 'Analyze seasonal skin tone undertones and generate an optimal color palette chart.',
      icon: Palette,
      gradient: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
      actionType: 'APPLY_PRESET'
    },
    {
      id: 'create_image',
      label: 'Create Image',
      intent: 'IMAGE',
      prompt: 'Generate hyper-realistic studio lookbook imagery for my active outfit.',
      icon: Camera,
      gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
      actionType: 'NAVIGATE'
    },
    {
      id: 'create_video',
      label: 'Create Video',
      intent: 'VIDEO',
      prompt: 'Synthesize a 1080p high-fashion runway motion video clip of this outfit.',
      icon: Video,
      gradient: 'from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/30',
      actionType: 'NAVIGATE'
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      intent: 'MARKETPLACE',
      prompt: 'Search luxury designer marketplace for matching pieces with real-time stock availability.',
      icon: ShoppingBag,
      gradient: 'from-emerald-600/20 to-green-600/20 text-emerald-300 border-emerald-500/30',
      actionType: 'SEARCH_MARKETPLACE'
    },
    {
      id: 'find_matching',
      label: 'Matching Items',
      intent: 'SHOPPING',
      prompt: 'Find complimentary accessories, footwear, and outerwear to complete this look.',
      icon: Search,
      gradient: 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30',
      actionType: 'NAVIGATE'
    }
  ];

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#06060c]/90 p-3.5 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-indigo-400" />
          AI Neural Command Suite
        </h4>
        <span className="text-[10px] font-mono text-zinc-400">
          One-Tap OS Triggers
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
        {actions.map(action => {
          const IconComp = action.icon;
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={disabled}
              onClick={() => onSelectAction(action.prompt, action.intent, action.actionType)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border bg-gradient-to-b ${action.gradient} hover:brightness-125 transition-all text-center group disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <IconComp className="h-4 w-4 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium leading-tight text-zinc-200 truncate w-full">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
