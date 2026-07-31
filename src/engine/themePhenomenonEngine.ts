export interface PermanentEntity {
  id: string;
  name: string;
  category: 'element' | 'matter' | 'digital' | 'cosmic' | 'luxurious' | 'biological';
  description: string;
  backgroundColor: string;
  secondaryBackgroundColor: string;
  backgroundGradient: string;
  patternTexture: string;
  depthIndex: number;
  atmosphereFeeling: string;
}

export interface PhenomenonEntity {
  id: string;
  name: string;
  eventType: 'radiation' | 'refraction' | 'discharge' | 'luminescence' | 'fluidity' | 'crystallization';
  description: string;
  visualSpectrum: string[];
  shellBorderColor: string;
  shellGlowColor: string;
  glowIntensity: number;
  refractionBlurPx: number;
  animationVelocitySec: number;
  particleDensity: number;
}

export interface ThemeCoat {
  id: string;
  name: string;
  materialTexture: string;
  surfaceFinish: string;
  opacity: number;
  blendMode: 'overlay' | 'screen' | 'color-dodge' | 'multiply' | 'soft-light';
  noiseGrainFactor: number;
  luxurySheenLevel: number;
}

export interface ShellCoat {
  id: string;
  name: string;
  reflectionCoefficient: number;
  energyPulseRateHz: number;
  spectralShiftFrequency: number;
  edgeIlluminationColor: string;
  motionCurve: string;
  glassmorphicBlurRadiusPx: number;
}

export interface FoundationEntity {
  id: string;
  name: string;
  description: string;
  clickRippleColor: string;
  impactShockwaveVelocityMs: number;
  tactileSoundFrequencyHz: number;
  hapticFeedbackPattern: number[];
  pulseScaleExpansion: number;
}

export interface ClickVisualResponse {
  rippleColor: string;
  rippleDurationMs: number;
  shockwaveRadiusPx: number;
  glowFlashColor: string;
  scaleFactor: number;
  hapticPattern: number[];
}

export interface ThemePhenomenonDNA {
  themeName: string;
  themeId: string;
  timestamp: number;
  permanentEntity: PermanentEntity;
  phenomenonEntity: PhenomenonEntity;
  themeCoat: ThemeCoat;
  shellCoat: ShellCoat;
  foundationEntity: FoundationEntity;
  clickResponse: ClickVisualResponse;
  cssVariables: Record<string, string>;
  tailwindClasses: {
    background: string;
    shellBorder: string;
    shellGlow: string;
    textAccent: string;
    interactiveRipple: string;
  };
}

export type ThemeDNA = ThemePhenomenonDNA;

export interface ThemeGenerationPipelineInput {
  themeName: string;
  customOverrides?: Partial<ThemePhenomenonDNA>;
}

export interface PipelineExecutionLog {
  step: string;
  outputSummary: string;
  timestamp: number;
}

