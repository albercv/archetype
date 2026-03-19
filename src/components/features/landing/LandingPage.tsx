'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Static data ──────────────────────────────────────────────

const ARCHETYPES = [
  { id: 'ruler', name: 'El Rey', numeral: 'I' },
  { id: 'warrior', name: 'El Guerrero', numeral: 'II' },
  { id: 'magician', name: 'El Mago', numeral: 'III' },
  { id: 'lover', name: 'El Amante', numeral: 'IV' },
  { id: 'explorer', name: 'El Explorador', numeral: 'V' },
  { id: 'sage', name: 'El Sabio', numeral: 'VI' },
  { id: 'creator', name: 'El Creador', numeral: 'VII' },
  { id: 'hero', name: 'El Héroe', numeral: 'VIII' },
  { id: 'outlaw', name: 'El Rebelde', numeral: 'IX' },
  { id: 'jester', name: 'El Bufón', numeral: 'X' },
  { id: 'caregiver', name: 'El Cuidador', numeral: 'XI' },
  { id: 'innocent', name: 'El Inocente', numeral: 'XII' },
] as const

const PHRASES = [
  'Cada hombre lleva un arquetipo dominante.',
  'Determina cómo lideras, amas y luchas.',
  'La mayoría nunca descubre el suyo.',
  'Tú estás a punto de hacerlo.',
] as const

// ─── Particle system ──────────────────────────────────────────

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  size: number
  opacityDir: number
  opacitySpeed: number
}

function createParticles(w: number, h: number): Particle[] {
  return Array.from({ length: 60 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.4 + 0.05,
    size: Math.random() * 1.5 + 0.4,
    opacityDir: Math.random() > 0.5 ? 1 : -1,
    opacitySpeed: Math.random() * 0.002 + 0.001,
  }))
}

// ─── Component ────────────────────────────────────────────────

