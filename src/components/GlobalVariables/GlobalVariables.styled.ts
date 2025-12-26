import { AppPalette } from 'src/style/palette'
import styled from 'styled-components'

export const StyledVariables = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;

  h3 {
    margin: 0;
  }
`

export const VariableTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 1px solid ${AppPalette.gray[10]};
  }

  td {
    padding: 0.5rem;
    border-bottom: 1px solid ${AppPalette.gray[10]};
    width: 100%;

    &.key {
      width: 30%;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        background-color: ${AppPalette.gray[3]};
        color: ${AppPalette.neutral.white};
    }

    button {
        padding: 0;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        min-width: 0;
    }
  }
`