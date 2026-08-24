import { defineConfig } from "nitro";

export default defineConfig({
  routeRules: {
    '/properties': { swr: 900 },
    '/property/**': { swr: 900 },
  },
  // Mirror vite.config: keep blob/OIDC as real Node packages (CJS require works).
  traceDeps: [
    '@vercel/blob*',
    '@vercel/oidc*',
    '@vercel/cli-config*',
    '@vercel/cli-exec*',
    'xdg-app-paths*',
    'xdg-portable*',
    'undici*',
  ],
})
