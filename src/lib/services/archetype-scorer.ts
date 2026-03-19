import { QUESTIONS } from '@/lib/data/questions'

export interface Answer {
  questionId: number
  optionId: string
}

export interface ArchetypeScore {
  archetypeId: string
  score: number
}

export function scoreArchetypes(answers: Answer[]): ArchetypeScore[] {
  const totals = new Map<string, number>()

  for (const answer of answers) {
    const question = QUESTIONS.find((q) => q.id === answer.questionId)
    if (!question) continue

    const option = question.options.find((o) => o.id === answer.optionId)
    if (!option) continue

    for (const { id, weight } of option.archetypes) {
      totals.set(id, (totals.get(id) ?? 0) + weight)
    }
  }

  return Array.from(totals.entries())
    .map(([archetypeId, score]) => ({ archetypeId, score }))
    .sort((a, b) => b.score - a.score)
}
