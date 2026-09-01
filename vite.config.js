import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: mode === 'preview' || command === 'serve' ? '/' : '/Tidy-Corner/',
  plugins: [react()],
}))
