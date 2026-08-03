import { 
  AICreationUniverseCategory, 
  AICreationUniverseMode, 
  MultiViewPresentation, 
  MarketplaceAssetMeta 
} from '../../features/image-generation/AICreationsUniverseEngine';

export interface AICreationCreator {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  totalCreations: number;
  likesReceived: number;
  viewsReceived: number;
}

export interface AICreation {
  id: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
  imageUrl: string;
  imageUrlBefore?: string; // For Before/After slider
  model: string; // e.g., "Imagen 4.0 Pro", "Midjourney v6.1", "Flux.1 Dev"
  style: string; // e.g., "Streetwear", "Minimalist", "Editorial", "Luxury", "Fantasy", "Avant-Garde", "Formal"
  resolution: string; // e.g., "2048x2048", "1024x1024", "1200x1600"
  aspectRatio: string; // e.g., "1:1", "3:4", "9:16"
  createdAt: string; // ISO timestamp
  seed?: string;
  likesCount: number;
  viewsCount: number;
  savesCount: number;
  commentsCount: number;
  creator: AICreationCreator;
  status: 'Published' | 'Draft' | 'Archived';
  tags: string[];
  colorPalette: string[];
  variations?: string[]; // URLs of alternative renders
  
  // A01 Evolution Universe Extensions
  creationCategory?: AICreationUniverseCategory;
  creationMode?: AICreationUniverseMode;
  multiView?: MultiViewPresentation;
  marketplaceMeta?: MarketplaceAssetMeta;
  conceptMeaning?: string;
  visualDirection?: string;
  isSharedToCommunity?: boolean;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  motionSettings?: {
    cameraMotion: string;
    fps: number;
    duration: number;
  };
}

export type AICreationTab = 'GALLERY' | 'DISCOVERY' | 'PORTFOLIO' | '3D_LAB' | 'CREATE_WITH_AI' | 'UNIVERSE_STUDIO' | 'VIRTUAL_THEME' | 'CREATION_STUDIO';

