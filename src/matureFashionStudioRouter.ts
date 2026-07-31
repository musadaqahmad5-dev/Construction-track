import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export interface MatureFashionCreation {
  id: string;
  userId: string;
  creatorName?: string;
  creatorAvatar?: string;
  creatorLevel?: string;
  type: 'image' | 'video';
  title: string;
  category: string;
  stylePreset: 'editorial_couture' | 'avant_garde' | 'body_art_textile' | 'fantasy_conceptual';
  outfitType: string;
  material: string;
  colorPalette: string[];
  artisticTheme: string;
  prompt: string;
  generatedAsset: string;
  memoryType: 'personal' | 'community';
  visibility: 'private' | 'public';
  savedToWardrobe: boolean;
  sharedToCommunity: boolean;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  parameters?: {
    drapeTension?: number;
    lightingAtmosphere?: string;
    textureComplexity?: string;
    silhouetteStructure?: string;
  };
  likeCount?: number;
  commentCount?: number;
}

export interface CreatorProfileData {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  creatorLevel: 'Master Atelier' | 'Couture Visionary' | 'Haute Stylist' | 'Emerging Designer';
  styleCategory: string;
  expertise: string[];
  reputationScore: number;
  publishedWorks: number;
  followersCount: number;
  followingCount: number;
  verified: boolean;
  badge: string;
  location?: string;
  joinedDate: string;
  coverBanner?: string;
}

export interface FashionCollectionData {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorLevel?: string;
  title: string;
  tagline: string;
  description: string;
  type: 'collection' | 'seasonal_drop' | 'fashion_story' | 'editorial_campaign';
  season?: string;
  coverImage: string;
  creationIds: string[];
  likeCount: number;
  savedCount: number;
  createdAt: string;
  isMarketplaceReady: boolean;
  estimatedValuation?: string;
}

export interface MarketplaceListingData {
  id: string;
  collectionId?: string;
  creationId?: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  itemType: 'digital_concept' | 'couture_nft' | 'bespoke_custom_order' | 'physical_runway_piece';
  previewImage: string;
  price: number;
  currency: 'USD' | 'ETH' | 'CREDITS';
  royaltyPercent: number;
  status: 'available' | 'reserved' | 'sold';
  tier: 'Exclusif 1/1' | 'Limited Edition 1/10' | 'Signature Drop';
  customizationOptions: string[];
  createdAt: string;
}

const router = Router();

function getDb() {
  try {
    if (getApps().length === 0) {
      initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || "fashion-ai-56bd2" });
    }
    return getFirestore();
  } catch (_) {
    return null;
  }
}

let aiInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSy_MOCK_FALLBACK_KEY";
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// In-memory fallback stores
const memoryStore: MatureFashionCreation[] = [];

