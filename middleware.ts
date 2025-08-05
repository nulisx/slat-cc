import { parse } from '@/lib/api/parse'
import { verifySession } from '@/lib/auth/session'
import { getTurnstileStatus } from '@/lib/auth/turnstile'
import { AppPath, paths } from '@/lib/constants/paths'
import { AUTH_PATHS } from '@/lib/middleware/constants'
import SubdomainMiddleware from '@/lib/middleware/subdomain'
import { isReservedSubdomain } from '@/lib/middleware/utils/is-reserved-subdomain'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function wrapWithRedirect(path: AppPath, req: NextRequest) {
  const { origin, fullPath } = parse(req)
  const redirect = encodeURIComponent(fullPath)
  const params = new URLSearchParams({ redirect })

  return `${origin}${path}?${params.toString()}`
}

export async function middleware(req: NextRequest) {
  const { path, fullPath, subdomain, domain, firstSegment } = parse(req)

  if (isReservedSubdomain(firstSegment)) {
    const protocol = req.nextUrl.protocol
    const targetUrl = `${protocol}//${firstSegment}.${domain}${fullPath.replace(new RegExp(`^/${firstSegment}`), '') || '/'}`

    return NextResponse.redirect(targetUrl)
  }

  if (subdomain) {
    const reservedSubdomain = isReservedSubdomain(subdomain)

    if (reservedSubdomain) {
      return SubdomainMiddleware(req)
    }

    if (path.startsWith(paths.api.root)) {
      // don't rewrite API requests for tenant subdomains
      return NextResponse.next()
    }

    const url = req.nextUrl.clone()
    url.pathname = `/${subdomain}${path}`

    return NextResponse.rewrite(url)
  }

  const isAuthPath = AUTH_PATHS.some((prefix) => path.startsWith(prefix))
  const isDashboardPath = path.startsWith(paths.dashboard.root)

  const session = await verifySession()
  const authenticated = !!session

  if (isAuthPath) {
    if (authenticated) {
      return NextResponse.redirect(new URL(paths.dashboard.overview, req.url))
    }

    const turnstileStatus = await getTurnstileStatus()

    if (turnstileStatus !== 'success') {
      return NextResponse.redirect(wrapWithRedirect(paths.auth.verification, req))
    }
  }

  if (path === paths.dashboard.root) {
    return NextResponse.redirect(new URL(paths.dashboard.overview, req.url), 301)
  }

  if (isDashboardPath && !authenticated) {
    return NextResponse.redirect(wrapWithRedirect(paths.auth.login, req))
  }

  return NextResponse.next()
}

export const config = { matcher: '/((?!.*\\.).*)' }
