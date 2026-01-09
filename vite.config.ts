import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
// import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    // tailwindcss(),
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
  /* optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: [
          'mixed-decls',
          'legacy-js-api',
          'import',
          'slash-div',
          'global-builtin',
        ],
      },
    },
  },*/
})
