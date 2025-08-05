'use server'

import { withUser } from '@/lib/api/middleware/user'
import { updateCoins } from '@/lib/casino/actions/update-balance'
import { paths } from '@/lib/constants/paths'
import { products } from '@/lib/constants/products'
import { insertPremiumBadge } from '@/lib/data/badges/actions'
import { SlatServerError } from '@/lib/errors'
import { DiscordWebhook, webhooks } from '@/lib/webhook'
import { revalidatePath } from 'next/cache'
import { after, NextResponse } from 'next/server'

/** POST /api/store/purchase - Purchase premium with coins */
export const POST = withUser(async ({ user }) => {
  if (user.premium) {
    throw new SlatServerError({
      code: 'bad_request',
      message: 'You already have premium',
    })
  }

  if (user.coins < products.premium.price) {
    throw new SlatServerError({
      code: 'bad_request',
      message: 'You do not have enough coins to purchase premium',
    })
  }

  await insertPremiumBadge(user.id)

  await updateCoins({
    userId: user.id,
    amount: -products.premium.price,
  })

  const newBalance = user.coins - products.premium.price

  after(async () => {
    await new DiscordWebhook(webhooks.orders).send({
      title: 'Casino Purchase',
      description: `[Casino]: User \`${user.username}\` has bought \`${products.premium.name}\` for ${products.premium.price} coins.`,
      url: DiscordWebhook.profileUrl(user.username),
      author: user,
      color: DiscordWebhook.colors.yellow,
      fields: [
        {
          name: 'Product',
          value: products.premium.name,
        },
        {
          name: 'Old Balance',
          value: user.coins.toString(),
        },
        {
          name: 'New Balance',
          value: newBalance.toString(),
        },
      ],
    })
  })

  revalidatePath(paths.dashboard.settings.account)

  return NextResponse.json({
    message: 'OK',
  })
})
