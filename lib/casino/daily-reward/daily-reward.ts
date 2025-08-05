import { updateBalance } from '@/lib/casino/actions/update-balance'
import { dailyRewards } from '@/lib/casino/daily-reward/constants'
import type { DailyRewardPayload, DailyRewardResponse } from '@/lib/casino/daily-reward/schemas'
import { hasDailyRewardCooldownExpired } from '@/lib/casino/daily-reward/utils'
import { getBadge, insertBadge } from '@/lib/data/badges/actions'
import { BadgeId } from '@/lib/data/badges/schemas'
import { updateUser } from '@/lib/data/users/actions'
import { SlatServerError } from '@/lib/errors'
import { DiscordWebhook, webhooks } from '@/lib/webhook'
import { after } from 'next/server'

export async function handleDailyReward({ user }: DailyRewardPayload): Promise<DailyRewardResponse> {
  if (user.lastClaimedAt && !hasDailyRewardCooldownExpired(user.lastClaimedAt)) {
    throw new SlatServerError({
      code: 'rate_limit_exceeded',
      message: 'Daily reward cooldown has not expired',
    })
  }

  await updateUser(user.id, { lastClaimedAt: new Date() })

  const rewards = Array.from({ length: 3 }, () => getRandomReward())
  const payout = rewards.reduce((acc, reward) => acc + Math.max(reward, 0), 0)

  const newBalance = await updateBalance({
    payout,
    userId: user.id,
    balance: user.coins,
  })

  const existingGamblerBadge = await getBadge(BadgeId.Gambler, user.id)

  if (!existingGamblerBadge) {
    await insertBadge(user.id, { badgeId: BadgeId.Gambler })
  }

  after(async () => {
    await new DiscordWebhook(webhooks.registrations).send({
      title: DiscordWebhook.title(user),
      url: DiscordWebhook.profileUrl(user.username),
      description: `🎉 Claimed **${payout.toFixed(2)}** coins!`,
      author: user,
      color: DiscordWebhook.colors.green,
      fields: [
        { name: 'New Balance', value: newBalance.toFixed(2).toString(), inline: false },
        { name: 'Old Balance', value: user.coins.toFixed(2).toString(), inline: false },
      ],
    })
  })

  return {
    rewards,
    payout,
    balance: newBalance,
    outcome: 'win',
  }
}

const getRandomReward = () => {
  const randomNum = Math.random() * 100
  let cumulativeChance = 0

  for (let reward of dailyRewards) {
    cumulativeChance += reward.chance
    if (randomNum <= cumulativeChance) {
      return reward.value
    }
  }

  return dailyRewards[dailyRewards.length - 1].value
}
