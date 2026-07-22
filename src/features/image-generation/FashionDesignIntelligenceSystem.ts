import { ImageConfig } from './imageGenerationProvider';
import { PromptUnderstandingEngine } from './PromptIntelligenceEngine';

export interface FashionDesignSpec {
  avatar: {
    identity: string;
    consistentFace: string;
    age: number;
    ethnicity: string;
    hairstyle: string;
    bodyProportions: string;
    beautyLevel: string;
    quality: string;
    makeup: string;
    brandMuse: string;
  };
  garment: {
    description: string;
    silhouette: string;
    sleeves: string;
    collar: string;
    stitching: string;
    cuts: string;
    layers: string;
    hems: string;
    textures: string;
  };
  fabric: {
    name: string;
    simulation: string;
    season: string;
  };
  trend: {
    theme: string;
    inspiration: string;
    luxuryBrand: string;
  };
  outfit: {
    top: string;
    bottom: string;
    shoes: string;
    bag: string;
    jewelry: string;
    accessories: string;
  };
  colorHarmony: {
    palette: string;
    colors: string[];
  };
  styleDNA: string;
  creativity: string;
  diversity: {
    faceVariation: string;
    clothingVariation: string;
    pose: string;
    background: string;
    cameraAngle: string;
    lightingSetup: string;
  };
  realism: {
    wrinkles: string;
    seams: string;
    folds: string;
    physics: string;
  };
  sessionStamp: string;
  beautyScore: number;
  blueprints?: {
    avatar: {
      identity: string;
      gender: string;
      age: number;
      faceShape: string;
      hairStyle: string;
      hairColor: string;
      skinTone: string;
      bodyProportions: string;
      height: string;
      pose: string;
      expression: string;
    };
    garment: {
      silhouette: string;
      collar: string;
      sleeves: string;
      stitching: string;
      fabric: string;
      material: string;
      folds: string;
      texture: string;
      accessories: string;
      shoes: string;
      jewelry: string;
    };
    scene: {
      location: string;
      lighting: string;
      camera: string;
      composition: string;
      background: string;
      depth: string;
      shadows: string;
      reflections: string;
    };
  };
}

export type FashionConcept =
  | 'Luxury'
  | 'Casual'
  | 'Streetwear'
  | 'Avant Garde'
  | 'Editorial'
  | 'Minimal'
  | 'Runway'
  | 'Vintage'
  | 'Sport Luxury'
  | 'Business Luxury'
  | 'Night Fashion'
  | 'Summer'
  | 'Winter'
  | 'Spring'
  | 'Autumn'
  | 'Wedding'
  | 'Festival'
  | 'Travel'
  | 'Airport'
  | 'Celebrity'
  | 'Red Carpet'
  | 'Fashion Week';

export class FashionDesignIntelligenceSystem {
  // Session memory for similarity checking to prevent repetition
  private static recentGenerations: string[] = [];