export const THEME_PHENOMENON_JSON_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ThemePhenomenonDNA',
  type: 'object',
  required: [
    'themeName',
    'themeId',
    'timestamp',
    'permanentEntity',
    'phenomenonEntity',
    'themeCoat',
    'shellCoat',
    'foundationEntity',
    'clickResponse',
    'cssVariables',
    'tailwindClasses'
  ],
  properties: {
    themeName: { type: 'string' },
    themeId: { type: 'string' },
    timestamp: { type: 'number' },
    permanentEntity: {
      type: 'object',
      required: [
        'id',
        'name',
        'category',
        'description',
        'backgroundColor',
        'secondaryBackgroundColor',
        'backgroundGradient',
        'patternTexture',
        'depthIndex',
        'atmosphereFeeling'
      ],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        category: { type: 'string', enum: ['element', 'matter', 'digital', 'cosmic', 'luxurious', 'biological'] },
        description: { type: 'string' },
        backgroundColor: { type: 'string' },
        secondaryBackgroundColor: { type: 'string' },
        backgroundGradient: { type: 'string' },
        patternTexture: { type: 'string' },
        depthIndex: { type: 'number' },
        atmosphereFeeling: { type: 'string' }
      }
    },
    phenomenonEntity: {
      type: 'object',
      required: [
        'id',
        'name',
        'eventType',
        'description',
        'visualSpectrum',
        'shellBorderColor',
        'shellGlowColor',
        'glowIntensity',
        'refractionBlurPx',
        'animationVelocitySec',
        'particleDensity'
      ],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        eventType: { type: 'string', enum: ['radiation', 'refraction', 'discharge', 'luminescence', 'fluidity', 'crystallization'] },
        description: { type: 'string' },
        visualSpectrum: { type: 'array', items: { type: 'string' } },
        shellBorderColor: { type: 'string' },
        shellGlowColor: { type: 'string' },
        glowIntensity: { type: 'number' },
        refractionBlurPx: { type: 'number' },
        animationVelocitySec: { type: 'number' },
        particleDensity: { type: 'number' }
      }
    },
    themeCoat: {
      type: 'object',
      required: ['id', 'name', 'materialTexture', 'surfaceFinish', 'opacity', 'blendMode', 'noiseGrainFactor', 'luxurySheenLevel'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        materialTexture: { type: 'string' },
        surfaceFinish: { type: 'string' },
        opacity: { type: 'number' },
        blendMode: { type: 'string', enum: ['overlay', 'screen', 'color-dodge', 'multiply', 'soft-light'] },
        noiseGrainFactor: { type: 'number' },
        luxurySheenLevel: { type: 'number' }
      }
    },
    shellCoat: {
      type: 'object',
      required: [
        'id',
        'name',
        'reflectionCoefficient',
        'energyPulseRateHz',
        'spectralShiftFrequency',
        'edgeIlluminationColor',
        'motionCurve',
        'glassmorphicBlurRadiusPx'
      ],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        reflectionCoefficient: { type: 'number' },
        energyPulseRateHz: { type: 'number' },
        spectralShiftFrequency: { type: 'number' },
        edgeIlluminationColor: { type: 'string' },
        motionCurve: { type: 'string' },
        glassmorphicBlurRadiusPx: { type: 'number' }
      }
    },
    foundationEntity: {
      type: 'object',
      required: [
        'id',
        'name',
        'description',
        'clickRippleColor',
        'impactShockwaveVelocityMs',
        'tactileSoundFrequencyHz',
        'hapticFeedbackPattern',
        'pulseScaleExpansion'
      ],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        clickRippleColor: { type: 'string' },
        impactShockwaveVelocityMs: { type: 'number' },
        tactileSoundFrequencyHz: { type: 'number' },
        hapticFeedbackPattern: { type: 'array', items: { type: 'number' } },
        pulseScaleExpansion: { type: 'number' }
      }
    },
    clickResponse: {
      type: 'object',
      required: ['rippleColor', 'rippleDurationMs', 'shockwaveRadiusPx', 'glowFlashColor', 'scaleFactor', 'hapticPattern'],
      properties: {
        rippleColor: { type: 'string' },
        rippleDurationMs: { type: 'number' },
        shockwaveRadiusPx: { type: 'number' },
        glowFlashColor: { type: 'string' },
        scaleFactor: { type: 'number' },
        hapticPattern: { type: 'array', items: { type: 'number' } }
      }
    },
    cssVariables: { type: 'object', additionalProperties: { type: 'string' } },
    tailwindClasses: {
      type: 'object',
      required: ['background', 'shellBorder', 'shellGlow', 'textAccent', 'interactiveRipple'],
      properties: {
        background: { type: 'string' },
        shellBorder: { type: 'string' },
        shellGlow: { type: 'string' },
        textAccent: { type: 'string' },
        interactiveRipple: { type: 'string' }
      }
    }
  }
};

