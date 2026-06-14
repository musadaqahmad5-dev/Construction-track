export interface CurrencyConvertResult {
  currencyCode: 'USD' | 'EUR' | 'JPY' | 'DKK' | 'GBP';
  convertedAmount: number;
  formattedText: string;
}

export class CurrencyAbstraction {
  private static conversionRates: Record<string, number> = {
    'USD-USD': 1.0,
    'USD-EUR': 0.92,
    'USD-JPY': 156.4,
    'USD-DKK': 6.88,
    'USD-GBP': 0.78
  };

  static convertUSD(amount: number, target: 'USD' | 'EUR' | 'JPY' | 'DKK' | 'GBP'): CurrencyConvertResult {
    const key = `USD-${target}`;
    const rate = this.conversionRates[key] || 1.0;
    const converted = Math.round(amount * rate * 100) / 100;
    
    let formattedText = `${target} ${converted}`;
    if (target === 'EUR') formattedText = `€${converted}`;
    else if (target === 'JPY') formattedText = `¥${Math.round(converted)}`;
    else if (target === 'GBP') formattedText = `£${converted}`;
    else if (target === 'USD') formattedText = `$${converted}`;
    else formattedText = `${converted} DKK`;

    return {
      currencyCode: target,
      convertedAmount: converted,
      formattedText
    };
  }
}
