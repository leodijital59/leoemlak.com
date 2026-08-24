import { defineConfig } from "nitro";

export default defineConfig({
  routeRules: {
    '/properties': { swr: 900 },
    '/property/**': { swr: 900 },
  },
})
