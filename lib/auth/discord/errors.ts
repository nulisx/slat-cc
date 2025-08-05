import * as z from 'zod'

export const discordErrorCode = z.enum([
  'discord_login_not_connected',
  'discord_register_already_connected',
  'discord_missing_params',
  'discord_invalid_code',
  'discord_unauthorized',
  'discord_unexpected_error',
])

export type DiscordErrorCode = z.infer<typeof discordErrorCode>

export const errorCodeToMessage: Record<z.infer<typeof discordErrorCode>, string> = {
  discord_login_not_connected:
    'This Discord account is not connected with a slat.cc account. Please connect it or register with Discord.',
  discord_register_already_connected:
    'This Discord account is already connected with a slat.cc account. Please log in instead.',
  discord_missing_params: 'Missing parameters.',
  discord_invalid_code: 'Invalid code parameter. Please try again.',
  discord_unauthorized: 'Unauthorized access. Please try logging in again.',
  discord_unexpected_error: 'An unexpected error occurred. Please try again later.',
}
