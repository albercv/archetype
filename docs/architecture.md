# Arquitectura: Test de Arquetipos Masculinos

## 1. Visión del Producto

Web donde hombres completan un test de 12 preguntas con opciones cerradas para descubrir su arquetipo masculino dominante (modelo de 12 arquetipos). Las preguntas aparecen una a una. Al completar, paywall de 1€ vía Lemon Squeezy. Tras pago, Claude API analiza las respuestas, genera informe personalizado, lo muestra en pantalla y lo envía por email vía Resend.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework | Next.js 15 (App Router) | SSR, API Routes, deploy Docker |
| Lenguaje | TypeScript strict | Seguridad de tipos en todo el stack |
| Estilos | Tailwind CSS 4 | Utility-first, rápido para dark theme premium |
| Estado cliente | React useState/useReducer | Suficiente para un wizard de 12 pasos |
| Base de datos | PostgreSQL 16 | Relacional, robusto |
| ORM | Prisma | Migrations, type safety, buen DX |
| Pagos | Lemon Squeezy (checkout overlay + webhooks) | EU-friendly, MoR, simple para 1€ |
| IA | Anthropic Claude API (Sonnet 4) | Genera informes de arquetipos |
| Email | Resend + React Email | Transaccional, buen DX con Next.js |
| Deploy | Docker + Docker Compose en VPS | Control total, PostgreSQL incluido |
| Fuentes | Google Fonts (Cinzel + Cormorant Garamond) | Tipografía premium, serif clásica |

**Sin auth de usuario.** El flujo es anónimo hasta el pago. El email del checkout es el identificador.

---

## 3. Modelo de Datos (Prisma)

```prisma
model Session {
  id          String   @id @default(cuid())
  answers     Json     // Array de {questionId, optionId, archetypes[]}
  email       String?
  status      Status   @default(PENDING)  // PENDING | PAID | COMPLETED | FAILED
  paymentId   String?  @unique            // Lemon Squeezy order ID
  report      Json?                        // Informe generado por Claude API
  reportHtml  String?  @db.Text           // HTML del informe para email
  paidAt      DateTime?
  completedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([email])
  @@index([paymentId])
  @@index([status])
}

enum Status {
  PENDING
  PAID
  COMPLETED
  FAILED
}

model AnalyticsEvent {
  id        String   @id @default(cuid())
  sessionId String?
  event     String   // page_view, quiz_start, quiz_complete, payment_init, payment_success, report_generated
  metadata  Json?
  createdAt DateTime @default(now())

  @@index([event])
  @@index([createdAt])
}
```

**Decisiones:**
- `Session.answers` es JSON porque las 12 respuestas son un blob inmutable — no necesitan queries individuales.
- `report` es JSON (datos estructurados) + `reportHtml` (versión renderizada para email).
- Sin tabla User. El email viene del checkout de Lemon Squeezy. Si el mismo email repite, se crean sesiones nuevas.
- `AnalyticsEvent` separada para no ensuciar Session con tracking.

---

## 4. Los 12 Arquetipos

| # | Arquetipo | Sombra | Palabra clave |
|---|-----------|--------|---------------|
| 1 | El Rey (Ruler) | Tiranía / Debilidad | Orden, liderazgo |
| 2 | El Guerrero (Warrior) | Sadismo / Cobardía | Disciplina, acción |
| 3 | El Mago (Magician) | Manipulación / Ignorancia | Conocimiento, transformación |
| 4 | El Amante (Lover) | Adicción / Frigidez | Pasión, conexión |
| 5 | El Explorador (Explorer) | Vagabundo / Conformista | Libertad, aventura |
| 6 | El Sabio (Sage) | Dogmático / Idiota | Sabiduría, verdad |
| 7 | El Creador (Creator) | Perfeccionista / Mediocre | Innovación, visión |
| 8 | El Héroe (Hero) | Arrogancia / Cobardía | Coraje, hazaña |
| 9 | El Rebelde (Outlaw) | Criminal / Sumiso | Revolución, ruptura |
| 10 | El Bufón (Jester) | Cruel / Aburrido | Humor, alegría |
| 11 | El Cuidador (Caregiver) | Mártir / Egoísta | Protección, servicio |
| 12 | El Inocente (Innocent) | Ingenuo / Cínico | Fe, optimismo |

---

## 5. Las 12 Preguntas (Opciones cerradas)

Cada pregunta tiene 4 opciones. Cada opción mapea a 1-2 arquetipos con peso (1.0 primario, 0.5 secundario).

```typescript
type Question = {
  id: number;
  title: string;        // "Pregunta 1/12"
  scenario: string;     // Contexto situacional
  question: string;     // La pregunta directa
  options: {
    id: string;         // "a" | "b" | "c" | "d"
    text: string;
    archetypes: { id: string; weight: number }[];
  }[];
};
```

### Preguntas diseñadas:

**P1 — Crisis:** Tu proyecto principal se desmorona de golpe. ¿Cuál es tu reacción instintiva?
- a) Reúno al equipo, organizo roles y tomo el mando → Rey(1.0), Guerrero(0.5)
- b) Analizo qué falló, busco la causa raíz → Mago(1.0), Sabio(0.5)
- c) Me adapto rápido y busco una salida creativa → Explorador(1.0), Creador(0.5)
- d) Me aseguro de que el equipo esté bien emocionalmente → Cuidador(1.0), Amante(0.5)

