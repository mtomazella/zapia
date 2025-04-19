import styled from 'styled-components'

export const StyledConnectionPage = styled.form`
  max-width: 800px;
  margin: auto;

  > section {
    width: 100%;

    div.info {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-top: 1.5rem;
      border-top: 1px solid #ccc;

      p {
        margin: 0.5rem 0;

        &:last-of-type {
          margin-bottom: 1rem;
        }
      }

      button {
        margin: 1rem 0;

        svg {
          margin-right: 0.5rem;
        }
      }
    }

    > .select-space {
      width: 100%;
      margin: 1rem 0;
    }

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
  }
`
