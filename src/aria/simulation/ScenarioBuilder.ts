/**
 * ARIA v2.5 Scenario Builder
 * Product: LOOK VISION v2.4
 */

import { SimulationScenarioConfig, SimulationScenarioType } from './SimulationTypes';

export class ScenarioBuilder {
  public static createScenario(
    type: SimulationScenarioType,
    params: SimulationScenarioConfig['parameters'],
    customTitle?: string,
    customDesc?: string
  ): SimulationScenarioConfig {
    const id = `scenario_${type}_${Date.now()}`;
    
    let defaultTitle = 'Custom Fashion Scenario';
    let defaultDesc = 'Simulated scenario analysis';

    switch (type) {
      case 'add_item':
        defaultTitle = `Add Item: ${params.itemCategory || 'Wardrobe Piece'}`;
        defaultDesc = `Simulate impact of adding ${params.itemDetails || params.itemCategory || 'a new garment'} to wardrobe compatibility.`;
        break;
      case 'remove_item':
        defaultTitle = `Remove Item: ${params.itemCategory || 'Wardrobe Piece'}`;
        defaultDesc = `Simulate impact of removing ${params.itemDetails || params.itemCategory || 'a garment'} on outfit versatility.`;
        break;
      case 'capsule_conversion':
        defaultTitle = 'Capsule Wardrobe Conversion';
        defaultDesc = 'Simulate streamlining current wardrobe into a high-versatility 15-piece capsule.';
        break;
      case 'seasonal_transition':
        defaultTitle = `Seasonal Transition: ${params.targetSeason || 'Next Season'}`;
        defaultDesc = `Simulate seasonal wardrobe evolution for ${params.targetSeason || 'upcoming climate shift'}.`;
        break;
      case 'budget_plan':
        defaultTitle = `Budget Shopping Plan ($${params.budgetLimit || 500})`;
        defaultDesc = `Simulate optimal high-ROI wardrobe acquisitions within $${params.budgetLimit || 500} constraint.`;
        break;
      case 'occasion_planning':
        defaultTitle = `Occasion Planning: ${params.targetOccasion || 'Special Event'}`;
        defaultDesc = `Simulate outfit preparedness and gap analysis for ${params.targetOccasion || 'upcoming event'}.`;
        break;
      case 'palette_change':
        defaultTitle = `Color Palette Shift: ${params.colorHex || 'Accent Color'}`;
        defaultDesc = `Simulate incorporating ${params.colorHex || 'new palette vector'} across existing collection.`;
        break;
      case 'style_evolution':
        defaultTitle = `Style Evolution: ${params.styleShiftGoal || 'Elevated Aesthetic'}`;
        defaultDesc = `Simulate 6-month aesthetic progression towards ${params.styleShiftGoal || 'target archetype'}.`;
        break;
      case 'brand_shift':
        defaultTitle = `Brand Shift: ${params.targetBrand || 'Luxury Brand'}`;
        defaultDesc = `Simulate introducing ${params.targetBrand || 'target brand aesthetic'} into daily rotation.`;
        break;
      case 'wardrobe_optimization':
        defaultTitle = 'Wardrobe Optimization';
        defaultDesc = 'Simulate maximizing outfit combination efficiency and removing redundant pieces.';
        break;
    }

    return {
      scenarioId: id,
      type,
      title: customTitle || defaultTitle,
      description: customDesc || defaultDesc,
      parameters: params,
      createdAt: new Date().toISOString()
    };
  }
}
