import {
  aiStylistBrain,
  conversationMemory,
  conversationContextManager,
  styleDNAConnector,
  StylistRequest,
  StylistResponse,
  ConversationSession,
  ConversationMessage,
  StyleDNAData
} from '../../src/ai/stylist';
import { ApiStylistChatRequest, ApiMemoryUpdateRequest } from '../types/AIStylistBackend';
import { conversationPersistenceService } from './ConversationPersistenceService';
import { memoryPersistenceService } from './MemoryPersistenceService';

export class AIStylistService {
  private static instance: AIStylistService | null = null;

  private constructor() {}

  public static getInstance(): AIStylistService {
    if (!AIStylistService.instance) {
      AIStylistService.instance = new AIStylistService();
    }
    return AIStylistService.instance;
  }

  public async processUserChat(userId: string, payload: ApiStylistChatRequest): Promise<StylistResponse> {
    const sessionId = payload.sessionId || `session_${userId}_${Date.now().toString(36)}`;
    
    await this.getOrCreateSession(userId, sessionId);

    const request: StylistRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      rawInput: payload.prompt,
      sessionId,
      imageUrl: payload.imageUrl,
      videoUrl: payload.videoUrl,
      occasion: payload.occasion,
      season: payload.season,
      budget: payload.budget,
      overrideIntent: payload.overrideIntent,
      metadata: payload.metadata
    };

    const response: StylistResponse = await aiStylistBrain.processRequest(request);

    const session: ConversationSession = conversationMemory.getSession(userId, sessionId);
    
    const userMsg: ConversationMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: payload.prompt,
      timestamp: response.timestamp,
      intent: response.intent,
      metadata: payload.metadata
    };

    const assistantMsg: ConversationMessage = {
      id: `msg_a_${Date.now()}`,
      role: 'assistant',
      content: response.summary,
      timestamp: response.timestamp,
      intent: response.intent,
      responsePayload: response,
      metadata: { confidence: response.confidence }
    };

    await conversationPersistenceService.saveMessage(userId, sessionId, userMsg);
    await conversationPersistenceService.saveMessage(userId, sessionId, assistantMsg, response.metadata);
    await conversationPersistenceService.saveSession(userId, session, response.metadata);

    return response;
  }

  public async getOrCreateSession(userId: string, requestedSessionId?: string): Promise<ConversationSession> {
    const sessionId = requestedSessionId || `session_${userId}_default`;
    
    let session = await conversationPersistenceService.loadSession(userId, sessionId);
    if (!session) {
      session = conversationMemory.getSession(userId, sessionId);
      await conversationPersistenceService.saveSession(userId, session);
    } else {
      const activeSession = conversationMemory.getSession(userId, sessionId);
      activeSession.messages = session.messages;
      activeSession.shortTermContext = session.shortTermContext;
    }

    return session;
  }

  public async getSessionHistory(
    userId: string,
    sessionId: string,
    limit: number = 50,
    before?: string
  ): Promise<ConversationMessage[]> {
    return conversationPersistenceService.getHistory(userId, sessionId, limit, before);
  }

  public async getSessionContext(userId: string, sessionId: string): Promise<Record<string, any>> {
    const session = await this.getOrCreateSession(userId, sessionId);
    const styleDNA = await this.getStyleProfile(userId);
    const shortTerm = conversationMemory.getShortTermContext(userId, sessionId);
    const savedMemory = await memoryPersistenceService.loadMemoryEntries(userId);

    return {
      userId,
      sessionId: session.id,
      activeIntent: session.activeIntent,
      shortTermContext: shortTerm,
      persistedMemory: savedMemory,
      styleDNA,
      messageCount: session.messages.length,
      lastUpdated: session.updatedAt
    };
  }

  public async updateMemory(userId: string, payload: ApiMemoryUpdateRequest): Promise<Record<string, any>> {
    const sessionId = payload.sessionId || `session_${userId}_default`;
    
    conversationMemory.setShortTermContext(userId, sessionId, payload.memoryKey, payload.memoryValue);
    await memoryPersistenceService.saveMemoryEntry(userId, payload.memoryKey, payload.memoryValue, payload.category);

    return this.getSessionContext(userId, sessionId);
  }

  public async getStyleProfile(userId: string): Promise<StyleDNAData> {
    let profile = await memoryPersistenceService.loadStyleProfile(userId);
    if (!profile) {
      profile = await styleDNAConnector.loadStyleDNA(userId);
      await memoryPersistenceService.saveStyleProfile(userId, profile);
    }
    return profile;
  }

  public async resetSession(userId: string, sessionId: string): Promise<{ success: boolean; message: string }> {
    conversationMemory.clearSession(userId, sessionId);
    await conversationPersistenceService.resetSession(userId, sessionId);
    return {
      success: true,
      message: `Session ${sessionId} reset successfully.`
    };
  }
}

export const aiStylistService = AIStylistService.getInstance();
