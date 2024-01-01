import { useCallback } from 'react'

type UseBotParams = {
  destinationKey: string
}

type BotRoll = {
  result: string
  detailedResult?: string
  space?: string
  player?: string
  situation?: string
  controls?: { name: string }[]
}

export const useBot = ({ destinationKey }: UseBotParams) => {
  const sendRoll = useCallback(
    (roll: BotRoll) => {
      fetch(`/api/sendRoll`, {
        method: 'POST',
        body: JSON.stringify({ destinationKey, ...roll }),
      })
    },
    [destinationKey]
  )

  const sendGlobalLog = (roll: BotRoll) => {
    sendRoll({
      ...roll,
      destinationKey: process.env.NEXT_PUBLIC_BOT_GLOBAL_LOG,
    } as BotRoll)
  }

  return {
    sendRoll,
    sendGlobalLog,
  }
}
