import { getFirestore } from 'firebase-admin/firestore';
import { ConversationMessage, ConversationSession } from '../../src/ai/stylist';
import { FirestoreConversationDoc, FirestoreMessageDoc, FirestoreSessionStateDoc } from '../types/AIStylistBackend';

export class ConversationPersistenceService {
  private static instance: ConversationPersistenceService | null = null;
  private memorySessions = new Map<string, ConversationSession>();
  private memoryMessages = new Map<string, ConversationMessage[]>();
  private memorySnapshots = new Map<string, Record<string, any>>();

  private constructor() {}

  public static getInstance(): ConversationPersistenceService {
    if (!ConversationPersistenceService.instance) {
      ConversationPersistenceService.instance = new ConversationPersistenceService();
    }
    return ConversationPersistenceService.instance;
  }

  private getKey(userId: string, sessionId: string): string {
    return `${userId}_${sessionId}`;
  }

  private getDb() {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return null;
    }
    try {
      return getFirestore();
    } catch (_) {
      return null;
    }
  }

  public async saveSession(userId: string, session: ConversationSession, contextSnapshot?: Record<string, any>): Promise<void> {
    const key = this.getKey(userId, session.id);
    this.memorySessions.set(key, JSON.parse(JSON.stringify(session)));
    if (contextSnapshot) {
      this.memorySnapshots.set(key, JSON.parse(JSON.stringify(contextSnapshot)));
    }

    const db = this.getDb();
    if (!db) return;

    try {
      const convRef = db.collection('users').doc(userId).collection('stylistConversations').doc(session.id);
      
      const convData: FirestoreConversationDoc = {
        id: session.id,
        userId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        lastIntent: session.activeIntent,
        active: true,
        contextSnapshot
      };

      await convRef.set(convData, { merge: true });

      const stateRef = db.collection('users').doc(userId).collection('sessionState').doc(session.id);
      const stateData: FirestoreSessionStateDoc = {
        sessionId: session.id,
        userId,
        lastActiveAt: session.updatedAt,
        contextSnapshot: contextSnapshot || session.shortTermContext || {},
        activeIntent: session.activeIntent
      };

      await stateRef.set(stateData, { merge: true });
    } catch (_) {}
  }

  public async loadSession(userId: string, sessionId: string): Promise<ConversationSession | null> {
    const key = this.getKey(userId, sessionId);

    const db = this.getDb();
    if (db) {
      try {
        const convRef = db.collection('users').doc(userId).collection('stylistConversations').doc(sessionId);
        const doc = await convRef.get();

        if (doc.exists) {
          const data = doc.data() as FirestoreConversationDoc;
          const messages = await this.getHistory(userId, sessionId, 50);

          const session: ConversationSession = {
            id: data.id,
            userId: data.userId,
            messages,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            activeIntent: data.lastIntent as any,
            shortTermContext: data.contextSnapshot || {}
          };

          this.memorySessions.set(key, JSON.parse(JSON.stringify(session)));
          return session;
        }
      } catch (_) {}
    }

    return this.memorySessions.get(key) || null;
  }

  public async saveMessage(
    userId: string,
    sessionId: string,
    message: ConversationMessage,
    contextSnapshot?: Record<string, any>
  ): Promise<void> {
    const key = this.getKey(userId, sessionId);
    const history = this.memoryMessages.get(key) || [];
    history.push(JSON.parse(JSON.stringify(message)));
    if (history.length > 100) {
      history.shift();
    }
    this.memoryMessages.set(key, history);

    const db = this.getDb();
    if (!db) return;

    try {
      const msgRef = db
        .collection('users')
        .doc(userId)
        .collection('stylistConversations')
        .doc(sessionId)
        .collection('messages')
        .doc(message.id);

      const msgData: FirestoreMessageDoc = {
        id: message.id,
        conversationId: sessionId,
        userId,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
        intent: message.intent,
        confidence: message.responsePayload?.confidence,
        recommendations: message.responsePayload?.recommendations,
        actions: message.responsePayload?.actions,
        metadata: message.metadata,
        contextSnapshot
      };

      await msgRef.set(msgData, { merge: true });

      const convRef = db.collection('users').doc(userId).collection('stylistConversations').doc(sessionId);
      await convRef.set(
        {
          updatedAt: message.timestamp,
          lastIntent: message.intent
        },
        { merge: true }
      );
    } catch (_) {}
  }

  public async getHistory(
    userId: string,
    sessionId: string,
    limit: number = 50,
    before?: string
  ): Promise<ConversationMessage[]> {
    const key = this.getKey(userId, sessionId);

    const db = this.getDb();
    if (db) {
      try {
        let query = db
          .collection('users')
          .doc(userId)
          .collection('stylistConversations')
          .doc(sessionId)
          .collection('messages')
          .orderBy('timestamp', 'asc');

        if (before) {
          query = query.endBefore(before);
        }

        const snap = await query.limit(limit).get();
        if (!snap.empty) {
          const messages: ConversationMessage[] = snap.docs.map(doc => {
            const d = doc.data() as FirestoreMessageDoc;
            return {
              id: d.id,
              role: d.role,
              content: d.content,
              timestamp: d.timestamp,
              intent: d.intent as any,
              metadata: d.metadata
            };
          });
          return messages;
        }
      } catch (_) {}
    }

    const inMem = this.memoryMessages.get(key) || [];
    return inMem.slice(-limit);
  }

  public async resetSession(userId: string, sessionId: string): Promise<void> {
    const key = this.getKey(userId, sessionId);
    this.memorySessions.delete(key);
    this.memoryMessages.delete(key);
    this.memorySnapshots.delete(key);

    const db = this.getDb();
    if (!db) return;

    try {
      const convRef = db.collection('users').doc(userId).collection('stylistConversations').doc(sessionId);
      await convRef.set(
        {
          active: false,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );

      const stateRef = db.collection('users').doc(userId).collection('sessionState').doc(sessionId);
      await stateRef.delete();
    } catch (_) {}
  }
}

export const conversationPersistenceService = ConversationPersistenceService.getInstance();
