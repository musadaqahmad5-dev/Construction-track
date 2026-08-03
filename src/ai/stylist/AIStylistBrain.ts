import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { StylistRequest, StylistResponse, ConversationSession, ExpandedFashionContext } from './StylistInterfaces';
import { intentResolver } from './IntentResolver';
import { conversationMemory } from './ConversationMemory';
import { styleDNAConnector } from './StyleDNAConnector';
import { conversationContextManager } from './ConversationContextManager';
import { promptOrchestrator } from './PromptOrchestrator';
import { fashionReasoningEngine } from './FashionReasoningEngine';
import { responseComposer } from './ResponseComposer';
import { unifiedFashionIntelligenceCore } from '../../engine';

export class AIStylistBrain {
  private static instance: AIStylistBrain | null = null;

  private constructor() {}

  public static getInstance(): AIStylistBrain {
    if (!AIStylistBrain.instance) {
      AIStylistBrain.instance = new AIStylistBrain();
    }
    return AIStylistBrain.instance;
  }

  public async processRequest(request: StylistRequest): Promise<StylistResponse> {
    const session: ConversationSession = conversationMemory.getSession(request.userId, request.sessionId);

    conversationMemory.addMessage(
      request.userId,
      session.id,
      'user',
      request.rawInput,
      request.overrideIntent,
      undefined,
      request.metadata
    );

    const context: ExpandedFashionContext = await conversationContextManager.buildContext(request, session);

    const { fashionEngineRequest } = promptOrchestrator.orchestrate(context);

    let fashionEngineResponse;
    try {
      fashionEngineResponse = await unifiedFashionIntelligenceCore.processRequest(fashionEngineRequest);
    } catch (err: any) {
      fashionEngineResponse = undefined;
    }

    const reasoning = fashionReasoningEngine.reason(context, fashionEngineResponse);

    const response: StylistResponse = responseComposer.compose(
      request,
      context,
      reasoning,
      fashionEngineResponse
    );

    conversationMemory.addMessage(
      request.userId,
      session.id,
      'assistant',
      response.summary,
      response.intent,
      response,
      { confidence: response.confidence }
    );

    return response;
  }

  public async getSession(userId: string, sessionId?: string): Promise<ConversationSession> {
    return conversationMemory.getSession(userId, sessionId);
  }

  public async getStyleDNA(userId: string) {
    return styleDNAConnector.loadStyleDNA(userId);
  }

  public clearSession(userId: string, sessionId?: string): void {
    conversationMemory.clearSession(userId, sessionId);
  }
}

export const aiStylistBrain = AIStylistBrain.getInstance();

export interface AIStylistContextValue {
  brain: AIStylistBrain;
  processRequest: (request: StylistRequest) => Promise<StylistResponse>;
  askStylist: (rawInput: string, userId?: string, options?: Partial<StylistRequest>) => Promise<StylistResponse>;
  requestTryOn: (imageUrl: string, userId?: string, options?: Partial<StylistRequest>) => Promise<StylistResponse>;
  requestOutfitRecommendation: (occasion?: string, userId?: string) => Promise<StylistResponse>;
  clearConversation: (userId?: string, sessionId?: string) => void;
}

const AIStylistContext = createContext<AIStylistContextValue | null>(null);

export interface AIStylistProviderProps {
  children: React.ReactNode;
}

export const AIStylistProvider: React.FC<AIStylistProviderProps> = ({ children }) => {
  const existingContext = useContext(AIStylistContext);

  if (existingContext) {
    return React.createElement(React.Fragment, null, children);
  }

  const processRequest = useCallback(async (request: StylistRequest): Promise<StylistResponse> => {
    return aiStylistBrain.processRequest(request);
  }, []);

  const askStylist = useCallback(async (
    rawInput: string,
    userId: string = 'user_default',
    options: Partial<StylistRequest> = {}
  ): Promise<StylistResponse> => {
    const request: StylistRequest = {
      id: `req_ask_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      rawInput,
      ...options
    };
    return aiStylistBrain.processRequest(request);
  }, []);

  const requestTryOn = useCallback(async (
    imageUrl: string,
    userId: string = 'user_default',
    options: Partial<StylistRequest> = {}
  ): Promise<StylistResponse> => {
    const request: StylistRequest = {
      id: `req_tryon_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      rawInput: 'Process virtual fitting request',
      imageUrl,
      overrideIntent: 'TRY_ON',
      ...options
    };
    return aiStylistBrain.processRequest(request);
  }, []);

  const requestOutfitRecommendation = useCallback(async (
    occasion: string = 'CASUAL',
    userId: string = 'user_default'
  ): Promise<StylistResponse> => {
    const request: StylistRequest = {
      id: `req_rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      rawInput: `Recommend an outfit for ${occasion}`,
      occasion,
      overrideIntent: 'OUTFIT'
    };
    return aiStylistBrain.processRequest(request);
  }, []);

  const clearConversation = useCallback((userId: string = 'user_default', sessionId?: string): void => {
    aiStylistBrain.clearSession(userId, sessionId);
  }, []);

  const value = useMemo<AIStylistContextValue>(() => ({
    brain: aiStylistBrain,
    processRequest,
    askStylist,
    requestTryOn,
    requestOutfitRecommendation,
    clearConversation
  }), [processRequest, askStylist, requestTryOn, requestOutfitRecommendation, clearConversation]);

  return React.createElement(AIStylistContext.Provider, { value }, children);
};

export function useAIStylist(): AIStylistContextValue {
  const context = useContext(AIStylistContext);
  if (!context) {
    return {
      brain: aiStylistBrain,
      processRequest: (req) => aiStylistBrain.processRequest(req),
      askStylist: (input, uid = 'user_default', opts) => aiStylistBrain.processRequest({ id: `req_${Date.now()}`, userId: uid, rawInput: input, ...opts }),
      requestTryOn: (url, uid = 'user_default', opts) => aiStylistBrain.processRequest({ id: `req_${Date.now()}`, userId: uid, rawInput: 'VTO', imageUrl: url, overrideIntent: 'TRY_ON', ...opts }),
      requestOutfitRecommendation: (occ = 'CASUAL', uid = 'user_default') => aiStylistBrain.processRequest({ id: `req_${Date.now()}`, userId: uid, rawInput: `Recommend outfit for ${occ}`, occasion: occ, overrideIntent: 'OUTFIT' }),
      clearConversation: (uid = 'user_default', sid) => aiStylistBrain.clearSession(uid, sid)
    };
  }
  return context;
}
