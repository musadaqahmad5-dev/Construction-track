import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Eye, Lock, UserCheck, MessageSquare, Globe, Check, X, AlertCircle } from 'lucide-react';
import { UserPrivacySettings } from '../../types/social';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: UserPrivacySettings;
  onUpdateSettings: (newSettings: UserPrivacySettings) => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onUpdateSettings
}) => {
  const [settings, setSettings] = useState<UserPrivacySettings>(currentSettings);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings(settings);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[#07070c] border border-white/10 rounded-2xl shadow-2xl p-6 text-white space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Privacy & Social Boundaries</h3>
                <p className="text-xs text-zinc-400 font-mono">Control visibility, messaging & AI access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 font-mono leading-relaxed flex gap-3 items-start">
            <Lock className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
            <span>
              <strong>Privacy Guard Active:</strong> Your digital wardrobe, private creations, and personal details remain strictly isolated. AI engines never reveal private matches without explicit authorization.
            </span>
          </div>

          {/* Controls */}
          <div className="space-y-5">
            {/* 1. Profile Visibility */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Profile Visibility
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['public', 'connections', 'private'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSettings(s => ({ ...s, visibility: mode }))}
                    className={`p-3 rounded-xl border text-xs font-mono capitalize transition-all cursor-pointer text-center ${
                      settings.visibility === mode
                        ? 'bg-violet-600/20 border-violet-500 text-white font-semibold'
                        : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Friend Requests Permission */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Who Can Send Friend Requests
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['everyone', 'connections', 'nobody'] as const).map((perm) => (
                  <button
                    key={perm}
                    onClick={() => setSettings(s => ({ ...s, requestPermission: perm }))}
                    className={`p-3 rounded-xl border text-xs font-mono capitalize transition-all cursor-pointer text-center ${
                      settings.requestPermission === perm
                        ? 'bg-violet-600/20 border-violet-500 text-white font-semibold'
                        : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {perm === 'connections' ? 'Friends of Friends' : perm}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Messaging Permission */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Who Can Direct Message You
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['everyone', 'connections', 'nobody'] as const).map((perm) => (
                  <button
                    key={perm}
                    onClick={() => setSettings(s => ({ ...s, messagePermission: perm }))}
                    className={`p-3 rounded-xl border text-xs font-mono capitalize transition-all cursor-pointer text-center ${
                      settings.messagePermission === perm
                        ? 'bg-violet-600/20 border-violet-500 text-white font-semibold'
                        : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {perm === 'connections' ? 'Connections' : perm}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Global Discovery */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900/40 border border-white/5 rounded-xl">
              <div>
                <span className="text-xs font-bold text-white block">Global Discovery Findability</span>
                <span className="text-[10px] text-zinc-400 font-mono">Allow other members to discover your handle in social search</span>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, findability: s.findability === 'public' ? 'private' : 'public' }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  settings.findability === 'public'
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-zinc-800 border border-white/10 text-zinc-400'
                }`}
              >
                {settings.findability === 'public' ? 'Public' : 'Hidden'}
              </button>
            </div>

            {/* 5. Toggles for Wardrobe & Creations */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-white/5 rounded-xl">
                <span className="text-xs text-zinc-300 font-mono">Share Public Digital Wardrobe Items</span>
                <input
                  type="checkbox"
                  checked={settings.shareWardrobe}
                  onChange={(e) => setSettings(s => ({ ...s, shareWardrobe: e.target.checked }))}
                  className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-white/5 rounded-xl">
                <span className="text-xs text-zinc-300 font-mono">Share Public AI Creations & Outfits</span>
                <input
                  type="checkbox"
                  checked={settings.shareCreations}
                  onChange={(e) => setSettings(s => ({ ...s, shareCreations: e.target.checked }))}
                  className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-lg shadow-violet-950/40 flex items-center gap-2 cursor-pointer"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Shield className="w-4 h-4" />}
              <span>{isSaved ? 'Boundaries Locked' : 'Save Privacy Controls'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
