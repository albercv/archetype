'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [hiding, setHiding] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie-banner-dismissed')) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    setHiding(true)
    setTimeout(() => {
      localStorage.setItem('cookie-banner-dismissed', '1')
      setVisible(false)
    }, 300)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#1C1B1B',
        borderTop: '1px solid rgba(164, 140, 122, 0.3)',
        padding: '16px 24px',
        opacity: hiding ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div className="cookie-banner-inner">
        <p
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 400,
            fontSize: '13px',
            color: '#999',
            margin: 0,
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          Este sitio utiliza únicamente cookies técnicas necesarias para su funcionamiento.{' '}
          <Link
            href="/politica-cookies"
            style={{
              color: '#FF8C00',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            Más información
          </Link>
        </p>
        <button
          className="cookie-banner-btn"
          onClick={dismiss}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            padding: '8px 16px',
            border: '1px solid #F0EDE6',
            background: btnHovered ? '#F0EDE6' : 'transparent',
            color: btnHovered ? '#050505' : '#F0EDE6',
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: 0,
            transition: 'background 0.1s ease, color 0.1s ease',
            outline: 'none',
            flexShrink: 0,
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
