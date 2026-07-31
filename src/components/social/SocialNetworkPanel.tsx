import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserMinus, Check, X, Shield, Crown, MessageSquare } from 'lucide-react';
import { UserSocialProfile, FriendRequest } from '../../types/social';

interface SocialNetworkPanelProps {
  onStartConversation: (targetUserId: string) => void;
}

export const SocialNetworkPanel: React.FC<SocialNetworkPanelProps> = ({ onStartConversation }) => {
  const [activeTab, setActiveTab] = useState<'CONNECTIONS' | 'INCOMING' | 'OUTGOING' | 'CREATORS'>('CONNECTIONS');
  const [connections, setConnections] = useState<UserSocialProfile[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [followedCreators, setFollowedCreators] = useState<UserSocialProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNetworkData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/social/connections');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setConnections(data.connections || []);
          setIncomingRequests(data.incomingRequests || []);
          setOutgoingRequests(data.outgoingRequests || []);
          setFollowedCreators(data.followedCreators || []);
        }
      }
    } catch (err) {
      console.error('[Network Data Fetch Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const handleRespondRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/social/friend-requests/${requestId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        fetchNetworkData();
      }
    } catch (err) {
      console.error('[Respond Request Error]:', err);
    }
  };

  const handleRemoveConnection = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this connection?')) return;
    try {
      const res = await fetch(`/api/social/connections/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchNetworkData();
      }
    } catch (err) {
      console.error('[Remove Connection Error]:', err);
    }
  };

  const handleUnfollowCreator = async (creatorId: string) => {
    try {
      const res = await fetch(`/api/social/creators/${creatorId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow: false })
      });
      if (res.ok) {
        fetchNetworkData();
      }
    } catch (err) {
      console.error('[Unfollow Error]:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#07070c] border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Connections</span>
          <span className="text-xl font-bold text-white font-mono">{connections.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#07070c] border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Incoming Requests</span>
          <span className="text-xl font-bold text-emerald-400 font-mono">{incomingRequests.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#07070c] border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Outgoing Requests</span>
          <span className="text-xl font-bold text-zinc-300 font-mono">{outgoingRequests.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#07070c] border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Followed Creators</span>
          <span className="text-xl font-bold text-violet-400 font-mono">{followedCreators.length}</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveTab('CONNECTIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
            activeTab === 'CONNECTIONS'
              ? 'bg-white/10 text-white font-bold border border-white/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Active Connections ({connections.length})
        </button>
        <button
          onClick={() => setActiveTab('INCOMING')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer relative ${
            activeTab === 'INCOMING'
              ? 'bg-white/10 text-white font-bold border border-white/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Incoming ({incomingRequests.length})
          {incomingRequests.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-bold">
              {incomingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('OUTGOING')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
            activeTab === 'OUTGOING'
              ? 'bg-white/10 text-white font-bold border border-white/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Sent ({outgoingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('CREATORS')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
            activeTab === 'CREATORS'
              ? 'bg-white/10 text-white font-bold border border-white/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Followed Creators ({followedCreators.length})
        </button>
      </div>

      {/* Tab Contents */}
      {isLoading ? (
        <div className="py-12 text-center text-xs font-mono text-zinc-500 animate-pulse">
          Loading social network graphs...
        </div>
      ) : activeTab === 'CONNECTIONS' ? (
        connections.length === 0 ? (
          <div className="py-12 text-center bg-[#07070c]/50 border border-white/5 rounded-2xl p-8 space-y-2">
            <Users className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Connections Yet</h4>
            <p className="text-xs text-zinc-400 font-mono">Use Global Discovery to connect with fashion members and designers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((c) => (
              <div key={c.id} className="bg-[#07070c] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-xl object-cover grayscale shrink-0 border border-white/10" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                    <span className="block text-[10px] font-mono text-zinc-500 truncate">@{c.username}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onStartConversation(c.id)}
                    className="p-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 rounded-xl text-xs transition-all cursor-pointer"
                    title="Send Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveConnection(c.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs transition-all cursor-pointer"
                    title="Disconnect"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'INCOMING' ? (
        incomingRequests.length === 0 ? (
          <div className="py-12 text-center bg-[#07070c]/50 border border-white/5 rounded-2xl p-8 space-y-2">
            <UserCheck className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Pending Requests</h4>
            <p className="text-xs text-zinc-400 font-mono">Incoming connection requests will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incomingRequests.map((req) => (
              <div key={req.id} className="bg-[#07070c] border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={req.fromUserAvatar} alt={req.fromUserName} className="w-10 h-10 rounded-xl object-cover grayscale shrink-0 border border-white/10" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{req.fromUserName}</h4>
                    <span className="text-[10px] font-mono text-zinc-500 block">Wants to connect with you</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRespondRequest(req.id, 'accept')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleRespondRequest(req.id, 'reject')}
                    className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'OUTGOING' ? (
        outgoingRequests.length === 0 ? (
          <div className="py-12 text-center bg-[#07070c]/50 border border-white/5 rounded-2xl p-8 space-y-2">
            <Users className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Sent Requests</h4>
            <p className="text-xs text-zinc-400 font-mono">Requests you send will be tracked here until accepted.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {outgoingRequests.map((req) => (
              <div key={req.id} className="bg-[#07070c] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Sent to {req.toUserName}</h4>
                  <span className="text-[10px] font-mono text-zinc-500">Status: Pending response</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono">
                  Pending
                </span>
              </div>
            ))}
          </div>
        )
      ) : (
        followedCreators.length === 0 ? (
          <div className="py-12 text-center bg-[#07070c]/50 border border-white/5 rounded-2xl p-8 space-y-2">
            <Crown className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Followed Creators</h4>
            <p className="text-xs text-zinc-400 font-mono">Follow high-fashion creators to stay synchronized with their releases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {followedCreators.map((creator) => (
              <div key={creator.id} className="bg-[#07070c] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-xl object-cover grayscale shrink-0 border border-white/10" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{creator.name}</h4>
                    <span className="block text-[10px] font-mono text-violet-400 truncate">{creator.creatorIdentity?.styleVibe}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleUnfollowCreator(creator.id)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-mono transition-all cursor-pointer"
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
