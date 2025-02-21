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

  async run(bot: Bot, jsonMsg: ChatMessage): Promise<void> {
    // if (jsonMsg.translate != "sleep.players_sleeping") return;

    // const closestBed = bot.findBlocks({
    //   // matching: 26, // Minecraft bed ID
    //   matching: block => bot.isABed(block),
    //   maxDistance: 10,
    //   // count: 1,
    // });

    // Logger.debug(closestBed);

    // const bed = bot.findBlock({
    //   matching: (block) => bot.isABed(block),
    // });
    // if (bed) {
    //   try {
    //     await bot.sleep(bed);
    //     bot.chat("I'm sleeping");
    //   } catch (err: any) {
    //     bot.chat(`I can't sleep: ${err.message}`);
    //   }
    // } else {
    //   bot.chat("No nearby bed");
    // }

    const allFoundBlocks: Block[] = []
    
    const blocks = bot.findBlocks({
      matching: block => {
        if (block.type === 0) {
          return false;
        }
        allFoundBlocks.push(block);
        return bot.isABed(block);
      },
      useExtraInfo: true,
      maxDistance: 2,
    })

    fs.writeFileSync("blocks.json", JSON.stringify(allFoundBlocks, null, 2));
  }


  // if (closestBed) {
  //   try {
  //     await bot.sleep(closestBed)
  //     bot.chat("I'm sleeping now!")
  //   } catch (err: any) {
  //     bot.chat(`I can't sleep: ${err.message}`)
  //   }
  // } else {
  //   bot.chat('No nearby bed found!')
  // }
}
