import { AppPalette } from 'style/palette'
import styled from 'styled-components'

export const StyledDie = styled.div`
  h1 {
    width: fit-content;
    margin-top: 5rem;
    color: ${AppPalette.neutral.white};
  }

  div.dice {
    margin: auto;
  }
`
