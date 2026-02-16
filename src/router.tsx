import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const BRACKET_RE = /^([^[]+)\[([^\]]+)\]$/

function stringifySearch(search: Record<string, unknown>): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'object' && !Array.isArray(value)) {
      for (const [subKey, subValue] of Object.entries(value as Record<string, unknown>)) {
        params.append(`${key}[${subKey}]`, String(subValue))
      }
    } else {
      params.append(key, String(value))
    }
  }
  const str = params.toString()
  return str ? `?${str}` : ''
}

function parseSearch(searchStr: string): Record<string, unknown> {
  const params = new URLSearchParams(searchStr)
  const result: Record<string, unknown> = {}
  for (const [key, value] of params.entries()) {
    const match = key.match(BRACKET_RE)
    if (match) {
      const [, parent, child] = match
      if (!result[parent] || typeof result[parent] !== 'object') {
        result[parent] = {}
      }
      (result[parent] as Record<string, string>)[child] = value
    } else {
      result[key] = value
    }
  }
  return result
}

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    stringifySearch,
    parseSearch,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}