type RecursivePathObject = {
  [key: string]: string | RecursivePathObject
}

export const paths = {
  root: '/',
  auth: {
    login: '/login',
    register: '/register',
    resetPassword: '/reset-password',
    verification: '/verification',
  },
  leaderboard: '/leaderboard',
  termsOfService: '/terms-of-service',
  privacyPolicy: '/privacy-policy',
  docs: {
    root: '/docs',
    credits: '/docs/team',
  },
  api: {
    root: '/api',
    upload: '/api/upload',
    audioProxy: '/api/proxy/audio',
    auth: {
      login: '/api/auth/login',
      challenge: {
        status: '/api/auth/challenge/status',
        verify: '/api/auth/challenge/verify',
      },
      register: '/api/auth/register',
      discord: {
        callback: '/api/auth/discord/callback',
      },
    },
    integrations: {
      discordPresence: '/api/integrations/discord-presence',
      discordInvite: '/api/integrations/discord-invite',
      steam: '/api/integrations/steam',
      github: '/api/integrations/github',
      roblox: '/api/integrations/roblox',
      tracks: '/api/integrations/tracks',
    },
    premium: {
      checkout: '/api/premium/checkout',
      purchase: '/api/premium/purchase',
    },
  },
  casino: {
    root: '/casino',
  },
  dashboard: {
    root: '/dashboard',
    overview: '/dashboard/overview',
    store: '/dashboard/store',
    customize: {
      appearance: '/dashboard/customize/appearance',
      links: '/dashboard/customize/links',
      badges: '/dashboard/customize/badges',
      widgets: '/dashboard/customize/widgets',
      tracks: '/dashboard/customize/tracks',
    },
    templates: {
      discover: '/dashboard/templates/discover',
      favorited: '/dashboard/templates/favorited',
      owned: '/dashboard/templates/owned',
    },
    settings: {
      account: '/dashboard/settings/account',
      metadata: '/dashboard/settings/metadata',
      comments: '/dashboard/settings/comments',
    },
    staff: {
      manage: '/dashboard/staff/manage',
      users: '/dashboard/staff/users',
      articles: '/dashboard/staff/articles',
    },
  },
} as const satisfies Readonly<RecursivePathObject>

type PathValue<T> = T extends string ? T : T extends Record<string, any> ? PathValue<T[keyof T]> : never

export type AppPath = PathValue<typeof paths>

function flatten(obj: Record<string, any>): string[] {
  return Object.values(obj).flatMap((v) => (typeof v === 'string' ? [v] : flatten(v)))
}

export const allPaths = flatten(paths)
