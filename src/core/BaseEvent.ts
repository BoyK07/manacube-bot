import type { Bot } from "@/types/Bot";
import type { BotEvents } from "mineflayer";

export abstract class BaseEvent<K extends keyof BotEvents = keyof BotEvents> {
  public readonly name: K;

  constructor(name: K) {
    this.name = name;
  }

  /**
   * Run the event logic.
   * @param bot - The mineflayer bot instance.
   * @param args - The event-specific arguments from BotEvents[EventName].
   */
  abstract run(bot: Bot, ...args: Parameters<BotEvents[K]>): Promise<void>;
}