**P2 — Tiempo libre:** Nadie te obliga a hacer nada. ¿Qué haces?
- a) Aprender algo nuevo o investigar un tema a fondo → Mago(1.0), Sabio(0.5)
- b) Aventura: viaje, ruta, explorar un lugar nuevo → Explorador(1.0), Héroe(0.5)
- c) Crear algo: escribir, construir, diseñar → Creador(1.0), Mago(0.5)
- d) Socializar, disfrutar, conectar con gente → Amante(1.0), Bufón(0.5)

**P3 — Motivación:** ¿Qué te mueve de verdad en tu trabajo?
- a) Libertad total: trabajar en mis términos → Explorador(1.0), Rebelde(0.5)
- b) Construir algo grande que deje huella → Rey(1.0), Creador(0.5)
- c) Ayudar a otros a mejorar su vida → Cuidador(1.0), Sabio(0.5)
- d) Dominar mi campo, ser el mejor → Guerrero(1.0), Héroe(0.5)

**P4 — Consejo:** Un amigo te pide consejo sobre un problema serio.
- a) Le doy una solución directa y práctica → Guerrero(1.0), Rey(0.5)
- b) Le hago preguntas para que llegue a su propia conclusión → Sabio(1.0), Mago(0.5)
- c) Le escucho, le abrazo, le acompaño → Amante(1.0), Cuidador(0.5)
- d) Le quito hierro con humor para que se relaje → Bufón(1.0), Inocente(0.5)

**P5 — Defecto:** ¿Qué defecto reconoces más en ti?
- a) Soy controlador e impaciente → Rey(1.0), Guerrero(0.5)
- b) Me aíslo demasiado, me cuesta pedir ayuda → Explorador(1.0), Mago(0.5)
- c) Salto de proyecto en proyecto sin terminar → Creador(1.0), Bufón(0.5)
- d) Me involucro demasiado en los problemas de otros → Cuidador(1.0), Amante(0.5)

**P6 — Recursos ilimitados:** Un año con todo el dinero del mundo.
- a) Monto un imperio: empresa, equipo, expansión global → Rey(1.0), Héroe(0.5)
- b) Viajo sin plan, recorro el mundo → Explorador(1.0), Inocente(0.5)
- c) Creo algo revolucionario: arte, tecnología, ciencia → Creador(1.0), Mago(0.5)
- d) Monto una fundación para ayudar a comunidades → Cuidador(1.0), Sabio(0.5)

**P7 — Imagen:** ¿Cómo te percibe la mayoría?
- a) Independiente, difícil de encasillar, va a su bola → Explorador(1.0), Rebelde(0.5)
- b) Líder natural, siempre tiene un plan → Rey(1.0), Guerrero(0.5)
- c) El gracioso, siempre tiene algo ingenioso que decir → Bufón(1.0), Amante(0.5)
- d) Tranquilo, profundo, siempre reflexionando → Sabio(1.0), Mago(0.5)

**P8 — Conflicto:** ¿Qué tipo de situación te genera más rechazo?
- a) Que me intenten controlar o limitar → Rebelde(1.0), Explorador(0.5)
- b) La mediocridad y la falta de ambición → Guerrero(1.0), Rey(0.5)
- c) La injusticia y el abuso de poder → Héroe(1.0), Rebelde(0.5)
- d) La superficialidad y la falta de autenticidad → Amante(1.0), Sabio(0.5)

**P9 — Rol en grupo:** ¿Qué rol asumes sin que nadie te lo asigne?
- a) El líder: tomo decisiones y marco dirección → Rey(1.0), Guerrero(0.5)
- b) El estratega: analizo opciones y propongo el plan → Mago(1.0), Sabio(0.5)
- c) El motivador: mantengo la energía y el ánimo → Bufón(1.0), Amante(0.5)
- d) El ejecutor: me pongo a hacer mientras otros hablan → Héroe(1.0), Guerrero(0.5)

**P10 — Reglas:** ¿Cómo te llevas con las normas?
- a) Las respeto si tienen sentido, las cambio si no → Rey(1.0), Sabio(0.5)
- b) Las cuestiono siempre, odio lo arbitrario → Rebelde(1.0), Explorador(0.5)
- c) Las sigo para mantener la armonía del grupo → Cuidador(1.0), Inocente(0.5)
- d) Las ignoro si me limitan, busco mi propio camino → Explorador(1.0), Rebelde(0.5)

**P11 — Satisfacción:** ¿Qué te hace sentir que el día valió la pena?
- a) Haber resuelto un problema complejo → Mago(1.0), Guerrero(0.5)
- b) Haber conectado profundamente con alguien → Amante(1.0), Cuidador(0.5)
- c) Haber avanzado un paso hacia mi gran objetivo → Héroe(1.0), Rey(0.5)
- d) Haber creado algo que no existía antes → Creador(1.0), Mago(0.5)

**P12 — Miedo profundo:** ¿Qué miedo te mueve en el fondo?
- a) Ser vulnerable, que otros vean mis debilidades → Guerrero(1.0), Rey(0.5)
- b) Quedarme estancado, atrapado en una vida mediocre → Explorador(1.0), Héroe(0.5)
- c) Ser irrelevante, no dejar huella → Creador(1.0), Rey(0.5)
- d) Estar solo, desconectado de los demás → Amante(1.0), Inocente(0.5)

---

## 6. Flujo de Datos

