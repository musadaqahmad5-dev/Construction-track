import { ConversationMessage, ConversationSession, StylistIntent, StylistResponse } from './StylistInterfaces';

export class ConversationMemory {
  private static instance: ConversationMemory | null = null;
  private sessions = new Map<string, ConversationSession>();
  private maxMessagesPerSession = 50;

  private constructor() {}

  public static getInstance(): ConversationMemory {
    if (!ConversationMemory.instance) {
      ConversationMemory.instance = new ConversationMemory();
    }
    return ConversationMemory.instance;
  }

  public getSession(userId: string, sessionId?: string): ConversationSession {
    const key = sessionId || `session_${userId}_default`;
    if (!this.sessions.has(key)) {
      const newSession: ConversationSession = {
        id: key,
        userId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shortTermContext: {}
      };
      this.sessions.set(key, newSession);
    }
    return this.sessions.get(key)!;
  }

  public addMessage(
    userId: string,
    sessionId: string | undefined,
    role: 'user' | 'assistant' | 'system',
    content: string,
    intent?: StylistIntent,
    responsePayload?: StylistResponse,
    metadata?: Record<string, any>
  ): ConversationMessage {
    const session = this.getSession(userId, sessionId);
    const message: ConversationMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      role,
      content,
      timestamp: new Date().toISOString(),
      intent,
      responsePayload,
      metadata
    };

    session.messages.push(message);
    if (session.messages.length > this.maxMessagesPerSession) {
      session.messages = session.messages.slice(session.messages.length - this.maxMessagesPerSession);
    }
    session.updatedAt = new Date().toISOString();
    if (intent) {
      session.activeIntent = intent;
    }

    this.persistToFirestoreHook(session);

    return message;
  }

  public getHistory(userId: string, sessionId?: string, limit: number = 10): ConversationMessage[] {
    const session = this.getSession(userId, sessionId);
    return session.messages.slice(-limit);
  }

  public setShortTermContext(userId: string, sessionId: string | undefined, key: string, value: any): void {
    const session = this.getSession(userId, sessionId);
    session.shortTermContext[key] = value;
    session.updatedAt = new Date().toISOString();
  }

  public getShortTermContext(userId: string, sessionId?: string): Record<string, any> {
    const session = this.getSession(userId, sessionId);
    return { ...session.shortTermContext };
  }

  public clearSession(userId: string, sessionId?: string): void {
    const key = sessionId || `session_${userId}_default`;
    this.sessions.delete(key);
  }

  public exportSessionSnapshot(userId: string, sessionId?: string): ConversationSession {
    const session = this.getSession(userId, sessionId);
    return JSON.parse(JSON.stringify(session));
  }

  private persistToFirestoreHook(session: ConversationSession): void {
    if (typeof window !== 'undefined' && (window as any).FIREBASE_APP) {
      try {
        // Reserved hook for future persistent Firestore synchronization
      } catch (_) {
        // Ignore silent storage errors in browser environment
      }
    }
  }
}

export const conversationMemory = ConversationMemory.getInstance();
