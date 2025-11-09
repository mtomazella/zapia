import { AppPalette } from 'style/palette'
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

export const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  .status-bars {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`

export const StyledBar = styled.div`
  div.view {
    display: flex;
    flex-direction: column;
    width: 100%;

      div.name {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        width: 100%;

        > span {
          grid-column: 2;
          font-size: 18px;
          font-weight: bold;
          color: white;
          text-align: center;
        }

        > button {
          justify-self: end;
        }
      }

      div.bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        padding: 8px;
        background-color: ${AppPalette.brand.teal.main};

        > span {
          font-size: 18px;
          font-weight: bold;
          color: white;

          input {
            width: fit-content;
            background-color: transparent;
            border: none;
            outline: none;
            font-size: 18px;
            font-weight: bold;
            color: white;
            text-align: right;
            width: 50%;
            
            /* Hide number input spinner controls */
            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            
            /* For Firefox */
            &[type=number] {
              -moz-appearance: textfield;
            }
          }

          > span {
            width: 50%;
            text-align: left;
            font-size: 18px;
            font-weight: bold;
            color: white;
          }
        }

        > div > button {
          margin: 0 5px 0 5px;
          background-color: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          color: white;
        }
      }

      .edit {
        display: flex;
        flex-direction: row;
        gap: 8px;
        width: 100%;
      }
    }
  }
`
