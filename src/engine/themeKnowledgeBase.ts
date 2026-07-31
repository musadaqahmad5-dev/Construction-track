export type EntityCategory =
  | 'Physical Objects'
  | 'Materials'
  | 'Natural Elements'
  | 'Atmospheric Elements'
  | 'Optical Phenomena'
  | 'Surface Types'
  | 'Environmental Conditions'
  | 'Energy Types'
  | 'Motion Types'
  | 'Structural Forms'
  | 'Scientific Objects'
  | 'Luxury Objects'
  | 'Organic Objects'
  | 'Artificial Objects'
  | 'Biological Objects';

export type BehaviourCategory =
  | 'Calm'
  | 'Aggressive'
  | 'Elegant'
  | 'Heavy'
  | 'Floating'
  | 'Natural'
  | 'Mechanical'
  | 'Organic'
  | 'Electric'
  | 'Liquid'
  | 'Crystal'
  | 'Soft'
  | 'Sharp'
  | 'Silent'
  | 'Energetic'
  | 'Infinite'
  | 'Minimal'
  | 'Luxury'
  | 'Sacred'
  | 'Mystical'
  | 'Scientific';

export type RelationType =
  | 'generates'
  | 'supports'
  | 'originates_from'
  | 'contains'
  | 'reflects'
  | 'manifests_as'
  | 'transforms_into'
  | 'derived_from'
  | 'similar_to';

export interface BehaviourDescriptor {
  id: string;
  name: string;
  category: BehaviourCategory;
  intensity: number;
  speed: number;
  energy: number;
  density: number;
  mood: string;
  scale: string;
  tags: string[];
}

export interface PhenomenonDescriptor {
  id: string;
  name: string;
  spectrum: string[];
  coat: 'Deep' | 'Soft' | 'Glossy' | 'Matte' | 'Velvet' | 'Pearl' | 'Crystal' | 'Metallic';
  energyLevel: number;
  brightness: number;
  glow: number;
  glassEffect: boolean;
  tags: string[];
}

export interface SurfaceDescriptor {
  id: string;
  name: string;
  finish: string;
  reflectivity: number;
  roughness: number;
  tactileFeel: string;
  tags: string[];
}

export interface MaterialDescriptor {
  id: string;
  name: string;
  density: number;
  translucency: number;
  durability: number;
  texture: string;
  tags: string[];
}

export interface SemanticRelation {
  sourceId: string;
  targetId: string;
  relationType: RelationType;
  weight: number;
}

export interface KnowledgeEntity {
  id: string;
  name: string;
  category: EntityCategory;
  aliases: string[];
  tags: string[];
  isPhysical: boolean;
  isPermanentCandidate: boolean;
  isPhenomenonCandidate: boolean;
  isFoundationCandidate: boolean;
  dominantColor: string;
  secondaryColors: string[];
  behaviour: BehaviourDescriptor;
  phenomenon?: PhenomenonDescriptor;
  surface?: SurfaceDescriptor;
  material?: MaterialDescriptor;
  relations: SemanticRelation[];
}