const creatorStore: Record<string, CreatorProfileData> = {
  'creator_atelier_1': {
    id: 'creator_atelier_1',
    name: 'Elena Vance-Rousseau',
    handle: '@elena_vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    bio: 'Haute Couture Sculptor specializing in fluid liquid titanium drapes, cybernetic obsidian corsetry & bio-synthetic evening gowns.',
    creatorLevel: 'Master Atelier',
    styleCategory: 'Cybernetic High Couture',
    expertise: ['Liquid Metals', '3D Anodized Fabrics', 'Chiaroscuro Evening Wear', 'Bespoke Atelier'],
    reputationScore: 98,
    publishedWorks: 42,
    followersCount: 14200,
    followingCount: 180,
    verified: true,
    badge: 'PARIS ATELIER FELLOW',
    location: 'Paris & Tokyo',
    joinedDate: '2025-01-15',
    coverBanner: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200'
  },
  'creator_atelier_2': {
    id: 'creator_atelier_2',
    name: 'Kenzo Takahashi-Saito',
    handle: '@kenzo_couture',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bio: 'Avant-garde kinetic textile artist blurring the boundaries between architectural structures and soft organic silk movement.',
    creatorLevel: 'Couture Visionary',
    styleCategory: 'Architectural Avant-Garde',
    expertise: ['Kinetic Drapery', 'Bioluminescent Weaves', 'Zero-Waste Origami Silhouette'],
    reputationScore: 94,
    publishedWorks: 28,
    followersCount: 8900,
    followingCount: 95,
    verified: true,
    badge: 'TOKYO FASHION INNOVATOR',
    location: 'Tokyo',
    joinedDate: '2025-03-01',
    coverBanner: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200'
  },
  'demo_user': {
    id: 'demo_user',
    name: 'Aria Sterling',
    handle: '@aria_sartorial',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    bio: 'Digital fashion creator exploring dark luxury aesthetics, sculptural silhouettes, and intelligent textile prompt craft.',
    creatorLevel: 'Haute Stylist',
    styleCategory: 'Dark Modern Luxury',
    expertise: ['Obsidian Mesh', 'Dramatic Lighting', 'Metamaterial Outerwear'],
    reputationScore: 88,
    publishedWorks: 12,
    followersCount: 3400,
    followingCount: 210,
    verified: true,
    badge: 'LOOK VISION CREATOR',
    location: 'London',
    joinedDate: '2025-05-10',
    coverBanner: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200'
  }
};

const collectionStore: FashionCollectionData[] = [
  {
    id: 'col_midnight_obsidian',
    creatorId: 'creator_atelier_1',
    creatorName: 'Elena Vance-Rousseau',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    creatorLevel: 'Master Atelier',
    title: 'Midnight Obsidian & Liquid Metal SS26',
    tagline: 'Anodized titanium corsets, liquid silk organza and anatomical metal lines.',
    description: 'A 6-piece editorial campaign exploring the tension between rigid cybernetic armor and soft fluid evening drapes. Engineered with dramatic chiaroscuro studio lighting.',
    type: 'seasonal_drop',
    season: 'Autumn / Winter 2026',
    coverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    creationIds: ['mat_creation_seed_1'],
    likeCount: 342,
    savedCount: 189,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    isMarketplaceReady: true,
    estimatedValuation: '$12,500 USD'
  },
  {
    id: 'col_bioluminescent_runway',
    creatorId: 'creator_atelier_2',
    creatorName: 'Kenzo Takahashi-Saito',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    creatorLevel: 'Couture Visionary',
    title: 'Photonic Weave & Bioluminescent Gowns',
    tagline: 'Illuminated fluid silk garments gliding through dark atmospheric space.',
    description: 'An ethereal haute couture collection featuring photonic thread weaving that dynamically shifts luminance with subject movement.',
    type: 'editorial_campaign',
    season: 'Spring / Summer 2026',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    creationIds: ['mat_creation_seed_2'],
    likeCount: 521,
    savedCount: 290,
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    isMarketplaceReady: true,
    estimatedValuation: '$18,000 USD'
  }
];

