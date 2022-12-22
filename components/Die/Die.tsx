import React from 'react'

import { range } from 'lodash'

import { StyledDie } from './Die.styled'

type DiceProps = {
  result?: string | number
  isRolling: boolean
  rollForever?: boolean
  animationDuration?: number
}

export const Die: React.FC<DiceProps> = ({
  result,
  isRolling,
  rollForever = false,
  animationDuration = 1000,
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
          <div className={`side-${i}`} key={i} />
        ))}
      </div>
    </StyledDie>
  )
}
