import { Resend } from 'resend'
import { generateReportEmail } from '@/lib/emails/report-template'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ReportData {
  dominantArchetype: { id: string; name: string; score: number; description: string }
  secondaryArchetypes: Array<{ id: string; name: string; score: number; description: string }>
  shadow: { description: string; risks: string[] }
  analysis: string
  recommendations: string[]
}

export async function sendReportEmail(
  email: string,
  report: ReportData,
): Promise<void> {
  try {
    const archetypeName = report.dominantArchetype.name
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'El Oráculo <eloraculo@archetypex.es>',
      to: email,
      subject: `Tu arquetipo dominante: ${archetypeName}`,
      html: generateReportEmail(report),
    })
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('[EMAIL] Failed to send report email:', error.message, error.stack)
    // Non-blocking: do not rethrow
  }
}
