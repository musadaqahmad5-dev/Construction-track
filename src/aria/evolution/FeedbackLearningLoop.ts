/**
 * ARIA v2.5 Feedback Learning Loop
 * Ingests user feedback signals (likes, dislikes, saved outfits, rejected recommendations, item wear)
 * and updates ARIA Style DNA, Personal Fashion Memory, and Style Evolution History.
 * Product: LOOK VISION v2.4
 */

import {
  UserFeedbackEvent,
  FeedbackType
} from './StyleEvolutionTypes';
import { PersonalFashionMemoryEngine } from '../../engine/personalMemory';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { styleEvolutionTracker } from './StyleEvolutionTracker';
import { styleEvolutionStorage } from './StyleEvolutionStorage';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class FeedbackLearningLoop {
  private static instance: FeedbackLearningLoop;

  private constructor() {}

  public static getInstance(): FeedbackLearningLoop {
    if (!FeedbackLearningLoop.instance) {
      FeedbackLearningLoop.instance = new FeedbackLearningLoop();
    }
    return FeedbackLearningLoop.instance;
  }

  /**
   * Processes an incoming feedback event and executes closed-loop learning
   */
  public async processFeedback(
    userId: string,
    feedbackType: FeedbackType,
    attributes: {
      colors?: string[];
      garments?: string[];
      brands?: string[];
      materials?: string[];
      styleVibe?: string;
      formality?: number;
      category?: string;
    },
    itemId?: string,
    userNote?: string
  ): Promise<UserFeedbackEvent> {
    const timestamp = new Date().toISOString();
    const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const feedbackEvent: UserFeedbackEvent = {
      feedbackId,
      userId,
      timestamp,
      feedbackType,
      itemId,
      attributes,
      userNote
    };

    // 1. Save feedback event to Firestore & Local Storage
    await styleEvolutionStorage.saveFeedbackEvent(userId, feedbackEvent);

    // 2. Update Personal Fashion Memory state
    const memory = PersonalFashionMemoryEngine.getMemory(userId);

    if (feedbackType === 'outfit_like' || feedbackType === 'creation_saved') {
      if (attributes.colors) {
        memory.favColors = Array.from(new Set([...memory.favColors, ...attributes.colors]));
      }
      if (attributes.garments) {
        memory.favGarmentTypes = Array.from(new Set([...memory.favGarmentTypes, ...attributes.garments]));
      }
      if (attributes.brands) {
        memory.favBrands = Array.from(new Set([...memory.favBrands, ...attributes.brands]));
      }
      if (attributes.materials) {
        memory.favMaterials = Array.from(new Set([...memory.favMaterials, ...attributes.materials]));
      }
      if (attributes.styleVibe) {
        memory.styleDNA.primaryVibe = attributes.styleVibe;
      }
      if (typeof attributes.formality === 'number') {
        memory.styleDNA.formalityPreference = attributes.formality;
      }
      if (feedbackType === 'creation_saved') {
        memory.styleDNA.experimentalIndex = Math.min(1.0, memory.styleDNA.experimentalIndex + 0.05);
      }
      memory.learningEventsLogged += 1;
      memory.accuracyEstimate = Math.min(99, memory.accuracyEstimate + 0.5);
    } else if (feedbackType === 'outfit_dislike' || feedbackType === 'rec_rejected') {
      if (attributes.colors && attributes.colors.length > 0) {
        memory.dislikes.colors = Array.from(new Set([...memory.dislikes.colors, ...attributes.colors]));
      }
      if (attributes.garments && attributes.garments.length > 0) {
        memory.dislikes.garments = Array.from(new Set([...memory.dislikes.garments, ...attributes.garments]));
      }
      if (attributes.brands && attributes.brands.length > 0) {
        memory.dislikes.brands = Array.from(new Set([...memory.dislikes.brands, ...attributes.brands]));
      }
      if (attributes.materials && attributes.materials.length > 0) {
        memory.dislikes.materials = Array.from(new Set([...memory.dislikes.materials, ...attributes.materials]));
      }
      if (itemId) {
        memory.rejectedRecommendations = Array.from(new Set([...memory.rejectedRecommendations, itemId]));
      }
      memory.learningEventsLogged += 1;
    } else if (feedbackType === 'wardrobe_item_worn') {
      if (attributes.garments) {
        memory.favGarmentTypes = Array.from(new Set([...memory.favGarmentTypes, ...attributes.garments]));
      }
      if (attributes.colors) {
        memory.favColors = Array.from(new Set([...memory.favColors, ...attributes.colors]));
      }
      memory.learningEventsLogged += 1;
    }

    // Save updated memory
    PersonalFashionMemoryEngine.saveMemory(memory);

    // 3. Trigger Style DNA Engine re-analysis
    const updatedProfile = await styleDNAEngine.reanalyzeProfile();

    // 4. Capture new Evolution Snapshot
    await styleEvolutionTracker.captureEvolutionSnapshot(
      userId,
      updatedProfile,
      feedbackType,
      {
        formalityLevel: memory.styleDNA.formalityPreference,
        experimentalIndex: memory.styleDNA.experimentalIndex,
        seasonalPreference: 'transition',
        feedbackEventsCount: memory.learningEventsLogged
      }
    );

    // 5. Log Telemetry Event
    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'StyleEvolutionEngine',
        eventName: 'ARIA_LEARNING_FEEDBACK_PROCESSED',
        category: 'Learning',
        payload: `Processed feedback ${feedbackType} (${feedbackId}) for user ${userId}. Confidence: ${updatedProfile.overallConfidence}`,
        latencyMs: 12,
        status: 'Success'
      });
    } catch (_) {}

    return feedbackEvent;
  }
}

export const feedbackLearningLoop = FeedbackLearningLoop.getInstance();
