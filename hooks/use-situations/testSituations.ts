import { TSituation } from 'shared/types'
import { v4 } from 'uuid'

export const testInitialSituations: TSituation[] = [
  {
    id: v4(),
    name: 'AAAAAAAAAAAAAAAAAAAAAAAAA',
    expression: '3d8+5+[FOR]+[PRE]',
    variables: {
      FOR: '2',
      PRE: '1',
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
