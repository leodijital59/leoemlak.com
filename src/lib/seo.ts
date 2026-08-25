export const SITE_URL = 'https://leoemlak.com'
export const SITE_PHONE = '+905529950059'
export const SITE_PHONE_DISPLAY = '+90 552 995 00 59'
export const SITE_EMAIL = 'info@leoemlak.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/web-app-manifest-512x512.png`
export const GEO = {
  region: 'TR-59',
  placename: 'Tekirdağ, Çorlu',
  latitude: 41.1599,
  longitude: 27.8000,
}

export const SERVICE_AREAS = [
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
] as const

export const GLOBAL_KEYWORDS = [
  'Tekirdağ emlak',
  'Çorlu emlak',
  'Tekirdağ satılık daire',
  'Çorlu satılık daire',
  'Tekirdağ kiralık daire',
  'Çorlu kiralık daire',
  'Çerkezköy emlak',
  'Süleymanpaşa emlak',
  'Kapaklı emlak',
  'Ergene emlak',
  'Tekirdağ gayrimenkul',
  'Çorlu gayrimenkul',
  'Leo Emlak',
]

/** District hubs used for internal linking + sitemap */
export const DISTRICT_LANDINGS = [
  { name: 'Çorlu', slug: 'CORLU', title: 'Çorlu Emlak', description: 'Çorlu satılık ve kiralık daire, villa, arsa ve işyeri ilanları.' },
  { name: 'Süleymanpaşa', slug: 'SULEYMANPASA', title: 'Süleymanpaşa Emlak', description: 'Tekirdağ merkez Süleymanpaşa satılık ve kiralık gayrimenkul ilanları.' },
  { name: 'Çerkezköy', slug: 'CERKEZKOY', title: 'Çerkezköy Emlak', description: 'Çerkezköy satılık daire, konut ve yatırım fırsatları.' },
  { name: 'Kapaklı', slug: 'KAPAKLI', title: 'Kapaklı Emlak', description: 'Kapaklı satılık ve kiralık konut ilanları.' },
  { name: 'Ergene', slug: 'ERGENE', title: 'Ergene Emlak', description: 'Ergene bölgesi satılık ve kiralık emlak ilanları.' },
  { name: 'Marmaraereğlisi', slug: 'MARMARAEREGLISI', title: 'Marmaraereğlisi Emlak', description: 'Marmaraereğlisi yazlık, konut ve arsa ilanları.' },
] as const

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return SITE_URL
  return path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildCanonical(pathname: string, search?: Record<string, string | undefined | null>) {
  const url = new URL(absoluteUrl(pathname))
  if (search) {
    for (const [key, value] of Object.entries(search)) {
      if (value) url.searchParams.set(key, value)
    }
  }
  return url.toString()
}

export function buildRealEstateAgentJsonLd(appName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#organization`,
    name: appName,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    image: DEFAULT_OG_IMAGE,
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    priceRange: '₺₺',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Çorlu',
      addressRegion: 'Tekirdağ',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    areaServed: SERVICE_AREAS.map((name) => ({
      '@type': 'City',
      name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Tekirdağ',
      },
    })),
    knowsAbout: GLOBAL_KEYWORDS,
    availableLanguage: ['tr-TR', 'Turkish'],
    sameAs: [
      'https://wa.me/905529950059',
    ],
  }
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
