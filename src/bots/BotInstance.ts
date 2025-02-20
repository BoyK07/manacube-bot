import mineflayer from "mineflayer";

import Logger from "@/logger/Logger";
import { BaseCommand } from "@/commands/BaseCommand";
import { BaseEvent } from "@/events/BaseEvent";

import type { Bot } from "@/types/Bot";
import type { BotConfig } from "@/config/botConfig";

export class BotInstance {
  public readonly bot!: Bot;
  private commands: Map<string, BaseCommand> = new Map();
  private eventListeners: Map<string, BaseEvent[]> = new Map();

  constructor(config: BotConfig) {
    this.bot = mineflayer.createBot({
      host: config.host,
      port: config.port,
      username: config.username,
      version: config.version,
      respawn: config.respawn,

      auth: "microsoft",
      hideErrors: true,
      disableChatSigning: true,
    }) as Bot;

    // Attach a reference to this BotInstance so events can access it.
    this.bot.botInstance = this;
  }

  public registerCommand(command: BaseCommand): void {
    this.commands.set(command.name, command);
    Logger.register(`Registered command: ${command.name}`);
  }

  public registerEvent(event: BaseEvent): void {
    if (!this.eventListeners.has(event.name)) {
      this.eventListeners.set(event.name, []);
    }
    this.eventListeners.get(event.name)!.push(event);
    this.bot.on(event.name as any, (...args: any[]) => {
      event
        .run(this.bot, ...args)
        .catch((err) => Logger.error(`Error in event ${event.name}:`, err));
    });
    Logger.register(`Registered event listener: ${event.name}`);
  }

  public getCommand(commandName: string): BaseCommand | undefined {
    return this.commands.get(commandName);
  }
}
