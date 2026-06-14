export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class OutputValidator {
  /**
   * Performs real schema structure checks before publication
   */
  static validateLookPayload(payload: any): ValidationResult {
    const errors: string[] = [];

    if (!payload) {
      return { isValid: false, errors: ['Null or undefined design payload'] };
    }

    if (typeof payload.lookId !== 'string' || !payload.lookId.trim()) {
      errors.push('Missing or non-string "lookId" identifier');
    }

    if (typeof payload.renderedTitle !== 'string' || !payload.renderedTitle.trim()) {
      errors.push('Missing or empty "renderedTitle" presentation layer');
    }

    if (!Array.isArray(payload.renderedColors) || payload.renderedColors.length === 0) {
      errors.push('Style payload must contain at least one valid hex color specifier');
    } else {
      payload.renderedColors.forEach((color: any, idx: number) => {
        if (typeof color !== 'string' || !color.startsWith('#')) {
          errors.push(`Invalid color hex format at index ${idx}: "${color}"`);
        }
      });
    }

    if (payload.outfitScore !== undefined && (typeof payload.outfitScore !== 'number' || payload.outfitScore < 0 || payload.outfitScore > 100)) {
      errors.push('Invalid outfitScore bounds. Must reside within 0-100% range');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
