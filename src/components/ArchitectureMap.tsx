import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, MessageSquare, Layers, User, Compass, Shirt, 
  ShoppingBag, Users, Store, Mail, ChevronRight, Lock, 
  CheckCircle, RefreshCw, Send, Terminal, ArrowRight,
  Database, Activity, Shield, Info, Heart, Bell, Settings, Eye, Globe,
  Moon, Sun, Search, SlidersHorizontal, Plus, Star, Award, ChevronDown,
  Trash2, ShieldCheck, AlertTriangle, Play, HelpCircle
} from 'lucide-react';

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
  const [isWaitlisted, setIsWaitlisted] = useState<Record<string, boolean>>({});
  const [showNotificationCount, setShowNotificationCount] = useState(5);
  const [cartCount, setCartCount] = useState(2);
  
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
    { id: 'f-global', fromId: 'right-global', toId: 'app-marketplace', color: '#f59e0b', dashArray: '4 4' }
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

  const handleInteractiveClick = (tabId: string, label: string) => {
    if (onNavigateToTab) {
      onNavigateToTab(tabId);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
        detail: `Directing workspace pipeline to real ${label} view.` 
      }));
    }
  };

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
          <div className="bg-[#07070e]/80 border border-amber-500/10 rounded-2xl p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h2 className="text-[11px] font-bold font-mono tracking-[0.2em] text-amber-400 uppercase">
                FUTURE MODULES (Locked)
              </h2>
              <span className="text-[8px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Locked
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'right-designer', label: 'AI Fashion Designer', desc: 'Tweak silhouettes & draft complete clothes.', milestone: 'Milestone 3' },
                { id: 'right-photoshoot', label: 'AI Photoshoot', desc: 'Render model campaigns with customized poses.', milestone: 'Milestone 3' },
                { id: 'right-moodboard', label: 'Mood Board Curation', desc: 'Interactive style workspace boards.', milestone: 'Milestone 4' },
                { id: 'right-influencer', label: 'Style Influencer Mode', desc: 'Telemetry shares & profile monetization.', milestone: 'Milestone 4' },
                { id: 'right-brand', label: 'Brand Collaborator Hub', desc: 'Secure boutique portal for custom tailors.', milestone: 'Milestone 5' },
                { id: 'right-shopper', label: 'AI Personal Shopper', desc: 'Live wardrobe matching recommendations.', milestone: 'Milestone 5' },
                { id: 'right-global', label: 'Global Marketplace API', desc: 'Worldwide luxury freight shipping routing.', milestone: 'Milestone 5' }
              ].map((fut) => {
                const waitlisted = isWaitlisted[fut.id];
                return (
                  <div
                    key={fut.id}
                    id={fut.id}
                    onMouseEnter={() => setActiveHoverNode(fut.id)}
                    onMouseLeave={() => {
                      setActiveHoverNode(null);
                      updateCoordinates();
                    }}
                    className="bg-white/[0.01] border border-white/5 rounded-xl p-3 space-y-2 text-left transition-all hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-amber-400/80" />
                        <span className="text-xs font-bold text-white/90">{fut.label}</span>
                      </div>
                      <span className="text-[8px] font-mono text-amber-400/80">{fut.milestone}</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed font-sans">{fut.desc}</p>
                    
                    <div className="pt-0.5 text-right">
                      <button
                        onClick={() => joinWaitlist(fut.id, fut.label)}
                        className={`text-[8px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border select-none transition-all ${
                          waitlisted 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30 cursor-pointer'
                        }`}
                      >
                        {waitlisted ? 'Priority Registered' : 'Pre-register'}
                      </button>
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

    </div>
  );
};
