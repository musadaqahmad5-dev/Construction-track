import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Square,
  RotateCcw,
  Play,
  Zap,
  AlertTriangle,
  CornerDownLeft
} from 'lucide-react';
import { StylistResponse, StylistRecommendation, StylistAction } from '../../ai/stylist';
import { ConversationStateMetadata } from './RealtimeConversationState';
import { LiveThinkingPipeline } from './LiveThinkingPipeline';
import { ProgressiveRecommendationRenderer } from './ProgressiveRecommendationRenderer';

export interface StreamingMessageRendererProps {
  metadata: ConversationStateMetadata;
  streamedText: string;
  recommendations: StylistRecommendation[];
  onCancel?: () => void;
  onInterrupt?: () => void;
  onRetry?: () => void;
  onResume?: () => void;
  onExecuteAction?: (action: StylistAction) => void;
}

export const StreamingMessageRenderer: React.FC<StreamingMessageRendererProps> = ({
  metadata,
  streamedText,
  recommendations,
  onCancel,
  onInterrupt,
  onRetry,
  onResume,
  onExecuteAction
}) => {
  const { status, errorMessage, canCancel, canRetry, canResume } = metadata;

  if (status === 'Idle') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4 my-3"
    >
      {/* Live Thinking Pipeline Stage Bar */}
      <LiveThinkingPipeline metadata={metadata} expandedDefault={status === 'Thinking'} />

      {/* Streamed Content Card */}
      {(streamedText || status === 'Streaming' || status === 'Generating') && (
        <div className="rounded-2xl border border-white/10 bg-[#080814]/90 p-5 shadow-2xl backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-zinc-200">
                AI Stylist Live Stream
              </span>
            </div>

            {/* Stream Action Buttons */}
            <div className="flex items-center gap-2">
              {canCancel && onInterrupt && (
                <button
                  onClick={onInterrupt}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Square className="h-3 w-3" />
                  <span>Interrupt</span>
                </button>
              )}

              {canCancel && onCancel && (
                <button
                  onClick={onCancel}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Square className="h-3 w-3" />
                  <span>Cancel</span>
                </button>
              )}

              {canRetry && onRetry && (
                <button
                  onClick={onRetry}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retry Stream</span>
                </button>
              )}

              {canResume && onResume && (
                <button
                  onClick={onResume}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Play className="h-3 w-3" />
                  <span>Resume Stream</span>
                </button>
              )}
            </div>
          </div>

          {/* Streamed Body Text with Cursor */}
          <div className="text-sm text-zinc-200 leading-relaxed font-normal whitespace-pre-wrap">
            {streamedText}
            {['Streaming', 'Generating', 'Thinking'].includes(status) && (
              <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse rounded-sm align-middle" />
            )}
          </div>

          {/* Error Container if stream failed */}
          {status === 'Failed' && errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Progressive Recommendations */}
      <ProgressiveRecommendationRenderer
        recommendations={recommendations}
        isStreaming={['Streaming', 'Generating'].includes(status)}
        onExecuteAction={onExecuteAction}
      />
    </motion.div>
  );
};