```
[1. Landing Page]
    │
    ▼
[2. Quiz — 12 preguntas progresivas]
    │  Cada respuesta se guarda en state local (React)
    │  Al completar P12 → POST /api/sessions (guarda answers en DB, devuelve sessionId)
    │
    ▼
[3. Paywall — "Tu arquetipo está listo. Desbloquea el informe por 1€"]
    │  Click → Lemon Squeezy Checkout Overlay
    │  Se pasa sessionId como custom_data en el checkout
    │
    ▼
[4. Lemon Squeezy procesa pago]
    │  Webhook → POST /api/webhooks/lemonsqueezy
    │  Verifica firma, extrae sessionId y email
    │  Actualiza Session: status=PAID, email, paymentId
    │
    ▼
[5. Genera informe]
    │  POST /api/reports/generate (llamado por webhook handler)
    │  Llama a Claude API con answers + prompt de arquetipos
    │  Guarda report JSON + reportHtml en Session
    │  Actualiza status=COMPLETED
    │
    ▼
[6. Envía email]
    │  Resend con template React Email
    │  Incluye reportHtml
    │
    ▼
[7. Cliente muestra informe]
    │  Tras checkout success → redirect a /report/[sessionId]
    │  Polling o SSE hasta status=COMPLETED
    │  Renderiza informe
```

---

## 7. Contratos de API

### POST /api/sessions
Crea sesión con respuestas completadas.
```typescript
// Request
{
  answers: {
    questionId: number;
    optionId: string; // "a" | "b" | "c" | "d"
  }[];
}

// Response 201
{
  sessionId: string;
  checkoutUrl: string; // Lemon Squeezy checkout URL con sessionId en custom_data
}
```

### POST /api/webhooks/lemonsqueezy
Recibe webhook de Lemon Squeezy. No devuelve datos al cliente.
```typescript
// Headers: X-Signature (HMAC SHA256)
// Body: Lemon Squeezy webhook payload
// Custom data contains: { sessionId: string }

// Response 200
"OK"
```

### GET /api/reports/[sessionId]
Consulta estado del informe.
```typescript
// Response 200
{
  status: "PENDING" | "PAID" | "COMPLETED" | "FAILED";
  report: null | {
    dominantArchetype: {
      id: string;
      name: string;
      score: number;
      description: string;
    };
    secondaryArchetypes: {
      id: string;
      name: string;
      score: number;
      description: string;
    }[];
    shadow: {
      description: string;
      risks: string[];
    };
    analysis: string;       // Lectura profunda personalizada
    recommendations: string[]; // Consejos accionables
  };
}
```

---

## 8. Prompt de Claude API

```
Eres un experto en psicología arquetipal masculina basada en el modelo de 12 arquetipos (Jung, Moore/Gillette).

Analiza las respuestas de un hombre al test de arquetipos y genera un informe personal y directo.

## Datos de entrada
Las respuestas del usuario con los arquetipos mapeados a cada opción elegida.

## Formato de salida (JSON estricto)
{
  "dominantArchetype": {
    "id": "ruler",
    "name": "El Rey",
    "score": 85,
    "description": "Párrafo de 3-4 líneas describiendo cómo se manifiesta en esta persona concreta, no genérico."
  },
  "secondaryArchetypes": [
    // 2-3 arquetipos con score > 30, misma estructura
  ],
  "shadow": {
    "description": "Párrafo sobre la sombra específica de esta combinación.",
    "risks": ["Riesgo concreto 1", "Riesgo concreto 2", "Riesgo concreto 3"]
  },
  "analysis": "Lectura cruda de 4-5 líneas. Directa, sin filtros. Cómo interactúan sus arquetipos, tensiones internas, patrones.",
  "recommendations": [
    "Consejo accionable 1 basado en sus arquetipos",
    "Consejo accionable 2",
    "Consejo accionable 3"
  ]
}

## Reglas
- Sé DIRECTO. Nada de "podrías considerar...". Habla como un mentor que dice verdades.
- La lectura es PERSONAL. Usa las respuestas concretas del usuario, no plantillas genéricas.
- Los consejos deben ser ACCIONABLES. No filosofía vaga. Acciones concretas.
- El tono es masculino, directo, respetuoso pero sin algodón.
- Responde SOLO con el JSON. Sin markdown, sin explicaciones fuera del JSON.
```

---

## 9. Estructura de Directorios

```
archetype-test/
├── .claude/
│   ├── settings.json
│   └── commands/
│       ├── plan.md
│       ├── review.md
│       └── test.md
├── CLAUDE.md
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata, dark theme)
│   │   ├── page.tsx                # Landing page
│   │   ├── quiz/
│   │   │   └── page.tsx            # Quiz wizard (client component)
│   │   ├── report/
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx        # Report display (polling + render)
│   │   └── api/
│   │       ├── sessions/
│   │       │   └── route.ts        # POST: crear sesión + checkout URL
│   │       ├── reports/
│   │       │   └── [sessionId]/
│   │       │       └── route.ts    # GET: consultar estado/informe
│   │       └── webhooks/
│   │           └── lemonsqueezy/
│   │               └── route.ts    # POST: webhook handler
│   ├── components/
│   │   ├── ui/                     # Primitivos: Button, Card, ProgressBar, Badge
│   │   └── features/
│   │       ├── quiz/               # QuizWizard, QuestionCard, OptionButton
│   │       ├── report/             # ReportView, ArchetypeCard, ShadowSection
│   │       └── landing/            # Hero, CTA, Testimonials
│   ├── lib/
│   │   ├── data/
│   │   │   ├── questions.ts        # Las 12 preguntas con opciones y mappings
│   │   │   └── archetypes.ts       # Metadata de los 12 arquetipos
│   │   ├── services/
│   │   │   ├── archetype-scorer.ts # Calcula scores por arquetipo desde answers
│   │   │   ├── report-generator.ts # Llama a Claude API, parsea respuesta
│   │   │   ├── payment.ts          # Crea checkout Lemon Squeezy
│   │   │   └── email.ts            # Envía informe vía Resend
│   │   ├── repositories/
│   │   │   ├── session.ts          # CRUD de Session en Prisma
│   │   │   └── analytics.ts        # Insert de AnalyticsEvent
│   │   ├── validators/
│   │   │   └── session.ts          # Zod schemas para answers
│   │   ├── utils/
│   │   │   └── webhook-verify.ts   # Verificación HMAC Lemon Squeezy
│   │   └── constants/
│   │       └── index.ts            # URLs, config, límites
│   ├── types/
│   │   └── index.ts                # Types compartidos
│   └── styles/
│       └── globals.css             # Tailwind + CSS variables dark theme
├── emails/
│   └── report.tsx                  # Template React Email
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example
└── package.json
```

