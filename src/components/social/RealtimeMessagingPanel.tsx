import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Sparkles, ShieldCheck, Check, User, Bot, Paperclip, X, Plus } from 'lucide-react';
import { ChatConversation, ChatMessage, SharedCreationItem } from '../../types/social';
import { WardrobeItem } from '../../platform';

interface RealtimeMessagingPanelProps {
  initialTargetUserId?: string | null;
  wardrobe?: WardrobeItem[];
}

export const RealtimeMessagingPanel: React.FC<RealtimeMessagingPanelProps> = ({
  initialTargetUserId,
  wardrobe = []
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [selectedCreationToAttach, setSelectedCreationToAttach] = useState<SharedCreationItem | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/social/conversations');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.conversations)) {
          setConversations(data.conversations);
          if (!activeConversationId && data.conversations.length > 0) {
            setActiveConversationId(data.conversations[0].id);
          }
        }
      }
    } catch (err) {
      console.error('[Fetch Conversations Error]:', err);
    }
  };

  const fetchMessages = async (convId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/social/conversations/${convId}/messages`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error('[Fetch Messages Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (initialTargetUserId) {
      // Start or locate conversation with target user
      fetch('/api/social/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: initialTargetUserId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.conversation) {
            fetchConversations();
            setActiveConversationId(data.conversation.id);
          }
        })
        .catch(err => console.error('[Start Conv Error]:', err));
    }
  }, [initialTargetUserId]);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedCreationToAttach) || !activeConversationId || isSending) return;

    const payload = {
      text: inputText.trim(),
      sharedCreation: selectedCreationToAttach || undefined
    };

    setInputText('');
    setSelectedCreationToAttach(null);
    setIsSending(true);

    try {
      const res = await fetch(`/api/social/conversations/${activeConversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.message) {
          setMessages(prev => [...prev, data.message]);
          fetchConversations();
        }
      }
    } catch (err) {
      console.error('[Send Message Error]:', err);
    } finally {
      setIsSending(false);
    }
  };

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const otherParticipantKey = activeConv
    ? activeConv.participants.find(p => p !== 'usr-current') || 'usr-current'
    : null;
  const otherProfile = (activeConv && otherParticipantKey) ? activeConv.participantProfiles[otherParticipantKey] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#07070c] border border-white/5 rounded-2xl overflow-hidden h-[620px]">
      {/* LEFT SIDEBAR: CONVERSATIONS (4 cols) */}
      <div className="lg:col-span-4 border-r border-white/5 flex flex-col h-full bg-[#07070c]">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
            Private Messages
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono">
            Encrypted Line
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03] no-scrollbar">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-zinc-500">
              No active conversations yet.
            </div>
          ) : (
            conversations.map((conv) => {
              const otherKey = conv.participants.find(p => p !== 'usr-current') || 'usr-current';
              const pProfile = conv.participantProfiles[otherKey] || { name: 'User', avatar: '', username: 'user' };
              const isActive = conv.id === activeConversationId;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full p-4 flex gap-3 text-left transition-all cursor-pointer items-start ${
                    isActive ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={pProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                      alt={pProfile.name}
                      className="w-10 h-10 rounded-xl object-cover grayscale border border-white/10"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{pProfile.name}</h4>
                      <span className="text-[9px] font-mono text-zinc-500">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="block text-[9.5px] text-zinc-400 font-mono">@{pProfile.username}</span>
                    <p className="text-[11px] text-zinc-300 font-sans mt-1 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT CHAT THREAD (8 cols) */}
      <div className="lg:col-span-8 flex flex-col h-full bg-[#05050a]/60">
        {activeConv && otherProfile ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <img
                  src={otherProfile.avatar}
                  alt={otherProfile.name}
                  className="w-9 h-9 rounded-xl object-cover shrink-0 grayscale border border-white/10"
                />
                <div>
                  <h3 className="text-xs font-bold text-white">{otherProfile.name}</h3>
                  <span className="block text-[9px] font-mono text-zinc-400">@{otherProfile.username}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Privacy Guard Active</span>
              </div>
            </div>

            {/* Messages Viewport */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              {isLoading ? (
                <div className="py-12 text-center text-xs font-mono text-zinc-500 animate-pulse">
                  Decrypting message history...
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-zinc-500">
                  No messages exchanged yet. Send a greeting or share an AI creation!
                </div>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.senderId === 'usr-current';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-lg object-cover grayscale shrink-0 border border-white/10"
                      />

                      <div className="space-y-1">
                        <div
                          className={`p-3.5 rounded-2xl text-xs font-mono leading-relaxed whitespace-pre-line ${
                            isUser
                              ? 'bg-white text-black font-medium'
                              : 'bg-zinc-900 text-zinc-100 border border-white/10'
                          }`}
                        >
                          {msg.text}

                          {/* Attached Creation Visual Card */}
                          {msg.sharedCreation && (
                            <div className="mt-2.5 p-2 bg-black/40 rounded-xl border border-white/10 text-left space-y-2">
                              <img
                                src={msg.sharedCreation.imageUrl}
                                alt={msg.sharedCreation.title}
                                className="w-full h-36 object-cover rounded-lg"
                              />
                              <span className="text-[10px] font-bold text-white block">
                                {msg.sharedCreation.title}
                              </span>
                            </div>
                          )}
                        </div>

                        <span className="block text-[8px] font-mono text-zinc-500 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Attachment Draft Preview if Selected */}
            {selectedCreationToAttach && (
              <div className="px-4 py-2 bg-violet-950/40 border-t border-violet-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-mono text-violet-200 truncate">
                    Attached Creation: <strong>{selectedCreationToAttach.title}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCreationToAttach(null)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex gap-3 items-center">
              <button
                onClick={() => setShowAttachModal(true)}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
                title="Attach Creation or Wardrobe Piece"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Type a direct message or share style feedback..."
                className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-violet-500/40 transition-all placeholder-zinc-500"
              />

              <button
                onClick={handleSendMessage}
                disabled={isSending || (!inputText.trim() && !selectedCreationToAttach)}
                className="p-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs font-mono text-zinc-500">
            Select a conversation to open messaging thread.
          </div>
        )}
      </div>

      {/* Creation Attachment Modal */}
      {showAttachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#07070c] border border-white/10 rounded-2xl p-6 w-full max-w-md text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-white">Attach Creation to Message</h3>
              <button onClick={() => setShowAttachModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 font-mono">Select a piece from your digital wardrobe or AI creations:</p>

            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto no-scrollbar">
              {wardrobe.length === 0 ? (
                <div className="col-span-2 py-6 text-center text-xs font-mono text-zinc-500">
                  No wardrobe items found. Defaulting sample creation.
                </div>
              ) : (
                wardrobe.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedCreationToAttach({
                        id: item.id,
                        title: item.title,
                        imageUrl: item.imageUrl
                      });
                      setShowAttachModal(false);
                    }}
                    className="p-2 bg-zinc-900 border border-white/5 hover:border-violet-500/40 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <img src={item.imageUrl} alt={item.title} className="w-full h-24 object-cover rounded-lg mb-2" />
                    <span className="text-xs font-bold text-white block truncate">{item.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500 block">{item.category}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
