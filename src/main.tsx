import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { GlobalStyle } from 'style/global'
import { AppPalette } from 'style/palette'
import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
} from '@mui/material'
import { CssBaseline } from '@mui/material'

import 'style/dice.scss'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: AppPalette.brand.teal,
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <MaterialThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MaterialThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