---

## 10. Dirección Visual

### Concepto: "Oráculo Oscuro"

Tema oscuro premium. Negro profundo con acentos dorados. Tipografía serif para títulos (Cinzel), serif elegante para cuerpo (Cormorant Garamond). Sensación de test psicológico profundo, no de quiz viral.

### Paleta CSS

```css
:root {
  --bg-primary: #0A0A0A;
  --bg-secondary: #141414;
  --bg-card: #1A1A1A;
  --bg-card-hover: #222222;
  --gold-primary: #C9A84C;
  --gold-light: #E8D48B;
  --gold-dark: #8B7332;
  --text-primary: #F5F0E8;
  --text-secondary: #A09880;
  --text-muted: #6B6555;
  --border: #2A2520;
  --border-gold: rgba(201, 168, 76, 0.3);
  --error: #C44D4D;
  --success: #4DA06B;
}
```

### Tipografía
- **Títulos / Arquetipos:** Cinzel (Google Fonts) — serif display, romano, autoritario
- **Cuerpo / Preguntas:** Cormorant Garamond — serif elegante, legible
- **UI / Labels:** System sans-serif stack como fallback

### Componentes clave

**Landing:**
- Hero fullscreen oscuro con texto dorado centrado
- Título: "Descubre Tu Arquetipo" en Cinzel grande
- Subtítulo: "12 preguntas. Tu verdad. Sin filtros."
- CTA dorado único: "Comenzar el Test"
- Efecto sutil de partículas o grain texture en el fondo

**Quiz:**
- Una pregunta a la vez, transición fade suave
- Barra de progreso dorada (1/12 → 12/12)
- Número de pregunta en Cinzel
- Texto de pregunta en Cormorant
- 4 opciones como cards oscuras con borde dorado al hover
- Opción seleccionada: fondo dorado tenue, borde dorado sólido
- Transición automática 0.5s después de seleccionar

**Paywall:**
- Background con gradient radial sutil (oro oscuro centro)
- "Tu arquetipo ha sido calculado"
- Vista previa borrosa o silueta del arquetipo dominante
- CTA: "Desbloquear Informe Completo — 1€"
- Bullet points de lo que incluye el informe

**Report:**
- Sección hero con nombre del arquetipo dominante en grande
- Badge dorado con el porcentaje
- Secciones con separadores dorados sutiles
- Cards para arquetipos secundarios
- Sección de sombra con tono diferente (borde rojo oscuro tenue)
- Recomendaciones en cards numeradas

---

## 11. Plan de Ejecución para Claude Code

### Prereqs (manual, sin Claude Code)

1. Instalar Claude Code CLI:
   ```bash
   # macOS/Linux (nativo, recomendado)
   curl -fsSL https://cli.claude.com/install.sh | sh

   # Alternativa npm (requiere Node.js 18+)
   npm install -g @anthropic-ai/claude-code
   ```
2. Autenticarse: ejecutar `claude` y completar OAuth
3. Tener cuenta en console.anthropic.com con API key
4. Tener cuenta en Lemon Squeezy con producto de 1€ creado (test mode)
5. Tener cuenta en Resend con API key
6. (Cuando tengas dominio) Verificar DNS en Resend

---

### Tarea 1: Scaffold del proyecto

**Objetivo:** Proyecto Next.js 15 funcional con la estructura base, Docker y config de desarrollo.

**Archivos a crear:**
- `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`
- `src/app/layout.tsx`, `src/app/page.tsx`
- `src/styles/globals.css` (con CSS variables del dark theme)
- `docker/Dockerfile`, `docker/Dockerfile.dev`, `docker/docker-compose.yml`
- `.env.example`
- `.gitignore`
- `CLAUDE.md`
- `.claude/settings.json`
- `.claude/commands/plan.md`, `review.md`, `test.md`

**Dependencias:** Ninguna

**Criterio de aceptación:**
- `npm run dev` arranca sin errores
- `docker compose up` arranca Next.js + PostgreSQL
- Página raíz muestra "Archetype Test" con dark theme

**Prompt para Claude Code:**
```
Inicializa un proyecto Next.js 15 con App Router y TypeScript strict. Usa Tailwind CSS 4. NO uses create-next-app, hazlo manualmente para control total.

Estructura de src/ según el CLAUDE.md del proyecto (léelo primero).

Configura:
- TypeScript strict (noUncheckedIndexedAccess, exactOptionalPropertyTypes)
- ESLint + Prettier
- Tailwind con las CSS variables dark theme definidas en docs/architecture.md sección 10
- Google Fonts: Cinzel (display) y Cormorant Garamond (body)
- Docker Compose con: next-app (dev), postgres:16, con volúmenes persistentes
- .env.example con todas las variables necesarias

Crea una landing page mínima en src/app/page.tsx que muestre "Descubre Tu Arquetipo" con el dark theme aplicado, para verificar que todo funciona.

Ejecuta: npm run dev y verifica que compila sin errores.
Ejecuta: npm run typecheck y verifica 0 errores.
Commit: "feat: scaffold proyecto con Next.js 15, Tailwind, Docker"
```

