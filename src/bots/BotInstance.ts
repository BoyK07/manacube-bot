import mineflayer from "mineflayer";
import type { BotEvents } from "mineflayer";

import Logger from "@/utils/Logger";
import { BaseCommand } from "@/core/BaseCommand";
import { BaseEvent } from "@/core/BaseEvent";

import type { Bot } from "@/types/Bot";
import type { BotConfig } from "@/config/botConfig";
import { loadCommands, loadEvents } from "@/utils/moduleLoader";

export class BotInstance {
  public readonly username!: string;
  public readonly bot!: Bot;
  private commands: Map<string, BaseCommand> = new Map();
  private eventListeners: Map<keyof BotEvents, BaseEvent[]> = new Map();

  constructor(config: BotConfig) {
    this.username = config.username;
    
    this.bot = mineflayer.createBot({
      host: config.host,
      port: config.port,
      username: config.username,
      version: config.version,
      respawn: config.respawn,

      auth: "microsoft",
      hideErrors: true,
      
      onMsaCode(data) {
        Logger.warn(`Please login to Microsoft at: ${data.verification_uri}?link=${data.user_code}`);
      },
      disableChatSigning: true,
    }) as Bot;

    // Attach a reference to this BotInstance so events can access it.
    this.bot.botInstance = this;

    Logger.log(`Bot '${config.username}' has been initialized.`);
  }

  public registerCommand(command: BaseCommand): void {
    this.commands.set(command.name, command);  
  }

  public registerEvent(event: BaseEvent): void {
    if (!this.eventListeners.has(event.name)) {
      this.eventListeners.set(event.name, []);
    }
    this.eventListeners.get(event.name)!.push(event);
    
    // Type-safe event registration
    this.bot.on(event.name, (...args: Parameters<BotEvents[typeof event.name]>) => {
      event
        .run(this.bot, ...args)
        .catch((err) => Logger.error(`Error in event ${event.name}:`, err));
    });
  }

  public getCommands(): Map<string, BaseCommand> {
    return this.commands
  }

  public getCommand(commandName: string): BaseCommand | undefined {
    return this.commands.get(commandName);
  }

  public clearCommands(): void {
    this.commands.clear();
  }

  public getEvents(): Map<keyof BotEvents, BaseEvent[]> {
    return this.eventListeners;
  }

  public getEvent(eventName: keyof BotEvents): BaseEvent[] | undefined {
    return this.eventListeners.get(eventName);
  }

  public clearEvents(): void {
    // Remove all existing event listeners
    for (const [eventName, events] of this.eventListeners.entries()) {
      events.forEach(() => {
        this.bot.removeAllListeners(eventName);
      });
    }
    this.eventListeners.clear();
  }

  public async reloadModules(): Promise<void> {
    await loadCommands(this);
    await loadEvents(this);
    Logger.log("All modules reloaded successfully");
  }
}
