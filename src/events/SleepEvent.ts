import { BaseEvent } from "@/core/BaseEvent";
import Logger from "@/utils/Logger";

import type { ChatMessage } from "prismarine-chat";

import fs from "fs";

import type { Bot } from "@/types/Bot";
import type { Block } from "prismarine-block";

export class SleepEvent extends BaseEvent {
  constructor() {
    super("actionBar");
  }

  async run(bot: Bot, jsonMsg: any): Promise<void> {
    if (jsonMsg.translate != "sleep.players_sleeping") return;
    if (bot.isSleeping) return;
    if (bot.game.dimension != "overworld") return;

    // Sleep for 0.5 seconds due to occupation of bed having a slight delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const beds = bot.findBlocks({
      matching: (block) => bot.isABed(block),
      count: Object.keys(bot.players).length + 1, // +1 for safety
      maxDistance: 4.5
    });
    
    if (beds.length === 0) {
      this.leaveSleep();
      return;
    }

    for (const _bed of beds) {
      const bed = bot.blockAt(_bed);
      if (!bed) continue;

      try {
        await bot.sleep(bed);
        if (bot.isSleeping) {
          break;
        }
      } catch (err: any) {
        Logger.error(err);
        this.leaveSleep();
      }
      break;
    }  
  }

  private leaveSleep() {
    //TODO: Bot leaves for x seconds
  }
}
