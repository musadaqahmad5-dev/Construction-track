import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Wand2, Sliders, Folder, GitCommit, Eye, 
  Layers, Crown, Globe, Lock, ShieldCheck, Zap, RefreshCw, Box, Brain
} from 'lucide-react';
import { FashionCreation, CreationVersion, CreationPromptParameters } from './CreationTypes';
import { CreationPromptEngine } from './CreationPromptEngine';
import { FashionConceptGenerator } from './FashionConceptGenerator';
import { CreationCanvas } from './CreationCanvas';
import { CreationEvolutionTimeline } from './CreationEvolutionTimeline';
import { AICreationGallery } from './AICreationGallery';
import { CreationMemoryPanel, logCreationMemorySignal } from './memory';
import { auth, db } from '../../firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';

interface AIStudioWorkspaceProps {
  onNavigateToTab?: (tab: string) => void;
  onSendToTryOn?: (garmentUrl: string, garmentTitle: string) => void;
  userStyleDNA?: string[];
}

const INITIAL_CREATIONS_SEED: FashionCreation[] = [
  {
    id: 'creation-001',
    userId: 'user-001',
    title: 'Cyberpunk Luminescent Trench',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    category: 'Jacket',
    styleDNA: ['Architectural', 'Cyberpunk', 'High-Gloss'],
    colorPalette: ['#05050A', '#1C1C28', '#8B5CF6', '#D4AF37'],
    fabric: 'Technical Liquid Metallic Nylon',
    occasion: 'Metropolitan Night Runway',
    season: 'Autumn/Winter 2026',
    confidenceScore: 96,
    createdAt: new Date().toISOString(),
    status: 'draft',
    silhouette: 'Architectural Tailored Structured',
    luxuryIntensity: 90,
    modernVsClassic: 85
  },
  {
    id: 'creation-002',
    userId: 'user-001',
    title: 'Minimalist Cashmere Kimono Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    category: 'Outfit',
    styleDNA: ['Minimalist', 'Quiet Luxury', 'Monochrome'],
    colorPalette: ['#09090D', '#27272A', '#A1A1AA', '#FAFAFA'],
    fabric: 'Italian Mulberry Silk & Cashmere',
    occasion: 'Executive Power Gala',
    season: 'Spring/Summer 2026',
    confidenceScore: 92,
    createdAt: new Date().toISOString(),
    status: 'published',
    silhouette: 'Oversized Boxy Dropped-Shoulder',
    luxuryIntensity: 95,
    modernVsClassic: 50
  }
];