---

### Tarea 2: Modelo de datos y repositorios

**Objetivo:** Schema Prisma, migración inicial, tipos derivados, repositorios.

**Archivos a crear:**
- `prisma/schema.prisma`
- `src/lib/repositories/session.ts`
- `src/lib/repositories/analytics.ts`
- `src/types/index.ts`

**Dependencias:** Tarea 1

**Criterio de aceptación:**
- `npx prisma migrate dev` ejecuta sin errores
- `npx prisma generate` genera cliente
- Types exportados coinciden con schema

**Prompt para Claude Code:**
```
Lee CLAUDE.md y docs/architecture.md.

Instala Prisma. Crea el schema en prisma/schema.prisma con los modelos Session y AnalyticsEvent según la arquitectura (sección 3).

Configura datasource para PostgreSQL con DATABASE_URL del .env.

Crea los repositorios en src/lib/repositories/:
- session.ts: createSession, getSession, updateSession, updateSessionStatus
- analytics.ts: trackEvent

Crea los tipos TypeScript derivados en src/types/index.ts.

Asegúrate de que los repositorios son la ÚNICA capa que toca Prisma. Named exports.

Ejecuta: npx prisma migrate dev --name init
Ejecuta: npm run typecheck
Commit: "feat: modelo de datos Prisma + repositorios"
```

---

### Tarea 3: Datos del quiz — preguntas y arquetipos

**Objetivo:** Las 12 preguntas con opciones y mappings de arquetipos como datos estáticos tipados.

**Archivos a crear:**
- `src/lib/data/archetypes.ts`
- `src/lib/data/questions.ts`
- `src/lib/services/archetype-scorer.ts`
- `src/lib/validators/session.ts`
- `tests/unit/archetype-scorer.test.ts`

**Dependencias:** Tarea 2

**Criterio de aceptación:**
- 12 preguntas × 4 opciones definidas
- Cada opción mapea a 1-2 arquetipos con peso
- Scorer calcula correctamente arquetipos dominantes
- Tests unitarios pasan

**Prompt para Claude Code:**
```
Lee CLAUDE.md y docs/architecture.md sección 5 (Las 12 Preguntas).

Crea src/lib/data/archetypes.ts con la metadata de los 12 arquetipos (id, nombre español, nombre inglés, sombra, palabra clave).

Crea src/lib/data/questions.ts con las 12 preguntas exactas de la arquitectura. Cada opción tiene un array de { archetypeId, weight }.

Crea src/lib/services/archetype-scorer.ts:
- Input: array de { questionId, optionId }
- Output: array de { archetypeId, score } ordenado por score descendente
- Lógica: suma los weights de cada arquetipo según las opciones elegidas

Crea src/lib/validators/session.ts con Zod schema para validar las answers del quiz (12 respuestas, optionIds válidos).

Escribe tests unitarios para el scorer en tests/unit/archetype-scorer.test.ts. Casos: usuario Rey dominante, usuario mixto, todas las preguntas respondidas.

Ejecuta: npm run test
Ejecuta: npm run typecheck
Commit: "feat: datos quiz, scorer de arquetipos con tests"
```

---

### Tarea 4: UI del Quiz

**Objetivo:** Componente wizard de 12 preguntas, progresivo, con transiciones y la estética oscura/dorada.

**Archivos a crear/modificar:**
- `src/components/ui/Button.tsx`
- `src/components/ui/ProgressBar.tsx`
- `src/components/ui/Card.tsx`
- `src/components/features/quiz/QuizWizard.tsx`
- `src/components/features/quiz/QuestionCard.tsx`
- `src/components/features/quiz/OptionButton.tsx`
- `src/app/quiz/page.tsx`

**Dependencias:** Tarea 3

**Criterio de aceptación:**
- Preguntas aparecen una a una
- Opciones seleccionables con feedback visual (gold border/bg)
- Transición fade al seleccionar → siguiente pregunta (0.5s delay)
- Barra de progreso dorada actualiza
- Al completar P12, navega a paywall
- Mobile responsive

**Prompt para Claude Code:**
```
Lee CLAUDE.md y docs/architecture.md secciones 5 y 10.

Lee el skill de frontend-design para obtener las mejores prácticas de diseño UI: /mnt/skills/public/frontend-design/SKILL.md (si estás en Claude Code, ignora esta instrucción).

Dirección visual: "Oráculo Oscuro" — negro profundo (#0A0A0A), acentos dorados (#C9A84C), tipografía Cinzel para números de pregunta, Cormorant Garamond para texto.

Crea componentes UI primitivos (Button, ProgressBar, Card) en src/components/ui/. Todos con Tailwind, dark theme, acentos dorados.

Crea el wizard del quiz en src/components/features/quiz/:
- QuizWizard: controla el state (currentQuestion, answers[])
- QuestionCard: renderiza pregunta con scenario y opciones
- OptionButton: card seleccionable con hover dorado, estado selected

Comportamiento:
1. Muestra pregunta actual con fade-in
2. Usuario selecciona opción → feedback visual inmediato (gold)
3. Delay 500ms → fade-out → siguiente pregunta con fade-in
4. Barra de progreso se actualiza suavemente
5. Al completar 12/12 → POST /api/sessions con answers → redirect a paywall

El componente QuizWizard es "use client". Los datos de preguntas se importan de src/lib/data/questions.ts.

NO implementes el API route todavía, solo haz un console.log del payload al completar.

Mobile first. Las opciones deben ser tocables fácilmente en móvil.

Ejecuta: npm run dev y verifica visualmente que el quiz funciona.
Ejecuta: npm run typecheck
Commit: "feat: UI quiz wizard con 12 preguntas progresivas"
```

