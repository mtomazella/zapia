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
  return {
    situations: [
      {
        id: v4(),
        name: 'AAAAAAAAAAAAAAAAAAAAAAAAA',
        expression: '3d8+5',
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
  }
}
