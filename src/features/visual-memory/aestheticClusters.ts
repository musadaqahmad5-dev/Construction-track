import { VisualMemoryRecord } from './visualTimeline';

export interface ClusterMetrics {
  clusterName: string;
  representationCount: number;
  percentageRatio: number; // 0 to 100
  colorAffinity: string; // Hex color mapping
}

export class AestheticClusters {
  /**
   * Translates visual timelines into aesthetic clusters.
   */
  static compileClusterSectors(records: VisualMemoryRecord[]): ClusterMetrics[] {
    const list = records.map(r => r.vibeSnapshot);
    if (list.length === 0) {
      return [
        { clusterName: 'Minimalist', representationCount: 6, percentageRatio: 50, colorAffinity: '#78716C' },
        { clusterName: 'Cyberpunk', representationCount: 4, percentageRatio: 33, colorAffinity: '#10B981' },
        { clusterName: 'Classic', representationCount: 2, percentageRatio: 17, colorAffinity: '#1E3A8A' }
      ];
    }

    const counter: Record<string, number> = {};
    list.forEach((v) => {
      counter[v] = (counter[v] || 0) + 1;
    });

    const total = list.length;
    const colors: Record<string, string> = {
      'Minimalist': '#78716C',
      'Cyberpunk': '#10B981',
      'Luxury': '#78350F',
      'Streetwear': '#EA580C',
      'Classic': '#1E3A8A'
    };

    const out: ClusterMetrics[] = Object.keys(counter).map((key) => {
      const percentage = Math.round((counter[key] / total) * 100);
      return {
        clusterName: key,
        representationCount: counter[key],
        percentageRatio: percentage,
        colorAffinity: colors[key] || '#4B5563'
      };
    });

    // Sort descending
    return out.sort((a, b) => b.representationCount - a.representationCount);
  }

  /**
   * Calculates "vibe polar displacement" index.
   * If they are sticking to one vibe, displacement remains low (stability);
   * if they quickly shift between distinct styles (Cyberpunk vs. Luxury), displacement is high.
   */
  static calculateIdentityDrift(records: VisualMemoryRecord[]): number {
    if (records.length < 2) return 1.2;

    let changes = 0;
    for (let i = 1; i < records.length; i++) {
      if (records[i].vibeSnapshot !== records[i - 1].vibeSnapshot) {
        changes++;
      }
    }

    const driftVal = parseFloat(((changes / (records.length - 1)) * 5).toFixed(1));
    return Math.max(Math.min(driftVal, 10.0), 0.5);
  }
}
