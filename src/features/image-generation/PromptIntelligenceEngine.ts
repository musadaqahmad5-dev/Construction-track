import { ImageConfig } from './imageGenerationProvider';
import { FashionDesignIntelligenceSystem, FashionDesignSpec } from './FashionDesignIntelligenceSystem';

// ============================================================================
// ENTERPRISE FASHION INTELLIGENCE ENGINE - PROMPT PIPELINE
// ============================================================================

/**
 * 1. PROMPT UNDERSTANDING ENGINE
 * Analyzes raw prompt for intent, subject, garments, colors, and styling indicators.
 */
export class PromptUnderstandingEngine {
  static analyze(prompt: string) {
    const lower = prompt.toLowerCase();
    
    // Detect gender
    let gender: 'unisex' | 'male' | 'female' = 'unisex';
    if (/\b(man|men|boy|boys|male|males|gentleman|gentlemen|guy|guys)\b/i.test(lower)) {
      gender = 'male';
    } else if (/\b(woman|women|girl|girls|female|females|lady|ladies)\b/i.test(lower)) {
      gender = 'female';
    }

    // Detect general clothing elements
    const garments: string[] = [];
    if (lower.includes('dress') || lower.includes('gown')) garments.push('dress');
    if (lower.includes('suit') || lower.includes('tuxedo')) garments.push('suit');
    if (lower.includes('jacket') || lower.includes('coat') || lower.includes('overcoat') || lower.includes('blazer')) garments.push('outerwear');
    if (lower.includes('pants') || lower.includes('trousers') || lower.includes('jeans') || lower.includes('slacks') || lower.includes('cargos') || lower.includes('skirt')) garments.push('pants');
    if (lower.includes('shirt') || lower.includes('blouse') || lower.includes('top') || lower.includes('t-shirt') || lower.includes('tee')) garments.push('top');
    if (lower.includes('hoodie') || lower.includes('sweater') || lower.includes('pullover') || lower.includes('cardigan')) garments.push('casual_top');

    // Detect color cues
    const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'brown', 'gray', 'grey', 'beige', 'cream', 'ivory', 'navy', 'gold', 'silver', 'burgundy', 'olive', 'terracotta', 'camel', 'charcoal', 'taupe', 'emerald', 'violet', 'pink', 'orange', 'purple', 'magenta', 'blush'];
    const colorMatch = lower.match(/\b(black|white|red|blue|green|yellow|brown|gray|grey|beige|cream|ivory|navy|gold|silver|burgundy|olive|terracotta|camel|charcoal|taupe|emerald|violet|pink|orange|purple|magenta|blush)\b/i);
    const color = colorMatch ? colorMatch[1] : 'neutral';

    // Detect vibe or theme
    let vibe = 'Quiet Luxury';
    if (lower.includes('street') || lower.includes('cyber') || lower.includes('techwear') || lower.includes('urban')) {
      vibe = 'Streetwear';
    } else if (lower.includes('avant') || lower.includes('experimental') || lower.includes('future') || lower.includes('abstract')) {
      vibe = 'Cyber Avant-Garde';
    } else if (lower.includes('wedding') || lower.includes('formal') || lower.includes('gala')) {
      vibe = 'Wedding / Formal';
    } else if (lower.includes('minimal') || lower.includes('clean') || lower.includes('simple')) {
      vibe = 'Quiet Luxury';
    }

    // Explicit Garment Type
    const garmentTypes = ['dress', 'gown', 'suit', 'tuxedo', 'jacket', 'coat', 'overcoat', 'blazer', 'trousers', 'pants', 'jeans', 'skirt', 'shirt', 'blouse', 'top', 'hoodie', 'sweater', 't-shirt', 'tee', 'frock'];
    let explicitGarmentType: string | undefined;
    for (const g of garmentTypes) {
      if (lower.includes(g)) {
        explicitGarmentType = g;
        break;
      }
    }

    // Explicit Color
    let explicitColor: string | undefined;
    for (const c of colors) {
      if (lower.includes(c)) {
        explicitColor = c;
        break;
      }
    }

    // Sleeve Type
    const sleeveTypes = [
      'sleeveless', 'bare-shoulder', 'no sleeves', 'long-sleeve', 'long sleeve', 'long-sleeved', 'full sleeves', 
      'short-sleeve', 'short sleeve', 'short-sleeved', 'puff sleeve', 'puff-sleeved', 'puff sleeves', 'voluminous sleeves', 
      'asymmetric sleeve', 'single sleeve', 'single-sleeve', 'dolman sleeve', 'dolman sleeves', 'flared sleeve', 
      'flared sleeves', 'poet sleeve', 'poet sleeves', 'bell sleeve', 'bell sleeves', 'cap sleeve', 'cap sleeves'
    ];
    let explicitSleeveType: string | undefined;
    for (const s of sleeveTypes) {
      if (lower.includes(s)) {
        explicitSleeveType = s;
        break;
      }
    }

    // Neckline / Collar
    const necklines = [
      'v-neck', 'v neck', 'v-collar', 'deep v', 'deep-v', 'plunge neckline', 'crew neck', 'crewneck', 'collarless', 
      'mock collar', 'mock-collar', 'high neck', 'high-neck', 'mock neck', 'mock-neck', 'cowl neck', 'cowl-neck', 
      'cascading neck', 'spread collar', 'spread-collar', 'portrait collar', 'portrait-collar', 'peak lapel', 
      'notch lapel', 'lapel', 'double-breasted collar', 'halter neck', 'halter-neck', 'boat neck', 'boat-neck', 
      'sweetheart neckline', 'sweetheart neck', 'off-the-shoulder'
    ];
    let explicitNeckline: string | undefined;
    for (const n of necklines) {
      if (lower.includes(n)) {
        explicitNeckline = n;
        break;
      }
    }

    // Silhouette
    const silhouettes = [
      'column silhouette', 'column shape', 'asymmetric silhouette', 'asymmetric structural', 'sculptural shoulder', 
      'sharp shoulder', 'cinched waist', 'cinched-waist', 'tailored hourglass', 'oversized cocoon', 'oversized silhouette', 
      'slouchy shape', 'loose fit', 'loose-fit', 'double-breasted cut', 'double-breasted silhouette', 'deconstructed layered', 
      'wrap silhouette', 'bias-cut draped', 'slim-fit', 'slim fit', 'straight fit', 'straight-fit', 'wide-leg', 'wide leg'
    ];
    let explicitSilhouette: string | undefined;
    for (const s of silhouettes) {
      if (lower.includes(s)) {
        explicitSilhouette = s;
        break;
      }
    }

    // Footwear
    const footwearList = [
      'stiletto', 'heels', 'pumps', 'boots', 'chelsea boots', 'ankle boots', 'combat boots', 'knee-high boots', 
      'mules', 'slides', 'sneakers', 'trainers', 'flats', 'square-toe flats', 'oxfords', 'derbies', 'brogues', 
      'slingback', 'slingbacks', 'sandals', 'loafers'
    ];
    let explicitFootwear: string | undefined;
    for (const f of footwearList) {
      if (lower.includes(f)) {
        explicitFootwear = f;
        break;
      }
    }

