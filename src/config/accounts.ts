import type { BotConfig } from "./botConfig";

function parseAccountsFromEnv(): BotConfig[] {
    const accounts: BotConfig[] = [];
    const BOT_ENV_PREFIX = 'MC_BOT_';

    // Get all environment variables that start with MC_BOT_
    Object.keys(process.env)
        .filter(key => key.startsWith(BOT_ENV_PREFIX))
        .forEach(key => {
            try {
                const account = JSON.parse(process.env[key] || '');
                accounts.push({
                    host: account.host,
                    port: account.port,
                    version: account.version,
                    username: account.username,
                    respawn: account.respawn ?? true
                });
            } catch (error) {
                console.error(`Failed to parse account from ${key}:`, error);
            }
        });

    return accounts;
}

export const accounts = parseAccountsFromEnv();
