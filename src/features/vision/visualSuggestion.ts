import { ClothingCategory } from '../../types';
import { GarmentClassifier } from './garmentClassifier';
import { ColorExtractor } from './colorExtractor';

export interface VisualGarmentAnalysis {
  name: string;
  category: ClothingCategory;
  primaryColor: string;
  secondaryColor: string;
  pattern: string;
  material: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Season';
  formality: 'Casual' | 'Semi-formal' | 'Formal';
  description: string;
  confidence: number;
}

export class VisualSuggestion {
  /**
   * Orchestrates the visual garment understanding flow.
   * If Gemini API is online, receives rich multimodal understanding from /api/ai/analyze-visual.
   * Otherwise, executes client-side fallback parsing (Canvas color extraction + keyword classification).
   */
  static async analyzeGarment(
    base64DataUrl: string, 
    pureBase64: string, 
    fileName: string
  ): Promise<VisualGarmentAnalysis> {
    try {
      console.log(`[VisualSuggestion] Dispatching image for vision analysis...`);
      
      const response = await fetch('/api/ai/analyze-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: pureBase64 })
      });

      if (!response.ok) {
        throw new Error("Vision server returned error response");
      }

      const rawResult = await response.json();
      console.log(`[VisualSuggestion] Received server response:`, rawResult);

      if (rawResult && rawResult.category && rawResult.primaryColor) {
        // Return structured fields returned by our enhanced Gemini server handler
        return {
          name: rawResult.name || this.generateDefaultName(rawResult.primaryColor, rawResult.category),
          category: rawResult.category as ClothingCategory,
          primaryColor: rawResult.primaryColor,
          secondaryColor: rawResult.secondaryColor || 'Minimalist White',
          pattern: rawResult.pattern || 'Solid',
          material: rawResult.material || 'Cotton Blend',
          season: rawResult.season || 'All-Season',
          formality: rawResult.formality || 'Casual',
          description: rawResult.description || 'Verified via visual analysis.',
          confidence: rawResult.confidence || 0.90
        };
      }

      throw new Error("Invalid structure from vision API");
    } catch (err) {
      console.warn("[VisualSuggestion] Server vision failed, invoking client-side fallback rules:", err);
      return this.executeOfflineFallback(base64DataUrl, fileName);
    }
  }

  /**
   * Generates a realistic name based on colors and category
   */
  private static generateDefaultName(color: string, category: string): string {
    const names: Record<string, string> = {
      Outerwear: 'Trench Coat',
      Formal: 'Tailored Blazer',
      Casual: 'Classic Tee',
      Sportswear: 'Performance Sweatshirt',
      Accessories: 'Essential Accent'
    };
    return `${color} ${names[category] || 'Garment'}`;
  }

  /**
   * Offline deterministic fallback utilizing:
   * 1. HTML Canvas color extraction for dominant & coordinating colors
   * 2. Keyword/metadata heuristics from filename for category and material classification
   */
  private static async executeOfflineFallback(
    base64DataUrl: string, 
    fileName: string
  ): Promise<VisualGarmentAnalysis> {
    // 1. Analyze colors from base64
    const colors = await ColorExtractor.extractDominantColorsFromCanvas(base64DataUrl);
    
    // 2. Classify based on file name or simple cues
    const filenameNoExt = fileName.split('.')[0] || '';
    const cleanWords = filenameNoExt.replace(/[-_]/g, ' ');
    const classification = GarmentClassifier.classifyByKeywords(cleanWords);

    // 3. Estimate seasons
    let season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Season' = 'All-Season';
    if (classification.category === 'Outerwear') {
      season = 'Winter';
    } else if (classification.category === 'Sportswear') {
      season = 'Spring';
    } else if (classification.category === 'Formal') {
      season = 'Autumn';
    } else if (classification.category === 'Casual') {
      season = 'All-Season';
    }

    const titleWord = filenameNoExt
      ? filenameNoExt.charAt(0).toUpperCase() + filenameNoExt.slice(1).replace(/[-_]/g, ' ')
      : `${colors.primary} Elegant ${classification.category}`;

    return {
      name: titleWord,
      category: classification.category,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      pattern: 'Solid',
      material: classification.materialGuess,
      season,
      formality: classification.formality,
      description: `Identified locally as a ${classification.materialGuess} ${classification.category.toLowerCase()} piece with a dominant vibe match of ${colors.primary}.`,
      confidence: Math.round(classification.confidence * 100) / 100
    };
  }
}