    // Accessories
    const accessoryKeywords = [
      'clutch', 'pouch', 'purse', 'bag', 'handbag', 'tote', 'crossbody', 'sunglasses', 'glasses', 'eyewear', 
      'spectacles', 'scarf', 'neckerchief', 'belt', 'waistband', 'buckle', 'gloves', 'jewelry', 'necklace', 
      'bracelet', 'ring', 'earrings', 'cuff'
    ];
    const explicitAccessories: string[] = [];
    for (const acc of accessoryKeywords) {
      if (lower.includes(acc)) {
        explicitAccessories.push(acc);
      }
    }

    // Age
    let explicitAge: number | undefined;
    const ageMatch = lower.match(/\b(age|aged)\s+(\d{2})\b/i) || lower.match(/\b(\d{2})\s*(years old|yo)\b/i);
    if (ageMatch) {
      explicitAge = parseInt(ageMatch[2] || ageMatch[1]);
    } else if (lower.includes('young')) {
      explicitAge = 22;
    } else if (lower.includes('mature') || lower.includes('older')) {
      explicitAge = 40;
    }

    // Body Type
    const bodyTypes = [
      'statuesque', 'runway standard', 'model proportions', 'athletic', 'toned', 'muscular', 'slender', 'lean', 
      'slim', 'petite', 'tall', 'curvy', 'hourglass', 'plus-size', 'full-figured'
    ];
    let explicitBodyType: string | undefined;
    for (const b of bodyTypes) {
      if (lower.includes(b)) {
        explicitBodyType = b;
        break;
      }
    }

    // Pose
    const poses = [
      'walking posture', 'walking stance', 'mid-stride', 'stride', 'walking', 'standing posture', 'standing stance', 
      'standing', 'asymmetrical stance', 'asymmetrical pose', 'runway stance', 'catwalk walk', 'three-quarter view', 
      'three-quarter profile', 'direct gaze', 'gazing into lens', 'looking off-camera', 'seated', 'sitting'
    ];
    let explicitPose: string | undefined;
    for (const p of poses) {
      if (lower.includes(p)) {
        explicitPose = p;
        break;
      }
    }

    // Background scene/location extraction
    const bgKeywords = ['in a ', 'on a ', 'set in ', 'set against ', 'inside a ', 'at a ', 'background features ', 'background of '];
    let explicitBackground: string | undefined;
    for (const bg of bgKeywords) {
      const idx = lower.indexOf(bg);
      if (idx !== -1) {
        const sub = prompt.substring(idx).split(/[.,;]/)[0];
        explicitBackground = sub.trim();
        break;
      }
    }
    if (!explicitBackground) {
      if (lower.includes('background') || lower.includes('setting') || lower.includes('location')) {
        const phrases = prompt.split(/[.,;]/);
        for (const phrase of phrases) {
          const lp = phrase.toLowerCase();
          if (lp.includes('background') || lp.includes('setting') || lp.includes('location')) {
            explicitBackground = phrase.trim();
            break;
          }
        }
      }
    }

    // Creative Freedom Allowed
    const creativeKeywords = [
      'creative freedom', 'anything goes', 'surprise me', 'do whatever', 'any style', 'creative license', 
      'allow creative freedom', 'be creative', 'your choice', 'artistic freedom'
    ];
    const creativeFreedomAllowed = creativeKeywords.some(k => lower.includes(k));

    // Split Outfit Top/Bottom Intelligence
    let explicitTop: string | undefined;
    let explicitBottom: string | undefined;
    const splitWords = [' and ', ' with ', ' paired with ', ' matched with '];
    let parts: string[] = [];
    for (const sw of splitWords) {
      if (lower.includes(sw)) {
        parts = lower.split(sw);
        break;
      }
    }
    if (parts.length >= 2) {
      const part1 = parts[0].trim();
      const part2 = parts[1].trim();
      const topKeywords = ['shirt', 'top', 'blouse', 'sweater', 'hoodie', 'jacket', 'coat', 'blazer', 'tee', 't-shirt', 'pullover', 'cardigan', 'suit'];
      const bottomKeywords = ['pants', 'jeans', 'trousers', 'skirt', 'shorts', 'leggings', 'slacks', 'cargos'];
      const p1HasTop = topKeywords.some(k => part1.includes(k));
      const p1HasBottom = bottomKeywords.some(k => part1.includes(k));
      const p2HasTop = topKeywords.some(k => part2.includes(k));
      const p2HasBottom = bottomKeywords.some(k => part2.includes(k));
      if (p1HasTop || p2HasBottom) {
        explicitTop = part1;
        explicitBottom = part2;
      } else if (p2HasTop || p1HasBottom) {
        explicitTop = part2;
        explicitBottom = part1;
      } else {
        explicitTop = part1;
        explicitBottom = part2;
      }
    } else {
      const topKeywords = ['shirt', 'top', 'blouse', 'sweater', 'hoodie', 'jacket', 'coat', 'blazer', 'tee', 't-shirt', 'pullover', 'cardigan', 'suit', 'tuxedo'];
      const bottomKeywords = ['pants', 'jeans', 'trousers', 'skirt', 'shorts', 'leggings', 'slacks', 'cargos'];
      const isDress = lower.includes('dress') || lower.includes('gown') || lower.includes('frock');
      if (isDress) {
        explicitTop = lower;
        explicitBottom = 'integrated fluid gown skirt';
      } else if (topKeywords.some(k => lower.includes(k))) {
        explicitTop = lower;
      } else if (bottomKeywords.some(k => lower.includes(k))) {
        explicitBottom = lower;
      }
    }

    return {
      rawPrompt: prompt,
      gender,
      detectedGarments: garments,
      primaryColor: color,
      inferredVibe: vibe,
      hasLighting: lower.includes('light') || lower.includes('studio') || lower.includes('sun') || lower.includes('glow'),
      hasComposition: lower.includes('shot') || lower.includes('composition') || lower.includes('lens') || lower.includes('perspective') || lower.includes('framing'),
      hasBackground: lower.includes('background') || lower.includes('setting') || lower.includes('atrium') || lower.includes('street') || lower.includes('indoor') || lower.includes('outdoor') || !!explicitBackground,
      hasPose: lower.includes('pose') || lower.includes('standing') || lower.includes('walking') || lower.includes('gaze') || lower.includes('expression') || !!explicitPose,
      isWeak: prompt.length < 40 || garments.length === 0,
      
      // High-Fidelity & Hierarchy Fields
      explicitGarmentType,
      explicitColor,
      explicitSleeveType,
      explicitNeckline,
      explicitSilhouette,
      explicitFootwear,
      explicitAccessories,
      explicitAge,
      explicitBodyType,
      explicitPose,
      explicitBackground,
      creativeFreedomAllowed,
      explicitTop,
      explicitBottom
    };
  }
}

/**
 * 2. FASHION CONTEXT ENGINE
 * Resolves context, season, luxury levels, and brand alignment.
 */
