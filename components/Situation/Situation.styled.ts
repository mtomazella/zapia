import { Card } from '@mui/material'
import { AppPalette } from 'style/palette'
import styled from 'styled-components'

export const Row = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
export const StyledSituation = styled(Card)`
  h3 {
    margin: 0;
    word-break: break-all;
    word-wrap: break-word;
  }

  h4 {
    margin: 0;
    color: ${AppPalette.gray[10]};
    word-break: break-all;
    word-wrap: break-word;
  }

  > .MuiCardContent-root {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    > ${Row}.invalid-expression {
      justify-content: left;
      align-items: center;
      background-color: ${AppPalette.ui.error.main};
      border: 1px solid ${AppPalette.ui.error.light};
      border-radius: 4px;
      margin: 1rem 0 0 0;
      padding: 0.2rem 0.5rem;
      color: ${AppPalette.ui.error.light};

      label {
        margin-left: 0.5rem;
      }
    }
  }
`
