import fs from "fs";
import path from "path";
import { BotInstance } from "@/bots/BotInstance";
import { BaseEvent } from "@/events/BaseEvent";

/**
 * Dynamically load and register all event classes found in the same folder.
 * 
 * Assumes each file in the directory exports a event class either as a default export
 * or as the first named export.
 *
 * @param botInstance The BotInstance to register events on.
 */
export async function registerEvents(botInstance: BotInstance): Promise<void> {
  // __dirname is the directory of this file (src/events)
  const eventsDir = __dirname;
  // Read all files ending with .ts in the events folder.
  const files = fs.readdirSync(eventsDir).filter((file) => {
    return file.endsWith(".ts");
  });

  for (const file of files) {
    // Skip this file to avoid importing itself.
    if (file === "registerEvents.ts" || file === "BaseEvent.ts") continue;

    const filePath = path.join(eventsDir, file);
    try {
      const eventModule = await import(filePath);
      // Prefer default export, but fallback to the first named export.
      const EventClass = eventModule.default || eventModule[Object.keys(eventModule)[0]];

      if (EventClass) {
        const eventsInstance = new EventClass();
        if (eventsInstance instanceof BaseEvent) {
          botInstance.registerEvent(eventsInstance);
        }
      }
    } catch (err) {
      console.error(`Error loading event from file ${filePath}:`, err);
    }
  }
}
