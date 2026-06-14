import { WardrobeItem } from '../../types';

export interface PlanDaySchedule {
  dayNumber: number;
  dayName: string; // e.g. Monday
  agenda: string;
  suggestedItems: WardrobeItem[];
  vibeTag: string;
  packingLayerHint: string;
}

export interface CoordinatedWearPlan {
  planId: string;
  themeTitle: string;
  durationDays: number;
  schedules: PlanDaySchedule[];
  commonBases: WardrobeItem[]; // Reusable garments present across multiple days for travel efficiency
}

export class WearPlanGenerator {
  /**
   * Generates a multi-day structured outfit allocation blueprint matching specified agendas.
   */
  static constructPlan(
    items: WardrobeItem[],
    tripDaysCount: number = 3,
    destinationAgendas: string[] = ['Business Presentation', 'Urban Exploration', 'Cocktail Meetup']
  ): CoordinatedWearPlan {
    const planId = `plan_execution_${Date.now()}`;
    const durationDays = Math.min(7, Math.max(1, tripDaysCount));
    const dayNames = ['Day 1 - Arrival', 'Day 2 - Main Event', 'Day 3 - Departure', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

    const schedules: PlanDaySchedule[] = [];

    // Separate items by categories to schedule intelligently
    const pantsList = items.filter(i => {
      const cat = i.category.toLowerCase();
      return cat.includes('pant') || cat.includes('jeans') || cat.includes('short') || cat.includes('skirt');
    });

    const topsList = items.filter(i => {
      const cat = i.category.toLowerCase();
      return cat === 'casual' || cat === 'formal' || cat === 'sportswear';
    });

    const outerList = items.filter(i => i.category.toLowerCase() === 'outerwear');

    // Build schedules for each day
    for (let dayIndex = 0; dayIndex < durationDays; dayIndex++) {
      const agenda = destinationAgendas[dayIndex % destinationAgendas.length];
      const dayName = dayNames[dayIndex % dayNames.length];

      // Grab items based on rotating indexes
      const daySuggested: WardrobeItem[] = [];
      
      const top = topsList[dayIndex % Math.max(1, topsList.length)];
      if (top) daySuggested.push(top);

      const pants = pantsList[dayIndex % Math.max(1, pantsList.length)];
      if (pants) daySuggested.push(pants);

      const outer = outerList[dayIndex % Math.max(1, outerList.length)];
      if (outer) daySuggested.push(outer);

      schedules.push({
        dayNumber: dayIndex + 1,
        dayName,
        agenda,
        suggestedItems: daySuggested,
        vibeTag: agenda.toLowerCase().includes('business') ? 'Structured Classic' : 'Comfort Sport',
        packingLayerHint: outer ? 'Dual-layered with high insulation jacket' : 'Single layered comfort fit'
      });
    }

    // Identify shared common items (reused items) across different days to reduce bag weight
    const allAssignedIds = schedules.flatMap(s => s.suggestedItems.map(i => i.id));
    const frequency: Record<string, number> = {};
    allAssignedIds.forEach(id => {
      frequency[id] = (frequency[id] || 0) + 1;
    });

    const commonBases = items.filter(item => frequency[item.id] > 1);

    return {
      planId,
      themeTitle: durationDays >= 3 ? 'Extended Multi-Scenario Travel' : 'Weekend City Break Outline',
      durationDays,
      schedules,
      commonBases
    };
  }
}
