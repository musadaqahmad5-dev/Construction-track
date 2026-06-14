import { RenderedLook } from '../rendering/outfitRenderer';

export interface VisualMemoryRecord {
  id: string;
  recordId: string; // fallback matching TS usage in AIStyleHub
  timestamp: string;
  createdTimestamp: string; // fallback matching TS usage in AIStyleHub
  look: RenderedLook;
  renderedLook: RenderedLook; // fallback matching TS usage in AIStyleHub
  vibeSnapshot: string;
  notes?: string;
  noteLogged?: string; // fallback matching TS usage in AIStyleHub
}

export class VisualTimeline {
  private static records: VisualMemoryRecord[] = [];

  static saveRenderToMemory(look: RenderedLook, notes?: string) {
    const id = `vis-${Date.now()}`;
    const record: VisualMemoryRecord = {
      id,
      recordId: id,
      timestamp: new Date().toLocaleDateString(),
      createdTimestamp: new Date().toLocaleDateString(),
      look,
      renderedLook: look,
      vibeSnapshot: look.heroLook.aestheticVibe,
      notes,
      noteLogged: notes || ''
    };
    this.records.unshift(record);
    if (this.records.length > 25) {
      this.records.pop();
    }
  }

  static getSavedMemoryTimeline(): VisualMemoryRecord[] {
    // Return sample entries if currently empty, maintaining visual elegance on startup
    if (this.records.length === 0) {
      this.records = [
        {
          id: 'vis-1',
          recordId: 'vis-1',
          timestamp: 'June 10',
          createdTimestamp: 'June 10',
          vibeSnapshot: 'Cyberpunk',
          notes: 'High weather-proofing test suite',
          noteLogged: 'High weather-proofing test suite',
          look: {
            renderId: 'rnd-pre-1',
            heroLook: {
              title: 'Waterproof Stealth Core Alpha',
              description: 'Ripstop heavy cargo with magnetic attachments.',
              aestheticVibe: 'Cyberpunk',
              imageUrl: 'from-zinc-900 via-emerald-950 to-black'
            },
            alternates: [],
            palette: { name: 'Thermal Stealth Map', hexes: ['#000000', '#10B981', '#18181B'] },
            garmentLayers: [
              { layer: 'inner', title: 'Thermo-Knit Compression Tee', description: 'Thermal regulation base', color: '#18181B' },
              { layer: 'outer', title: 'Stealth-Weave Utility Parka', description: 'Abrasion proof tactical protection', color: '#000000' }
            ],
            confidence: 94
          },
          renderedLook: {
            renderId: 'rnd-pre-1',
            heroLook: {
              title: 'Waterproof Stealth Core Alpha',
              description: 'Ripstop heavy cargo with magnetic attachments.',
              aestheticVibe: 'Cyberpunk',
              imageUrl: 'from-zinc-900 via-emerald-950 to-black'
            },
            alternates: [],
            palette: { name: 'Thermal Stealth Map', hexes: ['#000000', '#10B981', '#18181B'] },
            garmentLayers: [
              { layer: 'inner', title: 'Thermo-Knit Compression Tee', description: 'Thermal regulation base', color: '#18181B' },
              { layer: 'outer', title: 'Stealth-Weave Utility Parka', description: 'Abrasion proof tactical protection', color: '#000000' }
            ],
            confidence: 94
          }
        },
        {
          id: 'vis-2',
          recordId: 'vis-2',
          timestamp: 'June 11',
          createdTimestamp: 'June 11',
          vibeSnapshot: 'Minimalist',
          notes: 'Draped cotton architectural layers',
          noteLogged: 'Draped cotton architectural layers',
          look: {
            renderId: 'rnd-pre-2',
            heroLook: {
              title: 'Architectural Slate Draped Tunic Set',
              description: 'Zero excess seam minimal style tailoring.',
              aestheticVibe: 'Minimalist',
              imageUrl: 'from-stone-100 to-stone-400'
            },
            alternates: [],
            palette: { name: 'Muted Architectural Stone Map', hexes: ['#F5F5F4', '#D6D3D1', '#1C1917'] },
            garmentLayers: [
              { layer: 'inner', title: 'Oversized Raw Linen Tunic', description: 'Fine textured relaxed neck fit', color: '#F5F5F4' },
              { layer: 'mid', title: 'Flat-Front Linen Drifter Trouser', description: 'Loose straight leg fit comfort', color: '#D6D3D1' }
            ],
            confidence: 88
          },
          renderedLook: {
            renderId: 'rnd-pre-2',
            heroLook: {
              title: 'Architectural Slate Draped Tunic Set',
              description: 'Zero excess seam minimal style tailoring.',
              aestheticVibe: 'Minimalist',
              imageUrl: 'from-stone-100 to-stone-400'
            },
            alternates: [],
            palette: { name: 'Muted Architectural Stone Map', hexes: ['#F5F5F4', '#D6D3D1', '#1C1917'] },
            garmentLayers: [
              { layer: 'inner', title: 'Oversized Raw Linen Tunic', description: 'Fine textured relaxed neck fit', color: '#F5F5F4' },
              { layer: 'mid', title: 'Flat-Front Linen Drifter Trouser', description: 'Loose straight leg fit comfort', color: '#D6D3D1' }
            ],
            confidence: 88
          }
        }
      ];
    }
    return this.records;
  }

  static clearTimeline() {
    this.records = [];
  }
}