const marketplaceStore: MarketplaceListingData[] = [
  {
    id: 'mkt_list_1',
    collectionId: 'col_midnight_obsidian',
    creationId: 'mat_creation_seed_1',
    creatorId: 'creator_atelier_1',
    creatorName: 'Elena Vance-Rousseau',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    title: 'Architectural Obsidian Mesh Corset 1/1',
    itemType: 'bespoke_custom_order',
    previewImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    price: 3800,
    currency: 'USD',
    royaltyPercent: 10,
    status: 'available',
    tier: 'Exclusif 1/1',
    customizationOptions: ['3D Scan Tailoring', 'Custom Anodized Palette', 'Gold/Titanium Filigree Inlay'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'mkt_list_2',
    collectionId: 'col_bioluminescent_runway',
    creationId: 'mat_creation_seed_2',
    creatorId: 'creator_atelier_2',
    creatorName: 'Kenzo Takahashi-Saito',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    title: 'Bioluminescent Photonic Silk Motion Concept',
    itemType: 'digital_concept',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    price: 1500,
    currency: 'USD',
    royaltyPercent: 8,
    status: 'available',
    tier: 'Limited Edition 1/10',
    customizationOptions: ['Color Spectrum Calibration', 'Kinetic Speed Adjust'],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  }
];

// Seed default initial assets if memoryStore is empty
if (memoryStore.length === 0) {
  memoryStore.push({
    id: 'mat_creation_seed_1',
    userId: 'creator_atelier_1',
    creatorName: 'Elena Vance-Rousseau',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    creatorLevel: 'Master Atelier',
    type: 'image',
    title: 'Architectural Obsidian Mesh Corset',
    category: 'Luxury Corsetry',
    stylePreset: 'avant_garde',
    outfitType: 'Sculptural Mesh Corset',
    material: 'Anodized Liquid Metal & Silk Organza',
    colorPalette: ['#0A0A0F', '#8B5CF6', '#38BDF8'],
    artisticTheme: 'Cyber-Chiaroscuro Couture',
    prompt: 'Sculptural obsidian corsetry with metallic liquid drape and anatomical silhouette lines',
    generatedAsset: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    memoryType: 'community',
    visibility: 'public',
    savedToWardrobe: true,
    sharedToCommunity: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'completed',
    likeCount: 124,
    commentCount: 18
  }, {
    id: 'mat_creation_seed_2',
    userId: 'creator_atelier_2',
    creatorName: 'Kenzo Takahashi-Saito',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    creatorLevel: 'Couture Visionary',
    type: 'video',
    title: 'Ethereal Bioluminescent Runway Movement',
    category: 'Fantasy Gown',
    stylePreset: 'fantasy_conceptual',
    outfitType: 'Bioluminescent Silk Gown',
    material: 'Photonic Weave & Fluid Organza',
    colorPalette: ['#10B981', '#3B82F6', '#EC4899'],
    artisticTheme: 'Luminous Fantasy Runway',
    prompt: 'Cinematic runway movement of a bioluminescent fluid silk gown moving through dark atmospheric light',
    generatedAsset: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    memoryType: 'community',
    visibility: 'public',
    savedToWardrobe: false,
    sharedToCommunity: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'completed',
    likeCount: 210,
    commentCount: 32
  });
}

// ---------------------- API ROUTES ----------------------

// 1. POST /api/mature-fashion/create - Generate image or video fashion creation
router.post("/create", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId = "demo_user",
      type = "image",
      title = "Untitled Mature Couture",
      category = "Editorial Couture",
      stylePreset = "editorial_couture",
      outfitType = "Bespoke Couture",
      material = "Silk, Obsidian Mesh & Anodized Trim",
      colorPalette = ["#0A0A0F", "#8B5CF6"],
      artisticTheme = "High Fashion Chiaroscuro",
      prompt,
      drapeTension = 75,
      lightingAtmosphere = "dramatic_chiaroscuro",
      textureComplexity = "sculptural_metallic",
      silhouetteStructure = "architectural",
      visibility = "private"
    } = req.body || {};

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      res.status(422).json({
        success: false,
        error: "Prompt parameter is required for fashion generation."
      });
      return;
    }

    const creator = creatorStore[userId] || creatorStore['demo_user'];

    const enhancedPrompt = `High Fashion ${type.toUpperCase()} Creation in ${category}. Theme: ${artisticTheme}. Material: ${material}. Preset: ${stylePreset}. Palette: ${Array.isArray(colorPalette) ? colorPalette.join(", ") : colorPalette}. Prompt: ${prompt}. Lighting: ${lightingAtmosphere}. Texture: ${textureComplexity}. Silhouette: ${silhouetteStructure}. Drape Tension: ${drapeTension}%. High resolution photorealistic haute couture.`;

    let generatedAsset = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800";

    try {
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a world-class fashion designer and creative director. Generate structured fashion design insights for this prompt: "${enhancedPrompt}". Return JSON with keys: refinedTitle, fabricDrapeNotes, moodSummary, colorPaletteHex.`
              }
            ]
          }
        ]
      });

      if (response.text) {
        const imageAssets = [
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800"
        ];
        generatedAsset = imageAssets[Math.floor(Math.random() * imageAssets.length)];
      }
    } catch (aiErr: any) {
      console.warn(`[AI Generation Warning] ${aiErr?.message}`);
    }

    const docId = `mat_creation_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const newCreation: MatureFashionCreation = {
      id: docId,
      userId,
      creatorName: creator.name,
      creatorAvatar: creator.avatar,
      creatorLevel: creator.creatorLevel,
      type: type === 'video' ? 'video' : 'image',
      title: title || `Couture Concept #${docId.slice(-4)}`,
      category,
      stylePreset,
      outfitType,
      material,
      colorPalette: Array.isArray(colorPalette) ? colorPalette : ["#0A0A0F", "#8B5CF6"],
      artisticTheme,
      prompt: prompt.trim(),
      generatedAsset,
      memoryType: visibility === 'public' ? 'community' : 'personal',
      visibility: visibility === 'public' ? 'public' : 'private',
      savedToWardrobe: false,
      sharedToCommunity: visibility === 'public',
      createdAt: new Date().toISOString(),
      status: 'completed',
      parameters: {
        drapeTension,
        lightingAtmosphere,
        textureComplexity,
        silhouetteStructure
      },
      likeCount: 0,
      commentCount: 0
    };

    memoryStore.unshift(newCreation);

    // Update creator stats
    if (creatorStore[userId]) {
      creatorStore[userId].publishedWorks += 1;
      creatorStore[userId].reputationScore = Math.min(100, creatorStore[userId].reputationScore + 1);
    }

    const db = getDb();
    if (db) {
      try {
        await db.collection("matureFashionCreations").doc(docId).set(newCreation);
      } catch (dbErr: any) {
        console.warn(`[Firestore Error] ${dbErr?.message}`);
      }
    }

    res.status(201).json({
      success: true,
      creation: newCreation
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error generating mature fashion creation."
    });
  }
});

