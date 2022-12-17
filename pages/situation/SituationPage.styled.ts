import styled from 'styled-components'

export const StyledSituationPage = styled.form`
  max-width: 800px;
  margin: auto;

  > section {
    width: 100%;

    :not(.form-buttons) {
      padding: 1rem;

      > div:first-of-type {
        margin: 2rem 0;
        transform: scale(0.5);
      }

      > .MuiTextField-root {
        width: 100%;
        margin: 1rem 0;
      }

      > div.control-field {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0;
        width: 100%;

        .MuiTextField-root .MuiInputBase-root {
          width: 100%;
        }
      }

      > button.MuiIconButton-root {
        float: right;
      }
    }

    &.form-buttons {
      display: flex;
      flex-direction: column;
      position: fixed;
      bottom: 0;
      left: 0;

      .MuiButton-root {
        border-radius: 0;
      }
    }
  }
`
