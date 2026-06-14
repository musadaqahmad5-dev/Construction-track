export interface VisualPreset {
  id: 'indoor_office' | 'outdoor_park' | 'urban_chic' | 'gala_evening';
  contextName: string;
  backgroundTheme: string; // Tailwind background gradient or style
  accentColor: string;
  lightingMode: 'soft' | 'natural_ambient' | 'dramatic_spot' | 'golden_hour';
}

export class SceneComposer {
  private static readonly PRESETS: Record<string, VisualPreset> = {
    'Work': {
      id: 'indoor_office',
      contextName: 'Corporate Architecture',
      backgroundTheme: 'from-slate-100 to-slate-200 text-slate-800',
      accentColor: 'indigo-600',
      lightingMode: 'soft'
    },
    'Casual': {
      id: 'outdoor_park',
      contextName: 'Sunlit Boulevard',
      backgroundTheme: 'from-amber-50 to-orange-100 text-amber-900',
      accentColor: 'amber-600',
      lightingMode: 'golden_hour'
    },
    'Sport': {
      id: 'urban_chic',
      contextName: 'Industrial Concrete Gym',
      backgroundTheme: 'from-zinc-100 to-zinc-300 text-zinc-900',
      accentColor: 'rose-600',
      lightingMode: 'natural_ambient'
    },
    'Event': {
      id: 'gala_evening',
      contextName: 'Nocturnal Spotlight Lounge',
      backgroundTheme: 'from-slate-900 to-indigo-950 text-slate-100 dark',
      accentColor: 'violet-400',
      lightingMode: 'dramatic_spot'
    }
  };

  /**
   * Translates styling agendas to responsive scenographic backgrounds.
   */
  static composeScene(agenda: string): VisualPreset {
    const lower = agenda.toLowerCase();
    if (lower.includes('work') || lower.includes('office') || lower.includes('corporate') || lower.includes('meeting')) {
      return this.PRESETS['Work'];
    }
    if (lower.includes('event') || lower.includes('dinner') || lower.includes('party') || lower.includes('date')) {
      return this.PRESETS['Event'];
    }
    if (lower.includes('sport') || lower.includes('gym') || lower.includes('run') || lower.includes('outdoor')) {
      return this.PRESETS['Sport'];
    }
    return this.PRESETS['Casual'];
  }
}
