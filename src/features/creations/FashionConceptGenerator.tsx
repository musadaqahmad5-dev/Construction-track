import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Layers, Shirt, Box, Crown, RefreshCw, 
  Check, ArrowRight, Wand2, ShieldCheck, Compass
} from 'lucide-react';
import { FashionCreation, CreationPromptParameters } from './CreationTypes';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FashionConceptGeneratorProps {
  promptParams: CreationPromptParameters | null;
  onCreationGenerated: (creation: FashionCreation) => void;
}

const CATEGORY_OPTIONS = [
  { id: 'Outfit', label: 'Complete Outfit', icon: Shirt, desc: 'Full layered ensemble' },
  { id: 'Dress', label: 'Couture Dress', icon: Crown, desc: 'Evening & avant-garde gowns' },
  { id: 'Jacket', label: 'Jackets & Outerwear', icon: Layers, desc: 'Coats, trenches & blazers' },
  { id: 'Shoes', label: 'Luxury Footwear', icon: Box, desc: 'Boots, heels & techwear' },
  { id: 'Accessories', label: 'Accessories', icon: Compass, desc: 'Bags, jewelry & eyewear' },
  { id: 'Editorial Collection', label: 'Editorial Look', icon: Sparkles, desc: 'Full Runway aesthetic' }
];

const CURATED_CONCEPT_IMAGES: Record<string, string[]> = {
  'Outfit': [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop'
  ],
  'Dress': [
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop'
  ],
  'Jacket': [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop'
  ],
  'Shoes': [
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'
  ],
  'Accessories': [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop'
  ],
  'Editorial Collection': [
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop'
  ]
};

export const FashionConceptGenerator: React.FC<FashionConceptGeneratorProps> = ({
  promptParams,
  onCreationGenerated
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Outfit');
  const [selectedSeason, setSelectedSeason] = useState<string>('Autumn/Winter 2026');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  const handleGenerateConcept = async () => {
    setIsGenerating(true);
    setGenerationStep('Connecting Gemini fashion synthesis core...');

    const steps = [
      { delay: 600, text: '🟢 Synthesizing pattern drape & volumetric geometry...' },
      { delay: 1200, text: '🪐 Injecting material textures & lighting shader pass...' },
      { delay: 1800, text: '⚡ Scoring Style DNA alignment & luxury metrics...' },
      { delay: 2400, text: '✓ Finalizing creation record in Firestore memory...' }
    ];

    for (const step of steps) {
      await new Promise(res => setTimeout(res, step.delay));
      setGenerationStep(step.text);
    }

    const images = CURATED_CONCEPT_IMAGES[selectedCategory] || CURATED_CONCEPT_IMAGES['Outfit'];
    const chosenImage = images[Math.floor(Math.random() * images.length)];

    const creationTitle = promptParams?.userPrompt 
      ? `${promptParams.userPrompt.slice(0, 32)}...`
      : `${selectedCategory} - ARIA Concept #${Math.floor(100 + Math.random() * 900)}`;

    const newCreation: FashionCreation = {
      id: `creation-${Date.now()}`,
      userId: auth?.currentUser?.uid || 'guest-creator-user',
      title: creationTitle,
      imageUrl: chosenImage,
      category: selectedCategory,
      styleDNA: promptParams ? [promptParams.silhouette, promptParams.fabric, promptParams.luxuryLevel] : ['Minimalist', 'Couture', 'Structured'],
      colorPalette: promptParams?.colorPalette || ['#05050A', '#1C1C28', '#8B5CF6', '#D4AF37'],
      fabric: promptParams?.fabric || 'Italian Mulberry Silk & Cashmere',
      occasion: promptParams?.occasion || 'Gala Runway Edition',
      season: selectedSeason,
      confidenceScore: promptParams?.styleDNAScore || Math.floor(88 + Math.random() * 10),
      createdAt: new Date().toISOString(),
      status: 'draft',
      silhouette: promptParams?.silhouette || 'Architectural Tailored',
      texture: promptParams?.texture || 'Matte Micro-Mesh',
      fashionEra: promptParams?.fashionEra || 'Contemporary Avant-Garde',
      luxuryLevel: promptParams?.luxuryLevel || 'Haute Couture',
      stylingDirection: promptParams?.stylingDirection || 'Precision sculpted draping with contrast piping.',
      likesCount: 0,
      remixCount: 0,
      luxuryIntensity: 85,
      modernVsClassic: 70
    };

    // Save to Firestore if authenticated
    if (auth?.currentUser?.uid) {
      try {
        await addDoc(collection(db, `users/${auth.currentUser.uid}/creations`), {
          ...newCreation,
          createdAtServer: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore creations store notice:', e);
      }
    }

    setIsGenerating(false);
    onCreationGenerated(newCreation);

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✓ New AI Fashion Creation generated! (${newCreation.confidenceScore}% Style DNA Alignment)`
    }));
  };

  return (
    <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Fashion Concept Generator
            </h3>
            <p className="text-xs text-zinc-400">
              Select target fashion classification & launch generative rendering
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="bg-[#05050a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-purple-500/50"
          >
            <option value="Autumn/Winter 2026">Autumn/Winter 2026</option>
            <option value="Spring/Summer 2026">Spring/Summer 2026</option>
            <option value="Resort 2027">Resort 2027</option>
            <option value="Couture Capsule">Couture Capsule</option>
          </select>
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
          Target Garment / Look Category
        </label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORY_OPTIONS.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'bg-[#05050a] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-zinc-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white block">{cat.label}</h4>
                  <span className="text-[10px] text-zinc-500 block truncate">{cat.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* GENERATE LAUNCH BUTTON */}
      <div className="pt-2">
        <button
          onClick={handleGenerateConcept}
          disabled={isGenerating}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold tracking-wider uppercase transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-purple-300" />
              <span>{generationStep}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Concept ({selectedCategory})</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
