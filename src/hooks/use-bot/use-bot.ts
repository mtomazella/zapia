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
      fetch(
        'https://2rzemgne5ldr6ewxvemwzfmwhu0weliz.lambda-url.sa-east-1.on.aws/',
        {
          method: 'POST',
          body: JSON.stringify({ destinationKey, ...roll }),
        }
      )
    },
    [destinationKey]
  )

  return {
    sendRoll,
  }
}
