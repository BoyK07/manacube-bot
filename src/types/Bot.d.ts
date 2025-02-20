import type { Bot } from "mineflayer";
import type { BotInstance } from "@/bots/BotInstance";

export interface Bot extends Bot {
  botInstance: BotInstance;
}