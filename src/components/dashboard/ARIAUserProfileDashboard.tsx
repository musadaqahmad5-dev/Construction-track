import React, { useEffect, useState, useRef } from 'react';
import {
  User,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Upload,
  Plus,
  Trash2,
  Activity,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Sliders,
  Award,
  BookOpen,
  Camera,
  Shirt,
  Tag,
  Clock,
  Palette,
  Eye,
  Zap,
  ChevronRight,
  X
} from 'lucide-react';
import {
  UserFashionProfile,
  WardrobeItemMetadata,
  OnboardingPreferences,
  ProductionStorage,
  UserFashionProfileEngine,
  WardrobeIntelligenceEngine,
  ImageUploadPipeline,
  UserOnboardingEngine
} from '../../features/ariaProduction';
import { auth } from '../../firebase';

interface ARIAUserProfileDashboardProps {
  onClose?: () => void;
}

export const ARIAUserProfileDashboard: React.FC<ARIAUserProfileDashboardProps> = ({ onClose }) => {
  const [profile, setProfile] = useState<UserFashionProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'STYLE_DNA' | 'WARDROBE' | 'EVOLUTION' | 'SETTINGS'>('STYLE_DNA');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadItemName, setUploadItemName] = useState('');
  const [uploadReasoning, setUploadReasoning] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Onboarding form state
  const [onboardState, setOnboardState] = useState<OnboardingPreferences>(
    UserOnboardingEngine.getDefaultOnboardingState()
  );

  useEffect(() => {
    let unsub = () => {};
    const init = async () => {
      setLoading(true);
      const uid = auth.currentUser?.uid || 'guest_user';
      const userProf = await ProductionStorage.loadUserProfile(uid);
      setProfile(userProf);

      unsub = ProductionStorage.listenToUserProfile(uid, (updatedProf) => {
        setProfile(updatedProf);
      });
      setLoading(false);
    };

    init();
    return () => unsub();
  }, []);

  const handleSaveProfile = async (newProf: UserFashionProfile) => {
    setProfile(newProf);
    await ProductionStorage.saveUserProfile(newProf);
    window.dispatchEvent(
      new CustomEvent('lookvision_show_toast', {
        detail: 'ARIA User Fashion Profile Synchronized!'
      })
    );
  };

  const handleRemoveGarment = async (itemId: string) => {
    if (!profile) return;
    const updatedWardrobe = WardrobeIntelligenceEngine.removeWardrobeItem(profile.wardrobe, itemId);
    const updatedProf = { ...profile, wardrobe: updatedWardrobe };
    await handleSaveProfile(updatedProf);
  };

  const handleRecordWear = async (itemId: string) => {
    if (!profile) return;
    const updatedWardrobe = WardrobeIntelligenceEngine.recordUsage(profile.wardrobe, itemId);
    const updatedProf = { ...profile, wardrobe: updatedWardrobe };
    await handleSaveProfile(updatedProf);
  };

  const handleProcessImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const analysis = await ImageUploadPipeline.processImageUpload(file, 'GARMENT', uploadItemName || file.name.split('.')[0]);
      setUploadPreview(analysis.previewUrl);
      setUploadReasoning(analysis.reasoningNotes);

      if (profile) {
        const { updatedWardrobe } = WardrobeIntelligenceEngine.addWardrobeItem(profile.wardrobe, {
          name: uploadItemName || file.name.split('.')[0] || 'Uploaded Garment',
          category: analysis.detectedGarment.category || 'Outerwear',
          subCategory: analysis.detectedGarment.subCategory || 'Vision Layer',
          imageUrl: analysis.previewUrl,
          colorProfile: analysis.colorProfile,
          materialProfile: analysis.materialProfile,
          usageHistory: {
            timesWorn: 0,
            versatilityRating: 90,
            userRating: 5
          },
          synergyScore: analysis.detectedGarment.synergyScore || 92,
          tags: analysis.suggestedTags
        });

        const updatedProf = { ...profile, wardrobe: updatedWardrobe };
        await handleSaveProfile(updatedProf);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleOnboardingSubmit = async () => {
    const uid = auth.currentUser?.uid || 'guest_user';
    const newProf = UserOnboardingEngine.processOnboardingSubmission(uid, onboardState);
    await handleSaveProfile(newProf);
    setShowOnboardingModal(false);
  };

  const handleLogStyleShift = async () => {
    if (!profile) return;
    const archetypes = UserOnboardingEngine.ARCHETYPES.map((a) => a.id);
    const randomArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];
    const updated = UserFashionProfileEngine.trackStyleEvolution(
      profile,
      'Sartorial Trajectory Re-alignment',
      `ARIA simulated a trajectory shift toward ${randomArchetype} based on latest wear metrics.`,
      randomArchetype
    );
    await handleSaveProfile(updated);
  };

  if (loading || !profile) {
    return (
      <div className="bg-[#05050a] border border-white/10 rounded-2xl p-8 flex items-center justify-center gap-3 text-zinc-300 font-mono text-sm min-h-[400px]">
        <Activity className="w-5 h-5 text-indigo-400 animate-spin" /> Loading ARIA Production Experience Layer...
      </div>
    );
  }

  const personalizationScore = UserFashionProfileEngine.computePersonalizationScore(profile);

  return (
    <div className="bg-[#05050a] border border-violet-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-left text-zinc-100 max-w-7xl mx-auto space-y-6">
      {/* Background Refractions */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-800 flex items-center justify-center shadow-xl shadow-indigo-500/20 border border-white/10">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-black text-white tracking-wide">{profile.displayName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {profile.subscription.plan} • ACTIVE
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              ARIA Production User Experience • Personal Fashion Intelligence Identity
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-2"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Recalibrate DNA
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 border border-violet-400/30 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Garment
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase font-semibold">Personalization Score</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{personalizationScore}%</div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Full ARIA Calibration</span>
        </div>

        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase font-semibold">Wardrobe Items</span>
            <Shirt className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400 font-mono">{profile.wardrobe.totalItems}</div>
          <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
            Avg Synergy: <strong className="text-white">{profile.wardrobe.synergyScoreAvg}%</strong>
          </span>
        </div>

        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase font-semibold">Primary Archetype</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-white truncate">{profile.identity.primaryArchetype}</div>
          <span className="text-[10px] text-purple-400/80 font-mono mt-1 block">
            {profile.identity.vibePolarity}
          </span>
        </div>

        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase font-semibold">Sync Status</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-mono font-bold text-cyan-300">Firestore & Cache v6.0</div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Offline-First Isolated
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveTab('STYLE_DNA')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'STYLE_DNA'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 text-zinc-400'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> Style DNA & Archetype
        </button>
        <button
          onClick={() => setActiveTab('WARDROBE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'WARDROBE'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 text-zinc-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Wardrobe Intelligence ({profile.wardrobe.totalItems})
        </button>
        <button
          onClick={() => setActiveTab('EVOLUTION')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'EVOLUTION'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 text-zinc-400'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Sartorial Evolution ({profile.evolutionMilestones.length})
        </button>
      </div>

      {/* TAB 1: STYLE DNA & ARCHETYPE */}
      {activeTab === 'STYLE_DNA' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Style DNA Vector Gauges */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" /> 8-Dimensional Style DNA Vector
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Palette Harmony', val: profile.identity.styleDNAVector[0] || 0.85 },
                { label: 'Silhouette Structure', val: profile.identity.styleDNAVector[1] || 0.9 },
                { label: 'Formality Alignment', val: profile.identity.styleDNAVector[2] || 0.78 },
                { label: 'Vibe Refraction', val: profile.identity.styleDNAVector[3] || 0.88 },
                { label: 'Brand Affinity', val: profile.identity.styleDNAVector[4] || 0.72 },
                { label: 'Seasonality Adaptability', val: profile.identity.styleDNAVector[5] || 0.85 },
                { label: 'Texture Resonance', val: profile.identity.styleDNAVector[6] || 0.79 },
                { label: 'Style Innovation Risk', val: profile.identity.styleDNAVector[7] || 0.84 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">{item.label}</span>
                    <span className="text-indigo-400 font-bold">{Math.round(item.val * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(item.val * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Aesthetic Traits & Preferences */}
          <div className="space-y-4">
            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" /> Aesthetic Traits & Archetypes
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.identity.aestheticTraits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" /> {trait.name} ({trait.score}%)
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" /> Active Fashion Goals & Silhouettes
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-zinc-500 font-mono block mb-1">Preferred Silhouettes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.preferences.preferredSilhouettes.map((sil, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-200">
                        {sil}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono block mb-1">Favorite Palette</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.preferences.favoriteColors.map((col, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-white/10 text-indigo-300 font-mono">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WARDROBE INTELLIGENCE */}
      {activeTab === 'WARDROBE' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shirt className="w-4 h-4 text-indigo-400" /> Managed Garments ({profile.wardrobe.items.length})
            </h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-xs font-bold text-white transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Garment
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.wardrobe.items.map((item) => (
              <div
                key={item.id}
                className="bg-[#07070c] border border-white/5 rounded-2xl p-4 hover:border-violet-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  {item.imageUrl && (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-zinc-900 relative">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 border border-white/10 text-[10px] font-mono text-emerald-400 font-bold">
                        {item.synergyScore}% Synergy
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-violet-400 font-bold">{item.category}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{item.materialProfile.drapeWeight} Drape</span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">{item.name}</h4>
                  <p className="text-[11px] text-zinc-400 mb-2.5 line-clamp-2">{item.materialProfile.fabricType}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>Worn <strong className="text-white">{item.usageHistory.timesWorn}x</strong></span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRecordWear(item.id)}
                      className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10"
                      title="Record Wear"
                    >
                      +1 Wear
                    </button>
                    <button
                      onClick={() => handleRemoveGarment(item.id)}
                      className="p-1 rounded bg-red-950/50 hover:bg-red-900 text-red-400 border border-red-500/30"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SARTORIAL EVOLUTION */}
      {activeTab === 'EVOLUTION' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" /> Style Evolution Timeline
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Current Evolution Stage: <strong className="text-white">{profile.evolutionStage}</strong>
              </p>
            </div>
            <button
              onClick={handleLogStyleShift}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-amber-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> Log Sartorial Shift
            </button>
          </div>

          <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {profile.evolutionMilestones.map((milestone, idx) => (
              <div key={milestone.id || idx} className="pl-8 relative">
                <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-violet-500 border-2 border-[#05050a]" />
                <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{milestone.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{milestone.date}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-2">{milestone.description}</p>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300">
                      Shift: {milestone.archetypeShift}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                      Confidence: {milestone.confidenceScore}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPLOAD GARMENT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#07070c] border border-violet-500/30 rounded-2xl p-6 max-w-lg w-full space-y-4 relative text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" /> Vision Garment Upload Pipeline
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 font-mono block mb-1">Garment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Asymmetric Wool Blazer"
                  value={uploadItemName}
                  onChange={(e) => setUploadItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-violet-500/50 cursor-pointer transition-all bg-zinc-900/50"
              >
                {uploadPreview ? (
                  <img src={uploadPreview} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-2" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
                    <p className="text-xs text-zinc-300 font-semibold">Click to upload garment image</p>
                    <p className="text-[10px] text-zinc-500">Supports PNG, JPG, WebP</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProcessImage}
                  className="hidden"
                />
              </div>

              {uploading && (
                <div className="text-xs font-mono text-indigo-400 flex items-center justify-center gap-2 py-2">
                  <Activity className="w-4 h-4 animate-spin" /> Vision Analysis Agent processing...
                </div>
              )}

              {uploadReasoning.length > 0 && (
                <div className="bg-black/60 border border-white/5 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Vision Reasoning Trace</span>
                  {uploadReasoning.map((note, idx) => (
                    <div key={idx} className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-violet-400 shrink-0" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-bold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECALIBRATE ONBOARDING MODAL */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#07070c] border border-violet-500/30 rounded-2xl p-6 max-w-xl w-full space-y-4 relative text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" /> Recalibrate ARIA Style Onboarding
              </h3>
              <button onClick={() => setShowOnboardingModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs text-zinc-400 font-mono block mb-1.5">Primary Archetype</label>
                <div className="grid grid-cols-1 gap-2">
                  {UserOnboardingEngine.ARCHETYPES.map((arch) => (
                    <button
                      key={arch.id}
                      onClick={() => setOnboardState({ ...onboardState, primaryArchetype: arch.id })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        onboardState.primaryArchetype === arch.id
                          ? 'bg-indigo-950/80 border-indigo-500 text-white'
                          : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold">{arch.label}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{arch.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-mono block mb-1.5">Preferred Silhouettes</label>
                <div className="flex flex-wrap gap-2">
                  {UserOnboardingEngine.SILHOUETTES.map((sil) => {
                    const isSelected = onboardState.preferredSilhouettes.includes(sil);
                    return (
                      <button
                        key={sil}
                        onClick={() => {
                          const updated = isSelected
                            ? onboardState.preferredSilhouettes.filter((s) => s !== sil)
                            : [...onboardState.preferredSilhouettes, sil];
                          setOnboardState({ ...onboardState, preferredSilhouettes: updated });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                          isSelected
                            ? 'bg-purple-900 border border-purple-400 text-white'
                            : 'bg-zinc-900 border border-white/5 text-zinc-400'
                        }`}
                      >
                        {sil}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setShowOnboardingModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={handleOnboardingSubmit}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
              >
                Save & Calibrate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
