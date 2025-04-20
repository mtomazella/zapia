import styled from 'styled-components'

export const StyledCustomization = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  justify-self: center;

  > h1 {
    display: flex;
    width: 100%;

    button {
      margin-bottom: 0.5rem;
      width: 3rem;
    }
    span {
      width: 100%;
      text-align: center;
      margin-left: -2rem;
    }
  }

  div.dice-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 15rem;
    margin: 0 0 2rem 0;
    width: 100%;

    span {
      margin: 2rem 0 0 0;
    }
  }

  > section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 0 1rem 0;
    width: 100%;
  }

  section.color {
    > div {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      max-width: 20rem;

      > button {
        width: 2rem;
        height: 2rem;
        border: none;
        outline: none;
        cursor: pointer;
        margin: 0 0.5rem 1rem 0.5rem;

        &.selected {
          border: 2px solid white;
        }
      }
    }
  }

  .form-buttons {
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 0;

    .MuiButton-root {
      border-radius: 0;
      width: 100%;
    }
    .MuiButton-outlined {
      background-color: black;
    }
  }
`
