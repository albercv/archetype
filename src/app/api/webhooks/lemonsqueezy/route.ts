import { NextRequest, NextResponse } from 'next/server'
import { verifyLemonSqueezySignature } from '@/lib/utils/webhook-verify'
import { updateSession, getSession } from '@/lib/repositories/session'
import { generateReport } from '@/lib/services/report-generator'

interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string
    custom_data?: Record<string, string>
  }
  data: {
    id: string
    attributes: {
      user_email: string
    }
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-signature') ?? ''
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? ''

  if (!verifyLemonSqueezySignature(rawBody, signature, secret)) {
    return new NextResponse('Invalid signature', { status: 400 })
  }

  let payload: LemonSqueezyWebhookPayload
  try {
    payload = JSON.parse(rawBody) as LemonSqueezyWebhookPayload
  } catch {
    return new NextResponse('OK', { status: 200 })
  }

  if (payload.meta.event_name !== 'order_created') {
    return new NextResponse('OK', { status: 200 })
  }

  const sessionId = payload.meta.custom_data?.session_id
  if (!sessionId) return new NextResponse('OK', { status: 200 })

  const orderId = payload.data.id
  const email = payload.data.attributes.user_email

  // Idempotency: skip if already processed (paymentId unique constraint)
  const existing = await getSession(sessionId).catch(() => null)
  if (existing?.paymentId === orderId) {
    return new NextResponse('OK', { status: 200 })
  }

  try {
    await updateSession(sessionId, {
      status: 'PAID',
      email,
      paymentId: orderId,
      paidAt: new Date(),
    })
  } catch {
    // Unique constraint violation = already processed
    return new NextResponse('OK', { status: 200 })
  }

  try {
    await generateReport(sessionId)
  } catch {
    await updateSession(sessionId, { status: 'FAILED' }).catch(() => undefined)
  }

  return new NextResponse('OK', { status: 200 })
}