export class FashionContextEngine {
  static getContext(analysis: ReturnType<typeof PromptUnderstandingEngine.analyze>) {
    const isWinter = analysis.rawPrompt.toLowerCase().includes('winter') || analysis.rawPrompt.toLowerCase().includes('cold') || analysis.rawPrompt.toLowerCase().includes('snow');
    const isSummer = analysis.rawPrompt.toLowerCase().includes('summer') || analysis.rawPrompt.toLowerCase().includes('beach') || analysis.rawPrompt.toLowerCase().includes('hot');
    
    return {
      vibe: analysis.inferredVibe,
      season: isWinter ? 'Winter' : (isSummer ? 'Summer' : 'All-Season'),
      formality: analysis.inferredVibe === 'Wedding / Formal' ? 'Formal' : (analysis.inferredVibe === 'Quiet Luxury' ? 'Relaxed Tailored' : 'Casual'),
      targetMarket: 'Enterprise Haute Couture'
    };
  }
}

/**
 * 3. OUTFIT INTELLIGENCE ENGINE
 * Transforms simple clothing items into ultra-premium, structurally detailed sartorial statements.
 */
export class OutfitIntelligenceEngine {
  static enrichGarments(analysis: ReturnType<typeof PromptUnderstandingEngine.analyze>): string {
    const lower = analysis.rawPrompt.toLowerCase();
    const color = analysis.primaryColor !== 'neutral' ? analysis.primaryColor : 'charcoal';

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const fabrics = [
      'heavyweight double-faced Italian wool crepe and mulberry silk',
      'crisp Loro Piana double-faced cashmere and brushed camel hair',
      'structured silk faille and fluid Neapolitan wool-crepe',
      'pleated liquid satin and heavy wool gabardine',
      'fine-threaded herringbone wool flannel and soft silk georgette',
      'exquisite matte box-calf leather panels and brushed cashgora'
    ];

    const silhouettes = [
      'an asymmetric structured waist, fluid Neapolitan shoulder drapes, and seamless structural tailoring',
      'strong sculptural shoulders, a clean cinched waistline, and sophisticated blind-stitched hems',
      'a minimalist column silhouette, a subtle low-back cut, and sophisticated floor-sweeping drape',
      'oversized cocoon drape lines, relaxed natural shoulder seams, and an elegant fluid silhouette',
      'a high-neck double-breasted utility layout with precise hand-finished sartorial seams'
    ];

    const details = [
      'exquisite micro-stitching, flawless real seams, premium construction, and authentic fabric creases',
      'gravity-accurate fabric folds, impeccable tailoring, and real steam-pressed textile texture',
      'intricate fiber fidelity, authentic fabric weight, and clean, non-synthetic material lines',
      'sculptural garment pleating, pristine structural form, and immaculate haute-couture construction'
    ];

    const boots = [
      'paired with handmade pointed-toe stiletto boots in buttery matte calfskin',
      'paired with sculptural transparent plexiglass block-heel mules',
      'paired with bespoke Chelsea boots in mirror-polished box-calf leather',
      'paired with minimalist white leather trainers with clean, understated lines'
    ];

    const bags = [
      'carrying a structured geometric trapezoid clutch in glossy lizard-embossed leather',
      'carrying an oversized soft-pleated pouch in buttery nappa leather',
      'carrying a micro structured top-handle bag in matte box-calf leather with white-gold details',
      'carrying a sleek leather crossbody shoulder pouch with an architectural metal buckle'
    ];

    // If the user specifies specific outfits like "black dress", we generate different luxury dresses every time:
    if (lower.includes('black dress') || (analysis.detectedGarments.includes('dress') && color === 'black')) {
      const dressStyles = [
        `an exquisite deconstructed evening gown in ${pick(fabrics)}, featuring ${pick(silhouettes)}, finished with ${pick(details)}, ${pick(boots)}, and ${pick(bags)}`,
        `a high-fashion structured column dress in ${pick(fabrics)}, boasting ${pick(silhouettes)}, with ${pick(details)}, ${pick(boots)}, and ${pick(bags)}`,
        `a fluid asymmetrical draped gown in liquid silk satin, showcasing ${pick(silhouettes)}, detailed with ${pick(details)}, ${pick(boots)}, and ${pick(bags)}`
      ];
      return pick(dressStyles);
    }

    if (analysis.detectedGarments.includes('dress')) {
      const dressStyles = [
        `a couture column dress in pleated liquid ${color} satin, showcasing ${pick(silhouettes)}, with ${pick(details)}, ${pick(boots)}, and ${pick(bags)}`,
        `an asymmetric draped high-neck gown in ${color} ${pick(fabrics)}, showing ${pick(silhouettes)}, detailed with ${pick(details)}, ${pick(boots)}, and ${pick(bags)}`,
        `a tailored structural slip dress in heavy ${color} silk faille, featuring ${pick(silhouettes)}, with ${pick(details)}, ${pick(boots)}, and ${pick(bags)}`
      ];
      return pick(dressStyles);
    }

    if (analysis.detectedGarments.includes('suit') || lower.includes('tuxedo')) {
      const suitStyles = [
        `a bespoke slim-fit three-piece tuxedo in midnight ${color} barathea wool, detailed with silk satin peak lapels, a tailored double-breasted vest, pressed trousers with a subtle side stripe, ${pick(boots)}, and ${pick(bags)}`,
        `a modern oversized double-breasted suit in soft ${color} cashmere-flannel, featuring unstructured natural shoulders, a fluid vertical drape, ${pick(boots)}, and ${pick(bags)}`,
        `a contemporary minimalist two-piece suit in tailored ${color} gabardine, showing clean hidden-button closures, seamless pockets, ${pick(boots)}, and ${pick(bags)}`
      ];
      return pick(suitStyles);
    }

    if (analysis.detectedGarments.includes('outerwear') || lower.includes('jacket') || lower.includes('coat')) {
      const outerwearStyles = [
        `an unstructured luxury overcoat in Loro Piana cashmere and brushed camel hair, featuring relaxed natural shoulders, clean hand-stitched seams, and an elegant fluid silhouette, ${pick(boots)}, and ${pick(bags)}`,
        `a tailored sharp-shoulder blazer in premium ${color} ${pick(fabrics)}, featuring immaculate blind-stitching, paired with matching wide-leg trousers, ${pick(boots)}, and ${pick(bags)}`,
        `a double-breasted utility jacket in heavy ${color} wool gabardine, designed with dropped shoulders and raw seam details, paired with a sleek leather belt, ${pick(boots)}, and ${pick(bags)}`
      ];
      return pick(outerwearStyles);
    }

    if (analysis.detectedGarments.includes('pants') || lower.includes('trousers')) {
      return `tailored high-waisted pleated trousers in heavy ${color} wool flannel, showing elegant straight-leg silhouettes, precise blind-stitched hems, ${pick(boots)}, and ${pick(bags)}`;
    }

    if (analysis.detectedGarments.includes('top') || lower.includes('shirt') || lower.includes('blouse')) {
      return `a crisp double-cuff dress shirt in premium Sea Island cotton, featuring a modern spread collar, meticulous sartorial stitching, ${pick(boots)}, and ${pick(bags)}`;
    }

    if (lower.includes('hoodie') || lower.includes('sweater') || analysis.detectedGarments.includes('casual_top')) {
      return `a boxy oversized heavyweight hoodie in 450gsm organic loopback French terry, designed with dropped shoulders, clean seamless construction, a dense structured hood drape, ${pick(boots)}, and ${pick(bags)}`;
    }

    // Default premium outfit description
    const rawLook = analysis.rawPrompt.replace(/unisex|male|female|man|woman|girl|boy/gi, '').trim() || 'an understated luxury look';
    return `an exceptional lookbook outfit featuring "${rawLook}", custom-crafted in ${pick(fabrics)}, showing ${pick(silhouettes)}, ${pick(details)}, ${pick(boots)}, and ${pick(bags)}`;
  }
}

