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
    version: '2.4-telemetry',
    description: 'Calculates baseline weather and style coherence weights.',
    enabled: true,
    dependencies: [],
    permissions: ['filesystem:read']
  },
  {
    id: 'mod-agent',
    name: 'Personal Style Agent',
    version: '2.4-telemetry',
    description: 'Proactive outfit curation, repetition detection, and morning schedule planning.',
    enabled: true,
    dependencies: ['mod-styling'],
    permissions: ['filesystem:read', 'notifications']
  },
  {
    id: 'mod-wardrobe-health',
    name: 'Wardrobe Longevity Tracker',
    version: '2.4-telemetry',
    description: 'Predicts garment decay, wear frequency stress, and wash cues.',
    enabled: true,
    dependencies: ['mod-styling'],
    permissions: []
  },
  {
    id: 'mod-tryon-lookbook',
    name: 'Visual Fit Studio',
    version: '2.4-telemetry',
    description: 'Simulates visual overlays, scene compositions, and gap completions.',
    enabled: true,
    dependencies: ['mod-styling'],
    permissions: ['rendering']
  }
];
