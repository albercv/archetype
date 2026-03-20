import { NextRequest, NextResponse } from 'next/server'
import { CreateSessionSchema } from '@/lib/validators/session'
import { createSession } from '@/lib/repositories/session'
import { createCheckout } from '@/lib/services/payment'
import { type Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const parsed = CreateSessionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid answers', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { answers } = parsed.data
    const sessionId = await createSession(answers as Prisma.InputJsonValue)
    const checkoutUrl = await createCheckout(sessionId)

    return NextResponse.json({ sessionId, checkoutUrl }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
