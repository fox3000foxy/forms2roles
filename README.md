# Discord TypeScript Bot Boilerplate

A modern Discord bot template built with TypeScript and Discord.js v14, featuring a modular command system and comprehensive development setup.

## 🚀 Features

- **TypeScript Support**: Full TypeScript setup with strict type checking
- **Discord.js v14**: Latest Discord.js with slash commands support
- **Modular Commands**: Easy-to-extend command handler system
- **Environment Configuration**: Secure environment variable management
- **Hot Reload**: Development server with automatic restarts
- **Example Commands**: Pre-built commands to get you started
- **Email Integration**: Nodemailer with OVH SSL support
- **Error Handling**: Comprehensive error handling and logging
- **Modern ES2022**: Latest JavaScript features and syntax

## 📦 Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   copy .env.example .env
   ```

3. **Configure your bot:**
   Edit `.env` file with your Discord bot credentials and email settings:
   ```env
   # Discord Configuration
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_GUILD_ID=your_guild_id_here # Optional, for faster command registration during development
   
   # Email Configuration (OVH)
   EMAIL_HOST=ssl0.ovh.net
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=your_email@yourdomain.com
   EMAIL_PASSWORD=your_email_password_here
   EMAIL_FROM="Your Name <your_email@yourdomain.com>"
   ```

## 🤖 Getting Discord Bot Credentials

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token to `DISCORD_TOKEN`
5. Go to "General Information" and copy Application ID to `DISCORD_CLIENT_ID`
6. For guild ID, right-click your Discord server and "Copy Server ID" (requires Developer Mode enabled)

## 🛠️ Development

```bash
# Start development server with hot reload
npm run dev

# Build the project
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
src/
├── commands/           # Slash commands
│   ├── ping.ts        # Ping command with latency
│   ├── info.ts        # Bot information
│   └── hello.ts       # Greeting command with options
├── handlers/           # Event and command handlers
│   └── commandHandler.ts
├── types/             # TypeScript type definitions
│   └── command.ts
├── utils/             # Utility functions
│   ├── sendEmail.ts   # Email functionality with OVH SSL
│   └── fetchGoogleSheet.ts
├── config.ts          # Configuration management
├── index.ts           # Main bot file
└── emailTest.ts       # Email testing utilities
```

## ➕ Adding New Commands

1. Create a new file in `src/commands/` (e.g., `mycommand.ts`)
2. Follow this template:

```typescript
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types/command';

const myCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('My awesome command!'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Hello from my command!');
  },
};

export default myCommand;
```

3. The command will be automatically loaded and registered!

## � Email Integration

The project includes a robust email utility using Nodemailer with OVH SSL configuration:

### Usage Examples

```typescript
import { sendEmail, sendSimpleEmail, sendHtmlEmail } from './utils/sendEmail';

// Simple text email
await sendSimpleEmail(
  'recipient@example.com',
  'Subject',
  'Your message here'
);

// HTML email with fallback
await sendHtmlEmail(
  'recipient@example.com',
  'HTML Subject',
  '<h1>Hello!</h1><p>HTML content</p>',
  'Plain text fallback'
);

// Advanced email with multiple recipients
await sendEmail({
  to: ['user1@example.com', 'user2@example.com'],
  cc: 'manager@example.com',
  subject: 'Advanced Email',
  html: '<p>Your HTML content</p>',
  text: 'Fallback text',
  attachments: [
    {
      filename: 'document.pdf',
      path: '/path/to/document.pdf'
    }
  ]
});
```

### Testing Email Functionality

Run the email test suite:
```bash
npm run dev-test && node dist/emailTest.js
```

## �🔧 Available Commands

- `/ping` - Shows bot latency and websocket heartbeat
- `/info` - Displays bot information and statistics
- `/hello [user] [message]` - Greets a user with optional custom message

## 🏗️ Built Commands Features

- **Slash Command Support**: Modern Discord slash commands
- **Auto-registration**: Commands are automatically registered with Discord
- **Type Safety**: Full TypeScript support for all interactions
- **Error Handling**: Graceful error handling with user feedback
- **Development & Production**: Different registration modes for faster development

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Your bot's token | ✅ |
| `DISCORD_CLIENT_ID` | Your application's client ID | ✅ |
| `DISCORD_GUILD_ID` | Guild ID for faster command registration | ❌ |
| `EMAIL_HOST` | SMTP server hostname (default: ssl0.ovh.net) | ✅ |
| `EMAIL_PORT` | SMTP server port (default: 465) | ✅ |
| `EMAIL_SECURE` | Use SSL/TLS (default: true) | ✅ |
| `EMAIL_USER` | Your email address | ✅ |
| `EMAIL_PASSWORD` | Your email password | ✅ |
| `EMAIL_FROM` | From address with display name | ✅ |
| `NODE_ENV` | Environment mode (development/production) | ❌ |

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Set environment variables on your hosting platform

3. Start the bot:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you need help:
- Check the [Discord.js Guide](https://discordjs.guide/)
- Join the [Discord.js Discord Server](https://discord.gg/djs)
- Review the [Discord Developer Documentation](https://discord.com/developers/docs)

---

Happy coding! 🎉