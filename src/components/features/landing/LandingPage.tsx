'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroScene } from './HeroScene'

gsap.registerPlugin(ScrollTrigger)

// ─── Constants ────────────────────────────────────────────────

const Q_TEXT = '¿TE CONOCES?'
const Q_LEN = Q_TEXT.length

const ARCHETYPES = [
  { id: 'ruler', name: 'EL REY', tall: false, img: '/images/archetypes/ruler.png' },
  { id: 'warrior', name: 'EL GUERRERO', tall: true, img: '/images/archetypes/warrior.png' },
  { id: 'magician', name: 'EL MAGO', tall: false, img: '/images/archetypes/magician.png' },
  { id: 'lover', name: 'EL AMANTE', tall: false, img: '/images/archetypes/lover.png' },
  { id: 'explorer', name: 'EL EXPLORADOR', tall: false, img: '/images/archetypes/explorer.png' },
  { id: 'sage', name: 'EL SABIO', tall: false, img: '/images/archetypes/sage.png' },
  { id: 'creator', name: 'EL CREADOR', tall: false, img: '/images/archetypes/creator.png' },
  { id: 'hero', name: 'EL HÉROE', tall: true, img: '/images/archetypes/hero.png' },
  { id: 'outlaw', name: 'EL REBELDE', tall: false, img: '/images/archetypes/rebel.png' },
  { id: 'jester', name: 'EL BUFÓN', tall: false, img: '/images/archetypes/jester.png' },
  { id: 'caregiver', name: 'EL CUIDADOR', tall: false, img: '/images/archetypes/caregiver.png' },
  { id: 'innocent', name: 'EL INOCENTE', tall: false, img: '/images/archetypes/innocent.png' },
] as const

const CARDS = [
  { src: '/images/cards/howYouLead.png', alt: 'El líder que llevas dentro', amber: false },
  { src: '/images/cards/howLove.png', alt: 'Cómo amas', amber: false },
  { src: '/images/cards/howDestroy.png', alt: 'Cómo destruyes', amber: true },
  { src: '/images/cards/howDestroyYourself.png', alt: 'Cómo te destruyes a ti mismo', amber: false },
] as const

type PhraseAlign = 'left' | 'right' | 'center'

const PHRASES: { text: string; align: PhraseAlign; color: string }[] = [
  { text: 'DETERMINA CÓMO LIDERAS', align: 'left', color: '#FFFFFF' },
  { text: 'CÓMO AMAS', align: 'right', color: '#FFFFFF' },
  { text: 'CÓMO DESTRUYES', align: 'center', color: '#FF8C00' },
  { text: 'Y CÓMO TE DESTRUYES\nA TI MISMO', align: 'center', color: '#888888' },
]

// ─── Types ────────────────────────────────────────────────────

type AnimPhase = 'typing' | 'paused' | 'dissolving' | 'done'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  size: number
}

// ─── Component ────────────────────────────────────────────────

