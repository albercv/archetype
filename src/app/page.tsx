import Link from 'next/link'

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          pointerEvents: 'none',
          opacity: 0.4,
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '640px' }}>
        {/* Decorative line */}
        <div
          style={{
            width: '60px',
            height: '1px',
            backgroundColor: 'var(--gold-primary)',
            margin: '0 auto 2rem',
            opacity: 0.6,
          }}
        />

        <h1
          style={{
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 700,
            color: 'var(--gold-primary)',
            letterSpacing: '0.05em',
            lineHeight: 1.2,
            marginBottom: '1.5rem',
          }}
        >
          Descubre Tu Arquetipo
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            color: 'var(--text-secondary)',
            letterSpacing: '0.08em',
            marginBottom: '1rem',
          }}
        >
          12 preguntas. Tu verdad. Sin filtros.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.8,
            marginBottom: '3rem',
            maxWidth: '480px',
            margin: '0 auto 3rem',
          }}
        >
          Basado en los 12 arquetipos de Jung y Moore–Gillette. Un análisis profundo de tu psique
          masculina, generado por IA.
        </p>

        <Link
          href="/quiz"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '0.9rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--bg-primary)',
            backgroundColor: 'var(--gold-primary)',
            padding: '1rem 2.5rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget
            target.style.backgroundColor = 'var(--gold-light)'
            target.style.boxShadow = '0 0 30px rgba(201, 168, 76, 0.3)'
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget
            target.style.backgroundColor = 'var(--gold-primary)'
            target.style.boxShadow = 'none'
          }}
        >
          Comenzar el Test
        </Link>

        {/* Decorative line bottom */}
        <div
          style={{
            width: '60px',
            height: '1px',
            backgroundColor: 'var(--gold-primary)',
            margin: '3rem auto 0',
            opacity: 0.6,
          }}
        />
      </div>
    </main>
  )
}
