export interface WeatherContext {
  tempRange: string;      //, e.g. "Cold", "Warm", "Hot", "15°C - 20°C"
  condition: string;      // e.g. "Sunny", "Rainy", "Cold", "Breezy"
  layeringNeeds: boolean; // whether heavy layering is suggested
  keySartorialFocus: string; // quick recommendation e.g. "breathable fabrics", "humidity defense"
}

export class WeatherAdapter {
  /**
   * Adapts the simple meteorology parameters into structured sartorial insights.
   */
  static adapt(condition: string, tempRange: string): WeatherContext {
    const condNormalized = (condition || '').toLowerCase();
    
    let layeringNeeds = false;
    let keySartorialFocus = "Standard comfortable smart casual layers.";

    if (condNormalized.includes('rain') || condNormalized.includes('wet')) {
      keySartorialFocus = "Outerwear barrier (waterproofing, robust trench, dense weave fibers) to counteract high humidity.";
      layeringNeeds = true;
    } else if (condNormalized.includes('cold') || condNormalized.includes('snow') || condNormalized.includes('freeze')) {
      keySartorialFocus = "Thermal conservation. Heavy insulating layers (cashmere, wool, shears) are primary to prevent temperature fatigue.";
      layeringNeeds = true;
    } else if (condNormalized.includes('breezy') || condNormalized.includes('wind') || condNormalized.includes('cloud')) {
      keySartorialFocus = "Transition layer boundaries (light sweater, denim jacket, soft shells) adaptive to sudden temperature swings.";
      layeringNeeds = true;
    } else if (condNormalized.includes('sunny') || condNormalized.includes('hot') || condNormalized.includes('summer')) {
      keySartorialFocus = "High breathability, lightweight casual pieces, maximum skin micro-aeration. Shielding accessories like sunglasses are favorable.";
      layeringNeeds = false;
    }

    // Additional override based on temperature inputs if available
    const tempLower = (tempRange || '').toLowerCase();
    if (tempLower.includes('cold') || tempLower.includes('chill') || tempLower.includes('low')) {
      layeringNeeds = true;
    }

    return {
      tempRange: tempRange || "Moderate",
      condition: condition || "Clear",
      layeringNeeds,
      keySartorialFocus,
    };
  }
}
