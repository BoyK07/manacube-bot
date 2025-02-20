import { BaseCommand } from "@/core/BaseCommand";
import type { Bot } from "@/types/Bot";

export default class ReloadCommand extends BaseCommand {
  constructor() {
    super("reload", {
      description: "Reloads all commands and events",
    })
  }
  
  async execute(bot: Bot, sender: string): Promise<void> {
    await bot.botInstance.reloadModules();
    bot.whisper(sender, "All modules reloaded successfully!");
  }
}