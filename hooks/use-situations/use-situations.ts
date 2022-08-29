import React from 'react'

import { TSituation } from 'shared/types'
import { v4 } from 'uuid'

type TUseSituationsProps = {
  spaceName: string
}
type TUseSituationsResponse = {
  situations: TSituation[]
}

export const useSituations = ({
  spaceName,
}: TUseSituationsProps): TUseSituationsResponse => {
  const situations: TSituation[] = [
    {
      id: v4(),
      name: 'AAAAAAAAAAAAAAAAAAAAAAAAA',
      expression: '3d8+5+[FOR]+[PRE]',
      variables: {
        for: '2',
        pre: '1',
      },
      controls: [
        {
          active: true,
          name: 'Arma amaldiçoada',
          controlType: 'boolean',
          actionType: 'add',
          value: '1d6',
        },
        {
          active: false,
          name: 'Muito foda',
          controlType: 'boolean',
          actionType: 'substitute',
          value: '90d20',
        },
      ],
    },
    {
      id: v4(),
      name: 'óvwhejiovujsçvjneivuj',
      expression: '390816397',
    },
    {
      id: v4(),
      name: 'çivueviuehvieuh',
      expression: '3d8+4141414144',
    },
  ]

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

  return {
    situations: sortSituations(situations),
  }
}
