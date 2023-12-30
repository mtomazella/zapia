import { useEffect, useState } from 'react'

import { CONNECTION_STORAGE_KEY } from 'shared/constants'
import { TConnectionInfo } from 'shared/types'

const defaultData: TConnectionInfo = {
  destinationKey: undefined,
  player: undefined,
  sendRolls: true,
}

export const useConnectionInfo = ({
  spaceName,
}: { spaceName?: string } = {}) => {
  const getConnectionInfo = (): TConnectionInfo => {
    const data = localStorage.getItem(CONNECTION_STORAGE_KEY)
    return data ? (JSON.parse(data) as TConnectionInfo) : defaultData
  }

  const saveInLocalStorage = (data: TConnectionInfo) =>
    localStorage.setItem(CONNECTION_STORAGE_KEY, JSON.stringify(data))

  const updateOrInsert = (info: TConnectionInfo = defaultData) => {
    const savedData = getConnectionInfo() as TConnectionInfo
    saveInLocalStorage({
      ...defaultData,
      ...savedData,
      ...info,
    })
    setConnectionInfo(getConnectionInfo())
  }

  const [connectionInfo, setConnectionInfo] = useState<TConnectionInfo>({})

  useEffect(() => {
    setConnectionInfo(getConnectionInfo())
  }, [spaceName])

  return {
    connectionInfo,
    updateOrInsert,
  }
}
