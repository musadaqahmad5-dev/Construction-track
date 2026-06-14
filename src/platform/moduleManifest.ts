export interface ModuleInfo {
  id: string;
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  dependencies: string[];
  permissions: string[];
}

export const PLATFORM_MODULES: ModuleInfo[] = [
  {
    id: 'mod-styling',
    name: 'Styling Core Engine',
    version: '1.2.0',
    description: 'Calculates baseline weather and style coherence weights.',
    enabled: true,
    dependencies: [],
    permissions: ['filesystem:read']
  },
  {
    id: 'mod-agent',
    name: 'Personal Style Agent',
    version: '1.0.0',
    description: 'Proactive outfit curation, repetition detection, and morning schedule planning.',
    enabled: true,
    dependencies: ['mod-styling'],
    permissions: ['filesystem:read', 'notifications']
  },
  {
    id: 'mod-wardrobe-health',
    name: 'Wardrobe Longevity Tracker',
    version: '1.0.0',
    description: 'Predicts garment decay, wear frequency stress, and wash cues.',
    enabled: true,
    dependencies: ['mod-styling'],
    permissions: []
  },
  {
    id: 'mod-tryon-lookbook',
    name: 'Visual Fit Studio',
    version: '1.1.0',
    description: 'Simulates visual overlays, scene compositions, and gap completions.',
    enabled: true,
    dependencies: ['mod-styling'],
    permissions: ['rendering']
  }
];
