import { mediaQueries } from 'style/mediaQueries'
import { AppPalette } from 'style/palette'
import styled from 'styled-components'

export const DieSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: 1px ${AppPalette.neutral.white} solid;
  border-right: 1px ${AppPalette.neutral.white} solid;
  min-height: 45.6vh;
  padding: 1rem;
  color: ${AppPalette.neutral.white};

  h1,
  h4,
  h5 {
    margin: 0;
  }

  .center {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;

    h1 {
      transform: translateY(4.7rem);
    }
  }
`

export const StyledDiceGrid = styled.main<{ itemsPerRow: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.itemsPerRow}, 1fr);

  ${DieSection}:nth-of-type(${props => props.itemsPerRow}n + 0) {
    border-right: none;
  }

  @media ${mediaQueries.mobile} {
    grid-template-columns: 1fr;

    ${DieSection} {
      border-right: none;
    }
  }
`
