import React, { useState } from 'react';
import { Sparkles, Shield, ShieldCheck, UserPlus, Crown, ArrowRight, Lock, AlertCircle, Search, MessageSquare, Check } from 'lucide-react';
import { AISocialMatchmakerResponse, UserSocialProfile, FashionCommunity } from '../../types/social';

interface AISocialMatchmakerPanelProps {
  onStartConversation: (targetUserId: string) => void;
}

export const AISocialMatchmakerPanel: React.FC<AISocialMatchmakerPanelProps> = ({ onStartConversation }) => {
  const [queryText, setQueryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AISocialMatchmakerResponse | null>(null);

  const sampleQueries = [
    "Find creators with similar fashion interests to my Avant-Garde style DNA.",
    "Recommend luxury haute couture circles focusing on dark tailored coats.",
    "Locate Tokyo cyber streetwear designers specializing in utility outerwear."
  ];

  const handleQueryAI = async (textToSubmit?: string) => {
    const q = textToSubmit || queryText;
    if (!q.trim() || isLoading) return;

    setQueryText(q);
    setIsLoading(true);

    try {
      const res = await fetch('/api/social/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryText: q })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.response) {
          setAiResponse(data.response);
        }
      }
    } catch (err) {
      console.error('[AI Matchmaker Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Header */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Privacy-First AI Social Intelligence</h3>
            <p className="text-xs text-indigo-300 font-mono">
              AI works strictly on user demand. No automatic profiling, no hidden social tracking.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 self-start md:self-auto">
          Explicit Request Mode
        </span>
      </div>

      {/* Query Terminal */}
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-4">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
          Ask AI Social Matchmaker
        </label>

        <div className="flex gap-3">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleQueryAI();
            }}
            placeholder="e.g. 'Find creators who specialize in cyber techwear and asymmetric coats'..."
            className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-all"
          />

          <button
            onClick={() => handleQueryAI()}
            disabled={isLoading || !queryText.trim()}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-lg shadow-violet-950/40 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Scanning Index...' : 'Discover'}</span>
          </button>
        </div>

        {/* Quick Sample Prompts */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Quick Suggestions:</span>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleQueryAI(sq)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-violet-500/30 text-[11px] font-mono text-zinc-400 hover:text-white transition-all cursor-pointer text-left"
              >
                "{sq}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Output Section */}
      {isLoading ? (
        <div className="py-12 text-center bg-[#07070c]/50 border border-white/5 rounded-2xl p-8 space-y-3 animate-pulse">
          <Sparkles className="w-8 h-8 text-violet-400 mx-auto animate-bounce" />
          <h4 className="text-sm font-bold text-white">Analyzing Verified Fashion Index</h4>
          <p className="text-xs text-zinc-500 font-mono">
            Filtering public creator identities and community circles based on explicit permission rules...
          </p>
        </div>
      ) : aiResponse && (
        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-6 animate-fade-in">
          {/* Answer Card */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-300 font-mono">
                AI Matchmaker Analysis
              </h4>
            </div>
            <p className="text-xs text-zinc-200 font-mono leading-relaxed bg-zinc-950 p-4 rounded-xl border border-white/5">
              {aiResponse.answer}
            </p>
          </div>

          {/* Privacy Disclaimer */}
          <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2 border-t border-white/5 pt-3">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{aiResponse.privacyDisclaimer}</span>
          </div>

          {/* Suggested Creators */}
          {aiResponse.suggestedCreators && aiResponse.suggestedCreators.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Discovered Verified Creators ({aiResponse.suggestedCreators.length})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiResponse.suggestedCreators.map((creator) => (
                  <div key={creator.id} className="bg-zinc-950 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-xl object-cover grayscale shrink-0 border border-white/10" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-white truncate">{creator.name}</h5>
                          <Crown className="w-3 h-3 text-emerald-400 shrink-0" />
                        </div>
                        <span className="block text-[10px] font-mono text-violet-400 truncate">{creator.creatorIdentity?.styleVibe}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onStartConversation(creator.id)}
                      className="px-3 py-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-xl text-xs font-mono transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Communities */}
          {aiResponse.suggestedCommunities && aiResponse.suggestedCommunities.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Matching Fashion Circles ({aiResponse.suggestedCommunities.length})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiResponse.suggestedCommunities.map((comm) => (
                  <div key={comm.id} className="bg-zinc-950 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{comm.name}</h5>
                      <span className="block text-[10px] font-mono text-zinc-500 truncate">{comm.category} • {comm.membersCount} members</span>
                    </div>

                    <span className="px-3 py-1.5 bg-zinc-900 border border-white/10 text-zinc-300 rounded-xl text-xs font-mono">
                      Public Circle
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
