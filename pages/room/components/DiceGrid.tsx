import React, { useMemo } from 'react'

import { ceil } from 'lodash'

import { TUserDie } from '../helpers/types'

import { DieSection, StyledDiceGrid } from './DiceGrid.styled'
import { Die } from './Die'

const maxRowsInSinglePage = 3
const maxItemsPerRow = 4
const topCorrection = -10
const leftCorrection = 0
const additionalRowGap = 5

export const DiceGrid: React.FC<{ dice: TUserDie[] }> = ({ dice }) => {
  const getColIndex = (index: number, cols: number): number => {
    if (index <= cols) return index
    return getColIndex(index - cols, cols)
  }

  const getRowIndex = (
    index: number,
    cols: number,
    returnIndex = 1,
  ): number => {
    if (index <= returnIndex * cols) return returnIndex
    return getRowIndex(index, cols, returnIndex + 1)
  }

  const createExpressions = (cols: number, quantity: number) => {
    const getRowForIndex = (index: number): number =>
      getRowIndex(index + 1, cols)
    const getColForIndex = (index: number): number =>
      getColIndex(index + 1, cols)
    const top = (index: number) => {
      index = getRowForIndex(index)
      if (quantity <= maxRowsInSinglePage)
        return (100 / (ceil(quantity / cols) + 1)) * index
      return (
        (100 / maxRowsInSinglePage) * index +
        topCorrection +
        additionalRowGap * index
      )
    }
    const left = (index: number) => {
      index = getColForIndex(index)
      return (100 / (cols + 1)) * index + leftCorrection
    }
    return {
      getRowForIndex,
      getColForIndex,
      topExpression: top,
      leftExpression: left,
    }
  }

  const getItemsPerRow = (quantity: number, size = 1): number => {
    if (size ** 2 > maxItemsPerRow) return maxItemsPerRow
    if (quantity <= size ** 2) return size
    return getItemsPerRow(quantity, size + 1)
  }

  const itemsPerRow = useMemo(() => getItemsPerRow(dice.length), [dice.length])

  const { topExpression, leftExpression, getColForIndex, getRowForIndex } =
    useMemo(() => {
      return createExpressions(itemsPerRow, dice.length)
    }, [dice.length])

  return (
    <StyledDiceGrid itemsPerRow={itemsPerRow}>
      {dice.map((die, index) => (
        <>
          <DieSection
            key={index}
            row={getRowForIndex(index)}
            col={getColForIndex(index)}
          >
            <h1>Test</h1>
            <Die
              key={index}
              expression={die.expression}
              isRolling={die.isRolling}
              top={topExpression(index)}
              left={leftExpression(index)}
            />
          </DieSection>
        </>
      ))}
    </StyledDiceGrid>
  )
}
