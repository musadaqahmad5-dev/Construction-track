import { useState, useEffect } from 'react';
import { FeedItem } from '../features/feed/feedTypes';

export interface StyleScores {
  minimalist: number;
  streetwear: number;
  luxury: number;
  experimental: number;
}

export interface EngagementMetrics {
  likes: number;
  saves: number;
  tryons: number;
  purchases: number;
}

export function useStyleProfile() {
  const [metrics, setMetrics] = useState<EngagementMetrics>(() => {
    try {
      const saved = localStorage.getItem('sartorial_engagement_metrics');
      return saved ? JSON.parse(saved) : { likes: 0, saves: 0, tryons: 0, purchases: 0 };
    } catch {
      return { likes: 0, saves: 0, tryons: 0, purchases: 0 };
    }
  });

  const [scores, setScores] = useState<StyleScores>(() => {
    try {
      const saved = localStorage.getItem('sartorial_style_scores');
      return saved ? JSON.parse(saved) : { minimalist: 40, streetwear: 35, luxury: 30, experimental: 25 };
    } catch {
      return { minimalist: 40, streetwear: 35, luxury: 30, experimental: 25 };
    }
  });

  const [lastVisit, setLastVisit] = useState<string | null>(() => {
    return localStorage.getItem('sartorial_last_visit_time');
  });

  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [simulatedNewStylesCount, setSimulatedNewStylesCount] = useState(0);

  // Initialize and update last visit tracking for retention messages
  useEffect(() => {
    const now = new Date();
    const ts = now.toISOString();
    
    if (lastVisit) {
      // Calculate hours since last visit to make it feel extremely realistic
      const diffMs = now.getTime() - new Date(lastVisit).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours > 0.1) { // Show welcome back banner if more than 6 minutes have passed (for testing convenience too!)
        // Generate a random-looking number of new styles (e.g. 8 to 14 drops)
        const counts = Math.floor(Math.random() * 7) + 8;
        setSimulatedNewStylesCount(counts);
        setShowWelcomeBack(true);
      }
    } else {
      // First visit ever: set defaults but don't show return banner
      setSimulatedNewStylesCount(0);
      setShowWelcomeBack(false);
    }
    
    try {
      localStorage.setItem('sartorial_last_visit_time', ts);
    } catch (e) {
      console.warn("Storage limits restricted save of last visit timestamp:", e);
    }
  }, [lastVisit]);

  // Save state helpers
  useEffect(() => {
    try {
      localStorage.setItem('sartorial_engagement_metrics', JSON.stringify(metrics));
    } catch (e) {
      console.warn(e);
    }
  }, [metrics]);

  useEffect(() => {
    try {
      localStorage.setItem('sartorial_style_scores', JSON.stringify(scores));
    } catch (e) {
      console.warn(e);
    }
  }, [scores]);

  // Adjust style score when an action takes place
  const trackInteraction = (action: 'like' | 'save' | 'tryon' | 'buy', item: FeedItem) => {
    // 1. Update Metrics
    setMetrics(prev => {
      const copy = { ...prev };
      if (action === 'like') copy.likes += 1;
      if (action === 'save') copy.saves += 1;
      if (action === 'tryon') copy.tryons += 1;
      if (action === 'buy') copy.purchases += 1;
      return copy;
    });

    // 2. Adjust Style Scores based on item category and vibeTags
    setScores(prev => {
      const updated = { ...prev };
      const tags = (item.vibeTags || []).map(t => t.toLowerCase());
      const cat = (item.category || '').toLowerCase();
      const isExpensive = item.price && item.price >= 180;

      // Adjuster weight factor
      let scale = 1.0;
      if (action === 'save') scale = 1.5;
      if (action === 'tryon') scale = 2.0;
      if (action === 'buy') scale = 3.0;

      // Category / Tag triggers
      if (tags.includes('minimalist') || tags.includes('classic') || cat === 'formal') {
        updated.minimalist = Math.min(100, Math.round(updated.minimalist + 2 * scale));
      }
      
      if (tags.includes('streetwear') || tags.includes('casual') || cat === 'casual' || cat === 'sportswear') {
        updated.streetwear = Math.min(100, Math.round(updated.streetwear + 2.5 * scale));
      }

      if (tags.includes('luxury') || tags.includes('boutique') || isExpensive) {
        updated.luxury = Math.min(100, Math.round(updated.luxury + 3 * scale));
      }

      // Any Try-On, Outfit look, or tags like "vintage" or custom actions fuel experimental score
      if (action === 'tryon' || item.type === 'outfit' || tags.includes('vintage') || tags.includes('custom')) {
        updated.experimental = Math.min(100, Math.round(updated.experimental + 2.8 * scale));
      }

      // Slightly normalize to keep them aligned
      return updated;
    });
  };

  const getPrimaryStyleName = () => {
    const list = [
      { id: 'minimalist', label: 'Minimalist Taste', value: scores.minimalist },
      { id: 'streetwear', label: 'Streetwear Explorer', value: scores.streetwear },
      { id: 'luxury', label: 'Luxury Focused', value: scores.luxury },
      { id: 'experimental', label: 'Experimental Stylist', value: scores.experimental },
    ];
    // Sort descending by score value
    list.sort((a, b) => b.value - a.value);
    return list[0].label;
  };

  return {
    metrics,
    scores,
    showWelcomeBack,
    dismissWelcomeBack: () => setShowWelcomeBack(false),
    simulatedNewStylesCount,
    trackInteraction,
    getPrimaryStyleName,
    setScores,
    setMetrics
  };
}
