import { Card } from '@mui/material'
import { AppPalette } from 'style/palette'
import styled from 'styled-components'

export const StyledSituation = styled(Card)`
  .MuiCardContent-root {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > section {
      width: fit-content;

      :last-of-type {
        padding-top: 0rem;
      }

      > h3 {
        margin: 0;
      }

      > h4 {
        margin: 0;
        color: ${AppPalette.gray[10]};
      }
    }
  }
`
