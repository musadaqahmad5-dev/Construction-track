import {
  ExpandedFashionContext,
  StylistRequest,
  ConversationSession,
  WardrobeHook,
  MarketplaceHook,
  CommunityHook,
  CalendarHook,
  WeatherHook,
  DigitalTwinHook
} from './StylistInterfaces';
import { conversationMemory } from './ConversationMemory';
import { styleDNAConnector } from './StyleDNAConnector';
import { intentResolver } from './IntentResolver';
import { WardrobeMemoryEngine } from '../../engine';

export class ConversationContextManager {
  private static instance: ConversationContextManager | null = null;

  private wardrobeHook: WardrobeHook | null = null;
  private marketplaceHook: MarketplaceHook | null = null;
  private communityHook: CommunityHook | null = null;
  private calendarHook: CalendarHook | null = null;
  private weatherHook: WeatherHook | null = null;
  private digitalTwinHook: DigitalTwinHook | null = null;

  private constructor() {}

  public static getInstance(): ConversationContextManager {
    if (!ConversationContextManager.instance) {
      ConversationContextManager.instance = new ConversationContextManager();
    }
    return ConversationContextManager.instance;
  }

  public registerWardrobeHook(hook: WardrobeHook): void {
    this.wardrobeHook = hook;
  }

  public registerMarketplaceHook(hook: MarketplaceHook): void {
    this.marketplaceHook = hook;
  }

  public registerCommunityHook(hook: CommunityHook): void {
    this.communityHook = hook;
  }

  public registerCalendarHook(hook: CalendarHook): void {
    this.calendarHook = hook;
  }

  public registerWeatherHook(hook: WeatherHook): void {
    this.weatherHook = hook;
  }

  public registerDigitalTwinHook(hook: DigitalTwinHook): void {
    this.digitalTwinHook = hook;
  }

  public async buildContext(request: StylistRequest, session: ConversationSession): Promise<ExpandedFashionContext> {
    const userId = request.userId;
    const intent = intentResolver.resolveIntent(request);
    const extractedEntities = intentResolver.extractEntities(request.rawInput);

    const styleDNA = await styleDNAConnector.loadStyleDNA(userId, request.items);

    let wardrobeItems = request.items || [];
    if (wardrobeItems.length === 0) {
      if (this.wardrobeHook) {
        try {
          wardrobeItems = await this.wardrobeHook.getWardrobe(userId);
        } catch (_) {
          wardrobeItems = [];
        }
      } else {
        const cached = WardrobeMemoryEngine.getCachedWardrobe(userId);
        if (cached) {
          wardrobeItems = cached;
        }
      }
    }

    let weatherInfo: { temp: number; condition: string; season: string } | undefined;
    if (this.weatherHook) {
      try {
        weatherInfo = await this.weatherHook.getCurrentWeather();
      } catch (_) {
        weatherInfo = undefined;
      }
    } else if (request.weather || extractedEntities.weather || extractedEntities.season) {
      weatherInfo = {
        temp: 72,
        condition: request.weather || extractedEntities.weather || 'Clear',
        season: request.season || extractedEntities.season || 'Summer'
      };
    }

    let upcomingEvents: any[] | undefined;
    if (this.calendarHook) {
      try {
        upcomingEvents = await this.calendarHook.getUpcomingEvents(userId);
      } catch (_) {
        upcomingEvents = undefined;
      }
    }

    let digitalTwinMetrics: Record<string, any> | undefined;
    if (this.digitalTwinHook) {
      try {
        digitalTwinMetrics = await this.digitalTwinHook.getTwinMetrics(userId);
      } catch (_) {
        digitalTwinMetrics = undefined;
      }
    }

    const recentHistory = conversationMemory.getHistory(userId, session.id, 6);
    const shortTermMemory = conversationMemory.getShortTermContext(userId, session.id);

    return {
      userId,
      sessionId: session.id,
      rawInput: request.rawInput,
      intent,
      styleDNA,
      wardrobeItems,
      weatherInfo,
      upcomingEvents,
      digitalTwinMetrics,
      shortTermMemory,
      recentHistory,
      occasion: request.occasion || extractedEntities.occasion || session.shortTermContext.occasion,
      season: request.season || extractedEntities.season || weatherInfo?.season,
      budget: request.budget || extractedEntities.budget,
      vibePreset: request.vibePreset || extractedEntities.vibe || styleDNA.primaryVibe,
      colors: request.colors || extractedEntities.colors || styleDNA.colorPalette,
      imageUrl: request.imageUrl,
      videoUrl: request.videoUrl,
      metadata: request.metadata
    };
  }
}

export const conversationContextManager = ConversationContextManager.getInstance();
