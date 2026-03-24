'use client'

import { use, useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface ArchetypeEntry {
  id: string
  name: string
  score: number
  description: string
}

interface Report {
  dominantArchetype: ArchetypeEntry
  secondaryArchetypes: ArchetypeEntry[]
  shadow: {
    description: string
    risks: string[]
  }
  analysis: string
  recommendations: string[]
}

const C = {
  void: '#050505',
  surfaceLow: '#1C1B1B',
  textPrimary: '#F0EDE6',
  textSecondary: '#999999',
  textMuted: '#666666',
  accent: '#FF8C00',
  borderGhost: 'rgba(164, 140, 122, 0.3)',
} as const

// ── Loading screen ───────────────────────────────────────────
function LoadingScreen() {
  const [scanPos, setScanPos] = useState(0)

  useEffect(() => {
    let pos = 0
    const id = setInterval(() => {
      pos = (pos + 1) % 101
      setScanPos(pos)
    }, 20)
    return () => clearInterval(id)
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        background: C.void,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '2rem',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-space), sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          color: C.textPrimary,
          letterSpacing: '0.1em',
          margin: 0,
        }}
      >
        GENERANDO TU INFORME
      </p>
      <div
        style={{
          width: 'min(400px, 80vw)',
          height: '2px',
          background: C.surfaceLow,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${scanPos}%`,
            width: '40%',
            height: '100%',
            background: C.accent,
            transform: 'translateX(-50%)',
            transition: 'left 0.02s linear',
          }}
        />
      </div>
      <p
        style={{
          fontWeight: 400,
          fontSize: '0.85rem',
          color: C.textSecondary,
          margin: 0,
        }}
      >
        Analizando tus respuestas...
      </p>
    </main>
  )
}

// ── Timeout / error screen ────────────────────────────────────
function TimeoutScreen() {
  const [hovered, setHovered] = useState(false)

  return (
    <main
      style={{
        minHeight: '100vh',
        background: C.void,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '2rem',
        fontFamily: 'var(--font-inter), sans-serif',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-space), sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
          color: '#F0EDE6',
          letterSpacing: '0.1em',
          margin: 0,
        }}
      >
        NO HEMOS PODIDO GENERAR TU INFORME
      </p>
      <p
        style={{
          fontWeight: 400,
          fontSize: '0.9rem',
          color: '#999',
          margin: 0,
          maxWidth: '400px',
          lineHeight: 1.6,
        }}
      >
        Estamos trabajando en ello. Recibirás tu informe por email en las próximas horas.
      </p>
      <Link
        href="/"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily: 'var(--font-space), sans-serif',
          fontWeight: 700,
          fontSize: '0.78rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          padding: '0.75rem 2rem',
          border: `1px solid ${C.borderGhost}`,
          borderRadius: 0,
          background: hovered ? C.textPrimary : 'transparent',
          color: hovered ? C.void : C.textPrimary,
          transition: 'background 0.15s, color 0.15s',
          display: 'inline-block',
        }}
      >
        VOLVER AL INICIO
      </Link>
    </main>
  )
}

// ── Report view ──────────────────────────────────────────────
function ReportView({ report }: { report: Report }) {
  const maxScore = report.dominantArchetype.score

  return (
    <main
      style={{
        minHeight: '100vh',
        background: C.void,
        fontFamily: 'var(--font-inter), sans-serif',
        color: C.textPrimary,
      }}
    >
      {/* 1. HEADER */}
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 6vw, 4rem)',
          borderBottom: `1px solid ${C.borderGhost}`,
        }}
      >
        <p
          style={{
            fontWeight: 400,
            fontSize: '0.75rem',
            color: C.textSecondary,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          TU ARQUETIPO
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            color: C.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: '0 0 0.5rem',
          }}
        >
          {report.dominantArchetype.name.toUpperCase()}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: C.accent,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.01em',
            margin: '0 0 1.5rem',
          }}
        >
          {maxScore}%
        </p>
        <p
          style={{
            fontWeight: 400,
            fontSize: '1rem',
            color: '#AAAAAA',
            maxWidth: '600px',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {report.dominantArchetype.description}
        </p>
      </section>

      {/* 2. ARQUETIPOS SECUNDARIOS */}
      {report.secondaryArchetypes.length > 0 && (
        <section style={{ borderBottom: `1px solid ${C.borderGhost}` }}>
          <div style={{ padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 6vw, 4rem) 1rem' }}>
            <p
              style={{
                fontWeight: 400,
                fontSize: '0.75rem',
                color: C.textSecondary,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              TAMBIÉN ERES
            </p>
          </div>
          {report.secondaryArchetypes.map((arch, i) => (
            <div
              key={arch.id}
              style={{
                padding: 'clamp(1.25rem, 3vw, 2rem) clamp(1.5rem, 6vw, 4rem)',
                borderBottom: i < report.secondaryArchetypes.length - 1 ? `1px solid ${C.borderGhost}` : 'none',
                background: i % 2 === 0 ? C.void : C.surfaceLow,
                display: 'flex',
                gap: '2rem',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flexShrink: 0, minWidth: '8rem' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-space), sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                    color: C.textPrimary,
                    margin: '0 0 0.25rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {arch.name.toUpperCase()}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-space), sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: C.accent,
                    fontVariantNumeric: 'tabular-nums',
                    margin: 0,
                  }}
                >
                  {arch.score}%
                </p>
              </div>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: '0.9rem',
                  color: C.textSecondary,
                  lineHeight: 1.6,
                  margin: 0,
                  flex: 1,
                }}
              >
                {arch.description}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* 3. LA SOMBRA */}
      <section
        style={{
          padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 6vw, 4rem)',
          borderLeft: `2px solid ${C.accent}`,
          borderBottom: `1px solid ${C.borderGhost}`,
          marginLeft: 'clamp(1.5rem, 6vw, 4rem)',
          paddingLeft: '2rem',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            color: C.textPrimary,
            letterSpacing: '0.05em',
            margin: '0 0 1rem',
          }}
        >
          TU SOMBRA
        </h2>
        <p
          style={{
            fontWeight: 400,
            fontSize: '0.95rem',
            color: '#AAAAAA',
            lineHeight: 1.7,
            margin: '0 0 1.25rem',
            maxWidth: '640px',
          }}
        >
          {report.shadow.description}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {report.shadow.risks.map((risk, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  background: C.accent,
                  flexShrink: 0,
                  marginTop: '0.35rem',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: 400, fontSize: '0.9rem', color: C.textPrimary, lineHeight: 1.5 }}>
                {risk}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. ANÁLISIS */}
      <section
        style={{
          padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 6vw, 4rem)',
          borderBottom: `1px solid ${C.borderGhost}`,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            color: C.textPrimary,
            letterSpacing: '0.05em',
            margin: '0 0 1.5rem',
          }}
        >
          LECTURA CRUDA
        </h2>
        <div
          style={{
            background: C.surfaceLow,
            border: `1px solid ${C.borderGhost}`,
            padding: '2rem',
            maxWidth: '680px',
          }}
        >
          <p
            style={{
              fontWeight: 400,
              fontSize: '1.1rem',
              color: '#AAAAAA',
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {report.analysis}
          </p>
        </div>
      </section>

      {/* 5. RECOMENDACIONES */}
      <section
        style={{
          padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 6vw, 4rem)',
          borderBottom: `1px solid ${C.borderGhost}`,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            color: C.textPrimary,
            letterSpacing: '0.05em',
            margin: '0 0 2rem',
          }}
        >
          QUÉ HACER
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {report.recommendations.map((rec, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 'clamp(1rem, 4vw, 3rem)',
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-space), sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  color: C.accent,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                  flexShrink: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: '1rem',
                  color: C.textPrimary,
                  lineHeight: 1.7,
                  margin: 0,
                  paddingTop: '0.5rem',
                  flex: 1,
                }}
              >
                {rec}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER */}
      <section
        style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 6vw, 4rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <p style={{ fontWeight: 400, fontSize: '0.7rem', color: C.textMuted, margin: 0 }}>
          Este informe ha sido generado por IA basándose en tus respuestas.
        </p>
        <div style={{ height: '1px', background: C.borderGhost }} />
        <Link
          href="/quiz"
          style={{
            color: C.accent,
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
          }}
        >
          ¿Quieres repetir el test?
        </Link>
      </section>
    </main>
  )
}

// ── Page ─────────────────────────────────────────────────────
export default function ReportPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  const [status, setStatus] = useState<string | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    async function poll() {
      if (Date.now() - startTimeRef.current > 60000) {
        setStatus('TIMEOUT')
        if (intervalRef.current) clearInterval(intervalRef.current)
        return
      }

      try {
        const res = await fetch(`/api/reports/${sessionId}`)
        if (!res.ok) {
          setStatus('FAILED')
          if (intervalRef.current) clearInterval(intervalRef.current)
          return
        }
        const data = (await res.json()) as { status: string; report: Report | null }
        setStatus(data.status)
        if (data.status === 'COMPLETED' && data.report) {
          setReport(data.report)
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
        if (data.status === 'FAILED') {
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      } catch {
        // keep polling on network error
      }
    }

    void poll()
    intervalRef.current = setInterval(() => void poll(), 2000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [sessionId])

  if (status === 'TIMEOUT' || status === 'FAILED') return <TimeoutScreen />
  if (status === 'COMPLETED' && report) return <ReportView report={report} />
  return <LoadingScreen />
}
