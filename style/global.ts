import { createGlobalStyle } from 'styled-components'

import { AppPalette } from './palette'

export const GlobalStyle = createGlobalStyle`
html{
  box-sizing: border-box;
  background: ${AppPalette.neutral.black};
  display: block;
  margin: 0 auto;
  padding: 0;
}

body{
  background-color: ${AppPalette.neutral.black};
  color: ${AppPalette.neutral.white};
  height: 100vh;
  padding: 0;
  margin: 0;
  font-size: 1rem;
  font-family: 'Noto Sans JP', sans-serif;
}
`
