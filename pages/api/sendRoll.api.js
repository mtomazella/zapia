import { Client, GatewayIntentBits } from 'discord.js'

const TOKEN = process.env.BOT_TOKEN

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(404).json({ error: 'Method not supported' })
    return
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds] })
  client.login(TOKEN)

  await new Promise(resolve => {
    client.on('ready', resolve)
  })

  const {
    destinationKey,
    result,
    player,
    space,
    situation,
    detailedResult,
    controls = [],
  } = JSON.parse(req.body ?? '{}') ?? {}

  if (!destinationKey || !result) {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }

  const [guildId, channelId] = destinationKey.split('/')

  const channel = client.channels.cache.find(
    ({ id, guildId: gId }) => id === channelId && guildId === gId
  )

  const message = [undefined, []]

  if (player) message[0] = `> **${player}**`
  if (space) message[1][0] = space
  if (situation) message[1][1] = situation
  if (message[1].length === 0) message[1] = undefined
  else {
    message[1] = `${message[1].filter(e => !!e).join(' - ')}`
    if (controls.length > 0)
      message[1] += ` (${controls.map(({ name }) => name).join(', ')})`
    message[1] = `> **${message[1]}**`
  }
  if (detailedResult) message[2] = `> *${detailedResult}*`
  message[3] = `> ### ${result}`

  channel.send(message.filter(e => e !== undefined).join('\n'))

  res.status(200).end()
}
