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
