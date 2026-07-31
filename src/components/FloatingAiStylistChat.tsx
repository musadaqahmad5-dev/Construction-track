import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Send,
  X,
  MessageSquare,
  Bot,
  User,
  Loader2,
  RefreshCw,
  Minimize2
} from 'lucide-react';
import {
  useThemeIntelligence,
  ThemeCoatRenderer,
  FoundationInteractionWrapper
} from '../engine';

export interface MessageNode {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

interface FloatingAiStylistChatProps {
  initialMessages?: MessageNode[];
  onSendMessage?: (text: string) => Promise<string | void>;
}

const DEFAULT_INITIAL_MESSAGES: MessageNode[] = [
  {
    id: 'msg_1',
    sender: 'ai',
    text: 'Greetings. I am your LOOK VISION AI Stylist. How can I refine your ensemble or occasion agenda today?',
    timestamp: Date.now() - 60000
  }
];

export const FloatingAiStylistChat: React.FC<FloatingAiStylistChatProps> = ({
  initialMessages = DEFAULT_INITIAL_MESSAGES,
  onSendMessage
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageNode[]>(initialMessages);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Safely connect to Theme Intelligence Engine
  let themeCtx: ReturnType<typeof useThemeIntelligence> | null = null;
  try {
    themeCtx = useThemeIntelligence();
  } catch {
    themeCtx = null;
  }

  const themeDNA = themeCtx?.themeDNA;
  const coatDNA = themeCtx?.coatDNA;
  const sequenceId = themeCtx?.sequenceId;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, scrollToBottom]);

  const dispatchStylistMessage = async (text: string): Promise<void> => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: MessageNode = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      text: trimmed,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      if (onSendMessage) {
        const customResponse = await onSendMessage(trimmed);
        if (customResponse) {
          const aiReplyNode: MessageNode = {
            id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            sender: 'ai',
            text: customResponse,
            timestamp: Date.now()
          };
          setMessages((prev) => [...prev, aiReplyNode]);
          return;
        }
      }

      // Default AI endpoint call or fallback generation
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are LOOK VISION AI Stylist, a high-fashion cognitive intelligence assistant. Provide a brief, sophisticated recommendation for: "${trimmed}"`
        })
      });

      let responseText = 'For this occasion, I recommend balancing structured tailored outer layers with fluid silk undertones for high-contrast sartorial harmony.';

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          responseText = data.text;
        }
      }

      const aiMessage: MessageNode = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'ai',
        text: responseText,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      // Fallback message if network is unreachable
      const fallbackMessage: MessageNode = {
        id: `ai_err_${Date.now()}`,
        sender: 'ai',
        text: 'I recommend curating an Italian Velvet Blazer paired with Tailored Wool Trousers and a subtle metallic accessory accent.',
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      dispatchStylistMessage(inputText);
    }
  };

  const renderChatDrawer = () => {
    const chatContent = (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden text-zinc-100">
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-[#0a0718] to-slate-950 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-white uppercase flex items-center gap-1.5">
                LOOK VISION AI Stylist
                {sequenceId && (
                  <span className="text-[8px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 rounded hidden sm:inline-block" title={`Theme Sequence: ${sequenceId}`}>
                    {sequenceId.substring(0, 10)}...
                  </span>
                )}
              </h3>
              <span className="flex items-center space-x-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cognitive Neural Mesh Active</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Close chat"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-indigo-500/20">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  isAi ? 'justify-start' : 'justify-end'
                }`}
              >
                {isAi && (
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    isAi
                      ? 'bg-[#0d0724] border border-indigo-500/20 text-zinc-200 rounded-tl-none shadow-sm'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[9px] text-zinc-400 text-right opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {!isAi && (
                  <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-2.5 text-xs text-indigo-300">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-none bg-[#0d0724] border border-indigo-500/20 flex items-center space-x-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span className="text-[11px] text-zinc-400">Synthesizing sartorial recommendation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Entry Component */}
        <div className="p-3 bg-slate-950/90 border-t border-white/10 shrink-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Ask about styling, occasions, or fabric combinations..."
              className="flex-1 min-h-[42px] px-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
            />
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                type="button"
                disabled={!inputText.trim() || isTyping}
                onClick={() => dispatchStylistMessage(inputText)}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:hover:from-indigo-500 disabled:hover:to-purple-600 text-white flex items-center justify-center transition-all shrink-0 shadow-lg shadow-indigo-500/20 cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </FoundationInteractionWrapper>
          </div>
        </div>
      </div>
    );

    const drawerClasses = "fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[80vh] bg-slate-950/90 border border-white/10 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.2)] flex flex-col justify-between overflow-hidden animate-fade-in text-zinc-100";

    if (coatDNA) {
      return (
        <ThemeCoatRenderer coatDNA={coatDNA} className={drawerClasses}>
          {chatContent}
        </ThemeCoatRenderer>
      );
    }

    return <div className={drawerClasses}>{chatContent}</div>;
  };

  return (
    <>
      {/* Floating Chat Drawer Wrapper */}
      {isOpen && renderChatDrawer()}

      {/* Persistent Bottom-Right Floating Switcher Button */}
      <FoundationInteractionWrapper themeDNA={themeDNA}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="fixed bottom-6 right-6 z-50 w-[52px] h-[52px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
          aria-label="Toggle AI Stylist Chat"
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
            {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </div>
        </button>
      </FoundationInteractionWrapper>
    </>
  );
};