export const PRESET_THEME_OUTPUTS: Record<string, ThemePhenomenonDNA> = {
  nature: {
    themeName: 'Nature',
    themeId: 'tp_nature_001',
    timestamp: 1770000000000,
    permanentEntity: {
      id: 'perm_nature_forest',
      name: 'Biophilic Canopy Matrix',
      category: 'biological',
      description: 'Ancient deep forest foliage with moss-laden bark and damp chlorophyll soil.',
      backgroundColor: '#03140a',
      secondaryBackgroundColor: '#062915',
      backgroundGradient: 'radial-gradient(circle at 50% 30%, #0a3d21 0%, #03140a 70%, #010a05 100%)',
      patternTexture: 'cellular-chlorophyll-mesh',
      depthIndex: 8,
      atmosphereFeeling: 'Serene, damp, grounding, organic vitality'
    },
    phenomenonEntity: {
      id: 'phen_nature_spores',
      name: 'Bioluminescent Spore Dispersion',
      eventType: 'luminescence',
      description: 'Floating micro-spores radiating soft emerald and gold luminescence in morning mist.',
      visualSpectrum: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fef08a'],
      shellBorderColor: 'rgba(16, 185, 129, 0.35)',
      shellGlowColor: 'rgba(52, 211, 153, 0.25)',
      glowIntensity: 0.75,
      refractionBlurPx: 14,
      animationVelocitySec: 4.5,
      particleDensity: 85
    },
    themeCoat: {
      id: 'coat_nature_leaf',
      name: 'Organic Silk Leaf Veil',
      materialTexture: 'translucent-leaf-venation',
      surfaceFinish: 'soft-matte-wax',
      opacity: 0.88,
      blendMode: 'soft-light',
      noiseGrainFactor: 0.04,
      luxurySheenLevel: 0.65
    },
    shellCoat: {
      id: 'shell_nature_dew',
      name: 'Dewdrop Refraction Lattice',
      reflectionCoefficient: 0.82,
      energyPulseRateHz: 1.2,
      spectralShiftFrequency: 0.4,
      edgeIlluminationColor: '#34d399',
      motionCurve: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
      glassmorphicBlurRadiusPx: 16
    },
    foundationEntity: {
      id: 'found_nature_mycelium',
      name: 'Deep Earth Mycelium Network',
      description: 'Subterranean fungal pathways carrying bio-electric signals upon impact.',
      clickRippleColor: '#10b981',
      impactShockwaveVelocityMs: 250,
      tactileSoundFrequencyHz: 432,
      hapticFeedbackPattern: [15, 30, 15],
      pulseScaleExpansion: 1.05
    },
    clickResponse: {
      rippleColor: 'rgba(16, 185, 129, 0.5)',
      rippleDurationMs: 350,
      shockwaveRadiusPx: 120,
      glowFlashColor: '#6ee7b7',
      scaleFactor: 1.03,
      hapticPattern: [15, 30, 15]
    },
    cssVariables: {
      '--tp-bg-primary': '#03140a',
      '--tp-bg-gradient': 'radial-gradient(circle at 50% 30%, #0a3d21 0%, #03140a 70%, #010a05 100%)',
      '--tp-shell-border': 'rgba(16, 185, 129, 0.35)',
      '--tp-shell-glow': 'rgba(52, 211, 153, 0.25)',
      '--tp-accent': '#10b981',
      '--tp-ripple': 'rgba(16, 185, 129, 0.5)'
    },
    tailwindClasses: {
      background: 'bg-[#03140a]',
      shellBorder: 'border-emerald-500/30',
      shellGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      textAccent: 'text-emerald-400',
      interactiveRipple: 'bg-emerald-500/40'
    }
  },
  ocean: {
    themeName: 'Ocean',
    themeId: 'tp_ocean_002',
    timestamp: 1770000000000,
    permanentEntity: {
      id: 'perm_ocean_abyss',
      name: 'Abyssal Marine Trench',
      category: 'cosmic',
      description: 'Immense deep ocean basin where pressure crystallizes light into dark cobalt hues.',
      backgroundColor: '#020b18',
      secondaryBackgroundColor: '#071e3d',
      backgroundGradient: 'linear-gradient(180deg, #020b18 0%, #062852 50%, #01060f 100%)',
      patternTexture: 'hydrodynamic-caustics-wave',
      depthIndex: 9,
      atmosphereFeeling: 'Expansive, cool, mysterious, fluid serenity'
    },
    phenomenonEntity: {
      id: 'phen_ocean_waves',
      name: 'Bioluminescent Wave Interference',
      eventType: 'fluidity',
      description: 'Interfering tidal ripples generating glowing cyan and seafoam photon crests.',
      visualSpectrum: ['#06b6d4', '#0284c7', '#38bdf8', '#7dd3fc', '#a5f3fc'],
      shellBorderColor: 'rgba(6, 182, 212, 0.4)',
      shellGlowColor: 'rgba(56, 189, 248, 0.3)',
      glowIntensity: 0.88,
      refractionBlurPx: 20,
      animationVelocitySec: 3.2,
      particleDensity: 90
    },
    themeCoat: {
      id: 'coat_ocean_mercury',
      name: 'Liquid Mercury Fluid Surface',
      materialTexture: 'hydro-sheen-ripple',
      surfaceFinish: 'polished-gloss-hydrophobia',
      opacity: 0.92,
      blendMode: 'overlay',
      noiseGrainFactor: 0.02,
      luxurySheenLevel: 0.95
    },
    shellCoat: {
      id: 'shell_ocean_barrier',
      name: 'Hydro-Refraction Barrier',
      reflectionCoefficient: 0.94,
      energyPulseRateHz: 2.0,
      spectralShiftFrequency: 0.6,
      edgeIlluminationColor: '#38bdf8',
      motionCurve: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      glassmorphicBlurRadiusPx: 22
    },
    foundationEntity: {
      id: 'found_ocean_thermal',
      name: 'Subterranean Hydrothermal Vent',
      description: 'Deep sea volcanic heat plume sending acoustic shockwaves upward.',
      clickRippleColor: '#06b6d4',
      impactShockwaveVelocityMs: 180,
      tactileSoundFrequencyHz: 528,
      hapticFeedbackPattern: [10, 40, 20],
      pulseScaleExpansion: 1.08
    },
    clickResponse: {
      rippleColor: 'rgba(6, 182, 212, 0.6)',
      rippleDurationMs: 300,
      shockwaveRadiusPx: 140,
      glowFlashColor: '#38bdf8',
      scaleFactor: 1.04,
      hapticPattern: [10, 40, 20]
    },
    cssVariables: {
      '--tp-bg-primary': '#020b18',
      '--tp-bg-gradient': 'linear-gradient(180deg, #020b18 0%, #062852 50%, #01060f 100%)',
      '--tp-shell-border': 'rgba(6, 182, 212, 0.4)',
      '--tp-shell-glow': 'rgba(56, 189, 248, 0.3)',
      '--tp-accent': '#06b6d4',
      '--tp-ripple': 'rgba(6, 182, 212, 0.6)'
    },
    tailwindClasses: {
      background: 'bg-[#020b18]',
      shellBorder: 'border-cyan-500/40',
      shellGlow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
      textAccent: 'text-cyan-400',
      interactiveRipple: 'bg-cyan-500/40'
    }
  },
  fire: {
    themeName: 'Fire',
    themeId: 'tp_fire_003',
    timestamp: 1770000000000,
    permanentEntity: {
      id: 'perm_fire_magma',
      name: 'Volcanic Magma Chamber',
      category: 'element',
      description: 'Molten subterranean core radiating intense thermal infrared pressure through dark obsidian fissures.',
      backgroundColor: '#160404',
      secondaryBackgroundColor: '#360909',
      backgroundGradient: 'radial-gradient(ellipse at 50% 100%, #450a0a 0%, #160404 60%, #080101 100%)',
      patternTexture: 'basalt-fissure-heatgrid',
      depthIndex: 7,
      atmosphereFeeling: 'Intense, energetic, incandescent, commanding power'
    },
    phenomenonEntity: {
      id: 'phen_fire_plasma',
      name: 'Plasma Arc Discharge',
      eventType: 'discharge',
      description: 'Super-heated ionizing gas arcs emitting blinding crimson, amber, and solar yellow luminescence.',
      visualSpectrum: ['#f97316', '#ef4444', '#f59e0b', '#fde047', '#ffffff'],
      shellBorderColor: 'rgba(249, 115, 22, 0.5)',
      shellGlowColor: 'rgba(239, 68, 68, 0.4)',
      glowIntensity: 0.95,
      refractionBlurPx: 12,
      animationVelocitySec: 2.1,
      particleDensity: 110
    },
    themeCoat: {
      id: 'coat_fire_obsidian',
      name: 'Smoked Obsidian Crust',
      materialTexture: 'vitreous-obsidian-glass',
      surfaceFinish: 'satin-thermal-sheen',
      opacity: 0.9,
      blendMode: 'color-dodge',
      noiseGrainFactor: 0.05,
      luxurySheenLevel: 0.88
    },
    shellCoat: {
      id: 'shell_fire_shield',
      name: 'Thermal Radiation Shield',
      reflectionCoefficient: 0.78,
      energyPulseRateHz: 3.5,
      spectralShiftFrequency: 1.2,
      edgeIlluminationColor: '#f97316',
      motionCurve: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      glassmorphicBlurRadiusPx: 12
    },
    foundationEntity: {
      id: 'found_fire_tectonic',
      name: 'Tectonic Core Friction',
      description: 'High-density mantle pressure release triggering kinetic resonance.',
      clickRippleColor: '#f97316',
      impactShockwaveVelocityMs: 120,
      tactileSoundFrequencyHz: 640,
      hapticFeedbackPattern: [20, 50, 30],
      pulseScaleExpansion: 1.10
    },
    clickResponse: {
      rippleColor: 'rgba(249, 115, 22, 0.7)',
      rippleDurationMs: 250,
      shockwaveRadiusPx: 160,
      glowFlashColor: '#fde047',
      scaleFactor: 1.05,
      hapticPattern: [20, 50, 30]
    },
    cssVariables: {
      '--tp-bg-primary': '#160404',
      '--tp-bg-gradient': 'radial-gradient(ellipse at 50% 100%, #450a0a 0%, #160404 60%, #080101 100%)',
      '--tp-shell-border': 'rgba(249, 115, 22, 0.5)',
      '--tp-shell-glow': 'rgba(239, 68, 68, 0.4)',
      '--tp-accent': '#f97316',
      '--tp-ripple': 'rgba(249, 115, 22, 0.7)'
    },
    tailwindClasses: {
      background: 'bg-[#160404]',
      shellBorder: 'border-orange-500/50',
      shellGlow: 'shadow-[0_0_35px_rgba(249,115,22,0.4)]',
      textAccent: 'text-orange-400',
      interactiveRipple: 'bg-orange-500/50'
    }
  },
  'moon pearl': {
    themeName: 'Moon Pearl',
    themeId: 'tp_moon_pearl_004',
    timestamp: 1770000000000,
    permanentEntity: {
      id: 'perm_moon_stratum',
      name: 'Lunar Dust Stratum',
      category: 'cosmic',
      description: 'Celestial lunar plateau suspended in cosmic silence, illuminated by soft opalescent light.',
      backgroundColor: '#060611',
      secondaryBackgroundColor: '#121226',
      backgroundGradient: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #060611 75%, #020206 100%)',
      patternTexture: 'nacreous-iridescent-weave',
      depthIndex: 10,
      atmosphereFeeling: 'Ethereal, luxurious, serene, celestial grace'
    },
    phenomenonEntity: {
      id: 'phen_moon_opal',
      name: 'Nacreous Opal Reflection',
      eventType: 'refraction',
      description: 'Prismatic diffraction of lunar rays creating soft violet, rose, and pearlescent silver shifts.',
      visualSpectrum: ['#e2e8f0', '#c084fc', '#93c5fd', '#f472b6', '#ffffff'],
      shellBorderColor: 'rgba(192, 132, 252, 0.35)',
      shellGlowColor: 'rgba(226, 232, 240, 0.25)',
      glowIntensity: 0.82,
      refractionBlurPx: 24,
      animationVelocitySec: 5.0,
      particleDensity: 70
    },
    themeCoat: {
      id: 'coat_moon_nacre',
      name: 'Mother of Pearl Nacre Coat',
      materialTexture: 'pearlescent-micro-strata',
      surfaceFinish: 'iridescent-satin-luster',
      opacity: 0.75,
      blendMode: 'screen',
      noiseGrainFactor: 0.01,
      luxurySheenLevel: 0.98
    },
    shellCoat: {
      id: 'shell_moon_quantum',
      name: 'Quantum Interference Film',
      reflectionCoefficient: 0.96,
      energyPulseRateHz: 0.8,
      spectralShiftFrequency: 0.3,
      edgeIlluminationColor: '#e2e8f0',
      motionCurve: 'cubic-bezier(0.16, 1, 0.3, 1)',
      glassmorphicBlurRadiusPx: 24
    },
    foundationEntity: {
      id: 'found_moon_core',
      name: 'Lunar Core Gravitational Well',
      description: 'Deep celestial gravimetric core creating harmonic ripples across space.',
      clickRippleColor: '#c084fc',
      impactShockwaveVelocityMs: 300,
      tactileSoundFrequencyHz: 852,
      hapticFeedbackPattern: [12, 25, 12],
      pulseScaleExpansion: 1.04
    },
    clickResponse: {
      rippleColor: 'rgba(192, 132, 252, 0.45)',
      rippleDurationMs: 400,
      shockwaveRadiusPx: 110,
      glowFlashColor: '#ffffff',
      scaleFactor: 1.025,
      hapticPattern: [12, 25, 12]
    },
    cssVariables: {
      '--tp-bg-primary': '#060611',
      '--tp-bg-gradient': 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #060611 75%, #020206 100%)',
      '--tp-shell-border': 'rgba(192, 132, 252, 0.35)',
      '--tp-shell-glow': 'rgba(226, 232, 240, 0.25)',
      '--tp-accent': '#c084fc',
      '--tp-ripple': 'rgba(192, 132, 252, 0.45)'
    },
    tailwindClasses: {
      background: 'bg-[#060611]',
      shellBorder: 'border-purple-400/35',
      shellGlow: 'shadow-[0_0_25px_rgba(226,232,240,0.25)]',
      textAccent: 'text-purple-300',
      interactiveRipple: 'bg-purple-400/30'
    }
  },
  'cyber ai': {
    themeName: 'Cyber AI',
    themeId: 'tp_cyber_ai_005',
    timestamp: 1770000000000,
    permanentEntity: {
      id: 'perm_cyber_neural',
      name: 'Hyper-Dimensional Neural Core',
      category: 'digital',
      description: 'Synthetic intelligence lattice operating at petabit clock speeds inside dark quantum vacuum.',
      backgroundColor: '#030308',
      secondaryBackgroundColor: '#0a0a1f',
      backgroundGradient: 'linear-gradient(135deg, #030308 0%, #0d0d2b 50%, #020205 100%)',
      patternTexture: 'photonic-circuit-grid',
      depthIndex: 9,
      atmosphereFeeling: 'Futuristic, hyper-intelligent, precise, electric momentum'
    },
    phenomenonEntity: {
      id: 'phen_cyber_synapse',
      name: 'Quantum Synaptic Flash',
      eventType: 'radiation',
      description: 'Ultra-fast photonic synaptic pulses firing along sub-micron fiber channels.',
      visualSpectrum: ['#22d3ee', '#818cf8', '#c084fc', '#f43f5e', '#38bdf8'],
      shellBorderColor: 'rgba(34, 211, 238, 0.5)',
      shellGlowColor: 'rgba(129, 140, 248, 0.4)',
      glowIntensity: 0.92,
      refractionBlurPx: 14,
      animationVelocitySec: 1.8,
      particleDensity: 120
    },
    themeCoat: {
      id: 'coat_cyber_nanotube',
      name: 'Carbon Nanotube Matrix',
      materialTexture: 'micro-carbon-weave',
      surfaceFinish: 'anodized-matte-laser',
      opacity: 0.94,
      blendMode: 'overlay',
      noiseGrainFactor: 0.03,
      luxurySheenLevel: 0.85
    },
    shellCoat: {
      id: 'shell_cyber_waveguide',
      name: 'Photonic Crystal Waveguide',
      reflectionCoefficient: 0.88,
      energyPulseRateHz: 4.0,
      spectralShiftFrequency: 1.5,
      edgeIlluminationColor: '#22d3ee',
      motionCurve: 'cubic-bezier(0, 0, 0.2, 1)',
      glassmorphicBlurRadiusPx: 14
    },
    foundationEntity: {
      id: 'found_cyber_silicon',
      name: 'Sub-Atomic Quantum Silicon',
      description: 'Superconducting qubit substrate triggering instantaneous state changes upon interaction.',
      clickRippleColor: '#22d3ee',
      impactShockwaveVelocityMs: 90,
      tactileSoundFrequencyHz: 960,
      hapticFeedbackPattern: [5, 15, 5, 15],
      pulseScaleExpansion: 1.12
    },
    clickResponse: {
      rippleColor: 'rgba(34, 211, 238, 0.7)',
      rippleDurationMs: 200,
      shockwaveRadiusPx: 180,
      glowFlashColor: '#22d3ee',
      scaleFactor: 1.06,
      hapticPattern: [5, 15, 5, 15]
    },
    cssVariables: {
      '--tp-bg-primary': '#030308',
      '--tp-bg-gradient': 'linear-gradient(135deg, #030308 0%, #0d0d2b 50%, #020205 100%)',
      '--tp-shell-border': 'rgba(34, 211, 238, 0.5)',
      '--tp-shell-glow': 'rgba(129, 140, 248, 0.4)',
      '--tp-accent': '#22d3ee',
      '--tp-ripple': 'rgba(34, 211, 238, 0.7)'
    },
    tailwindClasses: {
      background: 'bg-[#030308]',
      shellBorder: 'border-cyan-400/50',
      shellGlow: 'shadow-[0_0_30px_rgba(34,211,238,0.4)]',
      textAccent: 'text-cyan-300',
      interactiveRipple: 'bg-cyan-400/50'
    }
  },
  'luxury fashion': {
    themeName: 'Luxury Fashion',
    themeId: 'tp_luxury_fashion_006',
    timestamp: 1770000000000,
    permanentEntity: {
      id: 'perm_lux_atelier',
      name: 'Haute Couture Atelier Canopy',
      category: 'luxurious',
      description: 'Exclusive nocturnal fashion house enveloped in heavy black velvet and burnished gold metalwork.',
      backgroundColor: '#09090b',
      secondaryBackgroundColor: '#18181b',
      backgroundGradient: 'radial-gradient(circle at 50% 10%, #27272a 0%, #09090b 70%, #040405 100%)',
      patternTexture: 'jacquard-damask-emboss',
      depthIndex: 9,
      atmosphereFeeling: 'Opulent, sophisticated, tailored, velvet prestige'
    },
    phenomenonEntity: {
      id: 'phen_lux_silk',
      name: 'Specular Silk Iridescence',
      eventType: 'refraction',
      description: 'Luminous metallic sheen flowing seamlessly across heavy mulberry silk under runway spotlights.',
      visualSpectrum: ['#fbbf24', '#f59e0b', '#d97706', '#fef3c7', '#ffffff'],
      shellBorderColor: 'rgba(251, 191, 36, 0.4)',
      shellGlowColor: 'rgba(217, 119, 6, 0.3)',
      glowIntensity: 0.85,
      refractionBlurPx: 18,
      animationVelocitySec: 3.8,
      particleDensity: 65
    },
    themeCoat: {
      id: 'coat_lux_satin',
      name: 'Heavy Silk Satin Weave',
      materialTexture: 'mulberry-silk-satin',
      surfaceFinish: 'burnished-champagne-sheen',
      opacity: 0.95,
      blendMode: 'soft-light',
      noiseGrainFactor: 0.02,
      luxurySheenLevel: 0.99
    },
    shellCoat: {
      id: 'shell_lux_gilded',
      name: 'Gilded Prism Refractor',
      reflectionCoefficient: 0.96,
      energyPulseRateHz: 1.0,
      spectralShiftFrequency: 0.5,
      edgeIlluminationColor: '#fbbf24',
      motionCurve: 'cubic-bezier(0.22, 1, 0.36, 1)',
      glassmorphicBlurRadiusPx: 18
    },
    foundationEntity: {
      id: 'found_lux_loom',
      name: 'Atelier Gold Thread Loom',
      description: 'Custom hand-loomed gold filament core providing tactile tactile resonance.',
      clickRippleColor: '#fbbf24',
      impactShockwaveVelocityMs: 220,
      tactileSoundFrequencyHz: 576,
      hapticFeedbackPattern: [18, 35, 18],
      pulseScaleExpansion: 1.06
    },
    clickResponse: {
      rippleColor: 'rgba(251, 191, 36, 0.5)',
      rippleDurationMs: 320,
      shockwaveRadiusPx: 130,
      glowFlashColor: '#fef3c7',
      scaleFactor: 1.035,
      hapticPattern: [18, 35, 18]
    },
    cssVariables: {
      '--tp-bg-primary': '#09090b',
      '--tp-bg-gradient': 'radial-gradient(circle at 50% 10%, #27272a 0%, #09090b 70%, #040405 100%)',
      '--tp-shell-border': 'rgba(251, 191, 36, 0.4)',
      '--tp-shell-glow': 'rgba(217, 119, 6, 0.3)',
      '--tp-accent': '#fbbf24',
      '--tp-ripple': 'rgba(251, 191, 36, 0.5)'
    },
    tailwindClasses: {
      background: 'bg-[#09090b]',
      shellBorder: 'border-amber-400/40',
      shellGlow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
      textAccent: 'text-amber-300',
      interactiveRipple: 'bg-amber-400/40'
    }
  }
};

