'use client'

import { useState, useEffect } from 'react'
import { QUESTIONS } from '@/lib/data/questions'
import type { OptionId } from '@/lib/data/questions'
import { FloatingLogo } from '@/components/ui/FloatingLogo'

interface Answer {
  questionId: number
  optionId: string
}

// ─── Design tokens (matches globals.css) ──────────────────────
const C = {
  void: '#050505',
  surfaceLow: '#1C1B1B',
  surfaceHigh: '#2A2A2A',
  textPrimary: '#F0EDE6',
  textSecondary: '#999999',
  accent: '#FF8C00',
  borderGhost: 'rgba(164, 140, 122, 0.3)',
  borderBright: 'rgba(240, 237, 230, 0.5)',
} as const

type Phase = 'quiz' | 'paywall'

// ─── Paywall ──────────────────────────────────────────────────
function Paywall({ answers }: { answers: Answer[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUnlock() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const data = (await res.json()) as { sessionId?: string; checkoutUrl?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Error al procesar')
      if (!data.checkoutUrl) throw new Error('No se recibió URL de pago')
      window.location.href = data.checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: C.void,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 2rem)',
        fontFamily: 'var(--font-inter), sans-serif',
        position: 'relative',
      }}
    >
      <FloatingLogo />
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          textAlign: 'center',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            color: C.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          TU ARQUETIPO HA SIDO CALCULADO
        </h1>

        {/* Report content card */}
        <div
          style={{
            width: '100%',
            border: `1px solid ${C.borderGhost}`,
            background: C.surfaceLow,
            padding: '2rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <p
            style={{
              fontWeight: 400,
              fontSize: '0.8rem',
              color: C.textSecondary,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Tu informe incluye:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Tu arquetipo dominante y su significado',
              'Arquetipos secundarios que te influyen',
              'Tu sombra: los riesgos que no ves',
              '3 recomendaciones concretas para tu vida',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    background: C.accent,
                    flexShrink: 0,
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: 'clamp(0.88rem, 1.8vw, 1rem)',
                    color: C.textPrimary,
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA button */}
        <button
          onClick={handleUnlock}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1.1rem 2rem',
            border: `1px solid ${C.textPrimary}`,
            background: loading ? C.surfaceLow : 'transparent',
            color: C.textPrimary,
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: '0.82rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: loading ? 'default' : 'pointer',
            transition: 'background 0.1s ease, color 0.1s ease',
            outline: 'none',
            borderRadius: 0,
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            if (loading) return
            const el = e.currentTarget
            el.style.background = C.textPrimary
            el.style.color = C.void
          }}
          onMouseLeave={(e) => {
            if (loading) return
            const el = e.currentTarget
            el.style.background = 'transparent'
            el.style.color = C.textPrimary
          }}
        >
          {loading ? 'PROCESANDO...' : 'DESBLOQUEAR INFORME — 1€'}
        </button>

        {error && (
          <p style={{ color: '#C44D4D', fontSize: '0.82rem', margin: 0 }}>{error}</p>
        )}

        {/* Trust line */}
        <p
          style={{
            fontWeight: 400,
            fontSize: '0.72rem',
            color: '#666666',
            letterSpacing: '0.03em',
            margin: 0,
          }}
        >
          Pago seguro vía Lemon Squeezy · Satisfacción garantizada
        </p>

        {/* Disclaimer */}
        <p
          style={{
            fontWeight: 400,
            fontSize: '0.7rem',
            color: '#555555',
            margin: 0,
          }}
        >
          El test es gratuito. Solo el informe detallado tiene coste.
        </p>
      </div>
    </main>
  )
}

// ─── Quiz ─────────────────────────────────────────────────────
export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>('quiz')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedOption, setSelectedOption] = useState<OptionId | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [visible, setVisible] = useState(true)

  const question = QUESTIONS[currentIndex]
  const progress = (currentIndex / QUESTIONS.length) * 100
  const questionNum = String(currentIndex + 1).padStart(2, '0')
  const totalNum = String(QUESTIONS.length).padStart(2, '0')

  function handleSelect(optionId: OptionId) {
    if (isTransitioning || selectedOption !== null || !question) return

    setSelectedOption(optionId)
    setIsTransitioning(true)

    const newAnswers = [...answers, { questionId: question.id, optionId }]

    setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        if (currentIndex >= QUESTIONS.length - 1) {
          setAnswers(newAnswers)
          setPhase('paywall')
        } else {
          setAnswers(newAnswers)
          setCurrentIndex((i) => i + 1)
          setSelectedOption(null)
          setIsTransitioning(false)
          setVisible(true)
        }
      }, 200)
    }, 600)
  }

  useEffect(() => {
    setVisible(true)
  }, [currentIndex])

  if (phase === 'paywall') {
    return <Paywall answers={answers} />
  }

  if (!question) return null

  return (
    <main
      style={{
        minHeight: '100vh',
        background: C.void,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-inter), sans-serif',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <FloatingLogo />
      {/* ── Progress bar ─────────────────────────────────────── */}
      <div style={{ width: '100%', height: '2px', background: C.surfaceLow, flexShrink: 0 }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: C.accent,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          maxWidth: '640px',
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 2rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        {/* Question number */}
        <div
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 10vw, 5rem)',
            color: C.accent,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {questionNum}
          <span style={{ color: C.surfaceHigh, fontSize: '0.45em', marginLeft: '0.15em' }}>
            /{totalNum}
          </span>
        </div>

        {/* Scenario + question */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(0.75rem, 1.6vw, 0.85rem)',
              color: C.textSecondary,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {question.scenario}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-space), sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.4rem, 3.5vw, 2.25rem)',
              color: C.textPrimary,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {question.question}
          </h1>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((option) => {
            const isSelected = selectedOption === option.id
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={isTransitioning || selectedOption !== null}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  width: '100%',
                  padding: '1rem 1.5rem',
                  background: C.surfaceLow,
                  border: `1px solid ${isSelected ? C.accent : C.borderGhost}`,
                  cursor: isTransitioning || selectedOption !== null ? 'default' : 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.15s, background 0.15s',
                  outline: 'none',
                  borderRadius: 0,
                }}
                onMouseEnter={(e) => {
                  if (isTransitioning || selectedOption !== null) return
                  const el = e.currentTarget
                  el.style.borderColor = C.borderBright
                  el.style.background = C.surfaceHigh
                }}
                onMouseLeave={(e) => {
                  if (isSelected) return
                  const el = e.currentTarget
                  el.style.borderColor = C.borderGhost
                  el.style.background = C.surfaceLow
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-space), sans-serif',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    color: isSelected ? C.accent : C.textSecondary,
                    flexShrink: 0,
                    transition: 'color 0.15s',
                  }}
                >
                  {option.id.toUpperCase()}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(0.88rem, 1.8vw, 1rem)',
                    color: isSelected ? C.accent : C.textPrimary,
                    lineHeight: 1.5,
                    transition: 'color 0.15s',
                  }}
                >
                  {option.text}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
