export type MeasurementSystem = 'metric' | 'imperial';

export interface SizingMapping {
  originalSize: string;
  metricLabel: string; // e.g. 50 (cm chest)
  imperialLabel: string; // e.g. 40 (inch chest)
}

export class LocalizationEngine {
  private static measurementSystem: MeasurementSystem = 'imperial';

  // Translate basic system prompts dynamically
  private static translations: Record<string, Record<string, string>> = {
    'en': {
      'welcome': 'Welcome to AI Fashion OS Platform',
      'dna_calib': 'Calibrating Style DNA Matrix Weights',
      'checkout': 'Compile Purchasable Basket'
    },
    'ja': {
      'welcome': 'AIファッションOSプラットフォームへようこそ',
      'dna_calib': 'スタイルDNAマトリックスウェイトの調整',
      'checkout': '購入可能バケットをコンパイル'
    },
    'da': {
      'welcome': 'Velkommen til AI Fashion OS'
    }
  };

  static getTranslation(key: string, lang: string = 'en'): string {
    const subset = this.translations[lang] || this.translations['en'];
    return subset[key] || key;
  }

  static toggleMeasurementSystem(sys: MeasurementSystem): void {
    this.measurementSystem = sys;
  }

  static getSystemUnitSymbol(): string {
    return this.measurementSystem === 'metric' ? 'cm' : 'in';
  }

  static getSizingTable(category: string, rawSize: string): string {
    if (this.measurementSystem === 'metric') {
      if (category === 'mid') return 'Size: EU 48 / 85cm Waist';
      return `${rawSize} (Metric/EU Mode)`;
    } else {
      if (category === 'mid') return 'Size: US 32 / 31.5in Waist';
      return `${rawSize} (Imperial/US Mode)`;
    }
  }
}