const ENTITY_REGISTRY: Record<string, KnowledgeEntity> = {
  sky: {
    id: 'sky',
    name: 'Celestial Vault',
    category: 'Atmospheric Elements',
    aliases: ['sky', 'atmosphere', 'firmament', 'heavens', 'air'],
    tags: ['blue', 'infinite', 'natural', 'vast', 'atmospheric', 'clear', 'ether'],
    isPhysical: true,
    isPermanentCandidate: true,
    isPhenomenonCandidate: false,
    isFoundationCandidate: true,
    dominantColor: '#0a192f',
    secondaryColors: ['#172a45', '#38bdf8', '#0284c7'],
    behaviour: {
      id: 'beh_sky',
      name: 'Atmospheric Stillness',
      category: 'Infinite',
      intensity: 0.2,
      speed: 0.1,
      energy: 0.3,
      density: 0.1,
      mood: 'Serene & Boundless',
      scale: 'Cosmic',
      tags: ['calm', 'expansion', 'tranquil', 'silent']
    },
    surface: {
      id: 'surf_sky',
      name: 'Diffuse Ether',
      finish: 'Matte Glass',
      reflectivity: 0.15,
      roughness: 0.05,
      tactileFeel: 'Weightless Air',
      tags: ['smooth', 'diffuse']
    },
    relations: [
      { sourceId: 'sky', targetId: 'rainbow', relationType: 'generates', weight: 0.95 },
      { sourceId: 'sky', targetId: 'sunlight', relationType: 'contains', weight: 0.9 },
      { sourceId: 'sky', targetId: 'aurora', relationType: 'manifests_as', weight: 0.85 }
    ]
  },
  rainbow: {
    id: 'rainbow',
    name: 'Prismatic Prism Arc',
    category: 'Optical Phenomena',
    aliases: ['rainbow', 'prism', 'spectrum', 'iridescence'],
    tags: ['spectrum', 'chromatic', 'vibrant', 'refraction', 'light', 'color'],
    isPhysical: false,
    isPermanentCandidate: false,
    isPhenomenonCandidate: true,
    isFoundationCandidate: false,
    dominantColor: '#8b5cf6',
    secondaryColors: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'],
    behaviour: {
      id: 'beh_rainbow',
      name: 'Prismatic Motion',
      category: 'Floating',
      intensity: 0.7,
      speed: 0.4,
      energy: 0.8,
      density: 0.3,
      mood: 'Radiant & Dynamic',
      scale: 'Panoramic',
      tags: ['vivid', 'flowing', 'luminous']
    },
    phenomenon: {
      id: 'phen_rainbow',
      name: 'Spectral Dispersion',
      spectrum: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#6366f1', '#a855f7'],
      coat: 'Glossy',
      energyLevel: 0.85,
      brightness: 0.9,
      glow: 0.8,
      glassEffect: true,
      tags: ['prismatic', 'chromatic', 'iridescent']
    },
    relations: [
      { sourceId: 'rainbow', targetId: 'sky', relationType: 'originates_from', weight: 0.95 },
      { sourceId: 'rainbow', targetId: 'sunlight', relationType: 'derived_from', weight: 0.9 }
    ]
  },
  ocean: {
    id: 'ocean',
    name: 'Abyssal Waters',
    category: 'Natural Elements',
    aliases: ['ocean', 'sea', 'deep', 'water', 'abyss', 'marine'],
    tags: ['fluid', 'deep', 'blue', 'heavy', 'liquid', 'vast', 'tidal'],
    isPhysical: true,
    isPermanentCandidate: true,
    isPhenomenonCandidate: false,
    isFoundationCandidate: true,
    dominantColor: '#030712',
    secondaryColors: ['#0f172a', '#0284c7', '#06b6d4'],
    behaviour: {
      id: 'beh_ocean',
      name: 'Tidal Rhythm',
      category: 'Liquid',
      intensity: 0.6,
      speed: 0.3,
      energy: 0.7,
      density: 0.85,
      mood: 'Deep & Resonant',
      scale: 'Planetary',
      tags: ['breathing', 'undulating', 'heavy']
    },
    material: {
      id: 'mat_ocean',
      name: 'Dense Fluid Mass',
      density: 0.9,
      translucency: 0.6,
      durability: 0.95,
      texture: 'Liquid Smoothness',
      tags: ['fluid', 'dense', 'hydro']
    },
    relations: [
      { sourceId: 'ocean', targetId: 'wave', relationType: 'generates', weight: 0.98 },
      { sourceId: 'ocean', targetId: 'ocean_floor', relationType: 'supports', weight: 0.92 }
    ]
  },
  wave: {
    id: 'wave',
    name: 'Hydro-Surge Undulation',
    category: 'Motion Types',
    aliases: ['wave', 'surge', 'ripple', 'foam', 'crest', 'tide'],
    tags: ['fluid', 'motion', 'dynamic', 'surge', 'water', 'energy'],
    isPhysical: false,
    isPermanentCandidate: false,
    isPhenomenonCandidate: true,
    isFoundationCandidate: false,
    dominantColor: '#0284c7',
    secondaryColors: ['#38bdf8', '#bae6fd', '#0369a1'],
    behaviour: {
      id: 'beh_wave',
      name: 'Wave Motion',
      category: 'Liquid',
      intensity: 0.8,
      speed: 0.6,
      energy: 0.8,
      density: 0.6,
      mood: 'Energetic & Flowing',
      scale: 'Mesoscale',
      tags: ['pulse', 'crest', 'rhythmic']
    },
    phenomenon: {
      id: 'phen_wave',
      name: 'Hydro Dynamic Pulse',
      spectrum: ['#0284c7', '#38bdf8', '#06b6d4', '#e0f2fe'],
      coat: 'Pearl',
      energyLevel: 0.75,
      brightness: 0.7,
      glow: 0.5,
      glassEffect: true,
      tags: ['hydro', 'ripple', 'wave']
    },
    relations: [
      { sourceId: 'wave', targetId: 'ocean', relationType: 'originates_from', weight: 0.98 },
      { sourceId: 'wave', targetId: 'foam', relationType: 'manifests_as', weight: 0.75 }
    ]
  },
  ocean_floor: {
    id: 'ocean_floor',
    name: 'Abyssal Basalt Bed',
    category: 'Structural Forms',
    aliases: ['ocean_floor', 'seabed', 'basalt', 'trench', 'benthos'],
    tags: ['dark', 'solid', 'foundation', 'submerged', 'deep', 'ancient'],
    isPhysical: true,
    isPermanentCandidate: false,
    isPhenomenonCandidate: false,
    isFoundationCandidate: true,
    dominantColor: '#020617',
    secondaryColors: ['#0f172a', '#1e293b'],
    behaviour: {
      id: 'beh_seabed',
      name: 'Static Abyssal Bed',
      category: 'Heavy',
      intensity: 0.1,
      speed: 0.05,
      energy: 0.2,
      density: 0.98,
      mood: 'Silent & Immense',
      scale: 'Geological',
      tags: ['immovable', 'anchored', 'silent']
    },
    relations: [
      { sourceId: 'ocean_floor', targetId: 'ocean', relationType: 'supports', weight: 0.95 }
    ]
  },
  diamond: {
    id: 'diamond',
    name: 'Crystalline Diamond Lattice',
    category: 'Luxury Objects',
    aliases: ['diamond', 'adamant', 'jewel', 'gemstone', 'brilliant'],
    tags: ['pure', 'sharp', 'luxury', 'refraction', 'crystal', 'precious', 'hard'],
    isPhysical: true,
    isPermanentCandidate: true,
    isPhenomenonCandidate: false,
    isFoundationCandidate: true,
    dominantColor: '#09090b',
    secondaryColors: ['#f8fafc', '#c084fc', '#38bdf8'],
    behaviour: {
      id: 'beh_diamond',
      name: 'Sharp Crystalline Clarity',
      category: 'Crystal',
      intensity: 0.9,
      speed: 0.5,
      energy: 0.9,
      density: 0.95,
      mood: 'Exquisite & Unyielding',
      scale: 'Micro-Precision',
      tags: ['sharp', 'pure', 'luminous']
    },
    material: {
      id: 'mat_diamond',
      name: 'Carbon Lattice Matrix',
      density: 0.99,
      translucency: 0.9,
      durability: 1.0,
      texture: 'Flawless Facet',
      tags: ['indestructible', 'faceted', 'refractive']
    },
    relations: [
      { sourceId: 'diamond', targetId: 'reflection', relationType: 'generates', weight: 0.96 },
      { sourceId: 'diamond', targetId: 'prism', relationType: 'manifests_as', weight: 0.88 }
    ]
  },
  reflection: {
    id: 'reflection',
    name: 'Specular Facet Glint',
    category: 'Optical Phenomena',
    aliases: ['reflection', 'glint', 'sparkle', 'refraction', 'luster'],
    tags: ['sparkle', 'light', 'crystalline', 'sharp', 'shimmer', 'luxury'],
    isPhysical: false,
    isPermanentCandidate: false,
    isPhenomenonCandidate: true,
    isFoundationCandidate: false,
    dominantColor: '#ffffff',
    secondaryColors: ['#e2e8f0', '#818cf8', '#f472b6'],
    behaviour: {
      id: 'beh_reflection',
      name: 'Specular Spark',
      category: 'Luxury',
      intensity: 0.95,
      speed: 0.7,
      energy: 0.85,
      density: 0.2,
      mood: 'Scintillating & Elegant',
      scale: 'Micro',
      tags: ['flash', 'brilliant', 'radiant']
    },
    phenomenon: {
      id: 'phen_reflection',
      name: 'Facet Sparkle Spectrum',
      spectrum: ['#ffffff', '#e2e8f0', '#a5b4fc', '#f472b6', '#38bdf8'],
      coat: 'Crystal',
      energyLevel: 0.9,
      brightness: 0.95,
      glow: 0.85,
      glassEffect: true,
      tags: ['scintillating', 'faceted', 'luxury']
    },
    relations: [
      { sourceId: 'reflection', targetId: 'diamond', relationType: 'originates_from', weight: 0.96 }
    ]
  },
  digital_core: {
    id: 'digital_core',
    name: 'Quantum Cyber Lattice',
    category: 'Artificial Objects',
    aliases: ['digital_core', 'cyber', 'matrix', 'quantum_mesh', 'processor', 'node'],
    tags: ['electric', 'data', 'neon', 'cybernetic', 'synthetic', 'computational'],
    isPhysical: true,
    isPermanentCandidate: true,
    isPhenomenonCandidate: false,
    isFoundationCandidate: true,
    dominantColor: '#05050a',
    secondaryColors: ['#6366f1', '#a855f7', '#06b6d4'],
    behaviour: {
      id: 'beh_cyber',
      name: 'Quantum Data Frequency',
      category: 'Electric',
      intensity: 0.85,
      speed: 0.9,
      energy: 0.95,
      density: 0.5,
      mood: 'Hyper-Efficient & Kinetic',
      scale: 'Microchip',
      tags: ['pulsing', 'coherent', 'digital']
    },
    surface: {
      id: 'surf_cyber',
      name: 'Silicon Mesh',
      finish: 'Glossy Metallic',
      reflectivity: 0.7,
      roughness: 0.1,
      tactileFeel: 'Cold Polished Alloy',
      tags: ['metallic', 'conductive']
    },
    relations: [
      { sourceId: 'digital_core', targetId: 'energy_flow', relationType: 'generates', weight: 0.97 },
      { sourceId: 'digital_core', targetId: 'hologram', relationType: 'manifests_as', weight: 0.85 }
    ]
  },
  energy_flow: {
    id: 'energy_flow',
    name: 'Neon Kinetic Stream',
    category: 'Energy Types',
    aliases: ['energy_flow', 'neon_stream', 'plasma_pulse', 'laser_grid', 'circuit_pulse'],
    tags: ['neon', 'kinetic', 'electric', 'flow', 'luminescent', 'cyber'],
    isPhysical: false,
    isPermanentCandidate: false,
    isPhenomenonCandidate: true,
    isFoundationCandidate: false,
    dominantColor: '#6366f1',
    secondaryColors: ['#818cf8', '#c084fc', '#22d3ee'],
    behaviour: {
      id: 'beh_energy_flow',
      name: 'High Frequency Pulse',
      category: 'Electric',
      intensity: 0.9,
      speed: 0.95,
      energy: 1.0,
      density: 0.3,
      mood: 'Hyperactive & Luminescent',
      scale: 'Circuit',
      tags: ['stream', 'glow', 'electric']
    },
    phenomenon: {
      id: 'phen_energy_flow',
      name: 'Plasma Stream Spectrum',
      spectrum: ['#6366f1', '#a855f7', '#06b6d4', '#ec4899'],
      coat: 'Metallic',
      energyLevel: 0.95,
      brightness: 0.9,
      glow: 0.9,
      glassEffect: true,
      tags: ['luminescent', 'neon', 'high_frequency']
    },
    relations: [
      { sourceId: 'energy_flow', targetId: 'digital_core', relationType: 'originates_from', weight: 0.97 }
    ]
  },
  moon: {
    id: 'moon',
    name: 'Lunar Pearl Orb',
    category: 'Atmospheric Elements',
    aliases: ['moon', 'lunar', 'selene', 'pearl_orb', 'night_luminary'],
    tags: ['silky', 'pearl', 'night', 'gentle', 'luminescent', 'subtle', 'mystical'],
    isPhysical: true,
    isPermanentCandidate: true,
    isPhenomenonCandidate: false,
    isFoundationCandidate: true,
    dominantColor: '#0b0f19',
    secondaryColors: ['#f8fafc', '#e2e8f0', '#94a3b8'],
    behaviour: {
      id: 'beh_moon',
      name: 'Lunar Serenity',
      category: 'Soft',
      intensity: 0.3,
      speed: 0.2,
      energy: 0.4,
      density: 0.4,
      mood: 'Ethereal & Poised',
      scale: 'Orbital',
      tags: ['soft', 'gentle', 'poised']
    },
    surface: {
      id: 'surf_moon',
      name: 'Nacreous Dust',
      finish: 'Pearl Satin',
      reflectivity: 0.5,
      roughness: 0.2,
      tactileFeel: 'Silky Dust',
      tags: ['pearl', 'satin', 'smooth']
    },
    relations: [
      { sourceId: 'moon', targetId: 'moon_glow', relationType: 'generates', weight: 0.96 },
      { sourceId: 'moon', targetId: 'pearl', relationType: 'similar_to', weight: 0.85 }
    ]
  },
  moon_glow: {
    id: 'moon_glow',
    name: 'Lunar Corona Halo',
    category: 'Optical Phenomena',
    aliases: ['moon_glow', 'halo', 'corona', 'lunar_luminescence', 'soft_radiance'],
    tags: ['glow', 'halo', 'ethereal', 'soft', 'pearl', 'luminescence'],
    isPhysical: false,
    isPermanentCandidate: false,
    isPhenomenonCandidate: true,
    isFoundationCandidate: false,
    dominantColor: '#f1f5f9',
    secondaryColors: ['#cbd5e1', '#94a3b8', '#e0e7ff'],
    behaviour: {
      id: 'beh_moon_glow',
      name: 'Subtle Aura Emission',
      category: 'Mystical',
      intensity: 0.4,
      speed: 0.2,
      energy: 0.5,
      density: 0.15,
      mood: 'Velvety & Radiant',
      scale: 'Ambient',
      tags: ['aura', 'halo', 'diffuse']
    },
    phenomenon: {
      id: 'phen_moon_glow',
      name: 'Lunar Nacreous Spectrum',
      spectrum: ['#ffffff', '#f1f5f9', '#e0e7ff', '#cbd5e1'],
      coat: 'Pearl',
      energyLevel: 0.4,
      brightness: 0.8,
      glow: 0.85,
      glassEffect: true,
      tags: ['nacreous', 'ethereal', 'halo']
    },
    relations: [
      { sourceId: 'moon_glow', targetId: 'moon', relationType: 'originates_from', weight: 0.96 }
    ]
  },
  pearl: {
    id: 'pearl',
    name: 'Nacre Pearl Sphere',
    category: 'Luxury Objects',
    aliases: ['pearl', 'nacre', 'luster', 'margarita'],
    tags: ['soft', 'smooth', 'gentle', 'pure', 'silky', 'luxury', 'iridescent'],
    isPhysical: true,
    isPermanentCandidate: true,
    isPhenomenonCandidate: false,
    isFoundationCandidate: true,
    dominantColor: '#0f172a',
    secondaryColors: ['#f8fafc', '#f1f5f9', '#e0e7ff'],
    behaviour: {
      id: 'beh_pearl',
      name: 'Silky Smooth Grace',
      category: 'Soft',
      intensity: 0.35,
      speed: 0.25,
      energy: 0.45,
      density: 0.7,
      mood: 'Gentle & Opulent',
      scale: 'Tactile',
      tags: ['smooth', 'silky', 'opulent']
    },
    material: {
      id: 'mat_pearl',
      name: 'Organic Aragonite Layer',
      density: 0.8,
      translucency: 0.4,
      durability: 0.7,
      texture: 'Nacreous Silk',
      tags: ['nacre', 'silky', 'organic']
    },
    relations: [
      { sourceId: 'pearl', targetId: 'moon_glow', relationType: 'reflects', weight: 0.88 }
    ]
  },
  flame: {
    id: 'flame',
    name: 'Incandescent Thermal Core',
    category: 'Energy Types',
    aliases: ['flame', 'fire', 'ember', 'blaze', 'pyre', 'thermal'],
    tags: ['hot', 'radiant', 'orange', 'red', 'dynamic', 'combustion', 'energetic'],
    isPhysical: true,
    isPermanentCandidate: true,
    isPhenomenonCandidate: true,
    isFoundationCandidate: false,
    dominantColor: '#0c0a09',
    secondaryColors: ['#f97316', '#ef4444', '#eab308'],
    behaviour: {
      id: 'beh_flame',
      name: 'Combustion Thermal Motion',
      category: 'Energetic',
      intensity: 0.95,
      speed: 0.85,
      energy: 0.95,
      density: 0.25,
      mood: 'Fierce & Illuminating',
      scale: 'Dynamic',
      tags: ['flicker', 'thermal', 'vibrant']
    },
    phenomenon: {
      id: 'phen_flame',
      name: 'Thermal Radiation Spectrum',
      spectrum: ['#ef4444', '#f97316', '#f59e0b', '#fef08a'],
      coat: 'Glossy',
      energyLevel: 0.95,
      brightness: 0.95,
      glow: 0.95,
      glassEffect: false,
      tags: ['thermal', 'radiant', 'fire']
    },
    relations: [
      { sourceId: 'flame', targetId: 'sunlight', relationType: 'similar_to', weight: 0.82 }
    ]
  },
  sunlight: {
    id: 'sunlight',
    name: 'Helios Solar Ray',
    category: 'Atmospheric Elements',
    aliases: ['sunlight', 'sun', 'solar', 'ray', 'daylight', 'sol'],
    tags: ['warm', 'golden', 'bright', 'radiant', 'life', 'vital'],
    isPhysical: true,
    isPermanentCandidate: true,
    isPhenomenonCandidate: false,
    isFoundationCandidate: true,
    dominantColor: '#0a0a02',
    secondaryColors: ['#fbbf24', '#f59e0b', '#fef08a'],
    behaviour: {
      id: 'beh_sunlight',
      name: 'Solar Luminance',
      category: 'Natural',
      intensity: 0.85,
      speed: 0.3,
      energy: 0.9,
      density: 0.1,
      mood: 'Exhilarating & Golden',
      scale: 'Solar System',
      tags: ['golden', 'warm', 'vital']
    },
    relations: [
      { sourceId: 'sunlight', targetId: 'rainbow', relationType: 'generates', weight: 0.92 }
    ]
  },
  aurora: {
    id: 'aurora',
    name: 'Boreal Geomagnetic Ribbon',
    category: 'Optical Phenomena',
    aliases: ['aurora', 'northern_lights', 'borealis', 'plasma_ribbon'],
    tags: ['green', 'violet', 'flowing', 'cosmic', 'ethereal', 'geomagnetic'],
    isPhysical: false,
    isPermanentCandidate: false,
    isPhenomenonCandidate: true,
    isFoundationCandidate: false,
    dominantColor: '#022c22',
    secondaryColors: ['#10b981', '#34d399', '#a855f7'],
    behaviour: {
      id: 'beh_aurora',
      name: 'Geomagnetic Wave',
      category: 'Floating',
      intensity: 0.75,
      speed: 0.45,
      energy: 0.8,
      density: 0.2,
      mood: 'Enchanting & Undulating',
      scale: 'Ionospheric',
      tags: ['curtain', 'magnetic', 'luminescent']
    },
    phenomenon: {
      id: 'phen_aurora',
      name: 'Plasma Ion Spectrum',
      spectrum: ['#10b981', '#34d399', '#06b6d4', '#c084fc'],
      coat: 'Velvet',
      energyLevel: 0.8,
      brightness: 0.85,
      glow: 0.9,
      glassEffect: true,
      tags: ['ionospheric', 'borealis', 'magnetic']
    },
    relations: [
      { sourceId: 'aurora', targetId: 'sky', relationType: 'originates_from', weight: 0.88 }
    ]
  }
};

