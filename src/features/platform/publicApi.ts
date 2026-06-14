import { OutfitRenderer, RenderedLook } from '../rendering/outfitRenderer';
import { PersonaVector } from '../user-profile-memory/vectorProfileMemory';
import { LookGenerationRequest, RecommendedStyleResponse } from './sdkContracts';
import { TenantIsolation } from './tenantIsolation';
import { AccessGovernor } from './accessGovernor';

export class PublicApi {
  static generateLook(req: LookGenerationRequest, apiToken: string): RenderedLook {
    // Authenticate and govern
    const isAuth = TenantIsolation.authenticateRequest(req.tenantId, apiToken);
    if (!isAuth) {
      throw new Error(`[API Platform] Unauthorized tenant integration credentials.`);
    }

    const limits = AccessGovernor.evaluateAccessLimits(req.tenantId);
    if (limits.rateLimitExceeded) {
      throw new Error(`[API Platform] Access Limit exceeded for tenant ${req.tenantId}.`);
    }

    AccessGovernor.trackUsagePulse(req.tenantId);

    // Default vector weights
    const vectorWeights: PersonaVector = {
      minimalist: req.styleDNAOverrides?.minimalist ?? 0.5,
      streetwear: 0.3,
      classic: 0.4,
      luxury: req.styleDNAOverrides?.luxury ?? 0.5,
      cyberpunk: req.styleDNAOverrides?.cyberpunk ?? 0.3,
      traditional: 0.1
    };

    return OutfitRenderer.renderLook(
      vectorWeights,
      req.promptContext,
      { temperature: 18, condition: 'Clear' },
      ['Public B2B Call'],
      150
    );
  }

  static recommendStyle(tenantId: string, stylesCount: number): RecommendedStyleResponse {
    AccessGovernor.trackUsagePulse(tenantId);
    return {
      recommendedStyles: ['Minimalist Stockholm Trenchcoat', 'Tactical Asymmetric Shell', 'Oxford Button Down'].slice(0, stylesCount),
      confidenceFactor: 94.8,
      matchSchemaId: `sch-${Date.now()}`
    };
  }

  static renderPreview(renderedLook: RenderedLook): string {
    // Produce SVG or binary mockup preview placeholder
    return `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#0B0F19"/>
      <circle cx="50" cy="50" r="30" stroke="${renderedLook.garmentLayers[0]?.color ?? '#fff'}" stroke-width="2"/>
    </svg>`;
  }

  static scoreOutfit(garmentIds: string[]): { matchingScore: number; synergyGrade: 'A' | 'B' | 'F' } {
    let score = 50;
    if (garmentIds.length >= 3) {
      score += 35;
    }
    return {
      matchingScore: score,
      synergyGrade: score >= 80 ? 'A' : score >= 60 ? 'B' : 'F'
    };
  }
}
