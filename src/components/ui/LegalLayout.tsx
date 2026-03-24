import { FloatingLogo } from './FloatingLogo'
import { Footer } from './Footer'

const pStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter), sans-serif',
  fontWeight: 400,
  fontSize: '0.95rem',
  color: '#AAAAAA',
  lineHeight: 1.7,
  margin: '0 0 0.75rem',
}

export const legal = {
  p: pStyle,
  section: { marginBottom: '2.5rem' } as React.CSSProperties,
  h2: {
    fontFamily: 'var(--font-space), sans-serif',
    fontWeight: 700,
    fontSize: '0.78rem',
    color: '#F0EDE6',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    margin: '0 0 1rem',
  } as React.CSSProperties,
  ul: {
    margin: '0 0 0.75rem',
    paddingLeft: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  } as React.CSSProperties,
  li: {
    ...pStyle,
    margin: 0,
  },
  a: {
    color: '#FF8C00',
    textDecoration: 'none',
  } as React.CSSProperties,
}

export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', position: 'relative' }}>
      <FloatingLogo />
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: 'clamp(5rem, 10vw, 7rem) clamp(1.5rem, 5vw, 3rem) 4rem',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-space), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: '#F0EDE6',
            letterSpacing: '-0.02em',
            margin: '0 0 3rem',
          }}
        >
          {title}
        </h1>
        {children}
      </div>
      <Footer />
    </div>
  )
}
