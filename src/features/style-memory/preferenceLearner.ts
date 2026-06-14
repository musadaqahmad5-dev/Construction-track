import { PersistentStyleProfile, StyleProfileMemory } from './styleProfile';
import { OutfitHistory } from './outfitHistory';
import { WardrobeItem } from '../../types';

export class PreferenceLearner {
  /**
   * Processes a reinforcement action and mutates user's persistent model weights dynamically.
   * Actions:
   *  - 'accept': Boosts chosen color priorities, rewards selected categories.
   *  - 'reject': Adds combination to blacklisted layout keys, penalizes colors within the set.
   *  - 'wear': Increases chosen outfits wearCount metrics and reinforces design choices.
   */
  static async learnFromAction(
    userId: string,
    action: 'accept' | 'reject' | 'wear',
    outfitItems: WardrobeItem[]
  ): Promise<PersistentStyleProfile> {
    console.log(`[PreferenceLearner] Running reinforcement cycles for action "${action}" on ${outfitItems.length} outfit items...`);

    const profile = await StyleProfileMemory.load(userId);
    const itemIds = outfitItems.map(item => item.id);

    // 1. Log to history archive
    await OutfitHistory.logEvent({
      userId,
      items: itemIds,
      action: action === 'wear' ? 'wear' : action === 'accept' ? 'accept' : 'reject'
    });

    if (action === 'reject') {
      // Add exact combination pattern to rejects blacklist
      const alreadyBlacklisted = profile.rejectedOutfitIds.some(
        blacklist => blacklist.length === itemIds.length && blacklist.every(id => itemIds.includes(id))
      );
      if (!alreadyBlacklisted) {
        profile.rejectedOutfitIds.push(itemIds);
      }

      // Slightly penalize primary colors of rejected items
      outfitItems.forEach(item => {
        if (item.primaryColor) {
          const colorIndex = profile.favoriteColors.indexOf(item.primaryColor);
          if (colorIndex > 0) {
            // Push towards bottom of preference lists
            profile.favoriteColors.splice(colorIndex, 1);
            profile.favoriteColors.push(item.primaryColor);
          }
        }
      });
    } else if (action === 'accept' || action === 'wear') {
      // Elevate categories and favorite colors
      outfitItems.forEach(item => {
        // Boost color priority (move to front of favoriteColors list)
        if (item.primaryColor) {
          const colorIndex = profile.favoriteColors.indexOf(item.primaryColor);
          if (colorIndex > -1) {
            profile.favoriteColors.splice(colorIndex, 1);
          }
          profile.favoriteColors.unshift(item.primaryColor);
        }

        // Elevate category preference
        if (item.category) {
          const catIndex = profile.preferredCategories.indexOf(item.category);
          if (catIndex > -1) {
            profile.preferredCategories.splice(catIndex, 1);
          }
          profile.preferredCategories.unshift(item.category);
        }
      });

      // Maintain max collections lists sizes to prevent oversized Firestore documents
      profile.favoriteColors = Array.from(new Set(profile.favoriteColors)).slice(0, 10);
      profile.preferredCategories = Array.from(new Set(profile.preferredCategories)).slice(0, 5);
    }

    // Save mutated profile
    await StyleProfileMemory.save(profile);
    return profile;
  }
}