---

### Tarea 5: Landing page

**Objetivo:** Landing page que convierte. Hero oscuro, CTA al quiz.

**Archivos a crear/modificar:**
- `src/components/features/landing/Hero.tsx`
- `src/app/page.tsx`

**Dependencias:** Tarea 4 (para que el link al quiz funcione)

**Criterio de aceptación:**
- Hero fullscreen con título Cinzel dorado
- Subtítulo persuasivo
- CTA "Comenzar el Test" que lleva a /quiz
- Efecto grain/noise texture en background
- Mobile responsive

**Prompt para Claude Code:**
```
Lee CLAUDE.md y docs/architecture.md sección 10 (Dirección Visual, Landing).

Crea la landing page en src/app/page.tsx con un Hero component.

Diseño "Oráculo Oscuro":
- Fondo: #0A0A0A con grain texture CSS (background-image noise)
- Título: "Descubre Tu Arquetipo" en Cinzel, dorado (#C9A84C), grande (4xl-6xl responsive)
- Subtítulo: "12 preguntas. Tu verdad. Sin filtros." en Cormorant Garamond, #A09880
- Breve texto descriptivo (2-3 líneas) sobre lo que descubrirán
- CTA: botón dorado con hover glow sutil → link a /quiz
- Animación de entrada (fade-in staggered)
- NO meter testimonials ni footer elaborado. Minimalismo.

Mobile first. El hero debe verse impactante tanto en desktop como móvil.

Ejecuta: npm run dev y verifica
Commit: "feat: landing page hero oscuro con CTA"
```

---

### Tarea 6: API Sessions + Lemon Squeezy Checkout

**Objetivo:** API route que crea sesión y devuelve checkout URL de Lemon Squeezy.

**Archivos a crear:**
- `src/app/api/sessions/route.ts`
- `src/lib/services/payment.ts`

**Dependencias:** Tarea 3 (validators, repos)

**Criterio de aceptación:**
- POST /api/sessions valida answers con Zod
- Crea Session en DB con status PENDING
- Genera checkout URL de Lemon Squeezy con sessionId en custom_data
- Retorna sessionId + checkoutUrl
- Maneja errores correctamente

**Prompt para Claude Code:**
```
Lee CLAUDE.md y docs/architecture.md secciones 6 y 7.

Instala @lemonsqueezy/lemonsqueezy.js.

Crea src/lib/services/payment.ts:
- createCheckout(sessionId: string): genera checkout URL de Lemon Squeezy
- Usa la API de Lemon Squeezy para crear un checkout con:
  - productVariantId del .env (LEMONSQUEEZY_VARIANT_ID)
  - custom_data: { sessionId }
  - checkout_data.email: opcional (no lo tenemos aún)
  - Redirect URL tras pago: /report/{sessionId}

Crea src/app/api/sessions/route.ts:
- POST handler
- Valida body con el Zod schema de session.ts
- Crea Session en DB via repository
- Llama a payment.createCheckout
- Trackea evento analytics "quiz_complete"
- Retorna { sessionId, checkoutUrl }
- Error handling completo (400 validation, 500 internal)

Variables de entorno necesarias en .env.example:
- LEMONSQUEEZY_API_KEY
- LEMONSQUEEZY_STORE_ID
- LEMONSQUEEZY_VARIANT_ID

Ejecuta: npm run typecheck
Commit: "feat: API sessions + Lemon Squeezy checkout"
```

---

### Tarea 7: Paywall UI

**Objetivo:** Pantalla post-quiz que muestra teaser y botón de pago.

**Archivos a crear:**
- `src/app/quiz/paywall/page.tsx` (o integrado en el flow del quiz)
- `src/components/features/quiz/PaywallView.tsx`

**Dependencias:** Tarea 6

**Criterio de aceptación:**
- Se muestra después de completar P12
- Teaser visual del arquetipo (borroso o silueta)
- Texto persuasivo sobre qué incluye el informe
- Botón "Desbloquear — 1€" que abre checkout Lemon Squeezy
- Loading state mientras se crea la sesión

**Prompt para Claude Code:**
```
Lee CLAUDE.md y docs/architecture.md sección 10 (Paywall).

Modifica el flujo del QuizWizard: al completar P12, en vez de redirect, muestra el PaywallView inline.

PaywallView:
- Background con gradient radial sutil (dorado oscuro en centro)
- Título: "Tu Arquetipo Ha Sido Calculado"
- Ícono o silueta genérica de un arquetipo (SVG simple, silueta masculina con aura dorada)
- Lista de lo que incluye el informe (3-4 bullet points con iconos)
- Botón dorado grande: "Desbloquear Informe Completo — 1€"
- Subtexto: "Pago seguro · Informe inmediato · Enviado a tu email"
- Notas: el pago se procesará con Lemon Squeezy

Al click del botón:
1. POST /api/sessions con answers
2. Loading spinner dorado mientras espera
3. Recibe checkoutUrl → window.open o redirect al checkout de Lemon Squeezy
4. Tras checkout success, Lemon Squeezy redirige a /report/[sessionId]

Ejecuta: npm run dev y verifica el flujo completo (quiz → paywall)
Commit: "feat: paywall UI post-quiz con checkout flow"
```

---

### Tarea 8: Webhook Lemon Squeezy + Report Generation

**Objetivo:** Recibir webhook de pago, generar informe con Claude API, enviar email.

**Archivos a crear:**
- `src/app/api/webhooks/lemonsqueezy/route.ts`
- `src/lib/utils/webhook-verify.ts`
- `src/lib/services/report-generator.ts`
- `src/lib/services/email.ts`
- `emails/report.tsx`

