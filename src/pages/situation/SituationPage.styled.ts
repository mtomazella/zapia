import styled from 'styled-components'

export const StyledSituationPage = styled.form`
  max-width: 800px;
  margin: auto;

  > section {
    width: 100%;

    :not(.form-buttons) {
      padding: 1rem 1rem 10rem 1rem;

      > div:first-of-type {
        margin: 2rem 0;
        transform: scale(0.5);
      }

      > div.section-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      > .MuiTextField-root {
        width: 100%;
        margin: 1rem 0;
      }

      > div.expression-field {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0;
        width: 100%;

        .MuiFormControl-root {
          width: 100%;

          &.group {
            max-width: 10rem;
          }
        }
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
      .MuiButton-outlined {
        background-color: black;
      }
    }

    > div.paste-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 1rem 0;
      width: 100%;

      .MuiButton-root {
        margin: 0.225rem 0;
        width: 80%;
      }
    }
  }
`