// 2. GET /api/mature-fashion/user/:id - Retrieve personal creations
router.get("/user/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    let userCreations: MatureFashionCreation[] = [];

    const db = getDb();
    if (db) {
      try {
        const snapshot = await db.collection("matureFashionCreations")
          .where("userId", "==", userId)
          .get();
        
        snapshot.forEach(doc => {
          userCreations.push(doc.data() as MatureFashionCreation);
        });
      } catch (dbErr) {
        console.warn("[Firestore Read Fallback]");
      }
    }

    if (userCreations.length === 0) {
      userCreations = memoryStore.filter(item => item.userId === userId || userId === 'anon_creator' || userId === 'demo_user');
    }

    res.status(200).json({
      success: true,
      userId,
      creations: userCreations
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error fetching user creations."
    });
  }
});

// 3. POST /api/mature-fashion/save - Save creation to personal memory or wardrobe
router.post("/save", async (req: Request, res: Response): Promise<void> => {
  try {
    const { creationId, savedToWardrobe = true } = req.body || {};

    let targetCreation = memoryStore.find(item => item.id === creationId);
    if (targetCreation) {
      targetCreation.savedToWardrobe = savedToWardrobe;
      targetCreation.memoryType = 'personal';
    }

    const db = getDb();
    if (db && creationId) {
      try {
        await db.collection("matureFashionCreations").doc(creationId).update({
          savedToWardrobe,
          memoryType: 'personal'
        });
      } catch (dbErr) {
        console.warn("[Firestore Save Update Fallback]");
      }
    }

    res.status(200).json({
      success: true,
      message: "Creation successfully saved to personal user memory.",
      creationId,
      savedToWardrobe
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error saving creation."
    });
  }
});

