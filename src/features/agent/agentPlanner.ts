import { WardrobeItem } from '../../types';

export interface OutfitPlan {
  id: string;
  date: string; // YYYY-MM-DD
  occasion: string;
  weatherLabel: string;
  itemIds: string[];
  notes: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'completed';
}

export class AgentPlanner {
  /**
   * Proposes a sequence of plans for the week, each targeting a distinct style goal.
   */
  static generateWeeklyProposals(
    wardrobe: WardrobeItem[],
    days: string[], // dates e.g. ['2026-06-13', '2026-06-14']
    occasionList: string[],
    weatherLabel: string
  ): OutfitPlan[] {
    const plans: OutfitPlan[] = [];
    const availableItems = wardrobe.filter(i => i.status === 'In Closet');

    days.forEach((day, index) => {
      const occasion = occasionList[index % occasionList.length] || 'Casual Outing';
      
      // select distinct items per day if possible to maintain rotation diversity
      const sliceStart = (index * 2) % Math.max(1, availableItems.length);
      const chosenItems = availableItems.slice(sliceStart, sliceStart + 2);
      
      if (chosenItems.length > 0) {
        plans.push({
          id: `plan-${day}`,
          date: day,
          occasion,
          weatherLabel,
          itemIds: chosenItems.map(i => i.id),
          notes: `Optimized rotation index targeting the ${occasion} occasion using un-fatigued items: ${chosenItems.map(x => x.title).join(', ')}.`,
          status: 'pending_approval'
        });
      }
    });

    return plans;
  }

  /**
   * Evaluates if planning is complete or requires user action.
   */
  static checkCompletion(plans: OutfitPlan[]): boolean {
    return plans.every(p => p.status === 'approved' || p.status === 'rejected' || p.status === 'completed');
  }
}
