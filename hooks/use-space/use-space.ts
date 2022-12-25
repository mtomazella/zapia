import { useEffect, useState } from 'react'

import { isEmpty } from 'lodash'
import { TSavedData, TSpace } from 'shared/types'

const LOCAL_STORAGE_KEY = 'rpg-dice-data'
const DEFAULT_SPACE = 'Padrão'

const defaultData: TSavedData = {
  version: '0.1',
  spaces: { Padrão: { situations: [] } },
}

type TUseSpaceProps = {
  spaceName?: string
}
type TUseSpaceResponse = {
  space: TSpace | undefined
  updateOrInsert: (
    name: string | undefined,
    data: TSpace | Partial<TSpace>,
  ) => void
  deleteSpace: (name: string) => void
}

export const useSpace = ({
  spaceName = DEFAULT_SPACE,
}: TUseSpaceProps): TUseSpaceResponse => {
  const getSavedData = (): TSavedData | undefined => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    return data ? (JSON.parse(data) as TSavedData | undefined) : undefined
  }

  const saveInLocalStorage = (data: TSavedData) =>
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))

  const updateOrInsert = (
    name: string = DEFAULT_SPACE,
    space: TSpace | Partial<TSpace>,
  ) => {
    const savedData = getSavedData() as TSavedData
    saveInLocalStorage({
      ...defaultData,
      ...savedData,
      spaces: {
        ...savedData?.spaces,
        [name]: { ...(savedData?.spaces ?? {})[name], ...space },
      },
    })
    setSpace(getSpace(spaceName))
  }

  const getSpace = (name: string) => getSavedData()?.spaces[name]

  const [space, setSpace] = useState<TSpace | undefined>(undefined)

  useEffect(() => {
    if (!window || typeof window === undefined) return

    const savedData = getSavedData()
    if (!savedData || !savedData.spaces || isEmpty(savedData.spaces))
      updateOrInsert(DEFAULT_SPACE, defaultData.spaces['Padrão'])
    if (!(savedData?.spaces ?? {})[spaceName])
      updateOrInsert(DEFAULT_SPACE, (defaultData.spaces ?? {})[spaceName])

    setSpace(getSpace(spaceName) as TSpace)
  }, [spaceName])

  const deleteSpace = (name: string) => {
    const savedData = getSavedData() as TSavedData
    delete savedData?.spaces[name]
    saveInLocalStorage(savedData)
  }

  return {
    space,
    updateOrInsert,
    deleteSpace,
  }
}