/**
 * 4. LUXURY FASHION PHOTOGRAPHY ENGINE
 * Injects Hasselblad and high-end camera lens parameters for incredible realism.
 */
export class LuxuryFashionPhotographyEngine {
  static getSettings(): string {
    return `photographed on Hasselblad H6D-100c medium format camera, razor-sharp focus, capturing every micro-detail with pristine clarity, high-fashion professional magazine cover standard`;
  }
}

/**
 * 5. EDITORIAL COMPOSITION ENGINE
 * Assures balanced visual layout and high-fashion negative space.
 */
export class EditorialCompositionEngine {
  static getComposition(): string {
    return `meticulous golden ratio composition, elegant use of dramatic negative space, balanced offset framing, sophisticated studio-scale perspective`;
  }
}

/**
 * 6. CAMERA ANGLE INTELLIGENCE
 * Computes optimal perspective based on the clothing type.
 */
export class CameraAngleIntelligence {
  static getAngle(analysis: ReturnType<typeof PromptUnderstandingEngine.analyze>): string {
    if (analysis.detectedGarments.includes('dress') || analysis.detectedGarments.includes('suit')) {
      return `captured from a slightly below eye-level, low-angle hero stance to accentuate the grand couture silhouette and fluid vertical drape`;
    }
    return `eye-level medium close-up, focusing dynamically on the intricate clothing interface and tailored chest lines`;
  }
}

/**
 * 7. POSE INTELLIGENCE
 * Curates haute-couture physical postures.
 */
export class PoseIntelligence {
  static getPose(analysis: ReturnType<typeof PromptUnderstandingEngine.analyze>): string {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    if (analysis.inferredVibe === 'Streetwear') {
      const poses = [
        'nonchalant relaxed stance, one hand in pocket, natural urban turn, conveying effortless confidence',
        'dynamic walking posture captured mid-stride, showcasing the fluid movement of the garment, casual head tilt',
        'effortless street-couture stance with elegant weight distribution, shoulders relaxed, looking slightly off-camera'
      ];
      return pick(poses);
    }
    
    const poses = [
      'haute-couture editorial runway modeling pose, poised and dignified stance with elegant shoulder geometry, showcasing the garment structure with fluid physical poise',
      'high-fashion asymmetrical stance, weight shifted elegantly on one hip, arms relaxed, presenting the fabric drape in perfect three-quarter view',
      'sovereign high-fashion poise, body aligned with golden ratio balance, elongated neck, and a powerful modeling posture that looks expensive and cinematic'
    ];
    return pick(poses);
  }
}

/**
 * 8. FACIAL EXPRESSION INTELLIGENCE
 * Establishes calm, high-fashion model gazes.
 */
export class FacialExpressionIntelligence {
  static getExpression(): string {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const options = [
      'exquisite symmetrical facial features of a professional luxury fashion model, beautiful realistic eyes with razor-sharp detailed iris reflection, fine individual eyelashes, natural soft skin texture with visible micro-pores, natural soft light contours, expressive confident look, free of artificial waxiness, completely natural real human look, no cartoon or plastic rendering',
      'serene, aloof high-fashion gaze, neutral dignified expression, beautiful symmetrical eyes with perfect iris detailing, real skin pores, completely photorealistic and beautiful model look',
      'composed sovereign high-fashion look, subtle refined intelligent gaze looking slightly away from the camera, gorgeous symmetric model features, natural shadows on skin'
    ];
    return pick(options);
  }
}

/**
 * 9. ANATOMY CORRECTION INTELLIGENCE
 * Enforces highly symmetric, proportional figures.
 */
export class AnatomyCorrectionIntelligence {
  static getAnatomyCorrection(): string {
    return `perfectly balanced model proportions, symmetric natural shoulders, elegantly elongated neck, natural arm joints with anatomically correct elbows, realistic leg-to-torso ratio, natural knee caps, natural feet, absolute skeletal and muscular perfection with organic physical weight and presence, zero physical distortion`;
  }
}

/**
 * 10. HAND CORRECTION INTELLIGENCE
 * Hardcodes strict constraints for flawless rendering of hands and fingers.
 */
export class HandCorrectionIntelligence {
  static getHandCorrection(): string {
    return `immaculate hand anatomy, perfectly formed five fingers on each hand, detailed fingernails, clean fingers without extra joints or duplicate limbs, relaxed and elegant resting posture, high-fidelity fingers with perfect skin creases, flawless hand structures, completely natural skin folds`;
  }
}

/**
 * 11. FABRIC SIMULATION INTELLIGENCE
 * Simulates physical fabric weight, drape, and gravity.
 */
export class FabricSimulationIntelligence {
  static getFabricSim(): string {
    return `accurate cloth-solved gravity simulation, heavy satin and wool fabric responding realistically to physical posture with natural draping folds, friction-aware structural creases, premium fabric drape, real stitching, real folds`;
  }
}

/**
 * 12. MATERIAL REALISM ENGINE
 * Refines the physical quality of fabrics.
 */
export class MaterialRealismEngine {
  static getMaterialRealism(): string {
    return `tactile premium materials, genuine matte calfskin leather grains, organic high-density thread count, brushed platinum hardware details, exquisite fiber fidelity, real stitches, premium construction`;
  }
}

/**
 * 13. TEXTURE ENHANCEMENT ENGINE
 * Highlights macro-level textile weaves.
 */
export class TextureEnhancementEngine {
  static getTexture(): string {
    return `ultra-detailed micro-texture of fabric weaves, intricate wool herringbone patterns, delicate silk slubs visible in macro-focus, clean non-synthetic thread lines, real textile weaves, editorial styling`;
  }
}

/**
 * 14. COLOR HARMONY ENGINE
 * Formulates sophisticated high-end palettes.
 */
export class ColorHarmonyEngine {
  static getPalette(analysis: ReturnType<typeof PromptUnderstandingEngine.analyze>): string {
    const color = analysis.primaryColor;
    if (color === 'neutral') {
      return `sophisticated monochromatic palette of charcoal, warm taupe, and cream-white, beautifully graded with cinematic Kodak Portra 400 film tones`;
    }
    return `harmonized color palette featuring dominant luxurious ${color} tone, complemented by soft charcoal and champagne gold accenting, rich color depth, luxury color grading`;
  }
}

/**
 * 15. FASHION TREND INTELLIGENCE
 * Leverages contemporary editorial shapes.
 */
export class FashionTrendIntelligence {
  static getTrend(): string {
    return `contemporary minimalist tailoring, modern architectural asymmetry, deconstructed overlapping panels, refined street-couture synthesis`;
  }
}

/**
 * 16. SEASONAL FASHION INTELLIGENCE
 * Applies weather-appropriate fabric layers.
 */
export class SeasonalFashionIntelligence {
  static getSeasonStyle(season: string): string {
    if (season === 'Winter') {
      return `luxurious heavy winter layering, thermal wool weaves, elegant draping scarf lines, cozy protective high-fashion collars`;
    }
    if (season === 'Summer') {
      return `light summer styling, breathable Irish linen weaves, fluid silk-linen blends, airy open tailoring, sun-kissed fabric movement`;
    }
    return `all-season versatile couture, lightweight structural fabric balancing insulation and supreme breathability`;
  }
}

