export interface ValidationResult {
  passed: boolean;
  sanitizedValue?: string;
  rejections: string[];
}

export class RequestValidator {
  /**
   * Sanitizes styling look prompts and titles against XSS, script tags, HTML tags
   */
  public static validatePrompt(prompt: string): ValidationResult {
    const rejections: string[] = [];
    if (!prompt || prompt.trim() === '') {
      rejections.push('INPUT_MANDATORY_VALUE_REQUIRED');
      return { passed: false, rejections };
    }

    if (prompt.length > 300) {
      rejections.push('PAYLOAD_LIMIT_EXCEEDED_CHARACTER');
    }

    // Capture XSS indicators
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /onerror=/gi,
      /onload=/gi,
      /onclick=/gi,
      /<[^>]*>/gi // Strict HTML tag rejection
    ];

    let hasInjections = false;
    xssPatterns.forEach(pat => {
      if (pat.test(prompt)) {
        hasInjections = true;
      }
    });

    if (hasInjections) {
      rejections.push('INJECTION_XSS_MALICIOUS_CHARACTER_BLOCKED');
    }

    // Clean html characters out of safety
    const sanitizedValue = prompt
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    return {
      passed: rejections.length === 0,
      sanitizedValue,
      rejections
    };
  }

  /**
   * Validates color codes strictly conform to hexadecimal pattern
   */
  public static validateHexColors(colors: string[]): boolean {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return colors.every(color => hexPattern.test(color));
  }
}
