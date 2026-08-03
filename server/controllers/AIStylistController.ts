import { Request, Response } from 'express';
import { aiStylistService } from '../services/AIStylistService';
import { ApiResponse } from '../types/AIStylistBackend';

export class AIStylistController {
  private static instance: AIStylistController | null = null;

  private constructor() {}

  public static getInstance(): AIStylistController {
    if (!AIStylistController.instance) {
      AIStylistController.instance = new AIStylistController();
    }
    return AIStylistController.instance;
  }

  private getUserId(req: Request): string {
    return (req as any).user?.uid || (req.headers['x-user-id'] as string) || 'guest-sartorialist-user-100';
  }

  public handleChat = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const response = await aiStylistService.processUserChat(userId, req.body);
      const apiResp: ApiResponse = {
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      };
      res.json(apiResp);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error during chat processing.',
        timestamp: new Date().toISOString()
      });
    }
  };

  public handleSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const sessionId = req.body?.sessionId || (req.query.sessionId as string);
      const session = await aiStylistService.getOrCreateSession(userId, sessionId);
      const apiResp: ApiResponse = {
        success: true,
        data: session,
        timestamp: new Date().toISOString()
      };
      res.json(apiResp);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error managing stylist session.',
        timestamp: new Date().toISOString()
      });
    }
  };

  public handleHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const sessionId = (req.query.sessionId as string) || `session_${userId}_default`;
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const before = req.query.before as string;

      const history = await aiStylistService.getSessionHistory(userId, sessionId, limit, before);
      const apiResp: ApiResponse = {
        success: true,
        data: {
          sessionId,
          messages: history,
          count: history.length
        },
        timestamp: new Date().toISOString()
      };
      res.json(apiResp);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error loading session history.',
        timestamp: new Date().toISOString()
      });
    }
  };

  public handleContext = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const sessionId = (req.query.sessionId as string) || `session_${userId}_default`;

      const contextData = await aiStylistService.getSessionContext(userId, sessionId);
      const apiResp: ApiResponse = {
        success: true,
        data: contextData,
        timestamp: new Date().toISOString()
      };
      res.json(apiResp);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error fetching stylist context.',
        timestamp: new Date().toISOString()
      });
    }
  };

  public handleMemoryUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const contextData = await aiStylistService.updateMemory(userId, req.body);
      const apiResp: ApiResponse = {
        success: true,
        data: contextData,
        timestamp: new Date().toISOString()
      };
      res.json(apiResp);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error updating stylist memory.',
        timestamp: new Date().toISOString()
      });
    }
  };

  public handleStyleProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const profile = await aiStylistService.getStyleProfile(userId);
      const apiResp: ApiResponse = {
        success: true,
        data: profile,
        timestamp: new Date().toISOString()
      };
      res.json(apiResp);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error loading style profile.',
        timestamp: new Date().toISOString()
      });
    }
  };

  public handleStream = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const prompt = req.body.prompt || req.body.rawInput || '';
      const sessionId = req.body.sessionId || `session_${userId}_${Date.now().toString(36)}`;

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      const sendEvent = (event: string, data: any) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      };

      sendEvent('thinking', { step: 'Analyzing Style DNA & Archetype', index: 0, total: 6 });

      const response = await aiStylistService.processUserChat(userId, req.body);

      sendEvent('thinking', { step: 'Synthesizing Color & Silhouette Constraints', index: 3, total: 6 });

      // Stream text chunks
      const text = response.summary || '';
      const words = text.split(' ');
      for (let i = 0; i < words.length; i += 3) {
        const chunkText = words.slice(i, i + 3).join(' ') + ' ';
        sendEvent('token', { chunk: chunkText });
      }

      // Stream recommendations
      if (response.recommendations && response.recommendations.length > 0) {
        for (const rec of response.recommendations) {
          sendEvent('recommendation', rec);
        }
      }

      sendEvent('complete', response);
      res.end();
    } catch (err: any) {
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: err.message || 'Streaming failed',
          timestamp: new Date().toISOString()
        });
      } else {
        res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    }
  };

  public handleReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const sessionId = req.body?.sessionId || `session_${userId}_default`;
      const result = await aiStylistService.resetSession(userId, sessionId);
      const apiResp: ApiResponse = {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      };
      res.json(apiResp);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error resetting session.',
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const aiStylistController = AIStylistController.getInstance();
