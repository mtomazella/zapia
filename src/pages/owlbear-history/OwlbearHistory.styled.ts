import {
  historyHeightClosed,
  historyHeightOpen,
  historyWidthClosed,
  historyWidthOpen,
} from 'hooks/use-owlbear-integration'
import { AppPalette } from 'style/palette'
import styled from 'styled-components'

export const StyledOwlbearHistoryOpen = styled.main`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  scrollbar-color: white transparent;
  scrollbar-width: thin;

  > section {
    width: 100%;
    height: 100%;
    max-width: ${historyWidthOpen}px;
    margin: auto;
    padding: 1rem 1rem 0 1rem;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;

    > div.roll {
      width: 100%;
      padding: 0.5rem 1rem 1rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;

      > * {
        margin: 0;
      }

      > h2 {
        font-size: 1.2rem;
      }

      h3 {
        margin: 0.5rem 0;
        color: ${AppPalette.gray[12]};
        font-size: 1rem;
      }

      > div.player {
        display: flex;
        flex-direction: row;

        > h3 {
          margin: 0.5rem 0 0 0;
        }

        > .player {
          margin-right: 0.3rem;
        }
      }

      div.dice {
        transform: scale(0.5);
      }

      div.container.center {
        margin-top: -2rem;
      }
    }

    > .MuiButtonBase-root {
      position: fixed;
      bottom: 3px;
      background-color: ${AppPalette.neutral.black};
      width: ${historyWidthOpen - 32}px;
    }
  }
`

export const StyledOwlbearHistoryClosed = styled.main`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 1rem;
  border-radius: 0;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .MuiButtonBase-root {
    width: 100%;
  }
`
