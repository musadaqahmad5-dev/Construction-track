export interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  type: 'work' | '休闲' | 'sport' | 'social' | 'travel';
}

export class ScheduleInterpreter {
  /**
   * Translates typical task lists into localized styling cues.
   */
  static interpretAgenda(events: CalendarEvent[]) {
    if (events.length === 0) {
      return {
        dominantCategory: 'Casual' as const,
        suggestedFocus: 'Comfort & Loungewear',
        formalityScale: 0.3
      };
    }

    const categoriesCount = { work: 0, sport: 0, social: 0, leisure: 0 };
    events.forEach(evt => {
      if (evt.type === 'work') categoriesCount.work += 1;
      else if (evt.type === 'sport') categoriesCount.sport += 1;
      else if (evt.type === 'social') categoriesCount.social += 1;
      else categoriesCount.leisure += 1;
    });

    let dominantCategory: 'Formal' | 'Sportswear' | 'Casual' | 'Outerwear' = 'Casual';
    let suggestedFocus = 'Mixed-use versatility';
    let formalityScale = 0.5;

    if (categoriesCount.work > categoriesCount.social && categoriesCount.work > categoriesCount.sport) {
      dominantCategory = 'Formal';
      suggestedFocus = 'Sharp blazer layers & polished trousers';
      formalityScale = 0.8;
    } else if (categoriesCount.sport > categoriesCount.work && categoriesCount.sport > categoriesCount.social) {
      dominantCategory = 'Sportswear';
      suggestedFocus = 'High-elasticity materials & breathable shoes';
      formalityScale = 0.2;
    } else if (categoriesCount.social > categoriesCount.work) {
      dominantCategory = 'Casual';
      suggestedFocus = 'Elegant textures & coordinating colors';
      formalityScale = 0.6;
    }

    return {
      dominantCategory,
      suggestedFocus,
      formalityScale
    };
  }

  /**
   * Returns a sample schedule for demonstration purposes.
   */
  static getSampleSchedule(): CalendarEvent[] {
    return [
      { id: 'ev-1', time: '09:00', title: 'Product Review (Video Call)', type: 'work' },
      { id: 'ev-2', time: '13:00', title: 'Design Sprint Workshop', type: 'work' },
      { id: 'ev-3', time: '17:30', title: 'Cardio Jogging (Lake Track)', type: 'sport' },
      { id: 'ev-4', time: '19:30', title: 'Dinner with Co-founders', type: 'social' }
    ];
  }
}
