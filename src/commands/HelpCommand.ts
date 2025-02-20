import { BaseCommand } from "@/core/BaseCommand";
import type { Bot } from "@/types/Bot";

export class HelpCommand extends BaseCommand {
  constructor() {
    super("help", {
      description: "Shows available commands and their usage",
      usage: "help [command]"
    });
  }

  async execute(bot: Bot, sender: string, args: string[]): Promise<void> {
    const commands = Array.from(bot.botInstance.getCommands().values());
    
    if (args.length === 0) {
      // Show all commands
      bot.whisper(sender, 'Available commands:');
      for (const cmd of commands) {
        bot.whisper(sender, `/${cmd.usage} - ${cmd.description}`);
      }
      return;
    }

    // Show detailed help for specific command
    const commandName = args[0].toLowerCase();
    const command = commands.find(cmd => cmd.name === commandName);

    if (!command) {
      bot.whisper(sender, `Command "${commandName}" not found.`);
      return;
    }

    bot.whisper(sender, `/${command.usage}`);
    bot.whisper(sender, command.description);
  }
}