**Dependencias:** Tarea 6, cuenta Anthropic API, cuenta Resend

**Criterio de aceptación:**
- Webhook verifica firma HMAC
- Extrae sessionId de custom_data
- Actualiza Session con email y paymentId
- Llama a Claude API con el prompt y las answers
- Parsea JSON del informe
- Guarda report en DB
- Envía email con informe vía Resend
- Maneja errores (retry-safe, idempotente vía paymentId unique)

**Prompt para Claude Code:**
```
Lee CLAUDE.md y docs/architecture.md secciones 6, 7 y 8.

Instala: @anthropic-ai/sdk, resend, @react-email/components.

Crea src/lib/utils/webhook-verify.ts:
- verifyLemonSqueezySignature(rawBody, signature, secret): boolean
- HMAC SHA256 con timing-safe comparison

Crea src/app/api/webhooks/lemonsqueezy/route.ts:
- POST handler, lee raw body
- Verifica firma con LEMONSQUEEZY_WEBHOOK_SECRET
- Solo procesa event_name === "order_created"
- Extrae sessionId de meta.custom_data
- Extrae email de data.attributes.user_email
- Actualiza Session: status=PAID, email, paymentId
- Llama a generateReport(sessionId)
- Si falla, actualiza status=FAILED
- Siempre retorna 200 (para que Lemon Squeezy no reintente)

Crea src/lib/services/report-generator.ts:
- generateReport(sessionId): llama a Claude API
- Recupera Session de DB
- Calcula scores con archetype-scorer
- Construye prompt con las answers y scores (usa el prompt de la arquitectura sección 8)
- Llama a Anthropic API (model: claude-sonnet-4-20250514, max_tokens: 2000)
- Parsea JSON de la respuesta
- Guarda report y reportHtml en Session
- Actualiza status=COMPLETED
- Llama a sendReportEmail

Crea src/lib/services/email.ts:
- sendReportEmail(session): envía email con Resend
- From: configurable en .env (RESEND_FROM_EMAIL)
- To: session.email
- Subject: "Tu Informe de Arquetipo Masculino"
- Template: React Email en emails/report.tsx

Crea emails/report.tsx:
- Template React Email con el dark theme
- Muestra arquetipo dominante, secundarios, sombra, análisis, recomendaciones
- Responsive para clientes de email

Variables de entorno en .env.example:
- ANTHROPIC_API_KEY
- RESEND_API_KEY
- RESEND_FROM_EMAIL
- LEMONSQUEEZY_WEBHOOK_SECRET

Ejecuta: npm run typecheck
Commit: "feat: webhook handler + report generation + email"
```

---

### Tarea 9: Report page (vista del informe)

**Objetivo:** Página /report/[sessionId] que muestra el informe generado.

**Archivos a crear:**
- `src/app/report/[sessionId]/page.tsx`
- `src/app/api/reports/[sessionId]/route.ts`
- `src/components/features/report/ReportView.tsx`
- `src/components/features/report/ArchetypeCard.tsx`
- `src/components/features/report/ShadowSection.tsx`
- `src/components/features/report/RecommendationCard.tsx`

**Dependencias:** Tarea 8

**Criterio de aceptación:**
- Polling cada 2s hasta status=COMPLETED (loading state mientras)
- Renderiza informe completo con el dark theme
- Arquetipo dominante en hero section con nombre grande
- Arquetipos secundarios en cards
- Sección de sombra diferenciada
- Recomendaciones numeradas
- Mobile responsive
- Si status=FAILED, muestra error con contacto

**Prompt para Claude Code:**
```
Lee CLAUDE.md y docs/architecture.md secciones 7 y 10 (Report).

Crea src/app/api/reports/[sessionId]/route.ts:
- GET handler
- Retorna { status, report } según el contrato de la arquitectura
- Si session no existe → 404
- Si status !== COMPLETED → retorna status sin report

Crea la página src/app/report/[sessionId]/page.tsx:
- Client component que hace polling GET /api/reports/[sessionId] cada 2 segundos
- Estados: LOADING (esperando pago), PROCESSING (generando informe), COMPLETED (informe listo), FAILED
- Loading: animación dorada (spinner o pulso), texto "Generando tu informe..."

Crea ReportView con sub-componentes:
- Hero: nombre del arquetipo dominante en Cinzel grande dorado + score como badge
- Descripción personalizada del arquetipo
- ArchetypeCard: para cada arquetipo secundario (nombre, score, descripción)
- ShadowSection: fondo diferenciado (border sutil rojo oscuro), descripción + risks como lista
- Análisis: párrafo de lectura cruda en Cormorant, estilo cita
- RecommendationCard: 3 cards numeradas con los consejos

Estética: consistente con el dark theme. Separadores dorados sutiles entre secciones. Spacing generoso.

Ejecuta: npm run dev y verifica con una sesión de test (puedes crear una manualmente en DB con un report JSON de ejemplo)
Commit: "feat: report page con polling y vista completa"
```

---

### Tarea 10: Integration testing + Docker production

**Objetivo:** Tests de integración, Dockerfile de producción, docker-compose.prod.yml.

**Archivos a crear:**
- `tests/integration/session-flow.test.ts`
- `tests/integration/webhook.test.ts`
- `docker/Dockerfile` (producción)
- `docker/docker-compose.prod.yml`

**Dependencias:** Todas las anteriores

**Criterio de aceptación:**
- Test E2E: crear sesión → simular webhook → verificar report
- Docker build de producción funciona
- docker-compose.prod.yml levanta app + postgres + ssl ready
- Health check endpoint funciona

