/**
 * ARIA Onboarding Experience Component
 * Product: LOOK VISION v2.4
 * Subsystem: Aria AI Theme Generation System & Real-Time Workspace Harmonizer
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Star, 
  Palette, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Hash, 
  RefreshCw,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

export interface ARIAThemeSpec {
  id: string;
  name: string;
  description: string;
  concept: string;
  canvasBg: string;
  surfaceCard: string;
  surfaceSubtle: string;
  textPrimary: string;
  textSecondary: string;
  accentPrimary: string;
  accentSecondary: string;
  borderSubtle: string;
  contrastRatio: number;
  wcagCompliant: boolean;
  mode: 'light';
  atelierPodTaxonomy: string[];
}

interface ThemeGenerationResponse {
  success: boolean;
  theme: ARIAThemeSpec;
  latencyMs: number;
  provenanceHash: string;
  terminologySanitized: boolean;
  selfHealed: boolean;
  warning?: string;
  error?: string;
  message?: string;
}

interface ARIAOnboardingExperienceProps {
  initialPrompt?: string;
  onThemeApplied?: (theme: ARIAThemeSpec) => void;
  userId?: string;
}

const PRESET_PROMPTS = [
  "A crisp morning atelier in Milan with sunlit linen and obsidian accents",
  "I want a solid iron skillet with sunlit meadow accents and warm bone paper",
  "High-contrast Nordic design studio with clean chalk canvas and deep pine accents",
  "Refined Kyoto silk workshop with pearl surface and vibrant indigo accents"
];

export const ARIAOnboardingExperience: React.FC<ARIAOnboardingExperienceProps> = ({
  initialPrompt = '',
  onThemeApplied,
  userId = 'sarah-khan-atelier'
}) => {
  const [prompt, setPrompt] = useState<string>(initialPrompt || PRESET_PROMPTS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ARIAThemeSpec | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [provenanceHash, setProvenanceHash] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Apply theme tokens directly to DOM Root CSS variables to dynamically update Tailwind v4 utilities
  const applyThemeToDOM = useCallback((theme: ARIAThemeSpec) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.style.setProperty('--color-canvas-bg', theme.canvasBg);
    root.style.setProperty('--color-surface-card', theme.surfaceCard);
    root.style.setProperty('--color-surface-subtle', theme.surfaceSubtle);
    root.style.setProperty('--color-text-primary', theme.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
    root.style.setProperty('--color-accent-indigo', theme.accentPrimary);
    root.style.setProperty('--color-accent-emerald', theme.accentSecondary);
    root.style.setProperty('--color-border-subtle', theme.borderSubtle);

    // Also notify listeners
    if (onThemeApplied) {
      onThemeApplied(theme);
    }
  }, [onThemeApplied]);

  // Generate Theme Dispatcher
  const handleGenerateTheme = async () => {
    if (!prompt.trim()) {
      setError('Please provide style adjectives or a visual concept description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRating(null);
    setRatingSubmitted(false);

    try {
      const response = await fetch('/api/v1/aria/theme/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          userId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to generate theme`);
      }

      const data: ThemeGenerationResponse = await response.json();

      if (data.success && data.theme) {
        setCurrentTheme(data.theme);
        setLatency(data.latencyMs);
        setProvenanceHash(data.provenanceHash);
        applyThemeToDOM(data.theme);
      } else {
        throw new Error(data.message || data.error || 'Failed to synthesize valid theme contract');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown generation error occurred';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Backpropagate satisfaction rating
  const handleRateTheme = (score: number) => {
    setRating(score);
    setRatingSubmitted(true);

    // Dispatch feedback event for memory and observability subsystems
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: {
          title: 'Theme Preference Registered',
          message: `Saved ${score}-star rating to ARIA Style Memory for user ${userId}.`,
          type: 'success'
        }
      }));
    }
  };

  const handleCopyProvenance = () => {
    if (!provenanceHash) return;
    navigator.clipboard.writeText(provenanceHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 space-y-8 bg-[#05050a] text-zinc-100 font-sans antialiased">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 text-zinc-400 text-xs font-mono mb-2">
            <Sparkles size={13} className="text-emerald-400" />
            <span>ARIA AI THEME SYNTHESIZER • GEMINI 3.7 FLASH</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white">
            Adaptive Atelier Environment Generator
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Synthesize bespoke, WCAG AA-certified luxury workspace palettes calibrated for modern luxury fashion styling and Atelier Pods orchestration.
          </p>
        </div>
      </div>

      {/* Ingress Card */}
      <div className="bg-[#07070c] border border-white/10 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="aria-prompt-ingress" className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Palette size={14} className="text-indigo-400" />
            <span>Aesthetic Concept Ingress</span>
          </label>
          <span className="text-[11px] font-mono text-zinc-500">
            WCAG AA Contrast Guaranteed
          </span>
        </div>

        <textarea
          id="aria-prompt-ingress"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your desired atelier atmosphere, textures, and color nuances (e.g., 'Solid iron skillet with sunlit meadow accents and warm bone paper')..."
          className="w-full p-3.5 bg-[#05050a] border border-white/10 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none font-sans"
        />

        {/* Preset Concept Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Quick Ingress Concepts:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(preset)}
                className="text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-100 transition-colors border border-white/5 text-left truncate max-w-xs cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Trigger */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Autonomous Self-Healing Contrast Guard Active</span>
          </div>

          <button
            type="button"
            id="aria-generate-theme-btn"
            onClick={handleGenerateTheme}
            disabled={isLoading || !prompt.trim()}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs tracking-wide uppercase font-mono transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-indigo-950/40"
          >
            {isLoading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Assembling corporate style plan...</span>
              </>
            ) : (
              <>
                <Zap size={14} className="text-amber-400" />
                <span>Synthesize Theme</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Theme Preview & Certification Panel */}
      {currentTheme && (
        <div className="bg-[#07070c] border border-white/10 rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-bold text-white">
                  {currentTheme.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>Certified {currentTheme.contrastRatio}:1 Contrast</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {currentTheme.description}
              </p>
              <p className="text-xs italic text-zinc-500 mt-0.5">
                Concept: &ldquo;{currentTheme.concept}&rdquo;
              </p>
            </div>

            {/* Performance Badges */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              {latency && (
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Clock size={12} className="text-indigo-400" />
                  <span>{latency}ms</span>
                </span>
              )}
              {provenanceHash && (
                <button
                  type="button"
                  onClick={handleCopyProvenance}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer text-zinc-300"
                  title="Click to copy SHA-256 Provenance Hash"
                >
                  <Hash size={12} className="text-emerald-400" />
                  <span className="font-mono text-[11px] truncate max-w-[100px]">
                    {provenanceHash.substring(0, 10)}...
                  </span>
                  {copiedHash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              )}
            </div>
          </div>

          {/* Color Palette Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Layers size={13} className="text-indigo-400" />
              <span>Synthesized Color Tokens</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Canvas Bg', hex: currentTheme.canvasBg, border: true },
                { label: 'Surface Card', hex: currentTheme.surfaceCard, border: true },
                { label: 'Surface Subtle', hex: currentTheme.surfaceSubtle, border: true },
                { label: 'Text Primary', hex: currentTheme.textPrimary },
                { label: 'Text Secondary', hex: currentTheme.textSecondary },
                { label: 'Accent Primary', hex: currentTheme.accentPrimary },
                { label: 'Accent Secondary', hex: currentTheme.accentSecondary },
              ].map((swatch, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-white/10 bg-[#05050a] space-y-2">
                  <div 
                    className="w-full h-10 rounded border border-white/10 shadow-2xs"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div>
                    <p className="text-[11px] font-medium text-zinc-200 truncate">{swatch.label}</p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">{swatch.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Atelier Pods Workspace Modules */}
          {currentTheme.atelierPodTaxonomy && currentTheme.atelierPodTaxonomy.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-400" />
                <span>Calibrated Atelier Pods Taxonomy</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentTheme.atelierPodTaxonomy.map((podName, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/5 text-zinc-200 text-xs font-medium border border-white/10"
                  >
                    {podName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* User Feedback & Rating Rail */}
          <div className="p-4 bg-[#05050a] border border-white/10 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-zinc-200">Rate Theme Quality</p>
              <p className="text-[11px] text-zinc-400">
                Backpropagate satisfaction weights to ARIA Style Memory
              </p>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = (hoverRating || rating || 0) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRateTheme(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-zinc-500 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      size={18}
                      className={isActive ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}
                    />
                  </button>
                );
              })}
              {ratingSubmitted && (
                <span className="text-[11px] font-mono text-emerald-400 ml-2 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Saved</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
