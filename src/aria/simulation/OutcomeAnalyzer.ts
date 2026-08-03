/**
 * ARIA v2.5 Outcome Analyzer
 * Product: LOOK VISION v2.4
 */

import { AlternativeOutcome, SimulationScenarioConfig } from './SimulationTypes';

export class OutcomeAnalyzer {
  public static generateAlternativeOutcomes(scenario: SimulationScenarioConfig): AlternativeOutcome[] {
    switch (scenario.type) {
      case 'add_item':
        return [
          {
            outcomeId: 'alt_1',
            title: 'Opt for Modular Neutral Piece',
            description: 'Selecting a neutral shade garment increases overall capsule pairing options by 18%.',
            versatilityScore: 0.94,
            keyTradeoff: 'Slightly lower dramatic impact in exchange for higher daily utility.'
          },
          {
            outcomeId: 'alt_2',
            title: 'Focus on Textured Layering Piece',
            description: 'Selecting a heavily textured fabric elevates visual depth without altering base color story.',
            versatilityScore: 0.89,
            keyTradeoff: 'Requires specific dry-cleaning care and seasonal storage.'
          }
        ];
      case 'budget_plan':
        return [
          {
            outcomeId: 'alt_budget_1',
            title: 'Single Investment Outerwear Piece',
            description: 'Allocating 80% of budget to one premium coat yields maximum longevity.',
            versatilityScore: 0.91,
            keyTradeoff: 'Fewer total wardrobe additions in current cycle.'
          },
          {
            outcomeId: 'alt_budget_2',
            title: '3-Piece Essential Accessories & Footwear',
            description: 'Distributing budget across leather goods elevates multiple existing outfits.',
            versatilityScore: 0.95,
            keyTradeoff: 'Does not solve core outerwear warmth or weather gaps.'
          }
        ];
      default:
        return [
          {
            outcomeId: 'alt_gen_1',
            title: 'Conservative Incremental Shift',
            description: 'Adopt changes gradually over a 3-month trial period to test comfort level.',
            versatilityScore: 0.92,
            keyTradeoff: 'Slower evolution pace but zero risk of wardrobe misalignment.'
          },
          {
            outcomeId: 'alt_gen_2',
            title: 'Full Capsule Transition',
            description: 'Execute complete wardrobe consolidation immediately for peak aesthetic focus.',
            versatilityScore: 0.96,
            keyTradeoff: 'Requires purging low-frequency garments.'
          }
        ];
    }
  }
}
