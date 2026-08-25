import { createFileRoute } from '@tanstack/react-router'
import { getSitemapPropertyEntries } from '@/lib/server/property'
import { DISTRICT_LANDINGS, SITE_URL } from '@/lib/seo'

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function urlEntry(loc: string, opts?: { lastmod?: string | Date | null; changefreq?: string; priority?: string }) {
  const lastmod = opts?.lastmod
    ? `<lastmod>${new Date(opts.lastmod).toISOString().slice(0, 10)}</lastmod>`
    : ''
  const changefreq = opts?.changefreq ? `<changefreq>${opts.changefreq}</changefreq>` : ''
  const priority = opts?.priority ? `<priority>${opts.priority}</priority>` : ''
  return `<url><loc>${xmlEscape(loc)}</loc>${lastmod}${changefreq}${priority}</url>`
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date()
        const staticPages = [
          { path: '/', priority: '1.0', changefreq: 'daily' },
          { path: '/properties', priority: '0.9', changefreq: 'hourly' },
          { path: '/about', priority: '0.6', changefreq: 'monthly' },
          { path: '/contact', priority: '0.7', changefreq: 'monthly' },
        ]

        const districtUrls = DISTRICT_LANDINGS.flatMap((district) => [
          `${SITE_URL}/properties?province=TEKIRDAG&district=${district.slug}`,
          `${SITE_URL}/properties?province=TEKIRDAG&district=${district.slug}&listingType=sold`,
          `${SITE_URL}/properties?province=TEKIRDAG&district=${district.slug}&listingType=rented`,
        ])

        let propertyEntries: { id: string; updatedAt: Date | null }[] = []
        try {
          propertyEntries = await getSitemapPropertyEntries()
        } catch {
          propertyEntries = []
        }

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map((page) => urlEntry(`${SITE_URL}${page.path}`, { lastmod: now, changefreq: page.changefreq, priority: page.priority })).join('\n')}
${districtUrls.map((loc) => urlEntry(loc, { lastmod: now, changefreq: 'daily', priority: '0.8' })).join('\n')}
${propertyEntries.map((property) => urlEntry(`${SITE_URL}/property/${property.id}`, { lastmod: property.updatedAt ?? now, changefreq: 'weekly', priority: '0.7' })).join('\n')}
</urlset>`

        return new Response(body, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        })
      },
    },
  },
})
