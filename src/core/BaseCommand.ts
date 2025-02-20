import type { Bot } from "@/types/Bot";

export abstract class BaseCommand {
  public readonly name: string;
  public readonly description: string;
  public readonly usage: string;

  constructor(
    name: string,
    options: {
      description: string;
      usage?: string;
    }
  ) {
    this.name = name;
    this.description = options.description;
    this.usage = options.usage || name;
  }

  /**
   * Execute the command.
   * @param bot - The mineflayer bot instance.
   * @param sender - The username of the player who sent the command.
   * @param args - Array of string arguments.
   */
  abstract execute(bot: Bot, sender: string, args: string[]): Promise<void>;
}
