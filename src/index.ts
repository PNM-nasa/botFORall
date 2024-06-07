import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];
process.env.TOKEN
const CLIENT_ID = "1248467019502977135";
process.loadEnvFile(".env")

const TOKEN:string =process.env.TOKEN?? "undefined the deo nao duoc"
console.log(process.env.TOKEN)
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async ()=> {
  try {
      console.log('Started refreshing application (/) commands.');
    
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    
      console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
      console.error(error);
      }
})();
 

import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// client.on('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });

client.on('ready', () => {
  console.log(`Logged in as ${client.toJSON}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(TOKEN);