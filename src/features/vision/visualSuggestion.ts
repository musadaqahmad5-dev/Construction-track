import { ClothingCategory } from '../../types';
import { GarmentClassifier } from './garmentClassifier';
import { ColorExtractor } from './colorExtractor';
import { auth } from '../../firebase';

export interface VisualGarmentAnalysis {
  name: string;
  category: ClothingCategory;
  primaryColor: string;
  secondaryColor: string;
  material: string;
  silhouette: string;
  detectedPattern: string;
  pattern: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Season';
  suggestedCareNote: string;
  suggestedCare: string;
  formality: 'Casual' | 'Semi-formal' | 'Formal';
  description: string;
  confidence: number;
}

const REDACTED_DIRECTIVE_VALUE = '[REDACTED_COGNITIVE_DIRECTIVE]';

function hasMaliciousDirective(text: string): boolean {
  if (!text) return false;
  return /<script\b|javascript:|onerror\s*=|ignore\s+(all\s+)?(previous|prior|system)\s+(instructions|prompts)|override\s+(your\s+)?(system\s+)?prompt|\[REDACTED_COGNITIVE_DIRECTIVE\]/i.test(text);
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
    if (hasMaliciousDirective(fileName) || hasMaliciousDirective(base64DataUrl)) {
      return {
        name: REDACTED_DIRECTIVE_VALUE,
        category: REDACTED_DIRECTIVE_VALUE as any,
        primaryColor: REDACTED_DIRECTIVE_VALUE,
        secondaryColor: REDACTED_DIRECTIVE_VALUE,
        material: REDACTED_DIRECTIVE_VALUE,
        silhouette: REDACTED_DIRECTIVE_VALUE,
        detectedPattern: REDACTED_DIRECTIVE_VALUE,
        pattern: REDACTED_DIRECTIVE_VALUE,
        season: REDACTED_DIRECTIVE_VALUE as any,
        suggestedCareNote: REDACTED_DIRECTIVE_VALUE,
        suggestedCare: REDACTED_DIRECTIVE_VALUE,
        formality: REDACTED_DIRECTIVE_VALUE as any,
        description: REDACTED_DIRECTIVE_VALUE,
        confidence: 0
      };
    }

    try {
      console.log(`[VisualSuggestion] Dispatching image for vision analysis...`);
      
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = 'Bearer guest-token';
      }

      const response = await fetch('/api/ai/analyze-visual', {
        method: 'POST',
        headers,
        body: JSON.stringify({ base64Image: pureBase64 })
      });

      if (!response.ok) {
        throw new Error("Vision server returned error response");
      }

      const rawResult = await response.json();
      console.log(`[VisualSuggestion] Received server response:`, rawResult);

      if (rawResult && rawResult.category === REDACTED_DIRECTIVE_VALUE) {
        return {
          name: REDACTED_DIRECTIVE_VALUE,
          category: REDACTED_DIRECTIVE_VALUE as any,
          primaryColor: REDACTED_DIRECTIVE_VALUE,
          secondaryColor: REDACTED_DIRECTIVE_VALUE,
          material: REDACTED_DIRECTIVE_VALUE,
          silhouette: REDACTED_DIRECTIVE_VALUE,
          detectedPattern: REDACTED_DIRECTIVE_VALUE,
          pattern: REDACTED_DIRECTIVE_VALUE,
          season: REDACTED_DIRECTIVE_VALUE as any,
          suggestedCareNote: REDACTED_DIRECTIVE_VALUE,
          suggestedCare: REDACTED_DIRECTIVE_VALUE,
          formality: REDACTED_DIRECTIVE_VALUE as any,
          description: REDACTED_DIRECTIVE_VALUE,
          confidence: 0
        };
      }

      if (rawResult && rawResult.category && rawResult.primaryColor) {
        const detectedPattern = rawResult.detectedPattern || rawResult.pattern || 'Solid';
        const silhouette = rawResult.silhouette || 'Structured';
        const suggestedCareNote = rawResult.suggestedCareNote || rawResult.suggestedCare || 'Gentle cold wash or dry clean as needed; hang to dry.';
        return {
          name: rawResult.name || this.generateDefaultName(rawResult.primaryColor, rawResult.category),
          category: rawResult.category as ClothingCategory,
          primaryColor: rawResult.primaryColor,
          secondaryColor: rawResult.secondaryColor || 'None',
          material: rawResult.material || 'Heavy Cotton',
          silhouette,
          detectedPattern,
          pattern: detectedPattern,
          season: rawResult.season || 'All-Season',
          suggestedCareNote,
          suggestedCare: suggestedCareNote,
          formality: rawResult.formality || 'Casual',
          description: rawResult.description || `${silhouette} ${rawResult.material || 'Heavy Cotton'} (${detectedPattern}). Care: ${suggestedCareNote}`,
          confidence: rawResult.confidence || 0.94
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

    // 3. Estimate seasons & silhouette
    let season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Season' = 'All-Season';
    let silhouette = 'Relaxed';
    let suggestedCare = 'Machine wash cold inside out and hang dry to preserve shape.';
    if (classification.category === 'Outerwear') {
      season = 'Winter';
      silhouette = 'Structured';
      suggestedCare = 'Spot clean with damp cloth or dry clean seasonally.';
    } else if (classification.category === 'Sportswear') {
      season = 'Spring';
      silhouette = 'Relaxed';
      suggestedCare = 'Machine wash cold on gentle cycle; do not use fabric softener.';
    } else if (classification.category === 'Formal') {
      season = 'Autumn';
      silhouette = 'Tailored';
      suggestedCare = 'Dry clean only and store on a contoured wooden hanger.';
    } else if (classification.category === 'Accessories') {
      season = 'All-Season';
      silhouette = 'Structured';
      suggestedCare = 'Wipe gently with a soft dry microfiber cloth after use.';
    }

    const titleWord = filenameNoExt
      ? filenameNoExt.charAt(0).toUpperCase() + filenameNoExt.slice(1).replace(/[-_]/g, ' ')
      : `${colors.primary} ${silhouette} ${classification.category}`;

    return {
      name: titleWord,
      category: classification.category,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary || 'None',
      material: classification.materialGuess || 'Heavy Cotton',
      silhouette,
      detectedPattern: 'Solid',
      pattern: 'Solid',
      season,
      suggestedCareNote: suggestedCare,
      suggestedCare,
      formality: classification.formality,
      description: `${silhouette} ${classification.materialGuess} ${classification.category.toLowerCase()} piece in ${colors.primary}. Care: ${suggestedCare}`,
      confidence: Math.round(classification.confidence * 100) / 100
    };
  }
}
