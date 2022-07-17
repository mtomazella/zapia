import { AppPalette } from 'style/palette'
import styled from 'styled-components'

export const StyledDiceGrid = styled.main<{ itemsPerRow: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.itemsPerRow}, 1fr);
  padding: 0 4rem;
`

export const DieSection = styled.section<{ row: number; col: number }>`
  grid-row: ${props => props.row};
  grid-column: ${props => props.col};
  border: 1px solid ${AppPalette.neutral.white};
  height: 50vh;
`