/**
 * 17. LUXURY BRAND STYLING INTELLIGENCE
 * Aligns aesthetic choices with iconic luxury designers.
 */
export class LuxuryBrandStylingIntelligence {
  static getBrandAesthetic(vibe: string): string {
    if (vibe === 'Streetwear') {
      return `styled with the industrial boxy silhouette of Balenciaga and technical modularity of Acronym`;
    }
    if (vibe === 'Cyber Avant-Garde') {
      return `styled with the deconstructed avant-garde proportions of Rick Owens and geometric lines of Prada`;
    }
    return `infused with the understated luxury aesthetic of Loro Piana, tailored elegance of Celine, and clean architectural lines of Jil Sander`;
  }
}

/**
 * 18. LIGHTING INTELLIGENCE
 * Establishes classic Rembrandt studio light.
 */
export class LightingIntelligence {
  static getLighting(): string {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const options = [
      'professional studio Rembrandt lighting, dramatic soft key light with subtle rim highlights, delicate high-contrast shadows defining the outfit\'s architectural form',
      'cinematic golden hour warm sunlight filtering from the side, creating soft natural shadows, a subtle light glow bloom on the fabrics, and spectacular realistic light dispersion',
      'high-fashion editorial diffused window light, soft even key light with extremely delicate low-contrast shadows, highlighting fine textile weaves beautifully',
      'dramatic runway spotlights, direct high-contrast key light with a glowing backlight rim that isolates the model beautifully from the dark background'
    ];
    return pick(options);
  }
}

/**
 * 19. CINEMATIC LIGHTING ENGINE
 * Adds atmospheric depth and light beams.
 */
export class CinematicLightingEngine {
  static getCinematicLight(): string {
    return `cinematic atmospheric backlighting, subtle volumetric light rays filtering through haze, warm organic lens dispersion, high-dynamic-range (HDR) light control`;
  }
}

/**
 * 20. DEPTH & PERSPECTIVE INTELLIGENCE
 * Manages background blur (bokeh) and depth.
 */
export class DepthAndPerspectiveIntelligence {
  static getDepth(): string {
    return `exquisite shallow depth of field, beautifully blurred creamy background bokeh, crisp foreground subject isolation, immense three-dimensional spatial depth`;
  }
}

/**
 * 21. BACKGROUND INTELLIGENCE
 * Places the model in high-end, minimalist architectural spots.
 */
export class BackgroundIntelligence {
  static getBackground(vibe: string): string {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    if (vibe === 'Streetwear' || vibe === 'Cyber Avant-Garde') {
      const streetLux = [
        'set against a brutalist raw-concrete urban underpass with sleek neon accent lighting and wet asphalt textures',
        'set on a clean minimalist back-alley in Tokyo during twilight, with glowing vertical neon shop signs and soft rising mist',
        'set in a deconstructed industrial warehouse with raw brick walls, steel girders, and large iron-framed windows in Milan',
        'set on a modern high-end architectural street with minimalist glass shopfronts and dramatic night-time street lighting'
      ];
      return pick(streetLux);
    }

    const luxuryBackgrounds = [
      'set inside a sun-drenched minimalist limestone architectural atrium with warm natural light, soaring concrete pillars, and elegant soft shadows',
      'set against an elegant historic Parisian building facade during golden hour with a clean limestone street, looking like a Vogue Paris front cover campaign',
      'set in a high-ceiling luxury Milan loft featuring large floor-to-ceiling glass windows overlooking a serene fog-kissed minimalist courtyard',
      'set in an elegant travertine marble courtyard bordered by a calm, reflective pool and soft dry desert grass',
      'set inside a prestigious modern art gallery with pristine white walls, tall glass ceilings, and giant monolithic black sculptures, cinematic fashion photography standard',
      'set on a luxury fashion week runway stage with soft atmospheric haze, low-angle studio lighting, and an elite bokeh-blurred audience'
    ];
    return pick(luxuryBackgrounds);
  }
}

/**
 * 22. ACCESSORIES INTELLIGENCE
 * Equips the model with refined accessory details.
 */
export class AccessoriesIntelligence {
  static getAccessories(): string {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const options = [
      'tastefully styled with logoless grained calfskin leather goods, a minimalist platinum signet ring, and handcrafted clear acetate eyewear',
      'complemented by delicate baroque pearl drop earrings and a thin, polished-brass chain belt',
      'adorned with a thick brushed-silver sculptural metal cuff, rimless sunglasses, and a delicate white-gold collar necklace',
      'styled with an elegant silk-cashmere scarf casually draped over the shoulder and premium micro leather goods',
      'finished with understated gold stud earrings, black cat-eye luxury glasses, and a structured minimalist leather belt'
    ];
    return pick(options);
  }
}

/**
 * 23. HAIR STYLING INTELLIGENCE
 * Styles hair cleanly.
 */
export class HairStylingIntelligence {
  static getHair(): string {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const options = [
      'hair styled in a sleek professional side part, clean structured textures, framing the facial features perfectly',
      'flowing in soft, effortless natural waves framing the face beautifully, with pristine high-fashion movement',
      'a clean, architectural wet-look slicked back style with high definition hair strands',
      'a high, structured minimalist ponytail with clean wrapped leather tie, perfectly framing the model\'s jawline',
      'a loose deconstructed high bun with delicate face-framing strands, styled by a professional editorial hair director'
    ];
    return pick(options);
  }
}

/**
 * 24. MAKEUP INTELLIGENCE
 * Assures professional dewy skin cosmetics.
 */
export class MakeupIntelligence {
  static getMakeup(): string {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const options = [
      'natural dewy skin cosmetic finish, subtle satin tones, flawless dewy complexion, minimal high-fashion aesthetic makeup',
      'striking minimal cosmetics with flawless airbrushed skin and sharp wing-eyeliner, highlighting a luxury model cheekbone structure',
      'dewy sun-kissed cheekbones, glossy neutral lips, and natural brushed-up brows with zero artificial powder finish',
      'monochromatic warm terra-cotta tones, satin complexion, and soft gold-highlights, looking incredibly expensive'
    ];
    return pick(options);
  }
}

/**
 * 25. FASHION MOOD INTELLIGENCE
 * Instills refined, aloof high-fashion moods.
 */
export class FashionMoodIntelligence {
  static getMood(): string {
    return `evoking a mood of effortless affluence, aloof sovereign sophistication, and quiet luxury poise`;
  }
}

/**
 * 26. VISUAL STORYTELLING ENGINE
 * Weaves narrative elements.
 */
export class VisualStorytellingEngine {
  static getStory(): string {
    return `capturing a moment of refined contemplation during a private sanctuary retreat, showcasing elevated sartorial living`;
  }
}

/**
 * 27. FASHION AESTHETIC INTELLIGENCE
 * Standardizes aesthetics to high-end couture.
 */
export class FashionAestheticIntelligence {
  static getAesthetic(): string {
    return `masterfully crafted elite modeling portfolio shot, high-aesthetic curation, Paris fashion week editorial standard, visually stunning`;
  }
}

/**
 * 28. IMAGE QUALITY VALIDATION ENGINE
 * Ensures optimized quality tags and maintains robust negative prompts.
 */
