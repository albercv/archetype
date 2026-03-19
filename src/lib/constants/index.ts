// App-wide constants
export const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'

export const QUIZ_QUESTION_COUNT = 12

export const REPORT_POLL_INTERVAL_MS = 2000

export const ARCHETYPE_IDS = [
  'ruler',
  'warrior',
  'magician',
  'lover',
  'explorer',
  'sage',
  'creator',
  'hero',
  'outlaw',
  'jester',
  'caregiver',
  'innocent',
] as const
