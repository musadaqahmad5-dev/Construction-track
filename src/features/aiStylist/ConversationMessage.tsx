import React from 'react';
import { motion } from 'motion/react';
import { User, Sparkles, Zap, ArrowRight, CornerDownRight } from 'lucide-react';
import { ConversationMessage as MessageType, StylistAction } from '../../ai/stylist';
import { RecommendationCards } from './RecommendationCards';

export interface ConversationMessageProps {
  message: MessageType;
  onExecuteAction?: (action: StylistAction) => void;
}

export const ConversationMessage: React.FC<ConversationMessageProps> = ({ message, onExecuteAction }) => {
  const isUser = message.role === 'user';
  const responsePayload = message.responsePayload;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 border border-white/20 shadow-md text-white">
          <Sparkles className="h-4 w-4" />
        </div>
      )}

      <div className={`max-w-[85%] md:max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 px-1">
          <span className="text-[11px] font-medium text-zinc-400">
            {isUser ? 'You' : 'AI Stylist Companion'}
          </span>
          <span className="text-[10px] font-mono text-zinc-600">
            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
          {message.intent && !isUser && (
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              {message.intent}
            </span>
          )}
          {responsePayload?.confidence !== undefined && (
            <span className="flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Zap className="h-2.5 w-2.5" />
              {Math.round(responsePayload.confidence * 100)}%
            </span>
          )}
        </div>

        <div
          className={`rounded-2xl p-4 text-sm leading-relaxed border ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/30 rounded-tr-none shadow-md'
              : 'bg-[#0a0a14]/90 text-zinc-200 border-white/10 rounded-tl-none backdrop-blur-md shadow-xl'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {responsePayload?.recommendations && responsePayload.recommendations.length > 0 && (
          <RecommendationCards
            recommendations={responsePayload.recommendations}
            onExecuteAction={onExecuteAction}
          />
        )}

        {responsePayload?.actions && responsePayload.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {responsePayload.actions.map(action => (
              <button
                key={action.id}
                onClick={() => onExecuteAction?.(action)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all hover:scale-[1.02]"
              >
                <CornerDownRight className="h-3.5 w-3.5" />
                {action.label}
              </button>
            ))}
          </div>
        )}

        {responsePayload?.followUpQuestions && responsePayload.followUpQuestions.length > 0 && (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 mt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Suggested Follow-ups
            </span>
            <div className="flex flex-col gap-1">
              {responsePayload.followUpQuestions.map((q, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() =>
                    onExecuteAction?.({
                      id: `act_followup_${qIdx}`,
                      type: 'NAVIGATE',
                      label: q,
                      payload: { prompt: q }
                    })
                  }
                  className="text-left text-xs text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5 py-1 hover:underline"
                >
                  <ArrowRight className="h-3 w-3 shrink-0" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 text-zinc-300">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
};
