'use client'

import { useEffect, useState } from 'react'
import { LandingPage } from '@/components/features/landing/LandingPage'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  useEffect(() => {
    if (window.innerWidth <= 768) return
    setMounted(true)
    const handler = (e: MouseEvent) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <>
      {mounted && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 2,
            background: `radial-gradient(circle 400px at ${mouseX}px ${mouseY}px, rgba(240,237,230,0.06), transparent)`,
          }}
        />
      )}
      <LandingPage />
    </>
  )
}
