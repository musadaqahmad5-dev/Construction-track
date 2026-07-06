import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, MessageSquare, Layers, User, Compass, Shirt, 
  ShoppingBag, Users, Store, Mail, ChevronRight, Lock, 
  CheckCircle, RefreshCw, Send, Terminal, ArrowRight,
  Database, Activity, Shield, Info, Heart, Bell, Settings, Eye, Globe,
  Moon, Sun, Search, SlidersHorizontal, Plus, Star, Award, ChevronDown,
  Trash2, ShieldCheck, AlertTriangle, Play, HelpCircle,
  Camera, Scissors, Truck, DollarSign, TrendingUp, Sliders, Layers3
} from 'lucide-react';
import { UnifiedFashionOS } from '../features/ai-core/UnifiedFashionOS';

interface ArchitectureMapProps {
  user: any;
  onNavigateToTab?: (tab: string) => void;
  onToggleFocusMode?: () => void;
  children?: React.ReactNode;
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  color: string;
  dashArray?: string;
  pulse?: boolean;
}

export const ArchitectureMap: React.FC<ArchitectureMapProps> = ({ 
  user, 
  onNavigateToTab,
  onToggleFocusMode,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'HOME' | 'AI_STUDIO' | 'MARKETPLACE' | 'COMMUNITY' | 'WARDROBE' | 'COLLECTIONS' | 'MESSAGES' | 'PROFILE' | 'SYSTEM_ROOM' | 'VIRTUAL_TRY'>('HOME');
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<number>(2);
  
  // Initialize modules as registered/waitlisted so they are immediately simulate-able
  const [isWaitlisted, setIsWaitlisted] = useState<Record<string, boolean>>({
    'right-designer': true,
    'right-photoshoot': true,
    'right-moodboard': true,
    'right-influencer': true,
    'right-brand': true,
    'right-shopper': true,
    'right-global': true,
    'right-vip-stars': true,
    'right-cinema-wardrobe': true,
    'right-retail-stock': true
  });

  // Track the actual percentage completion of each feature module
  const [featureProgress, setFeatureProgress] = useState<Record<string, number>>({
    'right-designer': 100,
    'right-photoshoot': 100,
    'right-vip-stars': 100,
    'right-cinema-wardrobe': 100,
    'right-retail-stock': 100,
    'right-moodboard': 100,
    'right-influencer': 100,
    'right-brand': 100,
    'right-shopper': 100,
    'right-global': 100
  });

  const [compilingFeatureId, setCompilingFeatureId] = useState<string | null>(null);

  const handleAutoUnlock = (id: string, label: string) => {
    if (compilingFeatureId) return;
    setCompilingFeatureId(id);
    
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
      detail: `⚙️ Deploying ${label}: Compiling typescript bundles & mapping APIs...` 
    }));
    
    setTimeout(() => {
      setFeatureProgress(prev => ({ ...prev, [id]: 100 }));
      setCompilingFeatureId(null);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: `🚀 SUCCESS: ${label} is now 100% READY and unlocked in live preview!` 
      }));
    }, 2200);
  };
  
  const [showNotificationCount, setShowNotificationCount] = useState(5);
  const [cartCount, setCartCount] = useState(2);

  // Experimental Sandbox Simulator States
  const [activeSimModule, setActiveSimModule] = useState<{ id: string; label: string } | null>(null);
  const [simStep, setSimStep] = useState<'IDLE' | 'SIMULATING' | 'RESULT'>('IDLE');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  
  // 1. Designer State
  const [designerCategory, setDesignerCategory] = useState('Trench Coat');
  const [designerSliders, setDesignerSliders] = useState({ drape: 75, asymmetry: 60, luster: 25, density: 80 });
  const [designerFabric, setDesignerFabric] = useState('Organic Cotton 450gsm');
  const [designerColor, setDesignerColor] = useState('Midnight Charcoal');
  const [designerResult, setDesignerResult] = useState<any>(null);

  // 2. Photoshoot State
  const [selectedPhotoshootItems, setSelectedPhotoshootItems] = useState<string[]>([]);
  const [photoshootEnv, setPhotoshootEnv] = useState('Brutalist Concrete Atrium');
  const [photoshootStance, setPhotoshootStance] = useState('Dynamic Stride');
  const [photoshootLighting, setPhotoshootLighting] = useState('Neon Indigo Contrast Rim');
  const [photoshootResult, setPhotoshootResult] = useState<any>(null);

  // 3. Mood Board State
  const [moodTags, setMoodTags] = useState('Cyber-brutalist, Minimalist, Low-Saturation');
  const [moodColors, setMoodColors] = useState<string[]>(['#05050a', '#181135', '#f43f5e', '#a78bfa']);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const [moodBoardSaved, setMoodBoardSaved] = useState<any>(null);

  // 4. Influencer State
  const [influencerTitle, setInfluencerTitle] = useState('Silent Asymmetry Layering');
  const [influencerRegion, setInfluencerRegion] = useState('Kyoto Streetwear (Harajuku)');
  const [influencerPlatform, setInfluencerPlatform] = useState('Look Vision Collective Feed');
  const [influencerStats, setInfluencerStats] = useState({ views: 0, likes: 0, saves: 0, earning: 0 });
  const [influencerActive, setInfluencerActive] = useState(false);

  // 5. Collaborator State
  const [collarSpecs, setCollarSpecs] = useState({ seam: 5, lapel: 8.5, sleeve: 62, chest: 104 });
  const [collarSourcing, setCollarSourcing] = useState('Artisanal Kyoto Atelier');
  const [collarBids, setCollarBids] = useState<Array<{ name: string; price: number; detail: string; time: string }>>([]);

  // 6. Personal Shopper State
  const [shopperOccasion, setShopperOccasion] = useState('High-End Art Gallery Opening');
  const [shopperResult, setShopperResult] = useState<any>(null);

  // 7. Global Freight State
  const [freightOrigin, setFreightOrigin] = useState('Boutique Vault Rome (IT)');
  const [freightDestCity, setFreightDestCity] = useState('Tokyo');
  const [freightDestCountry, setFreightDestCountry] = useState('Japan');
  const [freightClass, setFreightClass] = useState('Zero-Emission Green Freight');
  const [freightResult, setFreightResult] = useState<any>(null);

  // 8. VIP & Celebrity Fitting Suite State
  const [vipActorName, setVipActorName] = useState('Timothée Chalamet');
  const [vipEventClass, setVipEventClass] = useState('Met Gala Red Carpet');
  const [vipBespokeStyle, setVipBespokeStyle] = useState('Avant-Garde Velvet Silhouette');
  const [vipFittingResult, setVipFittingResult] = useState<any>(null);

  // 9. Cinema Wardrobe Master State
  const [cinemaScriptText, setCinemaScriptText] = useState('A lone detective walks under the heavy, neon-lit neon rain, his coat collar pulled up against the cybernetic chill.');
  const [cinemaPeriodEra, setCinemaPeriodEra] = useState('Cyberpunk Neo-Noir');
  const [cinemaAtmosphere, setCinemaAtmosphere] = useState('Midnight Heavy Rain');
  const [cinemaWardrobeResult, setCinemaWardrobeResult] = useState<any>(null);

  // 10. New Stock B2B Drops State
  const [stockMerchantName, setStockMerchantName] = useState('Prada Milan');
  const [stockQuantity, setStockQuantity] = useState(25);
  const [stockItemType, setStockItemType] = useState('Luxury Cashmere Trench Coat');
  const [stockPrice, setStockPrice] = useState(480);
  const [stockDropResult, setStockDropResult] = useState<any>(null);
  
  // Connection line coordinates
  const [connections, setConnections] = useState<Connection[]>([
    // Core Modules (Purple)
    { id: 'c-ai-studio', fromId: 'left-ai-studio', toId: 'app-ai-studio', color: '#a78bfa' },
    { id: 'c-ai-stylist', fromId: 'left-ai-stylist', toId: 'app-ai-stylist', color: '#818cf8' },
    { id: 'c-wardrobe', fromId: 'left-wardrobe', toId: 'app-wardrobe', color: '#22d3ee' },
    { id: 'c-style-dna', fromId: 'left-style-dna', toId: 'app-settings', color: '#34d399' },
    { id: 'c-recommendations', fromId: 'left-recommendations', toId: 'app-hero', color: '#f59e0b' },
    { id: 'c-virtual-try', fromId: 'left-virtual-try', toId: 'app-virtual-try', color: '#ec4899' },
    { id: 'c-marketplace', fromId: 'left-marketplace', toId: 'app-marketplace', color: '#f43f5e' },
    { id: 'c-community', fromId: 'left-community', toId: 'app-community', color: '#fb7185' },
    { id: 'c-collections', fromId: 'left-collections', toId: 'app-collections', color: '#fbbf24' },
    { id: 'c-messages', fromId: 'left-messages', toId: 'app-messages', color: '#6366f1' },

    // Data Flow (Green)
    { id: 'd-user', fromId: 'flow-user', toId: 'app-hero', color: '#10b981' },
    { id: 'd-processing', fromId: 'flow-processing', toId: 'app-ai-creations', color: '#10b981' },
    { id: 'd-assets', fromId: 'flow-assets', toId: 'app-marketplace-grid', color: '#10b981' },
    { id: 'd-feedback', fromId: 'flow-feedback', toId: 'app-community-grid', color: '#10b981' },

    // External Services (Blue)
    { id: 'e-payment', fromId: 'right-payment', toId: 'app-marketplace-grid', color: '#3b82f6' },
    { id: 'e-shipping', fromId: 'right-shipping', toId: 'app-settings', color: '#06b6d4' },
    { id: 'e-email', fromId: 'right-email', toId: 'app-header-notifications', color: '#2563eb' },
    { id: 'e-storage', fromId: 'right-storage', toId: 'app-ai-creations', color: '#3b82f6' },
    { id: 'e-analytics', fromId: 'right-analytics', toId: 'app-trending', color: '#1d4ed8' },

    // Future Modules (Dashed Orange)
    { id: 'f-designer', fromId: 'right-designer', toId: 'app-ai-stylist', color: '#f59e0b', dashArray: '4 4' },
    { id: 'f-photoshoot', fromId: 'right-photoshoot', toId: 'app-virtual-try', color: '#f59e0b', dashArray: '4 4' },
    { id: 'f-moodboard', fromId: 'right-moodboard', toId: 'app-collections', color: '#f59e0b', dashArray: '4 4' },
    { id: 'f-influencer', fromId: 'right-influencer', toId: 'app-community-grid', color: '#f59e0b', dashArray: '4 4' },
    { id: 'f-brand', fromId: 'right-brand', toId: 'app-marketplace-grid', color: '#f59e0b', dashArray: '4 4' },
    { id: 'f-shopper', fromId: 'right-shopper', toId: 'app-hero', color: '#f59e0b', dashArray: '4 4' },
    { id: 'f-global', fromId: 'right-global', toId: 'app-marketplace', color: '#f59e0b', dashArray: '4 4' },
    { id: 'f-vip-stars', fromId: 'right-vip-stars', toId: 'app-virtual-try', color: '#ff3399', dashArray: '4 4' },
    { id: 'f-cinema-wardrobe', fromId: 'right-cinema-wardrobe', toId: 'app-collections', color: '#818cf8', dashArray: '4 4' },
    { id: 'f-retail-stock', fromId: 'right-retail-stock', toId: 'app-marketplace', color: '#10b981', dashArray: '4 4' }
  ]);

  const [coords, setCoords] = useState<Record<string, { x1: number; y1: number; x2: number; y2: number }>>({});
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "Look Vision System stands ready. Map synchronizer online."
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Measure element coordinates dynamically
  const updateCoordinates = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newCoords: Record<string, { x1: number; y1: number; x2: number; y2: number }> = {};

    connections.forEach((conn) => {
      const fromElem = document.getElementById(conn.fromId);
      const toElem = document.getElementById(conn.toId);

      if (fromElem && toElem) {
        const fromRect = fromElem.getBoundingClientRect();
        const toRect = toElem.getBoundingClientRect();

        // Calculate center points relative to container
        const x1 = fromRect.left - containerRect.left + (fromRect.width / 2);
        const y1 = fromRect.top - containerRect.top + (fromRect.height / 2);
        const x2 = toRect.left - containerRect.left + (toRect.width / 2);
        const y2 = toRect.top - containerRect.top + (toRect.height / 2);

        newCoords[conn.id] = { x1, y1, x2, y2 };
      }
    });

    setCoords(newCoords);
  };

  useEffect(() => {
    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);
    // Extra triggers to capture deferred rendering of components
    const timer1 = setTimeout(updateCoordinates, 300);
    const timer2 = setTimeout(updateCoordinates, 800);
    return () => {
      window.removeEventListener('resize', updateCoordinates);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [connections, activeTab]);

  const triggerDataPulse = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationLogs(prev => ["Initializing full ecosystem handshake...", ...prev]);

    const steps = [
      { delay: 600, log: "📥 [Style Passport] Read core profile DNA (casual-chic bias, high-contrast palette preference)" },
      { delay: 1200, log: "🧠 [Vibe Matrix] Dispatching request to server-side Gemini-2.5-Flash cognitive engine" },
      { delay: 1800, log: "📦 [Cloud Storage] Retrieved silhouette template vectors" },
      { delay: 2400, log: "✨ [AI Generation] Successfully synthesized outfit layout draft (confidence rating 98.4%)" },
      { delay: 3000, log: "🛒 [Marketplace API] Handshake complete: catalog matches found at ZARA & Nike boutiques" },
      { delay: 3600, log: "🟢 [Telemetry Completed] System integrity perfect. Workspace coordinates fully synced." }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setSimulationLogs(prev => [step.log, ...prev]);
        if (step.log.includes("Completed")) {
          setIsSimulating(false);
        }
      }, step.delay);
    });
  };

  const joinWaitlist = (moduleId: string, label: string) => {
    setIsWaitlisted(prev => ({ ...prev, [moduleId]: true }));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
      detail: `Pre-registered: You are on the priority list for ${label}!` 
    }));
  };

  const handleLaunchSimulator = (id: string, label: string) => {
    setActiveSimModule({ id, label });
    setSimStep('IDLE');
    setSimLogs([]);
    
    // Auto-select initial closet items from UnifiedFashionOS state if available
    const osState = UnifiedFashionOS.getState();
    const closet = osState.unifiedStyleMemory?.wardrobe_items || [];
    if (closet.length > 0) {
      setSelectedPhotoshootItems(closet.slice(0, 2).map(c => c.id));
      setPinnedItems(closet.slice(0, 1).map(c => c.id));
    }
  };

  const handleRunSimulation = () => {
    if (!activeSimModule) return;
    setSimStep('SIMULATING');
    setSimLogs([]);

    const moduleLogs: Record<string, string[]> = {
      'right-designer': [
        '⚙️ Initializing Sartorial Drafting Canvas...',
        '📏 Standardizing measurements to metric coordinate arrays...',
        '🧬 Running cloth-simulation collision algorithm (4,500 vertices)...',
        '⚡ Applying fabric weight constraints and tension fields...',
        '🎨 Rendering colorway shaders and luster index textures...',
        '✓ Tech Pack successfully compiled!'
      ],
      'right-photoshoot': [
        '📷 Camera rig initialized. Calibrating lens profile (Sony 85mm GM)...',
        '🪐 Reconstructing environment geometry vectors...',
        '💡 Computing 3-point light ray-casting (neon indigo accents)...',
        '🚶 Placing model mesh in dynamic stride posture...',
        '🧥 Layering selected closet garments onto the virtual mannequin...',
        '✓ High-fidelity campaign layout successfully composited!'
      ],
      'right-moodboard': [
        '🎨 Initializing creative blank-board matrix...',
        '📌 Pinning selected wardrobe items to grid anchor points...',
        '🌈 Analyzing core colorways and extracting palette swatches...',
        '🏷️ Processing typography and custom aesthetic tags...',
        '⚡ Balancing layout whitespace & margins...',
        '✓ Mood Board compiled!'
      ],
      'right-influencer': [
        '🌐 Authenticating Look Vision collective broadcast stream...',
        '📡 Injecting metadata tags into decentralized content nodes...',
        '📊 Priming engagement simulator models (Kyoto/Milan/New York)...',
        '🚀 Publishing coordinate layout to active subscriber queues...',
        '✓ Simulation online. Listening for engagement feedback loop...'
      ],
      'right-brand': [
        '🤝 Handshaking with B2B Collaborator Network...',
        '📜 Transmitting bespoke garment technical specs to ateliers...',
        '⚖️ Analyzing atelier workloads and sourcing capacity parameters...',
        '📥 Receiving incoming secure bids from tailoring hubs...',
        '✓ Bidding queue completed!'
      ],
      'right-shopper': [
        '🧭 Aligning occasion requirements with Style DNA parameters...',
        '👕 Fetching full wardrobe state database from storage...',
        '🧩 Comparing item attributes (color, formality, fabric) against occasion gravity...',
        '🧠 Scoring wardrobe coherence indices in real-time...',
        '💡 Formulating custom layering & accessory suggestions...',
        '✓ Recommendation portfolio ready!'
      ],
      'right-global': [
        '📦 Retrieving luxury packaging dimensions...',
        '🚛 Querying international freight routing corridors...',
        '🛡️ Calculating customs duties, import tariffs, and local offsets...',
        '🌱 Computing eco-emissions equivalents...',
        '✓ Routing ledger generated!'
      ]
    };

    const targetLogs = moduleLogs[activeSimModule.id] || ['Processing simulation parameters...'];
    
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < targetLogs.length) {
        setSimLogs(prev => [...prev, targetLogs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        
        // Generate mock results
        const osState = UnifiedFashionOS.getState();
        const closet = osState.unifiedStyleMemory?.wardrobe_items || [];
        
        if (activeSimModule.id === 'right-designer') {
          setDesignerResult({
            id: `techpack-${Date.now()}`,
            name: `${designerColor} ${designerCategory}`,
            token: `NFT-SART-VAL-${Math.floor(Math.random() * 900000 + 100000)}`,
            weight: designerSliders.density > 60 ? 'Heavyweight 480gsm' : 'Midweight 280gsm',
            specs: {
              'Drape Slouch': `${designerSliders.drape}%`,
              'Asymmetric Offsets': `${designerSliders.asymmetry}%`,
              'Luster/Glow': `${designerSliders.luster}%`,
              'Fabric Density': `${designerSliders.density}%`
            },
            instructions: [
              `Cut asymmetric bias pattern at a ${Math.floor(designerSliders.asymmetry / 2)}° slope`,
              `Apply reinforced flatlock stitch across tension shoulders`,
              `Treat face with fluorocarbon-free hydrophobic finish (Luster level: ${designerSliders.luster}%)`
            ]
          });
        } else if (activeSimModule.id === 'right-photoshoot') {
          const selectedTitles = closet
            .filter(c => selectedPhotoshootItems.includes(c.id))
            .map(c => c.title);
          setPhotoshootResult({
            camera: 'Sony α7R V, 85mm f/1.2 GM Prime',
            settings: '1/250s at f/1.4, ISO 160',
            grading: 'Low-Saturation High-Contrast Indigo Cinematic LUT',
            summary: `A high-contrast wide-angle composition showcasing the model in a ${photoshootStance} stance within a ${photoshootEnv}. Under ${photoshootLighting} lighting, the draped contours of ${selectedTitles.join(' & ') || 'Custom Garment'} cast long structural shadows on the rough background surfaces.`
          });
        } else if (activeSimModule.id === 'right-moodboard') {
          const selectedItemsObj = closet.filter(c => pinnedItems.includes(c.id));
          setMoodBoardSaved({
            title: `Aesthetic Synthesis Board`,
            tags: moodTags.split(',').map(t => t.trim()),
            colors: moodColors,
            items: selectedItemsObj
          });
        } else if (activeSimModule.id === 'right-influencer') {
          setInfluencerActive(true);
          setInfluencerStats({ views: 0, likes: 0, saves: 0, earning: 0 });
        } else if (activeSimModule.id === 'right-brand') {
          const bidders = [
            { name: 'Atelier Brera (Milan)', price: 340, detail: 'Using premium double-faced silk threading and seamless shoulders.', time: '2 mins ago' },
            { name: 'Kyoto Artisanal Collective', price: 420, detail: 'Hand-dyed indigo accents, blind hem stitching, and custom inside embroidery.', time: '1 min ago' },
            { name: 'London Savile Row (Beta Partners)', price: 495, detail: 'Interlined structured canvas with horsehair drape support.', time: 'Just now' }
          ];
          setCollarBids(bidders);
        } else if (activeSimModule.id === 'right-shopper') {
          // Construct recommendations based on wardrobe
          const matchingItems = closet.slice(0, 3);
          const score = Math.floor(Math.random() * 15 + 85); // 85 - 100%
          setShopperResult({
            score,
            verdict: score > 92 ? 'Perfect Harmony' : 'Highly Coherent',
            items: matchingItems,
            advice: `Your closet items matches the ${shopperOccasion} occasion weight perfectly. We recommend layering your ${matchingItems[0]?.title || 'overcoat'} as an asymmetric outer frame with high-contrast inner accessories.`
          });
        } else if (activeSimModule.id === 'right-global') {
          const distance = Math.floor(Math.random() * 4000 + 1000);
          const time = freightClass.includes('Express') ? '36 - 48 Hours' : '3 - 5 Days';
          const fee = freightClass.includes('Express') ? 45.00 : 15.00;
          setFreightResult({
            distance: `${distance} km`,
            time,
            fee: `$${fee.toFixed(2)} USD`,
            carbon: freightClass.includes('Green') ? '0.00 kg CO₂ (Carbon offsetted)' : `${(distance * 0.12).toFixed(2)} kg CO₂`
          });
        } else if (activeSimModule.id === 'right-vip-stars') {
          const fitScore = Math.floor(Math.random() * 8 + 92);
          setVipFittingResult({
            vip: vipActorName,
            event: vipEventClass,
            silhouette: vipBespokeStyle,
            fitScore: `${fitScore}%`,
            measurements: {
              chest: '98 cm',
              shoulder: '44 cm',
              inseam: '82 cm',
              collar: '39 cm'
            },
            recommendation: `Bespoke drapes formulated for ${vipActorName}'s visual frame during the ${vipEventClass}. Combining a deep ${vipBespokeStyle} layer with an ultra-matte interior ensures maximum spotlight flash absorption and zero crease persistence.`
          });
        } else if (activeSimModule.id === 'right-cinema-wardrobe') {
          setCinemaWardrobeResult({
            era: cinemaPeriodEra,
            vibe: cinemaAtmosphere,
            scriptSegment: cinemaScriptText,
            extractedOutfits: [
              { character: 'Protagonist', garment: 'Asymmetric Oiled Heavy Canvas Trench', color: 'Oil-Slick Slate' },
              { character: 'Supporting Cast', garment: 'Matte Technical Utility Under-Vest', color: 'Sub-Zero Ash' }
            ],
            lightingGuide: 'Low-key high-contrast side keylights with cold backlighting profiles.'
          });
        } else if (activeSimModule.id === 'right-retail-stock') {
          setStockDropResult({
            merchant: stockMerchantName,
            item: stockItemType,
            qty: stockQuantity,
            price: `$${stockPrice} USD`,
            sku: `B2B-DRP-${Math.floor(Math.random() * 90000 + 10000)}`,
            postedLive: false
          });
        }

        setSimStep('RESULT');
      }
    }, 450);
  };

  useEffect(() => {
    let timer: any;
    if (influencerActive && simStep === 'RESULT') {
      timer = setInterval(() => {
        setInfluencerStats(prev => {
          const nextViews = prev.views + Math.floor(Math.random() * 45 + 15);
          const nextLikes = prev.likes + Math.floor(Math.random() * 15 + 5);
          const nextSaves = prev.saves + Math.floor(Math.random() * 8 + 2);
          const nextEarning = prev.earning + (Math.random() > 0.8 ? Math.random() * 14 + 3 : 0);
          
          if (nextViews >= 4500) {
            clearInterval(timer);
            setInfluencerActive(false);
          }
          
          return {
            views: nextViews,
            likes: nextLikes,
            saves: nextSaves,
            earning: parseFloat(nextEarning.toFixed(2))
          };
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [influencerActive, simStep]);

  const handleInteractiveClick = (tabId: string, label: string) => {
    if (onNavigateToTab) {
      onNavigateToTab(tabId);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: `Directing workspace pipeline to real ${label} view.` 
      }));
    }
  };

  const totalFeatureCount = Object.keys(featureProgress).length;
  const totalProgressSum = Object.values(featureProgress).reduce((a, b) => a + b, 0);
  const overallPercentage = Math.round(totalProgressSum / totalFeatureCount);

  return (
    <div 
      ref={containerRef}
      className="w-full text-white min-h-screen select-none font-sans bg-[#020204] p-4 lg:p-6 space-y-8 border border-white/5 rounded-3xl relative overflow-hidden shadow-2xl"
    >
      {/* Dynamic Background Flare and Interactive Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c16_1px,transparent_1px),linear-gradient(to_bottom,#0c0c16_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-violet-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* SVG Canvas for Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible hidden xl:block">
        <defs>
          <linearGradient id="purple-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="green-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="blue-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="orange-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
          </linearGradient>

          {/* Glowing dot marker */}
          <marker id="marker-dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
            <circle cx="3" cy="3" r="3" fill="#ffffff" />
          </marker>
        </defs>

        {connections.map((conn) => {
          const coord = coords[conn.id];
          if (!coord) return null;

          const isHovered = activeHoverNode === conn.fromId || activeHoverNode === conn.toId;
          const isCoreSelected = activeHoverNode !== null && !isHovered;

          // Compute smooth curve coordinates
          const dx = Math.abs(coord.x2 - coord.x1) * 0.45;
          const path = `M ${coord.x1} ${coord.y1} C ${coord.x1 + dx} ${coord.y1}, ${coord.x2 - dx} ${coord.y2}, ${coord.x2} ${coord.y2}`;

          return (
            <g key={conn.id}>
              {/* Highlight background path */}
              <path
                d={path}
                fill="none"
                stroke={conn.color}
                strokeWidth={isHovered ? 4 : 1.5}
                strokeDasharray={conn.dashArray}
                opacity={isHovered ? 0.95 : isCoreSelected ? 0.08 : 0.4}
                className="transition-all duration-300 ease-out"
              />
              {/* Animated pulse dot travelling along the line */}
              {(isHovered || !activeHoverNode) && (
                <path
                  d={path}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={2}
                  opacity={isHovered ? 1 : 0.15}
                  strokeDasharray="4 20"
                  className="animate-pulse"
                  style={{
                    strokeDashoffset: isSimulating ? 100 : 0,
                    transition: 'stroke-dashoffset 2s linear infinite'
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* TOP HEADER BLOCK EXACTLY LIKE BLUEPRINT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 relative z-30 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
            <h1 className="text-xl lg:text-2xl font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-violet-300">
              LOOK VISION – CONNECTED AREAS & FUTURE FEATURES MAP
            </h1>
          </div>
          <p className="text-xs text-white/50 tracking-wide font-mono uppercase">
            Complete Explanation of All Connected Areas and Future Modules
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {onToggleFocusMode && (
            <button
              onClick={onToggleFocusMode}
              className="flex items-center gap-1.5 bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/25 hover:border-violet-500/50 text-violet-300 text-xs font-mono uppercase px-4 py-2 rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(139,92,246,0.1)] font-semibold"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>🖥️ Focus Mode (App Only)</span>
            </button>
          )}
          <div className="flex flex-wrap items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-xs font-mono">
            <span className="text-white/40 uppercase">System Progress:</span>
            <span className="text-violet-400 font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-violet-400" /> {overallPercentage}% Complete
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-xs font-mono">
            <span className="text-white/40 uppercase">Ecosystem Health:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Ready & Bound
            </span>
          </div>
        </div>
      </div>

      {/* THREE MAIN COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-30">
        
        {/* LEFT COLUMN: EXISTING CORE MODULES & DATA FLOW */}
        <div className="xl:col-span-3 space-y-6 flex flex-col justify-between">
          
          {/* CORE MODULES */}
          <div className="bg-[#07070e]/80 border border-violet-500/10 rounded-2xl p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h2 className="text-[11px] font-bold font-mono tracking-[0.2em] text-violet-400 uppercase">
                EXISTING CORE MODULES (Connected)
              </h2>
              <span className="text-[8px] font-mono bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded uppercase">
                Ready
              </span>
            </div>

            <div className="space-y-2">
              {[
                { id: 'left-ai-studio', tab: 'AI_STUDIO', label: 'AI Studio', desc: 'Generates looks using server AI.', icon: Sparkles, stroke: 'group-hover:border-violet-500/30' },
                { id: 'left-ai-stylist', tab: 'HOME', label: 'AI Stylist', desc: 'Personal styling conversational assistant.', icon: MessageSquare, stroke: 'group-hover:border-indigo-500/30' },
                { id: 'left-wardrobe', tab: 'WARDROBE', label: 'Wardrobe', desc: 'Manages physical and digital garment records.', icon: Layers, stroke: 'group-hover:border-cyan-500/30' },
                { id: 'left-style-dna', tab: 'PROFILE', label: 'Style DNA', desc: 'Maintains personalized styling coordinates.', icon: User, stroke: 'group-hover:border-emerald-500/30' },
                { id: 'left-recommendations', tab: 'HOME', label: 'Recommendations', desc: 'AI recommends custom seasonal lookbooks.', icon: Compass, stroke: 'group-hover:border-amber-500/30' },
                { id: 'left-virtual-try', tab: 'VIRTUAL_TRY', label: 'Virtual Try-On', desc: 'Model simulator to try outfits instantly.', icon: Shirt, stroke: 'group-hover:border-pink-500/30' },
                { id: 'left-marketplace', tab: 'MARKETPLACE', label: 'Marketplace', desc: 'Direct cart purchases from partner boutiques.', icon: ShoppingBag, stroke: 'group-hover:border-rose-500/30' },
                { id: 'left-community', tab: 'COMMUNITY', label: 'Community', desc: 'Interact, remix, and share look layouts.', icon: Users, stroke: 'group-hover:border-rose-400/30' },
                { id: 'left-collections', tab: 'COLLECTIONS', label: 'Collections', desc: 'Capsule folders and visual mood grids.', icon: Store, stroke: 'group-hover:border-amber-400/30' },
                { id: 'left-messages', tab: 'MESSAGES', label: 'Messages', desc: 'Curator consultation threads & inbox.', icon: Mail, stroke: 'group-hover:border-indigo-400/30' }
              ].map((mod) => {
                const IconComp = mod.icon;
                const isHovered = activeHoverNode === mod.id;
                return (
                  <div
                    key={mod.id}
                    id={mod.id}
                    onMouseEnter={() => setActiveHoverNode(mod.id)}
                    onMouseLeave={() => {
                      setActiveHoverNode(null);
                      updateCoordinates();
                    }}
                    onClick={() => handleInteractiveClick(mod.tab, mod.label)}
                    className={`group relative flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-250 cursor-pointer text-left select-none ${
                      isHovered 
                        ? 'bg-white/5 border-white/20 translate-x-1 shadow-lg' 
                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-white/5 text-white/70 group-hover:text-white transition-colors">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-sans text-white group-hover:text-indigo-300 transition-colors">
                          {mod.label}
                        </span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/40" />
                      </div>
                      <p className="text-[10px] text-white/40 leading-normal font-sans group-hover:text-white/60">
                        {mod.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DATA & INTELLIGENCE FLOW */}
          <div className="bg-[#07070e]/80 border border-emerald-500/10 rounded-2xl p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h2 className="text-[11px] font-bold font-mono tracking-[0.2em] text-emerald-400 uppercase">
                DATA & INTELLIGENCE FLOW
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              {[
                { id: 'flow-user', label: 'User Data', desc: 'DNA, sizes, history context.', border: 'border-indigo-500/20' },
                { id: 'flow-processing', label: 'AI Processing', desc: 'Gravity weight & visual prompt tuning.', border: 'border-violet-500/20' },
                { id: 'flow-assets', label: 'Content & Assets', desc: 'Apparel inventory vector rendering.', border: 'border-cyan-500/20' },
                { id: 'flow-feedback', label: 'Actions Feedback', desc: 'Community likes & designer saves.', border: 'border-rose-500/20' }
              ].map((flow) => (
                <div
                  key={flow.id}
                  id={flow.id}
                  onMouseEnter={() => setActiveHoverNode(flow.id)}
                  onMouseLeave={() => setActiveHoverNode(null)}
                  className={`bg-white/[0.01] border ${flow.border} rounded-xl p-2.5 space-y-1 transition-all ${
                    isSimulating ? 'scale-[1.03] bg-white/[0.03]' : ''
                  }`}
                >
                  <span className="text-[10px] font-bold font-mono uppercase text-white/95">{flow.label}</span>
                  <p className="text-[8px] text-white/40 leading-normal">{flow.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={triggerDataPulse}
              disabled={isSimulating}
              className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 text-[10px] font-mono uppercase tracking-[0.15em] py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? "Transmitting..." : "Trigger Telemetry Pulse"}
            </button>
          </div>

        </div>

        {/* CENTER COLUMN: FULL SCREEN EXACT PREVIEW OF COCKPIT APPLICATION */}
        <div className="xl:col-span-6 space-y-6">
          {children ? (
            <div className="space-y-6">
              {/* THE DIGITAL TWIN COCKPIT PANEL WITH REAL APPLICATION */}
              <div className="bg-[#04050a] border border-white/10 rounded-2xl p-3 shadow-[0_0_50px_rgba(99,102,241,0.05)] overflow-hidden">
                <div className="bg-[#090a12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative min-h-[720px]">
                  {children}
                </div>
              </div>

              {/* REAL-TIME SIMULATOR CONSOLE DISPLAY */}
              <div className="bg-black/90 border border-white/10 rounded-2xl p-4 font-mono text-left flex flex-col justify-between h-44 overflow-hidden relative z-30">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-[9px] text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-violet-400" />
                    <span>Sartorial Stream Console</span>
                  </div>
                  <button 
                    onClick={() => setSimulationLogs(["Console cleared. Standby."])}
                    className="hover:text-white transition-colors text-[8px]"
                  >
                    Clear Logs
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto text-[10px] space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                  <AnimatePresence>
                    {simulationLogs.map((log, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={index} 
                        className={`font-mono leading-normal ${
                          log.includes("📥") ? 'text-indigo-300' :
                          log.includes("🧠") ? 'text-violet-300' :
                          log.includes("🎨") ? 'text-cyan-300' :
                          log.includes("✨") ? 'text-rose-300' :
                          log.includes("🟢") ? 'text-emerald-400 font-bold' : 'text-white/50'
                        }`}
                      >
                        {log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* THE DIGITAL TWIN COCKPIT PANEL WITH INNER MAIN APPLICATION */}
              <div className="bg-[#04050a] border border-white/10 rounded-2xl p-4 shadow-[0_0_50px_rgba(99,102,241,0.05)] space-y-4">
            
            {/* INNER APPLICATION WINDOW MOCKUP */}
            <div className="bg-[#090a12] border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-[700px] shadow-2xl relative">
              
              {/* Inner App Header */}
              <div className="bg-[#06070c] border-b border-white/5 px-4 py-3.5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold font-sans tracking-wide text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block" />
                    AIStyleHub
                  </span>
                  
                  {/* Search bar inside */}
                  <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 w-64 text-left text-[11px] text-white/40 font-sans">
                    <Search className="w-3.5 h-3.5" />
                    <span className="flex-1">Search styles, users, collections...</span>
                    <span className="text-[9px] font-mono bg-white/10 px-1 rounded text-white/60">⌘ K</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-1.5 hover:bg-white/5 rounded text-white/60 hover:text-white transition-colors">
                    {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </button>
                  
                  <div id="app-header-notifications" className="p-1.5 hover:bg-white/5 rounded text-white/60 hover:text-white transition-colors relative">
                    <Bell className="w-4 h-4" />
                    {showNotificationCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-[8px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center text-white">
                        {showNotificationCount}
                      </span>
                    )}
                  </div>

                  <div className="p-1.5 hover:bg-white/5 rounded text-white/60 hover:text-white transition-colors relative">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-[8px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center text-white">
                      {cartCount}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleInteractiveClick('AI_STUDIO', 'AI Studio')}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-[11px] font-sans font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-indigo-600/10"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Create with AI</span>
                  </button>

                  {/* Profile Dropdown avatar mock */}
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10 select-none">
                    <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center font-bold text-[9px] text-white">
                      SK
                    </div>
                    <ChevronDown className="w-3 h-3 text-white/50" />
                  </div>
                </div>
              </div>

              {/* Inner App Content Layout */}
              <div className="flex flex-1 relative min-h-[600px]">
                
                {/* App Left Sidebar Navigation */}
                <div className="w-44 bg-[#05060a] border-r border-white/5 p-3 flex flex-col justify-between text-left select-none">
                  <div className="space-y-1.5">
                    {[
                      { id: 'app-home', tab: 'HOME', label: 'Home', icon: Compass, active: activeTab === 'HOME' },
                      { id: 'app-ai-studio', tab: 'AI_STUDIO', label: 'AI Studio', icon: Sparkles, badge: 'NEW', active: activeTab === 'AI_STUDIO' },
                      { id: 'app-marketplace', tab: 'MARKETPLACE', label: 'Marketplace', icon: ShoppingBag, active: activeTab === 'MARKETPLACE' },
                      { id: 'app-community', tab: 'COMMUNITY', label: 'Community', icon: Users, active: activeTab === 'COMMUNITY' },
                      { id: 'app-explore', tab: 'HOME', label: 'Explore', icon: Compass, active: false },
                      { id: 'app-collections', tab: 'COLLECTIONS', label: 'Collections', icon: Store, active: activeTab === 'COLLECTIONS' },
                      { id: 'app-wardrobe', tab: 'WARDROBE', label: 'Wardrobe', icon: Layers, active: activeTab === 'WARDROBE' },
                      { id: 'app-virtual-try', tab: 'VIRTUAL_TRY', label: 'Virtual Try-On', icon: Shirt, active: activeTab === 'VIRTUAL_TRY' },
                      { id: 'app-messages', tab: 'MESSAGES', label: 'Messages', icon: Mail, badge: '3', active: activeTab === 'MESSAGES' },
                      { id: 'app-notifications', tab: 'HOME', label: 'Notifications', icon: Bell, active: false },
                      { id: 'app-analytics', tab: 'PROFILE', label: 'Analytics', icon: Activity, active: false },
                      { id: 'app-settings', tab: 'SYSTEM_ROOM', label: 'Settings', icon: Settings, active: activeTab === 'SYSTEM_ROOM' }
                    ].map((item) => {
                      const NavIcon = item.icon;
                      return (
                        <div
                          key={item.id}
                          id={item.id}
                          onClick={() => {
                            setActiveTab(item.tab as any);
                            window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
                              detail: `Flipped cockpit view to simulated: ${item.label}` 
                            }));
                          }}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                            item.active 
                              ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/20' 
                              : 'text-white/50 hover:text-white/80 hover:bg-white/[0.02]'
                          }`}
                        >
                          <NavIcon className="w-3.5 h-3.5" />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[7px] font-mono font-bold px-1 py-0.2 rounded uppercase scale-90">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Sidebar Bottom Upgrade/User Promo */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/20 rounded-xl p-2.5 space-y-1.5 text-center">
                      <p className="text-[9px] font-mono tracking-wider text-indigo-300 uppercase font-bold">Upgrade to Pro</p>
                      <p className="text-[8px] text-white/50 leading-tight">Unlock unlimited generations & styling weight models.</p>
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Core Stripe subscription drawer initialized.' }))}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[8.5px] font-sans font-bold py-1 rounded cursor-pointer transition-all"
                      >
                        Upgrade Now
                      </button>
                    </div>

                    <div className="flex items-center gap-2 border-t border-white/5 pt-2.5 select-none">
                      <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[8px]">SK</div>
                      <div className="flex-1 text-left">
                        <p className="text-[10px] font-semibold text-white/90">Sarah Khan</p>
                        <p className="text-[8px] font-mono text-emerald-400">Premium member</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Dashboard Inner Core Panel (Home tab mockup matching picture) */}
                <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-[#07080e] scrollbar-thin scrollbar-thumb-white/10 text-left">
                  
                  {/* Hero Container */}
                  <div id="app-hero" className="bg-[#0b0c15] border border-indigo-500/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden gap-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="space-y-3 max-w-sm">
                      <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
                        Create. Inspire.<br />Express with <span className="text-indigo-400">AI.</span>
                      </h2>
                      <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                        Generate stunning seasonal fashion looks, in seconds using our deep-learning drape physics engine.
                      </p>
                      
                      {/* Search box prompt mock */}
                      <div className="flex gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1 w-full max-w-xs">
                        <input 
                          type="text" 
                          placeholder="What do you want to wear today?" 
                          disabled
                          className="bg-transparent text-[10px] text-white/60 flex-1 px-1.5 outline-none pointer-events-none"
                        />
                        <button 
                          onClick={triggerDataPulse}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-semibold px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                        >
                          Generate
                        </button>
                      </div>

                      {/* Fashion lovers count */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <div className="flex -space-x-1.5">
                          <div className="w-4 h-4 rounded-full bg-violet-600 text-[6px] font-bold text-white flex items-center justify-center">A</div>
                          <div className="w-4 h-4 rounded-full bg-cyan-600 text-[6px] font-bold text-white flex items-center justify-center">H</div>
                          <div className="w-4 h-4 rounded-full bg-pink-600 text-[6px] font-bold text-white flex items-center justify-center">N</div>
                        </div>
                        <span className="text-[8px] font-mono text-white/40">50,000+ fashion lovers creating</span>
                      </div>
                    </div>

                    {/* Stylist generated carousel cards (Mock 3 models) */}
                    <div className="flex gap-2 w-full md:w-auto overflow-hidden">
                      {[
                        { id: 1, tag: 'Y2K Retro', col: 'from-pink-600/20 to-rose-900/20 border-pink-500/20' },
                        { id: 2, tag: 'AI Generated', col: 'from-[#0d0e1b] to-violet-950 border-indigo-500/30' },
                        { id: 3, tag: 'Korean Vibe', col: 'from-emerald-600/20 to-teal-900/20 border-emerald-500/20' }
                      ].map((card) => (
                        <div 
                          key={card.id} 
                          className={`w-24 h-36 rounded-xl border bg-gradient-to-b ${card.col} p-2 flex flex-col justify-between relative overflow-hidden flex-shrink-0`}
                        >
                          <span className="text-[7px] font-mono uppercase bg-black/50 px-1 py-0.5 rounded border border-white/5 inline-block text-white/70 self-start">
                            {card.tag}
                          </span>
                          <div className="h-16 w-full bg-white/5 rounded-lg border border-white/5 flex items-center justify-center">
                            <span className="text-[18px]">🕴️</span>
                          </div>
                          <div className="text-left">
                            <p className="text-[8px] font-bold text-white leading-none">Custom Fit</p>
                            <p className="text-[6px] font-mono text-white/40">Model #{card.id}82</p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Tabbed column layouts matching blueprint */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    
                    {/* COLUMN 1: AI CREATIONS */}
                    <div id="app-ai-creations" className="bg-[#0a0b14] border border-white/5 rounded-xl p-3 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                        <span className="text-[9px] font-mono tracking-widest text-violet-400 font-bold uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-violet-400 animate-pulse" /> AI Creations
                        </span>
                        <div className="flex gap-1 text-[7px] font-mono text-white/30">
                          <span className="text-white/80 border-b border-indigo-500 font-semibold">For You</span>
                          <span>Trending</span>
                          <span>New</span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="bg-[#05060a] border border-white/5 rounded-lg p-2 space-y-2 hover:border-violet-500/20 transition-all">
                          <div className="h-20 bg-gradient-to-br from-violet-950/40 to-[#0c0d19] rounded border border-white/5 flex items-center justify-center">
                            <span className="text-xl">🧥</span>
                          </div>
                          <div className="text-left space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-white leading-none">Minimal Beige</span>
                              <span className="text-[6px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20 px-1 rounded uppercase">AI Generated</span>
                            </div>
                            <p className="text-[8px] text-white/40 leading-normal">Prompt: Minimal beige jacket outfit, clean tailored fit.</p>
                          </div>
                        </div>

                        <div className="bg-[#05060a] border border-white/5 rounded-lg p-2 space-y-2 hover:border-violet-500/20 transition-all">
                          <div className="h-20 bg-gradient-to-br from-pink-950/40 to-[#0c0d19] rounded border border-white/5 flex items-center justify-center">
                            <span className="text-xl">👚</span>
                          </div>
                          <div className="text-left space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-white leading-none">Y2K Pink Vibes</span>
                              <span className="text-[6px] font-mono bg-pink-500/10 text-pink-300 border border-pink-500/20 px-1 rounded uppercase">AI Generated</span>
                            </div>
                            <p className="text-[8px] text-white/40 leading-normal">Prompt: Y2K pink streetwear with custom crop hood.</p>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleInteractiveClick('AI_STUDIO', 'AI Studio')}
                        className="w-full bg-white/5 hover:bg-white/10 text-white text-[8px] font-mono uppercase tracking-wider py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        View more AI looks →
                      </button>
                    </div>

                    {/* COLUMN 2: COMMUNITY */}
                    <div id="app-community-grid" className="bg-[#0a0b14] border border-white/5 rounded-xl p-3 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                        <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold uppercase flex items-center gap-1">
                          <Users className="w-2.5 h-2.5 text-emerald-400" /> Community
                        </span>
                        <div className="flex gap-1 text-[7px] font-mono text-white/30">
                          <span className="text-white/80 border-b border-emerald-500 font-semibold">Following</span>
                          <span>Popular</span>
                          <span>New</span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="bg-[#05060a] border border-white/5 rounded-lg p-2 space-y-2 hover:border-emerald-500/20 transition-all">
                          <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                            <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-[7px] font-bold">AM</div>
                            <div>
                              <p className="text-[9px] font-bold leading-none text-white">Ayesha Malik</p>
                              <p className="text-[6px] text-white/30 font-mono">2h ago</p>
                            </div>
                          </div>
                          <div className="h-16 bg-gradient-to-r from-slate-900 to-[#0c0d19] rounded border border-white/5 flex items-center justify-center">
                            <span className="text-xl">👖</span>
                          </div>
                          <p className="text-[8px] text-white/50 leading-tight">Remixed the Minimal Beige jacket with vintage baggy denim.</p>
                        </div>

                        <div className="bg-[#05060a] border border-white/5 rounded-lg p-2 space-y-2 hover:border-emerald-500/20 transition-all">
                          <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                            <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[7px] font-bold">HA</div>
                            <div>
                              <p className="text-[9px] font-bold leading-none text-white">Hamza Ali</p>
                              <p className="text-[6px] text-white/30 font-mono">4h ago</p>
                            </div>
                          </div>
                          <div className="h-16 bg-gradient-to-r from-slate-900 to-[#0c0d19] rounded border border-white/5 flex items-center justify-center">
                            <span className="text-xl">👟</span>
                          </div>
                          <p className="text-[8px] text-white/50 leading-tight">Cyberpunk techwear style draft. Needs a heavy shell jacket.</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleInteractiveClick('COMMUNITY', 'Community')}
                        className="w-full bg-white/5 hover:bg-white/10 text-white text-[8px] font-mono uppercase tracking-wider py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        Explore community →
                      </button>
                    </div>

                    {/* COLUMN 3: MARKETPLACE */}
                    <div id="app-marketplace-grid" className="bg-[#0a0b14] border border-white/5 rounded-xl p-3 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                        <span className="text-[9px] font-mono tracking-widest text-amber-400 font-bold uppercase flex items-center gap-1">
                          <ShoppingBag className="w-2.5 h-2.5 text-amber-400" /> Marketplace
                        </span>
                        <div className="flex gap-1 text-[7px] font-mono text-white/30">
                          <span className="text-white/80 border-b border-amber-500 font-semibold">For You</span>
                          <span>New In</span>
                          <span>Brands</span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="bg-[#05060a] border border-white/5 rounded-lg p-2 space-y-2 hover:border-amber-500/20 transition-all">
                          <div className="h-20 bg-gradient-to-br from-amber-950/20 to-[#0c0d19] rounded border border-white/5 flex items-center justify-center relative">
                            <span className="absolute top-1 left-1 bg-rose-600 text-white text-[7px] font-mono font-bold px-1 rounded uppercase">-20%</span>
                            <span className="text-xl">🧥</span>
                          </div>
                          <div className="text-left space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-white leading-none">ZARA Relaxed Blazer</span>
                              <span className="text-[8px] font-mono text-emerald-400 font-bold">$79.99</span>
                            </div>
                            <div className="flex justify-between items-center text-[7px] font-mono text-white/40">
                              <span>★ 4.8 (128 reviews)</span>
                              <button 
                                onClick={() => {
                                  setCartCount(prev => prev + 1);
                                  window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Added ZARA Relaxed Blazer to your shopping bag.' }));
                                }}
                                className="bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white px-1.5 py-0.5 rounded cursor-pointer transition-colors uppercase font-bold"
                              >
                                Add to bag
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#05060a] border border-white/5 rounded-lg p-2 space-y-2 hover:border-amber-500/20 transition-all">
                          <div className="h-20 bg-gradient-to-br from-slate-950/20 to-[#0c0d19] rounded border border-white/5 flex items-center justify-center">
                            <span className="text-xl">👟</span>
                          </div>
                          <div className="text-left space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-white leading-none">NIKE Air Force 1</span>
                              <span className="text-[8px] font-mono text-emerald-400 font-bold">$110.00</span>
                            </div>
                            <div className="flex justify-between items-center text-[7px] font-mono text-white/40">
                              <span>★ 4.7 (342 reviews)</span>
                              <button 
                                onClick={() => {
                                  setCartCount(prev => prev + 1);
                                  window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Added NIKE Air Force 1 to your shopping bag.' }));
                                }}
                                className="bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white px-1.5 py-0.5 rounded cursor-pointer transition-colors uppercase font-bold"
                              >
                                Add to bag
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleInteractiveClick('MARKETPLACE', 'Marketplace')}
                        className="w-full bg-white/5 hover:bg-white/10 text-white text-[8px] font-mono uppercase tracking-wider py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        Shop all products →
                      </button>
                    </div>

                  </div>

                </div>

                {/* Dashboard Inner Right Panel (Quick actions and leaderboards mockup) */}
                <div className="w-56 bg-[#05060a] border-l border-white/5 p-3 flex flex-col justify-between text-left space-y-4">
                  
                  {/* Quick Actions widget */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono tracking-widest text-white/40 block font-bold uppercase">Quick Actions</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button 
                        onClick={() => handleInteractiveClick('AI_STUDIO', 'AI Studio')}
                        className="bg-white/[0.02] hover:bg-white/5 border border-white/5 p-2 rounded-lg text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-[8px] font-mono font-bold uppercase text-white/80">AI Studio</span>
                      </button>
                      
                      <button 
                        onClick={() => handleInteractiveClick('VIRTUAL_TRY', 'Virtual Try-On')}
                        className="bg-white/[0.02] hover:bg-white/5 border border-white/5 p-2 rounded-lg text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1"
                      >
                        <Shirt className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[8px] font-mono font-bold uppercase text-white/80">Try-On</span>
                      </button>

                      <button 
                        onClick={() => {
                          const event = new CustomEvent('lookvision_chat_trigger', { detail: { open: true } });
                          window.dispatchEvent(event);
                          window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'AI Stylist chat module triggered.' }));
                        }}
                        className="bg-white/[0.02] hover:bg-white/5 border border-white/5 p-2 rounded-lg text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[8px] font-mono font-bold uppercase text-white/80">AI Stylist</span>
                      </button>

                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: 'Aesthetic color palette balancer loaded.' }))}
                        className="bg-white/[0.02] hover:bg-white/5 border border-white/5 p-2 rounded-lg text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[8px] font-mono font-bold uppercase text-white/80">Palette</span>
                      </button>
                    </div>
                  </div>

                  {/* Trending tags with counts */}
                  <div id="app-trending" className="space-y-2">
                    <span className="text-[9px] font-mono tracking-widest text-white/40 block font-bold uppercase">Trending Tags</span>
                    <div className="space-y-1">
                      {[
                        { tag: '# Streetwear', count: '12.5K' },
                        { tag: '# OldMoney', count: '9.8K' },
                        { tag: '# KoreanStyle', count: '8.3K' },
                        { tag: '# Minimal', count: '7.1K' },
                        { tag: '# Y2K', count: '6.3K' }
                      ].map((tagObj) => (
                        <div key={tagObj.tag} className="flex items-center justify-between text-[9px] font-mono bg-white/[0.01] hover:bg-white/5 px-2 py-1 rounded transition-colors">
                          <span className="text-white/80 font-medium">{tagObj.tag}</span>
                          <span className="text-white/40">{tagObj.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Contributors leaderboard */}
                  <div className="space-y-2 flex-1 flex flex-col justify-end">
                    <span className="text-[9px] font-mono tracking-widest text-white/40 block font-bold uppercase">Top Contributors</span>
                    <div className="space-y-1.5">
                      {[
                        { name: 'Ayesha Malik', rank: 1, count: '12.4K', color: 'bg-violet-600' },
                        { name: 'Hamza Ali', rank: 2, count: '9.8K', color: 'bg-indigo-600' },
                        { name: 'Noor Fatima', rank: 3, count: '8.2K', color: 'bg-pink-600' },
                        { name: 'Zaynab', rank: 4, count: '7.1K', color: 'bg-rose-600' }
                      ].map((con) => (
                        <div key={con.rank} className="flex items-center gap-2 text-[9px] font-sans bg-white/[0.01] p-1.5 rounded border border-white/5">
                          <span className="text-[8px] font-mono text-white/40 w-3 font-bold">{con.rank}</span>
                          <div className={`w-4 h-4 rounded-full ${con.color} text-[6px] font-bold text-white flex items-center justify-center`}>
                            {con.name.substring(0,2).toUpperCase()}
                          </div>
                          <span className="flex-1 font-medium text-white/95 leading-none truncate">{con.name}</span>
                          <span className="text-[8px] font-mono text-indigo-400 font-bold flex items-center gap-0.5">
                            <Heart className="w-2 h-2 text-rose-500 fill-rose-500 inline" /> {con.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Editor's Picks Curated Slider Bottom */}
              <div className="bg-[#05060b] border-t border-white/5 p-4 text-left space-y-3">
                <span className="text-[9px] font-mono tracking-widest text-white/40 block font-bold uppercase">★ EDITOR'S PICKS</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'summer', title: 'Summer Edit', col: 'from-amber-600/10 to-orange-950/20 border-amber-500/20', label: '2024 Collection' },
                    { id: 'mono', title: 'Monochrome', col: 'from-slate-800/10 to-neutral-950/20 border-white/10', label: 'Capsule Suite' },
                    { id: 'wedding', title: 'Wedding Inspo', col: 'from-pink-600/10 to-purple-950/20 border-pink-500/10', label: 'Formal Looks' },
                    { id: 'street', title: 'Street Icons', col: 'from-indigo-600/10 to-cyan-950/20 border-indigo-500/10', label: 'Daily Vibe' }
                  ].map((pick) => (
                    <div 
                      key={pick.id} 
                      onClick={() => handleInteractiveClick('COLLECTIONS', 'Collections')}
                      className={`bg-gradient-to-br ${pick.col} border rounded-xl p-2.5 space-y-1 hover:scale-[1.02] cursor-pointer transition-all`}
                    >
                      <p className="text-[10px] font-bold text-white">{pick.title}</p>
                      <p className="text-[8px] font-mono text-white/40">{pick.label}</p>
                      <span className="text-[7px] font-mono text-indigo-300 uppercase tracking-wider block pt-1.5">View Collection →</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* REAL-TIME SIMULATOR CONSOLE DISPLAY */}
            <div className="bg-black/90 border border-white/10 rounded-2xl p-4 font-mono text-left flex flex-col justify-between h-44 overflow-hidden relative">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-[9px] text-white/40">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-violet-400" />
                  <span>Sartorial Stream Console</span>
                </div>
                <button 
                  onClick={() => setSimulationLogs(["Console cleared. Standby."])}
                  className="hover:text-white transition-colors text-[8px]"
                >
                  Clear Logs
                </button>
              </div>
              <div className="flex-1 overflow-y-auto text-[10px] space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                <AnimatePresence>
                  {simulationLogs.map((log, index) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={index} 
                      className={`font-mono leading-normal ${
                        log.includes("📥") ? 'text-indigo-300' :
                        log.includes("🧠") ? 'text-violet-300' :
                        log.includes("🎨") ? 'text-cyan-300' :
                        log.includes("✨") ? 'text-rose-300' :
                        log.includes("🟢") ? 'text-emerald-400 font-bold' : 'text-white/50'
                      }`}
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </>
      )}
    </div>

        {/* RIGHT COLUMN: EXTERNAL SERVICES & FUTURE MODULES */}
        <div className="xl:col-span-3 space-y-6 flex flex-col justify-between">
          
          {/* EXTERNAL SERVICES */}
          <div className="bg-[#07070e]/80 border border-cyan-500/10 rounded-2xl p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h2 className="text-[11px] font-bold font-mono tracking-[0.2em] text-cyan-400 uppercase">
                EXTERNAL SERVICES (Integrated)
              </h2>
              <span className="text-[8px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded uppercase">
                Bound
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'right-payment', label: 'Payment Gateway', desc: 'Secure transactional checkout routing.', api: 'Stripe API v3', badge: 'Secure' },
                { id: 'right-shipping', label: 'Shipping Service', desc: 'Logistics and delivery tracking APIs.', api: 'UPS / FedEx REST', badge: 'Global' },
                { id: 'right-email', label: 'Email / SMS Service', desc: 'Curator updates and verify pins.', api: 'SendGrid & Twilio', badge: 'Active' },
                { id: 'right-storage', label: 'Cloud Storage', desc: 'File server holding high-res outfits.', api: 'Firebase Storage', badge: 'Bound' },
                { id: 'right-analytics', label: 'Analytics Service', desc: 'Aggregates telemetry style choices.', api: 'Google Analytics', badge: 'Syncing' }
              ].map((serv) => (
                <div
                  key={serv.id}
                  id={serv.id}
                  onMouseEnter={() => setActiveHoverNode(serv.id)}
                  onMouseLeave={() => {
                    setActiveHoverNode(null);
                    updateCoordinates();
                  }}
                  className={`bg-white/[0.01] border border-white/5 rounded-xl p-3 space-y-1.5 text-left transition-all hover:bg-white/[0.02] hover:border-cyan-500/20`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white block">{serv.label}</span>
                    <span className="text-[8px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 rounded uppercase">{serv.badge}</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-sans">{serv.desc}</p>
                  <span className="text-[8px] font-mono text-white/30 block pt-0.5">{serv.api}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FUTURE MODULES */}
          <div className="bg-[#07070e]/80 border border-violet-500/10 rounded-2xl p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h2 className="text-[11px] font-bold font-mono tracking-[0.2em] text-violet-400 uppercase">
                ADVANCED CAPABILITY SUITE (AUTOMATED COMPILE)
              </h2>
              <span className="text-[8px] font-mono bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 animate-pulse" /> Auto-Unlock Active
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'right-designer', label: 'AI Fashion Designer', desc: 'Tweak silhouettes & draft complete clothes.', milestone: 'Milestone 3' },
                { id: 'right-photoshoot', label: 'AI Photoshoot', desc: 'Render model campaigns with customized poses.', milestone: 'Milestone 3' },
                { id: 'right-vip-stars', label: 'VIP & Celebrity Fitting Suite', desc: 'Design, measurements & fittings for Actors, Stars, VIPs.', milestone: 'Milestone 3' },
                { id: 'right-moodboard', label: 'Mood Board Curation', desc: 'Interactive style workspace boards.', milestone: 'Milestone 4' },
                { id: 'right-cinema-wardrobe', label: 'Cinema Wardrobe Master', desc: 'Script-to-costume layout matching for Film & Drama makers.', milestone: 'Milestone 4' },
                { id: 'right-influencer', label: 'Style Influencer Mode', desc: 'Telemetry shares & profile monetization.', milestone: 'Milestone 4' },
                { id: 'right-brand', label: 'Brand Collaborator Hub', desc: 'Secure boutique portal for custom tailors.', milestone: 'Milestone 5' },
                { id: 'right-shopper', label: 'AI Personal Shopper', desc: 'Live wardrobe matching recommendations.', milestone: 'Milestone 5' },
                { id: 'right-global', label: 'Global Marketplace API', desc: 'Worldwide luxury freight shipping routing.', milestone: 'Milestone 5' },
                { id: 'right-retail-stock', label: 'New Stock Drops B2B', desc: 'Sourcing, inventory consignment & drops for new boutique stock.', milestone: 'Milestone 5' }
              ].map((fut) => {
                const waitlisted = isWaitlisted[fut.id];
                const progress = featureProgress[fut.id] || 0;
                const isCompiling = compilingFeatureId === fut.id;
                const isFullyReady = progress === 100;

                return (
                  <div
                    key={fut.id}
                    id={fut.id}
                    onMouseEnter={() => setActiveHoverNode(fut.id)}
                    onMouseLeave={() => {
                      setActiveHoverNode(null);
                      updateCoordinates();
                    }}
                    className={`border rounded-xl p-3 space-y-2 text-left transition-all duration-300 ${
                      isFullyReady
                        ? 'bg-emerald-500/[0.01] border-emerald-500/10 hover:bg-emerald-500/[0.02] hover:border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.02)]'
                        : isCompiling
                        ? 'bg-violet-500/[0.02] border-violet-500/30 animate-pulse'
                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isFullyReady ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCompiling ? (
                          <RefreshCw className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                        ) : (
                          <Lock className="w-3 h-3 text-amber-400/80" />
                        )}
                        <span className={`text-xs font-bold ${isFullyReady ? 'text-emerald-400/90' : 'text-white/90'}`}>
                          {fut.label}
                        </span>
                      </div>
                      <span className={`text-[8px] font-mono ${isFullyReady ? 'text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20 px-1.5 rounded' : 'text-amber-400/80'}`}>
                        {isFullyReady ? 'READY' : fut.milestone}
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-white/40 leading-relaxed font-sans">{fut.desc}</p>
                    
                    {/* Visual Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[8px] font-mono text-white/35">
                        <span>Development Integration</span>
                        <span className={isFullyReady ? 'text-emerald-400 font-bold' : isCompiling ? 'text-violet-400 animate-pulse' : 'text-amber-400'}>
                          {isCompiling ? 'Compiling bundles...' : `${progress}% Complete`}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFullyReady 
                              ? 'bg-emerald-500' 
                              : isCompiling 
                              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' 
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex gap-2 justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        {isFullyReady ? (
                          <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            Unlocked ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAutoUnlock(fut.id, fut.label)}
                            disabled={isCompiling}
                            className="text-[8.5px] font-mono bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 hover:border-amber-500/50 font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          >
                            {isCompiling ? (
                              <>
                                <RefreshCw className="w-2 h-2 animate-spin" />
                                <span>Building...</span>
                              </>
                            ) : (
                              <span>🛠 Auto-Unlock</span>
                            )}
                          </button>
                        )}
                      </div>

                      {waitlisted && (
                        <button
                          onClick={() => handleLaunchSimulator(fut.id, fut.label)}
                          className={`text-[8.5px] font-mono px-2 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-0.5 shrink-0 shadow-sm ${
                            isFullyReady 
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30' 
                              : 'bg-violet-600 hover:bg-violet-500 text-white border border-violet-400/30'
                          }`}
                        >
                          <Play className="w-2.5 h-2.5 fill-white text-white" />
                          <span>Simulate</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM AREA: FUTURE ROADMAP CONNECTION TIMELINE */}
      <div className="border-t border-white/10 pt-8 space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <h2 className="text-xs font-bold font-mono tracking-[0.2em] text-white uppercase">
                FUTURE ROADMAP CONNECTION
              </h2>
            </div>
            <p className="text-xs text-white/50 leading-relaxed font-sans max-w-xl">
              Features are connected systematically according to sequential milestones. Cleared database components are seamlessly bound.
            </p>
          </div>

          <div className="w-full md:w-80 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white/40">Overall Progress</span>
              <span className="text-violet-400 font-bold">68% Complete</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full w-[68%]" />
            </div>
          </div>
        </div>

        {/* ROADMAP CARD ITEMS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { 
              step: 1, 
              title: 'Core System', 
              desc: 'Completed wardrobe manager, interactive chat assistant, and auth flow.', 
              status: 'COMPLETE', 
              statusStyle: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
              cardStyle: 'border-emerald-500/20 bg-emerald-500/[0.01]'
            },
            { 
              step: 2, 
              title: 'Advanced AI', 
              desc: 'Personalized style passport, gravity vectors, and weather weights engine.', 
              status: 'IN PROGRESS', 
              statusStyle: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
              cardStyle: 'border-indigo-500/30 bg-indigo-500/[0.02]'
            },
            { 
              step: 3, 
              title: 'Social & Creator', 
              desc: 'Interactive visual design challenges and collective capsule lookbooks.', 
              status: 'COMING SOON', 
              statusStyle: 'text-amber-400/80 border-amber-500/10 bg-amber-500/[0.02]',
              cardStyle: 'border-white/5 bg-white/[0.005]'
            },
            { 
              step: 4, 
              title: 'Commerce Expansion', 
              desc: 'Integrated transactional checkouts, stripe gateways, and brand partnerships.', 
              status: 'COMING SOON', 
              statusStyle: 'text-amber-400/80 border-amber-500/10 bg-amber-500/[0.02]',
              cardStyle: 'border-white/5 bg-white/[0.005]'
            },
            { 
              step: 5, 
              title: 'Platform Evolution', 
              desc: 'Live curation stream routing, global shipping APIs, and 3D avatars.', 
              status: 'FUTURE', 
              statusStyle: 'text-white/30 border-white/5 bg-white/[0.002]',
              cardStyle: 'border-white/5 bg-white/[0.002]'
            }
          ].map((mil) => {
            const isSelected = selectedMilestone === mil.step;
            return (
              <div 
                key={mil.step}
                onClick={() => setSelectedMilestone(mil.step)}
                className={`border rounded-2xl p-4 text-left transition-all cursor-pointer relative ${mil.cardStyle} ${
                  isSelected ? 'border-violet-500/40 ring-1 ring-violet-500/20 translate-y-[-2px]' : 'hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                      {mil.step}
                    </span>
                    <span className="text-xs font-bold text-white font-sans">{mil.title}</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed font-sans min-h-[40px] mb-3">
                  {mil.desc}
                </p>
                <span className={`text-[8px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border inline-block ${mil.statusStyle}`}>
                  {mil.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* LEGEND & LEGALS FOOTER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-5 text-left">
          
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 block font-bold">LEGEND & MAP CONNECTORS</span>
            <div className="flex flex-wrap gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 bg-indigo-500 rounded" />
                <span className="text-white/60">Primary Connection</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 bg-cyan-500 rounded" />
                <span className="text-white/60">Secondary Connection</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 bg-emerald-500 rounded" />
                <span className="text-white/60">Data Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 border-b border-dashed border-amber-400" />
                <span className="text-white/60">Future Module (Locked)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 bg-rose-500 rounded" />
                <span className="text-white/60">External Service</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-2 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6 pt-3 lg:pt-0">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-400 block font-bold">IMPORTANT NOTICE</span>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed font-sans">
              Each feature is locked until its roadmap milestone is completed. When a feature unlocks, it will automatically integrate with the entire Look Vision ecosystem. No database components or external client assets are duplicated during synchronization.
            </p>
          </div>

        </div>

      </div>

      {/* SANDBOX PROTOTYPE SIMULATOR MODAL */}
      <AnimatePresence>
        {activeSimModule && (
          <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0b14] border border-white/10 rounded-2xl max-w-2xl w-full p-6 text-left space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar relative"
            >
              {/* Top ambient banner */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] text-violet-400 uppercase font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    <span>Experimental Sandbox</span>
                    <span>•</span>
                    <span className="text-zinc-400">Prototyping Node</span>
                  </div>
                  <h3 className="text-lg font-serif font-light text-white mt-1">
                    {activeSimModule.label} Simulator
                  </h3>
                </div>

                <button
                  onClick={() => {
                    setActiveSimModule(null);
                    setSimStep('IDLE');
                    setSimLogs([]);
                    setInfluencerActive(false);
                  }}
                  className="px-2.5 py-1 text-[9px] font-mono text-white/40 hover:text-white hover:bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-all"
                >
                  [CLOSE Sandbox]
                </button>
              </div>

              {simStep === 'IDLE' && (
                <div className="space-y-4">
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    This sandbox compiles a dynamic, offline-simulated instance of the <strong className="text-white font-semibold">{activeSimModule.label}</strong> service. Tweak parameters below to run tech pack generations, photorealistic grading, or algorithmic influencer streams.
                  </p>

                  {/* 1. DESIGNER CONTROLS */}
                  {activeSimModule.id === 'right-designer' && (
                    <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">Design Parameters</span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Garment Category</label>
                          <select
                            value={designerCategory}
                            onChange={(e) => setDesignerCategory(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/80 focus:outline-none"
                          >
                            <option>Trench Coat</option>
                            <option>Knitwear Turtleneck</option>
                            <option>Raw Canvas Denim</option>
                            <option>Asymmetrical Utility Vest</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Fabric Manifest</label>
                          <select
                            value={designerFabric}
                            onChange={(e) => setDesignerFabric(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/80 focus:outline-none"
                          >
                            <option>Organic Cotton 450gsm</option>
                            <option>Japanese Raw Selvedge</option>
                            <option>Recycled Cordura Weave</option>
                            <option>Loro Piana Cashmere Blend</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase">Colorway Profile</label>
                        <select
                          value={designerColor}
                          onChange={(e) => setDesignerColor(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/80 focus:outline-none"
                        >
                          <option>Midnight Charcoal</option>
                          <option>Aesthetic Off-White</option>
                          <option>Cyberpunk Indigo Glow</option>
                          <option>Gravel Zinc</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {Object.entries(designerSliders).map(([key, val]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="capitalize text-white/40">{key} Index</span>
                              <span className="text-violet-400 font-bold">{val}%</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={val}
                              onChange={(e) => setDesignerSliders(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. PHOTOSHOOT CONTROLS */}
                  {activeSimModule.id === 'right-photoshoot' && (
                    <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">Campaign Parameters</span>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/40 uppercase block">Mannequin Closet Apparel (Multi-select)</label>
                        <div className="bg-neutral-950/80 border border-white/5 rounded-lg p-2 max-h-24 overflow-y-auto no-scrollbar grid grid-cols-2 gap-1.5">
                          {(() => {
                            const closet = UnifiedFashionOS.getState().unifiedStyleMemory?.wardrobe_items || [];
                            return closet.map(item => {
                              const isSel = selectedPhotoshootItems.includes(item.id);
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    setSelectedPhotoshootItems(prev =>
                                      prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
                                    );
                                  }}
                                  className={`p-1.5 rounded text-left text-[9.5px] border truncate flex justify-between items-center cursor-pointer ${
                                    isSel ? 'bg-violet-500/10 border-violet-500/30 text-violet-300' : 'bg-white/[0.01] border-white/5 text-white/60'
                                  }`}
                                >
                                  <span className="truncate">{item.title}</span>
                                  {isSel && <span className="text-[7.5px] font-bold text-violet-400 shrink-0 ml-1">✓</span>}
                                </button>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Location Set</label>
                          <select
                            value={photoshootEnv}
                            onChange={(e) => setPhotoshootEnv(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none"
                          >
                            <option>Brutalist Concrete Atrium</option>
                            <option>Tokyo Cyberpunk Alleyways</option>
                            <option>Nordic Glacial Ridge</option>
                            <option>High-Contrast Studio Spread</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Model posture</label>
                          <select
                            value={photoshootStance}
                            onChange={(e) => setPhotoshootStance(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none"
                          >
                            <option>Dynamic Stride</option>
                            <option>Sartorial Silhouette Pivot</option>
                            <option>Static Gaze / Contemplative</option>
                            <option>Heroic Architectural Angle</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Lighting Preset</label>
                          <select
                            value={photoshootLighting}
                            onChange={(e) => setPhotoshootLighting(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none"
                          >
                            <option>Golden Hour Ambient Glow</option>
                            <option>Neon Indigo Contrast Rim</option>
                            <option>Diffused Overcast Nordic</option>
                            <option>Cinematic High-Key Spotlight</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. MOOD BOARD CONTROLS */}
                  {activeSimModule.id === 'right-moodboard' && (
                    <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">Curation Elements</span>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase">Aesthetic Core Tags</label>
                        <input
                          type="text"
                          value={moodTags}
                          onChange={(e) => setMoodTags(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-white/40 uppercase block">Palette Color Blocks</label>
                          <div className="flex gap-2">
                            {moodColors.map((col, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  const hex = prompt('Enter color hex:', col);
                                  if (hex && hex.startsWith('#')) {
                                    setMoodColors(prev => prev.map((c, i) => i === idx ? hex : c));
                                  }
                                }}
                                className="w-8 h-8 rounded-lg border border-white/10 transition-all cursor-pointer flex items-center justify-center relative"
                                style={{ backgroundColor: col }}
                                title="Click to adjust hex"
                              >
                                <span className="text-[7px] font-mono bg-black/40 text-white rounded px-0.5 pointer-events-none">{col.substring(1)}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase block">Pin Closet Garments</label>
                          <div className="bg-neutral-950 border border-white/5 rounded-lg p-1.5 max-h-16 overflow-y-auto no-scrollbar flex flex-wrap gap-1">
                            {(() => {
                              const closet = UnifiedFashionOS.getState().unifiedStyleMemory?.wardrobe_items || [];
                              return closet.map(item => {
                                const isPinned = pinnedItems.includes(item.id);
                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      setPinnedItems(prev =>
                                        prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
                                      );
                                    }}
                                    className={`px-1.5 py-0.5 rounded text-[8px] font-mono border cursor-pointer ${
                                      isPinned ? 'bg-pink-500/10 border-pink-500/20 text-pink-300' : 'bg-white/5 border-white/5 text-white/40'
                                    }`}
                                  >
                                    {item.title}
                                  </button>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. INFLUENCER CONTROLS */}
                  {activeSimModule.id === 'right-influencer' && (
                    <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">Algorithmic Broadcast Options</span>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase">Aesthetic Post Title</label>
                        <input
                          type="text"
                          value={influencerTitle}
                          onChange={(e) => setInfluencerTitle(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Demographic Focus Region</label>
                          <select
                            value={influencerRegion}
                            onChange={(e) => setInfluencerRegion(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                          >
                            <option>Kyoto Streetwear (Harajuku)</option>
                            <option>Milan High-Fashion (Brera)</option>
                            <option>London Cyber Couture (Soho)</option>
                            <option>New York Brutalist Minimalist</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Platform Feed Route</label>
                          <select
                            value={influencerPlatform}
                            onChange={(e) => setInfluencerPlatform(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                          >
                            <option>Look Vision Collective Feed</option>
                            <option>Aesthetic Telemetry Stream</option>
                            <option>Boutique Curation Feed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. BRAND COLLABORATOR CONTROLS */}
                  {activeSimModule.id === 'right-brand' && (
                    <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">Atelier Specification Drafting</span>

                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(collarSpecs).map(([spec, val]) => (
                          <div key={spec} className="space-y-1">
                            <label className="text-[9px] font-mono text-white/40 uppercase block truncate">{spec} (cm/mm)</label>
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => setCollarSpecs(prev => ({ ...prev, [spec]: parseFloat(e.target.value) || 0 }))}
                              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none font-mono"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase">Atelier Tier Preference</label>
                        <select
                          value={collarSourcing}
                          onChange={(e) => setCollarSourcing(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        >
                          <option>Artisanal Kyoto Atelier</option>
                          <option>Premium High-Capacity Atelier (Milan)</option>
                          <option>Sustainable Local Atelier Collective</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 6. PERSONAL SHOPPER CONTROLS */}
                  {activeSimModule.id === 'right-shopper' && (
                    <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">Occasion Target Matcher</span>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase">Occasion & Event Environment</label>
                        <select
                          value={shopperOccasion}
                          onChange={(e) => setShopperOccasion(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        >
                          <option>High-End Art Gallery Opening</option>
                          <option>Techwear Midnight Meetup</option>
                          <option>Rainy Coffee Stroll</option>
                          <option>Business Casual Pitch Presentation</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 7. GLOBAL SHIPPER CONTROLS */}
                  {activeSimModule.id === 'right-global' && (
                    <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">Luxury Logistics Configuration</span>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Origin Vault</label>
                          <select
                            value={freightOrigin}
                            onChange={(e) => setFreightOrigin(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none"
                          >
                            <option>Boutique Vault Rome (IT)</option>
                            <option>Atelier Kyoto (JP)</option>
                            <option>Sartorial Warehouse New York (US)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Destination City</label>
                          <input
                            type="text"
                            value={freightDestCity}
                            onChange={(e) => setFreightDestCity(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Destination Country</label>
                          <input
                            type="text"
                            value={freightDestCountry}
                            onChange={(e) => setFreightDestCountry(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase block">Logistics Class</label>
                        <select
                          value={freightClass}
                          onChange={(e) => setFreightClass(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        >
                          <option>Zero-Emission Green Freight</option>
                          <option>Sartorial Air Express</option>
                          <option>Standard Secure Courier</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 8. VIP & CELEBRITY FITTING CONTROLS */}
                  {activeSimModule.id === 'right-vip-stars' && (
                    <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">VIP & Star Fit Specifier</span>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Actor / Star Name</label>
                          <input
                            type="text"
                            value={vipActorName}
                            onChange={(e) => setVipActorName(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            placeholder="e.g. Timothée Chalamet"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Event Class</label>
                          <select
                            value={vipEventClass}
                            onChange={(e) => setVipEventClass(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/80 focus:outline-none"
                          >
                            <option>Met Gala Red Carpet</option>
                            <option>Cannes Film Festival Premiere</option>
                            <option>Bespoke Drama Costume Fitting</option>
                            <option>VIP Private Gala Appearance</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase">Bespoke Fit Direction</label>
                        <select
                          value={vipBespokeStyle}
                          onChange={(e) => setVipBespokeStyle(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/80 focus:outline-none"
                        >
                          <option>Avant-Garde Velvet Silhouette</option>
                          <option>Sleek Monochrome Silk Drape</option>
                          <option>Structured Double-Breasted Savile</option>
                          <option>Deconstructed Post-Modern Layering</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 9. CINEMA WARDROBE CONTROLS */}
                  {activeSimModule.id === 'right-cinema-wardrobe' && (
                    <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">Drama Script Scene Parser</span>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase block">Screenplay Scene Description / Script Segment</label>
                        <textarea
                          rows={3}
                          value={cinemaScriptText}
                          onChange={(e) => setCinemaScriptText(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono"
                          placeholder="Describe the cinematic scene..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Aesthetic Era</label>
                          <select
                            value={cinemaPeriodEra}
                            onChange={(e) => setCinemaPeriodEra(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          >
                            <option>Cyberpunk Neo-Noir</option>
                            <option>Regency Edwardian Elegance</option>
                            <option>1980s Retro Synthwave</option>
                            <option>High-Fantasy Textured Woolen</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Scene Atmosphere</label>
                          <select
                            value={cinemaAtmosphere}
                            onChange={(e) => setCinemaAtmosphere(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          >
                            <option>Midnight Heavy Rain</option>
                            <option>Misty Candlelit Ballroom</option>
                            <option>Scorching Desert Noon</option>
                            <option>Overcast Cold Winds</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 10. NEW STOCK B2B CONTROLS */}
                  {activeSimModule.id === 'right-retail-stock' && (
                    <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">Stock Drops Sourcing Portal</span>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Brand / Merchant Atelier</label>
                          <input
                            type="text"
                            value={stockMerchantName}
                            onChange={(e) => setStockMerchantName(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            placeholder="e.g. Prada Milan"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">New Release Apparel Name</label>
                          <input
                            type="text"
                            value={stockItemType}
                            onChange={(e) => setStockItemType(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            placeholder="e.g. Cashmere Bomber"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Retail Drops Quantity</label>
                          <input
                            type="number"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-white/40 uppercase">Unit Price ($ USD)</label>
                          <input
                            type="number"
                            value={stockPrice}
                            onChange={(e) => setStockPrice(parseFloat(e.target.value) || 0)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={handleRunSimulation}
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-[10.5px] uppercase tracking-wider font-bold py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/10 flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-violet-200" />
                      <span>Compile Simulator Environment</span>
                    </button>
                  </div>
                </div>
              )}

              {simStep === 'SIMULATING' && (
                <div className="space-y-5 py-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto animate-spin">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-widest text-violet-400 uppercase block font-bold">Compiling Modules</span>
                    <p className="text-xs text-white/50 italic">"Resolving coordinate dependencies and structural models..."</p>
                  </div>

                  <div className="bg-neutral-950/80 border border-white/5 p-4 rounded-xl text-left font-mono text-[9px] text-zinc-400 h-36 overflow-y-auto space-y-1.5 no-scrollbar">
                    {simLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-violet-500 select-none">[{idx}]</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {simStep === 'RESULT' && (
                <div className="space-y-5 animate-fade-in">
                  
                  {/* Result Header */}
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-emerald-400 uppercase block font-bold">Simulation Complete</span>
                      <h4 className="text-sm font-bold text-white font-sans">Active Sandbox Output</h4>
                    </div>
                  </div>

                  {/* 1. DESIGNER OUTPUT */}
                  {activeSimModule.id === 'right-designer' && designerResult && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Digital Validation Token</span>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold block">{designerResult.token}</span>
                        </div>
                        <div className="space-y-1 bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase block">GSM Class weight</span>
                          <span className="text-[10px] font-mono text-white/80 font-bold block">{designerResult.weight}</span>
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 font-mono text-[9px] text-zinc-400">
                        <p className="text-white font-bold mb-2 uppercase text-[10px]">Technical Drafting Schematic (ASCII):</p>
                        <pre className="leading-snug text-violet-400 select-all">
{`          /===============\\
         /  ___________  \\
        // /           \\ \\\\
       // /             \\ \\\\
      || |   D-SLOUCH:   | ||
      || |   ${designerResult.specs['Drape Slouch']}        | ||
      || |               | ||
      || |   A-BIAS:     | ||
      || |   ${designerResult.specs['Asymmetric Offsets']}        | ||
       \\\\ \\             / //
        \\\\ \\___________/ //
         \\===============/`}
                        </pre>
                      </div>

                      <div className="space-y-2 bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        <span className="text-[9px] font-mono text-white/30 uppercase font-bold block">Sartorial Cut & Trim Directives</span>
                        <ul className="space-y-1.5 text-[11px] text-white/70">
                          {designerResult.instructions.map((inst: string, i: number) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-violet-400 font-bold font-mono">•</span>
                              <span>{inst}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* 2. PHOTOSHOOT OUTPUT */}
                  {activeSimModule.id === 'right-photoshoot' && photoshootResult && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Production Rig</span>
                          <span className="font-mono text-[10px] text-zinc-300 block">{photoshootResult.camera}</span>
                        </div>
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Grading LUT</span>
                          <span className="font-mono text-[10px] text-zinc-300 block truncate">{photoshootResult.grading}</span>
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 text-[11px] text-zinc-300 leading-relaxed italic font-serif">
                        "{photoshootResult.summary}"
                      </div>

                      <div className="p-4 bg-gradient-to-br from-violet-600/15 to-purple-600/5 border border-violet-500/10 rounded-xl">
                        <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                          <span className="text-violet-400">COORDINATE MAPPED RENDER PREVIEW</span>
                          <span className="text-white/30">H-RES BLUEPRINT</span>
                        </div>
                        <div className="h-28 bg-[#05050a] border border-white/5 rounded-lg flex items-center justify-center font-mono text-[9px] text-white/20 select-none">
                          [V-RAY SPATIAL CAMPAIGN COMPOSITE OUT]
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. MOOD BOARD OUTPUT */}
                  {activeSimModule.id === 'right-moodboard' && moodBoardSaved && (
                    <div className="space-y-4">
                      <div className="bg-[#07070c] border border-white/5 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-white uppercase font-sans tracking-wide">{moodBoardSaved.title}</h4>
                          <span className="text-[8px] font-mono bg-pink-500/15 border border-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded uppercase">Pinned Collage</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {moodBoardSaved.tags.map((tag: string, i: number) => (
                            <span key={i} className="text-[9px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-full">#{tag}</span>
                          ))}
                        </div>

                        {/* Colors */}
                        <div className="flex gap-1.5 pt-1">
                          {moodBoardSaved.colors.map((col: string, i: number) => (
                            <div key={i} className="flex-1 h-12 rounded-lg border border-white/10 relative overflow-hidden" style={{ backgroundColor: col }}>
                              <span className="absolute bottom-1 left-1.5 text-[8px] font-mono bg-black/40 text-white/90 px-1 rounded">{col}</span>
                            </div>
                          ))}
                        </div>

                        {/* Items pinned */}
                        <div className="space-y-1.5 border-t border-white/5 pt-3">
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Pinned Wardrobe Items</span>
                          <div className="flex flex-wrap gap-1">
                            {moodBoardSaved.items.map((item: any) => (
                              <span key={item.id} className="text-[9px] font-sans font-bold bg-violet-600/10 border border-violet-500/20 text-violet-300 px-2 py-1 rounded">
                                {item.title}
                              </span>
                            ))}
                            {moodBoardSaved.items.length === 0 && (
                              <span className="text-[9px] font-mono text-white/20 italic">No custom wardrobe items pinned.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. INFLUENCER OUTPUT */}
                  {activeSimModule.id === 'right-influencer' && (
                    <div className="space-y-4">
                      <div className="bg-[#05050a] border border-white/5 p-4 rounded-xl space-y-3.5 relative overflow-hidden">
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest block font-bold">Simulated Telemetry Stream</span>
                            <h4 className="text-xs font-bold text-white mt-0.5">"{influencerTitle}"</h4>
                          </div>
                          <span className="text-[8px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase">
                            {influencerActive ? 'Streaming' : 'Completed'}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-neutral-950 p-2 rounded-lg border border-white/5">
                            <span className="text-[9px] font-mono text-white/30 block uppercase">Views</span>
                            <span className="text-xs font-bold font-mono text-white mt-1 block">{influencerStats.views.toLocaleString()}</span>
                          </div>
                          <div className="bg-neutral-950 p-2 rounded-lg border border-white/5">
                            <span className="text-[9px] font-mono text-white/30 block uppercase">Likes</span>
                            <span className="text-xs font-bold font-mono text-pink-400 mt-1 block">{influencerStats.likes.toLocaleString()}</span>
                          </div>
                          <div className="bg-neutral-950 p-2 rounded-lg border border-white/5">
                            <span className="text-[9px] font-mono text-white/30 block uppercase">Saves</span>
                            <span className="text-xs font-bold font-mono text-amber-400 mt-1 block">{influencerStats.saves.toLocaleString()}</span>
                          </div>
                          <div className="bg-neutral-950 p-2 rounded-lg border border-white/5">
                            <span className="text-[9px] font-mono text-white/30 block uppercase">Earning</span>
                            <span className="text-xs font-bold font-mono text-emerald-400 mt-1 block">${influencerStats.earning.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Pulse progress bar */}
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-rose-500 transition-all duration-300"
                            style={{ width: `${Math.min(100, (influencerStats.views / 4500) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. COLLABORATOR OUTPUT */}
                  {activeSimModule.id === 'right-brand' && (
                    <div className="space-y-4">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-bold">Incoming Atelier Bids</span>
                      <div className="space-y-2.5">
                        {collarBids.map((bid, i) => (
                          <div key={i} className="bg-[#05050a] border border-white/5 p-3 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div className="space-y-1 text-left">
                              <div className="flex items-center gap-2">
                                <h5 className="text-[11px] font-bold text-white">{bid.name}</h5>
                                <span className="text-[8px] font-mono text-zinc-500">{bid.time}</span>
                              </div>
                              <p className="text-[10px] text-white/50 leading-relaxed font-sans max-w-md">{bid.detail}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-mono text-emerald-400 font-bold block">${bid.price} USD</span>
                              <button
                                onClick={() => {
                                  window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: `Selected bid from ${bid.name} for $${bid.price}!` }));
                                  setActiveSimModule(null);
                                }}
                                className="text-[8px] font-mono bg-white hover:bg-neutral-200 text-black px-2 py-0.5 rounded font-bold transition-all cursor-pointer block mt-1"
                              >
                                Select Bid
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. PERSONAL SHOPPER OUTPUT */}
                  {activeSimModule.id === 'right-shopper' && shopperResult && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="bg-[#05050a] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Occasion Match Score</span>
                          <span className="text-xl font-serif font-light text-violet-400">{shopperOccasion}</span>
                        </div>
                        <div className="text-center shrink-0">
                          <span className="text-2xl font-mono text-emerald-400 font-bold block">{shopperResult.score}%</span>
                          <span className="text-[8px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded block mt-1 font-bold">{shopperResult.verdict}</span>
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/5 text-[11.5px] text-zinc-300 leading-relaxed italic">
                        "{shopperResult.advice}"
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-white/30 uppercase block font-bold">Recommended Closet Combination</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {shopperResult.items.map((item: any) => (
                            <div key={item.id} className="bg-white/[0.01] border border-white/5 p-2.5 rounded-lg flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-sans font-bold text-white block">{item.title}</span>
                                <span className="text-[8px] font-mono text-white/30 uppercase mt-0.5 block">{item.category}</span>
                              </div>
                              <span className="text-[9px] font-mono text-violet-400 uppercase">Coherent Match</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. GLOBAL FREIGHT OUTPUT */}
                  {activeSimModule.id === 'right-global' && freightResult && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Sartorial Distance</span>
                          <span className="font-mono text-[10.5px] text-zinc-300 block">{freightResult.distance}</span>
                        </div>
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Transit Corridor Delivery</span>
                          <span className="font-mono text-[10.5px] text-zinc-300 block">{freightResult.time}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Estimated Shipping Fee</span>
                          <span className="font-mono text-[10.5px] text-emerald-400 font-bold block">{freightResult.fee}</span>
                        </div>
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Environmental Footprint</span>
                          <span className="font-mono text-[10.5px] text-zinc-400 block">{freightResult.carbon}</span>
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 font-mono text-[9px] text-zinc-400">
                        <p className="text-white font-bold mb-1 uppercase text-[10px]">Logistics Ledger:</p>
                        <p className="leading-relaxed">
                          SART-ROUTE-OUT // ROUTED FROM: <span className="text-violet-400">{freightOrigin}</span> TO <span className="text-violet-400">{freightDestCity}, {freightDestCountry}</span>. NO CUSTOMS BLOCK DETECTED. CUSTOM DUTY WAIVED UNDER PLATFORM LUXURY TRADE blue-sheet.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 8. VIP & CELEBRITY FITTING OUTPUT */}
                  {activeSimModule.id === 'right-vip-stars' && vipFittingResult && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="bg-[#05050a] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Actor Fit Synergy</span>
                          <span className="text-xl font-serif font-light text-rose-400">{vipFittingResult.vip}</span>
                        </div>
                        <div className="text-center shrink-0">
                          <span className="text-2xl font-mono text-pink-500 font-bold block">{vipFittingResult.fitScore}</span>
                          <span className="text-[8px] font-mono uppercase bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded block mt-1 font-bold">Bespoke Fit</span>
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/5 text-[11.5px] text-zinc-300 leading-relaxed italic">
                        "{vipFittingResult.recommendation}"
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-white/30 uppercase block font-bold">Star Anatomical Measurements</span>
                        <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
                          {Object.entries(vipFittingResult.measurements).map(([key, val]: [any, any]) => (
                            <div key={key} className="bg-white/[0.01] border border-white/5 p-2 rounded-lg text-center">
                              <span className="text-[8px] text-white/30 uppercase block">{key}</span>
                              <span className="text-white font-bold block mt-0.5">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 9. CINEMA WARDROBE OUTPUT */}
                  {activeSimModule.id === 'right-cinema-wardrobe' && cinemaWardrobeResult && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="bg-neutral-950 p-4 rounded-xl border border-white/5">
                        <span className="text-[9px] font-mono text-white/30 uppercase block mb-1.5">Parsed Script Scene Segment</span>
                        <p className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-[#05050a] p-3 rounded-lg border border-white/5">
                          "{cinemaWardrobeResult.scriptSegment}"
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[8px] text-white/30 uppercase block">Aesthetic Era</span>
                          <span className="text-white font-bold block mt-0.5">{cinemaWardrobeResult.era}</span>
                        </div>
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[8px] text-white/30 uppercase block">Environment Vibe</span>
                          <span className="text-white font-bold block mt-0.5">{cinemaWardrobeResult.vibe}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-white/30 uppercase block font-bold">Extracted Cast Wardrobe Breakdown</span>
                        <div className="space-y-2">
                          {cinemaWardrobeResult.extractedOutfits.map((out: any, i: number) => (
                            <div key={i} className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex items-center justify-between">
                              <div>
                                <span className="text-[8px] font-mono text-violet-400 uppercase tracking-wider block font-bold">{out.character}</span>
                                <span className="text-[11px] font-sans text-white/90 font-bold block mt-0.5">{out.garment}</span>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-400 bg-neutral-900 border border-white/10 px-2.5 py-1 rounded-md">{out.color}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-3 rounded-xl border border-white/5 font-mono text-[9px] text-zinc-400">
                        <p className="text-white font-bold mb-1 uppercase text-[10px]">Director's Camera Lighting Guide:</p>
                        <p className="leading-relaxed">{cinemaWardrobeResult.lightingGuide}</p>
                      </div>
                    </div>
                  )}

                  {/* 10. NEW STOCK B2B OUTPUT */}
                  {activeSimModule.id === 'right-retail-stock' && stockDropResult && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="bg-[#05050a] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Drops Consignor Atelier</span>
                          <span className="text-xl font-serif font-light text-emerald-400">{stockDropResult.merchant}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-mono text-white/30 uppercase block">Assigned SKU</span>
                          <span className="font-mono text-[11.5px] text-zinc-300 font-bold block mt-0.5">{stockDropResult.sku}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 font-mono text-[10px]">
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[8px] text-white/30 uppercase block">Apparel Item</span>
                          <span className="text-white font-bold block mt-1.5 truncate">{stockDropResult.item}</span>
                        </div>
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[8px] text-white/30 uppercase block">Drops Qty</span>
                          <span className="text-white font-bold block mt-1.5">{stockDropResult.qty} Units</span>
                        </div>
                        <div className="bg-neutral-950 p-3 rounded-lg border border-white/5">
                          <span className="text-[8px] text-white/30 uppercase block">B2B Unit Price</span>
                          <span className="text-emerald-400 font-bold block mt-1.5">{stockDropResult.price}</span>
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 font-mono text-[10px] space-y-2">
                        <p className="text-white font-bold uppercase text-[10.5px]">Platform Stock Consignment Status:</p>
                        <p className="text-zinc-400 leading-relaxed">
                          The apparel stock has been verified for textile purity and standard sizing metrics. You can now publish this exclusive drop directly into the LIVE marketplace & community feed for filmmakers, star agents, and shoppers!
                        </p>
                      </div>

                      <div className="pt-2">
                        {stockDropResult.postedLive ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-center font-mono text-[10px] font-bold uppercase tracking-wider">
                            ✓ Pushed Successfully to Live Marketplace
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setStockDropResult((prev: any) => ({ ...prev, postedLive: true }));
                              
                              // Dispatch custom event to push this item live to HomeFeed!
                              window.dispatchEvent(new CustomEvent('lookvision_add_retail_stock', {
                                detail: {
                                  title: stockDropResult.item,
                                  merchant: stockDropResult.merchant,
                                  price: stockDropResult.price,
                                  qty: stockDropResult.qty,
                                  sku: stockDropResult.sku
                                }
                              }));

                              window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                                detail: `SUCCESS: Consigned stock for ${stockDropResult.item} pushed to Live Marketplace & Community Feed!`
                              }));
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10.5px] uppercase tracking-wider font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-1.5"
                          >
                            <span>🚀 Push Drop to Live Feed / Shop Stock</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setSimStep('IDLE')}
                      className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-mono font-medium transition-all cursor-pointer"
                    >
                      Reset Simulator
                    </button>
                    <button
                      onClick={() => {
                        setActiveSimModule(null);
                        setSimStep('IDLE');
                        setSimLogs([]);
                        setInfluencerActive(false);
                      }}
                      className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center"
                    >
                      Exit Sandbox
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
