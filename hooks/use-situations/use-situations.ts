import { useCallback } from 'react'

import { useSpace } from 'hooks/use-space'
import { isEmpty } from 'lodash'
import { TSituation } from 'shared/types'
import { v4 } from 'uuid'

type TUseSituationsProps = {
  spaceName?: string
  situationId?: string
}
type TUseSituationsResponse = {
  situations: TSituation[]
  situation?: TSituation
  updateOrInsert: (situation: TSituation | Partial<TSituation>) => void
  deleteSituation: (id: string) => void
}

export const useSituations = ({
  spaceName,
  situationId,
}: TUseSituationsProps): TUseSituationsResponse => {
  const { space, updateOrInsert: updateSpace } = useSpace({ spaceName })
  const { situations } = space ?? { situations: [] }

  const setSituationsAndSave = (sits: TSituation[]) => {
    updateSpace(spaceName, { ...space, situations: sits })
  }

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

  const updateOrInsert = useCallback(
    (situation: TSituation | Partial<TSituation>) => {
      const newSituations = [...situations]

      if (situation.id) {
        const index = newSituations.findIndex(e => e.id === situation.id)
        newSituations[index] = { ...newSituations[index], ...situation }
      } else {
        const { name, expression, variables, controls } = situation
        newSituations.push({
          id: v4(),
          name: isEmpty(name) ? 'Nova Situação' : (name as string),
          expression: isEmpty(expression) ? '1d20' : (expression as string),
          variables: variables ?? [],
          controls: controls ?? [],
        })
      }

      setSituationsAndSave(newSituations)
    },
    [situations, setSituationsAndSave],
  )

  const deleteSituation = useCallback(
    (id: string) =>
      setSituationsAndSave([...situations].filter(s => s.id !== id)),
    [situations],
  )

  return {
    situations: sortSituations(situations),
    situation: situationId ? getSituation(situationId) : undefined,
    updateOrInsert,
    deleteSituation,
  }
}
