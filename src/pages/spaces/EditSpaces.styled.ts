import styled from 'styled-components'

export const StyledEditSpacesPage = styled.main`
  max-width: 800px;
  margin: auto;
  padding: 0 1rem;

  h1 {
    button {
      margin-bottom: 0.5rem;
    }
    span {
      margin-left: 1rem;
    }
  }

  .MuiTextField-root {
    margin: 1rem 0 0;
  }
`
export const ImportModal = styled.div`
  > .load {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
    width: 100%;

    > .MuiButton-root {
      margin: 0.5rem 0;
      width: 100%;
    }
  }
`
