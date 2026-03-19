export type OptionId = 'a' | 'b' | 'c' | 'd'

export interface ArchetypeWeight {
  id: string
  weight: number
}

export interface QuestionOption {
  id: OptionId
  text: string
  archetypes: ArchetypeWeight[]
}

export interface Question {
  id: number
  title: string
  scenario: string
  question: string
  options: QuestionOption[]
}

export const QUESTIONS: readonly Question[] = [
  {
    id: 1,
    title: 'Pregunta 1/12',
    scenario: 'Tu proyecto principal se desmorona de golpe.',
    question: '¿Cuál es tu reacción instintiva?',
    options: [
      { id: 'a', text: 'Reúno al equipo, organizo roles y tomo el mando',         archetypes: [{ id: 'ruler', weight: 1.0 }, { id: 'warrior', weight: 0.5 }] },
      { id: 'b', text: 'Analizo qué falló, busco la causa raíz',                   archetypes: [{ id: 'magician', weight: 1.0 }, { id: 'sage', weight: 0.5 }] },
      { id: 'c', text: 'Me adapto rápido y busco una salida creativa',             archetypes: [{ id: 'explorer', weight: 1.0 }, { id: 'creator', weight: 0.5 }] },
      { id: 'd', text: 'Me aseguro de que el equipo esté bien emocionalmente',     archetypes: [{ id: 'caregiver', weight: 1.0 }, { id: 'lover', weight: 0.5 }] },
    ],
  },
  {
    id: 2,
    title: 'Pregunta 2/12',
    scenario: 'Nadie te obliga a hacer nada.',
    question: '¿Qué haces con tu tiempo libre?',
    options: [
      { id: 'a', text: 'Aprender algo nuevo o investigar un tema a fondo',         archetypes: [{ id: 'magician', weight: 1.0 }, { id: 'sage', weight: 0.5 }] },
      { id: 'b', text: 'Aventura: viaje, ruta, explorar un lugar nuevo',           archetypes: [{ id: 'explorer', weight: 1.0 }, { id: 'hero', weight: 0.5 }] },
      { id: 'c', text: 'Crear algo: escribir, construir, diseñar',                 archetypes: [{ id: 'creator', weight: 1.0 }, { id: 'magician', weight: 0.5 }] },
      { id: 'd', text: 'Socializar, disfrutar, conectar con gente',                archetypes: [{ id: 'lover', weight: 1.0 }, { id: 'jester', weight: 0.5 }] },
    ],
  },
  {
    id: 3,
    title: 'Pregunta 3/12',
    scenario: 'Pensando en tu trabajo.',
    question: '¿Qué te mueve de verdad?',
    options: [
      { id: 'a', text: 'Libertad total: trabajar en mis términos',                 archetypes: [{ id: 'explorer', weight: 1.0 }, { id: 'rebel', weight: 0.5 }] },
      { id: 'b', text: 'Construir algo grande que deje huella',                    archetypes: [{ id: 'ruler', weight: 1.0 }, { id: 'creator', weight: 0.5 }] },
      { id: 'c', text: 'Ayudar a otros a mejorar su vida',                         archetypes: [{ id: 'caregiver', weight: 1.0 }, { id: 'sage', weight: 0.5 }] },
      { id: 'd', text: 'Dominar mi campo, ser el mejor',                           archetypes: [{ id: 'warrior', weight: 1.0 }, { id: 'hero', weight: 0.5 }] },
    ],
  },
  {
    id: 4,
    title: 'Pregunta 4/12',
    scenario: 'Un amigo te pide consejo sobre un problema serio.',
    question: '¿Cómo respondes?',
    options: [
      { id: 'a', text: 'Le doy una solución directa y práctica',                   archetypes: [{ id: 'warrior', weight: 1.0 }, { id: 'ruler', weight: 0.5 }] },
      { id: 'b', text: 'Le hago preguntas para que llegue a su propia conclusión', archetypes: [{ id: 'sage', weight: 1.0 }, { id: 'magician', weight: 0.5 }] },
      { id: 'c', text: 'Le escucho, le abrazo, le acompaño',                       archetypes: [{ id: 'lover', weight: 1.0 }, { id: 'caregiver', weight: 0.5 }] },
      { id: 'd', text: 'Le quito hierro con humor para que se relaje',             archetypes: [{ id: 'jester', weight: 1.0 }, { id: 'innocent', weight: 0.5 }] },
    ],
  },
  {
    id: 5,
    title: 'Pregunta 5/12',
    scenario: 'Siendo honesto contigo mismo.',
    question: '¿Qué defecto reconoces más en ti?',
    options: [
      { id: 'a', text: 'Soy controlador e impaciente',                             archetypes: [{ id: 'ruler', weight: 1.0 }, { id: 'warrior', weight: 0.5 }] },
      { id: 'b', text: 'Me aíslo demasiado, me cuesta pedir ayuda',               archetypes: [{ id: 'explorer', weight: 1.0 }, { id: 'magician', weight: 0.5 }] },
      { id: 'c', text: 'Salto de proyecto en proyecto sin terminar',               archetypes: [{ id: 'creator', weight: 1.0 }, { id: 'jester', weight: 0.5 }] },
      { id: 'd', text: 'Me involucro demasiado en los problemas de otros',         archetypes: [{ id: 'caregiver', weight: 1.0 }, { id: 'lover', weight: 0.5 }] },
    ],
  },
  {
    id: 6,
    title: 'Pregunta 6/12',
    scenario: 'Un año con todo el dinero del mundo.',
    question: '¿Qué harías?',
    options: [
      { id: 'a', text: 'Monto un imperio: empresa, equipo, expansión global',      archetypes: [{ id: 'ruler', weight: 1.0 }, { id: 'hero', weight: 0.5 }] },
      { id: 'b', text: 'Viajo sin plan, recorro el mundo',                         archetypes: [{ id: 'explorer', weight: 1.0 }, { id: 'innocent', weight: 0.5 }] },
      { id: 'c', text: 'Creo algo revolucionario: arte, tecnología, ciencia',      archetypes: [{ id: 'creator', weight: 1.0 }, { id: 'magician', weight: 0.5 }] },
      { id: 'd', text: 'Monto una fundación para ayudar a comunidades',            archetypes: [{ id: 'caregiver', weight: 1.0 }, { id: 'sage', weight: 0.5 }] },
    ],
  },
  {
    id: 7,
    title: 'Pregunta 7/12',
    scenario: 'Piensa en cómo te perciben los demás.',
    question: '¿Cómo te percibe la mayoría?',
    options: [
      { id: 'a', text: 'Independiente, difícil de encasillar, va a su bola',       archetypes: [{ id: 'explorer', weight: 1.0 }, { id: 'rebel', weight: 0.5 }] },
      { id: 'b', text: 'Líder natural, siempre tiene un plan',                     archetypes: [{ id: 'ruler', weight: 1.0 }, { id: 'warrior', weight: 0.5 }] },
      { id: 'c', text: 'El gracioso, siempre tiene algo ingenioso que decir',      archetypes: [{ id: 'jester', weight: 1.0 }, { id: 'lover', weight: 0.5 }] },
      { id: 'd', text: 'Tranquilo, profundo, siempre reflexionando',               archetypes: [{ id: 'sage', weight: 1.0 }, { id: 'magician', weight: 0.5 }] },
    ],
  },
  {
    id: 8,
    title: 'Pregunta 8/12',
    scenario: 'Observando tu reacción visceral.',
    question: '¿Qué tipo de situación te genera más rechazo?',
    options: [
      { id: 'a', text: 'Que me intenten controlar o limitar',                      archetypes: [{ id: 'rebel', weight: 1.0 }, { id: 'explorer', weight: 0.5 }] },
      { id: 'b', text: 'La mediocridad y la falta de ambición',                    archetypes: [{ id: 'warrior', weight: 1.0 }, { id: 'ruler', weight: 0.5 }] },
      { id: 'c', text: 'La injusticia y el abuso de poder',                        archetypes: [{ id: 'hero', weight: 1.0 }, { id: 'rebel', weight: 0.5 }] },
      { id: 'd', text: 'La superficialidad y la falta de autenticidad',            archetypes: [{ id: 'lover', weight: 1.0 }, { id: 'sage', weight: 0.5 }] },
    ],
  },
  {
    id: 9,
    title: 'Pregunta 9/12',
    scenario: 'En un grupo o equipo sin estructura definida.',
    question: '¿Qué rol asumes sin que nadie te lo asigne?',
    options: [
      { id: 'a', text: 'El líder: tomo decisiones y marco dirección',              archetypes: [{ id: 'ruler', weight: 1.0 }, { id: 'warrior', weight: 0.5 }] },
      { id: 'b', text: 'El estratega: analizo opciones y propongo el plan',        archetypes: [{ id: 'magician', weight: 1.0 }, { id: 'sage', weight: 0.5 }] },
      { id: 'c', text: 'El motivador: mantengo la energía y el ánimo',             archetypes: [{ id: 'jester', weight: 1.0 }, { id: 'lover', weight: 0.5 }] },
      { id: 'd', text: 'El ejecutor: me pongo a hacer mientras otros hablan',      archetypes: [{ id: 'hero', weight: 1.0 }, { id: 'warrior', weight: 0.5 }] },
    ],
  },
  {
    id: 10,
    title: 'Pregunta 10/12',
    scenario: 'Frente a las normas y reglas establecidas.',
    question: '¿Cómo te llevas con las normas?',
    options: [
      { id: 'a', text: 'Las respeto si tienen sentido, las cambio si no',          archetypes: [{ id: 'ruler', weight: 1.0 }, { id: 'sage', weight: 0.5 }] },
      { id: 'b', text: 'Las cuestiono siempre, odio lo arbitrario',               archetypes: [{ id: 'rebel', weight: 1.0 }, { id: 'explorer', weight: 0.5 }] },
      { id: 'c', text: 'Las sigo para mantener la armonía del grupo',              archetypes: [{ id: 'caregiver', weight: 1.0 }, { id: 'innocent', weight: 0.5 }] },
      { id: 'd', text: 'Las ignoro si me limitan, busco mi propio camino',         archetypes: [{ id: 'explorer', weight: 1.0 }, { id: 'rebel', weight: 0.5 }] },
    ],
  },
  {
    id: 11,
    title: 'Pregunta 11/12',
    scenario: 'Al final del día.',
    question: '¿Qué te hace sentir que el día valió la pena?',
    options: [
      { id: 'a', text: 'Haber resuelto un problema complejo',                      archetypes: [{ id: 'magician', weight: 1.0 }, { id: 'warrior', weight: 0.5 }] },
      { id: 'b', text: 'Haber conectado profundamente con alguien',                archetypes: [{ id: 'lover', weight: 1.0 }, { id: 'caregiver', weight: 0.5 }] },
      { id: 'c', text: 'Haber avanzado un paso hacia mi gran objetivo',            archetypes: [{ id: 'hero', weight: 1.0 }, { id: 'ruler', weight: 0.5 }] },
      { id: 'd', text: 'Haber creado algo que no existía antes',                   archetypes: [{ id: 'creator', weight: 1.0 }, { id: 'magician', weight: 0.5 }] },
    ],
  },
  {
    id: 12,
    title: 'Pregunta 12/12',
    scenario: 'En el fondo, bajo la superficie.',
    question: '¿Qué miedo te mueve?',
    options: [
      { id: 'a', text: 'Ser vulnerable, que otros vean mis debilidades',           archetypes: [{ id: 'warrior', weight: 1.0 }, { id: 'ruler', weight: 0.5 }] },
      { id: 'b', text: 'Quedarme estancado, atrapado en una vida mediocre',        archetypes: [{ id: 'explorer', weight: 1.0 }, { id: 'hero', weight: 0.5 }] },
      { id: 'c', text: 'Ser irrelevante, no dejar huella',                         archetypes: [{ id: 'creator', weight: 1.0 }, { id: 'ruler', weight: 0.5 }] },
      { id: 'd', text: 'Estar solo, desconectado de los demás',                    archetypes: [{ id: 'lover', weight: 1.0 }, { id: 'innocent', weight: 0.5 }] },
    ],
  },
] as const
