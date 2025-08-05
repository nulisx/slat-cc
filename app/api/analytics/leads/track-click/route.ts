import { getClick } from '@/lib/analytics/clicks/actions/get-click'
import { insertClick } from '@/lib/analytics/clicks/actions/insert-click'
import { withLead } from '@/lib/api/middleware/lead'
import { selectLinks } from '@/lib/data/links/actions'
import { SlatServerError } from '@/lib/errors'
import { NextResponse } from 'next/server'

/** POST /api/analytics/leads/track-click - Track a click for a link */
export const POST = withLead(async ({ lead, target }) => {
  const [link] = await selectLinks({ where: { id: target.id } })

  if (!link) {
    throw new SlatServerError({
      code: 'not_found',
      message: 'Link not found',
    })
  }

  const existingClick = await getClick({
    ip: lead.ip,
    linkId: link.id,
  })

  if (existingClick) {
    throw new SlatServerError({
      code: 'conflict',
      message: 'Click already exists for this IP address and link',
    })
  }

  await insertClick({
    ip: lead.ip,
    linkId: link.id,
    userId: link.userId,
  })

  return NextResponse.json({ message: 'View added successfully' })
})
