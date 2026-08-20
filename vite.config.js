import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Honor the harness-assigned PORT so parallel sessions don't fight over 5173
  server: process.env.PORT ? { port: Number(process.env.PORT) } : {},
})
