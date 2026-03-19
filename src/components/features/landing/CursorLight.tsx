'use client'

import { useEffect, useRef, useState } from 'react'

export function CursorLight() {
  const [mounted, setMounted] = useState(false)
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth <= 768) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const el = elRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      el.style.setProperty('--mx', `${e.clientX}px`)
      el.style.setProperty('--my', `${e.clientY}px`)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        background:
          'radial-gradient(circle 380px at var(--mx, 50%) var(--my, 50%), rgba(240,237,230,0.07), transparent)',
      }}
    />
  )
}
