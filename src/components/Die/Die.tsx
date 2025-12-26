import React from 'react'

import { range } from 'lodash'

import { StyledDie } from './Die.styled'
import { DEFAULT_DIE_COLOR, DieColor } from 'shared/constants'

type DiceProps = {
  result?: string | number
  isRolling: boolean
  rollForever?: boolean
  animationDuration?: number
  color?: DieColor
}

export const Die: React.FC<DiceProps> = ({
  result,
  isRolling,
  rollForever = false,
  animationDuration = 1000,
  color = DEFAULT_DIE_COLOR,
}) => {
  return (
    <StyledDie className="container center">
      <h1 className="center">
        {!rollForever && !isRolling && result?.toString()}
      </h1>
      <div
        className={`dice ${isRolling || rollForever ? 'rolling' : ''}`}
        style={{
          animationDuration: (animationDuration / 1000).toString() + 's',
        }}
      >
        {range(1, 20).map(i => (
          <div className={`side-${i} color-${color}`} key={i} />
        ))}
      </div>
    </StyledDie>
  )
}
