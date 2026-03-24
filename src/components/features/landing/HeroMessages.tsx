'use client'

import { useEffect, useRef, useState } from 'react'
import { HERO_MESSAGES } from '@/lib/data/hero-messages'

type Phase = 'typing' | 'paused' | 'dissolving' | 'waiting'

function pickNext(exclude: number): number {
  const len = HERO_MESSAGES.length
  if (len <= 1) return 0
  let idx = Math.floor(Math.random() * (len - 1))
  if (idx >= exclude) idx++
  return idx
}

export function HeroMessages({ reduced }: { reduced: boolean }) {
  const [msgIdx, setMsgIdx] = useState(() =>
    Math.floor(Math.random() * HERO_MESSAGES.length),
  )
  const [phase, setPhase] = useState<Phase>('typing')
  const [typedCount, setTypedCount] = useState(0)
  const prevIdx = useRef(msgIdx)

  const msg = HERO_MESSAGES[msgIdx] ?? ''
  const len = msg.length

  // Typewriter
  useEffect(() => {
    if (phase !== 'typing' || reduced) return
    setTypedCount(0)
    const id = setInterval(() => {
      setTypedCount((c) => {
        if (c >= len - 1) {
          clearInterval(id)
          setTimeout(() => setPhase('paused'), 0)
          return len
        }
        return c + 1
      })
    }, 80)
    return () => clearInterval(id)
  }, [phase, msgIdx, reduced, len])

  // Paused → dissolve
  useEffect(() => {
    if (phase !== 'paused' || reduced) return
    const id = setTimeout(() => setPhase('dissolving'), 2000)
    return () => clearTimeout(id)
  }, [phase, reduced])

  // Dissolve → wait
  useEffect(() => {
    if (phase !== 'dissolving') return
    // last char finishes at: delay(len-1)*0.03s + 0.3s transition
    const ms = (len - 1) * 30 + 350
    const id = setTimeout(() => setPhase('waiting'), ms)
    return () => clearTimeout(id)
  }, [phase, len])

  // Wait → next message
  useEffect(() => {
    if (phase !== 'waiting') return
    const id = setTimeout(() => {
      const next = pickNext(prevIdx.current)
      prevIdx.current = next
      setMsgIdx(next)
      setTypedCount(0)
      setPhase('typing')
    }, 500)
    return () => clearTimeout(id)
  }, [phase])

  // Reduced motion: skip to done
  useEffect(() => {
    if (!reduced) return
    setTypedCount(len)
    setPhase('paused')
  }, [reduced, len])

  const isDissolving = phase === 'dissolving'

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h1 className="lp-question" aria-label={msg} style={{ marginBottom: '1.5rem' }}>
        {msg.split('').map((ch, i) => (
          <span
            key={`${msgIdx}-${i}`}
            className="tw-char"
            aria-hidden="true"
            style={{
              opacity: isDissolving ? 0 : reduced || typedCount > i ? 1 : 0,
              transition: isDissolving
                ? `opacity 0.3s ease ${i * 0.03}s`
                : 'opacity 0.04s',
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
        {(phase === 'typing' || phase === 'paused') && !reduced && (
          <span className="tw-cursor" aria-hidden="true" />
        )}
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(0.78rem, 1.8vw, 0.95rem)',
          color: '#555',
          letterSpacing: '0.03em',
          lineHeight: 1.5,
          maxWidth: '420px',
          margin: '0 auto',
        }}
      >
        La mayoría de hombres viven con un arquetipo que no conocen.
      </p>
    </div>
  )
}
