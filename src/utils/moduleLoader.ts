import fs from "fs";
import path from "path";

import { BotInstance } from "@/bots/BotInstance";
import { BaseCommand } from "@/core/BaseCommand";
import { BaseEvent } from "@/core/BaseEvent";
import Logger from "@/utils/Logger";

type ModuleType = "command" | "event";
type BaseClass = BaseCommand | BaseEvent;

async function loadModule<T extends BaseClass>(
  filePath: string,
  type: ModuleType
): Promise<T | null> {
  try {
    // Clear module cache for reloading support
    delete require.cache[require.resolve(filePath)];
    
    const module = await import(filePath);
    const ModuleClass = module.default || module[Object.keys(module)[0]];

    if (!ModuleClass) {
      Logger.warn(`No valid export found in ${filePath}`);
      return null;
    }

    const instance = new ModuleClass() as T;
    const baseClass = type === "command" ? BaseCommand : BaseEvent;
    
    if (!(instance instanceof baseClass)) {
      Logger.warn(`Module in ${filePath} does not extend ${baseClass.name}`);
      return null;
    }

    return instance;
  } catch (err) {
    Logger.error(`Error loading ${type} from ${filePath}:`, err);
    return null;
  }
}

async function loadModules<T extends BaseClass>(
  dirPath: string,
  type: ModuleType,
  excludeFiles: string[] = []
): Promise<T[]> {
  const files = fs.readdirSync(dirPath).filter(file => 
    file.endsWith(".ts") && !excludeFiles.includes(file)
  );

  const modules: T[] = [];
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const module = await loadModule<T>(filePath, type);
    if (module) modules.push(module);
  }

  return modules;
}

export async function loadCommands(botInstance: BotInstance): Promise<void> {
  const commandsDir = path.join(__dirname, "..", "commands");
  const commands = await loadModules<BaseCommand>(
    commandsDir,
    "command"
  );

  // Clear existing commands for reload support
  botInstance.clearCommands();
  
  for (const command of commands) {
    botInstance.registerCommand(command);
  }

  Logger.log(`Loaded ${commands.length} commands`);
}

export async function loadEvents(botInstance: BotInstance): Promise<void> {
  const eventsDir = path.join(__dirname, "..", "events");
  const events = await loadModules<BaseEvent>(
    eventsDir,
    "event"
  );

  // Clear existing events for reload support
  botInstance.clearEvents();
  
  for (const event of events) {
    botInstance.registerEvent(event);
  }

  Logger.log(`Loaded ${events.length} events`);
}