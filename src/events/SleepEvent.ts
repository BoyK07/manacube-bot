import { BaseEvent } from "@/core/BaseEvent";
import Logger from "@/utils/Logger";
import { accounts } from "@/config/accounts";
import { BotManager } from "@/bots/BotManager";
import { v4 as uuidv4 } from "uuid";

import type { Bot } from "@/types/Bot";

const botManager = new BotManager();

export class SleepEvent extends BaseEvent {
    constructor() {
        super("actionBar");
    }

    async run(bot: Bot, jsonMsg: any): Promise<void> {
        // Start with a small delay to allow the bot to update its state
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            // Validate the incoming message and bot state
            if (!jsonMsg || jsonMsg.translate !== "sleep.players_sleeping") return;
            if (!bot || !bot.game || bot.game.dimension !== "overworld") return;

            if (!Array.isArray(jsonMsg.with) || jsonMsg.with.length < 2) {
                Logger.error("Invalid 'with' array in jsonMsg: " + JSON.stringify(jsonMsg.with));
                return;
            }

            const currentSleeping = parseInt(jsonMsg.with[0]);
            const totalRequired = parseInt(jsonMsg.with[1]);

            if (isNaN(currentSleeping) || isNaN(totalRequired)) {
                Logger.error(
                    "Invalid sleep counts: currentSleeping=" +
                    jsonMsg.with[0] +
                    ", totalRequired=" +
                    jsonMsg.with[1]
                );
                return;
            }

            // Check if there are other players sleeping; if not, then return
            if (currentSleeping === 0) {
                return;
            }

            // If the bot is the only one sleeping, cancel the sleep
            if (currentSleeping === 1 && bot.isSleeping) {
                await bot.wake();
                return;
            }

            // If the bot is already sleeping, then return
            if (bot.isSleeping) {
                return;
            }

            // Find beds nearby
            const playerCount = bot.players ? Object.keys(bot.players).length : 1;
            const beds = bot.findBlocks({
                matching: (block) => bot.isABed(block),
                count: playerCount + 1, // +1 for safety
                maxDistance: 3
            });

            // If no beds are found, check if the bot is the last one needed
            if (!beds || beds.length === 0) {
                if (totalRequired - currentSleeping === 1) {
                    // If bot is the last one needed, trigger skipNightByLeaving
                    await this.skipNightByLeaving(bot);
                }
                return;
            }

            // Attempt to sleep in one of the found beds
            for (const bedPos of beds) {
                const bed = bot.blockAt(bedPos);
                if (!bed) continue;

                try {
                    await bot.sleep(bed);
                    // Add a delay to allow bot.isSleeping to update
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // If sleep is successful, break out of the loop
                    if (bot.isSleeping) break;
                } catch (err: any) {
                    Logger.log(`${bot.username} is unable to sleep: ${err}`);
                }
            }

            // After trying all beds, if still not sleeping and bot is the last required, trigger skipNightByLeaving
            if (!bot.isSleeping && totalRequired - currentSleeping === 1) {
                await this.skipNightByLeaving(bot);
            }
        } catch (err: any) {
            Logger.error(`${bot.username} has an unexpected error in sleep run: ${err}`);
        }
    }

    private async skipNightByLeaving(bot: Bot) {
        // Get config before quitting
        const config = accounts.find((account) => account.username === bot.username);
        if (!config) {
            Logger.error(`No configuration found for bot: ${bot.username}`);
            return;
        }
    
        // Store the username for later use
        const username = bot.username;
    
        // Quit the current bot instance
        bot.end("No beds found, leaving for the night. Reconnecting in 15 seconds");
        
        // 15-second delay to skip the night
        await new Promise((resolve) => setTimeout(resolve, 15000));
    
        try {
            // Create a new bot instance with the same config
            const newBotInstance = botManager.createBot(uuidv4(), config);
            
            // Initialize the new bot instance (it will automatically load commands and events)
            await newBotInstance.reloadModules();
            
            Logger.log(`${username} has reconnected after skipping the night`);
        } catch (err) {
            Logger.error(`Failed to reconnect ${username}: ${err}`);
        }
    }
}
