import { DiscordWebhook, webhooks, type SendPayload } from '@/lib/webhook'
import { formatLargeNumber } from '@/lib/utils'
import type { Author } from '@/lib/data/users/schemas'

type CasinoGamePayload = {
  author: Author
  betAmount: number
  payout: number
  oldBalance: number
  newBalance: number
}

export async function notifyCasinoGameWebhook({
  title,
  oldBalance,
  newBalance,
  betAmount,
  payout,
  author,
  color,
  fields,
}: SendPayload & CasinoGamePayload): Promise<void> {
  await new DiscordWebhook(webhooks.orders).send({
    title,
    description:
      payout > 0
        ? `**${author.username}** just won **${payout.toFixed(2)}** coins!`
        : `**${author.username}** just lost **${Math.abs(payout).toFixed(2)}** coins.`,
    url: DiscordWebhook.profileUrl(author.username),
    author,
    ...(payout > 0 && { color }),
    fields: [
      {
        name: 'Bet Amount',
        value: betAmount.toFixed(2),
        inline: false,
      },
      {
        name: 'Balance',
        value: `Old: **${formatLargeNumber(oldBalance)}**\n` + `New: **${formatLargeNumber(newBalance)}**\n`,
        inline: false,
      },
      ...(fields || []),
    ],
  })
}
