import { withUser } from '@/lib/api/middleware/user'
import { parse } from '@/lib/api/parse'
import { paths } from '@/lib/constants/paths'
import { createOrder } from '@/lib/data/orders/actions'
import { SlatServerError } from '@/lib/errors'
import { stripe } from '@/lib/stripe'
import { isProduction } from '@/lib/utils'
import { DiscordWebhook, webhooks } from '@/lib/webhook'
import { isNil } from 'lodash'
import { after, NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'

/** POST /api/premium/checkout - Create a stripe checkout session for premium */
export const POST = withUser(async ({ user, req }) => {
  const { origin } = parse(req)

  if (user.premium) {
    throw new SlatServerError({
      code: 'bad_request',
      message: 'Already premium',
    })
  }

  const token = uuid()

  if (isNil(user.email)) {
    throw new SlatServerError({
      code: 'bad_request',
      message: 'Please set your email before purchasing premium',
    })
  }

  const orderId = await createOrder({
    userId: user.id,
    status: 'pending',
    token,
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user.email,
    line_items: [
      {
        price: isProduction() ? 'REDACTED' : 'REDACTED',
        quantity: 1,
      },
    ],
    success_url: `${origin}${paths.api.premium.checkout}/${token}`,
    cancel_url: `${origin}${paths.dashboard.settings.account}`,
    metadata: {
      userId: user.id.toString(),
      product: 'premium',
      orderId: orderId.toString(),
    },
  })

  if (!session.url) {
    throw new SlatServerError({
      code: 'internal_server_error',
      message: 'Failed to create checkout session',
    })
  }

  after(async () => {
    await new DiscordWebhook(webhooks.orders).send({
      title: 'Order Created',
      description: `[Checkout]: User \`${user.username}\` has created a checkout session for premium.`,
      url: DiscordWebhook.profileUrl(user.username),
      author: user,
      color: DiscordWebhook.colors.yellow,
      fields: [
        {
          name: 'Order ID',
          value: orderId.toString(),
        },
        {
          name: 'Token',
          value: token,
        },
        {
          name: 'Product',
          value: 'Premium',
        },
      ],
    })
  })

  return NextResponse.json(session.url)
})
