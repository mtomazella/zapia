import React, { useMemo } from 'react'

import { TUserDie } from '../helpers/types'

import { DieSection, StyledDiceGrid } from './DiceGrid.styled'
import { Die } from './Die'

const maxItemsPerRow = 3

export const DiceGrid: React.FC<{ dice: TUserDie[] }> = ({ dice }) => {
  const getItemsPerRow = (quantity: number, size = 1): number => {
    if (size ** 2 > maxItemsPerRow) return maxItemsPerRow
    if (quantity <= size ** 2) return size
    return getItemsPerRow(quantity, size + 1)
  }

  const itemsPerRow = useMemo(() => getItemsPerRow(dice.length), [dice.length])

  return (
    <StyledDiceGrid itemsPerRow={itemsPerRow}>
      {dice.map((die, index) => (
        <>
          <DieSection key={index}>
            <h1>{die.sheetName}</h1>
            <div>
              <Die expression={die.expression} isRolling={die.isRolling} />
            </div>
            <div>
              <h4>{die.expertiseName}</h4>
              <h5>{die.expression}</h5>
            </div>
          </DieSection>
        </>
      ))}
    </StyledDiceGrid>
  )
}