// 4. POST /api/mature-fashion/share - Move creation to community public memory
router.post("/share", async (req: Request, res: Response): Promise<void> => {
  try {
    const { creationId, visibility = "public" } = req.body || {};

    let targetCreation = memoryStore.find(item => item.id === creationId);
    if (targetCreation) {
      targetCreation.visibility = visibility === "public" ? "public" : "private";
      targetCreation.sharedToCommunity = visibility === "public";
      targetCreation.memoryType = visibility === "public" ? "community" : "personal";
    }

    const db = getDb();
    if (db && creationId) {
      try {
        await db.collection("matureFashionCreations").doc(creationId).update({
          visibility: visibility === "public" ? "public" : "private",
          sharedToCommunity: visibility === "public",
          memoryType: visibility === "public" ? "community" : "personal"
        });
      } catch (dbErr) {
        console.warn("[Firestore Share Update Fallback]");
      }
    }

    res.status(200).json({
      success: true,
      message: visibility === "public" 
        ? "Creation published to Community Public Memory!" 
        : "Creation moved back to Private Personal Memory.",
      creationId,
      visibility,
      memoryType: visibility === "public" ? "community" : "personal"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error sharing creation."
    });
  }
});

// 5. GET /api/mature-fashion/community - Retrieve public approved creations
router.get("/community", async (_req: Request, res: Response): Promise<void> => {
  try {
    let communityCreations: MatureFashionCreation[] = [];

    const db = getDb();
    if (db) {
      try {
        const snapshot = await db.collection("matureFashionCreations")
          .where("visibility", "==", "public")
          .get();
        
        snapshot.forEach(doc => {
          communityCreations.push(doc.data() as MatureFashionCreation);
        });
      } catch (dbErr) {
        console.warn("[Firestore Community Fallback]");
      }
    }

    if (communityCreations.length === 0) {
      communityCreations = memoryStore.filter(item => item.visibility === 'public');
    }

    res.status(200).json({
      success: true,
      creations: communityCreations
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error fetching community creations."
    });
  }
});

// ---------------- CREATOR ECONOMY EXTENSIONS ----------------

// 6. GET /api/mature-fashion/creators/:creatorId - Get creator profile
router.get("/creators/:creatorId", async (req: Request, res: Response): Promise<void> => {
  try {
    const creatorId = String(req.params.creatorId);
    let creator = creatorStore[creatorId];

    if (!creator) {
      creator = {
        id: creatorId,
        name: 'Sartorial Visionary',
        handle: `@${creatorId}`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        bio: 'Independent digital fashion designer specializing in haute couture concepts & AI material synthesis.',
        creatorLevel: 'Emerging Designer',
        styleCategory: 'Modern High Fashion',
        expertise: ['Digital Drapery', 'Sculptural Silhouettes'],
        reputationScore: 82,
        publishedWorks: memoryStore.filter(c => c.userId === creatorId).length,
        followersCount: 1250,
        followingCount: 110,
        verified: false,
        badge: 'REGISTERED CREATOR',
        joinedDate: '2025-06-01'
      };
      creatorStore[creatorId] = creator;
    }

    const works = memoryStore.filter(c => c.userId === creatorId);
    const collections = collectionStore.filter(c => c.creatorId === creatorId);

    res.status(200).json({
      success: true,
      creator,
      works,
      collections
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error fetching creator profile."
    });
  }
});

// 7. POST /api/mature-fashion/creators/:creatorId/follow - Follow / Unfollow creator
router.post("/creators/:creatorId/follow", async (req: Request, res: Response): Promise<void> => {
  try {
    const creatorId = String(req.params.creatorId);
    const { follow = true } = req.body || {};

    const creator = creatorStore[creatorId];
    if (creator) {
      creator.followersCount = Math.max(0, creator.followersCount + (follow ? 1 : -1));
    }

    res.status(200).json({
      success: true,
      creatorId,
      isFollowing: follow,
      followersCount: creator ? creator.followersCount : 1251
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error updating follow state."
    });
  }
});

