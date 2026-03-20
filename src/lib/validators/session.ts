import { z } from 'zod'

export const AnswerSchema = z.object({
  questionId: z.number().int().min(1).max(12),
  optionId: z.enum(['a', 'b', 'c', 'd']),
})

export const CreateSessionSchema = z.object({
  answers: z.array(AnswerSchema).length(12),
})

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>
