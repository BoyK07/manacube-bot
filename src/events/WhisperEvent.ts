import { BaseEvent } from "@/core/BaseEvent";
import Logger from "@/utils/Logger";

import type { Bot } from "@/types/Bot";

export class WhisperEvent extends BaseEvent {
  constructor() {
    super("whisper");
  }

  async run(bot: Bot, sender: string, message: string): Promise<void> {
    if (!message.startsWith("/")) return;

    const parts = message.trim().split(" ");
    const commandName = parts[0].substring(1);
    const args = parts.slice(1);
    const command = bot.botInstance.getCommand(commandName);
    
    if (command) {
      command
        .execute(bot, sender, args)
        .catch((err) =>
          Logger.error(`Error executing command "${commandName}":`, err)
        );
    }
  }
}
