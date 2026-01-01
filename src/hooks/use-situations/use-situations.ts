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
  duplicateSituation: (id: string) => void
  getSituationJson: (id: string) => string
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

      const actionTypeOrder = ['substitute', 'add', 'variable']

      return (
        actionTypeOrder.indexOf(c1.actionType) -
        actionTypeOrder.indexOf(c2.actionType)
      )
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
    [situations, setSituationsAndSave]
  )

  const deleteSituation = useCallback(
    (id: string) =>
      setSituationsAndSave([...situations].filter(s => s.id !== id)),
    [situations]
  )

  const duplicateSituation = useCallback(
    (id: string) => {
      const sit = getSituation(id)
      if (!sit) return

      let copyNumber = 1
      situations.forEach(s => {
        if (s.name.includes(sit.name)) {
          const part1 = s.name.split('(')[1]
          if (!part1) return copyNumber
          const numberString = part1.split(')')[0]
          if (isNaN(Number(numberString))) return copyNumber
          const number = Number(numberString)
          if (number >= copyNumber) copyNumber = number + 1
        }
      })

      const newSit = {
        ...sit,
        id: undefined,
        name: `${sit.name} (${copyNumber})`,
      }

      updateOrInsert(newSit)
    },
    [getSituation, updateOrInsert]
  )

  const getSituationJson = useCallback(
    (id: string) => JSON.stringify(getSituation(id), null, 2),
    [getSituation]
  )

  return {
    situations: sortSituations(situations),
    situation: situationId ? getSituation(situationId) : undefined,
    updateOrInsert,
    deleteSituation,
    duplicateSituation,
    getSituationJson,
  }
}
