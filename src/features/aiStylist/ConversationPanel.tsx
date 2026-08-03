import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, RefreshCw, Trash2, Sliders, DollarSign, Calendar } from 'lucide-react';
import { ConversationMessage as MessageType, StylistIntent, StylistAction } from '../../ai/stylist';
import { ConversationMessage } from './ConversationMessage';
import { ThinkingIndicator } from './ThinkingIndicator';
import { StreamingMessageRenderer } from './StreamingMessageRenderer';
import { ThinkingState } from './hooks/useAIStylistWorkspace';

export interface ConversationPanelProps {
  sessionId: string;
  messages: MessageType[];
  thinking: ThinkingState;
  isProcessing: boolean;
  activeIntent: StylistIntent;
  streaming?: any;
  onSendMessage: (
    prompt: string,
    options?: {
      imageUrl?: string;
      overrideIntent?: StylistIntent;
      occasion?: string;
      budget?: number;
    }
  ) => void;
  onExecuteAction?: (action: StylistAction) => void;
  onResetSession: () => void;
}

const INTENTS: StylistIntent[] = [
  'GENERAL',
  'OUTFIT',
  'WARDROBE',
  'SHOPPING',
  'TREND',
  'STYLE_ADVICE',
  'COLOR',
  'TRY_ON',
  'IMAGE',
  'VIDEO'
];

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  sessionId,
  messages,
  thinking,
  isProcessing,
  activeIntent,
  streaming,
  onSendMessage,
  onExecuteAction,
  onResetSession
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showImageInput, setShowImageInput] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [overrideIntent, setOverrideIntent] = useState<StylistIntent | ''>('');
  const [occasion, setOccasion] = useState<string>('');
  const [budget, setBudget] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking.isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!prompt.trim() && !imageUrl.trim()) || isProcessing) return;

    onSendMessage(prompt, {
      imageUrl: imageUrl.trim() || undefined,
      overrideIntent: (overrideIntent as StylistIntent) || undefined,
      occasion: occasion.trim() || undefined,
      budget: budget ? Number(budget) : undefined
    });

    setPrompt('');
    setImageUrl('');
    setShowImageInput(false);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-[#06060c]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#090914]/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#06060c]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-100 tracking-wide">
                AI Stylist Intelligence Workspace
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                {activeIntent}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Session: {sessionId.substring(0, 18)}...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              showAdvanced
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Advanced Parameters"
          >
            <Sliders className="h-4 w-4" />
          </button>
          <button
            onClick={onResetSession}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 text-xs transition-colors"
            title="Reset Conversation Session"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="px-5 py-3 bg-[#0c0c1a] border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
              Intent Override
            </label>
            <select
              value={overrideIntent}
              onChange={e => setOverrideIntent(e.target.value as StylistIntent)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Auto-Detect Intent</option>
              {INTENTS.map(intent => (
                <option key={intent} value={intent}>
                  {intent}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
              Occasion Target
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Gala, Date Night, Paris Tech Summit"
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 pl-8 pr-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
              <Calendar className="h-3.5 w-3.5 absolute left-2.5 top-2 text-zinc-500" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
              Max Budget ($)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 1500"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 pl-8 pr-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
              <DollarSign className="h-3.5 w-3.5 absolute left-2.5 top-2 text-zinc-500" />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="max-w-md space-y-2">
              <h4 className="text-base font-bold text-zinc-100">
                LOOK VISION AI Stylist Active
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ask for custom outfit recommendations, wardrobe audits, color palette analyses, or high-fashion trend curations.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ConversationMessage
              key={msg.id || index}
              message={msg}
              onExecuteAction={onExecuteAction}
            />
          ))
        )}

        {streaming && streaming.streamMetadata && streaming.streamMetadata.status !== 'Idle' && (
          <StreamingMessageRenderer
            metadata={streaming.streamMetadata}
            streamedText={streaming.streamedText}
            recommendations={streaming.recommendations}
            onCancel={streaming.cancel}
            onInterrupt={streaming.interrupt}
            onRetry={streaming.retry}
            onResume={streaming.resume}
            onExecuteAction={onExecuteAction}
          />
        )}

        <ThinkingIndicator thinking={thinking} />
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-[#080812]">
        {showImageInput && (
          <div className="mb-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Paste Image URL for style visual query..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => setShowImageInput(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Cancel
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className={`p-2.5 rounded-xl border text-zinc-400 hover:text-zinc-200 transition-colors ${
              imageUrl ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-white/5 border-white/10'
            }`}
            title="Attach Image Reference"
          >
            <ImageIcon className="h-4 w-4" />
          </button>

          <input
            type="text"
            placeholder="Ask AI Stylist... (e.g. 'Curate an evening look for Paris Fashion Week under $2000')"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={isProcessing}
            className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isProcessing || (!prompt.trim() && !imageUrl.trim())}
            className="flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg disabled:opacity-40 transition-all hover:scale-[1.02]"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
