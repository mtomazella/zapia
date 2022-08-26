import React, { useEffect } from 'react'

import { useDieRoll } from 'hooks'
import { range } from 'lodash'

import { StyledDie } from './Die.styled'

type DiceProps = {
  expression: string
  isRolling: boolean
  setIsRolling: (isRolling: boolean) => void
}

export const Die: React.FC<DiceProps> = ({
  expression,
  isRolling: shouldRoll,
  setIsRolling,
}) => {
  const { result, isRolling, roll } = useDieRoll({
    expression,
  })

  useEffect(() => {
    if (shouldRoll) roll()
  }, [shouldRoll])

  useEffect(() => {
    setIsRolling(isRolling)
  }, [isRolling])

  return (
    <StyledDie className="container center">
      <h1 className="center">{!isRolling && result?.toString()}</h1>
      <div className={`dice ${isRolling ? 'rolling' : ''}`}>
        {range(1, 20).map(i => (
          <div className={`side-${i}`} key={i} />
        ))}
      </div>
    </StyledDie>
  )
}
