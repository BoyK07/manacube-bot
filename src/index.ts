import { v4 as uuidv4 } from "uuid";

import { BotManager } from "@/bots/BotManager";
import Logger from "@/logger/Logger";
import { accounts } from "@/config/accounts";
import { HelloCommand } from "@/commands/HelloCommand";
import { SpawnEvent } from "@/events/SpawnEvent";
import { WhisperEvent } from "@/events/WhisperEvent";

const botManager = new BotManager();

Logger.debug(process.env.MINECRAFT_SRV_IP)

// Create a new bot instance
accounts.forEach((account, index) => {
  const botInstance = botManager.createBot(uuidv4(), account);

  //TODO : loop through the commands and events files and register them
  botInstance.registerEvent(new WhisperEvent());
  botInstance.registerCommand(new HelloCommand());
  botInstance.registerEvent(new SpawnEvent());

});

Logger.ready("Bot framework initialized and bot registered.");
