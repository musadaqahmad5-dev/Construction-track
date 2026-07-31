import React, { useState, useEffect } from 'react';
import { Users, Plus, Heart, MessageSquare, Share2, Sparkles, X, Check, Image, Send, Lock, Shield } from 'lucide-react';
import { FashionCommunity, CommunityPost, CommunityComment, SharedCreationItem } from '../../types/social';
import { WardrobeItem } from '../../platform';

interface FashionCommunitiesPanelProps {
  wardrobe?: WardrobeItem[];
}

export const FashionCommunitiesPanel: React.FC<FashionCommunitiesPanelProps> = ({ wardrobe = [] }) => {
  const [communities, setCommunities] = useState<FashionCommunity[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>('comm-luxury-circle');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);

  // Post Creation States
  const [newPostText, setNewPostText] = useState('');
  const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Comments State
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, CommunityComment[]>>({});
  const [newCommentText, setNewCommentText] = useState('');

  // Create Community Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommCat, setNewCommCat] = useState<'Luxury Fashion' | 'AI Designers' | 'Streetwear' | 'Couture' | 'Regional Groups' | 'Sustainable Fashion'>('Luxury Fashion');
  const [newCommPrivate, setNewCommPrivate] = useState(false);

  const categories = [
    'All',
    'Luxury Fashion',
    'AI Designers',
    'Streetwear',
    'Couture',
    'Sustainable Fashion'
  ];

  const fetchCommunities = async () => {
    try {
      const res = await fetch('/api/social/communities');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.communities)) {
          setCommunities(data.communities);
        }
      }
    } catch (err) {
      console.error('[Fetch Communities Error]:', err);
    }
  };

  const fetchCommunityPosts = async (commId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/social/communities/${commId}/posts`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      }
    } catch (err) {
      console.error('[Fetch Posts Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (selectedCommunityId) {
      fetchCommunityPosts(selectedCommunityId);
    }
  }, [selectedCommunityId]);

  const handleJoinCommunity = async (commId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/social/communities/${commId}/join`, { method: 'POST' });
      if (res.ok) {
        fetchCommunities();
      }
    } catch (err) {
      console.error('[Join Comm Error]:', err);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim() || !selectedCommunityId || isPosting) return;

    setIsPosting(true);
    try {
      const res = await fetch(`/api/social/communities/${selectedCommunityId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostText.trim(),
          mediaUrl: newPostMediaUrl.trim() || undefined
        })
      });

      if (res.ok) {
        setNewPostText('');
        setNewPostMediaUrl('');
        fetchCommunityPosts(selectedCommunityId);
        fetchCommunities();
      }
    } catch (err) {
      console.error('[Create Post Error]:', err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/social/posts/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPosts(prev => prev.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                likesCount: data.likesCount,
                likedBy: data.hasLiked ? [...p.likedBy, 'usr-current'] : p.likedBy.filter(id => id !== 'usr-current')
              };
            }
            return p;
          }));
        }
      }
    } catch (err) {
      console.error('[Like Post Error]:', err);
    }
  };

  const handleFetchComments = async (postId: string) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
      return;
    }
    setActiveCommentPostId(postId);
    try {
      const res = await fetch(`/api/social/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCommentsMap(prev => ({ ...prev, [postId]: data.comments }));
        }
      }
    } catch (err) {
      console.error('[Fetch Comments Error]:', err);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newCommentText.trim()) return;
    try {
      const res = await fetch(`/api/social/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newCommentText.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.comment) {
          setCommentsMap(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), data.comment]
          }));
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
          setNewCommentText('');
        }
      }
    } catch (err) {
      console.error('[Add Comment Error]:', err);
    }
  };

  const handleCreateCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim() || !newCommDesc.trim()) return;

    try {
      const res = await fetch('/api/social/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCommName.trim(),
          description: newCommDesc.trim(),
          category: newCommCat,
          isPrivate: newCommPrivate
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.community) {
          setShowCreateModal(false);
          setNewCommName('');
          setNewCommDesc('');
          fetchCommunities();
          setSelectedCommunityId(data.community.id);
        }
      }
    } catch (err) {
      console.error('[Create Comm Submit Error]:', err);
    }
  };

  const selectedComm = communities.find(c => c.id === selectedCommunityId);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#07070c] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = (cat === 'All' && !selectedCategory) || selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-violet-600/20 border border-violet-500 text-white font-bold'
                    : 'bg-zinc-900/40 border border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-lg shadow-violet-950/40 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Community</span>
        </button>
      </div>

      {/* Communities Carousel Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {communities
          .filter(c => !selectedCategory || selectedCategory === 'All' || c.category === selectedCategory)
          .map((comm) => {
            const isSelected = comm.id === selectedCommunityId;
            const isMember = comm.members.includes('usr-current');

            return (
              <div
                key={comm.id}
                onClick={() => setSelectedCommunityId(comm.id)}
                className={`relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-violet-500 ring-2 ring-violet-500/20 bg-zinc-900'
                    : 'border-white/5 hover:border-white/20 bg-[#07070c]'
                }`}
              >
                <div className="relative h-28 w-full overflow-hidden">
                  <img src={comm.coverImage} alt={comm.name} className="w-full h-full object-cover grayscale opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-[#07070c]/40 to-transparent" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono text-zinc-300">
                    {comm.category}
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{comm.name}</h4>
                    <p className="text-[10.5px] text-zinc-400 line-clamp-2 mt-1 font-sans">{comm.description}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>{comm.membersCount.toLocaleString()} Members</span>
                    <button
                      onClick={(e) => handleJoinCommunity(comm.id, e)}
                      className={`px-3 py-1 rounded-lg transition-all text-[10px] font-bold ${
                        isMember
                          ? 'bg-zinc-800 text-zinc-400 hover:text-white'
                          : 'bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30'
                      }`}
                    >
                      {isMember ? 'Joined' : '+ Join Circle'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Selected Community Active Feed */}
      {selectedComm && (
        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedComm.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-300 text-[10px] font-mono">
                  {selectedComm.category}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{selectedComm.description}</p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
              <Users className="w-4 h-4 text-violet-400" />
              <span>{selectedComm.membersCount.toLocaleString()} fashion members</span>
            </div>
          </div>

          {/* New Post Creator Box */}
          <div className="bg-zinc-950 border border-white/10 rounded-xl p-4 space-y-3">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={`Share an architectural analysis, prompt design, or runway critique in ${selectedComm.name}...`}
              className="w-full bg-transparent text-xs font-mono text-white placeholder-zinc-500 focus:outline-none resize-none h-20"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
              <input
                type="text"
                value={newPostMediaUrl}
                onChange={(e) => setNewPostMediaUrl(e.target.value)}
                placeholder="Optional High-Res Image URL..."
                className="flex-1 bg-zinc-900 border border-white/5 rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none"
              />

              <button
                onClick={handleCreatePost}
                disabled={isPosting || !newPostText.trim()}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Post</span>
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          {isLoading ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500 animate-pulse">
              Syncing community feed...
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">
              No discussions published in this circle yet. Be the first to start a conversation!
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => {
                const hasLiked = post.likedBy.includes('usr-current');
                const showComments = activeCommentPostId === post.id;
                const postComments = commentsMap[post.id] || [];

                return (
                  <div key={post.id} className="bg-zinc-950/60 border border-white/5 rounded-2xl p-5 space-y-4">
                    {/* Author Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-9 h-9 rounded-xl object-cover grayscale border border-white/10"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{post.authorName}</h4>
                          <span className="block text-[9.5px] font-mono text-zinc-500">@{post.authorHandle}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">
                        {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Post Content */}
                    <p className="text-xs text-zinc-200 font-sans leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Media Attachment */}
                    {post.mediaUrl && (
                      <div className="rounded-xl overflow-hidden border border-white/10 max-h-96">
                        <img src={post.mediaUrl} alt="Post Attachment" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Shared Creation Card */}
                    {post.sharedCreation && (
                      <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center gap-3">
                        <img src={post.sharedCreation.imageUrl} alt={post.sharedCreation.title} className="w-14 h-14 rounded-lg object-cover" />
                        <div>
                          <span className="text-xs font-bold text-white block">{post.sharedCreation.title}</span>
                          <span className="text-[10px] font-mono text-violet-400">Shared AI Style DNA Creation</span>
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 transition-all cursor-pointer ${
                            hasLiked ? 'text-rose-400 font-bold' : 'hover:text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400' : ''}`} />
                          <span>{post.likesCount}</span>
                        </button>

                        <button
                          onClick={() => handleFetchComments(post.id)}
                          className="flex items-center gap-1.5 hover:text-white transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.commentsCount} Comments</span>
                        </button>
                      </div>

                      <button className="hover:text-white transition-all cursor-pointer">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expandable Comments Drawer */}
                    {showComments && (
                      <div className="pt-4 border-t border-white/5 space-y-3 bg-black/20 p-4 rounded-xl">
                        <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                          {postComments.length === 0 ? (
                            <div className="text-[10px] font-mono text-zinc-500">No comments yet. Write the first response below.</div>
                          ) : (
                            postComments.map((cmt) => (
                              <div key={cmt.id} className="flex gap-2 text-xs">
                                <img src={cmt.authorAvatar} alt={cmt.authorName} className="w-6 h-6 rounded-lg object-cover grayscale shrink-0" />
                                <div className="bg-zinc-900 p-2.5 rounded-xl flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-white text-[11px]">{cmt.authorName}</span>
                                    <span className="text-[8px] font-mono text-zinc-500">
                                      {new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-zinc-300 font-mono text-[10.5px]">{cmt.content}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add comment input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            placeholder="Add a constructive fashion comment..."
                            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold rounded-xl"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Launch Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleCreateCommunitySubmit} className="bg-[#07070c] border border-white/10 rounded-2xl p-6 w-full max-w-lg text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold text-white">Launch New Fashion Circle</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Community Name</label>
                <input
                  type="text"
                  required
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  placeholder="e.g. Avant-Garde Draping Atelier"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-violet-500/40"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Category</label>
                <select
                  value={newCommCat}
                  onChange={(e) => setNewCommCat(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Description & Philosophy</label>
                <textarea
                  required
                  value={newCommDesc}
                  onChange={(e) => setNewCommDesc(e.target.value)}
                  placeholder="Describe the focus, guidelines, and sartorial aesthetics of this circle..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none h-24"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-white/5">
                <span className="text-xs font-mono text-zinc-300">Private Member Circle</span>
                <input
                  type="checkbox"
                  checked={newCommPrivate}
                  onChange={(e) => setNewCommPrivate(e.target.checked)}
                  className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-mono font-bold"
              >
                Launch Circle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
