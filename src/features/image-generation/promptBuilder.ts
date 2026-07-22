import { ClothingCategory } from '../../types';
import { AICreationsStyleMapper } from './AICreationsStyleMapper';

export interface PromptCompositionOptions {
  theme?: string;
  vibe?: string;
  garments?: Array<{ title: string; category: string; primaryColor: string }>;
  gender?: 'unisex' | 'male' | 'female';
  formality?: 'Casual' | 'Semi-formal' | 'Formal';
  season?: string;
  setting?: string;
  hasUploadedUserImage?: boolean;
  isAICreationsModule?: boolean;
}

export class FashionPromptBuilder {
  /**
   * Constructs an extremely high-quality, professional, descriptive prompt for generating fashion garments and lookbooks.
   */
  static buildOutfitPrompt(options: PromptCompositionOptions): string {
    let {
      theme = 'Minimalist',
      vibe = '',
      garments = [],
      gender = 'unisex',
      formality = 'Casual',
      season = 'All-Season',
      setting = 'clean neutral studio backdrop with soft shadows',
      hasUploadedUserImage = false,
      isAICreationsModule = false
    } = options;

    if (isAICreationsModule || theme?.includes('AI Creations') || vibe?.includes('AI Creations')) {
      return AICreationsStyleMapper.buildPrompt(vibe || theme || 'Cybernetic high-fashion asset', theme);
    }

    // Extract user style description from vibe or theme if present
    let rawUserQuery = (vibe || theme || '').trim();
    // Clean up trailing boilerplate phrases if present to isolate user's core style description
    const cleanedUserStyle = rawUserQuery
      .replace(/,?\s*(luxurious|professional)\s+high-fashion\s+studio\s+lookbook.*$/i, '')
      .replace(/,?\s*headless\s+mannequin\s+model\s+portrait.*$/i, '')
      .trim();

    // CRITICAL GOVERNANCE RULE - STRICT MODE
    // 1. VIBE COMPLIANCE: If the 'vibe' of the garment suggests 'street' or 'industrial', interpret it as 'Raw Studio Minimalism'
    let sanitizedVibe = vibe || 'clean, editorial, avant-garde';
    const streetOrIndustrialKeywords = /\bstreet(wear)?\b|\bindustrial\b|\bourban\b/gi;
    if (streetOrIndustrialKeywords.test(sanitizedVibe)) {
      sanitizedVibe = sanitizedVibe.replace(streetOrIndustrialKeywords, 'Raw Studio Minimalism (Concrete studio floors, metallic textures)');
    }

    // 2. BACKGROUND OVERRIDE & FORCED SETTING: Render strictly within a professional studio environment
    const allowedSettings = [
      'Solid Matte Studio Floor (White, Grey, or Charcoal)',
      'Soft-lit Minimalist Studio Cove',
      'Sterile Editorial Studio Backdrop'
    ];
    const settingIndex = ((theme ? theme.length : 0) + (sanitizedVibe ? sanitizedVibe.length : 0)) % allowedSettings.length;
    const forcedSetting = allowedSettings[settingIndex];

    const cleanStudioSetting = `inside a professional, high-end studio environment with a ${forcedSetting}, completely free of any outdoor elements. Absolutely NO roads, NO streets, NO sidewalks, NO exterior buildings, NO nature, NO urban landscapes, NO sky.`;

    // Strip out forbidden outdoor elements
    const forbiddenPatterns = /road|street|sidewalk|building|exterior|outdoor|landscape|sky|nature|highway|alley|pavement|asphalt/gi;
    theme = theme.replace(forbiddenPatterns, 'Studio');
    sanitizedVibe = sanitizedVibe.replace(forbiddenPatterns, 'Studio Minimalist');
    garments = garments.map(g => ({
      ...g,
      title: g.title.replace(forbiddenPatterns, 'Studio Tailored'),
      category: g.category,
      primaryColor: g.primaryColor
    }));

    const combinedInput = `${theme} ${sanitizedVibe} ${cleanedUserStyle} ${garments.map(g => `${g.title} ${g.category}`).join(' ')}`.toLowerCase();
    
    const nonFashionKeywords = [
      'dog', 'cat', 'bird', 'lion', 'horse', 'cow', 'sheep', 'pig', 'tiger', 'bear', 'animal', 'pet',
      'car', 'truck', 'vehicle', 'motorcycle', 'airplane', 'train', 'bus', 'scooter', 'automobile',
      'tree', 'river', 'mountain', 'landscape', 'forest', 'nature', 'ocean', 'beach', 'sunset',
      'building', 'house', 'skyscraper', 'office block', 'landmark', 'cityscape'
    ];

    const hasNonFashion = nonFashionKeywords.some(keyword => {
      const regex = new RegExp(`\\b${keyword}s?\\b`, 'i');
      return regex.test(combinedInput);
    });

    if (hasNonFashion) {
      let inspiredTranslation = 'aesthetic high-fashion garment';
      if (combinedInput.includes('car') || combinedInput.includes('vehicle') || combinedInput.includes('automobile') || combinedInput.includes('truck') || combinedInput.includes('motorcycle')) {
        inspiredTranslation = 'avant-garde automotive-inspired high-fashion jacket';
      } else if (combinedInput.includes('dog') || combinedInput.includes('cat') || combinedInput.includes('animal') || combinedInput.includes('pet') || combinedInput.includes('lion') || combinedInput.includes('bear') || combinedInput.includes('tiger')) {
        inspiredTranslation = 'fauna-inspired textured high-fashion coat';
      } else if (combinedInput.includes('tree') || combinedInput.includes('forest') || combinedInput.includes('nature') || combinedInput.includes('mountain') || combinedInput.includes('river')) {
        inspiredTranslation = 'organic foliage-inspired fluid couture drapery';
      } else {
        inspiredTranslation = `${theme || 'input'}-inspired bespoke luxury garment`;
      }

      theme = 'Avant-Garde';
      sanitizedVibe = 'inspired, sculptural, high-fashion, premium, creative';
      garments = [
        {
          title: `Fashion editorial outfit inspired by ${cleanedUserStyle || combinedInput.trim() || 'user input'} aesthetics, beautifully tailored as an exquisite ${inspiredTranslation}`,
          category: 'clothing',
          primaryColor: 'Custom Color'
        }
      ];
    }

    const clothes = garments.filter(g => ['upper garment', 'lower garment', 'clothing', 'top', 'bottom', 'outerwear', 'jacket', 't-shirt', 'shirt', 'pants', 'trousers', 'skirt', 'dress', 'upper', 'lower'].includes(g.category.toLowerCase()));
    const shoes = garments.filter(g => ['shoes', 'footwear', 'sneakers', 'boots', 'loafers', 'sandals'].includes(g.category.toLowerCase()));
    const caps = garments.filter(g => ['headwear', 'caps', 'cap', 'hat', 'beanie', 'helmet'].includes(g.category.toLowerCase()));

    // Construct primary outfit description from explicit user description or garments
    let garmentDesc = '';
    if (clothes.length > 0) {
      garmentDesc = `exquisite clothing pieces including ${clothes.map(g => `${g.title} in a beautiful ${g.primaryColor} color`).join(' paired with ')}`;
    } else if (cleanedUserStyle.length > 0) {
      garmentDesc = `a custom styled fashion outfit precisely matching the user description: "${cleanedUserStyle}"`;
    } else {
      garmentDesc = `a complete bespoke modern fashion look in ${theme} style`;
    }

    if (shoes.length > 0) {
      garmentDesc += `, accessorized on-feet with matching premium footwear: ${shoes.map(g => `${g.title} in ${g.primaryColor}`).join(', ')}`;
    }

    if (caps.length > 0) {
      garmentDesc += `, and styled with modern headwear: ${caps.map(g => `${g.title} in ${g.primaryColor}`).join(', ')}`;
    }

    // Model mandate for style generation without user uploaded photo
    const headlessSubject = hasUploadedUserImage
      ? 'professional fashion model elegantly posing'
      : 'headless mannequin portrait, cropped from the neck down, no visible human face, no face features, 100% focus on the clothing, fabric drape, stitching, and apparel details';

    const textureFocus = 'Heavy focus on physical fabric folds, detailed stitching, precise raw seams, and realistic material coordinates (such as denim grain, fine silk weave, or cotton fibers) illuminated by professional high-contrast studio spotlighting.';

    const promptBody = `Photorealistic professional fashion editorial lookbook photograph of a ${headlessSubject} wearing: ${garmentDesc}. 
Style theme: "${theme}". Aesthetic vibe: ${sanitizedVibe}. Formality: ${formality}, tailored meticulously for the ${season} season. 
Composition: full body modeling editorial pose, modern composition with elegant negative space, professional studio lighting, photorealistic details.
Setting: ${cleanStudioSetting}. 
Shot on 35mm lens, sharp focus, volumetric light, highly cinematic studio photography, 8k resolution, ${textureFocus}`;

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
