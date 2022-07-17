import React, { useEffect } from 'react'

import { useDieRoll } from 'hooks'
import { range } from 'lodash'

import { StyledDie } from './Die.styled'

type DiceProps = {
  expression: string
  isRolling: boolean
}

type DicePositionProps = {
  top?: number
  resultTop?: number
  left?: number
  translateX?: number
  translateY?: number
}

export const Die: React.FC<DiceProps & DicePositionProps> = ({
  expression,
  isRolling: shouldRoll,
  top = 50,
  resultTop = 30,
  left = 50,
  translateX = -50,
  translateY = -50,
}) => {
  const { result, isRolling, roll } = useDieRoll({
    expression,
  })

  useEffect(() => {
    if (shouldRoll) roll()
  }, [shouldRoll])

  return (
    <StyledDie
      className="container center"
      style={{
        top: `${top.toString()}%`,
        left: `${left.toString()}%`,
        transform: `translate(${translateX.toString()}%, ${translateY.toString()}%`,
      }}
    >
      <h1 className="center" style={{ top: `${resultTop}%` }}>
        {!isRolling && result?.toString()}
      </h1>
      <div className={`dice ${isRolling ? 'rolling' : ''}`}>
        {range(1, 20).map(i => (
          <div className={`side-${i}`} key={i} />
        ))}
      </div>
    </StyledDie>
  )
}