export function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const charRefs = useRef<Array<HTMLSpanElement | null>>(new Array(Q_LEN).fill(null))
  const phrasesRef = useRef<HTMLDivElement>(null)
  const cardStackRef = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLElement>(null)
  const section3Ref = useRef<HTMLElement>(null)
  const section4Ref = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<AnimPhase>('typing')
  const [typedCount, setTypedCount] = useState(0)
  const [reduced, setReduced] = useState(false)

  // Detect capabilities once on mount
  useEffect(() => {
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(r)
    if (r) {
      setTypedCount(Q_LEN)
      setPhase('done')
    }
  }, [])

  // Typewriter: add one char every 100ms
  useEffect(() => {
    if (phase !== 'typing' || reduced) return
    const id = setInterval(() => {
      setTypedCount((c) => {
        if (c >= Q_LEN - 1) {
          clearInterval(id)
          setTimeout(() => setPhase('paused'), 0)
          return Q_LEN
        }
        return c + 1
      })
    }, 100)
    return () => clearInterval(id)
  }, [phase, reduced])

  // After typing: pause 1.5s, then dissolve
  useEffect(() => {
    if (phase !== 'paused') return
    const id = setTimeout(() => setPhase('dissolving'), 1500)
    return () => clearTimeout(id)
  }, [phase])

  // Particle dissolution: letters → canvas particles floating up
  const dissolve = useCallback((): (() => void) | undefined => {
    const canvas = canvasRef.current
    const hero = heroRef.current
    if (!canvas || !hero) return

    canvas.width = hero.offsetWidth
    canvas.height = hero.offsetHeight
    canvas.style.display = 'block'

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const heroRect = hero.getBoundingClientRect()
    const particles: Particle[] = []

    // Spawn particle cluster at each character's position
    charRefs.current.forEach((span) => {
      if (!span) return
      const r = span.getBoundingClientRect()
      const cx = r.left - heroRect.left + r.width / 2
      const cy = r.top - heroRect.top + r.height / 2

      for (let i = 0; i < 18; i++) {
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

    // Fade out the text characters
    charRefs.current.forEach((span) => {
      if (span) span.style.transition = 'opacity 0.15s'
      if (span) span.style.opacity = '0'
    })

    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false

      for (const p of particles) {
        if (p.opacity <= 0) continue
        alive = true
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.03 // accelerate upward (inverted gravity)
        p.opacity -= 0.007

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240,237,230,${Math.max(0, p.opacity)})`
        ctx.fill()
      }

      if (alive) {
        raf = requestAnimationFrame(tick)
      } else {
        canvas.style.display = 'none'
        setPhase('done')
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (phase !== 'dissolving') return
    return dissolve()
  }, [phase, dissolve])

  // GSAP: sections 2, 3, 4
  useEffect(() => {
    if (!section2Ref.current) return

    const ctx = gsap.context(() => {
      // ── Section 2: pinned scroll with stacking cards ──────────
      const phraseList = phrasesRef.current?.querySelectorAll<HTMLElement>('.s2-phrase')
      const cardList = cardStackRef.current?.querySelectorAll<HTMLElement>('.s2-card')
      const phrases = phraseList ? Array.from(phraseList) : []
      const cards = cardList ? Array.from(cardList) : []

      if (phrases.length >= 4 && cards.length >= 4) {
        // Explicit destructure: guarantees non-undefined with strict types
        const [p0, p1, p2, p3] = phrases as [
          HTMLElement,
          HTMLElement,
          HTMLElement,
          HTMLElement,
        ]
        const [c0, c1, c2, c3] = cards as [
          HTMLElement,
          HTMLElement,
          HTMLElement,
          HTMLElement,
        ]
        const rots = [-2, 1, -1, 0] as const

        // Set up initial states
        gsap.set(c0, { y: '0%', rotation: rots[0] })
        gsap.set(c1, { y: '110%', rotation: rots[1] })
        gsap.set(c2, { y: '110%', rotation: rots[2] })
        gsap.set(c3, { y: '110%', rotation: rots[3] })

        if (reduced) {
          gsap.set([p0, p1, p2, p3], { opacity: 1, y: 0 })
          gsap.set(c0, { y: '0%', rotation: rots[0] })
          gsap.set(c1, { y: '0%', rotation: rots[1] })
          gsap.set(c2, { y: '0%', rotation: rots[2] })
          gsap.set(c3, { y: '0%', rotation: rots[3] })
        } else {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section2Ref.current,
              start: 'top top',
              end: '+=300%',
              pin: true,
              scrub: 1.5,
            },
          })

          // Phase 0 → 1
          tl.to(p0, { opacity: 0, y: -30, duration: 0.4 }, 0.05)
            .to(p1, { opacity: 1, y: 0, duration: 0.4 }, 0.25)
            .to(c1, { y: '0%', duration: 0.7, ease: 'power2.out' }, 0.15)

          // Phase 1 → 2
          tl.to(p1, { opacity: 0, y: -30, duration: 0.4 }, 1.05)
            .to(p2, { opacity: 1, y: 0, duration: 0.4 }, 1.25)
            .to(c2, { y: '0%', duration: 0.7, ease: 'power2.out' }, 1.15)

          // Phase 2 → 3
          tl.to(p2, { opacity: 0, y: -30, duration: 0.4 }, 2.05)
            .to(p3, { opacity: 1, y: 0, duration: 0.4 }, 2.25)
            .to(c3, { y: '0%', duration: 0.7, ease: 'power2.out' }, 2.15)
        }
      }

      // ── Section 3: stagger reveal ─────────────────────────────
      const gridItems = gridRef.current?.querySelectorAll('.archetype-item')
      if (gridItems?.length) {
        if (reduced) {
          gsap.set(gridItems, { opacity: 1, scale: 1 })
          gsap.set('.s3-title', { opacity: 1 })
        } else {
          gsap.fromTo(
            '.s3-title',
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: { trigger: section3Ref.current, start: 'top 80%', once: true },
            },
          )

          gsap.to(gridItems, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 78%', once: true },
          })
        }
      }

      // ── Section 4: fade in ────────────────────────────────────
      if (reduced) {
        gsap.set('.s4-inner', { opacity: 1 })
      } else {
        gsap.fromTo(
          '.s4-inner',
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: section4Ref.current, start: 'top 80%', once: true },
          },
        )
      }
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])


  return (
    <div ref={rootRef} className="lp-root">

      {/* ── SECTION 1: The Hook ──────────────────────────── */}
      <section ref={heroRef} className="lp-hero">
        {/* 3D wireframe scene — mounts immediately, reveals after dissolution */}
        <HeroScene visible={phase === 'done' || reduced} />

        <canvas
          ref={canvasRef}
          className="lp-canvas"
          aria-hidden="true"
          style={{ display: 'none' }}
        />

        {/* Top-left serif label */}
        <p className="lp-hero-label">
          <em>Arquetipo</em>
        </p>

        <div className="lp-hero-center">
          {/* Typewriter question */}
          <h1 className="lp-question" aria-label={Q_TEXT}>
            {Q_TEXT.split('').map((ch, i) => (
              <span
                key={i}
                ref={(el) => {
                  charRefs.current[i] = el
                }}
                className="tw-char"
                aria-hidden="true"
                style={{
                  opacity: reduced || typedCount > i ? 1 : 0,
                  transition: 'opacity 0.04s',
                }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
            {/* Blinking cursor — visible only while typing/paused */}
            {(phase === 'typing' || phase === 'paused') && (
              <span className="tw-cursor" aria-hidden="true" />
            )}
          </h1>

        </div>

        {/* Scroll indicator */}
        {(phase === 'done' || reduced) && (
          <div className="lp-scroll-arrow" aria-hidden="true">
            <div className="lp-scroll-line" />
            <div className="lp-scroll-chevron" />
          </div>
        )}
      </section>

      {/* ── SECTION 2: The Tension (pinned) ──────────────── */}
      <section ref={section2Ref} className="lp-s2">
        {/* Left: changing phrases */}
        <div ref={phrasesRef} className="lp-s2-left">
          {PHRASES.map((phrase, i) => (
            <p
              key={i}
              className="s2-phrase"
              style={{
                textAlign: phrase.align,
                color: phrase.color,
              }}
            >
              {phrase.text}
            </p>
          ))}
        </div>

        {/* Right: stacking cards */}
        <div ref={cardStackRef} className="lp-s2-right">
          <div className="lp-card-stack">
            {CARDS.map((card, i) => (
              <div key={i} className="s2-card" style={{ zIndex: i + 1 }}>
                <div className="s2-card-inner">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    quality={80}
                    className="s2-card-img"
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 200px, 280px"
                  />
                  {card.amber && <div className="s2-card-amber" aria-hidden="true" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: The Archetypes ─────────────────────── */}
      <section ref={section3Ref} className="lp-s3">
        <h2 className="s3-title">
          12 FORMAS
          <br />
          DE SER HOMBRE
        </h2>

        <div ref={gridRef} className="lp-archetype-grid">
          {ARCHETYPES.map(({ id, name, tall, img }) => (
            <div
              key={id}
              className={`archetype-item${tall ? ' archetype-item--tall' : ''}`}
            >
              <Image
                src={img}
                alt={name.toLowerCase()}
                fill
                quality={80}
                className="archetype-item-img"
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 580px) 50vw, 25vw"
              />
              <span className="archetype-item-name">{name}</span>
            </div>
          ))}
        </div>

        <p className="s3-footnote">
          <em>Uno de ellos te domina.</em>
        </p>
      </section>

      {/* ── SECTION 4: The CTA ────────────────────────────── */}
      <section ref={section4Ref} className="lp-s4">
        <div className="s4-inner">
          <h2 className="s4-title">DESCÚBRELO</h2>
          <p className="s4-meta">12 preguntas · 3 minutos · Análisis por IA</p>
          <Link href="/quiz" className="s4-btn">
            <span>COMENZAR EL TEST</span>
          </Link>
          <p className="s4-small">El test es gratuito. El informe completo vale 1€.</p>
        </div>

        <p className="s4-foot">
          <em>Arquetipo</em>
        </p>
      </section>
    </div>
  )
}
