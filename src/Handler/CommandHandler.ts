import { CacheType, ChatInputCommandInteraction, Interaction } from "discord.js";

export default class CommandHandler {
    constructor() { }
    
    public static async handle(name: string, register : ChatInputCommandInteraction<CacheType>, handle: (interaction : ChatInputCommandInteraction<CacheType>) => void) {
        if (register.commandName === name) {
            handle(register);
        }
    }
}

