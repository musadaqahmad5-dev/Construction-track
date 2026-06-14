import { EventStore, PlatformEvent } from './eventStore';

export interface Command {
  type: string;
  payload: any;
}

export type CommandHandler = (payload: any) => { success: boolean; data?: any; error?: string };

export class CommandBus {
  private static handlers: Record<string, CommandHandler> = {};

  static registerHandler(commandType: string, handler: CommandHandler) {
    this.handlers[commandType] = handler;
  }

  /**
   * Dispatches command to specific handlers and pushes corresponding events to the EventStore.
   */
  static dispatch(command: Command): { success: boolean; event?: PlatformEvent; error?: string } {
    const handler = this.handlers[command.type];
    if (!handler) {
      return { success: false, error: `Command Handler not found for query type "${command.type}"` };
    }

    const outcome = handler(command.payload);
    if (!outcome.success) {
      // Log failed dispatch attempts too
      EventStore.commit(`${command.type}_FAILED`, 'command-bus', { payload: command.payload, error: outcome.error });
      return { success: false, error: outcome.error };
    }

    const eventCommitted = EventStore.commit(`${command.type}_COMPLETED`, 'command-bus', outcome.data || command.payload);
    return { success: true, event: eventCommitted };
  }
}
