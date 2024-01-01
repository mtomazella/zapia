import { MenuItem } from '@mui/material'
import { mediaQueries } from 'style/mediaQueries'
import styled from 'styled-components'

const diceBoxHeight = '15rem'

export const EditSpaceMenuItem = styled(MenuItem)`
  border-top: 1px black solid;
`

export const Column = styled.section`
  width: 100%;
  padding: 0 1rem;

  @media ${mediaQueries.desktop} {
    width: 50%;
    padding: 2rem 1rem;
  }
`

export const StyledSpace = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media ${mediaQueries.desktop} {
    flex-direction: row-reverse;
  }

  div.space-options {
    .MuiMenuItem-root {
      background-color: red;
    }

    .MuiButton-outlined {
      float: right;
      height: 40px;
      margin-left: 0.5rem;
      padding-left: 0.75rem;

      svg {
        margin-right: 0.25rem;
      }
    }

    .MuiCheckbox-root {
      float: right;
    }
  }

  div.dice-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: ${diceBoxHeight};
    margin: 0 0 2rem 0;
    width: 100%;

    span {
      margin: 2rem 0 0 0;
    }
  }

  div.search-bar {
    padding: 1rem;
    margin: 0 !important;
  }

  div.MuiCard-root {
    margin: 1rem 0;
  }

  .expression-builder > div.MuiCardActions-root {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding-right: 1.9rem;
    width: 100%;

    > div:last-of-type {
      padding-top: 5px;
    }
  }
`
