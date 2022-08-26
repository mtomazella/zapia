import { mediaQueries } from "style/mediaQueries";
import styled from "styled-components";

export const StyledSpace = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media ${mediaQueries.desktop} {
    flex-direction: row-reverse;
  }

  div.dice-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 15rem;
  }

  div.MuiCard-root {
    margin: 1rem 0;
  }
`

export const Column = styled.section`
  width: 100%;
  padding: 2rem 1rem;

  @media ${mediaQueries.desktop} {
    width: 50%;
  }
`