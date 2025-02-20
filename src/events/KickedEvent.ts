import type { Bot } from "@/types/Bot";

import { BaseEvent } from "@/events/BaseEvent";
import Logger from "@/logger/Logger";

export class KickedEvent extends BaseEvent {
  constructor() {
    super("kicked");
  }

  async run(bot: Bot, ...args: any[]): Promise<void> {
    Logger.warn(`Bot ${bot.botInstance.username} was kicked from the server: ${args}`);
  }
}
