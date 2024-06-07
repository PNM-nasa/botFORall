import {
  CacheType,
  ChatInputCommandInteraction,
  REST,
  Routes,
} from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import CommandHandler from "./CommandHandler";

interface Handles {
  name: string;
  handle: (interaction: ChatInputCommandInteraction<CacheType>) => void;
}

interface Options {
  name: string;
  description: string;
  type: number;
  required: boolean;
}

interface Commands {
  name: string;
  description: string;
  options: Options[];
}

export default class BotHandler {
  private clientId: string = "";
  private token: string = "";
  private interaction: ChatInputCommandInteraction<CacheType>;

  public commands: Commands[] = [];

  public handles: Handles[] = [];

  public addCommand(
    name: string,
    description: string,
    options: Options[],
    interactionx: (interaction: ChatInputCommandInteraction<CacheType>) => void
  ): void {
    this.commands.push({ name, description, options });
    this.handles.push({
      name: name,
      handle: interactionx,
    });
  }

  public removeCommand(name: string) {
    this.commands = this.commands.filter((command) => command.name !== name);
  }

  constructor(clientId: string, token: string) {
    this.clientId = clientId;
    this.token = token;
  }

  public async start() {
    const rest = new REST({ version: "10" }).setToken(this.token);

    (async () => {
      try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(this.clientId), {
          body: this.commands,
        });

        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    })();

    if (!this.token) {
      throw new Error("Please config .env file");
    }

    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.on("ready", () => {
      if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
      }
    });

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      this.handles.map(({ name, handle }) => {
        CommandHandler.handle(name, interaction, handle);
      });
    });

    client.login(this.token);
  }
}

export { BotHandler };
