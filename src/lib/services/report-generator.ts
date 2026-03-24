import Anthropic from '@anthropic-ai/sdk'
import { getSession, updateSession } from '@/lib/repositories/session'
import { scoreArchetypes, type Answer } from '@/lib/services/archetype-scorer'
import { QUESTIONS } from '@/lib/data/questions'
import { ARCHETYPES } from '@/lib/data/archetypes'
import { type Prisma } from '@prisma/client'

const SYSTEM_PROMPT = `Eres un experto en psicología arquetipal masculina basada en el modelo de 12 arquetipos (Jung, Moore/Gillette).

Analiza las respuestas de un hombre al test de arquetipos y genera un informe personal y directo.

Formato de salida (JSON estricto):
{
  "dominantArchetype": {
    "id": "ruler",
    "name": "El Rey",
    "score": 85,
    "description": "Párrafo de 3-4 líneas describiendo cómo se manifiesta en esta persona concreta."
  },
  "secondaryArchetypes": [
    { "id": "...", "name": "...", "score": ..., "description": "..." }
  ],
  "shadow": {
    "description": "Párrafo sobre la sombra específica de esta combinación.",
    "risks": ["Riesgo concreto 1", "Riesgo concreto 2", "Riesgo concreto 3"]
  },
  "analysis": "Lectura cruda de 4-5 líneas. Directa, sin filtros.",
  "recommendations": ["Consejo accionable 1", "Consejo accionable 2", "Consejo accionable 3"]
}

Reglas:
- Sé DIRECTO. Nada de "podrías considerar...". Habla como un mentor que dice verdades.
- La lectura es PERSONAL. Usa las respuestas concretas del usuario.
- Los consejos deben ser ACCIONABLES. Acciones concretas, no filosofía.
- El tono es masculino, directo, respetuoso pero sin algodón.
- Responde SOLO con el JSON. Sin markdown, sin explicaciones fuera del JSON.`

function buildUserMessage(answers: Answer[]): string {
  const scores = scoreArchetypes(answers)
  const maxScore = scores[0]?.score ?? 1

  const answersText = answers
    .map((answer) => {
      const question = QUESTIONS.find((q) => q.id === answer.questionId)
      if (!question) return ''
      const option = question.options.find((o) => o.id === answer.optionId)
      if (!option) return ''
      return `P${answer.questionId} (${question.scenario}): "${option.text}"`
    })
    .filter(Boolean)
    .join('\n')

  const scoresText = scores
    .filter((s) => s.score > 0)
    .map((s) => {
      const archetype = ARCHETYPES.find((a) => a.id === s.archetypeId)
      const pct = Math.round((s.score / maxScore) * 100)
      return `${archetype?.name ?? s.archetypeId}: ${pct}% (raw: ${s.score})`
    })
    .join('\n')

  return `RESPUESTAS DEL USUARIO:\n${answersText}\n\nSCORES POR ARQUETIPO (normalizado):\n${scoresText}`
}

export async function generateReport(sessionId: string): Promise<void> {
  console.log('[REPORT] Starting generation for session:', sessionId)
  const session = await getSession(sessionId)
  if (!session) throw new Error(`Session ${sessionId} not found`)
  console.log('[REPORT] Session found, status:', session.status)

  // session.answers is stored as JSON; cast via unknown is safe here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const answers = session.answers as unknown as Answer[]
  const scores = scoreArchetypes(answers)
  console.log('[REPORT] Scores calculated:', JSON.stringify(scores.slice(0, 3)))

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let response: Awaited<ReturnType<typeof client.messages.create>>
  try {
    console.log('[REPORT] Calling Anthropic API...')
    response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserMessage(answers) }],
    })
    console.log('[REPORT] Anthropic response received, length:', response.content[0]?.type === 'text' ? response.content[0].text.length : 0)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('[REPORT] Anthropic API error:', error.message, error.stack)
    throw error
  }

  const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
  let report: Prisma.InputJsonValue
  try {
    report = JSON.parse(text) as Prisma.InputJsonValue
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('[REPORT] JSON parse error:', error.message)
    throw error
  }

  console.log('[REPORT] Saving report to DB')
  await updateSession(sessionId, {
    report: report,
    reportHtml: null,
    status: 'COMPLETED',
    completedAt: new Date(),
  })
  console.log('[REPORT] Generation complete for session:', sessionId)
}
