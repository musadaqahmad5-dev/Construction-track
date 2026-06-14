import { PersonaVector, UserStyleProfile, VectorProfileMemory } from '../user-profile-memory/vectorProfileMemory';
import { StyleEvolution, StyleEvolutionState } from './styleEvolution';

export class FeedbackConsolidator {
  private static activeStateMemory: Record<string, StyleEvolutionState> = {};

  /**
   * Retrieves or builds the active StyleEvolutionState.
   */
  static async getEvolutionState(userId: string, currentProfile: UserStyleProfile): Promise<StyleEvolutionState> {
    if (this.activeStateMemory[userId]) {
      return this.activeStateMemory[userId];
    }

    const initial: StyleEvolutionState = {
      userId,
      identityScore: 78,
      styleShiftIndex: 2.8,
      outfitConsistency: 85,
      shortTermMemory: [],
      longTermIdentity: { ...currentProfile.vector },
      lastUpdated: new Date().toISOString()
    };

    this.activeStateMemory[userId] = initial;
    return initial;
  }

  /**
   * Consolidated feedback handler that adapts preference vectors and memory records.
   */
  static async registerFeedbackEvent(
    userId: string,
    currentProfile: UserStyleProfile,
    styleTag: string,
    action: 'like' | 'dislike'
  ): Promise<{ profile: UserStyleProfile; state: StyleEvolutionState }> {
    const state = await this.getEvolutionState(userId, currentProfile);

    // 1. Insert interaction event into shortTermMemory
    state.shortTermMemory.unshift({
      styleTag,
      action,
      timestamp: new Date().toISOString()
    });
    if (state.shortTermMemory.length > 20) {
      state.shortTermMemory.pop();
    }

    // 2. Adjust core profile weights based on feedback
    const originalProfile = { ...currentProfile };
    const adjustedProfile = VectorProfileMemory.adjustProfileWeights(originalProfile, action, styleTag);

    // 3. Apply memory decay logic periodically to keep vectors nimble
    const decayedVibe = StyleEvolution.applyDecayLogic(adjustedProfile.vector, 0.01);
    adjustedProfile.vector = decayedVibe;

    // 4. Recalculate metrics
    state.longTermIdentity = { ...adjustedProfile.vector };
    state.outfitConsistency = StyleEvolution.calculateConsistency(adjustedProfile.vector, state.shortTermMemory);
    state.styleShiftIndex = StyleEvolution.calculateShiftIndex(state.shortTermMemory);
    
    // Identity Stability increases if consistency is high and shift speed is moderate
    const scoreDiff = state.outfitConsistency - (state.styleShiftIndex * 5);
    state.identityScore = Math.round(Math.max(Math.min(70 + (scoreDiff / 4), 100), 30));
    state.lastUpdated = new Date().toISOString();

    // Store state back in cache
    this.activeStateMemory[userId] = state;

    // Persist profile
    await VectorProfileMemory.saveProfile(adjustedProfile);

    return {
      profile: adjustedProfile,
      state
    };
  }
}
