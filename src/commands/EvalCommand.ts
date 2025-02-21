import { BaseCommand } from "@/core/BaseCommand";
import Logger from "@/utils/Logger";
import type { Bot } from "@/types/Bot";
import type { BotEvents } from "mineflayer";

export class EvalCommand extends BaseCommand {
  constructor() {
    super("eval", {
      description: "Executes commands or triggers events",
      usage: "eval <type> <name> [...args]"
    });
  }

  async execute(bot: Bot, sender: string, args: string[]): Promise<void> {
    if (args.length < 2) {
      bot.chat("Usage: /eval <command|event> <name> [...args]");
      return;
    }

    const [type, name, ...restArgs] = args;

    try {
      if (type.toLowerCase() === 'event') {
        // Get registered events from the bot instance
        const registeredEvents = Array.from(bot.botInstance.getEvents().keys());
        
        // Validate if the event exists in BotEvents
        if (!registeredEvents.includes(name as keyof BotEvents)) {
          bot.chat(`Event '${name}' not found. Available events: ${registeredEvents.join(', ')}`);
          return;
        }

        // Type assertion to any to bypass type checking for emitted events
        // This is necessary because different events expect different argument types
        (bot.emit as any)(name, ...restArgs);
        
        bot.chat(`Successfully triggered event: ${name}`);
        Logger.log(`Manually triggered event: ${name} with args:`, restArgs);
      } else {
        bot.chat('Currently only event triggering is supported. Use: /eval event <eventName> [...args]');
      }
    } catch (err) {
      Logger.error(`Eval error:`, err);
      bot.chat(`Error during execution: ${(err as Error).message}`);
    }
  }
}