import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ?? 8080,
    cors: true,
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
      utils: path.resolve(__dirname, 'src/utils/'),
      hooks: path.resolve(__dirname, 'src/hooks/'),
      components: path.resolve(__dirname, 'src/components/'),
      style: path.resolve(__dirname, 'src/style/'),
      assets: path.resolve(__dirname, 'src/assets/'),
      shared: path.resolve(__dirname, 'src/shared/'),
    },
  },
})
