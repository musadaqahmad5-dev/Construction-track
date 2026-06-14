import { WardrobeItem } from '../../types';
import { SceneComposer, VisualPreset } from './sceneComposer';
import { VisualRanker, VisualScoreResult } from './visualRanker';

export interface LookbookCardResult {
  lookId: string;
  items: WardrobeItem[];
  scene: VisualPreset;
  rankResult: VisualScoreResult;
}

export interface LookbookShowcase {
  primaryLook: LookbookCardResult;
  alternativeLooks: LookbookCardResult[];
  averageVisualPerformance: number;
}

export class LookbookGenerator {
  /**
   * Generates a fully decorated mock outfit lookbook scene showcase from coordinate items list.
   */
  static compileShowcase(today: WardrobeItem[], tomorrowAlternative: WardrobeItem[], agenda: string): LookbookShowcase {
    const sceneToday = SceneComposer.composeScene(agenda);
    const sceneAlt = SceneComposer.composeScene('Casual alternative outing');

    // Rank today's look
    const valToday = VisualRanker.rankVisualComposition(today);
    const primaryLook: LookbookCardResult = {
      lookId: 'look_today_' + Date.now(),
      items: today,
      scene: sceneToday,
      rankResult: valToday
    };

    // Rank tomorrow alternative look
    const valTomorrow = VisualRanker.rankVisualComposition(tomorrowAlternative);
    const alternativeLooks: LookbookCardResult[] = [];
    if (tomorrowAlternative.length > 0) {
      alternativeLooks.push({
        lookId: 'look_tomorrow_' + Date.now(),
        items: tomorrowAlternative,
        scene: sceneAlt,
        rankResult: valTomorrow
      });
    }

    const summedRatings = valToday.visualComboScore + (tomorrowAlternative.length > 0 ? valTomorrow.visualComboScore : 0);
    const divisors = tomorrowAlternative.length > 0 ? 2 : 1;
    const averageVisualPerformance = Math.round(summedRatings / divisors);

    return {
      primaryLook,
      alternativeLooks,
      averageVisualPerformance
    };
  }
}
