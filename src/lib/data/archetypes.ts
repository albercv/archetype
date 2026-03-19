export interface Archetype {
  id: string
  name: string
  shadow: string
  keyword: string
}

export const ARCHETYPES: readonly Archetype[] = [
  { id: 'ruler',     name: 'El Rey',       shadow: 'Tiranía / Debilidad',          keyword: 'Orden, liderazgo' },
  { id: 'warrior',   name: 'El Guerrero',  shadow: 'Sadismo / Cobardía',           keyword: 'Disciplina, acción' },
  { id: 'magician',  name: 'El Mago',      shadow: 'Manipulación / Ignorancia',    keyword: 'Conocimiento, transformación' },
  { id: 'lover',     name: 'El Amante',    shadow: 'Adicción / Frigidez',          keyword: 'Pasión, conexión' },
  { id: 'explorer',  name: 'El Explorador',shadow: 'Vagabundo / Conformista',      keyword: 'Libertad, aventura' },
  { id: 'sage',      name: 'El Sabio',     shadow: 'Dogmático / Idiota',           keyword: 'Sabiduría, verdad' },
  { id: 'creator',   name: 'El Creador',   shadow: 'Perfeccionista / Mediocre',    keyword: 'Innovación, visión' },
  { id: 'hero',      name: 'El Héroe',     shadow: 'Arrogancia / Cobardía',        keyword: 'Coraje, hazaña' },
  { id: 'rebel',     name: 'El Rebelde',   shadow: 'Criminal / Sumiso',            keyword: 'Revolución, ruptura' },
  { id: 'jester',    name: 'El Bufón',     shadow: 'Cruel / Aburrido',             keyword: 'Humor, alegría' },
  { id: 'caregiver', name: 'El Cuidador',  shadow: 'Mártir / Egoísta',             keyword: 'Protección, servicio' },
  { id: 'innocent',  name: 'El Inocente',  shadow: 'Ingenuo / Cínico',             keyword: 'Fe, optimismo' },
] as const
