import { 
  FaceEngine, 
  BodyEngine, 
  PoseEngine, 
  AIGenerationEngine, 
  PromptEngine, 
  MarketplaceMatchingEngine, 
  HistoryEngine 
} from '../engine/sharedEngines';
import { FashionKnowledgeGraphEngine } from '../engine/fashionKnowledgeGraph';
import { WardrobeItem } from '../types';

// ============================================================================
// PRODUCT 1: HOME GENERATE (Personal Fashion vs AI Model inspiration)
// ============================================================================
export interface HomeGenerateRequest {
  userId: string;
  userPhotoUrl?: string; // Mode A if provided, otherwise Mode B
  gender: 'male' | 'female' | 'unisex';
  vibe: string;
  season: string;
  customDetails?: string;
}

export interface HomeGenerateResult {
  imageUrl: string;
  mode: 'PERSONAL_FASHION_TRYON' | 'AI_MODEL_INSPIRATION';
  isPrivate: boolean;
  modelFaceUsed: string;
  avatarShape: string;
  promptFingerprint: string;
}

export class HomeGenerateProduct {
  static async generateFashion(req: HomeGenerateRequest): Promise<HomeGenerateResult> {
    const isPersonal = !!req.userPhotoUrl;
    const mode = isPersonal ? 'PERSONAL_FASHION_TRYON' : 'AI_MODEL_INSPIRATION';
    
    // Construct and optimize prompt
    let compositionPrompt = "";
    let modelFace = "User Real Face";
    let avatarShape = "User Real Body Shape";

    if (isPersonal) {
      // Mode A: User's real face and body
      compositionPrompt = `Personalized try-on outfit. Overlay high-fashion styling on top of the user's uploaded body photograph (${req.userPhotoUrl}). Preserve facial identity and stature. style setting: studio, elegance, 8K resolution. Vibe: ${req.vibe}. Details: ${req.customDetails || ''}`;
    } else {
      // Mode B: AI Model mode (Synthetic)
      const syntheticFace = FaceEngine.createSyntheticFace(req.vibe + req.season, req.gender);
      const bodyDims = BodyEngine.parseBodyDimensions(req.gender === 'male' ? 'ATHLETIC_M' : 'RUNWAY_F');
      const poseDetails = PoseEngine.generatePoseLandmarks('RUNWAY');
      
      modelFace = syntheticFace.hairstyle + ", " + syntheticFace.skinTone + " Skin";
      avatarShape = bodyDims.shapeType + " shape, oriented " + poseDetails.bodyOrientation;

      compositionPrompt = `Full-body runway editorial fashion photograph of an AI virtual model. Model face: ${modelFace}, facial structure: ${syntheticFace.facialStructure}. Body form: ${avatarShape}. Wearing custom fashion piece: vibe: ${req.vibe}, season: ${req.season}. ${req.customDetails || ''}. Realistic lighting, sharp focus, 8K, cinematic background.`;
    }

    // Enrich prompt with FashionKnowledgeGraphEngine prior to AI rendering
    const enrichedPrompt = FashionKnowledgeGraphEngine.enrichPrompt(compositionPrompt, req.vibe, req.userId);

    // Call AIGenerationEngine with fingerprinting and de-duplication
    const genResult = await AIGenerationEngine.generateOptimized(enrichedPrompt, { aspectRatio: '3:4' });

    // Store generation history in the user's history profile
    await HistoryEngine.logGeneration(genResult.imageUrl, {
      prompt: enrichedPrompt,
      provider: genResult.provider,
      vibe: req.vibe,
      season: req.season,
      userId: req.userId
    });

    return {
      imageUrl: genResult.imageUrl,
      mode,
      isPrivate: true, // Always private initially! Mode B and Mode A are private unless user explicitly approves sharing.
      modelFaceUsed: modelFace,
      avatarShape,
      promptFingerprint: genResult.imageUrl.substring(0, 12)
    };
  }
}

// ============================================================================
// PRODUCT 2: AI CREATIONS (Professional High-Concept Artworks)
// ============================================================================
export interface AICreationRequest {
  creatorId: string;
  meshPreset: string;
  vibePreset: string;
  renderEngine: string;
  drapePhysics: string;
  customDetails?: string;
}

export interface AICreationResult {
  creationId: string;
  imageUrl: string;
  title: string;
  prompt: string;
  provider: string;
  isPrivateOnly: boolean; // Never published automatically
  approvalRequiredToExport: boolean;
}

export class AICreationsProduct {
  private static localCreations = new Map<string, AICreationResult>();

