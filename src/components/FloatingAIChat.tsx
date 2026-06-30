import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Sparkles, RefreshCw, User, Bot, HelpCircle, Check, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { WardrobeItem } from '../types';
import { UnifiedFashionOS } from '../features/ai-core/UnifiedFashionOS';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedOutfit?: any;
}

interface FloatingAIChatProps {
  wardrobe: WardrobeItem[];
}

export const FloatingAIChat: React.FC<FloatingAIChatProps> = ({ wardrobe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Welcome to AIStyleHub. I am your Sartorial Companion. Ask me to curate look spreads, analyze style coordinates, or suggest combinations from your wardrobe.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let token: string | null = null;
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      } else if (typeof localStorage !== 'undefined' && localStorage.getItem('auth_guest_active') === 'true') {
        token = 'guest-token';
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Choose endpoint depending on query context
      const isOutfitRequest = textToSend.toLowerCase().includes('outfit') || 
                            textToSend.toLowerCase().includes('curate') || 
                            textToSend.toLowerCase().includes('look') ||
                            textToSend.toLowerCase().includes('style');

      const endpoint = isOutfitRequest ? '/api/stylist/generate' : '/api/ai/recommend-mvp';
      const requestBody = isOutfitRequest 
        ? { wardrobe, userProfile: { user_preferences_vector: UnifiedFashionOS.getState().unifiedStyleMemory?.user_preferences_vector || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] } }
        : { userInput: textToSend.trim(), tenantId: 'default' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Styling service returned status ${response.status}`);
      }

      const data = await response.json();
      let assistantText = '';
      let suggestedOutfit: any = null;

      if (isOutfitRequest) {
        if (data && data.success && Array.isArray(data.outfits) && data.outfits.length > 0) {
          suggestedOutfit = data.outfits[0];
          assistantText = data.stylistNotes || `Here is a curated look for you: **${suggestedOutfit.name}**.\n\nExplanation: ${suggestedOutfit.explanation}`;
          
          // Also set this suggestion as the active suggestion in the entire app
          UnifiedFashionOS.getState().activeSuggestion = suggestedOutfit;
          UnifiedFashionOS.recalculateGoLiveGate();
          UnifiedFashionOS.notify();
        } else {
          assistantText = "I examined your wardrobe but couldn't assemble a perfect look. Try adding a couple of layer basics (blazers, classic tees) to complete your physical coordinates.";
        }
      } else {
        assistantText = data.final_recommendation || data.style_summary || "I processed your styling request. Consider styling clean minimalist shirts with relaxed tailored chinos.";
        
        if (data.outfits && data.outfits.length > 0) {
          suggestedOutfit = data.outfits[0];
          // Set as active suggestion
          UnifiedFashionOS.getState().activeSuggestion = {
            id: suggestedOutfit.id || `ai-chat-${Date.now()}`,
            name: suggestedOutfit.style_title || "Chat Recommended Outfit",
            items: suggestedOutfit.items ? Object.values(suggestedOutfit.items).filter(Boolean) as any : [],
            suitabilityScore: 92,
            occasion: data.user_profile?.occasion || "Curated Consult",
            generatedAt: new Date().toISOString(),
            vibeTags: [data.user_profile?.style || "Sartorial"]
          };
          UnifiedFashionOS.recalculateGoLiveGate();
          UnifiedFashionOS.notify();
        }
      }

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedOutfit
      }]);

    } catch (err: any) {
      console.error("[FloatingAIChat Error] Failed backend flow:", err);
      // Premium offline fallback logic
      setTimeout(() => {
        let fallbackText = "I am currently running in offline-resilient mode. Based on your style profile, I recommend: **Warm Cashmere Layering**.\n\nPair a neutral wool outerwear with raw indigo denim for a structured, classic silhouette.";
        setMessages(prev => [...prev, {
          id: `assistant-fallback-${Date.now()}`,
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOutfitToWorkspace = (outfit: any) => {
    if (!outfit) return;
    UnifiedFashionOS.getState().activeSuggestion = {
      id: outfit.id || `ai-look-${Date.now()}`,
      name: outfit.name || outfit.style_title || "Interactive Curated Look",
      items: Array.isArray(outfit.items) ? outfit.items : (outfit.items ? Object.values(outfit.items).filter(Boolean) as any : []),
      suitabilityScore: outfit.suitabilityScore || outfit.score || 95,
      occasion: outfit.occasion || "Sartorial Consult",
      generatedAt: new Date().toISOString(),
      vibeTags: outfit.vibeTags || [outfit.styleIdentity || "Slate Aesthetics"]
    };
    UnifiedFashionOS.recalculateGoLiveGate();
    UnifiedFashionOS.notify();

    // Scroll to active suggestion viewport
    const element = document.getElementById('classification-tabs-start');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const samplePrompts = [
    "Curate an outfit from my wardrobe",
    "What is the Tokyo Streetwear trend?",
    "Suggest a luxury winter vibe",
  ];

  return (
    <>
      {/* FLOAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-[99]" id="floating-ai-stylist-trigger">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-4 rounded-full bg-white text-black hover:bg-neutral-200 shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
          
          <span className="absolute right-14 whitespace-nowrap py-1.5 px-3 rounded-lg bg-zinc-900 border border-white/10 text-[9.5px] font-mono uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Sartorial Companion
          </span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-black animate-pulse" />
        </button>
      </div>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 w-[380px] h-[520px] rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden z-[100]"
            id="floating-ai-stylist-chatbox"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/5 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Sartorial Companion</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-light">Engine Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <div className={`p-1.5 rounded-lg h-7 w-7 flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'bg-white/10 text-white' : 'bg-white/5 text-neutral-400'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1.5 max-w-[75%]">
                    <div className={`p-3 rounded-xl text-xs font-mono leading-relaxed tracking-tight ${
                      msg.sender === 'user' 
                        ? 'bg-white text-black font-medium' 
                        : 'bg-white/[0.03] text-neutral-300 border border-white/5'
                    }`}>
                      {msg.text}

                      {/* Interactive suggested outfit card inside chat */}
                      {msg.suggestedOutfit && (
                        <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/10 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400">CURATED LOOK</span>
                            <span className="text-[9px] font-mono text-white/40">{msg.suggestedOutfit.suitabilityScore || msg.suggestedOutfit.score || 95}% Match</span>
                          </div>
                          <h4 className="text-[11px] font-mono font-semibold text-white truncate">{msg.suggestedOutfit.name || msg.suggestedOutfit.style_title}</h4>
                          <button
                            onClick={() => loadOutfitToWorkspace(msg.suggestedOutfit)}
                            className="w-full py-1.5 px-2 bg-white text-black hover:bg-neutral-200 rounded text-[9.5px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <span>Load Look</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[8.5px] font-mono text-white/20 block">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 text-left animate-pulse">
                  <div className="p-1.5 rounded-lg h-7 w-7 flex items-center justify-center bg-white/5 text-neutral-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3 rounded-xl text-[10px] font-mono bg-white/[0.02] text-amber-300 border border-white/5">
                    Analyzing fashion coordinates and wardrobe pieces...
                  </div>
                </div>
              )}

              {error && (
                <div className="p-2.5 rounded-xl text-[9px] font-mono bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sample Action chips */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none bg-black/20">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="py-1 px-2 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 text-[9px] font-mono transition-all cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 border-t border-white/5 bg-zinc-950 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to style or curate a look..."
                disabled={isLoading}
                className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all font-light"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
