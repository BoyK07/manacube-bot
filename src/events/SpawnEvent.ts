import type { Bot } from "@/types/Bot";

import { BaseEvent } from "@/core/BaseEvent";
import Logger from "@/utils/Logger";

export class SpawnEvent extends BaseEvent {
  constructor() {
    super("spawn");
  }

  async run(bot: Bot, ...args: any[]): Promise<void> {
    Logger.log(`${bot.username} has spawned in the world.`);
  }
}
