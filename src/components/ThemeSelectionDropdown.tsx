import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check, ChevronDown, Sparkles, ShieldCheck } from 'lucide-react';
import {
  MINIMAL_LIGHT_PALETTES,
  MinimalLightPaletteId,
  MinimalLightPalette,
  getStoredPaletteId,
  applyThemeToHtmlRoot,
  syncThemeToFirestore
} from '../features/theme/minimalLightThemes';

interface ThemeSelectionDropdownProps {
  userId?: string;
  onThemeChange?: (palette: MinimalLightPalette) => void;
  className?: string;
  variant?: 'compact' | 'full';
}

export const ThemeSelectionDropdown: React.FC<ThemeSelectionDropdownProps> = ({
  userId = 'guest-sartorialist-user-100',
  onThemeChange,
  className = '',
  variant = 'compact'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePaletteId, setActivePaletteId] = useState<MinimalLightPaletteId>(() => getStoredPaletteId());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activePalette = MINIMAL_LIGHT_PALETTES[activePaletteId] || MINIMAL_LIGHT_PALETTES.MINIMAL_OFFWHITE;

  // Initialize theme on HTML root on mount
  useEffect(() => {
    applyThemeToHtmlRoot(activePalette);
  }, []);

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectPalette = async (paletteId: MinimalLightPaletteId) => {
    const selected = MINIMAL_LIGHT_PALETTES[paletteId];
    if (!selected) return;

    setActivePaletteId(paletteId);
    setIsOpen(false);

    // 1. Update HTML Root attributes and CSS properties
    applyThemeToHtmlRoot(selected);

    // 2. Notify parent callback if provided
    onThemeChange?.(selected);

    // 3. Update Google Cloud Firestore
    setIsSyncing(true);
    try {
      const result = await syncThemeToFirestore(userId, selected);
      if (result.success) {
        setLastSyncStatus(`Synced to ${selected.name}`);
      } else {
        setLastSyncStatus(`Locally cached: ${selected.name}`);
      }
    } catch {
      setLastSyncStatus(`Locally cached: ${selected.name}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const palettesList = Object.values(MINIMAL_LIGHT_PALETTES);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select workspace light palette"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-zinc-800 border border-zinc-200/80 shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer text-xs font-medium"
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-black/10 flex items-center justify-center shrink-0 shadow-xs"
          style={{ backgroundColor: activePalette.canvasBg }}
          title={`Active Background: ${activePalette.canvasBg}`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: activePalette.accentPrimary }}
          />
        </span>

        <span className="font-sans font-semibold text-zinc-900 tracking-tight">
          {activePalette.name}
        </span>

        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200/60">
          {activePalette.canvasBg}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Minimal Light Theme Variants"
          className="absolute right-0 md:left-0 z-50 mt-2 w-80 rounded-2xl bg-white border border-zinc-200 shadow-xl shadow-zinc-900/10 p-2.5 space-y-1 animate-fade-in backdrop-blur-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Header */}
          <div className="px-2.5 py-2 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
                Light Theme Palette
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              WCAG AA
            </span>
          </div>

          <p className="px-2.5 pt-1 pb-1.5 text-[11px] text-zinc-600 leading-snug">
            Choose a minimal light workspace variant with high-contrast typography:
          </p>

          {/* Palette Items */}
          <div className="space-y-1">
            {palettesList.map((palette) => {
              const isSelected = palette.id === activePaletteId;
              return (
                <button
                  key={palette.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectPalette(palette.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-50 border-indigo-500/40 shadow-xs'
                      : 'bg-white hover:bg-zinc-50/80 border-transparent hover:border-zinc-200'
                  }`}
                >
                  {/* Swatch Previews */}
                  <div
                    className="w-9 h-9 rounded-lg border border-black/10 flex flex-col items-center justify-center relative shrink-0 shadow-xs mt-0.5"
                    style={{ backgroundColor: palette.canvasBg }}
                  >
                    <div
                      className="w-5 h-2.5 rounded-xs border border-black/5 mb-1"
                      style={{ backgroundColor: palette.surfaceCard }}
                    />
                    <div
                      className="w-2.5 h-1.5 rounded-full"
                      style={{ backgroundColor: palette.accentPrimary }}
                    />
                  </div>

                  {/* Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-zinc-900 truncate">
                        {palette.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-1 py-0.2 rounded border border-zinc-200/50 shrink-0">
                        {palette.canvasBg}
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-600 line-clamp-1 leading-normal font-sans">
                      {palette.tagline}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[9px] text-zinc-600">
                      <span>Contrast: {palette.contrastRatio}:1</span>
                      <span>•</span>
                      <span>Card: #FFFFFF</span>
                    </div>
                  </div>

                  {/* Selection Mark */}
                  <div className="shrink-0 pt-1">
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-zinc-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note & status */}
          <div className="px-2.5 pt-2 pb-1 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-600 font-mono">
            <span>Syncs to Firestore & HTML</span>
            {isSyncing ? (
              <span className="text-indigo-600 animate-pulse">Syncing...</span>
            ) : lastSyncStatus ? (
              <span className="text-emerald-600 truncate max-w-[140px]">{lastSyncStatus}</span>
            ) : (
              <span className="text-zinc-600">Live Active</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
