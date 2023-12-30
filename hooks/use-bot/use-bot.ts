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
      console.log(roll)
      fetch(`http://localhost:8080/api/sendRoll`, {
        method: 'POST',
        body: JSON.stringify({ destinationKey, ...roll }),
      })
    },
    [destinationKey]
  )

  return {
    sendRoll,
  }
}
