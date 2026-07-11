import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const page = (name) => fileURLToPath(new URL(`./${name}.html`, import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: page('index'),
        love: page('love'),
        work: page('work'),
        music: page('music'),
      },
    },
  },
})
