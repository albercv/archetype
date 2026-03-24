export interface Archetype {
  id: string
  name: string
  shadow: string
  keyword: string
  shortDescription: string
}

export const ARCHETYPES: readonly Archetype[] = [
  {
    id: 'ruler',
    name: 'El Rey',
    shadow: 'Tiranía / Debilidad',
    keyword: 'Orden, liderazgo',
    shortDescription: 'Lidera con visión y orden. Su sombra es la tiranía.',
  },
  {
    id: 'warrior',
    name: 'El Guerrero',
    shadow: 'Sadismo / Cobardía',
    keyword: 'Disciplina, acción',
    shortDescription: 'Actúa con disciplina y coraje. Su sombra es la violencia sin causa.',
  },
  {
    id: 'magician',
    name: 'El Mago',
    shadow: 'Manipulación / Ignorancia',
    keyword: 'Conocimiento, transformación',
    shortDescription: 'Transforma la realidad con conocimiento. Su sombra es la manipulación.',
  },
  {
    id: 'lover',
    name: 'El Amante',
    shadow: 'Adicción / Frigidez',
    keyword: 'Pasión, conexión',
    shortDescription: 'Conecta con pasión y sensibilidad. Su sombra es la obsesión.',
  },
  {
    id: 'explorer',
    name: 'El Explorador',
    shadow: 'Vagabundo / Conformista',
    keyword: 'Libertad, aventura',
    shortDescription: 'Busca libertad y nuevos caminos. Su sombra es la huida permanente.',
  },
  {
    id: 'sage',
    name: 'El Sabio',
    shadow: 'Dogmático / Idiota',
    keyword: 'Sabiduría, verdad',
    shortDescription: 'Persigue la verdad y el entendimiento. Su sombra es la parálisis por análisis.',
  },
  {
    id: 'creator',
    name: 'El Creador',
    shadow: 'Perfeccionista / Mediocre',
    keyword: 'Innovación, visión',
    shortDescription: 'Construye lo que no existe. Su sombra es el perfeccionismo destructivo.',
  },
  {
    id: 'hero',
    name: 'El Héroe',
    shadow: 'Arrogancia / Cobardía',
    keyword: 'Coraje, hazaña',
    shortDescription: 'Supera obstáculos y protege. Su sombra es la arrogancia del salvador.',
  },
  {
    id: 'rebel',
    name: 'El Rebelde',
    shadow: 'Criminal / Sumiso',
    keyword: 'Revolución, ruptura',
    shortDescription: 'Rompe lo que no funciona. Su sombra es la destrucción sin propósito.',
  },
  {
    id: 'jester',
    name: 'El Bufón',
    shadow: 'Cruel / Aburrido',
    keyword: 'Humor, alegría',
    shortDescription: 'Revela verdades con humor. Su sombra es la evasión de lo serio.',
  },
  {
    id: 'caregiver',
    name: 'El Cuidador',
    shadow: 'Mártir / Egoísta',
    keyword: 'Protección, servicio',
    shortDescription: 'Protege y sirve a otros. Su sombra es el martirio y autoanulación.',
  },
  {
    id: 'innocent',
    name: 'El Inocente',
    shadow: 'Ingenuo / Cínico',
    keyword: 'Fe, optimismo',
    shortDescription: 'Cree en el bien y la pureza. Su sombra es la negación de la realidad.',
  },
] as const
