import type { Bot } from "@/types/Bot";

import { BaseEvent } from "@/events/BaseEvent";
import Logger from "@/logger/Logger";

export class SpawnEvent extends BaseEvent {
  constructor() {
    super("spawn");
  }

  async run(bot: Bot, ...args: any[]): Promise<void> {
    Logger.log(`${bot.username} has spawned in the world.`);
  }
}
