import OBR from '@owlbear-rodeo/sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 } from 'uuid'

export type RollBroadcastData = {
  id: string
  result: string
  detailedResult?: string[]
  space?: string
  player?: string
  situation?: string
  controls?: { name: string }[]
  dieColor?: string
  owlbearPlayer: {
    name: string
    color: string
  }
  timestamp: string
}

const historyPopoverId = 'zapia-history'
export const historyHeightClosed = 40
export const historyWidthClosed = 300
export const historyHeightOpen = 500
export const historyWidthOpen = 300

export const useOwlbearIntegration = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [rawHistory, setHistory] = useState<RollBroadcastData[]>([])

  const history: RollBroadcastData[] = useMemo(
    () =>
      rawHistory.reduce<RollBroadcastData[]>((result, roll) => {
        if (!result.find(r => r.id === roll.id)) result.push(roll)
        return result
      }, []),
    [rawHistory]
  )

  const isHistoryPopoverOpen = async () => {
    try {
      await OBR.popover.getHeight(historyPopoverId)
      return true
    } catch (error) {
      return false
    }
  }

  const initializeHistory = async () => {
    if (await isHistoryPopoverOpen()) return

    OBR.popover.open({
      id: historyPopoverId,
      url: `${(import.meta as any).env.BASE_URL}owlbear-history`,
      height: historyHeightClosed,
      width: historyWidthClosed,
      disableClickAway: true,
      anchorOrigin: {
        horizontal: 'RIGHT',
        vertical: 'BOTTOM',
      },
      anchorPosition: {
        left: (await OBR.viewport.getWidth()) - 200,
        top: await OBR.viewport.getHeight(),
      },
    })
  }

  const initializeHistoryOnReady = async () => {
    OBR.onReady(initializeHistory)
  }

  const addRoll = (message: RollBroadcastData) => {
    setHistory(history => [message].concat(history))
  }

  const sendRoll = async (
    data: Omit<RollBroadcastData, 'id' | 'owlbearPlayer' | 'timestamp'>
  ) => {
    OBR.broadcast.sendMessage(
      'zapia-roll',
      {
        id: v4(),
        ...data,
        owlbearPlayer: {
          name: await OBR.player.getName(),
          color: await OBR.player.getColor(),
        },
        timestamp: new Date().toString(),
      } as RollBroadcastData,
      { destination: 'ALL' }
    )
  }

  const onMessage = ({ data }: { data: RollBroadcastData }) => {
    initializeHistory()
    if (rawHistory.find(h => h.id === data.id)) return
    addRoll(data)
  }

  useEffect(() => {
    OBR.onReady(() => {
      OBR.broadcast.onMessage('zapia-roll', onMessage as (event: any) => void)
    })
  }, [])

  const toggleHistory = useCallback(async () => {
    const isOpen = !isHistoryOpen

    setIsHistoryOpen(isOpen)

    if (isOpen) {
      OBR.popover.setHeight(historyPopoverId, historyHeightOpen)
      OBR.popover.setWidth(historyPopoverId, historyWidthOpen)
    } else {
      OBR.popover.setHeight(historyPopoverId, historyHeightClosed)
      OBR.popover.setWidth(historyPopoverId, historyWidthClosed)
    }
  }, [isHistoryOpen])

  return {
    history,
    sendRoll,
    initializeHistory,
    initializeHistoryOnReady,
    isHistoryOpen,
    toggleHistory,
  }
}
