import OBR from '@owlbear-rodeo/sdk'
import { useEffect } from 'react'
import { v4 } from 'uuid'

export type RollBroadcastData = {
  id: string
  result: string
  detailedResult: string
  space?: string
  player?: string
  situation?: string
  controls?: { name: string }[]
  owlbearPlayer: {
    name: string
    color: string
  }
}

export const useOwlbearIntegration = ({
  addRoll,
}: {
  addRoll?: (data: RollBroadcastData) => void
} = {}) => {
  const sendRoll = async (
    data: Omit<RollBroadcastData, 'id' | 'owlbearPlayer'>
  ) => {
    console.log(data)
    OBR.broadcast.sendMessage(
      'zapia-roll',
      {
        id: v4(),
        ...data,
        owlbearPlayer: {
          name: await OBR.player.getName(),
        },
      } as RollBroadcastData,
      { destination: 'ALL' }
    )
  }

  useEffect(() => {
    OBR.onReady(() => {
      OBR.broadcast.onMessage('zapia-roll', (({
        data,
      }: {
        data: RollBroadcastData
      }) => {
        console.log(data)

        OBR.notification.show(
          `${data.player ?? data.owlbearPlayer.name} | ${
            data.situation ?? ''
          } ${
            data.controls?.length
              ? `(${data.controls.map(c => c.name).join(', ')})`
              : ''
          } = ${data.result}`
        )
      }) as (event: any) => void)
    })
  }, [])

  return {
    sendRoll,
  }
}
