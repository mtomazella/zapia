require('dotenv').config()
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.js', 'js', 'ts'],
  eslint: { ignoreDuringBuilds: true },
}

const TOKEN = process.env.BOT_TOKEN
const CLIENT_ID = process.env.BOT_CLIENT_ID

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
    type: 1,
  },
  {
    name: 'debug',
    description: "Just don't",
    type: 1,
  },
  {
    name: 'refresh',
    description: 'Refresh commands',
    type: 1,
  },
  {
    name: 'key',
    description: 'Get the channel key to connect the website to it',
    type: 1,
  },
]

const rest = new REST({ version: '10' }).setToken(TOKEN)

const refresh = async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(JSON.stringify(error, null, 2))
  }
}

client.on('ready', async () => {
  refresh()
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
  }

  if (interaction.commandName === 'debug') {
    await interaction.reply(
      JSON.stringify(interaction, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ),
      2
    )
  }

  if (interaction.commandName === 'refresh') {
    await refresh()
    await interaction.reply('Refreshed!')
  }

  if (interaction.commandName === 'key') {
    await interaction.reply(
      `### ${interaction.guildId}/${interaction.channelId}`
    )
  }
})

client.login(TOKEN)

global.discord = client

module.exports = nextConfig
