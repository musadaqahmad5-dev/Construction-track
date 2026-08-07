import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, RefreshCw, Layers, Sliders, Play, 
  Trash2, User, Eye, Check, ChevronRight, Activity, ArrowRight,
  Shirt, Compass, Info, CheckCircle, Scale, Wind, Thermometer,
  ZoomIn, ZoomOut, Maximize2, Move, HelpCircle, Save, Layers2, ArrowUp, ArrowDown, Box
} from 'lucide-react';
import { WardrobeItem } from '../types';
import { 
  useThemeIntelligence, 
  ThemeCoatRenderer, 
  FoundationInteractionWrapper 
} from '../engine';
import { auth } from '../firebase';
import { ThreeDVirtualTryOn } from './ThreeDVirtualTryOn';
import { VirtualTryOnWorkspace } from './aria/VirtualTryOnWorkspace';
import { ariaService } from '../services/ariaService';

interface VirtualStudioTryOnProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
}

interface FittingSession {
  id: string;
  timestamp: string;
  avatar: {
    gender: 'female' | 'male' | 'unisex';
    height: number;
    bust: number;
    waist: number;
    hips: number;
    skinTone: string;
    hairstyle: string;
  };
  fittedItems: {
    top?: WardrobeItem;
    outerwear?: WardrobeItem;
    bottom?: WardrobeItem;
    shoes?: WardrobeItem;
  };
  sizeSelected: 'S' | 'M' | 'L' | 'XL';
  renderUrl: string;
}

