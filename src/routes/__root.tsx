/// <reference types="vite/client" />
import {ErrorComponent, HeadContent, Outlet, Scripts, createRootRoute} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Aos from 'aos'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import ScrollToTop from '@/components/common/ScrollTop'

const SITE_URL = 'https://leoemlak.com'
const GLOBAL_KEYWORDS = [
  'Tekirdağ emlak',
  'Çorlu emlak',
  'Tekirdağ satılık daire',
  'Çorlu satılık daire',
  'Tekirdağ kiralık daire',
  'Çerkezköy emlak',
  'Süleymanpaşa emlak',
  'Kapaklı emlak',
  'Ergene emlak',
  'Tekirdağ gayrimenkul',
]
const SERVICE_AREAS = [
  'Çorlu',
  'Süleymanpaşa',
  'Çerkezköy',
  'Kapaklı',
  'Ergene',
  'Marmaraereğlisi',
  'Saray',
  'Malkara',
  'Muratlı',
  'Hayrabolu',
  'Şarköy',
]

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    title?: string;
    description?: string;
    keywords?: string[];
  }
}

export const Route = createRootRoute({
  head: ({ matches }) => {
    const lastMatch = matches.at(-1);
    const appName = import.meta.env.VITE_APP_NAME as string
    const title = [appName, lastMatch?.staticData.title].filter(Boolean).join(' | ');
    const description = lastMatch?.staticData.description;
    const keywords = (lastMatch?.staticData.keywords?.length ? lastMatch.staticData.keywords : GLOBAL_KEYWORDS).join(', ')
    const organizationJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: appName,
      url: SITE_URL,
      areaServed: SERVICE_AREAS.map((name) => ({
        '@type': 'City',
        name,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Tekirdağ',
        },
      })),
      knowsAbout: GLOBAL_KEYWORDS,
      availableLanguage: ['tr-TR'],
    }

    return {
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { title },
        { name: 'application-name', content: appName },
        { name: 'keywords', content: keywords },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'geo.region', content: 'TR-59' },
        { name: 'geo.placename', content: 'Tekirdağ, Çorlu' },
        { name: 'geo.position', content: '41.1599;27.8000' },
        { name: 'ICBM', content: '41.1599, 27.8000' },
        { property: 'og:locale', content: 'tr_TR' },
        { property: 'og:site_name', content: appName },
        { property: 'og:title', content: title },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        ...(description ? [{ name: "description", content: description }] : []),
        ...(description ? [{ property: 'og:description', content: description }] : []),
        ...(description ? [{ name: 'twitter:description', content: description }] : []),
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
      scripts: [{
        type: 'application/ld+json',
        children: JSON.stringify(organizationJsonLd),
      }],
    };
  },
  component: RootComponent,
  errorComponent: ({ error }) => {
    return <ErrorComponent error={error} />
  },
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
    <html lang="tr">
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
        <Analytics />
        <Scripts />
      </body>
    </html>
  )
}