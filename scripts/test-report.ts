/**
 * Test script: genera un informe para la última sesión en DB
 * Uso: npx tsx scripts/test-report.ts [sessionId]
 */
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

async function main() {
  const sessionId = process.argv[2]

  let targetId: string

  if (sessionId) {
    targetId = sessionId
    console.log(`Using provided session: ${targetId}`)
  } else {
    const latest = await prisma.session.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true },
    })
    if (!latest) {
      console.error('No sessions found in DB')
      process.exit(1)
    }
    targetId = latest.id
    console.log(`Using latest session: ${targetId} (status: ${latest.status})`)
  }

  // Set status to PAID so generateReport doesn't skip
  await prisma.session.update({
    where: { id: targetId },
    data: { status: 'PAID', paidAt: new Date(), email: 'test@test.com', paymentId: `test_${Date.now()}` },
  })

  // Dynamic import to pick up env vars
  const { generateReport } = await import('../src/lib/services/report-generator')
  console.log('Generating report...')
  await generateReport(targetId)
  console.log(`Done! Navigate to: http://localhost:3000/report/${targetId}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
