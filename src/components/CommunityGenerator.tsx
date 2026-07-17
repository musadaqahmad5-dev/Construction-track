import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Sparkles, RefreshCw, Layers, Check, ArrowRight, 
  User, Shield, Info, Trash2, Tag, CheckCircle2, Save, Send, AlertTriangle
} from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

interface CommunityGeneratorProps {
  user: any;
  userWardrobe: any[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onNavigateToTab?: (tab: string) => void;
}

export const CommunityGenerator: React.FC<CommunityGeneratorProps> = ({
  user,
  userWardrobe,
  onAddGarment,
  onNavigateToTab
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeStepText, setActiveStepText] = useState('READING IMAGE SPECIFICATIONS...');
  
  // Result payload
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // History list
  const [pastMappings, setPastMappings] = useState<any[]>([]);
  const [isSavedInSession, setIsSavedInSession] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load past mappings for this user from Firestore
  const loadPastMappings = async () => {
    const currentUserUid = user?.uid || auth.currentUser?.uid || 'guest-sartorialist-user-100';
    if (!db) return;
    try {
      const q = query(
        collection(db, 'bodyStyleMappings'),
        where('userId', '==', currentUserUid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const list: any[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setPastMappings(list);
    } catch (err: any) {
      console.warn('[Community Generator] Failed to load past mappings:', err.message);
      // LocalStorage fallback
      try {
        const local = localStorage.getItem(`past_mappings_${currentUserUid}`);
        if (local) setPastMappings(JSON.parse(local));
      } catch (e) {}
    }
  };

  useEffect(() => {
    loadPastMappings();
  }, [user]);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Helper to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle drop events
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return;
      }
      setSelectedFile(file);
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setError(null);
    }
  };

  // Handle file select
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setError(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Reset selected file
  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setIsPublished(false);
    setIsSavedInSession(false);
  };

  // Process image via API
  const handleProcessImage = async () => {
    if (!imagePreview) return;

    setIsProcessing(true);
    setProcessingProgress(10);
    setActiveStepText('READING IMAGE COORD AND POSTURE...');
    setError(null);

    // Simulate animated step indicators
    const intervals = [
      { progress: 25, text: 'ANALYZING SILHOUETTE BALANCE...' },
      { progress: 45, text: 'MAPPING ANATOMICAL SYMMETRIES...' },
      { progress: 70, text: 'GENERATING SOPHISTICATED COLOR BLUEPRINT...' },
      { progress: 90, text: 'SYNTHESIZING VIRTUAL SARTORIAL AFTER IMAGE...' }
    ];

    intervals.forEach((interval, index) => {
      setTimeout(() => {
        if (isProcessing) {
          setProcessingProgress(interval.progress);
          setActiveStepText(interval.text);
        }
      }, (index + 1) * 2000);
    });

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : 'guest-token';
      
      const response = await fetch('/api/community/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ base64Image: imagePreview })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const data = await response.json();
      setProcessingProgress(100);
      setActiveStepText('PROCESS COMPLETE!');
      
      setTimeout(() => {
        setResult(data);
        setIsProcessing(false);
        // Refresh mapping history list
        loadPastMappings();
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '✓ Body-Style mapping compiled!' }));
      }, 800);

    } catch (err: any) {
      console.error('[Community Generator Error]', err);
      setError(err.message || 'An error occurred during image processing.');
      setIsProcessing(false);
    }
  };

  // Import recommended style into user wardrobe
  const handleImportToCloset = async () => {
    if (!result || !onAddGarment) return;
    try {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Importing coordinate formula...' }));
      
      const desc = `Body Classification Match: ${result.bodyShapeClassification}\n\nRecommended Formula:\n${result.recommendedFormulas?.join('\n')}\n\nStyle Guide:\n${result.afterStylingTransformation}`;
      
      await onAddGarment(
        `${result.bodyShapeClassification} Elegant Coord`,
        desc,
        'Casual',
        { imageUrl: result.afterImageUrl }
      );
      
      setIsSavedInSession(true);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '✓ Coords successfully imported to closet shelves!' }));
    } catch (e: any) {
      console.error('Failed to import design layout:', e);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Failed to import: ${e.message}` }));
    }
  };

  // Publish style transformation to community posts
  const handlePublishToFeed = async () => {
    if (!result || isPublishing || isPublished) return;
    setIsPublishing(true);
    
    const currentUserDisplayName = user?.displayName || auth.currentUser?.displayName || 'Anonymous Designer';
    const currentUserHandle = `@${(user?.displayName || auth.currentUser?.displayName || 'designer').toLowerCase().replace(/\s+/g, '')}`;
    const currentUserAvatar = user?.photoURL || auth.currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop';
    const currentUserUid = user?.uid || auth.currentUser?.uid || 'anonymous-user-id';

    const newPostData = {
      userId: currentUserUid,
      author: {
        name: currentUserDisplayName,
        handle: currentUserHandle,
        avatar: currentUserAvatar,
        uid: currentUserUid
      },
      caption: `Transformed silhouette matching my ${result.bodyShapeClassification} profile. Recommended formula: ${result.recommendedFormulas?.[0] || 'luxury drapes'}.`,
      imageUrl: result.afterImageUrl,
      likes: Math.floor(Math.random() * 45) + 12,
      shares: Math.floor(Math.random() * 10) + 2,
      saves: Math.floor(Math.random() * 20) + 4,
      views: Math.floor(Math.random() * 120) + 30,
      trendingScore: 88.5,
      vibeTags: [result.bodyShapeClassification.toLowerCase().replace(/\s+/g, '-'), 'style-mapped', 'luxury-drape'],
      comments: [],
      aiScore: Math.floor(Math.random() * 6) + 94,
      aiBreakdown: { 
        color: 'Symmetrical Hue Integrity', 
        texture: 'Optimized Texture Blend', 
        seasonal: 'Proportional Balance Index' 
      },
      createdAt: new Date().toISOString()
    };

    try {
      if (db) {
        await addDoc(collection(db, 'communityPosts'), newPostData);
      }
      setIsPublished(true);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '✓ Published to Community feed!' }));
    } catch (err: any) {
      console.error('Could not publish to community:', err);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Publish failed: ${err.message}` }));
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16 text-left">
      
      {/* Introduction Card */}
      <div className="bg-[#07070c] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-violet-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="space-y-2 max-w-3xl">
          <span className="text-[10px] font-mono tracking-[0.25em] text-violet-400 uppercase block font-semibold">
            ESTABLISHING BODY STYLE COORDINATES
          </span>
          <h2 className="font-serif font-light text-2xl text-white">Community Generator & Style Mapping</h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            An innovative, high-fidelity feature. Deposit a clean portrait photo representing your body outline. 
            Google Gemini analyzes posture symmetries and maps ideal silhouette profiles, generating a side-by-side 
            transformation model which can be imported into your custom Closet or published to the design feed.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <span className="block text-[10px] font-mono text-zinc-500 leading-none">TOTAL MAPPED</span>
            <span className="block font-serif text-xl text-white mt-1.5">{pastMappings.length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Upload or Results view */}
      <AnimatePresence mode="wait">
        {isProcessing ? (
          /* LOADING STATE */
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#07070c] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] space-y-6 relative"
          >
            <div className="absolute inset-0 bg-radial-gradient from-violet-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              {/* Outer spinning ring */}
              <div className="w-20 h-20 rounded-full border-2 border-violet-500/10 border-t-violet-400 animate-spin" />
              <Sparkles className="w-8 h-8 text-violet-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-violet-400 tracking-widest uppercase animate-pulse">{activeStepText}</p>
              <h3 className="font-serif text-lg text-white">Sartorial Intellect Working</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto font-light leading-relaxed">
                Our neural mapping engine is tracing body axes, color contrasts, and generating a curated transformation mockup. Please do not close this window.
              </p>
            </div>

            {/* Horizontal progress bar */}
            <div className="w-full max-w-md h-[3px] bg-white/5 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-500">{processingProgress}% Complete</span>
          </motion.div>
        ) : result ? (
          /* COMPLETED RESULT VIEW WITH SIDE-BY-SIDE BEFORE VS AFTER */
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header reset button */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">COORDINATE MAPPING RESULT</span>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white/5 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white rounded-xl text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Map Another Photo</span>
              </button>
            </div>

            {/* Visual Before vs. After Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* BEFORE CARD */}
              <div className="bg-[#07070c] border border-white/5 rounded-3xl overflow-hidden relative group">
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-black/60 border border-white/5 text-zinc-300 font-mono text-[9px] uppercase tracking-widest rounded-lg font-semibold">
                    Baseline Photo (Before)
                  </span>
                </div>
                <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-950 relative">
                  <img 
                    src={result.uploadedImageUrl} 
                    alt="Original Silhouette" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Overlay Description */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">PROPORTION STATUS</span>
                    <p className="text-[11.5px] text-zinc-300 font-light leading-relaxed">
                      {result.beforeAnalysisText}
                    </p>
                  </div>
                </div>
              </div>

              {/* AFTER CARD */}
              <div className="bg-[#07070c] border border-white/5 rounded-3xl overflow-hidden relative group">
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-violet-500/20 border border-violet-500/30 text-violet-300 font-mono text-[9px] uppercase tracking-widest rounded-lg font-bold shadow-lg shadow-black/45 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Styled Concept (After)
                  </span>
                </div>
                <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-950 relative">
                  <img 
                    src={result.afterImageUrl} 
                    alt="Transformed Silhouette" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Overlay Description */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                    <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest block mb-1">ELEVATED COORD</span>
                    <p className="text-[11.5px] text-zinc-300 font-light leading-relaxed">
                      {result.afterStylingTransformation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Style Coordination Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Classification */}
              <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <User className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase leading-none">SILHOUETTE SPEC</span>
                    <h4 className="text-white font-serif text-sm font-medium mt-1">{result.bodyShapeClassification} Profile</h4>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  {result.silhouetteDescription}
                </p>
              </div>

              {/* Symmetries */}
              <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Shield className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase leading-none">STYLING GUIDELINES</span>
                    <h4 className="text-white font-serif text-sm font-medium mt-1">Symmetry Axes</h4>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  {result.stylingSymmetries}
                </p>
              </div>

              {/* Color Harmonies & Categories */}
              <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Tag className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase leading-none">COLOR & SEGMENTS</span>
                    <h4 className="text-white font-serif text-sm font-medium mt-1">Palette Harmony</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    {result.colorHarmonySuggestion}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {result.idealGarmentCategories?.map((cat: string) => (
                      <span key={cat} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 font-mono text-[9px] rounded uppercase">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Formulas Box */}
            <div className="bg-[#07070c] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
              <h3 className="font-serif font-light text-lg text-white">Recommended Tailored Formulas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.recommendedFormulas?.map((formula: string, idx: number) => (
                  <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex gap-3 items-start">
                    <span className="text-xs font-mono text-violet-400 font-bold bg-violet-500/10 px-2.5 py-1 rounded-lg">0{idx + 1}</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-light pt-0.5">{formula}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons Panel */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white/[0.01] border border-white/5 rounded-3xl">
              <div className="space-y-1">
                <h4 className="font-serif text-sm text-zinc-300">Share or Persist This Look</h4>
                <p className="text-[10.5px] text-zinc-500 font-light leading-none">Load coordinates to closet shelves or make it public to the design community.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleImportToCloset}
                  disabled={isSavedInSession}
                  className={`px-5 py-3 rounded-xl font-mono text-[10px] uppercase tracking-wider flex items-center gap-2 font-bold transition-all transform active:scale-95 cursor-pointer ${
                    isSavedInSession 
                      ? 'bg-zinc-800/50 text-zinc-500 border border-zinc-700/30 cursor-not-allowed'
                      : 'bg-white/5 border border-white/10 hover:border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavedInSession ? 'Imported to Closet' : 'Import Coords to Closet'}</span>
                </button>

                <button
                  onClick={handlePublishToFeed}
                  disabled={isPublishing || isPublished}
                  className={`px-5 py-3 rounded-xl font-mono text-[10px] uppercase tracking-wider flex items-center gap-2 font-bold transition-all transform active:scale-95 cursor-pointer ${
                    isPublished 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                  }`}
                >
                  {isPublishing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : isPublished ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isPublished ? 'Published to Feed' : isPublishing ? 'Publishing...' : 'Publish to Feed'}</span>
                </button>
              </div>
            </div>

          </motion.div>
        ) : (
          /* FILE UPLOAD INTERFACE */
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left column: upload panel */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Drag-and-drop container */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 relative group flex flex-col items-center justify-center min-h-[340px] select-none ${
                    dragActive 
                      ? 'border-violet-500 bg-violet-500/5' 
                      : imagePreview 
                        ? 'border-white/10 bg-white/[0.01]' 
                        : 'border-white/5 hover:border-violet-500/20 bg-white/[0.005] hover:bg-white/[0.01]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {imagePreview ? (
                    /* Image preview container */
                    <div className="space-y-5 w-full max-w-sm">
                      <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-950 relative border border-white/5">
                        <img src={imagePreview} alt="Selected outline" className="w-full h-full object-cover" />
                        <button
                          onClick={handleReset}
                          className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-lg hover:bg-black/90 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={handleButtonClick}
                          className="px-4 py-2.5 bg-white/5 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Change Image
                        </button>
                        <button
                          onClick={handleProcessImage}
                          className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-indigo-600/15 font-bold transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Process Style Matrix</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Empty upload state */
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-zinc-500 group-hover:text-violet-400 group-hover:border-violet-500/10 transition-all duration-300">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif text-sm text-zinc-200">Deposit Sartorial Outline</h4>
                        <p className="text-[11px] text-zinc-500 font-light leading-relaxed max-w-xs mx-auto">
                          Drag & drop your portrait body photo here, or click to browse folders. Only JPEG, PNG formats are accepted.
                        </p>
                      </div>
                      <button
                        onClick={handleButtonClick}
                        className="px-5 py-2.5 bg-white/5 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white rounded-xl text-[10.5px] font-mono uppercase tracking-wider transition-all cursor-pointer font-semibold"
                      >
                        Explore Files
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Right column: mapping rules info card */}
              <div className="space-y-6 text-left">
                <div className="bg-[#07070c] border border-white/5 rounded-3xl p-6 space-y-5">
                  <h3 className="font-serif text-sm text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-violet-400" />
                    <span>Accuracy & Privacy Principles</span>
                  </h3>
                  <div className="space-y-4 text-xs text-zinc-400 leading-relaxed font-light">
                    <p>
                      To ensure high-fidelity measurements and classification:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Use a clear, full-height portrait portrait in well-lit lighting.</li>
                      <li>Dress in fitted garments to allow accurate silhouette contouring.</li>
                      <li>Face the camera directly in a relaxed natural posture.</li>
                    </ul>
                    <p className="pt-2 border-t border-white/5 text-[10px] text-zinc-500">
                      Your portrait files are strictly processed on the server to trigger our Google Gemini pipeline. 
                      They are never stored publicly or shared without your explicit consent.
                    </p>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 flex gap-3.5 items-start">
                  <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs text-zinc-300 font-serif">Sartorial Quotas</h4>
                    <p className="text-[10px] text-zinc-500 font-light leading-relaxed">
                      Each mapping request consumes 1 image quota point from your subscription tier. Free tiers are granted 5 checks daily.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Past mappings grid (History slider) */}
            {pastMappings.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif font-light text-lg text-white">My Past Coordinate Mappings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastMappings.map((mapping: any) => (
                    <div 
                      key={mapping.id} 
                      onClick={() => setResult(mapping)}
                      className="bg-[#07070c] border border-white/5 hover:border-violet-500/20 rounded-2xl overflow-hidden p-4 flex gap-4 cursor-pointer transition-all duration-300 hover:scale-[1.015]"
                    >
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-white/5">
                        <img src={mapping.uploadedImageUrl} alt="Past Upload" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1 text-left flex-1 min-w-0">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">
                          {new Date(mapping.createdAt).toLocaleDateString()}
                        </span>
                        <h4 className="text-xs text-white font-serif truncate">{mapping.bodyShapeClassification} Profile</h4>
                        <p className="text-[10px] text-zinc-400 font-light line-clamp-2 leading-tight">
                          {mapping.silhouetteDescription}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
