'use client'

import { useState, useEffect } from 'react'
import { QUESTIONS } from '@/lib/data/questions'
import type { OptionId } from '@/lib/data/questions'

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
  textSecondary: '#666666',
  accent: '#FF8C00',
  borderGhost: 'rgba(164, 140, 122, 0.3)',
  borderBright: 'rgba(240, 237, 230, 0.5)',
} as const

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedOption, setSelectedOption] = useState<OptionId | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [visible, setVisible] = useState(true)
  const [done, setDone] = useState(false)

  const question = QUESTIONS[currentIndex]
  const progress = ((currentIndex) / QUESTIONS.length) * 100
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
          console.log('Quiz completado', newAnswers)
          setAnswers(newAnswers)
          setDone(true)
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

  // Fade in on mount and after each question change
  useEffect(() => {
    setVisible(true)
  }, [currentIndex])

  if (done) {
    return (
      <main style={{ minHeight: '100vh', background: C.void, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: C.textSecondary, fontFamily: 'var(--font-inter), sans-serif', fontWeight: 300 }}>
          <p style={{ color: C.accent, fontFamily: 'var(--font-space), sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            TEST COMPLETADO
          </p>
          <p style={{ fontSize: '0.85rem' }}>Procesando tus respuestas…</p>
        </div>
      </main>
    )
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
      }}
    >
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
              fontWeight: 300,
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
                  background: isSelected ? C.surfaceLow : C.surfaceLow,
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
                {/* Option letter */}
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
                {/* Option text */}
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
