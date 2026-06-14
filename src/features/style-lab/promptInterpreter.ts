export interface PromptIntent {
  intensity: 'low' | 'medium' | 'high';
  aestheticShift?: 'minimalist' | 'cyberpunk' | 'luxury' | 'streetwear' | 'classic';
  mutateColors: boolean;
  mutateFabrics: boolean;
  lockLayers: ('base' | 'inner' | 'mid' | 'outer' | 'acc')[];
  remixTheme: string;
}

export class PromptInterpreter {
  /**
   * Translates NLP custom prompts into clear parameter mutation commands.
   */
  static interpretPrompt(text: string): PromptIntent {
    const raw = text.toLowerCase().trim();

    let aestheticShift: PromptIntent['aestheticShift'] = undefined;
    let intensity: PromptIntent['intensity'] = 'medium';
    let mutateColors = false;
    let mutateFabrics = false;
    const lockLayers: PromptIntent['lockLayers'] = [];

    // Aesthetic scanning
    if (raw.includes('cyber') || raw.includes('stealth')) aestheticShift = 'cyberpunk';
    else if (raw.includes('street') || raw.includes('hype')) aestheticShift = 'streetwear';
    else if (raw.includes('lux') || raw.includes('gold') || raw.includes('sartorial')) aestheticShift = 'luxury';
    else if (raw.includes('clean') || raw.includes('minimal')) aestheticShift = 'minimalist';
    else if (raw.includes('classic') || raw.includes('heritage') || raw.includes('suit')) aestheticShift = 'classic';

    // Mutation triggers
    if (raw.includes('color') || raw.includes('hue') || raw.includes('shade') || raw.includes('tint')) {
      mutateColors = true;
    }
    if (raw.includes('fabric') || raw.includes('wool') || raw.includes('material') || raw.includes('leather') || raw.includes('silk')) {
      mutateFabrics = true;
    }

    // Locks
    if (raw.includes('keep jacket') || raw.includes('lock coat') || raw.includes('lock outer')) {
      lockLayers.push('outer');
    }
    if (raw.includes('keep active shirt') || raw.includes('lock shirt') || raw.includes('lock base')) {
      lockLayers.push('inner');
    }
    if (raw.includes('keep pants') || raw.includes('lock pants')) {
      lockLayers.push('mid');
    }

    if (raw.includes('heavy') || raw.includes('completely') || raw.includes('drastic')) {
      intensity = 'high';
    } else if (raw.includes('subtle') || raw.includes('slight') || raw.includes('gentle')) {
      intensity = 'low';
    }

    // Default to both true if not specified to allow fresh remolding
    if (!mutateColors && !mutateFabrics) {
      mutateColors = true;
      mutateFabrics = true;
    }

    return {
      intensity,
      aestheticShift,
      mutateColors,
      mutateFabrics,
      lockLayers,
      remixTheme: text
    };
  }
}
