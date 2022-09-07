import { useCallback, useEffect, useState } from 'react'

import { TSituation } from 'shared/types'

type TUseSituationsProps = {
  spaceName?: string
  situationId?: string
}
type TUseSituationsResponse = {
  situations: TSituation[]
  situation?: TSituation
  updateById: (situation: TSituation) => void
}

const LOCAL_STORAGE_SITUATIONS_KEY = 'situations'

const initialSituations: TSituation[] = []

export const useSituations = ({
  spaceName,
  situationId,
}: TUseSituationsProps): TUseSituationsResponse => {
  const saveInLocalStorage = (sits: TSituation[]) =>
    localStorage.setItem(
      `${spaceName ?? ''}${LOCAL_STORAGE_SITUATIONS_KEY}`,
      JSON.stringify(sits),
    )

  const getLocalStorageValue = () => {
    const value = localStorage.getItem(
      `${spaceName ?? ''}${LOCAL_STORAGE_SITUATIONS_KEY}`,
    )
    if (!value) {
      saveInLocalStorage(initialSituations)
      return initialSituations
    }
    return JSON.parse(value)
  }

  const [situations, setSituations] = useState<TSituation[]>([])

  const setSituationsAndSave = useCallback(
    (sits: TSituation[]) => {
      setSituations(sits)
      saveInLocalStorage(sits)
    },
    [setSituations],
  )

  useEffect(() => {
    if (window && typeof window !== undefined)
      setSituations(getLocalStorageValue())
  }, [spaceName])

  const orderControls = (sit: TSituation) => {
    if (!sit.controls) sit.controls = []
    sit.controls.sort((c1, c2) => {
      if (c1.actionType === c2.actionType) return c1.name.localeCompare(c2.name)
      if (c1.actionType === 'substitute') return -1
      if (c2.actionType === 'substitute') return 1
      return 0
    })
  }

  const sortSituations = (sits: TSituation[]) => {
    sits.map(orderControls)
    return sits.sort((s1, s2) => s1.name.localeCompare(s2.name))
  }

  const getSituationIndex = (id: string) =>
    situations.findIndex(e => e.id === id)

  const getSituation = (id: string) => situations[getSituationIndex(id)]

  const updateById = useCallback(
    (situation: TSituation) => {
      const newSituations = [...situations]
      const index = newSituations.findIndex(e => e.id === situation.id)
      newSituations[index] = { ...newSituations[index], ...situation }
      setSituationsAndSave(newSituations)
    },
    [situations, setSituationsAndSave],
  )

  return {
    situations: sortSituations(situations),
    situation: situationId ? getSituation(situationId) : undefined,
    updateById,
  }
}
