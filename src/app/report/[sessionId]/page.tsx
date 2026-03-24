'use client'

import { use, useEffect, useState, useRef, type CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FloatingLogo } from '@/components/ui/FloatingLogo'

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

// ── Responsive CSS ─────────────────────────────────────────────
const REPORT_CSS = `
.rpt-hero {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  border-bottom: 1px solid rgba(164,140,122,0.3);
}
.rpt-hero-img {
  position: relative;
  height: 50vh;
  flex-shrink: 0;
  overflow: hidden;
}
.rpt-hero-text {
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.rpt-secondary-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(164,140,122,0.3);
}
.rpt-secondary-img {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}
.rpt-analysis {
  display: block;
  padding: 3rem 1.5rem;
  border-top: 1px solid rgba(164,140,122,0.3);
  border-bottom: 1px solid rgba(164,140,122,0.3);
  position: relative;
  overflow: hidden;
}
.rpt-analysis-deco {
  display: none;
}
.rpt-analysis-col {
  width: 100%;
  position: relative;
  z-index: 1;
}
.rpt-rec-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(164,140,122,0.3);
}
.rpt-rec-num-wrap {
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .rpt-hero {
    flex-direction: row;
    min-height: 100vh;
  }
  .rpt-hero-img {
    width: 40%;
    min-height: 80vh;
    height: auto;
    align-self: stretch;
  }
  .rpt-hero-text {
    width: 60%;
    padding: clamp(3rem, 8vw, 6rem) clamp(2rem, 5vw, 4rem);
  }
  .rpt-secondary-item {
    gap: 2rem;
    padding: 2rem clamp(2rem, 5vw, 4rem);
  }
  .rpt-secondary-img {
    width: 120px;
    height: 120px;
  }
  .rpt-analysis {
    display: flex;
    align-items: flex-start;
    padding: clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem);
  }
  .rpt-analysis-deco {
    display: block;
    position: absolute;
    left: clamp(2rem, 5vw, 4rem);
    bottom: -1.5rem;
    font-family: var(--font-space), sans-serif;
    font-weight: 700;
    font-size: 11rem;
    color: #1C1B1B;
    line-height: 1;
    letter-spacing: -0.04em;
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }
  .rpt-analysis-col {
    width: 60%;
    margin-left: auto;
  }
  .rpt-rec-item {
    flex-direction: row;
    align-items: flex-start;
    gap: 2.5rem;
    padding: 2rem clamp(2rem, 5vw, 4rem);
  }
  .rpt-rec-num-wrap {
    width: 80px;
  }
}
`

// ── FadeIn wrapper ────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode
  delay?: number
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Animated score counter ────────────────────────────────────
function ScoreCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  const started = useRef(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setCount(target)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true
          const dur = 1500
          let t0: number | null = null
          const tick = (ts: number) => {
            if (!t0) t0 = ts
            const p = Math.min((ts - t0) / dur, 1)
            setCount(Math.floor(p * target))
            if (p < 1) requestAnimationFrame(tick)
            else setCount(target)
          }
          requestAnimationFrame(tick)
          obs.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{count}%</span>
}

// ── Archetype image with fallback ─────────────────────────────
function ArchImg({
  id,
  name,
  fill,
  sizes,
}: {
  id: string
  name: string
  fill?: boolean
  sizes?: string
}) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: C.surfaceLow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-news)',
            fontStyle: 'italic',
            color: C.textMuted,
            fontSize: '0.75rem',
            textAlign: 'center',
            padding: '0.5rem',
          }}
        >
          {name}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={`/images/archetypes/${id}.png`}
      alt={name}
      {...(fill ? { fill: true } : { width: 120, height: 120 })}
      style={{ objectFit: 'cover' }}
      sizes={sizes ?? '(max-width: 768px) 100vw, 40vw'}
      onError={() => setErrored(true)}
    />
  )
}

// ── Loading screen ────────────────────────────────────────────
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

// ── Hero section ──────────────────────────────────────────────
function HeroSection({ archetype }: { archetype: ArchetypeEntry }) {
  return (
    <section className="rpt-hero">
      {/* image panel */}
      <div className="rpt-hero-img">
        <ArchImg id={archetype.id} name={archetype.name} fill sizes="(max-width: 768px) 100vw, 40vw" />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(5,5,5,0.3)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '1px',
            background: C.borderGhost,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* text panel */}
      <div className="rpt-hero-text">
        <FadeIn>
          <p
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              fontSize: '0.72rem',
              color: '#666',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: '0 0 1rem',
            }}
          >
            Tu arquetipo dominante
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2.75rem, 8vw, 6rem)',
              color: C.textPrimary,
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              margin: '0 0 1rem',
            }}
          >
            {archetype.name.toUpperCase()}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: C.accent,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              margin: '0 0 2rem',
            }}
          >
            <ScoreCounter target={archetype.score} />
          </p>
          <p
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              fontSize: '1rem',
              color: '#AAAAAA',
              lineHeight: 1.7,
              maxWidth: '500px',
              margin: 0,
            }}
          >
            {archetype.description}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ── Secondary archetypes ──────────────────────────────────────
