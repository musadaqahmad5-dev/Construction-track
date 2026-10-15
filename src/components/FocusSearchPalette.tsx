import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Compass, Cpu, Palette, Settings, Sparkles, LogOut, 
  ChevronRight, CornerDownLeft, Shield, Users, ShoppingBag, 
  Calendar, User, Globe, HelpCircle, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LOOK_VISION_THEMES } from './AIStyleHub';
import { FashionEngine } from '../features/fashion/fashionEngine';

interface SearchItem {
  id: string;
  category: 'navigation' | 'themes' | 'actions' | 'vibes';
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  shortcut?: string;
  action: () => void;
}

interface FocusSearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

export const FocusSearchPalette: React.FC<FocusSearchPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentTheme,
  setCurrentTheme
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'navigation' | 'themes' | 'actions' | 'vibes'>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRoutingCommand, setIsRoutingCommand] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const executeNaturalCommand = async (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (!trimmed || isRoutingCommand) return;
    setIsRoutingCommand(true);
    try {
      const routed = await FashionEngine.routeCommand(trimmed);
      const actionMap: Record<string, string> = {
        HOME_FEED: 'PRODUCT_HOME',
        BENTO_SAVED: 'PRODUCT_HOME',
        AI_CREATION: 'PRODUCT_AI_CREATIONS',
        CLOSET_VAULT: 'WARDROBE',
        COMMERCE_MARKET: 'PRODUCT_MARKETPLACE',
        FASHION_ACADEMY: 'FASHION_INSTRUCTOR',
        VIRTUAL_TRYON: 'VIRTUAL_TRY',
        WARDROBE_HEALTH: 'WARDROBE',
        DYNAMIC_PLANNER: 'PLANNER',
        STYLE_MUTATOR: 'PRODUCT_AI_CREATIONS',
        THEME_ENGINE: 'SYSTEM_ROOM'
      };

      if (routed.action === 'THEME_ENGINE' && routed.detectedParameters?.requestedSkin && routed.detectedParameters.requestedSkin !== 'None') {
        const skinToTheme: Record<string, string> = {
          AVANT_GARDE: 'classic-noir',
          MINIMALIST_LUXURY: 'nordic-editorial',
          STREETWEAR_TECHNICAL: 'cosmic-dream',
          HAUTE_COUTURE: 'classic-noir',
          CYBER_HERITAGE: 'cyber-couture'
        };
        const mappedTheme = skinToTheme[routed.detectedParameters.requestedSkin] || 'classic-noir';
        setCurrentTheme(mappedTheme);
        localStorage.setItem('look_vision_theme', mappedTheme);
      } else {
        const targetRoute = actionMap[routed.action] || 'PRODUCT_HOME';
        onNavigate(targetRoute);
      }

      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: {
          message: routed.stylistResponseBanner || `Routed to ${routed.action}`,
          type: 'info'
        }
      }));
      onClose();
    } finally {
      setIsRoutingCommand(false);
    }
  };

  // Define searchable command palette items dynamically
  const getSearchItems = (): SearchItem[] => [
    // --- NAVIGATION ROOMS ---
    {
      id: 'nav-home',
      category: 'navigation',
      title: 'Jump to Home Hub',
      description: 'Go to lookbook explore, personalized style cockpit, and verification suite.',
      icon: Compass,
      shortcut: 'G H',
      action: () => {
        onNavigate('PRODUCT_HOME');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '✨ Teleported to Home Hub' }));
      }
    },
    {
      id: 'nav-community',
      category: 'navigation',
      title: 'Explore Fashion Community',
      description: 'Interact with community threads, trend logs, and stylist verification boards.',
      icon: Users,
      shortcut: 'G C',
      action: () => {
        onNavigate('PRODUCT_COMMUNITY');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '👥 Entered Fashion Community Hub' }));
      }
    },
    {
      id: 'nav-creations',
      category: 'navigation',
      title: 'AI Creations Studio',
      description: 'View custom generated avant-garde pieces and premium stable diffusion prompts.',
      icon: Sparkles,
      shortcut: 'G A',
      action: () => {
        onNavigate('PRODUCT_AI_CREATIONS');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '🎨 Opening AI Creations Studio' }));
      }
    },
    {
      id: 'nav-marketplace',
      category: 'navigation',
      title: 'Marketplace listings',
      description: 'Browse verified high-contrast creator garments, custom skins, and digital tokens.',
      icon: ShoppingBag,
      shortcut: 'G M',
      action: () => {
        onNavigate('PRODUCT_MARKETPLACE');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '🛍️ Loading Creator Marketplace' }));
      }
    },
    {
      id: 'nav-planner',
      category: 'navigation',
      title: 'Aesthetic Outfit Planner',
      description: 'Model and coordinate scheduled look matrices for seasonal weeks.',
      icon: Calendar,
      shortcut: 'G O',
      action: () => {
        onNavigate('PLANNER');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '📅 Loading Outfit Planner calendar' }));
      }
    },
    {
      id: 'nav-memory',
      category: 'navigation',
      title: 'AI Style Memory Cockpit',
      description: 'Review active telemetry feeds, memory databases, and computational style logic.',
      icon: Cpu,
      shortcut: 'G S',
      action: () => {
        onNavigate('DASHBOARD');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '🧠 Synchronized AI Memory Database' }));
      }
    },
    {
      id: 'nav-profile',
      category: 'navigation',
      title: 'Cognitive Passport Profile',
      description: 'Manage biological measurements, sartorial goals, history, and appearance.',
      icon: User,
      shortcut: 'G P',
      action: () => {
        onNavigate('PROFILE');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '👤 Loaded Cognitive Passport and Style DNA' }));
      }
    },
    {
      id: 'nav-settings',
      category: 'navigation',
      title: 'Workspace Settings & System Audit',
      description: 'Access telemetry logs, API endpoints, network states, and developer controls.',
      icon: Settings,
      shortcut: 'G E',
      action: () => {
        onNavigate('SYSTEM_ROOM');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '⚙️ Systems Audit panel initialized' }));
      }
    },

    // --- SYSTEMS THEMES ---
    {
      id: 'theme-classic-noir',
      category: 'themes',
      title: 'Set Theme: Classic Noir',
      description: 'Sleek dark monochrome layout styled for stark minimalists.',
      icon: Palette,
      shortcut: 'T N',
      action: () => {
        setCurrentTheme('classic-noir');
        localStorage.setItem('look_vision_theme', 'classic-noir');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '🖤 Aesthetic converted to Classic Noir' }));
      }
    },
    {
      id: 'theme-cyber-couture',
      category: 'themes',
      title: 'Set Theme: Cyber Couture',
      description: 'Futuristic aesthetic skin glowing with high-voltage violet and fuchsia gradients.',
      icon: Palette,
      shortcut: 'T C',
      action: () => {
        setCurrentTheme('cyber-couture');
        localStorage.setItem('look_vision_theme', 'cyber-couture');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '🔮 Aesthetic converted to Cyber Couture' }));
      }
    },
    {
      id: 'theme-nordic-editorial',
      category: 'themes',
      title: 'Set Theme: Nordic Editorial',
      description: 'Warm earth-stone layout paired with comfortable editorial beige accents.',
      icon: Palette,
      shortcut: 'T E',
      action: () => {
        setCurrentTheme('nordic-editorial');
        localStorage.setItem('look_vision_theme', 'nordic-editorial');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '🪵 Aesthetic converted to Nordic Editorial' }));
      }
    },
    {
      id: 'theme-cosmic-dream',
      category: 'themes',
      title: 'Set Theme: Cosmic Dream (Default)',
      description: 'Starlight deep indigo canvas built with premium cosmic styling.',
      icon: Palette,
      shortcut: 'T D',
      action: () => {
        setCurrentTheme('cosmic-dream');
        localStorage.setItem('look_vision_theme', 'cosmic-dream');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '🌌 Aesthetic converted to Cosmic Dream' }));
      }
    },
    {
      id: 'theme-solar-day',
      category: 'themes',
      title: 'Set Theme: Solar Day',
      description: 'Clean bright light mode for daytime coordination.',
      icon: Palette,
      shortcut: 'T S',
      action: () => {
        setCurrentTheme('solar-day');
        localStorage.setItem('look_vision_theme', 'solar-day');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '☀️ Aesthetic converted to Solar Day' }));
      }
    },

    // --- SYSTEM ACTIONS ---
    {
      id: 'act-dna-scan',
      category: 'actions',
      title: 'Calibrate & Trigger Style DNA Scan',
      description: 'Re-index physical measurements and render dynamic fashion taxonomy.',
      icon: Cpu,
      shortcut: '⌘ S',
      action: () => {
        onNavigate('PROFILE');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '🔄 DNA scanning sequence loaded' }));
        }, 100);
      }
    },
    {
      id: 'act-open-ai-chat',
      category: 'actions',
      title: 'Consult Intelligent AI Style Companion',
      description: 'Ask questions, prompt designs, or request fit matching in real-time.',
      icon: Sparkles,
      shortcut: '⌘ K',
      action: () => {
        window.dispatchEvent(new CustomEvent('lookvision_open_ai_chat'));
      }
    },
    {
      id: 'act-toggle-2fa',
      category: 'actions',
      title: 'Toggle 2FA Encrypted Simulation',
      description: 'Enable or disable the verification shield credential ledger.',
      icon: Shield,
      action: () => {
        const current = localStorage.getItem('user_security_2fa') === 'true';
        localStorage.setItem('user_security_2fa', String(!current));
        window.dispatchEvent(new CustomEvent('look_vision_2fa_toggle'));
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { 
          detail: `🔒 Multi-factor simulation ${!current ? 'ENABLED' : 'DISABLED'}` 
        }));
      }
    },

    // --- VIBES & AESTHETICS ---
    {
      id: 'vibe-gorpcore',
      category: 'vibes',
      title: 'Aesthetic Alignment: Gorpcore',
      description: 'Functional technical wear, trail-ready layers, earthy tones.',
      icon: Globe,
      action: () => {
        onNavigate('PRODUCT_COMMUNITY');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '🌿 Filtered community styles by #Gorpcore' }));
      }
    },
    {
      id: 'vibe-cyberpunk',
      category: 'vibes',
      title: 'Aesthetic Alignment: Cyberpunk / Neo-Tokyo',
      description: 'High-contrast neon techwear, structural visors, and glowing fiber skins.',
      icon: Globe,
      action: () => {
        onNavigate('PRODUCT_COMMUNITY');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '🗼 Filtered community styles by #Cyberpunk' }));
      }
    },
    {
      id: 'vibe-quiet-luxury',
      category: 'vibes',
      title: 'Aesthetic Alignment: Quiet Luxury',
      description: 'Bespoke tailoring, cashmere slate, monochrome, zero branding.',
      icon: Globe,
      action: () => {
        onNavigate('PRODUCT_COMMUNITY');
        window.dispatchEvent(new CustomEvent('lookvision_show_toast', { detail: '💼 Filtered community styles by #QuietLuxury' }));
      }
    }
  ];

  // Auto-focus input on mount/open
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setActiveIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Global keydown listeners for keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Toggle spotlight with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          window.dispatchEvent(new CustomEvent('lookvision_open_focus_search'));
        }
      }

      // Close on escape
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Handle up/down arrow and enter key inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setActiveIndex(prev => (prev + 1) % filteredItems.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setActiveIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[activeIndex]) {
        filteredItems[activeIndex].action();
        onClose();
      } else if (search.trim()) {
        executeNaturalCommand(search);
      }
    }
  };

  // Click outside close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Filter items based on search query and category tab
  const items = getSearchItems();
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Ensure active index stays in bounds when list changes
  useEffect(() => {
    setActiveIndex(0);
  }, [search, selectedCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 bg-[#050508]/85 backdrop-blur-md flex items-start justify-center pt-24 px-4 select-none"
        >
          <motion.div
            initial={{ scale: 0.97, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            ref={containerRef}
            className={`w-full max-w-2xl bg-[#09090f] border border-white/5 rounded-2xl overflow-hidden shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col max-h-[480px] ${
              currentTheme === 'solar-day' ? 'bg-[#faf9f6] border-stone-200 text-stone-900' : ''
            }`}
          >
            {/* Search Input Area */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 relative">
              <Search className={`w-4 h-4 ${currentTheme === 'solar-day' ? 'text-stone-400' : 'text-zinc-500'}`} />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search anything, set themes, trigger actions..."
                className={`bg-transparent outline-none border-none text-[13px] w-full placeholder-zinc-500 focus:ring-0 ${
                  currentTheme === 'solar-day' ? 'text-stone-900' : 'text-zinc-100'
                }`}
              />
              
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-mono font-medium text-zinc-400 uppercase leading-none shadow-sm border border-zinc-700/50">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-black/10 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
              {(['all', 'navigation', 'themes', 'actions', 'vibes'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[9.5px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-violet-600 text-white font-medium shadow-sm'
                      : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Results Area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar min-h-[150px]">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === activeIndex;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-violet-500/10 text-violet-300 border border-violet-500/15 shadow-sm' 
                          : 'bg-transparent text-zinc-400 border border-transparent hover:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-violet-500/15 text-violet-300' : 'bg-white/5 text-zinc-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className={`block text-[11.5px] font-semibold leading-tight ${
                            isSelected ? 'text-zinc-200' : 'text-zinc-300'
                          }`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-0.5 block leading-normal font-light">
                            {item.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.shortcut && (
                          <span className="text-[8px] font-mono bg-zinc-800/40 text-zinc-500 border border-white/5 px-1.5 py-0.5 rounded uppercase">
                            {item.shortcut}
                          </span>
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 opacity-40 transition-transform duration-200 ${
                          isSelected ? 'translate-x-0.5 opacity-80 text-violet-400' : ''
                        }`} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 px-4 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-violet-400 mx-auto stroke-[1.5]" />
                  <p className="text-[11.5px] text-zinc-300 font-medium">
                    Route "{search}" via Central Intelligence Engine
                  </p>
                  <button
                    type="button"
                    onClick={() => executeNaturalCommand(search)}
                    disabled={isRoutingCommand}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-medium shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{isRoutingCommand ? 'Routing Command...' : 'Execute AI Command (↵)'}</span>
                  </button>
                  <p className="text-[9.5px] text-zinc-500 leading-normal max-w-sm mx-auto">
                    Try commands like "open my wardrobe", "let's go to marketplace", or "change my theme to avant-garde".
                  </p>
                </div>
              )}
            </div>

            {/* Help Footer */}
            <div className="px-4 py-2.5 bg-black/35 border-t border-white/5 text-[9px] font-mono text-zinc-500 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.1 bg-zinc-800 text-zinc-400 rounded">↑↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.1 bg-zinc-800 text-zinc-400 rounded">↵</kbd>
                  to select
                </span>
              </div>
              <span className="text-[8px] tracking-wider text-violet-400/50 uppercase">
                Look Vision Quantum Search Engine
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