export const AIStudioWorkspace: React.FC<AIStudioWorkspaceProps> = ({
  onNavigateToTab,
  onSendToTryOn,
  userStyleDNA = ['Minimalist', 'Architectural', 'Monochrome', 'Quiet Luxury']
}) => {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'prompt' | 'generator' | 'canvas' | 'gallery' | 'memory'>('prompt');
  
  const [promptParams, setPromptParams] = useState<CreationPromptParameters | null>(null);
  const [creations, setCreations] = useState<FashionCreation[]>(INITIAL_CREATIONS_SEED);
  const [activeCreation, setActiveCreation] = useState<FashionCreation | null>(INITIAL_CREATIONS_SEED[0]);
  
  const [versionsMap, setVersionsMap] = useState<Record<string, CreationVersion[]>>({
    'creation-001': [
      {
        id: 'ver-101',
        creationId: 'creation-001',
        versionNumber: 1,
        imageUrl: INITIAL_CREATIONS_SEED[0].imageUrl,
        changes: ['Initial prompt synthesis'],
        feedback: 'Synthesized initial liquid metallic pattern',
        timestamp: '10:00 AM',
        parameters: {
          fabric: INITIAL_CREATIONS_SEED[0].fabric,
          luxuryIntensity: 90
        }
      }
    ]
  });

  // Subscribe to Firestore if user logged in
  useEffect(() => {
    if (!db || !auth?.currentUser?.uid) return;

    const q = query(collection(db, `users/${auth.currentUser.uid}/creations`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbItems: FashionCreation[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        dbItems.push({
          id: docSnap.id,
          ...data
        } as FashionCreation);
      });

      if (dbItems.length > 0) {
        setCreations(dbItems);
        if (!activeCreation) setActiveCreation(dbItems[0]);
      }
    }, (err) => {
      console.warn("Firestore creations query listener:", err);
    });

    return () => unsubscribe();
  }, []);

  const handleParametersGenerated = (params: CreationPromptParameters) => {
    setPromptParams(params);
    setActiveWorkspaceTab('generator');
  };

  const handleCreationGenerated = (newCreation: FashionCreation) => {
    setCreations(prev => [newCreation, ...prev]);
    setActiveCreation(newCreation);
    
    // Log positive creation memory signal
    logCreationMemorySignal({
      creationId: newCreation.id,
      type: 'positive',
      action: 'save',
      category: newCreation.category,
      colors: newCreation.colorPalette,
      fabric: newCreation.fabric,
      silhouette: newCreation.silhouette,
      impactScore: 10
    });

    // Create initial version record
    const initVersion: CreationVersion = {
      id: `ver-${Date.now()}`,
      creationId: newCreation.id,
      versionNumber: 1,
      imageUrl: newCreation.imageUrl,
      changes: ['Generative concept creation'],
      feedback: 'Initial concept generation via ARIA Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      parameters: {
        fabric: newCreation.fabric,
        silhouette: newCreation.silhouette,
        colorPalette: newCreation.colorPalette,
        luxuryIntensity: newCreation.luxuryIntensity,
        modernVsClassic: newCreation.modernVsClassic
      }
    };

    setVersionsMap(prev => ({
      ...prev,
      [newCreation.id]: [initVersion]
    }));

    setActiveWorkspaceTab('canvas');
  };

  const handleUpdateCreation = (updatedCreation: FashionCreation, versionLog?: CreationVersion) => {
    setCreations(prev => prev.map(c => c.id === updatedCreation.id ? updatedCreation : c));
    setActiveCreation(updatedCreation);

    logCreationMemorySignal({
      creationId: updatedCreation.id,
      type: 'positive',
      action: 'style_modify',
      category: updatedCreation.category,
      colors: updatedCreation.colorPalette,
      fabric: updatedCreation.fabric,
      silhouette: updatedCreation.silhouette,
      impactScore: 5
    });

    if (versionLog) {
      setVersionsMap(prev => ({
        ...prev,
        [updatedCreation.id]: [...(prev[updatedCreation.id] || []), versionLog]
      }));
    }

    // Sync to Firestore if authenticated
    if (auth?.currentUser?.uid && updatedCreation.id.length > 20) {
      try {
        const ref = doc(db, `users/${auth.currentUser.uid}/creations`, updatedCreation.id);
        updateDoc(ref, {
          fabric: updatedCreation.fabric,
          silhouette: updatedCreation.silhouette,
          colorPalette: updatedCreation.colorPalette,
          luxuryIntensity: updatedCreation.luxuryIntensity,
          modernVsClassic: updatedCreation.modernVsClassic,
          confidenceScore: updatedCreation.confidenceScore
        });
      } catch (e) {
        console.warn("Firestore update error:", e);
      }
    }
  };

  const handleTryOnCreation = (creation: FashionCreation) => {
    logCreationMemorySignal({
      creationId: creation.id,
      type: 'positive',
      action: 'try_on',
      category: creation.category,
      colors: creation.colorPalette,
      fabric: creation.fabric,
      silhouette: creation.silhouette,
      impactScore: 15
    });

    if (onSendToTryOn) {
      onSendToTryOn(creation.imageUrl, creation.title);
    } else if (onNavigateToTab) {
      onNavigateToTab('VIRTUAL_STUDIO');
    }

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✓ Sent "${creation.title}" directly to Virtual Try-On Studio!`
    }));
  };

  const handlePublishCreation = async (creation: FashionCreation) => {
    const publishedItem = { ...creation, status: 'published' as const };
    setCreations(prev => prev.map(c => c.id === creation.id ? publishedItem : c));

    logCreationMemorySignal({
      creationId: creation.id,
      type: 'positive',
      action: 'publish',
      category: creation.category,
      colors: creation.colorPalette,
      fabric: creation.fabric,
      silhouette: creation.silhouette,
      impactScore: 25
    });

    if (auth?.currentUser?.uid) {
      try {
        await addDoc(collection(db, 'public/creations'), {
          ...publishedItem,
          publisherUid: auth.currentUser.uid,
          publisherEmail: auth.currentUser.email || 'anonymous',
          publishedAt: serverTimestamp()
        });
      } catch (e) {
        console.warn("Public creation publish notice:", e);
      }
    }

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✓ "${creation.title}" published to Creator Marketplace!`
    }));
  };

  const handleDeleteCreation = async (id: string) => {
    const target = creations.find(c => c.id === id);
    if (target) {
      logCreationMemorySignal({
        creationId: target.id,
        type: 'negative',
        action: 'delete',
        category: target.category,
        colors: target.colorPalette,
        fabric: target.fabric,
        silhouette: target.silhouette,
        impactScore: -15
      });
    }

    setCreations(prev => prev.filter(c => c.id !== id));
    if (activeCreation?.id === id) {
      setActiveCreation(null);
    }

    if (auth?.currentUser?.uid && id.length > 20) {
      try {
        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/creations`, id));
      } catch (e) {
        console.warn("Firestore deletion notice:", e);
      }
    }

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✓ Creation removed from Atelier.`
    }));
  };

  const activeVersions = activeCreation ? (versionsMap[activeCreation.id] || []) : [];

  return (
    <div className="space-y-6 text-left">
      {/* WORKSPACE NAVIGATION HEADER */}
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl text-indigo-300 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <span>AI Creations Studio</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ARIA Design Lab
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Generative fashion prompt engineering, 3D drape canvas & timeline history
            </p>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="flex items-center p-1 bg-[#05050a] border border-white/10 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveWorkspaceTab('prompt')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeWorkspaceTab === 'prompt' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>1. Prompt Engine</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('generator')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeWorkspaceTab === 'generator' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Concept Generator</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('canvas')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeWorkspaceTab === 'canvas' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. Atelier Canvas</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('gallery')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeWorkspaceTab === 'gallery' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>4. Gallery ({creations.length})</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('memory')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeWorkspaceTab === 'memory' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>5. Memory Intelligence</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        {activeWorkspaceTab === 'prompt' && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <CreationPromptEngine
              onParametersGenerated={handleParametersGenerated}
              userStyleDNA={userStyleDNA}
            />

            {promptParams && (
              <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 text-center space-y-4">
                <h4 className="text-sm font-bold text-white">Prompt Parameters Synthesized</h4>
                <button
                  onClick={() => setActiveWorkspaceTab('generator')}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Proceed to Concept Generator →
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeWorkspaceTab === 'generator' && (
          <motion.div
            key="generator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <FashionConceptGenerator
              promptParams={promptParams}
              onCreationGenerated={handleCreationGenerated}
            />
          </motion.div>
        )}

        {activeWorkspaceTab === 'canvas' && (
          <motion.div
            key="canvas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <CreationCanvas
              creation={activeCreation}
              onUpdateCreation={handleUpdateCreation}
              onTryOnRequested={handleTryOnCreation}
              onPublishRequested={handlePublishCreation}
            />

            <CreationEvolutionTimeline
              versions={activeVersions}
            />
          </motion.div>
        )}

        {activeWorkspaceTab === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <AICreationGallery
              creations={creations}
              onSelectCreation={(item) => {
                setActiveCreation(item);
                setActiveWorkspaceTab('canvas');
              }}
              onTryOnCreation={handleTryOnCreation}
              onPublishCreation={handlePublishCreation}
              onDeleteCreation={handleDeleteCreation}
            />
          </motion.div>
        )}

        {activeWorkspaceTab === 'memory' && (
          <motion.div
            key="memory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <CreationMemoryPanel
              creations={creations}
              userId={auth?.currentUser?.uid}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
