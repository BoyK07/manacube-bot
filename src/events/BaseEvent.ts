import type { Bot } from "@/types/Bot";
import type { BotEvents } from "mineflayer";

export abstract class BaseEvent {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Run the event logic.
   * @param bot - The mineflayer bot instance.
   * @param args - The event-specific arguments.
   */
  abstract run(bot: Bot, ...args: any[]): Promise<void>;
}