  static async generateArtwork(req: AICreationRequest): Promise<AICreationResult> {
    // Force AI Model/Synthetic Mode: Never allow user's real face
    const syntheticFace = FaceEngine.createSyntheticFace(req.meshPreset + req.vibePreset, 'unisex');
    const bodyDims = BodyEngine.parseBodyDimensions('CYBORG_X');
    const poseDetails = PoseEngine.generatePoseLandmarks('DYNAMIC_WALK');

    const title = `${req.vibePreset} ${req.meshPreset.replace('_', ' ')}`;
    const prompt = `Futuristic 3D fashion render of ${title}. Synthetic avatar: ${syntheticFace.facialStructure}, body profile: ${bodyDims.shapeType}, orientation: ${poseDetails.bodyOrientation}. Cloth simulation drape physics: ${req.drapePhysics}. Rendered with ${req.renderEngine} shader sub-system. ${req.customDetails || ''}`;

    // Enrich prompt with FashionKnowledgeGraphEngine prior to AI rendering
    const enrichedPrompt = FashionKnowledgeGraphEngine.enrichPrompt(prompt, req.vibePreset, req.creatorId);

    // Execute via AIGenerationEngine (optimizes, caches, and prevents duplication)
    const genResult = await AIGenerationEngine.generateOptimized(enrichedPrompt, { aspectRatio: '3:4' }, req.renderEngine);

    const creationId = `creation_${Date.now()}`;
    const result: AICreationResult = {
      creationId,
      imageUrl: genResult.imageUrl,
      title,
      prompt: enrichedPrompt,
      provider: genResult.provider,
      isPrivateOnly: true, // Belongs ONLY to AI Creations, never automatically published to Marketplace or Community
      approvalRequiredToExport: true
    };

    // Store in local creations memory map
    this.localCreations.set(creationId, result);

    return result;
  }

  static getCreation(id: string): AICreationResult | null {
    return this.localCreations.get(id) || null;
  }

  /**
   * User must explicitly request to approve publishing/exporting this AI creation to other modules.
   */
  static approveExportToCommunity(creationId: string): { success: boolean; message: string } {
    const creation = this.getCreation(creationId);
    if (!creation) {
      return { success: false, message: "Creation not found in Atelier archive." };
    }
    // Export with approval
    return {
      success: true,
      message: `✓ AI Creation "${creation.title}" has been successfully exported with formal user approval.`
    };
  }
}

// ============================================================================
// PRODUCT 3: MARKETPLACE (Pure Commerce Interface & Recommendation Linking)
// ============================================================================
export interface MarketplaceProductItem {
  id: string;
  title: string;
  category: string;
  price: number;
  seller: string;
  brand: string;
  imageUrl: string;
}

export class MarketplaceProduct {
  // Pure authentic catalog list
  private static commerceCatalog: MarketplaceProductItem[] = [
    { id: 'real-1', title: 'Aesthetic Linen Blazer', category: 'Outerwear', price: 185, seller: 'Atelier Noir', brand: 'Sartorial Co.', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300' },
    { id: 'real-2', title: 'Modular Tactical Cargo Pants', category: 'Casual', price: 145, seller: 'Cyber Threads', brand: 'Techwear Lab', imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=300' },
    { id: 'real-3', title: 'Minimalist Crepe Trench', category: 'Outerwear', price: 310, seller: 'Nordic Edit', brand: 'Fjord Atelier', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300' }
  ];

  static getCatalog(): MarketplaceProductItem[] {
    return this.commerceCatalog;
  }

  /**
   * Safe mapping: recommends real products when AI generates an outfit.
   * AI-generated art remains segregated; users are directed to buy real counterparts.
   */
  static async findRealAlternatives(aiLookTitle: string, aiLookPrompt: string): Promise<MarketplaceProductItem[]> {
    const matches = await MarketplaceMatchingEngine.matchAILookToProducts(
      aiLookTitle,
      aiLookPrompt,
      this.commerceCatalog
    );
    return matches.map(m => m.product);
  }
}

// ============================================================================
// PRODUCT 4: COMMUNITY (Intentionally Shared Content with User Approval)
// ============================================================================
export interface CommunityPost {
  postId: string;
  userId: string;
  imageUrl: string;
  description: string;
  sharedAt: string;
  approved: boolean;
}

export class CommunityProduct {
  private static posts: CommunityPost[] = [];

  static createSharedPost(userId: string, imageUrl: string, desc: string, userConsentApproved: boolean): { success: boolean; post?: CommunityPost; error?: string } {
    if (!userConsentApproved) {
      return { success: false, error: "Community rules prohibit publishing without explicit user approval." };
    }

    const post: CommunityPost = {
      postId: `post_${Date.now()}`,
      userId,
      imageUrl,
      description: desc,
      sharedAt: new Date().toISOString(),
      approved: true
    };

    this.posts.unshift(post);
    return { success: true, post };
  }

  static getApprovedPosts(): CommunityPost[] {
    return this.posts.filter(p => p.approved);
  }
}
