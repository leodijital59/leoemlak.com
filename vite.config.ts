import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

// Keep Vercel Blob's CJS OIDC/xdg chain out of Nitro's ESM _libs bundle.
// Bundling it leaves bare require() (xdg-app-paths) which crashes Node ESM.
const vercelBlobExternals = [
  '@vercel/blob',
  '@vercel/oidc',
  '@vercel/cli-config',
  '@vercel/cli-exec',
  'xdg-app-paths',
  'xdg-portable',
  'undici',
]

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    external: vercelBlobExternals,
  },
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src', // This is the default
      router: {
        // Specifies the directory TanStack Router uses for your routes.
        routesDirectory: 'routes', // Defaults to "routes", relative to srcDirectory
      },
    }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    viteReact(),
  ],
})
