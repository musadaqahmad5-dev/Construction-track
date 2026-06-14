import { PromptInterpreter, PromptIntent } from './promptInterpreter';
import { StyleMutation } from './styleMutation';
import { RenderedLook } from '../rendering/outfitRenderer';

export class OutfitStudio {
  /**
   * Builds mutated design profiles based on raw prompt entries
   */
  static remixOutfit(
    curLook: RenderedLook,
    prompt: string
  ): RenderedLook {
    // 1. Decipher prompt
    const intent = PromptInterpreter.interpretPrompt(prompt);

    // 2. Perform deep styling mutations
    const updatedLayers = StyleMutation.mutateLookLayers(curLook.garmentLayers, intent);

    // 3. Compile final remixed state payload
    const finalHexes = updatedLayers.map(l => l.color);
    
    // Synthesize updated look parameters
    const updatedTitle = intent.aestheticShift 
      ? `Studio Remix: ${intent.aestheticShift.toUpperCase()} Format`
      : `Remixed Look: "${prompt}"`;

    const updatedDesc = `Custom mutation applied with ${intent.intensity} shift depth focus. Updates: ${
      intent.mutateColors ? 'Colors revised. ' : ''
    }${intent.mutateFabrics ? 'Fabrics remutilated. ' : ''}`;

    return {
      ...curLook,
      renderId: `remix-${Date.now()}`,
      heroLook: {
        ...curLook.heroLook,
        title: updatedTitle,
        description: updatedDesc,
        aestheticVibe: intent.aestheticShift || curLook.heroLook.aestheticVibe
      },
      palette: {
        name: `Studio Custom Remix Vibe Map`,
        hexes: finalHexes
      },
      garmentLayers: updatedLayers
    };
  }
}
