import { v4 as uuidv4 } from "uuid";

import Logger from "@/utils/Logger";
import { BotManager } from "@/bots/BotManager";
import { accounts } from "@/config/accounts";
import { loadCommands, loadEvents } from "@/utils/moduleLoader";

import type { BotConfig } from "@/config/botConfig";
import type { BotInstance } from "@/bots/BotInstance";

const botManager = new BotManager();

async function initializeBot(account: BotConfig): Promise<BotInstance> {
  const botInstance = botManager.createBot(uuidv4(), account);
  
  // Create a promise that resolves when the bot spawns or errors
  const spawnPromise = new Promise<void>((resolve, reject) => {
    botInstance.bot.once('spawn', () => resolve());
    botInstance.bot.once('error', (err) => reject(err));
    botInstance.bot.once('end', (reason) => reject(new Error(`Bot ended: ${reason}`)));
  });

  try {
    await loadCommands(botInstance).catch(err => Logger.error("Error loading commands:", err));

    await loadEvents(botInstance).catch(err => Logger.error("Error loading events:", err));

    // Wait for the bot to spawn before continuing
    await spawnPromise;
    
    return botInstance;
  } catch (err) {
    Logger.error(`Failed to initialize bot ${account.username}:`, err);
    throw err;
  }
}

async function initializeBots() {
  for (const account of accounts) {
    try {
      await initializeBot(account);
      Logger.ready(`Bot ${account.username} has fully initialized and spawned`);
      
      // if account is the last one, don't wait
      if (account === accounts[accounts.length - 1]) break;
      
      // Else add delay between bot initializations
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      Logger.error(`Failed to initialize bot ${account.username}:`, err);
    }
  }
  Logger.ready("All bots initialization process completed");
}

initializeBots().catch(err => Logger.error("Error initializing bots:", err));
