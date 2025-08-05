import { parse } from '@/lib/api/parse'
import { parseRequestBody } from '@/lib/api/utils'
import { exchangeDiscordToken } from '@/lib/auth/discord/actions/exchange-discord-token'
import { createRedirectUrl, handleConnect, handleLogin, handleRegister } from '@/lib/auth/discord/handlers'
import { DiscordState, initiateDiscordCallbackSchema } from '@/lib/auth/discord/schemas'
import { DISCORD_REDIRECT_URI } from '@/lib/auth/discord/utils'
import { NextRequest, NextResponse } from 'next/server'
import { FetchError, ofetch } from 'ofetch'
import { match } from 'ts-pattern'

/** POST /api/auth/discord/callback - Initiate Discord OAuth flow */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await parseRequestBody(req)

    const { state } = initiateDiscordCallbackSchema.parse(body)

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      redirect_uri: DISCORD_REDIRECT_URI,
      response_type: 'code',
      scope: 'identify',
      state,
    })

    return NextResponse.json(`https://discord.com/api/oauth2/authorize?${params.toString()}`)
  } catch (error) {
    return createRedirectUrl({ error: 'discord_missing_params' })
  }
}

/** GET /api/auth/discord/callback - Handle Discord OAuth callback */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParamsObj } = parse(req)
  try {
    const state = searchParamsObj.state as DiscordState
    const code = searchParamsObj.code

    if (!code) {
      return createRedirectUrl({ error: 'discord_missing_params' })
    }

    const { accessToken, tokenType } = await exchangeDiscordToken(code)

    const { id: discordUserId, username } = await ofetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `${tokenType} ${accessToken}` },
    })

    return match(state)
      .with('connect', async () => await handleConnect(discordUserId))
      .with('login', async () => await handleLogin(discordUserId))
      .with('register', async () => await handleRegister(discordUserId, username))
      .exhaustive()
  } catch (error) {
    const errorCode = error instanceof FetchError ? 'discord_invalid_code' : 'discord_unexpected_error'

    return createRedirectUrl({ error: errorCode })
  }
}
