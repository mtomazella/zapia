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
import dynamic from 'next/dynamic'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: AppPalette.brand.teal,
  },
})
function SafeHydrate({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SafeHydrate>
      <GlobalStyle />
      <MaterialThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </MaterialThemeProvider>
    </SafeHydrate>
  )
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
})
