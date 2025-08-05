import { NextRequest } from 'next/server'

function parseIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip') || ''
}

export function parse(req: NextRequest) {
  const origin = req.nextUrl.origin
  const searchParams = req.nextUrl.searchParams
  const path = req.nextUrl.pathname
  const ip = parseIp(req)
  const searchParamsObj = Object.fromEntries(req.nextUrl.searchParams.entries())
  const host = req.headers.get('host') || ''

  const searchParamsString = searchParams.toString().length > 0 ? `?${searchParams}` : ''
  const fullPath = `${path}${searchParamsString}`

  const domainParts = host.split('.')

  let subdomain: string | null = null
  let domain = host

  const isLocalhost = host.includes('localhost') || host.match(/^(\d{1,3}\.){3}\d{1,3}$/)

  if (isLocalhost) {
    if (domainParts.length >= 2) {
      subdomain = domainParts[0]
      domain = domainParts.slice(1).join('.')
    }
  } else {
    if (domainParts.length > 2) {
      subdomain = domainParts.slice(0, domainParts.length - 2).join('.')
      domain = domainParts.slice(-2).join('.')
    }
  }

  const firstSegment = path.split('/')[1]

  return {
    ip,
    host,
    path,
    origin,
    subdomain,
    domain,
    fullPath,
    firstSegment,
    searchParams,
    searchParamsObj,
  }
}
