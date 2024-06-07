import BotHandler from "./Handler/BotHandler";

process.loadEnvFile(__dirname + "/.env");
const TOKEN: string | undefined = process.env.TOKEN ?? undefined;
if (!TOKEN) {
  throw new Error("Please config .env file");
}

const bot = new BotHandler("1123583992222974042", TOKEN);

bot.addCommand("name", "reply with pong", [
  {
    name: "testasd",
    description: "test",
    type: 3,
    required: false,
  },
]);

bot.start();

bot.handleCommand("ping", async (interaction) => {
  await interaction.reply("pong");
});

bot.login();
