export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: { id: string; label: string; ratioMultiplier: number; impressions: number; conversions: number }[];
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

let activeExperiments: Experiment[] = [
  {
    id: 'exp-recommendations-v2',
    name: 'Aesthetic Recommendations Engine V2',
    description: 'A/B test evaluating the neural multi-layer styling suggestions against classic baseline models.',
    variants: [
      { id: 'control', label: 'V1 Baseline Muted DNA', ratioMultiplier: 1.0, impressions: 320, conversions: 42 },
      { id: 'variant-a', label: 'V2 Deep Contrast DNA Engine', ratioMultiplier: 1.15, impressions: 315, conversions: 58 }
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'exp-render-cadence',
    name: 'Dynamic Render Compression Speed Check',
    description: 'Safe canary rollout testing high-compression low-latency renders to budget tiers.',
    variants: [
      { id: 'control', label: 'Uncompressed High-Fid Standard', ratioMultiplier: 1.0, impressions: 180, conversions: 22 },
      { id: 'variant-b', label: 'Compressed Rapid Render Outlets', ratioMultiplier: 0.95, impressions: 195, conversions: 31 }
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

export const getExperimentsState = (): Experiment[] => {
  return activeExperiments;
};

export const recordExperimentImpression = (experimentId: string, variantId: string) => {
  activeExperiments = activeExperiments.map(exp => {
    if (exp.id === experimentId) {
      return {
        ...exp,
        variants: exp.variants.map(v => {
          if (v.id === variantId) {
            return { ...v, impressions: v.impressions + 1 };
          }
          return v;
        })
      };
    }
    return exp;
  });
};

export const recordExperimentConversion = (experimentId: string, variantId: string) => {
  activeExperiments = activeExperiments.map(exp => {
    if (exp.id === experimentId) {
      return {
        ...exp,
        variants: exp.variants.map(v => {
          if (v.id === variantId) {
            return { ...v, conversions: v.conversions + 1 };
          }
          return v;
        })
      };
    }
    return exp;
  });
};
