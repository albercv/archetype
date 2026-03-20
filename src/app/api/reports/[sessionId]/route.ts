import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/repositories/session'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params
  const session = await getSession(sessionId)

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  return NextResponse.json({
    status: session.status,
    report: session.status === 'COMPLETED' ? session.report : null,
  })
}
