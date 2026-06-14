import { ClothingCategory } from '../../types';

export interface PromptCompositionOptions {
  theme?: string;
  vibe?: string;
  garments?: Array<{ title: string; category: string; primaryColor: string }>;
  gender?: 'unisex' | 'male' | 'female';
  formality?: 'Casual' | 'Semi-formal' | 'Formal';
  season?: string;
  setting?: string;
}

export class FashionPromptBuilder {
  /**
   * Constructs an extremely high-quality, professional, descriptive prompt for generating fashion garments and lookbooks.
   */
  static buildOutfitPrompt(options: PromptCompositionOptions): string {
    const {
      theme = 'Minimalist',
      vibe = 'clean, editorial, avant-garde',
      garments = [],
      gender = 'unisex',
      formality = 'Casual',
      season = 'All-Season',
      setting = 'an elegant architectural studio with soft daylight and high-end concrete textures'
    } = options;

    let garmentDesc = 'a complete styled outfit';
    if (garments.length > 0) {
      garmentDesc = garments
        .map(g => `${g.title} (${g.primaryColor} ${g.category})`)
        .join(', styled with ');
    }

    const promptBody = `Photorealistic fashion editorial lookbook shot of a ${gender} mannequin or human model wearing: ${garmentDesc}. 
The style theme is "${theme}" with a vibe that is ${vibe}, possessing high aesthetic fashion curation. 
Formality is ${formality}, tailored meticulously for the ${season} season. 
Composition: full body editorial shot, modern composition with elegant negative space, professional lighting, photorealistic details.
The background setting is ${setting}. 
Shot on 35mm lens, sharp focus, volumetric light, highly cinematic, 8k resolution, detailed fabric textures.`;

    return promptBody.trim();
  }

  /**
   * Constructs a prompt for a single garment product photo.
   */
  static buildSingleGarmentPrompt(title: string, category: ClothingCategory | string, color: string, material?: string): string {
    const matText = material ? `, crafted from premium ${material}` : '';
    return `Professional e-commerce product photograph of a ${color} ${category} cataloged as "${title}"${matText}.
Centered composition, studio lighting with soft shadows, high-end clean linen background, photorealistic texture of the fabric fibers, highly detailed, professional catalog style.`;
  }
}
