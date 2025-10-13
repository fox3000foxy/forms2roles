import { Client, GatewayIntentBits, Events, REST, Routes, Collection } from 'discord.js';
import { config } from './config';
import { Command } from './types/command';
import { loadCommands } from './handlers/commandHandler';
import fs from 'fs';

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Add commands collection to client
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
  }
}

client.commands = new Collection();

// Load commands
loadCommands(client);

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
  await registerCommands();
  
  // Démarrer les daemons seulement après que le client soit prêt
  const daemonsList = fs.readdirSync(__dirname + '/daemons').filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  for (const file of daemonsList) {
    import(__dirname + `/daemons/${file}`).then(({ daemon }) => {
      if (daemon && typeof daemon.execute === 'function' && typeof daemon.interval === 'number') {
        console.log(`🛠️ Starting daemon: ${daemon.name}`)
        // Initial run
        daemon.execute(client)
        // Set interval
        setInterval(() => daemon.execute(client), daemon.interval);
      }
    }).catch(error => {
      console.error(`❌ Failed to load daemon ${file}:`, error);
    });
  }
});

// Handle slash command interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);

    const errorMessage = 'There was an error while executing this command!';

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// Function to register slash commands
async function registerCommands() {
  try {
    console.log('🔄 Started refreshing application (/) commands.');

    const rest = new REST().setToken(config.discord.token);

    const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());

    if (config.discord.guildId) {
      // Register guild-specific commands (faster for development)
      await rest.put(
        Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId),
        { body: commands }
      );
      console.log(`✅ Successfully reloaded ${commands.length} guild (/) commands.`);
    } else {
      // Register global commands (takes up to 1 hour to update)
      await rest.put(
        Routes.applicationCommands(config.discord.clientId),
        { body: commands }
      );
      console.log(`✅ Successfully reloaded ${commands.length} global (/) commands.`);
    }
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('👋 Received SIGINT. Gracefully shutting down...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('👋 Received SIGTERM. Gracefully shutting down...');
  client.destroy();
  process.exit(0);
});

// Login to Discord with your client's token
client.login(config.discord.token).catch((error) => {
  console.error('❌ Failed to login:', error);
  process.exit(1);
});