export function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const phrasesRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [reduced, setReduced] = useState(false)

  // Detect device capabilities once on mount
  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches)
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // ── Canvas particles ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particles = createParticles(canvas.width, canvas.height)
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.opacity += p.opacityDir * p.opacitySpeed
        if (p.opacity > 0.45 || p.opacity < 0.04) p.opacityDir *= -1
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${p.opacity})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    raf = requestAnimationFrame(tick)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reduced])

  // ── Custom cursor ───────────────────────────────────────────
  useEffect(() => {
    if (isMobile || reduced) return
    const cursor = cursorRef.current
    if (!cursor) return

    let mx = 0,
      my = 0,
      cx = 0,
      cy = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      cursor.style.opacity = '1'
    }

    const onLinkEnter = () => cursor.classList.add('cursor--link')
    const onLinkLeave = () => cursor.classList.remove('cursor--link')

    const animate = () => {
      cx += (mx - cx) * 0.1
      cy += (my - cy) * 0.1
      cursor.style.transform = `translate(${cx - 10}px, ${cy - 10}px)`
      raf = requestAnimationFrame(animate)
    }

    const links = document.querySelectorAll('a, button')
    links.forEach((l) => {
      l.addEventListener('mouseenter', onLinkEnter)
      l.addEventListener('mouseleave', onLinkLeave)
    })

    raf = requestAnimationFrame(animate)
    document.addEventListener('mousemove', onMove)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      links.forEach((l) => {
        l.removeEventListener('mouseenter', onLinkEnter)
        l.removeEventListener('mouseleave', onLinkLeave)
      })
    }
  }, [isMobile, reduced])

  // ── GSAP animations ─────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // prefers-reduced-motion: reveal everything immediately
      if (reduced) {
        gsap.set(
          [
            '.char',
            '.l-hero__subtitle',
            '.hero-cta-wrap',
            '.l-section-title',
            '.phrase',
            '.archetype-card',
            '.cta-final-wrap',
          ],
          { opacity: 1, y: 0, clipPath: 'none', scale: 1 },
        )
        return
      }

      // Title: per-character clip-path reveal
      const chars = titleRef.current?.querySelectorAll('.char')
      if (chars?.length) {
        gsap.to(chars, {
          opacity: 1,
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.45,
          stagger: 0.04,
          ease: 'power2.out',
          delay: 0.4,
        })
      }

      // Subtitle: fade up after title completes (~2.1s)
      gsap.to('.l-hero__subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        delay: 2.1,
      })

      // CTA: fade up after subtitle
      gsap.to('.hero-cta-wrap', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        delay: 2.55,
      })

      // Section title
      gsap.fromTo(
        '.l-section-title',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.l-archetypes', start: 'top 80%', once: true },
        },
      )

      // Phrases: stagger on scroll
      phrasesRef.current?.querySelectorAll('.phrase').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        })
      })

      // Archetype cards: stagger on scroll
      const cards = cardsRef.current?.querySelectorAll('.archetype-card')
      if (cards?.length) {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 78%', once: true },
        })
      }

      // CTA final section
      gsap.to('.cta-final-wrap', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%', once: true },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])

  // ── Magnetic button ─────────────────────────────────────────
  const onMagMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.28,
      y: (e.clientY - r.top - r.height / 2) * 0.28,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const onMagLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) return
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
  }

  // ── 3D card tilt ─────────────────────────────────────────────
  const onTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return
    const c = e.currentTarget
    const r = c.getBoundingClientRect()
    gsap.to(c, {
      rotateX: -((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 7,
      rotateY: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 7,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 600,
    })
  }

  const onTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1,0.4)',
    })
  }

  return (
    <div ref={rootRef} className={`landing-root${isMobile ? '' : ' landing-desktop'}`}>
      {/* Custom cursor — desktop only */}
      {!isMobile && (
        <div
          ref={cursorRef}
          className="custom-cursor"
          aria-hidden="true"
          style={{ opacity: 0 }}
        />
      )}

      {/* ── SECTION 1: Hero ──────────────────────────────── */}
      <section className="l-hero">
        <canvas ref={canvasRef} className="l-canvas" aria-hidden="true" />
        <div className="l-grain" aria-hidden="true" />
        <div className="l-glow" aria-hidden="true" />

        <div className="l-hero__inner">
          <p className="l-eyebrow">Test Psicológico · XII Arquetipos</p>
          <div className="l-rule" aria-hidden="true" />

          <h1
            ref={titleRef}
            className="l-hero__title"
            aria-label="Descubre Tu Arquetipo"
          >
            {'Descubre Tu Arquetipo'.split('').map((ch, i) => (
              <span
                key={i}
                className="char"
                aria-hidden="true"
                style={{ willChange: 'clip-path, opacity' }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h1>

          <div className="l-rule l-rule--wide" aria-hidden="true" />

          <p className="l-hero__subtitle">12 preguntas. Tu verdad. Sin filtros.</p>

          <div className="hero-cta-wrap">
            <Link
              href="/quiz"
              className="l-cta l-cta--pulse"
              onMouseMove={onMagMove}
              onMouseLeave={onMagLeave}
            >
              Comenzar el Test
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Scroll phrases ─────────────────────── */}
      <section className="l-phrases" ref={phrasesRef}>
        {PHRASES.map((phrase, i) => (
          <p key={i} className="phrase">
            {phrase}
          </p>
        ))}
      </section>

      {/* ── SECTION 3: Archetypes grid ────────────────────── */}
      <section className="l-archetypes">
        <h2 className="l-section-title">
          12 Arquetipos.
          <br />
          ¿Cuál domina en ti?
        </h2>

        <div ref={cardsRef} className="l-grid">
          {ARCHETYPES.map(({ id, name, numeral }) => (
            <div
              key={id}
              className="archetype-card"
              onMouseMove={onTilt}
              onMouseLeave={onTiltLeave}
            >
              <span className="archetype-numeral" aria-hidden="true">
                {numeral}
              </span>
              <span className="archetype-name">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: CTA final ──────────────────────────── */}
      <section ref={ctaRef} className="l-cta-section">
        <div className="cta-final-wrap">
          <h2 className="l-cta-title">
            3 minutos.
            <br />
            Tu verdad.
          </h2>
          <Link
            href="/quiz"
            className="l-cta l-cta--pulse"
            onMouseMove={onMagMove}
            onMouseLeave={onMagLeave}
          >
            Comenzar el Test
          </Link>
          <p className="l-cta-sub">Análisis personalizado por IA · Sin registro</p>
        </div>
      </section>
    </div>
  )
}
