/**
 * ARIA v2.5 Style DNA Profile Builder
 * Product: LOOK VISION v2.4
 */

import { 
  StyleDNAProfile, 
  StyleDNASnapshot, 
  StyleDNAUpdatePayload, 
  StyleDNAAttribute 
} from './StyleDNATypes';
import { FashionMemoryItem } from '../memory/MemoryTypes';
import { StyleDNAAnalyzer } from './StyleDNAAnalyzer';
import { StyleDNAScorer } from './StyleDNAScorer';

export class StyleDNAProfileBuilder {
  /**
   * Builds an updated or new Style DNA Profile from memories and existing profile state
   */
  public static buildProfile(
    userId: string,
    memories: FashionMemoryItem[],
    existingProfile?: StyleDNAProfile | null,
    manualUpdates?: StyleDNAUpdatePayload
  ): { profile: StyleDNAProfile; snapshot?: StyleDNASnapshot } {
    const now = new Date().toISOString();

    // 1. Extract vector attributes from stored explicit memories
    const colorProfile = StyleDNAAnalyzer.extractAttributesForCategory(memories, 'color_preference');
    const silhouetteProfile = StyleDNAAnalyzer.extractAttributesForCategory(memories, 'silhouette_preference');
    const materialProfile = StyleDNAAnalyzer.extractAttributesForCategory(memories, 'material_preference');
    const brandAffinity = StyleDNAAnalyzer.extractAttributesForCategory(memories, 'brand_preference');
    const lifestyleAlignment = StyleDNAAnalyzer.extractAttributesForCategory(memories, ['wardrobe_behavior', 'explicit_preference']);
    const occasionPreferences = StyleDNAAnalyzer.extractAttributesForCategory(memories, ['style_preference', 'feedback']);

    // 2. Override or merge with manual update payloads if provided
    const finalColors = manualUpdates?.colorProfile || colorProfile;
    const finalSilhouettes = manualUpdates?.silhouetteProfile || silhouetteProfile;
    const finalMaterials = manualUpdates?.materialProfile || materialProfile;
    const finalBrands = manualUpdates?.brandAffinity || brandAffinity;
    const finalLifestyle = manualUpdates?.lifestyleAlignment || lifestyleAlignment;
    const finalOccasions = manualUpdates?.occasionPreferences || occasionPreferences;

    // 3. Derive identity name
    const derivedName = manualUpdates?.identityName 
      || StyleDNAAnalyzer.deriveIdentityName(finalColors, finalSilhouettes, finalMaterials);

    // 4. Calculate scores
    const tempPartial: Partial<StyleDNAProfile> = {
      colorProfile: finalColors,
      silhouetteProfile: finalSilhouettes,
      materialProfile: finalMaterials,
      brandAffinity: finalBrands,
      lifestyleAlignment: finalLifestyle,
      occasionPreferences: finalOccasions
    };

    const { overallConfidence, totalEvidenceCount } = StyleDNAScorer.calculateProfileConfidence(tempPartial);

    const version = existingProfile ? existingProfile.version + 1 : 1;

    const newProfile: StyleDNAProfile = {
      id: existingProfile?.id || `sdna_${userId}_${Date.now()}`,
      userId,
      version,
      identityName: derivedName,
      colorProfile: finalColors,
      silhouetteProfile: finalSilhouettes,
      materialProfile: finalMaterials,
      brandAffinity: finalBrands,
      lifestyleAlignment: finalLifestyle,
      occasionPreferences: finalOccasions,
      overallConfidence,
      totalEvidenceCount,
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now,
      metadata: {
        ...existingProfile?.metadata,
        ...manualUpdates?.metadata,
        maturityLabel: StyleDNAScorer.getMaturityLabel(overallConfidence, totalEvidenceCount)
      }
    };

    // 5. Create historical snapshot for versioning tracking
    const snapshot: StyleDNASnapshot = {
      snapshotId: `snap_v${version}_${Date.now()}`,
      profileId: newProfile.id,
      userId,
      version,
      profile: newProfile,
      capturedAt: now,
      trigger: manualUpdates ? 'explicit_update' : 'memory_sync'
    };

    return { profile: newProfile, snapshot };
  }
}
