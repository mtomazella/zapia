import React from 'react'

import type { AppProps } from 'next/app'
import { GlobalStyle } from 'style/global'
import { GlobalTheme } from 'style/theme'
import { ThemeProvider } from 'styled-components'

import './../style/dice.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={GlobalTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
