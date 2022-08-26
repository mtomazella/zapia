import React from 'react'

import type { AppProps } from 'next/app'
import { GlobalStyle } from 'style/global'
import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
} from '@mui/material/styles'

import './../style/dice.scss'
import { CssBaseline } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <MaterialThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </MaterialThemeProvider>
    </>
  )
}

export default MyApp
