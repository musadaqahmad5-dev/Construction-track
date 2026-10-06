import React, { useState } from 'react';
import { ConversationPanel } from './ConversationPanel';
import { ContextSidebar } from './ContextSidebar';
import { QuickActionsPanel } from './QuickActionsPanel';
import { ConversationMessage, StylistIntent, StylistRecommendation, StylistAction } from '../../ai/stylist';
import { ThinkingState } from './hooks/useAIStylistWorkspace';
import { Sparkles, Layout, MessageSquare, Sidebar, Zap } from 'lucide-react';

export interface WorkspaceLayoutProps {
  sessionId: string;
  messages: ConversationMessage[];
  thinking: ThinkingState;
  isProcessing: boolean;
  activeIntent: StylistIntent;
  styleProfile: Record<string, any>;
  recommendations: StylistRecommendation[];
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

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  sessionId,
  messages,
  thinking,
  isProcessing,
  activeIntent,
  styleProfile,
  recommendations,
  streaming,
  onSendMessage,
  onExecuteAction,
  onResetSession
}) => {
  const [mobileTab, setMobileTab] = useState<'conversation' | 'context'>('conversation');

  return (
    <div className="flex flex-col w-full h-full min-h-[750px] flex-1 max-w-[1700px] mx-auto p-3 sm:p-4 gap-4 bg-[#05050a] text-zinc-100 font-sans select-none">
      {/* Mobile view toggle tabs */}
      <div className="lg:hidden flex items-center justify-between p-1.5 rounded-xl border border-white/10 bg-[#080814]">
        <button
          onClick={() => setMobileTab('conversation')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-colors ${
            mobileTab === 'conversation'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Workspace & Conversation
        </button>

        <button
          onClick={() => setMobileTab('context')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-colors ${
            mobileTab === 'context'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sidebar className="h-4 w-4" />
          Neural Context & Status
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left + Center Area: Conversation & Recommendation Workspace */}
        <div
          className={`lg:col-span-8 flex flex-col h-full overflow-hidden ${
            mobileTab === 'conversation' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <ConversationPanel
            sessionId={sessionId}
            messages={messages}
            thinking={thinking}
            isProcessing={isProcessing}
            activeIntent={activeIntent}
            streaming={streaming}
            onSendMessage={onSendMessage}
            onExecuteAction={onExecuteAction}
            onResetSession={onResetSession}
          />
        </div>

        {/* Right Area: Neural Context Sidebar */}
        <div
          className={`lg:col-span-4 h-full overflow-hidden ${
            mobileTab === 'context' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <ContextSidebar
            styleDNA={styleProfile}
            messageCount={messages.length}
            sessionActive={!isProcessing}
            recommendations={recommendations}
            onExecuteAction={onExecuteAction}
          />
        </div>
      </div>

      {/* Bottom Quick Commands Bar */}
      <div className="shrink-0">
        <QuickActionsPanel
          disabled={isProcessing}
          onSelectAction={(prompt, intent, actionType) => {
            onSendMessage(prompt, { overrideIntent: intent });
            if (onExecuteAction) {
              onExecuteAction({
                id: `quick_${Date.now()}`,
                type: actionType,
                label: intent,
                payload: { prompt }
              });
            }
          }}
        />
      </div>
    </div>
  );
};
