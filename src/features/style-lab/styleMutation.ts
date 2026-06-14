import { PromptIntent } from './promptInterpreter';
import { RenderedLook } from '../rendering/outfitRenderer';

export class StyleMutation {
  /**
   * Applies localized changes while leaving locked elements untouched.
   */
  static mutateLookLayers(
    originalLayers: RenderedLook['garmentLayers'],
    intent: PromptIntent
  ): RenderedLook['garmentLayers'] {
    const mutated = originalLayers.map((layer) => {
      // If layer is in lock list, skip mutation entirely
      if (intent.lockLayers.includes(layer.layer)) {
        return { ...layer, description: `[LOCKED] ${layer.description}` };
      }

      let mutatedTitle = layer.title;
      let mutatedDesc = layer.description;
      let mutatedColor = layer.color;

      // Color mutation
      if (intent.mutateColors) {
        if (intent.remixTheme.toLowerCase().includes('dark') || intent.aestheticShift === 'cyberpunk') {
          mutatedColor = '#0E0E11'; // charcoal black
        } else if (intent.remixTheme.toLowerCase().includes('monochrome')) {
          mutatedColor = '#FFFFFF'; // crisp white contrast
        } else if (intent.aestheticShift === 'luxury') {
          mutatedColor = '#8A7A5F'; // luxury gold/champagne tone
        } else {
          // Subtle variance override
          mutatedColor = '#4E5B6E'; // slate blue neutral
        }
      }

      // Material texture/fabric mutation
      if (intent.mutateFabrics) {
        if (intent.remixTheme.toLowerCase().includes('wool') || intent.remixTheme.toLowerCase().includes('warm')) {
          mutatedTitle = mutatedTitle.replace(/(cotton|nylon|silk)/i, 'Heavy Wool');
          mutatedDesc += ' (Reconstructed back into high insulation heavy merino)';
        } else if (intent.remixTheme.toLowerCase().includes('tech') || intent.aestheticShift === 'cyberpunk') {
          mutatedTitle = mutatedTitle.replace(/(wool|cotton|silk)/i, 'Gore-Tex Cordura Ripstop');
          mutatedDesc += ' (Fortified with tactical water shedding surface shields)';
        } else if (intent.aestheticShift === 'luxury') {
          mutatedTitle = mutatedTitle.replace(/(cotton|polyester)/i, 'Mulberry Silk Cashmere Blend');
          mutatedDesc += ' (Upgraded with high luster artisanal threads)';
        }
      }

      // Shift aesthetic styling directly
      if (intent.aestheticShift) {
        mutatedTitle = `${intent.aestheticShift.toUpperCase()} ${mutatedTitle}`;
      }

      return {
        ...layer,
        title: mutatedTitle,
        description: mutatedDesc,
        color: mutatedColor
      };
    });

    return mutated;
  }
}
