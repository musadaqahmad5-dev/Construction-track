import { useState, useEffect, useRef, useCallback } from 'react';
import {
  StylistRequest,
  StylistResponse,
  StylistRecommendation,
  StylistIntent
} from '../../../ai/stylist';
import {
  StreamingConversationEngine,
  StreamEventChunk
} from '../StreamingConversationEngine';
import {
  ConversationStateMetadata,
  INITIAL_CONVERSATION_STATE
} from '../RealtimeConversationState';

export interface UseStreamingConversationOptions {
  userId?: string;
  sessionId?: string;
  onResponseComplete?: (response: StylistResponse) => void;
  onError?: (error: string) => void;
}

export function useStreamingConversation(options: UseStreamingConversationOptions = {}) {
  const {
    userId = 'guest-sartorialist-user-100',
    sessionId = 'guest_session',
    onResponseComplete,
    onError
  } = options;

  const [streamMetadata, setStreamMetadata] = useState<ConversationStateMetadata>(
    INITIAL_CONVERSATION_STATE
  );
  const [streamedText, setStreamedText] = useState<string>('');
  const [recommendations, setRecommendations] = useState<StylistRecommendation[]>([]);

  const callbacksRef = useRef({ onResponseComplete, onError });
  useEffect(() => {
    callbacksRef.current = { onResponseComplete, onError };
  });

  const engineRef = useRef<StreamingConversationEngine | null>(null);

  useEffect(() => {
    const engine = new StreamingConversationEngine({
      onStateChange: state => setStreamMetadata(state),
      onTokenChunk: (chunk, fullText) => setStreamedText(fullText),
      onRecommendationStream: (rec, allRecs) => setRecommendations([...allRecs]),
      onComplete: resp => {
        callbacksRef.current.onResponseComplete?.(resp);
      },
      onError: err => {
        callbacksRef.current.onError?.(err);
      }
    });

    engineRef.current = engine;

    return () => {
      if (engineRef.current) {
        engineRef.current.cancel();
      }
    };
  }, []);

  const streamRequest = useCallback(
    async (
      prompt: string,
      requestOptions: {
        imageUrl?: string;
        videoUrl?: string;
        overrideIntent?: StylistIntent;
        occasion?: string;
        budget?: number;
      } = {}
    ): Promise<StylistResponse | null> => {
      if (!engineRef.current) return null;

      setStreamedText('');
      setRecommendations([]);

      const request: StylistRequest = {
        id: `req_${Date.now()}`,
        userId,
        rawInput: prompt,
        sessionId,
        imageUrl: requestOptions.imageUrl,
        videoUrl: requestOptions.videoUrl,
        overrideIntent: requestOptions.overrideIntent,
        occasion: requestOptions.occasion,
        budget: requestOptions.budget
      };

      return engineRef.current.streamRequest(request);
    },
    [userId, sessionId]
  );

  const cancel = useCallback(() => {
    engineRef.current?.cancel();
  }, []);

  const retry = useCallback(async () => {
    return engineRef.current?.retry() ?? null;
  }, []);

  const resume = useCallback(async () => {
    return engineRef.current?.resume() ?? null;
  }, []);

  const interrupt = useCallback(() => {
    engineRef.current?.interrupt();
  }, []);

  const reset = useCallback(() => {
    setStreamedText('');
    setRecommendations([]);
    setStreamMetadata(INITIAL_CONVERSATION_STATE);
  }, []);

  return {
    streamMetadata,
    streamedText,
    recommendations,
    isStreaming: ['Thinking', 'Streaming', 'Generating', 'Waiting'].includes(
      streamMetadata.status
    ),
    streamRequest,
    cancel,
    retry,
    resume,
    interrupt,
    reset
  };
}