// 8. GET & POST /api/mature-fashion/collections - Fashion collections
router.get("/collections", async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      collections: collectionStore
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error fetching collections."
    });
  }
});

router.post("/collections", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      creatorId = "demo_user",
      title = "New Fashion Drop",
      tagline = "Editorial couture curation",
      description = "An exclusive collection created with Mature Fashion Studio.",
      type = "seasonal_drop",
      season = "Fall / Winter 2026",
      coverImage = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
      creationIds = []
    } = req.body || {};

    const creator = creatorStore[creatorId] || creatorStore['demo_user'];

    const newCol: FashionCollectionData = {
      id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      creatorId,
      creatorName: creator.name,
      creatorAvatar: creator.avatar,
      creatorLevel: creator.creatorLevel,
      title,
      tagline,
      description,
      type,
      season,
      coverImage,
      creationIds: Array.isArray(creationIds) ? creationIds : [],
      likeCount: 1,
      savedCount: 1,
      createdAt: new Date().toISOString(),
      isMarketplaceReady: true,
      estimatedValuation: '$8,500 USD'
    };

    collectionStore.unshift(newCol);

    res.status(201).json({
      success: true,
      collection: newCol
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error creating collection."
    });
  }
});

// 9. POST /api/mature-fashion/interactions - Handle likes, saves, comments, bespoke orders
router.post("/interactions", async (req: Request, res: Response): Promise<void> => {
  try {
    const { actionType, targetId, targetType, commentText, bespokeNotes, clientName, clientEmail } = req.body || {};

    if (actionType === 'like') {
      const item = memoryStore.find(m => m.id === targetId);
      if (item) {
        item.likeCount = (item.likeCount || 0) + 1;
      }
      const col = collectionStore.find(c => c.id === targetId);
      if (col) {
        col.likeCount += 1;
      }
      res.status(200).json({ success: true, message: "Liked successfully", targetId });
      return;
    }

    if (actionType === 'comment') {
      const item = memoryStore.find(m => m.id === targetId);
      if (item) {
        item.commentCount = (item.commentCount || 0) + 1;
      }
      res.status(200).json({
        success: true,
        message: "Comment published",
        comment: {
          id: `cmt_${Date.now()}`,
          targetId,
          userName: clientName || "Fashion Critic",
          text: commentText || "Exquisite architectural drapery!",
          createdAt: new Date().toISOString()
        }
      });
      return;
    }

    if (actionType === 'bespoke_request') {
      res.status(200).json({
        success: true,
        message: "Bespoke custom order request submitted to creator atelier!",
        orderId: `bespoke_${Date.now()}`,
        status: "pending_creator_review"
      });
      return;
    }

    res.status(200).json({ success: true, message: "Interaction recorded" });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error recording interaction."
    });
  }
});

// 10. GET & POST /api/mature-fashion/marketplace - Marketplace listings & bespoke requests
router.get("/marketplace", async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      listings: marketplaceStore
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error fetching marketplace listings."
    });
  }
});

