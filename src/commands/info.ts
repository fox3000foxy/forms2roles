import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types/command';

const info: Command = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows information about the bot'),

  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client;
    
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🤖 Bot Information')
      .setThumbnail(client.user?.displayAvatarURL() || null)
      .addFields(
        { name: 'Bot Name', value: client.user?.tag || 'Unknown', inline: true },
        { name: 'Bot ID', value: client.user?.id || 'Unknown', inline: true },
        { name: 'Created', value: client.user?.createdAt.toDateString() || 'Unknown', inline: true },
        { name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
        { name: 'Users', value: client.users.cache.size.toString(), inline: true },
        { name: 'Uptime', value: formatUptime(client.uptime || 0), inline: true }
      )
      .setFooter({ text: 'Discord.js v14 TypeScript Bot' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

function formatUptime(uptime: number): string {
  const seconds = Math.floor(uptime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export default info;