function SecondarySection({ archetypes }: { archetypes: ArchetypeEntry[] }) {
  if (!archetypes.length) return null
  return (
    <section style={{ borderBottom: `1px solid ${C.borderGhost}` }}>
      <FadeIn>
        <div
          style={{
            padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 4rem) 1.5rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontWeight: 700,
              fontSize: '0.72rem',
              color: '#666',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            También eres
          </p>
        </div>
      </FadeIn>

      {archetypes.map((arch, i) => (
        <FadeIn key={arch.id} delay={i * 0.1}>
          <div
            className="rpt-secondary-item"
            style={{ background: i % 2 === 0 ? C.void : '#0D0D0D' }}
          >
            <div
              className="rpt-secondary-img"
              style={{ border: `1px solid ${C.borderGhost}` }}
            >
              <ArchImg
                id={arch.id}
                name={arch.name}
                fill
                sizes="(max-width: 768px) 80px, 120px"
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '1rem',
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-news)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                    color: C.textPrimary,
                  }}
                >
                  {arch.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-space), sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: C.accent,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {arch.score}%
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  fontSize: '0.9rem',
                  color: C.textSecondary,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {arch.description}
              </p>
            </div>
          </div>
        </FadeIn>
      ))}
    </section>
  )
}

// ── Shadow section ────────────────────────────────────────────
function ShadowSection({ shadow }: { shadow: Report['shadow'] }) {
  return (
    <section
      style={{
        background: C.surfaceLow,
        borderLeft: `2px solid ${C.accent}`,
        padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 3rem)',
      }}
    >
      <FadeIn>
        <p
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: '0.72rem',
            color: '#666',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: '0 0 0.75rem',
          }}
        >
          Tu sombra
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.3rem, 3vw, 1.75rem)',
            color: C.textPrimary,
            letterSpacing: '-0.01em',
            margin: '0 0 1.25rem',
          }}
        >
          LO QUE NO VES
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            fontSize: '1rem',
            color: '#AAAAAA',
            lineHeight: 1.7,
            maxWidth: '680px',
            margin: '0 0 2rem',
          }}
        >
          {shadow.description}
        </p>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {shadow.risks.map((risk, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  background: C.accent,
                  flexShrink: 0,
                  marginTop: '0.45rem',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  fontSize: '0.95rem',
                  color: C.textPrimary,
                  lineHeight: 1.5,
                }}
              >
                {risk}
              </span>
            </li>
          ))}
        </ul>
      </FadeIn>
    </section>
  )
}

// ── Analysis section ──────────────────────────────────────────
function AnalysisSection({ analysis }: { analysis: string }) {
  return (
    <section className="rpt-analysis">
      <span className="rpt-analysis-deco" aria-hidden="true">
        04
      </span>
      <div className="rpt-analysis-col">
        <FadeIn>
          <p
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontWeight: 700,
              fontSize: '0.72rem',
              color: '#666',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: '0 0 0.75rem',
            }}
          >
            Lectura cruda
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.3rem, 3vw, 1.75rem)',
              color: C.textPrimary,
              letterSpacing: '-0.01em',
              margin: '0 0 1.5rem',
            }}
          >
            ASÍ TE VEO
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              fontSize: '1.1rem',
              color: '#AAAAAA',
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {analysis}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ── Recommendations section ───────────────────────────────────
function RecsSection({ recommendations }: { recommendations: string[] }) {
  return (
    <section style={{ borderBottom: `1px solid ${C.borderGhost}` }}>
      <FadeIn>
        <div
          style={{
            padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 4rem) 1.5rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontWeight: 700,
              fontSize: '0.72rem',
              color: '#666',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: '0 0 0.5rem',
            }}
          >
            Acción
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.3rem, 3vw, 1.75rem)',
              color: C.textPrimary,
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            QUÉ HACER AHORA
          </h2>
        </div>
      </FadeIn>

      {recommendations.map((rec, i) => (
        <FadeIn key={i} delay={i * 0.15}>
          <div className="rpt-rec-item">
            <div className="rpt-rec-num-wrap">
              <span
                style={{
                  fontFamily: 'var(--font-space), sans-serif',
                  fontWeight: 700,
                  fontSize: '3rem',
                  color: C.accent,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  display: 'block',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
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
        </FadeIn>
      ))}
    </section>
  )
}

// ── Report footer ─────────────────────────────────────────────
function ReportFooter() {
  const [hovered, setHovered] = useState(false)

  return (
    <footer
      style={{
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '1.5rem',
      }}
    >
      <div style={{ width: '100%', height: '1px', background: C.borderGhost }} />
      <p
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontWeight: 400,
          fontSize: '0.75rem',
          color: '#555',
          margin: 0,
          maxWidth: '400px',
        }}
      >
        Este informe ha sido generado por IA basándose en tus respuestas.
      </p>
      <Link
        href="/quiz"
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
          transition: 'background 0.1s, color 0.1s',
          display: 'inline-block',
        }}
      >
        REPETIR EL TEST
      </Link>
      <p
        style={{
          fontFamily: 'var(--font-news)',
          fontStyle: 'italic',
          fontSize: '0.8rem',
          color: '#333',
          margin: 0,
        }}
      >
        ArchetypeX
      </p>
    </footer>
  )
}

// ── Report view ───────────────────────────────────────────────
function ReportView({ report }: { report: Report }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: REPORT_CSS }} />
      <main
        style={{
          minHeight: '100vh',
          background: C.void,
          fontFamily: 'var(--font-inter), sans-serif',
          color: C.textPrimary,
        }}
      >
        <HeroSection archetype={report.dominantArchetype} />
        <SecondarySection archetypes={report.secondaryArchetypes} />
        <ShadowSection shadow={report.shadow} />
        <AnalysisSection analysis={report.analysis} />
        <RecsSection recommendations={report.recommendations} />
        <ReportFooter />
      </main>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────
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

  const screen =
    status === 'TIMEOUT' || status === 'FAILED' ? <TimeoutScreen /> :
    status === 'COMPLETED' && report ? <ReportView report={report} /> :
    <LoadingScreen />

  return (
    <div style={{ position: 'relative' }}>
      <FloatingLogo />
      {screen}
    </div>
  )
}
