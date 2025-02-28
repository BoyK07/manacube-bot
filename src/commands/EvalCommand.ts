import { BaseCommand } from "@/core/BaseCommand";
import Logger from "@/utils/Logger";
import type { Bot } from "@/types/Bot";
import type { BotEvents } from "mineflayer";
import { Vec3 } from "vec3";

export class EvalCommand extends BaseCommand {
  constructor() {
    super("eval", {
      description: "Executes commands, triggers events, or runs arbitrary code",
      usage: "eval <type> <name|code> [...args]",
    });
  }

  async execute(bot: Bot, sender: string, args: string[]): Promise<void> {
    if (args.length < 2) {
      bot.chat("Usage: /eval <command|event|code> <name|code> [...args]");
      return;
    }

    const [type, ...restArgs] = args;

    try {
      switch (type.toLowerCase()) {
        case "command":
          throw new Error("Command execution is not supported yet");

          break;
        case "event": {
          const [name, ...eventArgs] = restArgs;
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
          (bot.emit as any)(eventName, ...eventArgs);

          Logger.log(
            `Manually triggered event: ${eventName} with args:`,
            eventArgs
          );
          bot.chat(`Successfully triggered event: ${eventName}`);

          break;
        }
        case "code": {
          const codeToExecute = restArgs.join(" ");
          Logger.log(`Executing code: ${codeToExecute}`);

          // Create a function that has access to bot and other variables
          const executionFunction = new Function(
            "bot",
            "botInstance",
            "sender",
            "Logger",
            "Vec3",
            `
              try {
                ${codeToExecute}
              } catch(e) {
                Logger.error("Code execution error:", e);
              }
            `
          );

          // Execute the function with necessary context
          const result = executionFunction(
            bot,
            bot.botInstance,
            sender,
            Logger,
            Vec3
          );

          // Handle the result
          if (result && typeof result === "object" && "error" in result) {
            bot.chat(`Code execution error: ${result.error}`);
          } else {
            const responseStr =
              typeof result === "object"
                ? JSON.stringify(result, null, 2)
                : String(result);

            bot.chat(`Result: ${responseStr}`);
            Logger.log(`Code eval result:`, result);
          }

          break;
        }
        default:
          bot.chat(
            "Supported eval types: event, code. Use: /eval <type> [args]"
          );

          break;
      }
    } catch (err) {
      Logger.error(`Eval error:`, err);
      bot.chat(`Error during execution: ${(err as Error).message}`);
    }
  }
}
