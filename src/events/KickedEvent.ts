import type { Bot } from "@/types/Bot";

import { BaseEvent } from "@/core/BaseEvent";
import Logger from "@/utils/Logger";

export class KickedEvent extends BaseEvent {
  constructor() {
    super("kicked");
  }

  async run(bot: Bot, ...args: any[]): Promise<void> {
    Logger.warn(`Bot ${bot.botInstance.username} was kicked from the server: ${args}`);
  }
}
