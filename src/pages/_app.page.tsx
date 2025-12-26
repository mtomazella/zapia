import React from 'react'

import { CssBaseline } from '@mui/material'
import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
} from '@mui/material/styles'
import type { AppProps } from 'next/app'
import { GlobalStyle } from 'src/style/global'
import { AppPalette } from 'src/style/palette'
import NoSSR from 'react-no-ssr'

import './../src/style/dice.scss'

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
    <NoSSR>
      <SafeHydrate>
        <GlobalStyle />
        <MaterialThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </MaterialThemeProvider>
      </SafeHydrate>
    </NoSSR>
  )
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
})