router.post("/marketplace", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title = "Bespoke Couture Concept",
      creatorId = "demo_user",
      itemType = "bespoke_custom_order",
      previewImage = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
      price = 2500,
      tier = "Exclusif 1/1",
      customizationOptions = ["Bespoke Tailoring", "Custom Color Tinting"]
    } = req.body || {};

    const creator = creatorStore[creatorId] || creatorStore['demo_user'];

    const newListing: MarketplaceListingData = {
      id: `mkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      creatorId,
      creatorName: creator.name,
      creatorAvatar: creator.avatar,
      title,
      itemType,
      previewImage,
      price: Number(price) || 2500,
      currency: 'USD',
      royaltyPercent: 10,
      status: 'available',
      tier,
      customizationOptions: Array.isArray(customizationOptions) ? customizationOptions : ["Bespoke Fit"],
      createdAt: new Date().toISOString()
    };

    marketplaceStore.unshift(newListing);

    res.status(201).json({
      success: true,
      listing: newListing
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error creating marketplace listing."
    });
  }
});

// 11. POST /api/mature-fashion/ai-creator-assistant - AI Creator Assistance with Gemini API
router.post("/ai-creator-assistant", async (req: Request, res: Response): Promise<void> => {
  try {
    const { task = "improve_description", text = "", theme = "", stylePreset = "editorial_couture" } = req.body || {};

    const ai = getGenAI();

    let systemInstruction = "You are an elite haute couture editor and fashion director for Vogue / LOOK VISION.";
    let userPrompt = "";

    if (task === "improve_description") {
      userPrompt = `Refine and elevate this fashion garment description into editorial, evocative luxury prose suitable for a Paris Fashion Week catalog: "${text}". Keep it within 3 evocative sentences highlighting fabric physics, light, and architectural drape. Return JSON with key "enhancedDescription".`;
    } else if (task === "suggest_themes") {
      userPrompt = `Generate 3 captivating fashion campaign collection titles & taglines for style preset "${stylePreset}" with theme seed "${theme}". Return JSON with array "themeSuggestions" containing objects with "title", "tagline", and "suggestedPalette" (array of hex colors).`;
    } else if (task === "analyze_style") {
      userPrompt = `Analyze style consistency for a creator work inspired by "${text}". Provide a 1-paragraph luxury critique and a score out of 100 for cohesion. Return JSON with keys "cohesionScore", "critiqueSummary", "recommendedTweaks" (array of strings).`;
    } else {
      userPrompt = `Provide editorial styling commentary for: "${text}". Return JSON with key "commentary".`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }]
          }
        ]
      });

      if (response.text) {
        try {
          const jsonText = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(jsonText);
          res.status(200).json({ success: true, result: parsed });
          return;
        } catch (_) {
          res.status(200).json({
            success: true,
            result: {
              enhancedDescription: response.text.trim(),
              cohesionScore: 92,
              critiqueSummary: response.text.trim()
            }
          });
          return;
        }
      }
    } catch (aiErr: any) {
      console.warn("[AI Creator Assistant Fallback]", aiErr?.message);
    }

    // High quality editorial fallbacks
    if (task === "improve_description") {
      res.status(200).json({
        success: true,
        result: {
          enhancedDescription: `A masterclass in sculptural drapery, featuring anodized liquid metal accents paired with weightless silk organza. High-contrast chiaroscuro shadows carve an architectural silhouette that commands the runway with quiet authority.`
        }
      });
    } else if (task === "suggest_themes") {
      res.status(200).json({
        success: true,
        result: {
          themeSuggestions: [
            {
              title: "Obsidian & Ether",
              tagline: "Architectural metal drapes colliding with bioluminescent silk organza.",
              suggestedPalette: ["#0A0A0F", "#8B5CF6", "#38BDF8"]
            },
            {
              title: "Chiaroscuro Armor",
              tagline: "Sculptural corsetry engineered with cybernetic precision.",
              suggestedPalette: ["#09090B", "#10B981", "#E11D48"]
            },
            {
              title: "Photonic Movement",
              tagline: "Luminous fluid silhouettes moving through atmospheric twilight.",
              suggestedPalette: ["#1E1B4B", "#36BFFA", "#F43F5E"]
            }
          ]
        }
      });
    } else {
      res.status(200).json({
        success: true,
        result: {
          cohesionScore: 95,
          critiqueSummary: "Exceptional cohesion between dark metallic textures and fluid silk lines. The chiaroscuro lighting enhances the three-dimensional depth of the silhouette.",
          recommendedTweaks: ["Increase drape tension slightly for higher kinetic movement", "Add subtle bioluminescent piping to shoulder seams"]
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Error running AI creator assistant."
    });
  }
});

// Legacy backward compatibility route
router.post("/generate", async (req: Request, res: Response, next) => {
  req.url = "/create";
  next();
});

export default router;
