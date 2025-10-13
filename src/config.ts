import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN as string,
    clientId: process.env.DISCORD_CLIENT_ID as string,
    guildId: process.env.DISCORD_GUILD_ID as string,
  },
  environment: process.env.NODE_ENV || 'development',
};

// Validate required environment variables
if (!config.discord.token) {
  throw new Error('DISCORD_TOKEN is required');
}

if (!config.discord.clientId) {
  throw new Error('DISCORD_CLIENT_ID is required');
}