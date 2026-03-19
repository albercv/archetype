'use client'

import { useEffect } from 'react'
import { LandingPage } from '@/components/features/landing/LandingPage'

export default function HomePage() {
  useEffect(() => {
    if (window.innerWidth <= 768) return

    const light = document.createElement('div')
    light.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      transition: background 0.1s;
    `
    document.body.appendChild(light)

    const onMove = (e: MouseEvent) => {
      light.style.background = `radial-gradient(circle 400px at ${e.clientX}px ${e.clientY}px, rgba(240,237,230,0.07), transparent)`
    }

    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      light.remove()
    }
  }, [])

  return <LandingPage />
}
