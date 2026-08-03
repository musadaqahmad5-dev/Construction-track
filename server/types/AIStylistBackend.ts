import { StylistIntent, StylistRequest, StylistResponse, ConversationMessage, ConversationSession, StyleDNAData } from '../../src/ai/stylist';

export interface ApiStylistChatRequest {
  prompt: string;
  sessionId?: string;
  imageUrl?: string;
  videoUrl?: string;
  occasion?: string;
  season?: string;
  budget?: number;
  overrideIntent?: StylistIntent;
  metadata?: Record<string, any>;
}

export interface ApiStylistSessionRequest {
  sessionId?: string;
}

export interface ApiHistoryQuery {
  sessionId?: string;
  limit?: number;
  before?: string;
}

export interface ApiMemoryUpdateRequest {
  sessionId?: string;
  memoryKey: string;
  memoryValue: any;
  category?: string;
}

export interface FirestoreConversationDoc {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  lastIntent?: string;
  active: boolean;
  contextSnapshot?: Record<string, any>;
}

export interface FirestoreMessageDoc {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: string;
  confidence?: number;
  recommendations?: any[];
  actions?: any[];
  metadata?: Record<string, any>;
  contextSnapshot?: Record<string, any>;
}

export interface FirestoreStyleProfileDoc {
  userId: string;
  archetype: string;
  primaryVibe: string;
  colorPalette: string[];
  fitPreference: string;
  brandAffinity: string[];
  riskTolerance: number;
  updatedAt: string;
}

export interface FirestoreSessionStateDoc {
  sessionId: string;
  userId: string;
  lastActiveAt: string;
  contextSnapshot: Record<string, any>;
  activeIntent?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
  timestamp: string;
}
