// Shared TypeScript types — ampliado en Tarea 2

export type ArchetypeId =
  | 'ruler'
  | 'warrior'
  | 'magician'
  | 'lover'
  | 'explorer'
  | 'sage'
  | 'creator'
  | 'hero'
  | 'outlaw'
  | 'jester'
  | 'caregiver'
  | 'innocent'

export type SessionStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'FAILED'

export type Answer = {
  questionId: number
  optionId: 'a' | 'b' | 'c' | 'd'
}

export type ArchetypeScore = {
  archetypeId: ArchetypeId
  score: number
}

export type ReportArchetype = {
  id: ArchetypeId
  name: string
  score: number
  description: string
}

export type Report = {
  dominantArchetype: ReportArchetype
  secondaryArchetypes: ReportArchetype[]
  shadow: {
    description: string
    risks: string[]
  }
  analysis: string
  recommendations: string[]
}
