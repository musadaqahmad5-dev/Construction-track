import { AICreation } from '../../components/ai-creations/types';

export interface AICreationsStyleConfig {
  coreAesthetics: string[];
  apparelMatrix: string[];
  environmentLighting: string[];
  renderEngine: string;
}

export class AICreationsStyleMapper {
  static readonly CORE_AESTHETICS = [
    'Ultra-detailed 3D digital art',
    'High-fashion editorial lookbook',
    'Unreal Engine 5 render style',
    'Ray-traced specular reflections & ambient occlusion',
    '8k resolution photorealistic octane CGI finish'
  ];

  static readonly APPAREL_MATRIX = [
    'Non-reality digital apparel',
    'Form-fitting cybernetic bodysuits',
    'Glossy liquid latex and metallic vinyl garments',
    'Neon-accented futuristic tech-wear',
    'Biomorphic exoskeleton seams and woven fiber optics'
  ];

  static readonly ENVIRONMENT_LIGHTING = [
    'Cinematic neon rim lighting (cyan, magenta, electric blue)',
    'Cyberpunk neon alleyways with wet asphalt reflections',
    'High-tech cosmic void backdrop with glowing particle arrays',
    'Volumetric studio light beams in dark slate virtual arena'
  ];

  /**
   * Generates an isolated, ultra-high fidelity prompt specifically for AI Creations module.
   * Ensures 100% boundary isolation from external community overrides or standard street clothing.
   */
  static buildPrompt(userRequest: string, stylePreset?: string): string {
    const raw = (userRequest || 'Cybernetic high-fashion digital garment').trim();

    // Select aesthetics, apparel, and lighting
    const coreAestheticStr = this.CORE_AESTHETICS.slice(0, 3).join(', ');
    const apparelStr = this.APPAREL_MATRIX.join(', ');
    const lightingStr = this.ENVIRONMENT_LIGHTING[Math.abs(raw.length) % this.ENVIRONMENT_LIGHTING.length];

    const presetPrefix = stylePreset ? `[AESTHETIC PRESET: ${stylePreset.toUpperCase()}] ` : '';

    return `${presetPrefix}High-resolution 3D digital fashion asset. ${coreAestheticStr}. Subject: Statuesque avatar wearing bespoke digital garment inspired by "${raw}". Apparel features: ${apparelStr}. Environment & Lighting: ${lightingStr}. Masterpiece editorial presentation, 8k Unreal Engine 5 render, ray-traced reflections, crystal clear mesh details, zero noise.`;
  }

  /**
   * Constructs a negative prompt to eliminate low-poly meshes, standard mundane street clothes, or unwanted artifacts.
   */
  static getNegativePrompt(): string {
    return 'low-poly, mundane casual clothes, faded colors, blurry textures, flat studio lighting, plastic skin, distorted limbs, watermarks, bad proportions, low resolution, noisy render, amateur 3d model';
  }

  /**
   * Helper function to seamlessly format and sync a generated AI Creation asset
   * into the user's personal Portfolio Vault and Wardrobe Grid.
   */
  static prepareAssetForVault(creation: Partial<AICreation>): AICreation {
    const id = creation.id || `creation-asset-${Date.now()}`;
    return {
      id,
      title: creation.title || 'Digital Cybernetic Couture Asset',
      prompt: creation.prompt || 'Cybernetic 3D digital fashion suit',
      imageUrl: creation.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      model: creation.model || 'Unreal Engine 5.4 CAD Mesh Solver',
      style: creation.style || 'Sci-Fi Cybernetics',
      resolution: '2048x2048',
      aspectRatio: '3:4',
      createdAt: new Date().toISOString(),
      likesCount: creation.likesCount || 1,
      viewsCount: creation.viewsCount || 1,
      savesCount: creation.savesCount || 1,
      commentsCount: 0,
      creator: creation.creator || {
        id: 'creator-current-user',
        name: 'You (Vault Owner)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        bio: 'Digital Fashion & Cybernetics Architect',
        followers: 120,
        following: 45,
        totalCreations: 12,
        likesReceived: 340,
        viewsReceived: 1250
      },
      status: 'Published',
      tags: creation.tags || ['Cybernetic', 'Unreal Engine 5', 'Latex Vinyl', 'Digital Couture'],
      colorPalette: creation.colorPalette || ['#00f0ff', '#ff007f', '#07070c', '#ffffff']
    };
  }
}
