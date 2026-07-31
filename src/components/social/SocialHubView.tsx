import React, { useState, useEffect } from 'react';
import { Users, Search, MessageSquare, Shield, Sparkles, Globe, Crown, Lock } from 'lucide-react';
import { UserPrivacySettings } from '../../types/social';
import { UserDiscoveryPanel } from './UserDiscoveryPanel';
import { SocialNetworkPanel } from './SocialNetworkPanel';
import { RealtimeMessagingPanel } from './RealtimeMessagingPanel';
import { FashionCommunitiesPanel } from './FashionCommunitiesPanel';
import { AISocialMatchmakerPanel } from './AISocialMatchmakerPanel';
import { PrivacySettingsModal } from './PrivacySettingsModal';
import { WardrobeItem } from '../../platform';

interface SocialHubViewProps {
  wardrobe?: WardrobeItem[];
}

export const SocialHubView: React.FC<SocialHubViewProps> = ({ wardrobe = [] }) => {
  const [activeTab, setActiveTab] = useState<'CIRCLES' | 'DISCOVERY' | 'MESSAGES' | 'GRAPH' | 'AI_MATCH'>('CIRCLES');
  const [targetDirectUserId, setTargetDirectUserId] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings>({
    visibility: 'public',
    requestPermission: 'everyone',
    messagePermission: 'everyone',
    findability: 'public',
    shareWardrobe: true,
    shareCreations: true
  });

  const fetchPrivacySettings = async () => {
    try {
      const res = await fetch('/api/social/privacy');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setPrivacySettings(data.settings);
        }
      }
    } catch (err) {
      console.error('[Fetch Privacy Error]:', err);
    }
  };

  const handleUpdatePrivacySettings = async (newSettings: UserPrivacySettings) => {
    setPrivacySettings(newSettings);
    try {
      await fetch('/api/social/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (err) {
      console.error('[Update Privacy Error]:', err);
    }
  };

  useEffect(() => {
    fetchPrivacySettings();
  }, []);

  const handleStartConversation = (targetUserId: string) => {
    setTargetDirectUserId(targetUserId);
    setActiveTab('MESSAGES');
  };

  return (
    <div className="space-y-6 text-white min-h-screen bg-[#05050a] p-4 md:p-8">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#07070c] border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-[10px] font-mono tracking-widest uppercase font-bold flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-violet-400" />
              Sartorial Social Graph
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Privacy Guard Active
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Fashion Social Ecosystem
          </h1>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            Connect through fashion creativity, shared style DNA, and avant-garde community circles. Connect with designers, discover public creations, and communicate with privacy controls.
          </p>
        </div>

        {/* Top Right Action */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-violet-500/30 text-zinc-200 hover:text-white rounded-2xl text-xs font-mono font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-violet-400" />
            <span>Privacy Controls</span>
          </button>
        </div>
      </div>

      {/* Main Social Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('CIRCLES')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'CIRCLES'
              ? 'bg-violet-600/20 text-white border border-violet-500/40 shadow-lg shadow-violet-950/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4 text-violet-400" />
          <span>Community Circles</span>
        </button>

        <button
          onClick={() => setActiveTab('DISCOVERY')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'DISCOVERY'
              ? 'bg-violet-600/20 text-white border border-violet-500/40 shadow-lg shadow-violet-950/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className="w-4 h-4 text-violet-400" />
          <span>Global Discovery</span>
        </button>

        <button
          onClick={() => setActiveTab('MESSAGES')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'MESSAGES'
              ? 'bg-violet-600/20 text-white border border-violet-500/40 shadow-lg shadow-violet-950/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-violet-400" />
          <span>Private Messages</span>
        </button>

        <button
          onClick={() => setActiveTab('GRAPH')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'GRAPH'
              ? 'bg-violet-600/20 text-white border border-violet-500/40 shadow-lg shadow-violet-950/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-4 h-4 text-violet-400" />
          <span>Social Network</span>
        </button>

        <button
          onClick={() => setActiveTab('AI_MATCH')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'AI_MATCH'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border border-indigo-400/50 shadow-lg shadow-indigo-950/40'
              : 'text-indigo-300 hover:text-white hover:bg-indigo-950/30'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
          <span>AI Social Assistant</span>
        </button>
      </div>

      {/* Main Viewport Content */}
      <div className="pt-2">
        {activeTab === 'CIRCLES' && <FashionCommunitiesPanel wardrobe={wardrobe} />}
        {activeTab === 'DISCOVERY' && (
          <UserDiscoveryPanel
            onStartConversation={handleStartConversation}
            onOpenProfile={(id) => console.log('Profile view:', id)}
          />
        )}
        {activeTab === 'MESSAGES' && (
          <RealtimeMessagingPanel
            initialTargetUserId={targetDirectUserId}
            wardrobe={wardrobe}
          />
        )}
        {activeTab === 'GRAPH' && <SocialNetworkPanel onStartConversation={handleStartConversation} />}
        {activeTab === 'AI_MATCH' && <AISocialMatchmakerPanel onStartConversation={handleStartConversation} />}
      </div>

      {/* Privacy Settings Modal */}
      <PrivacySettingsModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        currentSettings={privacySettings}
        onUpdateSettings={handleUpdatePrivacySettings}
      />
    </div>
  );
};
