import fs from "fs";
import path from "path";
import { BotInstance } from "@/bots/BotInstance";
import { BaseCommand } from "@/commands/BaseCommand";

/**
 * Dynamically load and register all command classes found in the same folder.
 * 
 * Assumes each file in the directory exports a command class either as a default export
 * or as the first named export.
 *
 * @param botInstance The BotInstance to register commands on.
 */
export async function registerCommands(botInstance: BotInstance): Promise<void> {
  // __dirname is the directory of this file (src/commands)
  const commandsDir = __dirname;
  // Read all files ending with .ts in the commands folder.
  const files = fs.readdirSync(commandsDir).filter((file) => {
    return file.endsWith(".ts");
  });

  for (const file of files) {
    // Skip this file to avoid importing itself.
    if (file === "registerCommands.ts" || file === "BaseCommand.ts") continue;

    const filePath = path.join(commandsDir, file);
    try {
      const commandModule = await import(filePath);
      // Prefer default export, but fallback to the first named export.
      const CommandClass = commandModule.default || commandModule[Object.keys(commandModule)[0]];

      if (CommandClass) {
        const commandInstance = new CommandClass();
        if (commandInstance instanceof BaseCommand) {
          botInstance.registerCommand(commandInstance);
        }
      }
    } catch (err) {
      console.error(`Error loading command from file ${filePath}:`, err);
    }
  }
}