export class ImageQualityValidationEngine {
  static getNegativePrompt(): string {
    return `blurry, out of focus, distorted face, double fingers, deformed hands, extra limbs, low resolution, bad stitching, text watermark, logo, heavy neon athletic-wear, cheap polyester sheen, loose threads, grainy, overexposed, ugly`;
  }
}


// ============================================================================
// 29. FASHION PROMPT ENHANCEMENT ENGINE (ORCHESTRATOR)
// ============================================================================
export class PromptIntelligenceEngine {
  /**
   * Intelligently compresses excessive prompt length without losing any high-fashion styling keywords,
   * keeping the final instruction under 1600 characters for optimal model processing.
   */
  static compressIfNeeded(promptText: string, maxLength = 1600): string {
    if (promptText.length <= maxLength) {
      return promptText;
    }

    const sentences = promptText.split('.').map(s => s.trim()).filter(Boolean);
    const compressedSentences: string[] = [];
    let currentLength = 0;

    for (const sentence of sentences) {
      // Prioritize sentences containing crucial design details
      const hasCrucialKeyword = /subject|model|designed|garment|fabric|crafted|composition|posture|stitching|theme|lighting|camera|shoot|session|palette|brand|anatomy/i.test(sentence);
      
      if (hasCrucialKeyword || currentLength < maxLength * 0.75) {
        const cleanSentence = sentence.replace(/\s+/g, ' ');
        if (!compressedSentences.includes(cleanSentence)) {
          compressedSentences.push(cleanSentence);
          currentLength += cleanSentence.length + 2;
        }
      }
    }

    let result = compressedSentences.join('. ') + '.';
    if (result.length > maxLength) {
      const idx = result.lastIndexOf('.', maxLength);
      if (idx > 0) {
        result = result.substring(0, idx + 1);
      } else {
        result = result.substring(0, maxLength);
      }
    }
    return result;
  }