**Prompt para Claude Code:**
```
Lee CLAUDE.md.

Crea tests de integración:
- tests/integration/session-flow.test.ts: POST /api/sessions con answers válidas, verifica 201, verifica sesión en DB
- tests/integration/webhook.test.ts: simula webhook de Lemon Squeezy con firma válida, verifica que actualiza sesión

Crea Dockerfile de producción (multi-stage build):
- Stage 1: deps
- Stage 2: build (next build)
- Stage 3: runner (standalone output)
- Non-root user

Crea docker/docker-compose.prod.yml:
- app: Dockerfile producción, puerto configurable, health check
- postgres: con volumen persistente, password from env
- Configuración de restart policies

Añade health check endpoint: GET /api/health → 200 { status: "ok", db: "connected" }

Ejecuta: npm run test
Ejecuta: docker build
Commit: "feat: integration tests + Docker production"
```

---

## 12. CLAUDE.md del Proyecto

```markdown
# Project: Archetype Test
Test de 12 arquetipos masculinos con pago de 1€ e informe IA.

## Stack
- Next.js 15 (App Router) + TypeScript strict
- Prisma + PostgreSQL
- Tailwind CSS 4 (dark theme, gold accents)
- Lemon Squeezy (pagos)
- Claude API Sonnet (informes)
- Resend + React Email (emails)

## Commands
- `npm run dev` — Dev server (port 3000)
- `npm run build` — Production build
- `npm run test` — Vitest
- `npm run lint` — ESLint + Prettier
- `npm run typecheck` — tsc --noEmit
- `npx prisma migrate dev` — Run migrations
- `npx prisma studio` — DB GUI
- `docker compose up` — Dev environment (app + postgres)

## Architecture
- Preguntas y arquetipos en `src/lib/data/` (datos estáticos)
- Lógica de negocio en `src/lib/services/`
- Acceso a datos SOLO en `src/lib/repositories/`
- Validaciones Zod en `src/lib/validators/`
- Componentes UI en `src/components/ui/`
- Componentes feature en `src/components/features/[feature]/`
- NUNCA lógica de negocio en componentes React
- NUNCA queries Prisma fuera de repositories
- NUNCA imports de repositorios desde componentes client

## Code Style
- Named exports (no default exports excepto pages)
- Funciones puras siempre que sea posible
- No `any`, no `as` casting sin justificación en comentario
- Error handling explícito: try/catch con tipos de error
- Zod para toda validación de input externo

## Visual
- Dark theme: bg #0A0A0A, gold #C9A84C
- Fonts: Cinzel (títulos), Cormorant Garamond (cuerpo)
- Mobile first, responsive

## Testing
- Unit tests para services y scorer
- Integration tests para API routes
- Ejecutar test del archivo modificado antes de commit

## Git
- Conventional commits: feat/fix/refactor/test/docs
- Un commit por tarea atómica
```

---

## 13. Gestión de Contexto Claude Code

Recomendaciones operativas para cada sesión:

| Acción | Cuándo |
|--------|--------|
| `/clear` | Entre cada tarea del plan |
| `/compact` | Al 50% del contexto o cuando notes degradación |
| `ultrathink` | Tareas 8 y 9 (webhook + report, más complejas) |
| Plan mode | Tareas que tocan > 3 archivos (4, 8, 9) |
| Verificación | Siempre al final: `typecheck` + `lint` + `test` |

**Flujo por tarea:**
1. `/clear`
2. Pegar prompt de la tarea
3. Claude Code ejecuta
4. Verificar criterio de aceptación
5. Commit
6. Siguiente tarea

---

## 14. Variables de Entorno (.env.example)

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/archetype_test?schema=public"

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_VARIANT_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=

# Anthropic
ANTHROPIC_API_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 15. Decisiones Arquitectónicas (ADRs)

### ADR-001: Sin autenticación de usuario
**Decisión:** No implementar auth. El email del checkout identifica al usuario.
**Motivo:** Fricción mínima. El producto es pago único → quiz → informe. No hay dashboard, no hay historial para el usuario.
**Consecuencia:** Si quieren repetir, pagan de nuevo. Aceptable para 1€.

### ADR-002: JSON para answers y report en Session
**Decisión:** Guardar answers y report como JSON en la tabla Session, no en tablas relacionadas.
**Motivo:** Son blobs inmutables que solo se leen como conjunto. No hay queries por pregunta individual ni por campo del report.
**Consecuencia:** No se puede hacer analytics granular por pregunta sin parsear JSON. Si se necesita en el futuro, migrar a tablas.

### ADR-003: Lemon Squeezy overlay checkout
**Decisión:** Usar checkout overlay (popup) en vez de redirect completo.
**Motivo:** Menor fricción, el usuario no pierde contexto. Para 1€ el checkout debe ser instantáneo.
**Consecuencia:** Requiere JS SDK de Lemon Squeezy en el cliente.

### ADR-004: Polling para report status
**Decisión:** Polling cada 2s en /report/[sessionId] en vez de WebSockets o SSE.
**Motivo:** Simplicidad. El webhook + Claude API tardan ~5-15s. Polling con 2s interval es aceptable.
**Consecuencia:** Máximo 7-8 requests antes de obtener el resultado. Carga negligible.

### ADR-005: Claude Sonnet (no Opus) para informes
**Decisión:** Usar claude-sonnet-4-20250514 para generar informes.
**Motivo:** Ratio coste/calidad óptimo. El prompt es estructurado, las respuestas cerradas reducen ambigüedad. Sonnet genera JSON consistente.
**Consecuencia:** Si la calidad no es suficiente, upgrade a Opus sin cambiar código (solo model string).
