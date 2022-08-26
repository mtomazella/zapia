import { AppPalette } from 'style/palette'
import styled, { css } from 'styled-components'

const center = css`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`
export const StyledDie = styled.div`
  ${center}

  h1 {
    width: fit-content;
    color: ${AppPalette.neutral.white};
    ${center}
    transform: translateY(4.5rem);
  }

  div.dice {
    margin: auto;
    z-index: -3;
  }
`