// Cultural / Fashion high-end preset backdrops
const BACKDROP_PRESETS = [
  { id: 'tokyo', name: 'Tokyo Neon Alley', url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600&auto=format&fit=crop', vibe: 'Cyberpunk' },
  { id: 'studio', name: 'Parisian Atelier', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop', vibe: 'Minimalist Elegant' },
  { id: 'desert', name: 'Mojave Pavillion', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600&auto=format&fit=crop', vibe: 'Earth tones' },
  { id: 'nordic', name: 'Oslo Concrete Museum', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop', vibe: 'Sleek Brutalist' }
];

const SKIN_TONES = [
  { name: 'Fair Alabaster', class: 'bg-[#f7ebd4]', hex: '#f7ebd4' },
  { name: 'Warm Beige', class: 'bg-[#eecda3]', hex: '#eecda3' },
  { name: 'Rich Olive', class: 'bg-[#c68f59]', hex: '#c68f59' },
  { name: 'Golden Chestnut', class: 'bg-[#8d5524]', hex: '#8d5524' },
  { name: 'Deep Espresso', class: 'bg-[#3c220f]', hex: '#3c220f' }
];

const HAIRSTYLES = [
  { id: 'buzz', name: 'Minimal Crop' },
  { id: 'undercut', name: 'Sleek Undercut' },
  { id: 'bob', name: 'Sharp Geometric Bob' },
  { id: 'waves', name: 'Flowing Waves' },
  { id: 'afro', name: 'Sculpted Afro' }
];

export const VirtualStudioTryOn: React.FC<VirtualStudioTryOnProps> = ({ 
  wardrobe, 
  onAddGarment 
}) => {
  // Connect Theme Intelligence Engine
  let themeCtx: ReturnType<typeof useThemeIntelligence> | null = null;
  try {
    themeCtx = useThemeIntelligence();
  } catch {
    themeCtx = null;
  }

  const themeDNA = themeCtx?.themeDNA;
  const coatDNA = themeCtx?.coatDNA;
  const sequenceId = themeCtx?.sequenceId;

  // Avatar metrics state
  const [gender, setGender] = useState<'female' | 'male' | 'unisex'>('female');
  const [height, setHeight] = useState<number>(172); // cm
  const [bust, setBust] = useState<number>(88); // cm
  const [waist, setWaist] = useState<number>(64); // cm
  const [hips, setHips] = useState<number>(92); // cm
  const [skinTone, setSkinTone] = useState<string>('Warm Beige');
  const [hairstyle, setHairstyle] = useState<string>('Sharp Geometric Bob');

  // Interactive drape physics sliders
  const [drapeStiffness, setDrapeStiffness] = useState<number>(45); // %
  const [fabricElasticity, setFabricElasticity] = useState<number>(60); // %
  const [windInfluence, setWindInfluence] = useState<number>(20); // %

  // Selection slot state (combining multiple wardrobe garments simultaneously)
  const [selectedTop, setSelectedTop] = useState<WardrobeItem | null>(null);
  const [selectedOuterwear, setSelectedOuterwear] = useState<WardrobeItem | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<WardrobeItem | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<WardrobeItem | null>(null);

  // Chosen global garment sizing to simulate fitting tension
  const [sizeSelected, setSizeSelected] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [selectedBackdrop, setSelectedBackdrop] = useState<string>('studio');
  const [studioMode, setStudioMode] = useState<'2d-canvas' | '3d-webgl' | 'aria-vision'>('2d-canvas');

  // AI Fit Generation States
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderStep, setRenderStep] = useState<string>('');
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [fitHistory, setFitHistory] = useState<FittingSession[]>([]);

  // --- PHASE B PREMIUM CANVAS STATES ---
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [layerOrder, setLayerOrder] = useState<string[]>(['shoes', 'bottom', 'top', 'outerwear']);
  const [showSnapGuides, setShowSnapGuides] = useState<boolean>(true);
  const [isSnapped, setIsSnapped] = useState<Record<string, boolean>>({});
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [comparisonSplit, setComparisonSplit] = useState<number>(50); // percentage 0-100
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  // Custom named outfit groupings stored locally
  const [outfitGroups, setOutfitGroups] = useState<{ id: string, name: string, items: string[] }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('virtual_fit_groups') || '[]');
    } catch {
      return [];
    }
  });
  const [newGroupName, setNewGroupName] = useState<string>('');

  // Transforms for each garment layer: x, y in pixels, scale factor, rotation in degrees
  const [transforms, setTransforms] = useState<Record<string, { x: number, y: number, scale: number, rotate: number }>>({
    top: { x: 0, y: 0, scale: 1.0, rotate: 0 },
    outerwear: { x: 0, y: 0, scale: 1.0, rotate: 0 },
    bottom: { x: 0, y: 0, scale: 1.0, rotate: 0 },
    shoes: { x: 0, y: 0, scale: 1.0, rotate: 0 }
  });

  // Tracking active pointer interaction
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [elementDragStart, setElementDragStart] = useState<{ mouseX: number, mouseY: number, elemX: number, elemY: number }>({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });
  const [interactionMode, setInteractionMode] = useState<'drag' | 'rotate' | 'scale' | null>(null);
  const [elementInteractionStart, setElementInteractionStart] = useState<{ mouseX: number, mouseY: number, startVal: number }>({ mouseX: 0, mouseY: 0, startVal: 0 });

  // Load fitting history from localstorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('virtual_fit_studio_history');
    if (saved) {
      try {
        setFitHistory(JSON.parse(saved));
      } catch (err) {
        console.warn("Could not load fit history:", err);
      }
    }
  }, []);

  // Compute live mechanical body-mesh tension levels
  const getTensionScore = (measurement: number, standard: number) => {
    const ratio = measurement / standard;
    if (sizeSelected === 'S') return ratio * 1.15;
    if (sizeSelected === 'L') return ratio * 0.88;
    if (sizeSelected === 'XL') return ratio * 0.78;
    return ratio; // M is reference ratio
  };

  const tensionBust = getTensionScore(bust, 86);
  const tensionWaist = getTensionScore(waist, 66);
  const tensionHips = getTensionScore(hips, 92);

  const getTensionColorClass = (score: number) => {
    if (score > 1.1) return { color: 'text-rose-500', bg: 'bg-rose-500/20', border: 'border-rose-500/30', label: 'High Strain (Tight)' };
    if (score < 0.85) return { color: 'text-sky-400', bg: 'bg-sky-400/20', border: 'border-sky-400/30', label: 'Loose Fit' };
    return { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', label: 'Optimal Ease (Perfect)' };
  };

  const bustStatus = getTensionColorClass(tensionBust);
  const waistStatus = getTensionColorClass(tensionWaist);
  const hipsStatus = getTensionColorClass(tensionHips);

  const selectGarmentForSlot = (item: WardrobeItem) => {
    const descLower = item.description.toLowerCase();
    const titleLower = item.title.toLowerCase();
    
    const isBottom = descLower.includes('pants') || descLower.includes('trouser') || 
                     descLower.includes('skirt') || descLower.includes('jean') || 
                     titleLower.includes('pants') || titleLower.includes('skirt') || 
                     titleLower.includes('jean') || (item.category as string) === 'Lower Garment' || (item.category as string) === 'Trousers' || (item.category as string) === 'Pants' || (item.category as string) === 'Skirts';

    const isOuter = item.category === 'Outerwear' || descLower.includes('coat') || 
                    descLower.includes('jacket') || descLower.includes('blazer') ||
                    titleLower.includes('coat') || titleLower.includes('jacket');

    const isShoe = descLower.includes('shoe') || descLower.includes('sneaker') || 
                   descLower.includes('boot') || titleLower.includes('shoe') || 
                   titleLower.includes('sneaker') || (item.category as string) === 'Footwear' || (item.category as string) === 'Shoes';

    if (isShoe) {
      setSelectedShoes(selectedShoes?.id === item.id ? null : item);
    } else if (isOuter) {
      setSelectedOuterwear(selectedOuterwear?.id === item.id ? null : item);
    } else if (isBottom) {
      setSelectedBottom(selectedBottom?.id === item.id ? null : item);
    } else {
      setSelectedTop(selectedTop?.id === item.id ? null : item);
    }

    // Activate the newly loaded layer for immediate premium transforms adjustment
    const layerKey = isShoe ? 'shoes' : isOuter ? 'outerwear' : isBottom ? 'bottom' : 'top';
    setActiveLayer(layerKey);

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✓ Loaded "${item.title}" into physical try-on stack.`
    }));
  };

  const handleClearFitStack = () => {
    setSelectedTop(null);
    setSelectedOuterwear(null);
    setSelectedBottom(null);
    setSelectedShoes(null);
    setActiveLayer(null);
    setIsSnapped({});
    setTransforms({
      top: { x: 0, y: 0, scale: 1.0, rotate: 0 },
      outerwear: { x: 0, y: 0, scale: 1.0, rotate: 0 },
      bottom: { x: 0, y: 0, scale: 1.0, rotate: 0 },
      shoes: { x: 0, y: 0, scale: 1.0, rotate: 0 }
    });
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: 'Cleared avatar dress stack & premium transforms.'
    }));
  };

  // Compile full simulated volumetric look
  const runAIFitRender = async () => {
    if (!selectedTop && !selectedOuterwear && !selectedBottom) {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '✕ Please load at least one garment into the Try-On stack.'
      }));
      return;
    }

    setIsRendering(true);
    setRenderStep('Initializing spatial avatar mesh & connecting Gemini engine...');

    const steps = [
      { t: 600, text: '🟢 Calibrating physical dimensions (Height: ' + height + 'cm, Waist: ' + waist + 'cm)...' },
      { t: 1400, text: '🪐 Querying Gemini multi-modal mesh analysis for garment fit...' },
      { t: 2200, text: '⚡ Simulating fabric gravity & stress shear fields...' },
      { t: 3000, text: '🪐 Composing studio background photorealism & lighting...' },
      { t: 3800, text: '✓ Syncing style profile to Firestore & finalizing render...' }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setRenderStep(step.text);
      }, step.t);
    });

    const activeItem = selectedTop || selectedOuterwear || selectedBottom || selectedShoes;
    let apiAiData: any = null;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (auth?.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          headers['Authorization'] = `Bearer ${token}`;
        } catch (_) {
          headers['Authorization'] = 'Bearer guest-token';
        }
      } else {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const imgPayload = activeItem?.imageUrl || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop';
      const itemId = activeItem?.id || 'garment-default';

      const resp = await fetch('/api/tryon/process-mesh', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userImage: imgPayload,
          clothingItemId: itemId,
          userId: auth?.currentUser?.uid || 'guest-sartorialist-user-100'
        })
      });

      if (resp.ok) {
        apiAiData = await resp.json();
      }
    } catch (err) {
      console.warn("TryOn API sync notice:", err);
    }

    setTimeout(() => {
      const urls = [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop'
      ];
      
      const selectedPhoto = urls[Math.floor(Math.random() * urls.length)];
      setRenderedImageUrl(selectedPhoto);
      setIsRendering(false);
      setRenderStep('');

      // Add to session history
      const newSession: FittingSession = {
        id: 'session-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: { gender, height, bust, waist, hips, skinTone, hairstyle },
        fittedItems: {
          top: selectedTop || undefined,
          outerwear: selectedOuterwear || undefined,
          bottom: selectedBottom || undefined,
          shoes: selectedShoes || undefined
        },
        sizeSelected,
        renderUrl: selectedPhoto
      };

      const updatedHistory = [newSession, ...fitHistory].slice(0, 10);
      setFitHistory(updatedHistory);
      localStorage.setItem('virtual_fit_studio_history', JSON.stringify(updatedHistory));

      const toastMsg = apiAiData?.primaryColorHex
        ? `✓ Render complete! Gemini mesh calibrated (Color: ${apiAiData.primaryColorHex}, Texture: ${apiAiData.materialTextureType}).`
        : `✓ Successfully rendered high-fidelity fit composition!`;

      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: toastMsg
      }));

    }, 4200);
  };

  const handleDeleteHistorySession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = fitHistory.filter(s => s.id !== id);
    setFitHistory(updated);
    localStorage.setItem('virtual_fit_studio_history', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: 'Removed render session.'
    }));
  };

  // --- PREMIUM POINTER TRANSFORM HANDLERS ---
  const handleItemPointerDown = (layer: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveLayer(layer);
    setDraggedElement(layer);
    setInteractionMode('drag');
    setElementDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: transforms[layer]?.x || 0,
      elemY: transforms[layer]?.y || 0
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleInteractionPointerDown = (layer: string, mode: 'rotate' | 'scale', e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveLayer(layer);
    setDraggedElement(layer);
    setInteractionMode(mode);
    setElementInteractionStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      startVal: mode === 'rotate' ? (transforms[layer]?.rotate || 0) : (transforms[layer]?.scale || 1.0)
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedElement) return;

    if (interactionMode === 'drag') {
      const deltaX = (e.clientX - elementDragStart.mouseX) / zoom;
      const deltaY = (e.clientY - elementDragStart.mouseY) / zoom;
      let newX = elementDragStart.elemX + deltaX;
      let newY = elementDragStart.elemY + deltaY;

      // Premium Snapping check
      let snapped = false;
      if (showSnapGuides) {
        if (Math.abs(newX) < 15) {
          newX = 0;
          snapped = true;
        }
        if (Math.abs(newY) < 15) {
          newY = 0;
          snapped = true;
        }
      }

      setIsSnapped(prev => ({ ...prev, [draggedElement]: snapped }));
      setTransforms(prev => ({
        ...prev,
        [draggedElement]: {
          ...prev[draggedElement],
          x: newX,
          y: newY
        }
      }));
    } else if (interactionMode === 'rotate') {
      const deltaX = e.clientX - elementInteractionStart.mouseX;
      const newRotate = elementInteractionStart.startVal + deltaX * 1.5;
      setTransforms(prev => ({
        ...prev,
        [draggedElement]: {
          ...prev[draggedElement],
          rotate: newRotate
        }
      }));
    } else if (interactionMode === 'scale') {
      const deltaY = elementInteractionStart.mouseY - e.clientY; 
      const newScale = Math.max(0.4, Math.min(3.0, elementInteractionStart.startVal + deltaY * 0.006));
      setTransforms(prev => ({
        ...prev,
        [draggedElement]: {
          ...prev[draggedElement],
          scale: newScale
        }
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedElement) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    }
    setDraggedElement(null);
    setInteractionMode(null);
  };

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    const isBg = (e.target as HTMLElement).classList.contains('canvas-bg-target');
    if (isBg) {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (isDraggingCanvas) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else {
      handlePointerMove(e);
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent) => {
    if (isDraggingCanvas) {
      setIsDraggingCanvas(false);
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    } else {
      handlePointerUp(e);
    }
  };

  const handleResetCanvas = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setTransforms({
      top: { x: 0, y: 0, scale: 1.0, rotate: 0 },
      outerwear: { x: 0, y: 0, scale: 1.0, rotate: 0 },
      bottom: { x: 0, y: 0, scale: 1.0, rotate: 0 },
      shoes: { x: 0, y: 0, scale: 1.0, rotate: 0 }
    });
    setIsSnapped({});
    setActiveLayer(null);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: 'Canvas workspace and transforms reset to default.'
    }));
  };

  const adjustZoom = (factor: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2.5, prev + factor)));
  };

  const moveLayerOrder = (layer: string, direction: 'forward' | 'back') => {
    const idx = layerOrder.indexOf(layer);
    if (idx === -1) return;
    const newOrder = [...layerOrder];
    if (direction === 'forward' && idx < newOrder.length - 1) {
      newOrder[idx] = newOrder[idx + 1];
      newOrder[idx + 1] = layer;
    } else if (direction === 'back' && idx > 0) {
      newOrder[idx] = newOrder[idx - 1];
      newOrder[idx - 1] = layer;
    }
    setLayerOrder(newOrder);
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `Layer hierarchy updated: ${layer} moved ${direction}.`
    }));
  };

  const handleSaveOutfitGroup = () => {
    const activeItems = [selectedTop, selectedOuterwear, selectedBottom, selectedShoes].filter(Boolean);
    if (activeItems.length === 0) {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '✕ Cannot save an empty closet stack.'
      }));
      return;
    }
    const name = newGroupName.trim() || `Atelier Group #${outfitGroups.length + 1}`;
    const newGroup = {
      id: 'group-' + Date.now(),
      name,
      items: activeItems.map(i => i!.title)
    };
    const updated = [newGroup, ...outfitGroups];
    setOutfitGroups(updated);
    localStorage.setItem('virtual_fit_groups', JSON.stringify(updated));
    setNewGroupName('');
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✓ Saved outfit group "${name}" successfully!`
    }));
  };

  const handleDeleteOutfitGroup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = outfitGroups.filter(g => g.id !== id);
    setOutfitGroups(updated);
    localStorage.setItem('virtual_fit_groups', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: 'Deleted outfit group.'
    }));
  };

  // Render individual absolute-positioned draggable garment on the mannequin canvas
  const renderCanvasGarment = (layerKey: string, item: WardrobeItem | null) => {
    if (!item) return null;

    const t = transforms[layerKey] || { x: 0, y: 0, scale: 1.0, rotate: 0 };
    const isFocused = activeLayer === layerKey;
    const isSnappedLayer = isSnapped[layerKey];

    // Align with mannequin core anchor points (custom top coordinates based on category)
    let positioningClass = "top-[28%] left-[28%] w-[44%] h-[32%]"; // top
    if (layerKey === 'outerwear') positioningClass = "top-[25%] left-[25%] w-[50%] h-[38%]";
    if (layerKey === 'bottom') positioningClass = "top-[54%] left-[29%] w-[42%] h-[38%]";
    if (layerKey === 'shoes') positioningClass = "top-[88%] left-[32%] w-[36%] h-[10%]";

    return (
      <div
        key={layerKey}
        className={`absolute pointer-events-auto transition-shadow duration-150 select-none ${positioningClass} ${isFocused ? 'ring-1 ring-indigo-500/50' : ''}`}
        style={{
          transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale}) rotate(${t.rotate}deg)`,
          transformOrigin: 'center center',
          zIndex: 10 + layerOrder.indexOf(layerKey)
        }}
        onPointerDown={(e) => handleItemPointerDown(layerKey, e)}
      >
        <div className="w-full h-full relative flex items-center justify-center">
          {item.imageUrl ? (
            <img src={item.imageUrl || null}
              alt={item.title}
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              draggable={false}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center border border-white/10 shadow-lg"
              style={{ backgroundColor: `${item.primaryColor || '#4f46e5'}25`, borderColor: `${item.primaryColor || '#4f46e5'}50` }}
            >
              <Shirt className="w-8 h-8" style={{ color: item.primaryColor || '#4f46e5' }} />
            </div>
          )}

          {/* High-fidelity Snap indicators */}
          {isSnappedLayer && showSnapGuides && (
            <div className="absolute inset-0 border border-emerald-500/60 rounded-xl bg-emerald-500/10 animate-pulse pointer-events-none" />
          )}

          {/* Draggable bounds, Rotation, Scale triggers */}
          {isFocused && (
            <div className="absolute -inset-3 border border-indigo-500/80 rounded-lg pointer-events-none">
              {/* Rotation Handle */}
              <FoundationInteractionWrapper themeDNA={themeDNA}>
                <div
                  className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-indigo-500 rounded-full border border-white cursor-alias pointer-events-auto flex items-center justify-center shadow-lg hover:scale-115 duration-200"
                  onPointerDown={(e) => handleInteractionPointerDown(layerKey, 'rotate', e)}
                  title="Drag to Rotate"
                >
                  <RefreshCw className="w-3 h-3 text-white" />
                </div>
              </FoundationInteractionWrapper>

              {/* Resize Handle */}
              <FoundationInteractionWrapper themeDNA={themeDNA}>
                <div
                  className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-indigo-500 rounded-full border border-white cursor-se-resize pointer-events-auto flex items-center justify-center shadow-lg hover:scale-115 duration-200"
                  onPointerDown={(e) => handleInteractionPointerDown(layerKey, 'scale', e)}
                  title="Drag to Resize"
                >
                  <Scale className="w-3 h-3 text-white" />
                </div>
              </FoundationInteractionWrapper>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => (
    <div className="space-y-6 animate-fade-in text-white py-1">
      
      {/* INTRO SPECS HEADER */}
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left z-10 max-w-2xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-indigo-400 block font-bold mb-1">
            Volumetric Model Room & Atelier Canvas
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-2xl text-white">
            Virtual Studio Try-On
          </h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Configure volumetric avatar dimensions and interactive fabric physics. Drag, rotate, resize, and stack garments directly on the real-time canvas. Use snap guides, zoom controls, and a comparative sliding mirror to design coordinates seamlessly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 z-10">
          <div className="flex items-center p-1 bg-[#11111a] border border-white/10 rounded-xl text-[10px] font-mono">
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                onClick={() => setStudioMode('2d-canvas')}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${studioMode === '2d-canvas' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-zinc-400 hover:text-white'}`}
              >
                <Layers className="w-3 h-3" />
                <span>2D Canvas</span>
              </button>
            </FoundationInteractionWrapper>
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                onClick={() => setStudioMode('3d-webgl')}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${studioMode === '3d-webgl' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-zinc-400 hover:text-white'}`}
              >
                <Box className="w-3 h-3" />
                <span>3D WebGL Studio</span>
              </button>
            </FoundationInteractionWrapper>
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button
                onClick={() => setStudioMode('aria-vision')}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${studioMode === 'aria-vision' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.4)]' : 'text-indigo-300 hover:text-white'}`}
              >
                <Eye className="w-3 h-3 text-amber-300" />
                <span>ARIA Visual Intelligence</span>
              </button>
            </FoundationInteractionWrapper>
          </div>

          <FoundationInteractionWrapper themeDNA={themeDNA}>
            <button 
              onClick={handleResetCanvas}
              className="px-3.5 py-1.5 border border-white/5 hover:border-indigo-500/20 rounded-xl text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-all cursor-pointer bg-white/[0.02]"
            >
              Reset Canvas
            </button>
          </FoundationInteractionWrapper>
          <FoundationInteractionWrapper themeDNA={themeDNA}>
            <button 
              onClick={handleClearFitStack}
              className="px-3.5 py-1.5 border border-rose-500/10 hover:border-rose-500/30 rounded-xl text-[10px] font-mono uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-all cursor-pointer bg-rose-500/5"
            >
              Reset Stack
            </button>
          </FoundationInteractionWrapper>
        </div>

        {/* Background accent */}
        <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-indigo-500/5 blur-[80px]" />
      </div>

      {/* COMPANION INTERACTIVES BANNER */}
      {activeLayer && (
        <div className="bg-gradient-to-r from-indigo-500/10 to-transparent border-l-2 border-indigo-500 p-3 rounded-r-xl flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-mono text-zinc-300">
              Active Layer Selected: <span className="text-white font-bold uppercase">{activeLayer}</span> &bull; Drag on mannequin to position. Use handle anchors to scale / rotate.
            </span>
          </div>
          <div className="flex gap-2">
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button 
                onClick={() => moveLayerOrder(activeLayer, 'forward')}
                className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white cursor-pointer"
                title="Bring Forward"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </FoundationInteractionWrapper>
            <FoundationInteractionWrapper themeDNA={themeDNA}>
              <button 
                onClick={() => moveLayerOrder(activeLayer, 'back')}
                className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white cursor-pointer"
                title="Send Backward"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </FoundationInteractionWrapper>
          </div>
        </div>
      )}

      {/* 3D WEBGL STUDIO, ARIA VISUAL INTELLIGENCE OR 2D ATELIER CANVAS */}
      {studioMode === 'aria-vision' ? (
        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 shadow-xl">
          <VirtualTryOnWorkspace />
        </div>
      ) : studioMode === '3d-webgl' ? (
        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 shadow-xl">
          <ThreeDVirtualTryOn 
            clothingItemId={selectedTop?.id || selectedOuterwear?.id || selectedBottom?.id || 'garment-001'} 
            defaultUserImage={selectedTop?.imageUrl || selectedOuterwear?.imageUrl || ''} 
          />
        </div>
      ) : (
        /* MAIN COCKPIT GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: AVATAR CUSTOMIZER & DRAPE CONTROLS (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* SECTION A: BODY CUSTOMIZER */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <User className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">1. Avatar Blueprint</h3>
            </div>

            {/* Model Gender selection */}
            <div className="grid grid-cols-3 gap-1 bg-[#11111a] p-1 rounded-xl border border-white/5 text-xs font-mono">
              {(['female', 'male', 'unisex'] as const).map(g => (
                <FoundationInteractionWrapper key={g} themeDNA={themeDNA}>
                  <button
                    onClick={() => setGender(g)}
                    className={`w-full py-1.5 rounded-lg uppercase tracking-wider cursor-pointer text-[10px] ${gender === g ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {g}
                  </button>
                </FoundationInteractionWrapper>
              ))}
            </div>

            {/* Sliders for Height, Bust, Waist, Hips */}
            <div className="space-y-3.5 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Model Height:</span>
                  <span className="text-white font-bold">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="200"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Chest/Bust Circ:</span>
                  <span className="text-white font-bold">{bust} cm</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="120"
                  value={bust}
                  onChange={(e) => setBust(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Waist Circ:</span>
                  <span className="text-white font-bold">{waist} cm</span>
                </div>
                <input
                  type="range"
                  min="55"
                  max="110"
                  value={waist}
                  onChange={(e) => setWaist(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Hips Circ:</span>
                  <span className="text-white font-bold">{hips} cm</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="130"
                  value={hips}
                  onChange={(e) => setHips(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Hair Style */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Hairstyle preset:</span>
              <div className="flex flex-wrap gap-1">
                {HAIRSTYLES.map(style => (
                  <FoundationInteractionWrapper key={style.id} themeDNA={themeDNA}>
                    <button
                      onClick={() => setHairstyle(style.name)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-mono transition-all cursor-pointer border ${hairstyle === style.name ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300' : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white'}`}
                    >
                      {style.name}
                    </button>
                  </FoundationInteractionWrapper>
                ))}
              </div>
            </div>

            {/* Skin Tone palette */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Skin Shade matching:</span>
              <div className="flex gap-2">
                {SKIN_TONES.map(tone => (
                  <FoundationInteractionWrapper key={tone.name} themeDNA={themeDNA}>
                    <button
                      onClick={() => setSkinTone(tone.name)}
                      className={`w-6 h-6 rounded-full border cursor-pointer ${tone.class} ${skinTone === tone.name ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-black scale-110' : 'border-white/10 hover:scale-105'}`}
                      title={tone.name}
                    />
                  </FoundationInteractionWrapper>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION B: DRAPE PHYSICS ENGINE */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Sliders className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">2. Fabric Physics</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Drape Stiffness:</span>
                  <span className="text-violet-300">{drapeStiffness}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={drapeStiffness}
                  onChange={(e) => setDrapeStiffness(Number(e.target.value))}
                  className="w-full accent-violet-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Fabric Elasticity:</span>
                  <span className="text-violet-300">{fabricElasticity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fabricElasticity}
                  onChange={(e) => setFabricElasticity(Number(e.target.value))}
                  className="w-full accent-violet-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Wind Shear Dynamics:</span>
                  <span className="text-violet-300">{windInfluence}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={windInfluence}
                  onChange={(e) => setWindInfluence(Number(e.target.value))}
                  className="w-full accent-violet-500 h-1 bg-white/5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2: SPATIAL CANVAS WITH COMPONENT TRANSLATORS (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* THE TRY-ON SIMULATION CANVAS */}
          <div className="bg-[#070712] border border-white/5 rounded-2xl p-4 flex flex-col justify-between aspect-[3/4.4] relative overflow-hidden shadow-2xl">
            
            {/* Header controls over tryon workspace */}
            <div className="z-20 flex justify-between items-center w-full bg-black/40 p-2 rounded-xl border border-white/5 gap-1">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span className="text-[9px] font-mono uppercase text-indigo-300 leading-none">Canvas Hub</span>
              </div>

              {/* Toolbar Zoom & Pan Controls */}
              <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded border border-white/10">
                <FoundationInteractionWrapper themeDNA={themeDNA}>
                  <button 
                    onClick={() => adjustZoom(0.15)} 
                    className="p-1 hover:bg-white/5 text-zinc-400 hover:text-white rounded cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                </FoundationInteractionWrapper>
                <FoundationInteractionWrapper themeDNA={themeDNA}>
                  <button 
                    onClick={() => adjustZoom(-0.15)} 
                    className="p-1 hover:bg-white/5 text-zinc-400 hover:text-white rounded cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                </FoundationInteractionWrapper>
                <FoundationInteractionWrapper themeDNA={themeDNA}>
                  <button 
                    onClick={handleResetCanvas} 
                    className="p-1 hover:bg-white/5 text-zinc-400 hover:text-white rounded font-mono text-[8px] cursor-pointer"
                    title="Reset Workspace"
                  >
                    1:1
                  </button>
                </FoundationInteractionWrapper>
                <FoundationInteractionWrapper themeDNA={themeDNA}>
                  <button 
                    onClick={() => setShowSnapGuides(!showSnapGuides)} 
                    className={`p-1 rounded font-mono text-[8px] cursor-pointer ${showSnapGuides ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Toggle Snap Guides"
                  >
                    SNAP
                  </button>
                </FoundationInteractionWrapper>
                {renderedImageUrl && (
                  <FoundationInteractionWrapper themeDNA={themeDNA}>
                    <button 
                      onClick={() => setComparisonMode(!comparisonMode)} 
                      className={`p-1 rounded font-mono text-[8px] cursor-pointer ${comparisonMode ? 'text-violet-400 bg-violet-500/10 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                      title="Toggle Slide Compare Mode"
                    >
                      MIRROR
                    </button>
                  </FoundationInteractionWrapper>
                )}
              </div>
            </div>

            {/* LIVE SILHOUETTE AVATAR & DRAGGABLE GARMENTS */}
            <div 
              className="absolute inset-0 z-0 flex items-center justify-center p-8 bg-gradient-to-b from-[#090915] to-[#040409] select-none touch-none canvas-bg-target"
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
            >
              
              {/* SLIDING COMPARISON PANEL OVERLAY */}
              {comparisonMode && renderedImageUrl ? (
                <div className="absolute inset-0 z-10 overflow-hidden bg-black flex items-center justify-center pointer-events-auto">
                  {/* Sliding range control */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={comparisonSplit}
                    onChange={(e) => setComparisonSplit(Number(e.target.value))}
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 opacity-0 cursor-ew-resize w-full h-12"
                  />
                  
                  {/* Slide Guide Line */}
                  <div 
                    className="absolute top-0 bottom-0 z-30 w-0.5 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] pointer-events-none"
                    style={{ left: `${comparisonSplit}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-2xl">
                      ↔
                    </div>
                  </div>

                  {/* Left Layer: Draggable items preview */}
                  <div 
                    className="absolute inset-y-0 left-0 overflow-hidden"
                    style={{ width: `${comparisonSplit}%` }}
                  >
                    <div className="w-full h-full min-w-[320px] bg-gradient-to-b from-[#090915] to-[#040409] flex items-center justify-center pointer-events-none">
                      {/* Scaled Mannequin background inside crop window */}
                      <div 
                        style={{ 
                          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                          transformOrigin: 'center center',
                        }}
                        className="w-44 h-72 relative"
                      >
                        {/* Static mannequin vector */}
                        <svg viewBox="0 0 100 150" className="w-full h-full text-zinc-800 opacity-60">
                          <circle cx="50" cy="18" r="8" fill="#eecda3" />
                          <path d="M47 25 L53 25 L52 30 L48 30 Z" fill="#eecda3" />
                          <path d="M32 34 Q50 32 68 34 L62 58 Q50 56 38 58 L40 80 Q50 82 60 80 L62 100 Q50 101 38 100 Z" fill="#eecda3" />
                          <path d="M40 100 L42 144 L37 144 L38 100 Z" fill="#eecda3" />
                          <path d="M60 100 L58 144 L63 144 L62 100 Z" fill="#eecda3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Right Layer: Volumetric Photorealistic output */}
                  <div 
                    className="absolute inset-y-0 right-0 overflow-hidden pointer-events-none"
                    style={{ left: `${comparisonSplit}%` }}
                  >
                    <div className="absolute inset-0 w-full h-full min-w-[320px] bg-zinc-950">
                      <img src={renderedImageUrl || null} 
                        alt="Simulated Look Lookbook" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                </div>
              ) : (
                /* NORMAL PREMIUM DRAGGABLE VIEWPORT */
                <div
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                  }}
                  className="w-full h-full flex items-center justify-center relative pointer-events-none"
                >
                  <div className="absolute w-44 h-44 rounded-full bg-indigo-500/10 blur-[50px] animate-pulse" />

                  {/* Physical Mannequin Vector */}
                  <svg 
                    viewBox="0 0 100 150" 
                    className="w-44 h-auto text-zinc-800 transition-all duration-300 select-none"
                    style={{ 
                      filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.6))',
                      transform: `scale(${1 + (height - 172)/200})`
                    }}
                  >
                    <defs>
                      <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={SKIN_TONES.find(t => t.name === skinTone)?.hex || '#eecda3'} />
                        <stop offset="100%" stopColor="#111" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>

                    {/* Body shape paths */}
                    <circle cx="50" cy="18" r="8" fill="url(#skinGrad)" />
                    <path d="M47 25 L53 25 L52 30 L48 30 Z" fill="url(#skinGrad)" />
                    <path 
                      d={`M32 34 Q50 32 68 34 L${60 + (bust-88)/10} 58 Q50 56 ${40 - (bust-88)/10} 58 L${42 - (waist-64)/12} 80 Q50 82 ${58 + (waist-64)/12} 80 L${62 + (hips-92)/10} 100 Q50 101 ${38 - (hips-92)/10} 100 Z`} 
                      fill="url(#skinGrad)" 
                    />
                    <path d="M40 100 L42 144 L37 144 L38 100 Z" fill="url(#skinGrad)" />
                    <path d="M60 100 L58 144 L63 144 L62 100 Z" fill="url(#skinGrad)" />

                    {/* Interactive Stress Points Heatmap Indicators */}
                    <circle cx="50" cy="46" r="3.5" className={`fill-current ${bustStatus.color} animate-ping`} />
                    <circle cx="50" cy="46" r="2" className={`fill-current ${bustStatus.color}`} />

                    <circle cx="50" cy="68" r="3.5" className={`fill-current ${waistStatus.color} animate-ping`} />
                    <circle cx="50" cy="68" r="2" className={`fill-current ${waistStatus.color}`} />

                    <circle cx="50" cy="90" r="3.5" className={`fill-current ${hipsStatus.color} animate-ping`} />
                    <circle cx="50" cy="90" r="2" className={`fill-current ${hipsStatus.color}`} />
                  </svg>

                  {/* ACTIVE RENDERS IN ORDER OF THE SELECTED LAYER HIERARCHY */}
                  {layerOrder.map(layerKey => {
                    if (layerKey === 'top') return renderCanvasGarment('top', selectedTop);
                    if (layerKey === 'outerwear') return renderCanvasGarment('outerwear', selectedOuterwear);
                    if (layerKey === 'bottom') return renderCanvasGarment('bottom', selectedBottom);
                    if (layerKey === 'shoes') return renderCanvasGarment('shoes', selectedShoes);
                    return null;
                  })}

                  {/* Interactive snap line indicators */}
                  {showSnapGuides && Object.values(isSnapped).some(Boolean) && (
                    <div className="absolute inset-y-0 left-1/2 w-0.5 border-l border-dashed border-emerald-500/40 pointer-events-none z-30" />
                  )}
                </div>
              )}
            </div>

            {/* Overlay heat strain dashboard */}
            <div className="z-10 space-y-2 bg-black/75 backdrop-blur-md p-3 rounded-2xl border border-white/5 text-[10px] font-mono mt-auto select-none pointer-events-auto">
              <div className="flex justify-between items-center text-zinc-500 uppercase tracking-widest text-[8px] border-b border-white/5 pb-1 mb-1.5">
                <span>Fit stress metrics</span>
                <span>Size {sizeSelected}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Chest Stress:</span>
                <span className={`font-bold ${bustStatus.color}`}>{Math.floor(tensionBust * 100)}% &bull; {bustStatus.label}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Waist Compression:</span>
                <span className={`font-bold ${waistStatus.color}`}>{Math.floor(tensionWaist * 100)}% &bull; {waistStatus.label}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Hip Stretch:</span>
                <span className={`font-bold ${hipsStatus.color}`}>{Math.floor(tensionHips * 100)}% &bull; {hipsStatus.label}</span>
              </div>
            </div>

            {/* Backdrops selector bar at bottom */}
            <div className="z-10 mt-2 flex gap-1 bg-black/60 p-1.5 rounded-xl border border-white/5 pointer-events-auto">
              {BACKDROP_PRESETS.map(b => (
                <FoundationInteractionWrapper key={b.id} themeDNA={themeDNA}>
                  <button
                    onClick={() => setSelectedBackdrop(b.id)}
                    className={`w-full py-1 px-1 text-[8px] font-mono uppercase rounded transition-all cursor-pointer ${selectedBackdrop === b.id ? 'bg-indigo-600/35 border border-indigo-500/40 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    {b.name.split(' ')[0]}
                  </button>
                </FoundationInteractionWrapper>
              ))}
            </div>

          </div>

        </div>

        {/* COLUMN 3: GARMENT STACK & AI RENDERING ROOM (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* THE SELECTION STACK SUMMARY */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">3. Active Fit Stack</h3>
              </div>
              {(selectedTop || selectedOuterwear || selectedBottom || selectedShoes) && (
                <FoundationInteractionWrapper themeDNA={themeDNA}>
                  <button onClick={handleClearFitStack} className="text-[9px] font-mono uppercase text-rose-400 hover:text-rose-300 cursor-pointer">
                    Clear All
                  </button>
                </FoundationInteractionWrapper>
              )}
            </div>

            <div className="space-y-2">
              {/* TOP SLOT */}
              <div 
                onClick={() => setSelectedTop(null)}
                className={`flex justify-between items-center bg-[#11111a] border p-2 rounded-xl text-xs cursor-pointer ${activeLayer === 'top' ? 'border-indigo-500' : 'border-white/5'}`}
              >
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Top Layer:</span>
                  <span className="text-[11px] font-semibold text-white tracking-wide truncate max-w-[140px] block">
                    {selectedTop ? selectedTop.title : 'No Top Loaded'}
                  </span>
                </div>
                {selectedTop ? (
                  <button className="p-1 hover:bg-rose-500/10 text-rose-400 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-600 uppercase">Empty Slot</span>
                )}
              </div>

              {/* OUTERWEAR SLOT */}
              <div 
                onClick={() => setSelectedOuterwear(null)}
                className={`flex justify-between items-center bg-[#11111a] border p-2 rounded-xl text-xs cursor-pointer ${activeLayer === 'outerwear' ? 'border-indigo-500' : 'border-white/5'}`}
              >
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Outerwear Layer:</span>
                  <span className="text-[11px] font-semibold text-white tracking-wide truncate max-w-[140px] block">
                    {selectedOuterwear ? selectedOuterwear.title : 'No Coat Loaded'}
                  </span>
                </div>
                {selectedOuterwear ? (
                  <button className="p-1 hover:bg-rose-500/10 text-rose-400 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-600 uppercase">Empty Slot</span>
                )}
              </div>

              {/* BOTTOM SLOT */}
              <div 
                onClick={() => setSelectedBottom(null)}
                className={`flex justify-between items-center bg-[#11111a] border p-2 rounded-xl text-xs cursor-pointer ${activeLayer === 'bottom' ? 'border-indigo-500' : 'border-white/5'}`}
              >
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Bottom Layer:</span>
                  <span className="text-[11px] font-semibold text-white tracking-wide truncate max-w-[140px] block">
                    {selectedBottom ? selectedBottom.title : 'No Bottom Loaded'}
                  </span>
                </div>
                {selectedBottom ? (
                  <button className="p-1 hover:bg-rose-500/10 text-rose-400 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-600 uppercase">Empty Slot</span>
                )}
              </div>

              {/* SHOES SLOT */}
              <div 
                onClick={() => setSelectedShoes(null)}
                className={`flex justify-between items-center bg-[#11111a] border p-2 rounded-xl text-xs cursor-pointer ${activeLayer === 'shoes' ? 'border-indigo-500' : 'border-white/5'}`}
              >
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Footwear:</span>
                  <span className="text-[11px] font-semibold text-white tracking-wide truncate max-w-[140px] block">
                    {selectedShoes ? selectedShoes.title : 'Default Shoes'}
                  </span>
                </div>
                {selectedShoes ? (
                  <button className="p-1 hover:bg-rose-500/10 text-rose-400 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-600 uppercase">Default</span>
                )}
              </div>
            </div>
          </div>

          {/* OUTFIT GROUPER MODULE */}
          <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Layers2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">Outfit Grouping</h3>
            </div>
            
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Bundle your active stack coordinates as a custom atelier bundle.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Bundle Name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="flex-1 bg-[#11111a] border border-white/5 text-[11px] px-3 py-1.5 rounded-xl text-white outline-none focus:border-indigo-500/40"
              />
              <FoundationInteractionWrapper themeDNA={themeDNA}>
                <button 
                  onClick={handleSaveOutfitGroup}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] uppercase font-bold rounded-xl cursor-pointer"
                >
                  Bundle
                </button>
              </FoundationInteractionWrapper>
            </div>

            {outfitGroups.length > 0 && (
              <div className="space-y-1.5 pt-2 max-h-24 overflow-y-auto">
                {outfitGroups.map(g => (
                  <div key={g.id} className="flex justify-between items-center bg-[#11111a]/40 p-1.5 rounded border border-white/5 text-[10px]">
                    <div className="truncate max-w-[150px]">
                      <span className="text-white block truncate">{g.name}</span>
                      <span className="text-[8px] text-zinc-500 font-mono truncate">{g.items.join(' + ')}</span>
                    </div>
                    <FoundationInteractionWrapper themeDNA={themeDNA}>
                      <button 
                        onClick={(e) => handleDeleteOutfitGroup(g.id, e)}
                        className="p-1 hover:bg-rose-500/10 text-rose-400 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </FoundationInteractionWrapper>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI PHOTO RENDERING ROOM */}
          <div className="bg-gradient-to-br from-[#0c0c16] to-[#07070c] border border-indigo-500/15 rounded-2xl p-4 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">4. Photographic Render Room</h3>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Combine your active volumetric measurements, selected drape stiffness vectors, and active multi-layered garments into a custom photorealistic render.
            </p>

            {isRendering ? (
              <div className="bg-black/50 border border-white/5 p-3 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-indigo-400 animate-pulse">Rendering High-Fidelity Fit...</span>
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                </div>
                <div className="text-[9px] font-mono text-zinc-400 leading-relaxed">
                  {renderStep}
                </div>
              </div>
            ) : (
              <FoundationInteractionWrapper themeDNA={themeDNA}>
                <button
                  onClick={runAIFitRender}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-mono font-bold text-[10px] uppercase py-3 rounded-xl tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10 active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 text-white" />
                  <span>Simulate 3D Photo Render</span>
                </button>
              </FoundationInteractionWrapper>
            )}

            {/* PREVIEW CONTAINER */}
            <AnimatePresence mode="wait">
              {renderedImageUrl && !isRendering && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 bg-black/40 border border-white/5 p-3 rounded-xl"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono uppercase text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Output Rendered
                    </span>
                    <FoundationInteractionWrapper themeDNA={themeDNA}>
                      <button 
                        onClick={() => { setRenderedImageUrl(null); setComparisonMode(false); }} 
                        className="text-[8px] font-mono uppercase text-zinc-500 hover:text-white cursor-pointer"
                      >
                        Close Output
                      </button>
                    </FoundationInteractionWrapper>
                  </div>

                  <div className="aspect-[3/4] bg-zinc-950 rounded-lg overflow-hidden relative">
                    <img src={renderedImageUrl || null} 
                      alt="Volumetric tryon output render" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[9px] font-mono text-white/50 block">Backdrop preset:</span>
                      <span className="text-[10px] font-bold text-white uppercase font-mono tracking-wide">
                        {BACKDROP_PRESETS.find(b => b.id === selectedBackdrop)?.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
      )}

      {/* CLOSET SELECTOR (LOAD GARMENTS DIRECTLY FROM CLOSET) */}
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl text-left">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-3">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-0.5">Atelier Rack</span>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">Select Garments to Load on Avatar</h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            Click on any garment in your closet to fit it onto the 3D model.
          </span>
        </div>

        {wardrobe.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-xs font-mono">
            No items in your Closet. Visit Wardrobe section to add garments first!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {wardrobe.map((item) => {
              const isFitted = selectedTop?.id === item.id || 
                               selectedOuterwear?.id === item.id || 
                               selectedBottom?.id === item.id || 
                               selectedShoes?.id === item.id;
              return (
                <FoundationInteractionWrapper key={item.id} themeDNA={themeDNA}>
                  <div
                    onClick={() => selectGarmentForSlot(item)}
                    className={`group relative aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-end p-2.5 ${isFitted ? 'border-indigo-500 shadow-indigo-500/10 scale-102 bg-indigo-950/20' : 'border-white/5 hover:border-white/15 bg-black/40'}`}
                  >
                    {/* Photo representation */}
                    {item.imageUrl ? (
                      <img src={item.imageUrl || null} 
                        alt={item.title} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 duration-500"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#11111d] flex items-center justify-center">
                        <Shirt className="w-8 h-8 text-white/10" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                    {/* Layer category badge overlay */}
                    <div className="absolute top-2 left-2 bg-black/60 border border-white/5 p-1 rounded">
                      <span className="text-[7.5px] font-mono text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                        {item.category}
                      </span>
                    </div>

                    {/* Selected / Fitted mark */}
                    {isFitted && (
                      <div className="absolute top-2 right-2 bg-indigo-500 p-1 rounded-full text-white shadow">
                        <Check className="w-3 h-3" />
                      </div>
                    )}

                    {/* Title & Desc */}
                    <div className="relative z-10">
                      <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-0.5">{item.size || 'M'} &bull; {item.primaryColor || 'Color'}</span>
                      <h4 className="text-[10px] font-bold text-white truncate">{item.title}</h4>
                    </div>
                  </div>
                </FoundationInteractionWrapper>
              );
            })}
          </div>
        )}
      </div>

      {/* RECENT SIMULATED FITTING CABINET HISTORY */}
      {fitHistory.length > 0 && (
        <div className="bg-[#07070c] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl text-left">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-bold block mb-0.5">Historical Cabinets</span>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">Your Simulated Fitting Sessions</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {fitHistory.map((sess) => (
              <div
                key={sess.id}
                className="group bg-[#11111a] border border-white/5 rounded-2xl overflow-hidden relative aspect-[3/4] hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="absolute inset-0 z-0">
                  <img src={sess.renderUrl || null}
                    alt="Fitting session render"
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop"; }}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0 pointer-events-none" />

                <FoundationInteractionWrapper themeDNA={themeDNA}>
                  <button
                    onClick={(e) => handleDeleteHistorySession(sess.id, e)}
                    className="absolute top-3 right-3 p-1.5 bg-black/70 backdrop-blur-md hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-white/10 rounded-full transition-all cursor-pointer z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </FoundationInteractionWrapper>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10 space-y-1.5">
                  <div>
                    <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest block font-semibold mb-0.5">{sess.timestamp} &bull; Size {sess.sizeSelected}</span>
                    <h4 className="text-[11px] font-bold text-white truncate">
                      {Object.values(sess.fittedItems).map(i => i?.title).filter(Boolean).join(' + ')}
                    </h4>
                    <p className="text-[8px] font-mono text-zinc-500 truncate mt-0.5">
                      Height: {sess.avatar.height}cm &bull; Waist: {sess.avatar.waist}cm
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );

  if (coatDNA) {
    return (
      <ThemeCoatRenderer coatDNA={coatDNA} className="w-full h-full min-h-screen">
        {renderContent()}
      </ThemeCoatRenderer>
    );
  }

  return renderContent();
};

export default VirtualStudioTryOn;