export class ThemePhenomenonEngine {
  private pipelineLogs: PipelineExecutionLog[] = [];

  public generate(themeInput: string): ThemePhenomenonDNA {
    const normalizedKey = themeInput.trim().toLowerCase();
    this.pipelineLogs = [];

    this.logStep('Input Theme Evaluation', `Evaluating theme input: "${themeInput}"`);

    if (PRESET_THEME_OUTPUTS[normalizedKey]) {
      this.logStep('Preset Match Found', `Exact preset match loaded for "${normalizedKey}"`);
      const preset = PRESET_THEME_OUTPUTS[normalizedKey];
      return {
        ...preset,
        timestamp: Date.now()
      };
    }

    this.logStep('Knowledge Discovery', `Analyzing semantic properties for custom theme: "${themeInput}"`);
    const category = this.detectCategory(normalizedKey);
    const primaryColor = this.generatePrimaryColor(normalizedKey, category);
    const secondaryColor = this.generateSecondaryColor(primaryColor);
    const accentColor = this.generateAccentColor(primaryColor);

    this.logStep('Permanent Detection', `Synthesizing Permanent Entity for category: ${category}`);
    const permanentEntity: PermanentEntity = {
      id: `perm_${this.sanitizeId(normalizedKey)}_${Date.now()}`,
      name: `${this.capitalizeWords(themeInput)} Permanent Matrix`,
      category,
      description: `Permanent foundation entity derived from ${themeInput} visual atmosphere.`,
      backgroundColor: primaryColor,
      secondaryBackgroundColor: secondaryColor,
      backgroundGradient: `radial-gradient(circle at 50% 30%, ${secondaryColor} 0%, ${primaryColor} 70%, #020204 100%)`,
      patternTexture: `${this.sanitizeId(normalizedKey)}-structural-weave`,
      depthIndex: 8,
      atmosphereFeeling: `Custom synthesized atmosphere for ${themeInput}`
    };

    this.logStep('Theme Color & Coat Generation', `Building theme coat and surface finish`);
    const themeCoat: ThemeCoat = {
      id: `coat_${this.sanitizeId(normalizedKey)}_${Date.now()}`,
      name: `${this.capitalizeWords(themeInput)} Surface Veil`,
      materialTexture: `${this.sanitizeId(normalizedKey)}-synthetic-texture`,
      surfaceFinish: 'satin-crystalline-finish',
      opacity: 0.88,
      blendMode: 'soft-light',
      noiseGrainFactor: 0.03,
      luxurySheenLevel: 0.8
    };

    this.logStep('Phenomenon Detection', `Synthesizing Phenomenon Entity and UI shell spectrum`);
    const spectrum = [
      accentColor,
      this.lightenColor(accentColor, 0.2),
      secondaryColor,
      this.lightenColor(primaryColor, 0.4),
      '#ffffff'
    ];

    const phenomenonEntity: PhenomenonEntity = {
      id: `phen_${this.sanitizeId(normalizedKey)}_${Date.now()}`,
      name: `${this.capitalizeWords(themeInput)} Phenomenon Spectrum`,
      eventType: 'luminescence',
      description: `Visual phenomenon spectrum associated with ${themeInput}.`,
      visualSpectrum: spectrum,
      shellBorderColor: this.hexToRgba(accentColor, 0.4),
      shellGlowColor: this.hexToRgba(accentColor, 0.25),
      glowIntensity: 0.85,
      refractionBlurPx: 16,
      animationVelocitySec: 3.5,
      particleDensity: 80
    };

    this.logStep('Shell Coat Generation', `Designing energy pulse and glassmorphic blur parameters`);
    const shellCoat: ShellCoat = {
      id: `shell_${this.sanitizeId(normalizedKey)}_${Date.now()}`,
      name: `${this.capitalizeWords(themeInput)} Shell Refractor`,
      reflectionCoefficient: 0.85,
      energyPulseRateHz: 1.5,
      spectralShiftFrequency: 0.5,
      edgeIlluminationColor: accentColor,
      motionCurve: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      glassmorphicBlurRadiusPx: 16
    };

    this.logStep('Foundation Detection', `Creating underlying kinetic foundation entity`);
    const foundationEntity: FoundationEntity = {
      id: `found_${this.sanitizeId(normalizedKey)}_${Date.now()}`,
      name: `${this.capitalizeWords(themeInput)} Kinetic Source`,
      description: `Tactile foundation entity responding to user input for ${themeInput}.`,
      clickRippleColor: accentColor,
      impactShockwaveVelocityMs: 200,
      tactileSoundFrequencyHz: 500,
      hapticFeedbackPattern: [15, 30, 15],
      pulseScaleExpansion: 1.05
    };

    this.logStep('Click Visual Response Generation', `Setting up click ripple and tactile feedback`);
    const clickResponse: ClickVisualResponse = {
      rippleColor: this.hexToRgba(accentColor, 0.5),
      rippleDurationMs: 300,
      shockwaveRadiusPx: 130,
      glowFlashColor: this.lightenColor(accentColor, 0.3),
      scaleFactor: 1.03,
      hapticPattern: [15, 30, 15]
    };

    const cssVariables: Record<string, string> = {
      '--tp-bg-primary': primaryColor,
      '--tp-bg-gradient': permanentEntity.backgroundGradient,
      '--tp-shell-border': phenomenonEntity.shellBorderColor,
      '--tp-shell-glow': phenomenonEntity.shellGlowColor,
      '--tp-accent': accentColor,
      '--tp-ripple': clickResponse.rippleColor
    };

    const tailwindClasses = {
      background: `bg-[${primaryColor}]`,
      shellBorder: 'border-violet-500/40',
      shellGlow: 'shadow-[0_0_25px_rgba(139,92,246,0.3)]',
      textAccent: 'text-violet-300',
      interactiveRipple: 'bg-violet-500/40'
    };

    this.logStep('Theme Synthesis Complete', `Generated complete Theme Phenomenon DNA for ${themeInput}`);

    return {
      themeName: this.capitalizeWords(themeInput),
      themeId: `tp_custom_${this.sanitizeId(normalizedKey)}_${Date.now()}`,
      timestamp: Date.now(),
      permanentEntity,
      phenomenonEntity,
      themeCoat,
      shellCoat,
      foundationEntity,
      clickResponse,
      cssVariables,
      tailwindClasses
    };
  }