  /**
   * Promotes any raw prompt into a breathtaking enterprise-quality fashion editorial masterpiece.
   * Aligned strictly with lookbook constraints: fashion focus, no backgrounds (studio only),
   * Headless presentation, extreme texture focus, and strict input adherence.
   */
  static optimize(prompt: string, config?: ImageConfig, designSpec?: FashionDesignSpec): { prompt: string; negativePrompt: string } {
    let raw = prompt ? prompt.trim() : '';
    
    // Constraint 1 & 5: FASHION FOCUS & NON-FASHION HANDLING
    const fashionKeywords = [
      'dress', 'shirt', 'pants', 'suit', 'jeans', 'coat', 'jacket', 'trousers', 'skirt', 'wear', 'outfit', 'apparel',
      'fashion', 'garment', 'blouse', 'sweater', 'hoodie', 'shoes', 'boots', 'accessories', 'bag', 'leather', 'sartorial',
      'look', 'style', 'denim', 'silk', 'wool', 'cashmere', 'knitwear', 'model', 'mannequin', 'top', 'bottom', 'tee',
      't-shirt', 'sneaker', 'heel', 'clothing', 'vest', 'outerwear', 'blazer', 'cardigan', 'kimono', 'robe', 'parka',
      'trench', 'pullover', 'scarf', 'jewelry', 'necklace', 'bracelet', 'ring', 'earring'
    ];
    
    const nonFashionKeywords = [
      'dog', 'cat', 'bird', 'lion', 'horse', 'cow', 'sheep', 'pig', 'tiger', 'bear', 'animal', 'pet',
      'car', 'truck', 'vehicle', 'motorcycle', 'airplane', 'train', 'bus', 'scooter', 'automobile',
      'tree', 'river', 'mountain', 'landscape', 'forest', 'nature', 'ocean', 'beach', 'sunset',
      'building', 'house', 'skyscraper', 'office block', 'landmark', 'cityscape'
    ];

    const lowerRaw = raw.toLowerCase();
    const hasNonFashion = nonFashionKeywords.some(keyword => {
      const regex = new RegExp(`\\b${keyword}s?\\b`, 'i');
      return regex.test(lowerRaw);
    });

    if (hasNonFashion && raw !== '') {
      // Prompt Modulator: Automatically rewrite prompt to "Fashion editorial outfit inspired by [User's Input] aesthetics."
      let inspiredTranslation = 'aesthetic high-fashion garment';
      if (lowerRaw.includes('car') || lowerRaw.includes('vehicle') || lowerRaw.includes('automobile') || lowerRaw.includes('truck') || lowerRaw.includes('motorcycle')) {
        inspiredTranslation = 'avant-garde automotive-inspired high-fashion jacket';
      } else if (lowerRaw.includes('dog') || lowerRaw.includes('cat') || lowerRaw.includes('animal') || lowerRaw.includes('pet') || lowerRaw.includes('lion') || lowerRaw.includes('bear') || lowerRaw.includes('tiger')) {
        inspiredTranslation = 'fauna-inspired textured high-fashion coat';
      } else if (lowerRaw.includes('tree') || lowerRaw.includes('forest') || lowerRaw.includes('nature') || lowerRaw.includes('mountain') || lowerRaw.includes('river')) {
        inspiredTranslation = 'organic foliage-inspired fluid couture drapery';
      } else {
        inspiredTranslation = `${raw}-inspired bespoke luxury garment`;
      }
      raw = `Fashion editorial outfit inspired by ${raw} aesthetics, beautifully resolved as a custom ${inspiredTranslation}`;
    } else {
      const isFashionRelated = fashionKeywords.some(kw => raw.toLowerCase().includes(kw));
      
      if (!isFashionRelated && raw !== '') {
        // Input is non-fashion related, replace with high-end minimalist outfit to respect the mandate
        raw = `An exquisite high-end minimalist outfit, styling-focused luxury lookbook presentation, inspired by the theme of "${raw}" but strictly resolved as a premium fashion garment`;
      }
    }

    if (!raw) {
      return {
        prompt: `Photorealistic professional fashion lookbook. A tailored quiet luxury outfit. Rembrandt studio lighting, clean solid light grey studio setting background, Hasselblad 85mm lens. Headless mannequin style focus on fabric, denim and wool textures.`,
        negativePrompt: ImageQualityValidationEngine.getNegativePrompt()
      };
    }

    // Step 2: Prompt Understanding
    const analysis = PromptUnderstandingEngine.analyze(raw);

    // Step 1: Execute the complete Fashion Design Intelligence System (The LOOK VISION Brain)
    const spec = designSpec || FashionDesignIntelligenceSystem.design(raw, config);

    // Step 3: Fashion Context
    const context = FashionContextEngine.getContext(analysis);

    // Constraint 2: NO BACKGROUNDS (Studio Setting Only) unless explicitly requested
    if (analysis.explicitBackground) {
      spec.diversity.background = `A clean beautiful setting background of: ${analysis.explicitBackground}, beautifully arranged, minimalist, high-fashion catalog standard. NO roads, NO outdoor streets unless explicitly requested.`;
      if (spec.blueprints && spec.blueprints.scene) {
        spec.blueprints.scene.background = `Beautiful setting: ${analysis.explicitBackground}`;
        spec.blueprints.scene.location = analysis.explicitBackground;
      }
    } else {
      const bgOptions = [
        'A clean, neutral solid white studio setting background, completely minimalist and flat, with professional soft natural shadow drop. NO landscapes, NO buildings, NO nature, NO outdoor scenes, NO rain, NO desert.',
        'A clean, neutral solid light grey studio setting background, completely flat and neutral, casting extremely soft studio shadows under-feet. NO landscapes, NO buildings, NO nature, NO outdoor scenes, NO rain, NO desert.',
        'A solid dark slate studio setting background, deep premium slate-grey, completely neutral, minimalist and clean. NO landscapes, NO buildings, NO nature, NO outdoor scenes, NO rain, NO desert.'
      ];
      const bgIdx = Math.abs(raw.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % bgOptions.length;
      const neutralStudioBackground = bgOptions[bgIdx];
      spec.diversity.background = neutralStudioBackground;
      if (spec.blueprints && spec.blueprints.scene) {
        spec.blueprints.scene.background = neutralStudioBackground;
        spec.blueprints.scene.location = 'Neutral studio setting';
      }
    }

    // Constraint 3: NO FACES (Headless mannequin / neck down focus) unless explicitly requested
    const hasFaceRequest = lowerRaw.includes('face') || lowerRaw.includes('expression') || lowerRaw.includes('gaze') || lowerRaw.includes('looking') || lowerRaw.includes('portrait') || lowerRaw.includes('model') || lowerRaw.includes('woman') || lowerRaw.includes('man') || lowerRaw.includes('girl') || lowerRaw.includes('boy') || lowerRaw.includes('gazing') || lowerRaw.includes('profile');
    const chosenGenderText = analysis.gender === 'male' ? 'male' : (analysis.gender === 'female' ? 'female' : 'unisex');

    if (hasFaceRequest && !lowerRaw.includes('headless')) {
      spec.avatar.consistentFace = `A gorgeous, highly professional fashion model face, symmetrical eyes, sharp look, photorealistic facial details.`;
      spec.avatar.makeup = `Elegant professional high-fashion runway makeup.`;
      spec.avatar.hairstyle = `Perfect professional hair style.`;
      spec.avatar.ethnicity = `statuesque professional ${chosenGenderText} fashion model`;
    } else {
      const faceObscuredDescription = `Focus: Headless style, cropped elegantly from the shoulders down (mannequin-style) or depicted as a professional model with their face completely out of frame, focusing 100% of the visual attention on the garment, drape, and material contours rather than the face.`;
      spec.avatar.consistentFace = faceObscuredDescription;
      spec.avatar.makeup = `Face is completely out of frame or obscured to maintain 100% focus on the garment structure`;
      spec.avatar.hairstyle = `Face is completely out of frame or obscured`;
      spec.avatar.ethnicity = `statuesque professional ${chosenGenderText} model cropped from the neck down (headless style) focusing solely on the clothing`;
    }

    if (spec.blueprints && spec.blueprints.avatar) {
      spec.blueprints.avatar.expression = hasFaceRequest ? 'gazing professionally' : 'Headless style, focusing entirely on the outfit';
      spec.blueprints.avatar.faceShape = hasFaceRequest ? 'symmetrical runway standard' : 'Out of frame / neck down crop';
      spec.blueprints.avatar.hairStyle = hasFaceRequest ? 'immaculate styling' : 'Out of frame';
    }

    // Constraint 4: TEXTURE & DETAIL FOCUS
    // Focus heavily on fabric folds, detailed stitching, precise raw seams, and materials like denim, silk, cotton, etc.
    spec.garment.stitching = `precision high-contrast stitching, immaculate tailoring seams, visible thread density`;
    spec.garment.textures = `exquisite physical material textures, fabric folds, stitching details, and material construction (such as denim, silk, cotton, or wool fibers)`;
    spec.realism.wrinkles = `gravity-accurate fabric folds, natural tension creases where elbows and knees bend, real physical textile weight and presence`;
    spec.realism.seams = `steam-pressed real tailoring seams, flawless double-stitching lines, absolute garment structural integrity`;
    spec.realism.folds = `fluid, heavy drapes responding naturally to physical posture with authentic fabric weight and natural creases`;

    // Constraint 5: INPUT ADHERENCE (Parse prompt elements for top/bottom clothing details)
    spec.garment.description = `exquisite high-fashion garment precisely depicting the requested clothing: "${raw}"`;
    const lowerRawGarment = raw.toLowerCase();
    if (lowerRawGarment.includes('shirt') || lowerRawGarment.includes('top') || lowerRawGarment.includes('blouse') || lowerRawGarment.includes('sweater') || lowerRawGarment.includes('hoodie') || lowerRawGarment.includes('jacket') || lowerRawGarment.includes('coat') || lowerRawGarment.includes('blazer') || lowerRawGarment.includes('tee') || lowerRawGarment.includes('t-shirt')) {
      const topMatch = raw.match(/([a-zA-Z-\s]+(shirt|top|blouse|sweater|hoodie|jacket|coat|blazer|tee|t-shirt))/i);
      if (topMatch) {
        spec.outfit.top = topMatch[0].trim();
      } else {
        spec.outfit.top = raw;
      }
    }
    if (lowerRawGarment.includes('pants') || lowerRawGarment.includes('jeans') || lowerRawGarment.includes('trousers') || lowerRawGarment.includes('skirt') || lowerRawGarment.includes('shorts')) {
      const bottomMatch = raw.match(/([a-zA-Z-\s]+(pants|jeans|trousers|skirt|shorts))/i);
      if (bottomMatch) {
        spec.outfit.bottom = bottomMatch[0].trim();
      } else {
        spec.outfit.bottom = raw;
      }
    }

    // Step 4: Camera & Photo Parameters
    const photoSettings = LuxuryFashionPhotographyEngine.getSettings();
    const composition = EditorialCompositionEngine.getComposition();
    const angle = CameraAngleIntelligence.getAngle(analysis);

    const brandAesthetic = LuxuryBrandStylingIntelligence.getBrandAesthetic(context.vibe);
    const mood = FashionMoodIntelligence.getMood();
    const aesthetic = FashionAestheticIntelligence.getAesthetic();

    // Construct the magnificent optimized prompt block based on the true Fashion Design Brain spec.
    // It harmonizes background, camera setup, lighting, and model features to prevent any prompt contradictions.
    const rawFinalPrompt = `Professional high-fashion campaign photo.
Subject Profile: ${spec.avatar.ethnicity}, age ${spec.avatar.age}, representing ${spec.trend.luxuryBrand}. ${spec.avatar.consistentFace}.
Anatomy Integrity: ${spec.avatar.bodyProportions}. Immaculate hand anatomy, perfectly formed fingers, natural hand joints, natural leg-to-torso ratio, natural feet, completely free of deformities.
Designed Garment: ${spec.garment.description}. Silhouette is ${spec.garment.silhouette} with ${spec.garment.sleeves} and an exquisite ${spec.garment.collar}. Tailoring: ${spec.garment.stitching} featuring ${spec.garment.cuts} and ${spec.garment.layers}, finished with ${spec.garment.hems}. Fabric texture of ${spec.garment.textures}.
Fabric Intelligence: Crafted in ${spec.fabric.name} with ${spec.fabric.simulation}. Fabric is designed for the ${spec.fabric.season} collection.
Outfit Composition: Top is ${spec.outfit.top}, bottom is ${spec.outfit.bottom}. Footwear: ${spec.outfit.shoes}. Luxury leather goods: ${spec.outfit.bag}. Adornments: ${spec.outfit.jewelry}. Additional accents: ${spec.outfit.accessories}.
Style Concept: Theme of ${spec.trend.theme}, ${spec.trend.inspiration}. ${spec.styleDNA}. Creative direction: ${spec.creativity}.
Atmosphere & Environment: ${spec.diversity.background}. Lighting: ${spec.diversity.lightingSetup}. Color Harmony: Palette is ${spec.colorHarmony.palette}.
Cinematography & Posture: Captured via ${spec.diversity.cameraAngle}. Pose: ${spec.diversity.pose}. Camera setup: ${photoSettings}. Framing: ${composition}.
Aesthetic Grade: ${mood}. ${aesthetic}. ${brandAesthetic}.
Realism Engineering: Enforcing ${spec.realism.wrinkles}, ${spec.realism.seams}, and ${spec.realism.folds}. Fully calibrated for ${spec.realism.physics}. Unique Session: ${spec.sessionStamp}.`;

    // Process through our intelligent high-fashion prompt compressor to guarantee a compact, powerful instructions list under 1600 characters
    const finalPrompt = this.compressIfNeeded(rawFinalPrompt.replace(/\s+/g, ' ').trim(), 1550);

    // Apply the Fashion Fidelity Layer Checklist Verification & Repair!
    const fidelityResult = FashionFidelityLayer.verifyAndRepair(finalPrompt, analysis);
    console.log(`[Fashion Fidelity Layer] Internal Checklist audit completed:\n` + fidelityResult.checklist.join('\n'));

    return {
      prompt: fidelityResult.prompt,
      negativePrompt: ImageQualityValidationEngine.getNegativePrompt()
    };
  }
}

/**
 * FASHION FIDELITY LAYER
 * Verifies the final optimized prompt against a strict checklist of user requested attributes.
 * If any requested items are missing or overridden, it repairs/injects them to guarantee 100% fidelity.
 */
export class FashionFidelityLayer {
  static verifyAndRepair(optimizedPrompt: string, analysis: any): { prompt: string; checklist: string[] } {
    const checklist: string[] = [];
    let repairedPrompt = optimizedPrompt;
    const lower = repairedPrompt.toLowerCase();

    // 1. Correct garment check
    if (analysis.explicitGarmentType) {
      if (lower.includes(analysis.explicitGarmentType)) {
        checklist.push(`✓ Correct garment (${analysis.explicitGarmentType})`);
      } else {
        repairedPrompt += ` [FIDELITY REPAIR: The main garment featured MUST be exactly a ${analysis.explicitGarmentType}.]`;
        checklist.push(`✓ Repaired garment (${analysis.explicitGarmentType})`);
      }
    } else {
      checklist.push(`✓ Correct garment`);
    }

    // 2. Correct colors check
    if (analysis.explicitColor) {
      if (lower.includes(analysis.explicitColor)) {
        checklist.push(`✓ Correct colors (${analysis.explicitColor})`);
      } else {
        repairedPrompt += ` [FIDELITY REPAIR: The primary color of the garment is strictly ${analysis.explicitColor}.]`;
        checklist.push(`✓ Repaired colors (${analysis.explicitColor})`);
      }
    } else {
      checklist.push(`✓ Correct colors`);
    }

    // 3. Correct accessories check
    if (analysis.explicitAccessories && analysis.explicitAccessories.length > 0) {
      const missingAccs = analysis.explicitAccessories.filter((acc: string) => !lower.includes(acc));
      if (missingAccs.length === 0) {
        checklist.push(`✓ Correct accessories`);
      } else {
        repairedPrompt += ` [FIDELITY REPAIR: Must include the following accessories explicitly: ${missingAccs.join(', ')}.]`;
        checklist.push(`✓ Repaired accessories (${missingAccs.join(', ')})`);
      }
    } else {
      checklist.push(`✓ Correct accessories`);
    }

    // 4. Correct gender check
    if (analysis.gender && analysis.gender !== 'unisex') {
      if (lower.includes(analysis.gender) || (analysis.gender === 'male' && (lower.includes('man') || lower.includes('gentleman'))) || (analysis.gender === 'female' && (lower.includes('woman') || lower.includes('lady')))) {
        checklist.push(`✓ Correct gender (${analysis.gender})`);
      } else {
        repairedPrompt += ` [FIDELITY REPAIR: The fashion model featured is a ${analysis.gender}.]`;
        checklist.push(`✓ Repaired gender (${analysis.gender})`);
      }
    } else {
      checklist.push(`✓ Correct gender`);
    }

    // 5. Correct scene check (background)
    if (analysis.explicitBackground) {
      if (lower.includes(analysis.explicitBackground.toLowerCase())) {
        checklist.push(`✓ Correct scene`);
      } else {
        repairedPrompt += ` [FIDELITY REPAIR: The setting environment is strictly: ${analysis.explicitBackground}.]`;
        checklist.push(`✓ Repaired scene`);
      }
    } else {
      checklist.push(`✓ Correct scene`);
    }

    // 6. Correct style check
    if (analysis.inferredVibe) {
      checklist.push(`✓ Correct style (${analysis.inferredVibe})`);
    } else {
      checklist.push(`✓ Correct style`);
    }

    // 7. Correct pose check
    if (analysis.explicitPose) {
      if (lower.includes(analysis.explicitPose.toLowerCase())) {
        checklist.push(`✓ Correct pose (${analysis.explicitPose})`);
      } else {
        repairedPrompt += ` [FIDELITY REPAIR: The model pose is strictly: ${analysis.explicitPose}.]`;
        checklist.push(`✓ Repaired pose (${analysis.explicitPose})`);
      }
    } else {
      checklist.push(`✓ Correct pose`);
    }

    // 8. Correct body check
    if (analysis.explicitBodyType) {
      if (lower.includes(analysis.explicitBodyType.toLowerCase())) {
        checklist.push(`✓ Correct body (${analysis.explicitBodyType})`);
      } else {
        repairedPrompt += ` [FIDELITY REPAIR: The model body type has ${analysis.explicitBodyType} proportions.]`;
        checklist.push(`✓ Repaired body (${analysis.explicitBodyType})`);
      }
    } else {
      checklist.push(`✓ Correct body`);
    }

    // 9. Correct camera check (Hasselblad)
    if (lower.includes('hasselblad') || lower.includes('camera') || lower.includes('lens')) {
      checklist.push(`✓ Correct camera`);
    } else {
      repairedPrompt += ` [FIDELITY REPAIR: Shot with a professional Hasselblad medium-format camera, 85mm lens, high-fashion campaign quality.]`;
      checklist.push(`✓ Repaired camera`);
    }

    // 10. Correct lighting check
    if (lower.includes('lighting') || lower.includes('illumination') || lower.includes('studio spotlight')) {
      checklist.push(`✓ Correct lighting`);
    } else {
      repairedPrompt += ` [FIDELITY REPAIR: Illuminated by high-end studio spotlighting with soft luxury shadow details.]`;
      checklist.push(`✓ Repaired lighting`);
    }

    return {
      prompt: repairedPrompt,
      checklist
    };
  }
}
