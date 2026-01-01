export default function handler(req, res) {
  const channel = global.discord.channels.cache.find(
    ({ id }) => id === '996921550190166136'
  )
  channel.send('I am alive I am the god that will destroy humanity')

  res.status(200).json({
    connection: true,
    data: channel,
  })
}
