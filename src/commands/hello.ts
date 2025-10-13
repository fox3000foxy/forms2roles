import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types/command';

const hello: Command = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Greets a user!')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to greet')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Custom greeting message')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const customMessage = interaction.options.getString('message');
    
    const greeting = customMessage 
      ? `${customMessage}, ${targetUser}!`
      : `Hello, ${targetUser}! 👋`;

    await interaction.reply(greeting);
  },
};

export default hello;