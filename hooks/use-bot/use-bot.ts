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
        process.env.NEXT_PUBLIC_SEND_ROLL_API_URL ??
          ('https://2rzemgne5ldr6ewxvemwzfmwhu0weliz.lambda-url.sa-east-1.on.aws/' as string),
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