const RELATION_GRAPH: SemanticRelation[] = Object.values(ENTITY_REGISTRY).flatMap(
  entity => entity.relations
);

function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/[^a-z0-9_\s-]/g, '');
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  let intersectionSize = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionSize++;
    }
  }
  const unionSize = new Set([...setA, ...setB]).size;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

export function searchEntity(query: string): KnowledgeEntity[] {
  const norm = normalizeQuery(query);
  if (!norm) return Object.values(ENTITY_REGISTRY);

  const tokens = norm.split(/\s+/);

  return Object.values(ENTITY_REGISTRY)
    .map(entity => {
      let score = 0;
      const nameNorm = entity.name.toLowerCase();
      const idNorm = entity.id.toLowerCase();
      const catNorm = entity.category.toLowerCase();

      if (idNorm === norm || nameNorm === norm) score += 100;
      else if (idNorm.includes(norm) || nameNorm.includes(norm)) score += 50;

      for (const alias of entity.aliases) {
        const aliasNorm = alias.toLowerCase();
        if (aliasNorm === norm) score += 80;
        else if (aliasNorm.includes(norm)) score += 40;
      }

      for (const tag of entity.tags) {
        const tagNorm = tag.toLowerCase();
        if (tagNorm === norm) score += 30;
        else if (tagNorm.includes(norm)) score += 15;
      }

      for (const token of tokens) {
        if (catNorm.includes(token)) score += 10;
        if (entity.behaviour.category.toLowerCase().includes(token)) score += 10;
      }

      return { entity, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.entity);
}

export function findRelatedEntities(entityId: string, maxDepth: number = 2): KnowledgeEntity[] {
  const cleanId = normalizeQuery(entityId);
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [{ id: cleanId, depth: 0 }];
  const results: KnowledgeEntity[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current.id)) continue;
    visited.add(current.id);

    if (current.id !== cleanId && ENTITY_REGISTRY[current.id]) {
      results.push(ENTITY_REGISTRY[current.id]);
    }

    if (current.depth < maxDepth) {
      const outgoing = RELATION_GRAPH.filter(r => r.sourceId === current.id);
      const incoming = RELATION_GRAPH.filter(r => r.targetId === current.id);

      for (const edge of outgoing) {
        if (!visited.has(edge.targetId)) {
          queue.push({ id: edge.targetId, depth: current.depth + 1 });
        }
      }
      for (const edge of incoming) {
        if (!visited.has(edge.sourceId)) {
          queue.push({ id: edge.sourceId, depth: current.depth + 1 });
        }
      }
    }
  }

  return results;
}

