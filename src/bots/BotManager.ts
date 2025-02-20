import { BotInstance } from "@/bots/BotInstance";
import type { BotConfig } from "@/config/botConfig";

export class BotManager {
  private instances: Map<string, BotInstance> = new Map();

  public createBot(id: string, config: BotConfig): BotInstance {
    const instance = new BotInstance(config);
    this.instances.set(id, instance);
    return instance;
  }

  public getBot(id: string): BotInstance | undefined {
    return this.instances.get(id);
  }
}
