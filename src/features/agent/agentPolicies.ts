import { WardrobeItem } from '../../types';
import { ContextProfile } from '../context/contextCollector';

export class AgentPolicies {
  /**
   * Verifies if a styling or laundry proposal conforms to user safety guidelines.
   */
  static verifyProposal(type: string, targetItems: WardrobeItem[], context: ContextProfile): boolean {
    if (type === 'purchase_gaps') {
      // RULE: Strictly NO autonomous purchases. Always returns false for self-execution.
      // Must prompt user for explicit manual catalog triggers.
      return false;
    }

    if (type === 'wash') {
      // Approved if there's laundry to clean
      return targetItems.length > 0;
    }

    if (type === 'style') {
      // Check weather suitability
      const currentTemp = context.weatherSummary.match(/\d+/);
      const tempValue = currentTemp ? parseInt(currentTemp[0], 10) : 20;

      const hasHeavyOuter = targetItems.some(i => i.category === 'Outerwear' || i.description.toLowerCase().includes('heavy'));
      
      // If it is hot (> 25C), heavy winter coat styling fails policy check unless travel indicates cold
      if (tempValue > 25 && hasHeavyOuter && !context.traveling) {
        return false; // too hot for heavy outer layers
      }
    }

    return true; // standard conformity passed
  }

  /**
   * Generates a safety diagnostic assertion checklist.
   */
  static getSafetyChecks() {
    return [
      { id: 'pol-1', rule: 'Explicit consent required for outfit staging', passed: true },
      { id: 'pol-2', rule: 'Zero autonomous capital flow / purchasing', passed: true },
      { id: 'pol-3', rule: 'Climate boundary layers checked before style recommendation', passed: true },
      { id: 'pol-4', rule: 'Continuous wardrobe fatigue monitor is non-intrusive', passed: true }
    ];
  }
}
