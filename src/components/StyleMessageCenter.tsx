import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, Sparkles, User, Bot, Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { auth } from '../firebase';
import { WardrobeItem } from '../platform';
import { UnifiedFashionOS } from '../engine';

interface StyleMessageCenterProps {
  wardrobe: WardrobeItem[];
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface Curator {
  id: string;
  name: string;
  role: string;
  imgUrl: string;
  vibe: string;
  bio: string;
  initialWelcome: string;
}

export const StyleMessageCenter: React.FC<StyleMessageCenterProps> = ({ wardrobe }) => {
  const curators: Curator[] = [
    {
      id: 'curator-1',
      name: 'Aurelia Vance',
      role: 'High-Fashion & Editorial Curator',
      imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      vibe: 'Avant-Garde & High Tailoring',
      bio: 'Former haute couture editorial director. Expert in architectural lines and dark silhouettes.',
      initialWelcome: 'Greetings. I have analyzed your style DNA. Let us collaborate to sculpt your next high-contrast capsule coordinates.'
    },
    {
      id: 'curator-2',
      name: 'Kaito Tanaka',
      role: 'Cyber Couture & Streetwear Lead',
      imgUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      vibe: 'Tech-Wear & Utility Layers',
      bio: 'Streetwear pioneer from Tokyo. Specializes in asymmetric utility vests, layered shells, and functional silhouettes.',
      initialWelcome: 'Yo! Ready to elevate your rotation? I can guide you on integrating techwear components and raw denims with your current wardrobe.'
    },
    {
      id: 'curator-3',
      name: 'Sven Lindqvist',
      role: 'Nordic Minimalist Designer',
      imgUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      vibe: 'Nordic Warm & Beige Neutrals',
      bio: 'Sartorial advisor hailing from Stockholm. Dedicated to clean organic lines, soft cashmere, and muted off-whites.',
      initialWelcome: 'Welcome. Styling is an exercise in restraint. Let us focus on premium simple lines, high comfort, and elegant neutral layering.'
    }
  ];

  const [activeCuratorId, setActiveCuratorId] = useState<string>('curator-1');
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({
    'curator-1': [
      {
        id: 'w-1',
        sender: 'assistant',
        text: curators[0].initialWelcome,
        timestamp: '11:24 AM'
      }
    ],
    'curator-2': [
      {
        id: 'w-2',
        sender: 'assistant',
        text: curators[1].initialWelcome,
        timestamp: '10:02 AM'
      }
    ],
    'curator-3': [
      {
        id: 'w-3',
        sender: 'assistant',
        text: curators[2].initialWelcome,
        timestamp: 'Yesterday'
      }
    ]
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeCurator = curators.find(c => c.id === activeCuratorId) || curators[0];
  const activeMessages = chatHistories[activeCuratorId] || [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsgText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update locally immediately
    setChatHistories(prev => ({
      ...prev,
      [activeCuratorId]: [...(prev[activeCuratorId] || []), userMessage]
    }));

    try {
      let token: string | null = null;
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      } else {
        token = 'guest-token';
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const isOutfitRequest = userMsgText.toLowerCase().includes('outfit') || 
                              userMsgText.toLowerCase().includes('curate') || 
                              userMsgText.toLowerCase().includes('look') ||
                              userMsgText.toLowerCase().includes('style');

      const endpoint = isOutfitRequest ? '/api/stylist/generate' : '/api/ai/recommend-mvp';

      // Clean wardrobe to strip huge base64 image data before API calls
      const cleanedWardrobe = Array.isArray(wardrobe)
        ? wardrobe.map(item => {
            const { imageUrl, ...rest } = item;
            const cleaned: any = { ...rest };
            if (imageUrl && !imageUrl.startsWith('data:')) {
              cleaned.imageUrl = imageUrl;
            }
            return cleaned;
          })
        : [];

      const requestBody = isOutfitRequest 
        ? { wardrobe: cleanedWardrobe, userProfile: { user_preferences_vector: UnifiedFashionOS.getState().unifiedStyleMemory?.user_preferences_vector || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] } }
        : { userInput: `[Consultation with Curator ${activeCurator.name} (${activeCurator.vibe})]: ${userMsgText}`, tenantId: 'default' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Curator routing failed: status ${response.status}`);
      }

      const data = await response.json();
      let assistantResponse = '';

      if (isOutfitRequest) {
        if (data && data.success && Array.isArray(data.outfits) && data.outfits.length > 0) {
          const outfit = data.outfits[0];
          assistantResponse = `I compiled a high-fidelity look tailored to your closet: **${outfit.name}**.\n\nDescription: ${outfit.explanation}\n\n*This look has been loaded into your Active Workspace for live review.*`;
          
          UnifiedFashionOS.getState().activeSuggestion = outfit;
          UnifiedFashionOS.recalculateGoLiveGate();
          UnifiedFashionOS.notify();
        } else {
          assistantResponse = `I inspected your wardrobe components. To create a pristine balance, I recommend styling lightweight tailored coats with raw-cut trousers. Let me know if you would like me to curate something more specific!`;
        }
      } else {
        assistantResponse = data.final_recommendation || data.style_summary || `I have formulated a response under the guidance of my styling philosophy. Let us build a clean silhouette of garments together.`;
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: assistantResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistories(prev => ({
        ...prev,
        [activeCuratorId]: [...(prev[activeCuratorId] || []), assistantMessage]
      }));

    } catch (err) {
      console.error("[Curator Chat Error]:", err);
      // Resilience offline fallback based on Curator vibe
      setTimeout(() => {
        let fallbackText = '';
        if (activeCuratorId === 'curator-1') {
          fallbackText = "I am operating in offline resilience mode. Based on my avant-garde guidelines, I suggest coordinating an asymmetric dark tailored blazer with relaxed-fit wool pants. The sharp lapel lines will provide a high-fidelity framing.";
        } else if (activeCuratorId === 'curator-2') {
          fallbackText = "Offline link active! For a clean street rotation, style an oversized heavy hoodie layered with a technical raw denim cargo trousers and crisp white canvas low-tops.";
        } else {
          fallbackText = "Sartorial offline buffer active. To maintain optimal minimalist restraint, coordinate a premium cashmere cream crewneck with structured sand chinos. Clean, quiet, and timeless.";
        }

        const assistantMessage: Message = {
          id: `assistant-fallback-${Date.now()}`,
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatHistories(prev => ({
          ...prev,
          [activeCuratorId]: [...(prev[activeCuratorId] || []), assistantMessage]
        }));
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white text-left animate-fade-in" id="style-message-center-root">
      {/* Header */}
      <div className="pb-4 border-b border-white/5">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
          Secure Inbox
        </span>
        <h2 className="font-serif font-light tracking-[-0.03em] text-3xl text-white mt-1">
          Curator Message Center
        </h2>
        <p className="text-xs text-white/40 font-serif italic mt-1">
          "Direct secure line to your verified style consultants."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#07070c]/50 border border-white/5 rounded-2xl overflow-hidden h-[540px]">
        {/* LEFT COLUMN: CURATORS LIST (4 Columns) */}
        <div className="lg:col-span-4 border-r border-white/5 flex flex-col h-full bg-[#07070c]">
          <div className="p-4 border-b border-white/5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 block">Active Stylists</span>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03] no-scrollbar">
            {curators.map((curator) => {
              const lastMsg = chatHistories[curator.id]?.slice(-1)[0];
              const isActive = curator.id === activeCuratorId;
              return (
                <button
                  key={curator.id}
                  onClick={() => setActiveCuratorId(curator.id)}
                  className={`w-full p-4 flex gap-3 text-left transition-all cursor-pointer items-start ${
                    isActive ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={curator.imgUrl || null} 
                      alt={curator.name} 
                      className="w-10 h-10 rounded-xl object-cover grayscale"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border border-black rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11.5px] font-bold text-white truncate">{curator.name}</h4>
                      <span className="text-[8px] font-mono text-white/30">{lastMsg?.timestamp || 'Now'}</span>
                    </div>
                    <span className="block text-[9.5px] text-violet-400 font-mono mt-0.5">{curator.vibe}</span>
                    <p className="text-[10px] text-white/40 font-sans mt-1.5 truncate leading-tight">
                      {lastMsg?.text || curator.bio}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT PANEL (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-[#05050a]/40">
          {/* Active Curator Top Info */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <img src={activeCurator.imgUrl || null} 
                alt={activeCurator.name} 
                className="w-9 h-9 rounded-lg object-cover shrink-0 grayscale"
              />
              <div>
                <h3 className="text-xs font-bold text-white">{activeCurator.name}</h3>
                <span className="block text-[9px] font-mono text-white/40 uppercase tracking-wider">{activeCurator.role}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] font-mono uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure Session</span>
            </div>
          </div>

          {/* Messages Flow viewport */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
            {activeMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'text-left'}`}
                >
                  <div className={`p-1.5 rounded-lg h-7 w-7 flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-white/10 text-white' : 'bg-[#181135] text-violet-300 border border-violet-500/10'
                  }`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1">
                    <div className={`p-3.5 rounded-xl text-[11px] font-mono leading-relaxed whitespace-pre-line tracking-tight ${
                      isUser 
                        ? 'bg-white text-black font-medium' 
                        : 'bg-white/[0.02] text-neutral-200 border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="block text-[8px] font-mono text-white/20 px-1">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-center text-[10px] font-mono text-white/30 animate-pulse pl-1">
                <div className="p-1.5 rounded-lg h-7 w-7 bg-[#181135] flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-violet-300 animate-bounce" />
                </div>
                <span>Curator formulating styled perspective...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Controls */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01] flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={`Ask ${activeCurator.name} to curates coordinates... (e.g. "curate an outfit")`}
              className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-violet-500/40 transition-all placeholder-white/25"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="p-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
