'use client'

import { useEffect, useRef, useState } from 'react'
import { HERO_MESSAGES } from '@/lib/data/hero-messages'

type Phase = 'typing' | 'paused' | 'dissolving' | 'waiting'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  size: number
}

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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Populated via ref callbacks on each render; reset when msg changes
  const charRefsArr = useRef<(HTMLSpanElement | null)[]>([])

  const msg = HERO_MESSAGES[msgIdx] ?? ''
  const len = msg.length

  // Reset ref array length for current message (runs in render, before commit)
  charRefsArr.current = Array(len).fill(null)

  // ── Typewriter ────────────────────────────────────────────────
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

  // ── Paused → dissolve ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'paused' || reduced) return
    const id = setTimeout(() => setPhase('dissolving'), 2000)
    return () => clearTimeout(id)
  }, [phase, reduced])

  // ── Canvas particle dissolution ───────────────────────────────
  // Spans are already opacity:0 (React-controlled) when this effect runs,
  // but getBoundingClientRect still returns valid layout positions.
  useEffect(() => {
    if (phase !== 'dissolving') return

    const canvas = canvasRef.current
    if (!canvas) {
      setPhase('waiting')
      return
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.display = 'block'

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      canvas.style.display = 'none'
      setPhase('waiting')
      return
    }

    const particles: Particle[] = []

    charRefsArr.current.forEach((span) => {
      if (!span) return
      const r = span.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: cx + (Math.random() - 0.5) * r.width * 0.85,
          y: cy + (Math.random() - 0.5) * r.height * 0.4,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -(Math.random() * 2.5 + 0.8),
          opacity: Math.random() * 0.5 + 0.5,
          size: Math.random() * 2.2 + 0.4,
        })
      }
    })

    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false

      for (const p of particles) {
        if (p.opacity <= 0.01) continue
        alive = true
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.03
        p.opacity *= 0.98

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240,237,230,${p.opacity.toFixed(3)})`
        ctx.fill()
      }

      if (alive) {
        raf = requestAnimationFrame(tick)
      } else {
        canvas.style.display = 'none'
        setPhase('waiting')
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      canvas.style.display = 'none'
    }
  }, [phase])

  // ── Wait → next message ───────────────────────────────────────
  useEffect(() => {
    if (phase !== 'waiting') return
    const id = setTimeout(() => {
      const next = pickNext(prevIdx.current)
      prevIdx.current = next
      setMsgIdx(next)
      setTypedCount(0)
      setPhase('typing')
    }, 300)
    return () => clearTimeout(id)
  }, [phase])

  // ── Reduced motion: show static ───────────────────────────────
  useEffect(() => {
    if (!reduced) return
    setTypedCount(len)
    setPhase('paused')
  }, [reduced, len])

  // ── Span opacity: fully React-controlled, no DOM manipulation ──
  // 'dissolving' and 'waiting': opacity 0 instantly (hides old msg,
  //  prevents flash of old text before new typewriter starts)
  const spanOpacity = (i: number): number => {
    if (reduced) return 1
    if (phase === 'dissolving' || phase === 'waiting') return 0
    return typedCount > i ? 1 : 0
  }
  const spanTransition = phase === 'dissolving' || phase === 'waiting' ? 'none' : 'opacity 0.04s'

  return (
    <>
      {/* Canvas: fixed over viewport for particle animation */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50,
          display: 'none',
        }}
      />

      <div style={{ textAlign: 'center', width: '100%' }}>
        <h1 className="lp-question" aria-label={msg} style={{ marginBottom: '1.5rem' }}>
          {msg.split('').map((ch, i) => (
            <span
              key={`${msgIdx}-${i}`}
              className="tw-char"
              aria-hidden="true"
              ref={(el) => {
                charRefsArr.current[i] = el
              }}
              style={{
                opacity: spanOpacity(i),
                transition: spanTransition,
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
          className="shimmer"
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(0.78rem, 1.8vw, 0.95rem)',
            color: '#555',
            letterSpacing: '0.03em',
            lineHeight: 1.5,
            maxWidth: '80%',
            margin: '1.5rem auto 0',
          }}
        >
          La mayoría de hombres viven con un arquetipo que no conocen.
        </p>
      </div>
    </>
  )
}