  public getPreset(presetName: string): ThemePhenomenonDNA | undefined {
    const key = presetName.trim().toLowerCase();
    return PRESET_THEME_OUTPUTS[key];
  }

  public listPresets(): string[] {
    return Object.keys(PRESET_THEME_OUTPUTS);
  }

  public getLogs(): PipelineExecutionLog[] {
    return [...this.pipelineLogs];
  }

  private detectCategory(name: string): PermanentEntity['category'] {
    if (name.includes('fire') || name.includes('ember') || name.includes('sun')) return 'element';
    if (name.includes('cyber') || name.includes('ai') || name.includes('tech') || name.includes('matrix')) return 'digital';
    if (name.includes('lux') || name.includes('fashion') || name.includes('gold') || name.includes('velvet')) return 'luxurious';
    if (name.includes('space') || name.includes('moon') || name.includes('star') || name.includes('cosmic')) return 'cosmic';
    if (name.includes('flora') || name.includes('nature') || name.includes('leaf') || name.includes('green')) return 'biological';
    return 'matter';
  }

  private generatePrimaryColor(name: string, category: PermanentEntity['category']): string {
    if (category === 'element') return '#180606';
    if (category === 'digital') return '#04040d';
    if (category === 'luxurious') return '#0a090b';
    if (category === 'cosmic') return '#050512';
    if (category === 'biological') return '#03140a';
    return '#090a0f';
  }

