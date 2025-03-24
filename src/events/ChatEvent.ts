import { BaseEvent } from "@/core/BaseEvent";
import Logger from "@/utils/Logger";

import type { Bot } from "@/types/Bot";

export class ChatEvent extends BaseEvent {
    constructor() {
        super("chat");
    }

    async run(bot: Bot, sender: string, message: string): Promise<void> {
        Logger.log(`[Chat] ${sender}: ${message}`);
    }
}
