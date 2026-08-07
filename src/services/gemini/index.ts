/**
 * ARIA Gemini Fashion Intelligence Bridge Module
 * Product: LOOK VISION v2.4
 */

export * from './GeminiServiceTypes';
export { GeminiFashionVisionService, geminiFashionVisionService } from './GeminiFashionVisionService';
export { GeminiFashionReasoningService, geminiFashionReasoningService } from './GeminiFashionReasoningService';

import { geminiFashionVisionService } from './GeminiFashionVisionService';
import { geminiFashionReasoningService } from './GeminiFashionReasoningService';
import { GeminiHealthStatus } from './GeminiServiceTypes';

/**
 * Convenience helper to fetch overall Gemini Fashion Bridge health
 */
export async function getGeminiBridgeHealth(): Promise<{
  visionStatus: GeminiHealthStatus;
  reasoningStatus: GeminiHealthStatus;
  isOperational: boolean;
  timestamp: string;
}> {
  const visionStatus = await geminiFashionVisionService.checkHealth();
  const reasoningStatus = geminiFashionReasoningService.getHealthStatus();

  return {
    visionStatus,
    reasoningStatus,
    isOperational: visionStatus !== 'ERROR' && reasoningStatus !== 'ERROR',
    timestamp: new Date().toISOString()
  };
}
