import { BaseCommand } from "@/core/BaseCommand";

import type { Bot } from "@/types/Bot";

export class HelloCommand extends BaseCommand {
  constructor() {
    super("hello", {
      description: "Replies with a greeting",
      usage: "hello [message]"
    });
  }

  async execute(bot: Bot, sender: string, args: string[]): Promise<void> {
    const message = args.join(" ").trim();
    if (message) {
      bot.chat(`Hello, ${sender}! ${message}.`);
    } else {
      bot.chat(`Hello, ${sender}!`);
    }
  }
}
