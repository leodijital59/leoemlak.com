/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Aos from 'aos'
import { useEffect } from 'react'
import ScrollToTop from '@/components/common/ScrollTop'

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    title?: string;
  }
}

export const Route = createRootRoute({
  head: ({ matches }) => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: [import.meta.env.VITE_APP_NAME, matches.at(-1)?.staticData.title].filter(Boolean).join(' | ') }
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Poppins:wght@300;400;500;600;700;800&display=swap',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
      <RootDocument>
        <Outlet />
      </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  // Bootstrap initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap')
    }
  }, [])

  // AOS initialization
  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    })
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body
        className="body"
        cz-shortcut-listen="false"
        style={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          '--body-font-family': 'DM Sans, sans-serif',
          '--title-font-family': 'Poppins, sans-serif',
        }}
      >
        {children}
        <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
        />
        <ScrollToTop />
        <Scripts />
      </body>
    </html>
  )
}