import { BaseCommand } from "@/core/BaseCommand";
import Logger from "@/utils/Logger";
import type { Bot } from "@/types/Bot";
import type { BotEvents } from "mineflayer";

export class EvalCommand extends BaseCommand {
  constructor() {
    super("eval", {
      description: "Executes commands or triggers events",
      usage: "eval <type> <name> [...args]",
    });
  }

  async execute(bot: Bot, sender: string, args: string[]): Promise<void> {
    if (args.length < 2) {
      bot.chat("Usage: /eval <command|event> <name> [...args]");
      return;
    }

    const [type, name, ...restArgs] = args;

    try {
      switch (type.toLowerCase()) {
        case "command":
          throw new Error("Command execution is not supported yet");

          break;
        case "event": {
          // Get registered events from the bot instance
          const registeredEvents = Array.from(
            bot.botInstance.getEvents().keys()
          );

          // Type assertion for name to ensure it's a valid BotEvent key
          const eventName = name as keyof BotEvents;

          // Validate if the event exists in BotEvents
          if (!registeredEvents.includes(eventName)) {
            bot.chat(
              `Event '${name}' not found. Available events: ${registeredEvents.join(", ")}`
            );
            return;
          }


          // Now eventName is properly typed as keyof BotEvents
          bot.emit(eventName, ...restArgs);

          Logger.log(`Manually triggered event: ${eventName} with args:`, restArgs);
          bot.chat(`Successfully triggered event: ${eventName}`);

          break;
        }
        default:
          bot.chat(
            "Currently only event triggering is supported. Use: /eval event <eventName> [...args]"
          );

          break;
      }
    } catch (err) {
      Logger.error(`Eval error:`, err);
      bot.chat(`Error during execution: ${(err as Error).message}`);
    }
  }
}
