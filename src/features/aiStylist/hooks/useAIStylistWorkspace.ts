import { useState, useEffect, useCallback, useRef } from 'react';
import {
  StylistRequest,
  StylistResponse,
  StylistIntent,
  ConversationMessage,
  StylistRecommendation,
  StylistAction
} from '../../../ai/stylist';
import { useStreamingConversation } from './useStreamingConversation';

export interface ThinkingState {
  isThinking: boolean;
  currentStep: string;
  stepIndex: number;
  totalSteps: number;
}

export interface WorkspaceState {
  sessionId: string;
  userId: string;
  messages: ConversationMessage[];
  latestResponse: StylistResponse | null;
  recommendations: StylistRecommendation[];
  thinking: ThinkingState;
  activeIntent: StylistIntent;
  contextSnapshot: Record<string, any>;
  styleProfile: Record<string, any>;
  isProcessing: boolean;
  error: string | null;
}

const THINKING_STEPS = [
  'Analyzing Style DNA & Archetype',
  'Reading Digital Wardrobe & Fits',
  'Consulting Unified Fashion Intelligence',
  'Synthesizing Color & Silhouette Constraints',
  'Ranking Recommendations & Confidence',
  'Preparing Executive Response'
];

export function useAIStylistWorkspace(userId: string = 'guest-sartorialist-user-100', initialSessionId?: string) {
  const [sessionId, setSessionId] = useState<string>(
    initialSessionId || `session_${userId}_${Date.now().toString(36)}`
  );
  
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [latestResponse, setLatestResponse] = useState<StylistResponse | null>(null);
  const [recommendations, setRecommendations] = useState<StylistRecommendation[]>([]);
  const [activeIntent, setActiveIntent] = useState<StylistIntent>('GENERAL');
  const [contextSnapshot, setContextSnapshot] = useState<Record<string, any>>({});
  const [styleProfile, setStyleProfile] = useState<Record<string, any>>({
    archetype: 'Modern Minimalist',
    primaryVibe: 'Quiet Luxury',
    colorPalette: ['#05050a', '#ffffff', '#6366f1', '#374151'],
    fitPreference: 'Tailored',
    riskTolerance: 0.75
  });
  
  const [thinking, setThinking] = useState<ThinkingState>({
    isThinking: false,
    currentStep: '',
    stepIndex: 0,
    totalSteps: THINKING_STEPS.length
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const streaming = useStreamingConversation({
    userId,
    sessionId,
    onResponseComplete: (resp) => {
      setLatestResponse(resp);
      setRecommendations(resp.recommendations || []);
      setActiveIntent(resp.intent);

      const assistantMsg: ConversationMessage = {
        id: resp.id,
        role: 'assistant',
        content: resp.summary,
        timestamp: resp.timestamp,
        intent: resp.intent,
        responsePayload: resp
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
      setThinking(prev => ({ ...prev, isThinking: false }));
    },
    onError: (err) => {
      setError(err);
      setIsProcessing(false);
      setThinking(prev => ({ ...prev, isThinking: false }));
    }
  });

  useEffect(() => {
    if (streaming.isStreaming) {
      setIsProcessing(true);
      setThinking({
        isThinking: true,
        currentStep: streaming.streamMetadata.thinkingStep || 'Processing Neural Stream',
        stepIndex: streaming.streamMetadata.thinkingStepIndex || 0,
        totalSteps: streaming.streamMetadata.thinkingTotalSteps || 6
      });
    }
  }, [streaming.isStreaming, streaming.streamMetadata.thinkingStep, streaming.streamMetadata.thinkingStepIndex, streaming.streamMetadata.thinkingTotalSteps]);

  const loadContextAndHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/stylist/context?sessionId=${encodeURIComponent(sessionId)}`, {
        headers: { Authorization: 'Bearer guest-token' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          if (json.data.styleDNA) setStyleProfile(json.data.styleDNA);
          if (json.data.shortTermContext) setContextSnapshot(json.data.shortTermContext);
          if (json.data.activeIntent) setActiveIntent(json.data.activeIntent);
        }
      }

      const historyRes = await fetch(`/api/stylist/history?sessionId=${encodeURIComponent(sessionId)}`, {
        headers: { Authorization: 'Bearer guest-token' }
      });
      if (historyRes.ok) {
        const json = await historyRes.json();
        if (json.data && Array.isArray(json.data.messages)) {
          setMessages(json.data.messages);
        }
      }
    } catch (_) {
      // Gracefully silent in offline client fallback
    }
  }, [sessionId]);

  useEffect(() => {
    loadContextAndHistory();
  }, [loadContextAndHistory]);

  const sendMessage = useCallback(
    async (
      prompt: string,
      options: {
        imageUrl?: string;
        videoUrl?: string;
        overrideIntent?: StylistIntent;
        occasion?: string;
        budget?: number;
      } = {}
    ): Promise<StylistResponse | null> => {
      if (!prompt.trim() && !options.imageUrl) return null;

      setIsProcessing(true);
      setError(null);

      const tempUserMsg: ConversationMessage = {
        id: `temp_u_${Date.now()}`,
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString(),
        intent: options.overrideIntent || activeIntent
      };

      setMessages(prev => [...prev, tempUserMsg]);

      return streaming.streamRequest(prompt, options);
    },
    [activeIntent, streaming]
  );

  const executeAction = useCallback(
    (action: StylistAction) => {
      if (typeof window !== 'undefined') {
        const customEvent = new CustomEvent('stylist_action_triggered', { detail: action });
        window.dispatchEvent(customEvent);
      }
    },
    []
  );

  const resetSession = useCallback(async () => {
    try {
      await fetch('/api/stylist/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer guest-token'
        },
        body: JSON.stringify({ sessionId })
      });
    } catch (_) {}

    streaming.reset();
    const newSessionId = `session_${userId}_${Date.now().toString(36)}`;
    setSessionId(newSessionId);
    setMessages([]);
    setLatestResponse(null);
    setRecommendations([]);
    setActiveIntent('GENERAL');
  }, [sessionId, userId, streaming]);

  return {
    sessionId,
    userId,
    messages,
    latestResponse,
    recommendations,
    thinking,
    activeIntent,
    contextSnapshot,
    styleProfile,
    isProcessing,
    error,
    streaming,
    sendMessage,
    executeAction,
    resetSession,
    refreshContext: loadContextAndHistory
  };
}
