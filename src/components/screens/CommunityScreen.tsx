import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Heart, Bookmark, MessageSquare, Send, Plus, Award, Tag, Sparkles, Image, Check, Info } from 'lucide-react';
import { WardrobeItem } from '../../types';

interface CommunityScreenProps {
  user: any;
  userWardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onNavigateToTab?: (tab: string) => void;
}

const INITIAL_POSTS = [
  {
    id: 'p-1',
    author: {
      name: 'Elena Rostova',
      handle: '@elena_luxe',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
    },
    caption: 'Quiet autumn minimalism in the heart of Milan. Paired sandstones and heavy interlocked knits to combat the overcast chill.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop',
    likes: 84,
    hasLiked: false,
    hasBookmarked: false,
    vibeTags: ['minimalist', 'cozy', 'milan'],
    taggedGarment: { title: 'Belgian Flax Linen Shirt', price: 65.00, category: 'Casual' },
    comments: [
      { author: 'Marcus K.', text: 'The silhouette draping is flawless!' },
      { author: 'Sasha D.', text: 'Is that wool brushed or mohair?' }
    ]
  },
  {
    id: 'p-2',
    author: {
      name: 'Julian Vance',
      handle: '@julian_cyber',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
    },
    caption: 'Tokyo night walk in techwear drapes. Complete waterproof storm parka coordinates with tapered heavy-knit cargo pants.',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop',
    likes: 128,
    hasLiked: false,
    hasBookmarked: false,
    vibeTags: ['cyberpunk', 'techwear', 'tokyo'],
    taggedGarment: { title: 'Aris Waterproof Parka', price: 240.00, category: 'Outerwear' },
    comments: [
      { author: 'Elena R.', text: 'Absolutely stellar contrast lines.' }
    ]
  }
];

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  user,
  userWardrobe,
  onAddGarment,
  onNavigateToTab
}) => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  // New post form states
  const [newCaption, setNewCaption] = useState('');
  const [selectedGarmentIndex, setSelectedGarmentIndex] = useState('-1');
  const [newVibeTag, setNewVibeTag] = useState('');
  const [newPostImage, setNewPostImage] = useState('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop');
  const [postSuccess, setPostSuccess] = useState(false);

  // Comment section state
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [newCommentInput, setNewCommentInput] = useState('');

  // Daily Challenge state
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [challengeSelectedGarment, setChallengeSelectedGarment] = useState('');

  const handleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        const hasLikedNow = !p.hasLiked;
        return {
          ...p,
          hasLiked: hasLikedNow,
          likes: p.likes + (hasLikedNow ? 1 : -1)
        };
      }
      return p;
    }));
  };

  const handleBookmark = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        const hasBookmarkedNow = !p.hasBookmarked;
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
          detail: hasBookmarkedNow ? 'Post saved to bookmarks library' : 'Bookmark removed' 
        }));
        return {
          ...p,
          hasBookmarked: hasBookmarkedNow
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { author: 'You (Stylist)', text: newCommentInput.trim() }]
        };
      }
      return p;
    }));

    setNewCommentInput('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    let taggedGarment: any = undefined;
    const gIndex = parseInt(selectedGarmentIndex);
    if (gIndex >= 0 && userWardrobe[gIndex]) {
      const g = userWardrobe[gIndex];
      taggedGarment = { title: g.title, price: 0, category: g.category };
    }

    const newPost = {
      id: `p-local-${Date.now()}`,
      author: {
        name: user?.displayName || 'Anonymous Sartorialist',
        handle: `@${(user?.displayName || 'sartorialist').toLowerCase().replace(/\s+/g, '')}`,
        avatar: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
      },
      caption: newCaption.trim(),
      imageUrl: newPostImage,
      likes: 1,
      hasLiked: true,
      hasBookmarked: false,
      vibeTags: newVibeTag.trim() ? newVibeTag.toLowerCase().split(',').map(x => x.trim()) : ['minimalist'],
      taggedGarment,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewCaption('');
    setNewVibeTag('');
    setPostSuccess(true);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Outfit composition shared to the community stream!' }));
    setTimeout(() => {
      setPostSuccess(false);
      setIsShareModalOpen(false);
    }, 1500);
  };

  const handleAcquireTagged = async (garment: { title: string; price: number; category: any }) => {
    if (onAddGarment) {
      await onAddGarment(
        garment.title, 
        `Shared styling inspiration blueprint from community post.`, 
        garment.category, 
        { price: garment.price }
      );
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: `Successfully acquired tagged ${garment.title} into your Closet!` 
      }));
    }
  };

  const handleSubmitChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeSelectedGarment) return;

    setChallengeCompleted(true);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '✓ Challenge entry submitted! High wardrobe score computed.' }));
    setTimeout(() => {
      setChallengeCompleted(false);
      setIsChallengeModalOpen(false);
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#05050a] text-zinc-100 p-4 sm:p-6 lg:p-8 select-none">
      
      {/* Visual Title Header */}
      <div className="max-w-6xl mx-auto space-y-3 pb-8 border-b border-white/5 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-500 uppercase block font-light">
              SOCIAL STYLING COMMUNITY
            </span>
            <h1 className="font-serif font-light tracking-tight text-4xl text-white flex items-center gap-2">
              <Users className="w-8 h-8 text-violet-400" /> Style Community
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsChallengeModalOpen(true)}
              className="px-4 py-2.5 bg-white/[0.02] hover:bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-violet-400 animate-pulse" />
              <span>Daily Challenge</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors cursor-pointer font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Share Look</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xl font-light">
          Browse visual creations published by fellow designers. Inspect their garment blueprints, duplicate outfit layouts onto your virtual shelves, and enter style challenge boards.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
        
        {/* Left Column: Social Feed Stream */}
        <div className="lg:col-span-8 space-y-8 text-left">
          {posts.map(post => (
            <div
              key={post.id}
              className="bg-[#08080f]/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col hover:border-white/10 transition-all duration-300"
            >
              {/* Card Header (Creator info) */}
              <div className="p-5 flex items-center justify-between border-b border-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                    <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="block text-xs text-white font-bold">{post.author.name}</span>
                    <span className="block text-[10px] font-mono text-zinc-500">{post.author.handle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {post.vibeTags.map(tag => (
                    <span key={tag} className="text-[9px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Portrait Post Photography */}
              <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                <img src={post.imageUrl} alt="Styling" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                
                {/* Embedded Garment Blueprint tag overlay */}
                {post.taggedGarment && (
                  <div className="absolute bottom-4 left-4 p-3 bg-black/75 backdrop-blur-md rounded-2xl border border-white/10 max-w-xs flex gap-3 items-center shadow-lg">
                    <Tag className="w-4 h-4 text-violet-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-[8px] font-mono text-zinc-500 uppercase">WEARING BLUEPRINT</span>
                      <span className="block text-[11px] font-bold text-white truncate">{post.taggedGarment.title}</span>
                    </div>
                    <button
                      onClick={() => handleAcquireTagged(post.taggedGarment)}
                      className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Acquire
                    </button>
                  </div>
                )}
              </div>

              {/* Engagement icons bar */}
              <div className="px-5 py-4 flex justify-between items-center border-b border-white/[0.03] select-none">
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 text-xs font-mono transition-colors cursor-pointer ${
                      post.hasLiked ? 'text-rose-400' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`transition-colors cursor-pointer ${
                    post.hasBookmarked ? 'text-violet-400' : 'text-zinc-500 hover:text-white'
                  }`}
                  title="Save post"
                >
                  <Bookmark className={`w-4 h-4 ${post.hasBookmarked ? 'fill-violet-400' : ''}`} />
                </button>
              </div>

              {/* Post Caption */}
              <div className="p-5 space-y-3">
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{post.caption}</p>

                {/* Comment Section Panel */}
                {activeCommentsPostId === post.id && (
                  <div className="pt-4 border-t border-white/5 space-y-4 animate-fade-in text-left">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block">Conversational Loop</span>
                    
                    {/* Add Comment input */}
                    <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2 select-text">
                      <input
                        type="text"
                        required
                        placeholder="Write constructive, creative feedback..."
                        value={newCommentInput}
                        onChange={(e) => setNewCommentInput(e.target.value)}
                        className="flex-1 bg-white/[0.02] border border-white/10 px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all flex items-center justify-center cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Comment listings */}
                    {post.comments.length === 0 ? (
                      <p className="text-[10px] text-zinc-500 italic">No feedback published yet. Lead the conversation.</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar pr-1">
                        {post.comments.map((comm, cIdx) => (
                          <div key={cIdx} className="p-2.5 bg-white/[0.01] border border-white/[0.02] rounded-xl">
                            <span className="block text-[10px] font-mono text-zinc-300 font-bold">{comm.author}</span>
                            <p className="text-[11px] text-zinc-400 mt-0.5 font-sans leading-normal">{comm.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Right Column: Style Challenges Widgets */}
        <div className="lg:col-span-4 space-y-6 text-left select-none">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#08080f]/70 to-[#05050a] border border-white/5 space-y-4">
            <div className="pb-3 border-b border-white/5">
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-violet-400 animate-bounce" /> Active Challenge
              </h3>
              <span className="text-[10px] text-emerald-400 block mt-0.5 font-bold uppercase">Reward: 100 Coherence pts</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white">#SlateMinimalism Coordinate</h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Publish a look wearing up to 3 grey or dark slate items from your virtual shelves. The AI evaluator scores color harmony.
              </p>
            </div>

            <div className="pt-2 border-t border-white/[0.04] space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>Active entries</span>
                <span className="text-white">128 Designers</span>
              </div>
              <button
                onClick={() => setIsChallengeModalOpen(true)}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[10px] uppercase tracking-widest rounded-xl transition-colors cursor-pointer font-bold"
              >
                Submit Look Entry
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Pop-up Overlay: Share look wizard */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-text">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b10] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 relative"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 select-none">
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">OUTLINE YOUR CREATIVE STORY</span>
                  <h3 className="font-serif text-lg text-white">Share Styled Look</h3>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="text-xs font-mono text-zinc-500 hover:text-white cursor-pointer"
                >
                  [ CLOSE ]
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block">Share Story (Caption)</label>
                  <textarea
                    required
                    placeholder="Describe comfort, fit alignment, or Milanese/Nordic vibe pairing..."
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    rows={3}
                    className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block">Tag Garment from Shelves</label>
                  <select
                    value={selectedGarmentIndex}
                    onChange={(e) => setSelectedGarmentIndex(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                  >
                    <option value="-1">-- No tag selected --</option>
                    {userWardrobe.map((item, idx) => (
                      <option key={item.id} value={idx}>{item.title} ({item.category})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block">Hashtags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="minimalist, slate, cozy"
                    value={newVibeTag}
                    onChange={(e) => setNewVibeTag(e.target.value)}
                    className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block">Post Image URL</label>
                  <input
                    type="text"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    className="w-full bg-white/[0.01] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 transition-colors text-white font-mono text-xs uppercase tracking-widest rounded-xl font-bold mt-2"
                >
                  Publish Look
                </button>

                {postSuccess && (
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block text-center">✓ Look posted to community stream!</span>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pop-up Overlay: Submit Challenge Entry */}
      <AnimatePresence>
        {isChallengeModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-text">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b10] border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-6 relative"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 select-none">
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">CHALLENGE SUBMISSION PANEL</span>
                  <h3 className="font-serif text-lg text-white">Enter Daily Board</h3>
                </div>
                <button
                  onClick={() => setIsChallengeModalOpen(false)}
                  className="text-xs font-mono text-zinc-500 hover:text-white cursor-pointer"
                >
                  [ CLOSE ]
                </button>
              </div>

              <form onSubmit={handleSubmitChallenge} className="space-y-4 text-left">
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Select a coordinating piece from your active shelves that aligns with the <strong className="text-white">#SlateMinimalism</strong> prompt.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block">Select Garment Entry</label>
                  <select
                    required
                    value={challengeSelectedGarment}
                    onChange={(e) => setChallengeSelectedGarment(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 rounded-lg transition-colors font-mono"
                  >
                    <option value="">-- Choose item --</option>
                    {userWardrobe.map(item => (
                      <option key={item.id} value={item.id}>{item.title}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!challengeSelectedGarment}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors text-white font-mono text-xs uppercase tracking-widest rounded-xl font-bold"
                >
                  Submit Challenge Look
                </button>

                {challengeCompleted && (
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block text-center animate-fade-in">✓ Entry submitted to style board!</span>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