export function findPhysicalEntities(query?: string): KnowledgeEntity[] {
  if (!query) {
    return Object.values(ENTITY_REGISTRY).filter(e => e.isPhysical);
  }
  return searchEntity(query).filter(e => e.isPhysical);
}

export function findPhenomena(query?: string): KnowledgeEntity[] {
  if (!query) {
    return Object.values(ENTITY_REGISTRY).filter(
      e => e.isPhenomenonCandidate || e.phenomenon !== undefined
    );
  }
  return searchEntity(query).filter(
    e => e.isPhenomenonCandidate || e.phenomenon !== undefined
  );
}

export function findFoundations(query?: string): KnowledgeEntity[] {
  if (!query) {
    return Object.values(ENTITY_REGISTRY).filter(e => e.isFoundationCandidate);
  }
  return searchEntity(query).filter(e => e.isFoundationCandidate);
}

export function findBehaviourHints(query?: string): BehaviourDescriptor[] {
  const entities = query ? searchEntity(query) : Object.values(ENTITY_REGISTRY);
  return entities.map(e => e.behaviour);
}

export function findSurfaceHints(query?: string): SurfaceDescriptor[] {
  const entities = query ? searchEntity(query) : Object.values(ENTITY_REGISTRY);
  return entities.filter(e => e.surface !== undefined).map(e => e.surface!);
}

