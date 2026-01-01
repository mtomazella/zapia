import styled from 'styled-components'

export const StyledHelpPage = styled.main`
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 4rem 1rem;
  max-width: 800px;
  margin: auto;
  text-align: justify;

  img {
    align-self: center;
  }

  button {
    width: fit-content;
  }

  h3 {
    margin-bottom: 0;

    + p {
      margin-top: 0.5rem;
    }
  }
`
