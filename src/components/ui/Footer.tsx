import Link from 'next/link'

export function Footer() {
  return (
    <footer
      style={{
        background: '#0D0D0D',
        borderTop: '1px solid rgba(164, 140, 122, 0.3)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        <Link href="/aviso-legal" className="footer-link">
          Aviso Legal
        </Link>
        <Link href="/politica-privacidad" className="footer-link">
          Privacidad
        </Link>
        <Link href="/politica-cookies" className="footer-link">
          Cookies
        </Link>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontWeight: 400,
          fontSize: '11px',
          color: '#444',
          margin: 0,
        }}
      >
        © 2026 Archetypex
      </p>
    </footer>
  )
}
