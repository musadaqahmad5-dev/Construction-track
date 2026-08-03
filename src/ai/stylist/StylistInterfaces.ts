import { FashionResponse, FashionRequestType, FashionContext, EnginePriority } from '../../engine';
import { WardrobeItem } from '../../types';

export type StylistIntent =
  | 'OUTFIT'
  | 'WARDROBE'
  | 'SHOPPING'
  | 'TREND'
  | 'STYLE_ADVICE'
  | 'COLOR'
  | 'TRY_ON'
  | 'IMAGE'
  | 'VIDEO'
  | 'COMMUNITY'
  | 'MARKETPLACE'
  | 'GENERAL'
  | 'UNKNOWN';

export interface StylistRequest {
  id: string;
  userId: string;
  rawInput: string;
  sessionId?: string;
  imageUrl?: string;
  videoUrl?: string;
  occasion?: string;
  season?: string;
  weather?: string;
  budget?: number;
  overrideIntent?: StylistIntent;
  items?: WardrobeItem[];
  vibePreset?: string;
  colors?: string[];
  metadata?: Record<string, any>;
}

export interface StylistRecommendation {
  id: string;
  title: string;
  category: string;
  description: string;
  score: number;
  tags: string[];
  imageUrl?: string;
  itemDetails?: any;
  reasoning: string;
}

export type StylistActionType =
  | 'NAVIGATE'
  | 'OPEN_TRY_ON'
  | 'ADD_TO_WARDROBE'
  | 'SEARCH_MARKETPLACE'
  | 'SAVE_OUTFIT'
  | 'APPLY_PRESET';

export interface StylistAction {
  id: string;
  type: StylistActionType;
  label: string;
  payload: Record<string, any>;
}

export interface ReasoningDetails {
  factorsAnalyzed: string[];
  conflictResolutions: string[];
  topDriver: string;
  fallbackUsed: boolean;
  engineContributionScores: Record<string, number>;
}

export interface StylistResponse {
  id: string;
  requestId: string;
  timestamp: string;
  confidence: number;
  intent: StylistIntent;
  summary: string;
  recommendations: StylistRecommendation[];
  actions: StylistAction[];
  followUpQuestions: string[];
  metadata: Record<string, any>;
  fashionEngineResponse?: FashionResponse;
  reasoningDetails?: ReasoningDetails;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: StylistIntent;
  metadata?: Record<string, any>;
  responsePayload?: StylistResponse;
}

export interface ConversationSession {
  id: string;
  userId: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
  activeIntent?: StylistIntent;
  shortTermContext: Record<string, any>;
}

export interface StyleDNAData {
  userId: string;
  archetype: string;
  primaryVibe: string;
  colorPalette: string[];
  fitPreference: string;
  brandAffinity: string[];
  riskTolerance: number;
  updatedAt: string;
}

export interface WardrobeHook {
  getWardrobe: (userId: string) => Promise<WardrobeItem[]>;
}

export interface MarketplaceHook {
  searchProducts: (query: string, filters?: Record<string, any>) => Promise<any[]>;
}

export interface CommunityHook {
  getTopTrends: () => Promise<string[]>;
}

export interface CalendarHook {
  getUpcomingEvents: (userId: string) => Promise<any[]>;
}

export interface WeatherHook {
  getCurrentWeather: (location?: string) => Promise<{ temp: number; condition: string; season: string }>;
}

export interface DigitalTwinHook {
  getTwinMetrics: (userId: string) => Promise<Record<string, any>>;
}

export interface ExpandedFashionContext {
  userId: string;
  sessionId: string;
  rawInput: string;
  intent: StylistIntent;
  styleDNA: StyleDNAData;
  wardrobeItems: WardrobeItem[];
  weatherInfo?: { temp: number; condition: string; season: string };
  upcomingEvents?: any[];
  digitalTwinMetrics?: Record<string, any>;
  shortTermMemory: Record<string, any>;
  recentHistory: ConversationMessage[];
  occasion?: string;
  season?: string;
  budget?: number;
  vibePreset?: string;
  colors?: string[];
  imageUrl?: string;
  videoUrl?: string;
  metadata?: Record<string, any>;
}