  private generateSecondaryColor(primary: string): string {
    return this.lightenColor(primary, 0.15);
  }

  private generateAccentColor(primary: string): string {
    if (primary === '#180606') return '#f97316';
    if (primary === '#04040d') return '#22d3ee';
    if (primary === '#0a090b') return '#fbbf24';
    if (primary === '#050512') return '#c084fc';
    if (primary === '#03140a') return '#10b981';
    return '#6366f1';
  }

  private lightenColor(hex: string, amount: number): string {
    const cleaned = hex.replace('#', '');
    if (cleaned.length !== 6) return hex;

    let num = parseInt(cleaned, 16);
    let r = (num >> 16) + Math.round(255 * amount);
    let g = ((num >> 8) & 0x00ff) + Math.round(255 * amount);
    let b = (num & 0x0000ff) + Math.round(255 * amount);

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const cleaned = hex.replace('#', '');
    if (cleaned.length !== 6) return `rgba(99, 102, 241, ${alpha})`;
    const num = parseInt(cleaned, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private capitalizeWords(str: string): string {
    return str
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  private sanitizeId(str: string): string {
    return str.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
  }

  private logStep(step: string, outputSummary: string): void {
    this.pipelineLogs.push({
      step,
      outputSummary,
      timestamp: Date.now()
    });
  }
}

export const globalThemePhenomenonEngine = new ThemePhenomenonEngine();

export function analyzeThemePhenomenon(themeName: string): ThemePhenomenonDNA {
  return globalThemePhenomenonEngine.generate(themeName);
}

export function validateThemePhenomenonDNA(data: unknown): data is ThemePhenomenonDNA {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.themeName === 'string' &&
    typeof d.themeId === 'string' &&
    typeof d.permanentEntity === 'object' &&
    typeof d.phenomenonEntity === 'object' &&
    typeof d.themeCoat === 'object' &&
    typeof d.shellCoat === 'object' &&
    typeof d.foundationEntity === 'object' &&
    typeof d.clickResponse === 'object'
  );
}

export function exportThemeAsJsonSchema(dna: ThemePhenomenonDNA): string {
  return JSON.stringify(dna, null, 2);
}
