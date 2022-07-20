import React from 'react'

import { DiceGrid } from './components/DiceGrid'
import { StyledRoom } from './Room.styled'

export const Room: React.FC = () => {
  const dice = Array(2).fill({
    expression: '1d20',
    isRolling: false,
  })

  return (
    <StyledRoom>
      <DiceGrid dice={dice} />
    </StyledRoom>
  )
}
