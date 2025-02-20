import { BaseCommand } from "@/commands/BaseCommand";

import type { Bot } from "@/types/Bot";

export class HelloCommand extends BaseCommand {
  constructor() {
    super("hello", "Replies with a greeting");
  }

  async execute(bot: Bot, sender: string, args: string[]): Promise<void> {
    bot.chat(`Hello, ${sender}!`);
  }
}
