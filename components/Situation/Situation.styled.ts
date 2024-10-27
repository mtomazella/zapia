import { Card } from '@mui/material'
import { AppPalette } from 'style/palette'
import styled from 'styled-components'

export const Row = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
export const Control = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > h3 > .MuiChip-root {
      width: fit-content;
      margin-left: 0.5rem;
    }
  }

  > p {
    margin: 0rem 0 1rem 0;
  }
`

export const Variable = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 0.5rem;

  b {
    margin-right: 0.5rem;
  }

  p {
    margin: 0.2rem;
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
  }
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
    padding-bottom: 0;

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

    > .MuiAccordion-root {
      font-size: 0.8rem;

      > .MuiAccordionSummary-root {
        padding: 0;
        color: ${AppPalette.brand.teal.main};
        min-height: fit-content;

        label {
          padding-left: 0.5rem;
        }

        > .MuiAccordionSummary-content.Mui-expanded {
          margin: 0 0 0.5rem;
        }
      }

      :first-of-type .MuiAccordionSummary-content.Mui-expanded {
        margin: 0.75rem 0;
      }

      :first-of-type .MuiAccordionDetails-root {
        padding: 0;
      }
    }
  }

  > .MuiCardActions-root {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    padding-top: 0;
    padding-right: 1rem;
  }
`
