import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Check, UserCheck, Sparkles, MessageSquare, Shield, ShieldCheck, Crown, Users, SlidersHorizontal } from 'lucide-react';
import { UserSocialProfile } from '../../types/social';

interface UserDiscoveryPanelProps {
  onStartConversation: (targetUserId: string) => void;
  onOpenProfile: (userId: string) => void;
}

export const UserDiscoveryPanel: React.FC<UserDiscoveryPanelProps> = ({
  onStartConversation,
  onOpenProfile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterest, setSelectedInterest] = useState<string>('');
  const [creatorsOnly, setCreatorsOnly] = useState(false);
  const [users, setUsers] = useState<UserSocialProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});

  const categoryFilters = [
    'All',
    'Avant-Garde',
    'Cyber Couture',
    'Nordic Minimal',
    'Streetwear',
    'Haute Couture'
  ];

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedInterest && selectedInterest !== 'All') params.append('interest', selectedInterest);
      if (creatorsOnly) params.append('creatorsOnly', 'true');

      const res = await fetch(`/api/social/users/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.error('[Discovery Search Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedInterest, creatorsOnly]);

  const handleSendFriendRequest = async (toUserId: string) => {
    try {
      const res = await fetch('/api/social/friend-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId })
      });
      const data = await res.json();
      if (data.success) {
        setSentRequests(prev => ({ ...prev, [toUserId]: true }));
      } else {
        alert(data.error || 'Failed to send request');
      }
    } catch (err) {
      console.error('[Send Request Error]:', err);
    }
  };

  const handleToggleFollowCreator = async (creatorId: string) => {
    const currentlyFollowing = !!followedCreators[creatorId];
    try {
      const res = await fetch(`/api/social/creators/${creatorId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow: !currentlyFollowing })
      });
      const data = await res.json();
      if (data.success) {
        setFollowedCreators(prev => ({ ...prev, [creatorId]: !currentlyFollowing }));
      }
    } catch (err) {
      console.error('[Follow Creator Error]:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#07070c] border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fashion designers, handles, creators, or style vibes..."
            className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-zinc-400 cursor-pointer bg-zinc-900/60 px-3 py-2 rounded-xl border border-white/5">
            <input
              type="checkbox"
              checked={creatorsOnly}
              onChange={(e) => setCreatorsOnly(e.target.checked)}
              className="accent-violet-600 rounded cursor-pointer"
            />
            <span>Creators Only</span>
          </label>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categoryFilters.map((cat) => {
          const isActive = (cat === 'All' && !selectedInterest) || selectedInterest === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedInterest(cat === 'All' ? '' : cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-violet-600/20 border border-violet-500 text-white font-bold'
                  : 'bg-zinc-900/40 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs font-mono text-zinc-500 animate-pulse">
          Searching fashion social index...
        </div>
      ) : users.length === 0 ? (
        <div className="py-12 text-center bg-[#07070c]/50 border border-white/5 rounded-2xl p-8 space-y-2">
          <Users className="w-8 h-8 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No Fashion Members Discovered</h4>
          <p className="text-xs text-zinc-400 font-mono">
            No public profiles matched your query or selected filters. Try broadening your search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => {
            const isCreator = u.creatorIdentity?.isCreator;
            const isReqSent = !!sentRequests[u.id];
            const isFollowing = !!followedCreators[u.id];

            return (
              <div
                key={u.id}
                className="bg-[#07070c] border border-white/5 hover:border-violet-500/20 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-12 h-12 rounded-xl object-cover grayscale shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white truncate">{u.name}</h4>
                          {isCreator && (
                            <span className="p-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                              <Crown className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <span className="block text-[10px] font-mono text-zinc-500 truncate">@{u.username}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vibe / Bio */}
                  <p className="text-xs text-zinc-300 line-clamp-2 mt-3 font-sans leading-relaxed">
                    {u.bio}
                  </p>

                  {/* Creator Specialty Badge */}
                  {u.creatorIdentity && (
                    <div className="mt-2.5 p-2 rounded-lg bg-violet-950/30 border border-violet-500/20 text-[10px] font-mono text-violet-300">
                      <span className="text-zinc-400 block font-light">Vibe & Specialty:</span>
                      <strong>{u.creatorIdentity.styleVibe}</strong> — {u.creatorIdentity.specialty}
                    </div>
                  )}

                  {/* Fashion Interest Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {u.fashionInterests.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[9.5px] font-mono text-zinc-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>{u.metrics.followersCount.toLocaleString()} followers</span>
                    <span>{u.metrics.connectionsCount} connections</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Send Friend Request */}
                    {u.id !== 'usr-current' && (
                      <button
                        onClick={() => handleSendFriendRequest(u.id)}
                        disabled={isReqSent}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isReqSent
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                        }`}
                      >
                        {isReqSent ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                        <span>{isReqSent ? 'Request Sent' : 'Connect'}</span>
                      </button>
                    )}

                    {/* Follow Creator */}
                    {isCreator && u.id !== 'usr-current' && (
                      <button
                        onClick={() => handleToggleFollowCreator(u.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isFollowing
                            ? 'bg-violet-600 text-white'
                            : 'bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30'
                        }`}
                      >
                        <Crown className="w-3 h-3" />
                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
                      </button>
                    )}

                    {/* Message Button */}
                    {u.id !== 'usr-current' && (
                      <button
                        onClick={() => onStartConversation(u.id)}
                        className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-white/10 transition-all cursor-pointer"
                        title="Open Direct Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
