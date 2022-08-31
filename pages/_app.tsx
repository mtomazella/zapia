import React from 'react'

import { CssBaseline } from '@mui/material'
import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
} from '@mui/material/styles'
import type { AppProps } from 'next/app'
import { GlobalStyle } from 'style/global'
import { AppPalette } from 'style/palette'

import './../style/dice.scss'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: AppPalette.brand.teal,
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
