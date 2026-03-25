'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroMessages } from './HeroMessages'
import { FloatingLogo } from '@/components/ui/FloatingLogo'
import { Footer } from '@/components/ui/Footer'

gsap.registerPlugin(ScrollTrigger)

// ─── Constants ────────────────────────────────────────────────

const ARCHETYPES = [
  {
    id: 'ruler',
    name: 'EL REY',
    tall: false,
    img: '/images/archetypes/ruler.png',
    shortDescription: 'Lidera con visión y orden. Su sombra es la tiranía.',
  },
  {
    id: 'warrior',
    name: 'EL GUERRERO',
    tall: true,
    img: '/images/archetypes/warrior.png',
    shortDescription: 'Actúa con disciplina y coraje. Su sombra es la violencia sin causa.',
  },
  {
    id: 'magician',
    name: 'EL MAGO',
    tall: false,
    img: '/images/archetypes/magician.png',
    shortDescription: 'Transforma la realidad con conocimiento. Su sombra es la manipulación.',
  },
  {
    id: 'lover',
    name: 'EL AMANTE',
    tall: false,
    img: '/images/archetypes/lover.png',
    shortDescription: 'Conecta con pasión y sensibilidad. Su sombra es la obsesión.',
  },
  {
    id: 'explorer',
    name: 'EL EXPLORADOR',
    tall: false,
    img: '/images/archetypes/explorer.png',
    shortDescription: 'Busca libertad y nuevos caminos. Su sombra es la huida permanente.',
  },
  {
    id: 'sage',
    name: 'EL SABIO',
    tall: false,
    img: '/images/archetypes/sage.png',
    shortDescription: 'Persigue la verdad y el entendimiento. Su sombra es la parálisis por análisis.',
  },
  {
    id: 'creator',
    name: 'EL CREADOR',
    tall: false,
    img: '/images/archetypes/creator.png',
    shortDescription: 'Construye lo que no existe. Su sombra es el perfeccionismo destructivo.',
  },
  {
    id: 'hero',
    name: 'EL HÉROE',
    tall: true,
    img: '/images/archetypes/hero.png',
    shortDescription: 'Supera obstáculos y protege. Su sombra es la arrogancia del salvador.',
  },
  {
    id: 'outlaw',
    name: 'EL REBELDE',
    tall: false,
    img: '/images/archetypes/rebel.png',
    shortDescription: 'Rompe lo que no funciona. Su sombra es la destrucción sin propósito.',
  },
  {
    id: 'jester',
    name: 'EL BUFÓN',
    tall: false,
    img: '/images/archetypes/jester.png',
    shortDescription: 'Revela verdades con humor. Su sombra es la evasión de lo serio.',
  },
  {
    id: 'caregiver',
    name: 'EL CUIDADOR',
    tall: false,
    img: '/images/archetypes/caregiver.png',
    shortDescription: 'Protege y sirve a otros. Su sombra es el martirio y autoanulación.',
  },
  {
    id: 'innocent',
    name: 'EL INOCENTE',
    tall: false,
    img: '/images/archetypes/innocent.png',
    shortDescription: 'Cree en el bien y la pureza. Su sombra es la negación de la realidad.',
  },
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

// ─── Component ────────────────────────────────────────────────

export function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const phrasesRef = useRef<HTMLDivElement>(null)
  const cardStackRef = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLElement>(null)
  const section3Ref = useRef<HTMLElement>(null)
  const section4Ref = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const [reduced, setReduced] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setIsMobile(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  // CTA fade-in after 1s
  useEffect(() => {
    const id = setTimeout(() => setCtaVisible(true), 1000)
    return () => clearTimeout(id)
  }, [])

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
        const [p0, p1, p2, p3] = phrases as [HTMLElement, HTMLElement, HTMLElement, HTMLElement]
        const [c0, c1, c2, c3] = cards as [HTMLElement, HTMLElement, HTMLElement, HTMLElement]
        const rots = [-2, 1, -1, 0] as const

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

          tl.to(p0, { opacity: 0, y: -30, duration: 0.4 }, 0.05)
            .to(p1, { opacity: 1, y: 0, duration: 0.4 }, 0.25)
            .to(c1, { y: '0%', duration: 0.7, ease: 'power2.out' }, 0.15)

          tl.to(p1, { opacity: 0, y: -30, duration: 0.4 }, 1.05)
            .to(p2, { opacity: 1, y: 0, duration: 0.4 }, 1.25)
            .to(c2, { y: '0%', duration: 0.7, ease: 'power2.out' }, 1.15)

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
      <section className="lp-hero">
        <FloatingLogo />

        {/* Top-left serif label */}
        <p className="lp-hero-label">
          <em>Arquetipo</em>
        </p>

        <div className="lp-hero-center">
          <HeroMessages reduced={reduced} />
        </div>

        {/* Hero CTA — fades in after 1s */}
        <div
          className="lp-hero-cta"
          style={{ opacity: ctaVisible || reduced ? 1 : 0 }}
          aria-hidden={!ctaVisible && !reduced}
        >
          <Link href="/quiz" className="lp-hero-cta-btn">
            <span>DESCUBRE TU ARQUETIPO</span>
          </Link>
          <p className="lp-hero-cta-meta">3 minutos · 12 preguntas · Gratis</p>
        </div>

        {/* Scroll indicator */}
        <div className="lp-scroll-arrow" aria-hidden="true">
          <div className="lp-scroll-line" />
          <div className="lp-scroll-chevron" />
        </div>
      </section>

      {/* ── SECTION 2: The Tension (pinned) ──────────────── */}
      <section ref={section2Ref} className="lp-s2">
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
          {ARCHETYPES.map(({ id, name, tall, img, shortDescription }) => (
            <div
              key={id}
              className={`archetype-item${tall ? ' archetype-item--tall' : ''}${expandedId === id ? ' archetype-item--expanded' : ''}`}
              onClick={
                isMobile
                  ? () => setExpandedId((prev) => (prev === id ? null : id))
                  : undefined
              }
              style={isMobile ? { cursor: 'pointer' } : undefined}
            >
              {/* Image, name, and tooltip — all inside overflow-hidden inner */}
              <div className="archetype-item-inner">
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

                {/* Tooltip: CSS hover on desktop, tap-toggle on mobile */}
                <div className="archetype-tooltip">
                  <p className="archetype-tooltip-name">{name}</p>
                  <p className="archetype-tooltip-desc">{shortDescription}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p className="s3-footnote shimmer">
            <em>Uno de ellos te domina.</em>
          </p>
        </div>
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

      <Footer />
    </div>
  )
}
