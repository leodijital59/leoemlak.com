/// <reference types="vite/client" />
import {ErrorComponent, HeadContent, Outlet, Scripts, createRootRoute} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Aos from 'aos'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import ScrollToTop from '@/components/common/ScrollTop'
import {
  DEFAULT_OG_IMAGE,
  GEO,
  GLOBAL_KEYWORDS,
  SITE_URL,
  absoluteUrl,
  buildRealEstateAgentJsonLd,
} from '@/lib/seo'

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalPath?: string;
    noIndex?: boolean;
  }
}

export const Route = createRootRoute({
  head: ({ matches }) => {
    const lastMatch = matches.at(-1);
    const appName = import.meta.env.VITE_APP_NAME as string
    const title = [appName, lastMatch?.staticData.title].filter(Boolean).join(' | ');
    const description = lastMatch?.staticData.description
      ?? 'Tekirdağ ve Çorlu emlak — satılık ve kiralık daire, villa, arsa ve işyeri ilanları. Leo Emlak ile doğru gayrimenkulü bulun.';
    const keywords = (lastMatch?.staticData.keywords?.length ? lastMatch.staticData.keywords : GLOBAL_KEYWORDS).join(', ')
    const pathname = lastMatch?.pathname ?? '/'
    const canonical = absoluteUrl(lastMatch?.staticData.canonicalPath ?? pathname)
    const robots = lastMatch?.staticData.noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

    return {
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { title },
        { name: 'application-name', content: appName },
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { name: 'author', content: appName },
        { name: 'robots', content: robots },
        { name: 'googlebot', content: robots },
        { name: 'geo.region', content: GEO.region },
        { name: 'geo.placename', content: GEO.placename },
        { name: 'geo.position', content: `${GEO.latitude};${GEO.longitude}` },
        { name: 'ICBM', content: `${GEO.latitude}, ${GEO.longitude}` },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'tr_TR' },
        { property: 'og:site_name', content: appName },
        { property: 'og:url', content: canonical },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: DEFAULT_OG_IMAGE },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: DEFAULT_OG_IMAGE },
      ],
      links: [
        { rel: 'canonical', href: canonical },
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/images/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/images/apple-touch-icon.png' },
        { rel: 'manifest', href: '/images/site.webmanifest' },
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
        { rel: 'alternate', hrefLang: 'tr', href: SITE_URL },
        { rel: 'alternate', hrefLang: 'x-default', href: SITE_URL },
      ],
      scripts: [{
        type: 'application/ld+json',
        children: JSON.stringify(buildRealEstateAgentJsonLd(appName)),
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
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap')
    }
  }, [])

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