export function findMaterialHints(query?: string): MaterialDescriptor[] {
  const entities = query ? searchEntity(query) : Object.values(ENTITY_REGISTRY);
  return entities.filter(e => e.material !== undefined).map(e => e.material!);
}

export function calculateSemanticSimilarity(idA: string, idB: string): number {
  const entityA = ENTITY_REGISTRY[normalizeQuery(idA)];
  const entityB = ENTITY_REGISTRY[normalizeQuery(idB)];

  if (!entityA || !entityB) return 0;
  if (entityA.id === entityB.id) return 1.0;

  const tagsA = new Set([entityA.category, ...entityA.tags, entityA.behaviour.category]);
  const tagsB = new Set([entityB.category, ...entityB.tags, entityB.behaviour.category]);

  const tagJaccard = calculateJaccardSimilarity(tagsA, tagsB);

  const directEdge = RELATION_GRAPH.find(
    r => (r.sourceId === entityA.id && r.targetId === entityB.id) ||
         (r.sourceId === entityB.id && r.targetId === entityA.id)
  );

  const graphBonus = directEdge ? directEdge.weight * 0.4 : 0;

  return Math.min(1.0, tagJaccard * 0.6 + graphBonus);
}

export function expandSemanticGraph(
  entityIds: string[],
  depth: number = 2
): KnowledgeEntity[] {
  const resultSet = new Map<string, KnowledgeEntity>();

  for (const id of entityIds) {
    const cleanId = normalizeQuery(id);
    if (ENTITY_REGISTRY[cleanId]) {
      resultSet.set(cleanId, ENTITY_REGISTRY[cleanId]);
    }
    const related = findRelatedEntities(cleanId, depth);
    for (const item of related) {
      resultSet.set(item.id, item);
    }
  }

  return Array.from(resultSet.values());
}
