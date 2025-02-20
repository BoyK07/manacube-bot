import type { Bot } from "@/types/Bot";

import { BaseEvent } from "@/events/BaseEvent";
import Logger from "@/logger/Logger";

export class ErrorEvent extends BaseEvent {
  constructor() {
    super("error");
  }

  async run(bot: Bot, ...args: any[]): Promise<void> {
    Logger.error(`Bot ${bot.botInstance.username} encountered an error: ${args}`);
  }
}
