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

    const clothes = garments.filter(g => ['upper garment', 'lower garment', 'clothing', 'top', 'bottom', 'outerwear', 'jacket', 't-shirt', 'shirt', 'pants', 'trousers', 'skirt', 'dress'].includes(g.category.toLowerCase()));
    const shoes = garments.filter(g => ['shoes', 'footwear', 'sneakers', 'boots', 'loafers', 'sandals'].includes(g.category.toLowerCase()));
    const caps = garments.filter(g => ['headwear', 'caps', 'cap', 'hat', 'beanie', 'helmet'].includes(g.category.toLowerCase()));

    let garmentDesc = '';
    if (clothes.length > 0) {
      garmentDesc += `exquisite clothing pieces including ${clothes.map(g => `${g.title} in a beautiful ${g.primaryColor} color`).join(' paired with ')}`;
    } else {
      garmentDesc += `a complete modern styled outfit`;
    }

    if (shoes.length > 0) {
      garmentDesc += `, accessorized on-feet with matching premium footwear: ${shoes.map(g => `${g.title} in ${g.primaryColor}`).join(', ')}`;
    }

    if (caps.length > 0) {
      garmentDesc += `, and styled with modern headwear on the model's head: ${caps.map(g => `${g.title} in ${g.primaryColor}`).join(', ')}`;
    }

    const promptBody = `Photorealistic professional fashion editorial lookbook shot of a ${gender === 'unisex' ? 'unisex' : (gender === 'male' ? 'male fashion model' : 'female fashion model')} elegantly showcasing a styled look, wearing: ${garmentDesc}. 
The style theme is "${theme}" with a vibe that is ${vibe}, presenting high aesthetic luxury fashion curation. 
Formality is ${formality}, tailored meticulously for the ${season} season. 
Composition: full body modeling editorial pose, modern composition with elegant negative space, professional lighting, photorealistic details.
The background setting is ${setting}. 
Shot on 35mm lens, sharp focus, volumetric light, highly cinematic studio photography, 8k resolution, realistic fabric textures and detailed accessories.`;

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