  private static pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Generates a completely new luxury fashion concept with a strict 95+ beauty score rating requirement.
   * Compares each candidate design against session history. If similarity exceeds 80%, it automatically redesigns.
   */
  static design(prompt: string, config?: ImageConfig): FashionDesignSpec {
    const rawPrompt = prompt ? prompt.trim() : '';
    const analysis = PromptUnderstandingEngine.analyze(rawPrompt);
    const lower = rawPrompt.toLowerCase();

    let attempts = 0;
    let bestSpec: FashionDesignSpec | null = null;
    let highestScore = -1;

    // Up to 8 attempts to find the perfect unique masterpiece
    while (attempts < 8) {
      const candidate = this.createCandidate(rawPrompt, analysis, lower);
      const score = this.calculateBeautyScore(candidate);
      candidate.beautyScore = score;

      if (score >= 95) {
        // Build the signature string representing this concept for similarity comparison
        const conceptSignature = `concept: ${candidate.trend.theme} | avatar: ${candidate.blueprints?.avatar.gender} ${candidate.blueprints?.avatar.hairColor} | garment: ${candidate.garment.silhouette} with ${candidate.fabric.name} | scene: ${candidate.blueprints?.scene.location}`;
        
        // Check uniqueness
        const isUnique = this.checkAndRegisterConcept(conceptSignature);
        if (isUnique) {
          console.log(`[Fashion Brain] Unique design succeeded with score ${score}/100 in attempt ${attempts + 1}.`);
          return candidate;
        } else {
          console.log(`[Fashion Brain] Attempt ${attempts + 1} generated a concept too similar (>80% overlap) to a recent shoot. Retrying redesign...`);
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestSpec = candidate;
      }
      attempts++;
    }

    console.warn(`[Fashion Brain] Max redesign/uniqueness iterations reached. Using best available candidate with score ${highestScore}/100`);
    return bestSpec!;
  }

  private static checkAndRegisterConcept(conceptText: string): boolean {
    for (const recent of this.recentGenerations) {
      const sim = this.calculateSimilarity(conceptText, recent);
      if (sim > 0.80) {
        return false; // Similar concept exists, reject it
      }
    }
    // Store in session history
    this.recentGenerations.push(conceptText);
    if (this.recentGenerations.length > 50) {
      this.recentGenerations.shift(); // Keep memory footprint small
    }
    return true;
  }

  private static calculateSimilarity(p1: string, p2: string): number {
    const getWords = (text: string) => {
      return new Set(
        text.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .split(/\s+/)
          .filter(w => w.length > 2)
      );
    };
    const set1 = getWords(p1);
    const set2 = getWords(p2);
    if (set1.size === 0 || set2.size === 0) return 0;
    
    let intersectionSize = 0;
    for (const w of set1) {
      if (set2.has(w)) {
        intersectionSize++;
      }
    }
    const unionSize = set1.size + set2.size - intersectionSize;
    return intersectionSize / unionSize;
  }

  private static createCandidate(rawPrompt: string, analysis: any, lower: string): FashionDesignSpec {
    // 1. SELECT FASHION CONCEPT CATEGORY
    const conceptPool: FashionConcept[] = [
      'Luxury', 'Casual', 'Streetwear', 'Avant Garde', 'Editorial', 'Minimal', 'Runway', 'Vintage',
      'Sport Luxury', 'Business Luxury', 'Night Fashion', 'Summer', 'Winter', 'Spring', 'Autumn',
      'Wedding', 'Festival', 'Travel', 'Airport', 'Celebrity', 'Red Carpet', 'Fashion Week'
    ];

    // Detect user-desired concept category if present, otherwise select randomly
    let chosenConcept: FashionConcept = this.pick(conceptPool);
    for (const c of conceptPool) {
      if (lower.includes(c.toLowerCase())) {
        chosenConcept = c;
        break;
      }
    }

    // LUXURY BRANDS
    const luxuryBrands = [
      'Dior haute couture campaign',
      'Louis Vuitton global editorial campaign',
      'Prada runway preview editorial',
      'Balenciaga raw brutalist campaign',
      'Chanel high-jewelry lookbook',
      'Yves Saint Laurent evening campaign',
      'Hermès private-atelier lookbook',
      'Bottega Veneta handcrafted leather campaign',
      'Loewe sculptural fashion week editorial',
      'Alexander McQueen savage beauty campaign'
    ];
    let brand = this.pick(luxuryBrands);
    const lowerRaw = rawPrompt.toLowerCase();
    for (const b of luxuryBrands) {
      const brandWord = b.split(' ')[0].toLowerCase();
      if (lowerRaw.includes(brandWord)) {
        brand = b;
        break;
      }
    }

    // Concept specific properties mapper (THE FASHION CONCEPT GENERATOR / FASHION CREATIVITY ENGINE)
    let locations: string[] = [];
    let lightings: string[] = [];
    let backgroundDetails: string[] = [];
    let reflectionsList: string[] = [];
    let fabricsList: { name: string; simulation: string; season: string }[] = [];
    let makeupsList: string[] = [];
    let colorPalettes: { palette: string; colors: string[] }[] = [];

    switch (chosenConcept) {
      case 'Luxury':
        locations = ['historic marble palace in Milan', 'private luxurious yacht deck off Monaco', 'plush penthouse lounge overlooking Parisian skyline'];
        lightings = ['glamour studio portrait lighting with warm side softboxes', 'cinematic golden hour warm sunlight filtering through luxury screens'];
        backgroundDetails = ['gilded baroque arches, crystal chandeliers, clean polished travertine columns', 'deep blue Mediterranean ocean, minimalist white-leather deck chairs'];
        reflectionsList = ['soft golden ambient reflections on white marble floors', 'glimmering water caustics reflecting off polished wood panels'];
        fabricsList = [
          { name: 'Double-faced Italian wool and mulberry silk crepe', simulation: 'gravity-accurate drape and dense fabric folds', season: 'Autumn/Winter' },
          { name: 'Heavy structured silk faille and satin-shantung', simulation: 'architectural stiffness with sharp reflective highlights and heavy-fold structural ridges', season: 'All-Season' }
        ];
        makeupsList = ['dewy sun-kissed cheekbones, glossy neutral lips, and natural brushed-up brows'];
        colorPalettes = [{ palette: 'Cosmic Obsidian, Alabaster White, and Soft Slate', colors: ['#05050a', '#ffffff', '#64748b'] }];
        break;

      case 'Casual':
        locations = ['sun-drenched architectural outdoor café in Copenhagen', 'chic modern library with soft oak wood paneling', 'relaxed high-ceiling designer studio'];
        lightings = ['natural diffused window daylight with soft organic shadows', 'warm overhead ambient light mixed with delicate sidelight'];
        backgroundDetails = ['modernist wooden chairs, ceramic espresso cups, minimalist concrete street-planters', 'shelves of design books, pristine glass partitions, soft green foliage'];
        reflectionsList = ['subtle glossy counter-top reflections', 'soft daylight bouncing off blonde oak surfaces'];
        fabricsList = [
          { name: 'Organic heavy-weight cotton-poplin', simulation: 'crisp structure with realistic natural creases', season: 'Spring/Summer' },
          { name: 'Premium French linen-silk blend', simulation: 'fluid physical sway and soft natural fiber creases', season: 'Summer' }
        ];
        makeupsList = ['natural dewy skin cosmetic finish, subtle satin tones, and minimal high-fashion makeup'];
        colorPalettes = [{ palette: 'Neapolitan Sand, Deep Charcoal, and Sage Green', colors: ['#eab308', '#1c1917', '#15803d'] }];
        break;

      case 'Streetwear':
        locations = ['industrial raw-concrete alleyways in Shibuya, Tokyo', 'underground modern architectural terminal in Berlin', 'brutalist concrete skate park at dusk'];
        lightings = ['high-contrast neon lighting with ambient street reflections', 'moody dim backlighting punctuated by sharp strobe flares'];
        backgroundDetails = ['weathered metal pipes, glowing electric signages, wet asphalt ground', 'polished steel railings, geometric concrete walls, futuristic escalators'];
        reflectionsList = ['vibrant colorful reflections in rain-puddles on wet asphalt', 'luminous neon sign casting sharp colored rims on the model silhouette'];
        fabricsList = [
          { name: 'Oversized heavy loopback cotton fleece and distressed nylon', simulation: 'heavy slouchy draping with thick folds at cuffs', season: 'All-Season' },
          { name: 'Raw premium heavy-gauge denim', simulation: 'rigid structural creases around knees and joints', season: 'Autumn' }
        ];
        makeupsList = ['striking graphic eyeliner, flawless airbrushed skin, and natural matte-nude lip'];
        colorPalettes = [{ palette: 'Midnight Navy, Deepest Onyx, and Brushed Silver', colors: ['#1e3a8a', '#09090b', '#cbd5e1'] }];
        break;

      case 'Avant Garde':
        locations = ['surreal desolate salt flats under a silver twilight sky', 'stark white gallery with giant monolithic black steel arches', 'abandoned gothic cathedral with soft rays of moonlight'];
        lightings = ['dramatic high-contrast chiaroscuro studio lighting', 'single high-intensity laser spotlight slicing through fine atmospheric haze'];
        backgroundDetails = ['infinite white horizon, cracked white crystalline ground, surreal silver monoliths', 'pristine white museum walls, raw rusted iron beams, geometric floor drapes'];
        reflectionsList = ['dramatic elongated shadow drapes on mineral flats', 'specular metallic glare off custom liquid-chrome accessories'];
        fabricsList = [
          { name: 'Sculptural laser-cut neoprene and architectural pleated faille', simulation: 'stiff avant-garde volume projecting outward from body lines', season: 'Winter' },
          { name: 'Liquid reflective metallic foil fabrics', simulation: 'high-contrast light-warping surfaces catching every movement', season: 'All-Season' }
        ];
        makeupsList = ['high-fashion graphic negative-space eyeliner paired with a pristine, luminous glass-skin complexion'];
        colorPalettes = [{ palette: 'Sartorial Emerald, Off-Black, and Matte Chrome', colors: ['#064e3b', '#000000', '#94a3b8'] }];
        break;

      case 'Editorial':
        locations = ['high-contrast cinematic portrait studio with deep shadow drops', 'stark desert landscape with massive limestone pillars', 'vandalized antique European theater stage'];
        lightings = ['professional Rembrandt studio setup, soft key from 45 degrees, with intense backlight', 'harsh overhead natural sun casting long artistic structural shadows'];
        backgroundDetails = ['textured grey muslin backdrop, professional black studio flats', 'cracked yellow earth, towering beige stone carvings, cloudless sapphire sky'];
        reflectionsList = ['subtle studio floor highlight reflections', 'warm dust particles catching golden backlight rays'];
        fabricsList = [
          { name: 'Fine layered silk organza and crisp worsted wool', simulation: 'voluminous translucent overlays floating dynamically in motion', season: 'Spring/Summer' },
          { name: 'Double-faced heavy Italian cashmere-silk', simulation: 'supple, luxurious drapery folds falling in perfect vertical lines', season: 'Winter' }
        ];
        makeupsList = ['monochromatic warm terra-cotta tones, satin complexion, and soft gold-highlights'];
        colorPalettes = [{ palette: 'Royal Burgundy, Charcoal Gray, and Polished Platinum', colors: ['#991b1b', '#374151', '#e5e7eb'] }];
        break;

      case 'Minimal':
        locations = ['stark concrete architectural wall with precise linear shadows', 'sun-drenched limestone art atrium', 'understated gallery room in Milan'];
        lightings = ['pure, single-source window daylight casting soft clean gradients', 'even diffused overhead studio lighting with low-contrast shadows'];
        backgroundDetails = ['monolithic travertine wall, shadow of a single palm leaf, beige limestone tiles', 'crisp white ceiling lines, absolute raw negative space'];
        reflectionsList = ['ultra-subtle soft diffuse reflection on limestone floor', 'delicate light bounce under the chin from clean sand-colored floor panels'];
        fabricsList = [
          { name: 'Double-faced ultra-fine wool-crepe', simulation: 'immaculate straight drapes with zero static cling', season: 'All-Season' },
          { name: 'Pure crisp heavy matte silk-canvas', simulation: 'clean sharp structural folds along the body lines', season: 'Autumn/Winter' }
        ];
        makeupsList = ['clean, understated editorial makeup featuring brushed brows, soft satin skin, and a natural matte-nude lip'];
        colorPalettes = [{ palette: 'Quiet Ochre, Warm Camel, and Deep Ivory', colors: ['#ca8a04', '#d97706', '#fef08a'] }];
        break;

      case 'Runway':
        locations = ['glossy black runway catwalk with soft low-angle spotlights', 'massive high-end industrial runway stage', 'grand historic palace runway courtyard'];
        lightings = ['intense runway spotlighting with a glowing backlight rim that isolates the model', 'bright overhead strobe lines punctuated by soft studio fog flares'];
        backgroundDetails = ['atmospheric haze, rows of elegant silhouette spectators, glowing runway margin lights', 'industrial scaffolding, dramatic vertical neon poles'];
        reflectionsList = ['mirror-sharp glossy black reflections of the model posture on the catwalk floor', 'luminous lens flares casting circular halos near frame corners'];
        fabricsList = [
          { name: 'Heavy drapes of pure crepe-back satin and structured faille', simulation: 'liquid fluid sway and heavy physical folds responding dynamically to rapid stride', season: 'All-Season' }
        ];
        makeupsList = ['striking minimal cosmetics with flawless airbrushed skin and sharp wing-eyeliner'];
        colorPalettes = [{ palette: 'Espresso Brown, Warm Sand, and Subtle Champagne Gold', colors: ['#451a03', '#fef3c7', '#ca8a04'] }];
        break;

      default:
        locations = ['elegant historic Parisian courtyard', 'modern concrete pavilion bordering a calm reflective pool', 'high-ceiling industrial loft gallery'];
        lightings = ['cinematic golden hour warm sunlight filtering from the side', 'soft overcast daylight filtering through clean studio diffusion panels'];
        backgroundDetails = ['ivy-covered stone arches, classical wrought-iron railings', 'travertine marble courtyard, soft desert pampas grass', 'raw brickwork, towering steel window frames'];
        reflectionsList = ['glowing caustics off water pools', 'warm daylight bouncing off light concrete floors'];
        fabricsList = [
          { name: 'Premium Loro Piana brushed cashmere and mohair blend', simulation: 'soft luxurious halo fibers catching sidelight beautifully', season: 'Winter' },
          { name: 'Heavyweight worsted wool gabardine and liquid silk satin lining', simulation: 'stiff outer structures falling into perfectly straight lines, with fluid glossy silk interior reflections', season: 'Autumn/Winter' }
        ];
        makeupsList = ['natural dewy skin cosmetic finish, subtle satin tones, and minimal high-fashion makeup'];
        colorPalettes = [{ palette: 'Cosmic Obsidian, Alabaster White, and Soft Slate', colors: ['#05050a', '#ffffff', '#64748b'] }];
        break;
    }

    // AVATAR POOLS
    const ethnicities = [
      'French-Algerian with sharp symmetrical bone structure and flawless honey-olive skin',
      'East Asian with a sharp geometric jawline, high-fashion high-cheekbones, and luminous glass-skin',
      'Ethiopian with a refined, elongated neck, warm obsidian-amber complexion, and sculpted cheeks',
      'Nordic-Baltic with an elegant icy minimalist bone structure, soft platinum hair, and deep green-gray eyes',
      'Brazilian-Japanese with high-contrast sharp features, warm porcelain-bronze skin, and a fierce editorial gaze',
      'Milanese-Italian with natural warm undertones, expressive almond eyes, and a proud noble posture',
      'South Asian with sculpted symmetric features, deep warm copper skin, and thick dark curls styled cleanly',
      'Afro-Caribbean with high-contrast statuesque beauty, rich radiant chocolate skin, and a sculpted profile',
      'Spanish-Moroccan with sharp almond-shaped eyes, strong dark brows, and a warm dewy sun-kissed complexion',
      'East European with high symmetrical model cheekbones, sharp jaw contour, and deep oceanic-blue eyes',
      'Polynesian-Hawaiian with clean, strong bone definition, warm radiant golden-bronze skin, and natural modeling poise',
      'West African with flawless radiant ebony skin, high-contrast lip symmetry, and a striking statuesque runway presence',
      'Anglo-Saxon with clean-cut modern bone contouring, soft freckled porcelain skin, and an expressive direct gaze',
      'Symmetrical Levantine with warm olive skin, sculpted jaw profile, dark intense eyes, and refined modeling poise'
    ];

    const hairstyles = [
      'sleek wet-look slicked-back style with razor-sharp strands framing the temples',
      'asymmetrical precision-cut architectural bob with sharp, blunt edges',
      'sleek minimalist low-slung bun with a razor-sharp center part',
      'flowing in soft, effortless editorial waves with realistic wind-kissed high-fashion movement',
      'voluminous natural curls styled high in a structured modern architectural silhouette',
      'clean-cut textured crop with professional high-fashion definition and subtle matte product finish',
      'tightly braided geometric braids gathered into a low sculptural crown at the nape of the neck',
      'loose deconstructed high bun with delicate face-framing strands, styled by a professional hair director',
      'high, structured minimalist ponytail wrapped in a thin bands of matte black calfskin leather',
      'sleek asymmetrical side-sweep, perfectly highlighting the model\'s jawline and collarbones',
      'short minimalist pixie cut with precise textural layers and clean, high-fashion lines',
      'sculptural high-top fade with clean organic texture and sharp, high-end profile contouring'
    ];

    const hairColors = ['ash-platinum blond', 'glossy raven black', 'warm mahogany brown', 'deep copper red', 'honey-bronze highlights', 'matte slate grey'];

    const bodyProportions = [
      'elongated neck, perfectly symmetrical shoulders, and a statuesque, balanced physical posture',
      'highly balanced high-fashion proportions with a sovereign modeling stance and elegant weight distribution',
      'impeccable golden-ratio physical alignment, elegant skeletal structure, and long fluid lines',
      'dignified runway-scale posture with symmetrical shoulder alignment and fluid physical poise'
    ];

    const heights = ['178cm runway standard', '180cm elite standard', '185cm tall statuesque scale', '175cm elegant classic scale'];

    const poses = [
      'high-fashion asymmetrical stance, body aligned with golden ratio balance, weight shifted elegantly on one hip',
      'haute-couture editorial runway modeling pose, poised and dignified stance with elegant shoulder geometry',
      'composed sovereign posture, model looking slightly off-camera with relaxed shoulders and elongated neck',
      'dynamic walking posture captured mid-stride, showcasing the fluid movement and drape of the garment',
      'modernist minimalist modeling pose, three-quarter body rotation, highlighting collar cut and back drapery'
    ];

    const expressions = [
      'calm sovereign modeling gaze, high-fashion cold allure',
      'piercing intense runway stare, looking slightly off-camera',
      'serene confident editorial posture, relaxed symmetric lips',
      'fierce commanding walk gaze, focused and poised'
    ];

    // GARMENT SILHOUETTES & DETAILS
    const silhouettes = [
      'asymmetric structural form with deep-cut architectural angles and clean drapes',
      'clean minimalist column silhouette with a subtle low-back cut',
      'sculptural bold shoulders with a sharp, cinched-waist tailored hourglass profile',
      'modern fluid oversized cocoon shape with relaxed, natural shoulder seams',
      'double-breasted sharp utility cut with hidden seamless front closures',
      'deconstructed layered wrap silhouette with flowing, multi-length geometric lines',
      'avant-garde bias-cut draped silhouette that flows effortlessly with physical stance'
    ];

    const collars = [
      'high-neck architectural mock collar with a clean invisible zipper closure',
      'sharp asymmetric peaked lapel with satin silk bindings',
      'minimalist collarless crew neck with hidden interior binding',
      'exquisite structured spread collar with a modern low-V plunge',
      'softly draped cowl neck that cascades into deep, natural chest folds',
      'exaggerated structured portrait collar that frames the neck and jaw elegantly'
    ];

    const sleeves = [
      'elongated tailored sleeves with precise hand-finished double-cuffs',
      'clean-cut sleeveless shoulder-pads with sharp, clean structural edges',
      'voluminous sculptural dolman sleeves with subtle gathering at the wrists',
      'minimalist straight-fit sleeves with blind-stitched hems',
      'asymmetric single-sleeve drape with an elegant, bare-shoulder cut on the opposite side',
      'exquisite flared poet sleeves in fluid fabric, creating soft movement'
    ];

    const stitchings = [
      'flawless hand-stitched blind seams',
      'immaculate Neapolitan micro-stitching with extremely high density thread count',
      'contrasting top-stitch lines with high-end luxury construction',
      'invisible premium tailoring stitchwork with seamless edge bonds',
      'exquisite hand-finished double-needle flat-felled seams'
    ];

    const foldsList = [
      'gravity-accurate fabric folds, natural tension creases where elbows and waist bend',
      'supple skin creases and premium hand-finished folds with organic weight',
      'fluid drapes responding naturally to physical movement with authentic fabric weight',
      'sharp architectural folds and heavy-fold structural ridges'
    ];

    const textures = [
      'heavy micro-textured wool herringbone weave',
      'liquid reflective silk-satin surface catching light beautifully',
      'tactile matte calfskin leather grain with organic variations',
      'organic high-density cotton-poplin thread count, crisp and matte',
      'soft, ultra-fine brushed cashmere halo texture'
    ];

    const shoesOptions = [
      'handmade pointed-toe stiletto boots in buttery matte calfskin leather',
      'sculptural transparent plexiglass block-heel mules with clean minimalist lines',
      'bespoke minimalist Chelsea boots in mirror-polished box-calf leather',
      'sleek modern slingback heels in glossy brushed leather with thin ankle straps',
      'architectural low-profile square-toe flats in premium full-grain leather'
    ];

    const bagsOptions = [
      'structured geometric trapezoid clutch in glossy lizard-embossed leather',
      'oversized soft-pleated pouch in buttery nappa leather',
      'micro structured top-handle bag in matte box-calf leather with white-gold hardware details',
      'minimalist asymmetric sling bag in thick full-grain leather with hidden closures',
      'sculptural hardcase hand-clutch in brushed platinum metal finish'
    ];

    const jewelryOptions = [
      'minimalist platinum signet ring and a thick brushed-silver sculptural metal cuff',
      'delicate baroque pearl drop earrings and a thin polished-brass belt',
      'understated white-gold collar necklace and matching micro stud earrings',
      'clean architectural silver band rings with raw textured surfaces',
      'sleek, structural brushed-gold ear-cuffs framing the ear contour elegantly'
    ];

    const accessoriesOptions = [
      'handcrafted clear acetate frame eyewear with anti-reflective lenses',
      'an elegant silk-cashmere scarf casually draped over the shoulder with fringe details',
      'a sleek leather belt featuring an architectural raw-metal buckle',
      'premium leather driving gloves in deep charcoal with micro-stitching',
      'minimalist black cat-eye luxury glasses with thin acetate frames'
    ];

    // CAMERA SETUPS
    const cameraAngles = [
      'Hasselblad 85mm f/1.2 medium-full lens capture, low-angle hero framing focusing on drape and texture',
      'medium portrait shot captured from a direct eye-level, highlighting garment chest-line and collar',
      'asymmetrical composition with generous off-center negative space, capturing the garment in a sharp three-quarter profile'
    ];

    const compositions = [
      'elegant golden-ratio off-center framing with sleek high-fashion balance',
      'sovereign vertical symmetry, perfectly centered on the model stance',
      'cinematic high-contrast layout emphasizing vertical body geometry'
    ];

    // ==========================================
    // 2. CONSTRUCT THE FASHION BLUEPRINTS FIRST
    // ==========================================
    const chosenGender = analysis.gender === 'male' ? 'male' : (analysis.gender === 'female' ? 'female' : this.pick(['male', 'female']));
    const chosenAge = analysis.explicitAge || this.pick([19, 21, 23, 25, 27, 29, 31]);
    const chosenFaceShape = this.pick(['sculpted sharp heart-shaped face', 'defined architectural square jawline', 'classic elegant oval symmetry', 'high-cheekboned geometric structure']);
    const chosenHairStyle = this.pick(hairstyles);
    const chosenHairColor = this.pick(hairColors);
    const chosenSkinTone = this.pick(ethnicities);
    const chosenBodyProportions = analysis.explicitBodyType ? `balanced body with ${analysis.explicitBodyType} proportions` : this.pick(bodyProportions);
    const chosenHeight = this.pick(heights);
    const chosenPose = analysis.explicitPose ? `elegant posture showing ${analysis.explicitPose}` : this.pick(poses);
    const chosenExpression = this.pick(expressions);

    const avatarBlueprint = {
      identity: `Professional elite high-fashion ${chosenGender} model, elite muse representation`,
      gender: chosenGender,
      age: chosenAge,
      faceShape: chosenFaceShape,
      hairStyle: chosenHairStyle,
      hairColor: chosenHairColor,
      skinTone: chosenSkinTone,
      bodyProportions: chosenBodyProportions,
      height: chosenHeight,
      pose: chosenPose,
      expression: chosenExpression
    };

    const chosenSilhouette = analysis.explicitSilhouette ? `exquisite ${analysis.explicitSilhouette}` : this.pick(silhouettes);
    const chosenCollar = analysis.explicitNeckline ? `exquisite collar featuring ${analysis.explicitNeckline}` : this.pick(collars);
    const chosenSleeves = analysis.explicitSleeveType ? `exquisite sleeves featuring ${analysis.explicitSleeveType}` : this.pick(sleeves);
    const chosenStitching = this.pick(stitchings);
    const chosenFabricObj = this.pick(fabricsList);
    const chosenFolds = this.pick(foldsList);
    const chosenTexture = this.pick(textures);
    const chosenAccessoriesPiece = (analysis.explicitAccessories && analysis.explicitAccessories.length > 0)
      ? `tastefully styled with ${analysis.explicitAccessories.join(' and ')}`
      : this.pick(accessoriesOptions);
    const chosenShoes = analysis.explicitFootwear ? `custom premium ${analysis.explicitFootwear}` : this.pick(shoesOptions);
    const chosenJewelry = this.pick(jewelryOptions);

    const garmentBlueprint = {
      silhouette: chosenSilhouette,
      collar: chosenCollar,
      sleeves: chosenSleeves,
      stitching: chosenStitching,
      fabric: chosenFabricObj.name,
      material: `${chosenFabricObj.name} with ${chosenTexture}`,
      folds: chosenFolds,
      texture: chosenTexture,
      accessories: chosenAccessoriesPiece,
      shoes: chosenShoes,
      jewelry: chosenJewelry
    };

    // STRICT STUDIO OVERRIDES
    const studioLocations = ['minimal professional fashion studio setting', 'high-end product lookbook stage', 'clean light-controlled neutral room setting'];
    const studioLightings = ['professional Rembrandt studio lighting', 'even soft diffused key studio lighting', 'dramatic high-contrast studio spotlighting'];
    const studioBackgroundDetails = [
      'A clean, neutral solid light grey studio backdrop casting extremely soft shadows. NO landscapes, NO buildings, NO nature, NO outdoor scenes, NO rain, NO desert.',
      'A clean, neutral solid white studio setting background, completely minimalist and flat. NO landscapes, NO buildings, NO nature, NO outdoor scenes, NO rain, NO desert.',
      'A solid dark slate studio setting background, deep premium slate-grey, completely neutral, minimalist and clean. NO landscapes, NO buildings, NO nature, NO outdoor scenes, NO rain, NO desert.'
    ];
    const studioReflections = ['subtle soft light bounce on studio surface', 'minimal shadow drop on clean flat studio flooring'];

    const chosenLocation = analysis.explicitBackground ? analysis.explicitBackground : this.pick(studioLocations);
    const chosenLighting = this.pick(studioLightings);
    const chosenCamera = this.pick(cameraAngles);
    const chosenComposition = this.pick(compositions);
    const chosenBackground = analysis.explicitBackground 
      ? `A beautiful setting of ${analysis.explicitBackground}, beautifully arranged, minimalist, high-fashion catalog standard. NO roads, NO outdoor streets unless explicitly requested.` 
      : this.pick(studioBackgroundDetails);
    const chosenDepth = 'shallow depth of field, model sharply isolated from background with professional creamy bokeh';
    const chosenShadows = 'soft natural studio drop shadows casting elegant contours under-feet on a clean flat studio floor';
    const chosenReflections = this.pick(studioReflections);

    const sceneBlueprint = {
      location: chosenLocation,
      lighting: chosenLighting,
      camera: chosenCamera,
      composition: chosenComposition,
      background: chosenBackground,
      depth: chosenDepth,
      shadows: chosenShadows,
      reflections: chosenReflections
    };

    // ====================================================
    // 3. CONVERT THE BLUEPRINTS INTO FASHION DESIGN SPEC
    // ====================================================
    const avatar = {
      identity: `mannequin cropped from the shoulders down`,
      consistentFace: `headless style, cropped elegantly from the shoulders down (mannequin-style) or depicted as a professional model with their face completely out of frame, focusing 100% of the visual attention on the garment, drape, and material contours rather than the face`,
      age: avatarBlueprint.age,
      ethnicity: `statuesque model cropped from the neck down (headless style) focusing solely on the clothing`,
      hairstyle: `Face and head are completely out of frame or obscured to maintain 100% focus on the garment structure`,
      bodyProportions: `impeccable ${avatarBlueprint.bodyProportions}`,
      beautyLevel: '100/100 masterpiece lookbook standard, extreme focus on drape and structural design lines',
      quality: 'Professional fashion lookbook quality, photorealistic, premium Hasselblad photography',
      makeup: `Face is completely out of frame or obscured`,
      brandMuse: `acting as a modern muse for the ${brand}`
    };

    // Handle user inputs like 'suit' or 'dress' logically as requested
    const customDescription = `an exquisite luxury garment: "${rawPrompt || 'haute couture look'}"`;
    
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    
    const topPiece = analysis.explicitTop 
      ? capitalize(analysis.explicitTop) 
      : (lower.includes('suit') || lower.includes('dress') ? 'integrated luxury piece' : `a premium tailored top in structured ${garmentBlueprint.material} with precise stitching`);
      
    const bottomPiece = analysis.explicitBottom 
      ? capitalize(analysis.explicitBottom) 
      : (lower.includes('suit') ? 'matching high-waisted pressed trousers' : (lower.includes('dress') ? 'fluid integrated gown skirt' : 'tailored wide-leg fluid trousers'));

    const garment = {
      description: customDescription,
      silhouette: garmentBlueprint.silhouette,
      sleeves: garmentBlueprint.sleeves,
      collar: garmentBlueprint.collar,
      stitching: garmentBlueprint.stitching,
      cuts: `clean structural cuts and ${garmentBlueprint.folds}`,
      layers: 'sophisticated double-faced interior construction with contrast layer peeking',
      hems: 'crisp steam-pressed blind-stitched hems with zero visible thread line',
      textures: garmentBlueprint.texture
    };

    const fabric = {
      name: garmentBlueprint.fabric,
      simulation: `gravity-accurate drapery showing ${garmentBlueprint.folds}`,
      season: chosenFabricObj.season
    };

    const trend = {
      theme: `${chosenConcept} Style Theme: ${chosenConcept} Luxury Concept`,
      inspiration: `inspired by modern ${brand} high fashion week guidelines`,
      luxuryBrand: brand
    };

    const outfit = {
      top: topPiece,
      bottom: bottomPiece,
      shoes: garmentBlueprint.shoes,
      bag: this.pick(bagsOptions),
      jewelry: garmentBlueprint.jewelry,
      accessories: garmentBlueprint.accessories
    };

    let colorHarmony = this.pick(colorPalettes);
    if (analysis.explicitColor) {
      colorHarmony = {
        palette: `Sophisticated dominant luxurious ${analysis.explicitColor} tone, complemented by soft charcoal and platinum accents`,
        colors: [analysis.explicitColor, '#09090b', '#94a3b8']
      };
    }

    const styleDNAs = [
      'Style DNA Signature: The Architectural Intellectual (rational structures, minimalist geometry, cerebral poise)',
      'Style DNA Signature: The Avant-Garde Rebel (deconstructed lines, raw texturing, progressive silhouettes)',
      'Style DNA Signature: The Sovereign Minimalist (immaculate quiet luxury, understatement, supreme material focus)',
      'Style DNA Signature: The Parisian Romantic (fluid silk drapes, high-neck tailoring, poetic physical movement)',
      'Style DNA Signature: Modernist Brutalist (boxy lines, exposed textures, sharp tailoring cuts, raw power)'
    ];
    const styleDNA = this.pick(styleDNAs);

    const creativeDirectives = [
      'Featuring an innovative structural collar flap that folds into an elegant shoulder pleat',
      'Boasting an asymmetric double-hem waist that creates a gorgeous dual shadow layout on runway floors',
      'Showcasing a unique integrated scarf cowl that cascades seamlessly into a low-back structural drape',
      'Including architectural pleat lines that dynamically expand and compress with physical posture',
      'Featuring hidden magnetic closures that allow the garment to drape completely flat and uninterrupted',
      'Boasting an unexpected geometric side-vent lined with high-contrast matte silk lining'
    ];
    const creativity = this.pick(creativeDirectives);

    const diversity = {
      faceVariation: 'unique facial portrait structure, distinctive high-fashion model features',
      clothingVariation: 'bespoke outfit design tailored purely for this session',
      pose: avatarBlueprint.pose,
      background: `set on location at ${sceneBlueprint.location}. Background features ${sceneBlueprint.background} with beautiful ${sceneBlueprint.reflections}`,
      cameraAngle: `${sceneBlueprint.camera}, framed as a ${sceneBlueprint.composition}, creating ${sceneBlueprint.depth}`,
      lightingSetup: `${sceneBlueprint.lighting}, casting elegant ${sceneBlueprint.shadows}`
    };

    const realism = {
      wrinkles: 'gravity-accurate fabric folds, natural tension creases where elbows and waist bend, real textile weight',
      seams: 'steam-pressed real tailoring seams, flawless double-stitching lines, absolute garment structural integrity',
      folds: 'fluid, heavy drapes responding naturally to physical movement with authentic fabric weight',
      physics: 'accurate cloth simulation, photorealistic material response, zero artificial flat rendering'
    };

    const sessionStamp = `Shoot-Session: [LV-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(Date.now() % 10000)}]`;

    return {
      avatar,
      garment,
      fabric,
      trend,
      outfit,
      colorHarmony,
      styleDNA,
      creativity,
      diversity,
      realism,
      sessionStamp,
      beautyScore: 100,
      blueprints: {
        avatar: avatarBlueprint,
        garment: garmentBlueprint,
        scene: sceneBlueprint
      }
    };
  }

  /**
   * Beauty Scoring Engine - evaluates every candidate design before generation.
   * Scores must be strictly >= 95/100 to pass. If a candidate misses this benchmark,
   * it gets rejected and completely redesigned.
   */
  private static calculateBeautyScore(candidate: FashionDesignSpec): number {
    let score = 85; // high baseline for luxury presets

    if (candidate.avatar.ethnicity && candidate.avatar.consistentFace.includes('symmetrical')) {
      score += 3;
    }
    if (candidate.avatar.bodyProportions.includes('golden-ratio') || candidate.avatar.bodyProportions.includes('balanced')) {
      score += 2;
    }
    if (candidate.garment.silhouette && candidate.garment.stitching) {
      score += 2;
    }
    if (candidate.garment.hems && candidate.garment.textures) {
      score += 3;
    }
    if (candidate.fabric.name && candidate.fabric.simulation) {
      score += 3;
    }
    if (candidate.outfit.shoes && candidate.outfit.bag && candidate.outfit.jewelry) {
      score += 3;
    }
    if (candidate.colorHarmony.palette) {
      score += 2;
    }

    return Math.min(score, 100);
  }
}
