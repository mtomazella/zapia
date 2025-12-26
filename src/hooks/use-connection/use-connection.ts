'use client'

import { useEffect, useMemo, useState } from 'react'

import { CONNECTION_STORAGE_KEY } from 'shared/constants'
import { TAllConnectionInfo, TConnectionInfo } from 'shared/types'

const defaultData: TAllConnectionInfo = {}

export const useConnectionInfo = ({
  spaceName,
}: { spaceName?: string } = {}) => {
  const [spaceConnection, setSpaceConnection] = useState<
    TConnectionInfo | undefined
  >()

  const updateSpaceConnection = () => {
    const connections = getConnections()
    const connection = connections?.[spaceName ?? '']
    setSpaceConnection(connection)
  }

  useEffect(() => {
    updateSpaceConnection()
  }, [])
  useEffect(() => {
    updateSpaceConnection()
  }, [spaceName])

  const getConnections = (): TAllConnectionInfo => {
    const data = localStorage?.getItem(CONNECTION_STORAGE_KEY) ?? ''
    const connections = data
      ? (JSON.parse(data) as TAllConnectionInfo)
      : defaultData
    return connections
  }

  const saveInLocalStorage = (data: TAllConnectionInfo) =>
    localStorage.setItem(CONNECTION_STORAGE_KEY, JSON.stringify(data))

  const updateOrInsert = (info: TAllConnectionInfo = defaultData) => {
    const savedData = getConnections()
    const newData = { ...defaultData, ...savedData }
    Object.keys(info).forEach(key => {
      newData[key] = {
        ...savedData[key],
        ...info[key],
      }
    })
    saveInLocalStorage(newData)
    updateSpaceConnection()
  }

  return {
    getConnections,
    updateOrInsert,
    spaceConnection,
  }
}
