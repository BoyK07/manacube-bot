export interface BotConfig {
    host: string;
    port: number;
    username: string;
    version: string;
    respawn: boolean;
    // Extend with additional configuration options (password, version, etc.)
  }
  
  export const defaultBotConfig: BotConfig = {
    host: "localhost",
    port: 25565,
    username: "botAccount",
    version: "1.20.1",
    respawn: true,
  };