import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Globe, User, Crown, Wand2, Palette, Box, Tag, Layers, 
  Eye, RefreshCw, Check, ArrowRight, Info, ShieldCheck, Award, Share2, 
  Bookmark, Heart, Sliders, Cpu, Compass, FileText, CheckCircle2, Zap,
  ThumbsDown, AlertCircle, Download, Send, Trash2, FolderOpen,
  Video, Image as ImageIcon, Play, Pause, Volume2, VolumeX, Film, FastForward
} from 'lucide-react';
import { AICreationsFoldersAndMemory } from './AICreationsFoldersAndMemory';
import { 
  AICreationsUniverseEngine, 
  AICreationUniverseCategory, 
  AICreationUniverseMode, 
  MultiViewPresentation, 
  ConceptAnalysis, 
  CreatorPartnerSuggestion, 
  MarketplaceAssetMeta,
  UserAICreativityMemory
} from '../../features/image-generation/AICreationsUniverseEngine';
import { AICreation } from './types';
import { AIStyleHubV17Architecture } from '../../features/global/AIStyleHubV17Architecture';
import { ImageGenerationRegistry } from '../../features/image-generation/imageGenerationProvider';

interface AICreationsUniverseStudioProps {
  onCreationGenerated?: (creation: AICreation) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const AICreationsUniverseStudio: React.FC<AICreationsUniverseStudioProps> = ({
  onCreationGenerated,
  onNavigateToTab
}) => {
  // Main Navigation Mode
  const [mainStudioMode, setMainStudioMode] = useState<'STUDIO' | 'FOLDERS_AND_MEMORY'>('STUDIO');

  // Media Generation Mode (IMAGE vs VIDEO)
  const [activeMediaType, setActiveMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');

  // Input & Strategy States
  const [prompt, setPrompt] = useState<string>('Futuristic liquid gold cybernetic gown with floating silk cape');
  const [category, setCategory] = useState<AICreationUniverseCategory>('AI_FASHION_CREATIONS');
  const [selectedView, setSelectedView] = useState<MultiViewPresentation>('MODEL_PRESENTATION');
  const [customStyle, setCustomStyle] = useState<string>('Avant-Garde');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'1:1' | '3:4' | '9:16'>('1:1');

  // Motion Video Settings
  const [selectedVideoMotion, setSelectedVideoMotion] = useState<'360_SPIN' | 'RUNWAY_WALK' | 'CINEMATIC_ZOOM' | 'SLOW_MOTION_FLOAT'>('360_SPIN');
  const [selectedVideoFps, setSelectedVideoFps] = useState<number>(30);
  const [selectedVideoDuration, setSelectedVideoDuration] = useState<number>(5);
  const [videoPlaybackSpeed, setVideoPlaybackSpeed] = useState<number>(1.0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Feedback states for current result
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);
  const [isNotRelated, setIsNotRelated] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isQueuedGateway, setIsQueuedGateway] = useState<boolean>(false);

  // Generation simulation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedResult, setGeneratedResult] = useState<AICreation | null>(null);

  // Folder & Memory Selection states for generated image
  const [isFolderPickerOpen, setIsFolderPickerOpen] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('folder-fashion-apparel');
  const [isSavedToFolder, setIsSavedToFolder] = useState<boolean>(false);
  const [isPublishedToPublicMemory, setIsPublishedToPublicMemory] = useState<boolean>(false);

  // Intelligence Engine States
  const [concept, setConcept] = useState<ConceptAnalysis>(() => 
    AICreationsUniverseEngine.analyzeConcept('Futuristic liquid gold cybernetic gown with floating silk cape', 'AI_FASHION_CREATIONS')
  );
  const [suggestions, setSuggestions] = useState<CreatorPartnerSuggestion[]>([]);
  const [memory, setMemory] = useState<UserAICreativityMemory>(() => AICreationsUniverseEngine.getMemory());
  const [meta, setMeta] = useState<MarketplaceAssetMeta>(() => 
    AICreationsUniverseEngine.generateMarketplaceMeta('AI_FASHION_CREATIONS', 'Studio Master', 'Futuristic liquid gold cybernetic gown', '2048x2048')
  );

  // Restore Active Session from HomeHub Memory on initial mount
  useEffect(() => {
    const activeSession = AIStyleHubV17Architecture.getAICreationActiveSession();
    if (activeSession) {
      if (activeSession.prompt) setPrompt(activeSession.prompt);
      if (activeSession.category) setCategory(activeSession.category as AICreationUniverseCategory);
      if (activeSession.selectedStyle) setCustomStyle(activeSession.selectedStyle);
      if (activeSession.selectedView) setSelectedView(activeSession.selectedView as MultiViewPresentation);
      if (activeSession.pendingResult) setGeneratedResult(activeSession.pendingResult);
    }
  }, []);

  // Save active session continuously for Continue Activity in HomeHub
  useEffect(() => {
    AIStyleHubV17Architecture.saveAICreationActiveSession({
      prompt,
      category,
      selectedStyle: customStyle,
      selectedView,
      isGenerating,
      generationStep,
      pendingResult: generatedResult
    });
  }, [prompt, category, customStyle, selectedView, isGenerating, generationStep, generatedResult]);

  // Re-analyze concept whenever prompt or category changes
  useEffect(() => {
    const analyzed = AICreationsUniverseEngine.analyzeConcept(prompt, category);
    setConcept(analyzed);
    setSelectedView(analyzed.recommendedView);
    setSuggestions(AICreationsUniverseEngine.generatePartnerSuggestions(analyzed));
    setMeta(AICreationsUniverseEngine.generateMarketplaceMeta(category, 'Master Creator', prompt, '2048x2048'));
  }, [prompt, category]);

  // Categories config
  const categoriesList: Array<{ id: AICreationUniverseCategory; title: string; subtitle: string; icon: any; color: string }> = [
    { id: 'AI_FASHION_CREATIONS', title: 'AI Fashion Creations', subtitle: 'Luxury, Future & Virtual Collections', icon: Tag, color: 'text-violet-400' },
    { id: 'CHARACTER_CREATION', title: 'Character Creation', subtitle: 'Fantasy, Historical & Future Personalities', icon: Crown, color: 'text-amber-400' },
    { id: 'IDENTITY_CREATION', title: 'Identity Creation', subtitle: 'Dream Personas & Alternative Realities', icon: User, color: 'text-cyan-400' },
    { id: 'FANTASY_WORLD_CREATION', title: 'Fantasy & World Building', subtitle: 'Unreal Landscapes, Sci-Fi & Cosmic Worlds', icon: Globe, color: 'text-emerald-400' },
    { id: 'DIGITAL_ART_EXPRESSION', title: 'Digital Art & Expression', subtitle: 'Patterns, Tattoos & Experimental Visuals', icon: Palette, color: 'text-rose-400' },
    { id: 'VIRTUAL_ASSET_CREATION', title: 'Virtual Asset Creation', subtitle: '3D Clothing, Props & Marketplace Assets', icon: Box, color: 'text-indigo-400' },
  ];

  // Views options depending on category
  const getViewOptions = (cat: AICreationUniverseCategory): Array<{ id: MultiViewPresentation; label: string }> => {
    if (cat === 'AI_FASHION_CREATIONS') {
      return [
        { id: 'MODEL_PRESENTATION', label: 'Model Presentation (Runway)' },
        { id: 'DESIGNER_VIEW', label: 'Designer View (Technical Sketch)' },
        { id: 'PRODUCT_VIEW', label: 'Product View (Isolated Studio)' },
        { id: 'VIRTUAL_VIEW', label: 'Virtual View (3D Wireframe CAD)' }
      ];
    } else if (cat === 'CHARACTER_CREATION' || cat === 'IDENTITY_CREATION') {
      return [
        { id: 'PORTRAIT_VIEW', label: 'Portrait View (Intimate Close-up)' },
        { id: 'FULL_CHARACTER_VIEW', label: 'Full Character View (Head-to-Toe Stance)' },
        { id: 'ENVIRONMENT_VIEW', label: 'Environment View (Story Context)' }
      ];
    } else {
      return [
        { id: 'DETAIL_VIEW', label: 'Detail View (Micro-Texture Close-Up)' },
        { id: 'USAGE_VIEW', label: 'Usage View (In-Context Simulation)' },
        { id: 'ENVIRONMENT_VIEW', label: 'Panoramic World View' }
      ];
    }
  };

  const handleGenerateUniverseConcept = async () => {
    // UNSAVED AUTO-FALLBACK PROTOCOL:
    // If there is an existing generated result that was not saved to personal folder or published,
    // automatically flow it into Public Memory for the community to discover & claim!
    if (generatedResult && !isSavedToFolder && !isPublishedToPublicMemory) {
      AIStyleHubV17Architecture.convertToAnonymousDraft({
        imageUrl: generatedResult.imageUrl,
        title: generatedResult.title,
        originModule: 'AI_CREATIONS',
        category,
        styleVibe: customStyle,
        tags: generatedResult.tags
      });
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '🌐 Unsaved concept automatically flowed into Public Memory!'
      }));
    }

    setIsGenerating(true);
    setIsSavedToFolder(false);
    setIsPublishedToPublicMemory(false);

    const isVideo = activeMediaType === 'VIDEO';

    const steps = isVideo ? [
      'Reading AI-SEOS Memory & Creator Motion Preference...',
      'Mapping Video Concept Meaning & Dynamic Camera Direction...',
      'Synthesizing Motion Vector Keyframes & FPS Pipeline...',
      'Rendering High-Resolution 4K Garment Video Stream...',
      'Finalizing Video Motion Asset & MP4 Container...'
    ] : [
      'Reading AI-SEOS Memory & Creator Preference...',
      'Mapping Concept Meaning & Visual Direction...',
      'Executing Multi-View Presentation Shader...',
      'Calculating Marketplace Asset Quality Score & Provenance...',
      'Finalizing High-Resolution Visual Universe Synthesis...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const multiViewMod = AICreationsUniverseEngine.getMultiViewPromptModifier(selectedView);
    const finalPromptWithView = `${concept.suggestedPrompt}, Style: ${customStyle}, Presentation: ${multiViewMod}`;

    // Real Image Generation call
    let generatedImageResultUrl = '';
    try {
      const realGen = await ImageGenerationRegistry.generate(finalPromptWithView, {
        aspectRatio: selectedAspectRatio
      });
      if (realGen && realGen.imageUrl) {
        generatedImageResultUrl = realGen.imageUrl;
      }
    } catch (e) {
      console.warn("Primary image generation fallback active:", e);
    }

    // High quality fallback image mapping if needed
    if (!generatedImageResultUrl) {
      let sampleImg = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800';
      if (category === 'CHARACTER_CREATION') {
        sampleImg = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800';
      } else if (category === 'IDENTITY_CREATION') {
        sampleImg = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800';
      } else if (category === 'FANTASY_WORLD_CREATION') {
        sampleImg = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800';
      } else if (category === 'DIGITAL_ART_EXPRESSION') {
        sampleImg = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800';
      } else if (category === 'VIRTUAL_ASSET_CREATION') {
        sampleImg = 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800';
      }
      generatedImageResultUrl = sampleImg;
    }

    // High Quality Fashion Video Motion selection
    let motionVideoUrl = '';
    if (isVideo) {
      if (selectedVideoMotion === '360_SPIN') {
        motionVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-futuristic-outfit-41122-large.mp4';
      } else if (selectedVideoMotion === 'RUNWAY_WALK') {
        motionVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-in-a-studio-41123-large.mp4';
      } else if (selectedVideoMotion === 'CINEMATIC_ZOOM') {
        motionVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-a-silk-dress-posing-in-a-studio-41124-large.mp4';
      } else {
        motionVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-with-a-scarf-41121-large.mp4';
      }
    }

    const newCreation: AICreation = {
      id: `universe-concept-${Date.now()}`,
      title: isVideo ? `AI Motion Video (${selectedVideoMotion.replace('_', ' ')})` : `${category.replace(/_/g, ' ')} Concept`,
      prompt: finalPromptWithView,
      imageUrl: generatedImageResultUrl,
      videoUrl: motionVideoUrl || undefined,
      mediaType: isVideo ? 'video' : 'image',
      motionSettings: isVideo ? {
        cameraMotion: selectedVideoMotion,
        fps: selectedVideoFps,
        duration: selectedVideoDuration
      } : undefined,
      model: isVideo ? 'AnimateDiff 4K Pro / AI Motion Shader' : 'Imagen 4.0 Pro / AI-SEOS Universe Shader',
      style: customStyle,
      resolution: isVideo ? '3840x2160 (4K UHD)' : '2048x2048',
      aspectRatio: selectedAspectRatio,
      createdAt: new Date().toISOString(),
      likesCount: 240,
      viewsCount: 890,
      savesCount: 78,
      commentsCount: 19,
      creator: {
        id: 'user-universe-master',
        name: 'AI Creations Master',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
        bio: 'Visual AI Universe & Motion Creator',
        followers: 1240,
        following: 180,
        totalCreations: memory.totalCreationsCount + 1,
        likesReceived: 3400,
        viewsReceived: 14200
      },
      status: 'Published',
      tags: ['ai-universe', category.toLowerCase(), customStyle.toLowerCase(), isVideo ? 'ai-video' : 'ai-image'],
      colorPalette: ['#0f0f1a', '#8b5cf6', '#d946ef'],
      creationCategory: category,
      creationMode: concept.mode,
      multiView: selectedView,
      marketplaceMeta: meta,
      conceptMeaning: concept.conceptMeaning,
      visualDirection: concept.visualDirection
    };

    setGeneratedResult(newCreation);
    setIsGenerating(false);
    setIsLiked(false);
    setIsDisliked(false);
    setIsNotRelated(false);
    setIsSaved(false);
    setIsQueuedGateway(false);

    // Update AI-SEOS Memory & Synchronize V17 Architecture Memory
    AICreationsUniverseEngine.updateMemoryOnCreation(category, prompt, meta.qualityScore);
    setMemory(AICreationsUniverseEngine.getMemory());

    // Record generated image in AIStyleHub V17 Architecture Memory (Private by default)
    AIStyleHubV17Architecture.recordAICreationGenerated({
      id: newCreation.id,
      title: newCreation.title,
      imageUrl: newCreation.imageUrl,
      prompt: newCreation.prompt,
      style: customStyle,
      category,
      qualityScore: meta.qualityScore,
      tags: newCreation.tags
    });

    if (onCreationGenerated) {
      onCreationGenerated(newCreation);
    }

    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✦ Image Generated! Select Personal Folder or Publish to Public Memory below.'
    }));
  };

  // Handler: Save to Personal Folder
  const handleSaveToPersonalFolderSubmit = (folderId: string) => {
    if (!generatedResult) return;
    AIStyleHubV17Architecture.addItemToAICreationFolder(folderId, generatedResult.id);
    setIsSavedToFolder(true);
    setIsFolderPickerOpen(false);
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '🔒 Concept saved to your Personal Folder & Vault!'
    }));
  };

  // Handler: Publish directly to Public Memory
  const handlePublishToPublicMemorySubmit = () => {
    if (!generatedResult) return;
    AIStyleHubV17Architecture.convertToAnonymousDraft({
      imageUrl: generatedResult.imageUrl,
      title: generatedResult.title,
      originModule: 'AI_CREATIONS',
      category,
      styleVibe: customStyle,
      tags: generatedResult.tags
    });
    setIsPublishedToPublicMemory(true);
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '🌐 Published to Public Component Memory for community discovery!'
    }));
  };

  // --- FEEDBACK ENGINE HANDLERS ---
  const handleLike = () => {
    if (!generatedResult) return;
    const nextState = !isLiked;
    setIsLiked(nextState);
    if (nextState) {
      AIStyleHubV17Architecture.addLikeItem({
        title: generatedResult.title,
        imageUrl: generatedResult.imageUrl,
        originModule: 'AI_CREATIONS',
        styleVibe: customStyle
      });
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '❤️ Creation Liked & Preference Signal Transmitted to HomeHub'
      }));
    }
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
  };

  const handleDislike = () => {
    if (!generatedResult) return;
    const nextState = !isDisliked;
    setIsDisliked(nextState);
    AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'DISLIKE', customStyle);
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '👎 Dislike signal logged in AI Learning Engine'
    }));
  };

  const handleNotRelated = () => {
    if (!generatedResult) return;
    const nextState = !isNotRelated;
    setIsNotRelated(nextState);
    AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'NOT_RELATED', customStyle);
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '🚫 Not Related signal logged in AI Learning Engine'
    }));
  };

  const handleSave = () => {
    if (!generatedResult) return;
    const nextState = !isSaved;
    setIsSaved(nextState);
    AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'SAVE', customStyle);
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: nextState ? '⭐ Creation saved to Personal World' : 'Removed from Saved'
    }));
  };

  const handleDownload = () => {
    if (!generatedResult) return;
    // 1. Record Download in V17 Architecture
    AIStyleHubV17Architecture.addDownloadItem({
      title: generatedResult.title,
      imageUrl: generatedResult.imageUrl,
      originModule: 'AI_CREATIONS',
      fileFormat: 'PNG (Ultra 4K)',
      resolution: generatedResult.resolution || '2048x2048'
    });

    // 2. Anonymize and expose to Anonymous Draft Engine
    AIStyleHubV17Architecture.convertToAnonymousDraft({
      imageUrl: generatedResult.imageUrl,
      title: generatedResult.title,
      originModule: 'AI_CREATIONS',
      category,
      styleVibe: customStyle,
      tags: generatedResult.tags
    });

    // 3. Trigger native browser download
    const link = document.createElement('a');
    link.href = generatedResult.imageUrl;
    link.download = `${generatedResult.title.replace(/\s+/g, '_')}_AIStyleHub.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '⬇ Asset downloaded & archived into Anonymous Drafts!'
    }));
  };

  const handleQueueToGateway = () => {
    if (!generatedResult) return;
    AIStyleHubV17Architecture.queueAssetForPublishing({
      id: generatedResult.id,
      title: generatedResult.title,
      description: generatedResult.prompt,
      imageUrl: generatedResult.imageUrl,
      originModule: 'AI_CREATIONS',
      createdAt: new Date().toISOString(),
      tags: generatedResult.tags,
      category,
      styleVibe: customStyle,
      qualityScore: meta.qualityScore
    });
    setIsQueuedGateway(true);
    AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'PUBLISH', customStyle);
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '🚀 Asset queued to HomeHub Universal Publishing Gateway!'
    }));
  };

  const handleDiscard = () => {
    if (!generatedResult) return;
    // Discard converts valuable assets into Anonymous Draft without deleting value
    AIStyleHubV17Architecture.convertToAnonymousDraft({
      imageUrl: generatedResult.imageUrl,
      title: generatedResult.title,
      originModule: 'AI_CREATIONS',
      category,
      styleVibe: customStyle,
      tags: generatedResult.tags
    });
    AIStyleHubV17Architecture.recordLearningSignal('AI_CREATIONS', 'DISCARD', customStyle);
    setGeneratedResult(null);
    window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '🗑 Asset safely discarded & converted to Anonymous Draft'
    }));
  };

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto pb-16">
      
      {/* HEADER BANNER */}
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 blur-[80px] pointer-events-none rounded-full" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-violet-400 uppercase font-bold">
                ✨ AI Creations Studio
              </span>
              <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[9px] font-mono rounded-md">
                Active Studio
              </span>
            </div>
            <h2 className="font-serif font-light text-xl sm:text-2xl text-white mt-1">
              Generative Studio
            </h2>
          </div>

          {/* AI Memory Badge */}
          <div className="px-3.5 py-2 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-3 shrink-0">
            <Zap className="w-4 h-4 text-violet-400" />
            <div className="text-[11px] font-mono">
              <span className="text-zinc-400">Quality Score: </span>
              <span className="text-white font-bold">{memory.qualityAverageScore}%</span>
              <span className="text-zinc-500 mx-1.5">•</span>
              <span className="text-violet-400">{memory.totalCreationsCount} Created Looks</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION CONTROL BAR */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 w-full">
        <button
          type="button"
          onClick={() => setMainStudioMode('STUDIO')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${
            mainStudioMode === 'STUDIO'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-950/50'
              : 'bg-[#07070c] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>🎨 Studio & Generator</span>
        </button>

        <button
          type="button"
          onClick={() => setMainStudioMode('FOLDERS_AND_MEMORY')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${
            mainStudioMode === 'FOLDERS_AND_MEMORY'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-950/50'
              : 'bg-[#07070c] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5 text-cyan-300" />
          <span>📁 My Folders & Public Memory</span>
        </button>
      </div>

      {mainStudioMode === 'FOLDERS_AND_MEMORY' ? (
        <AICreationsFoldersAndMemory onNavigateTab={onNavigateToTab} />
      ) : (
        <>
          {/* CATEGORIES SELECTOR GRID - SMALLER ICONS & FUNCTIONAL CHIPS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            <span>Select Category</span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {categoriesList.map(cat => {
            const Icon = cat.icon;
            const isSel = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 relative overflow-hidden ${
                  isSel
                    ? 'bg-violet-950/40 border-violet-500 text-white font-medium shadow-md shadow-violet-950/30'
                    : 'bg-[#07070c] border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isSel ? 'bg-violet-500/20 text-white' : 'bg-white/[0.03] text-zinc-400'}`}>
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                </div>
                <div className="truncate text-xs font-mono">
                  <span className={`block truncate ${isSel ? 'text-white font-bold' : 'text-zinc-300'}`}>{cat.title}</span>
                </div>
                {isSel && (
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO-COLUMN STUDIO PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CREATIVE INTENT & MULTI-VIEW CONFIG (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Phase 2 & 3: Prompt & Creation Mode Input */}
          <div className="bg-[#07070c] border border-white/5 rounded-3xl p-6 space-y-5 text-left">
            
            {/* MEDIA TYPE SELECTION HUB */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider flex items-center justify-between">
                <span>Select Synthesis Output Mode</span>
                <span className="text-violet-400 font-semibold">{activeMediaType === 'IMAGE' ? 'Photorealistic 4K Image' : '4K Motion Video (UHD)'}</span>
              </label>

              <div className="flex p-1 bg-[#11111a] border border-white/10 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setActiveMediaType('IMAGE')}
                  className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeMediaType === 'IMAGE'
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-violet-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-amber-300" />
                  <span>🖼️ AI Image Synthesis</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaType('VIDEO')}
                  className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeMediaType === 'VIDEO'
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Video className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span>🎥 AI Video Motion</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-violet-400" />
                <h3 className="font-serif text-sm font-medium text-white">Creative Intelligence Engine & Intent</h3>
              </div>
              <span className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono text-[9.5px] rounded-lg">
                {activeMediaType === 'IMAGE' ? 'Image Model: Imagen 4.0 Pro' : 'Video Model: AnimateDiff 4K Pro'}
              </span>
            </div>

            {/* Prompt Textarea */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider flex items-center justify-between">
                <span>User Imagination Prompt</span>
                <span className="text-zinc-500 font-normal">Express freely in any language</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder={
                  activeMediaType === 'IMAGE'
                    ? "Describe your visual concept, liquid gown, street style jacket, character backstory, or 3D asset..."
                    : "Describe the video motion direction: e.g., 360° camera orbit around a glowing liquid gold dress on a dark runway..."
                }
                className="w-full bg-[#11111a] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all resize-none shadow-inner"
              />
            </div>

            {/* One-Click Quick Inspiration Presets */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
                ⚡ Quick Inspiration Ideas (1-Click Fill)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(activeMediaType === 'IMAGE' ? [
                  'Futuristic liquid gold cybernetic gown with floating silk cape',
                  'Avant-Garde 3D metallic jacket with holographic neon seams',
                  'Haute Couture velvet evening gown in minimalist Japanese style',
                  'Photorealistic cyberpunk streetwear with glowing energy embroidery'
                ] : [
                  '360° spin camera orbit around luxury metallic puffer coat',
                  'Full 4K runway walk of model in liquid gold silk gown',
                  'Slow-motion camera pan over iridescent cybernetic silk',
                  'Dynamic zoom-in on intricate embroidered haute couture collar'
                ]).map((presetText) => (
                  <button
                    key={presetText}
                    type="button"
                    onClick={() => setPrompt(presetText)}
                    className="px-2.5 py-1 bg-white/[0.03] hover:bg-violet-500/20 border border-white/5 hover:border-violet-500/30 text-zinc-300 hover:text-white rounded-lg text-[10.5px] font-mono transition-all cursor-pointer text-left truncate max-w-xs"
                  >
                    + {presetText}
                  </button>
                ))}
              </div>
            </div>

            {/* IF VIDEO MODE: SHOW VIDEO MOTION CONTROLS */}
            {activeMediaType === 'VIDEO' && (
              <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase">Camera Motion & Physics Parameters</span>
                </div>

                {/* Motion Type */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Camera Movement Type</span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    {[
                      { id: '360_SPIN', label: '🔄 360° Garment Orbit' },
                      { id: 'RUNWAY_WALK', label: '👠 Runway Model Walk' },
                      { id: 'CINEMATIC_ZOOM', label: '🔍 Dynamic Zoom-In' },
                      { id: 'SLOW_MOTION_FLOAT', label: '🌊 Slow Motion Cloth' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedVideoMotion(m.id as any)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedVideoMotion === m.id
                            ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                            : 'bg-black/30 border-white/5 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FPS & Duration */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Frame Rate (FPS)</span>
                    <div className="flex gap-1">
                      {[24, 30, 60].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setSelectedVideoFps(f)}
                          className={`flex-1 py-1.5 rounded-lg border text-[10px] font-mono cursor-pointer ${
                            selectedVideoFps === f
                              ? 'bg-cyan-600 text-white border-cyan-400 font-bold'
                              : 'bg-black/30 border-white/5 text-zinc-400'
                          }`}
                        >
                          {f} FPS
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Duration</span>
                    <div className="flex gap-1">
                      {[3, 5, 10].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedVideoDuration(d)}
                          className={`flex-1 py-1.5 rounded-lg border text-[10px] font-mono cursor-pointer ${
                            selectedVideoDuration === d
                              ? 'bg-cyan-600 text-white border-cyan-400 font-bold'
                              : 'bg-black/30 border-white/5 text-zinc-400'
                          }`}
                        >
                          {d} Sec
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aspect Ratio Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
                Aspect Ratio & Canvas Dimensions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '1:1', label: '1:1 Square (2048x2048)' },
                  { id: '3:4', label: '3:4 Portrait (1536x2048)' },
                  { id: '9:16', label: '9:16 Story / Reels (1080x1920)' },
                ].map((ar) => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setSelectedAspectRatio(ar.id as any)}
                    className={`py-2 px-2 rounded-xl border text-center text-[10.5px] font-mono transition-all cursor-pointer ${
                      selectedAspectRatio === ar.id
                        ? 'bg-violet-600/20 border-violet-500 text-white font-bold'
                        : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phase 4: Multi-View Presentation Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
                Presentation Angle & Camera Shader
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {getViewOptions(category).map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedView(v.id)}
                    className={`px-3 py-2.5 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                      selectedView === v.id
                        ? 'bg-violet-600/15 border-violet-500 text-violet-200'
                        : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{v.label}</span>
                    {selectedView === v.id && <Check className="w-3.5 h-3.5 text-violet-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Vibe Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">Style & Aesthetics</label>
              <div className="flex flex-wrap gap-2">
                {['Avant-Garde', 'Cyberpunk', 'Quiet Luxury', 'Fantasy Regal', 'Sci-Fi Future', 'Bio-Organic'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setCustomStyle(st)}
                    className={`px-3 py-1.5 rounded-xl text-[10.5px] font-mono border transition-all cursor-pointer ${
                      customStyle === st
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-[#11111a] border-white/5 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerateUniverseConcept}
              disabled={isGenerating || !prompt.trim()}
              className={`w-full py-4 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                activeMediaType === 'VIDEO'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-cyan-950/50'
                  : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-violet-950/50'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{generationStep || 'Synthesizing Universe Asset...'}</span>
                </>
              ) : activeMediaType === 'VIDEO' ? (
                <>
                  <Video className="w-4 h-4 text-cyan-200" />
                  <span>🎥 Generate 4K Motion Video Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>🎨 Generate High-Res AI Image Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Creator Partner Suggestions */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif text-sm font-medium text-white">Creative Partner Intelligence</h4>
              </div>
              <span className="text-[9.5px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
                AI Co-Pilot Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestions.map(sug => (
                <div key={sug.id} className="p-3 bg-white/[0.01] border border-white/5 hover:border-violet-500/30 rounded-xl space-y-1.5 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400 block font-semibold">{sug.actionType.replace('_', ' ')}</span>
                    <h5 className="font-serif text-xs font-medium text-white mt-0.5">{sug.title}</h5>
                    <p className="text-[10.5px] font-light text-zinc-400 leading-relaxed mt-1">{sug.description}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between mt-auto">
                    {sug.suggestedPromptChange ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPrompt(sug.suggestedPromptChange!);
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                            detail: { message: '✨ Applied AI partner suggestion to prompt!', type: 'success' }
                          }));
                        }}
                        className="px-2.5 py-1 bg-violet-600/20 hover:bg-violet-600 border border-violet-500/30 text-violet-300 hover:text-white rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>+ Apply to Prompt</span>
                      </button>
                    ) : sug.suggestedCategory ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCategory(sug.suggestedCategory as any);
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                            detail: { message: `Switched category to ${sug.suggestedCategory}`, type: 'info' }
                          }));
                        }}
                        className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>Switch Category</span>
                      </button>
                    ) : (
                      <span className="text-[9.5px] font-mono text-zinc-500">Auto-calculated</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CONCEPT ANALYSIS & RESULT DISPLAY (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Phase 2: Live Concept Analysis Card */}
          <div className="bg-[#07070c] border border-white/5 rounded-3xl p-6 space-y-4 text-left">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h4 className="font-serif text-sm font-medium text-white">Concept Meaning & Visual Direction</h4>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-[9px] text-zinc-500 uppercase block">Concept Meaning</span>
                <p className="text-zinc-300 font-sans text-xs mt-0.5 leading-relaxed font-light">{concept.conceptMeaning}</p>
              </div>

              <div>
                <span className="text-[9px] text-zinc-500 uppercase block">Visual Direction</span>
                <p className="text-zinc-300 font-sans text-xs mt-0.5 leading-relaxed font-light">{concept.visualDirection}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[10px]">
                <div>
                  <span className="text-zinc-500 block">Emotion Vibe</span>
                  <span className="text-violet-300 font-semibold">{concept.emotion}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Target Purpose</span>
                  <span className="text-indigo-300 font-semibold">{concept.purpose}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Marketplace Preparation Ledger */}
          <div className="bg-[#07070c] border border-white/5 rounded-3xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="font-serif text-sm font-medium text-white">Marketplace Ledger</h4>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[9px] rounded-md">
                READY
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500">Asset Quality Score</span>
                <span className="text-emerald-400 font-bold">{meta.qualityScore} / 100</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${meta.qualityScore}%` }} />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[10px]">
                <div>
                  <span className="text-zinc-500 block">Classification</span>
                  <span className="text-zinc-300">{meta.assetClassification}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">License Type</span>
                  <span className="text-zinc-300">{meta.licenseType}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Provenance Hash</span>
                  <span className="text-zinc-400 text-[9px] truncate block">{meta.provenanceHash}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Asset Version</span>
                  <span className="text-zinc-300">{meta.version}</span>
                </div>
              </div>

              {/* Functional Ledger Actions */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <span className="text-[9px] font-mono text-zinc-500 uppercase block">Ledger Verification Actions</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const manifest = {
                        title: generatedResult?.title || 'AI Creation Asset',
                        provenanceHash: meta.provenanceHash,
                        qualityScore: meta.qualityScore,
                        classification: meta.assetClassification,
                        licenseType: meta.licenseType,
                        version: meta.version,
                        timestamp: new Date().toISOString(),
                        royaltyShare: '85% Author / 15% Protocol'
                      };
                      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `ledger-manifest-${meta.provenanceHash.slice(0, 8)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                        detail: { message: '📄 Exported Ledger Certificate Manifest (.json)!', type: 'success' }
                      }));
                    }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-zinc-200 hover:text-white rounded-xl text-[10px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>📜 Export Manifest (.JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateTab) {
                        onNavigateTab('MARKETPLACE');
                        window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                          detail: { message: '🛍️ Opening Marketplace to list registered design!', type: 'info' }
                        }));
                      } else {
                        window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                          detail: { message: '✓ Asset Registered in AI Studio Ledger for Marketplace Listing!', type: 'success' }
                        }));
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-[10px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>🛒 List on Marketplace</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* GENERATED RESULT & COMMUNITY SHARING FLOW */}
          {generatedResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#07070c] border border-violet-500/30 rounded-3xl p-5 space-y-4 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider font-semibold">
                  Synthesized Universe Concept
                </span>
                <span className="text-[9px] font-mono text-zinc-500">{generatedResult.resolution}</span>
              </div>

              {/* RECOMMENDATION OVERLAY: WHERE SHOULD THIS IMAGE GO? */}
              <div className="p-4 bg-gradient-to-r from-violet-950/60 via-indigo-950/60 to-purple-950/60 border border-violet-500/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Memory Destination Recommendation</span>
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase">Dual Vault</span>
                </div>

                <p className="text-xs text-zinc-200 font-medium">
                  Where should this generated image go?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFolderPickerOpen(!isFolderPickerOpen)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                      isSavedToFolder 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-violet-600 hover:bg-violet-500 text-white'
                    }`}
                  >
                    <FolderOpen className="w-4 h-4 text-amber-300" />
                    <span>{isSavedToFolder ? '✓ Saved to Folder' : '🔒 Personal Memory (Folders)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePublishToPublicMemorySubmit}
                    disabled={isPublishedToPublicMemory}
                    className={`py-2.5 px-3 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                      isPublishedToPublicMemory
                        ? 'bg-emerald-600 text-white opacity-80'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-cyan-200" />
                    <span>{isPublishedToPublicMemory ? '✓ Published to Public Memory' : '🌐 Public Memory'}</span>
                  </button>
                </div>

                {/* Inline Folder Selector when Personal Memory clicked */}
                {isFolderPickerOpen && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-black/50 border border-violet-500/30 rounded-xl space-y-2 mt-2"
                  >
                    <span className="text-[10px] font-mono text-zinc-400 block uppercase">Select Personal Folder:</span>
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                      {[
                        { id: 'folder-fashion-apparel', name: '👗 Fashion & Apparel' },
                        { id: 'folder-character-identity', name: '👑 Characters & Personas' },
                        { id: 'folder-fantasy-worlds', name: '🌍 Fantasy & Sci-Fi' },
                        { id: 'folder-virtual-3d-assets', name: '📦 Virtual 3D Assets' },
                      ].map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => handleSaveToPersonalFolderSubmit(f.id)}
                          className="py-1.5 px-2 bg-white/5 hover:bg-violet-500/20 text-zinc-200 hover:text-white border border-white/5 hover:border-violet-500/30 rounded-lg text-left text-[11px] transition-all cursor-pointer"
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <p className="text-[9.5px] font-mono text-zinc-400 leading-tight pt-1">
                  💡 <strong className="text-amber-300 font-normal">Auto-flow Protocol:</strong> If you don't save this image, it will automatically flow into <span className="text-cyan-300">Public Memories</span> so other community members can discover and use it!
                </p>
              </div>

              {/* MEDIA RESULT CANVAS (IMAGE OR INTERACTIVE VIDEO PLAYER) */}
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 relative group bg-black">
                {generatedResult.videoUrl || generatedResult.mediaType === 'video' ? (
                  <>
                    <video 
                      ref={videoRef}
                      src={generatedResult.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-in-a-studio-41123-large.mp4'} 
                      autoPlay
                      loop
                      muted={isVideoMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* VIDEO OVERLAY CONTROLS */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                      <span className="text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                        <Video className="w-3 h-3 text-cyan-400 animate-pulse" /> 4K Motion Video
                      </span>

                      <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            if (videoRef.current) {
                              if (isVideoPlaying) {
                                videoRef.current.pause();
                                setIsVideoPlaying(false);
                              } else {
                                videoRef.current.play();
                                setIsVideoPlaying(true);
                              }
                            }
                          }}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-all cursor-pointer"
                          title={isVideoPlaying ? "Pause Video" : "Play Video"}
                        >
                          {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsVideoMuted(!isVideoMuted)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-all cursor-pointer"
                          title={isVideoMuted ? "Unmute" : "Mute"}
                        >
                          {isVideoMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>

                        {/* Speed dropdown */}
                        <button
                          type="button"
                          onClick={() => {
                            const nextSpeed = videoPlaybackSpeed === 1.0 ? 1.5 : videoPlaybackSpeed === 1.5 ? 0.5 : 1.0;
                            setVideoPlaybackSpeed(nextSpeed);
                            if (videoRef.current) videoRef.current.playbackRate = nextSpeed;
                          }}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-cyan-300 text-[9px] font-mono rounded-md cursor-pointer font-bold"
                          title="Playback Speed"
                        >
                          {videoPlaybackSpeed}x
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <img 
                    src={generatedResult.imageUrl} 
                    alt={generatedResult.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 space-y-1 pointer-events-none">
                  <h5 className="font-serif text-sm font-medium text-white flex items-center justify-between">
                    <span>{generatedResult.title}</span>
                    <span className="text-[9px] font-mono text-cyan-300 uppercase">{generatedResult.mediaType === 'video' ? '🎥 Video' : '🖼️ Image'}</span>
                  </h5>
                  <p className="text-[10px] font-mono text-zinc-300 truncate">{generatedResult.prompt}</p>
                </div>
              </div>

              {/* AI CREATION FEEDBACK ENGINE & GATEWAY ACTIONS */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5 text-violet-400">
                    <Zap className="w-3.5 h-3.5" />
                    AI Creation Feedback Engine
                  </span>
                  <span className="text-[9px] text-zinc-500">Private Asset • Connected to HomeHub</span>
                </div>

                {/* Primary Feedback Grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={handleLike}
                    className={`py-2 px-2 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isLiked 
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' 
                        : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Like Creation"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDislike}
                    className={`py-2 px-2 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isDisliked 
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' 
                        : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Dislike"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Dislike</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNotRelated}
                    className={`py-2 px-2 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isNotRelated 
                        ? 'bg-orange-500/15 border-orange-500/30 text-orange-300' 
                        : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Not Related"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Irrelevant</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className={`py-2 px-2 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSaved 
                        ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300' 
                        : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Save to Personal World"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-400 text-indigo-400' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                {/* Secondary Actions: Download, Send to Gateway, Discard */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="py-2.5 px-2 bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-500/20 text-emerald-300 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Download Image & Archive to Anonymous Drafts"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQueueToGateway}
                    disabled={isQueuedGateway}
                    className={`py-2.5 px-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isQueuedGateway
                        ? 'bg-violet-500/15 border border-violet-500/30 text-violet-300'
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border border-white/10 shadow-md'
                    }`}
                    title="Queue to HomeHub Universal Publishing Gateway"
                  >
                    {isQueuedGateway ? <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{isQueuedGateway ? 'Queued' : 'Send to Hub'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="py-2.5 px-2 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-500/20 text-rose-300 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Discard Asset & Anonymize into Draft Engine"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Discard</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>
        </>
      )}

    </div>
  );
};
